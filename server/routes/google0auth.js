// Importieren der benötigten Module
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
const Client = process.env.GOOGLE_CLIENT_ID;
const router = express.Router();
const client = new OAuth2Client(Client);

router.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: Client,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: generateRandomPassword(), // Erzeugen eines zufälligen Passworts
        profileImage: picture, // Hinzufügen des Profilbildes
        // workspaces können hier initialisiert oder später aktualisiert werden
      });
      await user.save();
    }

    const userPayload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      userPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    res
      .status(401)
      .json({
        message: "Ungültiger Google Auth Token",
        error: error.toString(),
      });
  }
});

// Hilfsfunktion zum Generieren eines sicheren zufälligen Passworts
function generateRandomPassword(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?";
  let password = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    password += characters[randomByte % charactersLength];
  }

  return password;
}

export default router;
