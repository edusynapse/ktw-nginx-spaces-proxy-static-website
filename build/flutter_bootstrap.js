// web/flutter_bootstrap.js
(()=>{var _={blink:!0,gecko:!1,webkit:!1,unknown:!1},K=()=>navigator.vendor==="Google Inc."||navigator.userAgent.includes("Edg/")?"blink":navigator.vendor==="Apple Computer, Inc."?"webkit":navigator.vendor===""&&navigator.userAgent.includes("Firefox")?"gecko":"unknown",C=K(),R=()=>typeof ImageDecoder>"u"?!1:C==="blink",B=()=>typeof Intl.v8BreakIterator<"u"&&typeof Intl.Segmenter<"u",z=()=>{let i=[0,97,115,109,1,0,0,0,1,5,1,95,1,120,0];return WebAssembly.validate(new Uint8Array(i))},M=()=>{let i=document.createElement("canvas");return i.width=1,i.height=1,i.getContext("webgl2")!=null?2:i.getContext("webgl")!=null?1:-1},D=()=>window.chrome&&chrome.runtime&&chrome.runtime.id,w={browserEngine:C,hasImageCodecs:R(),hasChromiumBreakIterators:B(),supportsWasmGC:z(),crossOriginIsolated:window.crossOriginIsolated,webGLVersion:M(),isChromeExtension:D()};function c(...i){return new URL(I(...i),document.baseURI).toString()}function I(...i){return i.filter(e=>!!e).map((e,n)=>n===0?S(e):F(S(e))).filter(e=>e.length).join("/")}function F(i){let e=0;for(;e<i.length&&i.charAt(e)==="/";)e++;return i.substring(e)}function S(i){let e=i.length;for(;e>0&&i.charAt(e-1)==="/";)e--;return i.substring(0,e)}function E(i,e){return i.canvasKitBaseUrl?i.canvasKitBaseUrl:e.engineRevision&&!e.useLocalCanvasKit?I("https://www.gstatic.com/flutter-canvaskit",e.engineRevision):"canvaskit"}var v=class{constructor(){this._scriptLoaded=!1}setTrustedTypesPolicy(e){this._ttPolicy=e}async loadEntrypoint(e){let{entrypointUrl:n=c("main.dart.js"),onEntrypointLoaded:t,nonce:r}=e||{};return this._loadJSEntrypoint(n,t,r)}async load(e,n,t,r,a){a??=l=>{l.initializeEngine(t).then(u=>u.runApp())};let{entrypointBaseUrl:s}=t,{entryPointBaseUrl:o}=t;if(!s&&o&&(console.warn("[deprecated] `entryPointBaseUrl` is deprecated and will be removed in a future release. Use `entrypointBaseUrl` instead."),s=o),e.compileTarget==="dart2wasm")return this._loadWasmEntrypoint(e,n,s,a);{let l=e.mainJsPath??"main.dart.js",u=c(s,l);return this._loadJSEntrypoint(u,a,r)}}didCreateEngineInitializer(e){typeof this._didCreateEngineInitializerResolve=="function"&&(this._didCreateEngineInitializerResolve(e),this._didCreateEngineInitializerResolve=null,delete _flutter.loader.didCreateEngineInitializer),typeof this._onEntrypointLoaded=="function"&&this._onEntrypointLoaded(e)}_loadJSEntrypoint(e,n,t){let r=typeof n=="function";if(!this._scriptLoaded){this._scriptLoaded=!0;let a=this._createScriptTag(e,t);if(r)console.debug("Injecting <script> tag. Using callback."),this._onEntrypointLoaded=n,document.head.append(a);else return new Promise((s,o)=>{console.debug("Injecting <script> tag. Using Promises. Use the callback approach instead!"),this._didCreateEngineInitializerResolve=s,a.addEventListener("error",o),document.head.append(a)})}}async _loadWasmEntrypoint(e,n,t,r){if(!this._scriptLoaded){this._scriptLoaded=!0,this._onEntrypointLoaded=r;let{mainWasmPath:a,jsSupportRuntimePath:s}=e,o=c(t,a),l=c(t,s);this._ttPolicy!=null&&(l=this._ttPolicy.createScriptURL(l));let d=(await import(l)).compileStreaming(fetch(o)),p;e.renderer==="skwasm"?p=(async()=>{let h=await n.skwasm;return window._flutter_skwasmInstance=h,{skwasm:h.wasmExports,skwasmWrapper:h,ffi:{memory:h.wasmMemory}}})():p=Promise.resolve({}),await(await(await d).instantiate(await p,{loadDynamicModule:async(h,j)=>{let A=fetch(c(t,h)),L=c(t,j);this._ttPolicy!=null&&(L=this._ttPolicy.createScriptURL(L));let x=import(L);return[await A,await x]}})).invokeMain()}}_createScriptTag(e,n){let t=document.createElement("script");t.type="application/javascript",n&&(t.nonce=n);let r=e;return this._ttPolicy!=null&&(r=this._ttPolicy.createScriptURL(e)),t.src=r,t}};async function T(i,e,n){if(e<0)return i;let t,r=new Promise((a,s)=>{t=setTimeout(()=>{s(new Error(`${n} took more than ${e}ms to resolve. Moving on.`,{cause:T}))},e)});return Promise.race([i,r]).finally(()=>{clearTimeout(t)})}var g=class{setTrustedTypesPolicy(e){this._ttPolicy=e}loadServiceWorker(e){if(!e||!("serviceWorker"in navigator))return Promise.resolve();let n=()=>{console.warn(`Loading the service worker using Flutter bootstrap is deprecated and will stop working in a future release.
For more details, see: https://github.com/flutter/flutter/issues/156910`)},t=()=>{let{serviceWorkerVersion:r,serviceWorkerUrl:a=c(`flutter_service_worker.js?v=${r}`),timeoutMillis:s=4e3}=e,o=a;this._ttPolicy!=null&&(o=this._ttPolicy.createScriptURL(o));let l=navigator.serviceWorker.register(o).then(u=>this._getNewServiceWorker(u,r)).then(this._waitForServiceWorkerActivation);return T(l,s,"prepareServiceWorker")};return e.serviceWorkerUrl!=null?(n(),t()):navigator.serviceWorker.getRegistration().then(r=>r?t():Promise.resolve())}async _getNewServiceWorker(e,n){if(!e.active&&(e.installing||e.waiting))return console.debug("Installing/Activating first service worker."),e.installing||e.waiting;if(e.active.scriptURL.endsWith(n))return console.debug("Loading from existing service worker."),e.active;{let t=await e.update();return console.debug("Updating service worker."),t.installing||t.waiting||t.active}}async _waitForServiceWorkerActivation(e){if(!e||e.state==="activated")if(e){console.debug("Service worker already active.");return}else throw new Error("Cannot activate a null service worker!");return new Promise((n,t)=>{e.addEventListener("statechange",()=>{e.state==="activated"&&(console.debug("Activated new service worker."),n())})})}};var y=class{constructor(e,n="flutter-js"){let t=e||[/\.js$/,/\.mjs$/];window.trustedTypes&&(this.policy=trustedTypes.createPolicy(n,{createScriptURL:function(r){if(r.startsWith("blob:"))return r;let a=new URL(r,window.location),s=a.pathname.split("/").pop();if(t.some(l=>l.test(s)))return a.toString();console.error("URL rejected by TrustedTypes policy",n,":",r,"(download prevented)")}}))}};var k=i=>{let e=WebAssembly.compileStreaming(fetch(i));return(n,t)=>((async()=>{let r=await e,a=await WebAssembly.instantiate(r,n);t(a,r)})(),{})};var U=(i,e,n,t)=>(window.flutterCanvasKitLoaded=(async()=>{if(window.flutterCanvasKit)return window.flutterCanvasKit;let r=n.hasChromiumBreakIterators&&n.hasImageCodecs;if(!r&&e.canvasKitVariant=="chromium")throw"Chromium CanvasKit variant specifically requested, but unsupported in this browser";let a=r&&e.canvasKitVariant!=="full",s=t;e.canvasKitVariant=="experimentalWebParagraph"?s=c(s,"experimental_webparagraph"):a&&(s=c(s,"chromium"));let o=c(s,"canvaskit.js");i.flutterTT.policy&&(o=i.flutterTT.policy.createScriptURL(o));let l=k(c(s,"canvaskit.wasm")),u=await import(o);return window.flutterCanvasKit=await u.default({instantiateWasm:l}),window.flutterCanvasKit})(),window.flutterCanvasKitLoaded);var W=async(i,e,n,t)=>{let a=!n.hasImageCodecs||!n.hasChromiumBreakIterators?"skwasm_heavy":e.enableWimp?"wimp":"skwasm",s=c(t,`${a}.js`),o=s;i.flutterTT.policy&&(o=i.flutterTT.policy.createScriptURL(o));let l=k(c(t,`${a}.wasm`));return await(await import(o)).default({skwasmSingleThreaded:e.enableWimp||!n.crossOriginIsolated||n.isChromeExtension||e.forceSingleThreadedSkwasm,instantiateWasm:l,locateFile:(d,p)=>d.endsWith(".ww.js")?URL.createObjectURL(new Blob([`
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
`],{type:"application/javascript"})):c(t,d),mainScriptUrlOrBlob:s})};var P=w.supportsWasmGC,G=P&&w.webGLVersion>0,b=class{async loadEntrypoint(e){let{serviceWorker:n,...t}=e||{},r=new y,a=new g;a.setTrustedTypesPolicy(r.policy),await a.loadServiceWorker(n).catch(o=>{console.warn("Exception while loading service worker:",o)});let s=new v;return s.setTrustedTypesPolicy(r.policy),this.didCreateEngineInitializer=s.didCreateEngineInitializer.bind(s),s.loadEntrypoint(t)}async load({serviceWorkerSettings:e,onEntrypointLoaded:n,nonce:t,config:r}={}){r??={};let a=_flutter.buildConfig;if(!a)throw"FlutterLoader.load requires _flutter.buildConfig to be set";let s=r.wasmAllowList?.[w.browserEngine]??_[w.browserEngine],o=m=>{switch(m){case"skwasm":return G&&s;default:return!0}},l=m=>m.compileTarget==="dart2wasm"&&!P||r.renderer&&r.renderer!=m.renderer?!1:o(m.renderer),u=a.builds.find(l);if(!u)throw"FlutterLoader could not find a build compatible with configuration and environment.";let d={};d.flutterTT=new y,e&&(d.serviceWorkerLoader=new g,d.serviceWorkerLoader.setTrustedTypesPolicy(d.flutterTT.policy),await d.serviceWorkerLoader.loadServiceWorker(e).catch(m=>{console.warn("Exception while loading service worker:",m)}));let p=E(r,a);u.renderer==="canvaskit"?d.canvasKit=U(d,r,w,p):u.renderer==="skwasm"&&(d.skwasm=W(d,r,w,p));let f=new v;return f.setTrustedTypesPolicy(d.flutterTT.policy),this.didCreateEngineInitializer=f.didCreateEngineInitializer.bind(f),f.load(u,d,r,t,n)}};window._flutter||(window._flutter={});window._flutter.loader||(window._flutter.loader=new b);})();
//# sourceMappingURL=flutter.js.map

