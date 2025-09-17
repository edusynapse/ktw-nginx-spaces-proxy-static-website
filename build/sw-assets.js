// sw-assets.js
const RUNTIME = 'assets-runtime-v5-fa-only';

// Strictly match only FA font requests we care about
function isFaFont(req) {
  if (req.method !== 'GET') return false;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return false;
  return u.pathname.startsWith('/assets/packages/font_awesome_flutter/lib/fonts/');
}

// Normalize to the on-disk naming: ensure single-encoded %20 (and no raw spaces).
// If a caller uses %2520, collapse one layer to %20. If a caller sends literal spaces, encode to %20.
function normalizeFaPath(path) {
  // collapse one layer of double-encoding: %2520 -> %20 (don’t overdo it—single pass)
  const onceUnescaped = path.replace(/%25([0-9A-Fa-f]{2})/g, '%$1');
  // ensure any literal spaces become %20
  return onceUnescaped.replace(/ /g, '%20');
}

// Build a Request for a given URL while preserving important init from the original request
function rebuildRequest(url, original) {
  if (url === original.url) return original;
  return new Request(url, {
    method: original.method,
    headers: original.headers,
    mode: original.mode,
    credentials: original.credentials,
    cache: original.cache,
    redirect: original.redirect,
    referrer: original.referrer,
    referrerPolicy: original.referrerPolicy,
    integrity: original.integrity,
    keepalive: original.keepalive,
  });
}

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!isFaFont(request)) return;

  event.respondWith((async () => {
    const url = new URL(request.url);

    // 1) Normalize to the on-disk path (single-encoded %20)
    const normPath = normalizeFaPath(url.pathname);
    const normUrl = new URL(normPath + url.search, url.origin);
    const normReq = rebuildRequest(normUrl.href, request);

    const isRange = request.headers.has('range');

    // helper: opportunistic cache
    async function maybeCache(req, res) {
      if (!res.ok || isRange || res.type === 'opaque') return;
      try {
        const cache = await caches.open(RUNTIME);
        await cache.put(req, res.clone());
      } catch (_e) {}
    }

    // 1) Try network on normalized request
    try {
      let res = await fetch(normReq);
      if (res.ok) {
        await maybeCache(normReq, res);
        return res;
      }

      // 2) Retry once with swapped encoding if 404
      // If we tried %20 first, try %2520 (some stacks decode once internally).
      // If caller *actually* sent %2520 and normalize collapsed it, this gives us the other side too.
      if (res.status === 404) {
        const retryUrl = new URL(normUrl.href);
        if (retryUrl.pathname.includes('%20')) {
          retryUrl.pathname = retryUrl.pathname.replace(/%20/g, '%2520');
        } else if (retryUrl.pathname.includes('%2520')) {
          retryUrl.pathname = retryUrl.pathname.replace(/%2520/g, '%20');
        }
        if (retryUrl.pathname !== normUrl.pathname) {
          const retryReq = rebuildRequest(retryUrl.href, request);
          const retryRes = await fetch(retryReq);
          if (retryRes.ok) {
            await maybeCache(retryReq, retryRes);
            return retryRes;
          }
        }
      }
    } catch (_e) {
      // swallow and try cache below
    }

    // 3) Cache fallback (normalized then original)
    const cached = await caches.match(normReq) || await caches.match(request);
    if (cached) return cached;

    // 4) Explicit 404
    return new Response('Not found', { status: 404, statusText: 'Not Found' });
  })());
});
