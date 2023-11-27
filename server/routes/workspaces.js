import express from "express";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Channel from "../models/Channel.js";
const router = express.Router();

// create a Workspace
router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner = req.user.id; // User ID aus dem JWT-Token
    const newWorkspace = new Workspace({
      name,
      description,
      owner,
      members: [owner],
    });

    const savedWorkspace = await newWorkspace.save();

    // Aktualisieren des User-Modells
    await User.findByIdAndUpdate(owner, {
      $push: { workspaces: savedWorkspace._id },
    });

    res.status(201).json(savedWorkspace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Erstellen des Workspaces");
  }
});

//show all members of the workspace
router.get("/users", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findById(workspaceId);
    const members = workspace.members;
    const users = await User.find({ _id: { $in: members } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Mitglieder");
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
router.get("/channels", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Invalid workspaceId");
    }
    const channels = await Channel.find({ workspace: workspaceId });
    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Create a channel within a workspace
router.post("/create-channel", async (req, res) => {
  try {
    const workspaceId = req.body.workspaceId;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send("Invalid workspaceId");
    }

    const newChannel = new Channel({
      name,
      workspace: workspaceId,
    });

    const savedChannel = await newChannel.save();
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
      const channelId = req.params.channelId;
      const { message } = req.body;

      // Ensure the channelId is valid
      if (!mongoose.Types.ObjectId.isValid(channelId)) {
        return res.status(400).send("Invalid channelId");
      }

      // Logic to send a message in a channel
      // Placeholder logic - update with actual implementation
      res.json({ message: "Nachricht gesendet" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

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
