import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  magnetic?: boolean;
  glowOnHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  magnetic = false,
  glowOnHover = false,
  className,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md',
        glowOnHover && 'hover:shadow-lg hover:shadow-primary/20',
        className
      )}
      whileHover={magnetic ? { scale: 1.02 } : undefined}
      whileTap={magnetic ? { scale: 0.98 } : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
};

interface FloatingElementProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  delay = 0,
  children,
  className,
}) => {
  return (
    <motion.div
      className={cn('', className)}
      initial={{ y: 0 }}
      animate={{
        y: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

interface PulseElementProps {
  pulse?: boolean;
  pulseColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const PulseElement: React.FC<PulseElementProps> = ({
  pulse = false,
  pulseColor = 'currentColor',
  children,
  className,
}) => {
  if (!pulse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('relative', className)}
      animate={{
        boxShadow: [`0 0 0 0 ${pulseColor}40`, `0 0 0 8px ${pulseColor}00`],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export const MagneticButton: React.FC = () => {
  return (
    <button
      className="bg-purple-500 text-white py-3 px-6 rounded-2xl"
      aria-hidden="false"
    >
      Magnetic Button
    </button>
  );
};

export const AnotherButton: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <button className="text-lg font-bold m-1.5">Another Button</button>
    </div>
  );
};

export const ThirdButton: React.FC = () => {
  return (
    <button className="border-2 border-orange-500 bg-transparent py-2 px-4">
      Third Button
    </button>
  );
};
