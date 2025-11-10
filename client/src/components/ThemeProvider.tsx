import React, { createContext, useContext, useEffect, useState } from 'react';

// Thème par défaut
const defaultTheme = {
  background: "#0B1220",
  text: "#E5E7EB",
  accent: "#FF6B3D",
};

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
  warning: string;
  danger: string;
  info: string;
}

interface ThemeContextType {
  theme: 'dark';
  themeName: 'dark';
  colors: ThemeColors;
  setTheme: (theme: 'dark') => void;
  toggleTheme: () => void;
}

const darkThemeColors: ThemeColors = {
  background: "#0B1220",
  foreground: "#E5E7EB",
  primary: "#FF6B3D",
  secondary: "#4ADE80",
  muted: "#6B7280",
  warning: "#F59E0B",
  danger: "#F87171",
  info: "#60A5FA",
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  themeName: 'dark',
  colors: darkThemeColors,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark'>('dark');

  useEffect(() => {
    // Force le thème sombre uniquement
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  const toggleTheme = () => {
    // Le thème sombre est le seul thème disponible
    console.log('Thème sombre unique - pas de bascule possible');
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeName: 'dark',
        colors: darkThemeColors,
        setTheme, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Retourner un contexte par défaut pour éviter les erreurs
    return {
      theme: 'dark' as const,
      themeName: 'dark' as const,
      colors: darkThemeColors,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}