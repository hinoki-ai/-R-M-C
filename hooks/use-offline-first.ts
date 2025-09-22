'use client';

import { useCallback, useEffect, useState } from 'react';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
}

interface CacheConfig {
  cacheName: string;
  urlsToCache: string[];
  maxAge?: number;
}

export function useOfflineFirst(cacheConfig?: CacheConfig) {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: true,
    wasOffline: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [syncQueue, setSyncQueue] = useState<Array<{ id: string; action: () => Promise<void> }>>([]);

  // Network state monitoring
  useEffect(() => {
    const updateNetworkState = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      setOfflineState(prev => ({
        isOnline: navigator.onLine,
        wasOffline: prev.isOnline && !navigator.onLine,
        connectionType: connection?.type,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
      }));
    };

    updateNetworkState();

    window.addEventListener('online', updateNetworkState);
    window.addEventListener('offline', updateNetworkState);

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkState);
    }

    return () => {
      window.removeEventListener('online', updateNetworkState);
      window.removeEventListener('offline', updateNetworkState);
      if (connection) {
        connection.removeEventListener('change', updateNetworkState);
      }
    };
  }, []);

  // Service worker registration and caching
  useEffect(() => {
    if ('serviceWorker' in navigator && cacheConfig) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Pre-cache critical resources
          return navigator.serviceWorker.ready;
        })
        .then(() => {
          return caches.open(cacheConfig.cacheName);
        })
        .then((cache) => {
          return cache.addAll(cacheConfig.urlsToCache);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  }, [cacheConfig]);

  // Background sync for queued actions
  useEffect(() => {
    const syncQueuedActions = async () => {
      if (!offlineState.isOnline || syncQueue.length === 0) return;

      setIsLoading(true);

      try {
        // Process sync queue
        const results = await Promise.allSettled(
          syncQueue.map(item => item.action())
        );

        // Remove successful actions from queue
        setSyncQueue(prev =>
          prev.filter((_, index) => results[index].status === 'rejected')
        );

        // Trigger success haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } catch (error) {
        console.warn('Background sync failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce sync to avoid rapid firing
    const timeoutId = setTimeout(syncQueuedActions, 1000);

    return () => clearTimeout(timeoutId);
  }, [offlineState.isOnline, syncQueue]);

  // Queue action for background sync
  const queueForSync = useCallback((action: () => Promise<void>) => {
    const id = Math.random().toString(36);
    setSyncQueue(prev => [...prev, { id, action }]);

    // Try immediate execution if online
    if (offlineState.isOnline) {
      action().catch(() => {
        // Action failed, keep in queue for retry
      });
    }
  }, [offlineState.isOnline]);

  // Cache data locally
  const cacheData = useCallback(async (key: string, data: any, ttl = 3600000) => {
    try {
      const cacheKey = `offline_data_${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      if ('localStorage' in window) {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }

      // Also cache in IndexedDB for larger data
      if ('indexedDB' in window) {
        const request = indexedDB.open('offline-cache', 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('data')) {
            db.createObjectStore('data');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['data'], 'readwrite');
          const store = transaction.objectStore('data');
          store.put(cacheData, cacheKey);
        };
      }
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, []);

  // Retrieve cached data
  const getCachedData = useCallback(async (key: string) => {
    try {
      const cacheKey = `offline_data_${key}`;

      // Try IndexedDB first for larger data
      if ('indexedDB' in window) {
        return new Promise((resolve) => {
          const request = indexedDB.open('offline-cache', 1);

          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            const getRequest = store.get(cacheKey);

            getRequest.onsuccess = () => {
              const cached = getRequest.result;
              if (cached && Date.now() - cached.timestamp < cached.ttl) {
                resolve(cached.data);
              } else {
                resolve(null);
              }
            };

            getRequest.onerror = () => resolve(null);
          };

          request.onerror = () => resolve(null);
        });
      }

      // Fallback to localStorage
      if ('localStorage' in window) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < parsed.ttl) {
            return parsed.data;
          }
        }
      }

      return null;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }, []);

  // Network-aware fetch with caching
  const offlineFetch = useCallback(async (url: string, options?: RequestInit) => {
    const cacheKey = `fetch_${btoa(url)}`;

    // Try cache first
    const cached = await getCachedData(cacheKey);
    if (cached && !offlineState.isOnline) {
      return cached;
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      // Cache successful responses
      if (response.ok) {
        await cacheData(cacheKey, data, 300000); // 5 minutes TTL
      }

      return data;
    } catch (error) {
      // Return cached data if network fails
      if (cached) {
        return cached;
      }
      throw error;
    }
  }, [getCachedData, cacheData, offlineState.isOnline]);

  return {
    // State
    offlineState,
    isLoading,
    syncQueue,

    // Network utilities
    isOnline: offlineState.isOnline,
    isSlowConnection: offlineState.effectiveType === 'slow-2g' || offlineState.effectiveType === '2g',
    wasOffline: offlineState.wasOffline,

    // Data management
    cacheData,
    getCachedData,
    offlineFetch,
    queueForSync,

    // Utilities
    connectionQuality: offlineState.effectiveType,
    downlinkSpeed: offlineState.downlink,
  };
}