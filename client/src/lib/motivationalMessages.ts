// Messages motivationnels générés par IA locale
export const coachMotivationalMessages = [
  "Ta mission, c'est d'inspirer la discipline.",
  "Chaque athlète compte, chaque progrès mérite ta reconnaissance.",
  "Tu es le catalyseur de leur transformation.",
  "L'excellence n'est pas une action, c'est une habitude. Tu l'enseignes chaque jour.",
  "Ton engagement façonne des champions.",
  "La patience et la persévérance sont tes meilleurs outils.",
  "Chaque conseil que tu donnes crée un impact durable.",
];

export const athleteMotivationalMessages = [
  "La constance bat la motivation.",
  "🔥 Repousse tes limites, tu es plus fort(e) que tu ne le penses.",
  "Chaque séance te rapproche de ton objectif.",
  "La discipline aujourd'hui = les résultats demain.",
  "💪 Chaque effort compte, chaque repas compte, chaque repos compte.",
  "Tu n'abandonnes pas une séance, tu abandonnes ta progression.",
  "Transforme ta faiblesse en force, jour après jour.",
  "Les champions ne naissent pas, ils se construisent. Tu es en train de te construire.",
];

export function getMotivationalMessage(role: "coach" | "athlete"): string {
  const messages = role === "coach" ? coachMotivationalMessages : athleteMotivationalMessages;
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % messages.length;
  return messages[dayIndex];
}

