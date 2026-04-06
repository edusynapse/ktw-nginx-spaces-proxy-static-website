// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It should return a JS Array containing 2 elements. The first
  //   should be the bytes for the wasm module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The second
  //   should be the result of using the JS 'import' API on the js file path.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _3: (o, t) => typeof o === t,
      _4: (o, c) => o instanceof c,
      _5: o => Object.keys(o),
      _7: (o,s,v) => o[s] = v,
      _8: (o, a) => o + a,
      _26: (o) => !!o,
      _35: () => new Array(),
      _36: x0 => new Array(x0),
      _38: x0 => x0.length,
      _40: (x0,x1) => x0[x1],
      _41: (x0,x1,x2) => { x0[x1] = x2 },
      _43: x0 => new Promise(x0),
      _45: (x0,x1,x2) => new DataView(x0,x1,x2),
      _47: x0 => new Int8Array(x0),
      _48: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _49: x0 => new Uint8Array(x0),
      _51: x0 => new Uint8ClampedArray(x0),
      _53: x0 => new Int16Array(x0),
      _55: x0 => new Uint16Array(x0),
      _57: x0 => new Int32Array(x0),
      _59: x0 => new Uint32Array(x0),
      _61: x0 => new Float32Array(x0),
      _63: x0 => new Float64Array(x0),
      _65: (x0,x1,x2) => x0.call(x1,x2),
      _66: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._66(f,arguments.length,x0,x1) }),
      _69: () => Symbol("jsBoxedDartObjectProperty"),
      _70: (decoder, codeUnits) => decoder.decode(codeUnits),
      _71: () => new TextDecoder("utf-8", {fatal: true}),
      _72: () => new TextDecoder("utf-8", {fatal: false}),
      _73: (s) => +s,
      _74: x0 => new Uint8Array(x0),
      _75: (x0,x1,x2) => x0.set(x1,x2),
      _76: (x0,x1) => x0.transferFromImageBitmap(x1),
      _77: x0 => x0.arrayBuffer(),
      _78: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._78(f,arguments.length,x0) }),
      _79: x0 => new window.FinalizationRegistry(x0),
      _80: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _81: (x0,x1) => x0.unregister(x1),
      _82: (x0,x1,x2) => x0.slice(x1,x2),
      _83: (x0,x1) => x0.decode(x1),
      _84: (x0,x1) => x0.segment(x1),
      _85: () => new TextDecoder(),
      _87: x0 => x0.buffer,
      _88: x0 => x0.wasmMemory,
      _89: () => globalThis.window._flutter_skwasmInstance,
      _90: x0 => x0.rasterStartMilliseconds,
      _91: x0 => x0.rasterEndMilliseconds,
      _92: x0 => x0.imageBitmaps,
      _196: x0 => x0.stopPropagation(),
      _197: x0 => x0.preventDefault(),
      _199: x0 => x0.remove(),
      _200: (x0,x1) => x0.append(x1),
      _201: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _246: x0 => x0.unlock(),
      _247: x0 => x0.getReader(),
      _248: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _249: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _250: (x0,x1) => x0.item(x1),
      _251: x0 => x0.next(),
      _252: x0 => x0.now(),
      _253: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._253(f,arguments.length,x0) }),
      _254: (x0,x1) => x0.addListener(x1),
      _255: (x0,x1) => x0.removeListener(x1),
      _256: (x0,x1) => x0.matchMedia(x1),
      _257: (x0,x1) => x0.revokeObjectURL(x1),
      _258: x0 => x0.close(),
      _259: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _260: x0 => new window.ImageDecoder(x0),
      _261: x0 => ({frameIndex: x0}),
      _262: (x0,x1) => x0.decode(x1),
      _263: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._263(f,arguments.length,x0) }),
      _264: (x0,x1) => x0.getModifierState(x1),
      _265: (x0,x1) => x0.removeProperty(x1),
      _266: (x0,x1) => x0.prepend(x1),
      _267: x0 => new Intl.Locale(x0),
      _268: x0 => x0.disconnect(),
      _269: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._269(f,arguments.length,x0) }),
      _270: (x0,x1) => x0.getAttribute(x1),
      _271: (x0,x1) => x0.contains(x1),
      _272: (x0,x1) => x0.querySelector(x1),
      _273: x0 => x0.blur(),
      _274: x0 => x0.hasFocus(),
      _275: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _276: (x0,x1) => x0.hasAttribute(x1),
      _277: (x0,x1) => x0.getModifierState(x1),
      _278: (x0,x1) => x0.createTextNode(x1),
      _279: (x0,x1) => x0.appendChild(x1),
      _280: (x0,x1) => x0.removeAttribute(x1),
      _281: x0 => x0.getBoundingClientRect(),
      _282: (x0,x1) => x0.observe(x1),
      _283: x0 => x0.disconnect(),
      _284: (x0,x1) => x0.closest(x1),
      _707: () => globalThis.window.flutterConfiguration,
      _709: x0 => x0.assetBase,
      _714: x0 => x0.canvasKitMaximumSurfaces,
      _715: x0 => x0.debugShowSemanticsNodes,
      _716: x0 => x0.hostElement,
      _717: x0 => x0.multiViewEnabled,
      _718: x0 => x0.nonce,
      _720: x0 => x0.fontFallbackBaseUrl,
      _730: x0 => x0.console,
      _731: x0 => x0.devicePixelRatio,
      _732: x0 => x0.document,
      _733: x0 => x0.history,
      _734: x0 => x0.innerHeight,
      _735: x0 => x0.innerWidth,
      _736: x0 => x0.location,
      _737: x0 => x0.navigator,
      _738: x0 => x0.visualViewport,
      _739: x0 => x0.performance,
      _741: x0 => x0.URL,
      _743: (x0,x1) => x0.getComputedStyle(x1),
      _744: x0 => x0.screen,
      _745: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._745(f,arguments.length,x0) }),
      _746: (x0,x1) => x0.requestAnimationFrame(x1),
      _751: (x0,x1) => x0.warn(x1),
      _753: (x0,x1) => x0.debug(x1),
      _754: x0 => globalThis.parseFloat(x0),
      _755: () => globalThis.window,
      _756: () => globalThis.Intl,
      _757: () => globalThis.Symbol,
      _758: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _760: x0 => x0.clipboard,
      _761: x0 => x0.maxTouchPoints,
      _762: x0 => x0.vendor,
      _763: x0 => x0.language,
      _764: x0 => x0.platform,
      _765: x0 => x0.userAgent,
      _766: (x0,x1) => x0.vibrate(x1),
      _767: x0 => x0.languages,
      _768: x0 => x0.documentElement,
      _769: (x0,x1) => x0.querySelector(x1),
      _772: (x0,x1) => x0.createElement(x1),
      _775: (x0,x1) => x0.createEvent(x1),
      _776: x0 => x0.activeElement,
      _779: x0 => x0.head,
      _780: x0 => x0.body,
      _782: (x0,x1) => { x0.title = x1 },
      _785: x0 => x0.visibilityState,
      _786: () => globalThis.document,
      _787: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._787(f,arguments.length,x0) }),
      _788: (x0,x1) => x0.dispatchEvent(x1),
      _796: x0 => x0.target,
      _798: x0 => x0.timeStamp,
      _799: x0 => x0.type,
      _801: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _807: x0 => x0.baseURI,
      _808: x0 => x0.firstChild,
      _812: x0 => x0.parentElement,
      _814: (x0,x1) => { x0.textContent = x1 },
      _815: x0 => x0.parentNode,
      _816: x0 => x0.nextSibling,
      _817: (x0,x1) => x0.removeChild(x1),
      _818: x0 => x0.isConnected,
      _823: x0 => x0.firstElementChild,
      _826: x0 => x0.clientHeight,
      _827: x0 => x0.clientWidth,
      _828: x0 => x0.offsetHeight,
      _829: x0 => x0.offsetWidth,
      _830: x0 => x0.id,
      _831: (x0,x1) => { x0.id = x1 },
      _834: (x0,x1) => { x0.spellcheck = x1 },
      _835: x0 => x0.tagName,
      _836: x0 => x0.style,
      _838: (x0,x1) => x0.querySelectorAll(x1),
      _839: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _840: (x0,x1) => { x0.tabIndex = x1 },
      _841: x0 => x0.tabIndex,
      _842: (x0,x1) => x0.focus(x1),
      _843: x0 => x0.scrollTop,
      _844: (x0,x1) => { x0.scrollTop = x1 },
      _845: x0 => x0.scrollLeft,
      _846: (x0,x1) => { x0.scrollLeft = x1 },
      _847: x0 => x0.classList,
      _849: (x0,x1) => { x0.className = x1 },
      _851: (x0,x1) => x0.getElementsByClassName(x1),
      _852: x0 => x0.click(),
      _853: (x0,x1) => x0.attachShadow(x1),
      _856: x0 => x0.computedStyleMap(),
      _857: (x0,x1) => x0.get(x1),
      _863: (x0,x1) => x0.getPropertyValue(x1),
      _864: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _865: x0 => x0.offsetLeft,
      _866: x0 => x0.offsetTop,
      _867: x0 => x0.offsetParent,
      _869: (x0,x1) => { x0.name = x1 },
      _870: x0 => x0.content,
      _871: (x0,x1) => { x0.content = x1 },
      _875: (x0,x1) => { x0.src = x1 },
      _876: x0 => x0.naturalWidth,
      _877: x0 => x0.naturalHeight,
      _881: (x0,x1) => { x0.crossOrigin = x1 },
      _883: (x0,x1) => { x0.decoding = x1 },
      _884: x0 => x0.decode(),
      _889: (x0,x1) => { x0.nonce = x1 },
      _894: (x0,x1) => { x0.width = x1 },
      _896: (x0,x1) => { x0.height = x1 },
      _899: (x0,x1) => x0.getContext(x1),
      _960: x0 => x0.width,
      _961: x0 => x0.height,
      _963: (x0,x1) => x0.fetch(x1),
      _964: x0 => x0.status,
      _966: x0 => x0.body,
      _967: x0 => x0.arrayBuffer(),
      _970: x0 => x0.read(),
      _971: x0 => x0.value,
      _972: x0 => x0.done,
      _979: x0 => x0.name,
      _980: x0 => x0.x,
      _981: x0 => x0.y,
      _984: x0 => x0.top,
      _985: x0 => x0.right,
      _986: x0 => x0.bottom,
      _987: x0 => x0.left,
      _997: x0 => x0.height,
      _998: x0 => x0.width,
      _999: x0 => x0.scale,
      _1000: (x0,x1) => { x0.value = x1 },
      _1003: (x0,x1) => { x0.placeholder = x1 },
      _1005: (x0,x1) => { x0.name = x1 },
      _1006: x0 => x0.selectionDirection,
      _1007: x0 => x0.selectionStart,
      _1008: x0 => x0.selectionEnd,
      _1011: x0 => x0.value,
      _1013: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1014: x0 => x0.readText(),
      _1015: (x0,x1) => x0.writeText(x1),
      _1017: x0 => x0.altKey,
      _1018: x0 => x0.code,
      _1019: x0 => x0.ctrlKey,
      _1020: x0 => x0.key,
      _1021: x0 => x0.keyCode,
      _1022: x0 => x0.location,
      _1023: x0 => x0.metaKey,
      _1024: x0 => x0.repeat,
      _1025: x0 => x0.shiftKey,
      _1026: x0 => x0.isComposing,
      _1028: x0 => x0.state,
      _1029: (x0,x1) => x0.go(x1),
      _1031: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1032: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1033: x0 => x0.pathname,
      _1034: x0 => x0.search,
      _1035: x0 => x0.hash,
      _1039: x0 => x0.state,
      _1042: (x0,x1) => x0.createObjectURL(x1),
      _1044: x0 => new Blob(x0),
      _1046: x0 => new MutationObserver(x0),
      _1047: (x0,x1,x2) => x0.observe(x1,x2),
      _1048: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1048(f,arguments.length,x0,x1) }),
      _1051: x0 => x0.attributeName,
      _1052: x0 => x0.type,
      _1053: x0 => x0.matches,
      _1054: x0 => x0.matches,
      _1058: x0 => x0.relatedTarget,
      _1060: x0 => x0.clientX,
      _1061: x0 => x0.clientY,
      _1062: x0 => x0.offsetX,
      _1063: x0 => x0.offsetY,
      _1066: x0 => x0.button,
      _1067: x0 => x0.buttons,
      _1068: x0 => x0.ctrlKey,
      _1072: x0 => x0.pointerId,
      _1073: x0 => x0.pointerType,
      _1074: x0 => x0.pressure,
      _1075: x0 => x0.tiltX,
      _1076: x0 => x0.tiltY,
      _1077: x0 => x0.getCoalescedEvents(),
      _1080: x0 => x0.deltaX,
      _1081: x0 => x0.deltaY,
      _1082: x0 => x0.wheelDeltaX,
      _1083: x0 => x0.wheelDeltaY,
      _1084: x0 => x0.deltaMode,
      _1091: x0 => x0.changedTouches,
      _1094: x0 => x0.clientX,
      _1095: x0 => x0.clientY,
      _1098: x0 => x0.data,
      _1101: (x0,x1) => { x0.disabled = x1 },
      _1103: (x0,x1) => { x0.type = x1 },
      _1104: (x0,x1) => { x0.max = x1 },
      _1105: (x0,x1) => { x0.min = x1 },
      _1106: x0 => x0.value,
      _1107: (x0,x1) => { x0.value = x1 },
      _1108: x0 => x0.disabled,
      _1109: (x0,x1) => { x0.disabled = x1 },
      _1111: (x0,x1) => { x0.placeholder = x1 },
      _1112: (x0,x1) => { x0.name = x1 },
      _1115: (x0,x1) => { x0.autocomplete = x1 },
      _1116: x0 => x0.selectionDirection,
      _1117: x0 => x0.selectionStart,
      _1119: x0 => x0.selectionEnd,
      _1122: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1123: (x0,x1) => x0.add(x1),
      _1126: (x0,x1) => { x0.noValidate = x1 },
      _1127: (x0,x1) => { x0.method = x1 },
      _1128: (x0,x1) => { x0.action = x1 },
      _1129: (x0,x1) => new OffscreenCanvas(x0,x1),
      _1135: (x0,x1) => x0.getContext(x1),
      _1137: x0 => x0.convertToBlob(),
      _1154: x0 => x0.orientation,
      _1155: x0 => x0.width,
      _1156: x0 => x0.height,
      _1157: (x0,x1) => x0.lock(x1),
      _1176: x0 => new ResizeObserver(x0),
      _1179: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1179(f,arguments.length,x0,x1) }),
      _1187: x0 => x0.length,
      _1188: x0 => x0.iterator,
      _1189: x0 => x0.Segmenter,
      _1190: x0 => x0.v8BreakIterator,
      _1191: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1194: x0 => x0.language,
      _1195: x0 => x0.script,
      _1196: x0 => x0.region,
      _1214: x0 => x0.done,
      _1215: x0 => x0.value,
      _1216: x0 => x0.index,
      _1220: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1221: (x0,x1) => x0.adoptText(x1),
      _1222: x0 => x0.first(),
      _1223: x0 => x0.next(),
      _1224: x0 => x0.current(),
      _1238: x0 => x0.hostElement,
      _1239: x0 => x0.viewConstraints,
      _1242: x0 => x0.maxHeight,
      _1243: x0 => x0.maxWidth,
      _1244: x0 => x0.minHeight,
      _1245: x0 => x0.minWidth,
      _1246: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1246(f,arguments.length,x0) }),
      _1247: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1247(f,arguments.length,x0) }),
      _1248: (x0,x1) => ({addView: x0,removeView: x1}),
      _1251: x0 => x0.loader,
      _1252: () => globalThis._flutter,
      _1253: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1254: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1254(f,arguments.length,x0) }),
      _1255: f => finalizeWrapper(f, function() { return dartInstance.exports._1255(f,arguments.length) }),
      _1256: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1259: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1259(f,arguments.length,x0) }),
      _1260: x0 => ({runApp: x0}),
      _1262: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1262(f,arguments.length,x0,x1) }),
      _1263: x0 => x0.length,
      _1264: () => globalThis.window.ImageDecoder,
      _1265: x0 => x0.tracks,
      _1267: x0 => x0.completed,
      _1269: x0 => x0.image,
      _1275: x0 => x0.displayWidth,
      _1276: x0 => x0.displayHeight,
      _1277: x0 => x0.duration,
      _1280: x0 => x0.ready,
      _1281: x0 => x0.selectedTrack,
      _1282: x0 => x0.repetitionCount,
      _1283: x0 => x0.frameCount,
      _1331: (x0,x1) => x0.createElement(x1),
      _1337: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1338: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._1338(f,arguments.length,x0,x1,x2) }),
      _1339: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1339(f,arguments.length,x0) }),
      _1340: f => finalizeWrapper(f, function() { return dartInstance.exports._1340(f,arguments.length) }),
      _1341: x0 => x0.pause(),
      _1342: x0 => globalThis.URL.revokeObjectURL(x0),
      _1343: x0 => x0.load(),
      _1344: x0 => x0.play(),
      _1345: (x0,x1) => x0.createElement(x1),
      _1346: x0 => x0.reload(),
      _1347: (x0,x1) => x0.getElementById(x1),
      _1348: (x0,x1) => x0.appendChild(x1),
      _1349: x0 => x0.remove(),
      _1350: (x0,x1,x2) => x0.setItem(x1,x2),
      _1351: (x0,x1) => x0.getItem(x1),
      _1352: (x0,x1) => x0.removeItem(x1),
      _1354: x0 => x0.click(),
      _1355: (x0,x1) => x0.append(x1),
      _1356: (x0,x1,x2,x3) => x0.createFlutterInAppWebView(x1,x2,x3),
      _1357: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1358: (x0,x1) => x0.removeAttribute(x1),
      _1359: (x0,x1) => x0.prepare(x1),
      _1360: (x0,x1) => x0.getResponseHeader(x1),
      _1361: x0 => x0.reload(),
      _1362: x0 => x0.goBack(),
      _1363: x0 => x0.goForward(),
      _1364: (x0,x1) => x0.goBackOrForward(x1),
      _1365: (x0,x1) => x0.evaluateJavascript(x1),
      _1366: x0 => x0.stopLoading(),
      _1367: x0 => x0.getUrl(),
      _1368: x0 => x0.getTitle(),
      _1369: (x0,x1,x2) => x0.injectJavascriptFileFromUrl(x1,x2),
      _1370: (x0,x1) => x0.injectCSSCode(x1),
      _1371: (x0,x1,x2) => x0.injectCSSFileFromUrl(x1,x2),
      _1372: (x0,x1,x2,x3) => x0.scrollTo(x1,x2,x3),
      _1373: (x0,x1,x2,x3) => x0.scrollBy(x1,x2,x3),
      _1374: x0 => x0.printCurrentPage(),
      _1375: x0 => x0.getContentHeight(),
      _1376: x0 => x0.getContentWidth(),
      _1377: x0 => x0.getSelectedText(),
      _1378: x0 => x0.getScrollX(),
      _1379: x0 => x0.getScrollY(),
      _1380: x0 => x0.isSecureContext(),
      _1381: x0 => x0.canScrollVertically(),
      _1382: x0 => x0.canScrollHorizontally(),
      _1383: (x0,x1) => x0.item(x1),
      _1384: x0 => x0.getSize(),
      _1385: (x0,x1) => x0.setSettings(x1),
      _1386: (x0,x1) => { x0.csp = x1 },
      _1387: x0 => x0.csp,
      _1388: (x0,x1) => x0.getCookieExpirationDate(x1),
      _1498: x0 => x0.preventDefault(),
      _1499: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1499(f,arguments.length,x0) }),
      _1500: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1501: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1502: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1503: (x0,x1) => x0.getAttribute(x1),
      _1507: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1508: (x0,x1) => x0.canShare(x1),
      _1509: (x0,x1) => x0.share(x1),
      _1512: (x0,x1) => ({files: x0,text: x1}),
      _1514: x0 => ({files: x0}),
      _1516: x0 => ({text: x0}),
      _1519: () => globalThis.Notification.requestPermission(),
      _1521: x0 => globalThis.URL.createObjectURL(x0),
      _1527: (x0,x1) => x0.querySelector(x1),
      _1529: x0 => x0.disconnect(),
      _1530: x0 => x0.disconnect(),
      _1531: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1531(f,arguments.length,x0,x1) }),
      _1532: x0 => new ResizeObserver(x0),
      _1533: (x0,x1) => x0.observe(x1),
      _1534: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1534(f,arguments.length,x0,x1) }),
      _1535: x0 => new MutationObserver(x0),
      _1536: x0 => ({childList: x0}),
      _1537: (x0,x1,x2) => x0.observe(x1,x2),
      _1538: (x0,x1) => x0.item(x1),
      _1539: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1539(f,arguments.length,x0) }),
      _1540: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1540(f,arguments.length,x0) }),
      _1541: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1541(f,arguments.length,x0) }),
      _1542: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1542(f,arguments.length,x0) }),
      _1543: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1543(f,arguments.length,x0) }),
      _1544: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1544(f,arguments.length,x0) }),
      _1545: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1545(f,arguments.length,x0) }),
      _1546: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1546(f,arguments.length,x0) }),
      _1547: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1547(f,arguments.length,x0) }),
      _1548: (x0,x1) => x0.end(x1),
      _1549: (x0,x1) => x0.setSinkId(x1),
      _1550: x0 => x0.decode(),
      _1551: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1552: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1553: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1553(f,arguments.length,x0) }),
      _1554: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1554(f,arguments.length,x0) }),
      _1555: x0 => x0.send(),
      _1556: () => new XMLHttpRequest(),
      _1558: (x0,x1) => x0.getIdToken(x1),
      _1577: x0 => x0.toJSON(),
      _1578: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1578(f,arguments.length,x0) }),
      _1579: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1579(f,arguments.length,x0) }),
      _1580: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1581: x0 => x0.call(),
      _1582: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1582(f,arguments.length,x0) }),
      _1583: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1583(f,arguments.length,x0) }),
      _1584: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1584(f,arguments.length,x0) }),
      _1585: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1585(f,arguments.length,x0) }),
      _1586: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      _1597: (x0,x1) => globalThis.firebase_auth.signInWithCredential(x0,x1),
      _1606: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1624: (x0,x1) => globalThis.firebase_auth.GoogleAuthProvider.credential(x0,x1),
      _1625: x0 => new firebase_auth.OAuthProvider(x0),
      _1628: (x0,x1) => x0.credential(x1),
      _1629: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      _1644: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      _1645: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1646: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1647: (x0,x1,x2) => ({accessToken: x0,idToken: x1,rawNonce: x2}),
      _1652: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      _1667: () => globalThis.firebase_auth.debugErrorMap,
      _1670: () => globalThis.firebase_auth.browserSessionPersistence,
      _1672: () => globalThis.firebase_auth.browserLocalPersistence,
      _1674: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1677: x0 => globalThis.firebase_auth.multiFactor(x0),
      _1678: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      _1680: x0 => x0.currentUser,
      _1684: x0 => x0.tenantId,
      _1694: x0 => x0.displayName,
      _1695: x0 => x0.email,
      _1696: x0 => x0.phoneNumber,
      _1697: x0 => x0.photoURL,
      _1698: x0 => x0.providerId,
      _1699: x0 => x0.uid,
      _1700: x0 => x0.emailVerified,
      _1701: x0 => x0.isAnonymous,
      _1702: x0 => x0.providerData,
      _1703: x0 => x0.refreshToken,
      _1704: x0 => x0.tenantId,
      _1705: x0 => x0.metadata,
      _1707: x0 => x0.providerId,
      _1708: x0 => x0.signInMethod,
      _1709: x0 => x0.accessToken,
      _1710: x0 => x0.idToken,
      _1711: x0 => x0.secret,
      _1722: x0 => x0.creationTime,
      _1723: x0 => x0.lastSignInTime,
      _1728: x0 => x0.code,
      _1730: x0 => x0.message,
      _1742: x0 => x0.email,
      _1743: x0 => x0.phoneNumber,
      _1744: x0 => x0.tenantId,
      _1767: x0 => x0.user,
      _1770: x0 => x0.providerId,
      _1771: x0 => x0.profile,
      _1772: x0 => x0.username,
      _1773: x0 => x0.isNewUser,
      _1776: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _1781: x0 => x0.displayName,
      _1782: x0 => x0.enrollmentTime,
      _1783: x0 => x0.factorId,
      _1784: x0 => x0.uid,
      _1786: x0 => x0.hints,
      _1787: x0 => x0.session,
      _1789: x0 => x0.phoneNumber,
      _1805: (x0,x1) => x0.item(x1),
      _1808: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
      _1811: (x0,x1,x2) => globalThis.firebase_analytics.setUserId(x0,x1,x2),
      _1812: (x0,x1,x2) => globalThis.firebase_analytics.setUserProperties(x0,x1,x2),
      _1813: (x0,x1) => globalThis.firebase_analytics.initializeAnalytics(x0,x1),
      _1816: (x0,x1) => x0.initialize(x1),
      _1822: x0 => globalThis.firebase_messaging.getMessaging(x0),
      _1824: (x0,x1) => globalThis.firebase_messaging.getToken(x0,x1),
      _1826: (x0,x1) => globalThis.firebase_messaging.onMessage(x0,x1),
      _1827: (x0,x1) => ({next: x0,error: x1}),
      _1830: x0 => ({vapidKey: x0}),
      _1832: x0 => x0.title,
      _1833: x0 => x0.body,
      _1834: x0 => x0.image,
      _1835: x0 => x0.messageId,
      _1836: x0 => x0.collapseKey,
      _1837: x0 => x0.fcmOptions,
      _1838: x0 => x0.notification,
      _1839: x0 => x0.data,
      _1840: x0 => x0.from,
      _1841: x0 => x0.analyticsLabel,
      _1842: x0 => x0.link,
      _1843: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1843(f,arguments.length,x0) }),
      _1844: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1844(f,arguments.length,x0) }),
      _1848: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _1849: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _1850: x0 => globalThis.firebase_core.getApp(x0),
      _1851: () => globalThis.firebase_core.getApp(),
      _1852: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      _1853: (x0,x1) => x0.debug(x1),
      _1854: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1854(f,arguments.length,x0) }),
      _1855: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1855(f,arguments.length,x0,x1) }),
      _1856: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _1857: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _1858: (x0,x1) => x0.createScriptURL(x1),
      _1859: (x0,x1,x2) => x0.createScript(x1,x2),
      _1860: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1860(f,arguments.length,x0) }),
      _1861: () => globalThis.firebase_core.SDK_VERSION,
      _1867: x0 => x0.apiKey,
      _1869: x0 => x0.authDomain,
      _1871: x0 => x0.databaseURL,
      _1873: x0 => x0.projectId,
      _1875: x0 => x0.storageBucket,
      _1877: x0 => x0.messagingSenderId,
      _1879: x0 => x0.measurementId,
      _1881: x0 => x0.appId,
      _1883: x0 => x0.name,
      _1884: x0 => x0.options,
      _1887: x0 => ({type: x0}),
      _1888: (x0,x1) => new Blob(x0,x1),
      _1889: () => new FileReader(),
      _1891: (x0,x1) => x0.readAsArrayBuffer(x1),
      _1892: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1892(f,arguments.length,x0) }),
      _1893: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _1894: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1894(f,arguments.length,x0) }),
      _1895: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1895(f,arguments.length,x0) }),
      _1896: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1896(f,arguments.length,x0) }),
      _1897: (x0,x1) => x0.removeChild(x1),
      _1911: x0 => ({scale: x0}),
      _1912: x0 => x0.deviceMemory,
      _1915: (x0,x1) => x0.replace(x1),
      _1916: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1916(f,arguments.length,x0) }),
      _1917: () => globalThis.Intl.DateTimeFormat(),
      _1918: x0 => x0.resolvedOptions(),
      _1919: () => globalThis.Intl.supportedValuesOf,
      _1921: x0 => x0.timeZone,
      _1922: (x0,x1) => x0.key(x1),
      _1931: Date.now,
      _1932: secondsSinceEpoch => {
        const date = new Date(secondsSinceEpoch * 1000);
        const match = /\((.*)\)/.exec(date.toString());
        if (match == null) {
            // This should never happen on any recent browser.
            return '';
        }
        return match[1];
      },
      _1933: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1934: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1935: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1936: () => typeof dartUseDateNowForTicks !== "undefined",
      _1937: () => 1000 * performance.now(),
      _1938: () => Date.now(),
      _1939: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1940: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1941: () => new WeakMap(),
      _1942: (map, o) => map.get(o),
      _1943: (map, o, v) => map.set(o, v),
      _1944: x0 => new WeakRef(x0),
      _1945: x0 => x0.deref(),
      _1952: () => globalThis.WeakRef,
      _1955: s => JSON.stringify(s),
      _1956: s => printToConsole(s),
      _1957: (o, p, r) => o.replaceAll(p, () => r),
      _1958: (o, p, r) => o.replace(p, () => r),
      _1959: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1960: s => s.toUpperCase(),
      _1961: s => s.trim(),
      _1962: s => s.trimLeft(),
      _1963: s => s.trimRight(),
      _1964: (string, times) => string.repeat(times),
      _1965: Function.prototype.call.bind(String.prototype.indexOf),
      _1966: (s, p, i) => s.lastIndexOf(p, i),
      _1967: (string, token) => string.split(token),
      _1968: Object.is,
      _1969: o => o instanceof Array,
      _1970: (a, i) => a.push(i),
      _1971: (a, i) => a.splice(i, 1)[0],
      _1973: (a, l) => a.length = l,
      _1974: a => a.pop(),
      _1975: (a, i) => a.splice(i, 1),
      _1976: (a, s) => a.join(s),
      _1977: (a, s, e) => a.slice(s, e),
      _1978: (a, s, e) => a.splice(s, e),
      _1979: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1980: a => a.length,
      _1981: (a, l) => a.length = l,
      _1982: (a, i) => a[i],
      _1983: (a, i, v) => a[i] = v,
      _1984: (a, t) => a.concat(t),
      _1985: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1986: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1988: o => o instanceof Uint8Array,
      _1989: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1990: o => o instanceof Int8Array,
      _1991: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1992: o => o instanceof Uint8ClampedArray,
      _1993: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1994: o => o instanceof Uint16Array,
      _1995: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1996: o => o instanceof Int16Array,
      _1997: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1998: o => o instanceof Uint32Array,
      _1999: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _2000: o => o instanceof Int32Array,
      _2001: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _2003: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _2004: o => o instanceof Float32Array,
      _2005: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _2006: o => o instanceof Float64Array,
      _2007: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _2008: (t, s) => t.set(s),
      _2009: l => new DataView(new ArrayBuffer(l)),
      _2010: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _2011: o => o.byteLength,
      _2012: o => o.buffer,
      _2013: o => o.byteOffset,
      _2014: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _2015: (b, o) => new DataView(b, o),
      _2016: (b, o, l) => new DataView(b, o, l),
      _2017: Function.prototype.call.bind(DataView.prototype.getUint8),
      _2018: Function.prototype.call.bind(DataView.prototype.setUint8),
      _2019: Function.prototype.call.bind(DataView.prototype.getInt8),
      _2020: Function.prototype.call.bind(DataView.prototype.setInt8),
      _2021: Function.prototype.call.bind(DataView.prototype.getUint16),
      _2022: Function.prototype.call.bind(DataView.prototype.setUint16),
      _2023: Function.prototype.call.bind(DataView.prototype.getInt16),
      _2024: Function.prototype.call.bind(DataView.prototype.setInt16),
      _2025: Function.prototype.call.bind(DataView.prototype.getUint32),
      _2026: Function.prototype.call.bind(DataView.prototype.setUint32),
      _2027: Function.prototype.call.bind(DataView.prototype.getInt32),
      _2028: Function.prototype.call.bind(DataView.prototype.setInt32),
      _2031: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _2032: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _2033: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _2034: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _2035: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _2036: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _2038: () => globalThis.performance,
      _2039: () => globalThis.JSON,
      _2040: x0 => x0.measure,
      _2041: x0 => x0.mark,
      _2042: x0 => x0.clearMeasures,
      _2043: x0 => x0.clearMarks,
      _2044: (x0,x1,x2,x3) => x0.measure(x1,x2,x3),
      _2045: (x0,x1,x2) => x0.mark(x1,x2),
      _2046: x0 => x0.clearMeasures(),
      _2047: x0 => x0.clearMarks(),
      _2048: (x0,x1) => x0.parse(x1),
      _2049: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _2050: (handle) => clearTimeout(handle),
      _2051: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _2052: (handle) => clearInterval(handle),
      _2053: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _2054: () => Date.now(),
      _2055: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2056: (x0,x1) => x0.exec(x1),
      _2057: (x0,x1) => x0.test(x1),
      _2058: x0 => x0.pop(),
      _2060: o => o === undefined,
      _2062: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2064: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2065: o => o instanceof RegExp,
      _2066: (l, r) => l === r,
      _2067: o => o,
      _2068: o => o,
      _2069: o => o,
      _2070: b => !!b,
      _2071: o => o.length,
      _2073: (o, i) => o[i],
      _2074: f => f.dartFunction,
      _2075: () => ({}),
      _2076: () => [],
      _2078: () => globalThis,
      _2079: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2080: (o, p) => p in o,
      _2081: (o, p) => o[p],
      _2082: (o, p, v) => o[p] = v,
      _2083: (o, m, a) => o[m].apply(o, a),
      _2085: o => String(o),
      _2086: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _2087: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2087(f,arguments.length,x0) }),
      _2088: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._2088(f,arguments.length,x0,x1) }),
      _2089: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      _2090: o => [o],
      _2091: (o0, o1) => [o0, o1],
      _2092: (o0, o1, o2) => [o0, o1, o2],
      _2093: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _2094: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2095: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2096: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2097: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2098: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2099: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2100: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2101: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2102: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2103: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2104: x0 => new ArrayBuffer(x0),
      _2105: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2107: x0 => x0.index,
      _2108: x0 => x0.groups,
      _2109: x0 => x0.flags,
      _2110: x0 => x0.multiline,
      _2111: x0 => x0.ignoreCase,
      _2112: x0 => x0.unicode,
      _2113: x0 => x0.dotAll,
      _2114: (x0,x1) => { x0.lastIndex = x1 },
      _2115: (o, p) => p in o,
      _2116: (o, p) => o[p],
      _2117: (o, p, v) => o[p] = v,
      _2118: (o, p) => delete o[p],
      _2119: (x0,x1) => globalThis.Object.is(x0,x1),
      _2120: (x0,x1) => x0.push(x1),
      _2121: (x0,x1) => x0.at(x1),
      _2122: x0 => x0.entries(),
      _2123: x0 => x0.values(),
      _2124: x0 => globalThis.BigInt(x0),
      _2125: () => new Map(),
      _2126: (x0,x1,x2) => x0.set(x1,x2),
      _2127: () => new Set(),
      _2128: (x0,x1) => x0.add(x1),
      _2129: x0 => x0.toString(),
      _2130: x0 => x0.getTime(),
      _2131: x0 => x0.length,
      _2133: x0 => x0.buffer,
      _2135: x0 => x0.close(),
      _2136: () => new MessageChannel(),
      _2143: (x0,x1,x2) => x0.postMessage(x1,x2),
      _2145: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2145(f,arguments.length,x0) }),
      _2146: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2146(f,arguments.length,x0) }),
      _2147: x0 => new Worker(x0),
      _2148: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2148(f,arguments.length,x0) }),
      _2149: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2149(f,arguments.length,x0) }),
      _2150: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2150(f,arguments.length,x0) }),
      _2151: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2151(f,arguments.length,x0) }),
      _2152: (x0,x1,x2) => x0.postMessage(x1,x2),
      _2153: x0 => x0.terminate(),
      _2154: () => new XMLHttpRequest(),
      _2155: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _2157: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _2158: (x0,x1) => x0.send(x1),
      _2159: x0 => x0.send(),
      _2161: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2161(f,arguments.length,x0) }),
      _2162: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2162(f,arguments.length,x0) }),
      _2181: (x0,x1) => globalThis.fetch(x0,x1),
      _2182: x0 => x0.trustedTypes,
      _2183: (x0,x1) => { x0.src = x1 },
      _2184: (x0,x1) => x0.createScriptURL(x1),
      _2185: x0 => x0.nonce,
      _2186: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2186(f,arguments.length,x0) }),
      _2187: x0 => ({createScriptURL: x0}),
      _2188: (x0,x1) => x0.querySelectorAll(x1),
      _2189: () => new AbortController(),
      _2190: x0 => x0.abort(),
      _2191: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _2192: (x0,x1) => globalThis.fetch(x0,x1),
      _2193: (x0,x1) => x0.get(x1),
      _2194: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._2194(f,arguments.length,x0,x1,x2) }),
      _2195: (x0,x1) => x0.forEach(x1),
      _2196: x0 => x0.getReader(),
      _2197: x0 => x0.read(),
      _2198: x0 => x0.cancel(),
      _2199: x0 => x0.height,
      _2200: x0 => x0.width,
      _2205: () => globalThis.window.flutter_inappwebview,
      _2209: (x0,x1) => { x0.nativeCommunication = x1 },
      _2226: x0 => x0.trustedTypes,
      _2227: (x0,x1) => { x0.text = x1 },
      _2228: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _2229: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _2230: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2230(f,arguments.length,x0) }),
      _2231: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2231(f,arguments.length,x0) }),
      _2232: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2232(f,arguments.length,x0) }),
      _2233: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2233(f,arguments.length,x0) }),
      _2234: x0 => ({scope: x0}),
      _2235: (x0,x1) => x0.register(x1),
      _2236: (x0,x1,x2) => x0.register(x1,x2),
      _2237: (x0,x1) => x0.postMessage(x1),
      _2238: (x0,x1) => x0.getRegistration(x1),
      _2240: x0 => x0.random(),
      _2241: (x0,x1) => x0.getRandomValues(x1),
      _2242: () => globalThis.crypto,
      _2243: () => globalThis.Math,
      _2253: Function.prototype.call.bind(Number.prototype.toString),
      _2254: Function.prototype.call.bind(BigInt.prototype.toString),
      _2255: Function.prototype.call.bind(Number.prototype.toString),
      _2256: (d, digits) => d.toFixed(digits),
      _2260: () => globalThis.document,
      _2266: (x0,x1) => { x0.height = x1 },
      _2268: (x0,x1) => { x0.width = x1 },
      _2277: x0 => x0.style,
      _2280: x0 => x0.src,
      _2281: (x0,x1) => { x0.src = x1 },
      _2282: x0 => x0.naturalWidth,
      _2283: x0 => x0.naturalHeight,
      _2299: x0 => x0.status,
      _2300: (x0,x1) => { x0.responseType = x1 },
      _2302: x0 => x0.response,
      _2303: () => globalThis.google.accounts.oauth2,
      _2304: (x0,x1,x2) => x0.hasGrantedAllScopes(x1,x2),
      _2323: x0 => x0.access_token,
      _2324: x0 => x0.expires_in,
      _2330: x0 => x0.error,
      _2331: x0 => x0.error_description,
      _2333: x0 => x0.type,
      _2334: x0 => x0.message,
      _2338: () => globalThis.google.accounts.id,
      _2343: (x0,x1) => x0.renderButton(x1),
      _2344: (x0,x1,x2) => x0.renderButton(x1,x2),
      _2352: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2352(f,arguments.length,x0) }),
      _2355: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15,x16) => ({client_id: x0,auto_select: x1,callback: x2,login_uri: x3,native_callback: x4,cancel_on_tap_outside: x5,prompt_parent_id: x6,nonce: x7,context: x8,state_cookie_domain: x9,ux_mode: x10,allowed_parent_origin: x11,intermediate_iframe_close_callback: x12,itp_support: x13,login_hint: x14,hd: x15,use_fedcm_for_prompt: x16}),
      _2366: x0 => x0.error,
      _2368: x0 => x0.credential,
      _2371: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => ({type: x0,theme: x1,size: x2,text: x3,shape: x4,logo_alignment: x5,width: x6,locale: x7,click_listener: x8}),
      _2379: x0 => { globalThis.onGoogleLibraryLoad = x0 },
      _2380: f => finalizeWrapper(f, function() { return dartInstance.exports._2380(f,arguments.length) }),
      _2425: x0 => x0.status,
      _2430: x0 => x0.responseText,
      _2489: (x0,x1) => { x0.draggable = x1 },
      _2505: x0 => x0.style,
      _2704: (x0,x1) => { x0.nonce = x1 },
      _2720: (x0,x1) => { x0.href = x1 },
      _2724: (x0,x1) => { x0.rel = x1 },
      _2726: (x0,x1) => { x0.as = x1 },
      _2862: (x0,x1) => { x0.target = x1 },
      _2864: (x0,x1) => { x0.download = x1 },
      _2868: (x0,x1) => { x0.rel = x1 },
      _2889: (x0,x1) => { x0.href = x1 },
      _2981: x0 => x0.src,
      _2982: (x0,x1) => { x0.src = x1 },
      _2985: x0 => x0.name,
      _2986: (x0,x1) => { x0.name = x1 },
      _2987: x0 => x0.sandbox,
      _2988: x0 => x0.allow,
      _2989: (x0,x1) => { x0.allow = x1 },
      _2990: x0 => x0.allowFullscreen,
      _2991: (x0,x1) => { x0.allowFullscreen = x1 },
      _2996: x0 => x0.referrerPolicy,
      _2997: (x0,x1) => { x0.referrerPolicy = x1 },
      _3107: x0 => x0.error,
      _3108: x0 => x0.src,
      _3109: (x0,x1) => { x0.src = x1 },
      _3114: (x0,x1) => { x0.crossOrigin = x1 },
      _3117: (x0,x1) => { x0.preload = x1 },
      _3118: x0 => x0.buffered,
      _3121: x0 => x0.currentTime,
      _3122: (x0,x1) => { x0.currentTime = x1 },
      _3123: x0 => x0.duration,
      _3128: (x0,x1) => { x0.playbackRate = x1 },
      _3137: (x0,x1) => { x0.loop = x1 },
      _3139: (x0,x1) => { x0.controls = x1 },
      _3141: (x0,x1) => { x0.volume = x1 },
      _3143: (x0,x1) => { x0.muted = x1 },
      _3158: x0 => x0.code,
      _3159: x0 => x0.message,
      _3233: x0 => x0.length,
      _3429: (x0,x1) => { x0.accept = x1 },
      _3443: x0 => x0.files,
      _3469: (x0,x1) => { x0.multiple = x1 },
      _3487: (x0,x1) => { x0.type = x1 },
      _3737: (x0,x1) => { x0.src = x1 },
      _3739: (x0,x1) => { x0.type = x1 },
      _3743: (x0,x1) => { x0.async = x1 },
      _3745: (x0,x1) => { x0.defer = x1 },
      _3747: (x0,x1) => { x0.crossOrigin = x1 },
      _3749: (x0,x1) => { x0.text = x1 },
      _4205: () => globalThis.window,
      _4245: x0 => x0.document,
      _4248: x0 => x0.location,
      _4249: x0 => x0.history,
      _4267: x0 => x0.navigator,
      _4521: x0 => x0.origin,
      _4529: x0 => x0.trustedTypes,
      _4530: x0 => x0.sessionStorage,
      _4531: x0 => x0.localStorage,
      _4537: x0 => x0.href,
      _4538: (x0,x1) => { x0.href = x1 },
      _4539: x0 => x0.origin,
      _4542: x0 => x0.host,
      _4544: x0 => x0.hostname,
      _4548: x0 => x0.pathname,
      _4550: x0 => x0.search,
      _4584: (x0,x1) => { x0.returnValue = x1 },
      _4586: x0 => x0.message,
      _4587: x0 => x0.filename,
      _4588: x0 => x0.lineno,
      _4589: x0 => x0.colno,
      _4636: x0 => x0.maxTouchPoints,
      _4639: x0 => x0.serviceWorker,
      _4643: x0 => x0.appCodeName,
      _4644: x0 => x0.appName,
      _4645: x0 => x0.appVersion,
      _4646: x0 => x0.platform,
      _4647: x0 => x0.product,
      _4648: x0 => x0.productSub,
      _4649: x0 => x0.userAgent,
      _4650: x0 => x0.vendor,
      _4651: x0 => x0.vendorSub,
      _4653: x0 => x0.language,
      _4654: x0 => x0.languages,
      _4655: x0 => x0.onLine,
      _4660: x0 => x0.hardwareConcurrency,
      _4700: x0 => x0.data,
      _4730: x0 => x0.port1,
      _4731: x0 => x0.port2,
      _4734: (x0,x1) => { x0.onmessage = x1 },
      _4736: (x0,x1) => { x0.onmessageerror = x1 },
      _4802: (x0,x1) => { x0.onmessage = x1 },
      _4804: (x0,x1) => { x0.onmessageerror = x1 },
      _4806: (x0,x1) => { x0.onerror = x1 },
      _4849: x0 => x0.length,
      _6792: x0 => x0.signal,
      _6801: x0 => x0.length,
      _6822: x0 => x0.addedNodes,
      _6843: x0 => x0.baseURI,
      _6849: x0 => x0.firstChild,
      _6860: () => globalThis.document,
      _6919: x0 => x0.documentElement,
      _6940: x0 => x0.body,
      _6942: x0 => x0.head,
      _7270: x0 => x0.id,
      _7271: (x0,x1) => { x0.id = x1 },
      _7294: x0 => x0.innerHTML,
      _7295: (x0,x1) => { x0.innerHTML = x1 },
      _7298: x0 => x0.children,
      _7305: x0 => x0.role,
      _7306: (x0,x1) => { x0.role = x1 },
      _7335: x0 => x0.ariaHidden,
      _7336: (x0,x1) => { x0.ariaHidden = x1 },
      _7501: x0 => x0.length,
      _8616: x0 => x0.value,
      _8618: x0 => x0.done,
      _8798: x0 => x0.size,
      _8799: x0 => x0.type,
      _8805: x0 => x0.name,
      _8811: x0 => x0.length,
      _8816: x0 => x0.result,
      _8892: x0 => x0.active,
      _8902: x0 => x0.controller,
      _9311: x0 => x0.url,
      _9313: x0 => x0.status,
      _9314: x0 => x0.ok,
      _9315: x0 => x0.statusText,
      _9316: x0 => x0.headers,
      _9317: x0 => x0.body,
      _9676: x0 => x0.contentRect,
      _11398: (x0,x1) => { x0.backgroundImage = x1 },
      _11402: (x0,x1) => { x0.backgroundPosition = x1 },
      _11412: (x0,x1) => { x0.backgroundRepeat = x1 },
      _11414: (x0,x1) => { x0.backgroundSize = x1 },
      _11442: (x0,x1) => { x0.border = x1 },
      _11720: (x0,x1) => { x0.display = x1 },
      _11884: (x0,x1) => { x0.height = x1 },
      _11940: (x0,x1) => { x0.left = x1 },
      _12096: (x0,x1) => { x0.opacity = x1 },
      _12208: (x0,x1) => { x0.pointerEvents = x1 },
      _12210: (x0,x1) => { x0.position = x1 },
      _12502: (x0,x1) => { x0.top = x1 },
      _12513: x0 => x0.transition,
      _12574: (x0,x1) => { x0.width = x1 },
      _12602: (x0,x1) => { x0.zIndex = x1 },
      _12942: x0 => x0.name,
      _12943: x0 => x0.message,
      _13265: x0 => x0.width,
      _13266: x0 => x0.height,
      _13650: () => globalThis.console,
      _13677: x0 => x0.name,
      _13678: x0 => x0.message,
      _13679: x0 => x0.code,
      _13681: x0 => x0.customData,
      _13682: () => globalThis.__KTW_ELECTRON_SHELL__,
      _13683: x0 => x0.isElectronDesktop,
      _13684: x0 => x0.chromeHeight,
      _13685: () => globalThis.navigator,
      _13686: x0 => x0.deviceMemory,
      _13687: x0 => x0.hardwareConcurrency,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      S: new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
