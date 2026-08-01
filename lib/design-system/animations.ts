/**
 * Framer Motion Animation Presets & Transition Curves
 * Global SaaS Design System
 */

import { Variants, Transition } from "framer-motion"

export const transitions = {
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } as Transition,
  normal: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } as Transition,
  slow: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } as Transition,
  spring: { type: "spring", stiffness: 300, damping: 24 } as Transition,
  bounce: { type: "spring", stiffness: 400, damping: 15 } as Transition,
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.normal },
  exit: { opacity: 0, transition: transitions.fast },
}

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: transitions.slow },
  exit: { opacity: 0, y: -12, transition: transitions.fast },
}

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: transitions.slow },
  exit: { opacity: 0, y: 12, transition: transitions.fast },
}

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: transitions.slow },
  exit: { opacity: 0, x: -24, transition: transitions.fast },
}

export const slideRight: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: transitions.slow },
  exit: { opacity: 0, x: 24, transition: transitions.fast },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.normal },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
}

export const zoomIn: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.85, transition: transitions.fast },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: transitions.normal },
}

export const hoverScale = {
  whileHover: { scale: 1.02, transition: transitions.fast },
  whileTap: { scale: 0.98, transition: transitions.fast },
}

export const hoverLift = {
  whileHover: { y: -4, transition: transitions.normal },
}
