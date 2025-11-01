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
  { 
    id: "c1", 
    name: "Léa Martin", 
    email: "lea@example.com", 
    progress: "85%",
    avatar: "https://ui-avatars.com/api/?name=Léa+Martin&background=F97316&color=fff",
    age: 28,
    level: "Intermédiaire",
    mainGoal: "Prise de masse musculaire",
    status: "progressing" as const,
    nextFollowUp: { name: "Léa Martin", time: "14h00" },
    weight: [65, 66, 67, 67.5, 68],
    performance: [75, 78, 82, 85, 87],
    sleep: [7.5, 8, 7.5, 8.5, 8],
    latestMessage: "Merci pour les conseils, j'ai vu une amélioration !",
    feedback: {
      emotions: "Motivée et déterminée",
      fatigue: "Légèrement fatiguée après la séance",
      motivation: "Très motivée, objectif en vue"
    }
  },
  { 
    id: "c2", 
    name: "Maxime Dubois", 
    email: "max@example.com", 
    progress: "72%",
    avatar: "https://ui-avatars.com/api/?name=Maxime+Dubois&background=2563EB&color=fff",
    age: 32,
    level: "Avancé",
    mainGoal: "Endurance et perte de graisse",
    status: "stagnating" as const,
    nextFollowUp: { name: "Maxime Dubois", time: "16h30" },
    weight: [78, 77.5, 77, 77, 77],
    performance: [82, 83, 82, 84, 83],
    sleep: [7, 6.5, 7, 7.5, 7],
    latestMessage: "Je stagne sur le développé couché depuis 2 semaines",
    feedback: {
      emotions: "Un peu frustré par la stagnation",
      fatigue: "Normale",
      motivation: "Moyenne, besoin de relancer"
    }
  },
  { 
    id: "c3", 
    name: "Sarah Johnson", 
    email: "sarah@example.com", 
    progress: "60%",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=EA580C&color=fff",
    age: 25,
    level: "Débutant",
    mainGoal: "Remise en forme générale",
    status: "struggling" as const,
    nextFollowUp: { name: "Sarah Johnson", time: "18h00" },
    weight: [70, 71, 71.5, 72, 71.5],
    performance: [45, 48, 50, 52, 50],
    sleep: [6, 6.5, 7, 6.5, 7],
    latestMessage: "J'ai du mal à tenir le rythme, peut-on ajuster ?",
    feedback: {
      emotions: "Un peu découragée",
      fatigue: "Très fatiguée",
      motivation: "Basse, besoin de soutien"
    }
  },
];

export const mockMessages = [
  { id: 1, content: "Comment améliorer ma technique de squat ?", sender: "client", timestamp: new Date() },
  { id: 2, content: "Concentre-toi sur la descente contrôlée et garde le dos droit.", sender: "coach", timestamp: new Date() },
];

// Tâches IA générées
export const mockAITasks = [
  { id: 1, text: "Réévaluer le plan de Maxime — stagnation sur le développé couché", priority: "high", clientId: "c2" },
  { id: 2, text: "Encourager Sarah — baisse de motivation détectée", priority: "high", clientId: "c3" },
  { id: 3, text: "Ajuster les protéines de Léa — progression excellente", priority: "medium", clientId: "c1" },
];

// Données pour graphiques
export const generatePerformanceData = (days: number = 30) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    performance: Math.floor(Math.random() * 20) + 70,
  }));
};

// Programme du jour pour athlète
export const mockTodayWorkout = {
  title: "Pecs & Triceps",
  duration: "1h10",
  exercises: [
    { name: "Développé couché", sets: 4, reps: "8-10", rest: "2min", tip: "Contrôle la descente sur 3 secondes" },
    { name: "Dips", sets: 3, reps: "10-12", rest: "90sec", tip: "Garde le buste droit" },
    { name: "Développé incliné haltères", sets: 3, reps: "10-12", rest: "90sec", tip: "Contracte bien les pecs en haut" },
    { name: "Triceps à la poulie", sets: 3, reps: "12-15", rest: "60sec", tip: "Isole bien le triceps" },
  ],
  weeklyProgress: {
    currentWeight: 75,
    previousWeek: 72,
    improvement: "+4.2%"
  }
};

// Plan nutritionnel du jour
export const mockTodayNutrition = {
  meals: [
    { name: "Petit-déjeuner", foods: ["Flocons d'avoine", "Banane", "Miel"], calories: 450, alternatives: ["Porridge", "Pain complet"] },
    { name: "Déjeuner", foods: ["Poulet grillé", "Riz complet", "Brocolis"], calories: 650, alternatives: ["Saumon", "Quinoa", "Tofu"] },
    { name: "Goûter", foods: ["Fromage blanc", "Fruits rouges"], calories: 200, alternatives: ["Yaourt grec", "Noix"] },
    { name: "Dîner", foods: ["Oeufs", "Salade verte", "Avocat"], calories: 400, alternatives: ["Tofu brouillé", "Tempeh"] },
  ],
  totalCalories: 1700,
  macros: { protein: 140, carbs: 180, fat: 55 }
};
