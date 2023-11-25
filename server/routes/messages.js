import express from 'express';
const router = express.Router();

// Nachricht senden
router.post('/send', (req, res) => {
  // Logik zum Senden einer Nachricht
});

// Nachrichten für einen Channel empfangen, der zu einem bestimmten Workspace gehört
router.get('/workspace/:workspaceId/channel/:channelId/messages', async (req, res) => {
  try {
    const { channelId } = req.params;
    // Stellen Sie sicher, dass der Kanal zum angegebenen Workspace gehört
    const channel = await Channel.findById(channelId);
    if (!channel || channel.workspace.toString() !== req.params.workspaceId) {
      return res.status(404).send("Channel not found in the workspace");
    }
    const messages = await Message.find({ channel: channelId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// Nachrichten-Historie für einen Channel anzeigen
router.get('/history/:channelId', (req, res) => {
  // Logik zur Anzeige der Nachrichten-Historie
});

export default router;
