import express from 'express';
import Channel from '../models/Channel.js';
const router = express.Router();
import mongoose from'mongoose';



//display Workspace channels

router.get('/:workspaceId/channels', async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    // Check if workspaceId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).send('Invalid workspaceId');
    }
    const channels = await Channel.find({ workspace: workspaceId });
    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



//create a channel
router.post('/create-channel', async (req, res) => {
  try {
   const {name, workspaceId} = req.body;
   const userId = req.user.id; // User ID aus dem JWT-Token
   
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


//Mitglieder hinzufügen 
router.post('/channel/:channelId/add-member', (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { memberId } = req.body;
    // Logik zum Hinzufügen eines Mitglieds zu einem Channel
    res.json({ message: "Mitglied hinzugefügt" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


//Nachricht im Channel senden 
router.post('/channel/:channelId/send-message', (req, res) => {
  try {
    const channelId = req.params.channelId;
    const { message } = req.body;
    // Logik zum Senden einer Nachricht in einem Channel
    res.json({ message: "Nachricht gesendet" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Anzeigen aller Kanäle, die zu einem bestimmten Workspace gehören
router.get('/workspace/:workspaceId/channels', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const channels = await Channel.find({ workspace: workspaceId });
    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Channel löschen
router.delete('/delete/:channelId', (req, res) => {
  // Logik zum Löschen eines Channels
});

export default router;
