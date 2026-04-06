// web/flutter_bootstrap.js
(()=>{var _={blink:!0,gecko:!1,webkit:!1,unknown:!1},K=()=>navigator.vendor==="Google Inc."||navigator.userAgent.includes("Edg/")?"blink":navigator.vendor==="Apple Computer, Inc."?"webkit":navigator.vendor===""&&navigator.userAgent.includes("Firefox")?"gecko":"unknown",L=K(),R=()=>typeof ImageDecoder>"u"?!1:L==="blink",B=()=>typeof Intl.v8BreakIterator<"u"&&typeof Intl.Segmenter<"u",z=()=>{let i=[0,97,115,109,1,0,0,0,1,5,1,95,1,120,0];return WebAssembly.validate(new Uint8Array(i))},M=()=>{let i=document.createElement("canvas");return i.width=1,i.height=1,i.getContext("webgl2")!=null?2:i.getContext("webgl")!=null?1:-1},w={browserEngine:L,hasImageCodecs:R(),hasChromiumBreakIterators:B(),supportsWasmGC:z(),crossOriginIsolated:window.crossOriginIsolated,webGLVersion:M()};function c(...i){return new URL(I(...i),document.baseURI).toString()}function I(...i){return i.filter(e=>!!e).map((e,r)=>r===0?C(e):D(C(e))).filter(e=>e.length).join("/")}function D(i){let e=0;for(;e<i.length&&i.charAt(e)==="/";)e++;return i.substring(e)}function C(i){let e=i.length;for(;e>0&&i.charAt(e-1)==="/";)e--;return i.substring(0,e)}function T(i,e){return i.canvasKitBaseUrl?i.canvasKitBaseUrl:e.engineRevision&&!e.useLocalCanvasKit?I("https://www.gstatic.com/flutter-canvaskit",e.engineRevision):"canvaskit"}var h=class{constructor(){this._scriptLoaded=!1}setTrustedTypesPolicy(e){this._ttPolicy=e}async loadEntrypoint(e){let{entrypointUrl:r=c("main.dart.js"),onEntrypointLoaded:t,nonce:n}=e||{};return this._loadJSEntrypoint(r,t,n)}async load(e,r,t,n,s){s??=d=>{d.initializeEngine(t).then(u=>u.runApp())};let{entrypointBaseUrl:a}=t,{entryPointBaseUrl:o}=t;if(!a&&o&&(console.warn("[deprecated] `entryPointBaseUrl` is deprecated and will be removed in a future release. Use `entrypointBaseUrl` instead."),a=o),e.compileTarget==="dart2wasm")return this._loadWasmEntrypoint(e,r,a,s);{let d=e.mainJsPath??"main.dart.js",u=c(a,d);return this._loadJSEntrypoint(u,s,n)}}didCreateEngineInitializer(e){typeof this._didCreateEngineInitializerResolve=="function"&&(this._didCreateEngineInitializerResolve(e),this._didCreateEngineInitializerResolve=null,delete _flutter.loader.didCreateEngineInitializer),typeof this._onEntrypointLoaded=="function"&&this._onEntrypointLoaded(e)}_loadJSEntrypoint(e,r,t){let n=typeof r=="function";if(!this._scriptLoaded){this._scriptLoaded=!0;let s=this._createScriptTag(e,t);if(n)console.debug("Injecting <script> tag. Using callback."),this._onEntrypointLoaded=r,document.head.append(s);else return new Promise((a,o)=>{console.debug("Injecting <script> tag. Using Promises. Use the callback approach instead!"),this._didCreateEngineInitializerResolve=a,s.addEventListener("error",o),document.head.append(s)})}}async _loadWasmEntrypoint(e,r,t,n){if(!this._scriptLoaded){this._scriptLoaded=!0,this._onEntrypointLoaded=n;let{mainWasmPath:s,jsSupportRuntimePath:a}=e,o=c(t,s),d=c(t,a);this._ttPolicy!=null&&(d=this._ttPolicy.createScriptURL(d));let l=(await import(d)).compileStreaming(fetch(o)),p;e.renderer==="skwasm"?p=(async()=>{let v=await r.skwasm;return window._flutter_skwasmInstance=v,{skwasm:v.wasmExports,skwasmWrapper:v,ffi:{memory:v.wasmMemory}}})():p=Promise.resolve({}),await(await(await l).instantiate(await p,{loadDynamicModule:async(v,j)=>{let x=fetch(c(t,v)),S=c(t,j);this._ttPolicy!=null&&(S=this._ttPolicy.createScriptURL(S));let A=import(S);return[await x,await A]}})).invokeMain()}}_createScriptTag(e,r){let t=document.createElement("script");t.type="application/javascript",r&&(t.nonce=r);let n=e;return this._ttPolicy!=null&&(n=this._ttPolicy.createScriptURL(e)),t.src=n,t}};async function U(i,e,r){if(e<0)return i;let t,n=new Promise((s,a)=>{t=setTimeout(()=>{a(new Error(`${r} took more than ${e}ms to resolve. Moving on.`,{cause:U}))},e)});return Promise.race([i,n]).finally(()=>{clearTimeout(t)})}var g=class{setTrustedTypesPolicy(e){this._ttPolicy=e}loadServiceWorker(e){if(!e)return console.debug("Null serviceWorker configuration. Skipping."),Promise.resolve();if(!("serviceWorker"in navigator)){let o="Service Worker API unavailable.";return window.isSecureContext||(o+=`
The current context is NOT secure.`,o+=`
Read more: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts`),Promise.reject(new Error(o))}let{serviceWorkerVersion:r,serviceWorkerUrl:t=c(`flutter_service_worker.js?v=${r}`),timeoutMillis:n=4e3}=e,s=t;this._ttPolicy!=null&&(s=this._ttPolicy.createScriptURL(s));let a=navigator.serviceWorker.register(s).then(o=>this._getNewServiceWorker(o,r)).then(this._waitForServiceWorkerActivation);return U(a,n,"prepareServiceWorker")}async _getNewServiceWorker(e,r){if(!e.active&&(e.installing||e.waiting))return console.debug("Installing/Activating first service worker."),e.installing||e.waiting;if(e.active.scriptURL.endsWith(r))return console.debug("Loading from existing service worker."),e.active;{let t=await e.update();return console.debug("Updating service worker."),t.installing||t.waiting||t.active}}async _waitForServiceWorkerActivation(e){if(!e||e.state==="activated")if(e){console.debug("Service worker already active.");return}else throw new Error("Cannot activate a null service worker!");return new Promise((r,t)=>{e.addEventListener("statechange",()=>{e.state==="activated"&&(console.debug("Activated new service worker."),r())})})}};var y=class{constructor(e,r="flutter-js"){let t=e||[/\.js$/,/\.mjs$/];window.trustedTypes&&(this.policy=trustedTypes.createPolicy(r,{createScriptURL:function(n){if(n.startsWith("blob:"))return n;let s=new URL(n,window.location),a=s.pathname.split("/").pop();if(t.some(d=>d.test(a)))return s.toString();console.error("URL rejected by TrustedTypes policy",r,":",n,"(download prevented)")}}))}};var k=i=>{let e=WebAssembly.compileStreaming(fetch(i));return(r,t)=>((async()=>{let n=await e,s=await WebAssembly.instantiate(n,r);t(s,n)})(),{})};var E=(i,e,r,t)=>(window.flutterCanvasKitLoaded=(async()=>{if(window.flutterCanvasKit)return window.flutterCanvasKit;let n=r.hasChromiumBreakIterators&&r.hasImageCodecs;if(!n&&e.canvasKitVariant=="chromium")throw"Chromium CanvasKit variant specifically requested, but unsupported in this browser";let s=n&&e.canvasKitVariant!=="full",a=t;e.canvasKitVariant=="experimentalWebParagraph"?a=c(a,"experimental_webparagraph"):s&&(a=c(a,"chromium"));let o=c(a,"canvaskit.js");i.flutterTT.policy&&(o=i.flutterTT.policy.createScriptURL(o));let d=k(c(a,"canvaskit.wasm")),u=await import(o);return window.flutterCanvasKit=await u.default({instantiateWasm:d}),window.flutterCanvasKit})(),window.flutterCanvasKitLoaded);var W=async(i,e,r,t)=>{let s=!r.hasImageCodecs||!r.hasChromiumBreakIterators?"skwasm_heavy":"skwasm",a=c(t,`${s}.js`),o=a;i.flutterTT.policy&&(o=i.flutterTT.policy.createScriptURL(o));let d=k(c(t,`${s}.wasm`));return await(await import(o)).default({skwasmSingleThreaded:!r.crossOriginIsolated||e.forceSingleThreadedSkwasm,instantiateWasm:d,locateFile:(l,p)=>{if(l.endsWith(".ww.js")){let f=c(t,l);return URL.createObjectURL(new Blob([`
"use strict";

let eventListener;
eventListener = (message) => {
    const pendingMessages = [];
    const data = message.data;
    data["instantiateWasm"] = (info,receiveInstance) => {
        const instance = new WebAssembly.Instance(data["wasm"], info);
        return receiveInstance(instance, data["wasm"])
    };
    import(data.js).then(async (skwasm) => {
        await skwasm.default(data);

        removeEventListener("message", eventListener);
        for (const message of pendingMessages) {
            dispatchEvent(message);
        }
    });
    removeEventListener("message", eventListener);
    eventListener = (message) => {

        pendingMessages.push(message);
    };

    addEventListener("message", eventListener);
};
addEventListener("message", eventListener);
`],{type:"application/javascript"}))}return url},mainScriptUrlOrBlob:a})};var P=w.supportsWasmGC,G=P&&w.webGLVersion>0,b=class{async loadEntrypoint(e){let{serviceWorker:r,...t}=e||{},n=new y,s=new g;s.setTrustedTypesPolicy(n.policy),await s.loadServiceWorker(r).catch(o=>{console.warn("Exception while loading service worker:",o)});let a=new h;return a.setTrustedTypesPolicy(n.policy),this.didCreateEngineInitializer=a.didCreateEngineInitializer.bind(a),a.loadEntrypoint(t)}async load({serviceWorkerSettings:e,onEntrypointLoaded:r,nonce:t,config:n}={}){n??={};let s=_flutter.buildConfig;if(!s)throw"FlutterLoader.load requires _flutter.buildConfig to be set";let a=n.wasmAllowList?.[w.browserEngine]??_[w.browserEngine],o=m=>{switch(m){case"skwasm":return G&&a;default:return!0}},d=m=>m.compileTarget==="dart2wasm"&&!P||n.renderer&&n.renderer!=m.renderer?!1:o(m.renderer),u=s.builds.find(d);if(!u)throw"FlutterLoader could not find a build compatible with configuration and environment.";let l={};l.flutterTT=new y,e&&(l.serviceWorkerLoader=new g,l.serviceWorkerLoader.setTrustedTypesPolicy(l.flutterTT.policy),await l.serviceWorkerLoader.loadServiceWorker(e).catch(m=>{console.warn("Exception while loading service worker:",m)}));let p=T(n,s);u.renderer==="canvaskit"?l.canvasKit=E(l,n,w,p):u.renderer==="skwasm"&&(l.skwasm=W(l,n,w,p));let f=new h;return f.setTrustedTypesPolicy(l.flutterTT.policy),this.didCreateEngineInitializer=f.didCreateEngineInitializer.bind(f),f.load(u,l,n,t,r)}};window._flutter||(window._flutter={});window._flutter.loader||(window._flutter.loader=new b);})();
//# sourceMappingURL=flutter.js.map

