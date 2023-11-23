import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();
import Channel from '../models/Channel.js'; // Passen Sie den Pfad an Ihr Modell an
//Channel erstellen
router.post('/create-channel', async (req, res) => {
  try {
    const { name } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Token aus dem Header extrahieren

    // Verifizieren des Tokens und Extrahieren der Benutzer-ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // Erstellen eines neuen Channel-Objekts
    const newChannel = new Channel({
      name,
      createdBy: userId
    });

    // Speichern des Channel-Objekts in der Datenbank
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

// Alle Channels anzeigen
router.get('/api/channels', async (req, res) => {
  try {
    // Logik zum Abrufen der Channel-Daten
    res.json(channels); // Sendet die abgerufenen Channels als Antwort
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
