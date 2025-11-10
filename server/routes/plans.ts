import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: "client",
        name: "Client Accompagné",
        price: 29,
        interval: "month",
        description: "Suivi par un coach professionnel",
        features: [
          "Coach IA personnel",
          "Coach humain dédié",
          "Programme personnalisé",
          "Communication directe",
          "Feedback temps réel",
        ],
      },
      {
        id: "coach",
        name: "Coach Professionnel",
        price: 49,
        interval: "month",
        description: "Gérez vos clients avec l'IA",
        features: [
          "Tout du plan Client",
          "Clients illimités",
          "IA assistant coach",
          "Analytics avancés",
          "Dashboard pro",
          "API intégration",
        ],
      },
    ],
  });
});

export default router;

