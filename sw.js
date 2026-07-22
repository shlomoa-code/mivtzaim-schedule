const CACHE_VERSION = 'mivtzaim-2024-01-14-v32-tz';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // עבור POST/PUT/DELETE - תמיד לחזור ישירות לשרת
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // עבור GET - תנסה network קודם, אחרי זה cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        // שמור בcache רק אם זה בסדר
        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // אם לא יש network - תגובה מcache
        return caches.match(event.request);
      })
  );
});
