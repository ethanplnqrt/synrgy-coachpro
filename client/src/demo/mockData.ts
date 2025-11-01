// Mock data pour le mode démo Synrgy

export const mockCoach = {
  id: 'coach_1',
  name: "Lucas M.",
  email: "lucas@synrgy.com",
  role: 'coach',
  clients: [
    { 
      id: 'client_1',
      name: "Ethan D.", 
      poids: 77, 
      objectif: "prise de muscle", 
      progression: "+1.4kg", 
      energie: 8,
      avatar: 'https://ui-avatars.com/api/?name=Ethan+D&background=4ADE80&color=fff',
      lastCheckIn: 'Aujourd\'hui',
      adherence: 92
    },
    { 
      id: 'client_2',
      name: "Clara B.", 
      poids: 61, 
      objectif: "tonification", 
      progression: "+0.8kg", 
      energie: 7,
      avatar: 'https://ui-avatars.com/api/?name=Clara+B&background=F59E0B&color=fff',
      lastCheckIn: 'Hier',
      adherence: 75
    },
    {
      id: 'client_3',
      name: "Thomas R.",
      poids: 82,
      objectif: "perte de gras",
      progression: "-0.5kg",
      energie: 9,
      avatar: 'https://ui-avatars.com/api/?name=Thomas+R&background=60A5FA&color=fff',
      lastCheckIn: 'Il y a 2 jours',
      adherence: 88
    },
    {
      id: 'client_4',
      name: "Sophie L.",
      poids: 65,
      objectif: "endurance",
      progression: "+0.3kg",
      energie: 6,
      avatar: 'https://ui-avatars.com/api/?name=Sophie+L&background=8B5CF6&color=fff',
      lastCheckIn: 'Il y a 3 jours',
      adherence: 65
    }
  ],
  messages: [
    { from: "Ethan D.", content: "💬 super séance aujourd'hui !", time: '10:30' },
    { from: "Clara B.", content: "⚡ j'ai eu un petit coup de fatigue hier.", time: '14:15' },
    { from: "Thomas R.", content: "🎯 objectif atteint cette semaine", time: '09:00' }
  ],
  suggestionsIA: [
    { athlete: "Clara B.", suggestion: "Réduire les repos de 30s", type: "training" },
    { athlete: "Ethan D.", suggestion: "Augmenter protéines +5%", type: "nutrition" },
    { athlete: "Sophie L.", suggestion: "Semaine de deload recommandée", type: "training" }
  ],
  stats: {
    activeClients: 4,
    avgAdherence: 80,
    pendingSuggestions: 3,
    workoutsCompleted: 127
  }
};

export const mockAthlete = {
  id: 'athlete_1',
  name: "Ethan D.",
  email: "ethan@synrgy.com",
  role: 'athlete',
  trainingPlan: [
    { 
      jour: "Lundi", 
      name: "Push Day",
      exercices: [
        { nom: "Développé couché", séries: 4, reps: 10, charge: 70, repos: 180, tempo: "2-0-1-0" },
        { nom: "Développé incliné haltères", séries: 3, reps: 12, charge: 25, repos: 120 },
        { nom: "Dips", séries: 3, reps: 12, charge: 0, repos: 90 }
      ]
    },
    {
      jour: "Mercredi",
      name: "Pull Day",
      exercices: [
        { nom: "Tirage vertical", séries: 4, reps: 12, charge: 50, repos: 120 },
        { nom: "Rowing barre", séries: 4, reps: 10, charge: 60, repos: 120 },
        { nom: "Curl biceps", séries: 3, reps: 15, charge: 12, repos: 60 }
      ]
    },
    {
      jour: "Vendredi",
      name: "Legs Day",
      exercices: [
        { nom: "Squat", séries: 4, reps: 10, charge: 90, repos: 180 },
        { nom: "Fentes", séries: 3, reps: 12, charge: 20, repos: 120 },
        { nom: "Mollets", séries: 3, reps: 20, charge: 0, repos: 60 }
      ]
    }
  ],
  nutritionPlan: [
    { 
      repas: "Petit déjeuner", 
      aliments: ["Flocons d'avoine", "Banane", "Oeufs"], 
      kcal: 540,
      protein: 35,
      carbs: 55,
      fat: 12,
      time: '08:00'
    },
    { 
      repas: "Déjeuner", 
      aliments: ["Poulet", "Riz", "Brocoli"], 
      kcal: 650,
      protein: 50,
      carbs: 70,
      fat: 18,
      time: '13:00'
    },
    { 
      repas: "Goûter", 
      aliments: ["Fromage blanc", "Fruits rouges"], 
      kcal: 300,
      protein: 25,
      carbs: 35,
      fat: 8,
      time: '16:00'
    },
    { 
      repas: "Dîner", 
      aliments: ["Saumon", "Patate douce", "Légumes verts"], 
      kcal: 600,
      protein: 45,
      carbs: 55,
      fat: 20,
      time: '20:00'
    }
  ],
  metrics: { 
    poids: 77.3, 
    energie: 8, 
    faim: 6, 
    sommeil: 7.5,
    mood: 9
  },
  goals: {
    calories: 2090,
    protein: 155,
    carbs: 215,
    fat: 58
  },
  weightHistory: [
    { date: '2024-01-01', weight: 75 },
    { date: '2024-01-08', weight: 75.5 },
    { date: '2024-01-15', weight: 76.2 },
    { date: '2024-01-22', weight: 76.8 },
    { date: '2024-01-29', weight: 77.3 }
  ]
};

export const mockClient = {
  id: 'client_1',
  name: "Thomas R.",
  email: "thomas@synrgy.com",
  role: 'client',
  coach: {
    id: 'coach_1',
    name: "Lucas M.",
    avatar: 'https://ui-avatars.com/api/?name=Lucas+M&background=FF6B3D&color=fff',
    status: 'online'
  },
  objectifs: ["Perte de gras", "Reprise de forme"],
  nutrition: { kcal: 2200, proteines: 140, glucides: 230, lipides: 70 },
  progression: [
    { week: 'Semaine 1', weight: 82, trend: 'neutral' },
    { week: 'Semaine 2', weight: 81.5, trend: 'down' },
    { week: 'Semaine 3', weight: 81.2, trend: 'down' }
  ],
  chat: [
    { from: "Lucas M.", content: "Bonjour Thomas, comment s'est passé ton dernier entraînement ?", time: '10:00' },
    { from: "Thomas R.", content: "Très bien, je me sens plus fort !", time: '10:15' },
    { from: "Lucas M.", content: "Excellent ! Continue sur cette lancée 💪", time: '10:20' }
  ],
  trainingPlan: {
    name: "Programme Débutant",
    nextSession: 'Demain 14h00',
    exercises: [
      { name: 'Squat', sets: 3, reps: 10, weight: 40, rest: 120 },
      { name: 'Pompes', sets: 3, reps: 12, weight: 0, rest: 90 },
      { name: 'Planche', sets: 3, duration: '30s', rest: 60 }
    ]
  }
};
