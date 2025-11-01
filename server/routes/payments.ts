import express from "express";

const router = express.Router();

/**
 * Synrgy Payments API — Mocked Plans for First Install
 * Clean version (no duplicates, no sandbox/demo).
 */

router.get("/payments/plans", (_req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "free",
        name: "Essai gratuit 14 jours",
        price: 0,
        interval: "trial",
        description: "Découvre Synrgy sans engagement.",
      },
      {
        id: "starter",
        name: "Athlète indépendant",
        price: 19.99,
        interval: "month",
        description: "Accès complet aux outils de suivi et nutrition.",
      },
      {
        id: "coach",
        name: "Coach professionnel",
        price: 49.99,
        interval: "month",
        description: "Gère tes athlètes et plans avec le tableau de bord pro.",
      },
    ],
  });
});

export default router;


