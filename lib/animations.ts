/**
 * Common animation variants for consistent motion across the app
 * Only includes the most frequently used patterns to avoid over-engineering
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
};

/**
 * Creates staggered animation with delay based on index
 */
export const createStaggeredAnimation = (
  baseAnimation: any,
  index: number,
  staggerDelay: number = 0.1
) => ({
  ...baseAnimation,
  transition: {
    ...baseAnimation.transition,
    delay: index * staggerDelay,
  },
});

/**
 * Container animation for staggering children
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
