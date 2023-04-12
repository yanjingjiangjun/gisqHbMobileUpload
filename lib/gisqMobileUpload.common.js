module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "0808":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("aec3");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("34247180", content, true, {"sourceMap":true,"shadowMode":false});

/***/ }),

/***/ "09fa":
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__("4588");
var toLength = __webpack_require__("9def");
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "0f88":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var uid = __webpack_require__("ca5a");
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),

/***/ "1094":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/iconfont.cfa842c3.woff";

/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__("aae3");
var anObject = __webpack_require__("cb7c");
var speciesConstructor = __webpack_require__("ebd6");
var advanceStringIndex = __webpack_require__("0390");
var toLength = __webpack_require__("9def");
var callRegExpExec = __webpack_require__("5f1b");
var regexpExec = __webpack_require__("520a");
var fails = __webpack_require__("79e5");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2e34":
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),

/***/ "2f21":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("79e5");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "34ef":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("ec30")('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ "36bd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4917":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");

// @@match logic
__webpack_require__("214f")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "55af":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/iconfont.29f72b08.ttf";

/***/ }),

/***/ "57e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var $indexOf = __webpack_require__("c366")(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__("2f21")($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),

/***/ "5a86":
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__("2e34");
exports = module.exports = __webpack_require__("c356")(true);
// imports


// module
exports.push([module.i, "@font-face{font-family:iconfont;src:url(" + escape(__webpack_require__("996a")) + ");src:url(" + escape(__webpack_require__("996a")) + "#iefix) format(\"embedded-opentype\"),url(\"data:application/x-font-woff2;charset=utf-8;base64,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\") format(\"woff2\"),url(" + escape(__webpack_require__("1094")) + ") format(\"woff\"),url(" + escape(__webpack_require__("55af")) + ") format(\"truetype\"),url(" + escape(__webpack_require__("96cd")) + "#iconfont) format(\"svg\")}[class*=\" iconfont-gisqupload\"],[class^=iconfont-gisqupload]{font-family:iconfont!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-close:before{content:\"\\E650\"}.icon-circle-video:before{content:\"\\E61F\"}.icon-shanchu:before{content:\"\\E6BA\"}.icon-add-circle:before{content:\"\\E664\"}.icon-plus-line:before{content:\"\\E636\"}.icon-friends:before{content:\"\\E61E\"}.icon-fold:before{content:\"\\E613\"}.icon-like:before{content:\"\\E614\"}.icon-link:before{content:\"\\E615\"}.icon-location:before{content:\"\\E616\"}.icon-mail:before{content:\"\\E617\"}.icon-more:before{content:\"\\E618\"}.icon-notificationforbid:before{content:\"\\E619\"}.icon-notification:before{content:\"\\E61A\"}.icon-search:before{content:\"\\E61B\"}.icon-unfold:before{content:\"\\E61C\"}.icon-unlock:before{content:\"\\E61D\"}.icon-message:before{content:\"\\E612\"}.icon-my:before{content:\"\\E60A\"}.icon-ringpause:before{content:\"\\E60B\"}.icon-ring:before{content:\"\\E60C\"}.icon-share:before{content:\"\\E60D\"}.icon-upload:before{content:\"\\E60E\"}.icon-video:before{content:\"\\E60F\"}.icon-edit:before{content:\"\\E610\"}.icon-form:before{content:\"\\E611\"}.icon-camera:before{content:\"\\E600\"}.icon-card:before{content:\"\\E601\"}.icon-cart:before{content:\"\\E602\"}.icon-down:before{content:\"\\E603\"}.icon-edit1:before{content:\"\\E604\"}.icon-file:before{content:\"\\E605\"}.icon-file2:before{content:\"\\E606\"}.icon-goods:before{content:\"\\E607\"}.icon-history:before{content:\"\\E608\"}.icon-home:before{content:\"\\E609\"}", "", {"version":3,"sources":["/Users/fujian/mine/work/hbuilderwork/gisqHbMobileUpload/src/assets/css/iconfont.css"],"names":[],"mappings":"AAAA,WAAY,qBACV,kCACA,8oRAKF,CAEA,6DACE,+BACA,eACA,kBACA,mCACA,iCACF,CAEA,mBACE,eACF,CAEA,0BACE,eACF,CAEA,qBACE,eACF,CAEA,wBACE,eACF,CAEA,uBACE,eACF,CAEA,qBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,sBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,gCACE,eACF,CAEA,0BACE,eACF,CAEA,oBACE,eACF,CAEA,oBACE,eACF,CAEA,oBACE,eACF,CAEA,qBACE,eACF,CAEA,gBACE,eACF,CAEA,uBACE,eACF,CAEA,kBACE,eACF,CAEA,mBACE,eACF,CAEA,oBACE,eACF,CAEA,mBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,oBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,kBACE,eACF,CAEA,mBACE,eACF,CAEA,kBACE,eACF,CAEA,mBACE,eACF,CAEA,mBACE,eACF,CAEA,qBACE,eACF,CAEA,kBACE,eACF,CAAA","file":"iconfont.css","sourcesContent":["@font-face {font-family: \"iconfont\";\n  src: url('iconfont.eot?t=1617952352498'); /* IE9 */\n  src: url('iconfont.eot?t=1617952352498#iefix') format('embedded-opentype'), /* IE6-IE8 */\n  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),\n  url('iconfont.woff?t=1617952352498') format('woff'),\n  url('iconfont.ttf?t=1617952352498') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */\n  url('iconfont.svg?t=1617952352498#iconfont') format('svg'); /* iOS 4.1- */\n}\n\n[class^=\"iconfont-gisqupload\"], [class*=\" iconfont-gisqupload\"]{\n  font-family: \"iconfont\" !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.icon-close:before {\n  content: \"\\e650\";\n}\n\n.icon-circle-video:before {\n  content: \"\\e61f\";\n}\n\n.icon-shanchu:before {\n  content: \"\\e6ba\";\n}\n\n.icon-add-circle:before {\n  content: \"\\e664\";\n}\n\n.icon-plus-line:before {\n  content: \"\\e636\";\n}\n\n.icon-friends:before {\n  content: \"\\e61e\";\n}\n\n.icon-fold:before {\n  content: \"\\e613\";\n}\n\n.icon-like:before {\n  content: \"\\e614\";\n}\n\n.icon-link:before {\n  content: \"\\e615\";\n}\n\n.icon-location:before {\n  content: \"\\e616\";\n}\n\n.icon-mail:before {\n  content: \"\\e617\";\n}\n\n.icon-more:before {\n  content: \"\\e618\";\n}\n\n.icon-notificationforbid:before {\n  content: \"\\e619\";\n}\n\n.icon-notification:before {\n  content: \"\\e61a\";\n}\n\n.icon-search:before {\n  content: \"\\e61b\";\n}\n\n.icon-unfold:before {\n  content: \"\\e61c\";\n}\n\n.icon-unlock:before {\n  content: \"\\e61d\";\n}\n\n.icon-message:before {\n  content: \"\\e612\";\n}\n\n.icon-my:before {\n  content: \"\\e60a\";\n}\n\n.icon-ringpause:before {\n  content: \"\\e60b\";\n}\n\n.icon-ring:before {\n  content: \"\\e60c\";\n}\n\n.icon-share:before {\n  content: \"\\e60d\";\n}\n\n.icon-upload:before {\n  content: \"\\e60e\";\n}\n\n.icon-video:before {\n  content: \"\\e60f\";\n}\n\n.icon-edit:before {\n  content: \"\\e610\";\n}\n\n.icon-form:before {\n  content: \"\\e611\";\n}\n\n.icon-camera:before {\n  content: \"\\e600\";\n}\n\n.icon-card:before {\n  content: \"\\e601\";\n}\n\n.icon-cart:before {\n  content: \"\\e602\";\n}\n\n.icon-down:before {\n  content: \"\\e603\";\n}\n\n.icon-edit1:before {\n  content: \"\\e604\";\n}\n\n.icon-file:before {\n  content: \"\\e605\";\n}\n\n.icon-file2:before {\n  content: \"\\e606\";\n}\n\n.icon-goods:before {\n  content: \"\\e607\";\n}\n\n.icon-history:before {\n  content: \"\\e608\";\n}\n\n.icon-home:before {\n  content: \"\\e609\";\n}\n\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5df3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("02f4")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("01f9")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "6159":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("b15b");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("43a6e30f", content, true, {"sourceMap":true,"shadowMode":false});

/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "67ab":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("ca5a")('meta');
var isObject = __webpack_require__("d3f4");
var has = __webpack_require__("69a8");
var setDesc = __webpack_require__("86cc").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("79e5")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "6944":
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__("c82c"));
	else {}
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_viewerjs__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_viewerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_viewerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_throttle_debounce__ = __webpack_require__(5);



var install = function install(Vue, _ref) {
  var _ref$name = _ref.name,
      name = _ref$name === undefined ? 'viewer' : _ref$name,
      _ref$debug = _ref.debug,
      debug = _ref$debug === undefined ? false : _ref$debug;

  function createViewer(el, options) {
    var rebuild = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    Vue.nextTick(function () {
      if (rebuild || !el['$' + name]) {
        destroyViewer(el);
        el['$' + name] = new __WEBPACK_IMPORTED_MODULE_0_viewerjs___default.a(el, options);
        log('viewer created');
      } else {
        el['$' + name].update();
        log('viewer updated');
      }
    });
  }

  function createObserver(el, options, debouncedCreateViewer, rebuild) {
    destroyObserver(el);
    var MutationObserver = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;
    if (!MutationObserver) {
      log('observer not supported');
      return;
    }
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        log('viewer mutation:' + mutation.type);
        debouncedCreateViewer(el, options, rebuild);
      });
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(el, config);
    el['$viewerMutationObserver'] = observer;
    log('observer created');
  }

  function createWatcher(el, _ref2, vnode, debouncedCreateViewer) {
    var expression = _ref2.expression;

    var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
    if (!expression || !simplePathRE.test(expression)) {
      log('only simple dot-delimited paths can create watcher');
      return;
    }
    el['$viewerUnwatch'] = vnode.context.$watch(expression, function (newVal, oldVal) {
      log('change detected by watcher: ', expression);
      debouncedCreateViewer(el, newVal, true);
    }, {
      deep: true
    });
    log('watcher created, expression: ', expression);
  }

  function destroyViewer(el) {
    if (!el['$' + name]) {
      return;
    }
    el['$' + name].destroy();
    delete el['$' + name];
    log('viewer destroyed');
  }

  function destroyObserver(el) {
    if (!el['$viewerMutationObserver']) {
      return;
    }
    el['$viewerMutationObserver'].disconnect();
    delete el['$viewerMutationObserver'];
    log('observer destroyed');
  }

  function destroyWatcher(el) {
    if (!el['$viewerUnwatch']) {
      return;
    }
    el['$viewerUnwatch']();
    delete el['$viewerUnwatch'];
    log('watcher destroyed');
  }

  function log() {
    var _console;

    debug && (_console = console).log.apply(_console, arguments);
  }

  Vue.directive('viewer', {
    bind: function bind(el, binding, vnode) {
      log('viewer bind');
      var debouncedCreateViewer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_throttle_debounce__["a" /* debounce */])(50, createViewer);
      debouncedCreateViewer(el, binding.value);

      createWatcher(el, binding, vnode, debouncedCreateViewer);

      if (!binding.modifiers.static) {
        createObserver(el, binding.value, debouncedCreateViewer, binding.modifiers.rebuild);
      }
    },
    unbind: function unbind(el, binding) {
      log('viewer unbind');

      destroyObserver(el);

      destroyWatcher(el);

      destroyViewer(el);
    }
  });
};

/* harmony default export */ __webpack_exports__["a"] = ({
  install: install
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = extend;

function extend() {
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  function merge(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }

  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(8)(
  /* script */
  __webpack_require__(6),
  /* template */
  __webpack_require__(9),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Workspaces\\Web\\Git\\v-viewer\\src\\component.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] component.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {}

module.exports = Component.exports


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__component_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_viewerjs__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_viewerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_viewerjs__);





/* harmony default export */ __webpack_exports__["default"] = ({
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$name = _ref.name,
        name = _ref$name === undefined ? 'viewer' : _ref$name,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        defaultOptions = _ref.defaultOptions;

    __WEBPACK_IMPORTED_MODULE_3_viewerjs___default.a.setDefaults(defaultOptions);

    Vue.component(name, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* extend */])(__WEBPACK_IMPORTED_MODULE_1__component_vue___default.a, { name: name }));
    Vue.use(__WEBPACK_IMPORTED_MODULE_2__directive__["a" /* default */], { name: name, debug: debug });
  },
  setDefaults: function setDefaults(defaultOptions) {
    __WEBPACK_IMPORTED_MODULE_3_viewerjs___default.a.setDefaults(defaultOptions);
  }
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export throttle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return debounce; });

function throttle(delay, noTrailing, callback, debounceMode) {
  var timeoutID;
  var cancelled = false;

  var lastExec = 0;

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }

  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }


  function wrapper() {
    var self = this;
    var elapsed = Date.now() - lastExec;
    var args = arguments;

    if (cancelled) {
      return;
    }

    function exec() {
      lastExec = Date.now();
      callback.apply(self, args);
    }


    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      exec();
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel;

  return wrapper;
}

function debounce(delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_viewerjs__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_viewerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_viewerjs__);




/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    images: {
      type: Array
    },
    rebuild: {
      type: Boolean,
      default: false
    },
    trigger: {},
    options: {
      type: Object
    }
  },

  data: function data() {
    return {};
  },


  computed: {},

  methods: {
    onChange: function onChange() {
      if (this.rebuild) {
        this.rebuildViewer();
      } else {
        this.updateViewer();
      }
    },
    rebuildViewer: function rebuildViewer() {
      this.destroyViewer();
      this.createViewer();
    },
    updateViewer: function updateViewer() {
      if (this.$viewer) {
        this.$viewer.update();
        this.$emit('inited', this.$viewer);
      } else {
        this.createViewer();
      }
    },
    destroyViewer: function destroyViewer() {
      this.$viewer && this.$viewer.destroy();
    },
    createViewer: function createViewer() {
      this.$viewer = new __WEBPACK_IMPORTED_MODULE_0_viewerjs___default.a(this.$el, this.options);
      this.$emit('inited', this.$viewer);
    }
  },

  watch: {
    images: function images() {
      var _this = this;

      this.$nextTick(function () {
        _this.onChange();
      });
    },

    trigger: {
      handler: function handler() {
        var _this2 = this;

        this.$nextTick(function () {
          _this2.onChange();
        });
      },

      deep: true
    },
    options: {
      handler: function handler() {
        var _this3 = this;

        this.$nextTick(function () {
          _this3.rebuildViewer();
        });
      },

      deep: true
    }
  },

  mounted: function mounted() {
    this.createViewer();
  },
  destroyed: function destroyed() {
    this.destroyViewer();
  }
});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

g = function () {
	return this;
}();

try {
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

module.exports = g;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._t("default", null, {
    "images": _vm.images,
    "options": _vm.options
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {}

/***/ })
/******/ ]);
});

/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8194":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ac1b");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8944":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dialog_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("89a3");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dialog_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dialog_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dialog_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "89a3":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("a511");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("53208de1", content, true, {"sourceMap":true,"shadowMode":false});

/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "93aa":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sheet_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6159");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sheet_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sheet_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sheet_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "96cd":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/iconfont.79ba04b6.svg";

/***/ }),

/***/ "996a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/fonts/iconfont.a87d8160.eot";

/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a511":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c356")(true);
// imports


