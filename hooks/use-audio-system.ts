'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

// Audio preferences interface
interface AudioPreferences {
  masterVolume: number;
  categories: {
    ui: boolean;
    voice: boolean;
    alerts: boolean;
    ambient: boolean; // New ambient category
    nature: boolean; // New nature ambient category
  };
  categoryVolumes: {
    ui: number;
    voice: number;
    alerts: number;
    ambient: number; // New ambient volume
    nature: number; // New nature volume
  };
  // Looping preferences for ambient sounds
  ambientLooping: {
    enabled: boolean;
    intervals: {
      notifications: number; // seconds between notification loops
      welcome: number; // minutes between welcome loops
      weather: number; // minutes between weather loops
      status: number; // minutes between status loops
      success: number; // minutes between success loops
      rocks: number; // minutes between rock ambient loops
      wood: number; // minutes between wood ambient loops
    };
  };
  // Loading loop preferences (different from ambient - context-aware)
  loadingLooping: {
    enabled: boolean; // Master toggle for loading loops
    criticalOperations: boolean; // Enable for critical loading states
    longOperations: boolean; // Enable for operations > 3 seconds
  };
}

// Default audio preferences
const DEFAULT_PREFERENCES: AudioPreferences = {
  masterVolume: 0.7,
  categories: {
    ui: true,
    voice: true,
    alerts: true,
    ambient: false, // Ambient looping disabled by default (user opt-in)
    nature: false, // Nature ambient disabled by default (user opt-in)
  },
  categoryVolumes: {
    ui: 0.3,
    voice: 0.4,
    alerts: 0.8,
    ambient: 0.1, // Very subtle ambient volume
    nature: 0.08, // Even more subtle nature volume
  },
  ambientLooping: {
    enabled: false, // Disabled by default
    intervals: {
      notifications: 45, // 45 seconds
      welcome: 7, // 7 minutes
      weather: 20, // 20 minutes
      status: 15, // 15 minutes
      success: 10, // 10 minutes
      rocks: 25, // 25 minutes (gentle nature sounds)
      wood: 30, // 30 minutes (sparse forest sounds)
    },
  },
  loadingLooping: {
    enabled: true, // Enabled by default for loading feedback
    criticalOperations: true, // Enable hammering sounds for critical ops
    longOperations: true, // Enable for operations taking > 3 seconds
  },
};

// Audio classification system
// Duration: short (< 1s), medium (1-3s), long (> 3s)
// Potency: soft (subtle), medium (balanced), loud (attention-grabbing)

// Fallback audio mappings for error recovery
const FALLBACK_AUDIO = {
  emergency: '/audio/alerts/emergency/alert-emergency-1.mp3',
  ui: '/audio/ui/clicks/click-primary.mp3',
  voice: '/audio/community/voice/community-voice-wind-mild-short-32.mp3',
  ambient: '/audio/ui/notifications/ui-notifications-little-mild-long-01.mp3',
  nature: '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-01-loopable.mp3',
};

