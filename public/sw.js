// Procvička App Service Worker - Dynamic Version
// Automatické verzování s build timestampem

// Dynamické cache názvy s build timestampem
const BUILD_VERSION = self.location.search.includes('v=') 
  ? new URLSearchParams(self.location.search).get('v') 
  : Date.now().toString();
  
const CACHE_NAME = `procvicka-static-v${BUILD_VERSION}`;
const DYNAMIC_CACHE = `procvicka-dynamic-v${BUILD_VERSION}`;
const IMAGE_CACHE = `procvicka-images-v${BUILD_VERSION}`;

// Cache strategies for different types of resources
const cacheStrategies = {
  static: [
    '/',
    '/manifest.json',
    '/favicon.ico'
  ],
  fonts: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]
};

// Service Worker události
self.addEventListener('install', (event) => {
  console.log(`SW: Installing version ${BUILD_VERSION}...`);
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(cacheStrategies.static)),
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.addAll([
          '/images/happy-kid.png',
          '/images/stars.png',
          '/images/try-again.png'
        ]);
      })
    ]).then(() => {
      console.log(`SW: Install complete for version ${BUILD_VERSION}`);
      return self.skipWaiting();
    }).catch(error => {
      console.error('SW: Installation failed:', error);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log(`SW: Activating version ${BUILD_VERSION}...`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all caches that don't match current version
          if (!cacheName.includes(BUILD_VERSION)) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`SW: Activation complete for version ${BUILD_VERSION}`);
      return self.clients.claim();
    })
  );
});

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Navigace (HTML dokumenty) — vždy NetworkFirst, jinak hrozí stale index.html
    // s odkazy na neexistující JS chunky po novém buildu.
    if (request.mode === 'navigate' || (request.destination === 'document')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // JS/CSS chunky s hashem — NetworkFirst, abychom nikdy nevraceli mrtvý chunk
    if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
      return await networkFirst(request, CACHE_NAME);
    }

    // Statická aktiva (fonty, manifest)
    if (isStaticAsset(url)) {
      return await staleWhileRevalidate(request, CACHE_NAME);
    }
    
    if (isImage(url)) {
      return await staleWhileRevalidate(request, IMAGE_CACHE);
    }
    
    if (isApiCall(url)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('SW: Fetch failed:', error);
    return await getOfflineFallback(request);
  }
}

// Cache strategie implementace - vylepšená pro lepší aktualizace
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, using offline fallback');
    return getOfflineFallback(request);
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache');
    const cachedResponse = await cache.match(request);
    return cachedResponse || getOfflineFallback(request);
  }
}

// Vylepšená strategie pro rychlejší aktualizace
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Vždy fetch z network pro aktualizace na pozadí
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    console.log('SW: Network failed for background update');
    return cachedResponse;
  });

  // Vrať cache okamžitě, ale aktualizuj na pozadí
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.endsWith('.js') || 
         url.pathname.endsWith('.css') || 
         url.pathname.endsWith('.woff2') ||
         url.pathname === '/' ||
         url.pathname === '/manifest.json';
}

function isImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);
}

function isApiCall(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('supabase');
}

async function getOfflineFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  
  if (request.mode === 'navigate') {
    return await cache.match('/') || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  console.log('SW: Syncing game data...');
  // This would sync any pending game data when back online
  // Implementation would depend on your data structure
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('SW: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nová zpráva z Procvičky!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'procvicka-notification',
    actions: [
      {
        action: 'open',
        title: 'Otevřít aplikaci'
      },
      {
        action: 'close',
        title: 'Zavřít'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Procvička', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked');
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});