if (!window._flutter) {
  window._flutter = {};
}
_flutter.buildConfig = {"engineRevision":"a4ce257c68517c1410f4b48ac9852ab5642a3f8d","builds":[{"compileTarget":"dart2wasm","renderer":"skwasm","mainWasmPath":"main.dart.wasm","jsSupportRuntimePath":"main.dart.mjs"},{"compileTarget":"dart2js","renderer":"canvaskit","mainJsPath":"main.dart.js"}]};


(function () {
  const loadingEl = document.getElementById('loading');
  const textEl = document.getElementById('loading-text');
  const progressEl = document.getElementById('progress');
  const barEl = document.getElementById('progress-bar');
  const BYTES_PER_MIB = 1048576;
  const flutterLoaderConfig = {
    canvasKitBaseUrl: "/canvaskit/",
  };

  function readMetaBytes(name) {
    try {
      const node = document.querySelector(`meta[name="${name}"]`);
      const value = Number.parseInt(node && node.getAttribute('content'), 10);
      return Number.isSafeInteger(value) && value > 0 ? value : 0;
    } catch (_) {
      return 0;
    }
  }

  function supportsFlutterWasm() {
    // Keep this probe aligned with the feature probe in Flutter's generated
    // flutter.js.
    try {
      if (!window.WebAssembly || typeof WebAssembly.validate !== 'function') {
        return false;
      }
      return WebAssembly.validate(new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0,
        1, 5, 1, 95, 1, 120, 0,
      ]));
    } catch (_) {
      return false;
    }
  }

  function flutterBrowserEngine() {
    try {
      const vendor = String(navigator.vendor || '');
      const userAgent = String(navigator.userAgent || '');
      if (vendor === 'Google Inc.' || userAgent.includes('Edg/')) return 'blink';
      if (vendor === 'Apple Computer, Inc.') return 'webkit';
      if (vendor === '' && userAgent.includes('Firefox')) return 'gecko';
      return 'unknown';
    } catch (_) {
      return 'unknown';
    }
  }

  function supportsFlutterWebGL() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.getContext('webgl2') !== null ||
        canvas.getContext('webgl') !== null;
    } catch (_) {
      return false;
    }
  }

  function selectFlutterBuild() {
    try {
      const builds = window._flutter && window._flutter.buildConfig &&
        window._flutter.buildConfig.builds;
      if (!Array.isArray(builds)) return null;

      const engine = flutterBrowserEngine();
      const defaultWasmAllowList = {
        blink: true,
        gecko: false,
        webkit: false,
        unknown: false,
      };
      const configuredAllowList = flutterLoaderConfig.wasmAllowList;
      const wasmAllowed = configuredAllowList &&
          typeof configuredAllowList[engine] === 'boolean'
        ? configuredAllowList[engine]
        : defaultWasmAllowList[engine];
      const wasmGcSupported = supportsFlutterWasm();
      const skwasmSupported = wasmGcSupported && supportsFlutterWebGL() &&
        wasmAllowed;

      return builds.find((build) => {
        if (!build) return false;
        if (build.compileTarget === 'dart2wasm' && !wasmGcSupported) {
          return false;
        }
        if (flutterLoaderConfig.renderer &&
            flutterLoaderConfig.renderer !== build.renderer) {
          return false;
        }
        if (build.renderer === 'skwasm' && !skwasmSupported) {
          return false;
        }
        return true;
      }) || null;
    } catch (_) {
      return null;
    }
  }

  const __ktwTotals = {
    'main.dart.wasm': readMetaBytes('ktw-main-wasm-bytes'),
    'main.dart.js': readMetaBytes('ktw-main-js-bytes'),
  };
  const __ktwSelectedBuild = selectFlutterBuild();
  const __ktwPrimaryId = __ktwSelectedBuild &&
    __ktwSelectedBuild.compileTarget === 'dart2wasm'
    ? 'main.dart.wasm'
    : 'main.dart.js';

  function setText(msg) {
    if (textEl && typeof msg === 'string') textEl.textContent = msg;
  }

  function setProgress(pct, msg) {
    const clamped = Math.max(0, Math.min(100, pct|0));
    if (barEl) barEl.style.width = clamped + '%';
    if (progressEl) progressEl.setAttribute('aria-valuenow', String(clamped));
    if (progressEl && msg) progressEl.setAttribute('aria-valuetext', msg);
    if (msg) setText(msg);
  }

  function formatDownloadLabel(loaded, total, done) {
    const loadedMib = (Math.max(0, loaded) / BYTES_PER_MIB).toFixed(1);
    if (total > 0) {
      const totalMib = (total / BYTES_PER_MIB).toFixed(1);
      const fraction = Math.max(0, Math.min(1, loaded / total));
      const percent = Math.floor(fraction * 100);
      return done
        ? `Download complete — ${totalMib} MiB (100%)`
        : `Downloading app… ${loadedMib} / ${totalMib} MiB (${percent}%)`;
    }
    return done
      ? `Download complete — ${loadedMib} MiB`
      : `Downloading app… ${loadedMib} MiB (total unavailable)`;
  }

  let realDownloadStarted = false;

  function publishDownloadProgress(id, loaded, total, done) {
    if (id !== __ktwPrimaryId) return;

    realDownloadStarted = true;
    const expectedTotal = __ktwTotals[id] || total || 0;
    const safeLoaded = Math.max(0, Number(loaded) || 0);
    const safeTotal = Math.max(0, Number(expectedTotal) || 0);
    const fraction = safeTotal > 0
      ? Math.max(0, Math.min(1, safeLoaded / safeTotal))
      : 0;
    const BASE = 40;
    const MAX = 69;
    const pct = safeTotal > 0
      ? BASE + Math.floor(fraction * (MAX - BASE))
      : BASE;

    setProgress(
      done ? MAX : pct,
      formatDownloadLabel(safeLoaded, safeTotal, done),
    );
  }

  // Gentle fake progress while we wait for real init signals.
  let fake = 8;
  const initialTotal = __ktwTotals[__ktwPrimaryId] || 0;
  setProgress(fake, formatDownloadLabel(0, initialTotal, false));
  const tick = setInterval(() => {
    // ★ lowered fake ceiling so REAL downloads visibly start at 40%
    if (!realDownloadStarted && fake < 38) {
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

  // --- Progress aggregator (selected primary entrypoint only) -----------------
  const __ktwAgg = {
    items: new Map(),   // id -> { loaded, total, done }
    update(id, loaded, total, done) {
      if (id !== __ktwPrimaryId) return;
      const prev = this.items.get(id) || { loaded: 0, total: 0, done: false };
      const cur = {
        loaded: Math.max(loaded || 0, prev.loaded || 0),
        total: total || prev.total || 0,
        done: !!done || prev.done
      };
      this.items.set(id, cur);
      publishDownloadProgress(id, cur.loaded, cur.total, cur.done);
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

      // Content-Length can describe compressed bytes or be unavailable. The
      // build-generated raw artifact size is the matching denominator for the
      // decoded stream chunks counted below.
      const total = __ktwTotals['main.dart.wasm'] ||
        Number(res.headers.get('content-length')) || 0;
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

  // --- JavaScript fallback progress bridge -----------------------------------
  // Flutter loads main.dart.js with a script tag, which has no byte-progress
  // event. Prefetch it through fetch, count the decoded stream, then replace
  // Flutter's one script tag with a Blob URL so the network transfer happens
  // only once while Flutter's normal entrypoint callback remains intact.
  function isMainJsScript(node) {
    if (!node || node.nodeType !== 1 ||
        String(node.tagName || '').toUpperCase() !== 'SCRIPT') {
      return false;
    }
    try {
      const raw = node.getAttribute('src') || node.src || '';
      const url = new URL(raw, document.baseURI);
      return /\/main\.dart\.js(?:$|\?)/.test(url.pathname + url.search);
    } catch (_) {
      return false;
    }
  }

  function installMainJsBlobBridge(blobURL) {
    const nativeAppend = Element.prototype.append;
    const nativeAppendChild = Node.prototype.appendChild;
    let restored = false;

    const restore = () => {
      if (restored) return;
      restored = true;
      Element.prototype.append = nativeAppend;
      Node.prototype.appendChild = nativeAppendChild;
    };

    const replaceNode = (node) => {
      if (!isMainJsScript(node)) return false;
      node.src = blobURL;
      const revoke = () => {
        try { URL.revokeObjectURL(blobURL); } catch (_) {}
      };
      node.addEventListener('load', revoke, { once: true });
      node.addEventListener('error', revoke, { once: true });
      setTimeout(revoke, 120000);
      return true;
    };

    Element.prototype.append = function(...nodes) {
      let replaced = false;
      try {
        const mapped = nodes.map((node) => {
          if (!replaced && replaceNode(node)) replaced = true;
          return node;
        });
        return nativeAppend.apply(this, mapped);
      } finally {
        if (replaced) restore();
      }
    };

    Node.prototype.appendChild = function(node) {
      const replaced = replaceNode(node);
      try {
        return nativeAppendChild.call(this, node);
      } finally {
        if (replaced) restore();
      }
    };
  }

  async function prefetchJavaScriptFallback() {
    if (__ktwPrimaryId !== 'main.dart.js' || typeof window.fetch !== 'function') {
      return;
    }

    const total = __ktwTotals['main.dart.js'];
    if (!total) {
      console.warn('[ktw-loader] main.dart.js total metadata is unavailable');
      return;
    }

    const entrypointUrl = new URL('main.dart.js', document.baseURI).toString();
    const response = await window.fetch(entrypointUrl, {
      cache: 'default',
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error(`main.dart.js prefetch failed with HTTP ${response.status}`);
    }

    const chunks = [];
    let loaded = 0;
    if (response.body && typeof response.body.getReader === 'function') {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        chunks.push(value);
        loaded += value.byteLength;
        __ktwAgg.update('main.dart.js', loaded, total, false);
      }
    } else {
      chunks.push(new Uint8Array(await response.arrayBuffer()));
      loaded = chunks[0].byteLength;
    }

    __ktwAgg.update('main.dart.js', loaded, total, true);
    const blobURL = URL.createObjectURL(new Blob(chunks, {
      type: 'application/javascript',
    }));
    installMainJsBlobBridge(blobURL);
  }

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

  // Hook progress into your loader UI for the selected primary entrypoint.
  window.addEventListener('ktw-wasm-progress', (e) => {
    const d = (e && e.detail) || {};
    const id = d.id || __ktwPrimaryId;
    const loaded = Number(d.loaded) || 0;
    const total = Number(d.total) || 0;
    const done = !!d.done;
    __ktwAgg.update(id, loaded, total, done);
  });

  async function launchFlutter() {
    try {
      await prefetchJavaScriptFallback();
    } catch (error) {
      // The fallback is an observability enhancement. Flutter must still be
      // allowed to load through its native path if prefetching is unavailable.
      console.warn('[ktw-loader] JavaScript fallback progress unavailable:', error);
    }

    _flutter.loader.load({
      config: flutterLoaderConfig,
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
      setProgress(100, 'Failed to load the app.');
    });
  }

  launchFlutter();
})();
