'use client';

import { useCallback } from 'react';
import { useAudioSystem } from './use-audio-system';

// Navigation sound variations for variety
const NAVIGATION_SOUNDS = [
  'click.primary',
  'click.secondary',
  'click.accent',
  'hover.primary',
  'transition.page',
  'feedback.success',
  'click.success',
  'click.warning',
  'click.error',
  'hover.secondary',
  'transition.modal',
  'feedback.info',
  'feedback.info-alt',
  'feedback.info-extra',
  'click.navigation',
  'click.action',
  'click.confirm',
  'hover.accent',
  'transition.panel',
  'click.cancel',
  'click.submit',
  'click.delete',
  'hover.interactive',
  'transition.loading',
  'feedback.warning',
  'feedback.error',
];

export const useNavigationSound = () => {
  const { playUI } = useAudioSystem();

  const playRandomSound = useCallback(() => {
    const randomSound =
      NAVIGATION_SOUNDS[Math.floor(Math.random() * NAVIGATION_SOUNDS.length)];
    const [action, subtype] = randomSound.split('.');

    // Use the main audio system with consistent volume settings
    playUI(action, subtype);
  }, [playUI]);

  return { playRandomSound };
};
