import express, { type Request, type Response } from "express";
import { queryOllama } from "../ai/ollama";

const router = express.Router();

// POST /api/nutrition/generate
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { goal, level, weight, height, activity, preferences } = req.body;

    if (process.env.TEST_MODE === "true") {
      // Demo nutrition plan
      const demoPlan = {
        meals: [
          {
            name: "Petit déjeuner",
            items: [
              { food: "Flocons d'avoine", amount: "1 bol", variant: "riz soufflé" },
              { food: "Œufs", amount: "2", variant: "tofu" },
              { food: "Banane", amount: "1", variant: "pomme" },
              { food: "Amandes", amount: "une poignée", variant: "noix" }
            ]
          },
          {
            name: "Collation matinale",
            items: [
              { food: "Yaourt grec", amount: "150g", variant: "fromage blanc" },
              { food: "Baies", amount: "une poignée", variant: "raisins" }
            ]
          },
          {
            name: "Déjeuner",
            items: [
              { food: "Poulet", amount: "150-200g", variant: "dinde" },
              { food: "Riz complet", amount: "1 bol", variant: "quinoa" },
              { food: "Brocolis", amount: "une portion", variant: "épinards" },
              { food: "Avocat", amount: "1/2", variant: "huile d'olive" }
            ]
          },
          {
            name: "Collation post-entraînement",
            items: [
              { food: "Protéine en poudre", amount: "1 scoop", variant: "yaourt grec" },
              { food: "Banane", amount: "1", variant: "dattes" }
            ]
          },
          {
            name: "Dîner",
            items: [
              { food: "Saumon", amount: "150-200g", variant: "thon" },
              { food: "Patate douce", amount: "1 moyenne", variant: "riz complet" },
              { food: "Salade verte", amount: "une portion", variant: "légumes verts" },
              { food: "Huile d'olive", amount: "1 c.à.s", variant: "avocat" }
            ]
          }
        ],
        calories: 2200,
        macros: {
          prot: 150,
          carbs: 230,
          fat: 70
        }
      };

      return res.json(demoPlan);
    }

    // Production: Call Ollama
    const prompt = `Crée un plan nutritionnel structuré pour:
    - Objectif: ${goal}
    - Poids: ${weight}kg
    - Taille: ${height}cm
    - Activité: ${activity}
    - Préférences: ${preferences}
    
    Retourne un JSON avec:
    - meals: tableau de repas avec nom et items
    - chaque item: food, amount (quantité pratique), variant (alternative)
    - calories: total journalier
    - macros: {prot, carbs, fat} en grammes`;

    const llmResponse = await queryOllama(prompt);
    
    // Essayer de parser la réponse JSON, sinon retourner un plan par défaut
    try {
      const parsedResponse = JSON.parse(llmResponse);
      res.json(parsedResponse);
    } catch {
      // Si la réponse n'est pas du JSON valide, retourner un plan par défaut
      const defaultPlan = {
        meals: [
          {
            name: "Petit déjeuner",
            items: [
              { food: "Flocons d'avoine", amount: "1 bol", variant: "riz soufflé" },
              { food: "Œufs", amount: "2", variant: "tofu" }
            ]
          }
        ],
        calories: 2200,
        macros: { prot: 150, carbs: 230, fat: 70 }
      };
      res.json(defaultPlan);
    }

  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    res.status(500).json({ error: "Erreur lors de la génération du plan nutritionnel" });
  }
});

// POST /api/nutrition/log (for production)
router.post("/log", async (req: Request, res: Response) => {
  try {
    const { meals, calories, macros, timestamp, adjustments } = req.body;
    
    // TODO: Save to database in production
    console.log("Nutrition plan logged:", { meals, calories, macros, timestamp, adjustments });
    
    res.json({ success: true, message: "Plan nutritionnel enregistré" });
  } catch (error) {
    console.error("Error logging nutrition plan:", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

// GET /api/nutrition/history (for production)
router.get("/history", async (req: Request, res: Response) => {
  try {
    // TODO: Fetch from database in production
    const mockHistory = [
      {
        meals: [
          { name: "Petit déjeuner", items: [{ food: "Flocons d'avoine", amount: "1 bol", variant: "riz soufflé" }] }
        ],
        calories: 2200,
        macros: { prot: 150, carbs: 230, fat: 70 },
        timestamp: "2024-01-01T10:00:00Z",
        adjustments: "Réduction automatique de 15% des calories."
      }
    ];
    
    res.json(mockHistory);
  } catch (error) {
    console.error("Error fetching nutrition history:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
  }
});

export default router;
