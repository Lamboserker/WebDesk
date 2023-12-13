import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import ChatMessage from "../models/ChatMessage.js";
import path from "path";
import fs from "fs";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "workspaceImages"); // Ihr Zielverzeichnis
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    console.log(
      "Original file name:",
      file.originalname,
      "Extension:",
      extension
    );
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

// create a Workspace
router.post("/create", upload.single("workspaceImages"), async (req, res) => {
  try {
    const owner = req.user.id; // User ID aus dem JWT-Token

    // Create a new instance of the Workspace model
    const workspace = new Workspace({
      name: req.body.name,
      description: req.body.description,
      image: req.file.path, // Pfad des hochgeladenen Bildes
      owner: owner, // Verwenden Sie hier `owner` statt `req.body.owner`, es sei denn, die Logik erfordert etwas anderes
      members: [owner],
      channels: [],
      chatMessages: [],
    });

    // Save the new workspace instance
    const savedWorkspace = await workspace.save();

    // Aktualisieren des User-Modells
    await User.findByIdAndUpdate(owner, {
      $push: { workspaces: savedWorkspace._id },
    });

    res.status(201).json(savedWorkspace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Erstellen des Workspaces: " + error.message);
  }
});


//show all members of the workspace
router.get("/:workspaceId/users", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    if (!workspaceId) {
      return res.status(400).send("Workspace ID fehlt");
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Ungültige Workspace ID");
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).send("Workspace nicht gefunden");
    }

    if (workspace.members.length === 0) {
      return res.status(404).send("Keine Mitglieder im Workspace");
    }

    const users = await User.find({ _id: { $in: workspace.members } });

    res.json(users);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      console.error("Datenbankfehler:", error);
      return res
        .status(500)
        .send("Datenbankfehler beim Abrufen der Mitglieder");
    }
    console.error("Serverfehler:", error);
    res.status(500).send("Serverfehler beim Abrufen der Mitglieder");
  }
});

// show all workspaces where the user is a member
router.get("/list", async (req, res) => {
  try {
    // Stellen Sie sicher, dass der Benutzer authentifiziert ist
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Nicht authentifiziert" });
    }

    const userId = req.user.id;
    const workspaces = await Workspace.find({ members: userId });
    res.json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Workspaces");
  }
});

router.get("/workspace-status", async (req, res) => {
  console.log(req.user.id);
  try {
    // Stellen Sie sicher, dass der Benutzer authentifiziert ist
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Nicht authentifiziert" });
    }

    const userId = req.user.id;
    const workspace = await Workspace.findOne({ members: userId });

    // Gibt true zurück, wenn ein Workspace gefunden wurde, in dem der Benutzer Mitglied ist
    res.json({ hasWorkspace: !!workspace });
  } catch (error) {
    console.error(
      "Fehler beim Abrufen des Workspace-Status (Fehlercode 2):",
      error
    );
    res.status(500).json({
      msg: "Fehler beim Abrufen des Workspace-Status (Fehlercode 3)",
      error: error.message,
    });
  }
});

// delete a workspace

router.delete("/delete", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    await Workspace.findByIdAndDelete(workspaceId);
    res.json({ message: `Workspace ${workspaceId} erfolgreich gelöscht` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Löschen des Workspaces");
  }
});

// Display Workspace channels
router.get("/:workspaceId/channels", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Invalid workspaceId");
    }

    const workspace = await Workspace.findById(workspaceId).populate(
      "channels"
    );
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }

    res.json(workspace.channels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// create a channel within a workspace
router.post("/:workspaceId/create-channel", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Invalid workspaceId");
    }

    const newChannel = new Channel({
      name,
      messages: [],
      workspaceId: workspaceId,
    });

    const savedChannel = await newChannel.save();
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    workspace.channels.push(savedChannel._id);
    await workspace.save();

    res.status(201).json(savedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Erstellen des Channels");
  }
});

// Add member to a channel
router.post("/:workspaceId/channel/:channelId/add-member", async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { memberId } = req.body;

    // Ensure the channelId is valid
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).send("Invalid channelId");
    }

    // Logic to add member to channel, e.g., updating the channel document
    // Placeholder logic - update with actual implementation
    res.json({ message: "Mitglied hinzugefügt" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Send message in a channel
router.post(
  "/:workspaceId/channel/:channelId/send-message",
  async (req, res) => {
    try {
      const { channelId } = req.params;
      const { message, senderId, senderImage } = req.body; // Angenommen, senderId wird vom Frontend gesendet

      const newMessage = new ChatMessage({
        content: message,
        channel: channelId,
        sender: senderId,
        senderImage: senderImage,
      });
      await newMessage.save();

      res.json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).send("Fehler beim Senden der Nachricht");
    }
  }
);

// Get messages from a channel
router.get("/:workspaceId/channel/:channelId/messages", async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await ChatMessage.find({ channel: channelId }).populate(
      "sender",
      "name"
    );
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Nachrichten");
  }
});

// Delete a channel
router.delete(
  "/api/workspaces/:workspaceId/delete/:channelId",
  async (req, res) => {
    try {
      const channelId = req.params.channelId;

      if (!mongoose.Types.ObjectId.isValid(channelId)) {
        return res.status(400).send("Invalid channelId");
      }

      await Channel.findByIdAndDelete(channelId);
      res.json({ message: `Channel ${channelId} erfolgreich gelöscht` });
    } catch (error) {
      console.error(error);
      res.status(500).send("Fehler beim Löschen des Channels");
    }
  }
);

export default router;
