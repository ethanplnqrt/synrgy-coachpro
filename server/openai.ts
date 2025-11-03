import axios from "axios";

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return response.data.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse.";
  } catch (err) {
    console.error("Erreur IA:", err);
    return "Erreur serveur IA.";
  }
}

