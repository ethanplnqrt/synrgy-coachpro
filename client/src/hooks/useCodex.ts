import { useState } from "react";
import { apiUrl } from "@/lib/apiUrl";

export function useCodex(role: "coach" | "client" | "athlete") {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  async function askCodex(prompt: string) {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/codex"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, context: { role } })
      });
      const data = await res.json();
      setResponse(data.result || data.response || "Aucune réponse Codex.");
    } catch (err) {
      console.error("Codex frontend error:", err);
      setResponse("Erreur de communication avec Codex.");
    } finally {
      setLoading(false);
    }
  }

  return { askCodex, response, loading };
}

