// StudyPro Advanced Service Worker v2
// Improved caching strategies, offline support, background sync

const CACHE_VERSION = 'studypro-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting(); // Activate immediately
    })
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('studypro-') && name !== CACHE_VERSION)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network first, fallback to cache
  if (url.origin.includes('supabase') || request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets (JS, CSS, images) - Cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // HTML pages - Network first, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request));
});

// Network First Strategy
// Try network first, fallback to cache if offline
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }

    // No cache, return offline page
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Nejste připojeni k internetu',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Cache First Strategy
// Check cache first, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Background Sync - retry failed requests when online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-courses') {
    event.waitUntil(syncCourses());
  }
});

async function syncCourses() {
  // TODO: Implement background sync logic
  // This would retry failed course updates when back online
  console.log('[SW] Syncing courses...');
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'Nová notifikace ze StudyPro',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'studypro-notification',
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'StudyPro', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message handling (communication with main thread)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
