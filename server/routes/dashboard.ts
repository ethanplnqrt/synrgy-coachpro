import express from "express";

const router = express.Router();

router.get("/dashboard/overview", (_req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        coaches: 3,
        activeClients: 12,
        pendingCheckins: 5,
        programsDelivered: 28,
      },
      topCoaches: [
        { id: "coach_1", name: "Lena Martin", activeClients: 6, satisfaction: 4.8 },
        { id: "coach_2", name: "Sam Carter", activeClients: 4, satisfaction: 4.6 },
        { id: "coach_3", name: "Noa Vidal", activeClients: 2, satisfaction: 4.4 },
      ],
      upcomingSessions: [
        { id: "sess_1", athlete: "Alex P.", focus: "Hypertrophie haut du corps", scheduledAt: "2025-11-02T08:30:00Z" },
        { id: "sess_2", athlete: "Livia R.", focus: "Conditioning", scheduledAt: "2025-11-02T15:00:00Z" },
      ],
      latestMetrics: {
        avgSleep: 7.4,
        avgCalories: 2350,
        avgMotivation: 4.2,
      },
    },
  });
});

export default router;

