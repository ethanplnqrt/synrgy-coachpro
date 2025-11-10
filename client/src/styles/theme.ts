// /client/src/styles/theme.ts
export type Theme = {
  name: "light" | "dark";
  role: "coach" | "athlete";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    foreground: string;
    success: string;
    warning?: string;
    muted?: string;
  };
};

// Coach themes
export const coachLightTheme: Theme = {
  name: "light",
  role: "coach",
  colors: {
    primary: "#F97316",   // orange vif
    secondary: "#4ADE80", // vert clair
    background: "#FFFFFF",
    surface: "#F1F5F9",
    foreground: "#111827",
    success: "#22C55E",
    warning: "#FFD54F",
    muted: "#E5E7EB",
  },
};

export const coachDarkTheme: Theme = {
  name: "dark",
  role: "coach",
  colors: {
    primary: "#EA580C",   // orange foncé
    secondary: "#16A34A", // vert foncé
    background: "#0F172A",
    surface: "#1E293B",
    foreground: "#E5E7EB",
    success: "#22C55E",
    warning: "#FACC15",
    muted: "#334155",
  },
};

// Athlete themes
export const athleteLightTheme: Theme = {
  name: "light",
  role: "athlete",
  colors: {
    primary: "#2563EB",   // bleu profond
    secondary: "#8B5CF6", // violet énergique
    background: "#FFFFFF",
    surface: "#F1F5F9",
    foreground: "#111827",
    success: "#22C55E",
    warning: "#FFD54F",
    muted: "#E5E7EB",
  },
};

export const athleteDarkTheme: Theme = {
  name: "dark",
  role: "athlete",
  colors: {
    primary: "#3B82F6",   // bleu clair
    secondary: "#A855F7", // violet clair
    background: "#0F172A",
    surface: "#1E293B",
    foreground: "#E5E7EB",
    success: "#22C55E",
    warning: "#FACC15",
    muted: "#334155",
  },
};

// Legacy themes for backward compatibility
export const lightTheme = coachLightTheme;
export const darkTheme = coachDarkTheme;

// Utilitaire pour obtenir le thème selon le rôle
export function getThemeByRole(role: "coach" | "athlete", mode: "light" | "dark"): Theme {
  if (role === "coach") {
    return mode === "light" ? coachLightTheme : coachDarkTheme;
  } else {
    return mode === "light" ? athleteLightTheme : athleteDarkTheme;
  }
}

// Utilitaire optionnel : applique les variables CSS
export function applyThemeVars(t: Theme) {
  const r = document.documentElement;
  r.style.setProperty("--color-primary", t.colors.primary);
  r.style.setProperty("--color-secondary", t.colors.secondary);
  r.style.setProperty("--color-bg", t.colors.background);
  r.style.setProperty("--color-surface", t.colors.surface);
  r.style.setProperty("--color-foreground", t.colors.foreground);
  r.style.setProperty("--color-success", t.colors.success);
  if (t.colors.warning) r.style.setProperty("--color-warning", t.colors.warning);
  if (t.colors.muted) r.style.setProperty("--color-muted", t.colors.muted);
  
  // Variables Synrgy
  r.style.setProperty("--color-synrgy-primary", "#2563EB");
  r.style.setProperty("--color-synrgy-secondary", "#06B6D4");
  r.style.setProperty("--color-synrgy-accent", "#8B5CF6");
}