import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  const db = loadDB();
  const session = db.sessions.find((s) => s.id === token);
  if (!session) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const goals = db.goals.filter((goal) => goal.userId === session.userId);
  return res.json({ success: true, goals });
});

router.post("/", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { title, targetDate } = req.body || {};

  if (!token || !title) {
    return res.status(400).json({ success: false, error: "Missing token or title" });
  }

  const db = loadDB();
  const session = db.sessions.find((s) => s.id === token);
  if (!session) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const goal = {
    id: uuidv4(),
    userId: session.userId,
    title,
    targetDate,
    status: "active" as const,
    progress: 0,
    createdAt: Date.now(),
  };

  db.goals.push(goal);
  saveDB(db);

  return res.status(201).json({ success: true, goal });
});

router.patch("/:goalId", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { status, progress } = req.body || {};
  const { goalId } = req.params;

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  const db = loadDB();
  const session = db.sessions.find((s) => s.id === token);
  if (!session) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const goal = db.goals.find((g) => g.id === goalId && g.userId === session.userId);
  if (!goal) {
    return res.status(404).json({ success: false, error: "Goal not found" });
  }

  if (status) {
    goal.status = status;
  }

  if (typeof progress === "number") {
    goal.progress = progress;
  }

  saveDB(db);
  return res.json({ success: true, goal });
});

export default router;

