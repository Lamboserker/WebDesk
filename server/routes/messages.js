import express from "express";
import Message from "../models/ChatMessage.js";
import Auth from "../middleware/Auth.js";
const router = express.Router();

// send a message to a channel
router.post("/:workspaceId/send", Auth, async (req, res) => {
  console.log(req.body);
  try {
    const { content, channelId } = req.body;
    const senderId = req.user.id;

    // Separate validation for each field
    if (!content) {
      return res.status(400).send("Message content is missing");
    }
    if (!channelId) {
      return res.status(400).send("Channel ID is missing");
    }
    if (!senderId) {
      return res.status(400).send("Sender ID is missing");
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

// Get all messages for a specific channel
router.get("/:channelId/messages", async (req, res) => {
  try {
    const { channelId } = req.params;

    // Retrieve messages for the channel
    const messages = await Message.find({ channel: channelId }).sort({
      createdAt: -1,
    });
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
