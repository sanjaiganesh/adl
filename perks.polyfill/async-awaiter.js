
if (!global.__awaiter) {
  global.__awaiter = (thisArg, _arguments, P, generator) => new Promise((resolve, reject) => {
    var fulfilled = (value) => { try { step(generator.next(value)); } catch (e) { reject(e); } }
    var rejected = (value) => { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    var step = (result) => { result.done ? resolve(result.value) : new Promise((resolve) => { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.call(thisArg, _arguments)).next());
  });

  global.__asyncDelegator = function (o) {
    var i = { next: verb("next"), "throw": verb("throw", function (e) { throw e; }), "return": verb("return", function (v) { return { value: v, done: true }; }) };
    return o = __asyncValues(o), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { return function (v) { return { value: ["delegate", (o[n] || f).call(o, v)], done: false }; }; }
  };

  global.__asyncGenerator = function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), q = [], c, i;
    return i = { next: verb("next"), "throw": verb("throw"), "return": verb("return") }, i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { return function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]), next(); }); }; }
    function next() { if (!c && q.length) resume((c = q.shift())[0], c[1]); }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(c[3], e); } }
    function step(r) { r.done ? settle(c[2], r) : r.value[0] === "yield" ? settle(c[2], { value: r.value[1], done: false }) : Promise.resolve(r.value[1]).then(r.value[0] === "delegate" ? delegate : fulfill, reject); }
    function delegate(r) { step(r.done ? r : { value: ["yield", r.value], done: false }); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { c = void 0, f(v), next(); }
  };

  global.__asyncValues = function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
  };

  global.__decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  require('source-map-support').install({ hookRequire: true });
}