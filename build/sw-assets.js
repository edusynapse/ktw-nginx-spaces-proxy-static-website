// sw-assets.js
const RUNTIME = 'assets-runtime-v3';

// Handle same-origin GETs under /assets/
function isAssetsGet(req) {
  if (req.method !== 'GET') return false;
  const u = new URL(req.url);
  return u.origin === self.location.origin && u.pathname.startsWith('/assets/');
}

// Collapse a single layer of double-encoding and normalize spaces
function normalizePathname(path) {
  // Turn %25XX into %XX (e.g. %2520 -> %20) without touching already-correct %XX
  const singleUnescape = path.replace(/%25([0-9A-Fa-f]{2})/g, '%$1');
  // Normalize literal spaces to %20 (some callers still send raw spaces)
  return singleUnescape.replace(/ /g, '%20');
}

// Optional: hard fallbacks if your deploy renamed files without spaces.
function remapIfMissing(url) {
  const p = url.pathname;
  if (p.includes('/packages/font_awesome_flutter/lib/fonts/')) {
    if (p.includes('Brands-Regular-400'))
      return new URL('/assets/fa/FontAwesome7Brands-Regular-400.otf', url.origin);
    if (p.includes('Free-Regular-400'))
      return new URL('/assets/fa/FontAwesome7Free-Regular-400.otf', url.origin);
    if (p.includes('Free-Solid-900'))
      return new URL('/assets/fa/FontAwesome7Free-Solid-900.otf', url.origin);
  }
  return null;
}

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!isAssetsGet(request)) return;

  event.respondWith((async () => {
    const url = new URL(request.url);
    const normalizedPath = normalizePathname(url.pathname);
    const fixedUrl = new URL(normalizedPath + url.search, url.origin);

    // If we changed the URL, rebuild a compatible Request (RequestInit, not Request!)
    const sameUrl = (fixedUrl.href === request.url);
    const req = sameUrl ? request : new Request(fixedUrl.href, {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      keepalive: request.keepalive,
      // body is omitted since we only handle GET, and body isn’t allowed on GET
    });

    const isRange = request.headers.has('range');

    // 1) Network-first on normalized URL
    try {
      const netRes = await fetch(req);
      // If OK, opportunistically cache (skip ranges/opaque)
      if (netRes.ok && !isRange && netRes.type !== 'opaque') {
        try {
          const cache = await caches.open(RUNTIME);
          await cache.put(req, netRes.clone());
        } catch (_) {}
      }
      if (netRes.ok) return netRes;

      // 2) If 404 and font_awesome path → try backup location
      if (netRes.status === 404) {
        const alt = remapIfMissing(fixedUrl);
        if (alt) {
          const altRes = await fetch(alt.href);
          if (altRes.ok) return altRes;
        }
      }
    } catch (_) {
      // swallow, and try cache next
    }

    // 3) Cache fallback (normalized then original)
    const cached = await caches.match(req) || await caches.match(request);
    if (cached) return cached;

    // 4) Explicit 404 (avoid opaque rejections in callers)
    return new Response('Not found', { status: 404, statusText: 'Not Found' });
  })());
});
