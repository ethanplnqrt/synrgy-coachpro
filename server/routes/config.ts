import express from "express";

const router = express.Router();

router.get("/config", (_req, res) => {
  res.json({
    mode: "production-simulated",
    apiBase: "/api",
    welcome: "Synrgy — production-first mode",
  });
});

export default router;

