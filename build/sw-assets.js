// sw-assets.js
// Handles FontAwesome font requests robustly in both debug and prod,
// regardless of whether the path arrives with spaces, %20, or %2520.

const RUNTIME = 'assets-runtime-v6-fa-only';

function sameOrigin(u) {
  try { return new URL(u).origin === self.location.origin; } catch { return false; }
}

// Strictly match only FA font requests we care about
function isFaFont(req) {
  if (req.method !== 'GET') return false;
  if (!sameOrigin(req.url)) return false;

  const u = new URL(req.url);
  const p = u.pathname;

  // Some stacks serve from /assets/packages/...; others from /packages/...
  const faRoots = [
    '/assets/packages/font_awesome_flutter/lib/fonts/',
    '/packages/font_awesome_flutter/lib/fonts/',
  ];

  const isFontFile = /\.(otf|ttf|woff2?|woff)(?:$|\?)/i.test(p);
  const underFa = faRoots.some((r) => p.startsWith(r));
  // Heuristic: only fonts under FA folder
  return isFontFile && underFa;
}

// Normalize to single-encoded %20 and ensure no raw spaces
function normalizeFaPath(pathname) {
  // collapse one layer of double-encoding: %2520 -> %20 (single pass only)
  const onceUnescaped = pathname.replace(/%25([0-9A-Fa-f]{2})/g, '%$1');
  // ensure any literal spaces become %20
  return onceUnescaped.replace(/ /g, '%20');
}

// Build variations to try (in order)
// 1) normalized (%20)  2) double-encoded (%2520)  3) raw spaces (just in case a dev server expects that)
function buildCandidatePaths(pathname) {
  const norm = normalizeFaPath(pathname);
  const dbl  = norm.includes('%20') ? norm.replace(/%20/g, '%2520') : norm;
  const raw  = decodeURIComponent(norm).replace(/ /g, ' '); // literal spaces
  // Deduplicate while preserving order
  const seen = new Set();
  return [norm, dbl, raw].filter(p => { if (seen.has(p)) return false; seen.add(p); return true; });
}

// Rebuild a Request preserving important init from original
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
    const originalUrl = new URL(request.url);
    const candidates = buildCandidatePaths(originalUrl.pathname)
      .map(p => new URL(p + originalUrl.search, originalUrl.origin));

    const isRange = request.headers.has('range');

    async function maybeCache(keyReq, res) {
      // Avoid caching partials/opaque
      if (!res || !res.ok || isRange || res.type === 'opaque') return;
      try {
        const cache = await caches.open(RUNTIME);
        await cache.put(keyReq, res.clone());
      } catch {}
    }

    // 1) Network-first over candidates (best for dev/live-reload and consistent with prod CDN hash queries)
    for (const u of candidates) {
      try {
        const req2 = rebuildRequest(u.href, request);
        const res2 = await fetch(req2);
        if (res2 && res2.ok) {
          // Normalize the cache key to the %20 (single-encoded) variant with the SAME search
          const cacheKey = new Request(new URL(candidates[0].pathname + u.search, u.origin).href, { method: 'GET' });
          await maybeCache(cacheKey, res2);
          return res2;
        }
        // If 404, try next candidate
      } catch {
        // fall through to next candidate
      }
    }

    // 2) Cache fallback:
    //    a) exact normalized key with search
    //    b) original request (just in case)
    //    c) ignoreSearch normalized (helps if dev server changes ?v=)
    const cache = await caches.open(RUNTIME);
    const normKey = new Request(new URL(candidates[0].pathname + originalUrl.search, originalUrl.origin).href, { method: 'GET' });

    let cached =
      await cache.match(normKey) ||
      await caches.match(request) ||
      await caches.match(new Request(new URL(candidates[0].pathname, originalUrl.origin).href, { method: 'GET' }), { ignoreSearch: true });

    if (cached) return cached;

    // 3) Explicit 404 to avoid confusing failures
    return new Response('Not found', { status: 404, statusText: 'Not Found' });
  })());
});
