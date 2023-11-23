import express from 'express';
const router = express.Router();
import Workspace from '../models/Workspace.js'; // Passen Sie den Pfad an Ihr Modell an


// Workspace erstellen
router.post('/create', async (req, res) => {
  try {
    const { name, description, owner } = req.body;

    const newWorkspace = new Workspace({
      name,
      description,
      owner // Angenommen, dies ist die ID des Benutzers, der den Workspace erstellt
    });

    const savedWorkspace = await newWorkspace.save();
    res.status(201).json(savedWorkspace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Erstellen des Workspaces");
  }
});

// Alle Workspaces anzeigen
router.get('/list', async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Workspaces");
  }
});


router.get('/workspace-status', async (req, res) => {
  try {
    const user = req.user;
    const workspace = await Workspace.findOne({ members: user._id });
    res.json({ hasWorkspace:!!workspace });
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen des Workspace-Status");
  }
});


// Workspace löschen
router.delete('/delete/:workspaceId', async (req, res) => {
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
