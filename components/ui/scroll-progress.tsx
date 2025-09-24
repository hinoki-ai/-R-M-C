'use client';

import { IconArrowUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import {
  useScrollDirection,
  useScrollProgress,
} from '@/hooks/use-scroll-enhancements';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
  showBackToTop?: boolean;
  backToTopThreshold?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScrollProgress({
  className,
  showBackToTop = true,
  backToTopThreshold = 300,
  size = 'md',
}: ScrollProgressProps) {
  const scrollProgress = useScrollProgress();
  const scrollDirection = useScrollDirection();
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);

  useEffect(() => {
    setShowBackToTopButton(scrollProgress > backToTopThreshold);
  }, [scrollProgress, backToTopThreshold]);

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50', className)}>
      {/* Progress Bar */}
      <div className="h-1 bg-muted/30 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 transition-all duration-300',
            showBackToTopButton
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none'
          )}
        >
          <button
            onClick={handleBackToTop}
            className={cn(
              'group relative flex items-center justify-center rounded-full',
              'bg-primary text-primary-foreground shadow-lg',
              'hover:bg-primary/90 hover:shadow-xl hover:scale-110',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              sizeClasses[size],
              'p-3'
            )}
            aria-label="Back to top"
          >
            <IconArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-popover text-popover-foreground rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Back to top
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// Scroll-triggered fade-in component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  threshold?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  duration = 600,
}: ScrollRevealProps) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, delay, threshold]);

  const directionClasses = {
    up: 'translate-y-8',
    down: 'translate-y-8',
    left: '-translate-x-8',
    right: 'translate-x-8',
    fade: 'opacity-0',
  };

  return (
    <div
      ref={setRef}
      className={cn(
        'transition-all ease-out',
        isVisible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? '0ms' : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered reveal for multiple children
interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 100,
  direction = 'up',
}: StaggerRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
