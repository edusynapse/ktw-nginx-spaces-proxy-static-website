(() => {
  const HOST_SEL = 'flutter-view, flt-glass-pane, flt-scene-host';
  const SHELL_SEL = '.ktw-shell-button';
  const TRAIL_Z = '2147483646';
  const TRAIL_POOL = 18;
  const KEYWORDS = new Set([
    'default', 'auto', 'pointer', 'text', 'vertical-text', 'not-allowed',
    'no-drop', 'none', 'alias', 'all-scroll', 'cell', 'context-menu', 'copy',
    'crosshair', 'grab', 'grabbing', 'help', 'move', 'progress', 'wait',
    'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize',
    'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize',
    'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out',
  ]);
  const CHILDREN_STEM = {
    default: 'wand',
    auto: 'wand',
    pointer: 'star',
    text: 'crayon',
    'vertical-text': 'crayon',
    'not-allowed': 'no',
    'no-drop': 'no',
  };
  const LARGE_STEM = {
    default: 'arrow',
    auto: 'arrow',
    pointer: 'pointer',
    text: 'text',
    'vertical-text': 'text',
    'not-allowed': 'forbidden',
    'no-drop': 'forbidden',
  };

  let disabled = false;
  let zoomFactor = 1;
  let ramTheme = null;
  let ramLarge = null;
  let currentHost = null;
  let lastWritten = null;
  let styleObs = null;
  let childrenHot = null;
  let largeHot = null;
  let pointerType = 'mouse';
  let pointerInside = false;
  let lastX = 0;
  let lastY = 0;
  let trailRaf = 0;
  let trailOverlay = null;
  let trailPool = [];
  let reducedMotionMq = null;

  function readStoredString(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return '';
      raw = String(raw).trim();
      if (!raw) return '';
      if ((raw.charAt(0) === '"' && raw.charAt(raw.length - 1) === '"') ||
          (raw.charAt(0) === "'" && raw.charAt(raw.length - 1) === "'")) {
        try { return JSON.parse(raw); } catch (e) { return raw.slice(1, -1); }
      }
      return raw;
    } catch (e) {
      return '';
    }
  }

  function sanitizeTheme(name) {
    var s = String(name || '').trim();
    return /^[A-Za-z0-9_-]+$/.test(s) ? s : 'default';
  }

  function getTheme() {
    if (ramTheme != null) return ramTheme;
    return sanitizeTheme(
      readStoredString('flutter.selected_theme') ||
      readStoredString('selected_theme') ||
      'default',
    );
  }

  function getLargePointer() {
    if (ramLarge != null) return ramLarge;
    var v = readStoredString('flutter.web_large_pointer');
    return v === 'true' || v === '1';
  }

  function packName() {
    if (getTheme() === 'children') return 'children';
    if (getLargePointer()) return 'large';
    return null;
  }

  function cssBucket() {
    var dpr = window.devicePixelRatio || 1;
    var scale = zoomFactor * dpr;
    if (getTheme() === 'children') {
      return (getLargePointer() || scale > 1.25) ? 48 : 32;
    }
    return 48;
  }

  function parseKeyword(cursorValue) {
    if (!cursorValue) return 'default';
    var v = String(cursorValue).trim().toLowerCase();
    if (!v) return 'default';
    if (v === 'none') return 'none';
    if (v.indexOf('url(') !== -1 || v.indexOf('image-set') !== -1) return null;
    var parts = v.split(',');
    var last = parts[parts.length - 1].trim().split(/\s+/)[0];
    if (KEYWORDS.has(last)) return last === 'auto' ? 'default' : last;
    var first = v.split(/\s+/)[0];
    if (KEYWORDS.has(first)) return first === 'auto' ? 'default' : first;
    return 'default';
  }

  function stemFor(kind, pack) {
    if (kind === 'none') return null;
    var table = pack === 'children' ? CHILDREN_STEM : LARGE_STEM;
    if (Object.prototype.hasOwnProperty.call(table, kind)) return table[kind];
    return pack === 'children' ? 'wand' : 'arrow';
  }

  function hotspot(pack, stem, bucket) {
    var table = pack === 'children' ? childrenHot : largeHot;
    var entry = table && table[stem];
    var pair = entry && (entry[String(bucket)] || entry[bucket]);
    if (Array.isArray(pair) && pair.length >= 2) {
      return [Number(pair[0]) || 0, Number(pair[1]) || 0];
    }
    return [0, 0];
  }

  function fallbackKeyword(kind) {
    if (kind === 'none') return 'none';
    if (KEYWORDS.has(kind) && kind !== 'auto') return kind;
    return 'default';
  }

  function buildCursorCss(kind) {
    var pack = packName();
    if (!pack) return null;
    if (kind === 'none') return 'none';
    var stem = stemFor(kind, pack);
    if (!stem) return 'none';
    var bucket = cssBucket();
    var hs = hotspot(pack, stem, bucket);
    var base = '/cursors/' + pack + '/' + stem;
    var fallback = fallbackKeyword(kind);
    if (bucket === 32) {
      return '-webkit-image-set(url("' + base + '-32.png") 1x, url("' +
        base + '-64.png") 2x, url("' + base + '-96.png") 3x) ' +
        hs[0] + ' ' + hs[1] + ', ' + fallback;
    }
    return '-webkit-image-set(url("' + base + '-48.png") 1x, url("' +
      base + '-96.png") 2x) ' + hs[0] + ' ' + hs[1] + ', ' + fallback;
  }

  function disableController(host, kind) {
    disabled = true;
    try {
      if (host && kind) host.style.cursor = kind;
    } catch (_) {}
    hideTrail();
  }

  function applyCursor(host, kind) {
    if (!host) return;
    var next;
    try {
      next = buildCursorCss(kind);
    } catch (err) {
      disableController(host, kind || 'default');
      return;
    }
    if (kind === 'none') {
      host.style.cursor = 'none';
      lastWritten = host.getAttribute('style') || '';
      return;
    }
    if (next == null) {
      var stored = host.getAttribute('data-ktw-cursor-kind') || 'default';
      if ((host.style.cursor || '').indexOf('url(') !== -1 ||
          (host.style.cursor || '').indexOf('image-set') !== -1) {
        host.style.cursor = stored;
      }
      lastWritten = host.getAttribute('style') || '';
      return;
    }
    host.style.cursor = next;
    lastWritten = host.getAttribute('style') || '';
  }

  function onStyleMut(host) {
    if (disabled || !host) return;
    var styleAttr = host.getAttribute('style') || '';
    if (styleAttr === lastWritten) return;
    var cursor = host.style.cursor || '';
    var parsed = parseKeyword(cursor);
    var kind;
    if (parsed == null) {
      kind = host.getAttribute('data-ktw-cursor-kind') || 'default';
    } else {
      kind = parsed;
      host.setAttribute('data-ktw-cursor-kind', kind);
    }
    applyCursor(host, kind);
  }

  function attachHost(host) {
    if (styleObs) {
      try { styleObs.disconnect(); } catch (_) {}
      styleObs = null;
    }
    currentHost = host;
    lastWritten = null;
    styleObs = new MutationObserver(function () { onStyleMut(host); });
    styleObs.observe(host, { attributes: true, attributeFilter: ['style'] });
    onStyleMut(host);
  }

  function applyShell() {
    var buttons = document.querySelectorAll(SHELL_SEL);
    if (!buttons.length) return;
    var pack = packName();
    var css = pack ? buildCursorCss('pointer') : '';
    for (var i = 0; i < buttons.length; i++) {
      if (css) buttons[i].style.cursor = css;
      else buttons[i].style.removeProperty('cursor');
    }
  }

  function refreshHost() {
    if (disabled) return;
    // Shell buttons first: they live outside the Flutter view, so a theme
    // change must reach them even while the host is detached (hot restart,
    // WASM→JS fallback) or the Electron title bar keeps the old cursor.
    applyShell();
    var host = currentHost;
    if (!host || !host.isConnected) return;
    var kind = host.getAttribute('data-ktw-cursor-kind') ||
      parseKeyword(host.style.cursor) || 'default';
    applyCursor(host, kind);
  }

  function findHost() {
    return document.querySelector(HOST_SEL);
  }

  function watchHost() {
    var appearObs = new MutationObserver(function () {
      var host = findHost();
      if (host && host !== currentHost) attachHost(host);
      if (currentHost && !currentHost.isConnected) {
        currentHost = null;
        lastWritten = null;
      }
      applyShell();
    });
    appearObs.observe(document.documentElement, { childList: true, subtree: true });
    var existing = findHost();
    if (existing) attachHost(existing);
    applyShell();
  }

  function reducedMotion() {
    try {
      if (!reducedMotionMq) {
        reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
      }
      return !!reducedMotionMq.matches;
    } catch (_) {
      return false;
    }
  }

  function trailAllowed() {
    if (disabled) return false;
    if (getTheme() !== 'children') return false;
    if (pointerType !== 'mouse') return false;
    if (reducedMotion()) return false;
    if (document.hidden) return false;
    if (typeof document.hasFocus === 'function' && !document.hasFocus()) return false;
    if (!pointerInside) return false;
    if (document.documentElement.classList.contains('ktw-trail-off')) return false;
    return true;
  }

  function ensureTrail() {
    if (trailOverlay) return;
    trailOverlay = document.createElement('div');
    trailOverlay.id = 'ktw-pointer-trail';
    trailOverlay.setAttribute('aria-hidden', 'true');
    trailOverlay.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:' + TRAIL_Z +
      ';overflow:hidden;';
    document.documentElement.appendChild(trailOverlay);
    // sparkle-32 is the @2x source: still drawn at 16 CSS px, just crisp on
    // hi-DPI. Without this the 32 bitmap ships and is never referenced.
    var dpr = window.devicePixelRatio || 1;
    var sparkle = dpr > 1.25
      ? '/cursors/trail/sparkle-32.png'
      : '/cursors/trail/sparkle-16.png';
    for (var i = 0; i < TRAIL_POOL; i++) {
      var img = document.createElement('img');
      img.alt = '';
      img.src = sparkle;
      img.width = 16;
      img.height = 16;
      img.style.cssText =
        'position:absolute;left:0;top:0;width:16px;height:16px;opacity:0;' +
        'will-change:transform,opacity;pointer-events:none;';
      trailOverlay.appendChild(img);
      trailPool.push({ el: img, born: 0, life: 0, x: 0, y: 0, scale: 1, active: false });
    }
  }

  function hideTrail() {
    pointerInside = false;
    for (var i = 0; i < trailPool.length; i++) {
      trailPool[i].active = false;
      trailPool[i].el.style.opacity = '0';
    }
    if (trailRaf) {
      cancelAnimationFrame(trailRaf);
      trailRaf = 0;
    }
  }

  function spawnSparkle(now) {
    var slot = null;
    for (var i = 0; i < trailPool.length; i++) {
      if (!trailPool[i].active) { slot = trailPool[i]; break; }
    }
    if (!slot) slot = trailPool[0];
    var driftX = (Math.random() - 0.5) * 16;
    var driftY = 4 + Math.random() * 12;
    slot.active = true;
    slot.born = now;
    slot.life = 280 + Math.random() * 140;
    slot.x = lastX + driftX;
    slot.y = lastY + driftY;
    slot.scale = 0.7 + Math.random() * 0.6;
  }

  var lastSpawn = 0;

  function trailTick(now) {
    trailRaf = 0;
    if (!trailAllowed()) {
      hideTrail();
      return;
    }
    ensureTrail();
    if (now - lastSpawn > 28) {
      spawnSparkle(now);
      lastSpawn = now;
    }
    var any = false;
    for (var i = 0; i < trailPool.length; i++) {
      var s = trailPool[i];
      if (!s.active) continue;
      var t = (now - s.born) / s.life;
      if (t >= 1) {
        s.active = false;
        s.el.style.opacity = '0';
        continue;
      }
      any = true;
      var opacity = 1 - t;
      var scale = s.scale * (1 - t * 0.45);
      s.el.style.opacity = String(opacity);
      s.el.style.transform =
        'translate3d(' + (s.x - 8) + 'px,' + (s.y - 8) + 'px,0) scale(' + scale + ')';
    }
    if (any || trailAllowed()) {
      trailRaf = requestAnimationFrame(trailTick);
    }
  }

  function kickTrail() {
    if (trailRaf || !trailAllowed()) return;
    trailRaf = requestAnimationFrame(trailTick);
  }

  function onPointerMove(ev) {
    pointerType = ev.pointerType || 'mouse';
    if (pointerType !== 'mouse') {
      hideTrail();
      return;
    }
    pointerInside = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
    kickTrail();
  }

  function onPointerDown(ev) {
    pointerType = ev.pointerType || 'mouse';
    if (pointerType !== 'mouse') hideTrail();
  }

  function onPointerLeave() {
    hideTrail();
  }

  function onPrefs(ev) {
    var d = ev && ev.detail;
    if (typeof d === 'string') {
      try { d = JSON.parse(d); } catch (_) { d = {}; }
    }
    d = d || {};
    if (typeof d.theme === 'string') ramTheme = sanitizeTheme(d.theme);
    if (typeof d.largePointer === 'boolean') ramLarge = d.largePointer;
    refreshHost();
    if (!trailAllowed()) hideTrail();
  }

  function setZoomFactor(value) {
    var n = Number(value);
    zoomFactor = Number.isFinite(n) && n > 0 ? n : 1;
    refreshHost();
  }

  async function loadHotspots() {
    var res = await Promise.all([
      fetch('/cursors/children/hotspots.json', { credentials: 'same-origin' }),
      fetch('/cursors/large/hotspots.json', { credentials: 'same-origin' }),
    ]);
    if (!res[0].ok || !res[1].ok) throw new Error('hotspots fetch failed');
    childrenHot = await res[0].json();
    largeHot = await res[1].json();
  }

  function bind() {
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', hideTrail);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) hideTrail();
    });
    window.addEventListener('ktw-pointer-prefs', onPrefs);
    window.addEventListener('pageshow', function () { refreshHost(); });
    window.addEventListener('resize', function () { refreshHost(); });
  }

  window.__ktwPointer = {
    setZoomFactor: setZoomFactor,
  };

  loadHotspots().then(function () {
    bind();
    watchHost();
  }).catch(function (err) {
    disabled = true;
    try { console.warn('[ktw-pointer]', err); } catch (_) {}
  });
})();
