# Plan 67 - Apex App Warmup Prefetch

## Summary

Use the apex static site on `knowtowin.com` to warm the `app.knowtowin.com` origin and cache the app's heaviest reusable WASM/engine files while the user is reading the landing pages. This should reduce the later first app load without running the Flutter app in a hidden frame and without prefetching the JS fallback path.

## Key Changes

- Add app-origin `dns-prefetch` and `preconnect` hints to every apex HTML page.
- Add non-blocking warmup logic to `apex/assets/js/site.js`.
- Run warmup after page load and idle time, with guards for Save-Data, slow connections, missing WASM GC, missing WebGL, and duplicate execution in the same tab.
- Prefetch only the WASM app path and engine/worker files useful for modern WASM-capable browsers.
- Do not prefetch `main.dart.js`, `main.dart.mjs`, or `flutter_bootstrap.js` in v1.

## Implementation

- Apex pages updated:
  - `apex/index.html`
  - `apex/index_HI.html`
  - `apex/app.html`
  - `apex/jobs.html`
  - `apex/downloads.html`
  - `apex/services.html`
  - `apex/partners.html`
  - `apex/support.html`
- Shared warmup logic lives only in `apex/assets/js/site.js`.
- Warmup targets use unversioned app URLs and let nginx redirect to the canonical `?version=<serviceWorkerVersion>`.
- Engine prefetch chooses `skwasm` by default and `skwasm_heavy` when image codecs or Chromium break iterators are unavailable.

## Test Plan

- Confirm all apex pages include:
  - `<link rel="dns-prefetch" href="//app.knowtowin.com">`
  - `<link rel="preconnect" href="https://app.knowtowin.com" crossorigin>`
- Confirm `site.js` contains exactly one warmup implementation.
- Confirm no `main.dart.js` prefetch target exists.
- In Chrome incognito:
  - open `https://knowtowin.com`
  - wait 5-10 seconds
  - verify `[KTT warmup] queued:` logs
  - click into `https://app.knowtowin.com`
  - verify `main.dart.wasm` and `skwasm.wasm` are cache hits or materially faster.

## Assumptions

- This first pass prioritizes Chrome/WASM users.
- Apex warmup must not block page render.
- Browser cache reuse from apex to app must be verified in DevTools because cache partitioning and request mode can affect reuse.
- If `<link rel="prefetch">` does not improve app load, evaluate a guarded `fetch(..., { mode: "cors", credentials: "include", cache: "force-cache" })` variant later.
