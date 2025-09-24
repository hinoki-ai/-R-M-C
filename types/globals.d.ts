// Global type definitions

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'get' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;

    dataLayer: any[];

    // PWA install prompt
    beforeinstallprompt: Event;

    // Performance API
    performance: Performance;

    // Device capabilities
    navigator: Navigator & {
      vibrate: (pattern: number | number[]) => boolean;
      clipboard: {
        writeText: (text: string) => Promise<void>;
        readText: () => Promise<string>;
      };
    };

    // Match media
    matchMedia: (query: string) => MediaQueryList;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL?: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
      CLERK_SECRET_KEY?: string;
      CONVEX_URL?: string;
      NEXT_PUBLIC_CONVEX_URL?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      MOBILE_BUILD?: string;
    }
  }
}

export {};
