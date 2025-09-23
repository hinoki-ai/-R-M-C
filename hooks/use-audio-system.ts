'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

// Audio preferences interface
interface AudioPreferences {
  masterVolume: number;
  categories: {
    ui: boolean;
    voice: boolean;
    alerts: boolean;
  };
  categoryVolumes: {
    ui: number;
    voice: number;
    alerts: number;
  };
}

// Default audio preferences
const DEFAULT_PREFERENCES: AudioPreferences = {
  masterVolume: 0.7,
  categories: {
    ui: true,
    voice: true,
    alerts: true,
  },
  categoryVolumes: {
    ui: 0.3,
    voice: 0.4,
    alerts: 0.8,
  },
};

// Audio file mappings organized by category and action
const AUDIO_FILES = {
  // UI interaction sounds
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
    feedback: {
      success: '/audio/ui/clicks/feedback-success.mp3',
      warning: '/audio/ui/clicks/feedback-warning.mp3',
      error: '/audio/ui/clicks/feedback-error.mp3',
      info: '/audio/ui/clicks/feedback-info.mp3',
      'info-alt': '/audio/ui/clicks/feedback-info-alt.mp3',
      'info-extra': '/audio/ui/clicks/feedback-info-extra.mp3',
    },
    success: [
      '/audio/community/voice/ui-success-1.mp3',
      '/audio/community/voice/ui-success-2.mp3',
    ],
    error: [
      '/audio/community/voice/ui-error-1.mp3',
      '/audio/community/voice/ui-error-2.mp3',
    ],
    notification: [
      '/audio/community/voice/ui-notification-1.mp3',
      '/audio/community/voice/ui-notification-2.mp3',
      '/audio/community/voice/ui-notification-3.mp3',
      '/audio/community/voice/ui-notification-4.mp3',
      '/audio/community/voice/ui-notification-5.mp3',
    ],
  },

  // Community voice announcements
  voice: {
    welcome: [
      '/audio/community/voice/welcome-short-1.mp3',
      '/audio/community/voice/welcome-short-2.mp3',
      '/audio/community/voice/welcome-medium-1.mp3',
      '/audio/community/voice/welcome-medium-2.mp3',
      '/audio/community/voice/welcome-long-1.mp3',
    ],
    intro: [
      '/audio/community/voice/intro-community-1.mp3',
      '/audio/community/voice/intro-community-2.mp3',
      '/audio/community/voice/intro-community-3.mp3',
      '/audio/community/voice/intro-features-1.mp3',
      '/audio/community/voice/intro-features-2.mp3',
    ],
    meeting: [
      '/audio/community/voice/meeting-1.mp3',
      '/audio/community/voice/meeting-2.mp3',
    ],
    event: [
      '/audio/community/voice/event-1.mp3',
    ],
    maintenance: [
      '/audio/community/voice/maintenance-1.mp3',
      '/audio/community/voice/maintenance-2.mp3',
    ],
    announce: {
      general: [
        '/audio/community/voice/announce-general-1.mp3',
        '/audio/community/voice/announce-general-2.mp3',
        '/audio/community/voice/announce-general-3.mp3',
      ],
    },
    weather: [
      '/audio/community/voice/weather-1.mp3',
      '/audio/community/voice/weather-2.mp3',
    ],
    status: [
      '/audio/community/voice/status-1.mp3',
    ],
    calendar: [
      '/audio/community/voice/calendar-1.mp3',
      '/audio/community/voice/calendar-2.mp3',
      '/audio/community/voice/calendar-3.mp3',
    ],
    service: [
      '/audio/community/voice/service-1.mp3',
      '/audio/community/voice/service-2.mp3',
      '/audio/community/voice/service-3.mp3',
    ],
  },

  // Emergency alert sounds (highest priority)
  alert: {
    emergency: [
      '/audio/community/voice/alert-emergency-1.mp3',
      '/audio/community/voice/alert-emergency-2.mp3',
    ],
  },
};

export const useAudioSystem = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [preferences, setPreferences] = useState<AudioPreferences>(DEFAULT_PREFERENCES);

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

  // Clean up previous audio
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Get audio file path for specific action
  const getAudioFile = useCallback((
    category: keyof typeof AUDIO_FILES,
    action: string,
    subtype?: string,
    variant?: number
  ): string | null => {
    const categoryFiles = AUDIO_FILES[category];
    if (!categoryFiles) return null;

    // Handle nested structures (click.primary, announce.general, etc.)
    if (typeof categoryFiles === 'object' && action in categoryFiles) {
      const actionFiles = (categoryFiles as any)[action];

      if (subtype && typeof actionFiles === 'object' && subtype in actionFiles) {
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
  }, []);

  // Play audio with preferences applied
  const playAudio = useCallback(async (
    category: keyof typeof AUDIO_FILES,
    action: string,
    subtype?: string,
    variant?: number
  ) => {
    if (typeof window === 'undefined') return;

    // Check if category is enabled
    if (!preferences.categories[category]) return;

    const audioFile = getAudioFile(category, action, subtype, variant);
    if (!audioFile) {
      console.warn(`Audio file not found: ${category}.${action}${subtype ? '.' + subtype : ''}`);
      return;
    }

    try {
      cleanup();

      const audio = new Audio(audioFile);
      audio.volume = preferences.masterVolume * preferences.categoryVolumes[category];
      audio.preload = 'none';

      audio.play().catch((error) => {
        console.warn(`Failed to play audio ${audioFile}:`, error);
      });

      audioRef.current = audio;
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [preferences, getAudioFile, cleanup]);

  // Convenience methods for common actions
  const playUI = useCallback((action: string, subtype?: string) => {
    playAudio('ui', action, subtype);
  }, [playAudio]);

  const playVoice = useCallback((action: string, subtype?: string, variant?: number) => {
    playAudio('voice', action, subtype, variant);
  }, [playAudio]);

  const playAlert = useCallback((action: string, variant?: number) => {
    playAudio('alert', action, undefined, variant);
  }, [playAudio]);

  // Specific convenience methods for common use cases
  const playWelcome = useCallback(() => playVoice('welcome'), [playVoice]);
  const playEmergency = useCallback(() => playAlert('emergency'), [playAlert]);
  const playSuccess = useCallback(() => playUI('success'), [playUI]);
  const playError = useCallback(() => playUI('error'), [playUI]);
  const playNavigation = useCallback(() => playUI('click', 'navigation'), [playUI]);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<AudioPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

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

    // Preferences management
    preferences,
    updatePreferences,
    resetPreferences,

    // Utility methods
    cleanup,
  };
};