if (!window._flutter) {
  window._flutter = {};
}
_flutter.buildConfig = {"engineRevision":"13e658725ddaa270601426d1485636157e38c34c","builds":[{"compileTarget":"dart2wasm","renderer":"skwasm","mainWasmPath":"main.dart.wasm","jsSupportRuntimePath":"main.dart.mjs"},{"compileTarget":"dart2js","renderer":"canvaskit","mainJsPath":"main.dart.js"}]};


(function () {
  const loadingEl = document.getElementById('loading');
  const textEl = document.getElementById('loading-text');
  const progressEl = document.getElementById('progress');
  const barEl = document.getElementById('progress-bar');

  function setText(msg) {
    if (textEl && typeof msg === 'string') textEl.textContent = msg;
  }

  function setProgress(pct, msg) {
    const clamped = Math.max(0, Math.min(100, pct|0));
    if (barEl) barEl.style.width = clamped + '%';
    if (progressEl) progressEl.setAttribute('aria-valuenow', String(clamped));
    if (msg) setText(msg);
  }

  // Gentle fake progress while we wait for real init signals.
  let fake = 8;
  setProgress(fake, 'Downloading engine…');
  const tick = setInterval(() => {
    // ★ lowered fake ceiling so REAL downloads visibly start at 40%
    if (fake < 38) {
      fake += 1;
      setProgress(fake);
    }
  }, 60);

  // Remove loader when the first Flutter frame is painted.
  function removeLoader() {
    try {
      setProgress(100, 'Ready');
      if (loadingEl && loadingEl.remove) loadingEl.remove();
      else if (loadingEl) loadingEl.style.display = 'none';
    } catch (_) {
      /* no-op */
    }
  }

  window.addEventListener('flutter-first-frame', removeLoader, { once: true });

  // --- Progress aggregator (main wasm + worker wasm) --------------------------
  const __ktwAgg = {
    items: new Map(),   // id -> { loaded, total, done }
    update(id, loaded, total, done) {
      const prev = this.items.get(id) || { loaded: 0, total: 0, done: false };
      const cur = {
        loaded: Math.max(loaded || 0, prev.loaded || 0),
        total: total || prev.total || 0,
        done: !!done || prev.done
      };
      this.items.set(id, cur);

      // Sum bytes; if any total unknown (0), show "unknown-total" style
      let sumLoaded = 0, sumTotal = 0, allTotalsKnown = true, allDone = true;
      for (const v of this.items.values()) {
        sumLoaded += v.loaded || 0;
        if (v.total && v.total > 0) sumTotal += v.total;
        else allTotalsKnown = false;
        if (!v.done) allDone = false;
      }

      // ★ Map download span to 40%..69% so real downloads start at 40%
      const BASE = 40;
      const MAX = 69;
      const RANGE = MAX - BASE; // 29

      let pct, label;
      if (allTotalsKnown && sumTotal > 0) {
        const frac = Math.min(1, sumLoaded / sumTotal);
        pct = BASE + Math.floor(frac * RANGE);
        label = `Downloading engine… ${(sumLoaded/1048576).toFixed(1)} / ${(sumTotal/1048576).toFixed(1)} MB`;
      } else {
        // unknown total: grow slowly from 40 up to ~60
        const approx = Math.min(RANGE - 10, Math.floor(Math.log2(sumLoaded + 1)));
        pct = BASE + approx;
        label = `Downloading engine… ${(sumLoaded/1048576).toFixed(1)} MB`;
      }

      setProgress(pct, label);

      if (allDone) {
        setProgress(MAX, 'Download complete');
      }
    }
  };
  // ---------------------------------------------------------------------------

  // --- WASM progress tap: wrap fetch ONLY for main.dart.wasm ---
  (function installWasmProgressTracker() {
    if (!('fetch' in window) || !('ReadableStream' in window)) return;

    const origFetch = window.fetch.bind(window);
    const matchWasm = (u) => {
      try {
        const url = typeof u === 'string' ? new URL(u, location.href)
                                          : new URL(u.url, location.href);
        return /\/main\.dart\.wasm(?:$|\?)/.test(url.pathname + url.search);
      } catch (_) { return false; }
    };

    let lastEmit = 0;

    window.fetch = async function(input, init) {
      if (!matchWasm(input)) return origFetch(input, init);

      const res = await origFetch(input, init);
      // If we can't stream, just pass it through.
      if (!res.ok || !res.body) return res;

      const total = Number(res.headers.get('content-length')) || 0;
      let loaded = 0;

      const reader = res.body.getReader();
      const stream = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            // ADDED: include id so aggregator can distinguish files
            const detail = { id: 'main.dart.wasm', loaded, total, done: true };
            window.dispatchEvent(new CustomEvent('ktw-wasm-progress', { detail }));
            controller.close();
            return;
          }
          loaded += value.byteLength;

          // throttle UI events ~12/s
          const now = performance.now();
          if (now - lastEmit > 80) {
            lastEmit = now;
            // ADDED: include id for aggregator
            const detail = { id: 'main.dart.wasm', loaded, total };
            window.dispatchEvent(new CustomEvent('ktw-wasm-progress', { detail }));
          }

          controller.enqueue(value);
        },
        cancel() { reader.cancel(); }
      });

      // Re-wrap the response with our streaming body so Flutter still streams.
      return new Response(stream, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
      });
    };
  })();

  // --- Worker wrapper to capture workers' .wasm progress ----------------------
  (function installWorkerWasmProgressBridge() {
    if (!('Worker' in window)) return;
    const NativeWorker = window.Worker;

    window.Worker = function(url, options) {
      const abs = (typeof url === 'string')
        ? new URL(url, document.baseURI).toString()
        : url;

      // Match your generated worker entry scripts
      if (typeof abs === 'string' && /\/workers\/.*\.web\.g\.dart\.js$/.test(abs)) {
        // Inject a tiny bootstrap inside the worker that wraps self.fetch for *.wasm
        const bootstrap = `
          (function(){
            try {
              if ('fetch' in self && 'ReadableStream' in self) {
                const origFetch = fetch.bind(self);
                const isWasm = (input) => {
                  try {
                    const u = typeof input === 'string'
                      ? new URL(input, location.href)
                      : new URL(input.url, location.href);
                    // Keep narrow to workers' wasm files
                    return /\\/workers\\/.*\\.wasm(?:$|\\?)/.test(u.pathname + u.search);
                  } catch { return false; }
                };
                const idName = (input) => {
                  try {
                    const u = typeof input === 'string'
                      ? new URL(input, location.href)
                      : new URL(input.url, location.href);
                    const p = u.pathname.split('/');
                    return p[p.length - 1] || 'worker.wasm';
                  } catch { return 'worker.wasm'; }
                };
                self.fetch = async function(input, init) {
                  if (!isWasm(input)) return origFetch(input, init);
                  const res = await origFetch(input, init);
                  if (!res.ok || !res.body) return res;

                  const total = Number(res.headers.get('content-length')) || 0;
                  const id = idName(input);
                  let last = 0;

                  const reader = res.body.getReader();
                  const stream = new ReadableStream({
                    async pull(controller) {
                      const { done, value } = await reader.read();
                      if (done) {
                        try { self.postMessage({ __ktwWasmProgress: { id, done: true, total: total || last } }); } catch {}
                        controller.close();
                        return;
                      }
                      last += value.byteLength;
                      try { self.postMessage({ __ktwWasmProgress: { id, loaded: last, total } }); } catch {}
                      controller.enqueue(value);
                    },
                    cancel() { reader.cancel(); }
                  });
                  return new Response(stream, {
                    status: res.status,
                    statusText: res.statusText,
                    headers: res.headers
                  });
                };
              }
            } catch (_e) {}
            importScripts(${JSON.stringify(abs)});
          })();
        `;
        const blobURL = URL.createObjectURL(new Blob([bootstrap], { type: 'text/javascript' }));
        const w = new NativeWorker(blobURL, options);

        // Forward worker progress to the same page-level event your loader uses.
        w.addEventListener('message', (ev) => {
          const m = ev.data && ev.data.__ktwWasmProgress;
          if (!m) return;
          try {
            window.dispatchEvent(new CustomEvent('ktw-wasm-progress', {
              detail: { id: m.id, loaded: m.loaded, total: m.total, done: m.done, worker: true }
            }));
          } catch {}
        });

        return w;
      }

      // Non-matching workers unchanged
      return new NativeWorker(url, options);
    };
  })();
  // ---------------------------------------------------------------------------

  // Hook progress into your loader UI (now aggregates multiple ids).
  window.addEventListener('ktw-wasm-progress', (e) => {
    const d = (e && e.detail) || {};
    const id = d.id || 'main.dart.wasm';
    const loaded = Number(d.loaded) || 0;
    const total = Number(d.total) || 0;
    const done = !!d.done;
    __ktwAgg.update(id, loaded, total, done);
  });

  _flutter.loader.load({
    onEntrypointLoaded: async function (engineInitializer) {
      clearInterval(tick);
      // ★ keep the "init" step starting right after download completes (70%)
      setProgress(70, 'Initializing engine…');

      const appRunner = await engineInitializer.initializeEngine();

      setProgress(85, 'Starting app…');
      await appRunner.runApp();

      // In case the first-frame event was missed for any reason, fall back.
      setTimeout(() => {
        if (loadingEl && loadingEl.parentNode) removeLoader();
      }, 4000);
    }
  }).catch((error) => {
    console.error('Flutter load failed:', error);
    setText('Failed to load the app.');
    setProgress(100);
  });
})();
