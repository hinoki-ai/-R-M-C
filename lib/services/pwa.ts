// PWA utilities for service worker registration and offline functionality
import React from 'react';

export interface PWAStatus {
  isSupported: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  serviceWorkerRegistered: boolean;
  serviceWorkerState: ServiceWorkerState | null;
}

class PWAController {
  private deferredPrompt: any = null;
  private status: PWAStatus = {
    isSupported: false,
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    serviceWorkerRegistered: false,
    serviceWorkerState: null,
  };

  private listeners: ((status: PWAStatus) => void)[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    // Check if PWA is supported
    this.status.isSupported = 'serviceWorker' in navigator && 'Notification' in window;

    // Check if already installed
    this.status.isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    // Register service worker
    if (this.status.isSupported) {
      await this.registerServiceWorker();
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.status.canInstall = true;
      this.notifyListeners();
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.status.isInstalled = true;
      this.status.canInstall = false;
      this.deferredPrompt = null;
      this.notifyListeners();
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.status.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.status.isOnline = false;
      this.notifyListeners();
    });

    this.notifyListeners();
  }

  private async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service worker registered:', registration.scope);

      this.status.serviceWorkerRegistered = true;
      this.status.serviceWorkerState = registration.active?.state || null;

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            this.status.serviceWorkerState = newWorker.state;
            this.notifyListeners();
          });
        }
      });

      // Handle existing service worker
      if (registration.active) {
        this.status.serviceWorkerState = registration.active.state;
      }

      this.notifyListeners();
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  }

  public getStatus(): PWAStatus {
    return { ...this.status };
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    this.deferredPrompt = null;
    this.status.canInstall = false;
    this.notifyListeners();

    return outcome === 'accepted';
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  public subscribeToUpdates(callback: (status: PWAStatus) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getStatus()));
  }
}

// Singleton instance
let pwaController: PWAController | null = null;

export function getPWAController(): PWAController {
  if (!pwaController) {
    pwaController = new PWAController();
  }
  return pwaController;
}

// React hook for PWA status
export function usePWAStatus() {
  const [status, setStatus] = React.useState<PWAStatus>({
    isSupported: false,
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    serviceWorkerRegistered: false,
    serviceWorkerState: null,
  });

  React.useEffect(() => {
    const controller = getPWAController();
    setStatus(controller.getStatus());

    const unsubscribe = controller.subscribeToUpdates(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

// Utility functions for offline functionality
export function isOnline(): boolean {
  return navigator.onLine;
}

export function addOnlineListener(callback: () => void): () => void {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

export function addOfflineListener(callback: () => void): () => void {
  window.addEventListener('offline', callback);
  return () => window.removeEventListener('offline', callback);
}


// Cache management utilities
export async function clearCache(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
}

export async function getCacheSize(): Promise<number> {
  if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

// Periodic cleanup function
export function schedulePeriodicCleanup(intervalMs: number = 24 * 60 * 60 * 1000) { // 24 hours
  setInterval(async () => {
    try {
      // Clear old cache entries
      await clearOldCacheEntries();
    } catch (error) {
      console.error('[PWA] Periodic cleanup failed:', error);
    }
  }, intervalMs);
}

async function clearOldCacheEntries() {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    for (const request of keys) {
      // This is a simplified version - in a real app you'd check response headers
      // For now, we'll just clean up API cache entries older than maxAge
      if (request.url.includes('/api/')) {
        try {
          const response = await cache.match(request);
          if (response) {
            const date = response.headers.get('date');
            if (date && (Date.now() - new Date(date).getTime()) > maxAge) {
              await cache.delete(request);
            }
          }
        } catch (error) {
          // Ignore errors for individual cache entries
        }
      }
    }
  }
}

// React hook will be defined in a separate file