import express from "express";
import { v4 as uuidv4 } from "uuid";
import { loadDB, saveDB } from "../utils/db.js";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";
import { queryCodex } from "../ai/codex/index.js";

const router = express.Router();

router.use(authenticate);

// Get user check-ins
router.get("/", (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = req.user!;

  const checkins = (db as any).checkins?.filter((c: any) => c.userId === user.id) || [];
  
  return res.json({
    success: true,
    checkins: checkins.sort((a: any, b: any) => b.timestamp - a.timestamp),
  });
});

// Get all check-ins (for coaches)
router.get("/all", (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role !== "coach") {
    return res.status(403).json({ 
      success: false, 
      error: "Only coaches can view all check-ins" 
    });
  }

  const db = loadDB();
  const allCheckins = (db as any).checkins || [];
  
  return res.json({
    success: true,
    checkins: allCheckins.sort((a: any, b: any) => b.timestamp - a.timestamp),
  });
});

// Create check-in with AI analysis
router.post("/", async (req: AuthenticatedRequest, res) => {
  const { weight, sleep, energy, mood, notes } = req.body || {};
  const user = req.user!;

  const db = loadDB() as any;
  if (!db.checkins) db.checkins = [];

  const checkin = {
    id: uuidv4(),
    userId: user.id,
    userName: user.fullName || user.email,
    weight,
    sleep,
    energy,
    mood,
    notes,
    timestamp: Date.now(),
    aiAnalysis: null,
  };

  // Generate AI analysis
  try {
    const analysisPrompt = `
Tu es l'IA Synrgy pour un utilisateur ${user.role}.

Analyse ce check-in quotidien et fournis une réponse courte (3-4 phrases max), motivante et constructive :

**Données du check-in :**
- Poids : ${weight || "non renseigné"} kg
- Sommeil : ${sleep || "non renseigné"}/10
- Énergie : ${energy || "non renseigné"}/10
- Humeur : ${mood || "non renseigné"}/10
- Notes : ${notes || "aucune"}

**Consignes :**
1. Commente la cohérence entre sommeil, énergie et performance
2. Donne un conseil concret et actionnable
3. Motive et valorise l'effort de suivi
4. Reste bref et impactant

Ne numérote pas ta réponse, parle naturellement.
    `.trim();

    const aiAnalysis = await queryCodex(analysisPrompt, { role: user.role });
    checkin.aiAnalysis = aiAnalysis;
  } catch (error) {
    console.error("AI analysis error:", error);
    checkin.aiAnalysis = "Analyse IA temporairement indisponible. Continue ton excellent suivi !";
  }

  db.checkins.push(checkin);
  saveDB(db);

  return res.json({ success: true, checkin });
});

export default router;

