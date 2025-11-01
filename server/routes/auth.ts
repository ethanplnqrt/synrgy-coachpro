import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, error: "Missing email, password or role" });
  }

  const db = loadDB();
  const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  const user = {
    id: uuidv4(),
    email,
    password,
    role,
    createdAt: Date.now(),
  };

  db.users.push(user);
  saveDB(db);

  return res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Missing email or password" });
  }

  const db = loadDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const session = {
    id: uuidv4(),
    userId: user.id,
    createdAt: Date.now(),
  };

  db.sessions.push(session);
  saveDB(db);

  return res.json({ success: true, token: session.id, user: { id: user.id, email: user.email, role: user.role } });
});

router.post("/logout", (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const db = loadDB();
  const sessions = db.sessions.filter((session) => session.id !== token);
  db.sessions = sessions;
  saveDB(db);

  return res.json({ success: true });
});

router.get("/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
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

  return res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;

