const CACHE_VERSION = 'mivtzaim-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // For all requests - go straight to network
  // No caching at all - too problematic
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => {
        return new Response('Offline - Please check your connection', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});