// module
exports.push([module.i, ".dialog{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.6);z-index:9999}.dialog-container{width:240px;height:200px;background:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:8px;position:relative}.dialog-title{width:100%;height:60px;font-size:18px;color:#696969;font-weight:600;padding:16px 50px 0 20px;box-sizing:border-box}.content{color:#797979;line-height:26px;padding:0 20px;box-sizing:border-box}.inp{margin:10px 0 0 20px;width:200px;height:40px;padding-left:4px;border-radius:4px;border:none;background:#efefef;outline:none}.inp:focus{border:1px solid #509ee3}.btns{width:100%;height:60px;position:absolute;bottom:0;left:0;padding:0 16px;box-sizing:border-box;font-size:16px}.btns,.btns>div{text-align:center}.btns>div{display:inline-block;height:36px;width:80px;line-height:36px;background:#f1f1f1;border-radius:8px;margin-right:12px;cursor:pointer}.default-btn{color:#787878}.default-btn:hover{color:#509ee3}.danger-btn{background:#ef8c8c!important;color:#000}.danger-btn:hover{background:#e08787}.danger-btn:active{background:#ef8c8c}.confirm-btn{color:#fff;background:#509ee3}.confirm-btn:hover{background:#6fb0eb}.close-btn{position:absolute;top:8px;right:8px;width:30px;height:30px;line-height:30px;text-align:center;font-size:18px;cursor:pointer}.close-btn:hover{font-weight:600}", "", {"version":3,"sources":["/Users/fujian/mine/work/hbuilderwork/gisqHbMobileUpload/gisq/upload/gisq/upload/dialog.vue"],"names":[],"mappings":"AAuFA,QACA,eACA,MACA,SACA,OACA,QACA,0BACA,YACA,CACA,kBACA,YACA,aACA,gBACA,kBACA,QACA,SACA,+BACA,kBACA,iBACA,CACA,cACA,WACA,YACA,eACA,cACA,gBACA,yBACA,qBACA,CACA,SACA,cACA,iBACA,eACA,qBACA,CACA,KACA,qBACA,YACA,YACA,iBACA,kBACA,YACA,mBACA,YAEA,CACA,WACA,wBACA,CACA,MACA,WACA,YACA,kBACA,SACA,OAEA,eACA,sBACA,cACA,CACA,gBALA,iBAeA,CAVA,UACA,qBACA,YACA,WACA,iBACA,mBACA,kBACA,kBACA,cAEA,CACA,aACA,aACA,CACA,mBACA,aACA,CACA,YACA,6BACA,UAEA,CACA,kBACA,kBACA,CACA,mBACA,kBACA,CACA,aACA,WACA,kBAEA,CACA,mBACA,kBACA,CACA,WACA,kBACA,QACA,UACA,WACA,YACA,iBACA,kBACA,eACA,cACA,CACA,iBACA,eACA,CAAA","file":"dialog.vue?vue&type=style&index=0&lang=css&","sourcesContent":["<template>\n    <div class=\"dialog\" v-show=\"showMask\">\n        <div class=\"dialog-container\">\n            <div class=\"dialog-title\">{{title}}</div>\n            <div class=\"content\" v-html=\"content\"></div>\n            <div class=\"btns\">\n                <div v-if=\"type != 'confirm'\" class=\"default-btn\" @click=\"closeBtn\">\n                    {{cancelText}}\n                </div>\n                <div v-if=\"type == 'danger'\" class=\"danger-btn\" @click=\"dangerBtn\">\n                    {{dangerText}}\n                </div>\n                <div v-if=\"type == 'confirm'\" class=\"confirm-btn\" @click=\"confirmBtn\">\n                    {{confirmText}}\n                </div>\n            </div>\n            <div class=\"close-btn\" @click=\"closeMask\"><i class=\"iconfont-gisqupload icon-close\"></i></div>\n        </div>\n        \n    </div>\n</template>\n<script>\nexport default {\n    props: {\n        value: {},\n        // 类型包括 defalut 默认， danger 危险， confirm 确认，\n        type:{\n            type: String,\n            default: 'default'\n        },\n        content: {\n            type: String,\n            default: ''\n        },\n        title: {\n            type: String,\n            default: ''\n        },\n        cancelText: {\n            type: String,\n            default: '取消'\n        },\n        dangerText: {\n            type: String,\n            default: '删除'\n        },\n        confirmText: {\n            type: String,\n            default: '确认'\n        },\n    },\n    data(){\n        return{\n            showMask: false,\n        }\n    },\n    methods:{\n        closeMask(){\n            this.showMask = false;\n        },\n        closeBtn(){\n            this.$emit('cancel');\n            this.closeMask();\n        },\n        dangerBtn(){\n            this.$emit('danger');\n            this.closeMask();\n        },\n        confirmBtn(){\n            this.$emit('confirm');\n            this.closeMask();\n        }\n    },\n    mounted(){\n        this.showMask = this.value;\n    },\n    watch:{\n        value(newVal, oldVal){\n            this.showMask = newVal;\n        },\n        showMask(val) {\n            this.$emit('input', val);\n        }\n    },\n}\n</script>\n<style>\n    .dialog{\n        position: fixed;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        background: rgba(0, 0, 0, 0.6);\n        z-index: 9999;\n    }\n\t.dialog-container{\n\t    width: 240px;\n\t    height: 200px;\n\t    background: #ffffff;\n\t    position: absolute;\n\t    top: 50%;\n\t    left: 50%;\n\t    transform: translate(-50%, -50%);\n\t    border-radius: 8px;\n\t    position: relative;\n\t}\n\t.dialog-title{\n\t    width: 100%;\n\t    height: 60px;\n\t    font-size: 18px;\n\t    color: #696969;\n\t    font-weight: 600;\n\t    padding: 16px 50px 0 20px;\n\t    box-sizing: border-box;\n\t}\n\t.content{\n\t    color: #797979;\n\t    line-height: 26px;\n\t    padding: 0 20px;\n\t    box-sizing: border-box;\n\t}\n\t.inp{\n\t    margin: 10px 0 0 20px;\n\t    width: 200px;\n\t    height: 40px;\n\t    padding-left: 4px;\n\t    border-radius: 4px;\n\t    border: none;\n\t    background: #efefef;\n\t    outline: none;\n\t    \n\t}\n\t.inp:focus{\n\t    border: 1px solid #509EE3;\n\t}\n\t.btns{\n\t    width: 100%;\n\t    height: 60px;\n\t    position: absolute;\n\t    bottom: 0;\n\t    left: 0;\n\t    text-align: center;\n\t    padding: 0 16px;\n\t    box-sizing: border-box;\n\t\tfont-size: 16px;\n\t}\n\t.btns>div{\n\t\tdisplay: inline-block;\n\t\theight: 36px;\n\t\twidth: 80px;\n\t\tline-height: 36px;\n\t\tbackground: #f1f1f1;\n\t\tborder-radius: 8px;\n\t\tmargin-right: 12px;\n\t\tcursor: pointer;\n\t\ttext-align: center;\n\t}\n\t.default-btn{\n\t    color: #787878;\n\t}\n\t.default-btn:hover{\n\t    color: #509EE3; \n\t}\n\t.danger-btn{\n\t    background: #EF8C8C !important;\n\t\tcolor:#000000;\n\t    \n\t}\n\t.danger-btn:hover{\n\t    background: rgb(224, 135, 135);\n\t}\n\t.danger-btn:active{\n\t    background: #EF8C8C;\n\t}\n\t.confirm-btn{\n\t    color: #ffffff;\n\t    background: #509EE3;\n\t    \n\t}\n\t.confirm-btn:hover{\n\t    background: #6FB0EB;\n\t}\n\t.close-btn{\n\t    position: absolute;\n\t    top: 8px;\n\t    right: 8px;\n\t    width: 30px;\n\t    height: 30px;\n\t    line-height: 30px;\n\t    text-align: center;\n\t    font-size: 18px;\n\t    cursor: pointer;\n\t}\n\t.close-btn:hover{\n\t    font-weight: 600;\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac1b":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("ded2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("ceabceda", content, true, {"sourceMap":true,"shadowMode":false});

/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "aec3":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c356")(true);
// imports


// module
exports.push([module.i, "/*!\n * Viewer.js v1.9.0\n * https://fengyuanchen.github.io/viewerjs\n *\n * Copyright 2015-present Chen Fengyuan\n * Released under the MIT license\n *\n * Date: 2020-12-06T11:25:10.724Z\n */.viewer-close:before,.viewer-flip-horizontal:before,.viewer-flip-vertical:before,.viewer-fullscreen-exit:before,.viewer-fullscreen:before,.viewer-next:before,.viewer-one-to-one:before,.viewer-play:before,.viewer-prev:before,.viewer-reset:before,.viewer-rotate-left:before,.viewer-rotate-right:before,.viewer-zoom-in:before,.viewer-zoom-out:before{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC\");background-repeat:no-repeat;background-size:280px;color:transparent;display:block;font-size:0;height:20px;line-height:0;width:20px}.viewer-zoom-in:before{background-position:0 0;content:\"Zoom In\"}.viewer-zoom-out:before{background-position:-20px 0;content:\"Zoom Out\"}.viewer-one-to-one:before{background-position:-40px 0;content:\"One to One\"}.viewer-reset:before{background-position:-60px 0;content:\"Reset\"}.viewer-prev:before{background-position:-80px 0;content:\"Previous\"}.viewer-play:before{background-position:-100px 0;content:\"Play\"}.viewer-next:before{background-position:-120px 0;content:\"Next\"}.viewer-rotate-left:before{background-position:-140px 0;content:\"Rotate Left\"}.viewer-rotate-right:before{background-position:-160px 0;content:\"Rotate Right\"}.viewer-flip-horizontal:before{background-position:-180px 0;content:\"Flip Horizontal\"}.viewer-flip-vertical:before{background-position:-200px 0;content:\"Flip Vertical\"}.viewer-fullscreen:before{background-position:-220px 0;content:\"Enter Full Screen\"}.viewer-fullscreen-exit:before{background-position:-240px 0;content:\"Exit Full Screen\"}.viewer-close:before{background-position:-260px 0;content:\"Close\"}.viewer-container{bottom:0;direction:ltr;font-size:0;left:0;line-height:0;overflow:hidden;position:absolute;right:0;-webkit-tap-highlight-color:transparent;top:0;-ms-touch-action:none;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.viewer-container::-moz-selection,.viewer-container ::-moz-selection{background-color:transparent}.viewer-container::selection,.viewer-container ::selection{background-color:transparent}.viewer-container:focus{outline:0}.viewer-container img{display:block;height:auto;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;width:100%}.viewer-canvas{bottom:0;left:0;overflow:hidden;position:absolute;right:0;top:0}.viewer-canvas>img{height:auto;margin:15px auto;max-width:90%!important;width:auto}.viewer-footer{bottom:0;left:0;overflow:hidden;position:absolute;right:0;text-align:center}.viewer-navbar{background-color:rgba(0,0,0,.5);overflow:hidden}.viewer-list{-webkit-box-sizing:content-box;box-sizing:content-box;height:50px;margin:0;overflow:hidden;padding:1px 0}.viewer-list>li{color:transparent;cursor:pointer;float:left;font-size:0;height:50px;line-height:0;opacity:.5;overflow:hidden;-webkit-transition:opacity .15s;transition:opacity .15s;width:30px}.viewer-list>li:focus,.viewer-list>li:hover{opacity:.75}.viewer-list>li:focus{outline:0}.viewer-list>li+li{margin-left:1px}.viewer-list>.viewer-loading{position:relative}.viewer-list>.viewer-loading:after{border-width:2px;height:20px;margin-left:-10px;margin-top:-10px;width:20px}.viewer-list>.viewer-active,.viewer-list>.viewer-active:focus,.viewer-list>.viewer-active:hover{opacity:1}.viewer-player{background-color:#000;bottom:0;cursor:none;display:none;right:0;z-index:1}.viewer-player,.viewer-player>img{left:0;position:absolute;top:0}.viewer-toolbar>ul{display:inline-block;margin:0 auto 5px;overflow:hidden;padding:6px 3px}.viewer-toolbar>ul>li{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;float:left;height:24px;overflow:hidden;-webkit-transition:background-color .15s;transition:background-color .15s;width:24px}.viewer-toolbar>ul>li:focus,.viewer-toolbar>ul>li:hover{background-color:rgba(0,0,0,.8)}.viewer-toolbar>ul>li:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0;position:relative;z-index:1}.viewer-toolbar>ul>li:before{margin:2px}.viewer-toolbar>ul>li+li{margin-left:1px}.viewer-toolbar>ul>.viewer-small{height:18px;margin-bottom:3px;margin-top:3px;width:18px}.viewer-toolbar>ul>.viewer-small:before{margin:-1px}.viewer-toolbar>ul>.viewer-large{height:30px;margin-bottom:-3px;margin-top:-3px;width:30px}.viewer-toolbar>ul>.viewer-large:before{margin:5px}.viewer-tooltip{background-color:rgba(0,0,0,.8);border-radius:10px;color:#fff;display:none;font-size:12px;height:20px;left:50%;line-height:20px;margin-left:-25px;margin-top:-10px;position:absolute;text-align:center;top:50%;width:50px}.viewer-title{color:#ccc;display:inline-block;font-size:12px;line-height:1;margin:0 5% 5px;max-width:90%;opacity:.8;overflow:hidden;text-overflow:ellipsis;-webkit-transition:opacity .15s;transition:opacity .15s;white-space:nowrap}.viewer-title:hover{opacity:1}.viewer-button{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;height:80px;overflow:hidden;position:absolute;right:-40px;top:-40px;-webkit-transition:background-color .15s;transition:background-color .15s;width:80px}.viewer-button:focus,.viewer-button:hover{background-color:rgba(0,0,0,.8)}.viewer-button:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0}.viewer-button:before{bottom:15px;left:15px;position:absolute}.viewer-fixed{position:fixed}.viewer-open{overflow:hidden}.viewer-show{display:block}.viewer-hide{display:none}.viewer-backdrop{background-color:rgba(0,0,0,.5)}.viewer-invisible{visibility:hidden}.viewer-move{cursor:move;cursor:-webkit-grab;cursor:grab}.viewer-fade{opacity:0}.viewer-in{opacity:1}.viewer-transition{-webkit-transition:all .3s;transition:all .3s}@-webkit-keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.viewer-loading:after{-webkit-animation:viewer-spinner 1s linear infinite;animation:viewer-spinner 1s linear infinite;border:4px solid hsla(0,0%,100%,.1);border-left-color:hsla(0,0%,100%,.5);border-radius:50%;content:\"\";display:inline-block;height:40px;left:50%;margin-left:-20px;margin-top:-20px;position:absolute;top:50%;width:40px;z-index:1}@media (max-width:767px){.viewer-hide-xs-down{display:none}}@media (max-width:991px){.viewer-hide-sm-down{display:none}}@media (max-width:1199px){.viewer-hide-md-down{display:none}}", "", {"version":3,"sources":["/Users/fujian/mine/work/hbuilderwork/gisqHbMobileUpload/node_modules/viewerjs/dist/viewer.css"],"names":[],"mappings":"AAAA;;;;;;;;GAUA,2VAcE,2kDACA,4BACA,sBACA,kBACA,cACA,YACA,YACA,cACA,UACF,CAEA,uBACE,wBACA,iBACF,CAEA,wBACE,4BACA,kBACF,CAEA,0BACE,4BACA,oBACF,CAEA,qBACE,4BACA,eACF,CAEA,oBACE,4BACA,kBACF,CAEA,oBACE,6BACA,cACF,CAEA,oBACE,6BACA,cACF,CAEA,2BACE,6BACA,qBACF,CAEA,4BACE,6BACA,sBACF,CAEA,+BACE,6BACA,yBACF,CAEA,6BACE,6BACA,uBACF,CAEA,0BACE,6BACA,2BACF,CAEA,+BACE,6BACA,0BACF,CAEA,qBACE,6BACA,eACF,CAEA,kBACE,SACA,cACA,YACA,OACA,cACA,gBACA,kBACA,QACA,wCACA,MACA,sBACA,kBACA,2BACA,yBACA,sBACA,qBACA,gBACF,CAEA,qEAEE,4BACF,CAEA,2DAEE,4BACF,CAEA,wBACE,SACF,CAEA,sBACE,cACA,YACA,0BACA,yBACA,uBACA,sBACA,UACF,CAEA,eACE,SACA,OACA,gBACA,kBACA,QACA,KACF,CAEA,mBACE,YACA,iBACA,wBACA,UACF,CAEA,eACE,SACA,OACA,gBACA,kBACA,QACA,iBACF,CAEA,eACE,gCACA,eACF,CAEA,aACE,+BACA,uBACA,YACA,SACA,gBACA,aACF,CAEA,gBACE,kBACA,eACA,WACA,YACA,YACA,cACA,WACA,gBACA,gCACA,wBACA,UACF,CAEA,4CAEE,WACF,CAEA,sBACE,SACF,CAEA,mBACE,eACF,CAEA,6BACE,iBACF,CAEA,mCACE,iBACA,YACA,kBACA,iBACA,UACF,CAEA,gGAGE,SACF,CAEA,eACE,sBACA,SACA,YACA,aAGA,QAEA,SACF,CAEA,kCAPE,OACA,kBAEA,KAQF,CAEA,mBACE,qBACA,kBACA,gBACA,eACF,CAEA,sBACE,gCACA,kBACA,eACA,WACA,YACA,gBACA,yCACA,iCACA,UACF,CAEA,wDAEE,+BACF,CAEA,4BACE,gCACA,wBACA,UACA,kBACA,SACF,CAEA,6BACE,UACF,CAEA,yBACE,eACF,CAEA,iCACE,YACA,kBACA,eACA,UACF,CAEA,wCACE,WACF,CAEA,iCACE,YACA,mBACA,gBACA,UACF,CAEA,wCACE,UACF,CAEA,gBACE,gCACA,mBACA,WACA,aACA,eACA,YACA,SACA,iBACA,kBACA,iBACA,kBACA,kBACA,QACA,UACF,CAEA,cACE,WACA,qBACA,eACA,cACA,gBACA,cACA,WACA,gBACA,uBACA,gCACA,wBACA,kBACF,CAEA,oBACE,SACF,CAEA,eACE,gCACA,kBACA,eACA,YACA,gBACA,kBACA,YACA,UACA,yCACA,iCACA,UACF,CAEA,0CAEE,+BACF,CAEA,qBACE,gCACA,wBACA,SACF,CAEA,sBACE,YACA,UACA,iBACF,CAEA,cACE,cACF,CAEA,aACE,eACF,CAEA,aACE,aACF,CAEA,aACE,YACF,CAEA,iBACE,+BACF,CAEA,kBACE,iBACF,CAEA,aACE,YACA,oBACA,WACF,CAEA,aACE,SACF,CAEA,WACE,SACF,CAEA,mBACE,2BACA,kBACF,CAEA,kCACE,GACE,+BACA,sBACF,CAEA,GACE,gCACA,uBACF,CACF,CAEA,0BACE,GACE,+BACA,sBACF,CAEA,GACE,gCACA,uBACF,CACF,CAEA,sBACE,oDACA,4CACA,oCACA,qCACA,kBACA,WACA,qBACA,YACA,SACA,kBACA,iBACA,kBACA,QACA,WACA,SACF,CAEA,yBACE,qBACE,YACF,CACF,CAEA,yBACE,qBACE,YACF,CACF,CAEA,0BACE,qBACE,YACF,CACF,CAAA","file":"viewer.css","sourcesContent":["/*!\n * Viewer.js v1.9.0\n * https://fengyuanchen.github.io/viewerjs\n *\n * Copyright 2015-present Chen Fengyuan\n * Released under the MIT license\n *\n * Date: 2020-12-06T11:25:10.724Z\n */\n\n.viewer-zoom-in::before,\n.viewer-zoom-out::before,\n.viewer-one-to-one::before,\n.viewer-reset::before,\n.viewer-prev::before,\n.viewer-play::before,\n.viewer-next::before,\n.viewer-rotate-left::before,\n.viewer-rotate-right::before,\n.viewer-flip-horizontal::before,\n.viewer-flip-vertical::before,\n.viewer-fullscreen::before,\n.viewer-fullscreen-exit::before,\n.viewer-close::before {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC');\n  background-repeat: no-repeat;\n  background-size: 280px;\n  color: transparent;\n  display: block;\n  font-size: 0;\n  height: 20px;\n  line-height: 0;\n  width: 20px;\n}\n\n.viewer-zoom-in::before {\n  background-position: 0 0;\n  content: 'Zoom In';\n}\n\n.viewer-zoom-out::before {\n  background-position: -20px 0;\n  content: 'Zoom Out';\n}\n\n.viewer-one-to-one::before {\n  background-position: -40px 0;\n  content: 'One to One';\n}\n\n.viewer-reset::before {\n  background-position: -60px 0;\n  content: 'Reset';\n}\n\n.viewer-prev::before {\n  background-position: -80px 0;\n  content: 'Previous';\n}\n\n.viewer-play::before {\n  background-position: -100px 0;\n  content: 'Play';\n}\n\n.viewer-next::before {\n  background-position: -120px 0;\n  content: 'Next';\n}\n\n.viewer-rotate-left::before {\n  background-position: -140px 0;\n  content: 'Rotate Left';\n}\n\n.viewer-rotate-right::before {\n  background-position: -160px 0;\n  content: 'Rotate Right';\n}\n\n.viewer-flip-horizontal::before {\n  background-position: -180px 0;\n  content: 'Flip Horizontal';\n}\n\n.viewer-flip-vertical::before {\n  background-position: -200px 0;\n  content: 'Flip Vertical';\n}\n\n.viewer-fullscreen::before {\n  background-position: -220px 0;\n  content: 'Enter Full Screen';\n}\n\n.viewer-fullscreen-exit::before {\n  background-position: -240px 0;\n  content: 'Exit Full Screen';\n}\n\n.viewer-close::before {\n  background-position: -260px 0;\n  content: 'Close';\n}\n\n.viewer-container {\n  bottom: 0;\n  direction: ltr;\n  font-size: 0;\n  left: 0;\n  line-height: 0;\n  overflow: hidden;\n  position: absolute;\n  right: 0;\n  -webkit-tap-highlight-color: transparent;\n  top: 0;\n  -ms-touch-action: none;\n  touch-action: none;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.viewer-container::-moz-selection,\n.viewer-container *::-moz-selection {\n  background-color: transparent;\n}\n\n.viewer-container::selection,\n.viewer-container *::selection {\n  background-color: transparent;\n}\n\n.viewer-container:focus {\n  outline: 0;\n}\n\n.viewer-container img {\n  display: block;\n  height: auto;\n  max-height: none !important;\n  max-width: none !important;\n  min-height: 0 !important;\n  min-width: 0 !important;\n  width: 100%;\n}\n\n.viewer-canvas {\n  bottom: 0;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.viewer-canvas > img {\n  height: auto;\n  margin: 15px auto;\n  max-width: 90% !important;\n  width: auto;\n}\n\n.viewer-footer {\n  bottom: 0;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  right: 0;\n  text-align: center;\n}\n\n.viewer-navbar {\n  background-color: rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n}\n\n.viewer-list {\n  -webkit-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 50px;\n  margin: 0;\n  overflow: hidden;\n  padding: 1px 0;\n}\n\n.viewer-list > li {\n  color: transparent;\n  cursor: pointer;\n  float: left;\n  font-size: 0;\n  height: 50px;\n  line-height: 0;\n  opacity: 0.5;\n  overflow: hidden;\n  -webkit-transition: opacity 0.15s;\n  transition: opacity 0.15s;\n  width: 30px;\n}\n\n.viewer-list > li:focus,\n.viewer-list > li:hover {\n  opacity: 0.75;\n}\n\n.viewer-list > li:focus {\n  outline: 0;\n}\n\n.viewer-list > li + li {\n  margin-left: 1px;\n}\n\n.viewer-list > .viewer-loading {\n  position: relative;\n}\n\n.viewer-list > .viewer-loading::after {\n  border-width: 2px;\n  height: 20px;\n  margin-left: -10px;\n  margin-top: -10px;\n  width: 20px;\n}\n\n.viewer-list > .viewer-active,\n.viewer-list > .viewer-active:focus,\n.viewer-list > .viewer-active:hover {\n  opacity: 1;\n}\n\n.viewer-player {\n  background-color: #000;\n  bottom: 0;\n  cursor: none;\n  display: none;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 1;\n}\n\n.viewer-player > img {\n  left: 0;\n  position: absolute;\n  top: 0;\n}\n\n.viewer-toolbar > ul {\n  display: inline-block;\n  margin: 0 auto 5px;\n  overflow: hidden;\n  padding: 6px 3px;\n}\n\n.viewer-toolbar > ul > li {\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 50%;\n  cursor: pointer;\n  float: left;\n  height: 24px;\n  overflow: hidden;\n  -webkit-transition: background-color 0.15s;\n  transition: background-color 0.15s;\n  width: 24px;\n}\n\n.viewer-toolbar > ul > li:focus,\n.viewer-toolbar > ul > li:hover {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\n.viewer-toolbar > ul > li:focus {\n  -webkit-box-shadow: 0 0 3px #fff;\n  box-shadow: 0 0 3px #fff;\n  outline: 0;\n  position: relative;\n  z-index: 1;\n}\n\n.viewer-toolbar > ul > li::before {\n  margin: 2px;\n}\n\n.viewer-toolbar > ul > li + li {\n  margin-left: 1px;\n}\n\n.viewer-toolbar > ul > .viewer-small {\n  height: 18px;\n  margin-bottom: 3px;\n  margin-top: 3px;\n  width: 18px;\n}\n\n.viewer-toolbar > ul > .viewer-small::before {\n  margin: -1px;\n}\n\n.viewer-toolbar > ul > .viewer-large {\n  height: 30px;\n  margin-bottom: -3px;\n  margin-top: -3px;\n  width: 30px;\n}\n\n.viewer-toolbar > ul > .viewer-large::before {\n  margin: 5px;\n}\n\n.viewer-tooltip {\n  background-color: rgba(0, 0, 0, 0.8);\n  border-radius: 10px;\n  color: #fff;\n  display: none;\n  font-size: 12px;\n  height: 20px;\n  left: 50%;\n  line-height: 20px;\n  margin-left: -25px;\n  margin-top: -10px;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  width: 50px;\n}\n\n.viewer-title {\n  color: #ccc;\n  display: inline-block;\n  font-size: 12px;\n  line-height: 1;\n  margin: 0 5% 5px;\n  max-width: 90%;\n  opacity: 0.8;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  -webkit-transition: opacity 0.15s;\n  transition: opacity 0.15s;\n  white-space: nowrap;\n}\n\n.viewer-title:hover {\n  opacity: 1;\n}\n\n.viewer-button {\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 50%;\n  cursor: pointer;\n  height: 80px;\n  overflow: hidden;\n  position: absolute;\n  right: -40px;\n  top: -40px;\n  -webkit-transition: background-color 0.15s;\n  transition: background-color 0.15s;\n  width: 80px;\n}\n\n.viewer-button:focus,\n.viewer-button:hover {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\n.viewer-button:focus {\n  -webkit-box-shadow: 0 0 3px #fff;\n  box-shadow: 0 0 3px #fff;\n  outline: 0;\n}\n\n.viewer-button::before {\n  bottom: 15px;\n  left: 15px;\n  position: absolute;\n}\n\n.viewer-fixed {\n  position: fixed;\n}\n\n.viewer-open {\n  overflow: hidden;\n}\n\n.viewer-show {\n  display: block;\n}\n\n.viewer-hide {\n  display: none;\n}\n\n.viewer-backdrop {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.viewer-invisible {\n  visibility: hidden;\n}\n\n.viewer-move {\n  cursor: move;\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n\n.viewer-fade {\n  opacity: 0;\n}\n\n.viewer-in {\n  opacity: 1;\n}\n\n.viewer-transition {\n  -webkit-transition: all 0.3s;\n  transition: all 0.3s;\n}\n\n@-webkit-keyframes viewer-spinner {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes viewer-spinner {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n.viewer-loading::after {\n  -webkit-animation: viewer-spinner 1s linear infinite;\n  animation: viewer-spinner 1s linear infinite;\n  border: 4px solid rgba(255, 255, 255, 0.1);\n  border-left-color: rgba(255, 255, 255, 0.5);\n  border-radius: 50%;\n  content: '';\n  display: inline-block;\n  height: 40px;\n  left: 50%;\n  margin-left: -20px;\n  margin-top: -20px;\n  position: absolute;\n  top: 50%;\n  width: 40px;\n  z-index: 1;\n}\n\n@media (max-width: 767px) {\n  .viewer-hide-xs-down {\n    display: none;\n  }\n}\n\n@media (max-width: 991px) {\n  .viewer-hide-sm-down {\n    display: none;\n  }\n}\n\n@media (max-width: 1199px) {\n  .viewer-hide-md-down {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "b15b":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c356")(true);
// imports


// module
exports.push([module.i, ".wrapper{background:#000;opacity:.6;height:100%;z-index:1000;top:0;left:0;display:flex;justify-content:bottom}.gisq-dialog,.wrapper{width:100%;position:fixed}.gisq-dialog{bottom:0;background-color:#fff;margin:auto;overflow:hidden;padding:10px 0}.gisq-title{height:48px;line-height:48px;text-align:center;color:#111;font-weight:bolder}.gisq-items{padding:10px 0}.gisq-item{color:#333;height:48px;line-height:48px;text-align:center}.gisq-line{background:#f2f2f2;height:1px}.gisq-cancel{color:red;height:48px;line-height:48px;text-align:center}", "", {"version":3,"sources":["/Users/fujian/mine/work/hbuilderwork/gisqHbMobileUpload/gisq/upload/gisq/upload/sheet.vue"],"names":[],"mappings":"AAiDA,SACA,gBACA,WAEA,YACA,aAEA,MACA,OACA,aACA,sBACA,CAEA,sBAVA,WAGA,cAeA,CARA,aAEA,SACA,sBACA,YACA,gBACA,cAEA,CAEA,YACA,YACA,iBACA,kBACA,WACA,kBACA,CAEA,YACA,cACA,CAEA,WACA,WACA,YACA,iBACA,iBACA,CAEA,WACA,mBACA,UACA,CAEA,aACA,UACA,YACA,iBACA,iBACA,CAAA","file":"sheet.vue?vue&type=style&index=0&lang=css&","sourcesContent":["<template>\n\t<div class=\"wrapper\" v-if=\"p_visiable\">\n\t\t<div class=\"gisq-dialog\" ref=\"box\" @click.stop=\"\">\n\t\t\t<div v-if=\"p_title != null\" class=\"gisq-title\">\n\t\t\t\t{{ p_title }}\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class=\"gisq-items\">\n\t\t\t\t<div class=\"gisq-line\"></div>\n\t\t\t\t<div v-for=\"(item, index) in p_sheetItems\" :key=\"index\" @click=\"clickOnSheetItem(item)\"\n\t\t\t\t\tclass=\"gisq-item\">\n\t\t\t\t\t<div>{{ item.name }}</div>\n\t\t\t\t\t<div class=\"gisq-line\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"gisq-cancel\" @click=\"dismiss()\">取消</div>\n\t\t</div>\n\t</div>\n</template>\n\n<script>\n\texport default {\n\t\tname: \"gisq-sheet\",\n\t\tprops: {\n\t\t\tp_title: null,\n\t\t\tp_cancelable: {\n\t\t\t\ttype: Boolean,\n\t\t\t\tdefault: true,\n\t\t\t},\n\t\t\tp_visiable: false,\n\t\t\tp_sheetItems: Array,\n\t\t},\n\t\tdata() {\n\t\t\treturn {};\n\t\t},\n\t\tmethods: {\n\t\t\tdismiss() {\n\t\t\t\tthis.$emit(\"update:p_visiable\", false);\n\t\t\t},\n\t\t\tclickOnSheetItem(obj) {\n\t\t\t\tthis.dismiss()\n\n\t\t\t\tthis.$emit(\"clickOnSheet\", obj);\n\t\t\t}\n\t\t},\n\t};\n</script>\n\n<style>\n\t.wrapper {\n\t\tbackground: #000000ff;\n\t\topacity: 0.6;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tz-index: 1000;\n\t\tposition: fixed;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tdisplay: flex;\n\t\tjustify-content: bottom;\n\t}\n\n\t.gisq-dialog {\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tbackground-color: #ffffff;\n\t\tmargin: auto;\n\t\toverflow: hidden;\n\t\tpadding: 10px 0px;\n\t\twidth: 100%;\n\t}\n\n\t.gisq-title {\n\t\theight: 48px;\n\t\tline-height: 48px;\n\t\ttext-align: center;\n\t\tcolor: #111;\n\t\tfont-weight: bolder;\n\t}\n\n\t.gisq-items {\n\t\tpadding: 10px 0px;\n\t}\n\n\t.gisq-item {\n\t\tcolor: #333;\n\t\theight: 48px;\n\t\tline-height: 48px;\n\t\ttext-align: center;\n\t}\n\n\t.gisq-line {\n\t\tbackground: #f2f2f2;\n\t\theight: 1px;\n\t}\n\n\t.gisq-cancel {\n\t\tcolor: red;\n\t\theight: 48px;\n\t\tline-height: 48px;\n\t\ttext-align: center;\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "b39a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),

/***/ "ba92":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c26b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__("86cc").f;
var create = __webpack_require__("2aeb");
var redefineAll = __webpack_require__("dcbc");
var ctx = __webpack_require__("9b43");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var $iterDefine = __webpack_require__("01f9");
var step = __webpack_require__("d53b");
var setSpecies = __webpack_require__("7a56");
var DESCRIPTORS = __webpack_require__("9e1e");
var fastKey = __webpack_require__("67ab").fastKey;
var validate = __webpack_require__("b39a");
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),

/***/ "c356":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "c82c":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Viewer.js v1.9.0
 * https://fengyuanchen.github.io/viewerjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-12-06T11:25:15.688Z
 */

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var DEFAULTS = {
    /**
     * Enable a modal backdrop, specify `static` for a backdrop
     * which doesn't close the modal on click.
     * @type {boolean}
     */
    backdrop: true,

    /**
     * Show the button on the top-right of the viewer.
     * @type {boolean}
     */
    button: true,

    /**
     * Show the navbar.
     * @type {boolean | number}
     */
    navbar: true,

    /**
     * Specify the visibility and the content of the title.
     * @type {boolean | number | Function | Array}
     */
    title: true,

    /**
     * Show the toolbar.
     * @type {boolean | number | Object}
     */
    toolbar: true,

    /**
     * Custom class name(s) to add to the viewer's root element.
     * @type {string}
     */
    className: '',

    /**
     * Define where to put the viewer in modal mode.
     * @type {string | Element}
     */
    container: 'body',

    /**
     * Filter the images for viewing. Return true if the image is viewable.
     * @type {Function}
     */
    filter: null,

    /**
     * Enable to request fullscreen when play.
     * @type {boolean}
     */
    fullscreen: true,

    /**
     * Define the extra attributes to inherit from the original image.
     * @type {Array}
     */
    inheritedAttributes: ['crossOrigin', 'decoding', 'isMap', 'loading', 'referrerPolicy', 'sizes', 'srcset', 'useMap'],

    /**
     * Define the initial index of image for viewing.
     * @type {number}
     */
    initialViewIndex: 0,

    /**
     * Enable inline mode.
     * @type {boolean}
     */
    inline: false,

    /**
     * The amount of time to delay between automatically cycling an image when playing.
     * @type {number}
     */
    interval: 5000,

    /**
     * Enable keyboard support.
     * @type {boolean}
     */
    keyboard: true,

    /**
     * Focus the viewer when initialized.
     * @type {boolean}
     */
    focus: true,

    /**
     * Indicate if show a loading spinner when load image or not.
     * @type {boolean}
     */
    loading: true,

    /**
     * Indicate if enable loop viewing or not.
     * @type {boolean}
     */
    loop: true,

    /**
     * Min width of the viewer in inline mode.
     * @type {number}
     */
    minWidth: 200,

    /**
     * Min height of the viewer in inline mode.
     * @type {number}
     */
    minHeight: 100,

    /**
     * Enable to move the image.
     * @type {boolean}
     */
    movable: true,

    /**
     * Enable to rotate the image.
     * @type {boolean}
     */
    rotatable: true,

    /**
     * Enable to scale the image.
     * @type {boolean}
     */
    scalable: true,

    /**
     * Enable to zoom the image.
     * @type {boolean}
     */
    zoomable: true,

    /**
     * Enable to zoom the current image by dragging on the touch screen.
     * @type {boolean}
     */
    zoomOnTouch: true,

    /**
     * Enable to zoom the image by wheeling mouse.
     * @type {boolean}
     */
    zoomOnWheel: true,

    /**
     * Enable to slide to the next or previous image by swiping on the touch screen.
     * @type {boolean}
     */
    slideOnTouch: true,

    /**
     * Indicate if toggle the image size between its natural size
     * and initial size when double click on the image or not.
     * @type {boolean}
     */
    toggleOnDblclick: true,

    /**
     * Show the tooltip with image ratio (percentage) when zoom in or zoom out.
     * @type {boolean}
     */
    tooltip: true,

    /**
     * Enable CSS3 Transition for some special elements.
     * @type {boolean}
     */
    transition: true,

    /**
     * Define the CSS `z-index` value of viewer in modal mode.
     * @type {number}
     */
    zIndex: 2015,

    /**
     * Define the CSS `z-index` value of viewer in inline mode.
     * @type {number}
     */
    zIndexInline: 0,

    /**
     * Define the ratio when zoom the image by wheeling mouse.
     * @type {number}
     */
    zoomRatio: 0.1,

    /**
     * Define the min ratio of the image when zoom out.
     * @type {number}
     */
    minZoomRatio: 0.01,

    /**
     * Define the max ratio of the image when zoom in.
     * @type {number}
     */
    maxZoomRatio: 100,

    /**
     * Define where to get the original image URL for viewing.
     * @type {string | Function}
     */
    url: 'src',

    /**
     * Event shortcuts.
     * @type {Function}
     */
    ready: null,
    show: null,
    shown: null,
    hide: null,
    hidden: null,
    view: null,
    viewed: null,
    move: null,
    moved: null,
    rotate: null,
    rotated: null,
    scale: null,
    scaled: null,
    zoom: null,
    zoomed: null,
    play: null,
    stop: null
  };

  var TEMPLATE = '<div class="viewer-container" tabindex="-1" touch-action="none">' + '<div class="viewer-canvas"></div>' + '<div class="viewer-footer">' + '<div class="viewer-title"></div>' + '<div class="viewer-toolbar"></div>' + '<div class="viewer-navbar">' + '<ul class="viewer-list" role="navigation"></ul>' + '</div>' + '</div>' + '<div class="viewer-tooltip" role="alert" aria-hidden="true"></div>' + '<div class="viewer-button" data-viewer-action="mix" role="button"></div>' + '<div class="viewer-player"></div>' + '</div>';

  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
  var NAMESPACE = 'viewer'; // Actions

  var ACTION_MOVE = 'move';
  var ACTION_SWITCH = 'switch';
  var ACTION_ZOOM = 'zoom'; // Classes

  var CLASS_ACTIVE = "".concat(NAMESPACE, "-active");
  var CLASS_CLOSE = "".concat(NAMESPACE, "-close");
  var CLASS_FADE = "".concat(NAMESPACE, "-fade");
  var CLASS_FIXED = "".concat(NAMESPACE, "-fixed");
  var CLASS_FULLSCREEN = "".concat(NAMESPACE, "-fullscreen");
  var CLASS_FULLSCREEN_EXIT = "".concat(NAMESPACE, "-fullscreen-exit");
  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
  var CLASS_HIDE_MD_DOWN = "".concat(NAMESPACE, "-hide-md-down");
  var CLASS_HIDE_SM_DOWN = "".concat(NAMESPACE, "-hide-sm-down");
  var CLASS_HIDE_XS_DOWN = "".concat(NAMESPACE, "-hide-xs-down");
  var CLASS_IN = "".concat(NAMESPACE, "-in");
  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
  var CLASS_LOADING = "".concat(NAMESPACE, "-loading");
  var CLASS_MOVE = "".concat(NAMESPACE, "-move");
  var CLASS_OPEN = "".concat(NAMESPACE, "-open");
  var CLASS_SHOW = "".concat(NAMESPACE, "-show");
  var CLASS_TRANSITION = "".concat(NAMESPACE, "-transition"); // Native events

  var EVENT_CLICK = 'click';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_DRAG_START = 'dragstart';
  var EVENT_FOCUSIN = 'focusin';
  var EVENT_KEY_DOWN = 'keydown';
  var EVENT_LOAD = 'load';
  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
  var EVENT_RESIZE = 'resize';
  var EVENT_TRANSITION_END = 'transitionend';
  var EVENT_WHEEL = 'wheel'; // Custom events

  var EVENT_READY = 'ready';
  var EVENT_SHOW = 'show';
  var EVENT_SHOWN = 'shown';
  var EVENT_HIDE = 'hide';
  var EVENT_HIDDEN = 'hidden';
  var EVENT_VIEW = 'view';
  var EVENT_VIEWED = 'viewed';
  var EVENT_MOVE = 'move';
  var EVENT_MOVED = 'moved';
  var EVENT_ROTATE = 'rotate';
  var EVENT_ROTATED = 'rotated';
  var EVENT_SCALE = 'scale';
  var EVENT_SCALED = 'scaled';
  var EVENT_ZOOM = 'zoom';
  var EVENT_ZOOMED = 'zoomed';
  var EVENT_PLAY = 'play';
  var EVENT_STOP = 'stop'; // Data keys

  var DATA_ACTION = "".concat(NAMESPACE, "Action"); // RegExps

  var REGEXP_SPACES = /\s\s*/; // Misc

  var BUTTONS = ['zoom-in', 'zoom-out', 'one-to-one', 'reset', 'prev', 'play', 'next', 'rotate-left', 'rotate-right', 'flip-horizontal', 'flip-vertical'];

  /**
   * Check if the given value is a string.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a string, else `false`.
   */

  function isString(value) {
    return typeof value === 'string';
  }
  /**
   * Check if the given value is not a number.
   */

  var isNaN = Number.isNaN || WINDOW.isNaN;
  /**
   * Check if the given value is a number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  /**
   * Check if the given value is undefined.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
   */

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Check if the given value is an object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
   */

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check if the given value is a plain object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
   */

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    try {
      var _constructor = value.constructor;
      var prototype = _constructor.prototype;
      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
      return false;
    }
  }
  /**
   * Check if the given value is a function.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
   */

  function isFunction(value) {
    return typeof value === 'function';
  }
  /**
   * Iterate the given data.
   * @param {*} data - The data to iterate.
   * @param {Function} callback - The process function for each element.
   * @returns {*} The original data.
   */

  function forEach(data, callback) {
    if (data && isFunction(callback)) {
      if (Array.isArray(data) || isNumber(data.length)
      /* array-like */
      ) {
          var length = data.length;
          var i;

          for (i = 0; i < length; i += 1) {
            if (callback.call(data, data[i], i, data) === false) {
              break;
            }
          }
        } else if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
          callback.call(data, data[key], key, data);
        });
      }
    }

    return data;
  }
  /**
   * Extend the given object.
   * @param {*} obj - The object to be extended.
   * @param {*} args - The rest objects which will be merged to the first object.
   * @returns {Object} The extended object.
   */

  var assign = Object.assign || function assign(obj) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (isObject(obj) && args.length > 0) {
      args.forEach(function (arg) {
        if (isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            obj[key] = arg[key];
          });
        }
      });
    }

    return obj;
  };
  var REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/;
  /**
   * Apply styles to the given element.
   * @param {Element} element - The target element.
   * @param {Object} styles - The styles for applying.
   */

  function setStyle(element, styles) {
    var style = element.style;
    forEach(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value += 'px';
      }

      style[property] = value;
    });
  }
  /**
   * Escape a string for using in HTML.
   * @param {String} value - The string to escape.
   * @returns {String} Returns the escaped string.
   */

  function escapeHTMLEntities(value) {
    return isString(value) ? value.replace(/&(?!amp;|quot;|#39;|lt;|gt;)/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
  }
  /**
   * Check if the given element has a special class.
   * @param {Element} element - The element to check.
   * @param {string} value - The class to search.
   * @returns {boolean} Returns `true` if the special class was found.
   */

  function hasClass(element, value) {
    if (!element || !value) {
      return false;
    }

    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
  }
  /**
   * Add classes to the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be added.
   */

  function addClass(element, value) {
    if (!element || !value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        addClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.add(value);
      return;
    }

    var className = element.className.trim();

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = "".concat(className, " ").concat(value);
    }
  }
  /**
   * Remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be removed.
   */

  function removeClass(element, value) {
    if (!element || !value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        removeClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.remove(value);
      return;
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }
  /**
   * Add or remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be toggled.
   * @param {boolean} added - Add only.
   */

  function toggleClass(element, value, added) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        toggleClass(elem, value, added);
      });
      return;
    } // IE10-11 doesn't support the second parameter of `classList.toggle`


    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }
  var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
  /**
   * Transform the given string from camelCase to kebab-case
   * @param {string} value - The value to transform.
   * @returns {string} The transformed value.
   */

  function hyphenate(value) {
    return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
  }
  /**
   * Get data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to get.
   * @returns {string} The data value.
   */

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    }

    if (element.dataset) {
      return element.dataset[name];
    }

    return element.getAttribute("data-".concat(hyphenate(name)));
  }
  /**
   * Set data to the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to set.
   * @param {string} data - The data value.
   */

  function setData(element, name, data) {
    if (isObject(data)) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute("data-".concat(hyphenate(name)), data);
    }
  }

  var onceSupported = function () {
    var supported = false;

    if (IS_BROWSER) {
      var once = false;

      var listener = function listener() {};

      var options = Object.defineProperty({}, 'once', {
        get: function get() {
          supported = true;
          return once;
        },

        /**
         * This setter can fix a `TypeError` in strict mode
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
         * @param {boolean} value - The value to set
         */
        set: function set(value) {
          once = value;
        }
      });
      WINDOW.addEventListener('test', listener, options);
      WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
  }();
  /**
   * Remove event listener from the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */


  function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (!onceSupported) {
        var listeners = element.listeners;

        if (listeners && listeners[event] && listeners[event][listener]) {
          handler = listeners[event][listener];
          delete listeners[event][listener];

          if (Object.keys(listeners[event]).length === 0) {
            delete listeners[event];
          }

          if (Object.keys(listeners).length === 0) {
            delete element.listeners;
          }
        }
      }

      element.removeEventListener(event, handler, options);
    });
  }
  /**
   * Add event listener to the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */

  function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (options.once && !onceSupported) {
        var _element$listeners = element.listeners,
            listeners = _element$listeners === void 0 ? {} : _element$listeners;

        _handler = function handler() {
          delete listeners[event][listener];
          element.removeEventListener(event, _handler, options);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          listener.apply(element, args);
        };

        if (!listeners[event]) {
          listeners[event] = {};
        }

        if (listeners[event][listener]) {
          element.removeEventListener(event, listeners[event][listener], options);
        }

        listeners[event][listener] = _handler;
        element.listeners = listeners;
      }

      element.addEventListener(event, _handler, options);
    });
  }
  /**
   * Dispatch event on the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Object} data - The additional event data.
   * @param {Object} options - The additional event options.
   * @returns {boolean} Indicate if the event is default prevented or not.
   */

  function dispatchEvent(element, type, data, options) {
    var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

    if (isFunction(Event) && isFunction(CustomEvent)) {
      event = new CustomEvent(type, _objectSpread2({
        bubbles: true,
        cancelable: true,
        detail: data
      }, options));
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
  }
  /**
   * Get the offset base on the document.
   * @param {Element} element - The target element.
   * @returns {Object} The offset data.
   */

  function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
  }
  /**
   * Get transforms base on the given object.
   * @param {Object} obj - The target object.
   * @returns {string} A string contains transform values.
   */

  function getTransforms(_ref) {
    var rotate = _ref.rotate,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        translateX = _ref.translateX,
        translateY = _ref.translateY;
    var values = [];

    if (isNumber(translateX) && translateX !== 0) {
      values.push("translateX(".concat(translateX, "px)"));
    }

    if (isNumber(translateY) && translateY !== 0) {
      values.push("translateY(".concat(translateY, "px)"));
    } // Rotate should come first before scale to match orientation transform


    if (isNumber(rotate) && rotate !== 0) {
      values.push("rotate(".concat(rotate, "deg)"));
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      values.push("scaleX(".concat(scaleX, ")"));
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      values.push("scaleY(".concat(scaleY, ")"));
    }

    var transform = values.length ? values.join(' ') : 'none';
    return {
      WebkitTransform: transform,
      msTransform: transform,
      transform: transform
    };
  }
  /**
   * Get an image name from an image url.
   * @param {string} url - The target url.
   * @example
   * // picture.jpg
   * getImageNameFromURL('https://domain.com/path/to/picture.jpg?size=1280×960')
   * @returns {string} A string contains the image name.
   */

  function getImageNameFromURL(url) {
    return isString(url) ? decodeURIComponent(url.replace(/^.*\//, '').replace(/[?&#].*$/, '')) : '';
  }
  var IS_SAFARI = WINDOW.navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(WINDOW.navigator.userAgent);
  /**
   * Get an image's natural sizes.
   * @param {string} image - The target image.
   * @param {Object} options - The viewer options.
   * @param {Function} callback - The callback function.
   * @returns {HTMLImageElement} The new image.
   */

  function getImageNaturalSizes(image, options, callback) {
    var newImage = document.createElement('img'); // Modern browsers (except Safari)

    if (image.naturalWidth && !IS_SAFARI) {
      callback(image.naturalWidth, image.naturalHeight);
      return newImage;
    }

    var body = document.body || document.documentElement;

    newImage.onload = function () {
      callback(newImage.width, newImage.height);

      if (!IS_SAFARI) {
        body.removeChild(newImage);
      }
    };

    forEach(options.inheritedAttributes, function (name) {
      var value = image.getAttribute(name);

      if (value !== null) {
        newImage.setAttribute(name, value);
      }
    });
    newImage.src = image.src; // iOS Safari will convert the image automatically
    // with its orientation once append it into DOM

    if (!IS_SAFARI) {
      newImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
      body.appendChild(newImage);
    }

    return newImage;
  }
  /**
   * Get the related class name of a responsive type number.
   * @param {string} type - The responsive type.
   * @returns {string} The related class name.
   */

  function getResponsiveClass(type) {
    switch (type) {
      case 2:
        return CLASS_HIDE_XS_DOWN;

      case 3:
        return CLASS_HIDE_SM_DOWN;

      case 4:
        return CLASS_HIDE_MD_DOWN;

      default:
        return '';
    }
  }
  /**
   * Get the max ratio of a group of pointers.
   * @param {string} pointers - The target pointers.
   * @returns {number} The result ratio.
   */

  function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);

    var ratios = [];
    forEach(pointers, function (pointer, pointerId) {
      delete pointers2[pointerId];
      forEach(pointers2, function (pointer2) {
        var x1 = Math.abs(pointer.startX - pointer2.startX);
        var y1 = Math.abs(pointer.startY - pointer2.startY);
        var x2 = Math.abs(pointer.endX - pointer2.endX);
        var y2 = Math.abs(pointer.endY - pointer2.endY);
        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
        var ratio = (z2 - z1) / z1;
        ratios.push(ratio);
      });
    });
    ratios.sort(function (a, b) {
      return Math.abs(a) < Math.abs(b);
    });
    return ratios[0];
  }
  /**
   * Get a pointer from an event object.
   * @param {Object} event - The target event object.
   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
   * @returns {Object} The result pointer contains start and/or end point coordinates.
   */

  function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };
    return endOnly ? end : _objectSpread2({
      timeStamp: Date.now(),
      startX: pageX,
      startY: pageY
    }, end);
  }
  /**
   * Get the center point coordinate of a group of pointers.
   * @param {Object} pointers - The target pointers.
   * @returns {Object} The center point coordinate.
   */

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function (_ref3) {
      var startX = _ref3.startX,
          startY = _ref3.startY;
      pageX += startX;
      pageY += startY;
      count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  var render = {
    render: function render() {
      this.initContainer();
      this.initViewer();
      this.initList();
      this.renderViewer();
    },
    initBody: function initBody() {
      var ownerDocument = this.element.ownerDocument;
      var body = ownerDocument.body || ownerDocument.documentElement;
      this.body = body;
      this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
      this.initialBodyPaddingRight = body.style.paddingRight;
      this.initialBodyComputedPaddingRight = window.getComputedStyle(body).paddingRight;
    },
    initContainer: function initContainer() {
      this.containerData = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    initViewer: function initViewer() {
      var options = this.options,
          parent = this.parent;
      var viewerData;

      if (options.inline) {
        viewerData = {
          width: Math.max(parent.offsetWidth, options.minWidth),
          height: Math.max(parent.offsetHeight, options.minHeight)
        };
        this.parentData = viewerData;
      }

      if (this.fulled || !viewerData) {
        viewerData = this.containerData;
      }

      this.viewerData = assign({}, viewerData);
    },
    renderViewer: function renderViewer() {
      if (this.options.inline && !this.fulled) {
        setStyle(this.viewer, this.viewerData);
      }
    },
    initList: function initList() {
      var _this = this;

      var element = this.element,
          options = this.options,
          list = this.list;
      var items = []; // initList may be called in this.update, so should keep idempotent

      list.innerHTML = '';
      forEach(this.images, function (image, index) {
        var src = image.src;
        var alt = image.alt || getImageNameFromURL(src);

        var url = _this.getImageURL(image);

        if (src || url) {
          var item = document.createElement('li');
          var img = document.createElement('img');
          forEach(options.inheritedAttributes, function (name) {
            var value = image.getAttribute(name);

            if (value !== null) {
              img.setAttribute(name, value);
            }
          });
          img.src = src || url;
          img.alt = alt;
          img.setAttribute('data-original-url', url || src);
          item.setAttribute('data-index', index);
          item.setAttribute('data-viewer-action', 'view');
          item.setAttribute('role', 'button');

          if (options.keyboard) {
            item.setAttribute('tabindex', 0);
          }

          item.appendChild(img);
          list.appendChild(item);
          items.push(item);
        }
      });
      this.items = items;
      forEach(items, function (item) {
        var image = item.firstElementChild;
        setData(image, 'filled', true);

        if (options.loading) {
          addClass(item, CLASS_LOADING);
        }

        addListener(image, EVENT_LOAD, function (event) {
          if (options.loading) {
            removeClass(item, CLASS_LOADING);
          }

          _this.loadImage(event);
        }, {
          once: true
        });
      });

      if (options.transition) {
        addListener(element, EVENT_VIEWED, function () {
          addClass(list, CLASS_TRANSITION);
        }, {
          once: true
        });
      }
    },
    renderList: function renderList(index) {
      var i = index || this.index;
      var width = this.items[i].offsetWidth || 30;
      var outerWidth = width + 1; // 1 pixel of `margin-left` width
      // Place the active item in the center of the screen

      setStyle(this.list, assign({
        width: outerWidth * this.length
      }, getTransforms({
        translateX: (this.viewerData.width - width) / 2 - outerWidth * i
      })));
    },
    resetList: function resetList() {
      var list = this.list;
      list.innerHTML = '';
      removeClass(list, CLASS_TRANSITION);
      setStyle(list, getTransforms({
        translateX: 0
      }));
    },
    initImage: function initImage(done) {
      var _this2 = this;

      var options = this.options,
          image = this.image,
          viewerData = this.viewerData;
      var footerHeight = this.footer.offsetHeight;
      var viewerWidth = viewerData.width;
      var viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
      var oldImageData = this.imageData || {};
      var sizingImage;
      this.imageInitializing = {
        abort: function abort() {
          sizingImage.onload = null;
        }
      };
      sizingImage = getImageNaturalSizes(image, options, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = viewerWidth;
        var height = viewerHeight;
        _this2.imageInitializing = false;

        if (viewerHeight * aspectRatio > viewerWidth) {
          height = viewerWidth / aspectRatio;
        } else {
          width = viewerHeight * aspectRatio;
        }

        width = Math.min(width * 0.9, naturalWidth);
        height = Math.min(height * 0.9, naturalHeight);
        var left = (viewerWidth - width) / 2;
        var top = (viewerHeight - height) / 2;
        var imageData = {
          left: left,
          top: top,
          x: left,
          y: top,
          width: width,
          height: height,
          ratio: width / naturalWidth,
          aspectRatio: aspectRatio,
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight
        };
        var initialImageData = assign({}, imageData);

        if (options.rotatable) {
          imageData.rotate = oldImageData.rotate || 0;
          initialImageData.rotate = 0;
        }

        if (options.scalable) {
          imageData.scaleX = oldImageData.scaleX || 1;
          imageData.scaleY = oldImageData.scaleY || 1;
          initialImageData.scaleX = 1;
          initialImageData.scaleY = 1;
        }

        _this2.imageData = imageData;
        _this2.initialImageData = initialImageData;

        if (done) {
          done();
        }
      });
    },
    renderImage: function renderImage(done) {
      var _this3 = this;

      var image = this.image,
          imageData = this.imageData;
      setStyle(image, assign({
        width: imageData.width,
        height: imageData.height,
        // XXX: Not to use translateX/Y to avoid image shaking when zooming
        marginLeft: imageData.x,
        marginTop: imageData.y
      }, getTransforms(imageData)));

      if (done) {
        if ((this.viewing || this.moving || this.rotating || this.scaling || this.zooming) && this.options.transition && hasClass(image, CLASS_TRANSITION)) {
          var onTransitionEnd = function onTransitionEnd() {
            _this3.imageRendering = false;
            done();
          };

          this.imageRendering = {
            abort: function abort() {
              removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
            }
          };
          addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
            once: true
          });
        } else {
          done();
        }
      }
    },
    resetImage: function resetImage() {
      // this.image only defined after viewed
      if (this.viewing || this.viewed) {
        var image = this.image;

        if (this.viewing) {
          this.viewing.abort();
        }

        image.parentNode.removeChild(image);
        this.image = null;
      }
    }
  };

  var events = {
    bind: function bind() {
      var options = this.options,
          viewer = this.viewer,
          canvas = this.canvas;
      var document = this.element.ownerDocument;
      addListener(viewer, EVENT_CLICK, this.onClick = this.click.bind(this));
      addListener(viewer, EVENT_DRAG_START, this.onDragStart = this.dragstart.bind(this));
      addListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown = this.pointerdown.bind(this));
      addListener(document, EVENT_POINTER_MOVE, this.onPointerMove = this.pointermove.bind(this));
      addListener(document, EVENT_POINTER_UP, this.onPointerUp = this.pointerup.bind(this));
      addListener(document, EVENT_KEY_DOWN, this.onKeyDown = this.keydown.bind(this));
      addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));

      if (options.zoomable && options.zoomOnWheel) {
        addListener(viewer, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
          passive: false,
          capture: true
        });
      }

      if (options.toggleOnDblclick) {
        addListener(canvas, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
      }
    },
    unbind: function unbind() {
      var options = this.options,
          viewer = this.viewer,
          canvas = this.canvas;
      var document = this.element.ownerDocument;
      removeListener(viewer, EVENT_CLICK, this.onClick);
      removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
      removeListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown);
      removeListener(document, EVENT_POINTER_MOVE, this.onPointerMove);
      removeListener(document, EVENT_POINTER_UP, this.onPointerUp);
      removeListener(document, EVENT_KEY_DOWN, this.onKeyDown);
      removeListener(window, EVENT_RESIZE, this.onResize);

      if (options.zoomable && options.zoomOnWheel) {
        removeListener(viewer, EVENT_WHEEL, this.onWheel, {
          passive: false,
          capture: true
        });
      }

      if (options.toggleOnDblclick) {
        removeListener(canvas, EVENT_DBLCLICK, this.onDblclick);
      }
    }
  };

  var handlers = {
    click: function click(event) {
      var options = this.options,
          imageData = this.imageData;
      var target = event.target;
      var action = getData(target, DATA_ACTION);

      if (!action && target.localName === 'img' && target.parentElement.localName === 'li') {
        target = target.parentElement;
        action = getData(target, DATA_ACTION);
      } // Cancel the emulated click when the native click event was triggered.


      if (IS_TOUCH_DEVICE && event.isTrusted && target === this.canvas) {
        clearTimeout(this.clickCanvasTimeout);
      }

      switch (action) {
        case 'mix':
          if (this.played) {
            this.stop();
          } else if (options.inline) {
            if (this.fulled) {
              this.exit();
            } else {
              this.full();
            }
          } else {
            this.hide();
          }

          break;

        case 'hide':
          this.hide();
          break;

        case 'view':
          this.view(getData(target, 'index'));
          break;

        case 'zoom-in':
          this.zoom(0.1, true);
          break;

        case 'zoom-out':
          this.zoom(-0.1, true);
          break;

        case 'one-to-one':
          this.toggle();
          break;

        case 'reset':
          this.reset();
          break;

        case 'prev':
          this.prev(options.loop);
          break;

        case 'play':
          this.play(options.fullscreen);
          break;

        case 'next':
          this.next(options.loop);
          break;

        case 'rotate-left':
          this.rotate(-90);
          break;

        case 'rotate-right':
          this.rotate(90);
          break;

        case 'flip-horizontal':
          this.scaleX(-imageData.scaleX || -1);
          break;

        case 'flip-vertical':
          this.scaleY(-imageData.scaleY || -1);
          break;

        default:
          if (this.played) {
            this.stop();
          }

      }
    },
    dblclick: function dblclick(event) {
      event.preventDefault();

      if (this.viewed && event.target === this.image) {
        // Cancel the emulated double click when the native dblclick event was triggered.
        if (IS_TOUCH_DEVICE && event.isTrusted) {
          clearTimeout(this.doubleClickImageTimeout);
        }

        this.toggle();
      }
    },
    load: function load() {
      var _this = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = false;
      }

      var element = this.element,
          options = this.options,
          image = this.image,
          index = this.index,
          viewerData = this.viewerData;
      removeClass(image, CLASS_INVISIBLE);

      if (options.loading) {
        removeClass(this.canvas, CLASS_LOADING);
      }

      image.style.cssText = 'height:0;' + "margin-left:".concat(viewerData.width / 2, "px;") + "margin-top:".concat(viewerData.height / 2, "px;") + 'max-width:none!important;' + 'position:absolute;' + 'width:0;';
      this.initImage(function () {
        toggleClass(image, CLASS_MOVE, options.movable);
        toggleClass(image, CLASS_TRANSITION, options.transition);

        _this.renderImage(function () {
          _this.viewed = true;
          _this.viewing = false;

          if (isFunction(options.viewed)) {
            addListener(element, EVENT_VIEWED, options.viewed, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_VIEWED, {
            originalImage: _this.images[index],
            index: index,
            image: image
          }, {
            cancelable: false
          });
        });
      });
    },
    loadImage: function loadImage(event) {
      var image = event.target;
      var parent = image.parentNode;
      var parentWidth = parent.offsetWidth || 30;
      var parentHeight = parent.offsetHeight || 50;
      var filled = !!getData(image, 'filled');
      getImageNaturalSizes(image, this.options, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = parentWidth;
        var height = parentHeight;

        if (parentHeight * aspectRatio > parentWidth) {
          if (filled) {
            width = parentHeight * aspectRatio;
          } else {
            height = parentWidth / aspectRatio;
          }
        } else if (filled) {
          height = parentWidth / aspectRatio;
        } else {
          width = parentHeight * aspectRatio;
        }

        setStyle(image, assign({
          width: width,
          height: height
        }, getTransforms({
          translateX: (parentWidth - width) / 2,
          translateY: (parentHeight - height) / 2
        })));
      });
    },
    keydown: function keydown(event) {
      var options = this.options;

      if (!options.keyboard) {
        return;
      }

      var keyCode = event.keyCode || event.which || event.charCode;

      switch (keyCode) {
        // Enter
        case 13:
          if (this.viewer.contains(event.target)) {
            this.click(event);
          }

          break;
      }

      if (!this.fulled) {
        return;
      }

      switch (keyCode) {
        // Escape
        case 27:
          if (this.played) {
            this.stop();
          } else if (options.inline) {
            if (this.fulled) {
              this.exit();
            }
          } else {
            this.hide();
          }

          break;
        // Space

        case 32:
          if (this.played) {
            this.stop();
          }

          break;
        // ArrowLeft

        case 37:
          this.prev(options.loop);
          break;
        // ArrowUp

        case 38:
          // Prevent scroll on Firefox
          event.preventDefault(); // Zoom in

          this.zoom(options.zoomRatio, true);
          break;
        // ArrowRight

        case 39:
          this.next(options.loop);
          break;
        // ArrowDown

        case 40:
          // Prevent scroll on Firefox
          event.preventDefault(); // Zoom out

          this.zoom(-options.zoomRatio, true);
          break;
        // Ctrl + 0

        case 48: // Fall through
        // Ctrl + 1
        // eslint-disable-next-line no-fallthrough

        case 49:
          if (event.ctrlKey) {
            event.preventDefault();
            this.toggle();
          }

          break;
      }
    },
    dragstart: function dragstart(event) {
      if (event.target.localName === 'img') {
        event.preventDefault();
      }
    },
    pointerdown: function pointerdown(event) {
      var options = this.options,
          pointers = this.pointers;
      var buttons = event.buttons,
          button = event.button;

      if (!this.viewed || this.showing || this.viewing || this.hiding // Handle mouse event and pointer event and ignore touch event
      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
      || event.ctrlKey)) {
        return;
      } // Prevent default behaviours as page zooming in touch devices.


      event.preventDefault();

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        pointers[event.pointerId || 0] = getPointer(event);
      }

      var action = options.movable ? ACTION_MOVE : false;

      if (options.zoomOnTouch && options.zoomable && Object.keys(pointers).length > 1) {
        action = ACTION_ZOOM;
      } else if (options.slideOnTouch && (event.pointerType === 'touch' || event.type === 'touchstart') && this.isSwitchable()) {
        action = ACTION_SWITCH;
      }

      if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
        removeClass(this.image, CLASS_TRANSITION);
      }

      this.action = action;
    },
    pointermove: function pointermove(event) {
      var pointers = this.pointers,
          action = this.action;

      if (!this.viewed || !action) {
        return;
      }

      event.preventDefault();

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
        });
      } else {
        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
      }

      this.change(event);
    },
    pointerup: function pointerup(event) {
      var _this2 = this;

      var options = this.options,
          action = this.action,
          pointers = this.pointers;
      var pointer;

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          pointer = pointers[touch.identifier];
          delete pointers[touch.identifier];
        });
      } else {
        pointer = pointers[event.pointerId || 0];
        delete pointers[event.pointerId || 0];
      }

      if (!action) {
        return;
      }

      event.preventDefault();

      if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
        addClass(this.image, CLASS_TRANSITION);
      }

      this.action = false; // Emulate click and double click in touch devices to support backdrop and image zooming (#210).

      if (IS_TOUCH_DEVICE && action !== ACTION_ZOOM && pointer && Date.now() - pointer.timeStamp < 500) {
        clearTimeout(this.clickCanvasTimeout);
        clearTimeout(this.doubleClickImageTimeout);

        if (options.toggleOnDblclick && this.viewed && event.target === this.image) {
          if (this.imageClicked) {
            this.imageClicked = false; // This timeout will be cleared later when a native dblclick event is triggering

            this.doubleClickImageTimeout = setTimeout(function () {
              dispatchEvent(_this2.image, EVENT_DBLCLICK);
            }, 50);
          } else {
            this.imageClicked = true; // The default timing of a double click in Windows is 500 ms

            this.doubleClickImageTimeout = setTimeout(function () {
              _this2.imageClicked = false;
            }, 500);
          }
        } else {
          this.imageClicked = false;

          if (options.backdrop && options.backdrop !== 'static' && event.target === this.canvas) {
            // This timeout will be cleared later when a native click event is triggering
            this.clickCanvasTimeout = setTimeout(function () {
              dispatchEvent(_this2.canvas, EVENT_CLICK);
            }, 50);
          }
        }
      }
    },
    resize: function resize() {
      var _this3 = this;

      if (!this.isShown || this.hiding) {
        return;
      }

      if (this.fulled) {
        this.close();
        this.initBody();
        this.open();
      }

      this.initContainer();
      this.initViewer();
      this.renderViewer();
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this3.renderImage();
        });
      }

      if (this.played) {
        if (this.options.fullscreen && this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
          this.stop();
          return;
        }

        forEach(this.player.getElementsByTagName('img'), function (image) {
          addListener(image, EVENT_LOAD, _this3.loadImage.bind(_this3), {
            once: true
          });
          dispatchEvent(image, EVENT_LOAD);
        });
      }
    },
    wheel: function wheel(event) {
      var _this4 = this;

      if (!this.viewed) {
        return;
      }

      event.preventDefault(); // Limit wheel speed to prevent zoom too fast

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;
      setTimeout(function () {
        _this4.wheeling = false;
      }, 50);
      var ratio = Number(this.options.zoomRatio) || 0.1;
      var delta = 1;

      if (event.deltaY) {
        delta = event.deltaY > 0 ? 1 : -1;
      } else if (event.wheelDelta) {
        delta = -event.wheelDelta / 120;
      } else if (event.detail) {
        delta = event.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, true, event);
    }
  };

  var methods = {
    /** Show the viewer (only available in modal mode)
     * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
     * @returns {Viewer} this
     */
    show: function show() {
      var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var element = this.element,
          options = this.options;

      if (options.inline || this.showing || this.isShown || this.showing) {
        return this;
      }

      if (!this.ready) {
        this.build();

        if (this.ready) {
          this.show(immediate);
        }

        return this;
      }

      if (isFunction(options.show)) {
        addListener(element, EVENT_SHOW, options.show, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_SHOW) === false || !this.ready) {
        return this;
      }

      if (this.hiding) {
        this.transitioning.abort();
      }

      this.showing = true;
      this.open();
      var viewer = this.viewer;
      removeClass(viewer, CLASS_HIDE);
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-labelledby', this.title.id);
      viewer.setAttribute('aria-modal', true);
      viewer.removeAttribute('aria-hidden');

      if (options.transition && !immediate) {
        var shown = this.shown.bind(this);
        this.transitioning = {
          abort: function abort() {
            removeListener(viewer, EVENT_TRANSITION_END, shown);
            removeClass(viewer, CLASS_IN);
          }
        };
        addClass(viewer, CLASS_TRANSITION); // Force reflow to enable CSS3 transition

        viewer.initialOffsetWidth = viewer.offsetWidth;
        addListener(viewer, EVENT_TRANSITION_END, shown, {
          once: true
        });
        addClass(viewer, CLASS_IN);
      } else {
        addClass(viewer, CLASS_IN);
        this.shown();
      }

      return this;
    },

    /**
     * Hide the viewer (only available in modal mode)
     * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
     * @returns {Viewer} this
     */
    hide: function hide() {
      var _this = this;

      var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var element = this.element,
          options = this.options;

      if (options.inline || this.hiding || !(this.isShown || this.showing)) {
        return this;
      }

      if (isFunction(options.hide)) {
        addListener(element, EVENT_HIDE, options.hide, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_HIDE) === false) {
        return this;
      }

      if (this.showing) {
        this.transitioning.abort();
      }

      this.hiding = true;

      if (this.played) {
        this.stop();
      } else if (this.viewing) {
        this.viewing.abort();
      }

      var viewer = this.viewer,
          image = this.image;

      var hideImmediately = function hideImmediately() {
        removeClass(viewer, CLASS_IN);

        _this.hidden();
      };

      if (options.transition && !immediate) {
        var onViewerTransitionEnd = function onViewerTransitionEnd(event) {
          // Ignore all propagating `transitionend` events (#275).
          if (event && event.target === viewer) {
            removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);

            _this.hidden();
          }
        };

        var onImageTransitionEnd = function onImageTransitionEnd() {
          // In case of show the viewer by `viewer.show(true)` previously (#407).
          if (hasClass(viewer, CLASS_TRANSITION)) {
            addListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
            removeClass(viewer, CLASS_IN);
          } else {
            hideImmediately();
          }
        };

        this.transitioning = {
          abort: function abort() {
            if (_this.viewed && hasClass(image, CLASS_TRANSITION)) {
              removeListener(image, EVENT_TRANSITION_END, onImageTransitionEnd);
            } else if (hasClass(viewer, CLASS_TRANSITION)) {
              removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
            }
          }
        }; // In case of hiding the viewer when holding on the image (#255),
        // note that the `CLASS_TRANSITION` class will be removed on pointer down.

        if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
          addListener(image, EVENT_TRANSITION_END, onImageTransitionEnd, {
            once: true
          });
          this.zoomTo(0, false, false, true);
        } else {
          onImageTransitionEnd();
        }
      } else {
        hideImmediately();
      }

      return this;
    },

    /**
     * View one of the images with image's index
     * @param {number} index - The index of the image to view.
     * @returns {Viewer} this
     */
    view: function view() {
      var _this2 = this;

      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.initialViewIndex;
      index = Number(index) || 0;

      if (this.hiding || this.played || index < 0 || index >= this.length || this.viewed && index === this.index) {
        return this;
      }

      if (!this.isShown) {
        this.index = index;
        return this.show();
      }

      if (this.viewing) {
        this.viewing.abort();
      }

      var element = this.element,
          options = this.options,
          title = this.title,
          canvas = this.canvas;
      var item = this.items[index];
      var img = item.querySelector('img');
      var url = getData(img, 'originalUrl');
      var alt = img.getAttribute('alt');
      var image = document.createElement('img');
      forEach(options.inheritedAttributes, function (name) {
        var value = img.getAttribute(name);

        if (value !== null) {
          image.setAttribute(name, value);
        }
      });
      image.src = url;
      image.alt = alt;

      if (isFunction(options.view)) {
        addListener(element, EVENT_VIEW, options.view, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_VIEW, {
        originalImage: this.images[index],
        index: index,
        image: image
      }) === false || !this.isShown || this.hiding || this.played) {
        return this;
      }

      var activeItem = this.items[this.index];
      removeClass(activeItem, CLASS_ACTIVE);
      activeItem.removeAttribute('aria-selected');
      addClass(item, CLASS_ACTIVE);
      item.setAttribute('aria-selected', true);

      if (options.focus) {
        item.focus();
      }

      this.image = image;
      this.viewed = false;
      this.index = index;
      this.imageData = {};
      addClass(image, CLASS_INVISIBLE);

      if (options.loading) {
        addClass(canvas, CLASS_LOADING);
      }

      canvas.innerHTML = '';
      canvas.appendChild(image); // Center current item

      this.renderList(); // Clear title

      title.innerHTML = ''; // Generate title after viewed

      var onViewed = function onViewed() {
        var imageData = _this2.imageData;
        var render = Array.isArray(options.title) ? options.title[1] : options.title;
        title.innerHTML = escapeHTMLEntities(isFunction(render) ? render.call(_this2, image, imageData) : "".concat(alt, " (").concat(imageData.naturalWidth, " \xD7 ").concat(imageData.naturalHeight, ")"));
      };

      var onLoad;
      addListener(element, EVENT_VIEWED, onViewed, {
        once: true
      });
      this.viewing = {
        abort: function abort() {
          removeListener(element, EVENT_VIEWED, onViewed);

          if (image.complete) {
            if (_this2.imageRendering) {
              _this2.imageRendering.abort();
            } else if (_this2.imageInitializing) {
              _this2.imageInitializing.abort();
            }
          } else {
            // Cancel download to save bandwidth.
            image.src = '';
            removeListener(image, EVENT_LOAD, onLoad);

            if (_this2.timeout) {
              clearTimeout(_this2.timeout);
            }
          }
        }
      };

      if (image.complete) {
        this.load();
      } else {
        addListener(image, EVENT_LOAD, onLoad = this.load.bind(this), {
          once: true
        });

        if (this.timeout) {
          clearTimeout(this.timeout);
        } // Make the image visible if it fails to load within 1s


        this.timeout = setTimeout(function () {
          removeClass(image, CLASS_INVISIBLE);
          _this2.timeout = false;
        }, 1000);
      }

      return this;
    },

    /**
     * View the previous image
     * @param {boolean} [loop=false] - Indicate if view the last one
     * when it is the first one at present.
     * @returns {Viewer} this
     */
    prev: function prev() {
      var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var index = this.index - 1;

      if (index < 0) {
        index = loop ? this.length - 1 : 0;
      }

      this.view(index);
      return this;
    },

    /**
     * View the next image
     * @param {boolean} [loop=false] - Indicate if view the first one
     * when it is the last one at present.
     * @returns {Viewer} this
     */
    next: function next() {
      var loop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var maxIndex = this.length - 1;
      var index = this.index + 1;

      if (index > maxIndex) {
        index = loop ? 0 : maxIndex;
      }

      this.view(index);
      return this;
    },

    /**
     * Move the image with relative offsets.
     * @param {number} x - The moving distance in the horizontal direction.
     * @param {number} [y=x] The moving distance in the vertical direction.
     * @returns {Viewer} this
     */
    move: function move(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var imageData = this.imageData;
      this.moveTo(isUndefined(x) ? x : imageData.x + Number(x), isUndefined(y) ? y : imageData.y + Number(y));
      return this;
    },

    /**
     * Move the image to an absolute point.
     * @param {number} x - The new position in the horizontal direction.
     * @param {number} [y=x] - The new position in the vertical direction.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @returns {Viewer} this
     */
    moveTo: function moveTo(x) {
      var _this3 = this;

      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      x = Number(x);
      y = Number(y);

      if (this.viewed && !this.played && options.movable) {
        var oldX = imageData.x;
        var oldY = imageData.y;
        var changed = false;

        if (isNumber(x)) {
          changed = true;
        } else {
          x = oldX;
        }

        if (isNumber(y)) {
          changed = true;
        } else {
          y = oldY;
        }

        if (changed) {
          if (isFunction(options.move)) {
            addListener(element, EVENT_MOVE, options.move, {
              once: true
            });
          }

          if (dispatchEvent(element, EVENT_MOVE, {
            x: x,
            y: y,
            oldX: oldX,
            oldY: oldY,
            originalEvent: _originalEvent
          }) === false) {
            return this;
          }

          imageData.x = x;
          imageData.y = y;
          imageData.left = x;
          imageData.top = y;
          this.moving = true;
          this.renderImage(function () {
            _this3.moving = false;

            if (isFunction(options.moved)) {
              addListener(element, EVENT_MOVED, options.moved, {
                once: true
              });
            }

            dispatchEvent(element, EVENT_MOVED, {
              x: x,
              y: y,
              oldX: oldX,
              oldY: oldY,
              originalEvent: _originalEvent
            }, {
              cancelable: false
            });
          });
        }
      }

      return this;
    },

    /**
     * Rotate the image with a relative degree.
     * @param {number} degree - The rotate degree.
     * @returns {Viewer} this
     */
    rotate: function rotate(degree) {
      this.rotateTo((this.imageData.rotate || 0) + Number(degree));
      return this;
    },

    /**
     * Rotate the image to an absolute degree.
     * @param {number} degree - The rotate degree.
     * @returns {Viewer} this
     */
    rotateTo: function rotateTo(degree) {
      var _this4 = this;

      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      degree = Number(degree);

      if (isNumber(degree) && this.viewed && !this.played && options.rotatable) {
        var oldDegree = imageData.rotate;

        if (isFunction(options.rotate)) {
          addListener(element, EVENT_ROTATE, options.rotate, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_ROTATE, {
          degree: degree,
          oldDegree: oldDegree
        }) === false) {
          return this;
        }

        imageData.rotate = degree;
        this.rotating = true;
        this.renderImage(function () {
          _this4.rotating = false;

          if (isFunction(options.rotated)) {
            addListener(element, EVENT_ROTATED, options.rotated, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_ROTATED, {
            degree: degree,
            oldDegree: oldDegree
          }, {
            cancelable: false
          });
        });
      }

      return this;
    },

    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Viewer} this
     */
    scaleX: function scaleX(_scaleX) {
      this.scale(_scaleX, this.imageData.scaleY);
      return this;
    },

    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Viewer} this
     */
    scaleY: function scaleY(_scaleY) {
      this.scale(this.imageData.scaleX, _scaleY);
      return this;
    },

    /**
     * Scale the image.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Viewer} this
     */
    scale: function scale(scaleX) {
      var _this5 = this;

      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
      var element = this.element,
          options = this.options,
          imageData = this.imageData;
      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (this.viewed && !this.played && options.scalable) {
        var oldScaleX = imageData.scaleX;
        var oldScaleY = imageData.scaleY;
        var changed = false;

        if (isNumber(scaleX)) {
          changed = true;
        } else {
          scaleX = oldScaleX;
        }

        if (isNumber(scaleY)) {
          changed = true;
        } else {
          scaleY = oldScaleY;
        }

        if (changed) {
          if (isFunction(options.scale)) {
            addListener(element, EVENT_SCALE, options.scale, {
              once: true
            });
          }

          if (dispatchEvent(element, EVENT_SCALE, {
            scaleX: scaleX,
            scaleY: scaleY,
            oldScaleX: oldScaleX,
            oldScaleY: oldScaleY
          }) === false) {
            return this;
          }

          imageData.scaleX = scaleX;
          imageData.scaleY = scaleY;
          this.scaling = true;
          this.renderImage(function () {
            _this5.scaling = false;

            if (isFunction(options.scaled)) {
              addListener(element, EVENT_SCALED, options.scaled, {
                once: true
              });
            }

            dispatchEvent(element, EVENT_SCALED, {
              scaleX: scaleX,
              scaleY: scaleY,
              oldScaleX: oldScaleX,
              oldScaleY: oldScaleY
            }, {
              cancelable: false
            });
          });
        }
      }

      return this;
    },

    /**
     * Zoom the image with a relative ratio.
     * @param {number} ratio - The target ratio.
     * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @returns {Viewer} this
     */
    zoom: function zoom(ratio) {
      var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var imageData = this.imageData;
      ratio = Number(ratio);

      if (ratio < 0) {
        ratio = 1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      this.zoomTo(imageData.width * ratio / imageData.naturalWidth, hasTooltip, _originalEvent);
      return this;
    },

    /**
     * Zoom the image to an absolute ratio.
     * @param {number} ratio - The target ratio.
     * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
     * @param {Event} [_originalEvent=null] - The original event if any.
     * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
     * @returns {Viewer} this
     */
    zoomTo: function zoomTo(ratio) {
      var _this6 = this;

      var hasTooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _originalEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var _zoomable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var element = this.element,
          options = this.options,
          pointers = this.pointers,
          imageData = this.imageData;
      var x = imageData.x,
          y = imageData.y,
          width = imageData.width,
          height = imageData.height,
          naturalWidth = imageData.naturalWidth,
          naturalHeight = imageData.naturalHeight;
      ratio = Math.max(0, ratio);

      if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
        if (!_zoomable) {
          var minZoomRatio = Math.max(0.01, options.minZoomRatio);
          var maxZoomRatio = Math.min(100, options.maxZoomRatio);
          ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
        }

        if (_originalEvent && options.zoomRatio >= 0.055 && ratio > 0.95 && ratio < 1.05) {
          ratio = 1;
        }

        var newWidth = naturalWidth * ratio;
        var newHeight = naturalHeight * ratio;
        var offsetWidth = newWidth - width;
        var offsetHeight = newHeight - height;
        var oldRatio = width / naturalWidth;

        if (isFunction(options.zoom)) {
          addListener(element, EVENT_ZOOM, options.zoom, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_ZOOM, {
          ratio: ratio,
          oldRatio: oldRatio,
          originalEvent: _originalEvent
        }) === false) {
          return this;
        }

        this.zooming = true;

        if (_originalEvent) {
          var offset = getOffset(this.viewer);
          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          }; // Zoom from the triggering point of the event

          imageData.x -= offsetWidth * ((center.pageX - offset.left - x) / width);
          imageData.y -= offsetHeight * ((center.pageY - offset.top - y) / height);
        } else {
          // Zoom from the center of the image
          imageData.x -= offsetWidth / 2;
          imageData.y -= offsetHeight / 2;
        }

        imageData.left = imageData.x;
        imageData.top = imageData.y;
        imageData.width = newWidth;
        imageData.height = newHeight;
        imageData.ratio = ratio;
        this.renderImage(function () {
          _this6.zooming = false;

          if (isFunction(options.zoomed)) {
            addListener(element, EVENT_ZOOMED, options.zoomed, {
              once: true
            });
          }

          dispatchEvent(element, EVENT_ZOOMED, {
            ratio: ratio,
            oldRatio: oldRatio,
            originalEvent: _originalEvent
          }, {
            cancelable: false
          });
        });

        if (hasTooltip) {
          this.tooltip();
        }
      }

      return this;
    },

    /**
     * Play the images
     * @param {boolean} [fullscreen=false] - Indicate if request fullscreen or not.
     * @returns {Viewer} this
     */
    play: function play() {
      var _this7 = this;

      var fullscreen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isShown || this.played) {
        return this;
      }

      var element = this.element,
          options = this.options;

      if (isFunction(options.play)) {
        addListener(element, EVENT_PLAY, options.play, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_PLAY) === false) {
        return this;
      }

      var player = this.player;
      var onLoad = this.loadImage.bind(this);
      var list = [];
      var total = 0;
      var index = 0;
      this.played = true;
      this.onLoadWhenPlay = onLoad;

      if (fullscreen) {
        this.requestFullscreen();
      }

      addClass(player, CLASS_SHOW);
      forEach(this.items, function (item, i) {
        var img = item.querySelector('img');
        var image = document.createElement('img');
        image.src = getData(img, 'originalUrl');
        image.alt = img.getAttribute('alt');
        image.referrerPolicy = img.referrerPolicy;
        total += 1;
        addClass(image, CLASS_FADE);
        toggleClass(image, CLASS_TRANSITION, options.transition);

        if (hasClass(item, CLASS_ACTIVE)) {
          addClass(image, CLASS_IN);
          index = i;
        }

        list.push(image);
        addListener(image, EVENT_LOAD, onLoad, {
          once: true
        });
        player.appendChild(image);
      });

      if (isNumber(options.interval) && options.interval > 0) {
        var play = function play() {
          _this7.playing = setTimeout(function () {
            removeClass(list[index], CLASS_IN);
            index += 1;
            index = index < total ? index : 0;
            addClass(list[index], CLASS_IN);
            play();
          }, options.interval);
        };

        if (total > 1) {
          play();
        }
      }

      return this;
    },
    // Stop play
    stop: function stop() {
      var _this8 = this;

      if (!this.played) {
        return this;
      }

      var element = this.element,
          options = this.options;

      if (isFunction(options.stop)) {
        addListener(element, EVENT_STOP, options.stop, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_STOP) === false) {
        return this;
      }

      var player = this.player;
      this.played = false;
      clearTimeout(this.playing);
      forEach(player.getElementsByTagName('img'), function (image) {
        removeListener(image, EVENT_LOAD, _this8.onLoadWhenPlay);
      });
      removeClass(player, CLASS_SHOW);
      player.innerHTML = '';
      this.exitFullscreen();
      return this;
    },
    // Enter modal mode (only available in inline mode)
    full: function full() {
      var _this9 = this;

      var options = this.options,
          viewer = this.viewer,
          image = this.image,
          list = this.list;

      if (!this.isShown || this.played || this.fulled || !options.inline) {
        return this;
      }

      this.fulled = true;
      this.open();
      addClass(this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(list, CLASS_TRANSITION);

        if (this.viewed) {
          removeClass(image, CLASS_TRANSITION);
        }
      }

      addClass(viewer, CLASS_FIXED);
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-labelledby', this.title.id);
      viewer.setAttribute('aria-modal', true);
      viewer.removeAttribute('style');
      setStyle(viewer, {
        zIndex: options.zIndex
      });

      if (options.focus) {
        this.enforceFocus();
      }

      this.initContainer();
      this.viewerData = assign({}, this.containerData);
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this9.renderImage(function () {
            if (options.transition) {
              setTimeout(function () {
                addClass(image, CLASS_TRANSITION);
                addClass(list, CLASS_TRANSITION);
              }, 0);
            }
          });
        });
      }

      return this;
    },
    // Exit modal mode (only available in inline mode)
    exit: function exit() {
      var _this10 = this;

      var options = this.options,
          viewer = this.viewer,
          image = this.image,
          list = this.list;

      if (!this.isShown || this.played || !this.fulled || !options.inline) {
        return this;
      }

      this.fulled = false;
      this.close();
      removeClass(this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(list, CLASS_TRANSITION);

        if (this.viewed) {
          removeClass(image, CLASS_TRANSITION);
        }
      }

      if (options.focus) {
        this.clearEnforceFocus();
      }

      viewer.removeAttribute('role');
      viewer.removeAttribute('aria-labelledby');
      viewer.removeAttribute('aria-modal');
      removeClass(viewer, CLASS_FIXED);
      setStyle(viewer, {
        zIndex: options.zIndexInline
      });
      this.viewerData = assign({}, this.parentData);
      this.renderViewer();
      this.renderList();

      if (this.viewed) {
        this.initImage(function () {
          _this10.renderImage(function () {
            if (options.transition) {
              setTimeout(function () {
                addClass(image, CLASS_TRANSITION);
                addClass(list, CLASS_TRANSITION);
              }, 0);
            }
          });
        });
      }

      return this;
    },
    // Show the current ratio of the image with percentage
    tooltip: function tooltip() {
      var _this11 = this;

      var options = this.options,
          tooltipBox = this.tooltipBox,
          imageData = this.imageData;

      if (!this.viewed || this.played || !options.tooltip) {
        return this;
      }

      tooltipBox.textContent = "".concat(Math.round(imageData.ratio * 100), "%");

      if (!this.tooltipping) {
        if (options.transition) {
          if (this.fading) {
            dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
          }

          addClass(tooltipBox, CLASS_SHOW);
          addClass(tooltipBox, CLASS_FADE);
          addClass(tooltipBox, CLASS_TRANSITION);
          tooltipBox.removeAttribute('aria-hidden'); // Force reflow to enable CSS3 transition

          tooltipBox.initialOffsetWidth = tooltipBox.offsetWidth;
          addClass(tooltipBox, CLASS_IN);
        } else {
          addClass(tooltipBox, CLASS_SHOW);
          tooltipBox.removeAttribute('aria-hidden');
        }
      } else {
        clearTimeout(this.tooltipping);
      }

      this.tooltipping = setTimeout(function () {
        if (options.transition) {
          addListener(tooltipBox, EVENT_TRANSITION_END, function () {
            removeClass(tooltipBox, CLASS_SHOW);
            removeClass(tooltipBox, CLASS_FADE);
            removeClass(tooltipBox, CLASS_TRANSITION);
            tooltipBox.setAttribute('aria-hidden', true);
            _this11.fading = false;
          }, {
            once: true
          });
          removeClass(tooltipBox, CLASS_IN);
          _this11.fading = true;
        } else {
          removeClass(tooltipBox, CLASS_SHOW);
          tooltipBox.setAttribute('aria-hidden', true);
        }

        _this11.tooltipping = false;
      }, 1000);
      return this;
    },
    // Toggle the image size between its natural size and initial size
    toggle: function toggle() {
      if (this.imageData.ratio === 1) {
        this.zoomTo(this.initialImageData.ratio, true);
      } else {
        this.zoomTo(1, true);
      }

      return this;
    },
    // Reset the image to its initial state
    reset: function reset() {
      if (this.viewed && !this.played) {
        this.imageData = assign({}, this.initialImageData);
        this.renderImage();
      }

      return this;
    },
    // Update viewer when images changed
    update: function update() {
      var _this12 = this;

      var element = this.element,
          options = this.options,
          isImg = this.isImg; // Destroy viewer if the target image was deleted

      if (isImg && !element.parentNode) {
        return this.destroy();
      }

      var images = [];
      forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
        if (isFunction(options.filter)) {
          if (options.filter.call(_this12, image)) {
            images.push(image);
          }
        } else if (_this12.getImageURL(image)) {
          images.push(image);
        }
      });

      if (!images.length) {
        return this;
      }

      this.images = images;
      this.length = images.length;

      if (this.ready) {
        var changedIndexes = [];
        forEach(this.items, function (item, i) {
          var img = item.querySelector('img');
          var image = images[i];

          if (image && img) {
            if (image.src !== img.src // Title changed (#408)
            || image.alt !== img.alt) {
              changedIndexes.push(i);
            }
          } else {
            changedIndexes.push(i);
          }
        });
        setStyle(this.list, {
          width: 'auto'
        });
        this.initList();

        if (this.isShown) {
          if (this.length) {
            if (this.viewed) {
              var changedIndex = changedIndexes.indexOf(this.index);

              if (changedIndex >= 0) {
                this.viewed = false;
                this.view(Math.max(Math.min(this.index - changedIndex, this.length - 1), 0));
              } else {
                var activeItem = this.items[this.index]; // Reactivate the current viewing item after reset the list.

                addClass(activeItem, CLASS_ACTIVE);
                activeItem.setAttribute('aria-selected', true);
              }
            }
          } else {
            this.image = null;
            this.viewed = false;
            this.index = 0;
            this.imageData = {};
            this.canvas.innerHTML = '';
            this.title.innerHTML = '';
          }
        }
      } else {
        this.build();
      }

      return this;
    },
    // Destroy the viewer
    destroy: function destroy() {
      var element = this.element,
          options = this.options;

      if (!element[NAMESPACE]) {
        return this;
      }

      this.destroyed = true;

      if (this.ready) {
        if (this.played) {
          this.stop();
        }

        if (options.inline) {
          if (this.fulled) {
            this.exit();
          }

          this.unbind();
        } else if (this.isShown) {
          if (this.viewing) {
            if (this.imageRendering) {
              this.imageRendering.abort();
            } else if (this.imageInitializing) {
              this.imageInitializing.abort();
            }
          }

          if (this.hiding) {
            this.transitioning.abort();
          }

          this.hidden();
        } else if (this.showing) {
          this.transitioning.abort();
          this.hidden();
        }

        this.ready = false;
        this.viewer.parentNode.removeChild(this.viewer);
      } else if (options.inline) {
        if (this.delaying) {
          this.delaying.abort();
        } else if (this.initializing) {
          this.initializing.abort();
        }
      }

      if (!options.inline) {
        removeListener(element, EVENT_CLICK, this.onStart);
      }

      element[NAMESPACE] = undefined;
      return this;
    }
  };

  var others = {
    getImageURL: function getImageURL(image) {
      var url = this.options.url;

      if (isString(url)) {
        url = image.getAttribute(url);
      } else if (isFunction(url)) {
        url = url.call(this, image);
      } else {
        url = '';
      }

      return url;
    },
    enforceFocus: function enforceFocus() {
      var _this = this;

      this.clearEnforceFocus();
      addListener(document, EVENT_FOCUSIN, this.onFocusin = function (_ref) {
        var target = _ref.target;
        var viewer = _this.viewer;

        if (target !== document && target !== viewer && !viewer.contains(target)) {
          viewer.focus();
        }
      });
    },
    clearEnforceFocus: function clearEnforceFocus() {
      if (this.onFocusin) {
        removeListener(document, EVENT_FOCUSIN, this.onFocusin);
        this.onFocusin = null;
      }
    },
    open: function open() {
      var body = this.body;
      addClass(body, CLASS_OPEN);
      body.style.paddingRight = "".concat(this.scrollbarWidth + (parseFloat(this.initialBodyComputedPaddingRight) || 0), "px");
    },
    close: function close() {
      var body = this.body;
      removeClass(body, CLASS_OPEN);
      body.style.paddingRight = this.initialBodyPaddingRight;
    },
    shown: function shown() {
      var element = this.element,
          options = this.options,
          viewer = this.viewer;
      this.fulled = true;
      this.isShown = true;
      this.render();
      this.bind();
      this.showing = false;

      if (options.focus) {
        viewer.focus();
        this.enforceFocus();
      }

      if (isFunction(options.shown)) {
        addListener(element, EVENT_SHOWN, options.shown, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_SHOWN) === false) {
        return;
      }

      if (this.ready && this.isShown && !this.hiding) {
        this.view(this.index);
      }
    },
    hidden: function hidden() {
      var element = this.element,
          options = this.options,
          viewer = this.viewer;

      if (options.fucus) {
        this.clearEnforceFocus();
      }

      this.fulled = false;
      this.viewed = false;
      this.isShown = false;
      this.close();
      this.unbind();
      addClass(viewer, CLASS_HIDE);
      viewer.removeAttribute('role');
      viewer.removeAttribute('aria-labelledby');
      viewer.removeAttribute('aria-modal');
      viewer.setAttribute('aria-hidden', true);
      this.resetList();
      this.resetImage();
      this.hiding = false;

      if (!this.destroyed) {
        if (isFunction(options.hidden)) {
          addListener(element, EVENT_HIDDEN, options.hidden, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_HIDDEN, null, {
          cancelable: false
        });
      }
    },
    requestFullscreen: function requestFullscreen() {
      var document = this.element.ownerDocument;

      if (this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        var documentElement = document.documentElement; // Element.requestFullscreen()

        if (documentElement.requestFullscreen) {
          documentElement.requestFullscreen();
        } else if (documentElement.webkitRequestFullscreen) {
          documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (documentElement.mozRequestFullScreen) {
          documentElement.mozRequestFullScreen();
        } else if (documentElement.msRequestFullscreen) {
          documentElement.msRequestFullscreen();
        }
      }
    },
    exitFullscreen: function exitFullscreen() {
      var document = this.element.ownerDocument;

      if (this.fulled && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        // Document.exitFullscreen()
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    change: function change(event) {
      var options = this.options,
          pointers = this.pointers;
      var pointer = pointers[Object.keys(pointers)[0]]; // In the case of the `pointers` object is empty (#421)

      if (!pointer) {
        return;
      }

      var offsetX = pointer.endX - pointer.startX;
      var offsetY = pointer.endY - pointer.startY;

      switch (this.action) {
        // Move the current image
        case ACTION_MOVE:
          this.move(offsetX, offsetY, event);
          break;
        // Zoom the current image

        case ACTION_ZOOM:
          this.zoom(getMaxZoomRatio(pointers), false, event);
          break;

        case ACTION_SWITCH:
          {
            this.action = 'switched';
            var absoluteOffsetX = Math.abs(offsetX);

            if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
              // Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
              this.pointers = {};

              if (offsetX > 1) {
                this.prev(options.loop);
              } else if (offsetX < -1) {
                this.next(options.loop);
              }
            }

            break;
          }
      } // Override


      forEach(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    },
    isSwitchable: function isSwitchable() {
      var imageData = this.imageData,
          viewerData = this.viewerData;
      return this.length > 1 && imageData.x >= 0 && imageData.y >= 0 && imageData.width <= viewerData.width && imageData.height <= viewerData.height;
    }
  };

  var AnotherViewer = WINDOW.Viewer;

  var getUniqueID = function (id) {
    return function () {
      id += 1;
      return id;
    };
  }(-1);

  var Viewer = /*#__PURE__*/function () {
    /**
     * Create a new Viewer.
     * @param {Element} element - The target element for viewing.
     * @param {Object} [options={}] - The configuration options.
     */
    function Viewer(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Viewer);

      if (!element || element.nodeType !== 1) {
        throw new Error('The first argument is required and must be an element.');
      }

      this.element = element;
      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
      this.action = false;
      this.fading = false;
      this.fulled = false;
      this.hiding = false;
      this.imageClicked = false;
      this.imageData = {};
      this.index = this.options.initialViewIndex;
      this.isImg = false;
      this.isShown = false;
      this.length = 0;
      this.moving = false;
      this.played = false;
      this.playing = false;
      this.pointers = {};
      this.ready = false;
      this.rotating = false;
      this.scaling = false;
      this.showing = false;
      this.timeout = false;
      this.tooltipping = false;
      this.viewed = false;
      this.viewing = false;
      this.wheeling = false;
      this.zooming = false;
      this.id = getUniqueID();
      this.init();
    }

    _createClass(Viewer, [{
      key: "init",
      value: function init() {
        var _this = this;

        var element = this.element,
            options = this.options;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this; // The `focus` option requires the `keyboard` option set to `true`.

        if (options.focus && !options.keyboard) {
          options.focus = false;
        }

        var isImg = element.localName === 'img';
        var images = [];
        forEach(isImg ? [element] : element.querySelectorAll('img'), function (image) {
          if (isFunction(options.filter)) {
            if (options.filter.call(_this, image)) {
              images.push(image);
            }
          } else if (_this.getImageURL(image)) {
            images.push(image);
          }
        });
        this.isImg = isImg;
        this.length = images.length;
        this.images = images;
        this.initBody(); // Override `transition` option if it is not supported

        if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
          options.transition = false;
        }

        if (options.inline) {
          var count = 0;

          var progress = function progress() {
            count += 1;

            if (count === _this.length) {
              var timeout;
              _this.initializing = false;
              _this.delaying = {
                abort: function abort() {
                  clearTimeout(timeout);
                }
              }; // build asynchronously to keep `this.viewer` is accessible in `ready` event handler.

              timeout = setTimeout(function () {
                _this.delaying = false;

                _this.build();
              }, 0);
            }
          };

          this.initializing = {
            abort: function abort() {
              forEach(images, function (image) {
                if (!image.complete) {
                  removeListener(image, EVENT_LOAD, progress);
                }
              });
            }
          };
          forEach(images, function (image) {
            if (image.complete) {
              progress();
            } else {
              addListener(image, EVENT_LOAD, progress, {
                once: true
              });
            }
          });
        } else {
          addListener(element, EVENT_CLICK, this.onStart = function (_ref) {
            var target = _ref.target;

            if (target.localName === 'img' && (!isFunction(options.filter) || options.filter.call(_this, target))) {
              _this.view(_this.images.indexOf(target));
            }
          });
        }
      }
    }, {
      key: "build",
      value: function build() {
        if (this.ready) {
          return;
        }

        var element = this.element,
            options = this.options;
        var parent = element.parentNode;
        var template = document.createElement('div');
        template.innerHTML = TEMPLATE;
        var viewer = template.querySelector(".".concat(NAMESPACE, "-container"));
        var title = viewer.querySelector(".".concat(NAMESPACE, "-title"));
        var toolbar = viewer.querySelector(".".concat(NAMESPACE, "-toolbar"));
        var navbar = viewer.querySelector(".".concat(NAMESPACE, "-navbar"));
        var button = viewer.querySelector(".".concat(NAMESPACE, "-button"));
        var canvas = viewer.querySelector(".".concat(NAMESPACE, "-canvas"));
        this.parent = parent;
        this.viewer = viewer;
        this.title = title;
        this.toolbar = toolbar;
        this.navbar = navbar;
        this.button = button;
        this.canvas = canvas;
        this.footer = viewer.querySelector(".".concat(NAMESPACE, "-footer"));
        this.tooltipBox = viewer.querySelector(".".concat(NAMESPACE, "-tooltip"));
        this.player = viewer.querySelector(".".concat(NAMESPACE, "-player"));
        this.list = viewer.querySelector(".".concat(NAMESPACE, "-list"));
        viewer.id = "".concat(NAMESPACE).concat(this.id);
        title.id = "".concat(NAMESPACE, "Title").concat(this.id);
        addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(Array.isArray(options.title) ? options.title[0] : options.title));
        addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
        toggleClass(button, CLASS_HIDE, !options.button);

        if (options.keyboard) {
          button.setAttribute('tabindex', 0);
        }

        if (options.backdrop) {
          addClass(viewer, "".concat(NAMESPACE, "-backdrop"));

          if (!options.inline && options.backdrop !== 'static') {
            setData(canvas, DATA_ACTION, 'hide');
          }
        }

        if (isString(options.className) && options.className) {
          // In case there are multiple class names
          options.className.split(REGEXP_SPACES).forEach(function (className) {
            addClass(viewer, className);
          });
        }

        if (options.toolbar) {
          var list = document.createElement('ul');
          var custom = isPlainObject(options.toolbar);
          var zoomButtons = BUTTONS.slice(0, 3);
          var rotateButtons = BUTTONS.slice(7, 9);
          var scaleButtons = BUTTONS.slice(9);

          if (!custom) {
            addClass(toolbar, getResponsiveClass(options.toolbar));
          }

          forEach(custom ? options.toolbar : BUTTONS, function (value, index) {
            var deep = custom && isPlainObject(value);
            var name = custom ? hyphenate(index) : value;
            var show = deep && !isUndefined(value.show) ? value.show : value;

            if (!show || !options.zoomable && zoomButtons.indexOf(name) !== -1 || !options.rotatable && rotateButtons.indexOf(name) !== -1 || !options.scalable && scaleButtons.indexOf(name) !== -1) {
              return;
            }

            var size = deep && !isUndefined(value.size) ? value.size : value;
            var click = deep && !isUndefined(value.click) ? value.click : value;
            var item = document.createElement('li');

            if (options.keyboard) {
              item.setAttribute('tabindex', 0);
            }

            item.setAttribute('role', 'button');
            addClass(item, "".concat(NAMESPACE, "-").concat(name));

            if (!isFunction(click)) {
              setData(item, DATA_ACTION, name);
            }

            if (isNumber(show)) {
              addClass(item, getResponsiveClass(show));
            }

            if (['small', 'large'].indexOf(size) !== -1) {
              addClass(item, "".concat(NAMESPACE, "-").concat(size));
            } else if (name === 'play') {
              addClass(item, "".concat(NAMESPACE, "-large"));
            }

            if (isFunction(click)) {
              addListener(item, EVENT_CLICK, click);
            }

            list.appendChild(item);
          });
          toolbar.appendChild(list);
        } else {
          addClass(toolbar, CLASS_HIDE);
        }

        if (!options.rotatable) {
          var rotates = toolbar.querySelectorAll('li[class*="rotate"]');
          addClass(rotates, CLASS_INVISIBLE);
          forEach(rotates, function (rotate) {
            toolbar.appendChild(rotate);
          });
        }

        if (options.inline) {
          addClass(button, CLASS_FULLSCREEN);
          setStyle(viewer, {
            zIndex: options.zIndexInline
          });

          if (window.getComputedStyle(parent).position === 'static') {
            setStyle(parent, {
              position: 'relative'
            });
          }

          parent.insertBefore(viewer, element.nextSibling);
        } else {
          addClass(button, CLASS_CLOSE);
          addClass(viewer, CLASS_FIXED);
          addClass(viewer, CLASS_FADE);
          addClass(viewer, CLASS_HIDE);
          setStyle(viewer, {
            zIndex: options.zIndex
          });
          var container = options.container;

          if (isString(container)) {
            container = element.ownerDocument.querySelector(container);
          }

          if (!container) {
            container = this.body;
          }

          container.appendChild(viewer);
        }

        if (options.inline) {
          this.render();
          this.bind();
          this.isShown = true;
        }

        this.ready = true;

        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, {
            once: true
          });
        }

        if (dispatchEvent(element, EVENT_READY) === false) {
          this.ready = false;
          return;
        }

        if (this.ready && options.inline) {
          this.view(this.index);
        }
      }
      /**
       * Get the no conflict viewer class.
       * @returns {Viewer} The viewer class.
       */

    }], [{
      key: "noConflict",
      value: function noConflict() {
        window.Viewer = AnotherViewer;
        return Viewer;
      }
      /**
       * Change the default options.
       * @param {Object} options - The new default options.
       */

    }, {
      key: "setDefaults",
      value: function setDefaults(options) {
        assign(DEFAULTS, isPlainObject(options) && options);
      }
    }]);

    return Viewer;
  }();

  assign(Viewer.prototype, render, events, handlers, methods, others);

  return Viewer;

})));


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "ded2":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("c356")(true);
// imports
exports.i(__webpack_require__("5a86"), "");

