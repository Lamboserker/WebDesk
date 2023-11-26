import express from "express";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
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

// show all workspaces
router.get("/list", async (res) => {
  try {
    const workspaces = await Workspace.find();
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
    console.error("Fehler beim Abrufen des Workspace-Status (Fehlercode 2):", error);
    res.status(500).json({ msg: "Fehler beim Abrufen des Workspace-Status (Fehlercode 3)", error: error.message });
  }
});



router.get("/:workspaceId", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findById(workspaceId);
    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen des Workspaces");
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
