import express from "express";
import mongoose from "mongoose";
import Channel from "../models/Channel.js";

const router = express.Router();

// Route, um die Meeting ID für einen bestimmten Channel zu erhalten
router.get("/:channelId/meetingId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);

    if (channel && channel.activeMeetingId) {
      res.json({ meetingId: channel.activeMeetingId });
    } else {
      // Keine Meeting ID vorhanden, optional: eine neue erstellen
      res.json({ meetingId: null });
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//add a meetingId for a channel
router.put("/:channelId/addMeeting", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { meetingId } = req.body;

    // Finden und aktualisieren des Channels mit der neuen Meeting-ID
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { activeMeetingId: meetingId },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).send("Channel nicht gefunden");
    }

    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).send("Serverfehler: " + error.message);
  }
});

export default router;
