import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import messageRoutes from "./routes/messages.js";
import channelRoutes from "./routes/channels.js";
import workspaceRoutes from "./routes/workspaces.js";
import auth from "./middleware/Auth.js";
import authGoogleRoutes from "./routes/google0auth.js";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channels", auth, channelRoutes);
app.use("/api/workspaces", auth, workspaceRoutes);
app.use("/api/google0auth", authGoogleRoutes); // Entfernen Sie `auth` von dieser Route

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
