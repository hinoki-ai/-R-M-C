'use client';

import { useCallback } from 'react';
import { useAudioSystem } from './use-audio-system';

export const useCommunityVoice = () => {
  const { playVoice } = useAudioSystem();

  const playCommunityVoice = useCallback(
    (voiceType: string = 'welcome') => {
      // Map legacy voice types to new system
      const voiceMappings: Record<string, string> = {
        meetings: 'meeting',
        events: 'event',
        announcements: 'announce.general',
        services: 'service',
      };

      const mappedType = voiceMappings[voiceType] || voiceType;
      const [action, subtype] = mappedType.split('.');

      playVoice(action, subtype);
    },
    [playVoice]
  );

  const playWelcomeMessage = useCallback(() => {
    playVoice('welcome');
  }, [playVoice]);

  const playRandomVoice = useCallback(() => {
    // Play random community voice type
    const voiceTypes = [
      'welcome',
      'intro',
      'meeting',
      'event',
      'maintenance',
      'announce.general',
      'weather',
      'status',
      'calendar',
      'service',
    ];
    const randomType =
      voiceTypes[Math.floor(Math.random() * voiceTypes.length)];
    const [action, subtype] = randomType.split('.');
    playVoice(action, subtype);
  }, [playVoice]);

  return {
    playCommunityVoice,
    playWelcomeMessage,
    playRandomVoice,
  };
};