// Audio file mappings organized by category, duration, and potency
const AUDIO_FILES = {
  // UI interaction sounds - typically soft potency, short duration (NOT LOOPABLE)
  ui: {
    click: {
      primary: '/audio/ui/clicks/click-primary.mp3',
      secondary: '/audio/ui/clicks/click-secondary.mp3',
      accent: '/audio/ui/clicks/click-accent.mp3',
      action: '/audio/ui/clicks/click-action.mp3',
      confirm: '/audio/ui/clicks/click-confirm.mp3',
      cancel: '/audio/ui/clicks/click-cancel.mp3',
      submit: '/audio/ui/clicks/click-submit.mp3',
      delete: '/audio/ui/clicks/click-delete.mp3',
      success: '/audio/ui/clicks/click-success.mp3',
      warning: '/audio/ui/clicks/click-warning.mp3',
      error: '/audio/ui/clicks/click-error.mp3',
      navigation: '/audio/ui/clicks/click-navigation.mp3',
    },
    hover: {
      primary: '/audio/ui/clicks/hover-primary.mp3',
      secondary: '/audio/ui/clicks/hover-secondary.mp3',
      accent: '/audio/ui/clicks/hover-accent.mp3',
      interactive: '/audio/ui/clicks/hover-interactive.mp3',
    },
    transition: {
      page: '/audio/ui/clicks/transition-page.mp3',
      modal: '/audio/ui/clicks/transition-modal.mp3',
      panel: '/audio/ui/clicks/transition-panel.mp3',
      loading: '/audio/ui/clicks/transition-loading.mp3',
    },
    // UI feedback sounds
    feedback: {
      success: [
        '/audio/ui/feedback/feedback-success.mp3',
        '/audio/ui/feedback/feedback-info.mp3',
        '/audio/ui/feedback/feedback-warning.mp3',
        '/audio/ui/feedback/feedback-info-alt.mp3',
        '/audio/ui/feedback/feedback-info-extra.mp3',
      ],
      error: [
        '/audio/ui/feedback/feedback-error.mp3',
      ],
      woodbreak: [
        '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-01-loopable.mp3',
        '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-02-loopable.mp3',
        '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-03-loopable.mp3',
        '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-04-loopable.mp3',
      ],
    },
    // UI interactions (use generated click sounds)
    interactions: {
      clicks: [
        '/audio/ui/clicks/click-primary.mp3',
        '/audio/ui/clicks/click-secondary.mp3',
        '/audio/ui/clicks/click-accent.mp3',
        '/audio/ui/clicks/click-action.mp3',
        '/audio/ui/clicks/click-confirm.mp3',
        '/audio/ui/clicks/click-cancel.mp3',
        '/audio/ui/clicks/click-submit.mp3',
        '/audio/ui/clicks/click-delete.mp3',
        '/audio/ui/clicks/click-success.mp3',
        '/audio/ui/clicks/click-warning.mp3',
        '/audio/ui/clicks/click-error.mp3',
        '/audio/ui/clicks/click-navigation.mp3',
      ],
      hovers: [
        '/audio/ui/clicks/hover-primary.mp3',
        '/audio/ui/clicks/hover-secondary.mp3',
        '/audio/ui/clicks/hover-accent.mp3',
        '/audio/ui/clicks/hover-interactive.mp3',
      ],
      transitions: [
        '/audio/ui/clicks/transition-page.mp3',
        '/audio/ui/clicks/transition-modal.mp3',
        '/audio/ui/clicks/transition-panel.mp3',
        '/audio/ui/clicks/transition-loading.mp3',
      ],
    },
  },

  // Community voice announcements - medium potency, varying duration (SELECTIVELY LOOPABLE)
  voice: {
    announcements: {
      general: [
        '/audio/community/voice/community-voice-wind-medium-long-03.mp3',
        '/audio/community/voice/community-voice-wind-medium-long-07.mp3',
        '/audio/community/voice/community-voice-wind-medium-long-09.mp3',
      ],
    },
    calendar: {
      events: [
        '/audio/community/voice/community-voice-wind-mild-short-32.mp3',
        '/audio/community/voice/community-voice-wind-mild-short-21.mp3',
        '/audio/community/voice/community-voice-wind-mild-short-26.mp3',
      ],
    },
    events: {
      general: [
        '/audio/community/voice/community-voice-wind-medium-extended-05.mp3',
      ],
    },
    maintenance: {
      alerts: [
        '/audio/community/voice/community-voice-wind-strong-very-long-06.mp3',
        '/audio/community/voice/community-voice-wind-medium-long-02.mp3',
      ],
    },
    meetings: {
      general: [
        '/audio/community/voice/community-voice-wind-mild-short-17.mp3',
        '/audio/community/voice/community-voice-wind-mild-short-15.mp3',
      ],
    },
    services: {
      general: [
        '/audio/community/voice/community-voice-wind-medium-long-04.mp3',
        '/audio/community/voice/community-voice-wind-medium-long-05.mp3',
        '/audio/community/voice/community-voice-wind-medium-long-08.mp3',
      ],
    },
    status: {
      updates: [
        '/audio/community/voice/community-voice-wind-mild-short-13.mp3',
      ],
    },
    introductions: [
      '/audio/community/voice/community-voice-wind-mild-short-32.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-21.mp3',
      '/audio/community/voice/community-voice-wind-medium-long-03.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-26.mp3',
      '/audio/community/voice/community-voice-wind-medium-long-07.mp3',
      '/audio/community/voice/community-voice-wind-strong-very-long-06.mp3',
      '/audio/community/voice/community-voice-wind-medium-extended-05.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-17.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-15.mp3',
      '/audio/community/voice/community-voice-wind-medium-long-09.mp3',
    ],
  },

  // Nature ambient sounds - for forest/nature atmosphere
  nature: {
    // Rolling rock sounds as ambient nature effects
    rocks: [
      '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-01-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-02-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-03-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-04-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-05-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-06-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-07-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-08-loopable.mp3',
      '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-09-loopable.mp3',
    ],
    // Wood sounds as ambient forest effects
    wood: [
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-01-loopable.mp3',
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-02-loopable.mp3',
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-03-loopable.mp3',
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-04-loopable.mp3',
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-05-loopable.mp3',
      '/audio/ambient/nature/wood/ambient-nature-wood-medium-long-06-loopable.mp3',
    ],
  },

  // Emergency alert sounds - loud potency, short duration (highest priority, NOT LOOPABLE)
  alert: {
    emergency: [
      '/audio/alerts/emergency/alert-emergency-1.mp3',
      '/audio/alerts/emergency/alert-emergency-2.mp3',
    ],
  },

  // Ambient loopable sounds - for background audio (TRULY LOOPABLE ~12-15 sounds)
  ambient: {
    // Background notifications (can loop every 30-60 seconds)
    notifications: [
      '/audio/ui/notifications/ui-notifications-little-mild-long-01.mp3',
      '/audio/ui/notifications/ui-notifications-little-mild-long-02.mp3',
      '/audio/ui/notifications/ui-notifications-little-mild-long-03.mp3',
      '/audio/ui/notifications/ui-notifications-little-mild-long-04.mp3',
      '/audio/ui/notifications/ui-notifications-little-mild-long-05.mp3',
    ],
    // Ambient welcome atmosphere (loop every 5-10 minutes) - use community voice files
    welcome: [
      '/audio/community/voice/community-voice-wind-mild-short-32.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-21.mp3',
      '/audio/community/voice/community-voice-wind-medium-long-03.mp3',
      '/audio/community/voice/community-voice-wind-mild-short-26.mp3',
    ],
    // Background weather updates (loop every 15-30 minutes)
    weather: [
      '/audio/ambient/weather/ambient-weather-thunder-powerful-short-01-loopable.mp3',
      '/audio/ambient/weather/ambient-weather-thunder-powerful-short-02-loopable.mp3',
    ],
    // Ambient status updates (loop every 10-20 minutes)
    status: ['/audio/community/voice/community-voice-wind-mild-short-13.mp3'],
    // Background success feedback (subtle loops for positive atmosphere)
    success: [
      '/audio/ui/feedback/feedback-success.mp3',
      '/audio/ui/feedback/feedback-info.mp3',
    ],
    // Critical loading loops - hammering sounds for important operations
    loading: {
      critical: [
        // Blacksmith hammering sounds - perfect for critical loading
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-01-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-02-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-03-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-04-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-05-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-06-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-07-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-08-loopable.mp3',
        '/audio/loaders/critical/loaders-critical-blacksmith-strong-long-09-loopable.mp3',
        // Fallback to transition sound
        '/audio/ui/clicks/transition-loading.mp3',
      ],
      // Rolling rock sounds for smoother operations (using nature rocks)
      smooth: [
        '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-01-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-02-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-03-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-mild-short-04-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-05-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-06-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-07-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-08-loopable.mp3',
        '/audio/ambient/nature/rocks/ambient-nature-rock-medium-long-09-loopable.mp3',
      ],
    },
  },
};

