/**
 * Synrgy LanguageContext — Professional i18n manager
 * Persistent language selection with localStorage
 * @module LanguageContext
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { t, type Language } from "../i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "synrgy_lang";
const DEFAULT_LANGUAGE: Language = "fr";

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * LanguageProvider — Global language state manager
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage or default
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "fr" || stored === "en") ? stored : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    // Persist to localStorage on change
    localStorage.setItem(STORAGE_KEY, language);
    console.log(`🈳 LanguageContext loaded: ${language}`);
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang === "fr" || lang === "en") {
      setLanguageState(lang);
    } else {
      console.warn(`Invalid language: ${lang}, falling back to ${DEFAULT_LANGUAGE}`);
      setLanguageState(DEFAULT_LANGUAGE);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "fr" ? "en" : "fr"));
  };

  const translate = (key: string): string => {
    return t(language, key);
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage,
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage hook — Access language context
 * @throws Error if used outside LanguageProvider
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
