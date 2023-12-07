import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import messageRoutes from "./routes/messages.js";
import workspaceRoutes from "./routes/workspaces.js";
import channelRoutes from "./routes/channels.js";
import auth from "./middleware/Auth.js";
import authGoogleRoutes from "./routes/google0auth.js";
import ChatMessage from "./models/ChatMessage.js"; // Importieren Sie Ihr ChatMessage-Modell
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// __dirname in ES-Modulen emulieren
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/workspaces", auth, workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/google0auth", authGoogleRoutes);

// Statischen Ordner einrichten
app.use("/profileImage", express.static(path.join(__dirname, "profileImage")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
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
          senderImage: senderImage,
          createdAt: new Date(),
        });
        await message.save();

        io.to(`channel_${channelId}`).emit("newMessage", message);
      } catch (error) {
        console.error("Fehler beim Senden der Nachricht:", error);
      }
    }
  );
});

const port = process.env.PORT || 9000;
httpServer.listen(port, () => console.log(`Server läuft auf Port ${port}`));