// module
exports.push([module.i, "div.popContainer{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.3);z-index:999;padding:16px}.gisqlib-upload-videomask-close-div{position:absolute;top:-40px;right:-40px;width:80px;height:80px;border-radius:40px;background-color:rgba(0,0,34,.31)}.gisqlib-upload-videomask-close-div:active{background-color:#000}.gisqlib-upload-videomask-closeIcon{position:absolute;bottom:10%;left:30%;transform:translate(-50%,-50%);color:#fff}.gisqlib-upload-video{width:80%;height:80%;-o-object-fit:fill;object-fit:fill}.gisq-upload-video-icon,.gisqlib-upload-video{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.gisq-image-showsmall-div{float:left;border:1px;padding:2px;margin-right:2px;position:relative;overflow:hidden}.gisqUploadActionSheet{text-align:center}.gisqUpload-delete-root-div{position:absolute;width:50px;height:50px;background-color:red;top:-25px;right:-25px;z-index:999;transform:rotate(45deg)}.gisqUpload-icon-delete-span{position:absolute;left:50%;bottom:0;transform:translate(-50%)}.gisqupload-div-action-plus{float:left;width:80px;height:80px;line-height:80px;text-align:center;border:1px dashed #cfcfcf;margin-right:2px}.gisq-small-image{text-align:center;width:80px;height:80px;-o-object-fit:contain;object-fit:contain}", "", {"version":3,"sources":["/Users/fujian/mine/work/hbuilderwork/gisqHbMobileUpload/gisq/upload/gisq/upload/upload.vue"],"names":[],"mappings":"AAwtBA,iBACA,eACA,MACA,OACA,QACA,SACA,0BACA,YACA,YACA,CAEA,oCACA,kBACA,UACA,YACA,WACA,YACA,mBACA,iCACA,CAEA,2CAEA,qBACA,CAEA,oCACA,kBACA,WACA,SACA,+BACA,UACA,CAEA,sBAIA,UACA,WACA,mBAAA,eAEA,CAEA,8CATA,kBACA,SACA,QAIA,8BAQA,CAEA,0BACA,WACA,WACA,YACA,iBACA,kBACA,eACA,CAEA,uBACA,iBACA,CAEA,4BACA,kBACA,WACA,YACA,qBACA,UACA,YACA,YACA,uBACA,CAEA,6BACA,kBACA,SACA,SACA,yBACA,CAEA,4BACA,WACA,WACA,YACA,iBACA,kBACA,0BACA,gBACA,CAEA,kBACA,kBACA,WACA,YACA,sBAAA,kBACA,CAAA","file":"upload.vue?vue&type=style&index=0&lang=css&","sourcesContent":["<template>\n\t<div class=\"uploadRoot\" style=\"\">\n\t\t<div style=\"\" class=\"zoomimages\" v-viewer=\"zoomOptions\">\n\t\t\t<div v-for=\"(item,key) in fileMap\" style=\"\" class=\"gisq-image-showsmall-div\" @click=\"handleOpen(item[1],$event)\" :ckey=\"fileMapStateTrack\">\n\t\t\t\t<img :src=\"item[1].type=='picture'?item[1].src:item[1].poster\" :key=\"item[0]\" \n\t\t\t\tclass=\"gisq-small-image\" :alt=\"item[0]\"></img>\n\t\t\t\t<div style=\"\" class=\"gisqUpload gisqUpload-delete-root-div\" @click=\"showDelDialogAction(item[0],$event)\"\n\t\t\t\t\t:cKey=\"item[0]\">\n\t\t\t\t\t<span class=\"iconfont-gisqupload icon-shanchu gisqUpload-icon-delete-span\" style=\"\">\n\n\t\t\t\t\t</span>\n\n\t\t\t\t</div>\n\t\t\t\t<div style=\"\" class=\"gisq-upload-video-icon\" v-show=\"item[1].type==='video'\">\n\t\t\t\t\t<i class=\"iconfont-gisqupload icon-circle-video\" style=\"font-size: 2rem;color: #FFFFFF;\"></i>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style=\"\" @click=\"showSheet\" class=\"gisqupload-div-action-plus\">\n\t\t\t\t<span class=\"iconfont-gisqupload icon-plus-line\" ></span>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"gisqUploadActionSheet\">\n\t\t\t<gisqSheet :p_visiable.sync=\"iShow\" :p_title=\"iTitle\" :p_sheetItems=\"sheetItems\"\n\t\t\t\t@clickOnSheet=\"clickOnSheet\" />\n\t\t</div>\n\t\t<!-- <duo-image-viewer :src=\"bigSrc\" @close=\"handleClose\" :srcList=\"srcList\" :showViewer=\"showViewer\" /> -->\n\t\t<!-- <viewer class=\"viewer \" style=\"width: 80px;\" alt=\"\">\n\t\t  <img :src=\"bigSrc\">\n\t\t</viewer> -->\n\t\t<div class='popContainer' v-show=\"showMaskDialog\">\n\t\t\t<video style=\"\" class=\"gisqlib-upload-video\" controls=\"controls\" ref=\"gisqLibUploadVideoPlayer\"\n\t\t\t\t@ended=\"onPlayerEnded($event)\">\n\t\t\t\t<source :src=\"gisqVideoUrl\" type=\"video/mp4\">\n\t\t\t</video>\n\t\t\t<div class=\"gisqlib-upload-videomask-close-div\" @click=\"closePlayVideoMask()\">\n\t\t\t\t<i class=\"iconfont-gisqupload icon-close gisqlib-upload-videomask-closeIcon\"></i>\n\t\t\t</div>\n\n\t\t</div>\n\t\t<input hidden=\"hidden\" type=\"file\" multiple=\"multiple\" accept=\"image/*,video/*\" ref=\"gisqLibUploadInputFileH5\"/>\n\t\t<input hidden=\"hidden\" type=\"file\" multiple=\"multiple\" accept=\"video/*\" ref=\"gisqLibUploadInputFileVideoH5\"/>\n\t\t<dialog-bar v-model=\"showDelDialog\" type=\"danger\" title=\"警告!\" content=\"确定删除图片?\" v-on:cancel=\"clickCancel()\" @danger=\"clickDanger()\" @confirm=\"clickConfirm()\" dangerText=\"删除\"></dialog-bar>\n\t</div>\n</template>\n\n<script>\n\timport 'viewerjs/dist/viewer.css'\n\timport gisqSheet from \"./sheet.vue\"\n\t//import duoImageViewer from \"./photoView/src/index.vue\"\n\timport Viewer from 'v-viewer'\n\timport Vue from 'vue'\n\timport dialogBar from './dialog.vue'\n\timport {getDeviceInfo} from './util/device.js'\n\timport {readLocalFile,dataURLtoFile} from './util/fileUtils.js'\n\tVue.use(Viewer)\n\n\tlet hbuilder=false;\n\t//Viewer.setDefaults( {Options:{ \"inline\": true, \"button\": true, \"navbar\": true, \"title\": true, \"toolbar\": false, \"tooltip\": true, \"movable\": true, \"zoomable\": true, \"rotatable\": true, \"scalable\": true, \"transition\": true, \"fullscreen\": true, \"keyboard\": true, \"url\": \"data-source\" } })\n\n\texport default {\n\t\tgetDeviceInfo,readLocalFile,\n\t\tname: \"gisqUpload\",\n\t\tcomponents: {\n\t\t\tgisqSheet,dialogBar\n\t\t\t//duoImageViewer\n\t\t},\n\t\tprops:{\n\t\t\textraInfo:{\n\t\t\t\ttype:String,\n\t\t\t\tdefault:\"\"\n\t\t\t},\n\t\t\tfiles:Array,\n\t\t\tonBeforeDeleted:Function,\n\t\t\tonBeforeAdded:Function,\n\t\t\tonDeleted:Function,\n\t\t\tonAdded:Function,\n\t\t\tonCustomPrewer:{\n\t\t\t\ttype:Function,\n\t\t\t\tdefault:undefined\n\t\t\t},\n\t\t},\n\t\twatch:{\n\t\t\tfiles:{\n\t\t\t\tdeep:true,\n\t\t\t\timmediate:true,\n\t\t\t\thandler(newVal,oldVal){\n\t\t\t\t\tconsole.log(this.files)\n\t\t\t\t\tif(!this.files) return;\n\t\t\t\t\tif(this.files.length==0){\n\t\t\t\t\t\tconsole.log(1)\n\t\t\t\t\t\tthis.refresh();\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tthis.addedFileMap=new Map();\n\t\t\t\t\tthis.fileMap=new Map();\n\t\t\t\t\tfor(var i=0;i<this.files.length;i++){\n\t\t\t\t\t\tvar fileType=this.getFileType(this.files[i]);\n\t\t\t\t\t\tvar path=this.files[i];\n\t\t\t\t\t\tconsole.log(fileType)\n\t\t\t\t\t\tif(fileType==\"video\"){\n\t\t\t\t\t\t\tthis.dealVideo(path,'video');\n\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\tthis.updateFileMap(path,path,fileType,\"\",\"show\");\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\tdata() {\n\t\t\treturn {\n\t\t\t\tdelKey:\"\",\n\t\t\t\tshowDelDialog:false,\n\t\t\t\tfileMapStateTrack:0,\n\t\t\t\tgisqVideoUrl: \"\",\n\t\t\t\tshowMaskDialog: false,\n\t\t\t\tvideoHeight:240,\n\t\t\t\tvideoWidth:400,\n\t\t\t\tisHbuilder: false,\n\t\t\t\tcurrentValue: false,\n\t\t\t\tiTitle: \"类型选择\",\n\t\t\t\tiLeft: \"取消\",\n\t\t\t\tiShow: false,\n\t\t\t\tsheetItems: [{\n\t\t\t\t\t\tid: 1,\n\t\t\t\t\t\tname: \"拍照\",\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid: 2,\n\t\t\t\t\t\tname: \"选取图片\",\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\tid: 3,\n\t\t\t\t\t\tname: \"选取视频\",\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\taddedFileMap:new Map(),\n\t\t\t\tfileMap: new Map(),\n\t\t\t\tindex: 0,\n\t\t\t\tshowViewer: false,\n\t\t\t\tbigSrc: \"\",\n\t\t\t\tsrcList: [],\n\t\t\t\tzoomOptions: {\n\t\t\t\t\tinline: false,\n\t\t\t\t\tbutton: true,\n\t\t\t\t\tnavbar: false, //去除左右滑动切换\n\t\t\t\t\ttitle: false,\n\t\t\t\t\ttoolbar: {\n\t\t\t\t\t\tzoomIn: 0,\n\t\t\t\t\t\tzoomOut: 0,\n\t\t\t\t\t\toneToOne: 0,\n\t\t\t\t\t\treset: 0,\n\t\t\t\t\t\tprev: 0,\n\t\t\t\t\t\tplay: 0,\n\t\t\t\t\t\tnext: 0,\n\t\t\t\t\t\trotateLeft: 0,\n\t\t\t\t\t\trotateRight: 0,\n\t\t\t\t\t\tflipHorizontal: 0,\n\t\t\t\t\t\tflipVertical: 0\n\t\t\t\t\t},\n\t\t\t\t\ttooltip: false,\n\t\t\t\t\tmovable: true,\n\t\t\t\t\tzoomable: true,\n\t\t\t\t\trotatable: true,\n\t\t\t\t\tscalable: true,\n\t\t\t\t\ttransition: false,\n\t\t\t\t\tfullscreen: true,\n\t\t\t\t\tkeyboard: true,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\tmethods: {\n\t\t\tdealVideo:function(path,fileType){\n\t\t\t\tvar _self=this;\n\t\t\t\tthis.getVideoBase64(path).then(function(dataUrl){\n\t\t\t\t\t_self.updateFileMap(path,path,fileType,dataUrl,\"show\");\n\t\t\t\t})\n\t\t\t},\n\t\t\trefresh:function(){\n\t\t\t\tthis.addedFileMap=new Map();\n\t\t\t\tthis.fileMap=new Map();\n\t\t\t\tthis.$forceUpdate();\n\t\t\t\tthis.onChange();\n\t\t\t},\n\t\t\tclickCancel:function(){\n\t\t\t\tconsole.log('点击了取消');\n\t\t\t\tthis.delKey=\"\";\n\t\t\t},\n\t\t\tclickDanger:function(){\n\t\t\t\tconsole.log('这里是danger回调')\n\t\t\t\tthis.deleteSelectedFile(this.delKey);\n\t\t\t\tthis.delKey=\"\";\n\t\t\t},\n\t\t\tclickConfirm:function(){\n\t\t\t\tconsole.log('点击了confirm');\n\t\t\t},\n\t\t\tgetFileType:function(path){\n\t\t\t\tvar fileType = \"picture\";\n\t\t\t\tif(!!path){\n\t\t\t\t\t\n\t\t\t\t\tvar types = path.split(\".\")\n\t\t\t\t\t\n\t\t\t\t\tif (types.length >= 2) {\n\t\t\t\t\t\tvar type = types[types.length - 1].toLowerCase();\n\t\t\t\t\t\tif (type === \"mp4\" || type === \"mov\" || type === \"avi\" || type === \"wmv\" || type === \"3gp\" ||\n\t\t\t\t\t\t\ttype === \"mkv\" || type === \"rmvb\" || type === \"webm\" || type === \"flv\" || type === \"qsv\") {\n\t\t\t\t\t\t\tfileType = \"video\";\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn fileType;\n\t\t\t\t\n\t\t\t},\n\t\t\tshowSheet: function() {\n\t\t\t\tthis.iShow = true;\n\t\t\t},\n\t\t\tclickOnSheet: function(obj) {\n\t\t\t\tif(this.isHbuilder==true){\n\t\t\t\t\ttry{\n\t\t\t\t\t\tvar cameraActivity = plus.android.importClass(\n\t\t\t\t\t\t\t\"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity\");\n\t\t\t\t\t\t\tif (obj.id == 1) {\n\t\t\t\t\t\t\t\tthis.takePhoto();\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t} else if(obj.id==3){\n\t\t\t\t\t\t\t\tthis.chooseVideoH5();\n\t\t\t\t\t\t\t}else {\n\t\t\t\t\t\t\t\tthis.choosePhoto();\n\t\t\t\t\t\t\t}\n\t\t\t\t\t}catch(e){\n\t\t\t\t\t\t//to call H5's takePhoto\n\t\t\t\t\t\tif (obj.id == 1) {\n\t\t\t\t\t\t\tthis.takePhotoH5();\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t}else if(obj.id==3){\n\t\t\t\t\t\t\tthis.chooseVideoH5();\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tthis.choosePhotoH5();\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}else{\n\t\t\t\t\t//to call H5's takePhoto\n\t\t\t\t\tif (obj.id == 1) {\n\t\t\t\t\t\tthis.takePhotoH5();\n\t\t\t\t\t\t\n\t\t\t\t\t}else if(obj.id==3){\n\t\t\t\t\t\tthis.chooseVideoH5();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthis.choosePhotoH5();\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t},\n\t\t\ttakePhotoH5:function(){\n\t\t\t\tvar h5FileEl=this.$refs.gisqLibUploadInputFileH5;\n\t\t\t\tvar _self=this;\n\t\t\t\th5FileEl.onchange=function(e){\n\t\t\t\t\t_self.handleH5InputChange(this.files);\n\t\t\t\t}\n\t\t\t\th5FileEl.click();\n\t\t\t},\n\t\t\tchooseVideoH5:function(){\n\t\t\t\tvar _self=this;\n\t\t\t\tvar h5FileEl=this.$refs.gisqLibUploadInputFileVideoH5;\n\t\t\t\th5FileEl.onchange=function(e){\n\t\t\t\t\t_self.handleH5InputChange(this.files);\n\t\t\t\t}\n\t\t\t\th5FileEl.click();\n\t\t\t},\n\t\t\tchoosePhotoH5:function(){\n\t\t\t\tvar _self=this;\n\t\t\t\tvar h5FileEl=this.$refs.gisqLibUploadInputFileH5;\n\t\t\t\th5FileEl.onchange=function(e){\n\t\t\t\t\t_self.handleH5InputChange(this.files);\n\t\t\t\t}\n\t\t\t\th5FileEl.click();\n\t\t\t},\n\t\t\thandleH5InputChange:function(files){\n\t\t\t\tif(!!files){\n\t\t\t\t\tconsole.log(files)\n\t\t\t\t\tfor(var i=0;i<files.length;i++){\n\t\t\t\t\t\tthis.readH5File(files[i]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\t\t\treadH5File:function(file){\n\t\t\t\tvar jsBlob = URL.createObjectURL(file);\n\t\t\t\tvar fileType=this.getFileType(file.name);\n\t\t\t\tvar _self=this;\n\t\t\t\tif(fileType===\"video\"){\n\t\t\t\t\t_self.getVideoBase64(jsBlob).then(function(dataUrl){\n\t\t\t\t\t\t_self.updateFileMap(file.name,jsBlob,fileType,dataUrl,\"add\",file);\n\t\t\t\t\t});\n\t\t\t\t}else{\n\t\t\t\t\t_self.updateFileMap(file.name,jsBlob,fileType,\"\",\"add\",file);\n\t\t\t\t}\n\t\t\t},\n\t\t\ttakePhoto: function() {\n\t\t\t\tvar _self = this;\n\t\t\t\tif (_self.isHbuilder==true) {\n\t\t\t\t\t/* var main = plus.android.runtimeMainActivity();\n\t\t\t\t\tvar IntentA = plus.android.importClass(\"android.content.Intent\");\n\t\t\t\t\t//var cameraActivity = plus.android.importClass(\"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity\"); //自己写的二维码扫描页面\n\t\t\t\t\t//alert(cameraActivity)\n\t\t\t\t\t//var intent = new Intent(main, cameraActivity.class);\n\t\t\t\t\t\n\t\t\t\t\t//intent.setClassName(main, cameraActivity.class);\n\t\t\t\t\tvar intent = new IntentA(); */\n\t\t\t\t\t //intent.setPackage(\"com.zjzs.gisq.qcjg\");\n\t\t\t\t\t//intent.setAction(\"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity\");\n\t\t\t\t\t\n\t\t\t\t\tvar main = plus.android.runtimeMainActivity();\n\t\t\t\t\tvar Intent = plus.android.importClass(\"android.content.Intent\");\n\t\t\t\t\tvar cameraActivity = plus.android.importClass(\n\t\t\t\t\t\t\"com.zjzs.gisq.jetpack.aar_camara.CamaraActivity\"); //自己写的二维码扫描页面\n\t\t\t\t\tvar intent = new Intent(main, cameraActivity.class);\n\t\t\t\t\tintent.putExtra(\"extraInfo\",this.extraInfo);\n\t\t\t\t\t//intent.setClassName(main, cameraActivity.class);\n\t\t\t\t\tmain.onActivityResult = function(requestCode, resultCode, data) {\n\t\t\t\t\t\tif (100 == requestCode) {\n\t\t\t\t\t\t\tplus.android.importClass(data);\n\t\t\t\t\t\t\tvar bundle = data.getExtras();\n\t\t\t\t\t\t\tplus.android.importClass(bundle);\n\t\t\t\t\t\t\tvar addphoto = bundle.getString(\"addphoto\"); ///获取新拍\n\t\t\t\t\t\t\t//alert(\"addphoto=\" + addphoto);\n\t\t\t\t\t\t\tvar jsonPaths = JSON.parse(addphoto)\n\t\t\t\t\t\t\tfor (var idx in jsonPaths) {\n\t\t\t\t\t\t\t\t//alert(\"sss===\"+jsonPaths[idx].path);\n\t\t\t\t\t\t\t\t_self.parseFile(\"file://\" + jsonPaths[idx].path)\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t\tmain.startActivityForResult(intent, 100);\n\t\t\t\t}\n\t\t\t},\n\t\t\tchoosePhoto: function() {\n\t\t\t\tvar _self = this;\n\t\t\t\t\n\t\t\t\t/* var pSrc=\"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.virtualtelescope.eu%2Fwordpress%2Fwp-content%2Fuploads%2F2018%2F11%2F2018-11-11-Moon-Saturn_Barnaba.jpg&refer=http%3A%2F%2Fwww.virtualtelescope.eu&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619860628&t=52e2ee9f5825302530acdc86003deff3\"\n\t\t\t\t_self.updateFileMap(_self.index+\"\",pSrc,\"picture\",\"\",\"add\");\n\t\t\t\tvar vSrc=\"https://wts.itqiche.com/u5/car_u5_video/XuHang.mp4\";\n\t\t\t\tthis.getVideoBase64(vSrc).then(function(dataUrl){\n\t\t\t\t\t_self.updateFileMap((_self.index+1)+\"\",vSrc,\"video\",dataUrl,\"add\");\n\t\t\t\t})\n\t\t\t\t_self.index++; */\n\n\n\t\t\t\tif (_self.isHbuilder==true) {\n\t\t\t\t\t// 从相册中选择图片\n\t\t\t\t\tconsole.log(\"从相册中选择多张图片:\");\n\t\t\t\t\tplus.gallery.pick(function(e) {\n\t\t\t\t\t\tfor (var i in e.files) {\n\t\t\t\t\t\t\t//alert(\"sss===\" + e.files[i]);\n\t\t\t\t\t\t\t_self.parseFile(e.files[i])\n\t\t\t\t\t\t}\n\t\t\t\t\t}, function(e) {\n\t\t\t\t\t\tconsole.log(\"取消选择图片\");\n\t\t\t\t\t}, {\n\t\t\t\t\t\tfilter: \"image\",\n\t\t\t\t\t\tmultiple: true,\n\t\t\t\t\t\tmaximum: 100000,\n\t\t\t\t\t\tsystem: false,\n\t\t\t\t\t\tonmaxed: function() {\n\t\t\t\t\t\t\tplus.nativeUI.alert('最多只能选择4张图片');\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t},\n\t\t\tparseFile: function(path) {\n\t\t\t\tvar _self = this;\n\t\t\t\tif (_self.isHbuilder==true) {\n\t\t\t\t\tif(!!path){\n\t\t\t\t\t\tvar types = path.split(\".\")\n\t\t\t\t\t\tvar fileType = \"picture\";\n\t\t\t\t\t\tfileType=_self.getFileType(path);\n\t\t\t\t\t\tif (path.indexOf(\"http\") >= 0) {\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tif(fileType === \"video\"){\n\t\t\t\t\t\t\t\tthis.getVideoBase64(path).then(function(dataURL){\n\t\t\t\t\t\t\t\t\tconsole.log(111)\n\t\t\t\t\t\t\t\t\t_self.updateFileMap(path,path,fileType,dataUrl,\"add\");\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\t\t_self.updateFileMap(path,path,fileType,\"\",\"add\");\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\t_self.readLocalFile(path,fileType);\n\t\t\t\t\t\t\t/* readLocalFile(path,function(fileJs,jsBlob){\n\t\t\t\t\t\t\t\t_self.updateFileMap(path,jsBlob,fileType,\"\",\"add\",fileJs);\n\t\t\t\t\t\t\t}); */\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t}\n\t\t\t},\n\t\t\treadFile: function(path,fileType, entry) {\n\t\t\t\tvar _self = this;\n\t\t\t\tif (_self.isHbuilder==true && (!!path)) {\n\t\t\t\t\tvar fileReader = new plus.io.FileReader();\n\t\t\t\t\tfileReader.onloadend = function(evt) {\n\t\t\t\t\t\tvar url = evt.target.result;\n\t\t\t\t\t\tvar fileJs = dataURLtoFile(url, entry.name); //转换为js 的file对象 \n\t\t\t\t\t\tvar jsBlob = URL.createObjectURL(fileJs);\n\t\t\t\t\t\tif(fileType===\"video\"){\n\t\t\t\t\t\t\t_self.getVideoBase64(jsBlob).then(function(dataUrl){\n\t\t\t\t\t\t\t\t_self.updateFileMap(path,jsBlob,fileType,dataUrl,\"add\",fileJs);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\t_self.updateFileMap(path,jsBlob,fileType,\"\",\"add\",fileJs);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tfileReader.readAsDataURL(entry);\n\t\t\t\t}\n\n\t\t\t},\n\t\t\treadLocalFile:function(path,fileType){\n\t\t\t\tvar _self=this;\n\t\t\t\tplus.io.resolveLocalFileSystemURL(path, function(entry) {\n\t\t\t\t\t// 可通过entry对象操作test.html文件 \n\t\t\t\t\t_self.readFile(path, fileType,entry);\n\t\t\t\t}, function(e) {\n\t\t\t\t\talert(\"Resolve file URL failed: \" + e.message);\n\t\t\t\t});\n\t\t\t},\n\t\t\tupdateFileMap:function(path,jsBlob,fileType,posterDataUrl,actionType,jsFile){\n\t\t\t\tthis.beforeAdded(path);\n\t\t\t\tvar isServer=false;\n\t\t\t\tif(path.indexOf(\"http\")==0){\n\t\t\t\t\tisServer=true;\n\t\t\t\t} \n\t\t\t\tvar fileObj={\n\t\t\t\t\tsrc: jsBlob,\n\t\t\t\t\tposter: posterDataUrl,\n\t\t\t\t\ttype: fileType,\n\t\t\t\t\tactionType:actionType,\n\t\t\t\t\tisServer:isServer,\n\t\t\t\t}\n\t\t\t\tthis.fileMap.set(path,fileObj );\n\t\t\t\tthis.fileMapStateTrack++;\n\t\t\t\tconsole.log(this.fileMap)\n\t\t\t\tif(actionType===\"add\"){\n\t\t\t\t\tvar addedObj=jsFile||jsBlob;\n\t\t\t\t\tthis.addedFileMap.set(path,addedObj)\n\t\t\t\t\tthis.addedFile(path);\n\t\t\t\t\tthis.onChange();\n\t\t\t\t}\n\t\t\t\tthis.$forceUpdate()\n\t\t\t},\n\t\t\tplusReady: function(callback) {\n\t\t\t\tif (window.plus) {\n\t\t\t\t\tcallback();\n\t\t\t\t} else {\n\t\t\t\t\tdocument.addEventListener('plusready', callback);\n\t\t\t\t}\n\t\t\t},\n\t\t\tshowDelDialogAction:function(key,e){\n\t\t\t\tthis.showDelDialog=true;\n\t\t\t\tthis.delKey=key;\n\t\t\t\te.stopPropagation();\n\t\t\t},\n\t\t\tdeleteSelectedFile: function(key) {\n\t\t\t\tthis.$refs.gisqLibUploadInputFileH5.value=\"\";\n\t\t\t\tvar fileObj=this.fileMap.get(key);\n\t\t\t\tthis.beforeDeleted(key);\n\t\t\t\tthis.fileMap.delete(key)\n\t\t\t\tthis.fileMapStateTrack--;\n\t\t\t\tthis.$forceUpdate();\n\t\t\t\t\n\t\t\t\tthis.addedFileMap.delete(key);\n\t\t\t\tthis.deletedFile(key);\n\t\t\t\tthis.onChange();\n\t\t\t\tevent.stopPropagation();\n\t\t\t},\n\t\t\tbeforeAdded:function(key){\n\t\t\t\tthis.$emit(\"onBeforeAdded\", key);\n\t\t\t},\n\t\t\tbeforeDeleted:function(key){\n\t\t\t\tthis.$emit(\"onBeforeDeleted\", key);\n\t\t\t},\n\t\t\tdeletedFile:function(key){\n\t\t\t\tthis.$emit(\"onDeleted\", key);\n\t\t\t},\n\t\t\taddedFile:function(key){\n\t\t\t\tthis.$emit(\"onAdded\", key,this.addedFileMap.get(key));\n\t\t\t},\n\t\t\tonChange: function() {\n\t\t\t\tthis.$emit(\"onChange\", this.addedFileMap);\n\t\t\t},\n\t\t\thandleOpen: function(item, event) {\n\t\t\t\tvar src = item.src;\n\t\t\t\tvar type = item.type;\n\t\t\t\tif (type === \"video\") {\n\t\t\t\t\tthis.showMaskDialog = true;\n\t\t\t\t\tthis.gisqVideoUrl = src;\n\t\t\t\t\tconsole.log(src)\n\t\t\t\t\tthis.playVideo(this.$refs.gisqLibUploadVideoPlayer, src);\n\t\t\t\t\tevent.stopPropagation();\n\t\t\t\t\treturn;\n\t\t\t\t} else {\n\t\t\t\t\tif(!!this.onCustomPrewer==true){\n\t\t\t\t\t\tthis.onCustomPrewer(src);\n\t\t\t\t\t\tevent.stopPropagation();\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tthis.bigSrc = src\n\t\t\t\t\tthis.showViewer = !this.showViewer\n\t\t\t\t\tconst viewer = this.$el.querySelector('.zoomimages').$viewer\n\t\t\t\t\tviewer.show()\n\t\t\t\t}\n\n\t\t\t},\n\t\t\thandleClose: function() {\n\t\t\t\tthis.showViewer = false\n\t\t\t},\n\t\t\t/**\n\t\t\t * 图片按宽高比例进行自动缩放\n\t\t\t * @param ImgObj\n\t\t\t *     缩放图片源对象\n\t\t\t * @param maxWidth\n\t\t\t *     允许缩放的最大宽度\n\t\t\t * @param maxHeight\n\t\t\t *     允许缩放的最大高度\n\t\t\t * @usage \n\t\t\t *     调用：<img src=\"图片\" οnlοad=\"javascript:DrawImage(this,100,100)\">\n\t\t\t */\n\t\t\tDrawBetterImage: function(ImgObj, maxWidth, maxHeight) {\n\t\t\t\tvar image = new Image();\n\t\t\t\t//原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）\n\t\t\t\timage.src = ImgObj.src;\n\t\t\t\t// 用于设定图片的宽度和高度\n\t\t\t\tvar tempWidth;\n\t\t\t\tvar tempHeight;\n\n\t\t\t\tif (image.width > 0 && image.height > 0) {\n\t\t\t\t\t//原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度\n\t\t\t\t\tconsole.log(1)\n\t\t\t\t\tif (image.width / image.height >= maxWidth / maxHeight) {\n\t\t\t\t\t\tconsole.log(2)\n\t\t\t\t\t\tif (image.width > maxWidth) {\n\t\t\t\t\t\t\tconsole.log(3)\n\t\t\t\t\t\t\ttempWidth = maxWidth;\n\t\t\t\t\t\t\t// 按原图片的比例进行缩放\n\t\t\t\t\t\t\ttempHeight = (image.height * maxWidth) / image.width;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconsole.log(4)\n\t\t\t\t\t\t\t// 按原图片的大小进行缩放\n\t\t\t\t\t\t\ttempWidth = image.width;\n\t\t\t\t\t\t\ttempHeight = image.height;\n\t\t\t\t\t\t}\n\t\t\t\t\t} else { // 原图片的高度必然 > 宽度\n\t\t\t\t\t\tconsole.log(5)\n\t\t\t\t\t\tif (image.height > maxHeight) {\n\t\t\t\t\t\t\tconsole.log(6)\n\t\t\t\t\t\t\ttempHeight = maxHeight;\n\t\t\t\t\t\t\t// 按原图片的比例进行缩放\n\t\t\t\t\t\t\ttempWidth = (image.width * maxHeight) / image.height;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconsole.log(7)\n\t\t\t\t\t\t\t// 按原图片的大小进行缩放\n\t\t\t\t\t\t\ttempWidth = image.width;\n\t\t\t\t\t\t\ttempHeight = image.height;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t// 设置页面图片的宽和高\n\t\t\t\t\tImgObj.height = tempHeight;\n\t\t\t\t\tImgObj.width = tempWidth;\n\t\t\t\t\t// 提示图片的原来大小\n\t\t\t\t\tImgObj.alt = image.width + \"×\" + image.height;\n\n\t\t\t\t}\n\t\t\t},\n\t\t\tdbPlayVideo(url) {\n\t\t\t\t//进入全屏\n\t\t\t\tvar obj = this.$refs.gisqLibUploadVideoPlayer;\n\t\t\t\tif (obj.requestFullscreen) {\n\t\t\t\t\tobj.requestFullscreen();\n\t\t\t\t} else if (obj.mozRequestFullScreen) {\n\t\t\t\t\tobj.mozRequestFullScreen();\n\t\t\t\t} else if (obj.webkitRequestFullScreen) {\n\t\t\t\t\tobj.webkitRequestFullScreen();\n\t\t\t\t}\n\t\t\t\tobj.play(url);\n\t\t\t\tobj.parentNode.childNodes[0].style.display = \"none\";\n\t\t\t},\n\t\t\t//退出全屏\n\t\t\texitFullscreen(id) {\n\t\t\t\tvar obj = this.$refs.gisqLibUploadVideoPlayer;\n\t\t\t\tif (document.exitFullscreen && obj.style.objectFit == \"\") {\n\t\t\t\t\tdocument.exitFullscreen();\n\t\t\t\t} else if (document.msExitFullscreen) {\n\t\t\t\t\tdocument.msExitFullscreen();\n\t\t\t\t} else if (document.mozCancelFullScreen) {\n\t\t\t\t\tdocument.mozCancelFullScreen();\n\t\t\t\t} else if (document.webkitExitFullscreen) {\n\t\t\t\t\tdocument.webkitExitFullscreen();\n\t\t\t\t}\n\t\t\t\tobj.parentNode.childNodes[0].style.display = \"block\";\n\t\t\t\tsetTimeout(function() {\n\t\t\t\t\tobj.style.objectFit = \"fill\";\n\t\t\t\t}, 500);\n\t\t\t},\n\t\t\tplayVideo(obj, url) {\n\t\t\t\tobj.style.objectFit = \"\";\n\t\t\t\tvar _this = this;\n\t\t\t\tobj.src = url;\n\t\t\t\t//视频横屏\n\t\t\t\tvar phoneWidth = document.documentElement.clientWidth;\n\t\t\t\tvar phoneHeight = document.documentElement.clientHeight;\n\t\t\t\tvar scal=0.92;\n\t\t\t\tif(phoneHeight<phoneWidth){//横屏\n\t\t\t\t\tif(this.videoHeight>this.videoWidth){//高大于宽\n\t\t\t\t\t\tvar r=this.videoWidth/this.videoHeight\n\t\t\t\t\t\tobj.style.height=phoneHeight*scal+\"px\";\n\t\t\t\t\t\tobj.style.width=phoneHeight*scal*r+\"px\";\n\t\t\t\t\t}else{\n\t\t\t\t\t\tvar r=this.videoHeight/this.videoWidth\n\t\t\t\t\t\tobj.style.width=phoneWidth*scal+\"px\";\n\t\t\t\t\t\tobj.style.height=phoneWidth*scal*r+\"px\";\n\t\t\t\t\t}\n\t\t\t\t}else{\n\t\t\t\t\tif(this.videoHeight<this.videoWidth){//高大于宽\n\t\t\t\t\t\tvar r=this.videoHeight/this.videoWidth\n\t\t\t\t\t\tobj.style.width=phoneWidth*scal+\"px\";\n\t\t\t\t\t\tobj.style.height=phoneWidth*scal*r+\"px\";\n\t\t\t\t\t}else{\n\t\t\t\t\t\tvar r=this.videoWidth/this.videoHeight\n\t\t\t\t\t\tobj.style.height=phoneHeight*scal+\"px\";\n\t\t\t\t\t\tobj.style.width=phoneHeight*scal*r+\"px\";\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t//this.dbPlayVideo(url);\n\t\t\t\tobj.play(url);\n\n\t\t\t},\n\t\t\treSetVideo(eventType) {\n\t\t\t\tvar obj = this.$refs.gisqLibUploadVideoPlayer;\n\n\t\t\t\tvar isFull = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement ||\n\t\t\t\t\tdocument.webkitFullscreenElement || false;\n\t\t\t\tvar url = this.gisqVideoUrl;\n\t\t\t\tif (obj && !isFull) {\n\t\t\t\t\tobj.pause();\n\t\t\t\t\tobj.src = url;\n\t\t\t\t\tobj.load();\n\n\t\t\t\t\tobj.currentTime = 0;\n\t\t\t\t\tobj.style.objectFit = \"fill\";\n\t\t\t\t\tobj.parentNode.childNodes[0].style.display = \"block\";\n\t\t\t\t\tobj.addEventListener(eventType, null);\n\t\t\t\t\tobj = null;\n\t\t\t\t}\n\t\t\t},\n\t\t\tmaskEventDeal: function(event) {\n\n\t\t\t\tif (event.target != this.$refs.gisqLibUploadVideoPlayer) {\n\t\t\t\t\tevent.stopPropagation();\n\t\t\t\t}\n\t\t\t},\n\t\t\tclosePlayVideoMask: function() {\n\t\t\t\tthis.showMaskDialog = false;\n\t\t\t\tthis.gisqVideoUrl = \"\";\n\t\t\t\tthis.$refs.gisqLibUploadVideoPlayer.pause();\n\t\t\t},\n\t\t\tonPlayerEnded: function(event) {\n\n\t\t\t},\n\t\t\tgetVideoBase64: function(url) {\n\t\t\t\tvar _self=this;\n\t\t\t\treturn new Promise(function(resolve, reject) {\n\t\t\t\t\tlet dataURL = '';\n\t\t\t\t\tlet video = document.createElement(\"video\");\n\t\t\t\t\tvideo.setAttribute('crossOrigin', 'anonymous'); //处理跨域\n\t\t\t\t\tvideo.setAttribute('src', url);\n\t\t\t\t\tvideo.setAttribute('width', 400);\n\t\t\t\t\tvideo.setAttribute('height',240);\n\t\t\t\t\tvideo.currentTime = 2\n\t\t\t\t\tvideo.addEventListener('loadeddata', function() {\n\t\t\t\t\t\tconsole.log(11111)\n\t\t\t\t\t\tlet canvas = document.createElement(\"canvas\");\n\t\t\t\t\t\tlet width = video.width; //canvas的尺寸和图片一样\n\t\t\t\t\t\tlet height = video.height;\n\t\t\t\t\t\t_self.videoWidth=this.videoWidth;\n\t\t\t\t\t\t_self.videoHeight=this.videoHeight;\n\t\t\t\t\t\tvar cContext=canvas.getContext(\"2d\");\n\t\t\t\t\t\tcContext.fillStyle = \"#fff\";\n\t\t\t\t\t\tcanvas.width = width;\n\t\t\t\t\t\tcanvas.height = height;\n\t\t\t\t\t\tcContext.fillRect(0, 0, canvas.width, canvas.height);\n\t\t\t\t\t\tcContext.drawImage(video, 0, 0, width, height); //绘制canvas\n\t\t\t\t\t\tdataURL = canvas.toDataURL('image/jpeg'); //转换为base64\n\t\t\t\t\t\tvideo.currentTime = 0\n\t\t\t\t\t\tresolve(dataURL);\n\t\t\t\t\t});\n\t\t\t\t})\n\t\t\t},\n\t\t\t\n\t\t},\n\t\tmounted() {\n\t\t\tvar _self = this;\n\t\t\tthis.plusReady(function() {\n\t\t\t\thbuilder=true;\n\t\t\t\t_self.isHbuilder = true;\n\t\t\t\t\n\t\t\t});\n\t\t},\n\t\tcreated() {\n\t\t\t//alert(1)\n\t\t},\n\t\t\n\t}\n\t/* export function getDeviceInfo(callback){\n\t\tconsole.log(\"call getDeviceInfo success\" )\n\t\tif(hbuilder==false) throw \"请在hbuilder环境使用\";\n\t\tif(!!callback&&hbuilder==true) callback(plus.device.getInfo(options));\n\t} */\n</script>\n\n<style>\n\t@import url(\"../../src/assets/css/iconfont.css\");\n\n\n\n\tdiv.popContainer {\n\t\tposition: fixed;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tbackground: rgba(0, 0, 0, 0.3);\n\t\tz-index: 999;\n\t\tpadding: 16px;\n\t}\n\n\t.gisqlib-upload-videomask-close-div {\n\t\tposition: absolute;\n\t\ttop: -40px;\n\t\tright: -40px;\n\t\twidth: 80px;\n\t\theight: 80px;\n\t\tborder-radius: 40px;\n\t\tbackground-color: #00002250;\n\t}\n\n\t.gisqlib-upload-videomask-close-div:active {\n\n\t\tbackground-color: #000000;\n\t}\n\n\t.gisqlib-upload-videomask-closeIcon {\n\t\tposition: absolute;\n\t\tbottom: 10%;\n\t\tleft: 30%;\n\t\ttransform: translate(-50%, -50%);\n\t\tcolor: #FFFFFF;\n\t}\n\n\t.gisqlib-upload-video {\n\t\tposition: absolute;\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\twidth: 80%;\n\t\theight: 80%;\n\t\tobject-fit: fill;\n\t\ttransform: translate(-50%, -50%);\n\t}\n\n\t.gisq-upload-video-icon {\n\t\tposition: absolute;\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\ttransform: translate(-50%, -50%);\n\t}\n\n\t.gisq-image-showsmall-div {\n\t\tfloat: left;\n\t\tborder: 1px;\n\t\tpadding: 2px;\n\t\tmargin-right: 2px;\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t}\n\n\t.gisqUploadActionSheet {\n\t\ttext-align: center;\n\t}\n\n\t.gisqUpload-delete-root-div {\n\t\tposition: absolute;\n\t\twidth: 50px;\n\t\theight: 50px;\n\t\tbackground-color: red;\n\t\ttop: -25px;\n\t\tright: -25px;\n\t\tz-index: 999;\n\t\ttransform: rotate(45deg);\n\t}\n\n\t.gisqUpload-icon-delete-span {\n\t\tposition: absolute;\n\t\tleft: 50%;\n\t\tbottom: 0;\n\t\ttransform: translate(-50%, -0%);\n\t}\n\n\t.gisqupload-div-action-plus {\n\t\tfloat: left;\n\t\twidth: 80px;\n\t\theight: 80px;\n\t\tline-height: 80px;\n\t\ttext-align: center;\n\t\tborder: 1px dashed #CFCFCF;\n\t\tmargin-right: 2px;\n\t}\n\n\t.gisq-small-image {\n\t\ttext-align: center;\n\t\twidth: 80px;\n\t\theight: 80px;\n\t\tobject-fit: contain;\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "e0b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var redefineAll = __webpack_require__("dcbc");
var meta = __webpack_require__("67ab");
var forOf = __webpack_require__("4a59");
var anInstance = __webpack_require__("f605");
var isObject = __webpack_require__("d3f4");
var fails = __webpack_require__("79e5");
var $iterDetect = __webpack_require__("5cc5");
var setToStringTag = __webpack_require__("7f20");
var inheritIfRequired = __webpack_require__("5dbc");

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "ec30":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__("9e1e")) {
  var LIBRARY = __webpack_require__("2d00");
  var global = __webpack_require__("7726");
  var fails = __webpack_require__("79e5");
  var $export = __webpack_require__("5ca1");
  var $typed = __webpack_require__("0f88");
  var $buffer = __webpack_require__("ed0b");
  var ctx = __webpack_require__("9b43");
  var anInstance = __webpack_require__("f605");
  var propertyDesc = __webpack_require__("4630");
  var hide = __webpack_require__("32e9");
  var redefineAll = __webpack_require__("dcbc");
  var toInteger = __webpack_require__("4588");
  var toLength = __webpack_require__("9def");
  var toIndex = __webpack_require__("09fa");
  var toAbsoluteIndex = __webpack_require__("77f1");
  var toPrimitive = __webpack_require__("6a99");
  var has = __webpack_require__("69a8");
  var classof = __webpack_require__("23c6");
  var isObject = __webpack_require__("d3f4");
  var toObject = __webpack_require__("4bf8");
  var isArrayIter = __webpack_require__("33a4");
  var create = __webpack_require__("2aeb");
  var getPrototypeOf = __webpack_require__("38fd");
  var gOPN = __webpack_require__("9093").f;
  var getIterFn = __webpack_require__("27ee");
  var uid = __webpack_require__("ca5a");
  var wks = __webpack_require__("2b4c");
  var createArrayMethod = __webpack_require__("0a49");
  var createArrayIncludes = __webpack_require__("c366");
  var speciesConstructor = __webpack_require__("ebd6");
  var ArrayIterators = __webpack_require__("cadf");
  var Iterators = __webpack_require__("84f2");
  var $iterDetect = __webpack_require__("5cc5");
  var setSpecies = __webpack_require__("7a56");
  var arrayFill = __webpack_require__("36bd");
  var arrayCopyWithin = __webpack_require__("ba92");
  var $DP = __webpack_require__("86cc");
  var $GOPD = __webpack_require__("11e9");
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),

/***/ "ed0b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var DESCRIPTORS = __webpack_require__("9e1e");
var LIBRARY = __webpack_require__("2d00");
var $typed = __webpack_require__("0f88");
var hide = __webpack_require__("32e9");
var redefineAll = __webpack_require__("dcbc");
var fails = __webpack_require__("79e5");
var anInstance = __webpack_require__("f605");
var toInteger = __webpack_require__("4588");
var toLength = __webpack_require__("9def");
var toIndex = __webpack_require__("09fa");
var gOPN = __webpack_require__("9093").f;
var dP = __webpack_require__("86cc").f;
var arrayFill = __webpack_require__("36bd");
var setToStringTag = __webpack_require__("7f20");
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),

/***/ "f400":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__("c26b");
var validate = __webpack_require__("b39a");
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__("e0b8")(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5679ba66-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/upload.vue?vue&type=template&id=3a6a09ff&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"uploadRoot"},[_c('div',{directives:[{name:"viewer",rawName:"v-viewer",value:(_vm.zoomOptions),expression:"zoomOptions"}],staticClass:"zoomimages"},[_vm._l((_vm.fileMap),function(item,key){return _c('div',{staticClass:"gisq-image-showsmall-div",attrs:{"ckey":_vm.fileMapStateTrack},on:{"click":function($event){return _vm.handleOpen(item[1],$event)}}},[_c('img',{key:item[0],staticClass:"gisq-small-image",attrs:{"src":item[1].type=='picture'?item[1].src:item[1].poster,"alt":item[0]}}),_c('div',{staticClass:"gisqUpload gisqUpload-delete-root-div",attrs:{"cKey":item[0]},on:{"click":function($event){return _vm.showDelDialogAction(item[0],$event)}}},[_c('span',{staticClass:"iconfont-gisqupload icon-shanchu gisqUpload-icon-delete-span"})]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(item[1].type==='video'),expression:"item[1].type==='video'"}],staticClass:"gisq-upload-video-icon"},[_c('i',{staticClass:"iconfont-gisqupload icon-circle-video",staticStyle:{"font-size":"2rem","color":"#FFFFFF"}})])])}),_c('div',{staticClass:"gisqupload-div-action-plus",on:{"click":_vm.showSheet}},[_c('span',{staticClass:"iconfont-gisqupload icon-plus-line"})])],2),_c('div',{staticClass:"gisqUploadActionSheet"},[_c('gisqSheet',{attrs:{"p_visiable":_vm.iShow,"p_title":_vm.iTitle,"p_sheetItems":_vm.sheetItems},on:{"update:p_visiable":function($event){_vm.iShow=$event},"clickOnSheet":_vm.clickOnSheet}})],1),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showMaskDialog),expression:"showMaskDialog"}],staticClass:"popContainer"},[_c('video',{ref:"gisqLibUploadVideoPlayer",staticClass:"gisqlib-upload-video",attrs:{"controls":"controls"},on:{"ended":function($event){return _vm.onPlayerEnded($event)}}},[_c('source',{attrs:{"src":_vm.gisqVideoUrl,"type":"video/mp4"}})]),_c('div',{staticClass:"gisqlib-upload-videomask-close-div",on:{"click":function($event){return _vm.closePlayVideoMask()}}},[_c('i',{staticClass:"iconfont-gisqupload icon-close gisqlib-upload-videomask-closeIcon"})])]),_c('input',{ref:"gisqLibUploadInputFileH5",attrs:{"hidden":"hidden","type":"file","multiple":"multiple","accept":"image/*,video/*"}}),_c('input',{ref:"gisqLibUploadInputFileVideoH5",attrs:{"hidden":"hidden","type":"file","multiple":"multiple","accept":"video/*"}}),_c('dialog-bar',{attrs:{"type":"danger","title":"警告!","content":"确定删除图片?","dangerText":"删除"},on:{"cancel":function($event){return _vm.clickCancel()},"danger":function($event){return _vm.clickDanger()},"confirm":function($event){return _vm.clickConfirm()}},model:{value:(_vm.showDelDialog),callback:function ($$v) {_vm.showDelDialog=$$v},expression:"showDelDialog"}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./gisq/upload/upload.vue?vue&type=template&id=3a6a09ff&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.index-of.js
var es6_array_index_of = __webpack_require__("57e7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("5df3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.map.js
var es6_map = __webpack_require__("f400");

// EXTERNAL MODULE: ./node_modules/viewerjs/dist/viewer.css
var viewer = __webpack_require__("0808");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5679ba66-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/sheet.vue?vue&type=template&id=50877a93&
var sheetvue_type_template_id_50877a93_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.p_visiable)?_c('div',{staticClass:"wrapper"},[_c('div',{ref:"box",staticClass:"gisq-dialog",on:{"click":function($event){$event.stopPropagation();}}},[(_vm.p_title != null)?_c('div',{staticClass:"gisq-title"},[_vm._v("\n\t\t\t"+_vm._s(_vm.p_title)+"\n\t\t")]):_vm._e(),_c('div',{staticClass:"gisq-items"},[_c('div',{staticClass:"gisq-line"}),_vm._l((_vm.p_sheetItems),function(item,index){return _c('div',{key:index,staticClass:"gisq-item",on:{"click":function($event){return _vm.clickOnSheetItem(item)}}},[_c('div',[_vm._v(_vm._s(item.name))]),_c('div',{staticClass:"gisq-line"})])})],2),_c('div',{staticClass:"gisq-cancel",on:{"click":function($event){return _vm.dismiss()}}},[_vm._v("取消")])])]):_vm._e()}
var sheetvue_type_template_id_50877a93_staticRenderFns = []


// CONCATENATED MODULE: ./gisq/upload/sheet.vue?vue&type=template&id=50877a93&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/sheet.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var sheetvue_type_script_lang_js_ = ({
  name: "gisq-sheet",
  props: {
    p_title: null,
    p_cancelable: {
      type: Boolean,
      default: true
    },
    p_visiable: false,
    p_sheetItems: Array
  },
  data: function data() {
    return {};
  },
  methods: {
    dismiss: function dismiss() {
      this.$emit("update:p_visiable", false);
    },
    clickOnSheetItem: function clickOnSheetItem(obj) {
      this.dismiss();
      this.$emit("clickOnSheet", obj);
    }
  }
});
// CONCATENATED MODULE: ./gisq/upload/sheet.vue?vue&type=script&lang=js&
 /* harmony default export */ var upload_sheetvue_type_script_lang_js_ = (sheetvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./gisq/upload/sheet.vue?vue&type=style&index=0&lang=css&
var sheetvue_type_style_index_0_lang_css_ = __webpack_require__("93aa");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./gisq/upload/sheet.vue






/* normalize component */

var component = normalizeComponent(
  upload_sheetvue_type_script_lang_js_,
  sheetvue_type_template_id_50877a93_render,
  sheetvue_type_template_id_50877a93_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var sheet = (component.exports);
// EXTERNAL MODULE: ./node_modules/v-viewer/dist/v-viewer.js
var v_viewer = __webpack_require__("6944");
var v_viewer_default = /*#__PURE__*/__webpack_require__.n(v_viewer);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5679ba66-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/dialog.vue?vue&type=template&id=734032dc&
var dialogvue_type_template_id_734032dc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showMask),expression:"showMask"}],staticClass:"dialog"},[_c('div',{staticClass:"dialog-container"},[_c('div',{staticClass:"dialog-title"},[_vm._v(_vm._s(_vm.title))]),_c('div',{staticClass:"content",domProps:{"innerHTML":_vm._s(_vm.content)}}),_c('div',{staticClass:"btns"},[(_vm.type != 'confirm')?_c('div',{staticClass:"default-btn",on:{"click":_vm.closeBtn}},[_vm._v("\n                "+_vm._s(_vm.cancelText)+"\n            ")]):_vm._e(),(_vm.type == 'danger')?_c('div',{staticClass:"danger-btn",on:{"click":_vm.dangerBtn}},[_vm._v("\n                "+_vm._s(_vm.dangerText)+"\n            ")]):_vm._e(),(_vm.type == 'confirm')?_c('div',{staticClass:"confirm-btn",on:{"click":_vm.confirmBtn}},[_vm._v("\n                "+_vm._s(_vm.confirmText)+"\n            ")]):_vm._e()]),_c('div',{staticClass:"close-btn",on:{"click":_vm.closeMask}},[_c('i',{staticClass:"iconfont-gisqupload icon-close"})])])])}
var dialogvue_type_template_id_734032dc_staticRenderFns = []


