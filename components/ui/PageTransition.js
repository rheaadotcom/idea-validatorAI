'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * PageTransition – wraps page content to provide a smooth fade/slide transition
 * between routes. Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }) {
  const shouldReduce = useReducedMotion();
  const variants = shouldReduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={window.location.pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        className="relative min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
