'use client';

import { useEffect, useCallback } from 'react';
import { useAudioSystem } from './use-audio-system';

/**
 * Hook for managing loading audio loops
 * Automatically starts/stops hammering sounds for critical loading operations
 */
export const useLoadingAudio = () => {
  const { startLoadingLoop, stopLoadingLoop, preferences } = useAudioSystem();

  // Start loading loop for critical operations
  const startCriticalLoading = useCallback(
    (delayMs: number = 3000) => {
      startLoadingLoop('critical', delayMs);
    },
    [startLoadingLoop]
  );

  // Start loading loop for long operations
  const startLongLoading = useCallback(
    (delayMs: number = 3000) => {
      startLoadingLoop('smooth', delayMs);
    },
    [startLoadingLoop]
  );

  // Stop any loading loop
  const stopLoading = useCallback(() => {
    stopLoadingLoop();
  }, [stopLoadingLoop]);

  // Hook for automatic loading management
  const useAutoLoading = useCallback(
    (isLoading: boolean, type: 'critical' | 'smooth' = 'critical', delayMs: number = 3000) => {
      useEffect(() => {
        if (isLoading) {
          if (type === 'critical') {
            startCriticalLoading(delayMs);
          } else {
            startLongLoading(delayMs);
          }
        } else {
          stopLoading();
        }

        // Cleanup on unmount
        return () => {
          stopLoading();
        };
      }, [isLoading, type, delayMs]);
    },
    [startCriticalLoading, startLongLoading, stopLoading]
  );

  return {
    // Manual control
    startCriticalLoading,
    startLongLoading,
    stopLoading,

    // Automatic hook
    useAutoLoading,

    // Check if loading audio is enabled
    isEnabled: preferences.loadingLooping.enabled,
    criticalEnabled: preferences.loadingLooping.criticalOperations,
    longEnabled: preferences.loadingLooping.longOperations,
  };
};