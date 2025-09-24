import { useCallback, useEffect, useState } from 'react';

interface AnimationMetrics {
  totalAnimations: number;
  reducedMotionUsers: number;
  averageAnimationTime: number;
  fps: number;
  frameTime: number;
}

export function usePerformanceAnimations() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [metrics, setMetrics] = useState<AnimationMetrics>({
    totalAnimations: 0,
    reducedMotionUsers: 0,
    averageAnimationTime: 0,
    fps: 60,
    frameTime: 16.67,
  });

  // Initialize metrics with safe defaults
  useEffect(() => {
    setMetrics({
      totalAnimations: 0,
      reducedMotionUsers: isReducedMotion ? 1 : 0,
      averageAnimationTime: 0,
      fps: 60,
      frameTime: 16.67,
    });
  }, [isReducedMotion]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const fadeIn = useCallback(
    (element: HTMLElement, duration: number = 300) => {
      if (isReducedMotion || !element) return Promise.resolve();

      return new Promise<void>(resolve => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;

        requestAnimationFrame(() => {
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        });
      });
    },
    [isReducedMotion]
  );

  const scale = useCallback(
    (element: HTMLElement, scaleValue: number, duration: number = 200) => {
      if (isReducedMotion || !element) return Promise.resolve();

      return new Promise<void>(resolve => {
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = `scale(${scaleValue})`;

        setTimeout(() => {
          element.style.transform = 'scale(1)';
          setTimeout(resolve, duration);
        }, duration);
      });
    },
    [isReducedMotion]
  );

  const useIntersectionAnimation = useCallback((threshold: number = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const [ref, setRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold }
      );

      observer.observe(ref);
      return () => observer.disconnect();
    }, [ref, threshold]);

    return { ref: setRef, isVisible };
  }, []);

  return {
    fadeIn,
    scale,
    isReducedMotion,
    metrics,
    useIntersectionAnimation,
  };
}
