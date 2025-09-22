const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/X-genesis_Weather-App/',
  '/X-genesis_Weather-App/index.html',
  '/X-genesis_Weather-App/style.css',
  '/X-genesis_Weather-App/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
