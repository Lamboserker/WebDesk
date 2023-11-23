// Importieren der benötigten Module
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client("IhrGoogleClientID");

router.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "",
    });

    const payload = ticket.getPayload();
    const email = payload['email'];

    // Suche nach einem vorhandenen Benutzer oder erstelle einen neuen
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: payload['name'],
        email,
        password: "zufälligesPasswort" // Ein zufälliges Passwort setzen, da es nicht verwendet wird
      });
      await user.save();
    }

    // JWT-Token für den Nutzer erstellen
    const userPayload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      userPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "10h" },
      (err, token) => {
        if (err) throw err;
        // Senden Sie das Token als Antwort
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    res.status(401).json({ message: "Ungültiger Google Auth Token", error: error.toString() });
  }
});

export default router;
