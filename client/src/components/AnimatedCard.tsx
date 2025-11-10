/**
 * 🎴 ANIMATED CARD COMPONENT
 * 
 * Wrapper card with Framer Motion animations for smooth entrance effects
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  hover?: boolean;
  className?: string;
}

/**
 * AnimatedCard Component
 * Card with fade-in and slide-up animation
 */
export function AnimatedCard({
  children,
  delay = 0,
  hover = false,
  className = '',
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`
        rounded-2xl
        p-6
        bg-white/5
        backdrop-blur-md
        border
        border-white/10
        shadow-lg
        ${hover ? 'transition-transform duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;

