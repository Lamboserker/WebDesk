// socket.js

import { Server } from "socket.io";
import httpServer from "./server"; // Importieren Sie Ihren HTTP-Server aus der Express-Anwendung

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Ein Benutzer hat sich verbunden");

  socket.on("joinChannel", ({ channelId }) => {
    socket.join(`channel_${channelId}`);
  });

  socket.on(
    "sendMessage",
    async ({ channelId, content, sender, senderImage }) => {
      try {
        // Hier können Sie Ihre Nachrichtenverarbeitung durchführen und die Nachricht an andere Benutzer senden.
        // Zum Beispiel können Sie die Nachricht in der Datenbank speichern und dann an die entsprechende Channel-Gruppe senden.

        io.to(`channel_${channelId}`).emit("newMessage", {
          channelId,
          content,
          sender,
          senderImage,
          createdAt: new Date(),
        });

        // Senden Sie auch Benachrichtigungen an andere Benutzer, wenn erforderlich.
      } catch (error) {
        console.error("Fehler beim Senden der Nachricht:", error);
      }
    }
  );

  // Fügen Sie hier weitere Socket.IO-Ereignisse hinzu, die Sie benötigen.
});

export default io;
