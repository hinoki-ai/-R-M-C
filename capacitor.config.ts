import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.juntadevecinos.app',
  appName: 'Pinto Los Pellines',
  webDir: '.next',
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

    // App (for app state monitoring)
    App: {
      // exitOnSuspend is not a valid configuration option
    },
  },

  // Server configuration for development
  server: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : undefined,
    cleartext: true,
  },

  // Android specific configuration
  android: {
    allowMixedContent: true,
    captureInput: true,
  },

  // iOS specific configuration
  ios: {
    scheme: 'pintopellines',
    allowsLinkPreview: true,
  },
};

export default config;
