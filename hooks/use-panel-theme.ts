'use client';

import { useEffect, useState } from 'react';

type PanelTheme =
  | 'light'
  | 'dark'
  | 'vineyard'
  | 'ocean'
  | 'mountain'
  | 'patagonia'
  | 'pastel';

/**
 * Hook to detect the current panel theme based on document classes
 * Used by AutoPanel component for automatic theme-aware panel selection
 */
export function usePanelTheme(): PanelTheme {
  const [theme, setTheme] = useState<PanelTheme>('light');

  useEffect(() => {
    const updateTheme = () => {
      // Check for custom theme classes first
      const customThemes: PanelTheme[] = [
        'vineyard',
        'ocean',
        'mountain',
        'patagonia',
        'pastel',
      ];
      const activeCustomTheme = customThemes.find(themeClass =>
        document.documentElement.classList.contains(themeClass)
      );

      if (activeCustomTheme) {
        setTheme(activeCustomTheme);
        return;
      }

      // Check for light/dark theme
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Initial check
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
