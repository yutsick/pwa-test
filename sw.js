const CACHE_NAME = 'pwa-v1';
const ASSETS = [
    './',
    './index.html'
];

// Встановлення
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Активація
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Перехоплення запитів
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch(() => caches.match('/'))
    );
});