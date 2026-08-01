'use client';

import { motion } from 'framer-motion';
import React from 'react';

/**
 * FadeInSection - wraps content and applies a fade-in + upward slide animation when rendered.
 * Usage: <FadeInSection>...</FadeInSection>
 */
export default function FadeInSection({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
