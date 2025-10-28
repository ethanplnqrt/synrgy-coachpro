import fetch from "node-fetch";

export async function queryOllama(prompt: string, model = process.env.MODEL_NAME || "llama3.2:1b") {
  try {
    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });
    const data = await response.json();
    return data.response || "Erreur: aucune réponse générée.";
  } catch (err) {
    console.error("⚠️ Ollama non détecté — démarre le service avec : ollama serve");
    return "⚠️ Service IA temporairement indisponible. Relance Ollama.";
  }
}
