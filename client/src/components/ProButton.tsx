/**
 * ProButton — Professional glassmorphism button
 * Enhanced button component for coach dashboard actions
 * @module ProButton
 */

import React from "react";

export interface ProButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

/**
 * ProButton Component
 * Professional button with glassmorphic styling and variants
 */
export function ProButton({
  label,
  icon,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: ProButtonProps) {
  const baseClasses = `
    inline-flex 
    items-center 
    justify-center 
    gap-2
    rounded-2xl 
    px-5 
    py-2 
    font-semibold 
    text-white 
    backdrop-blur-md 
    transition-transform 
    duration-300
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-offset-transparent
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r 
      from-emerald-400 
      to-cyan-400 
      hover:scale-105 
      shadow-[0_0_15px_rgba(56,189,248,0.6)]
      focus:ring-cyan-400
      active:scale-95
    `,
    secondary: `
      bg-white/10 
      border 
      border-white/30 
      hover:bg-white/20
      hover:scale-105
      focus:ring-white/50
      active:scale-95
    `,
  };

  return (
    <button
      type="button"
      role="button"
      tabIndex={0}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      aria-label={label}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default ProButton;
