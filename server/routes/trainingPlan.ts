import express, { type Request, type Response } from "express";
import { buildPrompt } from "../../coreAI/aiAdvisor";
import { queryOllama } from "../ai/ollama";

const router = express.Router();

// POST /api/trainingPlan/generate
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { goal, level, lastPlan } = req.body;

    if (process.env.TEST_MODE === "true") {
      // Demo plan
      const demoPlan = {
        week: 1,
        days: [
          {
            name: "Jour 1 - Force",
            exercises: [
              { name: "Squat", series: 4, reps: 8, weight: 80, rest: 180 },
              { name: "Développé couché", series: 4, reps: 8, weight: 70, rest: 180 },
              { name: "Rowing barre", series: 3, reps: 10, weight: 60, rest: 120 },
              { name: "Fentes", series: 3, reps: 12, weight: "poids du corps", rest: 90 }
            ]
          },
          {
            name: "Jour 2 - Hypertrophie",
            exercises: [
              { name: "Soulevé de terre", series: 3, reps: 6, weight: 100, rest: 240 },
              { name: "Tractions", series: 3, reps: 8, weight: "poids du corps", rest: 120 },
              { name: "Dips", series: 3, reps: 10, weight: "poids du corps", rest: 120 },
              { name: "Planche", series: 3, reps: 30, weight: "secondes", rest: 60 }
            ]
          },
          {
            name: "Jour 3 - Endurance",
            exercises: [
              { name: "Burpees", series: 4, reps: 15, weight: "poids du corps", rest: 60 },
              { name: "Mountain climbers", series: 3, reps: 20, weight: "poids du corps", rest: 45 },
              { name: "Squat jumps", series: 3, reps: 12, weight: "poids du corps", rest: 60 },
              { name: "Pompes", series: 3, reps: 15, weight: "poids du corps", rest: 60 }
            ]
          },
          {
            name: "Jour 4 - Récupération",
            exercises: [
              { name: "Étirements", series: 1, reps: 20, weight: "minutes", rest: 0 },
              { name: "Yoga", series: 1, reps: 30, weight: "minutes", rest: 0 },
              { name: "Marche", series: 1, reps: 45, weight: "minutes", rest: 0 }
            ]
          }
        ],
        progression: "Augmentation de 2.5% à 5% des charges chaque semaine si ≥80% des séries sont complétées"
      };

      return res.json(demoPlan);
    }

    // Production: Call Ollama
    const prompt = `Crée un programme d'entraînement structuré pour un objectif "${goal}" de niveau "${level}". 
    Dernier programme: "${lastPlan}". 
    Retourne un JSON avec:
    - week: numéro de semaine
    - days: tableau de 4 jours avec nom et exercices
    - chaque exercice: name, series, reps, weight (nombre ou "poids du corps"), rest (secondes)
    - progression: règle de progression hebdomadaire`;

    const llmResponse = await queryOllama(buildPrompt(prompt));
    
    // Essayer de parser la réponse JSON, sinon retourner un plan par défaut
    try {
      const parsedResponse = JSON.parse(llmResponse);
      res.json(parsedResponse);
    } catch {
      // Si la réponse n'est pas du JSON valide, retourner un plan par défaut
      const defaultPlan = {
        week: 1,
        days: [
          {
            name: "Jour 1 - Force",
            exercises: [
              { name: "Squat", series: 4, reps: 8, weight: 80, rest: 180 },
              { name: "Développé couché", series: 4, reps: 8, weight: 70, rest: 180 }
            ]
          }
        ],
        progression: "Augmentation de 2.5% à 5% des charges chaque semaine"
      };
      res.json(defaultPlan);
    }

  } catch (error) {
    console.error("Error generating training plan:", error);
    res.status(500).json({ error: "Erreur lors de la génération du programme" });
  }
});

// POST /api/training/log (for production)
router.post("/log", async (req: Request, res: Response) => {
  try {
    const { week, completedExercises, timestamp } = req.body;
    
    // TODO: Save to database in production
    console.log("Training session logged:", { week, completedExercises, timestamp });
    
    res.json({ success: true, message: "Séance enregistrée" });
  } catch (error) {
    console.error("Error logging training session:", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

// GET /api/training/history (for production)
router.get("/history", async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database in production
    const mockHistory = [
      { week: 1, completedExercises: ["0-0", "0-1"], timestamp: "2024-01-01T10:00:00Z" },
      { week: 2, completedExercises: ["0-0", "0-1", "1-0"], timestamp: "2024-01-08T10:00:00Z" }
    ];
    
    res.json(mockHistory);
  } catch (error) {
    console.error("Error fetching training history:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
  }
});

export default router;
