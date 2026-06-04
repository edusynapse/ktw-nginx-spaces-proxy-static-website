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
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arugments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `load-ids` option is passed. Each load ID maps to one
  //   or more wasm files as specified in the emitted JSON file. It also takes a
  //   callback that should be invoked for each loaded module with 2 arugments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It also takes a callback that should be invoked with the
  //   loaded module in a format supported by `WebAssembly.compile` or
  //   `WebAssembly.compileStreaming` and the result of using the JS 'import'
  //   API on the js file path. It should return a Promise that resolves when
  //   all the modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports,
      {loadDeferredModules, loadDynamicModule, loadDeferredId} = {}) {
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
            _1: (decoder, codeUnits) => decoder.decode(codeUnits),
      _2: () => new TextDecoder("utf-8", {fatal: true}),
      _3: () => new TextDecoder("utf-8", {fatal: false}),
      _4: (s) => +s,
      _5: Date.now,
      _7: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _8: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _12: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _13: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _29: s => JSON.stringify(s),
      _30: s => printToConsole(s),
      _31: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      _32: (o, p, r) => o.replaceAll(p, () => r),
      _34: Function.prototype.call.bind(String.prototype.toLowerCase),
      _35: s => s.toUpperCase(),
      _36: s => s.trim(),
      _39: (string, times) => string.repeat(times),
      _40: Function.prototype.call.bind(String.prototype.indexOf),
      _41: (s, p, i) => s.lastIndexOf(p, i),
      _42: (string, token) => string.split(token),
      _43: Object.is,
      _47: (o, t) => typeof o === t,
      _48: (o, c) => o instanceof c,
      _49: o => Object.keys(o),
      _71: (o) => !!o,
      _103: () => new Array(),
      _104: x0 => new Array(x0),
      _106: x0 => x0.length,
      _108: (x0,x1) => x0[x1],
      _109: (x0,x1,x2) => { x0[x1] = x2 },
      _113: (x0,x1,x2) => new DataView(x0,x1,x2),
      _115: x0 => new Int8Array(x0),
      _116: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _117: x0 => new Uint8Array(x0),
      _119: x0 => new Uint8ClampedArray(x0),
      _121: x0 => new Int16Array(x0),
      _123: x0 => new Uint16Array(x0),
      _125: x0 => new Int32Array(x0),
      _127: x0 => new Uint32Array(x0),
      _129: x0 => new Float32Array(x0),
      _131: x0 => new Float64Array(x0),
      _156: x0 => x0.random(),
      _159: () => globalThis.Math,
      _172: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _173: (handle) => clearTimeout(handle),
      _176: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _178: () => new Error().stack,
      _179: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _180: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _181: (x0,x1) => x0.exec(x1),
      _182: (x0,x1) => x0.test(x1),
      _183: x0 => x0.pop(),
      _185: o => o === undefined,
      _187: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _189: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _190: o => o instanceof RegExp,
      _191: (l, r) => l === r,
      _192: o => o,
      _193: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      _194: o => o,
      _195: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      _196: o => o,
      _197: b => !!b,
      _198: o => o.length,
      _200: (o, i) => o[i],
      _201: f => f.dartFunction,
      _202: () => ({}),
      _203: () => [],
      _205: () => globalThis,
      _206: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _208: (o, p) => o[p],
      _209: (o, p, v) => o[p] = v,
      _210: (o, m, a) => o[m].apply(o, a),
      _212: o => String(o),
      _213: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _214: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._214(f,arguments.length,x0) }),
      _215: (module,f) => finalizeWrapper(f, function(x0,x1) { return module.exports._215(f,arguments.length,x0,x1) }),
      _216: o => {
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
      _217: o => [o],
      _218: (o0, o1) => [o0, o1],
      _219: (o0, o1, o2) => [o0, o1, o2],
      _220: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _221: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      _222: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _223: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _226: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _232: x0 => new ArrayBuffer(x0),
      _235: x0 => x0.index,
      _237: x0 => x0.flags,
      _238: x0 => x0.multiline,
      _239: x0 => x0.ignoreCase,
      _240: x0 => x0.unicode,
      _241: x0 => x0.dotAll,
      _242: (x0,x1) => { x0.lastIndex = x1 },
      _244: (o, p) => o[p],
      _265: () => new AbortController(),
      _266: x0 => x0.abort(),
      _267: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _268: (x0,x1) => globalThis.fetch(x0,x1),
      _269: (x0,x1) => x0.get(x1),
      _270: (module,f) => finalizeWrapper(f, function(x0,x1,x2) { return module.exports._270(f,arguments.length,x0,x1,x2) }),
      _271: (x0,x1) => x0.forEach(x1),
      _272: x0 => x0.getReader(),
      _273: x0 => x0.cancel(),
      _274: x0 => x0.read(),
      _277: (x0,x1,x2) => x0.postMessage(x1,x2),
      _278: x0 => x0.close(),
      _279: () => new MessageChannel(),
      _280: (x0,x1) => x0.push(x1),
      _281: (x0,x1) => x0.postMessage(x1),
      _292: () => globalThis.self,
      _293: x0 => x0.close(),
      _294: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._294(f,arguments.length,x0) }),
      _295: (module,f) => finalizeWrapper(f, function(x0) { return module.exports._295(f,arguments.length,x0) }),
      _296: (x0,x1,x2) => x0.postMessage(x1,x2),
      _301: (x0,x1) => globalThis.Object.is(x0,x1),
      _302: (x0,x1) => x0.at(x1),
      _303: x0 => x0.entries(),
      _304: x0 => x0.values(),
      _305: x0 => globalThis.BigInt(x0),
      _306: () => new Map(),
      _307: (x0,x1,x2) => x0.set(x1,x2),
      _308: () => new Set(),
      _309: (x0,x1) => x0.add(x1),
      _310: x0 => x0.toString(),
      _311: x0 => x0.getTime(),
      _312: x0 => x0.length,
      _314: x0 => x0.buffer,
      _315: o => o instanceof Array,
      _324: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _325: a => a.length,
      _327: (a, i) => a[i],
      _328: (a, i, v) => a[i] = v,
      _333: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      _334: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _335: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      _336: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _337: o => o instanceof Uint8ClampedArray,
      _338: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _339: o => o instanceof Uint16Array,
      _340: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _341: o => o instanceof Int16Array,
      _342: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _343: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      _344: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _345: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      _346: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _349: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      _350: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _351: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      _352: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _353: (a, i) => a.push(i),
      _354: (t, s) => t.set(s),
      _356: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _358: o => o.buffer,
      _359: o => o.byteOffset,
      _360: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _361: (b, o) => new DataView(b, o),
      _362: (b, o, l) => new DataView(b, o, l),
      _363: Function.prototype.call.bind(DataView.prototype.getUint8),
      _364: Function.prototype.call.bind(DataView.prototype.setUint8),
      _365: Function.prototype.call.bind(DataView.prototype.getInt8),
      _366: Function.prototype.call.bind(DataView.prototype.setInt8),
      _367: Function.prototype.call.bind(DataView.prototype.getUint16),
      _368: Function.prototype.call.bind(DataView.prototype.setUint16),
      _369: Function.prototype.call.bind(DataView.prototype.getInt16),
      _370: Function.prototype.call.bind(DataView.prototype.setInt16),
      _371: Function.prototype.call.bind(DataView.prototype.getUint32),
      _372: Function.prototype.call.bind(DataView.prototype.setUint32),
      _373: Function.prototype.call.bind(DataView.prototype.getInt32),
      _374: Function.prototype.call.bind(DataView.prototype.setInt32),
      _379: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _380: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _381: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _382: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _383: Function.prototype.call.bind(Number.prototype.toString),
      _384: Function.prototype.call.bind(BigInt.prototype.toString),
      _385: Function.prototype.call.bind(Number.prototype.toString),
      _2767: x0 => x0.port1,
      _2768: x0 => x0.port2,
      _2771: (x0,x1) => { x0.onmessage = x1 },
      _2828: (x0,x1) => { x0.onmessage = x1 },
      _4834: x0 => x0.signal,
      _6674: x0 => x0.value,
      _6676: x0 => x0.done,
      _7377: x0 => x0.url,
      _7379: x0 => x0.status,
      _7381: x0 => x0.statusText,
      _7382: x0 => x0.headers,
      _7383: x0 => x0.body,
      _11011: x0 => x0.name,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

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
    dartInstance.exports.$setThisModule(dartInstance);

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
