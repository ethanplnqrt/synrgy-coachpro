import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = req.user!;
  const goals = db.goals.filter((goal) => goal.userId === user.id);
  return res.json({ success: true, goals });
});

router.post("/", (req: AuthenticatedRequest, res) => {
  const { title, targetDate } = req.body || {};

  if (!title) {
    return res.status(400).json({ success: false, error: "Missing title" });
  }

  const db = loadDB();
  const user = req.user!;

  const goal = {
    id: uuidv4(),
    userId: user.id,
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

router.patch("/:goalId", (req: AuthenticatedRequest, res) => {
  const { status, progress } = req.body || {};
  const { goalId } = req.params;

  const db = loadDB();
  const user = req.user!;

  const goal = db.goals.find((g) => g.id === goalId && g.userId === user.id);
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

