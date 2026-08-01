'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * ProgressBar - animated horizontal progress bar.
 * Props:
 *   percentage (0-100) - progress amount
 *   className - additional tailwind classes
 */
export default function ProgressBar({ percentage = 0, className = '' }) {
  const safePercent = Math.min(100, Math.max(0, percentage));
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${safePercent}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
