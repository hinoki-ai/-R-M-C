import { Variants } from 'framer-motion';

// Common animation variants for consistent motion design
export const motionPresets = {
  // Fade in from bottom
  fadeInUp: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),

  // Fade in from top
  fadeInDown: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),

  // Fade in from left
  fadeInLeft: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),

  // Fade in from right
  fadeInRight: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),

  // Scale and fade in
  scaleIn: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),

  // Staggered children animation
  staggerContainer: (staggerDelay: number = 0.1): Variants => ({
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      } as any,
    },
  }),

  staggerItem: (delay: number = 0, duration: number = 0.6): Variants => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration, ease: 'easeOut' } as any,
  }),
};

// Common transitions
export const transitions = {
  smooth: { duration: 0.6, ease: 'easeOut' },
  bounce: { duration: 0.6, ease: 'easeOut' },
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
};

// Helper function to create motion props
export function createMotionProps(
  variant: keyof typeof motionPresets,
  delay: number = 0,
  duration: number = 0.6
) {
  const preset = motionPresets[variant];
  if (typeof preset === 'function') {
    return preset(delay, duration);
  }
  return preset;
}
