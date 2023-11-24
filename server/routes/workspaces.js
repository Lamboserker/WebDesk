import express from "express";
const router = express.Router();
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
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

// show all workspaces
router.get("/list", async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Workspaces");
  }
});

router.get("/workspace-status", async (req, res) => {
  try {
    const user = req.user;
    const workspace = await Workspace.findOne({ members: user._id });
    res.json({ hasWorkspace: !!workspace });
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen des Workspace-Status");
  }
});

// delete a workspace
router.delete("/delete/:workspaceId", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    await Workspace.findByIdAndDelete(workspaceId);
    res.json({ message: `Workspace ${workspaceId} erfolgreich gelöscht` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Löschen des Workspaces");
  }
});

export default router;
