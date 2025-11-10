import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";
import { generateAIResponse } from "../openai.js";
import { buildChatPrompt } from "../ai/promptBuilder.js";

const router = express.Router();

router.use(authenticate);

router.post("/", async (req: AuthenticatedRequest, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  const db = loadDB();
  const user = req.user!;

  // Récupérer l'historique des messages de l'utilisateur
  const history = db.messages
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-10); // Garder les 10 derniers messages

  // Construire le prompt personnalisé selon le rôle
  const chatHistory = history.map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  const prompt = buildChatPrompt({
    userRole: user.role,
    message,
    chatHistory,
    userEmail: user.email,
  });

  // Générer la réponse IA
  const aiResponse = await generateAIResponse(prompt);
  const reply = aiResponse.trim();
  const timestamp = Date.now();

  // Sauvegarder le message utilisateur et la réponse
  db.messages.push(
    { id: uuidv4(), userId: user.id, role: "user", content: message, timestamp },
    { id: uuidv4(), userId: user.id, role: "assistant", content: reply, timestamp: timestamp + 1 }
  );

  saveDB(db);

  // Retourner la réponse avec contexte
  return res.json({
    success: true,
    reply,
    context: {
      role: user.role,
      messagesCount: history.length + 2,
    },
  });
});

router.get("/history", (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = req.user!;
  
  const history = db.messages
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  return res.json({
    success: true,
    history,
    context: {
      totalMessages: history.length,
      userRole: user.role,
      userId: user.id,
    },
  });
});

router.delete("/history", (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = req.user!;

  // Supprimer tous les messages de l'utilisateur
  db.messages = db.messages.filter((entry) => entry.userId !== user.id);
  saveDB(db);

  return res.json({
    success: true,
    message: "Historique de chat supprimé",
  });
});

export default router;

