// Enhanced Service Worker for Mobile-First Offline Experience
const CACHE_NAME = 'pellines-mobile-v1';
const OFFLINE_URL = '/';

// Enhanced static assets to cache for mobile performance
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/apple-touch-icon.png',
  // Add critical fonts and small assets here
];

// Dynamic cache for API responses
const API_CACHE = 'pellines-api-v1';

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing enhanced service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache critical assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating enhanced service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Enhanced fetch event with network-first for APIs, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              // Add timestamp for cache invalidation
              const responseWithTimestamp = new Response(responseClone.body, {
                ...responseClone,
                headers: {
                  ...Object.fromEntries(responseClone.headers),
                  'sw-cache-timestamp': Date.now().toString(),
                },
              });
              cache.put(request, responseWithTimestamp);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }

        // Return offline indicator for other requests
        return new Response(JSON.stringify({
          offline: true,
          message: 'Content not available offline'
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(processBackgroundSync());
  }
});

async function processBackgroundSync() {
  try {
    // Get all pending sync requests from IndexedDB
    const syncRequests = await getSyncRequests();

    for (const syncRequest of syncRequests) {
      try {
        await fetch(syncRequest.url, syncRequest.options);
        await removeSyncRequest(syncRequest.id);
        console.log('[SW] Synced request:', syncRequest.id);
      } catch (error) {
        console.error('[SW] Failed to sync request:', syncRequest.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync error:', error);
  }
}

// IndexedDB helpers for sync queue
async function getSyncRequests() {
  return new Promise((resolve) => {
    const request = indexedDB.open('offline-sync', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['sync-queue'], 'readonly');
      const store = transaction.objectStore('sync-queue');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
    };
    request.onerror = () => resolve([]);
  });
}

async function removeSyncRequest(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('offline-sync', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['sync-queue'], 'readwrite');
      const store = transaction.objectStore('sync-queue');
      store.delete(id);
      transaction.oncomplete = () => resolve(undefined);
    };
    request.onerror = () => resolve(undefined);
  });
}

// Push notification support
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});