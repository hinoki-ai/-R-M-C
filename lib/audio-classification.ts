/**
 * Audio Classification System for Pellines
 *
 * Classifies audio files by duration and potency to ensure appropriate usage
 * across different contexts and user preferences.
 */

export interface AudioClassification {
  duration: 'short' | 'medium' | 'long';
  potency: 'soft' | 'medium' | 'loud';
  category: 'ui' | 'voice' | 'alert';
  recommendedContexts: string[];
  volumeMultiplier: number;
}

// Duration thresholds (approximate based on file analysis)
// - Short: < 1 second (15KB files)
// - Medium: 1-3 seconds (29KB files)
// - Long: > 3 seconds (36KB+ files)

const AUDIO_CLASSIFICATIONS: Record<string, AudioClassification> = {
  // UI Sounds - Generally soft potency, short duration
  'ui.click.primary': {
    duration: 'short',
    potency: 'soft',
    category: 'ui',
    recommendedContexts: [
      'primary actions',
      'confirmations',
      'main navigation',
    ],
    volumeMultiplier: 0.3,
  },
  'ui.click.secondary': {
    duration: 'short',
    potency: 'soft',
    category: 'ui',
    recommendedContexts: ['secondary actions', 'minor interactions'],
    volumeMultiplier: 0.25,
  },
  'ui.click.accent': {
    duration: 'short',
    potency: 'soft',
    category: 'ui',
    recommendedContexts: ['accent actions', 'highlighted elements'],
    volumeMultiplier: 0.35,
  },
  'ui.hover.primary': {
    duration: 'short',
    potency: 'soft',
    category: 'ui',
    recommendedContexts: ['hover states', 'preview interactions'],
    volumeMultiplier: 0.2,
  },

  // Voice Announcements - Medium potency, varying duration
  'voice.welcome.short': {
    duration: 'short',
    potency: 'medium',
    category: 'voice',
    recommendedContexts: ['quick greetings', 'page transitions'],
    volumeMultiplier: 0.4,
  },
  'voice.welcome.medium': {
    duration: 'medium',
    potency: 'medium',
    category: 'voice',
    recommendedContexts: ['standard welcomes', 'section introductions'],
    volumeMultiplier: 0.45,
  },
  'voice.welcome.long': {
    duration: 'long',
    potency: 'medium',
    category: 'voice',
    recommendedContexts: [
      'detailed introductions',
      'first-time user experience',
    ],
    volumeMultiplier: 0.5,
  },
  'voice.announce.general': {
    duration: 'medium',
    potency: 'medium',
    category: 'voice',
    recommendedContexts: ['general announcements', 'updates', 'information'],
    volumeMultiplier: 0.5,
  },
  'voice.weather': {
    duration: 'short',
    potency: 'medium',
    category: 'voice',
    recommendedContexts: ['weather updates', 'environmental information'],
    volumeMultiplier: 0.45,
  },

  // Emergency Alerts - Loud potency, short duration
  'alert.emergency': {
    duration: 'short',
    potency: 'loud',
    category: 'alert',
    recommendedContexts: [
      'emergencies',
      'critical alerts',
      'safety notifications',
    ],
    volumeMultiplier: 0.8,
  },
};

/**
 * Get classification for an audio file path
 */
export const getAudioClassification = (
  audioPath: string
): AudioClassification | null => {
  // Extract category and action from path
  const pathParts = audioPath.split('/');
  if (pathParts.length < 3) return null;

  const category = pathParts[2]; // ui, community
  const type = pathParts[3]; // clicks, voice
  const fileName = pathParts[pathParts.length - 1].replace('.mp3', '');

  // Handle UI sounds
  if (category === 'ui' && type === 'clicks') {
    const action = fileName.replace('click-', '').replace('hover-', '');
    const actionType = fileName.startsWith('click-') ? 'click' : 'hover';
    const key = `ui.${actionType}.${action}`;
    return AUDIO_CLASSIFICATIONS[key] || null;
  }

  // Handle voice sounds
  if (category === 'community' && type === 'voice') {
    if (fileName.startsWith('welcome-')) {
      const duration = fileName.split('-')[1]; // short, medium, long
      return AUDIO_CLASSIFICATIONS[`voice.welcome.${duration}`] || null;
    }
    if (fileName.startsWith('announce-general-')) {
      return AUDIO_CLASSIFICATIONS['voice.announce.general'];
    }
    if (fileName.startsWith('weather-')) {
      return AUDIO_CLASSIFICATIONS['voice.weather'];
    }
    if (fileName.startsWith('alert-emergency-')) {
      return AUDIO_CLASSIFICATIONS['alert.emergency'];
    }
  }

  return null;
};

/**
 * Get recommended volume for audio context
 */
export const getRecommendedVolume = (
  category: 'ui' | 'voice' | 'alert',
  potency: 'soft' | 'medium' | 'loud',
  masterVolume: number = 1.0
): number => {
  const baseVolumes = {
    ui: 0.3,
    voice: 0.4,
    alert: 0.8,
  };

  const potencyMultipliers = {
    soft: 0.7,
    medium: 1.0,
    loud: 1.3,
  };

  return masterVolume * baseVolumes[category] * potencyMultipliers[potency];
};

/**
 * Usage guidelines for different contexts
 */
export const AUDIO_USAGE_GUIDELINES = {
  // Soft sounds for subtle interactions
  subtle: {
    recommended: ['ui.hover', 'ui.click.secondary'],
    avoid: ['alert.emergency', 'voice.welcome.long'],
  },

  // Medium sounds for balanced feedback
  balanced: {
    recommended: [
      'ui.click.primary',
      'voice.welcome.medium',
      'voice.announce.general',
    ],
    avoid: ['alert.emergency'],
  },

  // Loud sounds for important notifications
  attention: {
    recommended: ['alert.emergency', 'ui.feedback.error'],
    avoid: ['ui.hover'],
  },

  // Quick sounds for fast interactions
  quick: {
    recommended: ['ui.click', 'ui.hover', 'voice.welcome.short'],
    avoid: ['voice.welcome.long', 'voice.announce.general'],
  },

  // Extended sounds for detailed information
  detailed: {
    recommended: ['voice.welcome.long', 'voice.announce.general'],
    avoid: ['ui.click', 'ui.hover', 'alert.emergency'],
  },
};

/**
 * Validate audio usage against guidelines
 */
export const validateAudioUsage = (
  audioKey: string,
  context: keyof typeof AUDIO_USAGE_GUIDELINES
): { valid: boolean; message: string } => {
  const classification = AUDIO_CLASSIFICATIONS[audioKey];
  if (!classification) {
    return {
      valid: false,
      message: `Unknown audio classification: ${audioKey}`,
    };
  }

  const guidelines = AUDIO_USAGE_GUIDELINES[context];
  const isRecommended = guidelines.recommended.some(rec =>
    audioKey.startsWith(rec)
  );
  const shouldAvoid = guidelines.avoid.some(avoid =>
    audioKey.startsWith(avoid)
  );

  if (shouldAvoid) {
    return {
      valid: false,
      message: `${audioKey} is not recommended for ${context} context (too ${classification.potency}/${classification.duration})`,
    };
  }

  if (!isRecommended) {
    return {
      valid: true,
      message: `${audioKey} is acceptable for ${context} context, but consider recommended options`,
    };
  }

  return {
    valid: true,
    message: `${audioKey} is well-suited for ${context} context`,
  };
};
