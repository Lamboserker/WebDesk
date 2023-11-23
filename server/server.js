import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import messageRoutes from './routes/messages.js';
import channelRoutes from './routes/channels.js';
import workspaceRoutes from './routes/workspaces.js';
import auth from './middleware/Auth.js'; // Import der Authentifizierungsmiddleware
import ErrorHandler from './middleware/ErrorHandler/ErrorHandlingMiddleware.js';
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

// Hier können Sie auth als Middleware für bestimmte Routen verwenden
app.use("/api/users", userRoutes);
app.use("/api/video", videoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);

// Beispiel, wie die Auth-Middleware in den Workspace-Routen verwendet wird
app.use('/api/workspaces', auth, workspaceRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
