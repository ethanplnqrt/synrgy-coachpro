import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { token, message } = req.body || {};

  if (!token || !message) {
    return res.status(400).json({ success: false, error: "Missing token or message" });
  }

  const db = loadDB();
  const session = db.sessions.find((s) => s.id === token);
  if (!session) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const reply = `Bonjour ${user.role === "coach" ? "Coach" : "Athlète"}! Tu as dit : "${message}"`;

  db.messages.push({
    id: uuidv4(),
    userId: user.id,
    message,
    reply,
    timestamp: Date.now(),
  });

  saveDB(db);

  return res.json({ success: true, reply });
});

router.get("/history/:userId", (req, res) => {
  const db = loadDB();
  const history = db.messages.filter((m) => m.userId === req.params.userId);
  return res.json({ success: true, history });
});

export default router;

