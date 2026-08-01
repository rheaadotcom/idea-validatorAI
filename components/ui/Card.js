'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hoverEffect = true, onClick, glow = null }) {
  const hoverVariants = hoverEffect
    ? {
        y: -8,
        scale: 1.03,
        boxShadow: '0 12px 20px -6px rgba(0,0,0,0.2)',
      }
    : {};

  const glowClass = glow ? `glow-${glow}` : '';

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverVariants}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${glowClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}
