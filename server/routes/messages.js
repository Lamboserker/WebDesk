import express from "express";
import Message from "../models/ChatMessage.js";
import Channel from "../models/Channel.js";
import Workspace from "../models/Workspace.js";
const router = express.Router();

// send a message to a channel
router.post("/send", async (req, res) => {
  try {
    const { content, channelId, senderId } = req.body; // Assuming senderId is passed in the request

    // Validate request data (e.g., check if content is not empty)
    if (!content || !channelId || !senderId) {
      return res
        .status(400)
        .send("Missing message content, channel, or sender information");
    }

    // Create a new message
    const newMessage = new Message({
      content,
      channel: channelId,
      sender: senderId,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
// get all messages for a channel
router.get("/messages", async (req, res) => {
  try {
    const { workspaceId, channelId } = req.query;

    // Assuming Workspace model has a channels array containing channel IDs
    const workspace = await Workspace.findById(workspaceId).populate("channels");
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }

    // Check if the channel ID is in the workspace's channels array
    const channelExistsInWorkspace = workspace.channels.some(
      channel => channel._id.toString() === channelId
    );

    if (!channelExistsInWorkspace) {
      return res
        .status(404)
        .send("Channel not found in the specified workspace");
    }

    // Retrieve messages for the channel
    const messages = await Message.find({ channel: channelId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// get the history of a channel
router.get("/history", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { startDate, endDate } = req.query; // Optional date range filters

    // Find messages for the channel, possibly within a date range
    let query = { channel: channelId };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const messages = await Message.find(query).sort({ createdAt: -1 }); // Sorted by newest first
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;
