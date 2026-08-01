'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon = null,
  ...props
}) {
  const [ripple, setRipple] = useState(null);
const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 border border-brand-400/30 focus:ring-brand-500',
    shiny: 'relative overflow-hidden bg-gradient-to-r from-brand-600 via-accent-violet to-accent-cyan text-white shadow-glow-primary hover:shadow-glow-violet focus:ring-accent-violet',
    secondary: 'bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border border-slate-300/50 dark:border-slate-700/50 focus:ring-slate-400',
    outline: 'bg-transparent border border-slate-300 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 focus:ring-slate-400',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/30 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs space-x-1.5',
    md: 'px-4 py-2 text-sm space-x-2', // ensure proper spacing between icon and text
    lg: 'px-6 py-3 text-base space-x-2.5',
    xl: 'px-8 py-4 text-lg space-x-3 rounded-2xl',
  };
const handleClick = e => {
  const { left, top } = e.currentTarget.getBoundingClientRect();
  setRipple({ x: e.clientX - left, y: e.clientY - top });
  if (onClick) onClick(e);
};
  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span className="ml-2">{children}</span>
      {ripple && (
        <motion.span
          className="absolute bg-emerald-500/30 rounded-full pointer-events-none"
          style={{ left: ripple.x, top: ripple.y, width: 10, height: 10 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 12, opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
          onAnimationComplete={() => setRipple(null)}
        />
      )}
    </motion.button>
  );
}
