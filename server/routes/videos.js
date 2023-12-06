import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { get } from "mongoose";

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

// POST /api/video/create-room
router.post("/create-room", async (req, res) => {
  try {
    const token = process.env.VIDEOSDK_SECRET_KEY;
    const result = await createMeeting({ token }); // Ihre Funktion zum Erstellen eines Meetings

    if (result.roomId) {
      res.json({ roomId: result.roomId });
    } else {
      res.status(400).send("Fehler beim Erstellen des Raums");
    }
  } catch (error) {
    console.error("Fehler bei der Erstellung des Videochat-Raums", error);
    res.status(500).send("Interner Serverfehler");
  }
});

//
router.post("/create-meeting", (req, res) => {
  const { token, region } = req.body;
  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ region }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
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
    // Hole die Channel-ID, die mit der Meeting-ID verknüpft ist
    const associatedChannelId = await getChannelIdByMeetingId(meetingId);

    // Vergleiche die Channel-IDs
    if (associatedChannelId === channelId) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error("Fehler bei der Validierung des Meetings:", error);
    res.status(500).send("Interner Serverfehler");
  }
});

export default router;
