/**
 * 🌍 LANGUAGE SELECTOR COMPONENT
 * 
 * Dropdown to switch between supported languages
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', label: '🇫🇷 Français', name: 'Français' },
  { code: 'en', label: '🇬🇧 English', name: 'English' },
];

/**
 * LanguageSelector Component
 * Allows users to switch between FR/EN
 */
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'fr' | 'en');
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <select
        value={language}
        onChange={handleChange}
        className="
          appearance-none
          bg-white/10
          backdrop-blur-md
          border
          border-white/20
          rounded-lg
          px-3
          py-1.5
          pr-8
          text-sm
          text-white
          cursor-pointer
          hover:bg-white/20
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-400
          focus:ring-offset-2
          focus:ring-offset-transparent
          transition-all
        "
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            className="bg-gray-900 text-white"
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;

