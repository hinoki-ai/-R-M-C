'use client';

import { useEffect, useState } from 'react';
import { getPWAController, schedulePeriodicCleanup } from '@/lib/pwa';
import { MobileAPI } from '@/lib/mobile';

export function PWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize PWA controller
    const pwaController = getPWAController();

    // Cache critical resources for offline use
    const cacheCriticalResources = async () => {
      if ('caches' in window) {
        try {
          const cache = await caches.open('ΛRΛMΛC-critical-v1');
          await cache.addAll([
            '/',
            '/offline.html',
            '/manifest.json',
            '/favicon.ico',
            // Add other critical resources
          ]);
          console.log('Critical resources cached for offline use');
        } catch (error) {
          console.warn('Failed to cache critical resources:', error);
        }
      }
    };

    // Initialize offline data storage
    const initializeOfflineStorage = () => {
      if ('indexedDB' in window) {
        // Initialize IndexedDB for offline data storage
        const request = indexedDB.open('ΛRΛMΛC-offline', 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('data')) {
            db.createObjectStore('data');
          }
          if (!db.objectStoreNames.contains('sync-queue')) {
            db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = () => {
          console.log('Offline storage initialized');
        };
      }
    };

    // Subscribe to PWA status updates
    const unsubscribe = pwaController.subscribeToUpdates((status) => {
      setIsInstallable(status.canInstall);
      setIsInstalled(status.isInstalled);
      setIsOnline(status.isOnline);
    });

    // Initialize offline capabilities
    cacheCriticalResources();
    initializeOfflineStorage();

    // Set up periodic cleanup
    schedulePeriodicCleanup();

    // Legacy event listeners for backward compatibility
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA install prompt available');

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('pwa-install-available', {
        detail: { prompt: e }
      }));
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    };

    // Listen for install prompt (legacy)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Basic online/offline handling
    const handleOnlineEvent = () => {
      console.log('App is online');
      setIsOnline(true);
      window.dispatchEvent(new CustomEvent('network-online'));
    };

    const handleOfflineEvent = () => {
      console.log('App is offline');
      setIsOnline(false);
      window.dispatchEvent(new CustomEvent('network-offline'));
    };

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  // Expose install function globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).installPWA = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User ${outcome} the install prompt`);
          setDeferredPrompt(null);
          setIsInstallable(false);
          return outcome === 'accepted';
        }
        return false;
      };
    }
  }, [deferredPrompt]);

  return null;
}

// Global type for PWA install function
declare global {
  interface Window {
    installPWA?: () => Promise<boolean>;
  }
}