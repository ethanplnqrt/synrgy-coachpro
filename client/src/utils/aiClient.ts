/**
 * Codex AI Client
 * Interface frontend pour communiquer avec le moteur IA Codex
 */

import { apiUrl } from "@/lib/apiUrl";

interface CodexContext {
  role?: "coach" | "client" | "athlete";
  userId?: string;
  history?: Array<{ role: string; content: string }>;
  [key: string]: any;
}

interface CodexResponse {
  success: boolean;
  result?: string;
  configured?: boolean;
  error?: string;
}

/**
 * Query Codex AI engine
 * @param prompt - The question/request to Codex
 * @param context - Optional context (role, history, etc.)
 * @returns AI-generated response
 */
export async function askCodex(prompt: string, context?: CodexContext): Promise<CodexResponse> {
  try {
    const res = await fetch(apiUrl("/api/codex"), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      credentials: "include", // Include auth cookies
      body: JSON.stringify({ prompt, context })
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        error: error.error || `HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error: any) {
    console.error("Codex client error:", error);
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

/**
 * Check Codex configuration status
 * @returns Status information
 */
export async function getCodexStatus(): Promise<{
  success: boolean;
  configured: boolean;
  model?: string;
  fallbackMode?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(apiUrl("/api/codex/status"), {
      credentials: "include",
    });

    if (!res.ok) {
      return {
        success: false,
        configured: false,
        error: `HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      configured: false,
      error: error.message,
    };
  }
}

/**
 * Quick helper for motivation messages
 */
export async function getMotivation(userRole?: "coach" | "client" | "athlete"): Promise<string> {
  const response = await askCodex(
    "Génère un message de motivation court et énergique pour un sportif",
    { role: userRole }
  );
  
  return response.result || "Continue comme ça ! 💪";
}

/**
 * Quick helper for training plan generation
 */
export async function generateTrainingPlan(
  goal: string,
  level: string,
  frequency: number,
  userRole?: "coach" | "client" | "athlete"
): Promise<string> {
  const prompt = `Génère un plan d'entraînement ${frequency} jours/semaine pour: ${goal}. Niveau: ${level}. Format: structuré et actionnable.`;
  
  const response = await askCodex(prompt, { role: userRole });
  
  return response.result || "Plan non disponible. Configure CODEX_API_KEY.";
}

/**
 * Quick helper for nutrition plan generation
 */
export async function generateNutritionPlan(
  calories: number,
  goal: string,
  userRole?: "coach" | "client" | "athlete"
): Promise<string> {
  const prompt = `Génère un plan nutrition ${calories} kcal/jour pour: ${goal}. Inclus répartition macros et exemples de repas.`;
  
  const response = await askCodex(prompt, { role: userRole });
  
  return response.result || "Plan non disponible. Configure CODEX_API_KEY.";
}

