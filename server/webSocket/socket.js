// socket.js

import { Server } from "socket.io";
import httpServer from "./server"; // Importieren Sie Ihren HTTP-Server aus der Express-Anwendung
import ChatMessage from "./models/ChatMessage.js";

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
        const message = new ChatMessage({
          content,
          channel: channelId,
          sender,
          senderImage,
          createdAt: new Date(),
        });
        await message.save();

        io.to(`channel_${channelId}`).emit("newMessage", message);
        socket.broadcast.emit("newMessageNotification", channelId);
      } catch (error) {
        console.error("Fehler beim Senden der Nachricht:", error);
      }
    }
  );

  // Fügen Sie hier weitere Socket.IO-Ereignisse hinzu, die Sie benötigen.
});

export default io;
