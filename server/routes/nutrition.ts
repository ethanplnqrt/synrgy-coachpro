import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = req.user!;
  const entries = db.nutrition
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  return res.json({ success: true, entries });
});

router.post("/", (req: AuthenticatedRequest, res) => {
  const { notes, calories, macros } = req.body || {};

  const db = loadDB();
  const user = req.user!;

  const entry = {
    id: uuidv4(),
    userId: user.id,
    timestamp: Date.now(),
    notes,
    calories,
    macros,
  };

  db.nutrition.unshift(entry);
  saveDB(db);

  return res.status(201).json({ success: true, entry });
});

export default router;
