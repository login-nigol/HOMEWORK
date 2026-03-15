// sw.js — минимальный Service Worker для PWA
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// fetch — отдаём из кэша если есть, иначе из сети
self.addEventListener('fetch', (e) => {
    // пропускаем не-GET запросы (AJAX POST к серверу)
    if ( e.request.method !== 'GET' ) return;

    e.respondWith(
        caches.match(e.request)
            .then(cached => cached || fetch(e.request))
            .catch(() => Response.error()) // не падаем если fetch не удался
    );
});