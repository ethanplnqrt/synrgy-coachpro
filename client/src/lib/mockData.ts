// Données mock pour le mode démo
export const mockUser = { 
  id: "demo", 
  name: "Coach Démo", 
  email: "demo@coachpro.app",
  role: "coach" as const
};

export const mockPrograms = [
  { id: 1, title: "Cardio Boost", progress: "80%", status: "active" },
  { id: 2, title: "Force & Endurance", progress: "65%", status: "active" },
  { id: 3, title: "Perte de poids", progress: "45%", status: "draft" },
];

export const mockClients = [
  { id: "c1", name: "Léa Martin", email: "lea@example.com", progress: "85%" },
  { id: "c2", name: "Maxime Dubois", email: "max@example.com", progress: "72%" },
  { id: "c3", name: "Sarah Johnson", email: "sarah@example.com", progress: "60%" },
];

export const mockMessages = [
  { id: 1, content: "Comment améliorer ma technique de squat ?", sender: "client", timestamp: new Date() },
  { id: 2, content: "Concentre-toi sur la descente contrôlée et garde le dos droit.", sender: "coach", timestamp: new Date() },
];
