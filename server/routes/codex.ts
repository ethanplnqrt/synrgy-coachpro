import express from "express";
import { queryCodex, isCodexConfigured } from "../ai/codex/index.js";
import { authenticate, type AuthenticatedRequest } from "../auth/authMiddleware.js";

const router = express.Router();

// Optional auth - Codex can be used by authenticated users or for public demos
router.post("/", async (req: AuthenticatedRequest, res) => {
  const { prompt, context } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ 
      success: false, 
      error: "Prompt is required" 
    });
  }

  try {
    // Add user context if authenticated
    const enrichedContext = req.user ? {
      ...context,
      role: req.user.role,
      userId: req.user.id,
    } : context;

    const result = await queryCodex(prompt, enrichedContext);
    
    return res.json({ 
      success: true, 
      result,
      response: result, // Alias for compatibility
      configured: isCodexConfigured()
    });
  } catch (error: any) {
    console.error("Codex route error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Codex query failed" 
    });
  }
});

// Status endpoint to check Codex configuration
router.get("/status", (_req, res) => {
  return res.json({
    success: true,
    configured: isCodexConfigured(),
    model: process.env.CODEX_MODEL || "gpt-4o-mini",
    fallbackMode: !isCodexConfigured()
  });
});

export default router;

