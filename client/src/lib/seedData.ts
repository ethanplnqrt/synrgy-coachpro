// Données seed pour Synrgy Pro
export const seedUsers = [
  {
    id: "coach_1",
    email: "coach@synrgy.app",
    username: "coach_pro",
    password: "password123",
    fullName: "Alexandre Dubois",
    role: "coach",
    avatarUrl: "https://ui-avatars.com/api/?name=Alexandre+Dubois&background=FF6B3D&color=fff",
    isPro: true,
    stripeCustomerId: "cus_coach123",
    stripeSubscriptionId: "sub_coach123"
  },
  {
    id: "athlete_1",
    email: "athlete1@synrgy.app",
    username: "athlete_1",
    password: "password123",
    fullName: "Léa Martin",
    role: "athlete",
    avatarUrl: "https://ui-avatars.com/api/?name=Léa+Martin&background=4ADE80&color=fff",
    isPro: true,
    coachId: "coach_1"
  },
  {
    id: "athlete_2",
    email: "athlete2@synrgy.app",
    username: "athlete_2",
    password: "password123",
    fullName: "Maxime Rousseau",
    role: "athlete",
    avatarUrl: "https://ui-avatars.com/api/?name=Maxime+Rousseau&background=60A5FA&color=fff",
    isPro: true,
    coachId: "coach_1"
  }
];

export const seedClients = [
  {
    id: "client_1",
    coachId: "coach_1",
    athleteId: "athlete_1",
    status: "active",
    startDate: new Date("2024-01-01"),
    notes: "Objectif prise de masse, niveau intermédiaire"
  },
  {
    id: "client_2",
    coachId: "coach_1",
    athleteId: "athlete_2",
    status: "active",
    startDate: new Date("2024-01-15"),
    notes: "Objectif perte de graisse, débutant"
  }
];

export const seedTrainingPlans = [
  {
    id: "plan_1",
    coachId: "coach_1",
    name: "Prise de masse - Force & Hypertrophie",
    description: "Programme 12 semaines pour prise de masse musculaire",
    type: "hypertrophy",
    duration: 12,
    isTemplate: true,
    isPublic: false,
    tags: ["force", "hypertrophie", "masse"]
  },
  {
    id: "plan_2",
    coachId: "coach_1",
    name: "Perte de graisse - Cardio & Musculation",
    description: "Programme 8 semaines pour perte de graisse",
    type: "endurance",
    duration: 8,
    isTemplate: true,
    isPublic: false,
    tags: ["cardio", "perte_graisse", "endurance"]
  }
];

export const seedExercises = [
  {
    id: "ex_1",
    name: "Développé couché",
    category: "Chest",
    muscleGroups: ["pectoraux", "triceps", "deltoïdes antérieurs"],
    equipment: "barbell",
    instructions: "Allongé sur le banc, descendre la barre jusqu'au torse puis pousser vers le haut",
    isCustom: false
  },
  {
    id: "ex_2",
    name: "Squat",
    category: "Legs",
    muscleGroups: ["quadriceps", "fessiers", "ischio-jambiers"],
    equipment: "barbell",
    instructions: "Barre sur les épaules, descendre jusqu'à ce que les cuisses soient parallèles au sol",
    isCustom: false
  },
  {
    id: "ex_3",
    name: "Soulevé de terre",
    category: "Back",
    muscleGroups: ["erecteurs", "fessiers", "ischio-jambiers", "trapèzes"],
    equipment: "barbell",
    instructions: "Saisir la barre, soulever en gardant le dos droit",
    isCustom: false
  }
];

export const seedNutritionPlans = [
  {
    id: "nutrition_1",
    coachId: "coach_1",
    athleteId: "athlete_1",
    name: "Plan Prise de Masse",
    description: "Plan nutritionnel pour prise de masse musculaire",
    targetCalories: 2800,
    targetProtein: 160,
    targetCarbs: 350,
    targetFat: 90,
    preferences: {
      dietaryRestrictions: [],
      allergies: [],
      mealCount: 5,
      cookingTime: 30
    },
    isActive: true
  },
  {
    id: "nutrition_2",
    coachId: "coach_1",
    athleteId: "athlete_2",
    name: "Plan Perte de Graisse",
    description: "Plan nutritionnel pour perte de graisse",
    targetCalories: 2000,
    targetProtein: 140,
    targetCarbs: 200,
    targetFat: 70,
    preferences: {
      dietaryRestrictions: ["végétarien"],
      allergies: ["noix"],
      mealCount: 4,
      cookingTime: 20
    },
    isActive: true
  }
];

export const seedCheckIns = [
  {
    id: "checkin_1",
    athleteId: "athlete_1",
    coachId: "coach_1",
    date: new Date(),
    mood: 8,
    sleep: 7.5,
    stress: 3,
    pain: 2,
    motivation: 9,
    adherence: 8,
    energy: 7,
    notes: "Excellente séance aujourd'hui, je me sens plus forte !",
    coachNotes: "Progression excellente, continuer sur cette lancée"
  },
  {
    id: "checkin_2",
    athleteId: "athlete_2",
    coachId: "coach_1",
    date: new Date(),
    mood: 6,
    sleep: 6.5,
    stress: 5,
    pain: 3,
    motivation: 7,
    adherence: 7,
    energy: 6,
    notes: "Difficile de tenir le rythme cette semaine",
    coachNotes: "Proposer un deload la semaine prochaine"
  }
];

