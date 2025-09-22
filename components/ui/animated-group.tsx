'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import React from 'react';

export type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing';

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
  as?: React.ElementType;
  asChild?: React.ElementType;
};

const defaultContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  fade: {},
  slide: {
    hidden: { y: 20 },
    visible: { y: 0 },
  },
  scale: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 },
  },
  blur: {
    hidden: { filter: 'blur(4px)' },
    visible: { filter: 'blur(0px)' },
  },
  'blur-slide': {
    hidden: { filter: 'blur(4px)', y: 20 },
    visible: { filter: 'blur(0px)', y: 0 },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { type: 'spring', stiffness: 200, damping: 15 },
    },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { type: 'spring', stiffness: 300, damping: 8 },
    },
  },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = 'div',
  asChild = 'div',
}: AnimatedGroupProps) {
  const selectedVariants = {
    item: addDefaultVariants(preset ? presetVariants[preset] : {}),
    container: addDefaultVariants(defaultContainerVariants),
  };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  const MotionComponent = React.useMemo(() => {
    // If 'as' is a string, map it to the corresponding motion component
    if (typeof as === 'string') {
      const componentMap: Record<string, React.ComponentType<any>> = {
        div: motion.div,
        span: motion.span,
        p: motion.p,
        h1: motion.h1,
        h2: motion.h2,
        h3: motion.h3,
        h4: motion.h4,
        h5: motion.h5,
        h6: motion.h6,
        ul: motion.ul,
        ol: motion.ol,
        li: motion.li,
        section: motion.section,
        article: motion.article,
        aside: motion.aside,
        header: motion.header,
        footer: motion.footer,
        nav: motion.nav,
        main: motion.main,
      }
      return componentMap[as] || motion.div
    }
    // If 'as' is a React component, wrap it with motion
    return motion(as)
  }, [as]);

  const MotionChild = React.useMemo(() => {
    // If 'asChild' is a string, map it to the corresponding motion component
    if (typeof asChild === 'string') {
      const componentMap: Record<string, React.ComponentType<any>> = {
        div: motion.div,
        span: motion.span,
        p: motion.p,
        h1: motion.h1,
        h2: motion.h2,
        h3: motion.h3,
        h4: motion.h4,
        h5: motion.h5,
        h6: motion.h6,
        ul: motion.ul,
        ol: motion.ol,
        li: motion.li,
        section: motion.section,
        article: motion.article,
        aside: motion.aside,
        header: motion.header,
        footer: motion.footer,
        nav: motion.nav,
        main: motion.main,
      }
      return componentMap[asChild] || motion.div
    }
    // If 'asChild' is a React component, wrap it with motion
    return motion(asChild)
  }, [asChild]);

  return (
    <MotionComponent
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}

export { AnimatedGroup };
