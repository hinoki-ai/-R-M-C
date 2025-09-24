/**
 * Service Worker for Los Pellines Dashboard
 * Mobile-optimized caching and offline functionality
 */

// Versioned mobile cache names (match mobile naming across tools)
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `pellines-mobile-${CACHE_VERSION}`;
const STATIC_CACHE = `pellines-mobile-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `pellines-mobile-dynamic-${CACHE_VERSION}`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-192x192.png',
  '/images/backgrounds/bg1.jpg',
  '/images/backgrounds/bg2.jpg',
  '/images/backgrounds/bg3.jpg',
];

// API endpoints to cache (for offline functionality)
const API_CACHE_PATTERNS = [
  /\/api\/weather/,
  /\/api\/emergency/,
];

// Files that should be cached aggressively (for mobile)
const MOBILE_CACHE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|svg|webp)$/,
  /\.(woff|woff2|ttf|eot)$/,
  /\/_next\/static\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');

  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),

      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content and cache new requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external domains (except allowed ones)
  if (!url.origin.includes(self.location.origin) &&
      !url.origin.includes('api.open-meteo.com') &&
      !url.origin.includes('convex')) {
    return;
  }

  // Handle API requests with network-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (MOBILE_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }

          // Fetch and cache
          return fetch(request).then(response => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Default strategy: network first, then cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Don't cache HTML pages to ensure fresh content
        if (!request.headers.get('accept').includes('text/html')) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache for offline support
        return caches.match(request)
          .then(response => {
            if (response) {
              return response;
            }

            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/dashboard');
            }
          });
      })
  );
});

// Background Sync: revalidate critical API caches when back online
// Tag names: 'background-sync' (generic) or 'sync-data'
self.addEventListener('sync', (event) => {
  if (!event || !event.tag) return;
  if (event.tag === 'background-sync' || event.tag === 'sync-data') {
    event.waitUntil((async () => {
      try {
        const endpoints = [
          '/api/weather?type=current',
          '/api/weather?type=forecast',
        ];

        await Promise.all(endpoints.map(async (path) => {
          try {
            const req = new Request(path, { method: 'GET' });
            const resp = await fetch(req);
            if (resp && resp.ok) {
              const clone = resp.clone();
              const cache = await caches.open(DYNAMIC_CACHE);
              await cache.put(req, clone);
            }
          } catch (_) {
            // ignore individual fetch failures during background sync
          }
        }));
      } catch (err) {
        // swallow to avoid failing the sync event
      }
    })());
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_STATS':
      Promise.all([
        caches.open(STATIC_CACHE).then(cache => cache.keys()),
        caches.open(DYNAMIC_CACHE).then(cache => cache.keys())
      ]).then(([staticKeys, dynamicKeys]) => {
        event.ports[0].postMessage({
          staticCacheSize: staticKeys.length,
          dynamicCacheSize: dynamicKeys.length,
          totalSize: staticKeys.length + dynamicKeys.length
        });
      });
      break;

    case 'CLEAR_CACHE':
      Promise.all([
        caches.delete(STATIC_CACHE),
        caches.delete(DYNAMIC_CACHE)
      ]).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Handle push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/favicon-192x192.png',
      badge: '/favicon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});
