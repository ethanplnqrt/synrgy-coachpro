import axios from "axios";
import { buildIdentityPrompt, getPhilosophySummary, SYNRGY_PERSONALITY } from "./philosophy.js";

const CODEX_API_KEY = process.env.CODEX_API_KEY;
const CODEX_API_URL = process.env.CODEX_API_URL || "https://api.openai.com/v1/chat/completions";
const CODEX_MODEL = process.env.CODEX_MODEL || "gpt-4o-mini";

interface CodexContext {
  role?: "coach" | "client" | "athlete";
  userId?: string;
  history?: Array<{ role: string; content: string }>;
  [key: string]: any;
}

/**
 * Query Codex AI engine with Synrgy philosophy
 * @param prompt - The prompt to send to Codex
 * @param context - Optional context (user role, history, etc.)
 * @returns AI-generated response
 */
export async function queryCodex(prompt: string, context?: CodexContext): Promise<string> {
  // Fallback mode if no API key configured
  if (!CODEX_API_KEY) {
    console.warn("⚠️  CODEX_API_KEY not configured - using fallback mode");
    return generateFallbackResponse(prompt, context);
  }

  try {
    const userRole = context?.role || "athlete";
    
    // Build identity-aware system message with Synrgy philosophy
    const identityPrompt = buildIdentityPrompt(userRole);
    const systemMessage = `${identityPrompt}\n\nMaintenant, réponds à la demande suivante en incarnant ces valeurs.`;
    
    // Build messages array with philosophy and history
    const messages = [];
    
    messages.push({ role: "system", content: systemMessage });
    
    if (context?.history && Array.isArray(context.history)) {
      messages.push(...context.history.slice(-5)); // Last 5 messages for context
    }
    
    messages.push({ role: "user", content: prompt });

    // Call Codex API
    const response = await axios.post(
      CODEX_API_URL,
      {
        model: CODEX_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Authorization": `Bearer ${CODEX_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30s timeout
      }
    );

    const result = response.data.choices[0]?.message?.content;
    
    if (!result) {
      throw new Error("No response from Codex");
    }

    return result.trim();
  } catch (error: any) {
    console.error("❌ Codex API error:", error.message);
    
    // Fallback on error
    if (error.response?.status === 401) {
      throw new Error("Invalid Codex API key");
    }
    
    if (error.response?.status === 429) {
      throw new Error("Codex rate limit exceeded");
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error("Codex request timeout");
    }
    
    throw new Error(`Codex error: ${error.message}`);
  }
}

/**
 * Build context-aware system message with Synrgy philosophy
 */
function buildSystemMessage(context?: CodexContext): string {
  const userRole = context?.role || "athlete";
  return getPhilosophySummary(userRole);
}

/**
 * Fallback response when no API key is configured
 * Uses Synrgy philosophy for intelligent responses
 */
function generateFallbackResponse(prompt: string, context?: CodexContext): string {
  const lowerPrompt = prompt.toLowerCase();
  const userRole = context?.role || "athlete";
  const approach = SYNRGY_PERSONALITY.approach[userRole];

  // Simple pattern matching for common requests with Synrgy philosophy
  if (lowerPrompt.includes("motivation") || lowerPrompt.includes("motivant")) {
    return `${SYNRGY_PERSONALITY.principles[0]} Continue comme ça ! Chaque séance te rapproche de tes objectifs. La constance est la clé du succès. 💪`;
  }

  if (lowerPrompt.includes("programme") || lowerPrompt.includes("entraînement")) {
    return `Principes Synrgy pour ton programme : ${SYNRGY_PERSONALITY.methodology.training} Pour créer un programme efficace, commence par définir tes objectifs (force, hypertrophie, endurance). Un bon programme inclut : progression mesurable, récupération adaptée et variété intelligente. Configure CODEX_API_KEY pour des plans personnalisés complets basés sur la science.`;
  }

  if (lowerPrompt.includes("nutrition") || lowerPrompt.includes("repas")) {
    return `Approche Synrgy nutrition : ${SYNRGY_PERSONALITY.methodology.nutrition} Calcule d'abord ton TDEE, puis ajuste selon ton objectif. Priorité : protéines (structure), puis glucides (énergie) et lipides (hormones). Configure CODEX_API_KEY pour des plans nutrition détaillés et personnalisés.`;
  }

  // Generic response with philosophy
  return `[Mode Synrgy Fallback - Configure CODEX_API_KEY pour l'IA complète]

${SYNRGY_PERSONALITY.mission}

Pour ton profil (${userRole}) : ${approach.style}

Focus : ${approach.focus}

Conseil général : ${
    userRole === "coach" 
      ? "Utilise l'analyse des données de tes clients pour adapter tes programmes. La personnalisation est la clé de la rétention et des résultats."
      : userRole === "client"
      ? "Communique régulièrement avec ton coach sur ton ressenti. Le feedback permet d'ajuster le programme pour des résultats optimaux."
      : "La constance et la progression progressive sont essentielles. Écoute ton corps et ajuste intelligemment."
}

${SYNRGY_PERSONALITY.principles[0]}`;
}

/**
 * Check if Codex is configured
 */
export function isCodexConfigured(): boolean {
  return !!CODEX_API_KEY;
}

