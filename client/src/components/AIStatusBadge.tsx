/**
 * 🤖 AI STATUS BADGE COMPONENT
 * 
 * Displays the current status of AI features (active/offline).
 * @module AIStatusBadge
 */

import React from 'react';
import { Brain, AlertCircle } from 'lucide-react';

export interface AIStatusBadgeProps {
  isActive: boolean;
  isLoading?: boolean;
  className?: string;
}

/**
 * AIStatusBadge Component
 * Shows AI service status with icon and text
 */
export function AIStatusBadge({
  isActive,
  isLoading = false,
  className = '',
}: AIStatusBadgeProps) {
  if (isLoading) {
    return (
      <div
        className={`
          inline-flex 
          items-center 
          gap-2 
          px-4 
          py-2 
          rounded-full 
          bg-gray-500/20 
          border 
          border-gray-500/30
          ${className}
        `.trim()}
      >
        <Brain className="w-4 h-4 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-400 font-medium">
          Vérification IA...
        </span>
      </div>
    );
  }

  if (isActive) {
    return (
      <div
        className={`
          inline-flex 
          items-center 
          gap-2 
          px-4 
          py-2 
          rounded-full 
          bg-emerald-500/20 
          border 
          border-emerald-500/30
          ${className}
        `.trim()}
      >
        <Brain className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-400 font-medium">
          IA Active 🧠
        </span>
      </div>
    );
  }

  return (
    <div
      className={`
        inline-flex 
        items-center 
        gap-2 
        px-4 
        py-2 
        rounded-full 
        bg-red-500/20 
        border 
        border-red-500/30
        ${className}
      `.trim()}
    >
      <AlertCircle className="w-4 h-4 text-red-400" />
      <span className="text-sm text-red-400 font-medium">
        IA Hors ligne 🔴
      </span>
    </div>
  );
}

export default AIStatusBadge;

