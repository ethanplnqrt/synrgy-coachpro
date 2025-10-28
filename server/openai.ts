import { queryOllama } from "./ai/ollama";

export async function askOpenAI(prompt: string) {
  if (process.env.TEST_MODE === "true") {
    console.log("💡 Mode démo IA activé");
    return "💬 Réponse IA démo : " + prompt;
  }

  // Utiliser Ollama au lieu d'OpenAI
  console.log("✅ Synrgy connecté à Ollama (modèle llama3.2:1b)");
  return await queryOllama(prompt);
}

// Legacy function for compatibility
export async function getAICoachResponse(userMessage: string, userId?: string): Promise<string> {
  return await askOpenAI(userMessage);
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}