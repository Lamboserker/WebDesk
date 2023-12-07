import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import Channel from "../models/Channel.js";
import Auth from "../middleware/Auth.js";
const router = express.Router();

//
router.get("/", (req, res) => {
  res.send("Hello World!");
});

//
router.get("/get-token", (req, res) => {
  console.log("get-Token");
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

  const options = { expiresIn: "10m", algorithm: "HS256" };
  try {
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };

    const token = jwt.sign(payload, SECRET_KEY, options);
    res.json({ token });
  } catch (error) {
    console.log("get-tokenError :", error.message);
    res.send(error.message);
  }
});

router.post("/create-meeting/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  const { token, region } = req.body;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel nicht gefunden");
    }

    if (channel.activeMeetingId) {
      // An active meeting already exists
      return res.json({ meetingId: channel.activeMeetingId });
    } else {
      // Create a new meeting
      const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
      const options = {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ region }),
      };

      const response = await fetch(url, options);
      const result = await response.json();

      if (result.meetingId) {
        channel.activeChat = result.meetingId;
        await channel.save();
        res.json({ meetingId: result.meetingId });
      } else {
        res.status(400).send("Fehler beim Erstellen des Meetings");
      }
    }
  } catch (error) {
    console.error("Fehler bei der Erstellung/Prüfung des Meetings", error);
    res.status(500).send("Interner Serverfehler");
  }
});

router.post("/validate-meeting/:meetingId", async (req, res) => {
  const token = req.headers.authorization;
  const meetingId = req.params.meetingId;
  const { channelId } = req.body;

  // Prüfe, ob alle erforderlichen Daten vorhanden sind
  if (!token || !channelId) {
    return res.status(400).send("Token und Channel-ID erforderlich");
  }

  try {
    // Check if there's an active chat in the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel nicht gefunden");
    }

    // Check if the active chat in the channel matches the meeting ID
    if (channel.activeMeetingId && channel.activeMeetingId.toString() === meetingId) {
      res.json({
        valid: true,
        autoJoin: true,
        activeChatId: channel.activeChat,
      });
    } else {
      res.json({ valid: false, autoJoin: false });
    }
  } catch (error) {
    console.error("Fehler bei der Validierung des Meetings:", error);
    res.status(500).send("Interner Serverfehler");
  }
});

// POST /api/video/end-meeting
// Ends the meeting and updates the channel status
// This is called when the user leaves the meeting
router.post("/end-meeting/:channelId", async (req, res) => {
  const channelId = req.params.channelId;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send("Channel nicht gefunden");
    }

    channel.activeChat = null;
    await channel.save();

    res.json({ message: "Meeting beendet und Status aktualisiert" });
  } catch (error) {
    console.error("Fehler beim Beenden des Meetings", error);
    res.status(500).send("Interner Serverfehler");
  }
});

export default router;
