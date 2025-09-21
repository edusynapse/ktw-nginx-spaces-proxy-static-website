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
      _6: (o,s,v) => o[s] = v,
      _7: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._7(f,arguments.length,x0) }),
      _8: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._8(f,arguments.length,x0,x1) }),
      _9: (o, a) => o + a,
      _27: (o) => !!o,
      _36: () => new Array(),
      _37: x0 => new Array(x0),
      _39: x0 => x0.length,
      _41: (x0,x1) => x0[x1],
      _42: (x0,x1,x2) => { x0[x1] = x2 },
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
      _87: x0 => x0.click(),
      _88: x0 => x0.buffer,
      _89: x0 => x0.wasmMemory,
      _90: () => globalThis.window._flutter_skwasmInstance,
      _91: x0 => x0.rasterStartMilliseconds,
      _92: x0 => x0.rasterEndMilliseconds,
      _93: x0 => x0.imageBitmaps,
      _120: x0 => x0.remove(),
      _121: (x0,x1) => x0.append(x1),
      _122: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _123: (x0,x1) => x0.querySelector(x1),
      _125: (x0,x1) => x0.removeChild(x1),
      _203: x0 => x0.stopPropagation(),
      _204: x0 => x0.preventDefault(),
      _206: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _251: x0 => x0.unlock(),
      _252: x0 => x0.getReader(),
      _253: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _254: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _255: (x0,x1) => x0.item(x1),
      _256: x0 => x0.next(),
      _257: x0 => x0.now(),
      _258: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._258(f,arguments.length,x0) }),
      _259: (x0,x1) => x0.addListener(x1),
      _260: (x0,x1) => x0.removeListener(x1),
      _261: (x0,x1) => x0.matchMedia(x1),
      _262: (x0,x1) => x0.revokeObjectURL(x1),
      _263: x0 => x0.close(),
      _264: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _265: x0 => new window.ImageDecoder(x0),
      _266: x0 => ({frameIndex: x0}),
      _267: (x0,x1) => x0.decode(x1),
      _268: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._268(f,arguments.length,x0) }),
      _269: (x0,x1) => x0.getModifierState(x1),
      _270: (x0,x1) => x0.removeProperty(x1),
      _271: (x0,x1) => x0.prepend(x1),
      _272: x0 => x0.disconnect(),
      _273: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._273(f,arguments.length,x0) }),
      _274: (x0,x1) => x0.getAttribute(x1),
      _275: (x0,x1) => x0.contains(x1),
      _276: x0 => x0.blur(),
      _277: x0 => x0.hasFocus(),
      _278: (x0,x1) => x0.hasAttribute(x1),
      _279: (x0,x1) => x0.getModifierState(x1),
      _280: (x0,x1) => x0.appendChild(x1),
      _281: (x0,x1) => x0.createTextNode(x1),
      _282: (x0,x1) => x0.removeAttribute(x1),
      _283: x0 => x0.getBoundingClientRect(),
      _284: (x0,x1) => x0.observe(x1),
      _285: x0 => x0.disconnect(),
      _286: (x0,x1) => x0.closest(x1),
      _696: () => globalThis.window.flutterConfiguration,
      _697: x0 => x0.assetBase,
      _703: x0 => x0.debugShowSemanticsNodes,
      _704: x0 => x0.hostElement,
      _705: x0 => x0.multiViewEnabled,
      _706: x0 => x0.nonce,
      _708: x0 => x0.fontFallbackBaseUrl,
      _712: x0 => x0.console,
      _713: x0 => x0.devicePixelRatio,
      _714: x0 => x0.document,
      _715: x0 => x0.history,
      _716: x0 => x0.innerHeight,
      _717: x0 => x0.innerWidth,
      _718: x0 => x0.location,
      _719: x0 => x0.navigator,
      _720: x0 => x0.visualViewport,
      _721: x0 => x0.performance,
      _723: x0 => x0.URL,
      _725: (x0,x1) => x0.getComputedStyle(x1),
      _726: x0 => x0.screen,
      _727: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._727(f,arguments.length,x0) }),
      _728: (x0,x1) => x0.requestAnimationFrame(x1),
      _733: (x0,x1) => x0.warn(x1),
      _735: (x0,x1) => x0.debug(x1),
      _736: x0 => globalThis.parseFloat(x0),
      _737: () => globalThis.window,
      _738: () => globalThis.Intl,
      _739: () => globalThis.Symbol,
      _740: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _742: x0 => x0.clipboard,
      _743: x0 => x0.maxTouchPoints,
      _744: x0 => x0.vendor,
      _745: x0 => x0.language,
      _746: x0 => x0.platform,
      _747: x0 => x0.userAgent,
      _748: (x0,x1) => x0.vibrate(x1),
      _749: x0 => x0.languages,
      _750: x0 => x0.documentElement,
      _751: (x0,x1) => x0.querySelector(x1),
      _754: (x0,x1) => x0.createElement(x1),
      _757: (x0,x1) => x0.createEvent(x1),
      _758: x0 => x0.activeElement,
      _761: x0 => x0.head,
      _762: x0 => x0.body,
      _764: (x0,x1) => { x0.title = x1 },
      _767: x0 => x0.visibilityState,
      _768: () => globalThis.document,
      _769: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._769(f,arguments.length,x0) }),
      _770: (x0,x1) => x0.dispatchEvent(x1),
      _778: x0 => x0.target,
      _780: x0 => x0.timeStamp,
      _781: x0 => x0.type,
      _783: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _790: x0 => x0.firstChild,
      _794: x0 => x0.parentElement,
      _796: (x0,x1) => { x0.textContent = x1 },
      _797: x0 => x0.parentNode,
      _799: x0 => x0.isConnected,
      _803: x0 => x0.firstElementChild,
      _805: x0 => x0.nextElementSibling,
      _806: x0 => x0.clientHeight,
      _807: x0 => x0.clientWidth,
      _808: x0 => x0.offsetHeight,
      _809: x0 => x0.offsetWidth,
      _810: x0 => x0.id,
      _811: (x0,x1) => { x0.id = x1 },
      _814: (x0,x1) => { x0.spellcheck = x1 },
      _815: x0 => x0.tagName,
      _816: x0 => x0.style,
      _818: (x0,x1) => x0.querySelectorAll(x1),
      _819: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _820: x0 => x0.tabIndex,
      _821: (x0,x1) => { x0.tabIndex = x1 },
      _822: (x0,x1) => x0.focus(x1),
      _823: x0 => x0.scrollTop,
      _824: (x0,x1) => { x0.scrollTop = x1 },
      _825: x0 => x0.scrollLeft,
      _826: (x0,x1) => { x0.scrollLeft = x1 },
      _827: x0 => x0.classList,
      _829: (x0,x1) => { x0.className = x1 },
      _831: (x0,x1) => x0.getElementsByClassName(x1),
      _832: (x0,x1) => x0.attachShadow(x1),
      _835: x0 => x0.computedStyleMap(),
      _836: (x0,x1) => x0.get(x1),
      _842: (x0,x1) => x0.getPropertyValue(x1),
      _843: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _844: x0 => x0.offsetLeft,
      _845: x0 => x0.offsetTop,
      _846: x0 => x0.offsetParent,
      _848: (x0,x1) => { x0.name = x1 },
      _849: x0 => x0.content,
      _850: (x0,x1) => { x0.content = x1 },
      _854: (x0,x1) => { x0.src = x1 },
      _855: x0 => x0.naturalWidth,
      _856: x0 => x0.naturalHeight,
      _860: (x0,x1) => { x0.crossOrigin = x1 },
      _862: (x0,x1) => { x0.decoding = x1 },
      _863: x0 => x0.decode(),
      _868: (x0,x1) => { x0.nonce = x1 },
      _873: (x0,x1) => { x0.width = x1 },
      _875: (x0,x1) => { x0.height = x1 },
      _878: (x0,x1) => x0.getContext(x1),
      _937: x0 => x0.width,
      _938: x0 => x0.height,
      _940: (x0,x1) => x0.fetch(x1),
      _941: x0 => x0.status,
      _943: x0 => x0.body,
      _944: x0 => x0.arrayBuffer(),
      _947: x0 => x0.read(),
      _948: x0 => x0.value,
      _949: x0 => x0.done,
      _951: x0 => x0.name,
      _952: x0 => x0.x,
      _953: x0 => x0.y,
      _956: x0 => x0.top,
      _957: x0 => x0.right,
      _958: x0 => x0.bottom,
      _959: x0 => x0.left,
      _971: x0 => x0.height,
      _972: x0 => x0.width,
      _973: x0 => x0.scale,
      _974: (x0,x1) => { x0.value = x1 },
      _977: (x0,x1) => { x0.placeholder = x1 },
      _979: (x0,x1) => { x0.name = x1 },
      _980: x0 => x0.selectionDirection,
      _981: x0 => x0.selectionStart,
      _982: x0 => x0.selectionEnd,
      _985: x0 => x0.value,
      _987: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _988: x0 => x0.readText(),
      _989: (x0,x1) => x0.writeText(x1),
      _991: x0 => x0.altKey,
      _992: x0 => x0.code,
      _993: x0 => x0.ctrlKey,
      _994: x0 => x0.key,
      _995: x0 => x0.keyCode,
      _996: x0 => x0.location,
      _997: x0 => x0.metaKey,
      _998: x0 => x0.repeat,
      _999: x0 => x0.shiftKey,
      _1000: x0 => x0.isComposing,
      _1002: x0 => x0.state,
      _1003: (x0,x1) => x0.go(x1),
      _1005: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1006: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1007: x0 => x0.pathname,
      _1008: x0 => x0.search,
      _1009: x0 => x0.hash,
      _1013: x0 => x0.state,
      _1016: (x0,x1) => x0.createObjectURL(x1),
      _1018: x0 => new Blob(x0),
      _1020: x0 => new MutationObserver(x0),
      _1021: (x0,x1,x2) => x0.observe(x1,x2),
      _1022: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1022(f,arguments.length,x0,x1) }),
      _1025: x0 => x0.attributeName,
      _1026: x0 => x0.type,
      _1027: x0 => x0.matches,
      _1028: x0 => x0.matches,
      _1032: x0 => x0.relatedTarget,
      _1034: x0 => x0.clientX,
      _1035: x0 => x0.clientY,
      _1036: x0 => x0.offsetX,
      _1037: x0 => x0.offsetY,
      _1040: x0 => x0.button,
      _1041: x0 => x0.buttons,
      _1042: x0 => x0.ctrlKey,
      _1046: x0 => x0.pointerId,
      _1047: x0 => x0.pointerType,
      _1048: x0 => x0.pressure,
      _1049: x0 => x0.tiltX,
      _1050: x0 => x0.tiltY,
      _1051: x0 => x0.getCoalescedEvents(),
      _1054: x0 => x0.deltaX,
      _1055: x0 => x0.deltaY,
      _1056: x0 => x0.wheelDeltaX,
      _1057: x0 => x0.wheelDeltaY,
      _1058: x0 => x0.deltaMode,
      _1065: x0 => x0.changedTouches,
      _1068: x0 => x0.clientX,
      _1069: x0 => x0.clientY,
      _1072: x0 => x0.data,
      _1075: (x0,x1) => { x0.disabled = x1 },
      _1077: (x0,x1) => { x0.type = x1 },
      _1078: (x0,x1) => { x0.max = x1 },
      _1079: (x0,x1) => { x0.min = x1 },
      _1080: x0 => x0.value,
      _1081: (x0,x1) => { x0.value = x1 },
      _1082: x0 => x0.disabled,
      _1083: (x0,x1) => { x0.disabled = x1 },
      _1085: (x0,x1) => { x0.placeholder = x1 },
      _1087: (x0,x1) => { x0.name = x1 },
      _1089: (x0,x1) => { x0.autocomplete = x1 },
      _1090: x0 => x0.selectionDirection,
      _1092: x0 => x0.selectionStart,
      _1093: x0 => x0.selectionEnd,
      _1096: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1097: (x0,x1) => x0.add(x1),
      _1100: (x0,x1) => { x0.noValidate = x1 },
      _1101: (x0,x1) => { x0.method = x1 },
      _1102: (x0,x1) => { x0.action = x1 },
      _1103: (x0,x1) => new OffscreenCanvas(x0,x1),
      _1109: (x0,x1) => x0.getContext(x1),
      _1111: x0 => x0.convertToBlob(),
      _1128: x0 => x0.orientation,
      _1129: x0 => x0.width,
      _1130: x0 => x0.height,
      _1131: (x0,x1) => x0.lock(x1),
      _1150: x0 => new ResizeObserver(x0),
      _1153: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1153(f,arguments.length,x0,x1) }),
      _1161: x0 => x0.length,
      _1162: x0 => x0.iterator,
      _1163: x0 => x0.Segmenter,
      _1164: x0 => x0.v8BreakIterator,
      _1165: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1166: x0 => x0.done,
      _1167: x0 => x0.value,
      _1168: x0 => x0.index,
      _1172: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1173: (x0,x1) => x0.adoptText(x1),
      _1174: x0 => x0.first(),
      _1175: x0 => x0.next(),
      _1176: x0 => x0.current(),
      _1182: x0 => x0.hostElement,
      _1183: x0 => x0.viewConstraints,
      _1186: x0 => x0.maxHeight,
      _1187: x0 => x0.maxWidth,
      _1188: x0 => x0.minHeight,
      _1189: x0 => x0.minWidth,
      _1190: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1190(f,arguments.length,x0) }),
      _1191: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1191(f,arguments.length,x0) }),
      _1192: (x0,x1) => ({addView: x0,removeView: x1}),
      _1193: x0 => x0.loader,
      _1194: () => globalThis._flutter,
      _1195: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1196: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1196(f,arguments.length,x0) }),
      _1197: f => finalizeWrapper(f, function() { return dartInstance.exports._1197(f,arguments.length) }),
      _1198: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1199: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1199(f,arguments.length,x0) }),
      _1200: x0 => ({runApp: x0}),
      _1201: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1201(f,arguments.length,x0,x1) }),
      _1202: x0 => x0.length,
      _1203: () => globalThis.window.ImageDecoder,
      _1204: x0 => x0.tracks,
      _1206: x0 => x0.completed,
      _1208: x0 => x0.image,
      _1214: x0 => x0.displayWidth,
      _1215: x0 => x0.displayHeight,
      _1216: x0 => x0.duration,
      _1219: x0 => x0.ready,
      _1220: x0 => x0.selectedTrack,
      _1221: x0 => x0.repetitionCount,
      _1222: x0 => x0.frameCount,
      _1270: (x0,x1) => x0.createElement(x1),
      _1276: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1277: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._1277(f,arguments.length,x0,x1,x2) }),
      _1278: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1278(f,arguments.length,x0) }),
      _1279: f => finalizeWrapper(f, function() { return dartInstance.exports._1279(f,arguments.length) }),
      _1280: x0 => x0.pause(),
      _1281: x0 => globalThis.URL.revokeObjectURL(x0),
      _1282: x0 => x0.load(),
      _1283: x0 => x0.play(),
      _1284: (x0,x1,x2) => x0.setItem(x1,x2),
      _1285: (x0,x1) => x0.getItem(x1),
      _1286: (x0,x1) => x0.removeItem(x1),
      _1288: (x0,x1) => x0.createElement(x1),
      _1289: (x0,x1) => x0.appendChild(x1),
      _1290: x0 => x0.click(),
      _1291: x0 => x0.remove(),
      _1292: (x0,x1) => x0.append(x1),
      _1293: (x0,x1,x2,x3) => x0.createFlutterInAppWebView(x1,x2,x3),
      _1294: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1295: (x0,x1) => x0.removeAttribute(x1),
      _1296: (x0,x1) => x0.prepare(x1),
      _1297: (x0,x1) => x0.getResponseHeader(x1),
      _1298: x0 => x0.reload(),
      _1299: x0 => x0.goBack(),
      _1300: x0 => x0.goForward(),
      _1301: (x0,x1) => x0.goBackOrForward(x1),
      _1302: (x0,x1) => x0.evaluateJavascript(x1),
      _1303: x0 => x0.stopLoading(),
      _1304: x0 => x0.getUrl(),
      _1305: x0 => x0.getTitle(),
      _1306: (x0,x1,x2) => x0.injectJavascriptFileFromUrl(x1,x2),
      _1307: (x0,x1) => x0.injectCSSCode(x1),
      _1308: (x0,x1,x2) => x0.injectCSSFileFromUrl(x1,x2),
      _1309: (x0,x1,x2,x3) => x0.scrollTo(x1,x2,x3),
      _1310: (x0,x1,x2,x3) => x0.scrollBy(x1,x2,x3),
      _1311: x0 => x0.printCurrentPage(),
      _1312: x0 => x0.getContentHeight(),
      _1313: x0 => x0.getContentWidth(),
      _1314: x0 => x0.getSelectedText(),
      _1315: x0 => x0.getScrollX(),
      _1316: x0 => x0.getScrollY(),
      _1317: x0 => x0.isSecureContext(),
      _1318: x0 => x0.canScrollVertically(),
      _1319: x0 => x0.canScrollHorizontally(),
      _1320: (x0,x1) => x0.item(x1),
      _1321: x0 => x0.getSize(),
      _1322: (x0,x1) => x0.setSettings(x1),
      _1323: (x0,x1) => { x0.csp = x1 },
      _1324: x0 => x0.csp,
      _1325: (x0,x1) => x0.getCookieExpirationDate(x1),
      _1435: x0 => x0.preventDefault(),
      _1436: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1436(f,arguments.length,x0) }),
      _1437: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1438: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1439: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1440: (x0,x1) => x0.getAttribute(x1),
      _1444: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1445: (x0,x1) => x0.canShare(x1),
      _1446: (x0,x1) => x0.share(x1),
      _1449: (x0,x1) => ({files: x0,text: x1}),
      _1451: x0 => ({files: x0}),
      _1453: x0 => ({text: x0}),
      _1456: () => globalThis.Notification.requestPermission(),
      _1458: x0 => globalThis.URL.createObjectURL(x0),
      _1464: (x0,x1) => x0.querySelector(x1),
      _1466: x0 => x0.disconnect(),
      _1467: x0 => x0.disconnect(),
      _1468: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1468(f,arguments.length,x0,x1) }),
      _1469: x0 => new ResizeObserver(x0),
      _1470: (x0,x1) => x0.observe(x1),
      _1471: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1471(f,arguments.length,x0,x1) }),
      _1472: x0 => new MutationObserver(x0),
      _1473: x0 => ({childList: x0}),
      _1474: (x0,x1,x2) => x0.observe(x1,x2),
      _1475: (x0,x1) => x0.item(x1),
      _1476: (x0,x1) => x0.getElementById(x1),
      _1477: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1477(f,arguments.length,x0) }),
      _1478: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1478(f,arguments.length,x0) }),
      _1479: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1479(f,arguments.length,x0) }),
      _1480: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1480(f,arguments.length,x0) }),
      _1481: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1481(f,arguments.length,x0) }),
      _1482: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1482(f,arguments.length,x0) }),
      _1483: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1483(f,arguments.length,x0) }),
      _1484: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1484(f,arguments.length,x0) }),
      _1485: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1485(f,arguments.length,x0) }),
      _1486: (x0,x1) => x0.end(x1),
      _1487: (x0,x1) => x0.setSinkId(x1),
      _1488: x0 => x0.decode(),
      _1489: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1490: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1491: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1491(f,arguments.length,x0) }),
      _1492: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1492(f,arguments.length,x0) }),
      _1493: x0 => x0.send(),
      _1494: () => new XMLHttpRequest(),
      _1496: (x0,x1) => x0.getIdToken(x1),
      _1515: x0 => x0.toJSON(),
      _1516: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1516(f,arguments.length,x0) }),
      _1517: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1517(f,arguments.length,x0) }),
      _1518: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1519: x0 => x0.call(),
      _1520: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1520(f,arguments.length,x0) }),
      _1521: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1521(f,arguments.length,x0) }),
      _1522: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1522(f,arguments.length,x0) }),
      _1523: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1523(f,arguments.length,x0) }),
      _1524: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      _1535: (x0,x1) => globalThis.firebase_auth.signInWithCredential(x0,x1),
      _1544: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1562: (x0,x1) => globalThis.firebase_auth.GoogleAuthProvider.credential(x0,x1),
      _1563: x0 => new firebase_auth.OAuthProvider(x0),
      _1566: (x0,x1) => x0.credential(x1),
      _1567: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      _1582: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      _1583: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1584: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1585: (x0,x1,x2) => ({accessToken: x0,idToken: x1,rawNonce: x2}),
      _1590: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      _1605: () => globalThis.firebase_auth.debugErrorMap,
      _1608: () => globalThis.firebase_auth.browserSessionPersistence,
      _1610: () => globalThis.firebase_auth.browserLocalPersistence,
      _1612: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1615: x0 => globalThis.firebase_auth.multiFactor(x0),
      _1616: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      _1618: x0 => x0.currentUser,
      _1622: x0 => x0.tenantId,
      _1632: x0 => x0.displayName,
      _1633: x0 => x0.email,
      _1634: x0 => x0.phoneNumber,
      _1635: x0 => x0.photoURL,
      _1636: x0 => x0.providerId,
      _1637: x0 => x0.uid,
      _1638: x0 => x0.emailVerified,
      _1639: x0 => x0.isAnonymous,
      _1640: x0 => x0.providerData,
      _1641: x0 => x0.refreshToken,
      _1642: x0 => x0.tenantId,
      _1643: x0 => x0.metadata,
      _1645: x0 => x0.providerId,
      _1646: x0 => x0.signInMethod,
      _1647: x0 => x0.accessToken,
      _1648: x0 => x0.idToken,
      _1649: x0 => x0.secret,
      _1660: x0 => x0.creationTime,
      _1661: x0 => x0.lastSignInTime,
      _1666: x0 => x0.code,
      _1668: x0 => x0.message,
      _1680: x0 => x0.email,
      _1681: x0 => x0.phoneNumber,
      _1682: x0 => x0.tenantId,
      _1705: x0 => x0.user,
      _1708: x0 => x0.providerId,
      _1709: x0 => x0.profile,
      _1710: x0 => x0.username,
      _1711: x0 => x0.isNewUser,
      _1714: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _1719: x0 => x0.displayName,
      _1720: x0 => x0.enrollmentTime,
      _1721: x0 => x0.factorId,
      _1722: x0 => x0.uid,
      _1724: x0 => x0.hints,
      _1725: x0 => x0.session,
      _1727: x0 => x0.phoneNumber,
      _1744: (x0,x1) => x0.item(x1),
      _1747: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
      _1750: (x0,x1,x2) => globalThis.firebase_analytics.setUserId(x0,x1,x2),
      _1751: (x0,x1,x2) => globalThis.firebase_analytics.setUserProperties(x0,x1,x2),
      _1752: (x0,x1) => globalThis.firebase_analytics.initializeAnalytics(x0,x1),
      _1755: (x0,x1) => x0.initialize(x1),
      _1761: (x0,x1) => ({next: x0,error: x1}),
      _1762: x0 => ({vapidKey: x0}),
      _1763: x0 => globalThis.firebase_messaging.getMessaging(x0),
      _1765: (x0,x1) => globalThis.firebase_messaging.getToken(x0,x1),
      _1767: (x0,x1) => globalThis.firebase_messaging.onMessage(x0,x1),
      _1771: x0 => x0.title,
      _1772: x0 => x0.body,
      _1773: x0 => x0.image,
      _1774: x0 => x0.messageId,
      _1775: x0 => x0.collapseKey,
      _1776: x0 => x0.fcmOptions,
      _1777: x0 => x0.notification,
      _1778: x0 => x0.data,
      _1779: x0 => x0.from,
      _1780: x0 => x0.analyticsLabel,
      _1781: x0 => x0.link,
      _1782: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1782(f,arguments.length,x0) }),
      _1783: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1783(f,arguments.length,x0) }),
      _1787: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _1788: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _1789: x0 => globalThis.firebase_core.getApp(x0),
      _1790: () => globalThis.firebase_core.getApp(),
      _1791: (x0,x1) => x0.debug(x1),
      _1792: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1792(f,arguments.length,x0) }),
      _1793: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1793(f,arguments.length,x0,x1) }),
      _1794: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _1795: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _1796: (x0,x1) => x0.createScriptURL(x1),
      _1797: (x0,x1,x2) => x0.createScript(x1,x2),
      _1798: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1798(f,arguments.length,x0) }),
      _1799: () => globalThis.firebase_core.SDK_VERSION,
      _1805: x0 => x0.apiKey,
      _1807: x0 => x0.authDomain,
      _1809: x0 => x0.databaseURL,
      _1811: x0 => x0.projectId,
      _1813: x0 => x0.storageBucket,
      _1815: x0 => x0.messagingSenderId,
      _1817: x0 => x0.measurementId,
      _1819: x0 => x0.appId,
      _1821: x0 => x0.name,
      _1822: x0 => x0.options,
      _1836: x0 => ({scale: x0}),
      _1837: x0 => x0.deviceMemory,
      _1840: () => new FileReader(),
      _1842: (x0,x1) => x0.readAsArrayBuffer(x1),
      _1843: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1843(f,arguments.length,x0) }),
      _1844: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _1845: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1845(f,arguments.length,x0) }),
      _1846: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1846(f,arguments.length,x0) }),
      _1847: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1847(f,arguments.length,x0) }),
      _1848: (x0,x1) => x0.removeChild(x1),
      _1850: (x0,x1) => x0.replace(x1),
      _1851: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1851(f,arguments.length,x0) }),
      _1852: () => globalThis.Intl.DateTimeFormat(),
      _1853: x0 => x0.resolvedOptions(),
      _1854: () => globalThis.Intl.supportedValuesOf,
      _1856: x0 => x0.timeZone,
      _1857: (x0,x1) => x0.key(x1),
      _1866: Date.now,
      _1867: secondsSinceEpoch => {
        const date = new Date(secondsSinceEpoch * 1000);
        const match = /\((.*)\)/.exec(date.toString());
        if (match == null) {
            // This should never happen on any recent browser.
            return '';
        }
        return match[1];
      },
      _1868: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1869: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1870: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1871: () => typeof dartUseDateNowForTicks !== "undefined",
      _1872: () => 1000 * performance.now(),
      _1873: () => Date.now(),
      _1874: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1875: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1876: () => new WeakMap(),
      _1877: (map, o) => map.get(o),
      _1878: (map, o, v) => map.set(o, v),
      _1879: x0 => new WeakRef(x0),
      _1880: x0 => x0.deref(),
      _1887: () => globalThis.WeakRef,
      _1890: s => JSON.stringify(s),
      _1891: s => printToConsole(s),
      _1892: (o, p, r) => o.replaceAll(p, () => r),
      _1893: (o, p, r) => o.replace(p, () => r),
      _1894: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1895: s => s.toUpperCase(),
      _1896: s => s.trim(),
      _1897: s => s.trimLeft(),
      _1898: s => s.trimRight(),
      _1899: (string, times) => string.repeat(times),
      _1900: Function.prototype.call.bind(String.prototype.indexOf),
      _1901: (s, p, i) => s.lastIndexOf(p, i),
      _1902: (string, token) => string.split(token),
      _1903: Object.is,
      _1904: o => o instanceof Array,
      _1905: (a, i) => a.push(i),
      _1906: (a, i) => a.splice(i, 1)[0],
      _1908: (a, l) => a.length = l,
      _1909: a => a.pop(),
      _1910: (a, i) => a.splice(i, 1),
      _1911: (a, s) => a.join(s),
      _1912: (a, s, e) => a.slice(s, e),
      _1913: (a, s, e) => a.splice(s, e),
      _1914: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1915: a => a.length,
      _1916: (a, l) => a.length = l,
      _1917: (a, i) => a[i],
      _1918: (a, i, v) => a[i] = v,
      _1919: (a, t) => a.concat(t),
      _1920: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1921: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1923: o => o instanceof Uint8Array,
      _1924: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1925: o => o instanceof Int8Array,
      _1926: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1927: o => o instanceof Uint8ClampedArray,
      _1928: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1929: o => o instanceof Uint16Array,
      _1930: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1931: o => o instanceof Int16Array,
      _1932: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1933: o => o instanceof Uint32Array,
      _1934: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1935: o => o instanceof Int32Array,
      _1936: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1938: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1939: o => o instanceof Float32Array,
      _1940: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1941: o => o instanceof Float64Array,
      _1942: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1943: (t, s) => t.set(s),
      _1944: l => new DataView(new ArrayBuffer(l)),
      _1945: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1946: o => o.byteLength,
      _1947: o => o.buffer,
      _1948: o => o.byteOffset,
      _1949: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1950: (b, o) => new DataView(b, o),
      _1951: (b, o, l) => new DataView(b, o, l),
      _1952: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1953: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1954: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1955: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1956: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1957: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1958: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1959: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1960: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1961: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1962: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1963: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1966: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1967: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1968: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1969: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1970: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1971: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1973: () => globalThis.performance,
      _1974: () => globalThis.JSON,
      _1975: x0 => x0.measure,
      _1976: x0 => x0.mark,
      _1977: x0 => x0.clearMeasures,
      _1978: x0 => x0.clearMarks,
      _1979: (x0,x1,x2,x3) => x0.measure(x1,x2,x3),
      _1980: (x0,x1,x2) => x0.mark(x1,x2),
      _1981: x0 => x0.clearMeasures(),
      _1982: x0 => x0.clearMarks(),
      _1983: (x0,x1) => x0.parse(x1),
      _1984: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1985: (handle) => clearTimeout(handle),
      _1986: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1987: (handle) => clearInterval(handle),
      _1988: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1989: () => Date.now(),
      _1994: o => Object.keys(o),
      _1995: x0 => new Worker(x0),
      _1999: x0 => x0.terminate(),
      _2001: x0 => x0.close(),
      _2002: () => new MessageChannel(),
      _2003: x0 => ({type: x0}),
      _2004: (x0,x1) => new Blob(x0,x1),
      _2011: () => new XMLHttpRequest(),
      _2012: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _2013: x0 => x0.send(),
      _2017: (x0,x1,x2) => x0.postMessage(x1,x2),
      _2018: (x0,x1) => x0.push(x1),
      _2019: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2019(f,arguments.length,x0) }),
      _2020: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2020(f,arguments.length,x0) }),
      _2021: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2021(f,arguments.length,x0) }),
      _2022: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2022(f,arguments.length,x0) }),
      _2023: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2023(f,arguments.length,x0) }),
      _2024: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2024(f,arguments.length,x0) }),
      _2025: (x0,x1,x2) => x0.postMessage(x1,x2),
      _2027: (x0,x1) => globalThis.Object.is(x0,x1),
      _2028: (x0,x1) => x0.at(x1),
      _2029: x0 => x0.entries(),
      _2030: x0 => x0.values(),
      _2031: x0 => globalThis.BigInt(x0),
      _2032: () => new Map(),
      _2033: (x0,x1,x2) => x0.set(x1,x2),
      _2034: () => new Set(),
      _2035: (x0,x1) => x0.add(x1),
      _2036: x0 => x0.toString(),
      _2037: x0 => x0.length,
      _2039: x0 => x0.buffer,
      _2040: () => new AbortController(),
      _2041: x0 => x0.abort(),
      _2042: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _2043: (x0,x1) => globalThis.fetch(x0,x1),
      _2044: (x0,x1) => x0.get(x1),
      _2045: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._2045(f,arguments.length,x0,x1,x2) }),
      _2046: (x0,x1) => x0.forEach(x1),
      _2047: x0 => x0.getReader(),
      _2048: x0 => x0.read(),
      _2049: x0 => x0.cancel(),
      _2051: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _2052: (x0,x1) => x0.send(x1),
      _2054: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2054(f,arguments.length,x0) }),
      _2055: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2055(f,arguments.length,x0) }),
      _2069: (x0,x1) => globalThis.fetch(x0,x1),
      _2070: x0 => x0.trustedTypes,
      _2071: (x0,x1) => { x0.src = x1 },
      _2072: (x0,x1) => x0.createScriptURL(x1),
      _2073: x0 => x0.nonce,
      _2074: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2074(f,arguments.length,x0) }),
      _2075: x0 => ({createScriptURL: x0}),
      _2076: (x0,x1) => x0.querySelectorAll(x1),
      _2077: x0 => x0.height,
      _2078: x0 => x0.width,
      _2083: () => globalThis.window.flutter_inappwebview,
      _2087: (x0,x1) => { x0.nativeCommunication = x1 },
      _2104: x0 => x0.trustedTypes,
      _2105: (x0,x1) => { x0.text = x1 },
      _2106: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _2107: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _2108: x0 => x0.reload(),
      _2109: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2109(f,arguments.length,x0) }),
      _2110: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2110(f,arguments.length,x0) }),
      _2111: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2111(f,arguments.length,x0) }),
      _2112: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2112(f,arguments.length,x0) }),
      _2113: x0 => ({scope: x0}),
      _2114: (x0,x1) => x0.register(x1),
      _2115: (x0,x1,x2) => x0.register(x1,x2),
      _2116: (x0,x1) => x0.postMessage(x1),
      _2117: (x0,x1) => x0.getRegistration(x1),
      _2127: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2128: (x0,x1) => x0.exec(x1),
      _2129: (x0,x1) => x0.test(x1),
      _2130: x0 => x0.pop(),
      _2132: o => o === undefined,
      _2134: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2136: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2137: o => o instanceof RegExp,
      _2138: (l, r) => l === r,
      _2139: o => o,
      _2140: o => o,
      _2141: o => o,
      _2142: b => !!b,
      _2143: o => o.length,
      _2145: (o, i) => o[i],
      _2146: f => f.dartFunction,
      _2147: () => ({}),
      _2148: () => [],
      _2150: () => globalThis,
      _2151: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2152: (o, p) => p in o,
      _2153: (o, p) => o[p],
      _2154: (o, p, v) => o[p] = v,
      _2155: (o, m, a) => o[m].apply(o, a),
      _2157: o => String(o),
      _2158: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _2159: o => {
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
        return 18;
      },
      _2160: o => [o],
      _2161: (o0, o1) => [o0, o1],
      _2162: (o0, o1, o2) => [o0, o1, o2],
      _2163: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _2164: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2165: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2166: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2167: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2168: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2169: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2170: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2171: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2172: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2173: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2174: x0 => new ArrayBuffer(x0),
      _2175: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2177: x0 => x0.index,
      _2178: x0 => x0.groups,
      _2179: x0 => x0.flags,
      _2180: x0 => x0.multiline,
      _2181: x0 => x0.ignoreCase,
      _2182: x0 => x0.unicode,
      _2183: x0 => x0.dotAll,
      _2184: (x0,x1) => { x0.lastIndex = x1 },
      _2185: (o, p) => p in o,
      _2186: (o, p) => o[p],
      _2187: (o, p, v) => o[p] = v,
      _2188: (o, p) => delete o[p],
      _2189: x0 => x0.random(),
      _2190: (x0,x1) => x0.getRandomValues(x1),
      _2191: () => globalThis.crypto,
      _2192: () => globalThis.Math,
      _2193: Function.prototype.call.bind(Number.prototype.toString),
      _2194: Function.prototype.call.bind(BigInt.prototype.toString),
      _2195: Function.prototype.call.bind(Number.prototype.toString),
      _2196: (d, digits) => d.toFixed(digits),
      _2200: () => globalThis.document,
      _2206: (x0,x1) => { x0.height = x1 },
      _2208: (x0,x1) => { x0.width = x1 },
      _2217: x0 => x0.style,
      _2220: x0 => x0.src,
      _2221: (x0,x1) => { x0.src = x1 },
      _2222: x0 => x0.naturalWidth,
      _2223: x0 => x0.naturalHeight,
      _2239: x0 => x0.status,
      _2240: (x0,x1) => { x0.responseType = x1 },
      _2242: x0 => x0.response,
      _2243: () => globalThis.google.accounts.oauth2,
      _2244: (x0,x1,x2) => x0.hasGrantedAllScopes(x1,x2),
      _2263: x0 => x0.access_token,
      _2264: x0 => x0.expires_in,
      _2270: x0 => x0.error,
      _2271: x0 => x0.error_description,
      _2273: x0 => x0.type,
      _2274: x0 => x0.message,
      _2278: () => globalThis.google.accounts.id,
      _2283: (x0,x1) => x0.renderButton(x1),
      _2284: (x0,x1,x2) => x0.renderButton(x1,x2),
      _2292: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2292(f,arguments.length,x0) }),
      _2295: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15,x16) => ({client_id: x0,auto_select: x1,callback: x2,login_uri: x3,native_callback: x4,cancel_on_tap_outside: x5,prompt_parent_id: x6,nonce: x7,context: x8,state_cookie_domain: x9,ux_mode: x10,allowed_parent_origin: x11,intermediate_iframe_close_callback: x12,itp_support: x13,login_hint: x14,hd: x15,use_fedcm_for_prompt: x16}),
      _2306: x0 => x0.error,
      _2308: x0 => x0.credential,
      _2311: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => ({type: x0,theme: x1,size: x2,text: x3,shape: x4,logo_alignment: x5,width: x6,locale: x7,click_listener: x8}),
      _2319: x0 => { globalThis.onGoogleLibraryLoad = x0 },
      _2320: f => finalizeWrapper(f, function() { return dartInstance.exports._2320(f,arguments.length) }),
      _2365: x0 => x0.status,
      _2370: x0 => x0.responseText,
      _2429: (x0,x1) => { x0.draggable = x1 },
      _2445: x0 => x0.style,
      _2644: (x0,x1) => { x0.nonce = x1 },
      _2660: (x0,x1) => { x0.href = x1 },
      _2664: (x0,x1) => { x0.rel = x1 },
      _2804: (x0,x1) => { x0.download = x1 },
      _2829: (x0,x1) => { x0.href = x1 },
      _2921: x0 => x0.src,
      _2922: (x0,x1) => { x0.src = x1 },
      _2925: x0 => x0.name,
      _2926: (x0,x1) => { x0.name = x1 },
      _2927: x0 => x0.sandbox,
      _2928: x0 => x0.allow,
      _2929: (x0,x1) => { x0.allow = x1 },
      _2930: x0 => x0.allowFullscreen,
      _2931: (x0,x1) => { x0.allowFullscreen = x1 },
      _2936: x0 => x0.referrerPolicy,
      _2937: (x0,x1) => { x0.referrerPolicy = x1 },
      _3047: x0 => x0.error,
      _3048: x0 => x0.src,
      _3049: (x0,x1) => { x0.src = x1 },
      _3054: (x0,x1) => { x0.crossOrigin = x1 },
      _3057: (x0,x1) => { x0.preload = x1 },
      _3058: x0 => x0.buffered,
      _3061: x0 => x0.currentTime,
      _3062: (x0,x1) => { x0.currentTime = x1 },
      _3063: x0 => x0.duration,
      _3068: (x0,x1) => { x0.playbackRate = x1 },
      _3077: (x0,x1) => { x0.loop = x1 },
      _3079: (x0,x1) => { x0.controls = x1 },
      _3081: (x0,x1) => { x0.volume = x1 },
      _3083: (x0,x1) => { x0.muted = x1 },
      _3098: x0 => x0.code,
      _3099: x0 => x0.message,
      _3173: x0 => x0.length,
      _3369: (x0,x1) => { x0.accept = x1 },
      _3383: x0 => x0.files,
      _3409: (x0,x1) => { x0.multiple = x1 },
      _3427: (x0,x1) => { x0.type = x1 },
      _3677: (x0,x1) => { x0.src = x1 },
      _3679: (x0,x1) => { x0.type = x1 },
      _3683: (x0,x1) => { x0.async = x1 },
      _3685: (x0,x1) => { x0.defer = x1 },
      _3687: (x0,x1) => { x0.crossOrigin = x1 },
      _3689: (x0,x1) => { x0.text = x1 },
      _4145: () => globalThis.window,
      _4185: x0 => x0.document,
      _4188: x0 => x0.location,
      _4189: x0 => x0.history,
      _4207: x0 => x0.navigator,
      _4461: x0 => x0.origin,
      _4469: x0 => x0.trustedTypes,
      _4470: x0 => x0.sessionStorage,
      _4471: x0 => x0.localStorage,
      _4477: x0 => x0.href,
      _4479: x0 => x0.origin,
      _4482: x0 => x0.host,
      _4484: x0 => x0.hostname,
      _4488: x0 => x0.pathname,
      _4492: x0 => x0.hash,
      _4524: (x0,x1) => { x0.returnValue = x1 },
      _4526: x0 => x0.message,
      _4527: x0 => x0.filename,
      _4528: x0 => x0.lineno,
      _4529: x0 => x0.colno,
      _4576: x0 => x0.maxTouchPoints,
      _4579: x0 => x0.serviceWorker,
      _4583: x0 => x0.appCodeName,
      _4584: x0 => x0.appName,
      _4585: x0 => x0.appVersion,
      _4586: x0 => x0.platform,
      _4587: x0 => x0.product,
      _4588: x0 => x0.productSub,
      _4589: x0 => x0.userAgent,
      _4590: x0 => x0.vendor,
      _4591: x0 => x0.vendorSub,
      _4593: x0 => x0.language,
      _4594: x0 => x0.languages,
      _4595: x0 => x0.onLine,
      _4600: x0 => x0.hardwareConcurrency,
      _4640: x0 => x0.data,
      _4670: x0 => x0.port1,
      _4671: x0 => x0.port2,
      _4674: (x0,x1) => { x0.onmessage = x1 },
      _4676: (x0,x1) => { x0.onmessageerror = x1 },
      _4742: (x0,x1) => { x0.onmessage = x1 },
      _4744: (x0,x1) => { x0.onmessageerror = x1 },
      _4746: (x0,x1) => { x0.onerror = x1 },
      _4789: x0 => x0.length,
      _6732: x0 => x0.signal,
      _6741: x0 => x0.length,
      _6762: x0 => x0.addedNodes,
      _6783: x0 => x0.baseURI,
      _6789: x0 => x0.firstChild,
      _6800: () => globalThis.document,
      _6880: x0 => x0.body,
      _6882: x0 => x0.head,
      _7210: x0 => x0.id,
      _7211: (x0,x1) => { x0.id = x1 },
      _7234: x0 => x0.innerHTML,
      _7235: (x0,x1) => { x0.innerHTML = x1 },
      _7238: x0 => x0.children,
      _7245: x0 => x0.role,
      _7246: (x0,x1) => { x0.role = x1 },
      _7275: x0 => x0.ariaHidden,
      _7276: (x0,x1) => { x0.ariaHidden = x1 },
      _7441: x0 => x0.length,
      _8556: x0 => x0.value,
      _8558: x0 => x0.done,
      _8738: x0 => x0.size,
      _8745: x0 => x0.name,
      _8751: x0 => x0.length,
      _8756: x0 => x0.result,
      _8832: x0 => x0.active,
      _8842: x0 => x0.controller,
      _9251: x0 => x0.url,
      _9253: x0 => x0.status,
      _9254: x0 => x0.ok,
      _9255: x0 => x0.statusText,
      _9256: x0 => x0.headers,
      _9257: x0 => x0.body,
      _9616: x0 => x0.contentRect,
      _11383: (x0,x1) => { x0.border = x1 },
      _11661: (x0,x1) => { x0.display = x1 },
      _11825: (x0,x1) => { x0.height = x1 },
      _11881: (x0,x1) => { x0.left = x1 },
      _12151: (x0,x1) => { x0.position = x1 },
      _12443: (x0,x1) => { x0.top = x1 },
      _12515: (x0,x1) => { x0.width = x1 },
      _12883: x0 => x0.name,
      _12884: x0 => x0.message,
      _13206: x0 => x0.width,
      _13207: x0 => x0.height,
      _13591: () => globalThis.console,
      _13618: x0 => x0.name,
      _13619: x0 => x0.message,
      _13620: x0 => x0.code,
      _13622: x0 => x0.customData,
      _13623: () => globalThis.navigator,
      _13624: x0 => x0.deviceMemory,
      _13625: x0 => x0.hardwareConcurrency,

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
