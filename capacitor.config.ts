import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const isDev = process.env.NODE_ENV === 'development';
const productionUrl =
  process.env.CAPACITOR_SERVER_URL ||
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL;

const config: CapacitorConfig = {
  appId: 'com.juntadevecinos.app',
  appName: 'Pinto Los Pellines',
  webDir: 'public',
  plugins: {
    // Splash Screen
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
    },

    // Status Bar
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },

    // Keyboard
    Keyboard: {
      style: KeyboardStyle.Dark,
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },

    // Push Notifications (if needed)
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    // Camera (if needed)
    Camera: {
      quality: 90,
      allowEditing: true,
      resultType: 'base64',
      saveToGallery: false,
      width: 1024,
      height: 1024,
      correctOrientation: true,
    },

    // Geolocation (if needed)
    Geolocation: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },

    // Haptics
    Haptics: {},

    // Preferences (for unified storage)
    Preferences: {},

    // App (for app state monitoring and lifecycle)
    App: {
      // App plugin handles app state and lifecycle events
    },

    // Browser (for external link handling)
    Browser: {
      // Browser plugin for opening external URLs with better mobile experience
    },

    // Device (for device information and platform detection)
    Device: {
      // Device plugin for getting detailed device information
    },

    // Network (for network status monitoring)
    Network: {
      // Network plugin for connectivity monitoring
    },
  },

  // Server configuration
  // - Development: point to local dev server
  // - Production: load from deployed URL (APP_URL/NEXT_PUBLIC_SITE_URL) to ensure full Next.js functionality
  server: {
    url: isDev ? 'http://localhost:3002' : productionUrl,
    cleartext: isDev,
  },

  // Android specific configuration
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  // iOS specific configuration
  ios: {
    scheme: 'pintopellines',
    allowsLinkPreview: true,
    contentInset: 'automatic',
    backgroundColor: '#ffffff',
  },
};

export default config;
