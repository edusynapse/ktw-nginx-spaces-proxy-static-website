// web/sw-offline.js

self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate new SW without manual reload
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // control existing pages
});

self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'CACHE_MATERIALS') {
        const urls = Array.isArray(data.urls) ? data.urls : [];
        event.waitUntil((async () => {
            const cache = await caches.open('offline-materials-v1');
            await Promise.all(urls.map(u => cache.add(u).catch(()=>{})));
        })());
    } else if (data.type === 'CLEAR_MATERIALS') {
        event.waitUntil(caches.delete('offline-materials-v1'));
    } else if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