// CONCATENATED MODULE: ./gisq/upload/dialog.vue?vue&type=template&id=734032dc&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/dialog.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var dialogvue_type_script_lang_js_ = ({
  props: {
    value: {},
    // 类型包括 defalut 默认， danger 危险， confirm 确认，
    type: {
      type: String,
      default: 'default'
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    dangerText: {
      type: String,
      default: '删除'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  data: function data() {
    return {
      showMask: false
    };
  },
  methods: {
    closeMask: function closeMask() {
      this.showMask = false;
    },
    closeBtn: function closeBtn() {
      this.$emit('cancel');
      this.closeMask();
    },
    dangerBtn: function dangerBtn() {
      this.$emit('danger');
      this.closeMask();
    },
    confirmBtn: function confirmBtn() {
      this.$emit('confirm');
      this.closeMask();
    }
  },
  mounted: function mounted() {
    this.showMask = this.value;
  },
  watch: {
    value: function value(newVal, oldVal) {
      this.showMask = newVal;
    },
    showMask: function showMask(val) {
      this.$emit('input', val);
    }
  }
});
// CONCATENATED MODULE: ./gisq/upload/dialog.vue?vue&type=script&lang=js&
 /* harmony default export */ var upload_dialogvue_type_script_lang_js_ = (dialogvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./gisq/upload/dialog.vue?vue&type=style&index=0&lang=css&
var dialogvue_type_style_index_0_lang_css_ = __webpack_require__("8944");

// CONCATENATED MODULE: ./gisq/upload/dialog.vue






/* normalize component */

var dialog_component = normalizeComponent(
  upload_dialogvue_type_script_lang_js_,
  dialogvue_type_template_id_734032dc_render,
  dialogvue_type_template_id_734032dc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var dialog = (dialog_component.exports);
// CONCATENATED MODULE: ./gisq/upload/util/device.js
function getDeviceInfo(callback) {
  console.log("call getDeviceInfo success");
  if (!!callback) plus.device.getInfo({
    success: function success(e) {
      callback(e);
    },
    fail: function fail(e) {
      callback(e);
    }
  });
}
/* harmony default export */ var device = ({
  getDeviceInfo: getDeviceInfo
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.uint8-array.js
var es6_typed_uint8_array = __webpack_require__("34ef");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__("4917");

// CONCATENATED MODULE: ./gisq/upload/util/fileUtils.js




function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime
  });
}
function fileUtils_readFile(path, entry, callback) {
  if (!!path) {
    var fileReader = new plus.io.FileReader();

    fileReader.onloadend = function (evt) {
      var url = evt.target.result;
      var fileJs = dataURLtoFile(url, entry.name); //转换为js 的file对象 

      var jsBlob = URL.createObjectURL(fileJs);

      if (!!callback) {
        callback(fileJs, jsBlob);
      }
    };

    fileReader.readAsDataURL(entry);
  }
}
function readLocalFile(path, callback) {
  plus.io.resolveLocalFileSystemURL(path, function (entry) {
    // 可通过entry对象操作test.html文件 
    fileUtils_readFile(path, entry, callback);
  }, function (e) {
    alert("Resolve file URL failed: " + e.message);
  });
}
/* harmony default export */ var fileUtils = ({
  readLocalFile: readLocalFile,
  dataURLtoFile: dataURLtoFile
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./gisq/upload/upload.vue?vue&type=script&lang=js&








//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

 //import duoImageViewer from "./photoView/src/index.vue"






external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(v_viewer_default.a);
var hbuilder = false; //Viewer.setDefaults( {Options:{ "inline": true, "button": true, "navbar": true, "title": true, "toolbar": false, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" } })

/* harmony default export */ var uploadvue_type_script_lang_js_ = ({
  getDeviceInfo: getDeviceInfo,
  readLocalFile: readLocalFile,
  name: "gisqUpload",
  components: {
    gisqSheet: sheet,
    dialogBar: dialog //duoImageViewer

  },
  props: {
    extraInfo: {
      type: String,
      default: ""
    },
    files: Array,
    onBeforeDeleted: Function,
    onBeforeAdded: Function,
    onDeleted: Function,
    onAdded: Function,
    onCustomPrewer: {
      type: Function,
      default: undefined
    }
  },
  watch: {
    files: {
      deep: true,
      immediate: true,
      handler: function handler(newVal, oldVal) {
        console.log(this.files);
        if (!this.files) return;

        if (this.files.length == 0) {
          console.log(1);
          this.refresh();
          return;
        }

        this.addedFileMap = new Map();
        this.fileMap = new Map();

        for (var i = 0; i < this.files.length; i++) {
          var fileType = this.getFileType(this.files[i]);
          var path = this.files[i];
          console.log(fileType);

          if (fileType == "video") {
            this.dealVideo(path, 'video');
          } else {
            this.updateFileMap(path, path, fileType, "", "show");
          }
        }
      }
    }
  },
  data: function data() {
    return {
      delKey: "",
      showDelDialog: false,
      fileMapStateTrack: 0,
      gisqVideoUrl: "",
      showMaskDialog: false,
      videoHeight: 240,
      videoWidth: 400,
      isHbuilder: false,
      currentValue: false,
      iTitle: "类型选择",
      iLeft: "取消",
      iShow: false,
      sheetItems: [{
        id: 1,
        name: "拍照"
      }, {
        id: 2,
        name: "选取图片"
      }, {
        id: 3,
        name: "选取视频"
      }],
      addedFileMap: new Map(),
      fileMap: new Map(),
      index: 0,
      showViewer: false,
      bigSrc: "",
      srcList: [],
      zoomOptions: {
        inline: false,
        button: true,
        navbar: false,
        //去除左右滑动切换
        title: false,
        toolbar: {
          zoomIn: 0,
          zoomOut: 0,
          oneToOne: 0,
          reset: 0,
          prev: 0,
          play: 0,
          next: 0,
          rotateLeft: 0,
          rotateRight: 0,
          flipHorizontal: 0,
          flipVertical: 0
        },
        tooltip: false,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: false,
        fullscreen: true,
        keyboard: true
      }
    };
  },
  methods: {
    dealVideo: function dealVideo(path, fileType) {
      var _self = this;

      this.getVideoBase64(path).then(function (dataUrl) {
        _self.updateFileMap(path, path, fileType, dataUrl, "show");
      });
    },
    refresh: function refresh() {
      this.addedFileMap = new Map();
      this.fileMap = new Map();
      this.$forceUpdate();
      this.onChange();
    },
    clickCancel: function clickCancel() {
      console.log('点击了取消');
      this.delKey = "";
    },
    clickDanger: function clickDanger() {
      console.log('这里是danger回调');
      this.deleteSelectedFile(this.delKey);
      this.delKey = "";
    },
    clickConfirm: function clickConfirm() {
      console.log('点击了confirm');
    },
    getFileType: function getFileType(path) {
      var fileType = "picture";

      if (!!path) {
        var types = path.split(".");

        if (types.length >= 2) {
          var type = types[types.length - 1].toLowerCase();

          if (type === "mp4" || type === "mov" || type === "avi" || type === "wmv" || type === "3gp" || type === "mkv" || type === "rmvb" || type === "webm" || type === "flv" || type === "qsv") {
            fileType = "video";
          }
        }
      }

      return fileType;
    },
    showSheet: function showSheet() {
      this.iShow = true;
    },
    clickOnSheet: function clickOnSheet(obj) {
      if (this.isHbuilder == true) {
        try {
          var cameraActivity = plus.android.importClass("com.zjzs.gisq.jetpack.aar_camara.CamaraActivity");

          if (obj.id == 1) {
            this.takePhoto();
          } else if (obj.id == 3) {
            this.chooseVideoH5();
          } else {
            this.choosePhoto();
          }
        } catch (e) {
          //to call H5's takePhoto
          if (obj.id == 1) {
            this.takePhotoH5();
          } else if (obj.id == 3) {
            this.chooseVideoH5();
          } else {
            this.choosePhotoH5();
          }
        }
      } else {
        //to call H5's takePhoto
        if (obj.id == 1) {
          this.takePhotoH5();
        } else if (obj.id == 3) {
          this.chooseVideoH5();
        } else {
          this.choosePhotoH5();
        }
      }
    },
    takePhotoH5: function takePhotoH5() {
      var h5FileEl = this.$refs.gisqLibUploadInputFileH5;

      var _self = this;

      h5FileEl.onchange = function (e) {
        _self.handleH5InputChange(this.files);
      };

      h5FileEl.click();
    },
    chooseVideoH5: function chooseVideoH5() {
      var _self = this;

      var h5FileEl = this.$refs.gisqLibUploadInputFileVideoH5;

      h5FileEl.onchange = function (e) {
        _self.handleH5InputChange(this.files);
      };

      h5FileEl.click();
    },
    choosePhotoH5: function choosePhotoH5() {
      var _self = this;

      var h5FileEl = this.$refs.gisqLibUploadInputFileH5;

      h5FileEl.onchange = function (e) {
        _self.handleH5InputChange(this.files);
      };

      h5FileEl.click();
    },
    handleH5InputChange: function handleH5InputChange(files) {
      if (!!files) {
        console.log(files);

        for (var i = 0; i < files.length; i++) {
          this.readH5File(files[i]);
        }
      }
    },
    readH5File: function readH5File(file) {
      var jsBlob = URL.createObjectURL(file);
      var fileType = this.getFileType(file.name);

      var _self = this;

      if (fileType === "video") {
        _self.getVideoBase64(jsBlob).then(function (dataUrl) {
          _self.updateFileMap(file.name, jsBlob, fileType, dataUrl, "add", file);
        });
      } else {
        _self.updateFileMap(file.name, jsBlob, fileType, "", "add", file);
      }
    },
    takePhoto: function takePhoto() {
      var _self = this;

      if (_self.isHbuilder == true) {
        /* var main = plus.android.runtimeMainActivity();
        var IntentA = plus.android.importClass("android.content.Intent");
        //var cameraActivity = plus.android.importClass("com.zjzs.gisq.jetpack.aar_camara.CamaraActivity"); //自己写的二维码扫描页面
        //alert(cameraActivity)
        //var intent = new Intent(main, cameraActivity.class);
        
        //intent.setClassName(main, cameraActivity.class);
        var intent = new IntentA(); */
        //intent.setPackage("com.zjzs.gisq.qcjg");
        //intent.setAction("com.zjzs.gisq.jetpack.aar_camara.CamaraActivity");
        var main = plus.android.runtimeMainActivity();
        var Intent = plus.android.importClass("android.content.Intent");
        var cameraActivity = plus.android.importClass("com.zjzs.gisq.jetpack.aar_camara.CamaraActivity"); //自己写的二维码扫描页面

        var intent = new Intent(main, cameraActivity.class);
        intent.putExtra("extraInfo", this.extraInfo); //intent.setClassName(main, cameraActivity.class);

        main.onActivityResult = function (requestCode, resultCode, data) {
          if (100 == requestCode) {
            plus.android.importClass(data);
            var bundle = data.getExtras();
            plus.android.importClass(bundle);
            var addphoto = bundle.getString("addphoto"); ///获取新拍
            //alert("addphoto=" + addphoto);

            var jsonPaths = JSON.parse(addphoto);

            for (var idx in jsonPaths) {
              //alert("sss==="+jsonPaths[idx].path);
              _self.parseFile("file://" + jsonPaths[idx].path);
            }
          }
        };

        main.startActivityForResult(intent, 100);
      }
    },
    choosePhoto: function choosePhoto() {
      var _self = this;
      /* var pSrc="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.virtualtelescope.eu%2Fwordpress%2Fwp-content%2Fuploads%2F2018%2F11%2F2018-11-11-Moon-Saturn_Barnaba.jpg&refer=http%3A%2F%2Fwww.virtualtelescope.eu&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619860628&t=52e2ee9f5825302530acdc86003deff3"
      _self.updateFileMap(_self.index+"",pSrc,"picture","","add");
      var vSrc="https://wts.itqiche.com/u5/car_u5_video/XuHang.mp4";
      this.getVideoBase64(vSrc).then(function(dataUrl){
      	_self.updateFileMap((_self.index+1)+"",vSrc,"video",dataUrl,"add");
      })
      _self.index++; */


      if (_self.isHbuilder == true) {
        // 从相册中选择图片
        console.log("从相册中选择多张图片:");
        plus.gallery.pick(function (e) {
          for (var i in e.files) {
            //alert("sss===" + e.files[i]);
            _self.parseFile(e.files[i]);
          }
        }, function (e) {
          console.log("取消选择图片");
        }, {
          filter: "image",
          multiple: true,
          maximum: 100000,
          system: false,
          onmaxed: function onmaxed() {
            plus.nativeUI.alert('最多只能选择4张图片');
          }
        });
      }
    },
    parseFile: function parseFile(path) {
      var _self = this;

      if (_self.isHbuilder == true) {
        if (!!path) {
          var types = path.split(".");
          var fileType = "picture";
          fileType = _self.getFileType(path);

          if (path.indexOf("http") >= 0) {
            if (fileType === "video") {
              this.getVideoBase64(path).then(function (dataURL) {
                console.log(111);

                _self.updateFileMap(path, path, fileType, dataUrl, "add");
              });
            } else {
              _self.updateFileMap(path, path, fileType, "", "add");
            }

            return;
          } else {
            _self.readLocalFile(path, fileType);
            /* readLocalFile(path,function(fileJs,jsBlob){
            	_self.updateFileMap(path,jsBlob,fileType,"","add",fileJs);
            }); */

          }
        }
      }
    },
    readFile: function readFile(path, fileType, entry) {
      var _self = this;

      if (_self.isHbuilder == true && !!path) {
        var fileReader = new plus.io.FileReader();

        fileReader.onloadend = function (evt) {
          var url = evt.target.result;
          var fileJs = dataURLtoFile(url, entry.name); //转换为js 的file对象 

          var jsBlob = URL.createObjectURL(fileJs);

          if (fileType === "video") {
            _self.getVideoBase64(jsBlob).then(function (dataUrl) {
              _self.updateFileMap(path, jsBlob, fileType, dataUrl, "add", fileJs);
            });
          } else {
            _self.updateFileMap(path, jsBlob, fileType, "", "add", fileJs);
          }
        };

        fileReader.readAsDataURL(entry);
      }
    },
    readLocalFile: function readLocalFile(path, fileType) {
      var _self = this;

      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        // 可通过entry对象操作test.html文件 
        _self.readFile(path, fileType, entry);
      }, function (e) {
        alert("Resolve file URL failed: " + e.message);
      });
    },
    updateFileMap: function updateFileMap(path, jsBlob, fileType, posterDataUrl, actionType, jsFile) {
      this.beforeAdded(path);
      var isServer = false;

      if (path.indexOf("http") == 0) {
        isServer = true;
      }

      var fileObj = {
        src: jsBlob,
        poster: posterDataUrl,
        type: fileType,
        actionType: actionType,
        isServer: isServer
      };
      this.fileMap.set(path, fileObj);
      this.fileMapStateTrack++;
      console.log(this.fileMap);

      if (actionType === "add") {
        var addedObj = jsFile || jsBlob;
        this.addedFileMap.set(path, addedObj);
        this.addedFile(path);
        this.onChange();
      }

      this.$forceUpdate();
    },
    plusReady: function plusReady(callback) {
      if (window.plus) {
        callback();
      } else {
        document.addEventListener('plusready', callback);
      }
    },
    showDelDialogAction: function showDelDialogAction(key, e) {
      this.showDelDialog = true;
      this.delKey = key;
      e.stopPropagation();
    },
    deleteSelectedFile: function deleteSelectedFile(key) {
      this.$refs.gisqLibUploadInputFileH5.value = "";
      var fileObj = this.fileMap.get(key);
      this.beforeDeleted(key);
      this.fileMap.delete(key);
      this.fileMapStateTrack--;
      this.$forceUpdate();
      this.addedFileMap.delete(key);
      this.deletedFile(key);
      this.onChange();
      event.stopPropagation();
    },
    beforeAdded: function beforeAdded(key) {
      this.$emit("onBeforeAdded", key);
    },
    beforeDeleted: function beforeDeleted(key) {
      this.$emit("onBeforeDeleted", key);
    },
    deletedFile: function deletedFile(key) {
      this.$emit("onDeleted", key);
    },
    addedFile: function addedFile(key) {
      this.$emit("onAdded", key, this.addedFileMap.get(key));
    },
    onChange: function onChange() {
      this.$emit("onChange", this.addedFileMap);
    },
    handleOpen: function handleOpen(item, event) {
      var src = item.src;
      var type = item.type;

      if (type === "video") {
        this.showMaskDialog = true;
        this.gisqVideoUrl = src;
        console.log(src);
        this.playVideo(this.$refs.gisqLibUploadVideoPlayer, src);
        event.stopPropagation();
        return;
      } else {
        if (!!this.onCustomPrewer == true) {
          this.onCustomPrewer(src);
          event.stopPropagation();
          return;
        }

        this.bigSrc = src;
        this.showViewer = !this.showViewer;
        var viewer = this.$el.querySelector('.zoomimages').$viewer;
        viewer.show();
      }
    },
    handleClose: function handleClose() {
      this.showViewer = false;
    },

    /**
     * 图片按宽高比例进行自动缩放
     * @param ImgObj
     *     缩放图片源对象
     * @param maxWidth
     *     允许缩放的最大宽度
     * @param maxHeight
     *     允许缩放的最大高度
     * @usage 
     *     调用：<img src="图片" οnlοad="javascript:DrawImage(this,100,100)">
     */
    DrawBetterImage: function DrawBetterImage(ImgObj, maxWidth, maxHeight) {
      var image = new Image(); //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）

      image.src = ImgObj.src; // 用于设定图片的宽度和高度

      var tempWidth;
      var tempHeight;

      if (image.width > 0 && image.height > 0) {
        //原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
        console.log(1);

        if (image.width / image.height >= maxWidth / maxHeight) {
          console.log(2);

          if (image.width > maxWidth) {
            console.log(3);
            tempWidth = maxWidth; // 按原图片的比例进行缩放

            tempHeight = image.height * maxWidth / image.width;
          } else {
            console.log(4); // 按原图片的大小进行缩放

            tempWidth = image.width;
            tempHeight = image.height;
          }
        } else {
          // 原图片的高度必然 > 宽度
          console.log(5);

          if (image.height > maxHeight) {
            console.log(6);
            tempHeight = maxHeight; // 按原图片的比例进行缩放

            tempWidth = image.width * maxHeight / image.height;
          } else {
            console.log(7); // 按原图片的大小进行缩放

            tempWidth = image.width;
            tempHeight = image.height;
          }
        } // 设置页面图片的宽和高


        ImgObj.height = tempHeight;
        ImgObj.width = tempWidth; // 提示图片的原来大小

        ImgObj.alt = image.width + "×" + image.height;
      }
    },
    dbPlayVideo: function dbPlayVideo(url) {
      //进入全屏
      var obj = this.$refs.gisqLibUploadVideoPlayer;

      if (obj.requestFullscreen) {
        obj.requestFullscreen();
      } else if (obj.mozRequestFullScreen) {
        obj.mozRequestFullScreen();
      } else if (obj.webkitRequestFullScreen) {
        obj.webkitRequestFullScreen();
      }

      obj.play(url);
      obj.parentNode.childNodes[0].style.display = "none";
    },
    //退出全屏
    exitFullscreen: function exitFullscreen(id) {
      var obj = this.$refs.gisqLibUploadVideoPlayer;

      if (document.exitFullscreen && obj.style.objectFit == "") {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }

      obj.parentNode.childNodes[0].style.display = "block";
      setTimeout(function () {
        obj.style.objectFit = "fill";
      }, 500);
    },
    playVideo: function playVideo(obj, url) {
      obj.style.objectFit = "";

      var _this = this;

      obj.src = url; //视频横屏

      var phoneWidth = document.documentElement.clientWidth;
      var phoneHeight = document.documentElement.clientHeight;
      var scal = 0.92;

      if (phoneHeight < phoneWidth) {
        //横屏
        if (this.videoHeight > this.videoWidth) {
          //高大于宽
          var r = this.videoWidth / this.videoHeight;
          obj.style.height = phoneHeight * scal + "px";
          obj.style.width = phoneHeight * scal * r + "px";
        } else {
          var r = this.videoHeight / this.videoWidth;
          obj.style.width = phoneWidth * scal + "px";
          obj.style.height = phoneWidth * scal * r + "px";
        }
      } else {
        if (this.videoHeight < this.videoWidth) {
          //高大于宽
          var r = this.videoHeight / this.videoWidth;
          obj.style.width = phoneWidth * scal + "px";
          obj.style.height = phoneWidth * scal * r + "px";
        } else {
          var r = this.videoWidth / this.videoHeight;
          obj.style.height = phoneHeight * scal + "px";
          obj.style.width = phoneHeight * scal * r + "px";
        }
      } //this.dbPlayVideo(url);


      obj.play(url);
    },
    reSetVideo: function reSetVideo(eventType) {
      var obj = this.$refs.gisqLibUploadVideoPlayer;
      var isFull = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
      var url = this.gisqVideoUrl;

      if (obj && !isFull) {
        obj.pause();
        obj.src = url;
        obj.load();
        obj.currentTime = 0;
        obj.style.objectFit = "fill";
        obj.parentNode.childNodes[0].style.display = "block";
        obj.addEventListener(eventType, null);
        obj = null;
      }
    },
    maskEventDeal: function maskEventDeal(event) {
      if (event.target != this.$refs.gisqLibUploadVideoPlayer) {
        event.stopPropagation();
      }
    },
    closePlayVideoMask: function closePlayVideoMask() {
      this.showMaskDialog = false;
      this.gisqVideoUrl = "";
      this.$refs.gisqLibUploadVideoPlayer.pause();
    },
    onPlayerEnded: function onPlayerEnded(event) {},
    getVideoBase64: function getVideoBase64(url) {
      var _self = this;

      return new Promise(function (resolve, reject) {
        var dataURL = '';
        var video = document.createElement("video");
        video.setAttribute('crossOrigin', 'anonymous'); //处理跨域

        video.setAttribute('src', url);
        video.setAttribute('width', 400);
        video.setAttribute('height', 240);
        video.currentTime = 2;
        video.addEventListener('loadeddata', function () {
          console.log(11111);
          var canvas = document.createElement("canvas");
          var width = video.width; //canvas的尺寸和图片一样

          var height = video.height;
          _self.videoWidth = this.videoWidth;
          _self.videoHeight = this.videoHeight;
          var cContext = canvas.getContext("2d");
          cContext.fillStyle = "#fff";
          canvas.width = width;
          canvas.height = height;
          cContext.fillRect(0, 0, canvas.width, canvas.height);
          cContext.drawImage(video, 0, 0, width, height); //绘制canvas

          dataURL = canvas.toDataURL('image/jpeg'); //转换为base64

          video.currentTime = 0;
          resolve(dataURL);
        });
      });
    }
  },
  mounted: function mounted() {
    var _self = this;

    this.plusReady(function () {
      hbuilder = true;
      _self.isHbuilder = true;
    });
  },
  created: function created() {//alert(1)
  }
});
/* export function getDeviceInfo(callback){
	console.log("call getDeviceInfo success" )
	if(hbuilder==false) throw "请在hbuilder环境使用";
	if(!!callback&&hbuilder==true) callback(plus.device.getInfo(options));
} */
// CONCATENATED MODULE: ./gisq/upload/upload.vue?vue&type=script&lang=js&
 /* harmony default export */ var upload_uploadvue_type_script_lang_js_ = (uploadvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./gisq/upload/upload.vue?vue&type=style&index=0&lang=css&
var uploadvue_type_style_index_0_lang_css_ = __webpack_require__("8194");

// CONCATENATED MODULE: ./gisq/upload/upload.vue






/* normalize component */

var upload_component = normalizeComponent(
  upload_uploadvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var upload = (upload_component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (upload);



/***/ })

/******/ })["default"];
//# sourceMappingURL=gisqMobileUpload.common.js.map