import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '../styles/theme';
import { 
  coachLightTheme, 
  coachDarkTheme, 
  athleteLightTheme, 
  athleteDarkTheme,
  getThemeByRole,
  applyThemeVars 
} from '../styles/theme';
import { useAuth } from '../hooks/useAuth';

interface ThemeContextType {
  theme: Theme;
  themeName: "light" | "dark";
  setTheme: (themeName: "light" | "dark") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useAuth();
  const [themeName, setThemeName] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem('coachpro-theme') as "light" | "dark";
    return saved && (saved === 'light' || saved === 'dark') ? saved : 'light';
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    const role = user?.role || 'coach';
    return getThemeByRole(role as "coach" | "athlete", themeName);
  });

  // Update theme when user role changes
  useEffect(() => {
    const role = user?.role || 'coach';
    const newTheme = getThemeByRole(role as "coach" | "athlete", themeName);
    setTheme(newTheme);
  }, [user?.role, themeName]);

  useEffect(() => {
    applyThemeVars(theme);
    localStorage.setItem('coachpro-theme', themeName);
  }, [theme, themeName]);

  const handleSetTheme = (newThemeName: "light" | "dark") => {
    setThemeName(newThemeName);
  };

  const toggleTheme = () => {
    const newThemeName = themeName === 'light' ? 'dark' : 'light';
    handleSetTheme(newThemeName);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeName,
      setTheme: handleSetTheme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
