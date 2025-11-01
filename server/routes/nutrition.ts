import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const db = loadDB();

  let inferredUserId: string | null = null;
  if (token) {
    const session = db.sessions.find((s) => s.id === token);
    if (session) {
      inferredUserId = session.userId;
    }
  }

  const targetUserId = req.query.userId ? String(req.query.userId) : inferredUserId;
  if (!targetUserId) {
    return res.status(400).json({ success: false, error: "Missing user context" });
  }

  const entries = db.nutrition.filter((entry) => entry.userId === targetUserId);
  return res.json({ success: true, entries });
});

router.post("/", (req, res) => {
  const { token, notes, calories, macros } = req.body || {};

  if (!token) {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const db = loadDB();
  const session = db.sessions.find((s) => s.id === token);
  if (!session) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const entry = {
    id: uuidv4(),
    userId: session.userId,
    timestamp: Date.now(),
    notes,
    calories,
    macros,
  };

  db.nutrition.push(entry);
  saveDB(db);

  return res.status(201).json({ success: true, entry });
});

export default router;
