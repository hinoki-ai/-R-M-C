'use client';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const touchButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:shadow-destructive/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        outline:
          'border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-accent/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:shadow-secondary/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        ghost:
          'hover:bg-accent hover:text-accent-foreground hover:shadow-sm dark:hover:bg-accent/50 transition-all duration-200',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        // Gradient variants
        gradientPrimary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        gradientSunset: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        gradientOcean: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        gradientForest: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        gradientWarm: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        gradientCool: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/25 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
      },
      size: {
        default: 'h-11 px-4 py-2 has-[>svg]:px-3', // Increased from h-9 to h-11 for better touch targets
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-lg px-6 has-[>svg]:px-4', // Increased from h-10 to h-12
        icon: 'size-11', // Increased from size-9 to size-11
      },
      haptic: {
        light: '',
        medium: '',
        heavy: '',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      haptic: 'light',
    },
  }
);

interface TouchRipple {
  id: string;
  x: number;
  y: number;
  size: number;
}

interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean;
  enableRipple?: boolean;
  longPressDelay?: number;
  onLongPress?: () => void;
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      className,
      variant,
      size,
      haptic = 'light',
      asChild = false,
      enableRipple = true,
      longPressDelay = 500,
      onLongPress,
      onClick,
      onTouchStart,
      onTouchEnd,
      onMouseDown,
      onMouseUp,
      children,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = React.useState<TouchRipple[]>([]);
    const [isPressed, setIsPressed] = React.useState(false);
    const [longPressTimer, setLongPressTimer] = React.useState<NodeJS.Timeout | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Haptic feedback function
    const triggerHaptic = React.useCallback(async (style: ImpactStyle = ImpactStyle.Light) => {
      if (haptic === 'none') return;

      try {
        switch (haptic) {
          case 'light':
            await Haptics.impact({ style: ImpactStyle.Light });
            break;
          case 'medium':
            await Haptics.impact({ style: ImpactStyle.Medium });
            break;
          case 'heavy':
            await Haptics.impact({ style: ImpactStyle.Heavy });
            break;
        }
      } catch (error) {
        // Silently fail on haptic errors (web, unsupported devices)
        console.warn('Haptic feedback not available:', error);
      }
    }, [haptic]);

    // Create ripple effect
    const createRipple = React.useCallback((event: React.TouchEvent | React.MouseEvent) => {
      if (!enableRipple) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = 'touches' in event
        ? event.touches[0].clientX - rect.left
        : (event as React.MouseEvent).clientX - rect.left;
      const y = 'touches' in event
        ? event.touches[0].clientY - rect.top
        : (event as React.MouseEvent).clientY - rect.top;

      const newRipple: TouchRipple = {
        id: Math.random().toString(36),
        x,
        y,
        size,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }, [enableRipple]);

    // Handle touch start
    const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      createRipple(event);
      triggerHaptic();

      // Start long press timer
      if (onLongPress) {
        const timer = setTimeout(() => {
          triggerHaptic(ImpactStyle.Medium);
          onLongPress();
        }, longPressDelay);
        setLongPressTimer(timer);
      }

      onTouchStart?.(event);
    }, [createRipple, triggerHaptic, onLongPress, longPressDelay, onTouchStart]);

    // Handle touch end
    const handleTouchEnd = React.useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
      setIsPressed(false);

      // Clear long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }

      onTouchEnd?.(event);
    }, [longPressTimer, onTouchEnd]);

    // Handle mouse down (for desktop testing)
    const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      createRipple(event);
      onMouseDown?.(event);
    }, [createRipple, onMouseDown]);

    // Handle mouse up
    const handleMouseUp = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onMouseUp?.(event);
    }, [onMouseUp]);

    // Handle click with haptic feedback
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      triggerHaptic();
      onClick?.(event);
    }, [triggerHaptic, onClick]);

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={buttonRef}
        data-slot='touch-button'
        className={cn(touchButtonVariants({ variant, size, haptic, className }), {
          'active:scale-[0.98]': isPressed,
        })}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        {...props}
      >
        {children}

        {/* Touch Ripples */}
        {enableRipple && ripples.map((ripple) => (
          <span
            key={ripple.id}
            className='absolute pointer-events-none rounded-full bg-white/30 animate-ping'
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </Comp>
    );
  }
);

TouchButton.displayName = 'TouchButton';

export { TouchButton, touchButtonVariants, type TouchButtonProps };