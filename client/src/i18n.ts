/**
 * Synrgy i18n — Minimal translation system
 * Supports FR/EN with extensible structure
 * @module i18n
 */

export type Language = "fr" | "en";

export interface TranslationMessages {
  [key: string]: string;
}

export interface I18nMessages {
  fr: TranslationMessages;
  en: TranslationMessages;
}

export const i18nMessages: I18nMessages = {
  fr: {
    // Common
    start: "Démarrer",
    cancelAnytime: "Annulable à tout moment",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    
    // Auth
    login: "Connexion",
    signup: "Inscription",
    logout: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    
    // Plans
    choosePlan: "Choisir cette formule",
    perMonth: "/mois",
    client: "Client",
    coach: "Coach",
    
    // Features
    aiCoaching: "Coaching IA personnalisé",
    smartProgram: "Programme d'entraînement intelligent",
    nutritionPlan: "Plan nutrition interactif",
    aiChat: "Chat IA + suivi automatisé",
    synrgyScore: "Progression mesurée par SynrgyScore™",
    
    // Dashboard
    welcome: "Bienvenue",
    dashboard: "Tableau de bord",
    clients: "Clients",
    programs: "Programmes",
    nutrition: "Nutrition",
    settings: "Paramètres",
  },
  en: {
    // Common
    start: "Start",
    cancelAnytime: "Cancelable anytime",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    email: "Email",
    password: "Password",
    
    // Plans
    choosePlan: "Choose this plan",
    perMonth: "/month",
    client: "Client",
    coach: "Coach",
    
    // Features
    aiCoaching: "Personalized AI coaching",
    smartProgram: "Smart training program",
    nutritionPlan: "Interactive nutrition plan",
    aiChat: "AI Chat + automated tracking",
    synrgyScore: "Progress tracked by SynrgyScore™",
    
    // Dashboard
    welcome: "Welcome",
    dashboard: "Dashboard",
    clients: "Clients",
    programs: "Programs",
    nutrition: "Nutrition",
    settings: "Settings",
  },
};

/**
 * Translation function
 * @param lang - Target language ("fr" | "en")
 * @param key - Translation key
 * @returns Translated string or key if not found
 */
export const t = (lang: Language, key: string): string => {
  return i18nMessages[lang]?.[key] || key;
};

// Log initialization
console.log("🌍 i18n initialized (languages: fr, en)");

export default { i18nMessages, t };