export const seedHabits = [
  {
    id: "habit_1",
    athleteId: "athlete_1",
    name: "Eau",
    description: "Boire suffisamment d'eau",
    target: 8,
    unit: "verres",
    color: "#60A5FA",
    isActive: true
  },
  {
    id: "habit_2",
    athleteId: "athlete_1",
    name: "Pas",
    description: "Marcher au moins 10000 pas par jour",
    target: 10000,
    unit: "pas",
    color: "#4ADE80",
    isActive: true
  },
  {
    id: "habit_3",
    athleteId: "athlete_1",
    name: "Étirements",
    description: "S'étirer 15 minutes par jour",
    target: 15,
    unit: "min",
    color: "#F59E0B",
    isActive: true
  }
];

export const seedMessages = [
  {
    id: "msg_1",
    senderId: "athlete_1",
    recipientId: "coach_1",
    content: "Salut ! J'ai une question sur mon programme de cette semaine",
    type: "text",
    isRead: false,
    isAiGenerated: false
  },
  {
    id: "msg_2",
    senderId: "coach_1",
    recipientId: "athlete_1",
    content: "Bonjour Léa ! Je suis là pour t'aider, quelle est ta question ?",
    type: "text",
    isRead: true,
    isAiGenerated: false
  },
  {
    id: "msg_3",
    senderId: "athlete_2",
    recipientId: "coach_1",
    content: "Je stagne sur le développé couché, que me conseilles-tu ?",
    type: "text",
    isRead: false,
    isAiGenerated: false
  }
];

export const seedTasks = [
  {
    id: "task_1",
    coachId: "coach_1",
    athleteId: "athlete_2",
    title: "Réévaluer le plan de Maxime",
    description: "Stagnation sur le développé couché depuis 2 semaines",
    type: "ai_generated",
    priority: "high",
    status: "pending",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "task_2",
    coachId: "coach_1",
    athleteId: "athlete_1",
    title: "Programmer deload pour Léa",
    description: "Progression excellente, proposer une semaine de récupération",
    type: "coach",
    priority: "medium",
    status: "pending"
  }
];

export const seedBookings = [
  {
    id: "booking_1",
    coachId: "coach_1",
    athleteId: "athlete_1",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    type: "consultation",
    status: "scheduled",
    notes: "Consultation de suivi mensuel",
    videoUrl: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "booking_2",
    coachId: "coach_1",
    athleteId: "athlete_2",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    type: "check_in",
    status: "scheduled",
    notes: "Check-in hebdomadaire"
  }
];

export const seedAvailability = [
  {
    id: "avail_1",
    coachId: "coach_1",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "18:00",
    isRecurring: true,
    isActive: true
  },
  {
    id: "avail_2",
    coachId: "coach_1",
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "18:00",
    isRecurring: true,
    isActive: true
  },
  {
    id: "avail_3",
    coachId: "coach_1",
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "18:00",
    isRecurring: true,
    isActive: true
  },
  {
    id: "avail_4",
    coachId: "coach_1",
    dayOfWeek: 4, // Thursday
    startTime: "09:00",
    endTime: "18:00",
    isRecurring: true,
    isActive: true
  },
  {
    id: "avail_5",
    coachId: "coach_1",
    dayOfWeek: 5, // Friday
    startTime: "09:00",
    endTime: "18:00",
    isRecurring: true,
    isActive: true
  },
  {
    id: "avail_6",
    coachId: "coach_1",
    dayOfWeek: 6, // Saturday
    startTime: "10:00",
    endTime: "16:00",
    isRecurring: true,
    isActive: true
  }
];

export const seedSubscriptions = [
  {
    id: "sub_1",
    userId: "coach_1",
    stripeSubscriptionId: "sub_coach123",
    stripePriceId: "price_coach_pro",
    status: "active",
    currentPeriodStart: new Date("2024-01-01"),
    currentPeriodEnd: new Date("2024-02-01"),
    cancelAtPeriodEnd: false,
    trialEnd: new Date("2024-01-15")
  },
  {
    id: "sub_2",
    userId: "athlete_1",
    stripeSubscriptionId: "sub_athlete123",
    stripePriceId: "price_athlete_elite",
    status: "active",
    currentPeriodStart: new Date("2024-01-01"),
    currentPeriodEnd: new Date("2024-02-01"),
    cancelAtPeriodEnd: false,
    trialEnd: new Date("2024-01-15")
  }
];

// Fonction pour initialiser toutes les données seed
export const initializeSeedData = () => {
  // Stocker dans localStorage pour le mode démo
  localStorage.setItem('synrgy_seed_users', JSON.stringify(seedUsers));
  localStorage.setItem('synrgy_seed_clients', JSON.stringify(seedClients));
  localStorage.setItem('synrgy_seed_training_plans', JSON.stringify(seedTrainingPlans));
  localStorage.setItem('synrgy_seed_exercises', JSON.stringify(seedExercises));
  localStorage.setItem('synrgy_seed_nutrition_plans', JSON.stringify(seedNutritionPlans));
  localStorage.setItem('synrgy_seed_checkins', JSON.stringify(seedCheckIns));
  localStorage.setItem('synrgy_seed_habits', JSON.stringify(seedHabits));
  localStorage.setItem('synrgy_seed_messages', JSON.stringify(seedMessages));
  localStorage.setItem('synrgy_seed_tasks', JSON.stringify(seedTasks));
  localStorage.setItem('synrgy_seed_bookings', JSON.stringify(seedBookings));
  localStorage.setItem('synrgy_seed_availability', JSON.stringify(seedAvailability));
  localStorage.setItem('synrgy_seed_subscriptions', JSON.stringify(seedSubscriptions));
  
  console.log('✅ Données seed initialisées pour Synrgy Pro');
};
