'use client';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface TouchCardProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  enableHaptic?: boolean;
  enableRipple?: boolean;
}

const TouchCard = React.forwardRef<HTMLDivElement, TouchCardProps>(
  (
    {
      children,
      className,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      swipeThreshold = 100,
      enableHaptic = true,
      enableRipple = true,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = React.useState<Array<{ id: string; x: number; y: number }>>([]);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [10, -10]);
    const rotateY = useTransform(x, [-300, 300], [-10, 10]);

    // Haptic feedback function
    const triggerHaptic = React.useCallback(async (style: ImpactStyle = ImpactStyle.Light) => {
      if (!enableHaptic) return;

      try {
        await Haptics.impact({ style });
      } catch (error) {
        // Silently fail on unsupported devices
      }
    }, [enableHaptic]);

    // Create ripple effect
    const createRipple = React.useCallback((event: React.TouchEvent | React.MouseEvent) => {
      if (!enableRipple) return;

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = 'touches' in event
        ? event.touches[0].clientX - rect.left
        : (event as React.MouseEvent).clientX - rect.left;
      const y = 'touches' in event
        ? event.touches[0].clientY - rect.top
        : (event as React.MouseEvent).clientY - rect.top;

      const newRipple = { id: Math.random().toString(36), x, y };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }, [enableRipple]);

    // Handle pan end for swipe gestures
    const handlePanEnd = React.useCallback(
      (event: any, info: PanInfo) => {
        const { offset, velocity } = info;

        // Check horizontal swipe
        if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
          if (offset.x > 0 && onSwipeRight) {
            triggerHaptic(ImpactStyle.Medium);
            onSwipeRight();
          } else if (offset.x < 0 && onSwipeLeft) {
            triggerHaptic(ImpactStyle.Medium);
            onSwipeLeft();
          }
        }

        // Check vertical swipe
        if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > 500) {
          if (offset.y > 0 && onSwipeDown) {
            triggerHaptic(ImpactStyle.Medium);
            onSwipeDown();
          } else if (offset.y < 0 && onSwipeUp) {
            triggerHaptic(ImpactStyle.Medium);
            onSwipeUp();
          }
        }

        // Reset position
        x.set(0);
        y.set(0);
      },
      [x, y, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHaptic],
    );

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md active:shadow-lg select-none',
          className,
        )}
        style={{
          x,
          y,
          rotateX,
          rotateY,
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onPanEnd={handlePanEnd}
        onTouchStart={createRipple}
        onMouseDown={createRipple}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}

        {/* Touch Ripples */}
        {enableRipple &&
          ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className='absolute pointer-events-none rounded-full bg-primary/20'
              initial={{
                x: ripple.x - 10,
                y: ripple.y - 10,
                width: 20,
                height: 20,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                scale: 2,
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
      </motion.div>
    );
  },
);

TouchCard.displayName = 'TouchCard';

export { TouchCard, type TouchCardProps };