/**
 * Mobile Platform Utilities
 * Unified platform detection and APIs for perfect web/mobile integration
 */

import { Capacitor } from '@capacitor/core';

// Platform detection
export const Platform = {
  // Check if running on mobile native platform
  isNative: (): boolean => {
    return Capacitor.isNativePlatform();
  },

  // Get current platform
  getPlatform: (): string => {
    return Capacitor.getPlatform();
  },

  // Check if running on web
  isWeb: (): boolean => {
    return Capacitor.getPlatform() === 'web';
  },

  // Check if running on Android
  isAndroid: (): boolean => {
    return Capacitor.getPlatform() === 'android';
  },

  // Check if running on iOS
  isIOS: (): boolean => {
    return Capacitor.getPlatform() === 'ios';
  },

  // Check if it's a mobile build
  isMobileBuild: (): boolean => {
    return process.env.MOBILE_BUILD === 'true';
  },
};

// Device capabilities
export const DeviceCapabilities = {
  // Check if device supports touch
  supportsTouch: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Check if device supports vibration
  supportsVibration: (): boolean => {
    return 'vibrate' in navigator;
  },

  // Check if device supports geolocation
  supportsGeolocation: (): boolean => {
    return 'geolocation' in navigator;
  },

  // Check if device supports notifications
  supportsNotifications: (): boolean => {
    return 'Notification' in window;
  },

  // Get device pixel ratio
  getPixelRatio: (): number => {
    return window.devicePixelRatio || 1;
  },

  // Check if running in standalone mode (PWA)
  isStandalone: (): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  },
};

// Unified storage API
export class UnifiedStorage {
  private static isNative(): boolean {
    return Platform.isNative();
  }

  static async getItem(key: string): Promise<string | null> {
    if (this.isNative()) {
      // Use Capacitor Preferences plugin
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      // Use localStorage
      return localStorage.getItem(key);
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    if (this.isNative()) {
      // Use Capacitor Preferences plugin
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key, value });
    } else {
      // Use localStorage
      localStorage.setItem(key, value);
    }
  }

  static async removeItem(key: string): Promise<void> {
    if (this.isNative()) {
      // Use Capacitor Preferences plugin
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key });
    } else {
      // Use localStorage
      localStorage.removeItem(key);
    }
  }

  static async clear(): Promise<void> {
    if (this.isNative()) {
      // Use Capacitor Preferences plugin
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.clear();
    } else {
      // Use localStorage
      localStorage.clear();
    }
  }
}

// Unified vibration API
export class UnifiedVibration {
  static vibrate(pattern: number | number[]): void {
    if (DeviceCapabilities.supportsVibration()) {
      navigator.vibrate(pattern);
    }
  }

  static success(): void {
    this.vibrate([50, 50, 50]);
  }

  static error(): void {
    this.vibrate([200, 100, 200]);
  }

  static warning(): void {
    this.vibrate([100, 50, 100, 50, 100]);
  }

  static tap(): void {
    this.vibrate(50);
  }
}

// Unified haptic feedback (iOS specific, but safe to call on all platforms)
export class UnifiedHaptic {
  static async impact(
    style: 'light' | 'medium' | 'heavy' = 'medium'
  ): Promise<void> {
    if (Platform.isIOS()) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        switch (style) {
          case 'light':
            await Haptics.impact({ style: ImpactStyle.Light });
            break;
          case 'medium':
            await Haptics.impact({ style: ImpactStyle.Medium });
            break;
          case 'heavy':
            await Haptics.impact({ style: ImpactStyle.Heavy });
            break;
        }
      } catch (error) {
        // Fallback to vibration
        UnifiedVibration.tap();
      }
    } else {
      // Fallback to vibration on Android/web
      UnifiedVibration.tap();
    }
  }

  static async notification(
    type: 'success' | 'error' | 'warning' = 'success'
  ): Promise<void> {
    if (Platform.isIOS()) {
      try {
        const { Haptics, NotificationType } = await import(
          '@capacitor/haptics'
        );
        switch (type) {
          case 'success':
            await Haptics.notification({ type: NotificationType.Success });
            break;
          case 'error':
            await Haptics.notification({ type: NotificationType.Error });
            break;
          case 'warning':
            await Haptics.notification({ type: NotificationType.Warning });
            break;
        }
      } catch (error) {
        // Fallback to vibration
        UnifiedVibration[type]();
      }
    } else {
      // Fallback to vibration
      UnifiedVibration[type]();
    }
  }
}

// Theme management with platform-specific optimizations
export class UnifiedTheme {
  private static currentTheme: 'light' | 'dark' | 'system' = 'system';
  private static systemThemeListener:
    | ((event: MediaQueryListEvent) => void)
    | null = null;

  static setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentTheme = theme;

    // Remove existing system theme listener
    if (this.systemThemeListener) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', this.systemThemeListener);
      this.systemThemeListener = null;
    }

    // Add system theme listener if theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemThemeListener = event => {
        // Just update mobile theme when system theme changes, don't apply CSS classes
        if (Platform.isNative()) {
          this.updateMobileTheme('system');
        }
      };
      mediaQuery.addEventListener('change', this.systemThemeListener);
    }

    if (Platform.isNative()) {
      // On mobile, also update system UI colors
      this.updateMobileTheme(theme);
    }

    // Note: CSS class management is now handled by next-themes
    // this.applyTheme(theme) - removed to prevent conflicts
  }

  private static async updateMobileTheme(
    theme: 'light' | 'dark' | 'system'
  ): Promise<void> {
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar');

      if (theme === 'dark') {
        await StatusBar.setStyle({ style: Style.Dark });
        if (Platform.isAndroid()) {
          await StatusBar.setBackgroundColor({ color: '#000000' });
        }
      } else {
        await StatusBar.setStyle({ style: Style.Light });
        if (Platform.isAndroid()) {
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
        }
      }
    } catch (error) {
      console.warn('Failed to update mobile theme:', error);
    }
  }

  private static applyTheme(theme: 'light' | 'dark' | 'system'): void {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  static getCurrentTheme(): 'light' | 'dark' | 'system' {
    return this.currentTheme;
  }
}

// Network status monitoring
export class NetworkMonitor {
  private static listeners: ((isOnline: boolean) => void)[] = [];

  static initialize(): void {
    window.addEventListener('online', () => this.notifyListeners(true));
    window.addEventListener('offline', () => this.notifyListeners(false));
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static addListener(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private static notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => listener(isOnline));
  }
}

// Initialize platform-specific features
export function initializeMobileFeatures(): void {
  // Initialize network monitoring
  NetworkMonitor.initialize();

  // Set up mobile-specific event listeners
  if (Platform.isNative()) {
    // Handle app state changes (background/foreground)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('App went to background');
      } else {
        console.log('App came to foreground');
      }
    });
  }
}

// Export everything as a unified API
export const MobileAPI = {
  Platform,
  DeviceCapabilities,
  UnifiedStorage,
  UnifiedVibration,
  UnifiedHaptic,
  UnifiedTheme,
  NetworkMonitor,
  initializeMobileFeatures,
};
