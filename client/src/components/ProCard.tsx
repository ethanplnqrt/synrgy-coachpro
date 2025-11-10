/**
 * ProCard — Premium glassmorphism card component
 * Reusable card for dashboard, landing, and feature displays
 * @module ProCard
 */

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export interface ProCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  highlight?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * ProCard component with premium glassmorphic design
 */
const ProCard: React.FC<ProCardProps> = ({
  title,
  description,
  icon,
  highlight = false,
  children,
  onClick,
  className = "",
}) => {
  const baseClasses = `
    rounded-3xl p-6
    bg-white/10 backdrop-blur-lg
    border shadow-lg
    transition-all duration-300
    ${onClick ? "cursor-pointer" : ""}
  `;

  const borderClasses = highlight
    ? "border-transparent bg-gradient-to-br from-cyan-400/20 via-emerald-400/20 to-blue-400/20 animate-pulse-subtle"
    : "border-white/20 hover:border-white/30";

  const hoverClasses = onClick
    ? "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${baseClasses} ${borderClasses} ${hoverClasses} ${className}`.trim()}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={title}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-cyan-400 flex items-center justify-center w-12 h-12">
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-300 mb-4">
          {description}
        </p>
      )}

      {/* Children (e.g., buttons, additional content) */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </motion.div>
  );
};

/**
 * ProCardHeader — Header section for ProCard
 */
export const ProCardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`mb-4 ${className}`.trim()}>
    {children}
  </div>
);

/**
 * ProCardTitle — Title component for ProCard
 */
export const ProCardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <h3 className={`text-xl font-semibold text-white ${className}`.trim()}>
    {children}
  </h3>
);

/**
 * ProCardContent — Content section for ProCard
 */
export const ProCardContent: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`text-sm text-gray-300 ${className}`.trim()}>
    {children}
  </div>
);

// Export as both named and default for flexibility
export { ProCard };
export default ProCard;
