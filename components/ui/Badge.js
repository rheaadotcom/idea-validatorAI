'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Badge({ children, variant = 'default', className = '', icon: Icon = null }) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all';

  const variants = {
    default: 'bg-brand-500/10 text-brand-500 border border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400 dark:border-brand-500/30',
    success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-600 border border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30',
    outline: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </motion.span>
  );
}
