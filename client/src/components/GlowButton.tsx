/**
 * GlowButton — Premium glassmorphic CTA button
 * Synrgy branding with glow effects and animations
 * @module GlowButton
 */

import React from "react";

export interface GlowButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

/**
 * GlowButton component with premium glassmorphism design
 */
export const GlowButton: React.FC<GlowButtonProps> = ({
  label,
  onClick,
  icon,
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-2xl px-6 py-3
    font-semibold tracking-wide
    backdrop-blur-md
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = variant === "primary"
    ? `
      bg-gradient-to-r from-cyan-400 to-emerald-400
      text-white
      shadow-lg
      hover:shadow-[0_0_20px_rgba(56,189,248,0.7)]
      hover:scale-[1.02]
      focus:ring-cyan-400
    `
    : `
      bg-white/10 border border-white/20
      text-white
      shadow-md
      hover:bg-white/20
      hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]
      hover:scale-[1.02]
      focus:ring-white
    `;

  return (
    <button
      type="button"
      role="button"
      tabIndex={0}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      aria-label={label}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default GlowButton;
