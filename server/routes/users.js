import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();

// @route POST api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        name: user.name, // Include the user's name in the token payload if needed
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route POST api/users/login
// @desc Authenticate user & get token
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" }); // 401 Unauthorized
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" }); // 401 Unauthorized
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route GET api/users/user-workspaces
// @desc Get all workspaces of a user
// @access Private
router.get("/user-workspaces", async (req, res) => {
  try {
    const userId = req.user.id; // Benutzer-ID aus dem JWT-Token
    const userWorkspaces = await Workspace.find({ members: userId });
    res.json(userWorkspaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Abrufen der Benutzer-Workspaces");
  }
});

// @route GET api/users/validate-token
// @desc Validate user's token
// @access Private
router.get("/validate-token", Auth, (req, res) => {
  console.log("User in validate-token:", req.user);
  res.json({ valid: true, userId: req.user.id });
});

// GET api/users/me
// Beschreibung: Aktuellen Benutzer abrufen
// Zugriff: Privat
router.get("/me", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).send("Benutzer nicht gefunden");
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Fehler");
  }
});

// @route GET api/users/by-ids
// @desc Get infos about authors
// @access Public
router.get("/by-ids", async (req, res) => {
  try {
    const userIds = req.query.userIds;
    console.log("userIds: ", userIds);
    // Überprüfen Sie, ob userIds vorhanden und ein Array ist
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).send("Invalid userIds provided");
    }

    const users = await User.find({
      _id: { $in: userIds },
    }).select("-password");

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
