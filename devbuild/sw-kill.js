// sw-kill.js: unregister Flutter SW & clear caches
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const all = await self.clients.matchAll({ includeUncontrolled: true });
    all.forEach(c => c.navigate(c.url)); // refresh open pages
  })());
});