export const useAudioSystem = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientTimersRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioPoolRef = useRef<Set<HTMLAudioElement>>(new Set()); // Track all audio elements for cleanup
  const preloadCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map()); // Cache preloaded audio
  const [preferences, setPreferences] =
    useState<AudioPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audio-preferences');
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch (error) {
          console.warn('Failed to load audio preferences:', error);
        }
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Enhanced cleanup with proper memory management
  const cleanup = useCallback(() => {
    // Stop and cleanup main audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load(); // Reset the audio element
    }

    // Clear loading audio
    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current.currentTime = 0;
      loadingAudioRef.current.src = '';
      loadingAudioRef.current.load();
      loadingAudioRef.current = null;
    }

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Clear all ambient timers
    Object.values(ambientTimersRef.current).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    ambientTimersRef.current = {};

    // Cleanup audio pool - dispose of all tracked audio elements
    audioPoolRef.current.forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause();
      }
      if (audio) {
        audio.src = '';
        audio.load();
      }
    });
    audioPoolRef.current.clear();

    // Clear preload cache
    preloadCacheRef.current.clear();
  }, []);

  // Preload critical audio files for instant playback
  const preloadCriticalAudio = useCallback(() => {
    const criticalFiles = [
      // Emergency alerts - always preload these
      ...AUDIO_FILES.alert.emergency,
      // Common UI sounds
      AUDIO_FILES.ui.click.primary,
      AUDIO_FILES.ui.click.success,
      AUDIO_FILES.ui.click.error,
      AUDIO_FILES.ui.feedback.success[0],
      AUDIO_FILES.ui.feedback.error[0],
      // Transition sounds
      AUDIO_FILES.ui.transition.loading,
    ];

    criticalFiles.forEach(audioFile => {
      if (!preloadCacheRef.current.has(audioFile)) {
        try {
          const audio = new Audio(audioFile);
          audio.preload = 'auto';
          audio.volume = 0; // Silent preload

          // Add to pool for tracking
          audioPoolRef.current.add(audio);

          const handleLoad = () => {
            preloadCacheRef.current.set(audioFile, audio);
            audio.removeEventListener('canplaythrough', handleLoad);
          };

          const handleError = () => {
            audioPoolRef.current.delete(audio);
            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('canplaythrough', handleLoad);
          audio.addEventListener('error', handleError);

          // Load the audio
          audio.load();
        } catch (error) {
          console.warn(`Failed to preload audio: ${audioFile}`, error);
        }
      }
    });
  }, []);

  // Preload critical audio on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Delay preload to avoid blocking initial page load
      const preloadTimer = setTimeout(() => {
        preloadCriticalAudio();
      }, 1000);

      return () => clearTimeout(preloadTimer);
    }
  }, [preloadCriticalAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Get audio file path for specific action with fallback support
  const getAudioFile = useCallback(
    (
      category: keyof typeof AUDIO_FILES,
      action: string,
      subtype?: string,
      variant?: number,
      useFallback: boolean = false
    ): string | null => {
      // If fallback requested, return category fallback
      if (useFallback && FALLBACK_AUDIO[category as keyof typeof FALLBACK_AUDIO]) {
        return FALLBACK_AUDIO[category as keyof typeof FALLBACK_AUDIO];
      }

      const categoryFiles = AUDIO_FILES[category];
      if (!categoryFiles) return null;

      // Handle nested structures (click.primary, announce.general, etc.)
      if (typeof categoryFiles === 'object' && action in categoryFiles) {
        const actionFiles = (categoryFiles as any)[action];

        if (
          subtype &&
          typeof actionFiles === 'object' &&
          subtype in actionFiles
        ) {
          // For nested structures like announce.general
          const subtypeFiles = actionFiles[subtype];
          if (Array.isArray(subtypeFiles)) {
            return variant !== undefined && variant < subtypeFiles.length
              ? subtypeFiles[variant]
              : subtypeFiles[Math.floor(Math.random() * subtypeFiles.length)];
          }
          return subtypeFiles;
        } else if (Array.isArray(actionFiles)) {
          // For array structures like welcome, weather, etc.
          return variant !== undefined && variant < actionFiles.length
            ? actionFiles[variant]
            : actionFiles[Math.floor(Math.random() * actionFiles.length)];
        } else if (typeof actionFiles === 'string') {
          // For direct string mappings like click.primary
          return actionFiles;
        }
      }

      return null;
    },
    []
  );

  // Enhanced audio playback with fallback support
  const playAudioWithFallback = useCallback(
    async (
      category: keyof typeof AUDIO_FILES,
      action: string,
      subtype?: string,
      variant?: number,
      retryCount: number = 0
    ): Promise<boolean> => {
      const audioFile = getAudioFile(category, action, subtype, variant, retryCount > 0);

      if (!audioFile) {
        console.warn(`No audio file found for ${category}.${action}${subtype ? '.' + subtype : ''}`);
        return false;
      }

      try {
        // For non-ambient sounds, cleanup previous audio to prevent overlap
        if (category !== 'ambient' && category !== 'nature') {
          cleanup();
        }

        // Use preloaded audio if available, otherwise create new
        let audio: HTMLAudioElement;
        const preloadedAudio = preloadCacheRef.current.get(audioFile);

        if (preloadedAudio && preloadedAudio.readyState >= 2 && retryCount === 0) {
          // Clone the preloaded audio to allow multiple simultaneous plays
          audio = preloadedAudio.cloneNode() as HTMLAudioElement;
        } else {
          // Create new audio element
          audio = new Audio(audioFile);
          audio.preload = retryCount > 0 ? 'auto' : 'none'; // Force load on retry
        }

        audio.volume =
          preferences.masterVolume *
          preferences.categoryVolumes[
            category as keyof typeof preferences.categoryVolumes
          ];

        // Add to audio pool for tracking and cleanup
        audioPoolRef.current.add(audio);

        // Remove from pool when audio ends or errors
        const cleanupAudio = () => {
          audioPoolRef.current.delete(audio);
          // Don't cleanup src for preloaded audio clones
          if (!preloadCacheRef.current.has(audioFile)) {
            audio.src = '';
            audio.load();
          }
        };

        audio.addEventListener('ended', cleanupAudio);
        audio.addEventListener('abort', cleanupAudio);

        // Enhanced error handling with fallback
        const handleError = (error: Event) => {
          console.warn(`Audio playback failed for ${audioFile}:`, error);
          cleanupAudio();

          // Try fallback if this is the first attempt
          if (retryCount === 0) {
            console.log(`Trying fallback audio for ${category} category`);
            playAudioWithFallback(category, action, subtype, variant, retryCount + 1);
          }
        };

        audio.addEventListener('error', handleError);

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          await playPromise;
        }

        // For non-looping sounds, set as current audio ref
        if (category !== 'ambient' && category !== 'nature') {
          audioRef.current = audio;
        }

        return true;

      } catch (error) {
        console.error(`Error playing audio ${audioFile}:`, error);

        // Try fallback if this is the first attempt
        if (retryCount === 0) {
          console.log(`Trying fallback audio for ${category} category`);
          return playAudioWithFallback(category, action, subtype, variant, retryCount + 1);
        }

        return false;
      }
    },
    [preferences, getAudioFile, cleanup]
  );

  // Play audio with preferences applied and enhanced error handling
  const playAudio = useCallback(
    async (
      category: keyof typeof AUDIO_FILES,
      action: string,
      subtype?: string,
      variant?: number
    ) => {
      if (typeof window === 'undefined') return;

      // Check if category is enabled
      if (
        !preferences.categories[category as keyof typeof preferences.categories]
      )
        return;

      // Use enhanced playback with fallback support
      await playAudioWithFallback(category, action, subtype, variant);
    },
    [preferences, playAudioWithFallback]
  );

  // Convenience methods for common actions
  const playUI = useCallback(
    (action: string, subtype?: string) => {
      playAudio('ui', action, subtype);
    },
    [playAudio]
  );

  const playVoice = useCallback(
    (action: string, subtype?: string, variant?: number) => {
      playAudio('voice', action, subtype, variant);
    },
    [playAudio]
  );

  const playAlert = useCallback(
    (action: string, variant?: number) => {
      playAudio('alert', action, undefined, variant);
    },
    [playAudio]
  );

  // Specific convenience methods for common use cases
  const playWelcome = useCallback(() => playVoice('welcome'), [playVoice]);
  const playEmergency = useCallback(() => playAlert('emergency'), [playAlert]);
  const playSuccess = useCallback(() => playUI('success'), [playUI]);
  const playError = useCallback(() => playUI('error'), [playUI]);
  const playNavigation = useCallback(
    () => playUI('click', 'navigation'),
    [playUI]
  );

  // Ambient looping functionality
  const startAmbientLoop = useCallback(
    (ambientType: keyof typeof AUDIO_FILES.ambient | keyof typeof AUDIO_FILES.nature) => {
      const isNatureSound = ambientType in AUDIO_FILES.nature;
      const categoryEnabled = isNatureSound
        ? preferences.categories.nature
        : preferences.categories.ambient;

      if (!categoryEnabled || !preferences.ambientLooping.enabled) return;

      // Clear existing timer for this type
      if (ambientTimersRef.current[ambientType]) {
        clearInterval(ambientTimersRef.current[ambientType]!);
      }

      const intervalMs = (() => {
        switch (ambientType) {
          case 'notifications':
            return preferences.ambientLooping.intervals.notifications * 1000;
          case 'welcome':
            return preferences.ambientLooping.intervals.welcome * 60 * 1000;
          case 'weather':
            return preferences.ambientLooping.intervals.weather * 60 * 1000;
          case 'status':
            return preferences.ambientLooping.intervals.status * 60 * 1000;
          case 'success':
            return preferences.ambientLooping.intervals.success * 60 * 1000;
          case 'rocks':
            return preferences.ambientLooping.intervals.rocks * 60 * 1000;
          case 'wood':
            return preferences.ambientLooping.intervals.wood * 60 * 1000;
          default:
            return 60000; // 1 minute fallback
        }
      })();

      const category = isNatureSound ? 'nature' : 'ambient';

      // Start the loop
      ambientTimersRef.current[ambientType] = setInterval(() => {
        playAudio(category as any, ambientType);
      }, intervalMs);

      // Play immediately for first time
      playAudio(category as any, ambientType);
    },
    [preferences, playAudio]
  );

  const stopAmbientLoop = useCallback(
    (ambientType: keyof typeof AUDIO_FILES.ambient | keyof typeof AUDIO_FILES.nature) => {
      if (ambientTimersRef.current[ambientType]) {
        clearInterval(ambientTimersRef.current[ambientType]!);
        ambientTimersRef.current[ambientType] = null;
      }
    },
    []
  );

  const startAllAmbientLoops = useCallback(() => {
    if (preferences.categories.ambient && preferences.ambientLooping.enabled) {
      Object.keys(AUDIO_FILES.ambient).forEach(key => {
        startAmbientLoop(key as keyof typeof AUDIO_FILES.ambient);
      });
    }
    if (preferences.categories.nature && preferences.ambientLooping.enabled) {
      Object.keys(AUDIO_FILES.nature).forEach(key => {
        startAmbientLoop(key as keyof typeof AUDIO_FILES.nature);
      });
    }
  }, [preferences, startAmbientLoop]);

  const stopAllAmbientLoops = useCallback(() => {
    Object.keys(ambientTimersRef.current).forEach(key => {
      stopAmbientLoop(key as keyof typeof AUDIO_FILES.ambient | keyof typeof AUDIO_FILES.nature);
    });
  }, [stopAmbientLoop]);

  // Nature-specific ambient methods
  const startNatureLoop = useCallback((natureType: keyof typeof AUDIO_FILES.nature) => {
    startAmbientLoop(natureType);
  }, [startAmbientLoop]);

  const stopNatureLoop = useCallback((natureType: keyof typeof AUDIO_FILES.nature) => {
    stopAmbientLoop(natureType);
  }, [stopAmbientLoop]);

  // Loading loop functionality - context-aware loops for loading states
  const startLoadingLoop = useCallback(
    (loadingType: 'critical' | 'smooth' = 'critical', delayMs: number = 3000) => {
      if (
        !preferences.loadingLooping.enabled ||
        (loadingType === 'critical' && !preferences.loadingLooping.criticalOperations) ||
        (loadingType === 'smooth' && !preferences.loadingLooping.longOperations)
      ) {
        return;
      }

      // Clear any existing loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Start loading loop after delay (to avoid spam for quick operations)
      loadingTimeoutRef.current = setTimeout(() => {
        if (loadingAudioRef.current) return; // Already playing

        const audioFiles = AUDIO_FILES.ambient.loading[loadingType];
        if (!audioFiles || audioFiles.length === 0) return;

        const audioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

        try {
          const audio = new Audio(audioFile);
          audio.volume =
            preferences.masterVolume *
            preferences.categoryVolumes.ambient *
            1.5; // Slightly louder for loading feedback
          audio.loop = true; // Enable looping for continuous hammering sound
          audio.preload = 'none';

          // Add to audio pool for tracking
          audioPoolRef.current.add(audio);

          // Remove from pool when stopped
          const cleanupLoadingAudio = () => {
            audioPoolRef.current.delete(audio);
            audio.src = '';
            audio.load();
          };

          audio.addEventListener('error', cleanupLoadingAudio);
          audio.addEventListener('abort', cleanupLoadingAudio);

          const playPromise = audio.play();

          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn(`Failed to play loading audio ${audioFile}:`, error);
              cleanupLoadingAudio();
            });
          }

          loadingAudioRef.current = audio;
        } catch (error) {
          console.error('Error starting loading loop:', error);
        }
      }, delayMs);
    },
    [preferences]
  );

  const stopLoadingLoop = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current.currentTime = 0;
      loadingAudioRef.current = null;
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(
    (newPreferences: Partial<AudioPreferences>) => {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    },
    []
  );

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    // Audio playback methods
    playUI,
    playVoice,
    playAlert,
    playWelcome,
    playEmergency,
    playSuccess,
    playError,
    playNavigation,

    // Generic play method for advanced usage
    playAudio,

    // Ambient looping methods (for ~12-15 truly loopable sounds)
    startAmbientLoop,
    stopAmbientLoop,
    startAllAmbientLoops,
    stopAllAmbientLoops,

    // Nature ambient methods (for forest/nature atmosphere)
    startNatureLoop,
    stopNatureLoop,

    // Loading loop methods (context-aware for critical operations)
    startLoadingLoop,
    stopLoadingLoop,

    // Preferences management
    preferences,
    updatePreferences,
    resetPreferences,

    // Utility methods
    cleanup,
  };
};
