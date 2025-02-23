// Versión del cache
const CACHE_VERSION = 'v2';
const CACHE_NAME = `boltfitness-${CACHE_VERSION}`;

// Assets críticos a cachear
const CRITICAL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/styles/main.css',
  '/workout/offline-workouts',
  '/api/workouts/cached',
];

// Assets que se pueden cachear en segundo plano
const BACKGROUND_ASSETS = [
  '/images/',
  '/fonts/',
  '/exercises/',
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  // Cache first, network fallback para assets estáticos
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      return null;
    }
  },

  // Network first, cache fallback para contenido dinámico
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      
      // Si es una navegación, mostrar página offline
      if (request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return null;
    }
  },

  // Stale while revalidate para contenido que puede estar desactualizado
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const networkPromise = fetch(request).then((response) => {
      cache.put(request, response.clone());
      return response;
    });

    return cached || networkPromise;
  },
};

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cachear assets críticos
      caches.open(CACHE_NAME).then((cache) => cache.addAll(CRITICAL_ASSETS)),
      
      // Cachear assets en segundo plano
      caches.open(`${CACHE_NAME}-background`).then((cache) => 
        Promise.all(
          BACKGROUND_ASSETS.map((pattern) =>
            fetch(pattern).then((response) => cache.put(pattern, response))
          )
        )
      ),
    ]).then(() => self.skipWaiting())
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('boltfitness-'))
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workouts') {
    event.waitUntil(syncWorkouts());
  } else if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sincronizar entrenamientos pendientes
async function syncWorkouts() {
  const cache = await caches.open(CACHE_NAME);
  const pendingWorkouts = await cache.match('/pending-workouts');
  
  if (pendingWorkouts) {
    const workouts = await pendingWorkouts.json();
    
    for (const workout of workouts) {
      try {
        await fetch('/api/workouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workout),
        });
      } catch (error) {
        console.error('Error syncing workout:', error);
      }
    }
    
    await cache.delete('/pending-workouts');
  }
}

// Sincronizar progreso pendiente
async function syncProgress() {
  const cache = await caches.open(CACHE_NAME);
  const pendingProgress = await cache.match('/pending-progress');
  
  if (pendingProgress) {
    const progress = await pendingProgress.json();
    
    try {
      await fetch('/api/progress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress),
      });
      await cache.delete('/pending-progress');
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  }
}

// Notificaciones push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Abrir la URL específica de la notificación
  if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
}); 