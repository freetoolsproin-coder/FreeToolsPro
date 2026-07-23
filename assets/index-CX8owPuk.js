(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const a of document.querySelectorAll('link[rel="modulepreload"]')) i(a);
  new MutationObserver((a) => {
    for (const u of a)
      if (u.type === "childList")
        for (const c of u.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && i(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(a) {
    const u = {};
    return (
      a.integrity && (u.integrity = a.integrity),
      a.referrerPolicy && (u.referrerPolicy = a.referrerPolicy),
      a.crossOrigin === "use-credentials"
        ? (u.credentials = "include")
        : a.crossOrigin === "anonymous"
          ? (u.credentials = "omit")
          : (u.credentials = "same-origin"),
      u
    );
  }
  function i(a) {
    if (a.ep) return;
    a.ep = !0;
    const u = s(a);
    fetch(a.href, u);
  }
})();
function bi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ru = { exports: {} },
  oi = {},
  Iu = { exports: {} },
  le = {};
var Qh;
function RS() {
  if (Qh) return le;
  Qh = 1;
  var e = Symbol.for("react.element"),
    t = Symbol.for("react.portal"),
    s = Symbol.for("react.fragment"),
    i = Symbol.for("react.strict_mode"),
    a = Symbol.for("react.profiler"),
    u = Symbol.for("react.provider"),
    c = Symbol.for("react.context"),
    f = Symbol.for("react.forward_ref"),
    p = Symbol.for("react.suspense"),
    g = Symbol.for("react.memo"),
    y = Symbol.for("react.lazy"),
    v = Symbol.iterator;
  function w(N) {
    return N === null || typeof N != "object"
      ? null
      : ((N = (v && N[v]) || N["@@iterator"]), typeof N == "function" ? N : null);
  }
  var E = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    b = Object.assign,
    A = {};
  function k(N, O, ae) {
    ((this.props = N), (this.context = O), (this.refs = A), (this.updater = ae || E));
  }
  ((k.prototype.isReactComponent = {}),
    (k.prototype.setState = function (N, O) {
      if (typeof N != "object" && typeof N != "function" && N != null)
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, N, O, "setState");
    }),
    (k.prototype.forceUpdate = function (N) {
      this.updater.enqueueForceUpdate(this, N, "forceUpdate");
    }));
  function R() {}
  R.prototype = k.prototype;
  function D(N, O, ae) {
    ((this.props = N), (this.context = O), (this.refs = A), (this.updater = ae || E));
  }
  var M = (D.prototype = new R());
  ((M.constructor = D), b(M, k.prototype), (M.isPureReactComponent = !0));
  var $ = Array.isArray,
    z = Object.prototype.hasOwnProperty,
    J = { current: null },
    te = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Q(N, O, ae) {
    var ue,
      pe = {},
      he = null,
      xe = null;
    if (O != null)
      for (ue in (O.ref !== void 0 && (xe = O.ref), O.key !== void 0 && (he = "" + O.key), O))
        z.call(O, ue) && !te.hasOwnProperty(ue) && (pe[ue] = O[ue]);
    var ge = arguments.length - 2;
    if (ge === 1) pe.children = ae;
    else if (1 < ge) {
      for (var Te = Array(ge), yt = 0; yt < ge; yt++) Te[yt] = arguments[yt + 2];
      pe.children = Te;
    }
    if (N && N.defaultProps)
      for (ue in ((ge = N.defaultProps), ge)) pe[ue] === void 0 && (pe[ue] = ge[ue]);
    return { $$typeof: e, type: N, key: he, ref: xe, props: pe, _owner: J.current };
  }
  function fe(N, O) {
    return { $$typeof: e, type: N.type, key: O, ref: N.ref, props: N.props, _owner: N._owner };
  }
  function ce(N) {
    return typeof N == "object" && N !== null && N.$$typeof === e;
  }
  function _e(N) {
    var O = { "=": "=0", ":": "=2" };
    return (
      "$" +
      N.replace(/[=:]/g, function (ae) {
        return O[ae];
      })
    );
  }
  var Fe = /\/+/g;
  function et(N, O) {
    return typeof N == "object" && N !== null && N.key != null ? _e("" + N.key) : O.toString(36);
  }
  function at(N, O, ae, ue, pe) {
    var he = typeof N;
    (he === "undefined" || he === "boolean") && (N = null);
    var xe = !1;
    if (N === null) xe = !0;
    else
      switch (he) {
        case "string":
        case "number":
          xe = !0;
          break;
        case "object":
          switch (N.$$typeof) {
            case e:
            case t:
              xe = !0;
          }
      }
    if (xe)
      return (
        (xe = N),
        (pe = pe(xe)),
        (N = ue === "" ? "." + et(xe, 0) : ue),
        $(pe)
          ? ((ae = ""),
            N != null && (ae = N.replace(Fe, "$&/") + "/"),
            at(pe, O, ae, "", function (yt) {
              return yt;
            }))
          : pe != null &&
            (ce(pe) &&
              (pe = fe(
                pe,
                ae +
                  (!pe.key || (xe && xe.key === pe.key)
                    ? ""
                    : ("" + pe.key).replace(Fe, "$&/") + "/") +
                  N
              )),
            O.push(pe)),
        1
      );
    if (((xe = 0), (ue = ue === "" ? "." : ue + ":"), $(N)))
      for (var ge = 0; ge < N.length; ge++) {
        he = N[ge];
        var Te = ue + et(he, ge);
        xe += at(he, O, ae, Te, pe);
      }
    else if (((Te = w(N)), typeof Te == "function"))
      for (N = Te.call(N), ge = 0; !(he = N.next()).done;)
        ((he = he.value), (Te = ue + et(he, ge++)), (xe += at(he, O, ae, Te, pe)));
    else if (he === "object")
      throw (
        (O = String(N)),
        Error(
          "Objects are not valid as a React child (found: " +
            (O === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : O) +
            "). If you meant to render a collection of children, use an array instead."
        )
      );
    return xe;
  }
  function gt(N, O, ae) {
    if (N == null) return N;
    var ue = [],
      pe = 0;
    return (
      at(N, ue, "", "", function (he) {
        return O.call(ae, he, pe++);
      }),
      ue
    );
  }
  function tt(N) {
    if (N._status === -1) {
      var O = N._result;
      ((O = O()),
        O.then(
          function (ae) {
            (N._status === 0 || N._status === -1) && ((N._status = 1), (N._result = ae));
          },
          function (ae) {
            (N._status === 0 || N._status === -1) && ((N._status = 2), (N._result = ae));
          }
        ),
        N._status === -1 && ((N._status = 0), (N._result = O)));
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var oe = { current: null },
    U = { transition: null },
    q = { ReactCurrentDispatcher: oe, ReactCurrentBatchConfig: U, ReactCurrentOwner: J };
  function H() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return (
    (le.Children = {
      map: gt,
      forEach: function (N, O, ae) {
        gt(
          N,
          function () {
            O.apply(this, arguments);
          },
          ae
        );
      },
      count: function (N) {
        var O = 0;
        return (
          gt(N, function () {
            O++;
          }),
          O
        );
      },
      toArray: function (N) {
        return (
          gt(N, function (O) {
            return O;
          }) || []
        );
      },
      only: function (N) {
        if (!ce(N))
          throw Error("React.Children.only expected to receive a single React element child.");
        return N;
      },
    }),
    (le.Component = k),
    (le.Fragment = s),
    (le.Profiler = a),
    (le.PureComponent = D),
    (le.StrictMode = i),
    (le.Suspense = p),
    (le.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = q),
    (le.act = H),
    (le.cloneElement = function (N, O, ae) {
      if (N == null)
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " + N + "."
        );
      var ue = b({}, N.props),
        pe = N.key,
        he = N.ref,
        xe = N._owner;
      if (O != null) {
        if (
          (O.ref !== void 0 && ((he = O.ref), (xe = J.current)),
          O.key !== void 0 && (pe = "" + O.key),
          N.type && N.type.defaultProps)
        )
          var ge = N.type.defaultProps;
        for (Te in O)
          z.call(O, Te) &&
            !te.hasOwnProperty(Te) &&
            (ue[Te] = O[Te] === void 0 && ge !== void 0 ? ge[Te] : O[Te]);
      }
      var Te = arguments.length - 2;
      if (Te === 1) ue.children = ae;
      else if (1 < Te) {
        ge = Array(Te);
        for (var yt = 0; yt < Te; yt++) ge[yt] = arguments[yt + 2];
        ue.children = ge;
      }
      return { $$typeof: e, type: N.type, key: pe, ref: he, props: ue, _owner: xe };
    }),
    (le.createContext = function (N) {
      return (
        (N = {
          $$typeof: c,
          _currentValue: N,
          _currentValue2: N,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (N.Provider = { $$typeof: u, _context: N }),
        (N.Consumer = N)
      );
    }),
    (le.createElement = Q),
    (le.createFactory = function (N) {
      var O = Q.bind(null, N);
      return ((O.type = N), O);
    }),
    (le.createRef = function () {
      return { current: null };
    }),
    (le.forwardRef = function (N) {
      return { $$typeof: f, render: N };
    }),
    (le.isValidElement = ce),
    (le.lazy = function (N) {
      return { $$typeof: y, _payload: { _status: -1, _result: N }, _init: tt };
    }),
    (le.memo = function (N, O) {
      return { $$typeof: g, type: N, compare: O === void 0 ? null : O };
    }),
    (le.startTransition = function (N) {
      var O = U.transition;
      U.transition = {};
      try {
        N();
      } finally {
        U.transition = O;
      }
    }),
    (le.unstable_act = H),
    (le.useCallback = function (N, O) {
      return oe.current.useCallback(N, O);
    }),
    (le.useContext = function (N) {
      return oe.current.useContext(N);
    }),
    (le.useDebugValue = function () {}),
    (le.useDeferredValue = function (N) {
      return oe.current.useDeferredValue(N);
    }),
    (le.useEffect = function (N, O) {
      return oe.current.useEffect(N, O);
    }),
    (le.useId = function () {
      return oe.current.useId();
    }),
    (le.useImperativeHandle = function (N, O, ae) {
      return oe.current.useImperativeHandle(N, O, ae);
    }),
    (le.useInsertionEffect = function (N, O) {
      return oe.current.useInsertionEffect(N, O);
    }),
    (le.useLayoutEffect = function (N, O) {
      return oe.current.useLayoutEffect(N, O);
    }),
    (le.useMemo = function (N, O) {
      return oe.current.useMemo(N, O);
    }),
    (le.useReducer = function (N, O, ae) {
      return oe.current.useReducer(N, O, ae);
    }),
    (le.useRef = function (N) {
      return oe.current.useRef(N);
    }),
    (le.useState = function (N) {
      return oe.current.useState(N);
    }),
    (le.useSyncExternalStore = function (N, O, ae) {
      return oe.current.useSyncExternalStore(N, O, ae);
    }),
    (le.useTransition = function () {
      return oe.current.useTransition();
    }),
    (le.version = "18.3.1"),
    le
  );
}
var Jh;
function nd() {
  return (Jh || ((Jh = 1), (Iu.exports = RS())), Iu.exports);
}
var Zh;
function IS() {
  if (Zh) return oi;
  Zh = 1;
  var e = nd(),
    t = Symbol.for("react.element"),
    s = Symbol.for("react.fragment"),
    i = Object.prototype.hasOwnProperty,
    a = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    u = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(f, p, g) {
    var y,
      v = {},
      w = null,
      E = null;
    (g !== void 0 && (w = "" + g),
      p.key !== void 0 && (w = "" + p.key),
      p.ref !== void 0 && (E = p.ref));
    for (y in p) i.call(p, y) && !u.hasOwnProperty(y) && (v[y] = p[y]);
    if (f && f.defaultProps) for (y in ((p = f.defaultProps), p)) v[y] === void 0 && (v[y] = p[y]);
    return { $$typeof: t, type: f, key: w, ref: E, props: v, _owner: a.current };
  }
  return ((oi.Fragment = s), (oi.jsx = c), (oi.jsxs = c), oi);
}
var em;
function AS() {
  return (em || ((em = 1), (Ru.exports = IS())), Ru.exports);
}
var h = AS(),
  _ = nd();
const dn = bi(_);
var qo = {},
  Au = { exports: {} },
  pt = {},
  Mu = { exports: {} },
  Du = {};
var tm;
function MS() {
  return (
    tm ||
      ((tm = 1),
      (function (e) {
        function t(U, q) {
          var H = U.length;
          U.push(q);
          e: for (; 0 < H;) {
            var N = (H - 1) >>> 1,
              O = U[N];
            if (0 < a(O, q)) ((U[N] = q), (U[H] = O), (H = N));
            else break e;
          }
        }
        function s(U) {
          return U.length === 0 ? null : U[0];
        }
        function i(U) {
          if (U.length === 0) return null;
          var q = U[0],
            H = U.pop();
          if (H !== q) {
            U[0] = H;
            e: for (var N = 0, O = U.length, ae = O >>> 1; N < ae;) {
              var ue = 2 * (N + 1) - 1,
                pe = U[ue],
                he = ue + 1,
                xe = U[he];
              if (0 > a(pe, H))
                he < O && 0 > a(xe, pe)
                  ? ((U[N] = xe), (U[he] = H), (N = he))
                  : ((U[N] = pe), (U[ue] = H), (N = ue));
              else if (he < O && 0 > a(xe, H)) ((U[N] = xe), (U[he] = H), (N = he));
              else break e;
            }
          }
          return q;
        }
        function a(U, q) {
          var H = U.sortIndex - q.sortIndex;
          return H !== 0 ? H : U.id - q.id;
        }
        if (typeof performance == "object" && typeof performance.now == "function") {
          var u = performance;
          e.unstable_now = function () {
            return u.now();
          };
        } else {
          var c = Date,
            f = c.now();
          e.unstable_now = function () {
            return c.now() - f;
          };
        }
        var p = [],
          g = [],
          y = 1,
          v = null,
          w = 3,
          E = !1,
          b = !1,
          A = !1,
          k = typeof setTimeout == "function" ? setTimeout : null,
          R = typeof clearTimeout == "function" ? clearTimeout : null,
          D = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function M(U) {
          for (var q = s(g); q !== null;) {
            if (q.callback === null) i(g);
            else if (q.startTime <= U) (i(g), (q.sortIndex = q.expirationTime), t(p, q));
            else break;
            q = s(g);
          }
        }
        function $(U) {
          if (((A = !1), M(U), !b))
            if (s(p) !== null) ((b = !0), tt(z));
            else {
              var q = s(g);
              q !== null && oe($, q.startTime - U);
            }
        }
        function z(U, q) {
          ((b = !1), A && ((A = !1), R(Q), (Q = -1)), (E = !0));
          var H = w;
          try {
            for (M(q), v = s(p); v !== null && (!(v.expirationTime > q) || (U && !_e()));) {
              var N = v.callback;
              if (typeof N == "function") {
                ((v.callback = null), (w = v.priorityLevel));
                var O = N(v.expirationTime <= q);
                ((q = e.unstable_now()),
                  typeof O == "function" ? (v.callback = O) : v === s(p) && i(p),
                  M(q));
              } else i(p);
              v = s(p);
            }
            if (v !== null) var ae = !0;
            else {
              var ue = s(g);
              (ue !== null && oe($, ue.startTime - q), (ae = !1));
            }
            return ae;
          } finally {
            ((v = null), (w = H), (E = !1));
          }
        }
        var J = !1,
          te = null,
          Q = -1,
          fe = 5,
          ce = -1;
        function _e() {
          return !(e.unstable_now() - ce < fe);
        }
        function Fe() {
          if (te !== null) {
            var U = e.unstable_now();
            ce = U;
            var q = !0;
            try {
              q = te(!0, U);
            } finally {
              q ? et() : ((J = !1), (te = null));
            }
          } else J = !1;
        }
        var et;
        if (typeof D == "function")
          et = function () {
            D(Fe);
          };
        else if (typeof MessageChannel < "u") {
          var at = new MessageChannel(),
            gt = at.port2;
          ((at.port1.onmessage = Fe),
            (et = function () {
              gt.postMessage(null);
            }));
        } else
          et = function () {
            k(Fe, 0);
          };
        function tt(U) {
          ((te = U), J || ((J = !0), et()));
        }
        function oe(U, q) {
          Q = k(function () {
            U(e.unstable_now());
          }, q);
        }
        ((e.unstable_IdlePriority = 5),
          (e.unstable_ImmediatePriority = 1),
          (e.unstable_LowPriority = 4),
          (e.unstable_NormalPriority = 3),
          (e.unstable_Profiling = null),
          (e.unstable_UserBlockingPriority = 2),
          (e.unstable_cancelCallback = function (U) {
            U.callback = null;
          }),
          (e.unstable_continueExecution = function () {
            b || E || ((b = !0), tt(z));
          }),
          (e.unstable_forceFrameRate = function (U) {
            0 > U || 125 < U
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
                )
              : (fe = 0 < U ? Math.floor(1e3 / U) : 5);
          }),
          (e.unstable_getCurrentPriorityLevel = function () {
            return w;
          }),
          (e.unstable_getFirstCallbackNode = function () {
            return s(p);
          }),
          (e.unstable_next = function (U) {
            switch (w) {
              case 1:
              case 2:
              case 3:
                var q = 3;
                break;
              default:
                q = w;
            }
            var H = w;
            w = q;
            try {
              return U();
            } finally {
              w = H;
            }
          }),
          (e.unstable_pauseExecution = function () {}),
          (e.unstable_requestPaint = function () {}),
          (e.unstable_runWithPriority = function (U, q) {
            switch (U) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                U = 3;
            }
            var H = w;
            w = U;
            try {
              return q();
            } finally {
              w = H;
            }
          }),
          (e.unstable_scheduleCallback = function (U, q, H) {
            var N = e.unstable_now();
            switch (
              (typeof H == "object" && H !== null
                ? ((H = H.delay), (H = typeof H == "number" && 0 < H ? N + H : N))
                : (H = N),
              U)
            ) {
              case 1:
                var O = -1;
                break;
              case 2:
                O = 250;
                break;
              case 5:
                O = 1073741823;
                break;
              case 4:
                O = 1e4;
                break;
              default:
                O = 5e3;
            }
            return (
              (O = H + O),
              (U = {
                id: y++,
                callback: q,
                priorityLevel: U,
                startTime: H,
                expirationTime: O,
                sortIndex: -1,
              }),
              H > N
                ? ((U.sortIndex = H),
                  t(g, U),
                  s(p) === null && U === s(g) && (A ? (R(Q), (Q = -1)) : (A = !0), oe($, H - N)))
                : ((U.sortIndex = O), t(p, U), b || E || ((b = !0), tt(z))),
              U
            );
          }),
          (e.unstable_shouldYield = _e),
          (e.unstable_wrapCallback = function (U) {
            var q = w;
            return function () {
              var H = w;
              w = q;
              try {
                return U.apply(this, arguments);
              } finally {
                w = H;
              }
            };
          }));
      })(Du)),
    Du
  );
}
var nm;
function DS() {
  return (nm || ((nm = 1), (Mu.exports = MS())), Mu.exports);
}
var rm;
function LS() {
  if (rm) return pt;
  rm = 1;
  var e = nd(),
    t = DS();
  function s(n) {
    for (
      var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, o = 1;
      o < arguments.length;
      o++
    )
      r += "&args[]=" + encodeURIComponent(arguments[o]);
    return (
      "Minified React error #" +
      n +
      "; visit " +
      r +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  var i = new Set(),
    a = {};
  function u(n, r) {
    (c(n, r), c(n + "Capture", r));
  }
  function c(n, r) {
    for (a[n] = r, n = 0; n < r.length; n++) i.add(r[n]);
  }
  var f = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    p = Object.prototype.hasOwnProperty,
    g =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    y = {},
    v = {};
  function w(n) {
    return p.call(v, n) ? !0 : p.call(y, n) ? !1 : g.test(n) ? (v[n] = !0) : ((y[n] = !0), !1);
  }
  function E(n, r, o, l) {
    if (o !== null && o.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return l
          ? !1
          : o !== null
            ? !o.acceptsBooleans
            : ((n = n.toLowerCase().slice(0, 5)), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function b(n, r, o, l) {
    if (r === null || typeof r > "u" || E(n, r, o, l)) return !0;
    if (l) return !1;
    if (o !== null)
      switch (o.type) {
        case 3:
          return !r;
        case 4:
          return r === !1;
        case 5:
          return isNaN(r);
        case 6:
          return isNaN(r) || 1 > r;
      }
    return !1;
  }
  function A(n, r, o, l, d, m, x) {
    ((this.acceptsBooleans = r === 2 || r === 3 || r === 4),
      (this.attributeName = l),
      (this.attributeNamespace = d),
      (this.mustUseProperty = o),
      (this.propertyName = n),
      (this.type = r),
      (this.sanitizeURL = m),
      (this.removeEmptyString = x));
  }
  var k = {};
  ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (n) {
      k[n] = new A(n, 0, !1, n, null, !1, !1);
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (n) {
      var r = n[0];
      k[r] = new A(r, 1, !1, n[1], null, !1, !1);
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (n) {
      k[n] = new A(n, 2, !1, n.toLowerCase(), null, !1, !1);
    }),
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(
      function (n) {
        k[n] = new A(n, 2, !1, n, null, !1, !1);
      }
    ),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (n) {
        k[n] = new A(n, 3, !1, n.toLowerCase(), null, !1, !1);
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (n) {
      k[n] = new A(n, 3, !0, n, null, !1, !1);
    }),
    ["capture", "download"].forEach(function (n) {
      k[n] = new A(n, 4, !1, n, null, !1, !1);
    }),
    ["cols", "rows", "size", "span"].forEach(function (n) {
      k[n] = new A(n, 6, !1, n, null, !1, !1);
    }),
    ["rowSpan", "start"].forEach(function (n) {
      k[n] = new A(n, 5, !1, n.toLowerCase(), null, !1, !1);
    }));
  var R = /[\-:]([a-z])/g;
  function D(n) {
    return n[1].toUpperCase();
  }
  ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (n) {
      var r = n.replace(R, D);
      k[r] = new A(r, 1, !1, n, null, !1, !1);
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
      .split(" ")
      .forEach(function (n) {
        var r = n.replace(R, D);
        k[r] = new A(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
      }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (n) {
      var r = n.replace(R, D);
      k[r] = new A(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }),
    ["tabIndex", "crossOrigin"].forEach(function (n) {
      k[n] = new A(n, 1, !1, n.toLowerCase(), null, !1, !1);
    }),
    (k.xlinkHref = new A("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1)),
    ["src", "href", "action", "formAction"].forEach(function (n) {
      k[n] = new A(n, 1, !1, n.toLowerCase(), null, !0, !0);
    }));
  function M(n, r, o, l) {
    var d = k.hasOwnProperty(r) ? k[r] : null;
    (d !== null
      ? d.type !== 0
      : l || !(2 < r.length) || (r[0] !== "o" && r[0] !== "O") || (r[1] !== "n" && r[1] !== "N")) &&
      (b(r, o, d, l) && (o = null),
      l || d === null
        ? w(r) && (o === null ? n.removeAttribute(r) : n.setAttribute(r, "" + o))
        : d.mustUseProperty
          ? (n[d.propertyName] = o === null ? (d.type === 3 ? !1 : "") : o)
          : ((r = d.attributeName),
            (l = d.attributeNamespace),
            o === null
              ? n.removeAttribute(r)
              : ((d = d.type),
                (o = d === 3 || (d === 4 && o === !0) ? "" : "" + o),
                l ? n.setAttributeNS(l, r, o) : n.setAttribute(r, o))));
  }
  var $ = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    z = Symbol.for("react.element"),
    J = Symbol.for("react.portal"),
    te = Symbol.for("react.fragment"),
    Q = Symbol.for("react.strict_mode"),
    fe = Symbol.for("react.profiler"),
    ce = Symbol.for("react.provider"),
    _e = Symbol.for("react.context"),
    Fe = Symbol.for("react.forward_ref"),
    et = Symbol.for("react.suspense"),
    at = Symbol.for("react.suspense_list"),
    gt = Symbol.for("react.memo"),
    tt = Symbol.for("react.lazy"),
    oe = Symbol.for("react.offscreen"),
    U = Symbol.iterator;
  function q(n) {
    return n === null || typeof n != "object"
      ? null
      : ((n = (U && n[U]) || n["@@iterator"]), typeof n == "function" ? n : null);
  }
  var H = Object.assign,
    N;
  function O(n) {
    if (N === void 0)
      try {
        throw Error();
      } catch (o) {
        var r = o.stack.trim().match(/\n( *(at )?)/);
        N = (r && r[1]) || "";
      }
    return (
      `
` +
      N +
      n
    );
  }
  var ae = !1;
  function ue(n, r) {
    if (!n || ae) return "";
    ae = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r)
        if (
          ((r = function () {
            throw Error();
          }),
          Object.defineProperty(r.prototype, "props", {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(r, []);
          } catch (I) {
            var l = I;
          }
          Reflect.construct(n, [], r);
        } else {
          try {
            r.call();
          } catch (I) {
            l = I;
          }
          n.call(r.prototype);
        }
      else {
        try {
          throw Error();
        } catch (I) {
          l = I;
        }
        n();
      }
    } catch (I) {
      if (I && l && typeof I.stack == "string") {
        for (
          var d = I.stack.split(`
`),
            m = l.stack.split(`
`),
            x = d.length - 1,
            S = m.length - 1;
          1 <= x && 0 <= S && d[x] !== m[S];
        )
          S--;
        for (; 1 <= x && 0 <= S; x--, S--)
          if (d[x] !== m[S]) {
            if (x !== 1 || S !== 1)
              do
                if ((x--, S--, 0 > S || d[x] !== m[S])) {
                  var T =
                    `
` + d[x].replace(" at new ", " at ");
                  return (
                    n.displayName &&
                      T.includes("<anonymous>") &&
                      (T = T.replace("<anonymous>", n.displayName)),
                    T
                  );
                }
              while (1 <= x && 0 <= S);
            break;
          }
      }
    } finally {
      ((ae = !1), (Error.prepareStackTrace = o));
    }
    return (n = n ? n.displayName || n.name : "") ? O(n) : "";
  }
  function pe(n) {
    switch (n.tag) {
      case 5:
        return O(n.type);
      case 16:
        return O("Lazy");
      case 13:
        return O("Suspense");
      case 19:
        return O("SuspenseList");
      case 0:
      case 2:
      case 15:
        return ((n = ue(n.type, !1)), n);
      case 11:
        return ((n = ue(n.type.render, !1)), n);
      case 1:
        return ((n = ue(n.type, !0)), n);
      default:
        return "";
    }
  }
  function he(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case te:
        return "Fragment";
      case J:
        return "Portal";
      case fe:
        return "Profiler";
      case Q:
        return "StrictMode";
      case et:
        return "Suspense";
      case at:
        return "SuspenseList";
    }
    if (typeof n == "object")
      switch (n.$$typeof) {
        case _e:
          return (n.displayName || "Context") + ".Consumer";
        case ce:
          return (n._context.displayName || "Context") + ".Provider";
        case Fe:
          var r = n.render;
          return (
            (n = n.displayName),
            n ||
              ((n = r.displayName || r.name || ""),
              (n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef")),
            n
          );
        case gt:
          return ((r = n.displayName || null), r !== null ? r : he(n.type) || "Memo");
        case tt:
          ((r = n._payload), (n = n._init));
          try {
            return he(n(r));
          } catch {}
      }
    return null;
  }
  function xe(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return (
          (n = r.render),
          (n = n.displayName || n.name || ""),
          r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef")
        );
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return he(r);
      case 8:
        return r === Q ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function ge(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Te(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function yt(n) {
    var r = Te(n) ? "checked" : "value",
      o = Object.getOwnPropertyDescriptor(n.constructor.prototype, r),
      l = "" + n[r];
    if (
      !n.hasOwnProperty(r) &&
      typeof o < "u" &&
      typeof o.get == "function" &&
      typeof o.set == "function"
    ) {
      var d = o.get,
        m = o.set;
      return (
        Object.defineProperty(n, r, {
          configurable: !0,
          get: function () {
            return d.call(this);
          },
          set: function (x) {
            ((l = "" + x), m.call(this, x));
          },
        }),
        Object.defineProperty(n, r, { enumerable: o.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (x) {
            l = "" + x;
          },
          stopTracking: function () {
            ((n._valueTracker = null), delete n[r]);
          },
        }
      );
    }
  }
  function Vi(n) {
    n._valueTracker || (n._valueTracker = yt(n));
  }
  function nf(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var o = r.getValue(),
      l = "";
    return (
      n && (l = Te(n) ? (n.checked ? "true" : "false") : n.value),
      (n = l),
      n !== o ? (r.setValue(n), !0) : !1
    );
  }
  function Bi(n) {
    if (((n = n || (typeof document < "u" ? document : void 0)), typeof n > "u")) return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Fa(n, r) {
    var o = r.checked;
    return H({}, r, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: o ?? n._wrapperState.initialChecked,
    });
  }
  function rf(n, r) {
    var o = r.defaultValue == null ? "" : r.defaultValue,
      l = r.checked != null ? r.checked : r.defaultChecked;
    ((o = ge(r.value != null ? r.value : o)),
      (n._wrapperState = {
        initialChecked: l,
        initialValue: o,
        controlled:
          r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null,
      }));
  }
  function sf(n, r) {
    ((r = r.checked), r != null && M(n, "checked", r, !1));
  }
  function Va(n, r) {
    sf(n, r);
    var o = ge(r.value),
      l = r.type;
    if (o != null)
      l === "number"
        ? ((o === 0 && n.value === "") || n.value != o) && (n.value = "" + o)
        : n.value !== "" + o && (n.value = "" + o);
    else if (l === "submit" || l === "reset") {
      n.removeAttribute("value");
      return;
    }
    (r.hasOwnProperty("value")
      ? Ba(n, r.type, o)
      : r.hasOwnProperty("defaultValue") && Ba(n, r.type, ge(r.defaultValue)),
      r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked));
  }
  function of(n, r, o) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var l = r.type;
      if (!((l !== "submit" && l !== "reset") || (r.value !== void 0 && r.value !== null))) return;
      ((r = "" + n._wrapperState.initialValue),
        o || r === n.value || (n.value = r),
        (n.defaultValue = r));
    }
    ((o = n.name),
      o !== "" && (n.name = ""),
      (n.defaultChecked = !!n._wrapperState.initialChecked),
      o !== "" && (n.name = o));
  }
  function Ba(n, r, o) {
    (r !== "number" || Bi(n.ownerDocument) !== n) &&
      (o == null
        ? (n.defaultValue = "" + n._wrapperState.initialValue)
        : n.defaultValue !== "" + o && (n.defaultValue = "" + o));
  }
  var Ss = Array.isArray;
  function Er(n, r, o, l) {
    if (((n = n.options), r)) {
      r = {};
      for (var d = 0; d < o.length; d++) r["$" + o[d]] = !0;
      for (o = 0; o < n.length; o++)
        ((d = r.hasOwnProperty("$" + n[o].value)),
          n[o].selected !== d && (n[o].selected = d),
          d && l && (n[o].defaultSelected = !0));
    } else {
      for (o = "" + ge(o), r = null, d = 0; d < n.length; d++) {
        if (n[d].value === o) {
          ((n[d].selected = !0), l && (n[d].defaultSelected = !0));
          return;
        }
        r !== null || n[d].disabled || (r = n[d]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function $a(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(s(91));
    return H({}, r, {
      value: void 0,
      defaultValue: void 0,
      children: "" + n._wrapperState.initialValue,
    });
  }
  function af(n, r) {
    var o = r.value;
    if (o == null) {
      if (((o = r.children), (r = r.defaultValue), o != null)) {
        if (r != null) throw Error(s(92));
        if (Ss(o)) {
          if (1 < o.length) throw Error(s(93));
          o = o[0];
        }
        r = o;
      }
      (r == null && (r = ""), (o = r));
    }
    n._wrapperState = { initialValue: ge(o) };
  }
  function lf(n, r) {
    var o = ge(r.value),
      l = ge(r.defaultValue);
    (o != null &&
      ((o = "" + o),
      o !== n.value && (n.value = o),
      r.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o)),
      l != null && (n.defaultValue = "" + l));
  }
  function uf(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function cf(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Ua(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml"
      ? cf(r)
      : n === "http://www.w3.org/2000/svg" && r === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : n;
  }
  var $i,
    df = (function (n) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (r, o, l, d) {
            MSApp.execUnsafeLocalFunction(function () {
              return n(r, o, l, d);
            });
          }
        : n;
    })(function (n, r) {
      if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
      else {
        for (
          $i = $i || document.createElement("div"),
            $i.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>",
            r = $i.firstChild;
          n.firstChild;
        )
          n.removeChild(n.firstChild);
        for (; r.firstChild;) n.appendChild(r.firstChild);
      }
    });
  function Es(n, r) {
    if (r) {
      var o = n.firstChild;
      if (o && o === n.lastChild && o.nodeType === 3) {
        o.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var _s = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    Dx = ["Webkit", "ms", "Moz", "O"];
  Object.keys(_s).forEach(function (n) {
    Dx.forEach(function (r) {
      ((r = r + n.charAt(0).toUpperCase() + n.substring(1)), (_s[r] = _s[n]));
    });
  });
  function ff(n, r, o) {
    return r == null || typeof r == "boolean" || r === ""
      ? ""
      : o || typeof r != "number" || r === 0 || (_s.hasOwnProperty(n) && _s[n])
        ? ("" + r).trim()
        : r + "px";
  }
  function pf(n, r) {
    n = n.style;
    for (var o in r)
      if (r.hasOwnProperty(o)) {
        var l = o.indexOf("--") === 0,
          d = ff(o, r[o], l);
        (o === "float" && (o = "cssFloat"), l ? n.setProperty(o, d) : (n[o] = d));
      }
  }
  var Lx = H(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    }
  );
  function za(n, r) {
    if (r) {
      if (Lx[n] && (r.children != null || r.dangerouslySetInnerHTML != null))
        throw Error(s(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(s(60));
        if (
          typeof r.dangerouslySetInnerHTML != "object" ||
          !("__html" in r.dangerouslySetInnerHTML)
        )
          throw Error(s(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(s(62));
    }
  }
  function Ha(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Wa = null;
  function Ga(n) {
    return (
      (n = n.target || n.srcElement || window),
      n.correspondingUseElement && (n = n.correspondingUseElement),
      n.nodeType === 3 ? n.parentNode : n
    );
  }
  var Ka = null,
    _r = null,
    Tr = null;
  function hf(n) {
    if ((n = Ws(n))) {
      if (typeof Ka != "function") throw Error(s(280));
      var r = n.stateNode;
      r && ((r = co(r)), Ka(n.stateNode, n.type, r));
    }
  }
  function mf(n) {
    _r ? (Tr ? Tr.push(n) : (Tr = [n])) : (_r = n);
  }
  function gf() {
    if (_r) {
      var n = _r,
        r = Tr;
      if (((Tr = _r = null), hf(n), r)) for (n = 0; n < r.length; n++) hf(r[n]);
    }
  }
  function yf(n, r) {
    return n(r);
  }
  function vf() {}
  var Ya = !1;
  function xf(n, r, o) {
    if (Ya) return n(r, o);
    Ya = !0;
    try {
      return yf(n, r, o);
    } finally {
      ((Ya = !1), (_r !== null || Tr !== null) && (vf(), gf()));
    }
  }
  function Ts(n, r) {
    var o = n.stateNode;
    if (o === null) return null;
    var l = co(o);
    if (l === null) return null;
    o = l[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((l = !l.disabled) ||
          ((n = n.type),
          (l = !(n === "button" || n === "input" || n === "select" || n === "textarea"))),
          (n = !l));
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (o && typeof o != "function") throw Error(s(231, r, typeof o));
    return o;
  }
  var Xa = !1;
  if (f)
    try {
      var Cs = {};
      (Object.defineProperty(Cs, "passive", {
        get: function () {
          Xa = !0;
        },
      }),
        window.addEventListener("test", Cs, Cs),
        window.removeEventListener("test", Cs, Cs));
    } catch {
      Xa = !1;
    }
  function Ox(n, r, o, l, d, m, x, S, T) {
    var I = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(o, I);
    } catch (F) {
      this.onError(F);
    }
  }
  var ks = !1,
    Ui = null,
    zi = !1,
    qa = null,
    Fx = {
      onError: function (n) {
        ((ks = !0), (Ui = n));
      },
    };
  function Vx(n, r, o, l, d, m, x, S, T) {
    ((ks = !1), (Ui = null), Ox.apply(Fx, arguments));
  }
  function Bx(n, r, o, l, d, m, x, S, T) {
    if ((Vx.apply(this, arguments), ks)) {
      if (ks) {
        var I = Ui;
        ((ks = !1), (Ui = null));
      } else throw Error(s(198));
      zi || ((zi = !0), (qa = I));
    }
  }
  function Yn(n) {
    var r = n,
      o = n;
    if (n.alternate) for (; r.return;) r = r.return;
    else {
      n = r;
      do ((r = n), (r.flags & 4098) !== 0 && (o = r.return), (n = r.return));
      while (n);
    }
    return r.tag === 3 ? o : null;
  }
  function wf(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if ((r === null && ((n = n.alternate), n !== null && (r = n.memoizedState)), r !== null))
        return r.dehydrated;
    }
    return null;
  }
  function Sf(n) {
    if (Yn(n) !== n) throw Error(s(188));
  }
  function $x(n) {
    var r = n.alternate;
    if (!r) {
      if (((r = Yn(n)), r === null)) throw Error(s(188));
      return r !== n ? null : n;
    }
    for (var o = n, l = r; ;) {
      var d = o.return;
      if (d === null) break;
      var m = d.alternate;
      if (m === null) {
        if (((l = d.return), l !== null)) {
          o = l;
          continue;
        }
        break;
      }
      if (d.child === m.child) {
        for (m = d.child; m;) {
          if (m === o) return (Sf(d), n);
          if (m === l) return (Sf(d), r);
          m = m.sibling;
        }
        throw Error(s(188));
      }
      if (o.return !== l.return) ((o = d), (l = m));
      else {
        for (var x = !1, S = d.child; S;) {
          if (S === o) {
            ((x = !0), (o = d), (l = m));
            break;
          }
          if (S === l) {
            ((x = !0), (l = d), (o = m));
            break;
          }
          S = S.sibling;
        }
        if (!x) {
          for (S = m.child; S;) {
            if (S === o) {
              ((x = !0), (o = m), (l = d));
              break;
            }
            if (S === l) {
              ((x = !0), (l = m), (o = d));
              break;
            }
            S = S.sibling;
          }
          if (!x) throw Error(s(189));
        }
      }
      if (o.alternate !== l) throw Error(s(190));
    }
    if (o.tag !== 3) throw Error(s(188));
    return o.stateNode.current === o ? n : r;
  }
  function Ef(n) {
    return ((n = $x(n)), n !== null ? _f(n) : null);
  }
  function _f(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null;) {
      var r = _f(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var Tf = t.unstable_scheduleCallback,
    Cf = t.unstable_cancelCallback,
    Ux = t.unstable_shouldYield,
    zx = t.unstable_requestPaint,
    Ae = t.unstable_now,
    Hx = t.unstable_getCurrentPriorityLevel,
    Qa = t.unstable_ImmediatePriority,
    kf = t.unstable_UserBlockingPriority,
    Hi = t.unstable_NormalPriority,
    Wx = t.unstable_LowPriority,
    bf = t.unstable_IdlePriority,
    Wi = null,
    Kt = null;
  function Gx(n) {
    if (Kt && typeof Kt.onCommitFiberRoot == "function")
      try {
        Kt.onCommitFiberRoot(Wi, n, void 0, (n.current.flags & 128) === 128);
      } catch {}
  }
  var Mt = Math.clz32 ? Math.clz32 : Xx,
    Kx = Math.log,
    Yx = Math.LN2;
  function Xx(n) {
    return ((n >>>= 0), n === 0 ? 32 : (31 - ((Kx(n) / Yx) | 0)) | 0);
  }
  var Gi = 64,
    Ki = 4194304;
  function bs(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Yi(n, r) {
    var o = n.pendingLanes;
    if (o === 0) return 0;
    var l = 0,
      d = n.suspendedLanes,
      m = n.pingedLanes,
      x = o & 268435455;
    if (x !== 0) {
      var S = x & ~d;
      S !== 0 ? (l = bs(S)) : ((m &= x), m !== 0 && (l = bs(m)));
    } else ((x = o & ~d), x !== 0 ? (l = bs(x)) : m !== 0 && (l = bs(m)));
    if (l === 0) return 0;
    if (
      r !== 0 &&
      r !== l &&
      (r & d) === 0 &&
      ((d = l & -l), (m = r & -r), d >= m || (d === 16 && (m & 4194240) !== 0))
    )
      return r;
    if (((l & 4) !== 0 && (l |= o & 16), (r = n.entangledLanes), r !== 0))
      for (n = n.entanglements, r &= l; 0 < r;)
        ((o = 31 - Mt(r)), (d = 1 << o), (l |= n[o]), (r &= ~d));
    return l;
  }
  function qx(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Qx(n, r) {
    for (
      var o = n.suspendedLanes, l = n.pingedLanes, d = n.expirationTimes, m = n.pendingLanes;
      0 < m;
    ) {
      var x = 31 - Mt(m),
        S = 1 << x,
        T = d[x];
      (T === -1
        ? ((S & o) === 0 || (S & l) !== 0) && (d[x] = qx(S, r))
        : T <= r && (n.expiredLanes |= S),
        (m &= ~S));
    }
  }
  function Ja(n) {
    return ((n = n.pendingLanes & -1073741825), n !== 0 ? n : n & 1073741824 ? 1073741824 : 0);
  }
  function Nf() {
    var n = Gi;
    return ((Gi <<= 1), (Gi & 4194240) === 0 && (Gi = 64), n);
  }
  function Za(n) {
    for (var r = [], o = 0; 31 > o; o++) r.push(n);
    return r;
  }
  function Ns(n, r, o) {
    ((n.pendingLanes |= r),
      r !== 536870912 && ((n.suspendedLanes = 0), (n.pingedLanes = 0)),
      (n = n.eventTimes),
      (r = 31 - Mt(r)),
      (n[r] = o));
  }
  function Jx(n, r) {
    var o = n.pendingLanes & ~r;
    ((n.pendingLanes = r),
      (n.suspendedLanes = 0),
      (n.pingedLanes = 0),
      (n.expiredLanes &= r),
      (n.mutableReadLanes &= r),
      (n.entangledLanes &= r),
      (r = n.entanglements));
    var l = n.eventTimes;
    for (n = n.expirationTimes; 0 < o;) {
      var d = 31 - Mt(o),
        m = 1 << d;
      ((r[d] = 0), (l[d] = -1), (n[d] = -1), (o &= ~m));
    }
  }
  function el(n, r) {
    var o = (n.entangledLanes |= r);
    for (n = n.entanglements; o;) {
      var l = 31 - Mt(o),
        d = 1 << l;
      ((d & r) | (n[l] & r) && (n[l] |= r), (o &= ~d));
    }
  }
  var ye = 0;
  function jf(n) {
    return ((n &= -n), 1 < n ? (4 < n ? ((n & 268435455) !== 0 ? 16 : 536870912) : 4) : 1);
  }
  var Pf,
    tl,
    Rf,
    If,
    Af,
    nl = !1,
    Xi = [],
    Sn = null,
    En = null,
    _n = null,
    js = new Map(),
    Ps = new Map(),
    Tn = [],
    Zx =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " "
      );
  function Mf(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Sn = null;
        break;
      case "dragenter":
      case "dragleave":
        En = null;
        break;
      case "mouseover":
      case "mouseout":
        _n = null;
        break;
      case "pointerover":
      case "pointerout":
        js.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ps.delete(r.pointerId);
    }
  }
  function Rs(n, r, o, l, d, m) {
    return n === null || n.nativeEvent !== m
      ? ((n = {
          blockedOn: r,
          domEventName: o,
          eventSystemFlags: l,
          nativeEvent: m,
          targetContainers: [d],
        }),
        r !== null && ((r = Ws(r)), r !== null && tl(r)),
        n)
      : ((n.eventSystemFlags |= l),
        (r = n.targetContainers),
        d !== null && r.indexOf(d) === -1 && r.push(d),
        n);
  }
  function ew(n, r, o, l, d) {
    switch (r) {
      case "focusin":
        return ((Sn = Rs(Sn, n, r, o, l, d)), !0);
      case "dragenter":
        return ((En = Rs(En, n, r, o, l, d)), !0);
      case "mouseover":
        return ((_n = Rs(_n, n, r, o, l, d)), !0);
      case "pointerover":
        var m = d.pointerId;
        return (js.set(m, Rs(js.get(m) || null, n, r, o, l, d)), !0);
      case "gotpointercapture":
        return ((m = d.pointerId), Ps.set(m, Rs(Ps.get(m) || null, n, r, o, l, d)), !0);
    }
    return !1;
  }
  function Df(n) {
    var r = Xn(n.target);
    if (r !== null) {
      var o = Yn(r);
      if (o !== null) {
        if (((r = o.tag), r === 13)) {
          if (((r = wf(o)), r !== null)) {
            ((n.blockedOn = r),
              Af(n.priority, function () {
                Rf(o);
              }));
            return;
          }
        } else if (r === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function qi(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length;) {
      var o = sl(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (o === null) {
        o = n.nativeEvent;
        var l = new o.constructor(o.type, o);
        ((Wa = l), o.target.dispatchEvent(l), (Wa = null));
      } else return ((r = Ws(o)), r !== null && tl(r), (n.blockedOn = o), !1);
      r.shift();
    }
    return !0;
  }
  function Lf(n, r, o) {
    qi(n) && o.delete(r);
  }
  function tw() {
    ((nl = !1),
      Sn !== null && qi(Sn) && (Sn = null),
      En !== null && qi(En) && (En = null),
      _n !== null && qi(_n) && (_n = null),
      js.forEach(Lf),
      Ps.forEach(Lf));
  }
  function Is(n, r) {
    n.blockedOn === r &&
      ((n.blockedOn = null),
      nl || ((nl = !0), t.unstable_scheduleCallback(t.unstable_NormalPriority, tw)));
  }
  function As(n) {
    function r(d) {
      return Is(d, n);
    }
    if (0 < Xi.length) {
      Is(Xi[0], n);
      for (var o = 1; o < Xi.length; o++) {
        var l = Xi[o];
        l.blockedOn === n && (l.blockedOn = null);
      }
    }
    for (
      Sn !== null && Is(Sn, n),
        En !== null && Is(En, n),
        _n !== null && Is(_n, n),
        js.forEach(r),
        Ps.forEach(r),
        o = 0;
      o < Tn.length;
      o++
    )
      ((l = Tn[o]), l.blockedOn === n && (l.blockedOn = null));
    for (; 0 < Tn.length && ((o = Tn[0]), o.blockedOn === null);)
      (Df(o), o.blockedOn === null && Tn.shift());
  }
  var Cr = $.ReactCurrentBatchConfig,
    Qi = !0;
  function nw(n, r, o, l) {
    var d = ye,
      m = Cr.transition;
    Cr.transition = null;
    try {
      ((ye = 1), rl(n, r, o, l));
    } finally {
      ((ye = d), (Cr.transition = m));
    }
  }
  function rw(n, r, o, l) {
    var d = ye,
      m = Cr.transition;
    Cr.transition = null;
    try {
      ((ye = 4), rl(n, r, o, l));
    } finally {
      ((ye = d), (Cr.transition = m));
    }
  }
  function rl(n, r, o, l) {
    if (Qi) {
      var d = sl(n, r, o, l);
      if (d === null) (Sl(n, r, l, Ji, o), Mf(n, l));
      else if (ew(d, n, r, o, l)) l.stopPropagation();
      else if ((Mf(n, l), r & 4 && -1 < Zx.indexOf(n))) {
        for (; d !== null;) {
          var m = Ws(d);
          if (
            (m !== null && Pf(m), (m = sl(n, r, o, l)), m === null && Sl(n, r, l, Ji, o), m === d)
          )
            break;
          d = m;
        }
        d !== null && l.stopPropagation();
      } else Sl(n, r, l, null, o);
    }
  }
  var Ji = null;
  function sl(n, r, o, l) {
    if (((Ji = null), (n = Ga(l)), (n = Xn(n)), n !== null))
      if (((r = Yn(n)), r === null)) n = null;
      else if (((o = r.tag), o === 13)) {
        if (((n = wf(r)), n !== null)) return n;
        n = null;
      } else if (o === 3) {
        if (r.stateNode.current.memoizedState.isDehydrated)
          return r.tag === 3 ? r.stateNode.containerInfo : null;
        n = null;
      } else r !== n && (n = null);
    return ((Ji = n), null);
  }
  function Of(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Hx()) {
          case Qa:
            return 1;
          case kf:
            return 4;
          case Hi:
          case Wx:
            return 16;
          case bf:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Cn = null,
    il = null,
    Zi = null;
  function Ff() {
    if (Zi) return Zi;
    var n,
      r = il,
      o = r.length,
      l,
      d = "value" in Cn ? Cn.value : Cn.textContent,
      m = d.length;
    for (n = 0; n < o && r[n] === d[n]; n++);
    var x = o - n;
    for (l = 1; l <= x && r[o - l] === d[m - l]; l++);
    return (Zi = d.slice(n, 1 < l ? 1 - l : void 0));
  }
  function eo(n) {
    var r = n.keyCode;
    return (
      "charCode" in n ? ((n = n.charCode), n === 0 && r === 13 && (n = 13)) : (n = r),
      n === 10 && (n = 13),
      32 <= n || n === 13 ? n : 0
    );
  }
  function to() {
    return !0;
  }
  function Vf() {
    return !1;
  }
  function vt(n) {
    function r(o, l, d, m, x) {
      ((this._reactName = o),
        (this._targetInst = d),
        (this.type = l),
        (this.nativeEvent = m),
        (this.target = x),
        (this.currentTarget = null));
      for (var S in n) n.hasOwnProperty(S) && ((o = n[S]), (this[S] = o ? o(m) : m[S]));
      return (
        (this.isDefaultPrevented = (
          m.defaultPrevented != null ? m.defaultPrevented : m.returnValue === !1
        )
          ? to
          : Vf),
        (this.isPropagationStopped = Vf),
        this
      );
    }
    return (
      H(r.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var o = this.nativeEvent;
          o &&
            (o.preventDefault
              ? o.preventDefault()
              : typeof o.returnValue != "unknown" && (o.returnValue = !1),
            (this.isDefaultPrevented = to));
        },
        stopPropagation: function () {
          var o = this.nativeEvent;
          o &&
            (o.stopPropagation
              ? o.stopPropagation()
              : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0),
            (this.isPropagationStopped = to));
        },
        persist: function () {},
        isPersistent: to,
      }),
      r
    );
  }
  var kr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (n) {
        return n.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    ol = vt(kr),
    Ms = H({}, kr, { view: 0, detail: 0 }),
    sw = vt(Ms),
    al,
    ll,
    Ds,
    no = H({}, Ms, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: cl,
      button: 0,
      buttons: 0,
      relatedTarget: function (n) {
        return n.relatedTarget === void 0
          ? n.fromElement === n.srcElement
            ? n.toElement
            : n.fromElement
          : n.relatedTarget;
      },
      movementX: function (n) {
        return "movementX" in n
          ? n.movementX
          : (n !== Ds &&
              (Ds && n.type === "mousemove"
                ? ((al = n.screenX - Ds.screenX), (ll = n.screenY - Ds.screenY))
                : (ll = al = 0),
              (Ds = n)),
            al);
      },
      movementY: function (n) {
        return "movementY" in n ? n.movementY : ll;
      },
    }),
    Bf = vt(no),
    iw = H({}, no, { dataTransfer: 0 }),
    ow = vt(iw),
    aw = H({}, Ms, { relatedTarget: 0 }),
    ul = vt(aw),
    lw = H({}, kr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    uw = vt(lw),
    cw = H({}, kr, {
      clipboardData: function (n) {
        return "clipboardData" in n ? n.clipboardData : window.clipboardData;
      },
    }),
    dw = vt(cw),
    fw = H({}, kr, { data: 0 }),
    $f = vt(fw),
    pw = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    hw = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    mw = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function gw(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = mw[n]) ? !!r[n] : !1;
  }
  function cl() {
    return gw;
  }
  var yw = H({}, Ms, {
      key: function (n) {
        if (n.key) {
          var r = pw[n.key] || n.key;
          if (r !== "Unidentified") return r;
        }
        return n.type === "keypress"
          ? ((n = eo(n)), n === 13 ? "Enter" : String.fromCharCode(n))
          : n.type === "keydown" || n.type === "keyup"
            ? hw[n.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: cl,
      charCode: function (n) {
        return n.type === "keypress" ? eo(n) : 0;
      },
      keyCode: function (n) {
        return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
      },
      which: function (n) {
        return n.type === "keypress"
          ? eo(n)
          : n.type === "keydown" || n.type === "keyup"
            ? n.keyCode
            : 0;
      },
    }),
    vw = vt(yw),
    xw = H({}, no, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Uf = vt(xw),
    ww = H({}, Ms, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: cl,
    }),
    Sw = vt(ww),
    Ew = H({}, kr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    _w = vt(Ew),
    Tw = H({}, no, {
      deltaX: function (n) {
        return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
      },
      deltaY: function (n) {
        return "deltaY" in n
          ? n.deltaY
          : "wheelDeltaY" in n
            ? -n.wheelDeltaY
            : "wheelDelta" in n
              ? -n.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Cw = vt(Tw),
    kw = [9, 13, 27, 32],
    dl = f && "CompositionEvent" in window,
    Ls = null;
  f && "documentMode" in document && (Ls = document.documentMode);
  var bw = f && "TextEvent" in window && !Ls,
    zf = f && (!dl || (Ls && 8 < Ls && 11 >= Ls)),
    Hf = " ",
    Wf = !1;
  function Gf(n, r) {
    switch (n) {
      case "keyup":
        return kw.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Kf(n) {
    return ((n = n.detail), typeof n == "object" && "data" in n ? n.data : null);
  }
  var br = !1;
  function Nw(n, r) {
    switch (n) {
      case "compositionend":
        return Kf(r);
      case "keypress":
        return r.which !== 32 ? null : ((Wf = !0), Hf);
      case "textInput":
        return ((n = r.data), n === Hf && Wf ? null : n);
      default:
        return null;
    }
  }
  function jw(n, r) {
    if (br)
      return n === "compositionend" || (!dl && Gf(n, r))
        ? ((n = Ff()), (Zi = il = Cn = null), (br = !1), n)
        : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || (r.ctrlKey && r.altKey)) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return zf && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Pw = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Yf(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Pw[n.type] : r === "textarea";
  }
  function Xf(n, r, o, l) {
    (mf(l),
      (r = ao(r, "onChange")),
      0 < r.length &&
        ((o = new ol("onChange", "change", null, o, l)), n.push({ event: o, listeners: r })));
  }
  var Os = null,
    Fs = null;
  function Rw(n) {
    pp(n, 0);
  }
  function ro(n) {
    var r = Ir(n);
    if (nf(r)) return n;
  }
  function Iw(n, r) {
    if (n === "change") return r;
  }
  var qf = !1;
  if (f) {
    var fl;
    if (f) {
      var pl = "oninput" in document;
      if (!pl) {
        var Qf = document.createElement("div");
        (Qf.setAttribute("oninput", "return;"), (pl = typeof Qf.oninput == "function"));
      }
      fl = pl;
    } else fl = !1;
    qf = fl && (!document.documentMode || 9 < document.documentMode);
  }
  function Jf() {
    Os && (Os.detachEvent("onpropertychange", Zf), (Fs = Os = null));
  }
  function Zf(n) {
    if (n.propertyName === "value" && ro(Fs)) {
      var r = [];
      (Xf(r, Fs, n, Ga(n)), xf(Rw, r));
    }
  }
  function Aw(n, r, o) {
    n === "focusin"
      ? (Jf(), (Os = r), (Fs = o), Os.attachEvent("onpropertychange", Zf))
      : n === "focusout" && Jf();
  }
  function Mw(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return ro(Fs);
  }
  function Dw(n, r) {
    if (n === "click") return ro(r);
  }
  function Lw(n, r) {
    if (n === "input" || n === "change") return ro(r);
  }
  function Ow(n, r) {
    return (n === r && (n !== 0 || 1 / n === 1 / r)) || (n !== n && r !== r);
  }
  var Dt = typeof Object.is == "function" ? Object.is : Ow;
  function Vs(n, r) {
    if (Dt(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var o = Object.keys(n),
      l = Object.keys(r);
    if (o.length !== l.length) return !1;
    for (l = 0; l < o.length; l++) {
      var d = o[l];
      if (!p.call(r, d) || !Dt(n[d], r[d])) return !1;
    }
    return !0;
  }
  function ep(n) {
    for (; n && n.firstChild;) n = n.firstChild;
    return n;
  }
  function tp(n, r) {
    var o = ep(n);
    n = 0;
    for (var l; o;) {
      if (o.nodeType === 3) {
        if (((l = n + o.textContent.length), n <= r && l >= r)) return { node: o, offset: r - n };
        n = l;
      }
      e: {
        for (; o;) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = ep(o);
    }
  }
  function np(n, r) {
    return n && r
      ? n === r
        ? !0
        : n && n.nodeType === 3
          ? !1
          : r && r.nodeType === 3
            ? np(n, r.parentNode)
            : "contains" in n
              ? n.contains(r)
              : n.compareDocumentPosition
                ? !!(n.compareDocumentPosition(r) & 16)
                : !1
      : !1;
  }
  function rp() {
    for (var n = window, r = Bi(); r instanceof n.HTMLIFrameElement;) {
      try {
        var o = typeof r.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o) n = r.contentWindow;
      else break;
      r = Bi(n.document);
    }
    return r;
  }
  function hl(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return (
      r &&
      ((r === "input" &&
        (n.type === "text" ||
          n.type === "search" ||
          n.type === "tel" ||
          n.type === "url" ||
          n.type === "password")) ||
        r === "textarea" ||
        n.contentEditable === "true")
    );
  }
  function Fw(n) {
    var r = rp(),
      o = n.focusedElem,
      l = n.selectionRange;
    if (r !== o && o && o.ownerDocument && np(o.ownerDocument.documentElement, o)) {
      if (l !== null && hl(o)) {
        if (((r = l.start), (n = l.end), n === void 0 && (n = r), "selectionStart" in o))
          ((o.selectionStart = r), (o.selectionEnd = Math.min(n, o.value.length)));
        else if (
          ((n = ((r = o.ownerDocument || document) && r.defaultView) || window), n.getSelection)
        ) {
          n = n.getSelection();
          var d = o.textContent.length,
            m = Math.min(l.start, d);
          ((l = l.end === void 0 ? m : Math.min(l.end, d)),
            !n.extend && m > l && ((d = l), (l = m), (m = d)),
            (d = tp(o, m)));
          var x = tp(o, l);
          d &&
            x &&
            (n.rangeCount !== 1 ||
              n.anchorNode !== d.node ||
              n.anchorOffset !== d.offset ||
              n.focusNode !== x.node ||
              n.focusOffset !== x.offset) &&
            ((r = r.createRange()),
            r.setStart(d.node, d.offset),
            n.removeAllRanges(),
            m > l
              ? (n.addRange(r), n.extend(x.node, x.offset))
              : (r.setEnd(x.node, x.offset), n.addRange(r)));
        }
      }
      for (r = [], n = o; (n = n.parentNode);)
        n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < r.length; o++)
        ((n = r[o]), (n.element.scrollLeft = n.left), (n.element.scrollTop = n.top));
    }
  }
  var Vw = f && "documentMode" in document && 11 >= document.documentMode,
    Nr = null,
    ml = null,
    Bs = null,
    gl = !1;
  function sp(n, r, o) {
    var l = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    gl ||
      Nr == null ||
      Nr !== Bi(l) ||
      ((l = Nr),
      "selectionStart" in l && hl(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (Bs && Vs(Bs, l)) ||
        ((Bs = l),
        (l = ao(ml, "onSelect")),
        0 < l.length &&
          ((r = new ol("onSelect", "select", null, r, o)),
          n.push({ event: r, listeners: l }),
          (r.target = Nr))));
  }
  function so(n, r) {
    var o = {};
    return (
      (o[n.toLowerCase()] = r.toLowerCase()),
      (o["Webkit" + n] = "webkit" + r),
      (o["Moz" + n] = "moz" + r),
      o
    );
  }
  var jr = {
      animationend: so("Animation", "AnimationEnd"),
      animationiteration: so("Animation", "AnimationIteration"),
      animationstart: so("Animation", "AnimationStart"),
      transitionend: so("Transition", "TransitionEnd"),
    },
    yl = {},
    ip = {};
  f &&
    ((ip = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete jr.animationend.animation,
      delete jr.animationiteration.animation,
      delete jr.animationstart.animation),
    "TransitionEvent" in window || delete jr.transitionend.transition);
  function io(n) {
    if (yl[n]) return yl[n];
    if (!jr[n]) return n;
    var r = jr[n],
      o;
    for (o in r) if (r.hasOwnProperty(o) && o in ip) return (yl[n] = r[o]);
    return n;
  }
  var op = io("animationend"),
    ap = io("animationiteration"),
    lp = io("animationstart"),
    up = io("transitionend"),
    cp = new Map(),
    dp =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " "
      );
  function kn(n, r) {
    (cp.set(n, r), u(r, [n]));
  }
  for (var vl = 0; vl < dp.length; vl++) {
    var xl = dp[vl],
      Bw = xl.toLowerCase(),
      $w = xl[0].toUpperCase() + xl.slice(1);
    kn(Bw, "on" + $w);
  }
  (kn(op, "onAnimationEnd"),
    kn(ap, "onAnimationIteration"),
    kn(lp, "onAnimationStart"),
    kn("dblclick", "onDoubleClick"),
    kn("focusin", "onFocus"),
    kn("focusout", "onBlur"),
    kn(up, "onTransitionEnd"),
    c("onMouseEnter", ["mouseout", "mouseover"]),
    c("onMouseLeave", ["mouseout", "mouseover"]),
    c("onPointerEnter", ["pointerout", "pointerover"]),
    c("onPointerLeave", ["pointerout", "pointerover"]),
    u("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    u(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    ),
    u("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    u("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    u(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    ),
    u(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    ));
  var $s =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      ),
    Uw = new Set("cancel close invalid load scroll toggle".split(" ").concat($s));
  function fp(n, r, o) {
    var l = n.type || "unknown-event";
    ((n.currentTarget = o), Bx(l, r, void 0, n), (n.currentTarget = null));
  }
  function pp(n, r) {
    r = (r & 4) !== 0;
    for (var o = 0; o < n.length; o++) {
      var l = n[o],
        d = l.event;
      l = l.listeners;
      e: {
        var m = void 0;
        if (r)
          for (var x = l.length - 1; 0 <= x; x--) {
            var S = l[x],
              T = S.instance,
              I = S.currentTarget;
            if (((S = S.listener), T !== m && d.isPropagationStopped())) break e;
            (fp(d, S, I), (m = T));
          }
        else
          for (x = 0; x < l.length; x++) {
            if (
              ((S = l[x]),
              (T = S.instance),
              (I = S.currentTarget),
              (S = S.listener),
              T !== m && d.isPropagationStopped())
            )
              break e;
            (fp(d, S, I), (m = T));
          }
      }
    }
    if (zi) throw ((n = qa), (zi = !1), (qa = null), n);
  }
  function Se(n, r) {
    var o = r[bl];
    o === void 0 && (o = r[bl] = new Set());
    var l = n + "__bubble";
    o.has(l) || (hp(r, n, 2, !1), o.add(l));
  }
  function wl(n, r, o) {
    var l = 0;
    (r && (l |= 4), hp(o, n, l, r));
  }
  var oo = "_reactListening" + Math.random().toString(36).slice(2);
  function Us(n) {
    if (!n[oo]) {
      ((n[oo] = !0),
        i.forEach(function (o) {
          o !== "selectionchange" && (Uw.has(o) || wl(o, !1, n), wl(o, !0, n));
        }));
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[oo] || ((r[oo] = !0), wl("selectionchange", !1, r));
    }
  }
  function hp(n, r, o, l) {
    switch (Of(r)) {
      case 1:
        var d = nw;
        break;
      case 4:
        d = rw;
        break;
      default:
        d = rl;
    }
    ((o = d.bind(null, r, o, n)),
      (d = void 0),
      !Xa || (r !== "touchstart" && r !== "touchmove" && r !== "wheel") || (d = !0),
      l
        ? d !== void 0
          ? n.addEventListener(r, o, { capture: !0, passive: d })
          : n.addEventListener(r, o, !0)
        : d !== void 0
          ? n.addEventListener(r, o, { passive: d })
          : n.addEventListener(r, o, !1));
  }
  function Sl(n, r, o, l, d) {
    var m = l;
    if ((r & 1) === 0 && (r & 2) === 0 && l !== null)
      e: for (;;) {
        if (l === null) return;
        var x = l.tag;
        if (x === 3 || x === 4) {
          var S = l.stateNode.containerInfo;
          if (S === d || (S.nodeType === 8 && S.parentNode === d)) break;
          if (x === 4)
            for (x = l.return; x !== null;) {
              var T = x.tag;
              if (
                (T === 3 || T === 4) &&
                ((T = x.stateNode.containerInfo),
                T === d || (T.nodeType === 8 && T.parentNode === d))
              )
                return;
              x = x.return;
            }
          for (; S !== null;) {
            if (((x = Xn(S)), x === null)) return;
            if (((T = x.tag), T === 5 || T === 6)) {
              l = m = x;
              continue e;
            }
            S = S.parentNode;
          }
        }
        l = l.return;
      }
    xf(function () {
      var I = m,
        F = Ga(o),
        V = [];
      e: {
        var L = cp.get(n);
        if (L !== void 0) {
          var W = ol,
            K = n;
          switch (n) {
            case "keypress":
              if (eo(o) === 0) break e;
            case "keydown":
            case "keyup":
              W = vw;
              break;
            case "focusin":
              ((K = "focus"), (W = ul));
              break;
            case "focusout":
              ((K = "blur"), (W = ul));
              break;
            case "beforeblur":
            case "afterblur":
              W = ul;
              break;
            case "click":
              if (o.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              W = Bf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              W = ow;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              W = Sw;
              break;
            case op:
            case ap:
            case lp:
              W = uw;
              break;
            case up:
              W = _w;
              break;
            case "scroll":
              W = sw;
              break;
            case "wheel":
              W = Cw;
              break;
            case "copy":
            case "cut":
            case "paste":
              W = dw;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              W = Uf;
          }
          var Y = (r & 4) !== 0,
            Me = !Y && n === "scroll",
            j = Y ? (L !== null ? L + "Capture" : null) : L;
          Y = [];
          for (var C = I, P; C !== null;) {
            P = C;
            var B = P.stateNode;
            if (
              (P.tag === 5 &&
                B !== null &&
                ((P = B), j !== null && ((B = Ts(C, j)), B != null && Y.push(zs(C, B, P)))),
              Me)
            )
              break;
            C = C.return;
          }
          0 < Y.length && ((L = new W(L, K, null, o, F)), V.push({ event: L, listeners: Y }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if (
            ((L = n === "mouseover" || n === "pointerover"),
            (W = n === "mouseout" || n === "pointerout"),
            L && o !== Wa && (K = o.relatedTarget || o.fromElement) && (Xn(K) || K[tn]))
          )
            break e;
          if (
            (W || L) &&
            ((L =
              F.window === F
                ? F
                : (L = F.ownerDocument)
                  ? L.defaultView || L.parentWindow
                  : window),
            W
              ? ((K = o.relatedTarget || o.toElement),
                (W = I),
                (K = K ? Xn(K) : null),
                K !== null &&
                  ((Me = Yn(K)), K !== Me || (K.tag !== 5 && K.tag !== 6)) &&
                  (K = null))
              : ((W = null), (K = I)),
            W !== K)
          ) {
            if (
              ((Y = Bf),
              (B = "onMouseLeave"),
              (j = "onMouseEnter"),
              (C = "mouse"),
              (n === "pointerout" || n === "pointerover") &&
                ((Y = Uf), (B = "onPointerLeave"), (j = "onPointerEnter"), (C = "pointer")),
              (Me = W == null ? L : Ir(W)),
              (P = K == null ? L : Ir(K)),
              (L = new Y(B, C + "leave", W, o, F)),
              (L.target = Me),
              (L.relatedTarget = P),
              (B = null),
              Xn(F) === I &&
                ((Y = new Y(j, C + "enter", K, o, F)),
                (Y.target = P),
                (Y.relatedTarget = Me),
                (B = Y)),
              (Me = B),
              W && K)
            )
              t: {
                for (Y = W, j = K, C = 0, P = Y; P; P = Pr(P)) C++;
                for (P = 0, B = j; B; B = Pr(B)) P++;
                for (; 0 < C - P;) ((Y = Pr(Y)), C--);
                for (; 0 < P - C;) ((j = Pr(j)), P--);
                for (; C--;) {
                  if (Y === j || (j !== null && Y === j.alternate)) break t;
                  ((Y = Pr(Y)), (j = Pr(j)));
                }
                Y = null;
              }
            else Y = null;
            (W !== null && mp(V, L, W, Y, !1), K !== null && Me !== null && mp(V, Me, K, Y, !0));
          }
        }
        e: {
          if (
            ((L = I ? Ir(I) : window),
            (W = L.nodeName && L.nodeName.toLowerCase()),
            W === "select" || (W === "input" && L.type === "file"))
          )
            var X = Iw;
          else if (Yf(L))
            if (qf) X = Lw;
            else {
              X = Mw;
              var Z = Aw;
            }
          else
            (W = L.nodeName) &&
              W.toLowerCase() === "input" &&
              (L.type === "checkbox" || L.type === "radio") &&
              (X = Dw);
          if (X && (X = X(n, I))) {
            Xf(V, X, o, F);
            break e;
          }
          (Z && Z(n, L, I),
            n === "focusout" &&
              (Z = L._wrapperState) &&
              Z.controlled &&
              L.type === "number" &&
              Ba(L, "number", L.value));
        }
        switch (((Z = I ? Ir(I) : window), n)) {
          case "focusin":
            (Yf(Z) || Z.contentEditable === "true") && ((Nr = Z), (ml = I), (Bs = null));
            break;
          case "focusout":
            Bs = ml = Nr = null;
            break;
          case "mousedown":
            gl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((gl = !1), sp(V, o, F));
            break;
          case "selectionchange":
            if (Vw) break;
          case "keydown":
          case "keyup":
            sp(V, o, F);
        }
        var ee;
        if (dl)
          e: {
            switch (n) {
              case "compositionstart":
                var re = "onCompositionStart";
                break e;
              case "compositionend":
                re = "onCompositionEnd";
                break e;
              case "compositionupdate":
                re = "onCompositionUpdate";
                break e;
            }
            re = void 0;
          }
        else
          br
            ? Gf(n, o) && (re = "onCompositionEnd")
            : n === "keydown" && o.keyCode === 229 && (re = "onCompositionStart");
        (re &&
          (zf &&
            o.locale !== "ko" &&
            (br || re !== "onCompositionStart"
              ? re === "onCompositionEnd" && br && (ee = Ff())
              : ((Cn = F), (il = "value" in Cn ? Cn.value : Cn.textContent), (br = !0))),
          (Z = ao(I, re)),
          0 < Z.length &&
            ((re = new $f(re, n, null, o, F)),
            V.push({ event: re, listeners: Z }),
            ee ? (re.data = ee) : ((ee = Kf(o)), ee !== null && (re.data = ee)))),
          (ee = bw ? Nw(n, o) : jw(n, o)) &&
            ((I = ao(I, "onBeforeInput")),
            0 < I.length &&
              ((F = new $f("onBeforeInput", "beforeinput", null, o, F)),
              V.push({ event: F, listeners: I }),
              (F.data = ee))));
      }
      pp(V, r);
    });
  }
  function zs(n, r, o) {
    return { instance: n, listener: r, currentTarget: o };
  }
  function ao(n, r) {
    for (var o = r + "Capture", l = []; n !== null;) {
      var d = n,
        m = d.stateNode;
      (d.tag === 5 &&
        m !== null &&
        ((d = m),
        (m = Ts(n, o)),
        m != null && l.unshift(zs(n, m, d)),
        (m = Ts(n, r)),
        m != null && l.push(zs(n, m, d))),
        (n = n.return));
    }
    return l;
  }
  function Pr(n) {
    if (n === null) return null;
    do n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function mp(n, r, o, l, d) {
    for (var m = r._reactName, x = []; o !== null && o !== l;) {
      var S = o,
        T = S.alternate,
        I = S.stateNode;
      if (T !== null && T === l) break;
      (S.tag === 5 &&
        I !== null &&
        ((S = I),
        d
          ? ((T = Ts(o, m)), T != null && x.unshift(zs(o, T, S)))
          : d || ((T = Ts(o, m)), T != null && x.push(zs(o, T, S)))),
        (o = o.return));
    }
    x.length !== 0 && n.push({ event: r, listeners: x });
  }
  var zw = /\r\n?/g,
    Hw = /\u0000|\uFFFD/g;
  function gp(n) {
    return (typeof n == "string" ? n : "" + n)
      .replace(
        zw,
        `
`
      )
      .replace(Hw, "");
  }
  function lo(n, r, o) {
    if (((r = gp(r)), gp(n) !== r && o)) throw Error(s(425));
  }
  function uo() {}
  var El = null,
    _l = null;
  function Tl(n, r) {
    return (
      n === "textarea" ||
      n === "noscript" ||
      typeof r.children == "string" ||
      typeof r.children == "number" ||
      (typeof r.dangerouslySetInnerHTML == "object" &&
        r.dangerouslySetInnerHTML !== null &&
        r.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Cl = typeof setTimeout == "function" ? setTimeout : void 0,
    Ww = typeof clearTimeout == "function" ? clearTimeout : void 0,
    yp = typeof Promise == "function" ? Promise : void 0,
    Gw =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof yp < "u"
          ? function (n) {
              return yp.resolve(null).then(n).catch(Kw);
            }
          : Cl;
  function Kw(n) {
    setTimeout(function () {
      throw n;
    });
  }
  function kl(n, r) {
    var o = r,
      l = 0;
    do {
      var d = o.nextSibling;
      if ((n.removeChild(o), d && d.nodeType === 8))
        if (((o = d.data), o === "/$")) {
          if (l === 0) {
            (n.removeChild(d), As(r));
            return;
          }
          l--;
        } else (o !== "$" && o !== "$?" && o !== "$!") || l++;
      o = d;
    } while (o);
    As(r);
  }
  function bn(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (((r = n.data), r === "$" || r === "$!" || r === "$?")) break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function vp(n) {
    n = n.previousSibling;
    for (var r = 0; n;) {
      if (n.nodeType === 8) {
        var o = n.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (r === 0) return n;
          r--;
        } else o === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var Rr = Math.random().toString(36).slice(2),
    Yt = "__reactFiber$" + Rr,
    Hs = "__reactProps$" + Rr,
    tn = "__reactContainer$" + Rr,
    bl = "__reactEvents$" + Rr,
    Yw = "__reactListeners$" + Rr,
    Xw = "__reactHandles$" + Rr;
  function Xn(n) {
    var r = n[Yt];
    if (r) return r;
    for (var o = n.parentNode; o;) {
      if ((r = o[tn] || o[Yt])) {
        if (((o = r.alternate), r.child !== null || (o !== null && o.child !== null)))
          for (n = vp(n); n !== null;) {
            if ((o = n[Yt])) return o;
            n = vp(n);
          }
        return r;
      }
      ((n = o), (o = n.parentNode));
    }
    return null;
  }
  function Ws(n) {
    return (
      (n = n[Yt] || n[tn]),
      !n || (n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3) ? null : n
    );
  }
  function Ir(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(s(33));
  }
  function co(n) {
    return n[Hs] || null;
  }
  var Nl = [],
    Ar = -1;
  function Nn(n) {
    return { current: n };
  }
  function Ee(n) {
    0 > Ar || ((n.current = Nl[Ar]), (Nl[Ar] = null), Ar--);
  }
  function we(n, r) {
    (Ar++, (Nl[Ar] = n.current), (n.current = r));
  }
  var jn = {},
    Ye = Nn(jn),
    lt = Nn(!1),
    qn = jn;
  function Mr(n, r) {
    var o = n.type.contextTypes;
    if (!o) return jn;
    var l = n.stateNode;
    if (l && l.__reactInternalMemoizedUnmaskedChildContext === r)
      return l.__reactInternalMemoizedMaskedChildContext;
    var d = {},
      m;
    for (m in o) d[m] = r[m];
    return (
      l &&
        ((n = n.stateNode),
        (n.__reactInternalMemoizedUnmaskedChildContext = r),
        (n.__reactInternalMemoizedMaskedChildContext = d)),
      d
    );
  }
  function ut(n) {
    return ((n = n.childContextTypes), n != null);
  }
  function fo() {
    (Ee(lt), Ee(Ye));
  }
  function xp(n, r, o) {
    if (Ye.current !== jn) throw Error(s(168));
    (we(Ye, r), we(lt, o));
  }
  function wp(n, r, o) {
    var l = n.stateNode;
    if (((r = r.childContextTypes), typeof l.getChildContext != "function")) return o;
    l = l.getChildContext();
    for (var d in l) if (!(d in r)) throw Error(s(108, xe(n) || "Unknown", d));
    return H({}, o, l);
  }
  function po(n) {
    return (
      (n = ((n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext) || jn),
      (qn = Ye.current),
      we(Ye, n),
      we(lt, lt.current),
      !0
    );
  }
  function Sp(n, r, o) {
    var l = n.stateNode;
    if (!l) throw Error(s(169));
    (o
      ? ((n = wp(n, r, qn)),
        (l.__reactInternalMemoizedMergedChildContext = n),
        Ee(lt),
        Ee(Ye),
        we(Ye, n))
      : Ee(lt),
      we(lt, o));
  }
  var nn = null,
    ho = !1,
    jl = !1;
  function Ep(n) {
    nn === null ? (nn = [n]) : nn.push(n);
  }
  function qw(n) {
    ((ho = !0), Ep(n));
  }
  function Pn() {
    if (!jl && nn !== null) {
      jl = !0;
      var n = 0,
        r = ye;
      try {
        var o = nn;
        for (ye = 1; n < o.length; n++) {
          var l = o[n];
          do l = l(!0);
          while (l !== null);
        }
        ((nn = null), (ho = !1));
      } catch (d) {
        throw (nn !== null && (nn = nn.slice(n + 1)), Tf(Qa, Pn), d);
      } finally {
        ((ye = r), (jl = !1));
      }
    }
    return null;
  }
  var Dr = [],
    Lr = 0,
    mo = null,
    go = 0,
    _t = [],
    Tt = 0,
    Qn = null,
    rn = 1,
    sn = "";
  function Jn(n, r) {
    ((Dr[Lr++] = go), (Dr[Lr++] = mo), (mo = n), (go = r));
  }
  function _p(n, r, o) {
    ((_t[Tt++] = rn), (_t[Tt++] = sn), (_t[Tt++] = Qn), (Qn = n));
    var l = rn;
    n = sn;
    var d = 32 - Mt(l) - 1;
    ((l &= ~(1 << d)), (o += 1));
    var m = 32 - Mt(r) + d;
    if (30 < m) {
      var x = d - (d % 5);
      ((m = (l & ((1 << x) - 1)).toString(32)),
        (l >>= x),
        (d -= x),
        (rn = (1 << (32 - Mt(r) + d)) | (o << d) | l),
        (sn = m + n));
    } else ((rn = (1 << m) | (o << d) | l), (sn = n));
  }
  function Pl(n) {
    n.return !== null && (Jn(n, 1), _p(n, 1, 0));
  }
  function Rl(n) {
    for (; n === mo;) ((mo = Dr[--Lr]), (Dr[Lr] = null), (go = Dr[--Lr]), (Dr[Lr] = null));
    for (; n === Qn;)
      ((Qn = _t[--Tt]),
        (_t[Tt] = null),
        (sn = _t[--Tt]),
        (_t[Tt] = null),
        (rn = _t[--Tt]),
        (_t[Tt] = null));
  }
  var xt = null,
    wt = null,
    Ce = !1,
    Lt = null;
  function Tp(n, r) {
    var o = Nt(5, null, null, 0);
    ((o.elementType = "DELETED"),
      (o.stateNode = r),
      (o.return = n),
      (r = n.deletions),
      r === null ? ((n.deletions = [o]), (n.flags |= 16)) : r.push(o));
  }
  function Cp(n, r) {
    switch (n.tag) {
      case 5:
        var o = n.type;
        return (
          (r = r.nodeType !== 1 || o.toLowerCase() !== r.nodeName.toLowerCase() ? null : r),
          r !== null ? ((n.stateNode = r), (xt = n), (wt = bn(r.firstChild)), !0) : !1
        );
      case 6:
        return (
          (r = n.pendingProps === "" || r.nodeType !== 3 ? null : r),
          r !== null ? ((n.stateNode = r), (xt = n), (wt = null), !0) : !1
        );
      case 13:
        return (
          (r = r.nodeType !== 8 ? null : r),
          r !== null
            ? ((o = Qn !== null ? { id: rn, overflow: sn } : null),
              (n.memoizedState = { dehydrated: r, treeContext: o, retryLane: 1073741824 }),
              (o = Nt(18, null, null, 0)),
              (o.stateNode = r),
              (o.return = n),
              (n.child = o),
              (xt = n),
              (wt = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function Il(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Al(n) {
    if (Ce) {
      var r = wt;
      if (r) {
        var o = r;
        if (!Cp(n, r)) {
          if (Il(n)) throw Error(s(418));
          r = bn(o.nextSibling);
          var l = xt;
          r && Cp(n, r) ? Tp(l, o) : ((n.flags = (n.flags & -4097) | 2), (Ce = !1), (xt = n));
        }
      } else {
        if (Il(n)) throw Error(s(418));
        ((n.flags = (n.flags & -4097) | 2), (Ce = !1), (xt = n));
      }
    }
  }
  function kp(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13;) n = n.return;
    xt = n;
  }
  function yo(n) {
    if (n !== xt) return !1;
    if (!Ce) return (kp(n), (Ce = !0), !1);
    var r;
    if (
      ((r = n.tag !== 3) &&
        !(r = n.tag !== 5) &&
        ((r = n.type), (r = r !== "head" && r !== "body" && !Tl(n.type, n.memoizedProps))),
      r && (r = wt))
    ) {
      if (Il(n)) throw (bp(), Error(s(418)));
      for (; r;) (Tp(n, r), (r = bn(r.nextSibling)));
    }
    if ((kp(n), n.tag === 13)) {
      if (((n = n.memoizedState), (n = n !== null ? n.dehydrated : null), !n)) throw Error(s(317));
      e: {
        for (n = n.nextSibling, r = 0; n;) {
          if (n.nodeType === 8) {
            var o = n.data;
            if (o === "/$") {
              if (r === 0) {
                wt = bn(n.nextSibling);
                break e;
              }
              r--;
            } else (o !== "$" && o !== "$!" && o !== "$?") || r++;
          }
          n = n.nextSibling;
        }
        wt = null;
      }
    } else wt = xt ? bn(n.stateNode.nextSibling) : null;
    return !0;
  }
  function bp() {
    for (var n = wt; n;) n = bn(n.nextSibling);
  }
  function Or() {
    ((wt = xt = null), (Ce = !1));
  }
  function Ml(n) {
    Lt === null ? (Lt = [n]) : Lt.push(n);
  }
  var Qw = $.ReactCurrentBatchConfig;
  function Gs(n, r, o) {
    if (((n = o.ref), n !== null && typeof n != "function" && typeof n != "object")) {
      if (o._owner) {
        if (((o = o._owner), o)) {
          if (o.tag !== 1) throw Error(s(309));
          var l = o.stateNode;
        }
        if (!l) throw Error(s(147, n));
        var d = l,
          m = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === m
          ? r.ref
          : ((r = function (x) {
              var S = d.refs;
              x === null ? delete S[m] : (S[m] = x);
            }),
            (r._stringRef = m),
            r);
      }
      if (typeof n != "string") throw Error(s(284));
      if (!o._owner) throw Error(s(290, n));
    }
    return n;
  }
  function vo(n, r) {
    throw (
      (n = Object.prototype.toString.call(r)),
      Error(
        s(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n)
      )
    );
  }
  function Np(n) {
    var r = n._init;
    return r(n._payload);
  }
  function jp(n) {
    function r(j, C) {
      if (n) {
        var P = j.deletions;
        P === null ? ((j.deletions = [C]), (j.flags |= 16)) : P.push(C);
      }
    }
    function o(j, C) {
      if (!n) return null;
      for (; C !== null;) (r(j, C), (C = C.sibling));
      return null;
    }
    function l(j, C) {
      for (j = new Map(); C !== null;)
        (C.key !== null ? j.set(C.key, C) : j.set(C.index, C), (C = C.sibling));
      return j;
    }
    function d(j, C) {
      return ((j = Fn(j, C)), (j.index = 0), (j.sibling = null), j);
    }
    function m(j, C, P) {
      return (
        (j.index = P),
        n
          ? ((P = j.alternate),
            P !== null ? ((P = P.index), P < C ? ((j.flags |= 2), C) : P) : ((j.flags |= 2), C))
          : ((j.flags |= 1048576), C)
      );
    }
    function x(j) {
      return (n && j.alternate === null && (j.flags |= 2), j);
    }
    function S(j, C, P, B) {
      return C === null || C.tag !== 6
        ? ((C = Cu(P, j.mode, B)), (C.return = j), C)
        : ((C = d(C, P)), (C.return = j), C);
    }
    function T(j, C, P, B) {
      var X = P.type;
      return X === te
        ? F(j, C, P.props.children, B, P.key)
        : C !== null &&
            (C.elementType === X ||
              (typeof X == "object" && X !== null && X.$$typeof === tt && Np(X) === C.type))
          ? ((B = d(C, P.props)), (B.ref = Gs(j, C, P)), (B.return = j), B)
          : ((B = Uo(P.type, P.key, P.props, null, j.mode, B)),
            (B.ref = Gs(j, C, P)),
            (B.return = j),
            B);
    }
    function I(j, C, P, B) {
      return C === null ||
        C.tag !== 4 ||
        C.stateNode.containerInfo !== P.containerInfo ||
        C.stateNode.implementation !== P.implementation
        ? ((C = ku(P, j.mode, B)), (C.return = j), C)
        : ((C = d(C, P.children || [])), (C.return = j), C);
    }
    function F(j, C, P, B, X) {
      return C === null || C.tag !== 7
        ? ((C = or(P, j.mode, B, X)), (C.return = j), C)
        : ((C = d(C, P)), (C.return = j), C);
    }
    function V(j, C, P) {
      if ((typeof C == "string" && C !== "") || typeof C == "number")
        return ((C = Cu("" + C, j.mode, P)), (C.return = j), C);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case z:
            return (
              (P = Uo(C.type, C.key, C.props, null, j.mode, P)),
              (P.ref = Gs(j, null, C)),
              (P.return = j),
              P
            );
          case J:
            return ((C = ku(C, j.mode, P)), (C.return = j), C);
          case tt:
            var B = C._init;
            return V(j, B(C._payload), P);
        }
        if (Ss(C) || q(C)) return ((C = or(C, j.mode, P, null)), (C.return = j), C);
        vo(j, C);
      }
      return null;
    }
    function L(j, C, P, B) {
      var X = C !== null ? C.key : null;
      if ((typeof P == "string" && P !== "") || typeof P == "number")
        return X !== null ? null : S(j, C, "" + P, B);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case z:
            return P.key === X ? T(j, C, P, B) : null;
          case J:
            return P.key === X ? I(j, C, P, B) : null;
          case tt:
            return ((X = P._init), L(j, C, X(P._payload), B));
        }
        if (Ss(P) || q(P)) return X !== null ? null : F(j, C, P, B, null);
        vo(j, P);
      }
      return null;
    }
    function W(j, C, P, B, X) {
      if ((typeof B == "string" && B !== "") || typeof B == "number")
        return ((j = j.get(P) || null), S(C, j, "" + B, X));
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case z:
            return ((j = j.get(B.key === null ? P : B.key) || null), T(C, j, B, X));
          case J:
            return ((j = j.get(B.key === null ? P : B.key) || null), I(C, j, B, X));
          case tt:
            var Z = B._init;
            return W(j, C, P, Z(B._payload), X);
        }
        if (Ss(B) || q(B)) return ((j = j.get(P) || null), F(C, j, B, X, null));
        vo(C, B);
      }
      return null;
    }
    function K(j, C, P, B) {
      for (
        var X = null, Z = null, ee = C, re = (C = 0), He = null;
        ee !== null && re < P.length;
        re++
      ) {
        ee.index > re ? ((He = ee), (ee = null)) : (He = ee.sibling);
        var me = L(j, ee, P[re], B);
        if (me === null) {
          ee === null && (ee = He);
          break;
        }
        (n && ee && me.alternate === null && r(j, ee),
          (C = m(me, C, re)),
          Z === null ? (X = me) : (Z.sibling = me),
          (Z = me),
          (ee = He));
      }
      if (re === P.length) return (o(j, ee), Ce && Jn(j, re), X);
      if (ee === null) {
        for (; re < P.length; re++)
          ((ee = V(j, P[re], B)),
            ee !== null &&
              ((C = m(ee, C, re)), Z === null ? (X = ee) : (Z.sibling = ee), (Z = ee)));
        return (Ce && Jn(j, re), X);
      }
      for (ee = l(j, ee); re < P.length; re++)
        ((He = W(ee, j, re, P[re], B)),
          He !== null &&
            (n && He.alternate !== null && ee.delete(He.key === null ? re : He.key),
            (C = m(He, C, re)),
            Z === null ? (X = He) : (Z.sibling = He),
            (Z = He)));
      return (
        n &&
          ee.forEach(function (Vn) {
            return r(j, Vn);
          }),
        Ce && Jn(j, re),
        X
      );
    }
    function Y(j, C, P, B) {
      var X = q(P);
      if (typeof X != "function") throw Error(s(150));
      if (((P = X.call(P)), P == null)) throw Error(s(151));
      for (
        var Z = (X = null), ee = C, re = (C = 0), He = null, me = P.next();
        ee !== null && !me.done;
        re++, me = P.next()
      ) {
        ee.index > re ? ((He = ee), (ee = null)) : (He = ee.sibling);
        var Vn = L(j, ee, me.value, B);
        if (Vn === null) {
          ee === null && (ee = He);
          break;
        }
        (n && ee && Vn.alternate === null && r(j, ee),
          (C = m(Vn, C, re)),
          Z === null ? (X = Vn) : (Z.sibling = Vn),
          (Z = Vn),
          (ee = He));
      }
      if (me.done) return (o(j, ee), Ce && Jn(j, re), X);
      if (ee === null) {
        for (; !me.done; re++, me = P.next())
          ((me = V(j, me.value, B)),
            me !== null &&
              ((C = m(me, C, re)), Z === null ? (X = me) : (Z.sibling = me), (Z = me)));
        return (Ce && Jn(j, re), X);
      }
      for (ee = l(j, ee); !me.done; re++, me = P.next())
        ((me = W(ee, j, re, me.value, B)),
          me !== null &&
            (n && me.alternate !== null && ee.delete(me.key === null ? re : me.key),
            (C = m(me, C, re)),
            Z === null ? (X = me) : (Z.sibling = me),
            (Z = me)));
      return (
        n &&
          ee.forEach(function (PS) {
            return r(j, PS);
          }),
        Ce && Jn(j, re),
        X
      );
    }
    function Me(j, C, P, B) {
      if (
        (typeof P == "object" &&
          P !== null &&
          P.type === te &&
          P.key === null &&
          (P = P.props.children),
        typeof P == "object" && P !== null)
      ) {
        switch (P.$$typeof) {
          case z:
            e: {
              for (var X = P.key, Z = C; Z !== null;) {
                if (Z.key === X) {
                  if (((X = P.type), X === te)) {
                    if (Z.tag === 7) {
                      (o(j, Z.sibling), (C = d(Z, P.props.children)), (C.return = j), (j = C));
                      break e;
                    }
                  } else if (
                    Z.elementType === X ||
                    (typeof X == "object" && X !== null && X.$$typeof === tt && Np(X) === Z.type)
                  ) {
                    (o(j, Z.sibling),
                      (C = d(Z, P.props)),
                      (C.ref = Gs(j, Z, P)),
                      (C.return = j),
                      (j = C));
                    break e;
                  }
                  o(j, Z);
                  break;
                } else r(j, Z);
                Z = Z.sibling;
              }
              P.type === te
                ? ((C = or(P.props.children, j.mode, B, P.key)), (C.return = j), (j = C))
                : ((B = Uo(P.type, P.key, P.props, null, j.mode, B)),
                  (B.ref = Gs(j, C, P)),
                  (B.return = j),
                  (j = B));
            }
            return x(j);
          case J:
            e: {
              for (Z = P.key; C !== null;) {
                if (C.key === Z)
                  if (
                    C.tag === 4 &&
                    C.stateNode.containerInfo === P.containerInfo &&
                    C.stateNode.implementation === P.implementation
                  ) {
                    (o(j, C.sibling), (C = d(C, P.children || [])), (C.return = j), (j = C));
                    break e;
                  } else {
                    o(j, C);
                    break;
                  }
                else r(j, C);
                C = C.sibling;
              }
              ((C = ku(P, j.mode, B)), (C.return = j), (j = C));
            }
            return x(j);
          case tt:
            return ((Z = P._init), Me(j, C, Z(P._payload), B));
        }
        if (Ss(P)) return K(j, C, P, B);
        if (q(P)) return Y(j, C, P, B);
        vo(j, P);
      }
      return (typeof P == "string" && P !== "") || typeof P == "number"
        ? ((P = "" + P),
          C !== null && C.tag === 6
            ? (o(j, C.sibling), (C = d(C, P)), (C.return = j), (j = C))
            : (o(j, C), (C = Cu(P, j.mode, B)), (C.return = j), (j = C)),
          x(j))
        : o(j, C);
    }
    return Me;
  }
  var Fr = jp(!0),
    Pp = jp(!1),
    xo = Nn(null),
    wo = null,
    Vr = null,
    Dl = null;
  function Ll() {
    Dl = Vr = wo = null;
  }
  function Ol(n) {
    var r = xo.current;
    (Ee(xo), (n._currentValue = r));
  }
  function Fl(n, r, o) {
    for (; n !== null;) {
      var l = n.alternate;
      if (
        ((n.childLanes & r) !== r
          ? ((n.childLanes |= r), l !== null && (l.childLanes |= r))
          : l !== null && (l.childLanes & r) !== r && (l.childLanes |= r),
        n === o)
      )
        break;
      n = n.return;
    }
  }
  function Br(n, r) {
    ((wo = n),
      (Dl = Vr = null),
      (n = n.dependencies),
      n !== null &&
        n.firstContext !== null &&
        ((n.lanes & r) !== 0 && (ct = !0), (n.firstContext = null)));
  }
  function Ct(n) {
    var r = n._currentValue;
    if (Dl !== n)
      if (((n = { context: n, memoizedValue: r, next: null }), Vr === null)) {
        if (wo === null) throw Error(s(308));
        ((Vr = n), (wo.dependencies = { lanes: 0, firstContext: n }));
      } else Vr = Vr.next = n;
    return r;
  }
  var Zn = null;
  function Vl(n) {
    Zn === null ? (Zn = [n]) : Zn.push(n);
  }
  function Rp(n, r, o, l) {
    var d = r.interleaved;
    return (
      d === null ? ((o.next = o), Vl(r)) : ((o.next = d.next), (d.next = o)),
      (r.interleaved = o),
      on(n, l)
    );
  }
  function on(n, r) {
    n.lanes |= r;
    var o = n.alternate;
    for (o !== null && (o.lanes |= r), o = n, n = n.return; n !== null;)
      ((n.childLanes |= r),
        (o = n.alternate),
        o !== null && (o.childLanes |= r),
        (o = n),
        (n = n.return));
    return o.tag === 3 ? o.stateNode : null;
  }
  var Rn = !1;
  function Bl(n) {
    n.updateQueue = {
      baseState: n.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function Ip(n, r) {
    ((n = n.updateQueue),
      r.updateQueue === n &&
        (r.updateQueue = {
          baseState: n.baseState,
          firstBaseUpdate: n.firstBaseUpdate,
          lastBaseUpdate: n.lastBaseUpdate,
          shared: n.shared,
          effects: n.effects,
        }));
  }
  function an(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function In(n, r, o) {
    var l = n.updateQueue;
    if (l === null) return null;
    if (((l = l.shared), (de & 2) !== 0)) {
      var d = l.pending;
      return (
        d === null ? (r.next = r) : ((r.next = d.next), (d.next = r)),
        (l.pending = r),
        on(n, o)
      );
    }
    return (
      (d = l.interleaved),
      d === null ? ((r.next = r), Vl(l)) : ((r.next = d.next), (d.next = r)),
      (l.interleaved = r),
      on(n, o)
    );
  }
  function So(n, r, o) {
    if (((r = r.updateQueue), r !== null && ((r = r.shared), (o & 4194240) !== 0))) {
      var l = r.lanes;
      ((l &= n.pendingLanes), (o |= l), (r.lanes = o), el(n, o));
    }
  }
  function Ap(n, r) {
    var o = n.updateQueue,
      l = n.alternate;
    if (l !== null && ((l = l.updateQueue), o === l)) {
      var d = null,
        m = null;
      if (((o = o.firstBaseUpdate), o !== null)) {
        do {
          var x = {
            eventTime: o.eventTime,
            lane: o.lane,
            tag: o.tag,
            payload: o.payload,
            callback: o.callback,
            next: null,
          };
          (m === null ? (d = m = x) : (m = m.next = x), (o = o.next));
        } while (o !== null);
        m === null ? (d = m = r) : (m = m.next = r);
      } else d = m = r;
      ((o = {
        baseState: l.baseState,
        firstBaseUpdate: d,
        lastBaseUpdate: m,
        shared: l.shared,
        effects: l.effects,
      }),
        (n.updateQueue = o));
      return;
    }
    ((n = o.lastBaseUpdate),
      n === null ? (o.firstBaseUpdate = r) : (n.next = r),
      (o.lastBaseUpdate = r));
  }
  function Eo(n, r, o, l) {
    var d = n.updateQueue;
    Rn = !1;
    var m = d.firstBaseUpdate,
      x = d.lastBaseUpdate,
      S = d.shared.pending;
    if (S !== null) {
      d.shared.pending = null;
      var T = S,
        I = T.next;
      ((T.next = null), x === null ? (m = I) : (x.next = I), (x = T));
      var F = n.alternate;
      F !== null &&
        ((F = F.updateQueue),
        (S = F.lastBaseUpdate),
        S !== x && (S === null ? (F.firstBaseUpdate = I) : (S.next = I), (F.lastBaseUpdate = T)));
    }
    if (m !== null) {
      var V = d.baseState;
      ((x = 0), (F = I = T = null), (S = m));
      do {
        var L = S.lane,
          W = S.eventTime;
        if ((l & L) === L) {
          F !== null &&
            (F = F.next =
              {
                eventTime: W,
                lane: 0,
                tag: S.tag,
                payload: S.payload,
                callback: S.callback,
                next: null,
              });
          e: {
            var K = n,
              Y = S;
            switch (((L = r), (W = o), Y.tag)) {
              case 1:
                if (((K = Y.payload), typeof K == "function")) {
                  V = K.call(W, V, L);
                  break e;
                }
                V = K;
                break e;
              case 3:
                K.flags = (K.flags & -65537) | 128;
              case 0:
                if (
                  ((K = Y.payload), (L = typeof K == "function" ? K.call(W, V, L) : K), L == null)
                )
                  break e;
                V = H({}, V, L);
                break e;
              case 2:
                Rn = !0;
            }
          }
          S.callback !== null &&
            S.lane !== 0 &&
            ((n.flags |= 64), (L = d.effects), L === null ? (d.effects = [S]) : L.push(S));
        } else
          ((W = {
            eventTime: W,
            lane: L,
            tag: S.tag,
            payload: S.payload,
            callback: S.callback,
            next: null,
          }),
            F === null ? ((I = F = W), (T = V)) : (F = F.next = W),
            (x |= L));
        if (((S = S.next), S === null)) {
          if (((S = d.shared.pending), S === null)) break;
          ((L = S),
            (S = L.next),
            (L.next = null),
            (d.lastBaseUpdate = L),
            (d.shared.pending = null));
        }
      } while (!0);
      if (
        (F === null && (T = V),
        (d.baseState = T),
        (d.firstBaseUpdate = I),
        (d.lastBaseUpdate = F),
        (r = d.shared.interleaved),
        r !== null)
      ) {
        d = r;
        do ((x |= d.lane), (d = d.next));
        while (d !== r);
      } else m === null && (d.shared.lanes = 0);
      ((nr |= x), (n.lanes = x), (n.memoizedState = V));
    }
  }
  function Mp(n, r, o) {
    if (((n = r.effects), (r.effects = null), n !== null))
      for (r = 0; r < n.length; r++) {
        var l = n[r],
          d = l.callback;
        if (d !== null) {
          if (((l.callback = null), (l = o), typeof d != "function")) throw Error(s(191, d));
          d.call(l);
        }
      }
  }
  var Ks = {},
    Xt = Nn(Ks),
    Ys = Nn(Ks),
    Xs = Nn(Ks);
  function er(n) {
    if (n === Ks) throw Error(s(174));
    return n;
  }
  function $l(n, r) {
    switch ((we(Xs, r), we(Ys, n), we(Xt, Ks), (n = r.nodeType), n)) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Ua(null, "");
        break;
      default:
        ((n = n === 8 ? r.parentNode : r),
          (r = n.namespaceURI || null),
          (n = n.tagName),
          (r = Ua(r, n)));
    }
    (Ee(Xt), we(Xt, r));
  }
  function $r() {
    (Ee(Xt), Ee(Ys), Ee(Xs));
  }
  function Dp(n) {
    er(Xs.current);
    var r = er(Xt.current),
      o = Ua(r, n.type);
    r !== o && (we(Ys, n), we(Xt, o));
  }
  function Ul(n) {
    Ys.current === n && (Ee(Xt), Ee(Ys));
  }
  var be = Nn(0);
  function _o(n) {
    for (var r = n; r !== null;) {
      if (r.tag === 13) {
        var o = r.memoizedState;
        if (o !== null && ((o = o.dehydrated), o === null || o.data === "$?" || o.data === "$!"))
          return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if ((r.flags & 128) !== 0) return r;
      } else if (r.child !== null) {
        ((r.child.return = r), (r = r.child));
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null;) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      ((r.sibling.return = r.return), (r = r.sibling));
    }
    return null;
  }
  var zl = [];
  function Hl() {
    for (var n = 0; n < zl.length; n++) zl[n]._workInProgressVersionPrimary = null;
    zl.length = 0;
  }
  var To = $.ReactCurrentDispatcher,
    Wl = $.ReactCurrentBatchConfig,
    tr = 0,
    Ne = null,
    Ve = null,
    Ue = null,
    Co = !1,
    qs = !1,
    Qs = 0,
    Jw = 0;
  function Xe() {
    throw Error(s(321));
  }
  function Gl(n, r) {
    if (r === null) return !1;
    for (var o = 0; o < r.length && o < n.length; o++) if (!Dt(n[o], r[o])) return !1;
    return !0;
  }
  function Kl(n, r, o, l, d, m) {
    if (
      ((tr = m),
      (Ne = r),
      (r.memoizedState = null),
      (r.updateQueue = null),
      (r.lanes = 0),
      (To.current = n === null || n.memoizedState === null ? nS : rS),
      (n = o(l, d)),
      qs)
    ) {
      m = 0;
      do {
        if (((qs = !1), (Qs = 0), 25 <= m)) throw Error(s(301));
        ((m += 1), (Ue = Ve = null), (r.updateQueue = null), (To.current = sS), (n = o(l, d)));
      } while (qs);
    }
    if (
      ((To.current = No),
      (r = Ve !== null && Ve.next !== null),
      (tr = 0),
      (Ue = Ve = Ne = null),
      (Co = !1),
      r)
    )
      throw Error(s(300));
    return n;
  }
  function Yl() {
    var n = Qs !== 0;
    return ((Qs = 0), n);
  }
  function qt() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Ue === null ? (Ne.memoizedState = Ue = n) : (Ue = Ue.next = n), Ue);
  }
  function kt() {
    if (Ve === null) {
      var n = Ne.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Ve.next;
    var r = Ue === null ? Ne.memoizedState : Ue.next;
    if (r !== null) ((Ue = r), (Ve = n));
    else {
      if (n === null) throw Error(s(310));
      ((Ve = n),
        (n = {
          memoizedState: Ve.memoizedState,
          baseState: Ve.baseState,
          baseQueue: Ve.baseQueue,
          queue: Ve.queue,
          next: null,
        }),
        Ue === null ? (Ne.memoizedState = Ue = n) : (Ue = Ue.next = n));
    }
    return Ue;
  }
  function Js(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Xl(n) {
    var r = kt(),
      o = r.queue;
    if (o === null) throw Error(s(311));
    o.lastRenderedReducer = n;
    var l = Ve,
      d = l.baseQueue,
      m = o.pending;
    if (m !== null) {
      if (d !== null) {
        var x = d.next;
        ((d.next = m.next), (m.next = x));
      }
      ((l.baseQueue = d = m), (o.pending = null));
    }
    if (d !== null) {
      ((m = d.next), (l = l.baseState));
      var S = (x = null),
        T = null,
        I = m;
      do {
        var F = I.lane;
        if ((tr & F) === F)
          (T !== null &&
            (T = T.next =
              {
                lane: 0,
                action: I.action,
                hasEagerState: I.hasEagerState,
                eagerState: I.eagerState,
                next: null,
              }),
            (l = I.hasEagerState ? I.eagerState : n(l, I.action)));
        else {
          var V = {
            lane: F,
            action: I.action,
            hasEagerState: I.hasEagerState,
            eagerState: I.eagerState,
            next: null,
          };
          (T === null ? ((S = T = V), (x = l)) : (T = T.next = V), (Ne.lanes |= F), (nr |= F));
        }
        I = I.next;
      } while (I !== null && I !== m);
      (T === null ? (x = l) : (T.next = S),
        Dt(l, r.memoizedState) || (ct = !0),
        (r.memoizedState = l),
        (r.baseState = x),
        (r.baseQueue = T),
        (o.lastRenderedState = l));
    }
    if (((n = o.interleaved), n !== null)) {
      d = n;
      do ((m = d.lane), (Ne.lanes |= m), (nr |= m), (d = d.next));
      while (d !== n);
    } else d === null && (o.lanes = 0);
    return [r.memoizedState, o.dispatch];
  }
  function ql(n) {
    var r = kt(),
      o = r.queue;
    if (o === null) throw Error(s(311));
    o.lastRenderedReducer = n;
    var l = o.dispatch,
      d = o.pending,
      m = r.memoizedState;
    if (d !== null) {
      o.pending = null;
      var x = (d = d.next);
      do ((m = n(m, x.action)), (x = x.next));
      while (x !== d);
      (Dt(m, r.memoizedState) || (ct = !0),
        (r.memoizedState = m),
        r.baseQueue === null && (r.baseState = m),
        (o.lastRenderedState = m));
    }
    return [m, l];
  }
  function Lp() {}
  function Op(n, r) {
    var o = Ne,
      l = kt(),
      d = r(),
      m = !Dt(l.memoizedState, d);
    if (
      (m && ((l.memoizedState = d), (ct = !0)),
      (l = l.queue),
      Ql(Bp.bind(null, o, l, n), [n]),
      l.getSnapshot !== r || m || (Ue !== null && Ue.memoizedState.tag & 1))
    ) {
      if (((o.flags |= 2048), Zs(9, Vp.bind(null, o, l, d, r), void 0, null), ze === null))
        throw Error(s(349));
      (tr & 30) !== 0 || Fp(o, r, d);
    }
    return d;
  }
  function Fp(n, r, o) {
    ((n.flags |= 16384),
      (n = { getSnapshot: r, value: o }),
      (r = Ne.updateQueue),
      r === null
        ? ((r = { lastEffect: null, stores: null }), (Ne.updateQueue = r), (r.stores = [n]))
        : ((o = r.stores), o === null ? (r.stores = [n]) : o.push(n)));
  }
  function Vp(n, r, o, l) {
    ((r.value = o), (r.getSnapshot = l), $p(r) && Up(n));
  }
  function Bp(n, r, o) {
    return o(function () {
      $p(r) && Up(n);
    });
  }
  function $p(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var o = r();
      return !Dt(n, o);
    } catch {
      return !0;
    }
  }
  function Up(n) {
    var r = on(n, 1);
    r !== null && Bt(r, n, 1, -1);
  }
  function zp(n) {
    var r = qt();
    return (
      typeof n == "function" && (n = n()),
      (r.memoizedState = r.baseState = n),
      (n = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Js,
        lastRenderedState: n,
      }),
      (r.queue = n),
      (n = n.dispatch = tS.bind(null, Ne, n)),
      [r.memoizedState, n]
    );
  }
  function Zs(n, r, o, l) {
    return (
      (n = { tag: n, create: r, destroy: o, deps: l, next: null }),
      (r = Ne.updateQueue),
      r === null
        ? ((r = { lastEffect: null, stores: null }),
          (Ne.updateQueue = r),
          (r.lastEffect = n.next = n))
        : ((o = r.lastEffect),
          o === null
            ? (r.lastEffect = n.next = n)
            : ((l = o.next), (o.next = n), (n.next = l), (r.lastEffect = n))),
      n
    );
  }
  function Hp() {
    return kt().memoizedState;
  }
  function ko(n, r, o, l) {
    var d = qt();
    ((Ne.flags |= n), (d.memoizedState = Zs(1 | r, o, void 0, l === void 0 ? null : l)));
  }
  function bo(n, r, o, l) {
    var d = kt();
    l = l === void 0 ? null : l;
    var m = void 0;
    if (Ve !== null) {
      var x = Ve.memoizedState;
      if (((m = x.destroy), l !== null && Gl(l, x.deps))) {
        d.memoizedState = Zs(r, o, m, l);
        return;
      }
    }
    ((Ne.flags |= n), (d.memoizedState = Zs(1 | r, o, m, l)));
  }
  function Wp(n, r) {
    return ko(8390656, 8, n, r);
  }
  function Ql(n, r) {
    return bo(2048, 8, n, r);
  }
  function Gp(n, r) {
    return bo(4, 2, n, r);
  }
  function Kp(n, r) {
    return bo(4, 4, n, r);
  }
  function Yp(n, r) {
    if (typeof r == "function")
      return (
        (n = n()),
        r(n),
        function () {
          r(null);
        }
      );
    if (r != null)
      return (
        (n = n()),
        (r.current = n),
        function () {
          r.current = null;
        }
      );
  }
  function Xp(n, r, o) {
    return ((o = o != null ? o.concat([n]) : null), bo(4, 4, Yp.bind(null, r, n), o));
  }
  function Jl() {}
  function qp(n, r) {
    var o = kt();
    r = r === void 0 ? null : r;
    var l = o.memoizedState;
    return l !== null && r !== null && Gl(r, l[1]) ? l[0] : ((o.memoizedState = [n, r]), n);
  }
  function Qp(n, r) {
    var o = kt();
    r = r === void 0 ? null : r;
    var l = o.memoizedState;
    return l !== null && r !== null && Gl(r, l[1])
      ? l[0]
      : ((n = n()), (o.memoizedState = [n, r]), n);
  }
  function Jp(n, r, o) {
    return (tr & 21) === 0
      ? (n.baseState && ((n.baseState = !1), (ct = !0)), (n.memoizedState = o))
      : (Dt(o, r) || ((o = Nf()), (Ne.lanes |= o), (nr |= o), (n.baseState = !0)), r);
  }
  function Zw(n, r) {
    var o = ye;
    ((ye = o !== 0 && 4 > o ? o : 4), n(!0));
    var l = Wl.transition;
    Wl.transition = {};
    try {
      (n(!1), r());
    } finally {
      ((ye = o), (Wl.transition = l));
    }
  }
  function Zp() {
    return kt().memoizedState;
  }
  function eS(n, r, o) {
    var l = Ln(n);
    if (((o = { lane: l, action: o, hasEagerState: !1, eagerState: null, next: null }), eh(n)))
      th(r, o);
    else if (((o = Rp(n, r, o, l)), o !== null)) {
      var d = rt();
      (Bt(o, n, l, d), nh(o, r, l));
    }
  }
  function tS(n, r, o) {
    var l = Ln(n),
      d = { lane: l, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (eh(n)) th(r, d);
    else {
      var m = n.alternate;
      if (
        n.lanes === 0 &&
        (m === null || m.lanes === 0) &&
        ((m = r.lastRenderedReducer), m !== null)
      )
        try {
          var x = r.lastRenderedState,
            S = m(x, o);
          if (((d.hasEagerState = !0), (d.eagerState = S), Dt(S, x))) {
            var T = r.interleaved;
            (T === null ? ((d.next = d), Vl(r)) : ((d.next = T.next), (T.next = d)),
              (r.interleaved = d));
            return;
          }
        } catch {}
      ((o = Rp(n, r, d, l)), o !== null && ((d = rt()), Bt(o, n, l, d), nh(o, r, l)));
    }
  }
  function eh(n) {
    var r = n.alternate;
    return n === Ne || (r !== null && r === Ne);
  }
  function th(n, r) {
    qs = Co = !0;
    var o = n.pending;
    (o === null ? (r.next = r) : ((r.next = o.next), (o.next = r)), (n.pending = r));
  }
  function nh(n, r, o) {
    if ((o & 4194240) !== 0) {
      var l = r.lanes;
      ((l &= n.pendingLanes), (o |= l), (r.lanes = o), el(n, o));
    }
  }
  var No = {
      readContext: Ct,
      useCallback: Xe,
      useContext: Xe,
      useEffect: Xe,
      useImperativeHandle: Xe,
      useInsertionEffect: Xe,
      useLayoutEffect: Xe,
      useMemo: Xe,
      useReducer: Xe,
      useRef: Xe,
      useState: Xe,
      useDebugValue: Xe,
      useDeferredValue: Xe,
      useTransition: Xe,
      useMutableSource: Xe,
      useSyncExternalStore: Xe,
      useId: Xe,
      unstable_isNewReconciler: !1,
    },
    nS = {
      readContext: Ct,
      useCallback: function (n, r) {
        return ((qt().memoizedState = [n, r === void 0 ? null : r]), n);
      },
      useContext: Ct,
      useEffect: Wp,
      useImperativeHandle: function (n, r, o) {
        return ((o = o != null ? o.concat([n]) : null), ko(4194308, 4, Yp.bind(null, r, n), o));
      },
      useLayoutEffect: function (n, r) {
        return ko(4194308, 4, n, r);
      },
      useInsertionEffect: function (n, r) {
        return ko(4, 2, n, r);
      },
      useMemo: function (n, r) {
        var o = qt();
        return ((r = r === void 0 ? null : r), (n = n()), (o.memoizedState = [n, r]), n);
      },
      useReducer: function (n, r, o) {
        var l = qt();
        return (
          (r = o !== void 0 ? o(r) : r),
          (l.memoizedState = l.baseState = r),
          (n = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: n,
            lastRenderedState: r,
          }),
          (l.queue = n),
          (n = n.dispatch = eS.bind(null, Ne, n)),
          [l.memoizedState, n]
        );
      },
      useRef: function (n) {
        var r = qt();
        return ((n = { current: n }), (r.memoizedState = n));
      },
      useState: zp,
      useDebugValue: Jl,
      useDeferredValue: function (n) {
        return (qt().memoizedState = n);
      },
      useTransition: function () {
        var n = zp(!1),
          r = n[0];
        return ((n = Zw.bind(null, n[1])), (qt().memoizedState = n), [r, n]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (n, r, o) {
        var l = Ne,
          d = qt();
        if (Ce) {
          if (o === void 0) throw Error(s(407));
          o = o();
        } else {
          if (((o = r()), ze === null)) throw Error(s(349));
          (tr & 30) !== 0 || Fp(l, r, o);
        }
        d.memoizedState = o;
        var m = { value: o, getSnapshot: r };
        return (
          (d.queue = m),
          Wp(Bp.bind(null, l, m, n), [n]),
          (l.flags |= 2048),
          Zs(9, Vp.bind(null, l, m, o, r), void 0, null),
          o
        );
      },
      useId: function () {
        var n = qt(),
          r = ze.identifierPrefix;
        if (Ce) {
          var o = sn,
            l = rn;
          ((o = (l & ~(1 << (32 - Mt(l) - 1))).toString(32) + o),
            (r = ":" + r + "R" + o),
            (o = Qs++),
            0 < o && (r += "H" + o.toString(32)),
            (r += ":"));
        } else ((o = Jw++), (r = ":" + r + "r" + o.toString(32) + ":"));
        return (n.memoizedState = r);
      },
      unstable_isNewReconciler: !1,
    },
    rS = {
      readContext: Ct,
      useCallback: qp,
      useContext: Ct,
      useEffect: Ql,
      useImperativeHandle: Xp,
      useInsertionEffect: Gp,
      useLayoutEffect: Kp,
      useMemo: Qp,
      useReducer: Xl,
      useRef: Hp,
      useState: function () {
        return Xl(Js);
      },
      useDebugValue: Jl,
      useDeferredValue: function (n) {
        var r = kt();
        return Jp(r, Ve.memoizedState, n);
      },
      useTransition: function () {
        var n = Xl(Js)[0],
          r = kt().memoizedState;
        return [n, r];
      },
      useMutableSource: Lp,
      useSyncExternalStore: Op,
      useId: Zp,
      unstable_isNewReconciler: !1,
    },
    sS = {
      readContext: Ct,
      useCallback: qp,
      useContext: Ct,
      useEffect: Ql,
      useImperativeHandle: Xp,
      useInsertionEffect: Gp,
      useLayoutEffect: Kp,
      useMemo: Qp,
      useReducer: ql,
      useRef: Hp,
      useState: function () {
        return ql(Js);
      },
      useDebugValue: Jl,
      useDeferredValue: function (n) {
        var r = kt();
        return Ve === null ? (r.memoizedState = n) : Jp(r, Ve.memoizedState, n);
      },
      useTransition: function () {
        var n = ql(Js)[0],
          r = kt().memoizedState;
        return [n, r];
      },
      useMutableSource: Lp,
      useSyncExternalStore: Op,
      useId: Zp,
      unstable_isNewReconciler: !1,
    };
  function Ot(n, r) {
    if (n && n.defaultProps) {
      ((r = H({}, r)), (n = n.defaultProps));
      for (var o in n) r[o] === void 0 && (r[o] = n[o]);
      return r;
    }
    return r;
  }
  function Zl(n, r, o, l) {
    ((r = n.memoizedState),
      (o = o(l, r)),
      (o = o == null ? r : H({}, r, o)),
      (n.memoizedState = o),
      n.lanes === 0 && (n.updateQueue.baseState = o));
  }
  var jo = {
    isMounted: function (n) {
      return (n = n._reactInternals) ? Yn(n) === n : !1;
    },
    enqueueSetState: function (n, r, o) {
      n = n._reactInternals;
      var l = rt(),
        d = Ln(n),
        m = an(l, d);
      ((m.payload = r),
        o != null && (m.callback = o),
        (r = In(n, m, d)),
        r !== null && (Bt(r, n, d, l), So(r, n, d)));
    },
    enqueueReplaceState: function (n, r, o) {
      n = n._reactInternals;
      var l = rt(),
        d = Ln(n),
        m = an(l, d);
      ((m.tag = 1),
        (m.payload = r),
        o != null && (m.callback = o),
        (r = In(n, m, d)),
        r !== null && (Bt(r, n, d, l), So(r, n, d)));
    },
    enqueueForceUpdate: function (n, r) {
      n = n._reactInternals;
      var o = rt(),
        l = Ln(n),
        d = an(o, l);
      ((d.tag = 2),
        r != null && (d.callback = r),
        (r = In(n, d, l)),
        r !== null && (Bt(r, n, l, o), So(r, n, l)));
    },
  };
  function rh(n, r, o, l, d, m, x) {
    return (
      (n = n.stateNode),
      typeof n.shouldComponentUpdate == "function"
        ? n.shouldComponentUpdate(l, m, x)
        : r.prototype && r.prototype.isPureReactComponent
          ? !Vs(o, l) || !Vs(d, m)
          : !0
    );
  }
  function sh(n, r, o) {
    var l = !1,
      d = jn,
      m = r.contextType;
    return (
      typeof m == "object" && m !== null
        ? (m = Ct(m))
        : ((d = ut(r) ? qn : Ye.current),
          (l = r.contextTypes),
          (m = (l = l != null) ? Mr(n, d) : jn)),
      (r = new r(o, m)),
      (n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null),
      (r.updater = jo),
      (n.stateNode = r),
      (r._reactInternals = n),
      l &&
        ((n = n.stateNode),
        (n.__reactInternalMemoizedUnmaskedChildContext = d),
        (n.__reactInternalMemoizedMaskedChildContext = m)),
      r
    );
  }
  function ih(n, r, o, l) {
    ((n = r.state),
      typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(o, l),
      typeof r.UNSAFE_componentWillReceiveProps == "function" &&
        r.UNSAFE_componentWillReceiveProps(o, l),
      r.state !== n && jo.enqueueReplaceState(r, r.state, null));
  }
  function eu(n, r, o, l) {
    var d = n.stateNode;
    ((d.props = o), (d.state = n.memoizedState), (d.refs = {}), Bl(n));
    var m = r.contextType;
    (typeof m == "object" && m !== null
      ? (d.context = Ct(m))
      : ((m = ut(r) ? qn : Ye.current), (d.context = Mr(n, m))),
      (d.state = n.memoizedState),
      (m = r.getDerivedStateFromProps),
      typeof m == "function" && (Zl(n, r, m, o), (d.state = n.memoizedState)),
      typeof r.getDerivedStateFromProps == "function" ||
        typeof d.getSnapshotBeforeUpdate == "function" ||
        (typeof d.UNSAFE_componentWillMount != "function" &&
          typeof d.componentWillMount != "function") ||
        ((r = d.state),
        typeof d.componentWillMount == "function" && d.componentWillMount(),
        typeof d.UNSAFE_componentWillMount == "function" && d.UNSAFE_componentWillMount(),
        r !== d.state && jo.enqueueReplaceState(d, d.state, null),
        Eo(n, o, d, l),
        (d.state = n.memoizedState)),
      typeof d.componentDidMount == "function" && (n.flags |= 4194308));
  }
  function Ur(n, r) {
    try {
      var o = "",
        l = r;
      do ((o += pe(l)), (l = l.return));
      while (l);
      var d = o;
    } catch (m) {
      d =
        `
Error generating stack: ` +
        m.message +
        `
` +
        m.stack;
    }
    return { value: n, source: r, stack: d, digest: null };
  }
  function tu(n, r, o) {
    return { value: n, source: null, stack: o ?? null, digest: r ?? null };
  }
  function nu(n, r) {
    try {
      console.error(r.value);
    } catch (o) {
      setTimeout(function () {
        throw o;
      });
    }
  }
  var iS = typeof WeakMap == "function" ? WeakMap : Map;
  function oh(n, r, o) {
    ((o = an(-1, o)), (o.tag = 3), (o.payload = { element: null }));
    var l = r.value;
    return (
      (o.callback = function () {
        (Lo || ((Lo = !0), (yu = l)), nu(n, r));
      }),
      o
    );
  }
  function ah(n, r, o) {
    ((o = an(-1, o)), (o.tag = 3));
    var l = n.type.getDerivedStateFromError;
    if (typeof l == "function") {
      var d = r.value;
      ((o.payload = function () {
        return l(d);
      }),
        (o.callback = function () {
          nu(n, r);
        }));
    }
    var m = n.stateNode;
    return (
      m !== null &&
        typeof m.componentDidCatch == "function" &&
        (o.callback = function () {
          (nu(n, r),
            typeof l != "function" && (Mn === null ? (Mn = new Set([this])) : Mn.add(this)));
          var x = r.stack;
          this.componentDidCatch(r.value, { componentStack: x !== null ? x : "" });
        }),
      o
    );
  }
  function lh(n, r, o) {
    var l = n.pingCache;
    if (l === null) {
      l = n.pingCache = new iS();
      var d = new Set();
      l.set(r, d);
    } else ((d = l.get(r)), d === void 0 && ((d = new Set()), l.set(r, d)));
    d.has(o) || (d.add(o), (n = xS.bind(null, n, r, o)), r.then(n, n));
  }
  function uh(n) {
    do {
      var r;
      if (
        ((r = n.tag === 13) &&
          ((r = n.memoizedState), (r = r !== null ? r.dehydrated !== null : !0)),
        r)
      )
        return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function ch(n, r, o, l, d) {
    return (n.mode & 1) === 0
      ? (n === r
          ? (n.flags |= 65536)
          : ((n.flags |= 128),
            (o.flags |= 131072),
            (o.flags &= -52805),
            o.tag === 1 &&
              (o.alternate === null ? (o.tag = 17) : ((r = an(-1, 1)), (r.tag = 2), In(o, r, 1))),
            (o.lanes |= 1)),
        n)
      : ((n.flags |= 65536), (n.lanes = d), n);
  }
  var oS = $.ReactCurrentOwner,
    ct = !1;
  function nt(n, r, o, l) {
    r.child = n === null ? Pp(r, null, o, l) : Fr(r, n.child, o, l);
  }
  function dh(n, r, o, l, d) {
    o = o.render;
    var m = r.ref;
    return (
      Br(r, d),
      (l = Kl(n, r, o, l, m, d)),
      (o = Yl()),
      n !== null && !ct
        ? ((r.updateQueue = n.updateQueue), (r.flags &= -2053), (n.lanes &= ~d), ln(n, r, d))
        : (Ce && o && Pl(r), (r.flags |= 1), nt(n, r, l, d), r.child)
    );
  }
  function fh(n, r, o, l, d) {
    if (n === null) {
      var m = o.type;
      return typeof m == "function" &&
        !Tu(m) &&
        m.defaultProps === void 0 &&
        o.compare === null &&
        o.defaultProps === void 0
        ? ((r.tag = 15), (r.type = m), ph(n, r, m, l, d))
        : ((n = Uo(o.type, null, l, r, r.mode, d)), (n.ref = r.ref), (n.return = r), (r.child = n));
    }
    if (((m = n.child), (n.lanes & d) === 0)) {
      var x = m.memoizedProps;
      if (((o = o.compare), (o = o !== null ? o : Vs), o(x, l) && n.ref === r.ref))
        return ln(n, r, d);
    }
    return ((r.flags |= 1), (n = Fn(m, l)), (n.ref = r.ref), (n.return = r), (r.child = n));
  }
  function ph(n, r, o, l, d) {
    if (n !== null) {
      var m = n.memoizedProps;
      if (Vs(m, l) && n.ref === r.ref)
        if (((ct = !1), (r.pendingProps = l = m), (n.lanes & d) !== 0))
          (n.flags & 131072) !== 0 && (ct = !0);
        else return ((r.lanes = n.lanes), ln(n, r, d));
    }
    return ru(n, r, o, l, d);
  }
  function hh(n, r, o) {
    var l = r.pendingProps,
      d = l.children,
      m = n !== null ? n.memoizedState : null;
    if (l.mode === "hidden")
      if ((r.mode & 1) === 0)
        ((r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
          we(Hr, St),
          (St |= o));
      else {
        if ((o & 1073741824) === 0)
          return (
            (n = m !== null ? m.baseLanes | o : o),
            (r.lanes = r.childLanes = 1073741824),
            (r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }),
            (r.updateQueue = null),
            we(Hr, St),
            (St |= n),
            null
          );
        ((r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
          (l = m !== null ? m.baseLanes : o),
          we(Hr, St),
          (St |= l));
      }
    else
      (m !== null ? ((l = m.baseLanes | o), (r.memoizedState = null)) : (l = o),
        we(Hr, St),
        (St |= l));
    return (nt(n, r, d, o), r.child);
  }
  function mh(n, r) {
    var o = r.ref;
    ((n === null && o !== null) || (n !== null && n.ref !== o)) &&
      ((r.flags |= 512), (r.flags |= 2097152));
  }
  function ru(n, r, o, l, d) {
    var m = ut(o) ? qn : Ye.current;
    return (
      (m = Mr(r, m)),
      Br(r, d),
      (o = Kl(n, r, o, l, m, d)),
      (l = Yl()),
      n !== null && !ct
        ? ((r.updateQueue = n.updateQueue), (r.flags &= -2053), (n.lanes &= ~d), ln(n, r, d))
        : (Ce && l && Pl(r), (r.flags |= 1), nt(n, r, o, d), r.child)
    );
  }
  function gh(n, r, o, l, d) {
    if (ut(o)) {
      var m = !0;
      po(r);
    } else m = !1;
    if ((Br(r, d), r.stateNode === null)) (Ro(n, r), sh(r, o, l), eu(r, o, l, d), (l = !0));
    else if (n === null) {
      var x = r.stateNode,
        S = r.memoizedProps;
      x.props = S;
      var T = x.context,
        I = o.contextType;
      typeof I == "object" && I !== null
        ? (I = Ct(I))
        : ((I = ut(o) ? qn : Ye.current), (I = Mr(r, I)));
      var F = o.getDerivedStateFromProps,
        V = typeof F == "function" || typeof x.getSnapshotBeforeUpdate == "function";
      (V ||
        (typeof x.UNSAFE_componentWillReceiveProps != "function" &&
          typeof x.componentWillReceiveProps != "function") ||
        ((S !== l || T !== I) && ih(r, x, l, I)),
        (Rn = !1));
      var L = r.memoizedState;
      ((x.state = L),
        Eo(r, l, x, d),
        (T = r.memoizedState),
        S !== l || L !== T || lt.current || Rn
          ? (typeof F == "function" && (Zl(r, o, F, l), (T = r.memoizedState)),
            (S = Rn || rh(r, o, S, l, L, T, I))
              ? (V ||
                  (typeof x.UNSAFE_componentWillMount != "function" &&
                    typeof x.componentWillMount != "function") ||
                  (typeof x.componentWillMount == "function" && x.componentWillMount(),
                  typeof x.UNSAFE_componentWillMount == "function" &&
                    x.UNSAFE_componentWillMount()),
                typeof x.componentDidMount == "function" && (r.flags |= 4194308))
              : (typeof x.componentDidMount == "function" && (r.flags |= 4194308),
                (r.memoizedProps = l),
                (r.memoizedState = T)),
            (x.props = l),
            (x.state = T),
            (x.context = I),
            (l = S))
          : (typeof x.componentDidMount == "function" && (r.flags |= 4194308), (l = !1)));
    } else {
      ((x = r.stateNode),
        Ip(n, r),
        (S = r.memoizedProps),
        (I = r.type === r.elementType ? S : Ot(r.type, S)),
        (x.props = I),
        (V = r.pendingProps),
        (L = x.context),
        (T = o.contextType),
        typeof T == "object" && T !== null
          ? (T = Ct(T))
          : ((T = ut(o) ? qn : Ye.current), (T = Mr(r, T))));
      var W = o.getDerivedStateFromProps;
      ((F = typeof W == "function" || typeof x.getSnapshotBeforeUpdate == "function") ||
        (typeof x.UNSAFE_componentWillReceiveProps != "function" &&
          typeof x.componentWillReceiveProps != "function") ||
        ((S !== V || L !== T) && ih(r, x, l, T)),
        (Rn = !1),
        (L = r.memoizedState),
        (x.state = L),
        Eo(r, l, x, d));
      var K = r.memoizedState;
      S !== V || L !== K || lt.current || Rn
        ? (typeof W == "function" && (Zl(r, o, W, l), (K = r.memoizedState)),
          (I = Rn || rh(r, o, I, l, L, K, T) || !1)
            ? (F ||
                (typeof x.UNSAFE_componentWillUpdate != "function" &&
                  typeof x.componentWillUpdate != "function") ||
                (typeof x.componentWillUpdate == "function" && x.componentWillUpdate(l, K, T),
                typeof x.UNSAFE_componentWillUpdate == "function" &&
                  x.UNSAFE_componentWillUpdate(l, K, T)),
              typeof x.componentDidUpdate == "function" && (r.flags |= 4),
              typeof x.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024))
            : (typeof x.componentDidUpdate != "function" ||
                (S === n.memoizedProps && L === n.memoizedState) ||
                (r.flags |= 4),
              typeof x.getSnapshotBeforeUpdate != "function" ||
                (S === n.memoizedProps && L === n.memoizedState) ||
                (r.flags |= 1024),
              (r.memoizedProps = l),
              (r.memoizedState = K)),
          (x.props = l),
          (x.state = K),
          (x.context = T),
          (l = I))
        : (typeof x.componentDidUpdate != "function" ||
            (S === n.memoizedProps && L === n.memoizedState) ||
            (r.flags |= 4),
          typeof x.getSnapshotBeforeUpdate != "function" ||
            (S === n.memoizedProps && L === n.memoizedState) ||
            (r.flags |= 1024),
          (l = !1));
    }
    return su(n, r, o, l, m, d);
  }
  function su(n, r, o, l, d, m) {
    mh(n, r);
    var x = (r.flags & 128) !== 0;
    if (!l && !x) return (d && Sp(r, o, !1), ln(n, r, m));
    ((l = r.stateNode), (oS.current = r));
    var S = x && typeof o.getDerivedStateFromError != "function" ? null : l.render();
    return (
      (r.flags |= 1),
      n !== null && x
        ? ((r.child = Fr(r, n.child, null, m)), (r.child = Fr(r, null, S, m)))
        : nt(n, r, S, m),
      (r.memoizedState = l.state),
      d && Sp(r, o, !0),
      r.child
    );
  }
  function yh(n) {
    var r = n.stateNode;
    (r.pendingContext
      ? xp(n, r.pendingContext, r.pendingContext !== r.context)
      : r.context && xp(n, r.context, !1),
      $l(n, r.containerInfo));
  }
  function vh(n, r, o, l, d) {
    return (Or(), Ml(d), (r.flags |= 256), nt(n, r, o, l), r.child);
  }
  var iu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ou(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function xh(n, r, o) {
    var l = r.pendingProps,
      d = be.current,
      m = !1,
      x = (r.flags & 128) !== 0,
      S;
    if (
      ((S = x) || (S = n !== null && n.memoizedState === null ? !1 : (d & 2) !== 0),
      S ? ((m = !0), (r.flags &= -129)) : (n === null || n.memoizedState !== null) && (d |= 1),
      we(be, d & 1),
      n === null)
    )
      return (
        Al(r),
        (n = r.memoizedState),
        n !== null && ((n = n.dehydrated), n !== null)
          ? ((r.mode & 1) === 0
              ? (r.lanes = 1)
              : n.data === "$!"
                ? (r.lanes = 8)
                : (r.lanes = 1073741824),
            null)
          : ((x = l.children),
            (n = l.fallback),
            m
              ? ((l = r.mode),
                (m = r.child),
                (x = { mode: "hidden", children: x }),
                (l & 1) === 0 && m !== null
                  ? ((m.childLanes = 0), (m.pendingProps = x))
                  : (m = zo(x, l, 0, null)),
                (n = or(n, l, o, null)),
                (m.return = r),
                (n.return = r),
                (m.sibling = n),
                (r.child = m),
                (r.child.memoizedState = ou(o)),
                (r.memoizedState = iu),
                n)
              : au(r, x))
      );
    if (((d = n.memoizedState), d !== null && ((S = d.dehydrated), S !== null)))
      return aS(n, r, x, l, S, d, o);
    if (m) {
      ((m = l.fallback), (x = r.mode), (d = n.child), (S = d.sibling));
      var T = { mode: "hidden", children: l.children };
      return (
        (x & 1) === 0 && r.child !== d
          ? ((l = r.child), (l.childLanes = 0), (l.pendingProps = T), (r.deletions = null))
          : ((l = Fn(d, T)), (l.subtreeFlags = d.subtreeFlags & 14680064)),
        S !== null ? (m = Fn(S, m)) : ((m = or(m, x, o, null)), (m.flags |= 2)),
        (m.return = r),
        (l.return = r),
        (l.sibling = m),
        (r.child = l),
        (l = m),
        (m = r.child),
        (x = n.child.memoizedState),
        (x =
          x === null
            ? ou(o)
            : { baseLanes: x.baseLanes | o, cachePool: null, transitions: x.transitions }),
        (m.memoizedState = x),
        (m.childLanes = n.childLanes & ~o),
        (r.memoizedState = iu),
        l
      );
    }
    return (
      (m = n.child),
      (n = m.sibling),
      (l = Fn(m, { mode: "visible", children: l.children })),
      (r.mode & 1) === 0 && (l.lanes = o),
      (l.return = r),
      (l.sibling = null),
      n !== null &&
        ((o = r.deletions), o === null ? ((r.deletions = [n]), (r.flags |= 16)) : o.push(n)),
      (r.child = l),
      (r.memoizedState = null),
      l
    );
  }
  function au(n, r) {
    return (
      (r = zo({ mode: "visible", children: r }, n.mode, 0, null)),
      (r.return = n),
      (n.child = r)
    );
  }
  function Po(n, r, o, l) {
    return (
      l !== null && Ml(l),
      Fr(r, n.child, null, o),
      (n = au(r, r.pendingProps.children)),
      (n.flags |= 2),
      (r.memoizedState = null),
      n
    );
  }
  function aS(n, r, o, l, d, m, x) {
    if (o)
      return r.flags & 256
        ? ((r.flags &= -257), (l = tu(Error(s(422)))), Po(n, r, x, l))
        : r.memoizedState !== null
          ? ((r.child = n.child), (r.flags |= 128), null)
          : ((m = l.fallback),
            (d = r.mode),
            (l = zo({ mode: "visible", children: l.children }, d, 0, null)),
            (m = or(m, d, x, null)),
            (m.flags |= 2),
            (l.return = r),
            (m.return = r),
            (l.sibling = m),
            (r.child = l),
            (r.mode & 1) !== 0 && Fr(r, n.child, null, x),
            (r.child.memoizedState = ou(x)),
            (r.memoizedState = iu),
            m);
    if ((r.mode & 1) === 0) return Po(n, r, x, null);
    if (d.data === "$!") {
      if (((l = d.nextSibling && d.nextSibling.dataset), l)) var S = l.dgst;
      return ((l = S), (m = Error(s(419))), (l = tu(m, l, void 0)), Po(n, r, x, l));
    }
    if (((S = (x & n.childLanes) !== 0), ct || S)) {
      if (((l = ze), l !== null)) {
        switch (x & -x) {
          case 4:
            d = 2;
            break;
          case 16:
            d = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            d = 32;
            break;
          case 536870912:
            d = 268435456;
            break;
          default:
            d = 0;
        }
        ((d = (d & (l.suspendedLanes | x)) !== 0 ? 0 : d),
          d !== 0 && d !== m.retryLane && ((m.retryLane = d), on(n, d), Bt(l, n, d, -1)));
      }
      return (_u(), (l = tu(Error(s(421)))), Po(n, r, x, l));
    }
    return d.data === "$?"
      ? ((r.flags |= 128), (r.child = n.child), (r = wS.bind(null, n)), (d._reactRetry = r), null)
      : ((n = m.treeContext),
        (wt = bn(d.nextSibling)),
        (xt = r),
        (Ce = !0),
        (Lt = null),
        n !== null &&
          ((_t[Tt++] = rn),
          (_t[Tt++] = sn),
          (_t[Tt++] = Qn),
          (rn = n.id),
          (sn = n.overflow),
          (Qn = r)),
        (r = au(r, l.children)),
        (r.flags |= 4096),
        r);
  }
  function wh(n, r, o) {
    n.lanes |= r;
    var l = n.alternate;
    (l !== null && (l.lanes |= r), Fl(n.return, r, o));
  }
  function lu(n, r, o, l, d) {
    var m = n.memoizedState;
    m === null
      ? (n.memoizedState = {
          isBackwards: r,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: o,
          tailMode: d,
        })
      : ((m.isBackwards = r),
        (m.rendering = null),
        (m.renderingStartTime = 0),
        (m.last = l),
        (m.tail = o),
        (m.tailMode = d));
  }
  function Sh(n, r, o) {
    var l = r.pendingProps,
      d = l.revealOrder,
      m = l.tail;
    if ((nt(n, r, l.children, o), (l = be.current), (l & 2) !== 0))
      ((l = (l & 1) | 2), (r.flags |= 128));
    else {
      if (n !== null && (n.flags & 128) !== 0)
        e: for (n = r.child; n !== null;) {
          if (n.tag === 13) n.memoizedState !== null && wh(n, o, r);
          else if (n.tag === 19) wh(n, o, r);
          else if (n.child !== null) {
            ((n.child.return = n), (n = n.child));
            continue;
          }
          if (n === r) break e;
          for (; n.sibling === null;) {
            if (n.return === null || n.return === r) break e;
            n = n.return;
          }
          ((n.sibling.return = n.return), (n = n.sibling));
        }
      l &= 1;
    }
    if ((we(be, l), (r.mode & 1) === 0)) r.memoizedState = null;
    else
      switch (d) {
        case "forwards":
          for (o = r.child, d = null; o !== null;)
            ((n = o.alternate), n !== null && _o(n) === null && (d = o), (o = o.sibling));
          ((o = d),
            o === null ? ((d = r.child), (r.child = null)) : ((d = o.sibling), (o.sibling = null)),
            lu(r, !1, d, o, m));
          break;
        case "backwards":
          for (o = null, d = r.child, r.child = null; d !== null;) {
            if (((n = d.alternate), n !== null && _o(n) === null)) {
              r.child = d;
              break;
            }
            ((n = d.sibling), (d.sibling = o), (o = d), (d = n));
          }
          lu(r, !0, o, null, m);
          break;
        case "together":
          lu(r, !1, null, null, void 0);
          break;
        default:
          r.memoizedState = null;
      }
    return r.child;
  }
  function Ro(n, r) {
    (r.mode & 1) === 0 &&
      n !== null &&
      ((n.alternate = null), (r.alternate = null), (r.flags |= 2));
  }
  function ln(n, r, o) {
    if (
      (n !== null && (r.dependencies = n.dependencies), (nr |= r.lanes), (o & r.childLanes) === 0)
    )
      return null;
    if (n !== null && r.child !== n.child) throw Error(s(153));
    if (r.child !== null) {
      for (n = r.child, o = Fn(n, n.pendingProps), r.child = o, o.return = r; n.sibling !== null;)
        ((n = n.sibling), (o = o.sibling = Fn(n, n.pendingProps)), (o.return = r));
      o.sibling = null;
    }
    return r.child;
  }
  function lS(n, r, o) {
    switch (r.tag) {
      case 3:
        (yh(r), Or());
        break;
      case 5:
        Dp(r);
        break;
      case 1:
        ut(r.type) && po(r);
        break;
      case 4:
        $l(r, r.stateNode.containerInfo);
        break;
      case 10:
        var l = r.type._context,
          d = r.memoizedProps.value;
        (we(xo, l._currentValue), (l._currentValue = d));
        break;
      case 13:
        if (((l = r.memoizedState), l !== null))
          return l.dehydrated !== null
            ? (we(be, be.current & 1), (r.flags |= 128), null)
            : (o & r.child.childLanes) !== 0
              ? xh(n, r, o)
              : (we(be, be.current & 1), (n = ln(n, r, o)), n !== null ? n.sibling : null);
        we(be, be.current & 1);
        break;
      case 19:
        if (((l = (o & r.childLanes) !== 0), (n.flags & 128) !== 0)) {
          if (l) return Sh(n, r, o);
          r.flags |= 128;
        }
        if (
          ((d = r.memoizedState),
          d !== null && ((d.rendering = null), (d.tail = null), (d.lastEffect = null)),
          we(be, be.current),
          l)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((r.lanes = 0), hh(n, r, o));
    }
    return ln(n, r, o);
  }
  var Eh, uu, _h, Th;
  ((Eh = function (n, r) {
    for (var o = r.child; o !== null;) {
      if (o.tag === 5 || o.tag === 6) n.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        ((o.child.return = o), (o = o.child));
        continue;
      }
      if (o === r) break;
      for (; o.sibling === null;) {
        if (o.return === null || o.return === r) return;
        o = o.return;
      }
      ((o.sibling.return = o.return), (o = o.sibling));
    }
  }),
    (uu = function () {}),
    (_h = function (n, r, o, l) {
      var d = n.memoizedProps;
      if (d !== l) {
        ((n = r.stateNode), er(Xt.current));
        var m = null;
        switch (o) {
          case "input":
            ((d = Fa(n, d)), (l = Fa(n, l)), (m = []));
            break;
          case "select":
            ((d = H({}, d, { value: void 0 })), (l = H({}, l, { value: void 0 })), (m = []));
            break;
          case "textarea":
            ((d = $a(n, d)), (l = $a(n, l)), (m = []));
            break;
          default:
            typeof d.onClick != "function" && typeof l.onClick == "function" && (n.onclick = uo);
        }
        za(o, l);
        var x;
        o = null;
        for (I in d)
          if (!l.hasOwnProperty(I) && d.hasOwnProperty(I) && d[I] != null)
            if (I === "style") {
              var S = d[I];
              for (x in S) S.hasOwnProperty(x) && (o || (o = {}), (o[x] = ""));
            } else
              I !== "dangerouslySetInnerHTML" &&
                I !== "children" &&
                I !== "suppressContentEditableWarning" &&
                I !== "suppressHydrationWarning" &&
                I !== "autoFocus" &&
                (a.hasOwnProperty(I) ? m || (m = []) : (m = m || []).push(I, null));
        for (I in l) {
          var T = l[I];
          if (((S = d?.[I]), l.hasOwnProperty(I) && T !== S && (T != null || S != null)))
            if (I === "style")
              if (S) {
                for (x in S)
                  !S.hasOwnProperty(x) ||
                    (T && T.hasOwnProperty(x)) ||
                    (o || (o = {}), (o[x] = ""));
                for (x in T) T.hasOwnProperty(x) && S[x] !== T[x] && (o || (o = {}), (o[x] = T[x]));
              } else (o || (m || (m = []), m.push(I, o)), (o = T));
            else
              I === "dangerouslySetInnerHTML"
                ? ((T = T ? T.__html : void 0),
                  (S = S ? S.__html : void 0),
                  T != null && S !== T && (m = m || []).push(I, T))
                : I === "children"
                  ? (typeof T != "string" && typeof T != "number") || (m = m || []).push(I, "" + T)
                  : I !== "suppressContentEditableWarning" &&
                    I !== "suppressHydrationWarning" &&
                    (a.hasOwnProperty(I)
                      ? (T != null && I === "onScroll" && Se("scroll", n), m || S === T || (m = []))
                      : (m = m || []).push(I, T));
        }
        o && (m = m || []).push("style", o);
        var I = m;
        (r.updateQueue = I) && (r.flags |= 4);
      }
    }),
    (Th = function (n, r, o, l) {
      o !== l && (r.flags |= 4);
    }));
  function ei(n, r) {
    if (!Ce)
      switch (n.tailMode) {
        case "hidden":
          r = n.tail;
          for (var o = null; r !== null;) (r.alternate !== null && (o = r), (r = r.sibling));
          o === null ? (n.tail = null) : (o.sibling = null);
          break;
        case "collapsed":
          o = n.tail;
          for (var l = null; o !== null;) (o.alternate !== null && (l = o), (o = o.sibling));
          l === null
            ? r || n.tail === null
              ? (n.tail = null)
              : (n.tail.sibling = null)
            : (l.sibling = null);
      }
  }
  function qe(n) {
    var r = n.alternate !== null && n.alternate.child === n.child,
      o = 0,
      l = 0;
    if (r)
      for (var d = n.child; d !== null;)
        ((o |= d.lanes | d.childLanes),
          (l |= d.subtreeFlags & 14680064),
          (l |= d.flags & 14680064),
          (d.return = n),
          (d = d.sibling));
    else
      for (d = n.child; d !== null;)
        ((o |= d.lanes | d.childLanes),
          (l |= d.subtreeFlags),
          (l |= d.flags),
          (d.return = n),
          (d = d.sibling));
    return ((n.subtreeFlags |= l), (n.childLanes = o), r);
  }
  function uS(n, r, o) {
    var l = r.pendingProps;
    switch ((Rl(r), r.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (qe(r), null);
      case 1:
        return (ut(r.type) && fo(), qe(r), null);
      case 3:
        return (
          (l = r.stateNode),
          $r(),
          Ee(lt),
          Ee(Ye),
          Hl(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (n === null || n.child === null) &&
            (yo(r)
              ? (r.flags |= 4)
              : n === null ||
                (n.memoizedState.isDehydrated && (r.flags & 256) === 0) ||
                ((r.flags |= 1024), Lt !== null && (wu(Lt), (Lt = null)))),
          uu(n, r),
          qe(r),
          null
        );
      case 5:
        Ul(r);
        var d = er(Xs.current);
        if (((o = r.type), n !== null && r.stateNode != null))
          (_h(n, r, o, l, d), n.ref !== r.ref && ((r.flags |= 512), (r.flags |= 2097152)));
        else {
          if (!l) {
            if (r.stateNode === null) throw Error(s(166));
            return (qe(r), null);
          }
          if (((n = er(Xt.current)), yo(r))) {
            ((l = r.stateNode), (o = r.type));
            var m = r.memoizedProps;
            switch (((l[Yt] = r), (l[Hs] = m), (n = (r.mode & 1) !== 0), o)) {
              case "dialog":
                (Se("cancel", l), Se("close", l));
                break;
              case "iframe":
              case "object":
              case "embed":
                Se("load", l);
                break;
              case "video":
              case "audio":
                for (d = 0; d < $s.length; d++) Se($s[d], l);
                break;
              case "source":
                Se("error", l);
                break;
              case "img":
              case "image":
              case "link":
                (Se("error", l), Se("load", l));
                break;
              case "details":
                Se("toggle", l);
                break;
              case "input":
                (rf(l, m), Se("invalid", l));
                break;
              case "select":
                ((l._wrapperState = { wasMultiple: !!m.multiple }), Se("invalid", l));
                break;
              case "textarea":
                (af(l, m), Se("invalid", l));
            }
            (za(o, m), (d = null));
            for (var x in m)
              if (m.hasOwnProperty(x)) {
                var S = m[x];
                x === "children"
                  ? typeof S == "string"
                    ? l.textContent !== S &&
                      (m.suppressHydrationWarning !== !0 && lo(l.textContent, S, n),
                      (d = ["children", S]))
                    : typeof S == "number" &&
                      l.textContent !== "" + S &&
                      (m.suppressHydrationWarning !== !0 && lo(l.textContent, S, n),
                      (d = ["children", "" + S]))
                  : a.hasOwnProperty(x) && S != null && x === "onScroll" && Se("scroll", l);
              }
            switch (o) {
              case "input":
                (Vi(l), of(l, m, !0));
                break;
              case "textarea":
                (Vi(l), uf(l));
                break;
              case "select":
              case "option":
                break;
              default:
                typeof m.onClick == "function" && (l.onclick = uo);
            }
            ((l = d), (r.updateQueue = l), l !== null && (r.flags |= 4));
          } else {
            ((x = d.nodeType === 9 ? d : d.ownerDocument),
              n === "http://www.w3.org/1999/xhtml" && (n = cf(o)),
              n === "http://www.w3.org/1999/xhtml"
                ? o === "script"
                  ? ((n = x.createElement("div")),
                    (n.innerHTML = "<script><\/script>"),
                    (n = n.removeChild(n.firstChild)))
                  : typeof l.is == "string"
                    ? (n = x.createElement(o, { is: l.is }))
                    : ((n = x.createElement(o)),
                      o === "select" &&
                        ((x = n), l.multiple ? (x.multiple = !0) : l.size && (x.size = l.size)))
                : (n = x.createElementNS(n, o)),
              (n[Yt] = r),
              (n[Hs] = l),
              Eh(n, r, !1, !1),
              (r.stateNode = n));
            e: {
              switch (((x = Ha(o, l)), o)) {
                case "dialog":
                  (Se("cancel", n), Se("close", n), (d = l));
                  break;
                case "iframe":
                case "object":
                case "embed":
                  (Se("load", n), (d = l));
                  break;
                case "video":
                case "audio":
                  for (d = 0; d < $s.length; d++) Se($s[d], n);
                  d = l;
                  break;
                case "source":
                  (Se("error", n), (d = l));
                  break;
                case "img":
                case "image":
                case "link":
                  (Se("error", n), Se("load", n), (d = l));
                  break;
                case "details":
                  (Se("toggle", n), (d = l));
                  break;
                case "input":
                  (rf(n, l), (d = Fa(n, l)), Se("invalid", n));
                  break;
                case "option":
                  d = l;
                  break;
                case "select":
                  ((n._wrapperState = { wasMultiple: !!l.multiple }),
                    (d = H({}, l, { value: void 0 })),
                    Se("invalid", n));
                  break;
                case "textarea":
                  (af(n, l), (d = $a(n, l)), Se("invalid", n));
                  break;
                default:
                  d = l;
              }
              (za(o, d), (S = d));
              for (m in S)
                if (S.hasOwnProperty(m)) {
                  var T = S[m];
                  m === "style"
                    ? pf(n, T)
                    : m === "dangerouslySetInnerHTML"
                      ? ((T = T ? T.__html : void 0), T != null && df(n, T))
                      : m === "children"
                        ? typeof T == "string"
                          ? (o !== "textarea" || T !== "") && Es(n, T)
                          : typeof T == "number" && Es(n, "" + T)
                        : m !== "suppressContentEditableWarning" &&
                          m !== "suppressHydrationWarning" &&
                          m !== "autoFocus" &&
                          (a.hasOwnProperty(m)
                            ? T != null && m === "onScroll" && Se("scroll", n)
                            : T != null && M(n, m, T, x));
                }
              switch (o) {
                case "input":
                  (Vi(n), of(n, l, !1));
                  break;
                case "textarea":
                  (Vi(n), uf(n));
                  break;
                case "option":
                  l.value != null && n.setAttribute("value", "" + ge(l.value));
                  break;
                case "select":
                  ((n.multiple = !!l.multiple),
                    (m = l.value),
                    m != null
                      ? Er(n, !!l.multiple, m, !1)
                      : l.defaultValue != null && Er(n, !!l.multiple, l.defaultValue, !0));
                  break;
                default:
                  typeof d.onClick == "function" && (n.onclick = uo);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  l = !!l.autoFocus;
                  break e;
                case "img":
                  l = !0;
                  break e;
                default:
                  l = !1;
              }
            }
            l && (r.flags |= 4);
          }
          r.ref !== null && ((r.flags |= 512), (r.flags |= 2097152));
        }
        return (qe(r), null);
      case 6:
        if (n && r.stateNode != null) Th(n, r, n.memoizedProps, l);
        else {
          if (typeof l != "string" && r.stateNode === null) throw Error(s(166));
          if (((o = er(Xs.current)), er(Xt.current), yo(r))) {
            if (
              ((l = r.stateNode),
              (o = r.memoizedProps),
              (l[Yt] = r),
              (m = l.nodeValue !== o) && ((n = xt), n !== null))
            )
              switch (n.tag) {
                case 3:
                  lo(l.nodeValue, o, (n.mode & 1) !== 0);
                  break;
                case 5:
                  n.memoizedProps.suppressHydrationWarning !== !0 &&
                    lo(l.nodeValue, o, (n.mode & 1) !== 0);
              }
            m && (r.flags |= 4);
          } else
            ((l = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(l)),
              (l[Yt] = r),
              (r.stateNode = l));
        }
        return (qe(r), null);
      case 13:
        if (
          (Ee(be),
          (l = r.memoizedState),
          n === null || (n.memoizedState !== null && n.memoizedState.dehydrated !== null))
        ) {
          if (Ce && wt !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0)
            (bp(), Or(), (r.flags |= 98560), (m = !1));
          else if (((m = yo(r)), l !== null && l.dehydrated !== null)) {
            if (n === null) {
              if (!m) throw Error(s(318));
              if (((m = r.memoizedState), (m = m !== null ? m.dehydrated : null), !m))
                throw Error(s(317));
              m[Yt] = r;
            } else (Or(), (r.flags & 128) === 0 && (r.memoizedState = null), (r.flags |= 4));
            (qe(r), (m = !1));
          } else (Lt !== null && (wu(Lt), (Lt = null)), (m = !0));
          if (!m) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0
          ? ((r.lanes = o), r)
          : ((l = l !== null),
            l !== (n !== null && n.memoizedState !== null) &&
              l &&
              ((r.child.flags |= 8192),
              (r.mode & 1) !== 0 &&
                (n === null || (be.current & 1) !== 0 ? Be === 0 && (Be = 3) : _u())),
            r.updateQueue !== null && (r.flags |= 4),
            qe(r),
            null);
      case 4:
        return ($r(), uu(n, r), n === null && Us(r.stateNode.containerInfo), qe(r), null);
      case 10:
        return (Ol(r.type._context), qe(r), null);
      case 17:
        return (ut(r.type) && fo(), qe(r), null);
      case 19:
        if ((Ee(be), (m = r.memoizedState), m === null)) return (qe(r), null);
        if (((l = (r.flags & 128) !== 0), (x = m.rendering), x === null))
          if (l) ei(m, !1);
          else {
            if (Be !== 0 || (n !== null && (n.flags & 128) !== 0))
              for (n = r.child; n !== null;) {
                if (((x = _o(n)), x !== null)) {
                  for (
                    r.flags |= 128,
                      ei(m, !1),
                      l = x.updateQueue,
                      l !== null && ((r.updateQueue = l), (r.flags |= 4)),
                      r.subtreeFlags = 0,
                      l = o,
                      o = r.child;
                    o !== null;
                  )
                    ((m = o),
                      (n = l),
                      (m.flags &= 14680066),
                      (x = m.alternate),
                      x === null
                        ? ((m.childLanes = 0),
                          (m.lanes = n),
                          (m.child = null),
                          (m.subtreeFlags = 0),
                          (m.memoizedProps = null),
                          (m.memoizedState = null),
                          (m.updateQueue = null),
                          (m.dependencies = null),
                          (m.stateNode = null))
                        : ((m.childLanes = x.childLanes),
                          (m.lanes = x.lanes),
                          (m.child = x.child),
                          (m.subtreeFlags = 0),
                          (m.deletions = null),
                          (m.memoizedProps = x.memoizedProps),
                          (m.memoizedState = x.memoizedState),
                          (m.updateQueue = x.updateQueue),
                          (m.type = x.type),
                          (n = x.dependencies),
                          (m.dependencies =
                            n === null ? null : { lanes: n.lanes, firstContext: n.firstContext })),
                      (o = o.sibling));
                  return (we(be, (be.current & 1) | 2), r.child);
                }
                n = n.sibling;
              }
            m.tail !== null &&
              Ae() > Wr &&
              ((r.flags |= 128), (l = !0), ei(m, !1), (r.lanes = 4194304));
          }
        else {
          if (!l)
            if (((n = _o(x)), n !== null)) {
              if (
                ((r.flags |= 128),
                (l = !0),
                (o = n.updateQueue),
                o !== null && ((r.updateQueue = o), (r.flags |= 4)),
                ei(m, !0),
                m.tail === null && m.tailMode === "hidden" && !x.alternate && !Ce)
              )
                return (qe(r), null);
            } else
              2 * Ae() - m.renderingStartTime > Wr &&
                o !== 1073741824 &&
                ((r.flags |= 128), (l = !0), ei(m, !1), (r.lanes = 4194304));
          m.isBackwards
            ? ((x.sibling = r.child), (r.child = x))
            : ((o = m.last), o !== null ? (o.sibling = x) : (r.child = x), (m.last = x));
        }
        return m.tail !== null
          ? ((r = m.tail),
            (m.rendering = r),
            (m.tail = r.sibling),
            (m.renderingStartTime = Ae()),
            (r.sibling = null),
            (o = be.current),
            we(be, l ? (o & 1) | 2 : o & 1),
            r)
          : (qe(r), null);
      case 22:
      case 23:
        return (
          Eu(),
          (l = r.memoizedState !== null),
          n !== null && (n.memoizedState !== null) !== l && (r.flags |= 8192),
          l && (r.mode & 1) !== 0
            ? (St & 1073741824) !== 0 && (qe(r), r.subtreeFlags & 6 && (r.flags |= 8192))
            : qe(r),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, r.tag));
  }
  function cS(n, r) {
    switch ((Rl(r), r.tag)) {
      case 1:
        return (
          ut(r.type) && fo(),
          (n = r.flags),
          n & 65536 ? ((r.flags = (n & -65537) | 128), r) : null
        );
      case 3:
        return (
          $r(),
          Ee(lt),
          Ee(Ye),
          Hl(),
          (n = r.flags),
          (n & 65536) !== 0 && (n & 128) === 0 ? ((r.flags = (n & -65537) | 128), r) : null
        );
      case 5:
        return (Ul(r), null);
      case 13:
        if ((Ee(be), (n = r.memoizedState), n !== null && n.dehydrated !== null)) {
          if (r.alternate === null) throw Error(s(340));
          Or();
        }
        return ((n = r.flags), n & 65536 ? ((r.flags = (n & -65537) | 128), r) : null);
      case 19:
        return (Ee(be), null);
      case 4:
        return ($r(), null);
      case 10:
        return (Ol(r.type._context), null);
      case 22:
      case 23:
        return (Eu(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Io = !1,
    Qe = !1,
    dS = typeof WeakSet == "function" ? WeakSet : Set,
    G = null;
  function zr(n, r) {
    var o = n.ref;
    if (o !== null)
      if (typeof o == "function")
        try {
          o(null);
        } catch (l) {
          Re(n, r, l);
        }
      else o.current = null;
  }
  function cu(n, r, o) {
    try {
      o();
    } catch (l) {
      Re(n, r, l);
    }
  }
  var Ch = !1;
  function fS(n, r) {
    if (((El = Qi), (n = rp()), hl(n))) {
      if ("selectionStart" in n) var o = { start: n.selectionStart, end: n.selectionEnd };
      else
        e: {
          o = ((o = n.ownerDocument) && o.defaultView) || window;
          var l = o.getSelection && o.getSelection();
          if (l && l.rangeCount !== 0) {
            o = l.anchorNode;
            var d = l.anchorOffset,
              m = l.focusNode;
            l = l.focusOffset;
            try {
              (o.nodeType, m.nodeType);
            } catch {
              o = null;
              break e;
            }
            var x = 0,
              S = -1,
              T = -1,
              I = 0,
              F = 0,
              V = n,
              L = null;
            t: for (;;) {
              for (
                var W;
                V !== o || (d !== 0 && V.nodeType !== 3) || (S = x + d),
                  V !== m || (l !== 0 && V.nodeType !== 3) || (T = x + l),
                  V.nodeType === 3 && (x += V.nodeValue.length),
                  (W = V.firstChild) !== null;
              )
                ((L = V), (V = W));
              for (;;) {
                if (V === n) break t;
                if (
                  (L === o && ++I === d && (S = x),
                  L === m && ++F === l && (T = x),
                  (W = V.nextSibling) !== null)
                )
                  break;
                ((V = L), (L = V.parentNode));
              }
              V = W;
            }
            o = S === -1 || T === -1 ? null : { start: S, end: T };
          } else o = null;
        }
      o = o || { start: 0, end: 0 };
    } else o = null;
    for (_l = { focusedElem: n, selectionRange: o }, Qi = !1, G = r; G !== null;)
      if (((r = G), (n = r.child), (r.subtreeFlags & 1028) !== 0 && n !== null))
        ((n.return = r), (G = n));
      else
        for (; G !== null;) {
          r = G;
          try {
            var K = r.alternate;
            if ((r.flags & 1024) !== 0)
              switch (r.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (K !== null) {
                    var Y = K.memoizedProps,
                      Me = K.memoizedState,
                      j = r.stateNode,
                      C = j.getSnapshotBeforeUpdate(
                        r.elementType === r.type ? Y : Ot(r.type, Y),
                        Me
                      );
                    j.__reactInternalSnapshotBeforeUpdate = C;
                  }
                  break;
                case 3:
                  var P = r.stateNode.containerInfo;
                  P.nodeType === 1
                    ? (P.textContent = "")
                    : P.nodeType === 9 && P.documentElement && P.removeChild(P.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(s(163));
              }
          } catch (B) {
            Re(r, r.return, B);
          }
          if (((n = r.sibling), n !== null)) {
            ((n.return = r.return), (G = n));
            break;
          }
          G = r.return;
        }
    return ((K = Ch), (Ch = !1), K);
  }
  function ti(n, r, o) {
    var l = r.updateQueue;
    if (((l = l !== null ? l.lastEffect : null), l !== null)) {
      var d = (l = l.next);
      do {
        if ((d.tag & n) === n) {
          var m = d.destroy;
          ((d.destroy = void 0), m !== void 0 && cu(r, o, m));
        }
        d = d.next;
      } while (d !== l);
    }
  }
  function Ao(n, r) {
    if (((r = r.updateQueue), (r = r !== null ? r.lastEffect : null), r !== null)) {
      var o = (r = r.next);
      do {
        if ((o.tag & n) === n) {
          var l = o.create;
          o.destroy = l();
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function du(n) {
    var r = n.ref;
    if (r !== null) {
      var o = n.stateNode;
      (n.tag, (n = o), typeof r == "function" ? r(n) : (r.current = n));
    }
  }
  function kh(n) {
    var r = n.alternate;
    (r !== null && ((n.alternate = null), kh(r)),
      (n.child = null),
      (n.deletions = null),
      (n.sibling = null),
      n.tag === 5 &&
        ((r = n.stateNode),
        r !== null && (delete r[Yt], delete r[Hs], delete r[bl], delete r[Yw], delete r[Xw])),
      (n.stateNode = null),
      (n.return = null),
      (n.dependencies = null),
      (n.memoizedProps = null),
      (n.memoizedState = null),
      (n.pendingProps = null),
      (n.stateNode = null),
      (n.updateQueue = null));
  }
  function bh(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Nh(n) {
    e: for (;;) {
      for (; n.sibling === null;) {
        if (n.return === null || bh(n.return)) return null;
        n = n.return;
      }
      for (
        n.sibling.return = n.return, n = n.sibling;
        n.tag !== 5 && n.tag !== 6 && n.tag !== 18;
      ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        ((n.child.return = n), (n = n.child));
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function fu(n, r, o) {
    var l = n.tag;
    if (l === 5 || l === 6)
      ((n = n.stateNode),
        r
          ? o.nodeType === 8
            ? o.parentNode.insertBefore(n, r)
            : o.insertBefore(n, r)
          : (o.nodeType === 8
              ? ((r = o.parentNode), r.insertBefore(n, o))
              : ((r = o), r.appendChild(n)),
            (o = o._reactRootContainer),
            o != null || r.onclick !== null || (r.onclick = uo)));
    else if (l !== 4 && ((n = n.child), n !== null))
      for (fu(n, r, o), n = n.sibling; n !== null;) (fu(n, r, o), (n = n.sibling));
  }
  function pu(n, r, o) {
    var l = n.tag;
    if (l === 5 || l === 6) ((n = n.stateNode), r ? o.insertBefore(n, r) : o.appendChild(n));
    else if (l !== 4 && ((n = n.child), n !== null))
      for (pu(n, r, o), n = n.sibling; n !== null;) (pu(n, r, o), (n = n.sibling));
  }
  var We = null,
    Ft = !1;
  function An(n, r, o) {
    for (o = o.child; o !== null;) (jh(n, r, o), (o = o.sibling));
  }
  function jh(n, r, o) {
    if (Kt && typeof Kt.onCommitFiberUnmount == "function")
      try {
        Kt.onCommitFiberUnmount(Wi, o);
      } catch {}
    switch (o.tag) {
      case 5:
        Qe || zr(o, r);
      case 6:
        var l = We,
          d = Ft;
        ((We = null),
          An(n, r, o),
          (We = l),
          (Ft = d),
          We !== null &&
            (Ft
              ? ((n = We),
                (o = o.stateNode),
                n.nodeType === 8 ? n.parentNode.removeChild(o) : n.removeChild(o))
              : We.removeChild(o.stateNode)));
        break;
      case 18:
        We !== null &&
          (Ft
            ? ((n = We),
              (o = o.stateNode),
              n.nodeType === 8 ? kl(n.parentNode, o) : n.nodeType === 1 && kl(n, o),
              As(n))
            : kl(We, o.stateNode));
        break;
      case 4:
        ((l = We),
          (d = Ft),
          (We = o.stateNode.containerInfo),
          (Ft = !0),
          An(n, r, o),
          (We = l),
          (Ft = d));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Qe && ((l = o.updateQueue), l !== null && ((l = l.lastEffect), l !== null))) {
          d = l = l.next;
          do {
            var m = d,
              x = m.destroy;
            ((m = m.tag),
              x !== void 0 && ((m & 2) !== 0 || (m & 4) !== 0) && cu(o, r, x),
              (d = d.next));
          } while (d !== l);
        }
        An(n, r, o);
        break;
      case 1:
        if (!Qe && (zr(o, r), (l = o.stateNode), typeof l.componentWillUnmount == "function"))
          try {
            ((l.props = o.memoizedProps), (l.state = o.memoizedState), l.componentWillUnmount());
          } catch (S) {
            Re(o, r, S);
          }
        An(n, r, o);
        break;
      case 21:
        An(n, r, o);
        break;
      case 22:
        o.mode & 1
          ? ((Qe = (l = Qe) || o.memoizedState !== null), An(n, r, o), (Qe = l))
          : An(n, r, o);
        break;
      default:
        An(n, r, o);
    }
  }
  function Ph(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var o = n.stateNode;
      (o === null && (o = n.stateNode = new dS()),
        r.forEach(function (l) {
          var d = SS.bind(null, n, l);
          o.has(l) || (o.add(l), l.then(d, d));
        }));
    }
  }
  function Vt(n, r) {
    var o = r.deletions;
    if (o !== null)
      for (var l = 0; l < o.length; l++) {
        var d = o[l];
        try {
          var m = n,
            x = r,
            S = x;
          e: for (; S !== null;) {
            switch (S.tag) {
              case 5:
                ((We = S.stateNode), (Ft = !1));
                break e;
              case 3:
                ((We = S.stateNode.containerInfo), (Ft = !0));
                break e;
              case 4:
                ((We = S.stateNode.containerInfo), (Ft = !0));
                break e;
            }
            S = S.return;
          }
          if (We === null) throw Error(s(160));
          (jh(m, x, d), (We = null), (Ft = !1));
          var T = d.alternate;
          (T !== null && (T.return = null), (d.return = null));
        } catch (I) {
          Re(d, r, I);
        }
      }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null;) (Rh(r, n), (r = r.sibling));
  }
  function Rh(n, r) {
    var o = n.alternate,
      l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((Vt(r, n), Qt(n), l & 4)) {
          try {
            (ti(3, n, n.return), Ao(3, n));
          } catch (Y) {
            Re(n, n.return, Y);
          }
          try {
            ti(5, n, n.return);
          } catch (Y) {
            Re(n, n.return, Y);
          }
        }
        break;
      case 1:
        (Vt(r, n), Qt(n), l & 512 && o !== null && zr(o, o.return));
        break;
      case 5:
        if ((Vt(r, n), Qt(n), l & 512 && o !== null && zr(o, o.return), n.flags & 32)) {
          var d = n.stateNode;
          try {
            Es(d, "");
          } catch (Y) {
            Re(n, n.return, Y);
          }
        }
        if (l & 4 && ((d = n.stateNode), d != null)) {
          var m = n.memoizedProps,
            x = o !== null ? o.memoizedProps : m,
            S = n.type,
            T = n.updateQueue;
          if (((n.updateQueue = null), T !== null))
            try {
              (S === "input" && m.type === "radio" && m.name != null && sf(d, m), Ha(S, x));
              var I = Ha(S, m);
              for (x = 0; x < T.length; x += 2) {
                var F = T[x],
                  V = T[x + 1];
                F === "style"
                  ? pf(d, V)
                  : F === "dangerouslySetInnerHTML"
                    ? df(d, V)
                    : F === "children"
                      ? Es(d, V)
                      : M(d, F, V, I);
              }
              switch (S) {
                case "input":
                  Va(d, m);
                  break;
                case "textarea":
                  lf(d, m);
                  break;
                case "select":
                  var L = d._wrapperState.wasMultiple;
                  d._wrapperState.wasMultiple = !!m.multiple;
                  var W = m.value;
                  W != null
                    ? Er(d, !!m.multiple, W, !1)
                    : L !== !!m.multiple &&
                      (m.defaultValue != null
                        ? Er(d, !!m.multiple, m.defaultValue, !0)
                        : Er(d, !!m.multiple, m.multiple ? [] : "", !1));
              }
              d[Hs] = m;
            } catch (Y) {
              Re(n, n.return, Y);
            }
        }
        break;
      case 6:
        if ((Vt(r, n), Qt(n), l & 4)) {
          if (n.stateNode === null) throw Error(s(162));
          ((d = n.stateNode), (m = n.memoizedProps));
          try {
            d.nodeValue = m;
          } catch (Y) {
            Re(n, n.return, Y);
          }
        }
        break;
      case 3:
        if ((Vt(r, n), Qt(n), l & 4 && o !== null && o.memoizedState.isDehydrated))
          try {
            As(r.containerInfo);
          } catch (Y) {
            Re(n, n.return, Y);
          }
        break;
      case 4:
        (Vt(r, n), Qt(n));
        break;
      case 13:
        (Vt(r, n),
          Qt(n),
          (d = n.child),
          d.flags & 8192 &&
            ((m = d.memoizedState !== null),
            (d.stateNode.isHidden = m),
            !m || (d.alternate !== null && d.alternate.memoizedState !== null) || (gu = Ae())),
          l & 4 && Ph(n));
        break;
      case 22:
        if (
          ((F = o !== null && o.memoizedState !== null),
          n.mode & 1 ? ((Qe = (I = Qe) || F), Vt(r, n), (Qe = I)) : Vt(r, n),
          Qt(n),
          l & 8192)
        ) {
          if (
            ((I = n.memoizedState !== null), (n.stateNode.isHidden = I) && !F && (n.mode & 1) !== 0)
          )
            for (G = n, F = n.child; F !== null;) {
              for (V = G = F; G !== null;) {
                switch (((L = G), (W = L.child), L.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    ti(4, L, L.return);
                    break;
                  case 1:
                    zr(L, L.return);
                    var K = L.stateNode;
                    if (typeof K.componentWillUnmount == "function") {
                      ((l = L), (o = L.return));
                      try {
                        ((r = l),
                          (K.props = r.memoizedProps),
                          (K.state = r.memoizedState),
                          K.componentWillUnmount());
                      } catch (Y) {
                        Re(l, o, Y);
                      }
                    }
                    break;
                  case 5:
                    zr(L, L.return);
                    break;
                  case 22:
                    if (L.memoizedState !== null) {
                      Mh(V);
                      continue;
                    }
                }
                W !== null ? ((W.return = L), (G = W)) : Mh(V);
              }
              F = F.sibling;
            }
          e: for (F = null, V = n; ;) {
            if (V.tag === 5) {
              if (F === null) {
                F = V;
                try {
                  ((d = V.stateNode),
                    I
                      ? ((m = d.style),
                        typeof m.setProperty == "function"
                          ? m.setProperty("display", "none", "important")
                          : (m.display = "none"))
                      : ((S = V.stateNode),
                        (T = V.memoizedProps.style),
                        (x = T != null && T.hasOwnProperty("display") ? T.display : null),
                        (S.style.display = ff("display", x))));
                } catch (Y) {
                  Re(n, n.return, Y);
                }
              }
            } else if (V.tag === 6) {
              if (F === null)
                try {
                  V.stateNode.nodeValue = I ? "" : V.memoizedProps;
                } catch (Y) {
                  Re(n, n.return, Y);
                }
            } else if (
              ((V.tag !== 22 && V.tag !== 23) || V.memoizedState === null || V === n) &&
              V.child !== null
            ) {
              ((V.child.return = V), (V = V.child));
              continue;
            }
            if (V === n) break e;
            for (; V.sibling === null;) {
              if (V.return === null || V.return === n) break e;
              (F === V && (F = null), (V = V.return));
            }
            (F === V && (F = null), (V.sibling.return = V.return), (V = V.sibling));
          }
        }
        break;
      case 19:
        (Vt(r, n), Qt(n), l & 4 && Ph(n));
        break;
      case 21:
        break;
      default:
        (Vt(r, n), Qt(n));
    }
  }
  function Qt(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var o = n.return; o !== null;) {
            if (bh(o)) {
              var l = o;
              break e;
            }
            o = o.return;
          }
          throw Error(s(160));
        }
        switch (l.tag) {
          case 5:
            var d = l.stateNode;
            l.flags & 32 && (Es(d, ""), (l.flags &= -33));
            var m = Nh(n);
            pu(n, m, d);
            break;
          case 3:
          case 4:
            var x = l.stateNode.containerInfo,
              S = Nh(n);
            fu(n, S, x);
            break;
          default:
            throw Error(s(161));
        }
      } catch (T) {
        Re(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function pS(n, r, o) {
    ((G = n), Ih(n));
  }
  function Ih(n, r, o) {
    for (var l = (n.mode & 1) !== 0; G !== null;) {
      var d = G,
        m = d.child;
      if (d.tag === 22 && l) {
        var x = d.memoizedState !== null || Io;
        if (!x) {
          var S = d.alternate,
            T = (S !== null && S.memoizedState !== null) || Qe;
          S = Io;
          var I = Qe;
          if (((Io = x), (Qe = T) && !I))
            for (G = d; G !== null;)
              ((x = G),
                (T = x.child),
                x.tag === 22 && x.memoizedState !== null
                  ? Dh(d)
                  : T !== null
                    ? ((T.return = x), (G = T))
                    : Dh(d));
          for (; m !== null;) ((G = m), Ih(m), (m = m.sibling));
          ((G = d), (Io = S), (Qe = I));
        }
        Ah(n);
      } else (d.subtreeFlags & 8772) !== 0 && m !== null ? ((m.return = d), (G = m)) : Ah(n);
    }
  }
  function Ah(n) {
    for (; G !== null;) {
      var r = G;
      if ((r.flags & 8772) !== 0) {
        var o = r.alternate;
        try {
          if ((r.flags & 8772) !== 0)
            switch (r.tag) {
              case 0:
              case 11:
              case 15:
                Qe || Ao(5, r);
                break;
              case 1:
                var l = r.stateNode;
                if (r.flags & 4 && !Qe)
                  if (o === null) l.componentDidMount();
                  else {
                    var d =
                      r.elementType === r.type ? o.memoizedProps : Ot(r.type, o.memoizedProps);
                    l.componentDidUpdate(d, o.memoizedState, l.__reactInternalSnapshotBeforeUpdate);
                  }
                var m = r.updateQueue;
                m !== null && Mp(r, m, l);
                break;
              case 3:
                var x = r.updateQueue;
                if (x !== null) {
                  if (((o = null), r.child !== null))
                    switch (r.child.tag) {
                      case 5:
                        o = r.child.stateNode;
                        break;
                      case 1:
                        o = r.child.stateNode;
                    }
                  Mp(r, x, o);
                }
                break;
              case 5:
                var S = r.stateNode;
                if (o === null && r.flags & 4) {
                  o = S;
                  var T = r.memoizedProps;
                  switch (r.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      T.autoFocus && o.focus();
                      break;
                    case "img":
                      T.src && (o.src = T.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (r.memoizedState === null) {
                  var I = r.alternate;
                  if (I !== null) {
                    var F = I.memoizedState;
                    if (F !== null) {
                      var V = F.dehydrated;
                      V !== null && As(V);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(s(163));
            }
          Qe || (r.flags & 512 && du(r));
        } catch (L) {
          Re(r, r.return, L);
        }
      }
      if (r === n) {
        G = null;
        break;
      }
      if (((o = r.sibling), o !== null)) {
        ((o.return = r.return), (G = o));
        break;
      }
      G = r.return;
    }
  }
  function Mh(n) {
    for (; G !== null;) {
      var r = G;
      if (r === n) {
        G = null;
        break;
      }
      var o = r.sibling;
      if (o !== null) {
        ((o.return = r.return), (G = o));
        break;
      }
      G = r.return;
    }
  }
  function Dh(n) {
    for (; G !== null;) {
      var r = G;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var o = r.return;
            try {
              Ao(4, r);
            } catch (T) {
              Re(r, o, T);
            }
            break;
          case 1:
            var l = r.stateNode;
            if (typeof l.componentDidMount == "function") {
              var d = r.return;
              try {
                l.componentDidMount();
              } catch (T) {
                Re(r, d, T);
              }
            }
            var m = r.return;
            try {
              du(r);
            } catch (T) {
              Re(r, m, T);
            }
            break;
          case 5:
            var x = r.return;
            try {
              du(r);
            } catch (T) {
              Re(r, x, T);
            }
        }
      } catch (T) {
        Re(r, r.return, T);
      }
      if (r === n) {
        G = null;
        break;
      }
      var S = r.sibling;
      if (S !== null) {
        ((S.return = r.return), (G = S));
        break;
      }
      G = r.return;
    }
  }
  var hS = Math.ceil,
    Mo = $.ReactCurrentDispatcher,
    hu = $.ReactCurrentOwner,
    bt = $.ReactCurrentBatchConfig,
    de = 0,
    ze = null,
    Le = null,
    Ge = 0,
    St = 0,
    Hr = Nn(0),
    Be = 0,
    ni = null,
    nr = 0,
    Do = 0,
    mu = 0,
    ri = null,
    dt = null,
    gu = 0,
    Wr = 1 / 0,
    un = null,
    Lo = !1,
    yu = null,
    Mn = null,
    Oo = !1,
    Dn = null,
    Fo = 0,
    si = 0,
    vu = null,
    Vo = -1,
    Bo = 0;
  function rt() {
    return (de & 6) !== 0 ? Ae() : Vo !== -1 ? Vo : (Vo = Ae());
  }
  function Ln(n) {
    return (n.mode & 1) === 0
      ? 1
      : (de & 2) !== 0 && Ge !== 0
        ? Ge & -Ge
        : Qw.transition !== null
          ? (Bo === 0 && (Bo = Nf()), Bo)
          : ((n = ye), n !== 0 || ((n = window.event), (n = n === void 0 ? 16 : Of(n.type))), n);
  }
  function Bt(n, r, o, l) {
    if (50 < si) throw ((si = 0), (vu = null), Error(s(185)));
    (Ns(n, o, l),
      ((de & 2) === 0 || n !== ze) &&
        (n === ze && ((de & 2) === 0 && (Do |= o), Be === 4 && On(n, Ge)),
        ft(n, l),
        o === 1 && de === 0 && (r.mode & 1) === 0 && ((Wr = Ae() + 500), ho && Pn())));
  }
  function ft(n, r) {
    var o = n.callbackNode;
    Qx(n, r);
    var l = Yi(n, n === ze ? Ge : 0);
    if (l === 0) (o !== null && Cf(o), (n.callbackNode = null), (n.callbackPriority = 0));
    else if (((r = l & -l), n.callbackPriority !== r)) {
      if ((o != null && Cf(o), r === 1))
        (n.tag === 0 ? qw(Oh.bind(null, n)) : Ep(Oh.bind(null, n)),
          Gw(function () {
            (de & 6) === 0 && Pn();
          }),
          (o = null));
      else {
        switch (jf(l)) {
          case 1:
            o = Qa;
            break;
          case 4:
            o = kf;
            break;
          case 16:
            o = Hi;
            break;
          case 536870912:
            o = bf;
            break;
          default:
            o = Hi;
        }
        o = Wh(o, Lh.bind(null, n));
      }
      ((n.callbackPriority = r), (n.callbackNode = o));
    }
  }
  function Lh(n, r) {
    if (((Vo = -1), (Bo = 0), (de & 6) !== 0)) throw Error(s(327));
    var o = n.callbackNode;
    if (Gr() && n.callbackNode !== o) return null;
    var l = Yi(n, n === ze ? Ge : 0);
    if (l === 0) return null;
    if ((l & 30) !== 0 || (l & n.expiredLanes) !== 0 || r) r = $o(n, l);
    else {
      r = l;
      var d = de;
      de |= 2;
      var m = Vh();
      (ze !== n || Ge !== r) && ((un = null), (Wr = Ae() + 500), sr(n, r));
      do
        try {
          yS();
          break;
        } catch (S) {
          Fh(n, S);
        }
      while (!0);
      (Ll(), (Mo.current = m), (de = d), Le !== null ? (r = 0) : ((ze = null), (Ge = 0), (r = Be)));
    }
    if (r !== 0) {
      if ((r === 2 && ((d = Ja(n)), d !== 0 && ((l = d), (r = xu(n, d)))), r === 1))
        throw ((o = ni), sr(n, 0), On(n, l), ft(n, Ae()), o);
      if (r === 6) On(n, l);
      else {
        if (
          ((d = n.current.alternate),
          (l & 30) === 0 &&
            !mS(d) &&
            ((r = $o(n, l)),
            r === 2 && ((m = Ja(n)), m !== 0 && ((l = m), (r = xu(n, m)))),
            r === 1))
        )
          throw ((o = ni), sr(n, 0), On(n, l), ft(n, Ae()), o);
        switch (((n.finishedWork = d), (n.finishedLanes = l), r)) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            ir(n, dt, un);
            break;
          case 3:
            if ((On(n, l), (l & 130023424) === l && ((r = gu + 500 - Ae()), 10 < r))) {
              if (Yi(n, 0) !== 0) break;
              if (((d = n.suspendedLanes), (d & l) !== l)) {
                (rt(), (n.pingedLanes |= n.suspendedLanes & d));
                break;
              }
              n.timeoutHandle = Cl(ir.bind(null, n, dt, un), r);
              break;
            }
            ir(n, dt, un);
            break;
          case 4:
            if ((On(n, l), (l & 4194240) === l)) break;
            for (r = n.eventTimes, d = -1; 0 < l;) {
              var x = 31 - Mt(l);
              ((m = 1 << x), (x = r[x]), x > d && (d = x), (l &= ~m));
            }
            if (
              ((l = d),
              (l = Ae() - l),
              (l =
                (120 > l
                  ? 120
                  : 480 > l
                    ? 480
                    : 1080 > l
                      ? 1080
                      : 1920 > l
                        ? 1920
                        : 3e3 > l
                          ? 3e3
                          : 4320 > l
                            ? 4320
                            : 1960 * hS(l / 1960)) - l),
              10 < l)
            ) {
              n.timeoutHandle = Cl(ir.bind(null, n, dt, un), l);
              break;
            }
            ir(n, dt, un);
            break;
          case 5:
            ir(n, dt, un);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return (ft(n, Ae()), n.callbackNode === o ? Lh.bind(null, n) : null);
  }
  function xu(n, r) {
    var o = ri;
    return (
      n.current.memoizedState.isDehydrated && (sr(n, r).flags |= 256),
      (n = $o(n, r)),
      n !== 2 && ((r = dt), (dt = o), r !== null && wu(r)),
      n
    );
  }
  function wu(n) {
    dt === null ? (dt = n) : dt.push.apply(dt, n);
  }
  function mS(n) {
    for (var r = n; ;) {
      if (r.flags & 16384) {
        var o = r.updateQueue;
        if (o !== null && ((o = o.stores), o !== null))
          for (var l = 0; l < o.length; l++) {
            var d = o[l],
              m = d.getSnapshot;
            d = d.value;
            try {
              if (!Dt(m(), d)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((o = r.child), r.subtreeFlags & 16384 && o !== null)) ((o.return = r), (r = o));
      else {
        if (r === n) break;
        for (; r.sibling === null;) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        ((r.sibling.return = r.return), (r = r.sibling));
      }
    }
    return !0;
  }
  function On(n, r) {
    for (
      r &= ~mu, r &= ~Do, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes;
      0 < r;
    ) {
      var o = 31 - Mt(r),
        l = 1 << o;
      ((n[o] = -1), (r &= ~l));
    }
  }
  function Oh(n) {
    if ((de & 6) !== 0) throw Error(s(327));
    Gr();
    var r = Yi(n, 0);
    if ((r & 1) === 0) return (ft(n, Ae()), null);
    var o = $o(n, r);
    if (n.tag !== 0 && o === 2) {
      var l = Ja(n);
      l !== 0 && ((r = l), (o = xu(n, l)));
    }
    if (o === 1) throw ((o = ni), sr(n, 0), On(n, r), ft(n, Ae()), o);
    if (o === 6) throw Error(s(345));
    return (
      (n.finishedWork = n.current.alternate),
      (n.finishedLanes = r),
      ir(n, dt, un),
      ft(n, Ae()),
      null
    );
  }
  function Su(n, r) {
    var o = de;
    de |= 1;
    try {
      return n(r);
    } finally {
      ((de = o), de === 0 && ((Wr = Ae() + 500), ho && Pn()));
    }
  }
  function rr(n) {
    Dn !== null && Dn.tag === 0 && (de & 6) === 0 && Gr();
    var r = de;
    de |= 1;
    var o = bt.transition,
      l = ye;
    try {
      if (((bt.transition = null), (ye = 1), n)) return n();
    } finally {
      ((ye = l), (bt.transition = o), (de = r), (de & 6) === 0 && Pn());
    }
  }
  function Eu() {
    ((St = Hr.current), Ee(Hr));
  }
  function sr(n, r) {
    ((n.finishedWork = null), (n.finishedLanes = 0));
    var o = n.timeoutHandle;
    if ((o !== -1 && ((n.timeoutHandle = -1), Ww(o)), Le !== null))
      for (o = Le.return; o !== null;) {
        var l = o;
        switch ((Rl(l), l.tag)) {
          case 1:
            ((l = l.type.childContextTypes), l != null && fo());
            break;
          case 3:
            ($r(), Ee(lt), Ee(Ye), Hl());
            break;
          case 5:
            Ul(l);
            break;
          case 4:
            $r();
            break;
          case 13:
            Ee(be);
            break;
          case 19:
            Ee(be);
            break;
          case 10:
            Ol(l.type._context);
            break;
          case 22:
          case 23:
            Eu();
        }
        o = o.return;
      }
    if (
      ((ze = n),
      (Le = n = Fn(n.current, null)),
      (Ge = St = r),
      (Be = 0),
      (ni = null),
      (mu = Do = nr = 0),
      (dt = ri = null),
      Zn !== null)
    ) {
      for (r = 0; r < Zn.length; r++)
        if (((o = Zn[r]), (l = o.interleaved), l !== null)) {
          o.interleaved = null;
          var d = l.next,
            m = o.pending;
          if (m !== null) {
            var x = m.next;
            ((m.next = d), (l.next = x));
          }
          o.pending = l;
        }
      Zn = null;
    }
    return n;
  }
  function Fh(n, r) {
    do {
      var o = Le;
      try {
        if ((Ll(), (To.current = No), Co)) {
          for (var l = Ne.memoizedState; l !== null;) {
            var d = l.queue;
            (d !== null && (d.pending = null), (l = l.next));
          }
          Co = !1;
        }
        if (
          ((tr = 0),
          (Ue = Ve = Ne = null),
          (qs = !1),
          (Qs = 0),
          (hu.current = null),
          o === null || o.return === null)
        ) {
          ((Be = 1), (ni = r), (Le = null));
          break;
        }
        e: {
          var m = n,
            x = o.return,
            S = o,
            T = r;
          if (
            ((r = Ge),
            (S.flags |= 32768),
            T !== null && typeof T == "object" && typeof T.then == "function")
          ) {
            var I = T,
              F = S,
              V = F.tag;
            if ((F.mode & 1) === 0 && (V === 0 || V === 11 || V === 15)) {
              var L = F.alternate;
              L
                ? ((F.updateQueue = L.updateQueue),
                  (F.memoizedState = L.memoizedState),
                  (F.lanes = L.lanes))
                : ((F.updateQueue = null), (F.memoizedState = null));
            }
            var W = uh(x);
            if (W !== null) {
              ((W.flags &= -257), ch(W, x, S, m, r), W.mode & 1 && lh(m, I, r), (r = W), (T = I));
              var K = r.updateQueue;
              if (K === null) {
                var Y = new Set();
                (Y.add(T), (r.updateQueue = Y));
              } else K.add(T);
              break e;
            } else {
              if ((r & 1) === 0) {
                (lh(m, I, r), _u());
                break e;
              }
              T = Error(s(426));
            }
          } else if (Ce && S.mode & 1) {
            var Me = uh(x);
            if (Me !== null) {
              ((Me.flags & 65536) === 0 && (Me.flags |= 256), ch(Me, x, S, m, r), Ml(Ur(T, S)));
              break e;
            }
          }
          ((m = T = Ur(T, S)),
            Be !== 4 && (Be = 2),
            ri === null ? (ri = [m]) : ri.push(m),
            (m = x));
          do {
            switch (m.tag) {
              case 3:
                ((m.flags |= 65536), (r &= -r), (m.lanes |= r));
                var j = oh(m, T, r);
                Ap(m, j);
                break e;
              case 1:
                S = T;
                var C = m.type,
                  P = m.stateNode;
                if (
                  (m.flags & 128) === 0 &&
                  (typeof C.getDerivedStateFromError == "function" ||
                    (P !== null &&
                      typeof P.componentDidCatch == "function" &&
                      (Mn === null || !Mn.has(P))))
                ) {
                  ((m.flags |= 65536), (r &= -r), (m.lanes |= r));
                  var B = ah(m, S, r);
                  Ap(m, B);
                  break e;
                }
            }
            m = m.return;
          } while (m !== null);
        }
        $h(o);
      } catch (X) {
        ((r = X), Le === o && o !== null && (Le = o = o.return));
        continue;
      }
      break;
    } while (!0);
  }
  function Vh() {
    var n = Mo.current;
    return ((Mo.current = No), n === null ? No : n);
  }
  function _u() {
    ((Be === 0 || Be === 3 || Be === 2) && (Be = 4),
      ze === null || ((nr & 268435455) === 0 && (Do & 268435455) === 0) || On(ze, Ge));
  }
  function $o(n, r) {
    var o = de;
    de |= 2;
    var l = Vh();
    (ze !== n || Ge !== r) && ((un = null), sr(n, r));
    do
      try {
        gS();
        break;
      } catch (d) {
        Fh(n, d);
      }
    while (!0);
    if ((Ll(), (de = o), (Mo.current = l), Le !== null)) throw Error(s(261));
    return ((ze = null), (Ge = 0), Be);
  }
  function gS() {
    for (; Le !== null;) Bh(Le);
  }
  function yS() {
    for (; Le !== null && !Ux();) Bh(Le);
  }
  function Bh(n) {
    var r = Hh(n.alternate, n, St);
    ((n.memoizedProps = n.pendingProps), r === null ? $h(n) : (Le = r), (hu.current = null));
  }
  function $h(n) {
    var r = n;
    do {
      var o = r.alternate;
      if (((n = r.return), (r.flags & 32768) === 0)) {
        if (((o = uS(o, r, St)), o !== null)) {
          Le = o;
          return;
        }
      } else {
        if (((o = cS(o, r)), o !== null)) {
          ((o.flags &= 32767), (Le = o));
          return;
        }
        if (n !== null) ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null));
        else {
          ((Be = 6), (Le = null));
          return;
        }
      }
      if (((r = r.sibling), r !== null)) {
        Le = r;
        return;
      }
      Le = r = n;
    } while (r !== null);
    Be === 0 && (Be = 5);
  }
  function ir(n, r, o) {
    var l = ye,
      d = bt.transition;
    try {
      ((bt.transition = null), (ye = 1), vS(n, r, o, l));
    } finally {
      ((bt.transition = d), (ye = l));
    }
    return null;
  }
  function vS(n, r, o, l) {
    do Gr();
    while (Dn !== null);
    if ((de & 6) !== 0) throw Error(s(327));
    o = n.finishedWork;
    var d = n.finishedLanes;
    if (o === null) return null;
    if (((n.finishedWork = null), (n.finishedLanes = 0), o === n.current)) throw Error(s(177));
    ((n.callbackNode = null), (n.callbackPriority = 0));
    var m = o.lanes | o.childLanes;
    if (
      (Jx(n, m),
      n === ze && ((Le = ze = null), (Ge = 0)),
      ((o.subtreeFlags & 2064) === 0 && (o.flags & 2064) === 0) ||
        Oo ||
        ((Oo = !0),
        Wh(Hi, function () {
          return (Gr(), null);
        })),
      (m = (o.flags & 15990) !== 0),
      (o.subtreeFlags & 15990) !== 0 || m)
    ) {
      ((m = bt.transition), (bt.transition = null));
      var x = ye;
      ye = 1;
      var S = de;
      ((de |= 4),
        (hu.current = null),
        fS(n, o),
        Rh(o, n),
        Fw(_l),
        (Qi = !!El),
        (_l = El = null),
        (n.current = o),
        pS(o),
        zx(),
        (de = S),
        (ye = x),
        (bt.transition = m));
    } else n.current = o;
    if (
      (Oo && ((Oo = !1), (Dn = n), (Fo = d)),
      (m = n.pendingLanes),
      m === 0 && (Mn = null),
      Gx(o.stateNode),
      ft(n, Ae()),
      r !== null)
    )
      for (l = n.onRecoverableError, o = 0; o < r.length; o++)
        ((d = r[o]), l(d.value, { componentStack: d.stack, digest: d.digest }));
    if (Lo) throw ((Lo = !1), (n = yu), (yu = null), n);
    return (
      (Fo & 1) !== 0 && n.tag !== 0 && Gr(),
      (m = n.pendingLanes),
      (m & 1) !== 0 ? (n === vu ? si++ : ((si = 0), (vu = n))) : (si = 0),
      Pn(),
      null
    );
  }
  function Gr() {
    if (Dn !== null) {
      var n = jf(Fo),
        r = bt.transition,
        o = ye;
      try {
        if (((bt.transition = null), (ye = 16 > n ? 16 : n), Dn === null)) var l = !1;
        else {
          if (((n = Dn), (Dn = null), (Fo = 0), (de & 6) !== 0)) throw Error(s(331));
          var d = de;
          for (de |= 4, G = n.current; G !== null;) {
            var m = G,
              x = m.child;
            if ((G.flags & 16) !== 0) {
              var S = m.deletions;
              if (S !== null) {
                for (var T = 0; T < S.length; T++) {
                  var I = S[T];
                  for (G = I; G !== null;) {
                    var F = G;
                    switch (F.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ti(8, F, m);
                    }
                    var V = F.child;
                    if (V !== null) ((V.return = F), (G = V));
                    else
                      for (; G !== null;) {
                        F = G;
                        var L = F.sibling,
                          W = F.return;
                        if ((kh(F), F === I)) {
                          G = null;
                          break;
                        }
                        if (L !== null) {
                          ((L.return = W), (G = L));
                          break;
                        }
                        G = W;
                      }
                  }
                }
                var K = m.alternate;
                if (K !== null) {
                  var Y = K.child;
                  if (Y !== null) {
                    K.child = null;
                    do {
                      var Me = Y.sibling;
                      ((Y.sibling = null), (Y = Me));
                    } while (Y !== null);
                  }
                }
                G = m;
              }
            }
            if ((m.subtreeFlags & 2064) !== 0 && x !== null) ((x.return = m), (G = x));
            else
              e: for (; G !== null;) {
                if (((m = G), (m.flags & 2048) !== 0))
                  switch (m.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ti(9, m, m.return);
                  }
                var j = m.sibling;
                if (j !== null) {
                  ((j.return = m.return), (G = j));
                  break e;
                }
                G = m.return;
              }
          }
          var C = n.current;
          for (G = C; G !== null;) {
            x = G;
            var P = x.child;
            if ((x.subtreeFlags & 2064) !== 0 && P !== null) ((P.return = x), (G = P));
            else
              e: for (x = C; G !== null;) {
                if (((S = G), (S.flags & 2048) !== 0))
                  try {
                    switch (S.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ao(9, S);
                    }
                  } catch (X) {
                    Re(S, S.return, X);
                  }
                if (S === x) {
                  G = null;
                  break e;
                }
                var B = S.sibling;
                if (B !== null) {
                  ((B.return = S.return), (G = B));
                  break e;
                }
                G = S.return;
              }
          }
          if (((de = d), Pn(), Kt && typeof Kt.onPostCommitFiberRoot == "function"))
            try {
              Kt.onPostCommitFiberRoot(Wi, n);
            } catch {}
          l = !0;
        }
        return l;
      } finally {
        ((ye = o), (bt.transition = r));
      }
    }
    return !1;
  }
  function Uh(n, r, o) {
    ((r = Ur(o, r)),
      (r = oh(n, r, 1)),
      (n = In(n, r, 1)),
      (r = rt()),
      n !== null && (Ns(n, 1, r), ft(n, r)));
  }
  function Re(n, r, o) {
    if (n.tag === 3) Uh(n, n, o);
    else
      for (; r !== null;) {
        if (r.tag === 3) {
          Uh(r, n, o);
          break;
        } else if (r.tag === 1) {
          var l = r.stateNode;
          if (
            typeof r.type.getDerivedStateFromError == "function" ||
            (typeof l.componentDidCatch == "function" && (Mn === null || !Mn.has(l)))
          ) {
            ((n = Ur(o, n)),
              (n = ah(r, n, 1)),
              (r = In(r, n, 1)),
              (n = rt()),
              r !== null && (Ns(r, 1, n), ft(r, n)));
            break;
          }
        }
        r = r.return;
      }
  }
  function xS(n, r, o) {
    var l = n.pingCache;
    (l !== null && l.delete(r),
      (r = rt()),
      (n.pingedLanes |= n.suspendedLanes & o),
      ze === n &&
        (Ge & o) === o &&
        (Be === 4 || (Be === 3 && (Ge & 130023424) === Ge && 500 > Ae() - gu)
          ? sr(n, 0)
          : (mu |= o)),
      ft(n, r));
  }
  function zh(n, r) {
    r === 0 &&
      ((n.mode & 1) === 0
        ? (r = 1)
        : ((r = Ki), (Ki <<= 1), (Ki & 130023424) === 0 && (Ki = 4194304)));
    var o = rt();
    ((n = on(n, r)), n !== null && (Ns(n, r, o), ft(n, o)));
  }
  function wS(n) {
    var r = n.memoizedState,
      o = 0;
    (r !== null && (o = r.retryLane), zh(n, o));
  }
  function SS(n, r) {
    var o = 0;
    switch (n.tag) {
      case 13:
        var l = n.stateNode,
          d = n.memoizedState;
        d !== null && (o = d.retryLane);
        break;
      case 19:
        l = n.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    (l !== null && l.delete(r), zh(n, o));
  }
  var Hh;
  Hh = function (n, r, o) {
    if (n !== null)
      if (n.memoizedProps !== r.pendingProps || lt.current) ct = !0;
      else {
        if ((n.lanes & o) === 0 && (r.flags & 128) === 0) return ((ct = !1), lS(n, r, o));
        ct = (n.flags & 131072) !== 0;
      }
    else ((ct = !1), Ce && (r.flags & 1048576) !== 0 && _p(r, go, r.index));
    switch (((r.lanes = 0), r.tag)) {
      case 2:
        var l = r.type;
        (Ro(n, r), (n = r.pendingProps));
        var d = Mr(r, Ye.current);
        (Br(r, o), (d = Kl(null, r, l, n, d, o)));
        var m = Yl();
        return (
          (r.flags |= 1),
          typeof d == "object" &&
          d !== null &&
          typeof d.render == "function" &&
          d.$$typeof === void 0
            ? ((r.tag = 1),
              (r.memoizedState = null),
              (r.updateQueue = null),
              ut(l) ? ((m = !0), po(r)) : (m = !1),
              (r.memoizedState = d.state !== null && d.state !== void 0 ? d.state : null),
              Bl(r),
              (d.updater = jo),
              (r.stateNode = d),
              (d._reactInternals = r),
              eu(r, l, n, o),
              (r = su(null, r, l, !0, m, o)))
            : ((r.tag = 0), Ce && m && Pl(r), nt(null, r, d, o), (r = r.child)),
          r
        );
      case 16:
        l = r.elementType;
        e: {
          switch (
            (Ro(n, r),
            (n = r.pendingProps),
            (d = l._init),
            (l = d(l._payload)),
            (r.type = l),
            (d = r.tag = _S(l)),
            (n = Ot(l, n)),
            d)
          ) {
            case 0:
              r = ru(null, r, l, n, o);
              break e;
            case 1:
              r = gh(null, r, l, n, o);
              break e;
            case 11:
              r = dh(null, r, l, n, o);
              break e;
            case 14:
              r = fh(null, r, l, Ot(l.type, n), o);
              break e;
          }
          throw Error(s(306, l, ""));
        }
        return r;
      case 0:
        return (
          (l = r.type),
          (d = r.pendingProps),
          (d = r.elementType === l ? d : Ot(l, d)),
          ru(n, r, l, d, o)
        );
      case 1:
        return (
          (l = r.type),
          (d = r.pendingProps),
          (d = r.elementType === l ? d : Ot(l, d)),
          gh(n, r, l, d, o)
        );
      case 3:
        e: {
          if ((yh(r), n === null)) throw Error(s(387));
          ((l = r.pendingProps),
            (m = r.memoizedState),
            (d = m.element),
            Ip(n, r),
            Eo(r, l, null, o));
          var x = r.memoizedState;
          if (((l = x.element), m.isDehydrated))
            if (
              ((m = {
                element: l,
                isDehydrated: !1,
                cache: x.cache,
                pendingSuspenseBoundaries: x.pendingSuspenseBoundaries,
                transitions: x.transitions,
              }),
              (r.updateQueue.baseState = m),
              (r.memoizedState = m),
              r.flags & 256)
            ) {
              ((d = Ur(Error(s(423)), r)), (r = vh(n, r, l, o, d)));
              break e;
            } else if (l !== d) {
              ((d = Ur(Error(s(424)), r)), (r = vh(n, r, l, o, d)));
              break e;
            } else
              for (
                wt = bn(r.stateNode.containerInfo.firstChild),
                  xt = r,
                  Ce = !0,
                  Lt = null,
                  o = Pp(r, null, l, o),
                  r.child = o;
                o;
              )
                ((o.flags = (o.flags & -3) | 4096), (o = o.sibling));
          else {
            if ((Or(), l === d)) {
              r = ln(n, r, o);
              break e;
            }
            nt(n, r, l, o);
          }
          r = r.child;
        }
        return r;
      case 5:
        return (
          Dp(r),
          n === null && Al(r),
          (l = r.type),
          (d = r.pendingProps),
          (m = n !== null ? n.memoizedProps : null),
          (x = d.children),
          Tl(l, d) ? (x = null) : m !== null && Tl(l, m) && (r.flags |= 32),
          mh(n, r),
          nt(n, r, x, o),
          r.child
        );
      case 6:
        return (n === null && Al(r), null);
      case 13:
        return xh(n, r, o);
      case 4:
        return (
          $l(r, r.stateNode.containerInfo),
          (l = r.pendingProps),
          n === null ? (r.child = Fr(r, null, l, o)) : nt(n, r, l, o),
          r.child
        );
      case 11:
        return (
          (l = r.type),
          (d = r.pendingProps),
          (d = r.elementType === l ? d : Ot(l, d)),
          dh(n, r, l, d, o)
        );
      case 7:
        return (nt(n, r, r.pendingProps, o), r.child);
      case 8:
        return (nt(n, r, r.pendingProps.children, o), r.child);
      case 12:
        return (nt(n, r, r.pendingProps.children, o), r.child);
      case 10:
        e: {
          if (
            ((l = r.type._context),
            (d = r.pendingProps),
            (m = r.memoizedProps),
            (x = d.value),
            we(xo, l._currentValue),
            (l._currentValue = x),
            m !== null)
          )
            if (Dt(m.value, x)) {
              if (m.children === d.children && !lt.current) {
                r = ln(n, r, o);
                break e;
              }
            } else
              for (m = r.child, m !== null && (m.return = r); m !== null;) {
                var S = m.dependencies;
                if (S !== null) {
                  x = m.child;
                  for (var T = S.firstContext; T !== null;) {
                    if (T.context === l) {
                      if (m.tag === 1) {
                        ((T = an(-1, o & -o)), (T.tag = 2));
                        var I = m.updateQueue;
                        if (I !== null) {
                          I = I.shared;
                          var F = I.pending;
                          (F === null ? (T.next = T) : ((T.next = F.next), (F.next = T)),
                            (I.pending = T));
                        }
                      }
                      ((m.lanes |= o),
                        (T = m.alternate),
                        T !== null && (T.lanes |= o),
                        Fl(m.return, o, r),
                        (S.lanes |= o));
                      break;
                    }
                    T = T.next;
                  }
                } else if (m.tag === 10) x = m.type === r.type ? null : m.child;
                else if (m.tag === 18) {
                  if (((x = m.return), x === null)) throw Error(s(341));
                  ((x.lanes |= o),
                    (S = x.alternate),
                    S !== null && (S.lanes |= o),
                    Fl(x, o, r),
                    (x = m.sibling));
                } else x = m.child;
                if (x !== null) x.return = m;
                else
                  for (x = m; x !== null;) {
                    if (x === r) {
                      x = null;
                      break;
                    }
                    if (((m = x.sibling), m !== null)) {
                      ((m.return = x.return), (x = m));
                      break;
                    }
                    x = x.return;
                  }
                m = x;
              }
          (nt(n, r, d.children, o), (r = r.child));
        }
        return r;
      case 9:
        return (
          (d = r.type),
          (l = r.pendingProps.children),
          Br(r, o),
          (d = Ct(d)),
          (l = l(d)),
          (r.flags |= 1),
          nt(n, r, l, o),
          r.child
        );
      case 14:
        return ((l = r.type), (d = Ot(l, r.pendingProps)), (d = Ot(l.type, d)), fh(n, r, l, d, o));
      case 15:
        return ph(n, r, r.type, r.pendingProps, o);
      case 17:
        return (
          (l = r.type),
          (d = r.pendingProps),
          (d = r.elementType === l ? d : Ot(l, d)),
          Ro(n, r),
          (r.tag = 1),
          ut(l) ? ((n = !0), po(r)) : (n = !1),
          Br(r, o),
          sh(r, l, d),
          eu(r, l, d, o),
          su(null, r, l, !0, n, o)
        );
      case 19:
        return Sh(n, r, o);
      case 22:
        return hh(n, r, o);
    }
    throw Error(s(156, r.tag));
  };
  function Wh(n, r) {
    return Tf(n, r);
  }
  function ES(n, r, o, l) {
    ((this.tag = n),
      (this.key = o),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = r),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function Nt(n, r, o, l) {
    return new ES(n, r, o, l);
  }
  function Tu(n) {
    return ((n = n.prototype), !(!n || !n.isReactComponent));
  }
  function _S(n) {
    if (typeof n == "function") return Tu(n) ? 1 : 0;
    if (n != null) {
      if (((n = n.$$typeof), n === Fe)) return 11;
      if (n === gt) return 14;
    }
    return 2;
  }
  function Fn(n, r) {
    var o = n.alternate;
    return (
      o === null
        ? ((o = Nt(n.tag, r, n.key, n.mode)),
          (o.elementType = n.elementType),
          (o.type = n.type),
          (o.stateNode = n.stateNode),
          (o.alternate = n),
          (n.alternate = o))
        : ((o.pendingProps = r),
          (o.type = n.type),
          (o.flags = 0),
          (o.subtreeFlags = 0),
          (o.deletions = null)),
      (o.flags = n.flags & 14680064),
      (o.childLanes = n.childLanes),
      (o.lanes = n.lanes),
      (o.child = n.child),
      (o.memoizedProps = n.memoizedProps),
      (o.memoizedState = n.memoizedState),
      (o.updateQueue = n.updateQueue),
      (r = n.dependencies),
      (o.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }),
      (o.sibling = n.sibling),
      (o.index = n.index),
      (o.ref = n.ref),
      o
    );
  }
  function Uo(n, r, o, l, d, m) {
    var x = 2;
    if (((l = n), typeof n == "function")) Tu(n) && (x = 1);
    else if (typeof n == "string") x = 5;
    else
      e: switch (n) {
        case te:
          return or(o.children, d, m, r);
        case Q:
          ((x = 8), (d |= 8));
          break;
        case fe:
          return ((n = Nt(12, o, r, d | 2)), (n.elementType = fe), (n.lanes = m), n);
        case et:
          return ((n = Nt(13, o, r, d)), (n.elementType = et), (n.lanes = m), n);
        case at:
          return ((n = Nt(19, o, r, d)), (n.elementType = at), (n.lanes = m), n);
        case oe:
          return zo(o, d, m, r);
        default:
          if (typeof n == "object" && n !== null)
            switch (n.$$typeof) {
              case ce:
                x = 10;
                break e;
              case _e:
                x = 9;
                break e;
              case Fe:
                x = 11;
                break e;
              case gt:
                x = 14;
                break e;
              case tt:
                ((x = 16), (l = null));
                break e;
            }
          throw Error(s(130, n == null ? n : typeof n, ""));
      }
    return ((r = Nt(x, o, r, d)), (r.elementType = n), (r.type = l), (r.lanes = m), r);
  }
  function or(n, r, o, l) {
    return ((n = Nt(7, n, l, r)), (n.lanes = o), n);
  }
  function zo(n, r, o, l) {
    return (
      (n = Nt(22, n, l, r)),
      (n.elementType = oe),
      (n.lanes = o),
      (n.stateNode = { isHidden: !1 }),
      n
    );
  }
  function Cu(n, r, o) {
    return ((n = Nt(6, n, null, r)), (n.lanes = o), n);
  }
  function ku(n, r, o) {
    return (
      (r = Nt(4, n.children !== null ? n.children : [], n.key, r)),
      (r.lanes = o),
      (r.stateNode = {
        containerInfo: n.containerInfo,
        pendingChildren: null,
        implementation: n.implementation,
      }),
      r
    );
  }
  function TS(n, r, o, l, d) {
    ((this.tag = r),
      (this.containerInfo = n),
      (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = Za(0)),
      (this.expirationTimes = Za(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Za(0)),
      (this.identifierPrefix = l),
      (this.onRecoverableError = d),
      (this.mutableSourceEagerHydrationData = null));
  }
  function bu(n, r, o, l, d, m, x, S, T) {
    return (
      (n = new TS(n, r, o, S, T)),
      r === 1 ? ((r = 1), m === !0 && (r |= 8)) : (r = 0),
      (m = Nt(3, null, null, r)),
      (n.current = m),
      (m.stateNode = n),
      (m.memoizedState = {
        element: l,
        isDehydrated: o,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      Bl(m),
      n
    );
  }
  function CS(n, r, o) {
    var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: J,
      key: l == null ? null : "" + l,
      children: n,
      containerInfo: r,
      implementation: o,
    };
  }
  function Gh(n) {
    if (!n) return jn;
    n = n._reactInternals;
    e: {
      if (Yn(n) !== n || n.tag !== 1) throw Error(s(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (ut(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(s(171));
    }
    if (n.tag === 1) {
      var o = n.type;
      if (ut(o)) return wp(n, o, r);
    }
    return r;
  }
  function Kh(n, r, o, l, d, m, x, S, T) {
    return (
      (n = bu(o, l, !0, n, d, m, x, S, T)),
      (n.context = Gh(null)),
      (o = n.current),
      (l = rt()),
      (d = Ln(o)),
      (m = an(l, d)),
      (m.callback = r ?? null),
      In(o, m, d),
      (n.current.lanes = d),
      Ns(n, d, l),
      ft(n, l),
      n
    );
  }
  function Ho(n, r, o, l) {
    var d = r.current,
      m = rt(),
      x = Ln(d);
    return (
      (o = Gh(o)),
      r.context === null ? (r.context = o) : (r.pendingContext = o),
      (r = an(m, x)),
      (r.payload = { element: n }),
      (l = l === void 0 ? null : l),
      l !== null && (r.callback = l),
      (n = In(d, r, x)),
      n !== null && (Bt(n, d, x, m), So(n, d, x)),
      x
    );
  }
  function Wo(n) {
    return ((n = n.current), n.child ? (n.child.tag === 5, n.child.stateNode) : null);
  }
  function Yh(n, r) {
    if (((n = n.memoizedState), n !== null && n.dehydrated !== null)) {
      var o = n.retryLane;
      n.retryLane = o !== 0 && o < r ? o : r;
    }
  }
  function Nu(n, r) {
    (Yh(n, r), (n = n.alternate) && Yh(n, r));
  }
  function kS() {
    return null;
  }
  var Xh =
    typeof reportError == "function"
      ? reportError
      : function (n) {
          console.error(n);
        };
  function ju(n) {
    this._internalRoot = n;
  }
  ((Go.prototype.render = ju.prototype.render =
    function (n) {
      var r = this._internalRoot;
      if (r === null) throw Error(s(409));
      Ho(n, r, null, null);
    }),
    (Go.prototype.unmount = ju.prototype.unmount =
      function () {
        var n = this._internalRoot;
        if (n !== null) {
          this._internalRoot = null;
          var r = n.containerInfo;
          (rr(function () {
            Ho(null, n, null, null);
          }),
            (r[tn] = null));
        }
      }));
  function Go(n) {
    this._internalRoot = n;
  }
  Go.prototype.unstable_scheduleHydration = function (n) {
    if (n) {
      var r = If();
      n = { blockedOn: null, target: n, priority: r };
      for (var o = 0; o < Tn.length && r !== 0 && r < Tn[o].priority; o++);
      (Tn.splice(o, 0, n), o === 0 && Df(n));
    }
  };
  function Pu(n) {
    return !(!n || (n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11));
  }
  function Ko(n) {
    return !(
      !n ||
      (n.nodeType !== 1 &&
        n.nodeType !== 9 &&
        n.nodeType !== 11 &&
        (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "))
    );
  }
  function qh() {}
  function bS(n, r, o, l, d) {
    if (d) {
      if (typeof l == "function") {
        var m = l;
        l = function () {
          var I = Wo(x);
          m.call(I);
        };
      }
      var x = Kh(r, l, n, 0, null, !1, !1, "", qh);
      return (
        (n._reactRootContainer = x),
        (n[tn] = x.current),
        Us(n.nodeType === 8 ? n.parentNode : n),
        rr(),
        x
      );
    }
    for (; (d = n.lastChild);) n.removeChild(d);
    if (typeof l == "function") {
      var S = l;
      l = function () {
        var I = Wo(T);
        S.call(I);
      };
    }
    var T = bu(n, 0, !1, null, null, !1, !1, "", qh);
    return (
      (n._reactRootContainer = T),
      (n[tn] = T.current),
      Us(n.nodeType === 8 ? n.parentNode : n),
      rr(function () {
        Ho(r, T, o, l);
      }),
      T
    );
  }
  function Yo(n, r, o, l, d) {
    var m = o._reactRootContainer;
    if (m) {
      var x = m;
      if (typeof d == "function") {
        var S = d;
        d = function () {
          var T = Wo(x);
          S.call(T);
        };
      }
      Ho(r, x, n, d);
    } else x = bS(o, r, n, d, l);
    return Wo(x);
  }
  ((Pf = function (n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var o = bs(r.pendingLanes);
          o !== 0 && (el(r, o | 1), ft(r, Ae()), (de & 6) === 0 && ((Wr = Ae() + 500), Pn()));
        }
        break;
      case 13:
        (rr(function () {
          var l = on(n, 1);
          if (l !== null) {
            var d = rt();
            Bt(l, n, 1, d);
          }
        }),
          Nu(n, 1));
    }
  }),
    (tl = function (n) {
      if (n.tag === 13) {
        var r = on(n, 134217728);
        if (r !== null) {
          var o = rt();
          Bt(r, n, 134217728, o);
        }
        Nu(n, 134217728);
      }
    }),
    (Rf = function (n) {
      if (n.tag === 13) {
        var r = Ln(n),
          o = on(n, r);
        if (o !== null) {
          var l = rt();
          Bt(o, n, r, l);
        }
        Nu(n, r);
      }
    }),
    (If = function () {
      return ye;
    }),
    (Af = function (n, r) {
      var o = ye;
      try {
        return ((ye = n), r());
      } finally {
        ye = o;
      }
    }),
    (Ka = function (n, r, o) {
      switch (r) {
        case "input":
          if ((Va(n, o), (r = o.name), o.type === "radio" && r != null)) {
            for (o = n; o.parentNode;) o = o.parentNode;
            for (
              o = o.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'),
                r = 0;
              r < o.length;
              r++
            ) {
              var l = o[r];
              if (l !== n && l.form === n.form) {
                var d = co(l);
                if (!d) throw Error(s(90));
                (nf(l), Va(l, d));
              }
            }
          }
          break;
        case "textarea":
          lf(n, o);
          break;
        case "select":
          ((r = o.value), r != null && Er(n, !!o.multiple, r, !1));
      }
    }),
    (yf = Su),
    (vf = rr));
  var NS = { usingClientEntryPoint: !1, Events: [Ws, Ir, co, mf, gf, Su] },
    ii = {
      findFiberByHostInstance: Xn,
      bundleType: 0,
      version: "18.3.1",
      rendererPackageName: "react-dom",
    },
    jS = {
      bundleType: ii.bundleType,
      version: ii.version,
      rendererPackageName: ii.rendererPackageName,
      rendererConfig: ii.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: $.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (n) {
        return ((n = Ef(n)), n === null ? null : n.stateNode);
      },
      findFiberByHostInstance: ii.findFiberByHostInstance || kS,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Xo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Xo.isDisabled && Xo.supportsFiber)
      try {
        ((Wi = Xo.inject(jS)), (Kt = Xo));
      } catch {}
  }
  return (
    (pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = NS),
    (pt.createPortal = function (n, r) {
      var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Pu(r)) throw Error(s(200));
      return CS(n, r, null, o);
    }),
    (pt.createRoot = function (n, r) {
      if (!Pu(n)) throw Error(s(299));
      var o = !1,
        l = "",
        d = Xh;
      return (
        r != null &&
          (r.unstable_strictMode === !0 && (o = !0),
          r.identifierPrefix !== void 0 && (l = r.identifierPrefix),
          r.onRecoverableError !== void 0 && (d = r.onRecoverableError)),
        (r = bu(n, 1, !1, null, null, o, !1, l, d)),
        (n[tn] = r.current),
        Us(n.nodeType === 8 ? n.parentNode : n),
        new ju(r)
      );
    }),
    (pt.findDOMNode = function (n) {
      if (n == null) return null;
      if (n.nodeType === 1) return n;
      var r = n._reactInternals;
      if (r === void 0)
        throw typeof n.render == "function"
          ? Error(s(188))
          : ((n = Object.keys(n).join(",")), Error(s(268, n)));
      return ((n = Ef(r)), (n = n === null ? null : n.stateNode), n);
    }),
    (pt.flushSync = function (n) {
      return rr(n);
    }),
    (pt.hydrate = function (n, r, o) {
      if (!Ko(r)) throw Error(s(200));
      return Yo(null, n, r, !0, o);
    }),
    (pt.hydrateRoot = function (n, r, o) {
      if (!Pu(n)) throw Error(s(405));
      var l = (o != null && o.hydratedSources) || null,
        d = !1,
        m = "",
        x = Xh;
      if (
        (o != null &&
          (o.unstable_strictMode === !0 && (d = !0),
          o.identifierPrefix !== void 0 && (m = o.identifierPrefix),
          o.onRecoverableError !== void 0 && (x = o.onRecoverableError)),
        (r = Kh(r, null, n, 1, o ?? null, d, !1, m, x)),
        (n[tn] = r.current),
        Us(n),
        l)
      )
        for (n = 0; n < l.length; n++)
          ((o = l[n]),
            (d = o._getVersion),
            (d = d(o._source)),
            r.mutableSourceEagerHydrationData == null
              ? (r.mutableSourceEagerHydrationData = [o, d])
              : r.mutableSourceEagerHydrationData.push(o, d));
      return new Go(r);
    }),
    (pt.render = function (n, r, o) {
      if (!Ko(r)) throw Error(s(200));
      return Yo(null, n, r, !1, o);
    }),
    (pt.unmountComponentAtNode = function (n) {
      if (!Ko(n)) throw Error(s(40));
      return n._reactRootContainer
        ? (rr(function () {
            Yo(null, null, n, !1, function () {
              ((n._reactRootContainer = null), (n[tn] = null));
            });
          }),
          !0)
        : !1;
    }),
    (pt.unstable_batchedUpdates = Su),
    (pt.unstable_renderSubtreeIntoContainer = function (n, r, o, l) {
      if (!Ko(o)) throw Error(s(200));
      if (n == null || n._reactInternals === void 0) throw Error(s(38));
      return Yo(n, r, o, !1, l);
    }),
    (pt.version = "18.3.1-next-f1338f8080-20240426"),
    pt
  );
}
var sm;
function OS() {
  if (sm) return Au.exports;
  sm = 1;
  function e() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return (e(), (Au.exports = LS()), Au.exports);
}
var im;
function FS() {
  if (im) return qo;
  im = 1;
  var e = OS();
  return ((qo.createRoot = e.createRoot), (qo.hydrateRoot = e.hydrateRoot), qo);
}
var VS = FS();
const BS = bi(VS);
var om = "popstate";
function $S(e = {}) {
  function t(i, a) {
    let { pathname: u, search: c, hash: f } = i.location;
    return hc(
      "",
      { pathname: u, search: c, hash: f },
      (a.state && a.state.usr) || null,
      (a.state && a.state.key) || "default"
    );
  }
  function s(i, a) {
    return typeof a == "string" ? a : vi(a);
  }
  return zS(t, s, null, e);
}
function Pe(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Wt(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function US() {
  return Math.random().toString(36).substring(2, 10);
}
function am(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function hc(e, t, s = null, i) {
  return {
    pathname: typeof e == "string" ? e : e.pathname,
    search: "",
    hash: "",
    ...(typeof t == "string" ? us(t) : t),
    state: s,
    key: (t && t.key) || i || US(),
  };
}
function vi({ pathname: e = "/", search: t = "", hash: s = "" }) {
  return (
    t && t !== "?" && (e += t.charAt(0) === "?" ? t : "?" + t),
    s && s !== "#" && (e += s.charAt(0) === "#" ? s : "#" + s),
    e
  );
}
function us(e) {
  let t = {};
  if (e) {
    let s = e.indexOf("#");
    s >= 0 && ((t.hash = e.substring(s)), (e = e.substring(0, s)));
    let i = e.indexOf("?");
    (i >= 0 && ((t.search = e.substring(i)), (e = e.substring(0, i))), e && (t.pathname = e));
  }
  return t;
}
function zS(e, t, s, i = {}) {
  let { window: a = document.defaultView, v5Compat: u = !1 } = i,
    c = a.history,
    f = "POP",
    p = null,
    g = y();
  g == null && ((g = 0), c.replaceState({ ...c.state, idx: g }, ""));
  function y() {
    return (c.state || { idx: null }).idx;
  }
  function v() {
    f = "POP";
    let k = y(),
      R = k == null ? null : k - g;
    ((g = k), p && p({ action: f, location: A.location, delta: R }));
  }
  function w(k, R) {
    f = "PUSH";
    let D = hc(A.location, k, R);
    g = y() + 1;
    let M = am(D, g),
      $ = A.createHref(D);
    try {
      c.pushState(M, "", $);
    } catch (z) {
      if (z instanceof DOMException && z.name === "DataCloneError") throw z;
      a.location.assign($);
    }
    u && p && p({ action: f, location: A.location, delta: 1 });
  }
  function E(k, R) {
    f = "REPLACE";
    let D = hc(A.location, k, R);
    g = y();
    let M = am(D, g),
      $ = A.createHref(D);
    (c.replaceState(M, "", $), u && p && p({ action: f, location: A.location, delta: 0 }));
  }
  function b(k) {
    return HS(k);
  }
  let A = {
    get action() {
      return f;
    },
    get location() {
      return e(a, c);
    },
    listen(k) {
      if (p) throw new Error("A history only accepts one active listener");
      return (
        a.addEventListener(om, v),
        (p = k),
        () => {
          (a.removeEventListener(om, v), (p = null));
        }
      );
    },
    createHref(k) {
      return t(a, k);
    },
    createURL: b,
    encodeLocation(k) {
      let R = b(k);
      return { pathname: R.pathname, search: R.search, hash: R.hash };
    },
    push: w,
    replace: E,
    go(k) {
      return c.go(k);
    },
  };
  return A;
}
function HS(e, t = !1) {
  let s = "http://localhost";
  (typeof window < "u" &&
    (s = window.location.origin !== "null" ? window.location.origin : window.location.href),
    Pe(s, "No window.location.(origin|href) available to create URL"));
  let i = typeof e == "string" ? e : vi(e);
  return ((i = i.replace(/ $/, "%20")), !t && i.startsWith("//") && (i = s + i), new URL(i, s));
}
function Oy(e, t, s = "/") {
  return WS(e, t, s, !1);
}
function WS(e, t, s, i) {
  let a = typeof t == "string" ? us(t) : t,
    u = mn(a.pathname || "/", s);
  if (u == null) return null;
  let c = Fy(e);
  GS(c);
  let f = null;
  for (let p = 0; f == null && p < c.length; ++p) {
    let g = r1(u);
    f = t1(c[p], g, i);
  }
  return f;
}
function Fy(e, t = [], s = [], i = "", a = !1) {
  let u = (c, f, p = a, g) => {
    let y = {
      relativePath: g === void 0 ? c.path || "" : g,
      caseSensitive: c.caseSensitive === !0,
      childrenIndex: f,
      route: c,
    };
    if (y.relativePath.startsWith("/")) {
      if (!y.relativePath.startsWith(i) && p) return;
      (Pe(
        y.relativePath.startsWith(i),
        `Absolute route path "${y.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ),
        (y.relativePath = y.relativePath.slice(i.length)));
    }
    let v = fn([i, y.relativePath]),
      w = s.concat(y);
    (c.children &&
      c.children.length > 0 &&
      (Pe(
        c.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${v}".`
      ),
      Fy(c.children, t, w, v, p)),
      !(c.path == null && !c.index) && t.push({ path: v, score: ZS(v, c.index), routesMeta: w }));
  };
  return (
    e.forEach((c, f) => {
      if (c.path === "" || !c.path?.includes("?")) u(c, f);
      else for (let p of Vy(c.path)) u(c, f, !0, p);
    }),
    t
  );
}
function Vy(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [s, ...i] = t,
    a = s.endsWith("?"),
    u = s.replace(/\?$/, "");
  if (i.length === 0) return a ? [u, ""] : [u];
  let c = Vy(i.join("/")),
    f = [];
  return (
    f.push(...c.map((p) => (p === "" ? u : [u, p].join("/")))),
    a && f.push(...c),
    f.map((p) => (e.startsWith("/") && p === "" ? "/" : p))
  );
}
function GS(e) {
  e.sort((t, s) =>
    t.score !== s.score
      ? s.score - t.score
      : e1(
          t.routesMeta.map((i) => i.childrenIndex),
          s.routesMeta.map((i) => i.childrenIndex)
        )
  );
}
var KS = /^:[\w-]+$/,
  YS = 3,
  XS = 2,
  qS = 1,
  QS = 10,
  JS = -2,
  lm = (e) => e === "*";
function ZS(e, t) {
  let s = e.split("/"),
    i = s.length;
  return (
    s.some(lm) && (i += JS),
    t && (i += XS),
    s.filter((a) => !lm(a)).reduce((a, u) => a + (KS.test(u) ? YS : u === "" ? qS : QS), i)
  );
}
function e1(e, t) {
  return e.length === t.length && e.slice(0, -1).every((i, a) => i === t[a])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function t1(e, t, s = !1) {
  let { routesMeta: i } = e,
    a = {},
    u = "/",
    c = [];
  for (let f = 0; f < i.length; ++f) {
    let p = i[f],
      g = f === i.length - 1,
      y = u === "/" ? t : t.slice(u.length) || "/",
      v = ya({ path: p.relativePath, caseSensitive: p.caseSensitive, end: g }, y),
      w = p.route;
    if (
      (!v &&
        g &&
        s &&
        !i[i.length - 1].route.index &&
        (v = ya({ path: p.relativePath, caseSensitive: p.caseSensitive, end: !1 }, y)),
      !v)
    )
      return null;
    (Object.assign(a, v.params),
      c.push({
        params: a,
        pathname: fn([u, v.pathname]),
        pathnameBase: l1(fn([u, v.pathnameBase])),
        route: w,
      }),
      v.pathnameBase !== "/" && (u = fn([u, v.pathnameBase])));
  }
  return c;
}
function ya(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [s, i] = n1(e.path, e.caseSensitive, e.end),
    a = t.match(s);
  if (!a) return null;
  let u = a[0],
    c = u.replace(/(.)\/+$/, "$1"),
    f = a.slice(1);
  return {
    params: i.reduce((g, { paramName: y, isOptional: v }, w) => {
      if (y === "*") {
        let b = f[w] || "";
        c = u.slice(0, u.length - b.length).replace(/(.)\/+$/, "$1");
      }
      const E = f[w];
      return (v && !E ? (g[y] = void 0) : (g[y] = (E || "").replace(/%2F/g, "/")), g);
    }, {}),
    pathname: u,
    pathnameBase: c,
    pattern: e,
  };
}
function n1(e, t = !1, s = !0) {
  Wt(
    e === "*" || !e.endsWith("*") || e.endsWith("/*"),
    `Route path "${e}" will be treated as if it were "${e.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/, "/*")}".`
  );
  let i = [],
    a =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (c, f, p) => (
            i.push({ paramName: f, isOptional: p != null }),
            p ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        )
        .replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return (
    e.endsWith("*")
      ? (i.push({ paramName: "*" }), (a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : s
        ? (a += "\\/*$")
        : e !== "" && e !== "/" && (a += "(?:(?=\\/|$))"),
    [new RegExp(a, t ? void 0 : "i"), i]
  );
}
function r1(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      Wt(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`
      ),
      e
    );
  }
}
function mn(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let s = t.endsWith("/") ? t.length - 1 : t.length,
    i = e.charAt(s);
  return i && i !== "/" ? null : e.slice(s) || "/";
}
var s1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  i1 = (e) => s1.test(e);
function o1(e, t = "/") {
  let { pathname: s, search: i = "", hash: a = "" } = typeof e == "string" ? us(e) : e,
    u;
  if (s)
    if (i1(s)) u = s;
    else {
      if (s.includes("//")) {
        let c = s;
        ((s = s.replace(/\/\/+/g, "/")),
          Wt(!1, `Pathnames cannot have embedded double slashes - normalizing ${c} -> ${s}`));
      }
      s.startsWith("/") ? (u = um(s.substring(1), "/")) : (u = um(s, t));
    }
  else u = t;
  return { pathname: u, search: u1(i), hash: c1(a) };
}
function um(e, t) {
  let s = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((a) => {
      a === ".." ? s.length > 1 && s.pop() : a !== "." && s.push(a);
    }),
    s.length > 1 ? s.join("/") : "/"
  );
}
function Lu(e, t, s, i) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(i)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function a1(e) {
  return e.filter((t, s) => s === 0 || (t.route.path && t.route.path.length > 0));
}
function By(e) {
  let t = a1(e);
  return t.map((s, i) => (i === t.length - 1 ? s.pathname : s.pathnameBase));
}
function $y(e, t, s, i = !1) {
  let a;
  typeof e == "string"
    ? (a = us(e))
    : ((a = { ...e }),
      Pe(!a.pathname || !a.pathname.includes("?"), Lu("?", "pathname", "search", a)),
      Pe(!a.pathname || !a.pathname.includes("#"), Lu("#", "pathname", "hash", a)),
      Pe(!a.search || !a.search.includes("#"), Lu("#", "search", "hash", a)));
  let u = e === "" || a.pathname === "",
    c = u ? "/" : a.pathname,
    f;
  if (c == null) f = s;
  else {
    let v = t.length - 1;
    if (!i && c.startsWith("..")) {
      let w = c.split("/");
      for (; w[0] === "..";) (w.shift(), (v -= 1));
      a.pathname = w.join("/");
    }
    f = v >= 0 ? t[v] : "/";
  }
  let p = o1(a, f),
    g = c && c !== "/" && c.endsWith("/"),
    y = (u || c === ".") && s.endsWith("/");
  return (!p.pathname.endsWith("/") && (g || y) && (p.pathname += "/"), p);
}
var fn = (e) => e.join("/").replace(/\/\/+/g, "/"),
  l1 = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  u1 = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  c1 = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function d1(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
function f1(e) {
  return (
    e
      .map((t) => t.route.path)
      .filter(Boolean)
      .join("/")
      .replace(/\/\/*/g, "/") || "/"
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Uy = ["POST", "PUT", "PATCH", "DELETE"];
new Set(Uy);
var p1 = ["GET", ...Uy];
new Set(p1);
var cs = _.createContext(null);
cs.displayName = "DataRouter";
var ka = _.createContext(null);
ka.displayName = "DataRouterState";
_.createContext(!1);
var zy = _.createContext({ isTransitioning: !1 });
zy.displayName = "ViewTransition";
var h1 = _.createContext(new Map());
h1.displayName = "Fetchers";
var m1 = _.createContext(null);
m1.displayName = "Await";
var Gt = _.createContext(null);
Gt.displayName = "Navigation";
var Ni = _.createContext(null);
Ni.displayName = "Location";
var xn = _.createContext({ outlet: null, matches: [], isDataRoute: !1 });
xn.displayName = "Route";
var rd = _.createContext(null);
rd.displayName = "RouteError";
function g1(e, { relative: t } = {}) {
  Pe(ji(), "useHref() may be used only in the context of a <Router> component.");
  let { basename: s, navigator: i } = _.useContext(Gt),
    { hash: a, pathname: u, search: c } = Pi(e, { relative: t }),
    f = u;
  return (
    s !== "/" && (f = u === "/" ? s : fn([s, u])),
    i.createHref({ pathname: f, search: c, hash: a })
  );
}
function ji() {
  return _.useContext(Ni) != null;
}
function wn() {
  return (
    Pe(ji(), "useLocation() may be used only in the context of a <Router> component."),
    _.useContext(Ni).location
  );
}
var Hy =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Wy(e) {
  _.useContext(Gt).static || _.useLayoutEffect(e);
}
function y1() {
  let { isDataRoute: e } = _.useContext(xn);
  return e ? P1() : v1();
}
function v1() {
  Pe(ji(), "useNavigate() may be used only in the context of a <Router> component.");
  let e = _.useContext(cs),
    { basename: t, navigator: s } = _.useContext(Gt),
    { matches: i } = _.useContext(xn),
    { pathname: a } = wn(),
    u = JSON.stringify(By(i)),
    c = _.useRef(!1);
  return (
    Wy(() => {
      c.current = !0;
    }),
    _.useCallback(
      (p, g = {}) => {
        if ((Wt(c.current, Hy), !c.current)) return;
        if (typeof p == "number") {
          s.go(p);
          return;
        }
        let y = $y(p, JSON.parse(u), a, g.relative === "path");
        (e == null && t !== "/" && (y.pathname = y.pathname === "/" ? t : fn([t, y.pathname])),
          (g.replace ? s.replace : s.push)(y, g.state, g));
      },
      [t, s, u, a, e]
    )
  );
}
_.createContext(null);
function Pi(e, { relative: t } = {}) {
  let { matches: s } = _.useContext(xn),
    { pathname: i } = wn(),
    a = JSON.stringify(By(s));
  return _.useMemo(() => $y(e, JSON.parse(a), i, t === "path"), [e, a, i, t]);
}
function x1(e, t) {
  return Gy(e, t);
}
function Gy(e, t, s, i, a) {
  Pe(ji(), "useRoutes() may be used only in the context of a <Router> component.");
  let { navigator: u } = _.useContext(Gt),
    { matches: c } = _.useContext(xn),
    f = c[c.length - 1],
    p = f ? f.params : {},
    g = f ? f.pathname : "/",
    y = f ? f.pathnameBase : "/",
    v = f && f.route;
  {
    let D = (v && v.path) || "";
    Ky(
      g,
      !v || D.endsWith("*") || D.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${g}" (under <Route path="${D}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${D}"> to <Route path="${D === "/" ? "*" : `${D}/*`}">.`
    );
  }
  let w = wn(),
    E;
  if (t) {
    let D = typeof t == "string" ? us(t) : t;
    (Pe(
      y === "/" || D.pathname?.startsWith(y),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${D.pathname}" was given in the \`location\` prop.`
    ),
      (E = D));
  } else E = w;
  let b = E.pathname || "/",
    A = b;
  if (y !== "/") {
    let D = y.replace(/^\//, "").split("/");
    A = "/" + b.replace(/^\//, "").split("/").slice(D.length).join("/");
  }
  let k = Oy(e, { pathname: A });
  (Wt(v || k != null, `No routes matched location "${E.pathname}${E.search}${E.hash}" `),
    Wt(
      k == null ||
        k[k.length - 1].route.element !== void 0 ||
        k[k.length - 1].route.Component !== void 0 ||
        k[k.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${E.pathname}${E.search}${E.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    ));
  let R = T1(
    k &&
      k.map((D) =>
        Object.assign({}, D, {
          params: Object.assign({}, p, D.params),
          pathname: fn([
            y,
            u.encodeLocation
              ? u.encodeLocation(D.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname
              : D.pathname,
          ]),
          pathnameBase:
            D.pathnameBase === "/"
              ? y
              : fn([
                  y,
                  u.encodeLocation
                    ? u.encodeLocation(D.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23"))
                        .pathname
                    : D.pathnameBase,
                ]),
        })
      ),
    c,
    s,
    i,
    a
  );
  return t && R
    ? _.createElement(
        Ni.Provider,
        {
          value: {
            location: { pathname: "/", search: "", hash: "", state: null, key: "default", ...E },
            navigationType: "POP",
          },
        },
        R
      )
    : R;
}
function w1() {
  let e = j1(),
    t = d1(e) ? `${e.status} ${e.statusText}` : e instanceof Error ? e.message : JSON.stringify(e),
    s = e instanceof Error ? e.stack : null,
    i = "rgba(200,200,200, 0.5)",
    a = { padding: "0.5rem", backgroundColor: i },
    u = { padding: "2px 4px", backgroundColor: i },
    c = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", e),
    (c = _.createElement(
      _.Fragment,
      null,
      _.createElement("p", null, "💿 Hey developer 👋"),
      _.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        _.createElement("code", { style: u }, "ErrorBoundary"),
        " or",
        " ",
        _.createElement("code", { style: u }, "errorElement"),
        " prop on your route."
      )
    )),
    _.createElement(
      _.Fragment,
      null,
      _.createElement("h2", null, "Unexpected Application Error!"),
      _.createElement("h3", { style: { fontStyle: "italic" } }, t),
      s ? _.createElement("pre", { style: a }, s) : null,
      c
    )
  );
}
var S1 = _.createElement(w1, null),
  E1 = class extends _.Component {
    constructor(e) {
      (super(e),
        (this.state = { location: e.location, revalidation: e.revalidation, error: e.error }));
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location || (t.revalidation !== "idle" && e.revalidation === "idle")
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error !== void 0 ? e.error : t.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      this.props.onError
        ? this.props.onError(e, t)
        : console.error("React Router caught the following error during render", e);
    }
    render() {
      return this.state.error !== void 0
        ? _.createElement(
            xn.Provider,
            { value: this.props.routeContext },
            _.createElement(rd.Provider, {
              value: this.state.error,
              children: this.props.component,
            })
          )
        : this.props.children;
    }
  };
function _1({ routeContext: e, match: t, children: s }) {
  let i = _.useContext(cs);
  return (
    i &&
      i.static &&
      i.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (i.staticContext._deepestRenderedBoundaryId = t.route.id),
    _.createElement(xn.Provider, { value: e }, s)
  );
}
function T1(e, t = [], s = null, i = null, a = null) {
  if (e == null) {
    if (!s) return null;
    if (s.errors) e = s.matches;
    else if (t.length === 0 && !s.initialized && s.matches.length > 0) e = s.matches;
    else return null;
  }
  let u = e,
    c = s?.errors;
  if (c != null) {
    let y = u.findIndex((v) => v.route.id && c?.[v.route.id] !== void 0);
    (Pe(
      y >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(c).join(",")}`
    ),
      (u = u.slice(0, Math.min(u.length, y + 1))));
  }
  let f = !1,
    p = -1;
  if (s)
    for (let y = 0; y < u.length; y++) {
      let v = u[y];
      if (((v.route.HydrateFallback || v.route.hydrateFallbackElement) && (p = y), v.route.id)) {
        let { loaderData: w, errors: E } = s,
          b = v.route.loader && !w.hasOwnProperty(v.route.id) && (!E || E[v.route.id] === void 0);
        if (v.route.lazy || b) {
          ((f = !0), p >= 0 ? (u = u.slice(0, p + 1)) : (u = [u[0]]));
          break;
        }
      }
    }
  let g =
    s && i
      ? (y, v) => {
          i(y, {
            location: s.location,
            params: s.matches?.[0]?.params ?? {},
            unstable_pattern: f1(s.matches),
            errorInfo: v,
          });
        }
      : void 0;
  return u.reduceRight((y, v, w) => {
    let E,
      b = !1,
      A = null,
      k = null;
    s &&
      ((E = c && v.route.id ? c[v.route.id] : void 0),
      (A = v.route.errorElement || S1),
      f &&
        (p < 0 && w === 0
          ? (Ky(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration"
            ),
            (b = !0),
            (k = null))
          : p === w && ((b = !0), (k = v.route.hydrateFallbackElement || null))));
    let R = t.concat(u.slice(0, w + 1)),
      D = () => {
        let M;
        return (
          E
            ? (M = A)
            : b
              ? (M = k)
              : v.route.Component
                ? (M = _.createElement(v.route.Component, null))
                : v.route.element
                  ? (M = v.route.element)
                  : (M = y),
          _.createElement(_1, {
            match: v,
            routeContext: { outlet: y, matches: R, isDataRoute: s != null },
            children: M,
          })
        );
      };
    return s && (v.route.ErrorBoundary || v.route.errorElement || w === 0)
      ? _.createElement(E1, {
          location: s.location,
          revalidation: s.revalidation,
          component: A,
          error: E,
          children: D(),
          routeContext: { outlet: null, matches: R, isDataRoute: !0 },
          onError: g,
        })
      : D();
  }, null);
}
function sd(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function C1(e) {
  let t = _.useContext(cs);
  return (Pe(t, sd(e)), t);
}
function k1(e) {
  let t = _.useContext(ka);
  return (Pe(t, sd(e)), t);
}
function b1(e) {
  let t = _.useContext(xn);
  return (Pe(t, sd(e)), t);
}
function id(e) {
  let t = b1(e),
    s = t.matches[t.matches.length - 1];
  return (Pe(s.route.id, `${e} can only be used on routes that contain a unique "id"`), s.route.id);
}
function N1() {
  return id("useRouteId");
}
function j1() {
  let e = _.useContext(rd),
    t = k1("useRouteError"),
    s = id("useRouteError");
  return e !== void 0 ? e : t.errors?.[s];
}
function P1() {
  let { router: e } = C1("useNavigate"),
    t = id("useNavigate"),
    s = _.useRef(!1);
  return (
    Wy(() => {
      s.current = !0;
    }),
    _.useCallback(
      async (a, u = {}) => {
        (Wt(s.current, Hy),
          s.current &&
            (typeof a == "number"
              ? await e.navigate(a)
              : await e.navigate(a, { fromRouteId: t, ...u })));
      },
      [e, t]
    )
  );
}
var cm = {};
function Ky(e, t, s) {
  !t && !cm[e] && ((cm[e] = !0), Wt(!1, s));
}
_.memo(R1);
function R1({ routes: e, future: t, state: s, unstable_onError: i }) {
  return Gy(e, void 0, s, i, t);
}
function Je(e) {
  Pe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function I1({
  basename: e = "/",
  children: t = null,
  location: s,
  navigationType: i = "POP",
  navigator: a,
  static: u = !1,
  unstable_useTransitions: c,
}) {
  Pe(
    !ji(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let f = e.replace(/^\/*/, "/"),
    p = _.useMemo(
      () => ({ basename: f, navigator: a, static: u, unstable_useTransitions: c, future: {} }),
      [f, a, u, c]
    );
  typeof s == "string" && (s = us(s));
  let { pathname: g = "/", search: y = "", hash: v = "", state: w = null, key: E = "default" } = s,
    b = _.useMemo(() => {
      let A = mn(g, f);
      return A == null
        ? null
        : { location: { pathname: A, search: y, hash: v, state: w, key: E }, navigationType: i };
    }, [f, g, y, v, w, E, i]);
  return (
    Wt(
      b != null,
      `<Router basename="${f}"> is not able to match the URL "${g}${y}${v}" because it does not start with the basename, so the <Router> won't render anything.`
    ),
    b == null
      ? null
      : _.createElement(
          Gt.Provider,
          { value: p },
          _.createElement(Ni.Provider, { children: t, value: b })
        )
  );
}
function A1({ children: e, location: t }) {
  return x1(mc(e), t);
}
function mc(e, t = []) {
  let s = [];
  return (
    _.Children.forEach(e, (i, a) => {
      if (!_.isValidElement(i)) return;
      let u = [...t, a];
      if (i.type === _.Fragment) {
        s.push.apply(s, mc(i.props.children, u));
        return;
      }
      (Pe(
        i.type === Je,
        `[${typeof i.type == "string" ? i.type : i.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
      ),
        Pe(!i.props.index || !i.props.children, "An index route cannot have child routes."));
      let c = {
        id: i.props.id || u.join("-"),
        caseSensitive: i.props.caseSensitive,
        element: i.props.element,
        Component: i.props.Component,
        index: i.props.index,
        path: i.props.path,
        middleware: i.props.middleware,
        loader: i.props.loader,
        action: i.props.action,
        hydrateFallbackElement: i.props.hydrateFallbackElement,
        HydrateFallback: i.props.HydrateFallback,
        errorElement: i.props.errorElement,
        ErrorBoundary: i.props.ErrorBoundary,
        hasErrorBoundary:
          i.props.hasErrorBoundary === !0 ||
          i.props.ErrorBoundary != null ||
          i.props.errorElement != null,
        shouldRevalidate: i.props.shouldRevalidate,
        handle: i.props.handle,
        lazy: i.props.lazy,
      };
      (i.props.children && (c.children = mc(i.props.children, u)), s.push(c));
    }),
    s
  );
}
var ia = "get",
  oa = "application/x-www-form-urlencoded";
function ba(e) {
  return typeof HTMLElement < "u" && e instanceof HTMLElement;
}
function M1(e) {
  return ba(e) && e.tagName.toLowerCase() === "button";
}
function D1(e) {
  return ba(e) && e.tagName.toLowerCase() === "form";
}
function L1(e) {
  return ba(e) && e.tagName.toLowerCase() === "input";
}
function O1(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function F1(e, t) {
  return e.button === 0 && (!t || t === "_self") && !O1(e);
}
var Qo = null;
function V1() {
  if (Qo === null)
    try {
      (new FormData(document.createElement("form"), 0), (Qo = !1));
    } catch {
      Qo = !0;
    }
  return Qo;
}
var B1 = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Ou(e) {
  return e != null && !B1.has(e)
    ? (Wt(
        !1,
        `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${oa}"`
      ),
      null)
    : e;
}
function $1(e, t) {
  let s, i, a, u, c;
  if (D1(e)) {
    let f = e.getAttribute("action");
    ((i = f ? mn(f, t) : null),
      (s = e.getAttribute("method") || ia),
      (a = Ou(e.getAttribute("enctype")) || oa),
      (u = new FormData(e)));
  } else if (M1(e) || (L1(e) && (e.type === "submit" || e.type === "image"))) {
    let f = e.form;
    if (f == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let p = e.getAttribute("formaction") || f.getAttribute("action");
    if (
      ((i = p ? mn(p, t) : null),
      (s = e.getAttribute("formmethod") || f.getAttribute("method") || ia),
      (a = Ou(e.getAttribute("formenctype")) || Ou(f.getAttribute("enctype")) || oa),
      (u = new FormData(f, e)),
      !V1())
    ) {
      let { name: g, type: y, value: v } = e;
      if (y === "image") {
        let w = g ? `${g}.` : "";
        (u.append(`${w}x`, "0"), u.append(`${w}y`, "0"));
      } else g && u.append(g, v);
    }
  } else {
    if (ba(e))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    ((s = ia), (i = null), (a = oa), (c = e));
  }
  return (
    u && a === "text/plain" && ((c = u), (u = void 0)),
    { action: i, method: s.toLowerCase(), encType: a, formData: u, body: c }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function od(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function U1(e, t, s) {
  let i =
    typeof e == "string"
      ? new URL(e, typeof window > "u" ? "server://singlefetch/" : window.location.origin)
      : e;
  return (
    i.pathname === "/"
      ? (i.pathname = `_root.${s}`)
      : t && mn(i.pathname, t) === "/"
        ? (i.pathname = `${t.replace(/\/$/, "")}/_root.${s}`)
        : (i.pathname = `${i.pathname.replace(/\/$/, "")}.${s}`),
    i
  );
}
async function z1(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let s = await import(e.module);
    return ((t[e.id] = s), s);
  } catch (s) {
    return (
      console.error(`Error loading route module \`${e.module}\`, reloading page...`),
      console.error(s),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function H1(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === "preload" && typeof e.imageSrcSet == "string" && typeof e.imageSizes == "string"
      : typeof e.rel == "string" && typeof e.href == "string";
}
async function W1(e, t, s) {
  let i = await Promise.all(
    e.map(async (a) => {
      let u = t.routes[a.route.id];
      if (u) {
        let c = await z1(u, s);
        return c.links ? c.links() : [];
      }
      return [];
    })
  );
  return X1(
    i
      .flat(1)
      .filter(H1)
      .filter((a) => a.rel === "stylesheet" || a.rel === "preload")
      .map((a) =>
        a.rel === "stylesheet" ? { ...a, rel: "prefetch", as: "style" } : { ...a, rel: "prefetch" }
      )
  );
}
function dm(e, t, s, i, a, u) {
  let c = (p, g) => (s[g] ? p.route.id !== s[g].route.id : !0),
    f = (p, g) =>
      s[g].pathname !== p.pathname ||
      (s[g].route.path?.endsWith("*") && s[g].params["*"] !== p.params["*"]);
  return u === "assets"
    ? t.filter((p, g) => c(p, g) || f(p, g))
    : u === "data"
      ? t.filter((p, g) => {
          let y = i.routes[p.route.id];
          if (!y || !y.hasLoader) return !1;
          if (c(p, g) || f(p, g)) return !0;
          if (p.route.shouldRevalidate) {
            let v = p.route.shouldRevalidate({
              currentUrl: new URL(a.pathname + a.search + a.hash, window.origin),
              currentParams: s[0]?.params || {},
              nextUrl: new URL(e, window.origin),
              nextParams: p.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof v == "boolean") return v;
          }
          return !0;
        })
      : [];
}
function G1(e, t, { includeHydrateFallback: s } = {}) {
  return K1(
    e
      .map((i) => {
        let a = t.routes[i.route.id];
        if (!a) return [];
        let u = [a.module];
        return (
          a.clientActionModule && (u = u.concat(a.clientActionModule)),
          a.clientLoaderModule && (u = u.concat(a.clientLoaderModule)),
          s && a.hydrateFallbackModule && (u = u.concat(a.hydrateFallbackModule)),
          a.imports && (u = u.concat(a.imports)),
          u
        );
      })
      .flat(1)
  );
}
function K1(e) {
  return [...new Set(e)];
}
function Y1(e) {
  let t = {},
    s = Object.keys(e).sort();
  for (let i of s) t[i] = e[i];
  return t;
}
function X1(e, t) {
  let s = new Set();
  return (
    new Set(t),
    e.reduce((i, a) => {
      let u = JSON.stringify(Y1(a));
      return (s.has(u) || (s.add(u), i.push({ key: u, link: a })), i);
    }, [])
  );
}
function Yy() {
  let e = _.useContext(cs);
  return (od(e, "You must render this element inside a <DataRouterContext.Provider> element"), e);
}
function q1() {
  let e = _.useContext(ka);
  return (
    od(e, "You must render this element inside a <DataRouterStateContext.Provider> element"),
    e
  );
}
var ad = _.createContext(void 0);
ad.displayName = "FrameworkContext";
function Xy() {
  let e = _.useContext(ad);
  return (od(e, "You must render this element inside a <HydratedRouter> element"), e);
}
function Q1(e, t) {
  let s = _.useContext(ad),
    [i, a] = _.useState(!1),
    [u, c] = _.useState(!1),
    { onFocus: f, onBlur: p, onMouseEnter: g, onMouseLeave: y, onTouchStart: v } = t,
    w = _.useRef(null);
  (_.useEffect(() => {
    if ((e === "render" && c(!0), e === "viewport")) {
      let A = (R) => {
          R.forEach((D) => {
            c(D.isIntersecting);
          });
        },
        k = new IntersectionObserver(A, { threshold: 0.5 });
      return (
        w.current && k.observe(w.current),
        () => {
          k.disconnect();
        }
      );
    }
  }, [e]),
    _.useEffect(() => {
      if (i) {
        let A = setTimeout(() => {
          c(!0);
        }, 100);
        return () => {
          clearTimeout(A);
        };
      }
    }, [i]));
  let E = () => {
      a(!0);
    },
    b = () => {
      (a(!1), c(!1));
    };
  return s
    ? e !== "intent"
      ? [u, w, {}]
      : [
          u,
          w,
          {
            onFocus: ai(f, E),
            onBlur: ai(p, b),
            onMouseEnter: ai(g, E),
            onMouseLeave: ai(y, b),
            onTouchStart: ai(v, E),
          },
        ]
    : [!1, w, {}];
}
function ai(e, t) {
  return (s) => {
    (e && e(s), s.defaultPrevented || t(s));
  };
}
function J1({ page: e, ...t }) {
  let { router: s } = Yy(),
    i = _.useMemo(() => Oy(s.routes, e, s.basename), [s.routes, e, s.basename]);
  return i ? _.createElement(eE, { page: e, matches: i, ...t }) : null;
}
function Z1(e) {
  let { manifest: t, routeModules: s } = Xy(),
    [i, a] = _.useState([]);
  return (
    _.useEffect(() => {
      let u = !1;
      return (
        W1(e, t, s).then((c) => {
          u || a(c);
        }),
        () => {
          u = !0;
        }
      );
    }, [e, t, s]),
    i
  );
}
function eE({ page: e, matches: t, ...s }) {
  let i = wn(),
    { manifest: a, routeModules: u } = Xy(),
    { basename: c } = Yy(),
    { loaderData: f, matches: p } = q1(),
    g = _.useMemo(() => dm(e, t, p, a, i, "data"), [e, t, p, a, i]),
    y = _.useMemo(() => dm(e, t, p, a, i, "assets"), [e, t, p, a, i]),
    v = _.useMemo(() => {
      if (e === i.pathname + i.search + i.hash) return [];
      let b = new Set(),
        A = !1;
      if (
        (t.forEach((R) => {
          let D = a.routes[R.route.id];
          !D ||
            !D.hasLoader ||
            ((!g.some((M) => M.route.id === R.route.id) &&
              R.route.id in f &&
              u[R.route.id]?.shouldRevalidate) ||
            D.hasClientLoader
              ? (A = !0)
              : b.add(R.route.id));
        }),
        b.size === 0)
      )
        return [];
      let k = U1(e, c, "data");
      return (
        A &&
          b.size > 0 &&
          k.searchParams.set(
            "_routes",
            t
              .filter((R) => b.has(R.route.id))
              .map((R) => R.route.id)
              .join(",")
          ),
        [k.pathname + k.search]
      );
    }, [c, f, i, a, g, t, e, u]),
    w = _.useMemo(() => G1(y, a), [y, a]),
    E = Z1(y);
  return _.createElement(
    _.Fragment,
    null,
    v.map((b) => _.createElement("link", { key: b, rel: "prefetch", as: "fetch", href: b, ...s })),
    w.map((b) => _.createElement("link", { key: b, rel: "modulepreload", href: b, ...s })),
    E.map(({ key: b, link: A }) => _.createElement("link", { key: b, nonce: s.nonce, ...A }))
  );
}
function tE(...e) {
  return (t) => {
    e.forEach((s) => {
      typeof s == "function" ? s(t) : s != null && (s.current = t);
    });
  };
}
var qy =
  typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  qy && (window.__reactRouterVersion = "7.10.1");
} catch {}
function nE({ basename: e, children: t, unstable_useTransitions: s, window: i }) {
  let a = _.useRef();
  a.current == null && (a.current = $S({ window: i, v5Compat: !0 }));
  let u = a.current,
    [c, f] = _.useState({ action: u.action, location: u.location }),
    p = _.useCallback(
      (g) => {
        s === !1 ? f(g) : _.startTransition(() => f(g));
      },
      [s]
    );
  return (
    _.useLayoutEffect(() => u.listen(p), [u, p]),
    _.createElement(I1, {
      basename: e,
      children: t,
      location: c.location,
      navigationType: c.action,
      navigator: u,
      unstable_useTransitions: s === !0,
    })
  );
}
var Qy = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  mt = _.forwardRef(function (
    {
      onClick: t,
      discover: s = "render",
      prefetch: i = "none",
      relative: a,
      reloadDocument: u,
      replace: c,
      state: f,
      target: p,
      to: g,
      preventScrollReset: y,
      viewTransition: v,
      ...w
    },
    E
  ) {
    let { basename: b, unstable_useTransitions: A } = _.useContext(Gt),
      k = typeof g == "string" && Qy.test(g),
      R,
      D = !1;
    if (typeof g == "string" && k && ((R = g), qy))
      try {
        let ce = new URL(window.location.href),
          _e = g.startsWith("//") ? new URL(ce.protocol + g) : new URL(g),
          Fe = mn(_e.pathname, b);
        _e.origin === ce.origin && Fe != null ? (g = Fe + _e.search + _e.hash) : (D = !0);
      } catch {
        Wt(
          !1,
          `<Link to="${g}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
        );
      }
    let M = g1(g, { relative: a }),
      [$, z, J] = Q1(i, w),
      te = oE(g, {
        replace: c,
        state: f,
        target: p,
        preventScrollReset: y,
        relative: a,
        viewTransition: v,
        unstable_useTransitions: A,
      });
    function Q(ce) {
      (t && t(ce), ce.defaultPrevented || te(ce));
    }
    let fe = _.createElement("a", {
      ...w,
      ...J,
      href: R || M,
      onClick: D || u ? t : Q,
      ref: tE(E, z),
      target: p,
      "data-discover": !k && s === "render" ? "true" : void 0,
    });
    return $ && !k ? _.createElement(_.Fragment, null, fe, _.createElement(J1, { page: M })) : fe;
  });
mt.displayName = "Link";
var rE = _.forwardRef(function (
  {
    "aria-current": t = "page",
    caseSensitive: s = !1,
    className: i = "",
    end: a = !1,
    style: u,
    to: c,
    viewTransition: f,
    children: p,
    ...g
  },
  y
) {
  let v = Pi(c, { relative: g.relative }),
    w = wn(),
    E = _.useContext(ka),
    { navigator: b, basename: A } = _.useContext(Gt),
    k = E != null && dE(v) && f === !0,
    R = b.encodeLocation ? b.encodeLocation(v).pathname : v.pathname,
    D = w.pathname,
    M = E && E.navigation && E.navigation.location ? E.navigation.location.pathname : null;
  (s || ((D = D.toLowerCase()), (M = M ? M.toLowerCase() : null), (R = R.toLowerCase())),
    M && A && (M = mn(M, A) || M));
  const $ = R !== "/" && R.endsWith("/") ? R.length - 1 : R.length;
  let z = D === R || (!a && D.startsWith(R) && D.charAt($) === "/"),
    J = M != null && (M === R || (!a && M.startsWith(R) && M.charAt(R.length) === "/")),
    te = { isActive: z, isPending: J, isTransitioning: k },
    Q = z ? t : void 0,
    fe;
  typeof i == "function"
    ? (fe = i(te))
    : (fe = [i, z ? "active" : null, J ? "pending" : null, k ? "transitioning" : null]
        .filter(Boolean)
        .join(" "));
  let ce = typeof u == "function" ? u(te) : u;
  return _.createElement(
    mt,
    { ...g, "aria-current": Q, className: fe, ref: y, style: ce, to: c, viewTransition: f },
    typeof p == "function" ? p(te) : p
  );
});
rE.displayName = "NavLink";
var sE = _.forwardRef(
  (
    {
      discover: e = "render",
      fetcherKey: t,
      navigate: s,
      reloadDocument: i,
      replace: a,
      state: u,
      method: c = ia,
      action: f,
      onSubmit: p,
      relative: g,
      preventScrollReset: y,
      viewTransition: v,
      ...w
    },
    E
  ) => {
    let { unstable_useTransitions: b } = _.useContext(Gt),
      A = uE(),
      k = cE(f, { relative: g }),
      R = c.toLowerCase() === "get" ? "get" : "post",
      D = typeof f == "string" && Qy.test(f),
      M = ($) => {
        if ((p && p($), $.defaultPrevented)) return;
        $.preventDefault();
        let z = $.nativeEvent.submitter,
          J = z?.getAttribute("formmethod") || c,
          te = () =>
            A(z || $.currentTarget, {
              fetcherKey: t,
              method: J,
              navigate: s,
              replace: a,
              state: u,
              relative: g,
              preventScrollReset: y,
              viewTransition: v,
            });
        b && s !== !1 ? _.startTransition(() => te()) : te();
      };
    return _.createElement("form", {
      ref: E,
      method: R,
      action: k,
      onSubmit: i ? p : M,
      ...w,
      "data-discover": !D && e === "render" ? "true" : void 0,
    });
  }
);
sE.displayName = "Form";
function iE(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Jy(e) {
  let t = _.useContext(cs);
  return (Pe(t, iE(e)), t);
}
function oE(
  e,
  {
    target: t,
    replace: s,
    state: i,
    preventScrollReset: a,
    relative: u,
    viewTransition: c,
    unstable_useTransitions: f,
  } = {}
) {
  let p = y1(),
    g = wn(),
    y = Pi(e, { relative: u });
  return _.useCallback(
    (v) => {
      if (F1(v, t)) {
        v.preventDefault();
        let w = s !== void 0 ? s : vi(g) === vi(y),
          E = () =>
            p(e, { replace: w, state: i, preventScrollReset: a, relative: u, viewTransition: c });
        f ? _.startTransition(() => E()) : E();
      }
    },
    [g, p, y, s, i, t, e, a, u, c, f]
  );
}
var aE = 0,
  lE = () => `__${String(++aE)}__`;
function uE() {
  let { router: e } = Jy("useSubmit"),
    { basename: t } = _.useContext(Gt),
    s = N1(),
    i = e.fetch,
    a = e.navigate;
  return _.useCallback(
    async (u, c = {}) => {
      let { action: f, method: p, encType: g, formData: y, body: v } = $1(u, t);
      if (c.navigate === !1) {
        let w = c.fetcherKey || lE();
        await i(w, s, c.action || f, {
          preventScrollReset: c.preventScrollReset,
          formData: y,
          body: v,
          formMethod: c.method || p,
          formEncType: c.encType || g,
          flushSync: c.flushSync,
        });
      } else
        await a(c.action || f, {
          preventScrollReset: c.preventScrollReset,
          formData: y,
          body: v,
          formMethod: c.method || p,
          formEncType: c.encType || g,
          replace: c.replace,
          state: c.state,
          fromRouteId: s,
          flushSync: c.flushSync,
          viewTransition: c.viewTransition,
        });
    },
    [i, a, t, s]
  );
}
function cE(e, { relative: t } = {}) {
  let { basename: s } = _.useContext(Gt),
    i = _.useContext(xn);
  Pe(i, "useFormAction must be used inside a RouteContext");
  let [a] = i.matches.slice(-1),
    u = { ...Pi(e || ".", { relative: t }) },
    c = wn();
  if (e == null) {
    u.search = c.search;
    let f = new URLSearchParams(u.search),
      p = f.getAll("index");
    if (p.some((y) => y === "")) {
      (f.delete("index"), p.filter((v) => v).forEach((v) => f.append("index", v)));
      let y = f.toString();
      u.search = y ? `?${y}` : "";
    }
  }
  return (
    (!e || e === ".") &&
      a.route.index &&
      (u.search = u.search ? u.search.replace(/^\?/, "?index&") : "?index"),
    s !== "/" && (u.pathname = u.pathname === "/" ? s : fn([s, u.pathname])),
    vi(u)
  );
}
function dE(e, { relative: t } = {}) {
  let s = _.useContext(zy);
  Pe(
    s != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: i } = Jy("useViewTransitionState"),
    a = Pi(e, { relative: t });
  if (!s.isTransitioning) return !1;
  let u = mn(s.currentLocation.pathname, i) || s.currentLocation.pathname,
    c = mn(s.nextLocation.pathname, i) || s.nextLocation.pathname;
  return ya(a.pathname, c) != null || ya(a.pathname, u) != null;
}
var Fu, fm;
function fE() {
  if (fm) return Fu;
  fm = 1;
  var e = typeof Element < "u",
    t = typeof Map == "function",
    s = typeof Set == "function",
    i = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;
  function a(u, c) {
    if (u === c) return !0;
    if (u && c && typeof u == "object" && typeof c == "object") {
      if (u.constructor !== c.constructor) return !1;
      var f, p, g;
      if (Array.isArray(u)) {
        if (((f = u.length), f != c.length)) return !1;
        for (p = f; p-- !== 0;) if (!a(u[p], c[p])) return !1;
        return !0;
      }
      var y;
      if (t && u instanceof Map && c instanceof Map) {
        if (u.size !== c.size) return !1;
        for (y = u.entries(); !(p = y.next()).done;) if (!c.has(p.value[0])) return !1;
        for (y = u.entries(); !(p = y.next()).done;)
          if (!a(p.value[1], c.get(p.value[0]))) return !1;
        return !0;
      }
      if (s && u instanceof Set && c instanceof Set) {
        if (u.size !== c.size) return !1;
        for (y = u.entries(); !(p = y.next()).done;) if (!c.has(p.value[0])) return !1;
        return !0;
      }
      if (i && ArrayBuffer.isView(u) && ArrayBuffer.isView(c)) {
        if (((f = u.length), f != c.length)) return !1;
        for (p = f; p-- !== 0;) if (u[p] !== c[p]) return !1;
        return !0;
      }
      if (u.constructor === RegExp) return u.source === c.source && u.flags === c.flags;
      if (
        u.valueOf !== Object.prototype.valueOf &&
        typeof u.valueOf == "function" &&
        typeof c.valueOf == "function"
      )
        return u.valueOf() === c.valueOf();
      if (
        u.toString !== Object.prototype.toString &&
        typeof u.toString == "function" &&
        typeof c.toString == "function"
      )
        return u.toString() === c.toString();
      if (((g = Object.keys(u)), (f = g.length), f !== Object.keys(c).length)) return !1;
      for (p = f; p-- !== 0;) if (!Object.prototype.hasOwnProperty.call(c, g[p])) return !1;
      if (e && u instanceof Element) return !1;
      for (p = f; p-- !== 0;)
        if (
          !((g[p] === "_owner" || g[p] === "__v" || g[p] === "__o") && u.$$typeof) &&
          !a(u[g[p]], c[g[p]])
        )
          return !1;
      return !0;
    }
    return u !== u && c !== c;
  }
  return (
    (Fu = function (c, f) {
      try {
        return a(c, f);
      } catch (p) {
        if ((p.message || "").match(/stack|recursion/i))
          return (console.warn("react-fast-compare cannot handle circular refs"), !1);
        throw p;
      }
    }),
    Fu
  );
}
var pE = fE();
const hE = bi(pE);
var Vu, pm;
function mE() {
  if (pm) return Vu;
  pm = 1;
  var e = function (t, s, i, a, u, c, f, p) {
    if (!t) {
      var g;
      if (s === void 0)
        g = new Error(
          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
        );
      else {
        var y = [i, a, u, c, f, p],
          v = 0;
        ((g = new Error(
          s.replace(/%s/g, function () {
            return y[v++];
          })
        )),
          (g.name = "Invariant Violation"));
      }
      throw ((g.framesToPop = 1), g);
    }
  };
  return ((Vu = e), Vu);
}
var gE = mE();
const hm = bi(gE);
var Bu, mm;
function yE() {
  return (
    mm ||
      ((mm = 1),
      (Bu = function (t, s, i, a) {
        var u = i ? i.call(a, t, s) : void 0;
        if (u !== void 0) return !!u;
        if (t === s) return !0;
        if (typeof t != "object" || !t || typeof s != "object" || !s) return !1;
        var c = Object.keys(t),
          f = Object.keys(s);
        if (c.length !== f.length) return !1;
        for (var p = Object.prototype.hasOwnProperty.bind(s), g = 0; g < c.length; g++) {
          var y = c[g];
          if (!p(y)) return !1;
          var v = t[y],
            w = s[y];
          if (((u = i ? i.call(a, v, w, y) : void 0), u === !1 || (u === void 0 && v !== w)))
            return !1;
        }
        return !0;
      })),
    Bu
  );
}
var vE = yE();
const xE = bi(vE);
var Zy = ((e) => (
    (e.BASE = "base"),
    (e.BODY = "body"),
    (e.HEAD = "head"),
    (e.HTML = "html"),
    (e.LINK = "link"),
    (e.META = "meta"),
    (e.NOSCRIPT = "noscript"),
    (e.SCRIPT = "script"),
    (e.STYLE = "style"),
    (e.TITLE = "title"),
    (e.FRAGMENT = "Symbol(react.fragment)"),
    e
  ))(Zy || {}),
  $u = {
    link: { rel: ["amphtml", "canonical", "alternate"] },
    script: { type: ["application/ld+json"] },
    meta: {
      charset: "",
      name: ["generator", "robots", "description"],
      property: [
        "og:type",
        "og:title",
        "og:url",
        "og:image",
        "og:image:alt",
        "og:description",
        "twitter:url",
        "twitter:title",
        "twitter:description",
        "twitter:image",
        "twitter:image:alt",
        "twitter:card",
        "twitter:site",
      ],
    },
  },
  gm = Object.values(Zy),
  ld = {
    accesskey: "accessKey",
    charset: "charSet",
    class: "className",
    contenteditable: "contentEditable",
    contextmenu: "contextMenu",
    "http-equiv": "httpEquiv",
    itemprop: "itemProp",
    tabindex: "tabIndex",
  },
  wE = Object.entries(ld).reduce((e, [t, s]) => ((e[s] = t), e), {}),
  zt = "data-rh",
  es = {
    DEFAULT_TITLE: "defaultTitle",
    DEFER: "defer",
    ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
    ON_CHANGE_CLIENT_STATE: "onChangeClientState",
    TITLE_TEMPLATE: "titleTemplate",
    PRIORITIZE_SEO_TAGS: "prioritizeSeoTags",
  },
  ts = (e, t) => {
    for (let s = e.length - 1; s >= 0; s -= 1) {
      const i = e[s];
      if (Object.prototype.hasOwnProperty.call(i, t)) return i[t];
    }
    return null;
  },
  SE = (e) => {
    let t = ts(e, "title");
    const s = ts(e, es.TITLE_TEMPLATE);
    if ((Array.isArray(t) && (t = t.join("")), s && t)) return s.replace(/%s/g, () => t);
    const i = ts(e, es.DEFAULT_TITLE);
    return t || i || void 0;
  },
  EE = (e) => ts(e, es.ON_CHANGE_CLIENT_STATE) || (() => {}),
  Uu = (e, t) =>
    t
      .filter((s) => typeof s[e] < "u")
      .map((s) => s[e])
      .reduce((s, i) => ({ ...s, ...i }), {}),
  _E = (e, t) =>
    t
      .filter((s) => typeof s.base < "u")
      .map((s) => s.base)
      .reverse()
      .reduce((s, i) => {
        if (!s.length) {
          const a = Object.keys(i);
          for (let u = 0; u < a.length; u += 1) {
            const f = a[u].toLowerCase();
            if (e.indexOf(f) !== -1 && i[f]) return s.concat(i);
          }
        }
        return s;
      }, []),
  TE = (e) => console && typeof console.warn == "function" && console.warn(e),
  li = (e, t, s) => {
    const i = {};
    return s
      .filter((a) =>
        Array.isArray(a[e])
          ? !0
          : (typeof a[e] < "u" &&
              TE(`Helmet: ${e} should be of type "Array". Instead found type "${typeof a[e]}"`),
            !1)
      )
      .map((a) => a[e])
      .reverse()
      .reduce((a, u) => {
        const c = {};
        u.filter((p) => {
          let g;
          const y = Object.keys(p);
          for (let w = 0; w < y.length; w += 1) {
            const E = y[w],
              b = E.toLowerCase();
            (t.indexOf(b) !== -1 &&
              !(g === "rel" && p[g].toLowerCase() === "canonical") &&
              !(b === "rel" && p[b].toLowerCase() === "stylesheet") &&
              (g = b),
              t.indexOf(E) !== -1 &&
                (E === "innerHTML" || E === "cssText" || E === "itemprop") &&
                (g = E));
          }
          if (!g || !p[g]) return !1;
          const v = p[g].toLowerCase();
          return (i[g] || (i[g] = {}), c[g] || (c[g] = {}), i[g][v] ? !1 : ((c[g][v] = !0), !0));
        })
          .reverse()
          .forEach((p) => a.push(p));
        const f = Object.keys(c);
        for (let p = 0; p < f.length; p += 1) {
          const g = f[p],
            y = { ...i[g], ...c[g] };
          i[g] = y;
        }
        return a;
      }, [])
      .reverse();
  },
  CE = (e, t) => {
    if (Array.isArray(e) && e.length) {
      for (let s = 0; s < e.length; s += 1) if (e[s][t]) return !0;
    }
    return !1;
  },
  kE = (e) => ({
    baseTag: _E(["href"], e),
    bodyAttributes: Uu("bodyAttributes", e),
    defer: ts(e, es.DEFER),
    encode: ts(e, es.ENCODE_SPECIAL_CHARACTERS),
    htmlAttributes: Uu("htmlAttributes", e),
    linkTags: li("link", ["rel", "href"], e),
    metaTags: li("meta", ["name", "charset", "http-equiv", "property", "itemprop"], e),
    noscriptTags: li("noscript", ["innerHTML"], e),
    onChangeClientState: EE(e),
    scriptTags: li("script", ["src", "innerHTML"], e),
    styleTags: li("style", ["cssText"], e),
    title: SE(e),
    titleAttributes: Uu("titleAttributes", e),
    prioritizeSeoTags: CE(e, es.PRIORITIZE_SEO_TAGS),
  }),
  ev = (e) => (Array.isArray(e) ? e.join("") : e),
  bE = (e, t) => {
    const s = Object.keys(e);
    for (let i = 0; i < s.length; i += 1) if (t[s[i]] && t[s[i]].includes(e[s[i]])) return !0;
    return !1;
  },
  zu = (e, t) =>
    Array.isArray(e)
      ? e.reduce((s, i) => (bE(i, t) ? s.priority.push(i) : s.default.push(i), s), {
          priority: [],
          default: [],
        })
      : { default: e, priority: [] },
  ym = (e, t) => ({ ...e, [t]: void 0 }),
  NE = ["noscript", "script", "style"],
  gc = (e, t = !0) =>
    t === !1
      ? String(e)
      : String(e)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;"),
  tv = (e) =>
    Object.keys(e).reduce((t, s) => {
      const i = typeof e[s] < "u" ? `${s}="${e[s]}"` : `${s}`;
      return t ? `${t} ${i}` : i;
    }, ""),
  jE = (e, t, s, i) => {
    const a = tv(s),
      u = ev(t);
    return a
      ? `<${e} ${zt}="true" ${a}>${gc(u, i)}</${e}>`
      : `<${e} ${zt}="true">${gc(u, i)}</${e}>`;
  },
  PE = (e, t, s = !0) =>
    t.reduce((i, a) => {
      const u = a,
        c = Object.keys(u)
          .filter((g) => !(g === "innerHTML" || g === "cssText"))
          .reduce((g, y) => {
            const v = typeof u[y] > "u" ? y : `${y}="${gc(u[y], s)}"`;
            return g ? `${g} ${v}` : v;
          }, ""),
        f = u.innerHTML || u.cssText || "",
        p = NE.indexOf(e) === -1;
      return `${i}<${e} ${zt}="true" ${c}${p ? "/>" : `>${f}</${e}>`}`;
    }, ""),
  nv = (e, t = {}) =>
    Object.keys(e).reduce((s, i) => {
      const a = ld[i];
      return ((s[a || i] = e[i]), s);
    }, t),
  RE = (e, t, s) => {
    const i = { key: t, [zt]: !0 },
      a = nv(s, i);
    return [dn.createElement("title", a, t)];
  },
  aa = (e, t) =>
    t.map((s, i) => {
      const a = { key: i, [zt]: !0 };
      return (
        Object.keys(s).forEach((u) => {
          const f = ld[u] || u;
          if (f === "innerHTML" || f === "cssText") {
            const p = s.innerHTML || s.cssText;
            a.dangerouslySetInnerHTML = { __html: p };
          } else a[f] = s[u];
        }),
        dn.createElement(e, a)
      );
    }),
  Pt = (e, t, s = !0) => {
    switch (e) {
      case "title":
        return {
          toComponent: () => RE(e, t.title, t.titleAttributes),
          toString: () => jE(e, t.title, t.titleAttributes, s),
        };
      case "bodyAttributes":
      case "htmlAttributes":
        return { toComponent: () => nv(t), toString: () => tv(t) };
      default:
        return { toComponent: () => aa(e, t), toString: () => PE(e, t, s) };
    }
  },
  IE = ({ metaTags: e, linkTags: t, scriptTags: s, encode: i }) => {
    const a = zu(e, $u.meta),
      u = zu(t, $u.link),
      c = zu(s, $u.script);
    return {
      priorityMethods: {
        toComponent: () => [
          ...aa("meta", a.priority),
          ...aa("link", u.priority),
          ...aa("script", c.priority),
        ],
        toString: () =>
          `${Pt("meta", a.priority, i)} ${Pt("link", u.priority, i)} ${Pt("script", c.priority, i)}`,
      },
      metaTags: a.default,
      linkTags: u.default,
      scriptTags: c.default,
    };
  },
  AE = (e) => {
    const {
      baseTag: t,
      bodyAttributes: s,
      encode: i = !0,
      htmlAttributes: a,
      noscriptTags: u,
      styleTags: c,
      title: f = "",
      titleAttributes: p,
      prioritizeSeoTags: g,
    } = e;
    let { linkTags: y, metaTags: v, scriptTags: w } = e,
      E = { toComponent: () => {}, toString: () => "" };
    return (
      g && ({ priorityMethods: E, linkTags: y, metaTags: v, scriptTags: w } = IE(e)),
      {
        priority: E,
        base: Pt("base", t, i),
        bodyAttributes: Pt("bodyAttributes", s, i),
        htmlAttributes: Pt("htmlAttributes", a, i),
        link: Pt("link", y, i),
        meta: Pt("meta", v, i),
        noscript: Pt("noscript", u, i),
        script: Pt("script", w, i),
        style: Pt("style", c, i),
        title: Pt("title", { title: f, titleAttributes: p }, i),
      }
    );
  },
  yc = AE,
  Jo = [],
  rv = !!(typeof window < "u" && window.document && window.document.createElement),
  vc = class {
    instances = [];
    canUseDOM = rv;
    context;
    value = {
      setHelmet: (e) => {
        this.context.helmet = e;
      },
      helmetInstances: {
        get: () => (this.canUseDOM ? Jo : this.instances),
        add: (e) => {
          (this.canUseDOM ? Jo : this.instances).push(e);
        },
        remove: (e) => {
          const t = (this.canUseDOM ? Jo : this.instances).indexOf(e);
          (this.canUseDOM ? Jo : this.instances).splice(t, 1);
        },
      },
    };
    constructor(e, t) {
      ((this.context = e),
        (this.canUseDOM = t || !1),
        t ||
          (e.helmet = yc({
            baseTag: [],
            bodyAttributes: {},
            htmlAttributes: {},
            linkTags: [],
            metaTags: [],
            noscriptTags: [],
            scriptTags: [],
            styleTags: [],
            title: "",
            titleAttributes: {},
          })));
    }
  },
  ME = {},
  sv = dn.createContext(ME),
  iv = class ov extends _.Component {
    static canUseDOM = rv;
    helmetData;
    constructor(t) {
      (super(t), (this.helmetData = new vc(this.props.context || {}, ov.canUseDOM)));
    }
    render() {
      return dn.createElement(sv.Provider, { value: this.helmetData.value }, this.props.children);
    }
  },
  Kr = (e, t) => {
    const s = document.head || document.querySelector("head"),
      i = s.querySelectorAll(`${e}[${zt}]`),
      a = [].slice.call(i),
      u = [];
    let c;
    return (
      t &&
        t.length &&
        t.forEach((f) => {
          const p = document.createElement(e);
          for (const g in f)
            if (Object.prototype.hasOwnProperty.call(f, g))
              if (g === "innerHTML") p.innerHTML = f.innerHTML;
              else if (g === "cssText")
                p.styleSheet
                  ? (p.styleSheet.cssText = f.cssText)
                  : p.appendChild(document.createTextNode(f.cssText));
              else {
                const y = g,
                  v = typeof f[y] > "u" ? "" : f[y];
                p.setAttribute(g, v);
              }
          (p.setAttribute(zt, "true"),
            a.some((g, y) => ((c = y), p.isEqualNode(g))) ? a.splice(c, 1) : u.push(p));
        }),
      a.forEach((f) => f.parentNode?.removeChild(f)),
      u.forEach((f) => s.appendChild(f)),
      { oldTags: a, newTags: u }
    );
  },
  xc = (e, t) => {
    const s = document.getElementsByTagName(e)[0];
    if (!s) return;
    const i = s.getAttribute(zt),
      a = i ? i.split(",") : [],
      u = [...a],
      c = Object.keys(t);
    for (const f of c) {
      const p = t[f] || "";
      (s.getAttribute(f) !== p && s.setAttribute(f, p), a.indexOf(f) === -1 && a.push(f));
      const g = u.indexOf(f);
      g !== -1 && u.splice(g, 1);
    }
    for (let f = u.length - 1; f >= 0; f -= 1) s.removeAttribute(u[f]);
    a.length === u.length
      ? s.removeAttribute(zt)
      : s.getAttribute(zt) !== c.join(",") && s.setAttribute(zt, c.join(","));
  },
  DE = (e, t) => {
    (typeof e < "u" && document.title !== e && (document.title = ev(e)), xc("title", t));
  },
  vm = (e, t) => {
    const {
      baseTag: s,
      bodyAttributes: i,
      htmlAttributes: a,
      linkTags: u,
      metaTags: c,
      noscriptTags: f,
      onChangeClientState: p,
      scriptTags: g,
      styleTags: y,
      title: v,
      titleAttributes: w,
    } = e;
    (xc("body", i), xc("html", a), DE(v, w));
    const E = {
        baseTag: Kr("base", s),
        linkTags: Kr("link", u),
        metaTags: Kr("meta", c),
        noscriptTags: Kr("noscript", f),
        scriptTags: Kr("script", g),
        styleTags: Kr("style", y),
      },
      b = {},
      A = {};
    (Object.keys(E).forEach((k) => {
      const { newTags: R, oldTags: D } = E[k];
      (R.length && (b[k] = R), D.length && (A[k] = E[k].oldTags));
    }),
      t && t(),
      p(e, b, A));
  },
  ui = null,
  LE = (e) => {
    (ui && cancelAnimationFrame(ui),
      e.defer
        ? (ui = requestAnimationFrame(() => {
            vm(e, () => {
              ui = null;
            });
          }))
        : (vm(e), (ui = null)));
  },
  OE = LE,
  xm = class extends _.Component {
    rendered = !1;
    shouldComponentUpdate(e) {
      return !xE(e, this.props);
    }
    componentDidUpdate() {
      this.emitChange();
    }
    componentWillUnmount() {
      const { helmetInstances: e } = this.props.context;
      (e.remove(this), this.emitChange());
    }
    emitChange() {
      const { helmetInstances: e, setHelmet: t } = this.props.context;
      let s = null;
      const i = kE(
        e.get().map((a) => {
          const u = { ...a.props };
          return (delete u.context, u);
        })
      );
      (iv.canUseDOM ? OE(i) : yc && (s = yc(i)), t(s));
    }
    init() {
      if (this.rendered) return;
      this.rendered = !0;
      const { helmetInstances: e } = this.props.context;
      (e.add(this), this.emitChange());
    }
    render() {
      return (this.init(), null);
    }
  },
  ds = class extends _.Component {
    static defaultProps = { defer: !0, encodeSpecialCharacters: !0, prioritizeSeoTags: !1 };
    shouldComponentUpdate(e) {
      return !hE(ym(this.props, "helmetData"), ym(e, "helmetData"));
    }
    mapNestedChildrenToProps(e, t) {
      if (!t) return null;
      switch (e.type) {
        case "script":
        case "noscript":
          return { innerHTML: t };
        case "style":
          return { cssText: t };
        default:
          throw new Error(
            `<${e.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
          );
      }
    }
    flattenArrayTypeChildren(e, t, s, i) {
      return {
        ...t,
        [e.type]: [...(t[e.type] || []), { ...s, ...this.mapNestedChildrenToProps(e, i) }],
      };
    }
    mapObjectTypeChildren(e, t, s, i) {
      switch (e.type) {
        case "title":
          return { ...t, [e.type]: i, titleAttributes: { ...s } };
        case "body":
          return { ...t, bodyAttributes: { ...s } };
        case "html":
          return { ...t, htmlAttributes: { ...s } };
        default:
          return { ...t, [e.type]: { ...s } };
      }
    }
    mapArrayTypeChildrenToProps(e, t) {
      let s = { ...t };
      return (
        Object.keys(e).forEach((i) => {
          s = { ...s, [i]: e[i] };
        }),
        s
      );
    }
    warnOnInvalidChildren(e, t) {
      return (
        hm(
          gm.some((s) => e.type === s),
          typeof e.type == "function"
            ? "You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information."
            : `Only elements types ${gm.join(", ")} are allowed. Helmet does not support rendering <${e.type}> elements. Refer to our API for more information.`
        ),
        hm(
          !t || typeof t == "string" || (Array.isArray(t) && !t.some((s) => typeof s != "string")),
          `Helmet expects a string as a child of <${e.type}>. Did you forget to wrap your children in braces? ( <${e.type}>{\`\`}</${e.type}> ) Refer to our API for more information.`
        ),
        !0
      );
    }
    mapChildrenToProps(e, t) {
      let s = {};
      return (
        dn.Children.forEach(e, (i) => {
          if (!i || !i.props) return;
          const { children: a, ...u } = i.props,
            c = Object.keys(u).reduce((p, g) => ((p[wE[g] || g] = u[g]), p), {});
          let { type: f } = i;
          switch (
            (typeof f == "symbol" ? (f = f.toString()) : this.warnOnInvalidChildren(i, a), f)
          ) {
            case "Symbol(react.fragment)":
              t = this.mapChildrenToProps(a, t);
              break;
            case "link":
            case "meta":
            case "noscript":
            case "script":
            case "style":
              s = this.flattenArrayTypeChildren(i, s, c, a);
              break;
            default:
              t = this.mapObjectTypeChildren(i, t, c, a);
              break;
          }
        }),
        this.mapArrayTypeChildrenToProps(s, t)
      );
    }
    render() {
      const { children: e, ...t } = this.props;
      let s = { ...t },
        { helmetData: i } = t;
      if ((e && (s = this.mapChildrenToProps(e, s)), i && !(i instanceof vc))) {
        const a = i;
        ((i = new vc(a.context, !0)), delete s.helmetData);
      }
      return i
        ? dn.createElement(xm, { ...s, context: i.value })
        : dn.createElement(sv.Consumer, null, (a) => dn.createElement(xm, { ...s, context: a }));
    }
  };
const FE = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  VE = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, s, i) => (i ? i.toUpperCase() : s.toLowerCase())),
  wm = (e) => {
    const t = VE(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  av = (...e) =>
    e
      .filter((t, s, i) => !!t && t.trim() !== "" && i.indexOf(t) === s)
      .join(" ")
      .trim(),
  BE = (e) => {
    for (const t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
  };
var $E = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const UE = _.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: s = 2,
      absoluteStrokeWidth: i,
      className: a = "",
      children: u,
      iconNode: c,
      ...f
    },
    p
  ) =>
    _.createElement(
      "svg",
      {
        ref: p,
        ...$E,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: i ? (Number(s) * 24) / Number(t) : s,
        className: av("lucide", a),
        ...(!u && !BE(f) && { "aria-hidden": "true" }),
        ...f,
      },
      [...c.map(([g, y]) => _.createElement(g, y)), ...(Array.isArray(u) ? u : [u])]
    )
);
const en = (e, t) => {
  const s = _.forwardRef(({ className: i, ...a }, u) =>
    _.createElement(UE, {
      ref: u,
      iconNode: t,
      className: av(`lucide-${FE(wm(e))}`, `lucide-${e}`, i),
      ...a,
    })
  );
  return ((s.displayName = wm(e)), s);
};
const zE = [
    ["path", { d: "M12 18V5", key: "adv99a" }],
    ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
    ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
    ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
    ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
    ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
    ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
    ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }],
  ],
  Sm = en("brain", zE);
const HE = [
    ["path", { d: "M15.6 2.7a10 10 0 1 0 5.7 5.7", key: "1e0p6d" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["path", { d: "M13.4 10.6 19 5", key: "1kr7tw" }],
  ],
  Em = en("circle-gauge", HE);
const WE = [
    [
      "path",
      {
        d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
        key: "c7niix",
      },
    ],
  ],
  _m = en("droplet", WE);
const GE = [
    ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
    ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }],
  ],
  Tm = en("gauge", GE);
const KE = [
    ["path", { d: "M6 3h12", key: "ggurg9" }],
    ["path", { d: "M6 8h12", key: "6g4wlu" }],
    ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
    ["path", { d: "M6 13h3", key: "wdp6ag" }],
    ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }],
  ],
  Cm = en("indian-rupee", KE);
const YE = [
    ["path", { d: "M4 5h16", key: "1tepv9" }],
    ["path", { d: "M4 12h16", key: "1lakjw" }],
    ["path", { d: "M4 19h16", key: "1djgab" }],
  ],
  XE = en("menu", YE);
const qE = [
    ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
    ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
    ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }],
  ],
  Hu = en("percent", qE);
const QE = [
    [
      "path",
      {
        d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        key: "q3az6g",
      },
    ],
    ["path", { d: "M8 7h8", key: "i86dvs" }],
    ["path", { d: "M12 17.5 8 15h1a4 4 0 0 0 0-8", key: "grpkl4" }],
    ["path", { d: "M8 11h8", key: "vwpz6n" }],
  ],
  km = en("receipt-indian-rupee", QE);
const JE = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
  ],
  bm = en("user", JE);
const ZE = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  e_ = en("x", ZE);
function t_() {
  const [e, t] = _.useState(!1);
  return h.jsx(h.Fragment, {
    children: h.jsxs("header", {
      className: "bg-white shadow sticky top-0 z-50",
      children: [
        h.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 py-3 flex justify-between items-center",
          children: [
            h.jsx(mt, {
              to: "/",
              className: "text-xl font-bold text-blue-600",
              children: h.jsx("img", {
                src: "./images/free-tools-logo.jpg",
                className: "h-14",
                title: "Free Tools - Tools Built for Everyday Life",
              }),
            }),
            h.jsx("button", {
              onClick: () => t(!e),
              className: "md:hidden p-2 rounded-lg hover:bg-gray-100",
              "aria-label": "Toggle Menu",
              children: e
                ? h.jsx(e_, { className: "w-6 h-6" })
                : h.jsx(XE, { className: "w-6 h-6" }),
            }),
            h.jsxs("nav", {
              className: "hidden md:flex gap-6 text-sm font-medium desktopNav",
              children: [
                h.jsx(s, {
                  className: "userIcon",
                  to: "/age-calculator",
                  icon: h.jsx(bm, {}),
                  label: "Age",
                  title: "Age Calculator – Calculate your exact age instantly",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/bmi-calculator",
                  icon: h.jsx(Tm, {}),
                  label: "BMI",
                  title: "BMI Calculator – Check Body Mass Index online",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/calorie-calculator",
                  icon: h.jsx(_m, {}),
                  label: "Calories",
                  title: "Calorie Calculator – Daily calorie needs",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/sip-calculator",
                  icon: h.jsx(Sm, {}),
                  label: "SIP",
                  title: "SIP Calculator – Mutual fund investment returns",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/emi-calculator",
                  icon: h.jsx(Hu, {}),
                  label: "EMI",
                  title: "EMI Calculator – Loan EMI calculation",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/salary-calculator",
                  icon: h.jsx(Cm, {}),
                  label: "Salary",
                  title: "Salary Calculator – In-hand salary from CTC",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/gst-calculator",
                  icon: h.jsx(km, {}),
                  label: "GST",
                  title: "GST Calculator – Goods and Services Tax",
                }),
                h.jsx(s, {
                  className: "userIcon",
                  to: "/speed-test",
                  icon: h.jsx(Em, {}),
                  label: "Speed Test",
                  title: "Internet Speed Test – Check download & upload speed",
                }),
              ],
            }),
          ],
        }),
        e &&
          h.jsx("nav", {
            className: "md:hidden border-t bg-white",
            children: h.jsxs("div", {
              className: "flex flex-col px-4 py-3 space-y-3 mobNav",
              children: [
                h.jsx(i, {
                  className: "userIcon",
                  to: "/age-calculator",
                  icon: h.jsx(bm, {}),
                  label: "Age Calculator",
                  setOpen: t,
                  title: "Age Calculator – Find exact age",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/bmi-calculator",
                  icon: h.jsx(Tm, {}),
                  label: "BMI Calculator",
                  setOpen: t,
                  title: "BMI Calculator – Check Body Mass Index online",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/calorie-calculator",
                  icon: h.jsx(_m, {}),
                  label: "Calorie Calculator",
                  setOpen: t,
                  title: "Calorie Calculator – Daily calorie needs",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/sip-calculator",
                  icon: h.jsx(Sm, {}),
                  label: "SIP Calculator",
                  setOpen: t,
                  title: "SIP Calculator – Mutual fund investment returns",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/emi-calculator",
                  icon: h.jsx(Hu, {}),
                  label: "EMI Calculator",
                  setOpen: t,
                  title: "EMI Calculator – Loan EMI calculation",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/salary-calculator",
                  icon: h.jsx(Cm, {}),
                  label: "Salary Calculator",
                  setOpen: t,
                  title: "Salary Calculator – In-hand salary from CTC",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/metataggenerator",
                  icon: h.jsx(Hu, {}),
                  label: "Meta Tag",
                  setOpen: t,
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/gst-calculator",
                  icon: h.jsx(km, {}),
                  label: "GST",
                  setOpen: t,
                  title: "GST Calculator – Goods and Services Tax",
                }),
                h.jsx(i, {
                  className: "userIcon",
                  to: "/speed-test",
                  icon: h.jsx(Em, {}),
                  label: "Speed Test",
                  setOpen: t,
                  title: "Internet Speed Test – Check download & upload speed",
                }),
              ],
            }),
          }),
      ],
    }),
  });
  function s({ to: a, icon: u, label: c, title: f = "" }) {
    return h.jsxs(mt, {
      to: a,
      title: f,
      className: ({ isActive: p }) => `flex items-center gap-1 transition font-medium
          ${p ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}`,
      children: [u, h.jsx("span", { children: c })],
    });
  }
  function i({ to: a, icon: u, label: c, title: f = "", setOpen: p }) {
    return h.jsxs(mt, {
      to: a,
      title: f,
      onClick: () => p(!1),
      className: ({ isActive: g }) => `flex items-center gap-2 p-3 rounded-lg transition
            ${g ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}`,
      children: [u, h.jsx("span", { className: "text-sm font-medium", children: c })],
    });
  }
}
function n_() {
  return h.jsxs("footer", {
    className: "border-t border-gray-300 py-8 text-center",
    children: [
      h.jsxs("nav", {
        className: "flex justify-center gap-6 mb-4",
        children: [
          h.jsx(mt, { to: "/About", children: "About" }),
          " |",
          h.jsx(mt, { to: "/privacy-policy", children: "Privacy Policy" }),
        ],
      }),
      h.jsxs("p", {
        className: "text-sm text-gray-500",
        children: ["© ", new Date().getFullYear(), " FreeToolsPro. All rights reserved."],
      }),
    ],
  });
}
const lv = _.createContext({});
function r_(e) {
  const t = _.useRef(null);
  return (t.current === null && (t.current = e()), t.current);
}
const ud = typeof window < "u",
  s_ = ud ? _.useLayoutEffect : _.useEffect,
  cd = _.createContext(null);
function dd(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function fd(e, t) {
  const s = e.indexOf(t);
  s > -1 && e.splice(s, 1);
}
const gn = (e, t, s) => (s > t ? t : s < e ? e : s);
let pd = () => {};
const yn = {},
  uv = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function cv(e) {
  return typeof e == "object" && e !== null;
}
const dv = (e) => /^0[^.\s]+$/u.test(e);
function hd(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const It = (e) => e,
  i_ = (e, t) => (s) => t(e(s)),
  Ri = (...e) => e.reduce(i_),
  xi = (e, t, s) => {
    const i = t - e;
    return i === 0 ? 1 : (s - e) / i;
  };
class md {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return (dd(this.subscriptions, t), () => fd(this.subscriptions, t));
  }
  notify(t, s, i) {
    const a = this.subscriptions.length;
    if (a)
      if (a === 1) this.subscriptions[0](t, s, i);
      else
        for (let u = 0; u < a; u++) {
          const c = this.subscriptions[u];
          c && c(t, s, i);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Jt = (e) => e * 1e3,
  Rt = (e) => e / 1e3;
function fv(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const pv = (e, t, s) => (((1 - 3 * s + 3 * t) * e + (3 * s - 6 * t)) * e + 3 * t) * e,
  o_ = 1e-7,
  a_ = 12;
function l_(e, t, s, i, a) {
  let u,
    c,
    f = 0;
  do ((c = t + (s - t) / 2), (u = pv(c, i, a) - e), u > 0 ? (s = c) : (t = c));
  while (Math.abs(u) > o_ && ++f < a_);
  return c;
}
function Ii(e, t, s, i) {
  if (e === t && s === i) return It;
  const a = (u) => l_(u, 0, 1, e, s);
  return (u) => (u === 0 || u === 1 ? u : pv(a(u), t, i));
}
const hv = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2),
  mv = (e) => (t) => 1 - e(1 - t),
  gv = Ii(0.33, 1.53, 0.69, 0.99),
  gd = mv(gv),
  yv = hv(gd),
  vv = (e) => ((e *= 2) < 1 ? 0.5 * gd(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1)))),
  yd = (e) => 1 - Math.sin(Math.acos(e)),
  xv = mv(yd),
  wv = hv(yd),
  u_ = Ii(0.42, 0, 1, 1),
  c_ = Ii(0, 0, 0.58, 1),
  Sv = Ii(0.42, 0, 0.58, 1),
  d_ = (e) => Array.isArray(e) && typeof e[0] != "number",
  Ev = (e) => Array.isArray(e) && typeof e[0] == "number",
  f_ = {
    linear: It,
    easeIn: u_,
    easeInOut: Sv,
    easeOut: c_,
    circIn: yd,
    circInOut: wv,
    circOut: xv,
    backIn: gd,
    backInOut: yv,
    backOut: gv,
    anticipate: vv,
  },
  p_ = (e) => typeof e == "string",
  Nm = (e) => {
    if (Ev(e)) {
      pd(e.length === 4);
      const [t, s, i, a] = e;
      return Ii(t, s, i, a);
    } else if (p_(e)) return f_[e];
    return e;
  },
  Zo = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ];
function h_(e, t) {
  let s = new Set(),
    i = new Set(),
    a = !1,
    u = !1;
  const c = new WeakSet();
  let f = { delta: 0, timestamp: 0, isProcessing: !1 };
  function p(y) {
    (c.has(y) && (g.schedule(y), e()), y(f));
  }
  const g = {
    schedule: (y, v = !1, w = !1) => {
      const b = w && a ? s : i;
      return (v && c.add(y), b.has(y) || b.add(y), y);
    },
    cancel: (y) => {
      (i.delete(y), c.delete(y));
    },
    process: (y) => {
      if (((f = y), a)) {
        u = !0;
        return;
      }
      ((a = !0),
        ([s, i] = [i, s]),
        s.forEach(p),
        s.clear(),
        (a = !1),
        u && ((u = !1), g.process(y)));
    },
  };
  return g;
}
const m_ = 40;
function _v(e, t) {
  let s = !1,
    i = !0;
  const a = { delta: 0, timestamp: 0, isProcessing: !1 },
    u = () => (s = !0),
    c = Zo.reduce((M, $) => ((M[$] = h_(u)), M), {}),
    {
      setup: f,
      read: p,
      resolveKeyframes: g,
      preUpdate: y,
      update: v,
      preRender: w,
      render: E,
      postRender: b,
    } = c,
    A = () => {
      const M = yn.useManualTiming ? a.timestamp : performance.now();
      ((s = !1),
        yn.useManualTiming || (a.delta = i ? 1e3 / 60 : Math.max(Math.min(M - a.timestamp, m_), 1)),
        (a.timestamp = M),
        (a.isProcessing = !0),
        f.process(a),
        p.process(a),
        g.process(a),
        y.process(a),
        v.process(a),
        w.process(a),
        E.process(a),
        b.process(a),
        (a.isProcessing = !1),
        s && t && ((i = !1), e(A)));
    },
    k = () => {
      ((s = !0), (i = !0), a.isProcessing || e(A));
    };
  return {
    schedule: Zo.reduce((M, $) => {
      const z = c[$];
      return ((M[$] = (J, te = !1, Q = !1) => (s || k(), z.schedule(J, te, Q))), M);
    }, {}),
    cancel: (M) => {
      for (let $ = 0; $ < Zo.length; $++) c[Zo[$]].cancel(M);
    },
    state: a,
    steps: c,
  };
}
const {
  schedule: ke,
  cancel: Un,
  state: Ke,
  steps: Wu,
} = _v(typeof requestAnimationFrame < "u" ? requestAnimationFrame : It, !0);
let la;
function g_() {
  la = void 0;
}
const ht = {
    now: () => (
      la === void 0 &&
        ht.set(Ke.isProcessing || yn.useManualTiming ? Ke.timestamp : performance.now()),
      la
    ),
    set: (e) => {
      ((la = e), queueMicrotask(g_));
    },
  },
  Tv = (e) => (t) => typeof t == "string" && t.startsWith(e),
  Cv = Tv("--"),
  y_ = Tv("var(--"),
  vd = (e) => (y_(e) ? v_.test(e.split("/*")[0].trim()) : !1),
  v_ = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
  fs = { test: (e) => typeof e == "number", parse: parseFloat, transform: (e) => e },
  wi = { ...fs, transform: (e) => gn(0, 1, e) },
  ea = { ...fs, default: 1 },
  hi = (e) => Math.round(e * 1e5) / 1e5,
  xd = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function x_(e) {
  return e == null;
}
const w_ =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  wd = (e, t) => (s) =>
    !!(
      (typeof s == "string" && w_.test(s) && s.startsWith(e)) ||
      (t && !x_(s) && Object.prototype.hasOwnProperty.call(s, t))
    ),
  kv = (e, t, s) => (i) => {
    if (typeof i != "string") return i;
    const [a, u, c, f] = i.match(xd);
    return {
      [e]: parseFloat(a),
      [t]: parseFloat(u),
      [s]: parseFloat(c),
      alpha: f !== void 0 ? parseFloat(f) : 1,
    };
  },
  S_ = (e) => gn(0, 255, e),
  Gu = { ...fs, transform: (e) => Math.round(S_(e)) },
  fr = {
    test: wd("rgb", "red"),
    parse: kv("red", "green", "blue"),
    transform: ({ red: e, green: t, blue: s, alpha: i = 1 }) =>
      "rgba(" +
      Gu.transform(e) +
      ", " +
      Gu.transform(t) +
      ", " +
      Gu.transform(s) +
      ", " +
      hi(wi.transform(i)) +
      ")",
  };
function E_(e) {
  let t = "",
    s = "",
    i = "",
    a = "";
  return (
    e.length > 5
      ? ((t = e.substring(1, 3)),
        (s = e.substring(3, 5)),
        (i = e.substring(5, 7)),
        (a = e.substring(7, 9)))
      : ((t = e.substring(1, 2)),
        (s = e.substring(2, 3)),
        (i = e.substring(3, 4)),
        (a = e.substring(4, 5)),
        (t += t),
        (s += s),
        (i += i),
        (a += a)),
    {
      red: parseInt(t, 16),
      green: parseInt(s, 16),
      blue: parseInt(i, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1,
    }
  );
}
const wc = { test: wd("#"), parse: E_, transform: fr.transform },
  Ai = (e) => ({
    test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
    parse: parseFloat,
    transform: (t) => `${t}${e}`,
  }),
  $n = Ai("deg"),
  Zt = Ai("%"),
  ne = Ai("px"),
  __ = Ai("vh"),
  T_ = Ai("vw"),
  jm = { ...Zt, parse: (e) => Zt.parse(e) / 100, transform: (e) => Zt.transform(e * 100) },
  Xr = {
    test: wd("hsl", "hue"),
    parse: kv("hue", "saturation", "lightness"),
    transform: ({ hue: e, saturation: t, lightness: s, alpha: i = 1 }) =>
      "hsla(" +
      Math.round(e) +
      ", " +
      Zt.transform(hi(t)) +
      ", " +
      Zt.transform(hi(s)) +
      ", " +
      hi(wi.transform(i)) +
      ")",
  },
  Oe = {
    test: (e) => fr.test(e) || wc.test(e) || Xr.test(e),
    parse: (e) => (fr.test(e) ? fr.parse(e) : Xr.test(e) ? Xr.parse(e) : wc.parse(e)),
    transform: (e) =>
      typeof e == "string" ? e : e.hasOwnProperty("red") ? fr.transform(e) : Xr.transform(e),
    getAnimatableNone: (e) => {
      const t = Oe.parse(e);
      return ((t.alpha = 0), Oe.transform(t));
    },
  },
  C_ =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function k_(e) {
  return (
    isNaN(e) && typeof e == "string" && (e.match(xd)?.length || 0) + (e.match(C_)?.length || 0) > 0
  );
}
const bv = "number",
  Nv = "color",
  b_ = "var",
  N_ = "var(",
  Pm = "${}",
  j_ =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Si(e) {
  const t = e.toString(),
    s = [],
    i = { color: [], number: [], var: [] },
    a = [];
  let u = 0;
  const f = t
    .replace(
      j_,
      (p) => (
        Oe.test(p)
          ? (i.color.push(u), a.push(Nv), s.push(Oe.parse(p)))
          : p.startsWith(N_)
            ? (i.var.push(u), a.push(b_), s.push(p))
            : (i.number.push(u), a.push(bv), s.push(parseFloat(p))),
        ++u,
        Pm
      )
    )
    .split(Pm);
  return { values: s, split: f, indexes: i, types: a };
}
function jv(e) {
  return Si(e).values;
}
function Pv(e) {
  const { split: t, types: s } = Si(e),
    i = t.length;
  return (a) => {
    let u = "";
    for (let c = 0; c < i; c++)
      if (((u += t[c]), a[c] !== void 0)) {
        const f = s[c];
        f === bv ? (u += hi(a[c])) : f === Nv ? (u += Oe.transform(a[c])) : (u += a[c]);
      }
    return u;
  };
}
const P_ = (e) => (typeof e == "number" ? 0 : Oe.test(e) ? Oe.getAnimatableNone(e) : e);
function R_(e) {
  const t = jv(e);
  return Pv(e)(t.map(P_));
}
const zn = { test: k_, parse: jv, createTransformer: Pv, getAnimatableNone: R_ };
function Ku(e, t, s) {
  return (
    s < 0 && (s += 1),
    s > 1 && (s -= 1),
    s < 1 / 6 ? e + (t - e) * 6 * s : s < 1 / 2 ? t : s < 2 / 3 ? e + (t - e) * (2 / 3 - s) * 6 : e
  );
}
function I_({ hue: e, saturation: t, lightness: s, alpha: i }) {
  ((e /= 360), (t /= 100), (s /= 100));
  let a = 0,
    u = 0,
    c = 0;
  if (!t) a = u = c = s;
  else {
    const f = s < 0.5 ? s * (1 + t) : s + t - s * t,
      p = 2 * s - f;
    ((a = Ku(p, f, e + 1 / 3)), (u = Ku(p, f, e)), (c = Ku(p, f, e - 1 / 3)));
  }
  return {
    red: Math.round(a * 255),
    green: Math.round(u * 255),
    blue: Math.round(c * 255),
    alpha: i,
  };
}
function va(e, t) {
  return (s) => (s > 0 ? t : e);
}
const je = (e, t, s) => e + (t - e) * s,
  Yu = (e, t, s) => {
    const i = e * e,
      a = s * (t * t - i) + i;
    return a < 0 ? 0 : Math.sqrt(a);
  },
  A_ = [wc, fr, Xr],
  M_ = (e) => A_.find((t) => t.test(e));
function Rm(e) {
  const t = M_(e);
  if (!t) return !1;
  let s = t.parse(e);
  return (t === Xr && (s = I_(s)), s);
}
const Im = (e, t) => {
    const s = Rm(e),
      i = Rm(t);
    if (!s || !i) return va(e, t);
    const a = { ...s };
    return (u) => (
      (a.red = Yu(s.red, i.red, u)),
      (a.green = Yu(s.green, i.green, u)),
      (a.blue = Yu(s.blue, i.blue, u)),
      (a.alpha = je(s.alpha, i.alpha, u)),
      fr.transform(a)
    );
  },
  Sc = new Set(["none", "hidden"]);
function D_(e, t) {
  return Sc.has(e) ? (s) => (s <= 0 ? e : t) : (s) => (s >= 1 ? t : e);
}
function L_(e, t) {
  return (s) => je(e, t, s);
}
function Sd(e) {
  return typeof e == "number"
    ? L_
    : typeof e == "string"
      ? vd(e)
        ? va
        : Oe.test(e)
          ? Im
          : V_
      : Array.isArray(e)
        ? Rv
        : typeof e == "object"
          ? Oe.test(e)
            ? Im
            : O_
          : va;
}
function Rv(e, t) {
  const s = [...e],
    i = s.length,
    a = e.map((u, c) => Sd(u)(u, t[c]));
  return (u) => {
    for (let c = 0; c < i; c++) s[c] = a[c](u);
    return s;
  };
}
function O_(e, t) {
  const s = { ...e, ...t },
    i = {};
  for (const a in s) e[a] !== void 0 && t[a] !== void 0 && (i[a] = Sd(e[a])(e[a], t[a]));
  return (a) => {
    for (const u in i) s[u] = i[u](a);
    return s;
  };
}
function F_(e, t) {
  const s = [],
    i = { color: 0, var: 0, number: 0 };
  for (let a = 0; a < t.values.length; a++) {
    const u = t.types[a],
      c = e.indexes[u][i[u]],
      f = e.values[c] ?? 0;
    ((s[a] = f), i[u]++);
  }
  return s;
}
const V_ = (e, t) => {
  const s = zn.createTransformer(t),
    i = Si(e),
    a = Si(t);
  return i.indexes.var.length === a.indexes.var.length &&
    i.indexes.color.length === a.indexes.color.length &&
    i.indexes.number.length >= a.indexes.number.length
    ? (Sc.has(e) && !a.values.length) || (Sc.has(t) && !i.values.length)
      ? D_(e, t)
      : Ri(Rv(F_(i, a), a.values), s)
    : va(e, t);
};
function Iv(e, t, s) {
  return typeof e == "number" && typeof t == "number" && typeof s == "number"
    ? je(e, t, s)
    : Sd(e)(e, t);
}
const B_ = (e) => {
    const t = ({ timestamp: s }) => e(s);
    return {
      start: (s = !0) => ke.update(t, s),
      stop: () => Un(t),
      now: () => (Ke.isProcessing ? Ke.timestamp : ht.now()),
    };
  },
  Av = (e, t, s = 10) => {
    let i = "";
    const a = Math.max(Math.round(t / s), 2);
    for (let u = 0; u < a; u++) i += Math.round(e(u / (a - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${i.substring(0, i.length - 2)})`;
  },
  xa = 2e4;
function Ed(e) {
  let t = 0;
  const s = 50;
  let i = e.next(t);
  for (; !i.done && t < xa;) ((t += s), (i = e.next(t)));
  return t >= xa ? 1 / 0 : t;
}
function $_(e, t = 100, s) {
  const i = s({ ...e, keyframes: [0, t] }),
    a = Math.min(Ed(i), xa);
  return { type: "keyframes", ease: (u) => i.next(a * u).value / t, duration: Rt(a) };
}
const U_ = 5;
function Mv(e, t, s) {
  const i = Math.max(t - U_, 0);
  return fv(s - e(i), t - i);
}
const Ie = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  Xu = 0.001;
function z_({
  duration: e = Ie.duration,
  bounce: t = Ie.bounce,
  velocity: s = Ie.velocity,
  mass: i = Ie.mass,
}) {
  let a,
    u,
    c = 1 - t;
  ((c = gn(Ie.minDamping, Ie.maxDamping, c)),
    (e = gn(Ie.minDuration, Ie.maxDuration, Rt(e))),
    c < 1
      ? ((a = (g) => {
          const y = g * c,
            v = y * e,
            w = y - s,
            E = Ec(g, c),
            b = Math.exp(-v);
          return Xu - (w / E) * b;
        }),
        (u = (g) => {
          const v = g * c * e,
            w = v * s + s,
            E = Math.pow(c, 2) * Math.pow(g, 2) * e,
            b = Math.exp(-v),
            A = Ec(Math.pow(g, 2), c);
          return ((-a(g) + Xu > 0 ? -1 : 1) * ((w - E) * b)) / A;
        }))
      : ((a = (g) => {
          const y = Math.exp(-g * e),
            v = (g - s) * e + 1;
          return -Xu + y * v;
        }),
        (u = (g) => {
          const y = Math.exp(-g * e),
            v = (s - g) * (e * e);
          return y * v;
        })));
  const f = 5 / e,
    p = W_(a, u, f);
  if (((e = Jt(e)), isNaN(p))) return { stiffness: Ie.stiffness, damping: Ie.damping, duration: e };
  {
    const g = Math.pow(p, 2) * i;
    return { stiffness: g, damping: c * 2 * Math.sqrt(i * g), duration: e };
  }
}
const H_ = 12;
function W_(e, t, s) {
  let i = s;
  for (let a = 1; a < H_; a++) i = i - e(i) / t(i);
  return i;
}
function Ec(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const G_ = ["duration", "bounce"],
  K_ = ["stiffness", "damping", "mass"];
function Am(e, t) {
  return t.some((s) => e[s] !== void 0);
}
function Y_(e) {
  let t = {
    velocity: Ie.velocity,
    stiffness: Ie.stiffness,
    damping: Ie.damping,
    mass: Ie.mass,
    isResolvedFromDuration: !1,
    ...e,
  };
  if (!Am(e, K_) && Am(e, G_))
    if (e.visualDuration) {
      const s = e.visualDuration,
        i = (2 * Math.PI) / (s * 1.2),
        a = i * i,
        u = 2 * gn(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(a);
      t = { ...t, mass: Ie.mass, stiffness: a, damping: u };
    } else {
      const s = z_(e);
      ((t = { ...t, ...s, mass: Ie.mass }), (t.isResolvedFromDuration = !0));
    }
  return t;
}
function wa(e = Ie.visualDuration, t = Ie.bounce) {
  const s = typeof e != "object" ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e;
  let { restSpeed: i, restDelta: a } = s;
  const u = s.keyframes[0],
    c = s.keyframes[s.keyframes.length - 1],
    f = { done: !1, value: u },
    {
      stiffness: p,
      damping: g,
      mass: y,
      duration: v,
      velocity: w,
      isResolvedFromDuration: E,
    } = Y_({ ...s, velocity: -Rt(s.velocity || 0) }),
    b = w || 0,
    A = g / (2 * Math.sqrt(p * y)),
    k = c - u,
    R = Rt(Math.sqrt(p / y)),
    D = Math.abs(k) < 5;
  (i || (i = D ? Ie.restSpeed.granular : Ie.restSpeed.default),
    a || (a = D ? Ie.restDelta.granular : Ie.restDelta.default));
  let M;
  if (A < 1) {
    const z = Ec(R, A);
    M = (J) => {
      const te = Math.exp(-A * R * J);
      return c - te * (((b + A * R * k) / z) * Math.sin(z * J) + k * Math.cos(z * J));
    };
  } else if (A === 1) M = (z) => c - Math.exp(-R * z) * (k + (b + R * k) * z);
  else {
    const z = R * Math.sqrt(A * A - 1);
    M = (J) => {
      const te = Math.exp(-A * R * J),
        Q = Math.min(z * J, 300);
      return c - (te * ((b + A * R * k) * Math.sinh(Q) + z * k * Math.cosh(Q))) / z;
    };
  }
  const $ = {
    calculatedDuration: (E && v) || null,
    next: (z) => {
      const J = M(z);
      if (E) f.done = z >= v;
      else {
        let te = z === 0 ? b : 0;
        A < 1 && (te = z === 0 ? Jt(b) : Mv(M, z, J));
        const Q = Math.abs(te) <= i,
          fe = Math.abs(c - J) <= a;
        f.done = Q && fe;
      }
      return ((f.value = f.done ? c : J), f);
    },
    toString: () => {
      const z = Math.min(Ed($), xa),
        J = Av((te) => $.next(z * te).value, z, 30);
      return z + "ms " + J;
    },
    toTransition: () => {},
  };
  return $;
}
wa.applyToOptions = (e) => {
  const t = $_(e, 100, wa);
  return ((e.ease = t.ease), (e.duration = Jt(t.duration)), (e.type = "keyframes"), e);
};
function _c({
  keyframes: e,
  velocity: t = 0,
  power: s = 0.8,
  timeConstant: i = 325,
  bounceDamping: a = 10,
  bounceStiffness: u = 500,
  modifyTarget: c,
  min: f,
  max: p,
  restDelta: g = 0.5,
  restSpeed: y,
}) {
  const v = e[0],
    w = { done: !1, value: v },
    E = (Q) => (f !== void 0 && Q < f) || (p !== void 0 && Q > p),
    b = (Q) => (f === void 0 ? p : p === void 0 || Math.abs(f - Q) < Math.abs(p - Q) ? f : p);
  let A = s * t;
  const k = v + A,
    R = c === void 0 ? k : c(k);
  R !== k && (A = R - v);
  const D = (Q) => -A * Math.exp(-Q / i),
    M = (Q) => R + D(Q),
    $ = (Q) => {
      const fe = D(Q),
        ce = M(Q);
      ((w.done = Math.abs(fe) <= g), (w.value = w.done ? R : ce));
    };
  let z, J;
  const te = (Q) => {
    E(w.value) &&
      ((z = Q),
      (J = wa({
        keyframes: [w.value, b(w.value)],
        velocity: Mv(M, Q, w.value),
        damping: a,
        stiffness: u,
        restDelta: g,
        restSpeed: y,
      })));
  };
  return (
    te(0),
    {
      calculatedDuration: null,
      next: (Q) => {
        let fe = !1;
        return (
          !J && z === void 0 && ((fe = !0), $(Q), te(Q)),
          z !== void 0 && Q >= z ? J.next(Q - z) : (!fe && $(Q), w)
        );
      },
    }
  );
}
function X_(e, t, s) {
  const i = [],
    a = s || yn.mix || Iv,
    u = e.length - 1;
  for (let c = 0; c < u; c++) {
    let f = a(e[c], e[c + 1]);
    if (t) {
      const p = Array.isArray(t) ? t[c] || It : t;
      f = Ri(p, f);
    }
    i.push(f);
  }
  return i;
}
function q_(e, t, { clamp: s = !0, ease: i, mixer: a } = {}) {
  const u = e.length;
  if ((pd(u === t.length), u === 1)) return () => t[0];
  if (u === 2 && t[0] === t[1]) return () => t[1];
  const c = e[0] === e[1];
  e[0] > e[u - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
  const f = X_(t, i, a),
    p = f.length,
    g = (y) => {
      if (c && y < e[0]) return t[0];
      let v = 0;
      if (p > 1) for (; v < e.length - 2 && !(y < e[v + 1]); v++);
      const w = xi(e[v], e[v + 1], y);
      return f[v](w);
    };
  return s ? (y) => g(gn(e[0], e[u - 1], y)) : g;
}
function Q_(e, t) {
  const s = e[e.length - 1];
  for (let i = 1; i <= t; i++) {
    const a = xi(0, t, i);
    e.push(je(s, 1, a));
  }
}
function J_(e) {
  const t = [0];
  return (Q_(t, e.length - 1), t);
}
function Z_(e, t) {
  return e.map((s) => s * t);
}
function eT(e, t) {
  return e.map(() => t || Sv).splice(0, e.length - 1);
}
function mi({ duration: e = 300, keyframes: t, times: s, ease: i = "easeInOut" }) {
  const a = d_(i) ? i.map(Nm) : Nm(i),
    u = { done: !1, value: t[0] },
    c = Z_(s && s.length === t.length ? s : J_(t), e),
    f = q_(c, t, { ease: Array.isArray(a) ? a : eT(t, a) });
  return { calculatedDuration: e, next: (p) => ((u.value = f(p)), (u.done = p >= e), u) };
}
const tT = (e) => e !== null;
function _d(e, { repeat: t, repeatType: s = "loop" }, i, a = 1) {
  const u = e.filter(tT),
    f = a < 0 || (t && s !== "loop" && t % 2 === 1) ? 0 : u.length - 1;
  return !f || i === void 0 ? u[f] : i;
}
const nT = { decay: _c, inertia: _c, tween: mi, keyframes: mi, spring: wa };
function Dv(e) {
  typeof e.type == "string" && (e.type = nT[e.type]);
}
class Td {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((t) => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(t, s) {
    return this.finished.then(t, s);
  }
}
const rT = (e) => e / 100;
class Cd extends Td {
  constructor(t) {
    (super(),
      (this.state = "idle"),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.stop = () => {
        const { motionValue: s } = this.options;
        (s && s.updatedAt !== ht.now() && this.tick(ht.now()),
          (this.isStopped = !0),
          this.state !== "idle" && (this.teardown(), this.options.onStop?.()));
      }),
      (this.options = t),
      this.initAnimation(),
      this.play(),
      t.autoplay === !1 && this.pause());
  }
  initAnimation() {
    const { options: t } = this;
    Dv(t);
    const { type: s = mi, repeat: i = 0, repeatDelay: a = 0, repeatType: u, velocity: c = 0 } = t;
    let { keyframes: f } = t;
    const p = s || mi;
    p !== mi &&
      typeof f[0] != "number" &&
      ((this.mixKeyframes = Ri(rT, Iv(f[0], f[1]))), (f = [0, 100]));
    const g = p({ ...t, keyframes: f });
    (u === "mirror" &&
      (this.mirroredGenerator = p({ ...t, keyframes: [...f].reverse(), velocity: -c })),
      g.calculatedDuration === null && (g.calculatedDuration = Ed(g)));
    const { calculatedDuration: y } = g;
    ((this.calculatedDuration = y),
      (this.resolvedDuration = y + a),
      (this.totalDuration = this.resolvedDuration * (i + 1) - a),
      (this.generator = g));
  }
  updateTime(t) {
    const s = Math.round(t - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? (this.currentTime = this.holdTime) : (this.currentTime = s);
  }
  tick(t, s = !1) {
    const {
      generator: i,
      totalDuration: a,
      mixKeyframes: u,
      mirroredGenerator: c,
      resolvedDuration: f,
      calculatedDuration: p,
    } = this;
    if (this.startTime === null) return i.next(0);
    const {
      delay: g = 0,
      keyframes: y,
      repeat: v,
      repeatType: w,
      repeatDelay: E,
      type: b,
      onUpdate: A,
      finalKeyframe: k,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 && (this.startTime = Math.min(t - a / this.speed, this.startTime)),
      s ? (this.currentTime = t) : this.updateTime(t));
    const R = this.currentTime - g * (this.playbackSpeed >= 0 ? 1 : -1),
      D = this.playbackSpeed >= 0 ? R < 0 : R > a;
    ((this.currentTime = Math.max(R, 0)),
      this.state === "finished" && this.holdTime === null && (this.currentTime = a));
    let M = this.currentTime,
      $ = i;
    if (v) {
      const Q = Math.min(this.currentTime, a) / f;
      let fe = Math.floor(Q),
        ce = Q % 1;
      (!ce && Q >= 1 && (ce = 1),
        ce === 1 && fe--,
        (fe = Math.min(fe, v + 1)),
        fe % 2 &&
          (w === "reverse" ? ((ce = 1 - ce), E && (ce -= E / f)) : w === "mirror" && ($ = c)),
        (M = gn(0, 1, ce) * f));
    }
    const z = D ? { done: !1, value: y[0] } : $.next(M);
    u && (z.value = u(z.value));
    let { done: J } = z;
    !D &&
      p !== null &&
      (J = this.playbackSpeed >= 0 ? this.currentTime >= a : this.currentTime <= 0);
    const te =
      this.holdTime === null && (this.state === "finished" || (this.state === "running" && J));
    return (
      te && b !== _c && (z.value = _d(y, this.options, k, this.speed)),
      A && A(z.value),
      te && this.finish(),
      z
    );
  }
  then(t, s) {
    return this.finished.then(t, s);
  }
  get duration() {
    return Rt(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + Rt(t);
  }
  get time() {
    return Rt(this.currentTime);
  }
  set time(t) {
    ((t = Jt(t)),
      (this.currentTime = t),
      this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0
        ? (this.holdTime = t)
        : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed),
      this.driver?.start(!1));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(ht.now());
    const s = this.playbackSpeed !== t;
    ((this.playbackSpeed = t), s && (this.time = Rt(this.currentTime)));
  }
  play() {
    if (this.isStopped) return;
    const { driver: t = B_, startTime: s } = this.options;
    (this.driver || (this.driver = t((a) => this.tick(a))), this.options.onPlay?.());
    const i = this.driver.now();
    (this.state === "finished"
      ? (this.updateFinished(), (this.startTime = i))
      : this.holdTime !== null
        ? (this.startTime = i - this.holdTime)
        : this.startTime || (this.startTime = s ?? i),
      this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = "running"),
      this.driver.start());
  }
  pause() {
    ((this.state = "paused"), this.updateTime(ht.now()), (this.holdTime = this.currentTime));
  }
  complete() {
    (this.state !== "running" && this.play(), (this.state = "finished"), (this.holdTime = null));
  }
  finish() {
    (this.notifyFinished(),
      this.teardown(),
      (this.state = "finished"),
      this.options.onComplete?.());
  }
  cancel() {
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      this.options.onCancel?.());
  }
  teardown() {
    ((this.state = "idle"), this.stopDriver(), (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(t) {
    return ((this.startTime = 0), this.tick(t, !0));
  }
  attachTimeline(t) {
    return (
      this.options.allowFlatten &&
        ((this.options.type = "keyframes"), (this.options.ease = "linear"), this.initAnimation()),
      this.driver?.stop(),
      t.observe(this)
    );
  }
}
function sT(e) {
  for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
const pr = (e) => (e * 180) / Math.PI,
  Tc = (e) => {
    const t = pr(Math.atan2(e[1], e[0]));
    return Cc(t);
  },
  iT = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
    rotate: Tc,
    rotateZ: Tc,
    skewX: (e) => pr(Math.atan(e[1])),
    skewY: (e) => pr(Math.atan(e[2])),
    skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2,
  },
  Cc = (e) => ((e = e % 360), e < 0 && (e += 360), e),
  Mm = Tc,
  Dm = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]),
  Lm = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]),
  oT = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: Dm,
    scaleY: Lm,
    scale: (e) => (Dm(e) + Lm(e)) / 2,
    rotateX: (e) => Cc(pr(Math.atan2(e[6], e[5]))),
    rotateY: (e) => Cc(pr(Math.atan2(-e[2], e[0]))),
    rotateZ: Mm,
    rotate: Mm,
    skewX: (e) => pr(Math.atan(e[4])),
    skewY: (e) => pr(Math.atan(e[1])),
    skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2,
  };
function kc(e) {
  return e.includes("scale") ? 1 : 0;
}
function bc(e, t) {
  if (!e || e === "none") return kc(t);
  const s = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let i, a;
  if (s) ((i = oT), (a = s));
  else {
    const f = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((i = iT), (a = f));
  }
  if (!a) return kc(t);
  const u = i[t],
    c = a[1].split(",").map(lT);
  return typeof u == "function" ? u(c) : c[u];
}
const aT = (e, t) => {
  const { transform: s = "none" } = getComputedStyle(e);
  return bc(s, t);
};
function lT(e) {
  return parseFloat(e.trim());
}
const ps = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  hs = new Set(ps),
  Om = (e) => e === fs || e === ne,
  uT = new Set(["x", "y", "z"]),
  cT = ps.filter((e) => !uT.has(e));
function dT(e) {
  const t = [];
  return (
    cT.forEach((s) => {
      const i = e.getValue(s);
      i !== void 0 && (t.push([s, i.get()]), i.set(s.startsWith("scale") ? 1 : 0));
    }),
    t
  );
}
const hr = {
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: s = "0" }) =>
    e.max - e.min - parseFloat(t) - parseFloat(s),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: s = "0" }) =>
    e.max - e.min - parseFloat(t) - parseFloat(s),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  x: (e, { transform: t }) => bc(t, "x"),
  y: (e, { transform: t }) => bc(t, "y"),
};
hr.translateX = hr.x;
hr.translateY = hr.y;
const mr = new Set();
let Nc = !1,
  jc = !1,
  Pc = !1;
function Lv() {
  if (jc) {
    const e = Array.from(mr).filter((i) => i.needsMeasurement),
      t = new Set(e.map((i) => i.element)),
      s = new Map();
    (t.forEach((i) => {
      const a = dT(i);
      a.length && (s.set(i, a), i.render());
    }),
      e.forEach((i) => i.measureInitialState()),
      t.forEach((i) => {
        i.render();
        const a = s.get(i);
        a &&
          a.forEach(([u, c]) => {
            i.getValue(u)?.set(c);
          });
      }),
      e.forEach((i) => i.measureEndState()),
      e.forEach((i) => {
        i.suspendedScrollY !== void 0 && window.scrollTo(0, i.suspendedScrollY);
      }));
  }
  ((jc = !1), (Nc = !1), mr.forEach((e) => e.complete(Pc)), mr.clear());
}
function Ov() {
  mr.forEach((e) => {
    (e.readKeyframes(), e.needsMeasurement && (jc = !0));
  });
}
function fT() {
  ((Pc = !0), Ov(), Lv(), (Pc = !1));
}
class kd {
  constructor(t, s, i, a, u, c = !1) {
    ((this.state = "pending"),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = s),
      (this.name = i),
      (this.motionValue = a),
      (this.element = u),
      (this.isAsync = c));
  }
  scheduleResolve() {
    ((this.state = "scheduled"),
      this.isAsync
        ? (mr.add(this), Nc || ((Nc = !0), ke.read(Ov), ke.resolveKeyframes(Lv)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: s, element: i, motionValue: a } = this;
    if (t[0] === null) {
      const u = a?.get(),
        c = t[t.length - 1];
      if (u !== void 0) t[0] = u;
      else if (i && s) {
        const f = i.readValue(s, c);
        f != null && (t[0] = f);
      }
      (t[0] === void 0 && (t[0] = c), a && u === void 0 && a.set(t[0]));
    }
    sT(t);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(t = !1) {
    ((this.state = "complete"),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
      mr.delete(this));
  }
  cancel() {
    this.state === "scheduled" && (mr.delete(this), (this.state = "pending"));
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const pT = (e) => e.startsWith("--");
function hT(e, t, s) {
  pT(t) ? e.style.setProperty(t, s) : (e.style[t] = s);
}
const mT = hd(() => window.ScrollTimeline !== void 0),
  gT = {};
function yT(e, t) {
  const s = hd(e);
  return () => gT[t] ?? s();
}
const Fv = yT(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  fi = ([e, t, s, i]) => `cubic-bezier(${e}, ${t}, ${s}, ${i})`,
  Fm = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: fi([0, 0.65, 0.55, 1]),
    circOut: fi([0.55, 0, 1, 0.45]),
    backIn: fi([0.31, 0.01, 0.66, -0.59]),
    backOut: fi([0.33, 1.53, 0.69, 0.99]),
  };
function Vv(e, t) {
  if (e)
    return typeof e == "function"
      ? Fv()
        ? Av(e, t)
        : "ease-out"
      : Ev(e)
        ? fi(e)
        : Array.isArray(e)
          ? e.map((s) => Vv(s, t) || Fm.easeOut)
          : Fm[e];
}
function vT(
  e,
  t,
  s,
  {
    delay: i = 0,
    duration: a = 300,
    repeat: u = 0,
    repeatType: c = "loop",
    ease: f = "easeOut",
    times: p,
  } = {},
  g = void 0
) {
  const y = { [t]: s };
  p && (y.offset = p);
  const v = Vv(f, a);
  Array.isArray(v) && (y.easing = v);
  const w = {
    delay: i,
    duration: a,
    easing: Array.isArray(v) ? "linear" : v,
    fill: "both",
    iterations: u + 1,
    direction: c === "reverse" ? "alternate" : "normal",
  };
  return (g && (w.pseudoElement = g), e.animate(y, w));
}
function Bv(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function xT({ type: e, ...t }) {
  return Bv(e) && Fv()
    ? e.applyToOptions(t)
    : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class wT extends Td {
  constructor(t) {
    if ((super(), (this.finishedTime = null), (this.isStopped = !1), !t)) return;
    const {
      element: s,
      name: i,
      keyframes: a,
      pseudoElement: u,
      allowFlatten: c = !1,
      finalKeyframe: f,
      onComplete: p,
    } = t;
    ((this.isPseudoElement = !!u),
      (this.allowFlatten = c),
      (this.options = t),
      pd(typeof t.type != "string"));
    const g = xT(t);
    ((this.animation = vT(s, i, a, g, u)),
      g.autoplay === !1 && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !u)) {
          const y = _d(a, this.options, f, this.speed);
          (this.updateMotionValue ? this.updateMotionValue(y) : hT(s, i, y),
            this.animation.cancel());
        }
        (p?.(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: t } = this;
    t === "idle" ||
      t === "finished" ||
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    this.isPseudoElement || this.animation.commitStyles?.();
  }
  get duration() {
    const t = this.animation.effect?.getComputedTiming?.().duration || 0;
    return Rt(Number(t));
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + Rt(t);
  }
  get time() {
    return Rt(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    ((this.finishedTime = null), (this.animation.currentTime = Jt(t)));
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    (t < 0 && (this.finishedTime = null), (this.animation.playbackRate = t));
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(t) {
    this.animation.startTime = t;
  }
  attachTimeline({ timeline: t, observe: s }) {
    return (
      this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }),
      (this.animation.onfinish = null),
      t && mT() ? ((this.animation.timeline = t), It) : s(this)
    );
  }
}
const $v = { anticipate: vv, backInOut: yv, circInOut: wv };
function ST(e) {
  return e in $v;
}
function ET(e) {
  typeof e.ease == "string" && ST(e.ease) && (e.ease = $v[e.ease]);
}
const Vm = 10;
class _T extends wT {
  constructor(t) {
    (ET(t), Dv(t), super(t), t.startTime && (this.startTime = t.startTime), (this.options = t));
  }
  updateMotionValue(t) {
    const { motionValue: s, onUpdate: i, onComplete: a, element: u, ...c } = this.options;
    if (!s) return;
    if (t !== void 0) {
      s.set(t);
      return;
    }
    const f = new Cd({ ...c, autoplay: !1 }),
      p = Jt(this.finishedTime ?? this.time);
    (s.setWithVelocity(f.sample(p - Vm).value, f.sample(p).value, Vm), f.stop());
  }
}
const Bm = (e, t) =>
  t === "zIndex"
    ? !1
    : !!(
        typeof e == "number" ||
        Array.isArray(e) ||
        (typeof e == "string" && (zn.test(e) || e === "0") && !e.startsWith("url("))
      );
function TT(e) {
  const t = e[0];
  if (e.length === 1) return !0;
  for (let s = 0; s < e.length; s++) if (e[s] !== t) return !0;
}
function CT(e, t, s, i) {
  const a = e[0];
  if (a === null) return !1;
  if (t === "display" || t === "visibility") return !0;
  const u = e[e.length - 1],
    c = Bm(a, t),
    f = Bm(u, t);
  return !c || !f ? !1 : TT(e) || ((s === "spring" || Bv(s)) && i);
}
function Rc(e) {
  ((e.duration = 0), (e.type = "keyframes"));
}
const kT = new Set(["opacity", "clipPath", "filter", "transform"]),
  bT = hd(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function NT(e) {
  const { motionValue: t, name: s, repeatDelay: i, repeatType: a, damping: u, type: c } = e;
  if (!(t?.owner?.current instanceof HTMLElement)) return !1;
  const { onUpdate: p, transformTemplate: g } = t.owner.getProps();
  return (
    bT() &&
    s &&
    kT.has(s) &&
    (s !== "transform" || !g) &&
    !p &&
    !i &&
    a !== "mirror" &&
    u !== 0 &&
    c !== "inertia"
  );
}
const jT = 40;
class PT extends Td {
  constructor({
    autoplay: t = !0,
    delay: s = 0,
    type: i = "keyframes",
    repeat: a = 0,
    repeatDelay: u = 0,
    repeatType: c = "loop",
    keyframes: f,
    name: p,
    motionValue: g,
    element: y,
    ...v
  }) {
    (super(),
      (this.stop = () => {
        (this._animation && (this._animation.stop(), this.stopTimeline?.()),
          this.keyframeResolver?.cancel());
      }),
      (this.createdAt = ht.now()));
    const w = {
        autoplay: t,
        delay: s,
        type: i,
        repeat: a,
        repeatDelay: u,
        repeatType: c,
        name: p,
        motionValue: g,
        element: y,
        ...v,
      },
      E = y?.KeyframeResolver || kd;
    ((this.keyframeResolver = new E(
      f,
      (b, A, k) => this.onKeyframesResolved(b, A, w, !k),
      p,
      g,
      y
    )),
      this.keyframeResolver?.scheduleResolve());
  }
  onKeyframesResolved(t, s, i, a) {
    this.keyframeResolver = void 0;
    const { name: u, type: c, velocity: f, delay: p, isHandoff: g, onUpdate: y } = i;
    ((this.resolvedAt = ht.now()),
      CT(t, u, c, f) ||
        ((yn.instantAnimations || !p) && y?.(_d(t, i, s)),
        (t[0] = t[t.length - 1]),
        Rc(i),
        (i.repeat = 0)));
    const w = {
        startTime: a
          ? this.resolvedAt
            ? this.resolvedAt - this.createdAt > jT
              ? this.resolvedAt
              : this.createdAt
            : this.createdAt
          : void 0,
        finalKeyframe: s,
        ...i,
        keyframes: t,
      },
      E = !g && NT(w) ? new _T({ ...w, element: w.motionValue.owner.current }) : new Cd(w);
    (E.finished.then(() => this.notifyFinished()).catch(It),
      this.pendingTimeline &&
        ((this.stopTimeline = E.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = E));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, s) {
    return this.finished.finally(t).then(() => {});
  }
  get animation() {
    return (this._animation || (this.keyframeResolver?.resume(), fT()), this._animation);
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(t))
        : (this.pendingTimeline = t),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    (this._animation && this.animation.cancel(), this.keyframeResolver?.cancel());
  }
}
const RT = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function IT(e) {
  const t = RT.exec(e);
  if (!t) return [,];
  const [, s, i, a] = t;
  return [`--${s ?? i}`, a];
}
function Uv(e, t, s = 1) {
  const [i, a] = IT(e);
  if (!i) return;
  const u = window.getComputedStyle(t).getPropertyValue(i);
  if (u) {
    const c = u.trim();
    return uv(c) ? parseFloat(c) : c;
  }
  return vd(a) ? Uv(a, t, s + 1) : a;
}
function bd(e, t) {
  return e?.[t] ?? e?.default ?? e;
}
const zv = new Set(["width", "height", "top", "left", "right", "bottom", ...ps]),
  AT = { test: (e) => e === "auto", parse: (e) => e },
  Hv = (e) => (t) => t.test(e),
  Wv = [fs, ne, Zt, $n, T_, __, AT],
  $m = (e) => Wv.find(Hv(e));
function MT(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || dv(e) : !0;
}
const DT = new Set(["brightness", "contrast", "saturate", "opacity"]);
function LT(e) {
  const [t, s] = e.slice(0, -1).split("(");
  if (t === "drop-shadow") return e;
  const [i] = s.match(xd) || [];
  if (!i) return e;
  const a = s.replace(i, "");
  let u = DT.has(t) ? 1 : 0;
  return (i !== s && (u *= 100), t + "(" + u + a + ")");
}
const OT = /\b([a-z-]*)\(.*?\)/gu,
  Ic = {
    ...zn,
    getAnimatableNone: (e) => {
      const t = e.match(OT);
      return t ? t.map(LT).join(" ") : e;
    },
  },
  Um = { ...fs, transform: Math.round },
  FT = {
    rotate: $n,
    rotateX: $n,
    rotateY: $n,
    rotateZ: $n,
    scale: ea,
    scaleX: ea,
    scaleY: ea,
    scaleZ: ea,
    skew: $n,
    skewX: $n,
    skewY: $n,
    distance: ne,
    translateX: ne,
    translateY: ne,
    translateZ: ne,
    x: ne,
    y: ne,
    z: ne,
    perspective: ne,
    transformPerspective: ne,
    opacity: wi,
    originX: jm,
    originY: jm,
    originZ: ne,
  },
  Nd = {
    borderWidth: ne,
    borderTopWidth: ne,
    borderRightWidth: ne,
    borderBottomWidth: ne,
    borderLeftWidth: ne,
    borderRadius: ne,
    radius: ne,
    borderTopLeftRadius: ne,
    borderTopRightRadius: ne,
    borderBottomRightRadius: ne,
    borderBottomLeftRadius: ne,
    width: ne,
    maxWidth: ne,
    height: ne,
    maxHeight: ne,
    top: ne,
    right: ne,
    bottom: ne,
    left: ne,
    padding: ne,
    paddingTop: ne,
    paddingRight: ne,
    paddingBottom: ne,
    paddingLeft: ne,
    margin: ne,
    marginTop: ne,
    marginRight: ne,
    marginBottom: ne,
    marginLeft: ne,
    backgroundPositionX: ne,
    backgroundPositionY: ne,
    ...FT,
    zIndex: Um,
    fillOpacity: wi,
    strokeOpacity: wi,
    numOctaves: Um,
  },
  VT = {
    ...Nd,
    color: Oe,
    backgroundColor: Oe,
    outlineColor: Oe,
    fill: Oe,
    stroke: Oe,
    borderColor: Oe,
    borderTopColor: Oe,
    borderRightColor: Oe,
    borderBottomColor: Oe,
    borderLeftColor: Oe,
    filter: Ic,
    WebkitFilter: Ic,
  },
  Gv = (e) => VT[e];
function Kv(e, t) {
  let s = Gv(e);
  return (s !== Ic && (s = zn), s.getAnimatableNone ? s.getAnimatableNone(t) : void 0);
}
const BT = new Set(["auto", "none", "0"]);
function $T(e, t, s) {
  let i = 0,
    a;
  for (; i < e.length && !a;) {
    const u = e[i];
    (typeof u == "string" && !BT.has(u) && Si(u).values.length && (a = e[i]), i++);
  }
  if (a && s) for (const u of t) e[u] = Kv(s, a);
}
class UT extends kd {
  constructor(t, s, i, a, u) {
    super(t, s, i, a, u, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: s, name: i } = this;
    if (!s || !s.current) return;
    super.readKeyframes();
    for (let p = 0; p < t.length; p++) {
      let g = t[p];
      if (typeof g == "string" && ((g = g.trim()), vd(g))) {
        const y = Uv(g, s.current);
        (y !== void 0 && (t[p] = y), p === t.length - 1 && (this.finalKeyframe = g));
      }
    }
    if ((this.resolveNoneKeyframes(), !zv.has(i) || t.length !== 2)) return;
    const [a, u] = t,
      c = $m(a),
      f = $m(u);
    if (c !== f)
      if (Om(c) && Om(f))
        for (let p = 0; p < t.length; p++) {
          const g = t[p];
          typeof g == "string" && (t[p] = parseFloat(g));
        }
      else hr[i] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: s } = this,
      i = [];
    for (let a = 0; a < t.length; a++) (t[a] === null || MT(t[a])) && i.push(a);
    i.length && $T(t, i, s);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: s, name: i } = this;
    if (!t || !t.current) return;
    (i === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = hr[i](t.measureViewportBox(), window.getComputedStyle(t.current))),
      (s[0] = this.measuredOrigin));
    const a = s[s.length - 1];
    a !== void 0 && t.getValue(i, a).jump(a, !1);
  }
  measureEndState() {
    const { element: t, name: s, unresolvedKeyframes: i } = this;
    if (!t || !t.current) return;
    const a = t.getValue(s);
    a && a.jump(this.measuredOrigin, !1);
    const u = i.length - 1,
      c = i[u];
    ((i[u] = hr[s](t.measureViewportBox(), window.getComputedStyle(t.current))),
      c !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = c),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([f, p]) => {
          t.getValue(f).set(p);
        }),
      this.resolveNoneKeyframes());
  }
}
function zT(e, t, s) {
  if (e instanceof EventTarget) return [e];
  if (typeof e == "string") {
    let i = document;
    const a = s?.[e] ?? i.querySelectorAll(e);
    return a ? Array.from(a) : [];
  }
  return Array.from(e);
}
const Yv = (e, t) => (t && typeof e == "number" ? t.transform(e) : e);
function HT(e) {
  return cv(e) && "offsetHeight" in e;
}
const zm = 30,
  WT = (e) => !isNaN(parseFloat(e));
class GT {
  constructor(t, s = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (i) => {
        const a = ht.now();
        if (
          (this.updatedAt !== a && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(i),
          this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        )
          for (const u of this.dependents) u.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = s.owner));
  }
  setCurrent(t) {
    ((this.current = t),
      (this.updatedAt = ht.now()),
      this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = WT(this.current)));
  }
  setPrevFrameValue(t = this.current) {
    ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(t) {
    return this.on("change", t);
  }
  on(t, s) {
    this.events[t] || (this.events[t] = new md());
    const i = this.events[t].add(s);
    return t === "change"
      ? () => {
          (i(),
            ke.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : i;
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear();
  }
  attach(t, s) {
    ((this.passiveEffect = t), (this.stopPassiveEffect = s));
  }
  set(t) {
    this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t);
  }
  setWithVelocity(t, s, i) {
    (this.set(s),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - i));
  }
  jump(t, s = !0) {
    (this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      s && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(t) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(t));
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const t = ht.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > zm)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, zm);
    return fv(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
  }
  start(t) {
    return (
      this.stop(),
      new Promise((s) => {
        ((this.hasAnimated = !0),
          (this.animation = t(s)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    (this.dependents?.clear(),
      this.events.destroy?.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function rs(e, t) {
  return new GT(e, t);
}
const { schedule: jd } = _v(queueMicrotask, !1),
  Ut = { x: !1, y: !1 };
function Xv() {
  return Ut.x || Ut.y;
}
function KT(e) {
  return e === "x" || e === "y"
    ? Ut[e]
      ? null
      : ((Ut[e] = !0),
        () => {
          Ut[e] = !1;
        })
    : Ut.x || Ut.y
      ? null
      : ((Ut.x = Ut.y = !0),
        () => {
          Ut.x = Ut.y = !1;
        });
}
function qv(e, t) {
  const s = zT(e),
    i = new AbortController(),
    a = { passive: !0, ...t, signal: i.signal };
  return [s, a, () => i.abort()];
}
function Hm(e) {
  return !(e.pointerType === "touch" || Xv());
}
function YT(e, t, s = {}) {
  const [i, a, u] = qv(e, s),
    c = (f) => {
      if (!Hm(f)) return;
      const { target: p } = f,
        g = t(p, f);
      if (typeof g != "function" || !p) return;
      const y = (v) => {
        Hm(v) && (g(v), p.removeEventListener("pointerleave", y));
      };
      p.addEventListener("pointerleave", y, a);
    };
  return (
    i.forEach((f) => {
      f.addEventListener("pointerenter", c, a);
    }),
    u
  );
}
const Qv = (e, t) => (t ? (e === t ? !0 : Qv(e, t.parentElement)) : !1),
  Pd = (e) =>
    e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1,
  XT = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function qT(e) {
  return XT.has(e.tagName) || e.tabIndex !== -1;
}
const ua = new WeakSet();
function Wm(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function qu(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const QT = (e, t) => {
  const s = e.currentTarget;
  if (!s) return;
  const i = Wm(() => {
    if (ua.has(s)) return;
    qu(s, "down");
    const a = Wm(() => {
        qu(s, "up");
      }),
      u = () => qu(s, "cancel");
    (s.addEventListener("keyup", a, t), s.addEventListener("blur", u, t));
  });
  (s.addEventListener("keydown", i, t),
    s.addEventListener("blur", () => s.removeEventListener("keydown", i), t));
};
function Gm(e) {
  return Pd(e) && !Xv();
}
function JT(e, t, s = {}) {
  const [i, a, u] = qv(e, s),
    c = (f) => {
      const p = f.currentTarget;
      if (!Gm(f)) return;
      ua.add(p);
      const g = t(p, f),
        y = (E, b) => {
          (window.removeEventListener("pointerup", v),
            window.removeEventListener("pointercancel", w),
            ua.has(p) && ua.delete(p),
            Gm(E) && typeof g == "function" && g(E, { success: b }));
        },
        v = (E) => {
          y(E, p === window || p === document || s.useGlobalTarget || Qv(p, E.target));
        },
        w = (E) => {
          y(E, !1);
        };
      (window.addEventListener("pointerup", v, a), window.addEventListener("pointercancel", w, a));
    };
  return (
    i.forEach((f) => {
      ((s.useGlobalTarget ? window : f).addEventListener("pointerdown", c, a),
        HT(f) &&
          (f.addEventListener("focus", (g) => QT(g, a)),
          !qT(f) && !f.hasAttribute("tabindex") && (f.tabIndex = 0)));
    }),
    u
  );
}
function Jv(e) {
  return cv(e) && "ownerSVGElement" in e;
}
function ZT(e) {
  return Jv(e) && e.tagName === "svg";
}
const Ze = (e) => !!(e && e.getVelocity),
  eC = [...Wv, Oe, zn],
  tC = (e) => eC.find(Hv(e)),
  Zv = _.createContext({ transformPagePoint: (e) => e, isStatic: !1, reducedMotion: "never" });
function nC(e = !0) {
  const t = _.useContext(cd);
  if (t === null) return [!0, null];
  const { isPresent: s, onExitComplete: i, register: a } = t,
    u = _.useId();
  _.useEffect(() => {
    if (e) return a(u);
  }, [e]);
  const c = _.useCallback(() => e && i && i(u), [u, i, e]);
  return !s && i ? [!1, c] : [!0];
}
const e0 = _.createContext({ strict: !1 }),
  Km = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  },
  ss = {};
for (const e in Km) ss[e] = { isEnabled: (t) => Km[e].some((s) => !!t[s]) };
function rC(e) {
  for (const t in e) ss[t] = { ...ss[t], ...e[t] };
}
const sC = new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport",
]);
function Sa(e) {
  return (
    e.startsWith("while") ||
    (e.startsWith("drag") && e !== "draggable") ||
    e.startsWith("layout") ||
    e.startsWith("onTap") ||
    e.startsWith("onPan") ||
    e.startsWith("onLayout") ||
    sC.has(e)
  );
}
let t0 = (e) => !Sa(e);
function iC(e) {
  typeof e == "function" && (t0 = (t) => (t.startsWith("on") ? !Sa(t) : e(t)));
}
try {
  iC(require("@emotion/is-prop-valid").default);
} catch {}
function oC(e, t, s) {
  const i = {};
  for (const a in e)
    (a === "values" && typeof e.values == "object") ||
      ((t0(a) ||
        (s === !0 && Sa(a)) ||
        (!t && !Sa(a)) ||
        (e.draggable && a.startsWith("onDrag"))) &&
        (i[a] = e[a]));
  return i;
}
const Na = _.createContext({});
function ja(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function Ei(e) {
  return typeof e == "string" || Array.isArray(e);
}
const Rd = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
  Id = ["initial", ...Rd];
function Pa(e) {
  return ja(e.animate) || Id.some((t) => Ei(e[t]));
}
function n0(e) {
  return !!(Pa(e) || e.variants);
}
function aC(e, t) {
  if (Pa(e)) {
    const { initial: s, animate: i } = e;
    return { initial: s === !1 || Ei(s) ? s : void 0, animate: Ei(i) ? i : void 0 };
  }
  return e.inherit !== !1 ? t : {};
}
function lC(e) {
  const { initial: t, animate: s } = aC(e, _.useContext(Na));
  return _.useMemo(() => ({ initial: t, animate: s }), [Ym(t), Ym(s)]);
}
function Ym(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
function Xm(e, t) {
  return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
}
const ci = {
    correct: (e, t) => {
      if (!t.target) return e;
      if (typeof e == "string")
        if (ne.test(e)) e = parseFloat(e);
        else return e;
      const s = Xm(e, t.target.x),
        i = Xm(e, t.target.y);
      return `${s}% ${i}%`;
    },
  },
  uC = {
    correct: (e, { treeScale: t, projectionDelta: s }) => {
      const i = e,
        a = zn.parse(e);
      if (a.length > 5) return i;
      const u = zn.createTransformer(e),
        c = typeof a[0] != "number" ? 1 : 0,
        f = s.x.scale * t.x,
        p = s.y.scale * t.y;
      ((a[0 + c] /= f), (a[1 + c] /= p));
      const g = je(f, p, 0.5);
      return (
        typeof a[2 + c] == "number" && (a[2 + c] /= g),
        typeof a[3 + c] == "number" && (a[3 + c] /= g),
        u(a)
      );
    },
  },
  Ac = {
    borderRadius: {
      ...ci,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: ci,
    borderTopRightRadius: ci,
    borderBottomLeftRadius: ci,
    borderBottomRightRadius: ci,
    boxShadow: uC,
  };
function r0(e, { layout: t, layoutId: s }) {
  return (
    hs.has(e) || e.startsWith("origin") || ((t || s !== void 0) && (!!Ac[e] || e === "opacity"))
  );
}
const cC = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  dC = ps.length;
function fC(e, t, s) {
  let i = "",
    a = !0;
  for (let u = 0; u < dC; u++) {
    const c = ps[u],
      f = e[c];
    if (f === void 0) continue;
    let p = !0;
    if (
      (typeof f == "number"
        ? (p = f === (c.startsWith("scale") ? 1 : 0))
        : (p = parseFloat(f) === 0),
      !p || s)
    ) {
      const g = Yv(f, Nd[c]);
      if (!p) {
        a = !1;
        const y = cC[c] || c;
        i += `${y}(${g}) `;
      }
      s && (t[c] = g);
    }
  }
  return ((i = i.trim()), s ? (i = s(t, a ? "" : i)) : a && (i = "none"), i);
}
function Ad(e, t, s) {
  const { style: i, vars: a, transformOrigin: u } = e;
  let c = !1,
    f = !1;
  for (const p in t) {
    const g = t[p];
    if (hs.has(p)) {
      c = !0;
      continue;
    } else if (Cv(p)) {
      a[p] = g;
      continue;
    } else {
      const y = Yv(g, Nd[p]);
      p.startsWith("origin") ? ((f = !0), (u[p] = y)) : (i[p] = y);
    }
  }
  if (
    (t.transform ||
      (c || s ? (i.transform = fC(t, e.transform, s)) : i.transform && (i.transform = "none")),
    f)
  ) {
    const { originX: p = "50%", originY: g = "50%", originZ: y = 0 } = u;
    i.transformOrigin = `${p} ${g} ${y}`;
  }
}
const Md = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function s0(e, t, s) {
  for (const i in t) !Ze(t[i]) && !r0(i, s) && (e[i] = t[i]);
}
function pC({ transformTemplate: e }, t) {
  return _.useMemo(() => {
    const s = Md();
    return (Ad(s, t, e), Object.assign({}, s.vars, s.style));
  }, [t]);
}
function hC(e, t) {
  const s = e.style || {},
    i = {};
  return (s0(i, s, e), Object.assign(i, pC(e, t)), i);
}
function mC(e, t) {
  const s = {},
    i = hC(e, t);
  return (
    e.drag &&
      e.dragListener !== !1 &&
      ((s.draggable = !1),
      (i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none"),
      (i.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`)),
    e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (s.tabIndex = 0),
    (s.style = i),
    s
  );
}
const gC = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  yC = { offset: "strokeDashoffset", array: "strokeDasharray" };
function vC(e, t, s = 1, i = 0, a = !0) {
  e.pathLength = 1;
  const u = a ? gC : yC;
  e[u.offset] = ne.transform(-i);
  const c = ne.transform(t),
    f = ne.transform(s);
  e[u.array] = `${c} ${f}`;
}
function i0(
  e,
  { attrX: t, attrY: s, attrScale: i, pathLength: a, pathSpacing: u = 1, pathOffset: c = 0, ...f },
  p,
  g,
  y
) {
  if ((Ad(e, f, g), p)) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  ((e.attrs = e.style), (e.style = {}));
  const { attrs: v, style: w } = e;
  (v.transform && ((w.transform = v.transform), delete v.transform),
    (w.transform || v.transformOrigin) &&
      ((w.transformOrigin = v.transformOrigin ?? "50% 50%"), delete v.transformOrigin),
    w.transform && ((w.transformBox = y?.transformBox ?? "fill-box"), delete v.transformBox),
    t !== void 0 && (v.x = t),
    s !== void 0 && (v.y = s),
    i !== void 0 && (v.scale = i),
    a !== void 0 && vC(v, a, u, c, !1));
}
const o0 = () => ({ ...Md(), attrs: {} }),
  a0 = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function xC(e, t, s, i) {
  const a = _.useMemo(() => {
    const u = o0();
    return (i0(u, t, a0(i), e.transformTemplate, e.style), { ...u.attrs, style: { ...u.style } });
  }, [t]);
  if (e.style) {
    const u = {};
    (s0(u, e.style, e), (a.style = { ...u, ...a.style }));
  }
  return a;
}
const wC = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function Dd(e) {
  return typeof e != "string" || e.includes("-") ? !1 : !!(wC.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
function SC(e, t, s, { latestValues: i }, a, u = !1) {
  const f = (Dd(e) ? xC : mC)(t, i, a, e),
    p = oC(t, typeof e == "string", u),
    g = e !== _.Fragment ? { ...p, ...f, ref: s } : {},
    { children: y } = t,
    v = _.useMemo(() => (Ze(y) ? y.get() : y), [y]);
  return _.createElement(e, { ...g, children: v });
}
function qm(e) {
  const t = [{}, {}];
  return (
    e?.values.forEach((s, i) => {
      ((t[0][i] = s.get()), (t[1][i] = s.getVelocity()));
    }),
    t
  );
}
function Ld(e, t, s, i) {
  if (typeof t == "function") {
    const [a, u] = qm(i);
    t = t(s !== void 0 ? s : e.custom, a, u);
  }
  if ((typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function")) {
    const [a, u] = qm(i);
    t = t(s !== void 0 ? s : e.custom, a, u);
  }
  return t;
}
function ca(e) {
  return Ze(e) ? e.get() : e;
}
function EC({ scrapeMotionValuesFromProps: e, createRenderState: t }, s, i, a) {
  return { latestValues: _C(s, i, a, e), renderState: t() };
}
function _C(e, t, s, i) {
  const a = {},
    u = i(e, {});
  for (const w in u) a[w] = ca(u[w]);
  let { initial: c, animate: f } = e;
  const p = Pa(e),
    g = n0(e);
  t &&
    g &&
    !p &&
    e.inherit !== !1 &&
    (c === void 0 && (c = t.initial), f === void 0 && (f = t.animate));
  let y = s ? s.initial === !1 : !1;
  y = y || c === !1;
  const v = y ? f : c;
  if (v && typeof v != "boolean" && !ja(v)) {
    const w = Array.isArray(v) ? v : [v];
    for (let E = 0; E < w.length; E++) {
      const b = Ld(e, w[E]);
      if (b) {
        const { transitionEnd: A, transition: k, ...R } = b;
        for (const D in R) {
          let M = R[D];
          if (Array.isArray(M)) {
            const $ = y ? M.length - 1 : 0;
            M = M[$];
          }
          M !== null && (a[D] = M);
        }
        for (const D in A) a[D] = A[D];
      }
    }
  }
  return a;
}
const l0 = (e) => (t, s) => {
  const i = _.useContext(Na),
    a = _.useContext(cd),
    u = () => EC(e, t, i, a);
  return s ? u() : r_(u);
};
function Od(e, t, s) {
  const { style: i } = e,
    a = {};
  for (const u in i)
    (Ze(i[u]) || (t.style && Ze(t.style[u])) || r0(u, e) || s?.getValue(u)?.liveStyle !== void 0) &&
      (a[u] = i[u]);
  return a;
}
const TC = l0({ scrapeMotionValuesFromProps: Od, createRenderState: Md });
function u0(e, t, s) {
  const i = Od(e, t, s);
  for (const a in e)
    if (Ze(e[a]) || Ze(t[a])) {
      const u = ps.indexOf(a) !== -1 ? "attr" + a.charAt(0).toUpperCase() + a.substring(1) : a;
      i[u] = e[a];
    }
  return i;
}
const CC = l0({ scrapeMotionValuesFromProps: u0, createRenderState: o0 }),
  kC = Symbol.for("motionComponentSymbol");
function qr(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function bC(e, t, s) {
  return _.useCallback(
    (i) => {
      (i && e.onMount && e.onMount(i),
        t && (i ? t.mount(i) : t.unmount()),
        s && (typeof s == "function" ? s(i) : qr(s) && (s.current = i)));
    },
    [t]
  );
}
const Fd = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
  NC = "framerAppearId",
  c0 = "data-" + Fd(NC),
  d0 = _.createContext({});
function jC(e, t, s, i, a) {
  const { visualElement: u } = _.useContext(Na),
    c = _.useContext(e0),
    f = _.useContext(cd),
    p = _.useContext(Zv).reducedMotion,
    g = _.useRef(null);
  ((i = i || c.renderer),
    !g.current &&
      i &&
      (g.current = i(e, {
        visualState: t,
        parent: u,
        props: s,
        presenceContext: f,
        blockInitialAnimation: f ? f.initial === !1 : !1,
        reducedMotionConfig: p,
      })));
  const y = g.current,
    v = _.useContext(d0);
  y && !y.projection && a && (y.type === "html" || y.type === "svg") && PC(g.current, s, a, v);
  const w = _.useRef(!1);
  _.useInsertionEffect(() => {
    y && w.current && y.update(s, f);
  });
  const E = s[c0],
    b = _.useRef(
      !!E && !window.MotionHandoffIsComplete?.(E) && window.MotionHasOptimisedAnimation?.(E)
    );
  return (
    s_(() => {
      y &&
        ((w.current = !0),
        (window.MotionIsMounted = !0),
        y.updateFeatures(),
        y.scheduleRenderMicrotask(),
        b.current && y.animationState && y.animationState.animateChanges());
    }),
    _.useEffect(() => {
      y &&
        (!b.current && y.animationState && y.animationState.animateChanges(),
        b.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(E);
          }),
          (b.current = !1)),
        (y.enteringChildren = void 0));
    }),
    y
  );
}
function PC(e, t, s, i) {
  const {
    layoutId: a,
    layout: u,
    drag: c,
    dragConstraints: f,
    layoutScroll: p,
    layoutRoot: g,
    layoutCrossfade: y,
  } = t;
  ((e.projection = new s(e.latestValues, t["data-framer-portal-id"] ? void 0 : f0(e.parent))),
    e.projection.setOptions({
      layoutId: a,
      layout: u,
      alwaysMeasureLayout: !!c || (f && qr(f)),
      visualElement: e,
      animationType: typeof u == "string" ? u : "both",
      initialPromotionConfig: i,
      crossfade: y,
      layoutScroll: p,
      layoutRoot: g,
    }));
}
function f0(e) {
  if (e) return e.options.allowProjection !== !1 ? e.projection : f0(e.parent);
}
function Qu(e, { forwardMotionProps: t = !1 } = {}, s, i) {
  s && rC(s);
  const a = Dd(e) ? CC : TC;
  function u(f, p) {
    let g;
    const y = { ..._.useContext(Zv), ...f, layoutId: RC(f) },
      { isStatic: v } = y,
      w = lC(f),
      E = a(f, v);
    if (!v && ud) {
      IC();
      const b = AC(y);
      ((g = b.MeasureLayout), (w.visualElement = jC(e, E, y, i, b.ProjectionNode)));
    }
    return h.jsxs(Na.Provider, {
      value: w,
      children: [
        g && w.visualElement ? h.jsx(g, { visualElement: w.visualElement, ...y }) : null,
        SC(e, f, bC(E, w.visualElement, p), E, v, t),
      ],
    });
  }
  u.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const c = _.forwardRef(u);
  return ((c[kC] = e), c);
}
function RC({ layoutId: e }) {
  const t = _.useContext(lv).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function IC(e, t) {
  _.useContext(e0).strict;
}
function AC(e) {
  const { drag: t, layout: s } = ss;
  if (!t && !s) return {};
  const i = { ...t, ...s };
  return {
    MeasureLayout: t?.isEnabled(e) || s?.isEnabled(e) ? i.MeasureLayout : void 0,
    ProjectionNode: i.ProjectionNode,
  };
}
function MC(e, t) {
  if (typeof Proxy > "u") return Qu;
  const s = new Map(),
    i = (u, c) => Qu(u, c, e, t),
    a = (u, c) => i(u, c);
  return new Proxy(a, {
    get: (u, c) => (c === "create" ? i : (s.has(c) || s.set(c, Qu(c, void 0, e, t)), s.get(c))),
  });
}
function p0({ top: e, left: t, right: s, bottom: i }) {
  return { x: { min: t, max: s }, y: { min: e, max: i } };
}
function DC({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function LC(e, t) {
  if (!t) return e;
  const s = t({ x: e.left, y: e.top }),
    i = t({ x: e.right, y: e.bottom });
  return { top: s.y, left: s.x, bottom: i.y, right: i.x };
}
function Ju(e) {
  return e === void 0 || e === 1;
}
function Mc({ scale: e, scaleX: t, scaleY: s }) {
  return !Ju(e) || !Ju(t) || !Ju(s);
}
function cr(e) {
  return Mc(e) || h0(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function h0(e) {
  return Qm(e.x) || Qm(e.y);
}
function Qm(e) {
  return e && e !== "0%";
}
function Ea(e, t, s) {
  const i = e - s,
    a = t * i;
  return s + a;
}
function Jm(e, t, s, i, a) {
  return (a !== void 0 && (e = Ea(e, a, i)), Ea(e, s, i) + t);
}
function Dc(e, t = 0, s = 1, i, a) {
  ((e.min = Jm(e.min, t, s, i, a)), (e.max = Jm(e.max, t, s, i, a)));
}
function m0(e, { x: t, y: s }) {
  (Dc(e.x, t.translate, t.scale, t.originPoint), Dc(e.y, s.translate, s.scale, s.originPoint));
}
const Zm = 0.999999999999,
  eg = 1.0000000000001;
function OC(e, t, s, i = !1) {
  const a = s.length;
  if (!a) return;
  t.x = t.y = 1;
  let u, c;
  for (let f = 0; f < a; f++) {
    ((u = s[f]), (c = u.projectionDelta));
    const { visualElement: p } = u.options;
    (p && p.props.style && p.props.style.display === "contents") ||
      (i &&
        u.options.layoutScroll &&
        u.scroll &&
        u !== u.root &&
        Jr(e, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }),
      c && ((t.x *= c.x.scale), (t.y *= c.y.scale), m0(e, c)),
      i && cr(u.latestValues) && Jr(e, u.latestValues));
  }
  (t.x < eg && t.x > Zm && (t.x = 1), t.y < eg && t.y > Zm && (t.y = 1));
}
function Qr(e, t) {
  ((e.min = e.min + t), (e.max = e.max + t));
}
function tg(e, t, s, i, a = 0.5) {
  const u = je(e.min, e.max, a);
  Dc(e, t, s, u, i);
}
function Jr(e, t) {
  (tg(e.x, t.x, t.scaleX, t.scale, t.originX), tg(e.y, t.y, t.scaleY, t.scale, t.originY));
}
function g0(e, t) {
  return p0(LC(e.getBoundingClientRect(), t));
}
function FC(e, t, s) {
  const i = g0(e, s),
    { scroll: a } = t;
  return (a && (Qr(i.x, a.offset.x), Qr(i.y, a.offset.y)), i);
}
const ng = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Zr = () => ({ x: ng(), y: ng() }),
  rg = () => ({ min: 0, max: 0 }),
  $e = () => ({ x: rg(), y: rg() }),
  Lc = { current: null },
  y0 = { current: !1 };
function VC() {
  if (((y0.current = !0), !!ud))
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"),
        t = () => (Lc.current = e.matches);
      (e.addEventListener("change", t), t());
    } else Lc.current = !1;
}
const BC = new WeakMap();
function $C(e, t, s) {
  for (const i in t) {
    const a = t[i],
      u = s[i];
    if (Ze(a)) e.addValue(i, a);
    else if (Ze(u)) e.addValue(i, rs(a, { owner: e }));
    else if (u !== a)
      if (e.hasValue(i)) {
        const c = e.getValue(i);
        c.liveStyle === !0 ? c.jump(a) : c.hasAnimated || c.set(a);
      } else {
        const c = e.getStaticValue(i);
        e.addValue(i, rs(c !== void 0 ? c : a, { owner: e }));
      }
  }
  for (const i in s) t[i] === void 0 && e.removeValue(i);
  return t;
}
const sg = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete",
];
class UC {
  scrapeMotionValuesFromProps(t, s, i) {
    return {};
  }
  constructor(
    {
      parent: t,
      props: s,
      presenceContext: i,
      reducedMotionConfig: a,
      blockInitialAnimation: u,
      visualState: c,
    },
    f = {}
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.values = new Map()),
      (this.KeyframeResolver = kd),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const w = ht.now();
        this.renderScheduledAt < w &&
          ((this.renderScheduledAt = w), ke.render(this.render, !1, !0));
      }));
    const { latestValues: p, renderState: g } = c;
    ((this.latestValues = p),
      (this.baseTarget = { ...p }),
      (this.initialValues = s.initial ? { ...p } : {}),
      (this.renderState = g),
      (this.parent = t),
      (this.props = s),
      (this.presenceContext = i),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = a),
      (this.options = f),
      (this.blockInitialAnimation = !!u),
      (this.isControllingVariants = Pa(s)),
      (this.isVariantNode = n0(s)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(t && t.current)));
    const { willChange: y, ...v } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const w in v) {
      const E = v[w];
      p[w] !== void 0 && Ze(E) && E.set(p[w]);
    }
  }
  mount(t) {
    ((this.current = t),
      BC.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((s, i) => this.bindToMotionValue(i, s)),
      y0.current || VC(),
      (this.shouldReduceMotion =
        this.reducedMotionConfig === "never"
          ? !1
          : this.reducedMotionConfig === "always"
            ? !0
            : Lc.current),
      this.parent?.addChild(this),
      this.update(this.props, this.presenceContext));
  }
  unmount() {
    (this.projection && this.projection.unmount(),
      Un(this.notifyUpdate),
      Un(this.render),
      this.valueSubscriptions.forEach((t) => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent?.removeChild(this));
    for (const t in this.events) this.events[t].clear();
    for (const t in this.features) {
      const s = this.features[t];
      s && (s.unmount(), (s.isMounted = !1));
    }
    this.current = null;
  }
  addChild(t) {
    (this.children.add(t),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(t));
  }
  removeChild(t) {
    (this.children.delete(t), this.enteringChildren && this.enteringChildren.delete(t));
  }
  bindToMotionValue(t, s) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const i = hs.has(t);
    i && this.onBindTransform && this.onBindTransform();
    const a = s.on("change", (c) => {
      ((this.latestValues[t] = c),
        this.props.onUpdate && ke.preRender(this.notifyUpdate),
        i && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let u;
    (window.MotionCheckAppearSync && (u = window.MotionCheckAppearSync(this, t, s)),
      this.valueSubscriptions.set(t, () => {
        (a(), u && u(), s.owner && s.stop());
      }));
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type
      ? 0
      : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in ss) {
      const s = ss[t];
      if (!s) continue;
      const { isEnabled: i, Feature: a } = s;
      if (
        (!this.features[t] && a && i(this.props) && (this.features[t] = new a(this)),
        this.features[t])
      ) {
        const u = this.features[t];
        u.isMounted ? u.update() : (u.mount(), (u.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : $e();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, s) {
    this.latestValues[t] = s;
  }
  update(t, s) {
    ((t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = s));
    for (let i = 0; i < sg.length; i++) {
      const a = sg[i];
      this.propEventSubscriptions[a] &&
        (this.propEventSubscriptions[a](), delete this.propEventSubscriptions[a]);
      const u = "on" + a,
        c = t[u];
      c && (this.propEventSubscriptions[a] = this.on(a, c));
    }
    ((this.prevMotionValues = $C(
      this,
      this.scrapeMotionValuesFromProps(t, this.prevProps, this),
      this.prevMotionValues
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(t) {
    const s = this.getClosestVariantNode();
    if (s)
      return (s.variantChildren && s.variantChildren.add(t), () => s.variantChildren.delete(t));
  }
  addValue(t, s) {
    const i = this.values.get(t);
    s !== i &&
      (i && this.removeValue(t),
      this.bindToMotionValue(t, s),
      this.values.set(t, s),
      (this.latestValues[t] = s.get()));
  }
  removeValue(t) {
    this.values.delete(t);
    const s = this.valueSubscriptions.get(t);
    (s && (s(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState));
  }
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, s) {
    if (this.props.values && this.props.values[t]) return this.props.values[t];
    let i = this.values.get(t);
    return (
      i === void 0 &&
        s !== void 0 &&
        ((i = rs(s === null ? void 0 : s, { owner: this })), this.addValue(t, i)),
      i
    );
  }
  readValue(t, s) {
    let i =
      this.latestValues[t] !== void 0 || !this.current
        ? this.latestValues[t]
        : (this.getBaseTargetFromProps(this.props, t) ??
          this.readValueFromInstance(this.current, t, this.options));
    return (
      i != null &&
        (typeof i == "string" && (uv(i) || dv(i))
          ? (i = parseFloat(i))
          : !tC(i) && zn.test(s) && (i = Kv(t, s)),
        this.setBaseTarget(t, Ze(i) ? i.get() : i)),
      Ze(i) ? i.get() : i
    );
  }
  setBaseTarget(t, s) {
    this.baseTarget[t] = s;
  }
  getBaseTarget(t) {
    const { initial: s } = this.props;
    let i;
    if (typeof s == "string" || typeof s == "object") {
      const u = Ld(this.props, s, this.presenceContext?.custom);
      u && (i = u[t]);
    }
    if (s && i !== void 0) return i;
    const a = this.getBaseTargetFromProps(this.props, t);
    return a !== void 0 && !Ze(a)
      ? a
      : this.initialValues[t] !== void 0 && i === void 0
        ? void 0
        : this.baseTarget[t];
  }
  on(t, s) {
    return (this.events[t] || (this.events[t] = new md()), this.events[t].add(s));
  }
  notify(t, ...s) {
    this.events[t] && this.events[t].notify(...s);
  }
  scheduleRenderMicrotask() {
    jd.render(this.render);
  }
}
class v0 extends UC {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = UT));
  }
  sortInstanceNodePosition(t, s) {
    return t.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, s) {
    return t.style ? t.style[s] : void 0;
  }
  removeValueFromRenderState(t, { vars: s, style: i }) {
    (delete s[t], delete i[t]);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Ze(t) &&
      (this.childSubscription = t.on("change", (s) => {
        this.current && (this.current.textContent = `${s}`);
      }));
  }
}
function x0(e, { style: t, vars: s }, i, a) {
  const u = e.style;
  let c;
  for (c in t) u[c] = t[c];
  a?.applyProjectionStyles(u, i);
  for (c in s) u.setProperty(c, s[c]);
}
function zC(e) {
  return window.getComputedStyle(e);
}
class HC extends v0 {
  constructor() {
    (super(...arguments), (this.type = "html"), (this.renderInstance = x0));
  }
  readValueFromInstance(t, s) {
    if (hs.has(s)) return this.projection?.isProjecting ? kc(s) : aT(t, s);
    {
      const i = zC(t),
        a = (Cv(s) ? i.getPropertyValue(s) : i[s]) || 0;
      return typeof a == "string" ? a.trim() : a;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: s }) {
    return g0(t, s);
  }
  build(t, s, i) {
    Ad(t, s, i.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, s, i) {
    return Od(t, s, i);
  }
}
const w0 = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust",
]);
function WC(e, t, s, i) {
  x0(e, t, void 0, i);
  for (const a in t.attrs) e.setAttribute(w0.has(a) ? a : Fd(a), t.attrs[a]);
}
class GC extends v0 {
  constructor() {
    (super(...arguments),
      (this.type = "svg"),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = $e));
  }
  getBaseTargetFromProps(t, s) {
    return t[s];
  }
  readValueFromInstance(t, s) {
    if (hs.has(s)) {
      const i = Gv(s);
      return (i && i.default) || 0;
    }
    return ((s = w0.has(s) ? s : Fd(s)), t.getAttribute(s));
  }
  scrapeMotionValuesFromProps(t, s, i) {
    return u0(t, s, i);
  }
  build(t, s, i) {
    i0(t, s, this.isSVGTag, i.transformTemplate, i.style);
  }
  renderInstance(t, s, i, a) {
    WC(t, s, i, a);
  }
  mount(t) {
    ((this.isSVGTag = a0(t.tagName)), super.mount(t));
  }
}
const KC = (e, t) => (Dd(e) ? new GC(t) : new HC(t, { allowProjection: e !== _.Fragment }));
function ns(e, t, s) {
  const i = e.getProps();
  return Ld(i, t, s !== void 0 ? s : i.custom, e);
}
const Oc = (e) => Array.isArray(e);
function YC(e, t, s) {
  e.hasValue(t) ? e.getValue(t).set(s) : e.addValue(t, rs(s));
}
function XC(e) {
  return Oc(e) ? e[e.length - 1] || 0 : e;
}
function qC(e, t) {
  const s = ns(e, t);
  let { transitionEnd: i = {}, transition: a = {}, ...u } = s || {};
  u = { ...u, ...i };
  for (const c in u) {
    const f = XC(u[c]);
    YC(e, c, f);
  }
}
function QC(e) {
  return !!(Ze(e) && e.add);
}
function Fc(e, t) {
  const s = e.getValue("willChange");
  if (QC(s)) return s.add(t);
  if (!s && yn.WillChange) {
    const i = new yn.WillChange("auto");
    (e.addValue("willChange", i), i.add(t));
  }
}
function S0(e) {
  return e.props[c0];
}
const JC = (e) => e !== null;
function ZC(e, { repeat: t, repeatType: s = "loop" }, i) {
  const a = e.filter(JC),
    u = t && s !== "loop" && t % 2 === 1 ? 0 : a.length - 1;
  return a[u];
}
const ek = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  tk = (e) => ({
    type: "spring",
    stiffness: 550,
    damping: e === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  nk = { type: "keyframes", duration: 0.8 },
  rk = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  sk = (e, { keyframes: t }) =>
    t.length > 2 ? nk : hs.has(e) ? (e.startsWith("scale") ? tk(t[1]) : ek) : rk;
function ik({
  when: e,
  delay: t,
  delayChildren: s,
  staggerChildren: i,
  staggerDirection: a,
  repeat: u,
  repeatType: c,
  repeatDelay: f,
  from: p,
  elapsed: g,
  ...y
}) {
  return !!Object.keys(y).length;
}
const Vd =
  (e, t, s, i = {}, a, u) =>
  (c) => {
    const f = bd(i, e) || {},
      p = f.delay || i.delay || 0;
    let { elapsed: g = 0 } = i;
    g = g - Jt(p);
    const y = {
      keyframes: Array.isArray(s) ? s : [null, s],
      ease: "easeOut",
      velocity: t.getVelocity(),
      ...f,
      delay: -g,
      onUpdate: (w) => {
        (t.set(w), f.onUpdate && f.onUpdate(w));
      },
      onComplete: () => {
        (c(), f.onComplete && f.onComplete());
      },
      name: e,
      motionValue: t,
      element: u ? void 0 : a,
    };
    (ik(f) || Object.assign(y, sk(e, y)),
      y.duration && (y.duration = Jt(y.duration)),
      y.repeatDelay && (y.repeatDelay = Jt(y.repeatDelay)),
      y.from !== void 0 && (y.keyframes[0] = y.from));
    let v = !1;
    if (
      ((y.type === !1 || (y.duration === 0 && !y.repeatDelay)) &&
        (Rc(y), y.delay === 0 && (v = !0)),
      (yn.instantAnimations || yn.skipAnimations) && ((v = !0), Rc(y), (y.delay = 0)),
      (y.allowFlatten = !f.type && !f.ease),
      v && !u && t.get() !== void 0)
    ) {
      const w = ZC(y.keyframes, f);
      if (w !== void 0) {
        ke.update(() => {
          (y.onUpdate(w), y.onComplete());
        });
        return;
      }
    }
    return f.isSync ? new Cd(y) : new PT(y);
  };
function ok({ protectedKeys: e, needsAnimating: t }, s) {
  const i = e.hasOwnProperty(s) && t[s] !== !0;
  return ((t[s] = !1), i);
}
function E0(e, t, { delay: s = 0, transitionOverride: i, type: a } = {}) {
  let { transition: u = e.getDefaultTransition(), transitionEnd: c, ...f } = t;
  i && (u = i);
  const p = [],
    g = a && e.animationState && e.animationState.getState()[a];
  for (const y in f) {
    const v = e.getValue(y, e.latestValues[y] ?? null),
      w = f[y];
    if (w === void 0 || (g && ok(g, y))) continue;
    const E = { delay: s, ...bd(u || {}, y) },
      b = v.get();
    if (b !== void 0 && !v.isAnimating && !Array.isArray(w) && w === b && !E.velocity) continue;
    let A = !1;
    if (window.MotionHandoffAnimation) {
      const R = S0(e);
      if (R) {
        const D = window.MotionHandoffAnimation(R, y, ke);
        D !== null && ((E.startTime = D), (A = !0));
      }
    }
    (Fc(e, y), v.start(Vd(y, v, w, e.shouldReduceMotion && zv.has(y) ? { type: !1 } : E, e, A)));
    const k = v.animation;
    k && p.push(k);
  }
  return (
    c &&
      Promise.all(p).then(() => {
        ke.update(() => {
          c && qC(e, c);
        });
      }),
    p
  );
}
function _0(e, t, s, i = 0, a = 1) {
  const u = Array.from(e)
      .sort((g, y) => g.sortNodePosition(y))
      .indexOf(t),
    c = e.size,
    f = (c - 1) * i;
  return typeof s == "function" ? s(u, c) : a === 1 ? u * i : f - u * i;
}
function Vc(e, t, s = {}) {
  const i = ns(e, t, s.type === "exit" ? e.presenceContext?.custom : void 0);
  let { transition: a = e.getDefaultTransition() || {} } = i || {};
  s.transitionOverride && (a = s.transitionOverride);
  const u = i ? () => Promise.all(E0(e, i, s)) : () => Promise.resolve(),
    c =
      e.variantChildren && e.variantChildren.size
        ? (p = 0) => {
            const { delayChildren: g = 0, staggerChildren: y, staggerDirection: v } = a;
            return ak(e, t, p, g, y, v, s);
          }
        : () => Promise.resolve(),
    { when: f } = a;
  if (f) {
    const [p, g] = f === "beforeChildren" ? [u, c] : [c, u];
    return p().then(() => g());
  } else return Promise.all([u(), c(s.delay)]);
}
function ak(e, t, s = 0, i = 0, a = 0, u = 1, c) {
  const f = [];
  for (const p of e.variantChildren)
    (p.notify("AnimationStart", t),
      f.push(
        Vc(p, t, {
          ...c,
          delay: s + (typeof i == "function" ? 0 : i) + _0(e.variantChildren, p, i, a, u),
        }).then(() => p.notify("AnimationComplete", t))
      ));
  return Promise.all(f);
}
function lk(e, t, s = {}) {
  e.notify("AnimationStart", t);
  let i;
  if (Array.isArray(t)) {
    const a = t.map((u) => Vc(e, u, s));
    i = Promise.all(a);
  } else if (typeof t == "string") i = Vc(e, t, s);
  else {
    const a = typeof t == "function" ? ns(e, t, s.custom) : t;
    i = Promise.all(E0(e, a, s));
  }
  return i.then(() => {
    e.notify("AnimationComplete", t);
  });
}
function T0(e, t) {
  if (!Array.isArray(t)) return !1;
  const s = t.length;
  if (s !== e.length) return !1;
  for (let i = 0; i < s; i++) if (t[i] !== e[i]) return !1;
  return !0;
}
const uk = Id.length;
function C0(e) {
  if (!e) return;
  if (!e.isControllingVariants) {
    const s = e.parent ? C0(e.parent) || {} : {};
    return (e.props.initial !== void 0 && (s.initial = e.props.initial), s);
  }
  const t = {};
  for (let s = 0; s < uk; s++) {
    const i = Id[s],
      a = e.props[i];
    (Ei(a) || a === !1) && (t[i] = a);
  }
  return t;
}
const ck = [...Rd].reverse(),
  dk = Rd.length;
function fk(e) {
  return (t) => Promise.all(t.map(({ animation: s, options: i }) => lk(e, s, i)));
}
function pk(e) {
  let t = fk(e),
    s = ig(),
    i = !0;
  const a = (p) => (g, y) => {
    const v = ns(e, y, p === "exit" ? e.presenceContext?.custom : void 0);
    if (v) {
      const { transition: w, transitionEnd: E, ...b } = v;
      g = { ...g, ...b, ...E };
    }
    return g;
  };
  function u(p) {
    t = p(e);
  }
  function c(p) {
    const { props: g } = e,
      y = C0(e.parent) || {},
      v = [],
      w = new Set();
    let E = {},
      b = 1 / 0;
    for (let k = 0; k < dk; k++) {
      const R = ck[k],
        D = s[R],
        M = g[R] !== void 0 ? g[R] : y[R],
        $ = Ei(M),
        z = R === p ? D.isActive : null;
      z === !1 && (b = k);
      let J = M === y[R] && M !== g[R] && $;
      if (
        (J && i && e.manuallyAnimateOnMount && (J = !1),
        (D.protectedKeys = { ...E }),
        (!D.isActive && z === null) || (!M && !D.prevProp) || ja(M) || typeof M == "boolean")
      )
        continue;
      const te = hk(D.prevProp, M);
      let Q = te || (R === p && D.isActive && !J && $) || (k > b && $),
        fe = !1;
      const ce = Array.isArray(M) ? M : [M];
      let _e = ce.reduce(a(R), {});
      z === !1 && (_e = {});
      const { prevResolvedValues: Fe = {} } = D,
        et = { ...Fe, ..._e },
        at = (oe) => {
          ((Q = !0), w.has(oe) && ((fe = !0), w.delete(oe)), (D.needsAnimating[oe] = !0));
          const U = e.getValue(oe);
          U && (U.liveStyle = !1);
        };
      for (const oe in et) {
        const U = _e[oe],
          q = Fe[oe];
        if (E.hasOwnProperty(oe)) continue;
        let H = !1;
        (Oc(U) && Oc(q) ? (H = !T0(U, q)) : (H = U !== q),
          H
            ? U != null
              ? at(oe)
              : w.add(oe)
            : U !== void 0 && w.has(oe)
              ? at(oe)
              : (D.protectedKeys[oe] = !0));
      }
      ((D.prevProp = M),
        (D.prevResolvedValues = _e),
        D.isActive && (E = { ...E, ..._e }),
        i && e.blockInitialAnimation && (Q = !1));
      const gt = J && te;
      Q &&
        (!gt || fe) &&
        v.push(
          ...ce.map((oe) => {
            const U = { type: R };
            if (typeof oe == "string" && i && !gt && e.manuallyAnimateOnMount && e.parent) {
              const { parent: q } = e,
                H = ns(q, oe);
              if (q.enteringChildren && H) {
                const { delayChildren: N } = H.transition || {};
                U.delay = _0(q.enteringChildren, e, N);
              }
            }
            return { animation: oe, options: U };
          })
        );
    }
    if (w.size) {
      const k = {};
      if (typeof g.initial != "boolean") {
        const R = ns(e, Array.isArray(g.initial) ? g.initial[0] : g.initial);
        R && R.transition && (k.transition = R.transition);
      }
      (w.forEach((R) => {
        const D = e.getBaseTarget(R),
          M = e.getValue(R);
        (M && (M.liveStyle = !0), (k[R] = D ?? null));
      }),
        v.push({ animation: k }));
    }
    let A = !!v.length;
    return (
      i && (g.initial === !1 || g.initial === g.animate) && !e.manuallyAnimateOnMount && (A = !1),
      (i = !1),
      A ? t(v) : Promise.resolve()
    );
  }
  function f(p, g) {
    if (s[p].isActive === g) return Promise.resolve();
    (e.variantChildren?.forEach((v) => v.animationState?.setActive(p, g)), (s[p].isActive = g));
    const y = c(p);
    for (const v in s) s[v].protectedKeys = {};
    return y;
  }
  return {
    animateChanges: c,
    setActive: f,
    setAnimateFunction: u,
    getState: () => s,
    reset: () => {
      s = ig();
    },
  };
}
function hk(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !T0(t, e) : !1;
}
function ar(e = !1) {
  return { isActive: e, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function ig() {
  return {
    animate: ar(!0),
    whileInView: ar(),
    whileHover: ar(),
    whileTap: ar(),
    whileDrag: ar(),
    whileFocus: ar(),
    exit: ar(),
  };
}
class Gn {
  constructor(t) {
    ((this.isMounted = !1), (this.node = t));
  }
  update() {}
}
class mk extends Gn {
  constructor(t) {
    (super(t), t.animationState || (t.animationState = pk(t)));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    ja(t) && (this.unmountControls = t.subscribe(this.node));
  }
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(),
      { animate: s } = this.node.prevProps || {};
    t !== s && this.updateAnimationControlsSubscription();
  }
  unmount() {
    (this.node.animationState.reset(), this.unmountControls?.());
  }
}
let gk = 0;
class yk extends Gn {
  constructor() {
    (super(...arguments), (this.id = gk++));
  }
  update() {
    if (!this.node.presenceContext) return;
    const { isPresent: t, onExitComplete: s } = this.node.presenceContext,
      { isPresent: i } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === i) return;
    const a = this.node.animationState.setActive("exit", !t);
    s &&
      !t &&
      a.then(() => {
        s(this.id);
      });
  }
  mount() {
    const { register: t, onExitComplete: s } = this.node.presenceContext || {};
    (s && s(this.id), t && (this.unmount = t(this.id)));
  }
  unmount() {}
}
const vk = { animation: { Feature: mk }, exit: { Feature: yk } };
function _i(e, t, s, i = { passive: !0 }) {
  return (e.addEventListener(t, s, i), () => e.removeEventListener(t, s));
}
function Mi(e) {
  return { point: { x: e.pageX, y: e.pageY } };
}
const xk = (e) => (t) => Pd(t) && e(t, Mi(t));
function gi(e, t, s, i) {
  return _i(e, t, xk(s), i);
}
const k0 = 1e-4,
  wk = 1 - k0,
  Sk = 1 + k0,
  b0 = 0.01,
  Ek = 0 - b0,
  _k = 0 + b0;
function st(e) {
  return e.max - e.min;
}
function Tk(e, t, s) {
  return Math.abs(e - t) <= s;
}
function og(e, t, s, i = 0.5) {
  ((e.origin = i),
    (e.originPoint = je(t.min, t.max, e.origin)),
    (e.scale = st(s) / st(t)),
    (e.translate = je(s.min, s.max, e.origin) - e.originPoint),
    ((e.scale >= wk && e.scale <= Sk) || isNaN(e.scale)) && (e.scale = 1),
    ((e.translate >= Ek && e.translate <= _k) || isNaN(e.translate)) && (e.translate = 0));
}
function yi(e, t, s, i) {
  (og(e.x, t.x, s.x, i ? i.originX : void 0), og(e.y, t.y, s.y, i ? i.originY : void 0));
}
function ag(e, t, s) {
  ((e.min = s.min + t.min), (e.max = e.min + st(t)));
}
function Ck(e, t, s) {
  (ag(e.x, t.x, s.x), ag(e.y, t.y, s.y));
}
function lg(e, t, s) {
  ((e.min = t.min - s.min), (e.max = e.min + st(t)));
}
function _a(e, t, s) {
  (lg(e.x, t.x, s.x), lg(e.y, t.y, s.y));
}
function jt(e) {
  return [e("x"), e("y")];
}
const N0 = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
  ug = (e, t) => Math.abs(e - t);
function kk(e, t) {
  const s = ug(e.x, t.x),
    i = ug(e.y, t.y);
  return Math.sqrt(s ** 2 + i ** 2);
}
class j0 {
  constructor(
    t,
    s,
    {
      transformPagePoint: i,
      contextWindow: a = window,
      dragSnapToOrigin: u = !1,
      distanceThreshold: c = 3,
    } = {}
  ) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const w = ec(this.lastMoveEventInfo, this.history),
          E = this.startEvent !== null,
          b = kk(w.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!E && !b) return;
        const { point: A } = w,
          { timestamp: k } = Ke;
        this.history.push({ ...A, timestamp: k });
        const { onStart: R, onMove: D } = this.handlers;
        (E || (R && R(this.lastMoveEvent, w), (this.startEvent = this.lastMoveEvent)),
          D && D(this.lastMoveEvent, w));
      }),
      (this.handlePointerMove = (w, E) => {
        ((this.lastMoveEvent = w),
          (this.lastMoveEventInfo = Zu(E, this.transformPagePoint)),
          ke.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (w, E) => {
        this.end();
        const { onEnd: b, onSessionEnd: A, resumeAnimation: k } = this.handlers;
        if ((this.dragSnapToOrigin && k && k(), !(this.lastMoveEvent && this.lastMoveEventInfo)))
          return;
        const R = ec(
          w.type === "pointercancel" ? this.lastMoveEventInfo : Zu(E, this.transformPagePoint),
          this.history
        );
        (this.startEvent && b && b(w, R), A && A(w, R));
      }),
      !Pd(t))
    )
      return;
    ((this.dragSnapToOrigin = u),
      (this.handlers = s),
      (this.transformPagePoint = i),
      (this.distanceThreshold = c),
      (this.contextWindow = a || window));
    const f = Mi(t),
      p = Zu(f, this.transformPagePoint),
      { point: g } = p,
      { timestamp: y } = Ke;
    this.history = [{ ...g, timestamp: y }];
    const { onSessionStart: v } = s;
    (v && v(t, ec(p, this.history)),
      (this.removeListeners = Ri(
        gi(this.contextWindow, "pointermove", this.handlePointerMove),
        gi(this.contextWindow, "pointerup", this.handlePointerUp),
        gi(this.contextWindow, "pointercancel", this.handlePointerUp)
      )));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    (this.removeListeners && this.removeListeners(), Un(this.updatePoint));
  }
}
function Zu(e, t) {
  return t ? { point: t(e.point) } : e;
}
function cg(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function ec({ point: e }, t) {
  return { point: e, delta: cg(e, P0(t)), offset: cg(e, bk(t)), velocity: Nk(t, 0.1) };
}
function bk(e) {
  return e[0];
}
function P0(e) {
  return e[e.length - 1];
}
function Nk(e, t) {
  if (e.length < 2) return { x: 0, y: 0 };
  let s = e.length - 1,
    i = null;
  const a = P0(e);
  for (; s >= 0 && ((i = e[s]), !(a.timestamp - i.timestamp > Jt(t)));) s--;
  if (!i) return { x: 0, y: 0 };
  const u = Rt(a.timestamp - i.timestamp);
  if (u === 0) return { x: 0, y: 0 };
  const c = { x: (a.x - i.x) / u, y: (a.y - i.y) / u };
  return (c.x === 1 / 0 && (c.x = 0), c.y === 1 / 0 && (c.y = 0), c);
}
function jk(e, { min: t, max: s }, i) {
  return (
    t !== void 0 && e < t
      ? (e = i ? je(t, e, i.min) : Math.max(e, t))
      : s !== void 0 && e > s && (e = i ? je(s, e, i.max) : Math.min(e, s)),
    e
  );
}
function dg(e, t, s) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: s !== void 0 ? e.max + s - (e.max - e.min) : void 0,
  };
}
function Pk(e, { top: t, left: s, bottom: i, right: a }) {
  return { x: dg(e.x, s, a), y: dg(e.y, t, i) };
}
function fg(e, t) {
  let s = t.min - e.min,
    i = t.max - e.max;
  return (t.max - t.min < e.max - e.min && ([s, i] = [i, s]), { min: s, max: i });
}
function Rk(e, t) {
  return { x: fg(e.x, t.x), y: fg(e.y, t.y) };
}
function Ik(e, t) {
  let s = 0.5;
  const i = st(e),
    a = st(t);
  return (
    a > i ? (s = xi(t.min, t.max - i, e.min)) : i > a && (s = xi(e.min, e.max - a, t.min)),
    gn(0, 1, s)
  );
}
function Ak(e, t) {
  const s = {};
  return (
    t.min !== void 0 && (s.min = t.min - e.min),
    t.max !== void 0 && (s.max = t.max - e.min),
    s
  );
}
const Bc = 0.35;
function Mk(e = Bc) {
  return (
    e === !1 ? (e = 0) : e === !0 && (e = Bc),
    { x: pg(e, "left", "right"), y: pg(e, "top", "bottom") }
  );
}
function pg(e, t, s) {
  return { min: hg(e, t), max: hg(e, s) };
}
function hg(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const Dk = new WeakMap();
class Lk {
  constructor(t) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = $e()),
      (this.latestPointerEvent = null),
      (this.latestPanInfo = null),
      (this.visualElement = t));
  }
  start(t, { snapToCursor: s = !1, distanceThreshold: i } = {}) {
    const { presenceContext: a } = this.visualElement;
    if (a && a.isPresent === !1) return;
    const u = (v) => {
        const { dragSnapToOrigin: w } = this.getProps();
        (w ? this.pauseAnimation() : this.stopAnimation(), s && this.snapToCursor(Mi(v).point));
      },
      c = (v, w) => {
        const { drag: E, dragPropagation: b, onDragStart: A } = this.getProps();
        if (
          E &&
          !b &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = KT(E)),
          !this.openDragLock)
        )
          return;
        ((this.latestPointerEvent = v),
          (this.latestPanInfo = w),
          (this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          jt((R) => {
            let D = this.getAxisMotionValue(R).get() || 0;
            if (Zt.test(D)) {
              const { projection: M } = this.visualElement;
              if (M && M.layout) {
                const $ = M.layout.layoutBox[R];
                $ && (D = st($) * (parseFloat(D) / 100));
              }
            }
            this.originPoint[R] = D;
          }),
          A && ke.postRender(() => A(v, w)),
          Fc(this.visualElement, "transform"));
        const { animationState: k } = this.visualElement;
        k && k.setActive("whileDrag", !0);
      },
      f = (v, w) => {
        ((this.latestPointerEvent = v), (this.latestPanInfo = w));
        const {
          dragPropagation: E,
          dragDirectionLock: b,
          onDirectionLock: A,
          onDrag: k,
        } = this.getProps();
        if (!E && !this.openDragLock) return;
        const { offset: R } = w;
        if (b && this.currentDirection === null) {
          ((this.currentDirection = Ok(R)),
            this.currentDirection !== null && A && A(this.currentDirection));
          return;
        }
        (this.updateAxis("x", w.point, R),
          this.updateAxis("y", w.point, R),
          this.visualElement.render(),
          k && k(v, w));
      },
      p = (v, w) => {
        ((this.latestPointerEvent = v),
          (this.latestPanInfo = w),
          this.stop(v, w),
          (this.latestPointerEvent = null),
          (this.latestPanInfo = null));
      },
      g = () =>
        jt(
          (v) =>
            this.getAnimationState(v) === "paused" && this.getAxisMotionValue(v).animation?.play()
        ),
      { dragSnapToOrigin: y } = this.getProps();
    this.panSession = new j0(
      t,
      { onSessionStart: u, onStart: c, onMove: f, onSessionEnd: p, resumeAnimation: g },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: y,
        distanceThreshold: i,
        contextWindow: N0(this.visualElement),
      }
    );
  }
  stop(t, s) {
    const i = t || this.latestPointerEvent,
      a = s || this.latestPanInfo,
      u = this.isDragging;
    if ((this.cancel(), !u || !a || !i)) return;
    const { velocity: c } = a;
    this.startAnimation(c);
    const { onDragEnd: f } = this.getProps();
    f && ke.postRender(() => f(i, a));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: s } = this.visualElement;
    (t && (t.isAnimationBlocked = !1),
      this.panSession && this.panSession.end(),
      (this.panSession = void 0));
    const { dragPropagation: i } = this.getProps();
    (!i && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
      s && s.setActive("whileDrag", !1));
  }
  updateAxis(t, s, i) {
    const { drag: a } = this.getProps();
    if (!i || !ta(t, a, this.currentDirection)) return;
    const u = this.getAxisMotionValue(t);
    let c = this.originPoint[t] + i[t];
    (this.constraints && this.constraints[t] && (c = jk(c, this.constraints[t], this.elastic[t])),
      u.set(c));
  }
  resolveConstraints() {
    const { dragConstraints: t, dragElastic: s } = this.getProps(),
      i =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : this.visualElement.projection?.layout,
      a = this.constraints;
    (t && qr(t)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : t && i
        ? (this.constraints = Pk(i.layoutBox, t))
        : (this.constraints = !1),
      (this.elastic = Mk(s)),
      a !== this.constraints &&
        i &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        jt((u) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(u) &&
            (this.constraints[u] = Ak(i.layoutBox[u], this.constraints[u]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: s } = this.getProps();
    if (!t || !qr(t)) return !1;
    const i = t.current,
      { projection: a } = this.visualElement;
    if (!a || !a.layout) return !1;
    const u = FC(i, a.root, this.visualElement.getTransformPagePoint());
    let c = Rk(a.layout.layoutBox, u);
    if (s) {
      const f = s(DC(c));
      ((this.hasMutatedConstraints = !!f), f && (c = p0(f)));
    }
    return c;
  }
  startAnimation(t) {
    const {
        drag: s,
        dragMomentum: i,
        dragElastic: a,
        dragTransition: u,
        dragSnapToOrigin: c,
        onDragTransitionEnd: f,
      } = this.getProps(),
      p = this.constraints || {},
      g = jt((y) => {
        if (!ta(y, s, this.currentDirection)) return;
        let v = (p && p[y]) || {};
        c && (v = { min: 0, max: 0 });
        const w = a ? 200 : 1e6,
          E = a ? 40 : 1e7,
          b = {
            type: "inertia",
            velocity: i ? t[y] : 0,
            bounceStiffness: w,
            bounceDamping: E,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...u,
            ...v,
          };
        return this.startAxisValueAnimation(y, b);
      });
    return Promise.all(g).then(f);
  }
  startAxisValueAnimation(t, s) {
    const i = this.getAxisMotionValue(t);
    return (Fc(this.visualElement, t), i.start(Vd(t, i, 0, s, this.visualElement, !1)));
  }
  stopAnimation() {
    jt((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    jt((t) => this.getAxisMotionValue(t).animation?.pause());
  }
  getAnimationState(t) {
    return this.getAxisMotionValue(t).animation?.state;
  }
  getAxisMotionValue(t) {
    const s = `_drag${t.toUpperCase()}`,
      i = this.visualElement.getProps(),
      a = i[s];
    return a || this.visualElement.getValue(t, (i.initial ? i.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    jt((s) => {
      const { drag: i } = this.getProps();
      if (!ta(s, i, this.currentDirection)) return;
      const { projection: a } = this.visualElement,
        u = this.getAxisMotionValue(s);
      if (a && a.layout) {
        const { min: c, max: f } = a.layout.layoutBox[s];
        u.set(t[s] - je(c, f, 0.5));
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: t, dragConstraints: s } = this.getProps(),
      { projection: i } = this.visualElement;
    if (!qr(s) || !i || !this.constraints) return;
    this.stopAnimation();
    const a = { x: 0, y: 0 };
    jt((c) => {
      const f = this.getAxisMotionValue(c);
      if (f && this.constraints !== !1) {
        const p = f.get();
        a[c] = Ik({ min: p, max: p }, this.constraints[c]);
      }
    });
    const { transformTemplate: u } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = u ? u({}, "") : "none"),
      i.root && i.root.updateScroll(),
      i.updateLayout(),
      this.resolveConstraints(),
      jt((c) => {
        if (!ta(c, t, null)) return;
        const f = this.getAxisMotionValue(c),
          { min: p, max: g } = this.constraints[c];
        f.set(je(p, g, a[c]));
      }));
  }
  addListeners() {
    if (!this.visualElement.current) return;
    Dk.set(this.visualElement, this);
    const t = this.visualElement.current,
      s = gi(t, "pointerdown", (p) => {
        const { drag: g, dragListener: y = !0 } = this.getProps();
        g && y && this.start(p);
      }),
      i = () => {
        const { dragConstraints: p } = this.getProps();
        qr(p) && p.current && (this.constraints = this.resolveRefConstraints());
      },
      { projection: a } = this.visualElement,
      u = a.addEventListener("measure", i);
    (a && !a.layout && (a.root && a.root.updateScroll(), a.updateLayout()), ke.read(i));
    const c = _i(window, "resize", () => this.scalePositionWithinConstraints()),
      f = a.addEventListener("didUpdate", ({ delta: p, hasLayoutChanged: g }) => {
        this.isDragging &&
          g &&
          (jt((y) => {
            const v = this.getAxisMotionValue(y);
            v && ((this.originPoint[y] += p[y].translate), v.set(v.get() + p[y].translate));
          }),
          this.visualElement.render());
      });
    return () => {
      (c(), s(), u(), f && f());
    };
  }
  getProps() {
    const t = this.visualElement.getProps(),
      {
        drag: s = !1,
        dragDirectionLock: i = !1,
        dragPropagation: a = !1,
        dragConstraints: u = !1,
        dragElastic: c = Bc,
        dragMomentum: f = !0,
      } = t;
    return {
      ...t,
      drag: s,
      dragDirectionLock: i,
      dragPropagation: a,
      dragConstraints: u,
      dragElastic: c,
      dragMomentum: f,
    };
  }
}
function ta(e, t, s) {
  return (t === !0 || t === e) && (s === null || s === e);
}
function Ok(e, t = 10) {
  let s = null;
  return (Math.abs(e.y) > t ? (s = "y") : Math.abs(e.x) > t && (s = "x"), s);
}
class Fk extends Gn {
  constructor(t) {
    (super(t),
      (this.removeGroupControls = It),
      (this.removeListeners = It),
      (this.controls = new Lk(t)));
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    (t && (this.removeGroupControls = t.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || It));
  }
  unmount() {
    (this.removeGroupControls(), this.removeListeners());
  }
}
const mg = (e) => (t, s) => {
  e && ke.postRender(() => e(t, s));
};
class Vk extends Gn {
  constructor() {
    (super(...arguments), (this.removePointerDownListener = It));
  }
  onPointerDown(t) {
    this.session = new j0(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: N0(this.node),
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: s, onPan: i, onPanEnd: a } = this.node.getProps();
    return {
      onSessionStart: mg(t),
      onStart: mg(s),
      onMove: i,
      onEnd: (u, c) => {
        (delete this.session, a && ke.postRender(() => a(u, c)));
      },
    };
  }
  mount() {
    this.removePointerDownListener = gi(this.node.current, "pointerdown", (t) =>
      this.onPointerDown(t)
    );
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    (this.removePointerDownListener(), this.session && this.session.end());
  }
}
const da = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
let tc = !1;
class Bk extends _.Component {
  componentDidMount() {
    const { visualElement: t, layoutGroup: s, switchLayoutGroup: i, layoutId: a } = this.props,
      { projection: u } = t;
    (u &&
      (s.group && s.group.add(u),
      i && i.register && a && i.register(u),
      tc && u.root.didUpdate(),
      u.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }),
      u.setOptions({ ...u.options, onExitComplete: () => this.safeToRemove() })),
      (da.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: s, visualElement: i, drag: a, isPresent: u } = this.props,
      { projection: c } = i;
    return (
      c &&
        ((c.isPresent = u),
        (tc = !0),
        a || t.layoutDependency !== s || s === void 0 || t.isPresent !== u
          ? c.willUpdate()
          : this.safeToRemove(),
        t.isPresent !== u &&
          (u
            ? c.promote()
            : c.relegate() ||
              ke.postRender(() => {
                const f = c.getStack();
                (!f || !f.members.length) && this.safeToRemove();
              }))),
      null
    );
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t &&
      (t.root.didUpdate(),
      jd.postRender(() => {
        !t.currentAnimation && t.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: s, switchLayoutGroup: i } = this.props,
      { projection: a } = t;
    ((tc = !0),
      a &&
        (a.scheduleCheckAfterUnmount(),
        s && s.group && s.group.remove(a),
        i && i.deregister && i.deregister(a)));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function R0(e) {
  const [t, s] = nC(),
    i = _.useContext(lv);
  return h.jsx(Bk, {
    ...e,
    layoutGroup: i,
    switchLayoutGroup: _.useContext(d0),
    isPresent: t,
    safeToRemove: s,
  });
}
function $k(e, t, s) {
  const i = Ze(e) ? e : rs(e);
  return (i.start(Vd("", i, t, s)), i.animation);
}
const Uk = (e, t) => e.depth - t.depth;
class zk {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(t) {
    (dd(this.children, t), (this.isDirty = !0));
  }
  remove(t) {
    (fd(this.children, t), (this.isDirty = !0));
  }
  forEach(t) {
    (this.isDirty && this.children.sort(Uk), (this.isDirty = !1), this.children.forEach(t));
  }
}
function Hk(e, t) {
  const s = ht.now(),
    i = ({ timestamp: a }) => {
      const u = a - s;
      u >= t && (Un(i), e(u - t));
    };
  return (ke.setup(i, !0), () => Un(i));
}
const I0 = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  Wk = I0.length,
  gg = (e) => (typeof e == "string" ? parseFloat(e) : e),
  yg = (e) => typeof e == "number" || ne.test(e);
function Gk(e, t, s, i, a, u) {
  a
    ? ((e.opacity = je(0, s.opacity ?? 1, Kk(i))), (e.opacityExit = je(t.opacity ?? 1, 0, Yk(i))))
    : u && (e.opacity = je(t.opacity ?? 1, s.opacity ?? 1, i));
  for (let c = 0; c < Wk; c++) {
    const f = `border${I0[c]}Radius`;
    let p = vg(t, f),
      g = vg(s, f);
    if (p === void 0 && g === void 0) continue;
    (p || (p = 0),
      g || (g = 0),
      p === 0 || g === 0 || yg(p) === yg(g)
        ? ((e[f] = Math.max(je(gg(p), gg(g), i), 0)), (Zt.test(g) || Zt.test(p)) && (e[f] += "%"))
        : (e[f] = g));
  }
  (t.rotate || s.rotate) && (e.rotate = je(t.rotate || 0, s.rotate || 0, i));
}
function vg(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const Kk = A0(0, 0.5, xv),
  Yk = A0(0.5, 0.95, It);
function A0(e, t, s) {
  return (i) => (i < e ? 0 : i > t ? 1 : s(xi(e, t, i)));
}
function xg(e, t) {
  ((e.min = t.min), (e.max = t.max));
}
function $t(e, t) {
  (xg(e.x, t.x), xg(e.y, t.y));
}
function wg(e, t) {
  ((e.translate = t.translate),
    (e.scale = t.scale),
    (e.originPoint = t.originPoint),
    (e.origin = t.origin));
}
function Sg(e, t, s, i, a) {
  return ((e -= t), (e = Ea(e, 1 / s, i)), a !== void 0 && (e = Ea(e, 1 / a, i)), e);
}
function Xk(e, t = 0, s = 1, i = 0.5, a, u = e, c = e) {
  if (
    (Zt.test(t) && ((t = parseFloat(t)), (t = je(c.min, c.max, t / 100) - c.min)),
    typeof t != "number")
  )
    return;
  let f = je(u.min, u.max, i);
  (e === u && (f -= t), (e.min = Sg(e.min, t, s, f, a)), (e.max = Sg(e.max, t, s, f, a)));
}
function Eg(e, t, [s, i, a], u, c) {
  Xk(e, t[s], t[i], t[a], t.scale, u, c);
}
const qk = ["x", "scaleX", "originX"],
  Qk = ["y", "scaleY", "originY"];
function _g(e, t, s, i) {
  (Eg(e.x, t, qk, s ? s.x : void 0, i ? i.x : void 0),
    Eg(e.y, t, Qk, s ? s.y : void 0, i ? i.y : void 0));
}
function Tg(e) {
  return e.translate === 0 && e.scale === 1;
}
function M0(e) {
  return Tg(e.x) && Tg(e.y);
}
function Cg(e, t) {
  return e.min === t.min && e.max === t.max;
}
function Jk(e, t) {
  return Cg(e.x, t.x) && Cg(e.y, t.y);
}
function kg(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function D0(e, t) {
  return kg(e.x, t.x) && kg(e.y, t.y);
}
function bg(e) {
  return st(e.x) / st(e.y);
}
function Ng(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class Zk {
  constructor() {
    this.members = [];
  }
  add(t) {
    (dd(this.members, t), t.scheduleRender());
  }
  remove(t) {
    if ((fd(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead)) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(t) {
    const s = this.members.findIndex((a) => t === a);
    if (s === 0) return !1;
    let i;
    for (let a = s; a >= 0; a--) {
      const u = this.members[a];
      if (u.isPresent !== !1) {
        i = u;
        break;
      }
    }
    return i ? (this.promote(i), !0) : !1;
  }
  promote(t, s) {
    const i = this.lead;
    if (t !== i && ((this.prevLead = i), (this.lead = t), t.show(), i)) {
      (i.instance && i.scheduleRender(),
        t.scheduleRender(),
        (t.resumeFrom = i),
        s && (t.resumeFrom.preserveOpacity = !0),
        i.snapshot &&
          ((t.snapshot = i.snapshot),
          (t.snapshot.latestValues = i.animationValues || i.latestValues)),
        t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
      const { crossfade: a } = t.options;
      a === !1 && i.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: s, resumingFrom: i } = t;
      (s.onExitComplete && s.onExitComplete(),
        i && i.options.onExitComplete && i.options.onExitComplete());
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function eb(e, t, s) {
  let i = "";
  const a = e.x.translate / t.x,
    u = e.y.translate / t.y,
    c = s?.z || 0;
  if (
    ((a || u || c) && (i = `translate3d(${a}px, ${u}px, ${c}px) `),
    (t.x !== 1 || t.y !== 1) && (i += `scale(${1 / t.x}, ${1 / t.y}) `),
    s)
  ) {
    const { transformPerspective: g, rotate: y, rotateX: v, rotateY: w, skewX: E, skewY: b } = s;
    (g && (i = `perspective(${g}px) ${i}`),
      y && (i += `rotate(${y}deg) `),
      v && (i += `rotateX(${v}deg) `),
      w && (i += `rotateY(${w}deg) `),
      E && (i += `skewX(${E}deg) `),
      b && (i += `skewY(${b}deg) `));
  }
  const f = e.x.scale * t.x,
    p = e.y.scale * t.y;
  return ((f !== 1 || p !== 1) && (i += `scale(${f}, ${p})`), i || "none");
}
const nc = ["", "X", "Y", "Z"],
  tb = 1e3;
let nb = 0;
function rc(e, t, s, i) {
  const { latestValues: a } = t;
  a[e] && ((s[e] = a[e]), t.setStaticValue(e, 0), i && (i[e] = 0));
}
function L0(e) {
  if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return;
  const { visualElement: t } = e.options;
  if (!t) return;
  const s = S0(t);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: a, layoutId: u } = e.options;
    window.MotionCancelOptimisedAnimation(s, "transform", ke, !(a || u));
  }
  const { parent: i } = e;
  i && !i.hasCheckedOptimisedAppear && L0(i);
}
function O0({
  attachResizeListener: e,
  defaultParent: t,
  measureScroll: s,
  checkIsScrollRoot: i,
  resetTransform: a,
}) {
  return class {
    constructor(c = {}, f = t?.()) {
      ((this.id = nb++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            this.nodes.forEach(ib),
            this.nodes.forEach(ub),
            this.nodes.forEach(cb),
            this.nodes.forEach(ob));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = c),
        (this.root = f ? f.root || f : this),
        (this.path = f ? [...f.path, f] : []),
        (this.parent = f),
        (this.depth = f ? f.depth + 1 : 0));
      for (let p = 0; p < this.path.length; p++) this.path[p].shouldResetTransform = !0;
      this.root === this && (this.nodes = new zk());
    }
    addEventListener(c, f) {
      return (
        this.eventHandlers.has(c) || this.eventHandlers.set(c, new md()),
        this.eventHandlers.get(c).add(f)
      );
    }
    notifyListeners(c, ...f) {
      const p = this.eventHandlers.get(c);
      p && p.notify(...f);
    }
    hasListeners(c) {
      return this.eventHandlers.has(c);
    }
    mount(c) {
      if (this.instance) return;
      ((this.isSVG = Jv(c) && !ZT(c)), (this.instance = c));
      const { layoutId: f, layout: p, visualElement: g } = this.options;
      if (
        (g && !g.current && g.mount(c),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (p || f) && (this.isLayoutDirty = !0),
        e)
      ) {
        let y,
          v = 0;
        const w = () => (this.root.updateBlockedByResize = !1);
        (ke.read(() => {
          v = window.innerWidth;
        }),
          e(c, () => {
            const E = window.innerWidth;
            E !== v &&
              ((v = E),
              (this.root.updateBlockedByResize = !0),
              y && y(),
              (y = Hk(w, 250)),
              da.hasAnimatedSinceResize &&
                ((da.hasAnimatedSinceResize = !1), this.nodes.forEach(Rg)));
          }));
      }
      (f && this.root.registerSharedNode(f, this),
        this.options.animate !== !1 &&
          g &&
          (f || p) &&
          this.addEventListener(
            "didUpdate",
            ({ delta: y, hasLayoutChanged: v, hasRelativeLayoutChanged: w, layout: E }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const b = this.options.transition || g.getDefaultTransition() || mb,
                { onLayoutAnimationStart: A, onLayoutAnimationComplete: k } = g.getProps(),
                R = !this.targetLayout || !D0(this.targetLayout, E),
                D = !v && w;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                D ||
                (v && (R || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const M = { ...bd(b, "layout"), onPlay: A, onComplete: k };
                ((g.shouldReduceMotion || this.options.layoutRoot) &&
                  ((M.delay = 0), (M.type = !1)),
                  this.startAnimation(M),
                  this.setAnimationOrigin(y, D));
              } else
                (v || Rg(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete());
              this.targetLayout = E;
            }
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this));
      const c = this.getStack();
      (c && c.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        Un(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(db), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: c } = this.options;
      return c && c.getProps().transformTemplate;
    }
    willUpdate(c = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && L0(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let y = 0; y < this.path.length; y++) {
        const v = this.path[y];
        ((v.shouldResetTransform = !0),
          v.updateScroll("snapshot"),
          v.options.layoutRoot && v.willUpdate(!1));
      }
      const { layoutId: f, layout: p } = this.options;
      if (f === void 0 && !p) return;
      const g = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = g ? g(this.latestValues, "") : void 0),
        this.updateSnapshot(),
        c && this.notifyListeners("willUpdate"));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        (this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(jg));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Pg);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(lb),
            this.nodes.forEach(rb),
            this.nodes.forEach(sb))
          : this.nodes.forEach(Pg),
        this.clearAllSnapshots());
      const f = ht.now();
      ((Ke.delta = gn(0, 1e3 / 60, f - Ke.timestamp)),
        (Ke.timestamp = f),
        (Ke.isProcessing = !0),
        Wu.update.process(Ke),
        Wu.preRender.process(Ke),
        Wu.render.process(Ke),
        (Ke.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), jd.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(ab), this.sharedNodes.forEach(fb));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), ke.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      ke.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !st(this.snapshot.measuredBox.x) &&
          !st(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let p = 0; p < this.path.length; p++) this.path[p].updateScroll();
      const c = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected = $e()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox));
      const { visualElement: f } = this.options;
      f && f.notify("LayoutMeasure", this.layout.layoutBox, c ? c.layoutBox : void 0);
    }
    updateScroll(c = "measure") {
      let f = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === c &&
          (f = !1),
        f && this.instance)
      ) {
        const p = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: c,
          isRoot: p,
          offset: s(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : p,
        };
      }
    }
    resetTransform() {
      if (!a) return;
      const c = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        f = this.projectionDelta && !M0(this.projectionDelta),
        p = this.getTransformTemplate(),
        g = p ? p(this.latestValues, "") : void 0,
        y = g !== this.prevTransformTemplateValue;
      c &&
        this.instance &&
        (f || cr(this.latestValues) || y) &&
        (a(this.instance, g), (this.shouldResetTransform = !1), this.scheduleRender());
    }
    measure(c = !0) {
      const f = this.measurePageBox();
      let p = this.removeElementScroll(f);
      return (
        c && (p = this.removeTransform(p)),
        gb(p),
        {
          animationId: this.root.animationId,
          measuredBox: f,
          layoutBox: p,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      const { visualElement: c } = this.options;
      if (!c) return $e();
      const f = c.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(yb))) {
        const { scroll: g } = this.root;
        g && (Qr(f.x, g.offset.x), Qr(f.y, g.offset.y));
      }
      return f;
    }
    removeElementScroll(c) {
      const f = $e();
      if (($t(f, c), this.scroll?.wasRoot)) return f;
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p],
          { scroll: y, options: v } = g;
        g !== this.root &&
          y &&
          v.layoutScroll &&
          (y.wasRoot && $t(f, c), Qr(f.x, y.offset.x), Qr(f.y, y.offset.y));
      }
      return f;
    }
    applyTransform(c, f = !1) {
      const p = $e();
      $t(p, c);
      for (let g = 0; g < this.path.length; g++) {
        const y = this.path[g];
        (!f &&
          y.options.layoutScroll &&
          y.scroll &&
          y !== y.root &&
          Jr(p, { x: -y.scroll.offset.x, y: -y.scroll.offset.y }),
          cr(y.latestValues) && Jr(p, y.latestValues));
      }
      return (cr(this.latestValues) && Jr(p, this.latestValues), p);
    }
    removeTransform(c) {
      const f = $e();
      $t(f, c);
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p];
        if (!g.instance || !cr(g.latestValues)) continue;
        Mc(g.latestValues) && g.updateSnapshot();
        const y = $e(),
          v = g.measurePageBox();
        ($t(y, v), _g(f, g.latestValues, g.snapshot ? g.snapshot.layoutBox : void 0, y));
      }
      return (cr(this.latestValues) && _g(f, this.latestValues), f);
    }
    setTargetDelta(c) {
      ((this.targetDelta = c), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0));
    }
    setOptions(c) {
      this.options = {
        ...this.options,
        ...c,
        crossfade: c.crossfade !== void 0 ? c.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== Ke.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(c = !1) {
      const f = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = f.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = f.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = f.isSharedProjectionDirty));
      const p = !!this.resumingFrom || this !== f;
      if (!(
        c ||
        (p && this.isSharedProjectionDirty) ||
        this.isProjectionDirty ||
        this.parent?.isProjectionDirty ||
        this.attemptToResolveRelativeTarget ||
        this.root.updateBlockedByResize
      ))
        return;
      const { layout: y, layoutId: v } = this.options;
      if (!this.layout || !(y || v)) return;
      this.resolvedRelativeTargetAt = Ke.timestamp;
      const w = this.getClosestProjectingParent();
      (w &&
        this.linkedParentVersion !== w.layoutVersion &&
        !w.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (w && w.layout
            ? this.createRelativeTarget(w, this.layout.layoutBox, w.layout.layoutBox)
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target || ((this.target = $e()), (this.targetWithTransforms = $e())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              Ck(this.target, this.relativeTarget, this.relativeParent.target))
            : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : $t(this.target, this.layout.layoutBox),
                m0(this.target, this.targetDelta))
              : $t(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            w &&
            !!w.resumingFrom == !!this.resumingFrom &&
            !w.options.layoutScroll &&
            w.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(w, this.target, w.target)
              : (this.relativeParent = this.relativeTarget = void 0))));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Mc(this.parent.latestValues) || h0(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(c, f, p) {
      ((this.relativeParent = c),
        (this.linkedParentVersion = c.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = $e()),
        (this.relativeTargetOrigin = $e()),
        _a(this.relativeTargetOrigin, f, p),
        $t(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const c = this.getLead(),
        f = !!this.resumingFrom || this !== c;
      let p = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (p = !1),
        f && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = !1),
        this.resolvedRelativeTargetAt === Ke.timestamp && (p = !1),
        p)
      )
        return;
      const { layout: g, layoutId: y } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(g || y))
      )
        return;
      $t(this.layoutCorrected, this.layout.layoutBox);
      const v = this.treeScale.x,
        w = this.treeScale.y;
      (OC(this.layoutCorrected, this.treeScale, this.path, f),
        c.layout &&
          !c.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((c.target = c.layout.layoutBox), (c.targetWithTransforms = $e())));
      const { target: E } = c;
      if (!E) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (wg(this.prevProjectionDelta.x, this.projectionDelta.x),
          wg(this.prevProjectionDelta.y, this.projectionDelta.y)),
        yi(this.projectionDelta, this.layoutCorrected, E, this.latestValues),
        (this.treeScale.x !== v ||
          this.treeScale.y !== w ||
          !Ng(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !Ng(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", E)));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(c = !0) {
      if ((this.options.visualElement?.scheduleRender(), c)) {
        const f = this.getStack();
        f && f.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = Zr()),
        (this.projectionDelta = Zr()),
        (this.projectionDeltaWithTransform = Zr()));
    }
    setAnimationOrigin(c, f = !1) {
      const p = this.snapshot,
        g = p ? p.latestValues : {},
        y = { ...this.latestValues },
        v = Zr();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !f));
      const w = $e(),
        E = p ? p.source : void 0,
        b = this.layout ? this.layout.source : void 0,
        A = E !== b,
        k = this.getStack(),
        R = !k || k.members.length <= 1,
        D = !!(A && !R && this.options.crossfade === !0 && !this.path.some(hb));
      this.animationProgress = 0;
      let M;
      ((this.mixTargetDelta = ($) => {
        const z = $ / 1e3;
        (Ig(v.x, c.x, z),
          Ig(v.y, c.y, z),
          this.setTargetDelta(v),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (_a(w, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            pb(this.relativeTarget, this.relativeTargetOrigin, w, z),
            M && Jk(this.relativeTarget, M) && (this.isProjectionDirty = !1),
            M || (M = $e()),
            $t(M, this.relativeTarget)),
          A && ((this.animationValues = y), Gk(y, g, this.latestValues, z, D, R)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = z));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(c) {
      (this.notifyListeners("animationStart"),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation && (Un(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = ke.update(() => {
          ((da.hasAnimatedSinceResize = !0),
            this.motionValue || (this.motionValue = rs(0)),
            (this.currentAnimation = $k(this.motionValue, [0, 1e3], {
              ...c,
              velocity: 0,
              isSync: !0,
              onUpdate: (f) => {
                (this.mixTargetDelta(f), c.onUpdate && c.onUpdate(f));
              },
              onStop: () => {},
              onComplete: () => {
                (c.onComplete && c.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const c = this.getStack();
      (c && c.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners("animationComplete"));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(tb), this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const c = this.getLead();
      let { targetWithTransforms: f, target: p, layout: g, latestValues: y } = c;
      if (!(!f || !p || !g)) {
        if (
          this !== c &&
          this.layout &&
          g &&
          F0(this.options.animationType, this.layout.layoutBox, g.layoutBox)
        ) {
          p = this.target || $e();
          const v = st(this.layout.layoutBox.x);
          ((p.x.min = c.target.x.min), (p.x.max = p.x.min + v));
          const w = st(this.layout.layoutBox.y);
          ((p.y.min = c.target.y.min), (p.y.max = p.y.min + w));
        }
        ($t(f, p), Jr(f, y), yi(this.projectionDeltaWithTransform, this.layoutCorrected, f, y));
      }
    }
    registerSharedNode(c, f) {
      (this.sharedNodes.has(c) || this.sharedNodes.set(c, new Zk()),
        this.sharedNodes.get(c).add(f));
      const g = f.options.initialPromotionConfig;
      f.promote({
        transition: g ? g.transition : void 0,
        preserveFollowOpacity:
          g && g.shouldPreserveFollowOpacity ? g.shouldPreserveFollowOpacity(f) : void 0,
      });
    }
    isLead() {
      const c = this.getStack();
      return c ? c.lead === this : !0;
    }
    getLead() {
      const { layoutId: c } = this.options;
      return c ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: c } = this.options;
      return c ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: c } = this.options;
      if (c) return this.root.sharedNodes.get(c);
    }
    promote({ needsReset: c, transition: f, preserveFollowOpacity: p } = {}) {
      const g = this.getStack();
      (g && g.promote(this, p),
        c && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        f && this.setOptions({ transition: f }));
    }
    relegate() {
      const c = this.getStack();
      return c ? c.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: c } = this.options;
      if (!c) return;
      let f = !1;
      const { latestValues: p } = c;
      if (
        ((p.z || p.rotate || p.rotateX || p.rotateY || p.rotateZ || p.skewX || p.skewY) && (f = !0),
        !f)
      )
        return;
      const g = {};
      p.z && rc("z", c, g, this.animationValues);
      for (let y = 0; y < nc.length; y++)
        (rc(`rotate${nc[y]}`, c, g, this.animationValues),
          rc(`skew${nc[y]}`, c, g, this.animationValues));
      c.render();
      for (const y in g)
        (c.setStaticValue(y, g[y]), this.animationValues && (this.animationValues[y] = g[y]));
      c.scheduleRender();
    }
    applyProjectionStyles(c, f) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        c.visibility = "hidden";
        return;
      }
      const p = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (c.visibility = ""),
          (c.opacity = ""),
          (c.pointerEvents = ca(f?.pointerEvents) || ""),
          (c.transform = p ? p(this.latestValues, "") : "none"));
        return;
      }
      const g = this.getLead();
      if (!this.projectionDelta || !this.layout || !g.target) {
        (this.options.layoutId &&
          ((c.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1),
          (c.pointerEvents = ca(f?.pointerEvents) || "")),
          this.hasProjected &&
            !cr(this.latestValues) &&
            ((c.transform = p ? p({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      c.visibility = "";
      const y = g.animationValues || g.latestValues;
      this.applyTransformsToTarget();
      let v = eb(this.projectionDeltaWithTransform, this.treeScale, y);
      (p && (v = p(y, v)), (c.transform = v));
      const { x: w, y: E } = this.projectionDelta;
      ((c.transformOrigin = `${w.origin * 100}% ${E.origin * 100}% 0`),
        g.animationValues
          ? (c.opacity =
              g === this
                ? (y.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : y.opacityExit)
          : (c.opacity =
              g === this
                ? y.opacity !== void 0
                  ? y.opacity
                  : ""
                : y.opacityExit !== void 0
                  ? y.opacityExit
                  : 0));
      for (const b in Ac) {
        if (y[b] === void 0) continue;
        const { correct: A, applyTo: k, isCSSVariable: R } = Ac[b],
          D = v === "none" ? y[b] : A(y[b], g);
        if (k) {
          const M = k.length;
          for (let $ = 0; $ < M; $++) c[k[$]] = D;
        } else R ? (this.options.visualElement.renderState.vars[b] = D) : (c[b] = D);
      }
      this.options.layoutId && (c.pointerEvents = g === this ? ca(f?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((c) => c.currentAnimation?.stop()),
        this.root.nodes.forEach(jg),
        this.root.sharedNodes.clear());
    }
  };
}
function rb(e) {
  e.updateLayout();
}
function sb(e) {
  const t = e.resumeFrom?.snapshot || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: s, measuredBox: i } = e.layout,
      { animationType: a } = e.options,
      u = t.source !== e.layout.source;
    a === "size"
      ? jt((y) => {
          const v = u ? t.measuredBox[y] : t.layoutBox[y],
            w = st(v);
          ((v.min = s[y].min), (v.max = v.min + w));
        })
      : F0(a, t.layoutBox, s) &&
        jt((y) => {
          const v = u ? t.measuredBox[y] : t.layoutBox[y],
            w = st(s[y]);
          ((v.max = v.min + w),
            e.relativeTarget &&
              !e.currentAnimation &&
              ((e.isProjectionDirty = !0),
              (e.relativeTarget[y].max = e.relativeTarget[y].min + w)));
        });
    const c = Zr();
    yi(c, s, t.layoutBox);
    const f = Zr();
    u ? yi(f, e.applyTransform(i, !0), t.measuredBox) : yi(f, s, t.layoutBox);
    const p = !M0(c);
    let g = !1;
    if (!e.resumeFrom) {
      const y = e.getClosestProjectingParent();
      if (y && !y.resumeFrom) {
        const { snapshot: v, layout: w } = y;
        if (v && w) {
          const E = $e();
          _a(E, t.layoutBox, v.layoutBox);
          const b = $e();
          (_a(b, s, w.layoutBox),
            D0(E, b) || (g = !0),
            y.options.layoutRoot &&
              ((e.relativeTarget = b), (e.relativeTargetOrigin = E), (e.relativeParent = y)));
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: s,
      snapshot: t,
      delta: f,
      layoutDelta: c,
      hasLayoutChanged: p,
      hasRelativeLayoutChanged: g,
    });
  } else if (e.isLead()) {
    const { onExitComplete: s } = e.options;
    s && s();
  }
  e.options.transition = void 0;
}
function ib(e) {
  e.parent &&
    (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
    e.isSharedProjectionDirty ||
      (e.isSharedProjectionDirty = !!(
        e.isProjectionDirty ||
        e.parent.isProjectionDirty ||
        e.parent.isSharedProjectionDirty
      )),
    e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function ob(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function ab(e) {
  e.clearSnapshot();
}
function jg(e) {
  e.clearMeasurements();
}
function Pg(e) {
  e.isLayoutDirty = !1;
}
function lb(e) {
  const { visualElement: t } = e.options;
  (t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform());
}
function Rg(e) {
  (e.finishAnimation(),
    (e.targetDelta = e.relativeTarget = e.target = void 0),
    (e.isProjectionDirty = !0));
}
function ub(e) {
  e.resolveTargetDelta();
}
function cb(e) {
  e.calcProjection();
}
function db(e) {
  e.resetSkewAndRotation();
}
function fb(e) {
  e.removeLeadSnapshot();
}
function Ig(e, t, s) {
  ((e.translate = je(t.translate, 0, s)),
    (e.scale = je(t.scale, 1, s)),
    (e.origin = t.origin),
    (e.originPoint = t.originPoint));
}
function Ag(e, t, s, i) {
  ((e.min = je(t.min, s.min, i)), (e.max = je(t.max, s.max, i)));
}
function pb(e, t, s, i) {
  (Ag(e.x, t.x, s.x, i), Ag(e.y, t.y, s.y, i));
}
function hb(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const mb = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  Mg = (e) =>
    typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e),
  Dg = Mg("applewebkit/") && !Mg("chrome/") ? Math.round : It;
function Lg(e) {
  ((e.min = Dg(e.min)), (e.max = Dg(e.max)));
}
function gb(e) {
  (Lg(e.x), Lg(e.y));
}
function F0(e, t, s) {
  return e === "position" || (e === "preserve-aspect" && !Tk(bg(t), bg(s), 0.2));
}
function yb(e) {
  return e !== e.root && e.scroll?.wasRoot;
}
const vb = O0({
    attachResizeListener: (e, t) => _i(e, "resize", t),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  sc = { current: void 0 },
  V0 = O0({
    measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
    defaultParent: () => {
      if (!sc.current) {
        const e = new vb({});
        (e.mount(window), e.setOptions({ layoutScroll: !0 }), (sc.current = e));
      }
      return sc.current;
    },
    resetTransform: (e, t) => {
      e.style.transform = t !== void 0 ? t : "none";
    },
    checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed",
  }),
  xb = { pan: { Feature: Vk }, drag: { Feature: Fk, ProjectionNode: V0, MeasureLayout: R0 } };
function Og(e, t, s) {
  const { props: i } = e;
  e.animationState && i.whileHover && e.animationState.setActive("whileHover", s === "Start");
  const a = "onHover" + s,
    u = i[a];
  u && ke.postRender(() => u(t, Mi(t)));
}
class wb extends Gn {
  mount() {
    const { current: t } = this.node;
    t &&
      (this.unmount = YT(t, (s, i) => (Og(this.node, i, "Start"), (a) => Og(this.node, a, "End"))));
  }
  unmount() {}
}
class Sb extends Gn {
  constructor() {
    (super(...arguments), (this.isActive = !1));
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !0), (this.isActive = !0));
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !1), (this.isActive = !1));
  }
  mount() {
    this.unmount = Ri(
      _i(this.node.current, "focus", () => this.onFocus()),
      _i(this.node.current, "blur", () => this.onBlur())
    );
  }
  unmount() {}
}
function Fg(e, t, s) {
  const { props: i } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
  e.animationState && i.whileTap && e.animationState.setActive("whileTap", s === "Start");
  const a = "onTap" + (s === "End" ? "" : s),
    u = i[a];
  u && ke.postRender(() => u(t, Mi(t)));
}
class Eb extends Gn {
  mount() {
    const { current: t } = this.node;
    t &&
      (this.unmount = JT(
        t,
        (s, i) => (
          Fg(this.node, i, "Start"),
          (a, { success: u }) => Fg(this.node, a, u ? "End" : "Cancel")
        ),
        { useGlobalTarget: this.node.props.globalTapTarget }
      ));
  }
  unmount() {}
}
const $c = new WeakMap(),
  ic = new WeakMap(),
  _b = (e) => {
    const t = $c.get(e.target);
    t && t(e);
  },
  Tb = (e) => {
    e.forEach(_b);
  };
function Cb({ root: e, ...t }) {
  const s = e || document;
  ic.has(s) || ic.set(s, {});
  const i = ic.get(s),
    a = JSON.stringify(t);
  return (i[a] || (i[a] = new IntersectionObserver(Tb, { root: e, ...t })), i[a]);
}
function kb(e, t, s) {
  const i = Cb(t);
  return (
    $c.set(e, s),
    i.observe(e),
    () => {
      ($c.delete(e), i.unobserve(e));
    }
  );
}
const bb = { some: 0, all: 1 };
class Nb extends Gn {
  constructor() {
    (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(),
      { root: s, margin: i, amount: a = "some", once: u } = t,
      c = {
        root: s ? s.current : void 0,
        rootMargin: i,
        threshold: typeof a == "number" ? a : bb[a],
      },
      f = (p) => {
        const { isIntersecting: g } = p;
        if (this.isInView === g || ((this.isInView = g), u && !g && this.hasEnteredView)) return;
        (g && (this.hasEnteredView = !0),
          this.node.animationState && this.node.animationState.setActive("whileInView", g));
        const { onViewportEnter: y, onViewportLeave: v } = this.node.getProps(),
          w = g ? y : v;
        w && w(p);
      };
    return kb(this.node.current, c, f);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u") return;
    const { props: t, prevProps: s } = this.node;
    ["amount", "margin", "root"].some(jb(t, s)) && this.startObserver();
  }
  unmount() {}
}
function jb({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (s) => e[s] !== t[s];
}
const Pb = {
    inView: { Feature: Nb },
    tap: { Feature: Eb },
    focus: { Feature: Sb },
    hover: { Feature: wb },
  },
  Rb = { layout: { ProjectionNode: V0, MeasureLayout: R0 } },
  Ib = { ...vk, ...Pb, ...xb, ...Rb },
  B0 = MC(Ib, KC),
  Ab = {
    "/": {
      title: "Free Online Calculators & Tools – Fast, Accurate & Secure",
      description:
        "Use free online calculators for age, BMI, EMI, SIP, GST, salary, calories, speed test and more. Instant results, no signup required.",
    },
    "/age-calculator": {
      title: "Age Calculator Online – Exact Age in Years, Months & Days",
      description:
        "Calculate your exact age in years, months and days. Find next birthday and total days lived using this free age calculator.",
    },
    "/bmi-calculator": {
      title: "BMI Calculator – Check Body Mass Index Online",
      description:
        "Calculate your Body Mass Index (BMI) instantly using height and weight. Know your health category with this free BMI calculator.",
    },
    "/calorie-calculator": {
      title: "Calorie Calculator – Daily Calorie Needs & Diet Goals",
      description:
        "Calculate daily calorie needs based on age, height, weight, gender and activity level for weight loss or muscle gain.",
    },
    "/emi-calculator": {
      title: "EMI Calculator – Calculate Loan EMI Instantly",
      description:
        "Estimate monthly EMI, interest and total loan amount for home, car or personal loans using this free EMI calculator.",
    },
    "/sip-calculator": {
      title: "SIP Calculator – Estimate Mutual Fund Returns",
      description:
        "Calculate SIP investment returns and estimate future wealth easily with this free SIP calculator.",
    },
    "/gst-calculator": {
      title: "GST Calculator – Calculate GST Amount Online",
      description:
        "Calculate GST inclusive and exclusive amounts instantly. Supports CGST, SGST and IGST.",
    },
    "/salary-calculator": {
      title: "Salary Calculator – In-Hand Salary from CTC",
      description:
        "Calculate in-hand salary from CTC with detailed salary breakup including PF, taxes and deductions.",
    },
    "/speed-test": {
      title: "Internet Speed Test – Check Download & Upload Speed",
      description:
        "Test your internet download speed, upload speed and ping instantly using this fast online speed test.",
    },
    "/about": {
      title: "About Us – Free Online Tools & Calculators",
      description:
        "Learn more about Free Tools, offering fast, accurate and secure online calculators for everyday use.",
    },
    "/privacy-policy": {
      title: "Privacy Policy – Free Tools",
      description:
        "Read how Free Tools protects your privacy. We do not store personal data and use cookies responsibly.",
    },
  },
  Mb = "https://freetoolspro.in";
function Db() {
  const { pathname: e } = wn(),
    t = Ab[e] || {
      title: "Free Tools – Online Calculators & Utilities",
      description: "Free online calculators and tools for health, finance and daily use.",
    },
    s = `${Mb}${e}`;
  return h.jsxs(ds, {
    children: [
      h.jsx("title", { children: t.title }),
      h.jsx("meta", { name: "description", content: t.description }),
      h.jsx("link", { rel: "canonical", href: s }),
      h.jsx("meta", { property: "og:title", content: t.title }),
      h.jsx("meta", { property: "og:description", content: t.description }),
      h.jsx("meta", { property: "og:type", content: "website" }),
      h.jsx("meta", { property: "og:url", content: s }),
      h.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      h.jsx("meta", { name: "twitter:title", content: t.title }),
      h.jsx("meta", { name: "twitter:description", content: t.description }),
    ],
  });
}
function ms({
  title: e = "Free Online Tools – Calculators & Utilities",
  description:
    t = "Use free online tools like Age Calculator, BMI Calculator, EMI, SIP, GST, Salary Calculator and more. Fast, accurate, mobile-friendly.",
  keywords:
    s = "online calculators, free tools, age calculator, bmi calculator, emi calculator, sip calculator",
  canonical: i,
}) {
  return h.jsxs(ds, {
    children: [
      h.jsx("title", { children: e }),
      h.jsx("meta", { name: "description", content: t }),
      h.jsx("meta", { name: "keywords", content: s }),
      i && h.jsx("link", { rel: "canonical", href: i }),
      h.jsx("meta", { property: "og:title", content: e }),
      h.jsx("meta", { property: "og:description", content: t }),
      h.jsx("meta", { property: "og:type", content: "website" }),
      h.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      h.jsx("meta", { name: "twitter:title", content: e }),
      h.jsx("meta", { name: "twitter:description", content: t }),
    ],
  });
}
function Lb({ faqs: e = [] }) {
  if (!e.length) return null;
  const t = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: e.map((s) => ({
      "@type": "Question",
      name: s.q,
      acceptedAnswer: { "@type": "Answer", text: s.a },
    })),
  };
  return h.jsx(ds, {
    children: h.jsx("script", { type: "application/ld+json", children: JSON.stringify(t) }),
  });
}
const Ob = (e) => {
    const t = new Date().getHours(),
      s = window.innerWidth < 768;
    return t >= 5 && t < 12
      ? e.filter((i) => ["BMI Calculator", "Calorie Calculator", "Age Calculator"].includes(i.name))
      : t >= 17 || s
        ? e.filter((i) =>
            ["EMI Calculator", "SIP Calculator", "Salary Calculator"].includes(i.name)
          )
        : e.slice(0, 3);
  },
  $0 = [
    {
      title: "Health & Fitness",
      subtitle: "Track your health metrics easily",
      tools: [
        {
          id: 1,
          name: "Age Calculator",
          desc: "Calculate exact age, next birthday and total time lived.",
          path: "/age-calculator",
          icon: "🎂",
        },
        {
          id: 2,
          name: "BMI Calculator",
          desc: "Check your Body Mass Index instantly.",
          path: "/bmi-calculator",
          icon: "⚖️",
        },
        {
          id: 3,
          name: "Calorie Calculator",
          desc: "Calculate daily calorie needs.",
          path: "/calorie-calculator",
          icon: "🔥",
        },
      ],
    },
    {
      title: "Finance & Investment",
      subtitle: "Smart financial planning tools",
      tools: [
        {
          id: 4,
          name: "EMI Calculator",
          desc: "Calculate loan EMI instantly.",
          path: "/emi-calculator",
          icon: "💰",
        },
        {
          id: 5,
          name: "SIP Calculator",
          desc: "Estimate SIP returns easily.",
          path: "/sip-calculator",
          icon: "📈",
        },
        {
          id: 6,
          name: "Salary Calculator",
          desc: "Calculate in-hand salary from CTC.",
          path: "/salary-calculator",
          icon: "💼",
        },
        {
          id: 7,
          name: "GST Calculator",
          desc: "Calculate GST amount quickly.",
          path: "/gst-calculator",
          icon: "🧾",
        },
      ],
    },
    {
      title: "Other Utility Tools",
      subtitle: "Date, SEO and Internet utilities",
      tools: [
        {
          id: 8,
          name: "Date Difference",
          desc: "Find difference between two dates.",
          path: "/date-difference",
          icon: "📅",
        },
        {
          id: 9,
          name: "Meta Tag Generator",
          desc: "Generate SEO-friendly meta tags.",
          path: "/metataggenerator",
          icon: "🏷️",
        },
        {
          id: 10,
          name: "Net Speed Test",
          desc: "Test your internet speed instantly.",
          path: "/speed-test",
          icon: "🚀",
        },
      ],
    },
  ],
  Fb = $0.flatMap((e) => e.tools).slice(0, 6);
function Vb() {
  return h.jsxs(h.Fragment, {
    children: [
      h.jsxs("main", {
        className: "min-h-screen",
        children: [
          h.jsxs("section", {
            className: "relative overflow-hidden py-24 px-4 mb-16",
            children: [
              h.jsx("div", {
                className:
                  "absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700",
              }),
              h.jsxs("div", {
                className: "relative z-10 max-w-6xl mx-auto text-center text-white",
                children: [
                  h.jsxs("h1", {
                    className: "text-4xl md:text-6xl font-extrabold mb-6",
                    children: [
                      "Free Online Calculators ",
                      h.jsx("br", {}),
                      h.jsx("span", {
                        className: "text-yellow-300",
                        children: "Built for Everyday Life",
                      }),
                    ],
                  }),
                  h.jsxs("p", {
                    className: "max-w-2xl mx-auto text-lg mb-10",
                    children: [
                      "Calculate Age, BMI, Calories, EMI, SIP Returns and more ",
                      h.jsx("br", {}),
                      " — Fast, Accurate and 100% FREE.",
                    ],
                  }),
                  h.jsx("a", {
                    href: "#tools",
                    className:
                      "bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl shadow hover:scale-105 transition btnButtons",
                    children: "Explore Free Tools",
                  }),
                ],
              }),
            ],
          }),
          h.jsxs("section", {
            id: "tools",
            className: "max-w-6xl mx-auto px-4",
            children: [
              h.jsxs("h2", {
                className: "text-4xl font-bold text-center mb-4 subtitle",
                children: ["Free ", h.jsx("span", { children: "Online Calculators" })],
              }),
              h.jsx("p", {
                className: "text-center text-gray-600 mb-12",
                children: "Simple, fast and accurate tools — mobile friendly & free forever",
              }),
              $0.map((e) =>
                h.jsxs(
                  "div",
                  {
                    className: "mb-16",
                    children: [
                      h.jsx("h3", {
                        className: "text-2xl font-bold mb-1 subCategory",
                        children: e.title,
                      }),
                      h.jsx("p", { className: "text-gray-500 mb-6", children: e.subtitle }),
                      h.jsx("div", {
                        className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center",
                        children: e.tools.map((t) =>
                          h.jsxs(
                            mt,
                            {
                              to: t.path,
                              className:
                                "bg-white p-6 rounded-2xl shadow hover:shadow-xl transition",
                              children: [
                                h.jsx("div", { className: "text-4xl mb-3", children: t.icon }),
                                h.jsx("h4", { className: "font-semibold mb-1", children: t.name }),
                                h.jsx("p", {
                                  className: "text-sm text-gray-600",
                                  children: t.desc,
                                }),
                              ],
                            },
                            t.id
                          )
                        ),
                      }),
                    ],
                  },
                  e.title
                )
              ),
            ],
          }),
          h.jsxs("section", {
            "aria-labelledby": "popular-tools",
            className: "relative max-w-6xl mx-auto px-4 py-20",
            children: [
              h.jsx("div", {
                className:
                  "absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl",
              }),
              h.jsxs("header", {
                className: "text-center mb-14",
                children: [
                  h.jsx("h2", {
                    id: "popular-tools",
                    className: "text-3xl md:text-4xl font-extrabold text-gray-900",
                    children: "Popular Free Tools People Use Daily",
                  }),
                  h.jsx("p", {
                    className: "mt-3 text-gray-600 max-w-xl mx-auto",
                    children:
                      "AI-recommended calculators based on time, device and daily usage trends.",
                  }),
                ],
              }),
              h.jsx("div", {
                className: "grid sm:grid-cols-2 md:grid-cols-3 gap-8",
                children: Ob(Fb).map((e, t) =>
                  h.jsx(
                    mt,
                    {
                      to: e.path,
                      className:
                        "group relative rounded-3xl p-[1px] bg-gradient-to-br from-indigo-400/40 via-purple-400/40 to-pink-400/40",
                      children: h.jsxs("div", {
                        className:
                          "h-full rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1",
                        children: [
                          t === 0 &&
                            h.jsx("span", {
                              className:
                                "absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow",
                              children: "🔥 Most Used Today",
                            }),
                          h.jsx("div", {
                            className:
                              "text-4xl mb-4 transition-transform duration-300 group-hover:scale-110",
                            children: e.icon,
                          }),
                          h.jsx("h3", {
                            className: "font-bold text-lg text-gray-900 mb-1",
                            children: e.name,
                          }),
                          h.jsx("p", { className: "text-sm text-gray-600 mb-4", children: e.desc }),
                          h.jsxs("div", {
                            className: "flex items-center justify-between text-xs text-gray-500",
                            children: [
                              h.jsx("span", { children: "⚡ Fast & Accurate" }),
                              h.jsxs("span", {
                                children: [
                                  "👥 ",
                                  Math.floor(Math.random() * 900 + 100),
                                  "K+ users",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    },
                    e.id
                  )
                ),
              }),
            ],
          }),
        ],
      }),
      h.jsx(Lb, {
        faqs: [
          {
            q: "Are these calculators free to use?",
            a: "Yes, all calculators are 100% free with no signup required.",
          },
          {
            q: "Are results accurate?",
            a: "Yes, calculators use standard formulas and are tested for accuracy.",
          },
          { q: "Is my data stored?", a: "No, all calculations happen locally in your browser." },
        ],
      }),
    ],
  });
}
function Bb() {
  return h.jsxs("section", {
    className: "relative overflow-hidden py-20 px-4",
    children: [
      h.jsx("div", {
        className:
          "absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-pulse",
      }),
      h.jsx("div", {
        className:
          "absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30",
      }),
      h.jsx("div", {
        className:
          "absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30",
      }),
      h.jsxs("div", {
        className: "relative max-w-5xl mx-auto glass glow rounded-3xl p-10 text-center",
        children: [
          h.jsx("h1", {
            className: "text-4xl md:text-5xl font-extrabold text-white mb-4",
            children: "Dev & SEO Tools",
          }),
          h.jsx("p", {
            className: "text-white/80 max-w-xl mx-auto",
            children: "Free blazing-fast developer & technical SEO tools with modern glass UI.",
          }),
          h.jsxs("div", {
            className: "mt-8 flex flex-wrap justify-center gap-4",
            children: [
              h.jsx("span", {
                className: "px-4 py-2 rounded-full glass text-white text-sm",
                children: "⚡ 100% Free",
              }),
              h.jsx("span", {
                className: "px-4 py-2 rounded-full glass text-white text-sm",
                children: "🔐 No Signup",
              }),
              h.jsx("span", {
                className: "px-4 py-2 rounded-full glass text-white text-sm",
                children: "🚀 SEO-Ready",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Yr({ title: e, desc: t, to: s }) {
  return h.jsx(mt, {
    to: s,
    children: h.jsxs("div", {
      className:
        "relative group glass glow rounded-2xl p-6 transition transform hover:-translate-y-2",
      children: [
        h.jsx("div", {
          className:
            "absolute inset-0 rounded-2xl bg-indigo-500 opacity-0 group-hover:opacity-10 blur-xl transition",
        }),
        h.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: e }),
        h.jsx("p", { className: "text-white/70 text-sm", children: t }),
      ],
    }),
  });
}
function $b() {
  return h.jsxs("main", {
    className: "min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black",
    children: [
      h.jsx(Bb, {}),
      h.jsxs("section", {
        className: "max-w-6xl mx-auto px-4 pb-20",
        children: [
          h.jsx("h2", {
            className: "text-white text-2xl font-bold mb-8 text-center",
            children: "Developer & Technical SEO Tools",
          }),
          h.jsxs("div", {
            className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
            children: [
              h.jsx(Yr, {
                title: "Meta Tag Generator",
                desc: "Generate SEO-friendly meta tags instantly.",
                to: "/dev/meta-tag-generator",
              }),
              h.jsx(Yr, {
                title: "JSON Formatter",
                desc: "Format & validate JSON data.",
                to: "/dev/json-formatter",
              }),
              h.jsx(Yr, {
                title: "JWT Decoder",
                desc: "Decode JWT tokens securely in-browser.",
                to: "/dev/jwt-decoder",
              }),
              h.jsx(Yr, {
                title: "Base64 Encoder",
                desc: "Encode & decode Base64 strings.",
                to: "/dev/base64",
              }),
              h.jsx(Yr, {
                title: "Sitemap Generator",
                desc: "Create XML sitemaps easily.",
                to: "/dev/sitemap",
              }),
              h.jsx(Yr, {
                title: "Robots.txt Generator",
                desc: "Generate robots.txt files for SEO.",
                to: "/dev/robots",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Ub({ faqs: e = [] }) {
  if (!e.length) return null;
  const t = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: e.map((s) => ({
      "@type": "Question",
      name: s.q,
      acceptedAnswer: { "@type": "Answer", text: s.a },
    })),
  };
  return h.jsx(ds, {
    children: h.jsx("script", { type: "application/ld+json", children: JSON.stringify(t) }),
  });
}
const zb = "G-XXXXXXXXXX",
  Hb = (e) => {
    typeof window.gtag < "u" && window.gtag("config", zb, { page_path: e });
  },
  U0 = ({ action: e, category: t, label: s, value: i }) => {
    typeof window.gtag < "u" &&
      window.gtag("event", e, { event_category: t, event_label: s, value: i });
  };
function Wb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(null),
    [a, u] = _.useState(""),
    c = () => {
      if (!e) {
        (u("Please select your date of birth"), i(null));
        return;
      }
      u("");
      const f = new Date(e),
        p = new Date();
      let g = p.getFullYear() - f.getFullYear(),
        y = p.getMonth() - f.getMonth(),
        v = p.getDate() - f.getDate();
      (v < 0 && (y--, (v += new Date(p.getFullYear(), p.getMonth(), 0).getDate())),
        y < 0 && (g--, (y += 12)));
      const w = Math.floor((p - f) / 864e5),
        E = Math.floor(w / 7),
        b = w * 24,
        A = new Date(p.getFullYear(), f.getMonth(), f.getDate());
      A < p && A.setFullYear(p.getFullYear() + 1);
      const k = Math.ceil((A - p) / 864e5);
      (i({
        years: g,
        months: y,
        days: v,
        totalDays: w,
        totalWeeks: E,
        totalHours: b,
        daysToBirthday: k,
      }),
        trackToolUse("Age Calculator"),
        U0({ action: "calculate", category: "Age Calculator", label: "Age calculated" }));
    };
  return h.jsx("div", {
    children: h.jsxs("div", {
      className: "min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50  px-4",
      children: [
        h.jsx("div", {
          className: "max-w-2xl mx-auto flex mx-auto items-center justify-center pt-10",
          children: h.jsxs("section", {
            className: `relative w-full max-w-md p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl\r
              shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]`,
            children: [
              h.jsx("div", {
                className:
                  "absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur opacity-25",
              }),
              h.jsxs("div", {
                className: "relative",
                children: [
                  h.jsx("h1", {
                    className: "text-3xl font-black text-center text-gray-900",
                    children: "🎉 Age Calculator",
                  }),
                  h.jsx("p", {
                    className: "text-center text-sm text-gray-500 mt-2 mb-8",
                    children: "Know your exact age in seconds",
                  }),
                  h.jsxs("div", {
                    className: "relative mb-6",
                    children: [
                      h.jsx("input", {
                        type: "date",
                        value: e,
                        max: new Date().toISOString().split("T")[0],
                        onChange: (f) => t(f.target.value),
                        className: `peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-6 pb-3\r
                    text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-400/40\r
                    outline-none transition`,
                      }),
                      h.jsx("label", {
                        className: `absolute left-4 top-2 text-xs text-gray-500\r
                    peer-focus:text-blue-600`,
                        children: "Date of Birth",
                      }),
                    ],
                  }),
                  h.jsx("button", {
                    onClick: c,
                    disabled: !e,
                    className: `w-full py-3 rounded-xl font-semibold text-white
                    transition-all duration-300
                    ${e ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.03] hover:shadow-xl" : "bg-gray-300 cursor-not-allowed"}
                  `,
                    children: "Calculate Age",
                  }),
                  a &&
                    h.jsxs("p", {
                      className:
                        "mt-4 text-center text-sm font-semibold text-red-600 animate-shake",
                      children: ["⚠️ ", a],
                    }),
                  s &&
                    h.jsxs("div", {
                      className: "mt-8 text-center space-y-4 animate-fadeIn",
                      children: [
                        h.jsxs("p", {
                          className: "text-2xl font-extrabold text-gray-900",
                          children: [s.years, "y · ", s.months, "m · ", s.days, "d"],
                        }),
                        h.jsxs("p", {
                          className: "text-sm text-gray-600",
                          children: [
                            "🎂 Next birthday in ",
                            h.jsx("b", { children: s.daysToBirthday }),
                            " days",
                          ],
                        }),
                        h.jsx("div", {
                          className: "grid grid-cols-3 gap-4 mt-6",
                          children: [
                            { label: "Days", value: s.totalDays },
                            { label: "Weeks", value: s.totalWeeks },
                            { label: "Hours", value: s.totalHours },
                          ].map((f, p) =>
                            h.jsxs(
                              "div",
                              {
                                className: `rounded-xl bg-white p-4 shadow-md hover:shadow-xl\r
                          hover:-translate-y-1 transition-all`,
                                children: [
                                  h.jsx("p", {
                                    className: "text-xl font-extrabold text-indigo-600",
                                    children: f.value,
                                  }),
                                  h.jsx("p", {
                                    className: "text-xs text-gray-500",
                                    children: f.label,
                                  }),
                                ],
                              },
                              p
                            )
                          ),
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
        }),
        h.jsx("section", {
          className: "max-w-4xl mx-auto text-left mb-6 pt-10 pb-4",
          children: h.jsxs("p", {
            className: "text-gray-600 text-1xl leading-relaxed text-left",
            children: [
              "Use our ",
              h.jsx("strong", { children: "free Age Calculator" }),
              " to find your exact age in",
              h.jsx("strong", { children: " years, months, and days" }),
              ". Simply enter your date of birth and get instant results including your next birthday countdown. This tool works accurately for leap years and all date formats.",
            ],
          }),
        }),
        h.jsxs("section", {
          className: "max-w-4xl mx-auto mt-2 pb-10",
          children: [
            h.jsx("h2", {
              className: "text-2xl font-bold mb-4",
              children: "Frequently Asked Questions",
            }),
            h.jsx("div", {
              className: "space-y-4 text-1xl text-gray-700",
              children: h.jsxs("ul", {
                className: "list-disc list-outside space-y-5 pl-6 text-gray-700",
                children: [
                  h.jsxs("li", {
                    className: "marker:text-blue-600",
                    children: [
                      h.jsx("h3", {
                        className: "font-semibold text-gray-900",
                        children: "Is this age calculator accurate?",
                      }),
                      h.jsx("p", {
                        className: "mt-1 text-sm leading-relaxed text-gray-600",
                        children:
                          "Yes, the calculator uses precise date calculations and correctly handles leap years and different month lengths.",
                      }),
                    ],
                  }),
                  h.jsxs("li", {
                    className: "marker:text-blue-600",
                    children: [
                      h.jsx("h3", {
                        className: "font-semibold text-gray-900",
                        children: "Does this age calculator store my data?",
                      }),
                      h.jsx("p", {
                        className: "mt-1 text-sm leading-relaxed text-gray-600",
                        children:
                          "No. All calculations happen directly in your browser and no data is saved or sent to any server.",
                      }),
                    ],
                  }),
                  h.jsxs("li", {
                    className: "marker:text-blue-600",
                    children: [
                      h.jsx("h3", {
                        className: "font-semibold text-gray-900",
                        children: "Can I calculate age for any date?",
                      }),
                      h.jsx("p", {
                        className: "mt-1 text-sm leading-relaxed text-gray-600",
                        children: "Yes, you can calculate age for any past date using this tool.",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        h.jsx(Ub, {
          faqs: [
            {
              q: "How does the Age Calculator work?",
              a: "It calculates your exact age using your date of birth in years, months, and days.",
            },
            {
              q: "Is this age calculator free to use?",
              a: "Yes, this tool is completely free and requires no signup.",
            },
            {
              q: "Can I calculate my age in days?",
              a: "Yes, the calculator shows your total days lived.",
            },
          ],
        }),
      ],
    }),
  });
}
function Gb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(null),
    [c, f] = _.useState(""),
    [p, g] = _.useState(""),
    y = () => {
      if ((g(""), u(null), f(""), !e || !s)) {
        g("⚠️ Please enter both height and weight");
        return;
      }
      if (e <= 0 || s <= 0) {
        g("⚠️ Values must be greater than zero");
        return;
      }
      const v = e / 100,
        w = Number((s / v ** 2).toFixed(1));
      (u(w),
        w < 18.5 ? f("Underweight") : w < 25 ? f("Normal") : w < 30 ? f("Overweight") : f("Obese"));
    };
  return h.jsx("div", {
    children: h.jsxs("div", {
      className:
        "min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 pt-10 pb-10",
      children: [
        h.jsxs("section", {
          className:
            "max-w-2xl mx-auto flex items-center justify-center relative rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-4 pb-10",
          children: [
            h.jsx("div", {
              className:
                "absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 blur opacity-20",
            }),
            h.jsxs("div", {
              className: "relative",
              children: [
                h.jsx("h1", {
                  className: "text-3xl font-extrabold text-center mb-2",
                  children: "🧮 BMI Calculator",
                }),
                h.jsx("p", {
                  className: "text-center text-sm text-gray-500 mb-6",
                  children: "Calculate your Body Mass Index instantly",
                }),
                h.jsx("input", {
                  type: "number",
                  placeholder: "Height (cm)",
                  className: `w-full border border-gray-300 rounded-xl p-4 mb-3\r
                        focus:outline-none focus:ring-4 focus:ring-green-200 inputbg`,
                  value: e,
                  onChange: (v) => t(v.target.value),
                }),
                h.jsx("input", {
                  type: "number",
                  placeholder: "Weight (kg)",
                  className: `w-full border border-gray-300 rounded-xl p-4 mb-4\r
                        focus:outline-none focus:ring-4 focus:ring-green-200 inputbg`,
                  value: s,
                  onChange: (v) => i(v.target.value),
                }),
                p &&
                  h.jsx("p", {
                    className: "mb-4 text-sm text-red-600 text-center font-medium",
                    children: p,
                  }),
                h.jsx("button", {
                  onClick: y,
                  className: `w-full bg-gradient-to-r from-green-600 to-emerald-600\r
                        text-white py-4 rounded-xl font-semibold\r
                        hover:scale-[1.02] transition-transform\r
                        shadow-lg shadow-green-200`,
                  children: "Calculate BMI",
                }),
                a &&
                  h.jsxs("div", {
                    className: "mt-6 text-center space-y-2 animate-fadeIn",
                    children: [
                      h.jsx("section", {
                        "aria-live": "polite",
                        children: h.jsxs("p", {
                          children: ["BMI: ", h.jsx("strong", { children: a })],
                        }),
                      }),
                      h.jsxs("p", {
                        className: "text-sm text-gray-600",
                        children: ["Category: ", h.jsx("strong", { children: c })],
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
        h.jsxs("section", {
          className: "max-w-4xl mx-auto text-left mb-6 pt-10 pb-10",
          children: [
            h.jsx("h2", { className: "text-1xl font-bold mb-2", children: "What is BMI?" }),
            h.jsx("p", {
              className: "text-1xl",
              children:
                "Body Mass Index (BMI) is a simple calculation using height and weight to determine whether a person has a healthy body weight.",
            }),
            h.jsx("h3", {
              className: "font-semibold mt-4 text-1xl font-bold mb-2",
              children: "BMI Categories",
            }),
            h.jsxs("ul", {
              className: "list-disc pl-10 text-1xl pb-3 leading-10",
              children: [
                h.jsx("li", { children: "Underweight: Below 18.5" }),
                h.jsx("li", { children: "Normal weight: 18.5 – 24.9" }),
                h.jsx("li", { children: "Overweight: 25 – 29.9" }),
                h.jsx("li", { children: "Obese: 30 and above" }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function Kb(e, t = 500) {
  const [s, i] = _.useState(0);
  return (
    _.useEffect(() => {
      let a = 0;
      const u = e / (t / 16 || 1),
        c = setInterval(() => {
          ((a += u), a >= e ? (i(e), clearInterval(c)) : i(a));
        }, 16);
      return () => clearInterval(c);
    }, [e, t]),
    s
  );
}
function Yb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(null),
    [c, f] = _.useState(!0),
    [p, g] = _.useState(!1);
  _.useEffect(() => {
    if (!e || !s) return;
    const b = new Date(e),
      A = new Date(s);
    if (b > A) {
      (g(!0), u(null));
      return;
    }
    g(!1);
    let k = Math.floor((A - b) / (1e3 * 60 * 60 * 24));
    (c && (k += 1), u(k));
  }, [e, s, c]);
  const v = (() => {
      if (!e || !s || a === null) return null;
      let b = 0,
        A = 0,
        k = 0;
      const R = new Date(e),
        D = new Date(s);
      for (; R <= D;) {
        const M = R.getDay();
        (M === 0 || M === 6 ? A++ : b++,
          R.getMonth() === 1 && R.getDate() === 29 && k++,
          R.setDate(R.getDate() + 1));
      }
      return { workdays: b, weekends: A, leapDays: k };
    })(),
    w = Kb(a || 0),
    E = () => i(new Date().toISOString().split("T")[0]);
  return h.jsxs("main", {
    className:
      "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-4",
    children: [
      h.jsx(ms, {
        title: "Advanced Date Difference Calculator",
        description: "Calculate days, working days, weekends, leap days between dates.",
      }),
      h.jsxs("section", {
        className: `relative w-full max-w-md rounded-3xl backdrop-blur-xl border p-8 transition ${p ? "bg-red-500/10 border-red-400 shadow-[0_0_40px_rgba(248,113,113,0.6)]" : "bg-white/10 border-white/20 shadow-[0_0_70px_rgba(99,102,241,0.45)]"}`,
        children: [
          h.jsx("div", {
            className:
              "absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur opacity-30",
          }),
          h.jsxs("div", {
            className: "relative",
            children: [
              h.jsx("h1", {
                className: "text-3xl font-extrabold text-center text-white mb-2",
                children: "📅 Date Difference",
              }),
              h.jsx("p", {
                className: "text-center text-sm text-white/70 mb-6",
                children: "Smart • Auto • Timeline Aware",
              }),
              h.jsx("label", { className: "text-white/80 text-sm", children: "Start Date" }),
              h.jsx("input", {
                type: "date",
                value: e,
                onChange: (b) => t(b.target.value),
                className:
                  "w-full mb-4 mt-1 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3",
              }),
              h.jsxs("label", {
                className: "text-white/80 text-sm flex justify-between",
                children: [
                  "End Date",
                  h.jsx("button", {
                    onClick: E,
                    className: "text-xs text-cyan-400",
                    children: "Today",
                  }),
                ],
              }),
              h.jsx("input", {
                type: "date",
                value: s,
                onChange: (b) => i(b.target.value),
                className:
                  "w-full mb-3 mt-1 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3",
              }),
              h.jsxs("label", {
                className: "flex items-center gap-2 text-white/80 text-sm mb-4",
                children: [
                  h.jsx("input", { type: "checkbox", checked: c, onChange: () => f(!c) }),
                  "Include end date",
                ],
              }),
              p &&
                h.jsx("p", {
                  className: "text-red-400 text-sm mb-3",
                  children: "End date must be after start date",
                }),
              a !== null &&
                !p &&
                h.jsxs("div", {
                  className:
                    "mt-4 rounded-2xl bg-black/40 border border-white/20 p-5 text-center text-white",
                  children: [
                    h.jsx("p", { className: "text-sm text-white/60", children: "Total Days" }),
                    h.jsx("p", {
                      className: "text-5xl font-extrabold text-green-400",
                      children: w.toFixed(0),
                    }),
                    h.jsx("div", {
                      className: "relative mt-4 h-2 bg-white/20 rounded-full overflow-hidden",
                      children: h.jsx("div", {
                        className:
                          "absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-cyan-400",
                        style: { width: "100%" },
                      }),
                    }),
                    v &&
                      h.jsxs("div", {
                        className: "grid grid-cols-3 gap-3 mt-4 text-sm",
                        children: [
                          h.jsxs("div", {
                            className: "bg-white/10 rounded-xl p-3",
                            children: [
                              h.jsx("p", { className: "text-white/60", children: "Workdays" }),
                              h.jsx("p", { className: "font-bold", children: v.workdays }),
                            ],
                          }),
                          h.jsxs("div", {
                            className: "bg-white/10 rounded-xl p-3",
                            children: [
                              h.jsx("p", { className: "text-white/60", children: "Weekends" }),
                              h.jsx("p", { className: "font-bold", children: v.weekends }),
                            ],
                          }),
                          h.jsxs("div", {
                            className: "bg-white/10 rounded-xl p-3",
                            children: [
                              h.jsx("p", { className: "text-white/60", children: "Leap Days" }),
                              h.jsx("p", { className: "font-bold", children: v.leapDays }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
              h.jsx("p", {
                className: "text-center text-xs text-white/60 mt-6",
                children: "✨ Auto-calc • Timeline • Leap-year aware",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Xb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(""),
    [c, f] = _.useState("male"),
    [p, g] = _.useState("mifflin"),
    [y, v] = _.useState("maintain"),
    [w, E] = _.useState(null),
    [b, A] = _.useState(""),
    [k, R] = _.useState(!1),
    D = () => {
      if (!e || !s || !a) {
        (A("⚠️ Please fill all fields"), E(null));
        return;
      }
      A("");
      let $ = 0;
      p === "mifflin"
        ? ($ = c === "male" ? 10 * s + 6.25 * a - 5 * e + 5 : 10 * s + 6.25 * a - 5 * e - 161)
        : ($ =
            c === "male"
              ? 88.36 + 13.4 * s + 4.8 * a - 5.7 * e
              : 447.6 + 9.2 * s + 3.1 * a - 4.3 * e);
      let z = Math.round($ * 1.2);
      (y === "lose" && (z -= 500), y === "gain" && (z += 500), E(z));
    },
    M =
      w < 1800
        ? "🥗 Focus on nutrient-dense foods & protein"
        : w < 2500
          ? "⚡ Balanced diet with regular exercise"
          : "💪 High energy intake – strength training recommended";
  return h.jsxs(h.Fragment, {
    children: [
      h.jsx(ds, {
        children: h.jsx("script", {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a calorie calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A calorie calculator estimates how many calories your body needs daily based on age, gender, height, weight, and goals.",
                },
              },
              {
                "@type": "Question",
                name: "Which calorie formula is most accurate?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Mifflin-St Jeor equation is considered the most accurate formula for calculating daily calorie needs.",
                },
              },
              {
                "@type": "Question",
                name: "How many calories should I eat to lose weight?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "To lose weight, most people consume around 500 fewer calories than their maintenance calories.",
                },
              },
              {
                "@type": "Question",
                name: "Is this calorie calculator free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, this calorie calculator is completely free and requires no signup.",
                },
              },
            ],
          }),
        }),
      }),
      h.jsxs("main", {
        className: `relative min-h-screen items-center justify-center pb-10 pt-10 px-4 transition-all
      ${k ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" : "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100"}`,
        children: [
          h.jsx("section", {
            className:
              "lg:w-2/5 mx-auto flex mx-auto p-[2px] rounded-3xl bg-gradient-to-r from-green-400 to-teal-400 shadow-2xl",
            children: h.jsxs("div", {
              className: "rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8",
              children: [
                h.jsx("div", {
                  className: "flex justify-between items-center mb-4",
                  children: h.jsx("h1", {
                    className:
                      "text-3xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent",
                    children: "🔥 Calorie Calculator",
                  }),
                }),
                h.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    h.jsx("input", {
                      type: "number",
                      placeholder: "Age",
                      onChange: ($) => t($.target.value),
                      className: "input",
                    }),
                    h.jsx("input", {
                      type: "number",
                      placeholder: "Weight (kg)",
                      onChange: ($) => i($.target.value),
                      className: "input",
                    }),
                    h.jsx("input", {
                      type: "number",
                      placeholder: "Height (cm)",
                      onChange: ($) => u($.target.value),
                      className: "input",
                    }),
                    h.jsxs("select", {
                      onChange: ($) => f($.target.value),
                      className: "input",
                      children: [
                        h.jsx("option", { value: "male", children: "Male" }),
                        h.jsx("option", { value: "female", children: "Female" }),
                      ],
                    }),
                    h.jsxs("select", {
                      onChange: ($) => g($.target.value),
                      className: "input",
                      children: [
                        h.jsx("option", {
                          value: "mifflin",
                          children: "Mifflin-St Jeor (Recommended)",
                        }),
                        h.jsx("option", { value: "harris", children: "Harris-Benedict" }),
                      ],
                    }),
                    h.jsxs("select", {
                      onChange: ($) => v($.target.value),
                      className: "input",
                      children: [
                        h.jsx("option", { value: "lose", children: "Lose Weight" }),
                        h.jsx("option", { value: "maintain", children: "Maintain" }),
                        h.jsx("option", { value: "gain", children: "Gain Weight" }),
                      ],
                    }),
                  ],
                }),
                b &&
                  h.jsx("p", { className: "mt-4 text-red-500 text-sm text-center", children: b }),
                h.jsx("button", {
                  onClick: D,
                  className: `mt-6 w-full py-4 rounded-xl font-bold text-white\r
            bg-gradient-to-r from-green-600 to-teal-600\r
            hover:scale-[1.02] transition`,
                  children: "Calculate Calories",
                }),
                w &&
                  h.jsxs("div", {
                    className: "mt-6 text-center",
                    children: [
                      h.jsxs("div", {
                        className: "relative mx-auto w-40 h-10",
                        children: [
                          h.jsxs("svg", {
                            className: "transform -rotate-90",
                            viewBox: "0 0 100 100",
                            children: [
                              h.jsx("circle", {
                                cx: "50",
                                cy: "50",
                                r: "45",
                                className: "stroke-gray-300",
                                strokeWidth: "10",
                                fill: "none",
                              }),
                              h.jsx("circle", {
                                cx: "50",
                                cy: "50",
                                r: "45",
                                className: "stroke-green-500 transition-all duration-700",
                                strokeWidth: "10",
                                fill: "none",
                                strokeDasharray: `${(w / 3e3) * 283} 283`,
                              }),
                            ],
                          }),
                          h.jsx("div", {
                            className:
                              "absolute inset-0 flex items-center justify-center text-2xl font-extrabold",
                            children: w,
                          }),
                        ],
                      }),
                      h.jsx("p", { className: "mt-4 text-sm", children: M }),
                    ],
                  }),
              ],
            }),
          }),
          h.jsxs("section", {
            className: "max-w-4xl mx-auto text-left mb-6 pt-10 pb-10",
            children: [
              h.jsx("h2", {
                className: "text-1xl font-bold mb-2",
                children: "🔥 Calorie Calculator – Calculate Your Daily Calorie Needs",
              }),
              h.jsx("p", {
                className: "text-1xl pb-5",
                children:
                  "Knowing how many calories your body needs each day is essential for managing weight, improving fitness, and maintaining overall health. Our free Calorie Calculator helps you estimate your daily calorie requirements based on age, gender, height, weight, and fitness goals.",
              }),
              h.jsx("p", {
                className: "text-1xl",
                children:
                  "Whether your goal is to lose weight, maintain your current weight, or gain muscle, this tool provides accurate results using scientifically proven formulas like Mifflin-St Jeor and Harris-Benedict.",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function qb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(""),
    [c, f] = _.useState(null);
  return (
    _.useEffect(() => {
      if (!e || !s || !a) {
        f(null);
        return;
      }
      const p = parseFloat(e),
        g = parseFloat(s) / 12 / 100,
        y = parseFloat(a) * 12;
      if (p <= 0 || g <= 0 || y <= 0) return;
      const v = (p * g * Math.pow(1 + g, y)) / (Math.pow(1 + g, y) - 1);
      f(Math.round(v));
    }, [e, s, a]),
    h.jsx(h.Fragment, {
      children: h.jsxs("main", {
        className: `min-h-screen items-center justify-center px-4\r
      bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 p-10`,
        children: [
          h.jsxs("section", {
            className:
              "max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]",
            children: [
              h.jsx("h1", {
                className: "text-3xl font-extrabold text-center text-gray-900 mb-2",
                children: "💰 EMI Calculator",
              }),
              h.jsx("p", {
                className: "text-center text-sm text-gray-500 mb-6",
                children: "Calculate your monthly loan EMI instantly",
              }),
              h.jsxs("div", {
                className: "input-card",
                children: [
                  h.jsx("label", { className: "input-title", children: "Loan Amount" }),
                  h.jsx("div", {
                    className: "input-shell",
                    children: h.jsx("input", {
                      type: "number",
                      className: `input-core w-full border border-gray-300 rounded-xl p-4 mb-3\r
                        focus:outline-none focus:ring-4 focus:ring-green-200`,
                      onChange: (p) => t(p.target.value),
                    }),
                  }),
                ],
              }),
              h.jsxs("div", {
                className: "input-card",
                children: [
                  h.jsx("label", { className: "input-title", children: "Interest Rate" }),
                  h.jsx("div", {
                    className: "input-shell",
                    children: h.jsx("input", {
                      type: "number",
                      step: "0.01",
                      className: `input-core w-full border border-gray-300 rounded-xl p-4 mb-3\r
                        focus:outline-none focus:ring-4 focus:ring-green-200`,
                      onChange: (p) => i(p.target.value),
                    }),
                  }),
                ],
              }),
              h.jsxs("div", {
                className: "input-card",
                children: [
                  h.jsx("label", { className: "input-title", children: "Loan Tenure" }),
                  h.jsx("div", {
                    className: "input-shell",
                    children: h.jsx("input", {
                      type: "number",
                      className: `input-core w-full border border-gray-300 rounded-xl p-4 mb-3\r
                        focus:outline-none focus:ring-4 focus:ring-green-200`,
                      onChange: (p) => u(p.target.value),
                    }),
                  }),
                ],
              }),
              c &&
                h.jsxs("div", {
                  className: "mt-6 text-center",
                  children: [
                    h.jsx("p", {
                      className: "text-sm text-gray-500",
                      children: "Your Monthly EMI",
                    }),
                    h.jsxs("p", {
                      className: "text-4xl font-extrabold text-emerald-600",
                      children: ["₹", c.toLocaleString("en-IN")],
                    }),
                  ],
                }),
            ],
          }),
          h.jsxs("section", {
            className: "max-w-4xl mx-auto mt-12 text-gray-700 leading-relaxed",
            children: [
              h.jsx("h2", {
                className: "text-2xl font-bold mb-4",
                children: "EMI Calculator – Plan Your Loan Smartly",
              }),
              h.jsx("p", {
                className: "mb-4",
                children:
                  "An EMI (Equated Monthly Installment) Calculator helps you estimate the monthly payment required to repay a loan. By entering the loan amount, interest rate, and tenure, you can instantly calculate your EMI and plan your finances better.",
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "How Does the EMI Calculator Work?",
              }),
              h.jsx("p", {
                className: "mb-4",
                children:
                  "This EMI calculator uses a standard loan amortization formula to calculate your monthly EMI. It considers the principal loan amount, annual interest rate, and loan tenure to give accurate results in real time.",
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "Why Use Our EMI Calculator?",
              }),
              h.jsxs("ul", {
                className: "list-disc pl-6 mb-4",
                children: [
                  h.jsx("li", { children: "Instant and accurate EMI calculation" }),
                  h.jsx("li", { children: "Suitable for home loans, personal loans & car loans" }),
                  h.jsx("li", { children: "No signup or personal data required" }),
                  h.jsx("li", { children: "Mobile-friendly and fast loading" }),
                ],
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "Who Should Use This EMI Calculator?",
              }),
              h.jsx("p", {
                children:
                  "This tool is ideal for anyone planning to take a loan and wants to understand their monthly repayment amount before making a financial decision.",
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function Qb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(""),
    [c, f] = _.useState([]),
    [p, g] = _.useState(null),
    y = () => {
      const v = s / 12 / 100,
        w = a * 12,
        E = (e * v * Math.pow(1 + v, w)) / (Math.pow(1 + v, w) - 1);
      let b = e;
      const A = [];
      for (let k = 1; k <= w; k++) {
        const R = b * v,
          D = E - R;
        ((b -= D),
          A.push({
            month: k,
            principal: D.toFixed(0),
            interest: R.toFixed(0),
            balance: Math.max(b, 0).toFixed(0),
          }));
      }
      (g(Math.round(E)), f(A));
    };
  return h.jsxs("main", {
    className: "bg-gray-50 min-h-screen px-4 py-6",
    children: [
      h.jsx(ms, { title: "EMI Calculator", description: "Loan EMI with amortization table" }),
      h.jsxs("section", {
        className: "bg-white p-6 rounded-xl shadow max-w-xl mx-auto",
        children: [
          h.jsx("h1", {
            className: "text-2xl font-bold text-center mb-4",
            children: "EMI Calculator",
          }),
          h.jsx("input", {
            placeholder: "Loan Amount",
            className: "w-full border p-3 mb-2",
            onChange: (v) => t(v.target.value),
          }),
          h.jsx("input", {
            placeholder: "Interest Rate (%)",
            className: "w-full border p-3 mb-2",
            onChange: (v) => i(v.target.value),
          }),
          h.jsx("input", {
            placeholder: "Tenure (Years)",
            className: "w-full border p-3 mb-4",
            onChange: (v) => u(v.target.value),
          }),
          h.jsx("button", {
            onClick: y,
            className: "w-full bg-green-600 text-white py-3 rounded",
            children: "Calculate EMI",
          }),
          p &&
            h.jsxs(h.Fragment, {
              children: [
                h.jsxs("p", {
                  className: "mt-4 text-center text-lg",
                  children: ["EMI: ", h.jsxs("strong", { children: ["₹", p] })],
                }),
                h.jsx("div", {
                  className: "overflow-x-auto mt-4 max-h-80",
                  children: h.jsxs("table", {
                    className: "min-w-full text-sm border",
                    children: [
                      h.jsx("thead", {
                        className: "bg-gray-100 sticky top-0",
                        children: h.jsxs("tr", {
                          children: [
                            h.jsx("th", { className: "border px-2", children: "Month" }),
                            h.jsx("th", { className: "border px-2", children: "Principal" }),
                            h.jsx("th", { className: "border px-2", children: "Interest" }),
                            h.jsx("th", { className: "border px-2", children: "Balance" }),
                          ],
                        }),
                      }),
                      h.jsx("tbody", {
                        children: c.map((v) =>
                          h.jsxs(
                            "tr",
                            {
                              children: [
                                h.jsx("td", { className: "border px-2", children: v.month }),
                                h.jsx("td", { className: "border px-2", children: v.principal }),
                                h.jsx("td", { className: "border px-2", children: v.interest }),
                                h.jsx("td", { className: "border px-2", children: v.balance }),
                              ],
                            },
                            v.month
                          )
                        ),
                      }),
                    ],
                  }),
                }),
              ],
            }),
        ],
      }),
    ],
  });
}
function Jb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(""),
    [a, u] = _.useState(""),
    [c, f] = _.useState(null),
    [p, g] = _.useState("");
  return (
    _.useEffect(() => {
      if (!e || !s || !a) {
        (f(null), g(""));
        return;
      }
      const y = parseFloat(e),
        v = parseFloat(s) / 100 / 12,
        w = parseInt(a) * 12;
      if (isNaN(y) || isNaN(v) || isNaN(w)) {
        (f(null), g("⚠️ Enter valid numeric values"));
        return;
      }
      g("");
      const E = y * ((Math.pow(1 + v, w) - 1) / v) * (1 + v);
      f(Math.round(E).toLocaleString("en-IN"));
    }, [e, s, a]),
    h.jsx(h.Fragment, {
      children: h.jsxs("main", {
        className: `min-h-screen items-center justify-center px-4\r
      bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 p-10`,
        children: [
          h.jsxs("section", {
            className: `relative max-w-2xl mx-auto flex p-8 rounded-3xl\r
        bg-white/70 backdrop-blur-xl\r
        shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]`,
            children: [
              h.jsx("div", {
                className: `absolute -inset-1 rounded-3xl\r
          bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500\r
          blur opacity-25`,
              }),
              h.jsxs("div", {
                className: "relative",
                children: [
                  h.jsx("h1", {
                    className: "text-3xl font-extrabold text-center mb-2",
                    children: "💰 SIP Calculator",
                  }),
                  h.jsx("p", {
                    className: "text-center text-sm text-gray-600 mb-6",
                    children: "Live investment growth preview",
                  }),
                  h.jsx("input", {
                    type: "number",
                    placeholder: "Monthly Investment (₹)",
                    className: `w-full mb-3 p-4 rounded-xl border\r
              focus:ring-4 focus:ring-purple-300`,
                    onChange: (y) => t(y.target.value),
                  }),
                  h.jsx("input", {
                    type: "number",
                    placeholder: "Expected Return (%)",
                    className: `w-full mb-3 p-4 rounded-xl border\r
              focus:ring-4 focus:ring-pink-300`,
                    onChange: (y) => i(y.target.value),
                  }),
                  h.jsx("input", {
                    type: "number",
                    placeholder: "Investment Period (Years)",
                    className: `w-full mb-4 p-4 rounded-xl border\r
              focus:ring-4 focus:ring-indigo-300`,
                    onChange: (y) => u(y.target.value),
                  }),
                  p &&
                    h.jsx("p", {
                      className: "text-center text-red-600 font-medium animate-pulse",
                      children: p,
                    }),
                  c &&
                    h.jsxs("div", {
                      className: `mt-6 p-4 rounded-xl bg-green-100/70 text-center\r
              transition-all duration-300`,
                      children: [
                        h.jsx("p", {
                          className: "text-sm text-gray-600",
                          children: "Estimated Maturity Amount",
                        }),
                        h.jsxs("p", {
                          className: "text-2xl font-extrabold text-green-700",
                          children: ["₹", c],
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          h.jsxs("section", {
            className: "max-w-4xl mx-auto mt-12 text-gray-700 leading-relaxed",
            children: [
              h.jsx("h2", {
                className: "text-2xl font-bold mb-4",
                children: "What is a SIP Calculator?",
              }),
              h.jsx("p", {
                className: "mb-4",
                children:
                  "A SIP (Systematic Investment Plan) Calculator helps you estimate the future value of your monthly mutual fund investments. By entering your investment amount, expected annual return rate, and investment duration, you can instantly see how your money grows over time.",
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "How Does This SIP Calculator Work?",
              }),
              h.jsx("p", {
                className: "mb-4",
                children:
                  "This SIP calculator uses a standard compound interest formula to calculate the estimated maturity amount. It assumes that you invest a fixed amount every month and earn compounded returns based on the expected annual rate. Results are updated live as you change the values.",
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "Why Use Our SIP Calculator?",
              }),
              h.jsxs("ul", {
                className: "list-disc pl-6 mb-4",
                children: [
                  h.jsx("li", { children: "Instant and accurate SIP return calculation" }),
                  h.jsx("li", { children: "No signup or personal data required" }),
                  h.jsx("li", { children: "Mobile-friendly and fast loading" }),
                  h.jsx("li", { children: "Ideal for mutual fund investors in India" }),
                ],
              }),
              h.jsx("h2", {
                className: "text-1xl font-bold mb-4",
                children: "Who Should Use This Tool?",
              }),
              h.jsx("p", {
                children:
                  "This SIP calculator is useful for beginners, long-term investors, and anyone planning wealth creation through mutual funds. It helps you plan investments better and set realistic financial goals.",
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function Zb() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(null);
  _.useEffect(() => {
    if (!e) {
      i(null);
      return;
    }
    const u = parseFloat(e);
    if (isNaN(u)) return;
    const c = u * 0.5,
      f = u * 0.2,
      p = u * 0.3,
      g = c * 0.12,
      y = 200,
      v = g + y,
      w = u - v;
    i({
      gross: u,
      basic: c,
      hra: f,
      allowances: p,
      pf: g,
      profTax: y,
      totalDeductions: v,
      netSalary: w,
    });
  }, [e]);
  const a = (u) => u.toLocaleString("en-IN");
  return h.jsxs(h.Fragment, {
    children: [
      h.jsx(ms, {
        title: "Salary Calculator – In-Hand Salary from CTC",
        description:
          "Calculate in-hand salary from CTC with detailed salary breakup including PF, taxes and deductions using this free salary calculator.",
      }),
      h.jsxs("main", {
        className:
          "min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 px-4 p-10",
        children: [
          h.jsxs("section", {
            className:
              "max-w-2xl mx-auto p-10 rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]",
            children: [
              h.jsx("div", {
                className:
                  "absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 blur opacity-20",
              }),
              h.jsxs("div", {
                className: "relative",
                children: [
                  h.jsx("h1", {
                    className: "text-3xl font-extrabold text-center mb-2",
                    children: "💼 Salary Calculator",
                  }),
                  h.jsx("p", {
                    className: "text-center text-sm text-gray-600 mb-6",
                    children: "View salary breakup & deductions instantly",
                  }),
                  h.jsx("input", {
                    type: "number",
                    placeholder: "Monthly Gross Salary (₹)",
                    className:
                      "w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none mb-6 text-lg inputbg",
                    onChange: (u) => t(u.target.value),
                  }),
                  s &&
                    h.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        h.jsxs("div", {
                          className: "glass glow-blue",
                          children: [
                            h.jsx("h3", { className: "section-title", children: "💰 Earnings" }),
                            h.jsx(lr, { label: "Basic Salary", value: a(s.basic) }),
                            h.jsx(lr, { label: "HRA", value: a(s.hra) }),
                            h.jsx(lr, { label: "Other Allowances", value: a(s.allowances) }),
                            h.jsx(lr, { label: "Gross Salary", value: a(s.gross), bold: !0 }),
                          ],
                        }),
                        h.jsxs("div", {
                          className: "glass glow-red",
                          children: [
                            h.jsx("h3", { className: "section-title", children: "📉 Deductions" }),
                            h.jsx(lr, { label: "Provident Fund (12%)", value: a(s.pf) }),
                            h.jsx(lr, { label: "Professional Tax", value: a(s.profTax) }),
                            h.jsx(lr, {
                              label: "Total Deductions",
                              value: a(s.totalDeductions),
                              bold: !0,
                            }),
                          ],
                        }),
                        h.jsxs("div", {
                          className: "net-card",
                          children: [
                            h.jsx("p", {
                              className: "text-sm text-gray-600",
                              children: "Estimated Net Salary",
                            }),
                            h.jsxs("h2", {
                              className: "text-3xl font-extrabold text-green-600",
                              children: ["₹", a(s.netSalary)],
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          h.jsxs("section", {
            className: "max-w-4xl mx-auto mt-12 text-gray-700 space-y-3",
            children: [
              h.jsx("h2", {
                className: "text-2xl font-bold",
                children: "Salary Calculator – Understand Your Salary Structure",
              }),
              h.jsx("p", {
                className: "text-1xl",
                children:
                  "This salary calculator helps you convert your gross salary into net take-home salary with a detailed breakup including Basic Pay, HRA, allowances and deductions.",
              }),
              h.jsx("p", {
                className: "text-1xl",
                children:
                  "It is useful for employees in India to estimate monthly take-home pay after Provident Fund and professional tax deductions.",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function lr({ label: e, value: t, bold: s }) {
  return h.jsxs("div", {
    className: `flex justify-between text-sm ${s ? "font-semibold" : ""}`,
    children: [h.jsx("span", { children: e }), h.jsxs("span", { children: ["₹", t] })],
  });
}
function eN() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState("");
  return h.jsxs("main", {
    className: "min-h-screen bg-gray-50 flex justify-center items-center px-4",
    children: [
      h.jsx(ms, {
        title: "Meta Tag Generator – Free SEO Tool",
        description: "Generate SEO-friendly meta tags instantly",
      }),
      h.jsxs("section", {
        className: "bg-white max-w-xl w-full p-6 rounded-2xl shadow",
        children: [
          h.jsx("h1", {
            className: "text-2xl font-bold mb-4 text-center",
            children: "Meta Tag Generator",
          }),
          h.jsx("input", {
            placeholder: "Page Title",
            className: "w-full border p-3 rounded mb-3",
            onChange: (a) => t(a.target.value),
          }),
          h.jsx("textarea", {
            placeholder: "Meta Description",
            className: "w-full border p-3 rounded mb-4",
            onChange: (a) => i(a.target.value),
          }),
          h.jsx("pre", {
            className: "bg-gray-100 p-4 rounded text-sm overflow-auto",
            children: `<title>${e}</title>
<meta name="description" content="${s}" />`,
          }),
        ],
      }),
    ],
  });
}
function tN() {
  const [e, t] = _.useState(""),
    [s, i] = _.useState(18),
    [a, u] = _.useState("exclusive"),
    [c, f] = _.useState("cgst"),
    p = parseFloat(e) || 0,
    g = a === "exclusive" ? (p * s) / 100 : (p * s) / (100 + s),
    y = a === "exclusive" ? p + g : p,
    v = a === "exclusive" ? p : p - g,
    w = c === "cgst" ? g / 2 : 0,
    E = c === "cgst" ? g / 2 : 0,
    b = c === "igst" ? g : 0,
    A = D(v),
    k = D(g),
    R = D(y);
  function D(M, $ = 600) {
    const [z, J] = _.useState(M);
    return (
      _.useEffect(() => {
        let te = z;
        const Q = M - te,
          fe = $ / 16,
          ce = Q / fe;
        let _e = te;
        const Fe = setInterval(() => {
          ((_e += ce),
            (ce >= 0 && _e >= M) || (ce < 0 && _e <= M) ? (J(M), clearInterval(Fe)) : J(_e));
        }, 16);
        return () => clearInterval(Fe);
      }, [M]),
      z
    );
  }
  return h.jsx(h.Fragment, {
    children: h.jsxs("main", {
      className:
        "min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4 p-10",
      children: [
        h.jsxs("section", {
          className:
            "relative max-w-2xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_70px_rgba(168,85,247,0.45)] p-8",
          children: [
            h.jsx("div", {
              className:
                "absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur opacity-30",
            }),
            h.jsxs("div", {
              className: "relative",
              children: [
                h.jsx("h1", {
                  className: "text-3xl font-extrabold text-center text-white mb-2",
                  children: "💸 GST Calculator",
                }),
                h.jsx("p", {
                  className: "text-center text-white/70 mb-6",
                  children: "Animated • CGST/SGST/IGST • Slab Compare",
                }),
                h.jsx("input", {
                  type: "number",
                  value: e,
                  onChange: (M) => t(M.target.value),
                  placeholder: "Enter Amount (₹)",
                  min: "0",
                  step: "0.01",
                  inputMode: "decimal",
                  className:
                    "w-full mb-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 px-4 py-3 focus:ring-4 focus:ring-indigo-500/50",
                }),
                h.jsx("select", {
                  value: s,
                  onChange: (M) => i(Number(M.target.value)),
                  className:
                    "w-full mb-4 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3",
                  children: [5, 12, 18, 28].map((M) =>
                    h.jsxs("option", { value: M, children: [M, "% GST"] }, M)
                  ),
                }),
                h.jsx("div", {
                  className: "flex gap-3 mb-4",
                  children: ["exclusive", "inclusive"].map((M) =>
                    h.jsx(
                      "button",
                      {
                        onClick: () => u(M),
                        className: `flex-1 py-3 rounded-xl font-semibold ${a === M ? "bg-indigo-600" : "bg-white/20"}`,
                        children: M.toUpperCase(),
                      },
                      M
                    )
                  ),
                }),
                h.jsxs("div", {
                  className: "flex gap-3 mb-6",
                  children: [
                    h.jsx("button", {
                      onClick: () => f("cgst"),
                      className: `flex-1 py-2 rounded-lg ${c === "cgst" ? "bg-green-600" : "bg-white/20"}`,
                      children: "CGST + SGST",
                    }),
                    h.jsx("button", {
                      onClick: () => f("igst"),
                      className: `flex-1 py-2 rounded-lg ${c === "igst" ? "bg-pink-600" : "bg-white/20"}`,
                      children: "IGST",
                    }),
                  ],
                }),
                h.jsxs("div", {
                  className:
                    "bg-black/40 rounded-2xl p-5 border border-white/20 space-y-2 text-white",
                  children: [
                    h.jsxs("div", {
                      className: "flex justify-between",
                      children: [
                        h.jsx("span", { children: "Base" }),
                        h.jsxs("span", { children: ["₹ ", A.toFixed(2)] }),
                      ],
                    }),
                    h.jsxs("div", {
                      className: "flex justify-between text-indigo-300",
                      children: [
                        h.jsx("span", { children: "GST" }),
                        h.jsxs("span", { children: ["₹ ", k.toFixed(2)] }),
                      ],
                    }),
                    c === "cgst" &&
                      h.jsxs(h.Fragment, {
                        children: [
                          h.jsxs("div", {
                            className: "flex justify-between text-green-300",
                            children: [
                              h.jsx("span", { children: "CGST" }),
                              h.jsxs("span", { children: ["₹ ", w.toFixed(2)] }),
                            ],
                          }),
                          h.jsxs("div", {
                            className: "flex justify-between text-green-300",
                            children: [
                              h.jsx("span", { children: "SGST" }),
                              h.jsxs("span", { children: ["₹ ", E.toFixed(2)] }),
                            ],
                          }),
                        ],
                      }),
                    c === "igst" &&
                      h.jsxs("div", {
                        className: "flex justify-between text-pink-300",
                        children: [
                          h.jsx("span", { children: "IGST" }),
                          h.jsxs("span", { children: ["₹ ", b.toFixed(2)] }),
                        ],
                      }),
                    h.jsxs("div", {
                      className:
                        "flex justify-between font-bold text-lg text-green-400 border-t border-white/20 pt-2",
                      children: [
                        h.jsx("span", { children: "Total" }),
                        h.jsxs("span", { children: ["₹ ", R.toFixed(2)] }),
                      ],
                    }),
                  ],
                }),
                h.jsx("div", {
                  className: "grid grid-cols-2 gap-3 mt-6",
                  children: [5, 12, 18, 28].map((M) =>
                    h.jsxs(
                      "div",
                      {
                        className: `rounded-xl p-3 border ${s === M ? "border-indigo-400 bg-indigo-500/20" : "border-white/20 bg-white/10"}`,
                        children: [
                          h.jsxs("p", {
                            className: "text-sm text-white/70",
                            children: [M, "% GST"],
                          }),
                          h.jsxs("p", {
                            className: "text-lg font-bold text-white",
                            children: ["₹ ", ((p * M) / 100).toFixed(0)],
                          }),
                        ],
                      },
                      M
                    )
                  ),
                }),
                h.jsx("p", {
                  className: "text-center text-xs text-white/60 mt-6",
                  children: "✨ Animated • India GST Ready • Free Tool",
                }),
              ],
            }),
          ],
        }),
        h.jsxs("section", {
          className: "max-w-4xl mx-auto mt-12 text-white/80 text-sm leading-relaxed pt-10",
          children: [
            h.jsx("h2", {
              className: "text-2xl font-bold text-white mb-2 pb-2",
              children: "What is GST Calculator?",
            }),
            h.jsx("p", {
              className: "text-1xl",
              children:
                "This GST Calculator helps you calculate Goods and Services Tax (GST) in India for both inclusive and exclusive prices. It supports CGST, SGST, and IGST with real-time animated results.",
            }),
            h.jsx("h3", {
              className: " text-1xl font-bold mt-4 pb-4 pt-5",
              children: "GST Rates in India",
            }),
            h.jsxs("ul", {
              className: "list-disc ml-5 pl-5 leading-8",
              children: [
                h.jsx("li", { className: "text-1xl", children: "5% GST – Essential goods" }),
                h.jsx("li", { className: "text-1xl", children: "12% GST – Standard goods" }),
                h.jsx("li", { className: "text-1xl", children: "18% GST – Most services" }),
                h.jsx("li", { className: "text-1xl", children: "28% GST – Luxury items" }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
const Vg = {
  india: { label: "India", url: "https://speed.cloudflare.com/__down?bytes=5000000" },
  usa: { label: "USA", url: "https://speed.cloudflare.com/__down?bytes=8000000" },
  europe: { label: "Europe", url: "https://speed.cloudflare.com/__down?bytes=6000000" },
};
function nN() {
  const [e, t] = _.useState(0),
    [s, i] = _.useState(0),
    [a, u] = _.useState(null),
    [c, f] = _.useState([]),
    [p, g] = _.useState(!1),
    [y, v] = _.useState("india"),
    w = async () => {
      if (!p) {
        (g(!0), t(0), i(0), u(null));
        try {
          await E();
          const k = await b(),
            R = await A();
          f((D) => [...D.slice(-4), k]);
        } catch (k) {
          console.error(k);
        }
        g(!1);
      }
    },
    E = async () => {
      const k = performance.now();
      (await fetch("https://speed.cloudflare.com/cdn-cgi/trace", { cache: "no-store" }),
        u(Math.round(performance.now() - k)));
    },
    b = async () => {
      const R = (await fetch(Vg[y].url, { cache: "no-store" })).body.getReader();
      let D = 0;
      const M = performance.now();
      for (;;) {
        const { done: $, value: z } = await R.read();
        if ($) break;
        D += z.length;
        const J = (performance.now() - M) / 1e3,
          te = (D * 8) / J / 1024 / 1024;
        t(te.toFixed(1));
      }
      return Number(e);
    },
    A = async () => {
      const R = performance.now();
      await new Promise(($) => setTimeout($, 400 + Math.random() * 600));
      const D = (performance.now() - R) / 1e3,
        M = (2097152 * 8) / D / 1024 / 1024;
      return (i(M.toFixed(1)), Number(M.toFixed(1)));
    };
  return h.jsx(h.Fragment, {
    children: h.jsx("main", {
      className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4",
      children: h.jsx("div", {
        className: "flex justify-center py-10",
        children: h.jsxs(B0.section, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: "glass-card max-w-md w-full p-8 text-white rounded-3xl",
          children: [
            h.jsx("h1", {
              className: "text-3xl font-bold text-center mb-4",
              children: "🚀 Internet Speed Test",
            }),
            h.jsx("select", {
              value: y,
              onChange: (k) => v(k.target.value),
              className: "w-full mb-4 p-2 rounded bg-white/10 text-white",
              children: Object.entries(Vg).map(([k, R]) =>
                h.jsx("option", { value: k, children: R.label }, k)
              ),
            }),
            h.jsxs("div", {
              className: "grid grid-cols-2 gap-4",
              children: [
                h.jsx(Bg, { value: e, label: "Download", color: "#a78bfa" }),
                h.jsx(Bg, { value: s, label: "Upload (Est.)", color: "#34d399" }),
              ],
            }),
            h.jsxs("div", {
              className: "flex justify-between mt-4 text-sm",
              children: [
                h.jsx("span", { children: "Ping" }),
                h.jsx("span", { className: "text-indigo-300", children: a ? `${a} ms` : "--" }),
              ],
            }),
            h.jsx(sN, { download: e, ping: a }),
            h.jsx("button", {
              onClick: w,
              disabled: p,
              className:
                "w-full mt-6 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold disabled:opacity-50",
              children: p ? "Testing..." : "Start Test",
            }),
            h.jsx(rN, { history: c }),
            h.jsx("p", {
              className: "text-xs text-white/50 mt-4 text-center",
              children: "Upload speed is estimated based on network response timing",
            }),
          ],
        }),
      }),
    }),
  });
}
function Bg({ value: e, label: t, color: s }) {
  const a = 2 * Math.PI * 70,
    u = Math.min(e / 200, 1),
    c = a * (1 - u);
  return h.jsxs("div", {
    className: "flex flex-col items-center",
    children: [
      h.jsxs("svg", {
        width: "160",
        height: "160",
        children: [
          h.jsx("circle", {
            cx: "80",
            cy: "80",
            r: 70,
            stroke: "rgba(255,255,255,0.15)",
            strokeWidth: "10",
            fill: "none",
          }),
          h.jsx(B0.circle, {
            cx: "80",
            cy: "80",
            r: 70,
            stroke: s,
            strokeWidth: "10",
            fill: "none",
            strokeDasharray: a,
            strokeDashoffset: c,
            animate: { strokeDashoffset: c },
            transition: { duration: 0.4 },
          }),
          h.jsxs("text", {
            x: "50%",
            y: "50%",
            dy: ".3em",
            textAnchor: "middle",
            className: "fill-white text-lg font-bold",
            children: [e, " Mbps"],
          }),
        ],
      }),
      h.jsx("span", { className: "text-sm text-white/70", children: t }),
    ],
  });
}
function rN({ history: e }) {
  if (!e.length) return null;
  const t = Math.max(...e, 50);
  return h.jsx("svg", {
    className: "mt-6",
    width: "100%",
    height: "60",
    children: e.map((s, i) =>
      h.jsx(
        "rect",
        {
          x: i * 28,
          y: 60 - (s / t) * 60,
          width: "20",
          height: (s / t) * 60,
          rx: "4",
          fill: "#a78bfa",
        },
        i
      )
    ),
  });
}
function sN({ download: e, ping: t }) {
  if (!e || !t) return null;
  let s = "Average",
    i = "bg-yellow-500";
  return (
    e > 100 && t < 30
      ? ((s = "Excellent"), (i = "bg-green-500"))
      : e > 40
        ? ((s = "Good"), (i = "bg-blue-500"))
        : e < 10 && ((s = "Poor"), (i = "bg-red-500")),
    h.jsxs("div", {
      className: `mt-4 text-center py-2 rounded-full ${i}`,
      children: [s, " Internet Quality"],
    })
  );
}
function iN() {
  return h.jsxs("main", {
    className: "min-h-screen bg-gray-50",
    children: [
      h.jsx(ms, {
        title: "About Us | Free Tools – Smart Online Calculators",
        description:
          "Learn about Free Tools – a collection of fast, accurate, and privacy-friendly online calculators for health, finance, and daily utilities.",
        canonical: "https://freetoolspro.in/about",
      }),
      h.jsxs("section", {
        className: "relative overflow-hidden py-24 px-4 mb-4",
        children: [
          h.jsx("div", {
            className:
              "absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700",
          }),
          h.jsxs("div", {
            className: "relative z-10 max-w-6xl mx-auto text-center text-white",
            children: [
              h.jsxs("h1", {
                className: "text-4xl md:text-6xl font-extrabold mb-6",
                children: [
                  "Free Online Calculators ",
                  h.jsx("br", {}),
                  h.jsx("span", {
                    className: "text-yellow-300",
                    children: "Built for Everyday Life",
                  }),
                ],
              }),
              h.jsxs("p", {
                className: "max-w-2xl mx-auto text-lg mb-10",
                children: [
                  "Calculate Age, BMI, Calories, EMI, SIP Returns and more ",
                  h.jsx("br", {}),
                  " — Fast, Accurate and 100% FREE.",
                ],
              }),
            ],
          }),
        ],
      }),
      h.jsxs("section", {
        className: "max-w-7xl mx-auto px-4 py-12",
        children: [
          h.jsx("h1", {
            className: "text-3xl font-bold text-gray-900 mb-6",
            children: "About Free Tools",
          }),
          h.jsx("p", {
            className: "text-gray-700 leading-relaxed mb-4",
            children:
              "Free Tools is a simple and reliable platform designed to make everyday calculations fast, accurate, and accessible for everyone.",
          }),
          h.jsx("p", {
            className: "text-gray-700 leading-relaxed mb-4",
            children:
              "We provide free, browser-based tools that help users make better decisions in health, finance, productivity, and daily life—without signups or data tracking.",
          }),
          h.jsx("h2", { className: "text-xl font-semibold mt-8 mb-3", children: "Our Mission" }),
          h.jsx("p", {
            className: "text-gray-700 leading-relaxed",
            children:
              "Our mission is to simplify complex calculations and deliver clean, trustworthy tools that respect user privacy and work seamlessly across all devices.",
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-8 mb-3",
            children: "Privacy & Transparency",
          }),
          h.jsx("p", {
            className: "text-gray-700 leading-relaxed",
            children:
              "All calculations run directly in your browser. We do not store, track, or share any personal data.",
          }),
        ],
      }),
      h.jsxs("footer", {
        className: "border-t border-gray-300 mt-16 py-8 text-center",
        children: [
          h.jsxs("nav", {
            className: "flex justify-center gap-6 mb-4",
            children: [
              h.jsx(mt, { to: "/About", children: "About" }),
              " |",
              h.jsx(mt, { to: "/privacy-policy", children: "Privacy Policy" }),
            ],
          }),
          h.jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["© ", new Date().getFullYear(), " Free Tools. All rights reserved."],
          }),
        ],
      }),
    ],
  });
}
function oN() {
  return h.jsxs(h.Fragment, {
    children: [
      h.jsx(ms, {
        title: "Privacy Policy – Free Tools",
        description:
          "Read how Free Tools collects, uses, and protects your data. We respect your privacy and do not store personal information.",
      }),
      h.jsxs("section", {
        className: "relative overflow-hidden py-24 px-4 mb-4",
        children: [
          h.jsx("div", {
            className:
              "absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700",
          }),
          h.jsxs("div", {
            className: "relative z-10 max-w-6xl mx-auto text-center text-white",
            children: [
              h.jsxs("h1", {
                className: "text-4xl md:text-6xl font-extrabold mb-6",
                children: [
                  "Free Online Calculators ",
                  h.jsx("br", {}),
                  h.jsx("span", {
                    className: "text-yellow-300",
                    children: "Built for Everyday Life",
                  }),
                ],
              }),
              h.jsxs("p", {
                className: "max-w-2xl mx-auto text-lg mb-10",
                children: [
                  "Calculate Age, BMI, Calories, EMI, SIP Returns and more ",
                  h.jsx("br", {}),
                  " — Fast, Accurate and 100% FREE.",
                ],
              }),
            ],
          }),
        ],
      }),
      h.jsxs("main", {
        className: "max-w-7xl mx-auto px-4 py-10 text-gray-700",
        children: [
          h.jsx("h1", {
            className: "text-3xl font-bold text-gray-900 mb-6",
            children: "Privacy Policy",
          }),
          h.jsxs("p", {
            className: "mb-4",
            children: [
              "At ",
              h.jsx("strong", { children: "Free Tools" }),
              ", your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and online tools.",
            ],
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-6 mb-2",
            children: "1. Information We Collect",
          }),
          h.jsxs("p", {
            className: "mb-4",
            children: [
              "We do ",
              h.jsx("strong", { children: "not" }),
              " collect personally identifiable information such as your name, email address, phone number, or location. All calculations performed using our tools happen directly in your browser.",
            ],
          }),
          h.jsx("h2", { className: "text-xl font-semibold mt-6 mb-2", children: "2. Usage Data" }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "We may collect anonymous usage data such as page views, device type, browser type, and general usage patterns to improve website performance and user experience. This data cannot be used to identify individual users.",
          }),
          h.jsx("h2", { className: "text-xl font-semibold mt-6 mb-2", children: "3. Cookies" }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "Free Tools may use cookies to enhance user experience, analyze traffic, and serve relevant advertisements. You can choose to disable cookies through your browser settings.",
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-6 mb-2",
            children: "4. Third-Party Services",
          }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "We may use trusted third-party services such as Google Analytics or Google AdSense. These services may use cookies or similar technologies to collect anonymous data in accordance with their own privacy policies.",
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-6 mb-2",
            children: "5. Data Security",
          }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "We take reasonable measures to protect your information. Since no personal data is stored on our servers, the risk of data misuse is minimal.",
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-6 mb-2",
            children: "6. Children’s Information",
          }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "Free Tools does not knowingly collect any personal information from children under the age of 13.",
          }),
          h.jsx("h2", {
            className: "text-xl font-semibold mt-6 mb-2",
            children: "7. Changes to This Policy",
          }),
          h.jsx("p", {
            className: "mb-4",
            children:
              "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
          }),
          h.jsx("h2", { className: "text-xl font-semibold mt-6 mb-2", children: "8. Contact Us" }),
          h.jsxs("p", {
            className: "mb-4",
            children: [
              "If you have any questions about this Privacy Policy, please ",
              h.jsx("a", {
                className: "font-bold",
                href: "mailto:freetoolsproin@gmail.com",
                children: "contact us",
              }),
              " through the website.",
            ],
          }),
          h.jsxs("footer", {
            className: "border-t border-gray-300 mt-16 py-8 text-center",
            children: [
              h.jsxs("nav", {
                className: "flex justify-center gap-6 mb-4",
                children: [
                  h.jsx(mt, { to: "/About", children: "About" }),
                  " |",
                  h.jsx(mt, { to: "/privacy-policy", children: "Privacy Policy" }),
                ],
              }),
              h.jsxs("p", {
                className: "text-sm text-gray-500",
                children: ["© ", new Date().getFullYear(), " Free Tools. All rights reserved."],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function aN() {
  const e = wn();
  return (
    _.useEffect(() => {
      Hb(e.pathname + e.search);
    }, [e]),
    _.useEffect(() => {
      window.gtag?.("config", "G-XXXXXXX", { page_path: e.pathname });
    }, [e]),
    null
  );
}
function lN() {
  return (
    _.useEffect(() => {
      const e = () => {
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.75 &&
          (U0({ action: "scroll", category: "Engagement", label: "75% Scroll" }),
          window.removeEventListener("scroll", e));
      };
      return (window.addEventListener("scroll", e), () => window.removeEventListener("scroll", e));
    }, []),
    null
  );
}
function uN() {
  const [e, t] = _.useState(!1);
  _.useEffect(() => {
    localStorage.getItem("cookieAccepted") || t(!0);
  }, []);
  const s = () => {
    (localStorage.setItem("cookieAccepted", "true"), t(!1), window.location.reload());
  };
  return e
    ? h.jsxs("div", {
        className:
          "fixed bottom-0 inset-x-0 cookiebg text-white p-2 flex justify-between items-center z-50",
        children: [
          h.jsx("p", {
            className: "text-sm",
            children: "We use cookies to improve experience and show relevant ads.",
          }),
          h.jsx("button", {
            onClick: s,
            className: "bg-organe-500 px-4 py-2 rounded",
            children: "Accept",
          }),
        ],
      })
    : null;
}
function cN() {
  const e = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free Tools",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description: "Free online calculators and tools for health, finance and everyday use.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return h.jsx(ds, {
    children: h.jsx("script", { type: "application/ld+json", children: JSON.stringify(e) }),
  });
}
function dN() {
  return h.jsxs(h.Fragment, {
    children: [
      h.jsx(t_, {}),
      h.jsx(Db, {}),
      h.jsx(aN, {}),
      h.jsx(lN, {}),
      h.jsx(uN, {}),
      h.jsx(cN, {}),
      h.jsxs(A1, {
        children: [
          h.jsx(Je, { path: "/", element: h.jsx(Vb, {}) }),
          h.jsx(Je, { path: "/dev-tools/", element: h.jsx($b, {}) }),
          h.jsx(Je, { path: "/age-calculator", element: h.jsx(Wb, {}) }),
          h.jsx(Je, { path: "/bmi-calculator", element: h.jsx(Gb, {}) }),
          h.jsx(Je, { path: "/date-difference", element: h.jsx(Yb, {}) }),
          h.jsx(Je, { path: "/calorie-calculator", element: h.jsx(Xb, {}) }),
          h.jsx(Je, { path: "/gst-calculator", element: h.jsx(tN, {}) }),
          h.jsx(Je, { path: "/speed-test", element: h.jsx(nN, {}) }),
          h.jsx(Je, { path: "/emi-calculator", element: h.jsx(qb, {}) }),
          h.jsx(Je, { path: "/emi-calculator-amm", element: h.jsx(Qb, {}) }),
          h.jsx(Je, { path: "/sip-calculator", element: h.jsx(Jb, {}) }),
          h.jsx(Je, { path: "/salary-calculator", element: h.jsx(Zb, {}) }),
          h.jsx(Je, { path: "/metataggenerator", element: h.jsx(eN, {}) }),
          h.jsx(Je, { path: "/about", element: h.jsx(iN, {}) }),
          h.jsx(Je, { path: "/privacy-policy", element: h.jsx(oN, {}) }),
        ],
      }),
      h.jsx(n_, {}),
    ],
  });
}
const ie = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
  ve = globalThis,
  gr = "10.32.1";
function Ra() {
  return (Ia(ve), ve);
}
function Ia(e) {
  const t = (e.__SENTRY__ = e.__SENTRY__ || {});
  return ((t.version = t.version || gr), (t[gr] = t[gr] || {}));
}
function gs(e, t, s = ve) {
  const i = (s.__SENTRY__ = s.__SENTRY__ || {}),
    a = (i[gr] = i[gr] || {});
  return a[e] || (a[e] = t());
}
const fN = ["debug", "info", "warn", "error", "log", "assert", "trace"],
  pN = "Sentry Logger ",
  Ta = {};
function ys(e) {
  if (!("console" in ve)) return e();
  const t = ve.console,
    s = {},
    i = Object.keys(Ta);
  i.forEach((a) => {
    const u = Ta[a];
    ((s[a] = t[a]), (t[a] = u));
  });
  try {
    return e();
  } finally {
    i.forEach((a) => {
      t[a] = s[a];
    });
  }
}
function hN() {
  $d().enabled = !0;
}
function mN() {
  $d().enabled = !1;
}
function z0() {
  return $d().enabled;
}
function gN(...e) {
  Bd("log", ...e);
}
function yN(...e) {
  Bd("warn", ...e);
}
function vN(...e) {
  Bd("error", ...e);
}
function Bd(e, ...t) {
  ie &&
    z0() &&
    ys(() => {
      ve.console[e](`${pN}[${e}]:`, ...t);
    });
}
function $d() {
  return ie ? gs("loggerSettings", () => ({ enabled: !1 })) : { enabled: !1 };
}
const se = { enable: hN, disable: mN, isEnabled: z0, log: gN, warn: yN, error: vN },
  H0 = 50,
  yr = "?",
  $g = /\(error: (.*)\)/,
  Ug = /captureMessage|captureException/;
function W0(...e) {
  const t = e.sort((s, i) => s[0] - i[0]).map((s) => s[1]);
  return (s, i = 0, a = 0) => {
    const u = [],
      c = s.split(`
`);
    for (let f = i; f < c.length; f++) {
      let p = c[f];
      p.length > 1024 && (p = p.slice(0, 1024));
      const g = $g.test(p) ? p.replace($g, "$1") : p;
      if (!g.match(/\S*Error: /)) {
        for (const y of t) {
          const v = y(g);
          if (v) {
            u.push(v);
            break;
          }
        }
        if (u.length >= H0 + a) break;
      }
    }
    return wN(u.slice(a));
  };
}
function xN(e) {
  return Array.isArray(e) ? W0(...e) : e;
}
function wN(e) {
  if (!e.length) return [];
  const t = Array.from(e);
  return (
    /sentryWrapped/.test(na(t).function || "") && t.pop(),
    t.reverse(),
    Ug.test(na(t).function || "") && (t.pop(), Ug.test(na(t).function || "") && t.pop()),
    t
      .slice(0, H0)
      .map((s) => ({ ...s, filename: s.filename || na(t).filename, function: s.function || yr }))
  );
}
function na(e) {
  return e[e.length - 1] || {};
}
const oc = "<anonymous>";
function Hn(e) {
  try {
    return !e || typeof e != "function" ? oc : e.name || oc;
  } catch {
    return oc;
  }
}
function zg(e) {
  const t = e.exception;
  if (t) {
    const s = [];
    try {
      return (
        t.values.forEach((i) => {
          i.stacktrace.frames && s.push(...i.stacktrace.frames);
        }),
        s
      );
    } catch {
      return;
    }
  }
}
function G0(e) {
  return "__v_isVNode" in e && e.__v_isVNode ? "[VueVNode]" : "[VueViewModel]";
}
const fa = {},
  Hg = {};
function wr(e, t) {
  ((fa[e] = fa[e] || []), fa[e].push(t));
}
function Sr(e, t) {
  if (!Hg[e]) {
    Hg[e] = !0;
    try {
      t();
    } catch (s) {
      ie && se.error(`Error while instrumenting ${e}`, s);
    }
  }
}
function Ht(e, t) {
  const s = e && fa[e];
  if (s)
    for (const i of s)
      try {
        i(t);
      } catch (a) {
        ie &&
          se.error(
            `Error while triggering instrumentation handler.
Type: ${e}
Name: ${Hn(i)}
Error:`,
            a
          );
      }
}
let ac = null;
function SN(e) {
  const t = "error";
  (wr(t, e), Sr(t, EN));
}
function EN() {
  ((ac = ve.onerror),
    (ve.onerror = function (e, t, s, i, a) {
      return (
        Ht("error", { column: i, error: a, line: s, msg: e, url: t }),
        ac ? ac.apply(this, arguments) : !1
      );
    }),
    (ve.onerror.__SENTRY_INSTRUMENTED__ = !0));
}
let lc = null;
function _N(e) {
  const t = "unhandledrejection";
  (wr(t, e), Sr(t, TN));
}
function TN() {
  ((lc = ve.onunhandledrejection),
    (ve.onunhandledrejection = function (e) {
      return (Ht("unhandledrejection", e), lc ? lc.apply(this, arguments) : !0);
    }),
    (ve.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0));
}
const K0 = Object.prototype.toString;
function Ud(e) {
  switch (K0.call(e)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return Wn(e, Error);
  }
}
function vs(e, t) {
  return K0.call(e) === `[object ${t}]`;
}
function Y0(e) {
  return vs(e, "ErrorEvent");
}
function Wg(e) {
  return vs(e, "DOMError");
}
function CN(e) {
  return vs(e, "DOMException");
}
function pn(e) {
  return vs(e, "String");
}
function zd(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    "__sentry_template_string__" in e &&
    "__sentry_template_values__" in e
  );
}
function Aa(e) {
  return e === null || zd(e) || (typeof e != "object" && typeof e != "function");
}
function Ti(e) {
  return vs(e, "Object");
}
function Ma(e) {
  return typeof Event < "u" && Wn(e, Event);
}
function kN(e) {
  return typeof Element < "u" && Wn(e, Element);
}
function bN(e) {
  return vs(e, "RegExp");
}
function Di(e) {
  return !!(e?.then && typeof e.then == "function");
}
function NN(e) {
  return Ti(e) && "nativeEvent" in e && "preventDefault" in e && "stopPropagation" in e;
}
function Wn(e, t) {
  try {
    return e instanceof t;
  } catch {
    return !1;
  }
}
function X0(e) {
  return !!(typeof e == "object" && e !== null && (e.__isVue || e._isVue || e.__v_isVNode));
}
function q0(e) {
  return typeof Request < "u" && Wn(e, Request);
}
const Hd = ve,
  jN = 80;
function Q0(e, t = {}) {
  if (!e) return "<unknown>";
  try {
    let s = e;
    const i = 5,
      a = [];
    let u = 0,
      c = 0;
    const f = " > ",
      p = f.length;
    let g;
    const y = Array.isArray(t) ? t : t.keyAttrs,
      v = (!Array.isArray(t) && t.maxStringLength) || jN;
    for (
      ;
      s &&
      u++ < i &&
      ((g = PN(s, y)), !(g === "html" || (u > 1 && c + a.length * p + g.length >= v)));
    )
      (a.push(g), (c += g.length), (s = s.parentNode));
    return a.reverse().join(f);
  } catch {
    return "<unknown>";
  }
}
function PN(e, t) {
  const s = e,
    i = [];
  if (!s?.tagName) return "";
  if (Hd.HTMLElement && s instanceof HTMLElement && s.dataset) {
    if (s.dataset.sentryComponent) return s.dataset.sentryComponent;
    if (s.dataset.sentryElement) return s.dataset.sentryElement;
  }
  i.push(s.tagName.toLowerCase());
  const a = t?.length
    ? t.filter((c) => s.getAttribute(c)).map((c) => [c, s.getAttribute(c)])
    : null;
  if (a?.length)
    a.forEach((c) => {
      i.push(`[${c[0]}="${c[1]}"]`);
    });
  else {
    s.id && i.push(`#${s.id}`);
    const c = s.className;
    if (c && pn(c)) {
      const f = c.split(/\s+/);
      for (const p of f) i.push(`.${p}`);
    }
  }
  const u = ["aria-label", "type", "name", "title", "alt"];
  for (const c of u) {
    const f = s.getAttribute(c);
    f && i.push(`[${c}="${f}"]`);
  }
  return i.join("");
}
function Wd() {
  try {
    return Hd.document.location.href;
  } catch {
    return "";
  }
}
function RN(e) {
  if (!Hd.HTMLElement) return null;
  let t = e;
  const s = 5;
  for (let i = 0; i < s; i++) {
    if (!t) return null;
    if (t instanceof HTMLElement) {
      if (t.dataset.sentryComponent) return t.dataset.sentryComponent;
      if (t.dataset.sentryElement) return t.dataset.sentryElement;
    }
    t = t.parentNode;
  }
  return null;
}
function Et(e, t, s) {
  if (!(t in e)) return;
  const i = e[t];
  if (typeof i != "function") return;
  const a = s(i);
  typeof a == "function" && J0(a, i);
  try {
    e[t] = a;
  } catch {
    ie && se.log(`Failed to replace method "${t}" in object`, e);
  }
}
function vr(e, t, s) {
  try {
    Object.defineProperty(e, t, { value: s, writable: !0, configurable: !0 });
  } catch {
    ie && se.log(`Failed to add non-enumerable property "${t}" to object`, e);
  }
}
function J0(e, t) {
  try {
    const s = t.prototype || {};
    ((e.prototype = t.prototype = s), vr(e, "__sentry_original__", t));
  } catch {}
}
function Gd(e) {
  return e.__sentry_original__;
}
function Z0(e) {
  if (Ud(e)) return { message: e.message, name: e.name, stack: e.stack, ...Kg(e) };
  if (Ma(e)) {
    const t = { type: e.type, target: Gg(e.target), currentTarget: Gg(e.currentTarget), ...Kg(e) };
    return (typeof CustomEvent < "u" && Wn(e, CustomEvent) && (t.detail = e.detail), t);
  } else return e;
}
function Gg(e) {
  try {
    return kN(e) ? Q0(e) : Object.prototype.toString.call(e);
  } catch {
    return "<unknown>";
  }
}
function Kg(e) {
  if (typeof e == "object" && e !== null) {
    const t = {};
    for (const s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
    return t;
  } else return {};
}
function IN(e) {
  const t = Object.keys(Z0(e));
  return (t.sort(), t[0] ? t.join(", ") : "[object has no keys]");
}
function Uc(e, t = 0) {
  return typeof e != "string" || t === 0 || e.length <= t ? e : `${e.slice(0, t)}...`;
}
function Yg(e, t) {
  if (!Array.isArray(e)) return "";
  const s = [];
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    try {
      X0(a) ? s.push(G0(a)) : s.push(String(a));
    } catch {
      s.push("[value cannot be serialized]");
    }
  }
  return s.join(t);
}
function pa(e, t, s = !1) {
  return pn(e) ? (bN(t) ? t.test(e) : pn(t) ? (s ? e === t : e.includes(t)) : !1) : !1;
}
function Da(e, t = [], s = !1) {
  return t.some((i) => pa(e, i, s));
}
function AN() {
  const e = ve;
  return e.crypto || e.msCrypto;
}
let uc;
function MN() {
  return Math.random() * 16;
}
function At(e = AN()) {
  try {
    if (e?.randomUUID) return e.randomUUID().replace(/-/g, "");
  } catch {}
  return (
    uc || (uc = "10000000100040008000" + 1e11),
    uc.replace(/[018]/g, (t) => (t ^ ((MN() & 15) >> (t / 4))).toString(16))
  );
}
function ex(e) {
  return e.exception?.values?.[0];
}
function dr(e) {
  const { message: t, event_id: s } = e;
  if (t) return t;
  const i = ex(e);
  return i
    ? i.type && i.value
      ? `${i.type}: ${i.value}`
      : i.type || i.value || s || "<unknown>"
    : s || "<unknown>";
}
function zc(e, t, s) {
  const i = (e.exception = e.exception || {}),
    a = (i.values = i.values || []),
    u = (a[0] = a[0] || {});
  (u.value || (u.value = t || ""), u.type || (u.type = "Error"));
}
function is(e, t) {
  const s = ex(e);
  if (!s) return;
  const i = { type: "generic", handled: !0 },
    a = s.mechanism;
  if (((s.mechanism = { ...i, ...a, ...t }), t && "data" in t)) {
    const u = { ...a?.data, ...t.data };
    s.mechanism.data = u;
  }
}
function Xg(e) {
  if (DN(e)) return !0;
  try {
    vr(e, "__sentry_captured__", !0);
  } catch {}
  return !1;
}
function DN(e) {
  try {
    return e.__sentry_captured__;
  } catch {}
}
const tx = 1e3;
function Li() {
  return Date.now() / tx;
}
function LN() {
  const { performance: e } = ve;
  if (!e?.now || !e.timeOrigin) return Li;
  const t = e.timeOrigin;
  return () => (t + e.now()) / tx;
}
let qg;
function hn() {
  return (qg ?? (qg = LN()))();
}
function ON(e) {
  const t = hn(),
    s = {
      sid: At(),
      init: !0,
      timestamp: t,
      started: t,
      duration: 0,
      status: "ok",
      errors: 0,
      ignoreDuration: !1,
      toJSON: () => VN(s),
    };
  return (e && os(s, e), s);
}
function os(e, t = {}) {
  if (
    (t.user &&
      (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address),
      !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)),
    (e.timestamp = t.timestamp || hn()),
    t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism),
    t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration),
    t.sid && (e.sid = t.sid.length === 32 ? t.sid : At()),
    t.init !== void 0 && (e.init = t.init),
    !e.did && t.did && (e.did = `${t.did}`),
    typeof t.started == "number" && (e.started = t.started),
    e.ignoreDuration)
  )
    e.duration = void 0;
  else if (typeof t.duration == "number") e.duration = t.duration;
  else {
    const s = e.timestamp - e.started;
    e.duration = s >= 0 ? s : 0;
  }
  (t.release && (e.release = t.release),
    t.environment && (e.environment = t.environment),
    !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress),
    !e.userAgent && t.userAgent && (e.userAgent = t.userAgent),
    typeof t.errors == "number" && (e.errors = t.errors),
    t.status && (e.status = t.status));
}
function FN(e, t) {
  let s = {};
  (e.status === "ok" && (s = { status: "exited" }), os(e, s));
}
function VN(e) {
  return {
    sid: `${e.sid}`,
    init: e.init,
    started: new Date(e.started * 1e3).toISOString(),
    timestamp: new Date(e.timestamp * 1e3).toISOString(),
    status: e.status,
    errors: e.errors,
    did: typeof e.did == "number" || typeof e.did == "string" ? `${e.did}` : void 0,
    duration: e.duration,
    abnormal_mechanism: e.abnormal_mechanism,
    attrs: {
      release: e.release,
      environment: e.environment,
      ip_address: e.ipAddress,
      user_agent: e.userAgent,
    },
  };
}
function Oi(e, t, s = 2) {
  if (!t || typeof t != "object" || s <= 0) return t;
  if (e && Object.keys(t).length === 0) return e;
  const i = { ...e };
  for (const a in t) Object.prototype.hasOwnProperty.call(t, a) && (i[a] = Oi(i[a], t[a], s - 1));
  return i;
}
function Qg() {
  return At();
}
function nx() {
  return At().substring(16);
}
const Hc = "_sentrySpan";
function Jg(e, t) {
  t ? vr(e, Hc, t) : delete e[Hc];
}
function Zg(e) {
  return e[Hc];
}
const BN = 100;
class vn {
  constructor() {
    ((this._notifyingListeners = !1),
      (this._scopeListeners = []),
      (this._eventProcessors = []),
      (this._breadcrumbs = []),
      (this._attachments = []),
      (this._user = {}),
      (this._tags = {}),
      (this._attributes = {}),
      (this._extra = {}),
      (this._contexts = {}),
      (this._sdkProcessingMetadata = {}),
      (this._propagationContext = { traceId: Qg(), sampleRand: Math.random() }));
  }
  clone() {
    const t = new vn();
    return (
      (t._breadcrumbs = [...this._breadcrumbs]),
      (t._tags = { ...this._tags }),
      (t._attributes = { ...this._attributes }),
      (t._extra = { ...this._extra }),
      (t._contexts = { ...this._contexts }),
      this._contexts.flags && (t._contexts.flags = { values: [...this._contexts.flags.values] }),
      (t._user = this._user),
      (t._level = this._level),
      (t._session = this._session),
      (t._transactionName = this._transactionName),
      (t._fingerprint = this._fingerprint),
      (t._eventProcessors = [...this._eventProcessors]),
      (t._attachments = [...this._attachments]),
      (t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
      (t._propagationContext = { ...this._propagationContext }),
      (t._client = this._client),
      (t._lastEventId = this._lastEventId),
      Jg(t, Zg(this)),
      t
    );
  }
  setClient(t) {
    this._client = t;
  }
  setLastEventId(t) {
    this._lastEventId = t;
  }
  getClient() {
    return this._client;
  }
  lastEventId() {
    return this._lastEventId;
  }
  addScopeListener(t) {
    this._scopeListeners.push(t);
  }
  addEventProcessor(t) {
    return (this._eventProcessors.push(t), this);
  }
  setUser(t) {
    return (
      (this._user = t || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }),
      this._session && os(this._session, { user: t }),
      this._notifyScopeListeners(),
      this
    );
  }
  getUser() {
    return this._user;
  }
  setTags(t) {
    return ((this._tags = { ...this._tags, ...t }), this._notifyScopeListeners(), this);
  }
  setTag(t, s) {
    return this.setTags({ [t]: s });
  }
  setAttributes(t) {
    return ((this._attributes = { ...this._attributes, ...t }), this._notifyScopeListeners(), this);
  }
  setAttribute(t, s) {
    return this.setAttributes({ [t]: s });
  }
  removeAttribute(t) {
    return (
      t in this._attributes && (delete this._attributes[t], this._notifyScopeListeners()),
      this
    );
  }
  setExtras(t) {
    return ((this._extra = { ...this._extra, ...t }), this._notifyScopeListeners(), this);
  }
  setExtra(t, s) {
    return ((this._extra = { ...this._extra, [t]: s }), this._notifyScopeListeners(), this);
  }
  setFingerprint(t) {
    return ((this._fingerprint = t), this._notifyScopeListeners(), this);
  }
  setLevel(t) {
    return ((this._level = t), this._notifyScopeListeners(), this);
  }
  setTransactionName(t) {
    return ((this._transactionName = t), this._notifyScopeListeners(), this);
  }
  setContext(t, s) {
    return (
      s === null ? delete this._contexts[t] : (this._contexts[t] = s),
      this._notifyScopeListeners(),
      this
    );
  }
  setSession(t) {
    return (t ? (this._session = t) : delete this._session, this._notifyScopeListeners(), this);
  }
  getSession() {
    return this._session;
  }
  update(t) {
    if (!t) return this;
    const s = typeof t == "function" ? t(this) : t,
      i = s instanceof vn ? s.getScopeData() : Ti(s) ? t : void 0,
      {
        tags: a,
        attributes: u,
        extra: c,
        user: f,
        contexts: p,
        level: g,
        fingerprint: y = [],
        propagationContext: v,
      } = i || {};
    return (
      (this._tags = { ...this._tags, ...a }),
      (this._attributes = { ...this._attributes, ...u }),
      (this._extra = { ...this._extra, ...c }),
      (this._contexts = { ...this._contexts, ...p }),
      f && Object.keys(f).length && (this._user = f),
      g && (this._level = g),
      y.length && (this._fingerprint = y),
      v && (this._propagationContext = v),
      this
    );
  }
  clear() {
    return (
      (this._breadcrumbs = []),
      (this._tags = {}),
      (this._attributes = {}),
      (this._extra = {}),
      (this._user = {}),
      (this._contexts = {}),
      (this._level = void 0),
      (this._transactionName = void 0),
      (this._fingerprint = void 0),
      (this._session = void 0),
      Jg(this, void 0),
      (this._attachments = []),
      this.setPropagationContext({ traceId: Qg(), sampleRand: Math.random() }),
      this._notifyScopeListeners(),
      this
    );
  }
  addBreadcrumb(t, s) {
    const i = typeof s == "number" ? s : BN;
    if (i <= 0) return this;
    const a = { timestamp: Li(), ...t, message: t.message ? Uc(t.message, 2048) : t.message };
    return (
      this._breadcrumbs.push(a),
      this._breadcrumbs.length > i &&
        ((this._breadcrumbs = this._breadcrumbs.slice(-i)),
        this._client?.recordDroppedEvent("buffer_overflow", "log_item")),
      this._notifyScopeListeners(),
      this
    );
  }
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  clearBreadcrumbs() {
    return ((this._breadcrumbs = []), this._notifyScopeListeners(), this);
  }
  addAttachment(t) {
    return (this._attachments.push(t), this);
  }
  clearAttachments() {
    return ((this._attachments = []), this);
  }
  getScopeData() {
    return {
      breadcrumbs: this._breadcrumbs,
      attachments: this._attachments,
      contexts: this._contexts,
      tags: this._tags,
      attributes: this._attributes,
      extra: this._extra,
      user: this._user,
      level: this._level,
      fingerprint: this._fingerprint || [],
      eventProcessors: this._eventProcessors,
      propagationContext: this._propagationContext,
      sdkProcessingMetadata: this._sdkProcessingMetadata,
      transactionName: this._transactionName,
      span: Zg(this),
    };
  }
  setSDKProcessingMetadata(t) {
    return ((this._sdkProcessingMetadata = Oi(this._sdkProcessingMetadata, t, 2)), this);
  }
  setPropagationContext(t) {
    return ((this._propagationContext = t), this);
  }
  getPropagationContext() {
    return this._propagationContext;
  }
  captureException(t, s) {
    const i = s?.event_id || At();
    if (!this._client)
      return (ie && se.warn("No client configured on scope - will not capture exception!"), i);
    const a = new Error("Sentry syntheticException");
    return (
      this._client.captureException(
        t,
        { originalException: t, syntheticException: a, ...s, event_id: i },
        this
      ),
      i
    );
  }
  captureMessage(t, s, i) {
    const a = i?.event_id || At();
    if (!this._client)
      return (ie && se.warn("No client configured on scope - will not capture message!"), a);
    const u = i?.syntheticException ?? new Error(t);
    return (
      this._client.captureMessage(
        t,
        s,
        { originalException: t, syntheticException: u, ...i, event_id: a },
        this
      ),
      a
    );
  }
  captureEvent(t, s) {
    const i = s?.event_id || At();
    return this._client
      ? (this._client.captureEvent(t, { ...s, event_id: i }, this), i)
      : (ie && se.warn("No client configured on scope - will not capture event!"), i);
  }
  _notifyScopeListeners() {
    this._notifyingListeners ||
      ((this._notifyingListeners = !0),
      this._scopeListeners.forEach((t) => {
        t(this);
      }),
      (this._notifyingListeners = !1));
  }
}
function $N() {
  return gs("defaultCurrentScope", () => new vn());
}
function UN() {
  return gs("defaultIsolationScope", () => new vn());
}
class zN {
  constructor(t, s) {
    let i;
    t ? (i = t) : (i = new vn());
    let a;
    (s ? (a = s) : (a = new vn()), (this._stack = [{ scope: i }]), (this._isolationScope = a));
  }
  withScope(t) {
    const s = this._pushScope();
    let i;
    try {
      i = t(s);
    } catch (a) {
      throw (this._popScope(), a);
    }
    return Di(i)
      ? i.then(
          (a) => (this._popScope(), a),
          (a) => {
            throw (this._popScope(), a);
          }
        )
      : (this._popScope(), i);
  }
  getClient() {
    return this.getStackTop().client;
  }
  getScope() {
    return this.getStackTop().scope;
  }
  getIsolationScope() {
    return this._isolationScope;
  }
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  _pushScope() {
    const t = this.getScope().clone();
    return (this._stack.push({ client: this.getClient(), scope: t }), t);
  }
  _popScope() {
    return this._stack.length <= 1 ? !1 : !!this._stack.pop();
  }
}
function as() {
  const e = Ra(),
    t = Ia(e);
  return (t.stack = t.stack || new zN($N(), UN()));
}
function HN(e) {
  return as().withScope(e);
}
function WN(e, t) {
  const s = as();
  return s.withScope(() => ((s.getStackTop().scope = e), t(e)));
}
function ey(e) {
  return as().withScope(() => e(as().getIsolationScope()));
}
function GN() {
  return {
    withIsolationScope: ey,
    withScope: HN,
    withSetScope: WN,
    withSetIsolationScope: (e, t) => ey(t),
    getCurrentScope: () => as().getScope(),
    getIsolationScope: () => as().getIsolationScope(),
  };
}
function Kd(e) {
  const t = Ia(e);
  return t.acs ? t.acs : GN();
}
function Kn() {
  const e = Ra();
  return Kd(e).getCurrentScope();
}
function xs() {
  const e = Ra();
  return Kd(e).getIsolationScope();
}
function KN() {
  return gs("globalScope", () => new vn());
}
function YN(...e) {
  const t = Ra(),
    s = Kd(t);
  if (e.length === 2) {
    const [i, a] = e;
    return i ? s.withSetScope(i, a) : s.withScope(a);
  }
  return s.withScope(e[0]);
}
function ot() {
  return Kn().getClient();
}
function XN(e) {
  const t = e.getPropagationContext(),
    { traceId: s, parentSpanId: i, propagationSpanId: a } = t,
    u = { trace_id: s, span_id: a || nx() };
  return (i && (u.parent_span_id = i), u);
}
const qN = "sentry.source",
  QN = "sentry.sample_rate",
  JN = "sentry.previous_trace_sample_rate",
  ZN = "sentry.op",
  ej = "sentry.origin",
  rx = "sentry.profile_id",
  sx = "sentry.exclusive_time",
  tj = 0,
  nj = 1,
  rj = "_sentryScope",
  sj = "_sentryIsolationScope";
function ij(e) {
  if (e) {
    if (typeof e == "object" && "deref" in e && typeof e.deref == "function")
      try {
        return e.deref();
      } catch {
        return;
      }
    return e;
  }
}
function ix(e) {
  const t = e;
  return { scope: t[rj], isolationScope: ij(t[sj]) };
}
const oj = "sentry-",
  aj = /^sentry-/;
function lj(e) {
  const t = uj(e);
  if (!t) return;
  const s = Object.entries(t).reduce((i, [a, u]) => {
    if (a.match(aj)) {
      const c = a.slice(oj.length);
      i[c] = u;
    }
    return i;
  }, {});
  if (Object.keys(s).length > 0) return s;
}
function uj(e) {
  if (!(!e || (!pn(e) && !Array.isArray(e))))
    return Array.isArray(e)
      ? e.reduce((t, s) => {
          const i = ty(s);
          return (
            Object.entries(i).forEach(([a, u]) => {
              t[a] = u;
            }),
            t
          );
        }, {})
      : ty(e);
}
function ty(e) {
  return e
    .split(",")
    .map((t) => {
      const s = t.indexOf("=");
      if (s === -1) return [];
      const i = t.slice(0, s),
        a = t.slice(s + 1);
      return [i, a].map((u) => {
        try {
          return decodeURIComponent(u.trim());
        } catch {
          return;
        }
      });
    })
    .reduce((t, [s, i]) => (s && i && (t[s] = i), t), {});
}
const cj = /^o(\d+)\./,
  dj = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function fj(e) {
  return e === "http" || e === "https";
}
function Fi(e, t = !1) {
  const { host: s, path: i, pass: a, port: u, projectId: c, protocol: f, publicKey: p } = e;
  return `${f}://${p}${t && a ? `:${a}` : ""}@${s}${u ? `:${u}` : ""}/${i && `${i}/`}${c}`;
}
function pj(e) {
  const t = dj.exec(e);
  if (!t) {
    ys(() => {
      console.error(`Invalid Sentry Dsn: ${e}`);
    });
    return;
  }
  const [s, i, a = "", u = "", c = "", f = ""] = t.slice(1);
  let p = "",
    g = f;
  const y = g.split("/");
  if ((y.length > 1 && ((p = y.slice(0, -1).join("/")), (g = y.pop())), g)) {
    const v = g.match(/^\d+/);
    v && (g = v[0]);
  }
  return ox({ host: u, pass: a, path: p, projectId: g, port: c, protocol: s, publicKey: i });
}
function ox(e) {
  return {
    protocol: e.protocol,
    publicKey: e.publicKey || "",
    pass: e.pass || "",
    host: e.host,
    port: e.port || "",
    path: e.path || "",
    projectId: e.projectId,
  };
}
function hj(e) {
  if (!ie) return !0;
  const { port: t, projectId: s, protocol: i } = e;
  return ["protocol", "publicKey", "host", "projectId"].find((c) =>
    e[c] ? !1 : (se.error(`Invalid Sentry Dsn: ${c} missing`), !0)
  )
    ? !1
    : s.match(/^\d+$/)
      ? fj(i)
        ? t && isNaN(parseInt(t, 10))
          ? (se.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1)
          : !0
        : (se.error(`Invalid Sentry Dsn: Invalid protocol ${i}`), !1)
      : (se.error(`Invalid Sentry Dsn: Invalid projectId ${s}`), !1);
}
function mj(e) {
  return e.match(cj)?.[1];
}
function gj(e) {
  const t = e.getOptions(),
    { host: s } = e.getDsn() || {};
  let i;
  return (t.orgId ? (i = String(t.orgId)) : s && (i = mj(s)), i);
}
function yj(e) {
  const t = typeof e == "string" ? pj(e) : ox(e);
  if (!(!t || !hj(t))) return t;
}
function vj(e) {
  if (typeof e == "boolean") return Number(e);
  const t = typeof e == "string" ? parseFloat(e) : e;
  if (!(typeof t != "number" || isNaN(t) || t < 0 || t > 1)) return t;
}
const ax = 1;
let ny = !1;
function xj(e) {
  const { spanId: t, traceId: s, isRemote: i } = e.spanContext(),
    a = i ? t : Yd(e).parent_span_id,
    u = ix(e).scope,
    c = i ? u?.getPropagationContext().propagationSpanId || nx() : t;
  return { parent_span_id: a, span_id: c, trace_id: s };
}
function wj(e) {
  if (e && e.length > 0)
    return e.map(({ context: { spanId: t, traceId: s, traceFlags: i, ...a }, attributes: u }) => ({
      span_id: t,
      trace_id: s,
      sampled: i === ax,
      attributes: u,
      ...a,
    }));
}
function ry(e) {
  return typeof e == "number"
    ? sy(e)
    : Array.isArray(e)
      ? e[0] + e[1] / 1e9
      : e instanceof Date
        ? sy(e.getTime())
        : hn();
}
function sy(e) {
  return e > 9999999999 ? e / 1e3 : e;
}
function Yd(e) {
  if (Ej(e)) return e.getSpanJSON();
  const { spanId: t, traceId: s } = e.spanContext();
  if (Sj(e)) {
    const { attributes: i, startTime: a, name: u, endTime: c, status: f, links: p } = e,
      g =
        "parentSpanId" in e
          ? e.parentSpanId
          : "parentSpanContext" in e
            ? e.parentSpanContext?.spanId
            : void 0;
    return {
      span_id: t,
      trace_id: s,
      data: i,
      description: u,
      parent_span_id: g,
      start_timestamp: ry(a),
      timestamp: ry(c) || void 0,
      status: Tj(f),
      op: i[ZN],
      origin: i[ej],
      links: wj(p),
    };
  }
  return { span_id: t, trace_id: s, start_timestamp: 0, data: {} };
}
function Sj(e) {
  const t = e;
  return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status;
}
function Ej(e) {
  return typeof e.getSpanJSON == "function";
}
function _j(e) {
  const { traceFlags: t } = e.spanContext();
  return t === ax;
}
function Tj(e) {
  if (!(!e || e.code === tj)) return e.code === nj ? "ok" : e.message || "internal_error";
}
const Cj = "_sentryRootSpan";
function lx(e) {
  return e[Cj] || e;
}
function iy() {
  ny ||
    (ys(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`."
      );
    }),
    (ny = !0));
}
function kj(e) {
  if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__) return !1;
  const t = ot()?.getOptions();
  return !!t && (t.tracesSampleRate != null || !!t.tracesSampler);
}
function oy(e) {
  se.log(`Ignoring span ${e.op} - ${e.description} because it matches \`ignoreSpans\`.`);
}
function ay(e, t) {
  if (!t?.length || !e.description) return !1;
  for (const s of t) {
    if (Nj(s)) {
      if (pa(e.description, s)) return (ie && oy(e), !0);
      continue;
    }
    if (!s.name && !s.op) continue;
    const i = s.name ? pa(e.description, s.name) : !0,
      a = s.op ? e.op && pa(e.op, s.op) : !0;
    if (i && a) return (ie && oy(e), !0);
  }
  return !1;
}
function bj(e, t) {
  const s = t.parent_span_id,
    i = t.span_id;
  if (s) for (const a of e) a.parent_span_id === i && (a.parent_span_id = s);
}
function Nj(e) {
  return typeof e == "string" || e instanceof RegExp;
}
const Xd = "production",
  jj = "_frozenDsc";
function ux(e, t) {
  const s = t.getOptions(),
    { publicKey: i } = t.getDsn() || {},
    a = {
      environment: s.environment || Xd,
      release: s.release,
      public_key: i,
      trace_id: e,
      org_id: gj(t),
    };
  return (t.emit("createDsc", a), a);
}
function Pj(e, t) {
  const s = t.getPropagationContext();
  return s.dsc || ux(s.traceId, e);
}
function Rj(e) {
  const t = ot();
  if (!t) return {};
  const s = lx(e),
    i = Yd(s),
    a = i.data,
    u = s.spanContext().traceState,
    c = u?.get("sentry.sample_rate") ?? a[QN] ?? a[JN];
  function f(b) {
    return ((typeof c == "number" || typeof c == "string") && (b.sample_rate = `${c}`), b);
  }
  const p = s[jj];
  if (p) return f(p);
  const g = u?.get("sentry.dsc"),
    y = g && lj(g);
  if (y) return f(y);
  const v = ux(e.spanContext().traceId, t),
    w = a[qN],
    E = i.description;
  return (
    w !== "url" && E && (v.transaction = E),
    kj() &&
      ((v.sampled = String(_j(s))),
      (v.sample_rand =
        u?.get("sentry.sample_rand") ??
        ix(s).scope?.getPropagationContext().sampleRand.toString())),
    f(v),
    t.emit("createDsc", v, s),
    v
  );
}
function cn(e, t = 100, s = 1 / 0) {
  try {
    return Wc("", e, t, s);
  } catch (i) {
    return { ERROR: `**non-serializable** (${i})` };
  }
}
function cx(e, t = 3, s = 100 * 1024) {
  const i = cn(e, t);
  return Dj(i) > s ? cx(e, t - 1, s) : i;
}
function Wc(e, t, s = 1 / 0, i = 1 / 0, a = Lj()) {
  const [u, c] = a;
  if (
    t == null ||
    ["boolean", "string"].includes(typeof t) ||
    (typeof t == "number" && Number.isFinite(t))
  )
    return t;
  const f = Ij(e, t);
  if (!f.startsWith("[object ")) return f;
  if (t.__sentry_skip_normalization__) return t;
  const p =
    typeof t.__sentry_override_normalization_depth__ == "number"
      ? t.__sentry_override_normalization_depth__
      : s;
  if (p === 0) return f.replace("object ", "");
  if (u(t)) return "[Circular ~]";
  const g = t;
  if (g && typeof g.toJSON == "function")
    try {
      const E = g.toJSON();
      return Wc("", E, p - 1, i, a);
    } catch {}
  const y = Array.isArray(t) ? [] : {};
  let v = 0;
  const w = Z0(t);
  for (const E in w) {
    if (!Object.prototype.hasOwnProperty.call(w, E)) continue;
    if (v >= i) {
      y[E] = "[MaxProperties ~]";
      break;
    }
    const b = w[E];
    ((y[E] = Wc(E, b, p - 1, i, a)), v++);
  }
  return (c(t), y);
}
function Ij(e, t) {
  try {
    if (e === "domain" && t && typeof t == "object" && t._events) return "[Domain]";
    if (e === "domainEmitter") return "[DomainEmitter]";
    if (typeof global < "u" && t === global) return "[Global]";
    if (typeof window < "u" && t === window) return "[Window]";
    if (typeof document < "u" && t === document) return "[Document]";
    if (X0(t)) return G0(t);
    if (NN(t)) return "[SyntheticEvent]";
    if (typeof t == "number" && !Number.isFinite(t)) return `[${t}]`;
    if (typeof t == "function") return `[Function: ${Hn(t)}]`;
    if (typeof t == "symbol") return `[${String(t)}]`;
    if (typeof t == "bigint") return `[BigInt: ${String(t)}]`;
    const s = Aj(t);
    return /^HTML(\w*)Element$/.test(s) ? `[HTMLElement: ${s}]` : `[object ${s}]`;
  } catch (s) {
    return `**non-serializable** (${s})`;
  }
}
function Aj(e) {
  const t = Object.getPrototypeOf(e);
  return t?.constructor ? t.constructor.name : "null prototype";
}
function Mj(e) {
  return ~-encodeURI(e).split(/%..|./).length;
}
function Dj(e) {
  return Mj(JSON.stringify(e));
}
function Lj() {
  const e = new WeakSet();
  function t(i) {
    return e.has(i) ? !0 : (e.add(i), !1);
  }
  function s(i) {
    e.delete(i);
  }
  return [t, s];
}
function ws(e, t = []) {
  return [e, t];
}
function Oj(e, t) {
  const [s, i] = e;
  return [s, [...i, t]];
}
function ly(e, t) {
  const s = e[1];
  for (const i of s) {
    const a = i[0].type;
    if (t(i, a)) return !0;
  }
  return !1;
}
function Gc(e) {
  const t = Ia(ve);
  return t.encodePolyfill ? t.encodePolyfill(e) : new TextEncoder().encode(e);
}
function Fj(e) {
  const [t, s] = e;
  let i = JSON.stringify(t);
  function a(u) {
    typeof i == "string"
      ? (i = typeof u == "string" ? i + u : [Gc(i), u])
      : i.push(typeof u == "string" ? Gc(u) : u);
  }
  for (const u of s) {
    const [c, f] = u;
    if (
      (a(`
${JSON.stringify(c)}
`),
      typeof f == "string" || f instanceof Uint8Array)
    )
      a(f);
    else {
      let p;
      try {
        p = JSON.stringify(f);
      } catch {
        p = JSON.stringify(cn(f));
      }
      a(p);
    }
  }
  return typeof i == "string" ? i : Vj(i);
}
function Vj(e) {
  const t = e.reduce((a, u) => a + u.length, 0),
    s = new Uint8Array(t);
  let i = 0;
  for (const a of e) (s.set(a, i), (i += a.length));
  return s;
}
function Bj(e) {
  const t = typeof e.data == "string" ? Gc(e.data) : e.data;
  return [
    {
      type: "attachment",
      length: t.length,
      filename: e.filename,
      content_type: e.contentType,
      attachment_type: e.attachmentType,
    },
    t,
  ];
}
const $j = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  span: "span",
  raw_security: "security",
  log: "log_item",
  metric: "metric",
  trace_metric: "metric",
};
function uy(e) {
  return $j[e];
}
function dx(e) {
  if (!e?.sdk) return;
  const { name: t, version: s } = e.sdk;
  return { name: t, version: s };
}
function Uj(e, t, s, i) {
  const a = e.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: e.event_id,
    sent_at: new Date().toISOString(),
    ...(t && { sdk: t }),
    ...(!!s && i && { dsn: Fi(i) }),
    ...(a && { trace: a }),
  };
}
function zj(e, t) {
  if (!t) return e;
  const s = e.sdk || {};
  return (
    (e.sdk = {
      ...s,
      name: s.name || t.name,
      version: s.version || t.version,
      integrations: [...(e.sdk?.integrations || []), ...(t.integrations || [])],
      packages: [...(e.sdk?.packages || []), ...(t.packages || [])],
      settings: e.sdk?.settings || t.settings ? { ...e.sdk?.settings, ...t.settings } : void 0,
    }),
    e
  );
}
function Hj(e, t, s, i) {
  const a = dx(s),
    u = {
      sent_at: new Date().toISOString(),
      ...(a && { sdk: a }),
      ...(!!i && t && { dsn: Fi(t) }),
    },
    c = "aggregates" in e ? [{ type: "sessions" }, e] : [{ type: "session" }, e.toJSON()];
  return ws(u, [c]);
}
function Wj(e, t, s, i) {
  const a = dx(s),
    u = e.type && e.type !== "replay_event" ? e.type : "event";
  zj(e, s?.sdk);
  const c = Uj(e, a, i, t);
  return (delete e.sdkProcessingMetadata, ws(c, [[{ type: u }, e]]));
}
const cc = 0,
  cy = 1,
  dy = 2;
function La(e) {
  return new Ci((t) => {
    t(e);
  });
}
function qd(e) {
  return new Ci((t, s) => {
    s(e);
  });
}
class Ci {
  constructor(t) {
    ((this._state = cc), (this._handlers = []), this._runExecutor(t));
  }
  then(t, s) {
    return new Ci((i, a) => {
      (this._handlers.push([
        !1,
        (u) => {
          if (!t) i(u);
          else
            try {
              i(t(u));
            } catch (c) {
              a(c);
            }
        },
        (u) => {
          if (!s) a(u);
          else
            try {
              i(s(u));
            } catch (c) {
              a(c);
            }
        },
      ]),
        this._executeHandlers());
    });
  }
  catch(t) {
    return this.then((s) => s, t);
  }
  finally(t) {
    return new Ci((s, i) => {
      let a, u;
      return this.then(
        (c) => {
          ((u = !1), (a = c), t && t());
        },
        (c) => {
          ((u = !0), (a = c), t && t());
        }
      ).then(() => {
        if (u) {
          i(a);
          return;
        }
        s(a);
      });
    });
  }
  _executeHandlers() {
    if (this._state === cc) return;
    const t = this._handlers.slice();
    ((this._handlers = []),
      t.forEach((s) => {
        s[0] ||
          (this._state === cy && s[1](this._value),
          this._state === dy && s[2](this._value),
          (s[0] = !0));
      }));
  }
  _runExecutor(t) {
    const s = (u, c) => {
        if (this._state === cc) {
          if (Di(c)) {
            c.then(i, a);
            return;
          }
          ((this._state = u), (this._value = c), this._executeHandlers());
        }
      },
      i = (u) => {
        s(cy, u);
      },
      a = (u) => {
        s(dy, u);
      };
    try {
      t(i, a);
    } catch (u) {
      a(u);
    }
  }
}
function Gj(e, t, s, i = 0) {
  try {
    const a = Kc(t, s, e, i);
    return Di(a) ? a : La(a);
  } catch (a) {
    return qd(a);
  }
}
function Kc(e, t, s, i) {
  const a = s[i];
  if (!e || !a) return e;
  const u = a({ ...e }, t);
  return (
    ie && u === null && se.log(`Event processor "${a.id || "?"}" dropped event`),
    Di(u) ? u.then((c) => Kc(c, t, s, i + 1)) : Kc(u, t, s, i + 1)
  );
}
function Kj(e, t) {
  const { fingerprint: s, span: i, breadcrumbs: a, sdkProcessingMetadata: u } = t;
  (Yj(e, t), i && Qj(e, i), Jj(e, s), Xj(e, a), qj(e, u));
}
function fy(e, t) {
  const {
    extra: s,
    tags: i,
    attributes: a,
    user: u,
    contexts: c,
    level: f,
    sdkProcessingMetadata: p,
    breadcrumbs: g,
    fingerprint: y,
    eventProcessors: v,
    attachments: w,
    propagationContext: E,
    transactionName: b,
    span: A,
  } = t;
  (di(e, "extra", s),
    di(e, "tags", i),
    di(e, "attributes", a),
    di(e, "user", u),
    di(e, "contexts", c),
    (e.sdkProcessingMetadata = Oi(e.sdkProcessingMetadata, p, 2)),
    f && (e.level = f),
    b && (e.transactionName = b),
    A && (e.span = A),
    g.length && (e.breadcrumbs = [...e.breadcrumbs, ...g]),
    y.length && (e.fingerprint = [...e.fingerprint, ...y]),
    v.length && (e.eventProcessors = [...e.eventProcessors, ...v]),
    w.length && (e.attachments = [...e.attachments, ...w]),
    (e.propagationContext = { ...e.propagationContext, ...E }));
}
function di(e, t, s) {
  e[t] = Oi(e[t], s, 1);
}
function Yj(e, t) {
  const { extra: s, tags: i, user: a, contexts: u, level: c, transactionName: f } = t;
  (Object.keys(s).length && (e.extra = { ...s, ...e.extra }),
    Object.keys(i).length && (e.tags = { ...i, ...e.tags }),
    Object.keys(a).length && (e.user = { ...a, ...e.user }),
    Object.keys(u).length && (e.contexts = { ...u, ...e.contexts }),
    c && (e.level = c),
    f && e.type !== "transaction" && (e.transaction = f));
}
function Xj(e, t) {
  const s = [...(e.breadcrumbs || []), ...t];
  e.breadcrumbs = s.length ? s : void 0;
}
function qj(e, t) {
  e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata, ...t };
}
function Qj(e, t) {
  ((e.contexts = { trace: xj(t), ...e.contexts }),
    (e.sdkProcessingMetadata = { dynamicSamplingContext: Rj(t), ...e.sdkProcessingMetadata }));
  const s = lx(t),
    i = Yd(s).description;
  i && !e.transaction && e.type === "transaction" && (e.transaction = i);
}
function Jj(e, t) {
  ((e.fingerprint = e.fingerprint
    ? Array.isArray(e.fingerprint)
      ? e.fingerprint
      : [e.fingerprint]
    : []),
    t && (e.fingerprint = e.fingerprint.concat(t)),
    e.fingerprint.length || delete e.fingerprint);
}
let ur, py, hy, Bn;
function Zj(e) {
  const t = ve._sentryDebugIds,
    s = ve._debugIds;
  if (!t && !s) return {};
  const i = t ? Object.keys(t) : [],
    a = s ? Object.keys(s) : [];
  if (Bn && i.length === py && a.length === hy) return Bn;
  ((py = i.length), (hy = a.length), (Bn = {}), ur || (ur = {}));
  const u = (c, f) => {
    for (const p of c) {
      const g = f[p],
        y = ur?.[p];
      if (y && Bn && g) ((Bn[y[0]] = g), ur && (ur[p] = [y[0], g]));
      else if (g) {
        const v = e(p);
        for (let w = v.length - 1; w >= 0; w--) {
          const b = v[w]?.filename;
          if (b && Bn && ur) {
            ((Bn[b] = g), (ur[p] = [b, g]));
            break;
          }
        }
      }
    }
  };
  return (t && u(i, t), s && u(a, s), Bn);
}
function eP(e, t, s, i, a, u) {
  const { normalizeDepth: c = 3, normalizeMaxBreadth: f = 1e3 } = e,
    p = { ...t, event_id: t.event_id || s.event_id || At(), timestamp: t.timestamp || Li() },
    g = s.integrations || e.integrations.map((k) => k.name);
  (tP(p, e),
    sP(p, g),
    a && a.emit("applyFrameMetadata", t),
    t.type === void 0 && nP(p, e.stackParser));
  const y = oP(i, s.captureContext);
  s.mechanism && is(p, s.mechanism);
  const v = a ? a.getEventProcessors() : [],
    w = KN().getScopeData();
  if (u) {
    const k = u.getScopeData();
    fy(w, k);
  }
  if (y) {
    const k = y.getScopeData();
    fy(w, k);
  }
  const E = [...(s.attachments || []), ...w.attachments];
  (E.length && (s.attachments = E), Kj(p, w));
  const b = [...v, ...w.eventProcessors];
  return Gj(b, p, s).then((k) => (k && rP(k), typeof c == "number" && c > 0 ? iP(k, c, f) : k));
}
function tP(e, t) {
  const { environment: s, release: i, dist: a, maxValueLength: u } = t;
  ((e.environment = e.environment || s || Xd),
    !e.release && i && (e.release = i),
    !e.dist && a && (e.dist = a));
  const c = e.request;
  (c?.url && u && (c.url = Uc(c.url, u)),
    u &&
      e.exception?.values?.forEach((f) => {
        f.value && (f.value = Uc(f.value, u));
      }));
}
function nP(e, t) {
  const s = Zj(t);
  e.exception?.values?.forEach((i) => {
    i.stacktrace?.frames?.forEach((a) => {
      a.filename && (a.debug_id = s[a.filename]);
    });
  });
}
function rP(e) {
  const t = {};
  if (
    (e.exception?.values?.forEach((i) => {
      i.stacktrace?.frames?.forEach((a) => {
        a.debug_id &&
          (a.abs_path ? (t[a.abs_path] = a.debug_id) : a.filename && (t[a.filename] = a.debug_id),
          delete a.debug_id);
      });
    }),
    Object.keys(t).length === 0)
  )
    return;
  ((e.debug_meta = e.debug_meta || {}), (e.debug_meta.images = e.debug_meta.images || []));
  const s = e.debug_meta.images;
  Object.entries(t).forEach(([i, a]) => {
    s.push({ type: "sourcemap", code_file: i, debug_id: a });
  });
}
function sP(e, t) {
  t.length > 0 &&
    ((e.sdk = e.sdk || {}), (e.sdk.integrations = [...(e.sdk.integrations || []), ...t]));
}
function iP(e, t, s) {
  if (!e) return null;
  const i = {
    ...e,
    ...(e.breadcrumbs && {
      breadcrumbs: e.breadcrumbs.map((a) => ({ ...a, ...(a.data && { data: cn(a.data, t, s) }) })),
    }),
    ...(e.user && { user: cn(e.user, t, s) }),
    ...(e.contexts && { contexts: cn(e.contexts, t, s) }),
    ...(e.extra && { extra: cn(e.extra, t, s) }),
  };
  return (
    e.contexts?.trace &&
      i.contexts &&
      ((i.contexts.trace = e.contexts.trace),
      e.contexts.trace.data && (i.contexts.trace.data = cn(e.contexts.trace.data, t, s))),
    e.spans &&
      (i.spans = e.spans.map((a) => ({ ...a, ...(a.data && { data: cn(a.data, t, s) }) }))),
    e.contexts?.flags && i.contexts && (i.contexts.flags = cn(e.contexts.flags, 3, s)),
    i
  );
}
function oP(e, t) {
  if (!t) return e;
  const s = e ? e.clone() : new vn();
  return (s.update(t), s);
}
function aP(e, t) {
  return Kn().captureException(e, void 0);
}
function fx(e, t) {
  return Kn().captureEvent(e, t);
}
function lP(e, t) {
  xs().setContext(e, t);
}
function my(e) {
  const t = xs(),
    s = Kn(),
    { userAgent: i } = ve.navigator || {},
    a = ON({ user: s.getUser() || t.getUser(), ...(i && { userAgent: i }), ...e }),
    u = t.getSession();
  return (u?.status === "ok" && os(u, { status: "exited" }), px(), t.setSession(a), a);
}
function px() {
  const e = xs(),
    s = Kn().getSession() || e.getSession();
  (s && FN(s), hx(), e.setSession());
}
function hx() {
  const e = xs(),
    t = ot(),
    s = e.getSession();
  s && t && t.captureSession(s);
}
function gy(e = !1) {
  if (e) {
    px();
    return;
  }
  hx();
}
const uP = "7";
function cP(e) {
  const t = e.protocol ? `${e.protocol}:` : "",
    s = e.port ? `:${e.port}` : "";
  return `${t}//${e.host}${s}${e.path ? `/${e.path}` : ""}/api/`;
}
function dP(e) {
  return `${cP(e)}${e.projectId}/envelope/`;
}
function fP(e, t) {
  const s = { sentry_version: uP };
  return (
    e.publicKey && (s.sentry_key = e.publicKey),
    t && (s.sentry_client = `${t.name}/${t.version}`),
    new URLSearchParams(s).toString()
  );
}
function pP(e, t, s) {
  return t || `${dP(e)}?${fP(e, s)}`;
}
const yy = [];
function hP(e) {
  const t = {};
  return (
    e.forEach((s) => {
      const { name: i } = s,
        a = t[i];
      (a && !a.isDefaultInstance && s.isDefaultInstance) || (t[i] = s);
    }),
    Object.values(t)
  );
}
function mP(e) {
  const t = e.defaultIntegrations || [],
    s = e.integrations;
  t.forEach((a) => {
    a.isDefaultInstance = !0;
  });
  let i;
  if (Array.isArray(s)) i = [...t, ...s];
  else if (typeof s == "function") {
    const a = s(t);
    i = Array.isArray(a) ? a : [a];
  } else i = t;
  return hP(i);
}
function gP(e, t) {
  const s = {};
  return (
    t.forEach((i) => {
      i && mx(e, i, s);
    }),
    s
  );
}
function vy(e, t) {
  for (const s of t) s?.afterAllSetup && s.afterAllSetup(e);
}
function mx(e, t, s) {
  if (s[t.name]) {
    ie && se.log(`Integration skipped because it was already installed: ${t.name}`);
    return;
  }
  if (
    ((s[t.name] = t),
    !yy.includes(t.name) && typeof t.setupOnce == "function" && (t.setupOnce(), yy.push(t.name)),
    t.setup && typeof t.setup == "function" && t.setup(e),
    typeof t.preprocessEvent == "function")
  ) {
    const i = t.preprocessEvent.bind(t);
    e.on("preprocessEvent", (a, u) => i(a, u, e));
  }
  if (typeof t.processEvent == "function") {
    const i = t.processEvent.bind(t),
      a = Object.assign((u, c) => i(u, c, e), { id: t.name });
    e.addEventProcessor(a);
  }
  ie && se.log(`Integration installed: ${t.name}`);
}
function yP(e) {
  return [
    { type: "log", item_count: e.length, content_type: "application/vnd.sentry.items.log+json" },
    { items: e },
  ];
}
function vP(e, t, s, i) {
  const a = {};
  return (
    t?.sdk && (a.sdk = { name: t.sdk.name, version: t.sdk.version }),
    s && i && (a.dsn = Fi(i)),
    ws(a, [yP(e)])
  );
}
function gx(e, t) {
  const s = t ?? xP(e) ?? [];
  if (s.length === 0) return;
  const i = e.getOptions(),
    a = vP(s, i._metadata, i.tunnel, e.getDsn());
  (yx().set(e, []), e.emit("flushLogs"), e.sendEnvelope(a));
}
function xP(e) {
  return yx().get(e);
}
function yx() {
  return gs("clientToLogBufferMap", () => new WeakMap());
}
function wP(e) {
  return [
    {
      type: "trace_metric",
      item_count: e.length,
      content_type: "application/vnd.sentry.items.trace-metric+json",
    },
    { items: e },
  ];
}
function SP(e, t, s, i) {
  const a = {};
  return (
    t?.sdk && (a.sdk = { name: t.sdk.name, version: t.sdk.version }),
    s && i && (a.dsn = Fi(i)),
    ws(a, [wP(e)])
  );
}
function vx(e, t) {
  const s = t ?? EP(e) ?? [];
  if (s.length === 0) return;
  const i = e.getOptions(),
    a = SP(s, i._metadata, i.tunnel, e.getDsn());
  (xx().set(e, []), e.emit("flushMetrics"), e.sendEnvelope(a));
}
function EP(e) {
  return xx().get(e);
}
function xx() {
  return gs("clientToMetricBufferMap", () => new WeakMap());
}
const Qd = Symbol.for("SentryBufferFullError");
function Jd(e = 100) {
  const t = new Set();
  function s() {
    return t.size < e;
  }
  function i(c) {
    t.delete(c);
  }
  function a(c) {
    if (!s()) return qd(Qd);
    const f = c();
    return (
      t.add(f),
      f.then(
        () => i(f),
        () => i(f)
      ),
      f
    );
  }
  function u(c) {
    if (!t.size) return La(!0);
    const f = Promise.allSettled(Array.from(t)).then(() => !0);
    if (!c) return f;
    const p = [f, new Promise((g) => setTimeout(() => g(!1), c))];
    return Promise.race(p);
  }
  return {
    get $() {
      return Array.from(t);
    },
    add: a,
    drain: u,
  };
}
const _P = 60 * 1e3;
function TP(e, t = Date.now()) {
  const s = parseInt(`${e}`, 10);
  if (!isNaN(s)) return s * 1e3;
  const i = Date.parse(`${e}`);
  return isNaN(i) ? _P : i - t;
}
function CP(e, t) {
  return e[t] || e.all || 0;
}
function kP(e, t, s = Date.now()) {
  return CP(e, t) > s;
}
function bP(e, { statusCode: t, headers: s }, i = Date.now()) {
  const a = { ...e },
    u = s?.["x-sentry-rate-limits"],
    c = s?.["retry-after"];
  if (u)
    for (const f of u.trim().split(",")) {
      const [p, g, , , y] = f.split(":", 5),
        v = parseInt(p, 10),
        w = (isNaN(v) ? 60 : v) * 1e3;
      if (!g) a.all = i + w;
      else
        for (const E of g.split(";"))
          E === "metric_bucket"
            ? (!y || y.split(";").includes("custom")) && (a[E] = i + w)
            : (a[E] = i + w);
    }
  else c ? (a.all = i + TP(c, i)) : t === 429 && (a.all = i + 60 * 1e3);
  return a;
}
const wx = 64;
function NP(e, t, s = Jd(e.bufferSize || wx)) {
  let i = {};
  const a = (c) => s.drain(c);
  function u(c) {
    const f = [];
    if (
      (ly(c, (v, w) => {
        const E = uy(w);
        kP(i, E) ? e.recordDroppedEvent("ratelimit_backoff", E) : f.push(v);
      }),
      f.length === 0)
    )
      return Promise.resolve({});
    const p = ws(c[0], f),
      g = (v) => {
        ly(p, (w, E) => {
          e.recordDroppedEvent(v, uy(E));
        });
      },
      y = () =>
        t({ body: Fj(p) }).then(
          (v) => (
            v.statusCode !== void 0 &&
              (v.statusCode < 200 || v.statusCode >= 300) &&
              ie &&
              se.warn(`Sentry responded with status code ${v.statusCode} to sent event.`),
            (i = bP(i, v)),
            v
          ),
          (v) => {
            throw (
              g("network_error"),
              ie && se.error("Encountered error running transport request:", v),
              v
            );
          }
        );
    return s.add(y).then(
      (v) => v,
      (v) => {
        if (v === Qd)
          return (
            ie && se.error("Skipped sending event because buffer is full."),
            g("queue_overflow"),
            Promise.resolve({})
          );
        throw v;
      }
    );
  }
  return { send: u, flush: a };
}
function jP(e, t, s) {
  const i = [{ type: "client_report" }, { timestamp: Li(), discarded_events: e }];
  return ws(t ? { dsn: t } : {}, [i]);
}
function Sx(e) {
  const t = [];
  e.message && t.push(e.message);
  try {
    const s = e.exception.values[e.exception.values.length - 1];
    s?.value && (t.push(s.value), s.type && t.push(`${s.type}: ${s.value}`));
  } catch {}
  return t;
}
function PP(e) {
  const {
    trace_id: t,
    parent_span_id: s,
    span_id: i,
    status: a,
    origin: u,
    data: c,
    op: f,
  } = e.contexts?.trace ?? {};
  return {
    data: c ?? {},
    description: e.transaction,
    op: f,
    parent_span_id: s,
    span_id: i ?? "",
    start_timestamp: e.start_timestamp ?? 0,
    status: a,
    timestamp: e.timestamp,
    trace_id: t ?? "",
    origin: u,
    profile_id: c?.[rx],
    exclusive_time: c?.[sx],
    measurements: e.measurements,
    is_segment: !0,
  };
}
function RP(e) {
  return {
    type: "transaction",
    timestamp: e.timestamp,
    start_timestamp: e.start_timestamp,
    transaction: e.description,
    contexts: {
      trace: {
        trace_id: e.trace_id,
        span_id: e.span_id,
        parent_span_id: e.parent_span_id,
        op: e.op,
        status: e.status,
        origin: e.origin,
        data: {
          ...e.data,
          ...(e.profile_id && { [rx]: e.profile_id }),
          ...(e.exclusive_time && { [sx]: e.exclusive_time }),
        },
      },
    },
    measurements: e.measurements,
  };
}
const xy = "Not capturing exception because it's already been captured.",
  wy = "Discarded session because of missing or non-string release",
  Ex = Symbol.for("SentryInternalError"),
  _x = Symbol.for("SentryDoNotSendEventError"),
  IP = 5e3;
function ha(e) {
  return { message: e, [Ex]: !0 };
}
function dc(e) {
  return { message: e, [_x]: !0 };
}
function Sy(e) {
  return !!e && typeof e == "object" && Ex in e;
}
function Ey(e) {
  return !!e && typeof e == "object" && _x in e;
}
function _y(e, t, s, i, a) {
  let u = 0,
    c,
    f = !1;
  (e.on(s, () => {
    ((u = 0), clearTimeout(c), (f = !1));
  }),
    e.on(t, (p) => {
      ((u += i(p)),
        u >= 8e5
          ? a(e)
          : f ||
            ((f = !0),
            (c = setTimeout(() => {
              a(e);
            }, IP))));
    }),
    e.on("flush", () => {
      a(e);
    }));
}
class AP {
  constructor(t) {
    if (
      ((this._options = t),
      (this._integrations = {}),
      (this._numProcessing = 0),
      (this._outcomes = {}),
      (this._hooks = {}),
      (this._eventProcessors = []),
      (this._promiseBuffer = Jd(t.transportOptions?.bufferSize ?? wx)),
      t.dsn
        ? (this._dsn = yj(t.dsn))
        : ie && se.warn("No DSN provided, client will not send events."),
      this._dsn)
    ) {
      const i = pP(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
      this._transport = t.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...t.transportOptions,
        url: i,
      });
    }
    ((this._options.enableLogs =
      this._options.enableLogs ?? this._options._experiments?.enableLogs),
      this._options.enableLogs && _y(this, "afterCaptureLog", "flushLogs", OP, gx),
      (this._options.enableMetrics ?? this._options._experiments?.enableMetrics ?? !0) &&
        _y(this, "afterCaptureMetric", "flushMetrics", LP, vx));
  }
  captureException(t, s, i) {
    const a = At();
    if (Xg(t)) return (ie && se.log(xy), a);
    const u = { event_id: a, ...s };
    return (
      this._process(
        () =>
          this.eventFromException(t, u)
            .then((c) => this._captureEvent(c, u, i))
            .then((c) => c),
        "error"
      ),
      u.event_id
    );
  }
  captureMessage(t, s, i, a) {
    const u = { event_id: At(), ...i },
      c = zd(t) ? t : String(t),
      f = Aa(t),
      p = f ? this.eventFromMessage(c, s, u) : this.eventFromException(t, u);
    return (
      this._process(() => p.then((g) => this._captureEvent(g, u, a)), f ? "unknown" : "error"),
      u.event_id
    );
  }
  captureEvent(t, s, i) {
    const a = At();
    if (s?.originalException && Xg(s.originalException)) return (ie && se.log(xy), a);
    const u = { event_id: a, ...s },
      c = t.sdkProcessingMetadata || {},
      f = c.capturedSpanScope,
      p = c.capturedSpanIsolationScope,
      g = Ty(t.type);
    return (this._process(() => this._captureEvent(t, u, f || i, p), g), u.event_id);
  }
  captureSession(t) {
    (this.sendSession(t), os(t, { init: !1 }));
  }
  getDsn() {
    return this._dsn;
  }
  getOptions() {
    return this._options;
  }
  getSdkMetadata() {
    return this._options._metadata;
  }
  getTransport() {
    return this._transport;
  }
  async flush(t) {
    const s = this._transport;
    if (!s) return !0;
    this.emit("flush");
    const i = await this._isClientDoneProcessing(t),
      a = await s.flush(t);
    return i && a;
  }
  async close(t) {
    const s = await this.flush(t);
    return ((this.getOptions().enabled = !1), this.emit("close"), s);
  }
  getEventProcessors() {
    return this._eventProcessors;
  }
  addEventProcessor(t) {
    this._eventProcessors.push(t);
  }
  init() {
    (this._isEnabled() ||
      this._options.integrations.some(({ name: t }) => t.startsWith("Spotlight"))) &&
      this._setupIntegrations();
  }
  getIntegrationByName(t) {
    return this._integrations[t];
  }
  addIntegration(t) {
    const s = this._integrations[t.name];
    (mx(this, t, this._integrations), s || vy(this, [t]));
  }
  sendEvent(t, s = {}) {
    this.emit("beforeSendEvent", t, s);
    let i = Wj(t, this._dsn, this._options._metadata, this._options.tunnel);
    for (const a of s.attachments || []) i = Oj(i, Bj(a));
    this.sendEnvelope(i).then((a) => this.emit("afterSendEvent", t, a));
  }
  sendSession(t) {
    const { release: s, environment: i = Xd } = this._options;
    if ("aggregates" in t) {
      const u = t.attrs || {};
      if (!u.release && !s) {
        ie && se.warn(wy);
        return;
      }
      ((u.release = u.release || s), (u.environment = u.environment || i), (t.attrs = u));
    } else {
      if (!t.release && !s) {
        ie && se.warn(wy);
        return;
      }
      ((t.release = t.release || s), (t.environment = t.environment || i));
    }
    this.emit("beforeSendSession", t);
    const a = Hj(t, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(a);
  }
  recordDroppedEvent(t, s, i = 1) {
    if (this._options.sendClientReports) {
      const a = `${t}:${s}`;
      (ie && se.log(`Recording outcome: "${a}"${i > 1 ? ` (${i} times)` : ""}`),
        (this._outcomes[a] = (this._outcomes[a] || 0) + i));
    }
  }
  on(t, s) {
    const i = (this._hooks[t] = this._hooks[t] || new Set()),
      a = (...u) => s(...u);
    return (
      i.add(a),
      () => {
        i.delete(a);
      }
    );
  }
  emit(t, ...s) {
    const i = this._hooks[t];
    i && i.forEach((a) => a(...s));
  }
  async sendEnvelope(t) {
    if ((this.emit("beforeEnvelope", t), this._isEnabled() && this._transport))
      try {
        return await this._transport.send(t);
      } catch (s) {
        return (ie && se.error("Error while sending envelope:", s), {});
      }
    return (ie && se.error("Transport disabled"), {});
  }
  _setupIntegrations() {
    const { integrations: t } = this._options;
    ((this._integrations = gP(this, t)), vy(this, t));
  }
  _updateSessionFromEvent(t, s) {
    let i = s.level === "fatal",
      a = !1;
    const u = s.exception?.values;
    if (u) {
      ((a = !0), (i = !1));
      for (const p of u)
        if (p.mechanism?.handled === !1) {
          i = !0;
          break;
        }
    }
    const c = t.status === "ok";
    ((c && t.errors === 0) || (c && i)) &&
      (os(t, { ...(i && { status: "crashed" }), errors: t.errors || Number(a || i) }),
      this.captureSession(t));
  }
  async _isClientDoneProcessing(t) {
    let s = 0;
    for (; !t || s < t;) {
      if ((await new Promise((i) => setTimeout(i, 1)), !this._numProcessing)) return !0;
      s++;
    }
    return !1;
  }
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._transport !== void 0;
  }
  _prepareEvent(t, s, i, a) {
    const u = this.getOptions(),
      c = Object.keys(this._integrations);
    return (
      !s.integrations && c?.length && (s.integrations = c),
      this.emit("preprocessEvent", t, s),
      t.type || a.setLastEventId(t.event_id || s.event_id),
      eP(u, t, s, i, this, a).then((f) => {
        if (f === null) return f;
        (this.emit("postprocessEvent", f, s), (f.contexts = { trace: XN(i), ...f.contexts }));
        const p = Pj(this, i);
        return (
          (f.sdkProcessingMetadata = { dynamicSamplingContext: p, ...f.sdkProcessingMetadata }),
          f
        );
      })
    );
  }
  _captureEvent(t, s = {}, i = Kn(), a = xs()) {
    return (
      ie && Yc(t) && se.log(`Captured error event \`${Sx(t)[0] || "<unknown>"}\``),
      this._processEvent(t, s, i, a).then(
        (u) => u.event_id,
        (u) => {
          ie && (Ey(u) ? se.log(u.message) : Sy(u) ? se.warn(u.message) : se.warn(u));
        }
      )
    );
  }
  _processEvent(t, s, i, a) {
    const u = this.getOptions(),
      { sampleRate: c } = u,
      f = Tx(t),
      p = Yc(t),
      y = `before send for type \`${t.type || "error"}\``,
      v = typeof c > "u" ? void 0 : vj(c);
    if (p && typeof v == "number" && Math.random() > v)
      return (
        this.recordDroppedEvent("sample_rate", "error"),
        qd(
          dc(
            `Discarding event because it's not included in the random sample (sampling rate = ${c})`
          )
        )
      );
    const w = Ty(t.type);
    return this._prepareEvent(t, s, i, a)
      .then((E) => {
        if (E === null)
          throw (
            this.recordDroppedEvent("event_processor", w),
            dc("An event processor returned `null`, will not send event.")
          );
        if (s.data && s.data.__sentry__ === !0) return E;
        const A = DP(this, u, E, s);
        return MP(A, y);
      })
      .then((E) => {
        if (E === null) {
          if ((this.recordDroppedEvent("before_send", w), f)) {
            const R = 1 + (t.spans || []).length;
            this.recordDroppedEvent("before_send", "span", R);
          }
          throw dc(`${y} returned \`null\`, will not send event.`);
        }
        const b = i.getSession() || a.getSession();
        if ((p && b && this._updateSessionFromEvent(b, E), f)) {
          const k = E.sdkProcessingMetadata?.spanCountBeforeProcessing || 0,
            R = E.spans ? E.spans.length : 0,
            D = k - R;
          D > 0 && this.recordDroppedEvent("before_send", "span", D);
        }
        const A = E.transaction_info;
        if (f && A && E.transaction !== t.transaction) {
          const k = "custom";
          E.transaction_info = { ...A, source: k };
        }
        return (this.sendEvent(E, s), E);
      })
      .then(null, (E) => {
        throw Ey(E) || Sy(E)
          ? E
          : (this.captureException(E, {
              mechanism: { handled: !1, type: "internal" },
              data: { __sentry__: !0 },
              originalException: E,
            }),
            ha(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${E}`));
      });
  }
  _process(t, s) {
    (this._numProcessing++,
      this._promiseBuffer.add(t).then(
        (i) => (this._numProcessing--, i),
        (i) => (this._numProcessing--, i === Qd && this.recordDroppedEvent("queue_overflow", s), i)
      ));
  }
  _clearOutcomes() {
    const t = this._outcomes;
    return (
      (this._outcomes = {}),
      Object.entries(t).map(([s, i]) => {
        const [a, u] = s.split(":");
        return { reason: a, category: u, quantity: i };
      })
    );
  }
  _flushOutcomes() {
    ie && se.log("Flushing outcomes...");
    const t = this._clearOutcomes();
    if (t.length === 0) {
      ie && se.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      ie && se.log("No dsn provided, will not send outcomes");
      return;
    }
    ie && se.log("Sending outcomes:", t);
    const s = jP(t, this._options.tunnel && Fi(this._dsn));
    this.sendEnvelope(s);
  }
}
function Ty(e) {
  return e === "replay_event" ? "replay" : e || "error";
}
function MP(e, t) {
  const s = `${t} must return \`null\` or a valid event.`;
  if (Di(e))
    return e.then(
      (i) => {
        if (!Ti(i) && i !== null) throw ha(s);
        return i;
      },
      (i) => {
        throw ha(`${t} rejected with ${i}`);
      }
    );
  if (!Ti(e) && e !== null) throw ha(s);
  return e;
}
function DP(e, t, s, i) {
  const { beforeSend: a, beforeSendTransaction: u, beforeSendSpan: c, ignoreSpans: f } = t;
  let p = s;
  if (Yc(p) && a) return a(p, i);
  if (Tx(p)) {
    if (c || f) {
      const g = PP(p);
      if (f?.length && ay(g, f)) return null;
      if (c) {
        const y = c(g);
        y ? (p = Oi(s, RP(y))) : iy();
      }
      if (p.spans) {
        const y = [],
          v = p.spans;
        for (const E of v) {
          if (f?.length && ay(E, f)) {
            bj(v, E);
            continue;
          }
          if (c) {
            const b = c(E);
            b ? y.push(b) : (iy(), y.push(E));
          } else y.push(E);
        }
        const w = p.spans.length - y.length;
        (w && e.recordDroppedEvent("before_send", "span", w), (p.spans = y));
      }
    }
    if (u) {
      if (p.spans) {
        const g = p.spans.length;
        p.sdkProcessingMetadata = { ...s.sdkProcessingMetadata, spanCountBeforeProcessing: g };
      }
      return u(p, i);
    }
  }
  return p;
}
function Yc(e) {
  return e.type === void 0;
}
function Tx(e) {
  return e.type === "transaction";
}
function LP(e) {
  let t = 0;
  return (e.name && (t += e.name.length * 2), (t += 8), t + Cx(e.attributes));
}
function OP(e) {
  let t = 0;
  return (e.message && (t += e.message.length * 2), t + Cx(e.attributes));
}
function Cx(e) {
  if (!e) return 0;
  let t = 0;
  return (
    Object.values(e).forEach((s) => {
      Array.isArray(s) ? (t += s.length * Cy(s[0])) : Aa(s) ? (t += Cy(s)) : (t += 100);
    }),
    t
  );
}
function Cy(e) {
  return typeof e == "string"
    ? e.length * 2
    : typeof e == "number"
      ? 8
      : typeof e == "boolean"
        ? 4
        : 0;
}
function FP(e, t) {
  (t.debug === !0 &&
    (ie
      ? se.enable()
      : ys(() => {
          console.warn(
            "[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle."
          );
        })),
    Kn().update(t.initialScope));
  const i = new e(t);
  return (VP(i), i.init(), i);
}
function VP(e) {
  Kn().setClient(e);
}
function fc(e) {
  if (!e) return {};
  const t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!t) return {};
  const s = t[6] || "",
    i = t[8] || "";
  return { host: t[4], path: t[5], protocol: t[2], search: s, hash: i, relative: t[5] + s + i };
}
function BP(e) {
  "aggregates" in e
    ? e.attrs?.ip_address === void 0 && (e.attrs = { ...e.attrs, ip_address: "{{auto}}" })
    : e.ipAddress === void 0 && (e.ipAddress = "{{auto}}");
}
function kx(e, t, s = [t], i = "npm") {
  const a = e._metadata || {};
  (a.sdk ||
    (a.sdk = {
      name: `sentry.javascript.${t}`,
      packages: s.map((u) => ({ name: `${i}:@sentry/${u}`, version: gr })),
      version: gr,
    }),
    (e._metadata = a));
}
const $P = 100;
function xr(e, t) {
  const s = ot(),
    i = xs();
  if (!s) return;
  const { beforeBreadcrumb: a = null, maxBreadcrumbs: u = $P } = s.getOptions();
  if (u <= 0) return;
  const f = { timestamp: Li(), ...e },
    p = a ? ys(() => a(f, t)) : f;
  p !== null && (s.emit && s.emit("beforeAddBreadcrumb", p, t), i.addBreadcrumb(p, u));
}
let ky;
const UP = "FunctionToString",
  by = new WeakMap(),
  zP = () => ({
    name: UP,
    setupOnce() {
      ky = Function.prototype.toString;
      try {
        Function.prototype.toString = function (...e) {
          const t = Gd(this),
            s = by.has(ot()) && t !== void 0 ? t : this;
          return ky.apply(s, e);
        };
      } catch {}
    },
    setup(e) {
      by.set(e, !0);
    },
  }),
  HP = zP,
  WP = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
    /^ResizeObserver loop completed with undelivered notifications.$/,
    /^Cannot redefine property: googletag$/,
    /^Can't find variable: gmo$/,
    /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
    `can't redefine non-configurable property "solana"`,
    "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
    "Can't find variable: _AutofillCallbackHandler",
    /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
    /^Java exception was raised during method invocation$/,
  ],
  GP = "EventFilters",
  KP = (e = {}) => {
    let t;
    return {
      name: GP,
      setup(s) {
        const i = s.getOptions();
        t = Ny(e, i);
      },
      processEvent(s, i, a) {
        if (!t) {
          const u = a.getOptions();
          t = Ny(e, u);
        }
        return XP(s, t) ? null : s;
      },
    };
  },
  YP = (e = {}) => ({ ...KP(e), name: "InboundFilters" });
function Ny(e = {}, t = {}) {
  return {
    allowUrls: [...(e.allowUrls || []), ...(t.allowUrls || [])],
    denyUrls: [...(e.denyUrls || []), ...(t.denyUrls || [])],
    ignoreErrors: [
      ...(e.ignoreErrors || []),
      ...(t.ignoreErrors || []),
      ...(e.disableErrorDefaults ? [] : WP),
    ],
    ignoreTransactions: [...(e.ignoreTransactions || []), ...(t.ignoreTransactions || [])],
  };
}
function XP(e, t) {
  if (e.type) {
    if (e.type === "transaction" && QP(e, t.ignoreTransactions))
      return (
        ie &&
          se.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${dr(e)}`),
        !0
      );
  } else {
    if (qP(e, t.ignoreErrors))
      return (
        ie &&
          se.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${dr(e)}`),
        !0
      );
    if (tR(e))
      return (
        ie &&
          se.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${dr(e)}`),
        !0
      );
    if (JP(e, t.denyUrls))
      return (
        ie &&
          se.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${dr(e)}.
Url: ${Ca(e)}`),
        !0
      );
    if (!ZP(e, t.allowUrls))
      return (
        ie &&
          se.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${dr(e)}.
Url: ${Ca(e)}`),
        !0
      );
  }
  return !1;
}
function qP(e, t) {
  return t?.length ? Sx(e).some((s) => Da(s, t)) : !1;
}
function QP(e, t) {
  if (!t?.length) return !1;
  const s = e.transaction;
  return s ? Da(s, t) : !1;
}
function JP(e, t) {
  if (!t?.length) return !1;
  const s = Ca(e);
  return s ? Da(s, t) : !1;
}
function ZP(e, t) {
  if (!t?.length) return !0;
  const s = Ca(e);
  return s ? Da(s, t) : !0;
}
function eR(e = []) {
  for (let t = e.length - 1; t >= 0; t--) {
    const s = e[t];
    if (s && s.filename !== "<anonymous>" && s.filename !== "[native code]")
      return s.filename || null;
  }
  return null;
}
function Ca(e) {
  try {
    const s = [...(e.exception?.values ?? [])]
      .reverse()
      .find((i) => i.mechanism?.parent_id === void 0 && i.stacktrace?.frames?.length)
      ?.stacktrace?.frames;
    return s ? eR(s) : null;
  } catch {
    return (ie && se.error(`Cannot extract url for event ${dr(e)}`), null);
  }
}
function tR(e) {
  return e.exception?.values?.length
    ? !e.message &&
        !e.exception.values.some((t) => t.stacktrace || (t.type && t.type !== "Error") || t.value)
    : !1;
}
function nR(e, t, s, i, a, u) {
  if (!a.exception?.values || !u || !Wn(u.originalException, Error)) return;
  const c =
    a.exception.values.length > 0 ? a.exception.values[a.exception.values.length - 1] : void 0;
  c && (a.exception.values = Xc(e, t, i, u.originalException, s, a.exception.values, c, 0));
}
function Xc(e, t, s, i, a, u, c, f) {
  if (u.length >= s + 1) return u;
  let p = [...u];
  if (Wn(i[a], Error)) {
    jy(c, f);
    const g = e(t, i[a]),
      y = p.length;
    (Py(g, a, y, f), (p = Xc(e, t, s, i[a], a, [g, ...p], g, y)));
  }
  return (
    Array.isArray(i.errors) &&
      i.errors.forEach((g, y) => {
        if (Wn(g, Error)) {
          jy(c, f);
          const v = e(t, g),
            w = p.length;
          (Py(v, `errors[${y}]`, w, f), (p = Xc(e, t, s, g, a, [v, ...p], v, w)));
        }
      }),
    p
  );
}
function jy(e, t) {
  e.mechanism = {
    handled: !0,
    type: "auto.core.linked_errors",
    ...e.mechanism,
    ...(e.type === "AggregateError" && { is_exception_group: !0 }),
    exception_id: t,
  };
}
function Py(e, t, s, i) {
  e.mechanism = {
    handled: !0,
    ...e.mechanism,
    type: "chained",
    source: t,
    exception_id: s,
    parent_id: i,
  };
}
function rR(e) {
  const t = "console";
  (wr(t, e), Sr(t, sR));
}
function sR() {
  "console" in ve &&
    fN.forEach(function (e) {
      e in ve.console &&
        Et(ve.console, e, function (t) {
          return (
            (Ta[e] = t),
            function (...s) {
              (Ht("console", { args: s, level: e }), Ta[e]?.apply(ve.console, s));
            }
          );
        });
    });
}
function iR(e) {
  return e === "warn"
    ? "warning"
    : ["fatal", "error", "warning", "log", "info", "debug"].includes(e)
      ? e
      : "log";
}
const oR = "Dedupe",
  aR = () => {
    let e;
    return {
      name: oR,
      processEvent(t) {
        if (t.type) return t;
        try {
          if (uR(t, e))
            return (
              ie && se.warn("Event dropped due to being a duplicate of previously captured event."),
              null
            );
        } catch {}
        return (e = t);
      },
    };
  },
  lR = aR;
function uR(e, t) {
  return t ? !!(cR(e, t) || dR(e, t)) : !1;
}
function cR(e, t) {
  const s = e.message,
    i = t.message;
  return !((!s && !i) || (s && !i) || (!s && i) || s !== i || !Nx(e, t) || !bx(e, t));
}
function dR(e, t) {
  const s = Ry(t),
    i = Ry(e);
  return !(!s || !i || s.type !== i.type || s.value !== i.value || !Nx(e, t) || !bx(e, t));
}
function bx(e, t) {
  let s = zg(e),
    i = zg(t);
  if (!s && !i) return !0;
  if ((s && !i) || (!s && i) || ((s = s), (i = i), i.length !== s.length)) return !1;
  for (let a = 0; a < i.length; a++) {
    const u = i[a],
      c = s[a];
    if (
      u.filename !== c.filename ||
      u.lineno !== c.lineno ||
      u.colno !== c.colno ||
      u.function !== c.function
    )
      return !1;
  }
  return !0;
}
function Nx(e, t) {
  let s = e.fingerprint,
    i = t.fingerprint;
  if (!s && !i) return !0;
  if ((s && !i) || (!s && i)) return !1;
  ((s = s), (i = i));
  try {
    return s.join("") === i.join("");
  } catch {
    return !1;
  }
}
function Ry(e) {
  return e.exception?.values?.[0];
}
function jx(e) {
  if (e !== void 0) return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0;
}
const ki = ve;
function fR() {
  return "history" in ki && !!ki.history;
}
function pR() {
  if (!("fetch" in ki)) return !1;
  try {
    return (new Headers(), new Request("data:,"), new Response(), !0);
  } catch {
    return !1;
  }
}
function qc(e) {
  return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString());
}
function hR() {
  if (typeof EdgeRuntime == "string") return !0;
  if (!pR()) return !1;
  if (qc(ki.fetch)) return !0;
  let e = !1;
  const t = ki.document;
  if (t && typeof t.createElement == "function")
    try {
      const s = t.createElement("iframe");
      ((s.hidden = !0),
        t.head.appendChild(s),
        s.contentWindow?.fetch && (e = qc(s.contentWindow.fetch)),
        t.head.removeChild(s));
    } catch (s) {
      ie &&
        se.warn(
          "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
          s
        );
    }
  return e;
}
function mR(e, t) {
  const s = "fetch";
  (wr(s, e), Sr(s, () => gR(void 0, t)));
}
function gR(e, t = !1) {
  (t && !hR()) ||
    Et(ve, "fetch", function (s) {
      return function (...i) {
        const a = new Error(),
          { method: u, url: c } = yR(i),
          f = {
            args: i,
            fetchData: { method: u, url: c },
            startTimestamp: hn() * 1e3,
            virtualError: a,
            headers: vR(i),
          };
        return (
          Ht("fetch", { ...f }),
          s.apply(ve, i).then(
            async (p) => (Ht("fetch", { ...f, endTimestamp: hn() * 1e3, response: p }), p),
            (p) => {
              if (
                (Ht("fetch", { ...f, endTimestamp: hn() * 1e3, error: p }),
                Ud(p) && p.stack === void 0 && ((p.stack = a.stack), vr(p, "framesToPop", 1)),
                p instanceof TypeError &&
                  (p.message === "Failed to fetch" ||
                    p.message === "Load failed" ||
                    p.message === "NetworkError when attempting to fetch resource."))
              )
                try {
                  const g = new URL(f.fetchData.url);
                  p.message = `${p.message} (${g.host})`;
                } catch {}
              throw p;
            }
          )
        );
      };
    });
}
function ma(e, t) {
  return !!e && typeof e == "object" && !!e[t];
}
function Iy(e) {
  return typeof e == "string"
    ? e
    : e
      ? ma(e, "url")
        ? e.url
        : e.toString
          ? e.toString()
          : ""
      : "";
}
function yR(e) {
  if (e.length === 0) return { method: "GET", url: "" };
  if (e.length === 2) {
    const [s, i] = e;
    return {
      url: Iy(s),
      method: ma(i, "method")
        ? String(i.method).toUpperCase()
        : q0(s) && ma(s, "method")
          ? String(s.method).toUpperCase()
          : "GET",
    };
  }
  const t = e[0];
  return { url: Iy(t), method: ma(t, "method") ? String(t.method).toUpperCase() : "GET" };
}
function vR(e) {
  const [t, s] = e;
  try {
    if (typeof s == "object" && s !== null && "headers" in s && s.headers)
      return new Headers(s.headers);
    if (q0(t)) return new Headers(t.headers);
  } catch {}
}
function xR() {
  return "npm";
}
const De = ve;
let Qc = 0;
function Px() {
  return Qc > 0;
}
function wR() {
  (Qc++,
    setTimeout(() => {
      Qc--;
    }));
}
function ls(e, t = {}) {
  function s(a) {
    return typeof a == "function";
  }
  if (!s(e)) return e;
  try {
    const a = e.__sentry_wrapped__;
    if (a) return typeof a == "function" ? a : e;
    if (Gd(e)) return e;
  } catch {
    return e;
  }
  const i = function (...a) {
    try {
      const u = a.map((c) => ls(c, t));
      return e.apply(this, u);
    } catch (u) {
      throw (
        wR(),
        YN((c) => {
          (c.addEventProcessor(
            (f) => (
              t.mechanism && (zc(f, void 0), is(f, t.mechanism)),
              (f.extra = { ...f.extra, arguments: a }),
              f
            )
          ),
            aP(u));
        }),
        u
      );
    }
  };
  try {
    for (const a in e) Object.prototype.hasOwnProperty.call(e, a) && (i[a] = e[a]);
  } catch {}
  (J0(i, e), vr(e, "__sentry_wrapped__", i));
  try {
    Object.getOwnPropertyDescriptor(i, "name").configurable &&
      Object.defineProperty(i, "name", {
        get() {
          return e.name;
        },
      });
  } catch {}
  return i;
}
function SR() {
  const e = Wd(),
    { referrer: t } = De.document || {},
    { userAgent: s } = De.navigator || {},
    i = { ...(t && { Referer: t }), ...(s && { "User-Agent": s }) };
  return { url: e, headers: i };
}
function Zd(e, t) {
  const s = ef(e, t),
    i = { type: kR(t), value: bR(t) };
  return (
    s.length && (i.stacktrace = { frames: s }),
    i.type === void 0 && i.value === "" && (i.value = "Unrecoverable error caught"),
    i
  );
}
function ER(e, t, s, i) {
  const u = ot()?.getOptions().normalizeDepth,
    c = IR(t),
    f = { __serialized__: cx(t, u) };
  if (c) return { exception: { values: [Zd(e, c)] }, extra: f };
  const p = {
    exception: {
      values: [
        {
          type: Ma(t) ? t.constructor.name : i ? "UnhandledRejection" : "Error",
          value: PR(t, { isUnhandledRejection: i }),
        },
      ],
    },
    extra: f,
  };
  if (s) {
    const g = ef(e, s);
    g.length && (p.exception.values[0].stacktrace = { frames: g });
  }
  return p;
}
function pc(e, t) {
  return { exception: { values: [Zd(e, t)] } };
}
function ef(e, t) {
  const s = t.stacktrace || t.stack || "",
    i = TR(t),
    a = CR(t);
  try {
    return e(s, i, a);
  } catch {}
  return [];
}
const _R = /Minified React error #\d+;/i;
function TR(e) {
  return e && _R.test(e.message) ? 1 : 0;
}
function CR(e) {
  return typeof e.framesToPop == "number" ? e.framesToPop : 0;
}
function Rx(e) {
  return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u"
    ? e instanceof WebAssembly.Exception
    : !1;
}
function kR(e) {
  const t = e?.name;
  return !t && Rx(e)
    ? e.message && Array.isArray(e.message) && e.message.length == 2
      ? e.message[0]
      : "WebAssembly.Exception"
    : t;
}
function bR(e) {
  const t = e?.message;
  return Rx(e)
    ? Array.isArray(e.message) && e.message.length == 2
      ? e.message[1]
      : "wasm exception"
    : t
      ? t.error && typeof t.error.message == "string"
        ? t.error.message
        : t
      : "No error message";
}
function NR(e, t, s, i) {
  const a = s?.syntheticException || void 0,
    u = tf(e, t, a, i);
  return (is(u), (u.level = "error"), s?.event_id && (u.event_id = s.event_id), La(u));
}
function jR(e, t, s = "info", i, a) {
  const u = i?.syntheticException || void 0,
    c = Jc(e, t, u, a);
  return ((c.level = s), i?.event_id && (c.event_id = i.event_id), La(c));
}
function tf(e, t, s, i, a) {
  let u;
  if (Y0(t) && t.error) return pc(e, t.error);
  if (Wg(t) || CN(t)) {
    const c = t;
    if ("stack" in t) u = pc(e, t);
    else {
      const f = c.name || (Wg(c) ? "DOMError" : "DOMException"),
        p = c.message ? `${f}: ${c.message}` : f;
      ((u = Jc(e, p, s, i)), zc(u, p));
    }
    return ("code" in c && (u.tags = { ...u.tags, "DOMException.code": `${c.code}` }), u);
  }
  return Ud(t)
    ? pc(e, t)
    : Ti(t) || Ma(t)
      ? ((u = ER(e, t, s, a)), is(u, { synthetic: !0 }), u)
      : ((u = Jc(e, t, s, i)), zc(u, `${t}`), is(u, { synthetic: !0 }), u);
}
function Jc(e, t, s, i) {
  const a = {};
  if (i && s) {
    const u = ef(e, s);
    (u.length && (a.exception = { values: [{ value: t, stacktrace: { frames: u } }] }),
      is(a, { synthetic: !0 }));
  }
  if (zd(t)) {
    const { __sentry_template_string__: u, __sentry_template_values__: c } = t;
    return ((a.logentry = { message: u, params: c }), a);
  }
  return ((a.message = t), a);
}
function PR(e, { isUnhandledRejection: t }) {
  const s = IN(e),
    i = t ? "promise rejection" : "exception";
  return Y0(e)
    ? `Event \`ErrorEvent\` captured as ${i} with message \`${e.message}\``
    : Ma(e)
      ? `Event \`${RR(e)}\` (type=${e.type}) captured as ${i}`
      : `Object captured as ${i} with keys: ${s}`;
}
function RR(e) {
  try {
    const t = Object.getPrototypeOf(e);
    return t ? t.constructor.name : void 0;
  } catch {}
}
function IR(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t)) {
      const s = e[t];
      if (s instanceof Error) return s;
    }
}
class AR extends AP {
  constructor(t) {
    const s = MR(t),
      i = De.SENTRY_SDK_SOURCE || xR();
    (kx(s, "browser", ["browser"], i),
      s._metadata?.sdk &&
        (s._metadata.sdk.settings = {
          infer_ip: s.sendDefaultPii ? "auto" : "never",
          ...s._metadata.sdk.settings,
        }),
      super(s));
    const {
        sendDefaultPii: a,
        sendClientReports: u,
        enableLogs: c,
        _experiments: f,
        enableMetrics: p,
      } = this._options,
      g = p ?? f?.enableMetrics ?? !0;
    (De.document &&
      (u || c || g) &&
      De.document.addEventListener("visibilitychange", () => {
        De.document.visibilityState === "hidden" &&
          (u && this._flushOutcomes(), c && gx(this), g && vx(this));
      }),
      a && this.on("beforeSendSession", BP));
  }
  eventFromException(t, s) {
    return NR(this._options.stackParser, t, s, this._options.attachStacktrace);
  }
  eventFromMessage(t, s = "info", i) {
    return jR(this._options.stackParser, t, s, i, this._options.attachStacktrace);
  }
  _prepareEvent(t, s, i, a) {
    return ((t.platform = t.platform || "javascript"), super._prepareEvent(t, s, i, a));
  }
}
function MR(e) {
  return {
    release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : De.SENTRY_RELEASE?.id,
    sendClientReports: !0,
    parentSpanIsAlwaysRootSpan: !0,
    ...e,
  };
}
const DR = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
  it = ve,
  LR = 1e3;
let Ay, Zc, ed;
function OR(e) {
  (wr("dom", e), Sr("dom", FR));
}
function FR() {
  if (!it.document) return;
  const e = Ht.bind(null, "dom"),
    t = My(e, !0);
  (it.document.addEventListener("click", t, !1),
    it.document.addEventListener("keypress", t, !1),
    ["EventTarget", "Node"].forEach((s) => {
      const a = it[s]?.prototype;
      a?.hasOwnProperty?.("addEventListener") &&
        (Et(a, "addEventListener", function (u) {
          return function (c, f, p) {
            if (c === "click" || c == "keypress")
              try {
                const g = (this.__sentry_instrumentation_handlers__ =
                    this.__sentry_instrumentation_handlers__ || {}),
                  y = (g[c] = g[c] || { refCount: 0 });
                if (!y.handler) {
                  const v = My(e);
                  ((y.handler = v), u.call(this, c, v, p));
                }
                y.refCount++;
              } catch {}
            return u.call(this, c, f, p);
          };
        }),
        Et(a, "removeEventListener", function (u) {
          return function (c, f, p) {
            if (c === "click" || c == "keypress")
              try {
                const g = this.__sentry_instrumentation_handlers__ || {},
                  y = g[c];
                y &&
                  (y.refCount--,
                  y.refCount <= 0 &&
                    (u.call(this, c, y.handler, p), (y.handler = void 0), delete g[c]),
                  Object.keys(g).length === 0 && delete this.__sentry_instrumentation_handlers__);
              } catch {}
            return u.call(this, c, f, p);
          };
        }));
    }));
}
function VR(e) {
  if (e.type !== Zc) return !1;
  try {
    if (!e.target || e.target._sentryId !== ed) return !1;
  } catch {}
  return !0;
}
function BR(e, t) {
  return e !== "keypress"
    ? !1
    : t?.tagName
      ? !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      : !0;
}
function My(e, t = !1) {
  return (s) => {
    if (!s || s._sentryCaptured) return;
    const i = $R(s);
    if (BR(s.type, i)) return;
    (vr(s, "_sentryCaptured", !0), i && !i._sentryId && vr(i, "_sentryId", At()));
    const a = s.type === "keypress" ? "input" : s.type;
    (VR(s) || (e({ event: s, name: a, global: t }), (Zc = s.type), (ed = i ? i._sentryId : void 0)),
      clearTimeout(Ay),
      (Ay = it.setTimeout(() => {
        ((ed = void 0), (Zc = void 0));
      }, LR)));
  };
}
function $R(e) {
  try {
    return e.target;
  } catch {
    return null;
  }
}
let ra;
function Ix(e) {
  const t = "history";
  (wr(t, e), Sr(t, UR));
}
function UR() {
  if (
    (it.addEventListener("popstate", () => {
      const t = it.location.href,
        s = ra;
      if (((ra = t), s === t)) return;
      Ht("history", { from: s, to: t });
    }),
    !fR())
  )
    return;
  function e(t) {
    return function (...s) {
      const i = s.length > 2 ? s[2] : void 0;
      if (i) {
        const a = ra,
          u = zR(String(i));
        if (((ra = u), a === u)) return t.apply(this, s);
        Ht("history", { from: a, to: u });
      }
      return t.apply(this, s);
    };
  }
  (Et(it.history, "pushState", e), Et(it.history, "replaceState", e));
}
function zR(e) {
  try {
    return new URL(e, it.location.origin).toString();
  } catch {
    return e;
  }
}
const ga = {};
function HR(e) {
  const t = ga[e];
  if (t) return t;
  let s = it[e];
  if (qc(s)) return (ga[e] = s.bind(it));
  const i = it.document;
  if (i && typeof i.createElement == "function")
    try {
      const a = i.createElement("iframe");
      ((a.hidden = !0), i.head.appendChild(a));
      const u = a.contentWindow;
      (u?.[e] && (s = u[e]), i.head.removeChild(a));
    } catch (a) {
      DR && se.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, a);
    }
  return s && (ga[e] = s.bind(it));
}
function WR(e) {
  ga[e] = void 0;
}
const pi = "__sentry_xhr_v3__";
function GR(e) {
  (wr("xhr", e), Sr("xhr", KR));
}
function KR() {
  if (!it.XMLHttpRequest) return;
  const e = XMLHttpRequest.prototype;
  ((e.open = new Proxy(e.open, {
    apply(t, s, i) {
      const a = new Error(),
        u = hn() * 1e3,
        c = pn(i[0]) ? i[0].toUpperCase() : void 0,
        f = YR(i[1]);
      if (!c || !f) return t.apply(s, i);
      ((s[pi] = { method: c, url: f, request_headers: {} }),
        c === "POST" && f.match(/sentry_key/) && (s.__sentry_own_request__ = !0));
      const p = () => {
        const g = s[pi];
        if (g && s.readyState === 4) {
          try {
            g.status_code = s.status;
          } catch {}
          const y = { endTimestamp: hn() * 1e3, startTimestamp: u, xhr: s, virtualError: a };
          Ht("xhr", y);
        }
      };
      return (
        "onreadystatechange" in s && typeof s.onreadystatechange == "function"
          ? (s.onreadystatechange = new Proxy(s.onreadystatechange, {
              apply(g, y, v) {
                return (p(), g.apply(y, v));
              },
            }))
          : s.addEventListener("readystatechange", p),
        (s.setRequestHeader = new Proxy(s.setRequestHeader, {
          apply(g, y, v) {
            const [w, E] = v,
              b = y[pi];
            return (b && pn(w) && pn(E) && (b.request_headers[w.toLowerCase()] = E), g.apply(y, v));
          },
        })),
        t.apply(s, i)
      );
    },
  })),
    (e.send = new Proxy(e.send, {
      apply(t, s, i) {
        const a = s[pi];
        if (!a) return t.apply(s, i);
        i[0] !== void 0 && (a.body = i[0]);
        const u = { startTimestamp: hn() * 1e3, xhr: s };
        return (Ht("xhr", u), t.apply(s, i));
      },
    })));
}
function YR(e) {
  if (pn(e)) return e;
  try {
    return e.toString();
  } catch {}
}
const XR = 40;
function qR(e, t = HR("fetch")) {
  let s = 0,
    i = 0;
  async function a(u) {
    const c = u.body.length;
    ((s += c), i++);
    const f = {
      body: u.body,
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: e.headers,
      keepalive: s <= 6e4 && i < 15,
      ...e.fetchOptions,
    };
    try {
      const p = await t(e.url, f);
      return {
        statusCode: p.status,
        headers: {
          "x-sentry-rate-limits": p.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": p.headers.get("Retry-After"),
        },
      };
    } catch (p) {
      throw (WR("fetch"), p);
    } finally {
      ((s -= c), i--);
    }
  }
  return NP(e, a, Jd(e.bufferSize || XR));
}
const Oa = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
  QR = 30,
  JR = 50;
function td(e, t, s, i) {
  const a = { filename: e, function: t === "<anonymous>" ? yr : t, in_app: !0 };
  return (s !== void 0 && (a.lineno = s), i !== void 0 && (a.colno = i), a);
}
const ZR = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
  eI =
    /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  tI = /\((\S*)(?::(\d+))(?::(\d+))\)/,
  nI = /at (.+?) ?\(data:(.+?),/,
  rI = (e) => {
    const t = e.match(nI);
    if (t) return { filename: `<data:${t[2]}>`, function: t[1] };
    const s = ZR.exec(e);
    if (s) {
      const [, a, u, c] = s;
      return td(a, yr, +u, +c);
    }
    const i = eI.exec(e);
    if (i) {
      if (i[2] && i[2].indexOf("eval") === 0) {
        const f = tI.exec(i[2]);
        f && ((i[2] = f[1]), (i[3] = f[2]), (i[4] = f[3]));
      }
      const [u, c] = Ax(i[1] || yr, i[2]);
      return td(c, u, i[3] ? +i[3] : void 0, i[4] ? +i[4] : void 0);
    }
  },
  sI = [QR, rI],
  iI =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
  oI = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
  aI = (e) => {
    const t = iI.exec(e);
    if (t) {
      if (t[3] && t[3].indexOf(" > eval") > -1) {
        const u = oI.exec(t[3]);
        u && ((t[1] = t[1] || "eval"), (t[3] = u[1]), (t[4] = u[2]), (t[5] = ""));
      }
      let i = t[3],
        a = t[1] || yr;
      return (([a, i] = Ax(a, i)), td(i, a, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0));
    }
  },
  lI = [JR, aI],
  uI = [sI, lI],
  cI = W0(...uI),
  Ax = (e, t) => {
    const s = e.indexOf("safari-extension") !== -1,
      i = e.indexOf("safari-web-extension") !== -1;
    return s || i
      ? [
          e.indexOf("@") !== -1 ? e.split("@")[0] : yr,
          s ? `safari-extension:${t}` : `safari-web-extension:${t}`,
        ]
      : [e, t];
  },
  sa = 1024,
  dI = "Breadcrumbs",
  fI = (e = {}) => {
    const t = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...e };
    return {
      name: dI,
      setup(s) {
        (t.console && rR(gI(s)),
          t.dom && OR(mI(s, t.dom)),
          t.xhr && GR(yI(s)),
          t.fetch && mR(vI(s)),
          t.history && Ix(xI(s)),
          t.sentry && s.on("beforeSendEvent", hI(s)));
      },
    };
  },
  pI = fI;
function hI(e) {
  return function (s) {
    ot() === e &&
      xr(
        {
          category: `sentry.${s.type === "transaction" ? "transaction" : "event"}`,
          event_id: s.event_id,
          level: s.level,
          message: dr(s),
        },
        { event: s }
      );
  };
}
function mI(e, t) {
  return function (i) {
    if (ot() !== e) return;
    let a,
      u,
      c = typeof t == "object" ? t.serializeAttribute : void 0,
      f = typeof t == "object" && typeof t.maxStringLength == "number" ? t.maxStringLength : void 0;
    (f &&
      f > sa &&
      (Oa &&
        se.warn(
          `\`dom.maxStringLength\` cannot exceed ${sa}, but a value of ${f} was configured. Sentry will use ${sa} instead.`
        ),
      (f = sa)),
      typeof c == "string" && (c = [c]));
    try {
      const g = i.event,
        y = wI(g) ? g.target : g;
      ((a = Q0(y, { keyAttrs: c, maxStringLength: f })), (u = RN(y)));
    } catch {
      a = "<unknown>";
    }
    if (a.length === 0) return;
    const p = { category: `ui.${i.name}`, message: a };
    (u && (p.data = { "ui.component_name": u }),
      xr(p, { event: i.event, name: i.name, global: i.global }));
  };
}
function gI(e) {
  return function (s) {
    if (ot() !== e) return;
    const i = {
      category: "console",
      data: { arguments: s.args, logger: "console" },
      level: iR(s.level),
      message: Yg(s.args, " "),
    };
    if (s.level === "assert")
      if (s.args[0] === !1)
        ((i.message = `Assertion failed: ${Yg(s.args.slice(1), " ") || "console.assert"}`),
          (i.data.arguments = s.args.slice(1)));
      else return;
    xr(i, { input: s.args, level: s.level });
  };
}
function yI(e) {
  return function (s) {
    if (ot() !== e) return;
    const { startTimestamp: i, endTimestamp: a } = s,
      u = s.xhr[pi];
    if (!i || !a || !u) return;
    const { method: c, url: f, status_code: p, body: g } = u,
      y = { method: c, url: f, status_code: p },
      v = { xhr: s.xhr, input: g, startTimestamp: i, endTimestamp: a },
      w = { category: "xhr", data: y, type: "http", level: jx(p) };
    (e.emit("beforeOutgoingRequestBreadcrumb", w, v), xr(w, v));
  };
}
function vI(e) {
  return function (s) {
    if (ot() !== e) return;
    const { startTimestamp: i, endTimestamp: a } = s;
    if (a && !(s.fetchData.url.match(/sentry_key/) && s.fetchData.method === "POST"))
      if ((s.fetchData.method, s.fetchData.url, s.error)) {
        const u = s.fetchData,
          c = { data: s.error, input: s.args, startTimestamp: i, endTimestamp: a },
          f = { category: "fetch", data: u, level: "error", type: "http" };
        (e.emit("beforeOutgoingRequestBreadcrumb", f, c), xr(f, c));
      } else {
        const u = s.response,
          c = { ...s.fetchData, status_code: u?.status };
        (s.fetchData.request_body_size, s.fetchData.response_body_size, u?.status);
        const f = { input: s.args, response: u, startTimestamp: i, endTimestamp: a },
          p = { category: "fetch", data: c, type: "http", level: jx(c.status_code) };
        (e.emit("beforeOutgoingRequestBreadcrumb", p, f), xr(p, f));
      }
  };
}
function xI(e) {
  return function (s) {
    if (ot() !== e) return;
    let i = s.from,
      a = s.to;
    const u = fc(De.location.href);
    let c = i ? fc(i) : void 0;
    const f = fc(a);
    (c?.path || (c = u),
      u.protocol === f.protocol && u.host === f.host && (a = f.relative),
      u.protocol === c.protocol && u.host === c.host && (i = c.relative),
      xr({ category: "navigation", data: { from: i, to: a } }));
  };
}
function wI(e) {
  return !!e && !!e.target;
}
const SI = [
    "EventTarget",
    "Window",
    "Node",
    "ApplicationCache",
    "AudioTrackList",
    "BroadcastChannel",
    "ChannelMergerNode",
    "CryptoOperation",
    "EventSource",
    "FileReader",
    "HTMLUnknownElement",
    "IDBDatabase",
    "IDBRequest",
    "IDBTransaction",
    "KeyOperation",
    "MediaController",
    "MessagePort",
    "ModalWindow",
    "Notification",
    "SVGElementInstance",
    "Screen",
    "SharedWorker",
    "TextTrack",
    "TextTrackCue",
    "TextTrackList",
    "WebSocket",
    "WebSocketWorker",
    "Worker",
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestUpload",
  ],
  EI = "BrowserApiErrors",
  _I = (e = {}) => {
    const t = {
      XMLHttpRequest: !0,
      eventTarget: !0,
      requestAnimationFrame: !0,
      setInterval: !0,
      setTimeout: !0,
      unregisterOriginalCallbacks: !1,
      ...e,
    };
    return {
      name: EI,
      setupOnce() {
        (t.setTimeout && Et(De, "setTimeout", Dy),
          t.setInterval && Et(De, "setInterval", Dy),
          t.requestAnimationFrame && Et(De, "requestAnimationFrame", CI),
          t.XMLHttpRequest && "XMLHttpRequest" in De && Et(XMLHttpRequest.prototype, "send", kI));
        const s = t.eventTarget;
        s && (Array.isArray(s) ? s : SI).forEach((a) => bI(a, t));
      },
    };
  },
  TI = _I;
function Dy(e) {
  return function (...t) {
    const s = t[0];
    return (
      (t[0] = ls(s, {
        mechanism: { handled: !1, type: `auto.browser.browserapierrors.${Hn(e)}` },
      })),
      e.apply(this, t)
    );
  };
}
function CI(e) {
  return function (t) {
    return e.apply(this, [
      ls(t, {
        mechanism: {
          data: { handler: Hn(e) },
          handled: !1,
          type: "auto.browser.browserapierrors.requestAnimationFrame",
        },
      }),
    ]);
  };
}
function kI(e) {
  return function (...t) {
    const s = this;
    return (
      ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((a) => {
        a in s &&
          typeof s[a] == "function" &&
          Et(s, a, function (u) {
            const c = {
                mechanism: {
                  data: { handler: Hn(u) },
                  handled: !1,
                  type: `auto.browser.browserapierrors.xhr.${a}`,
                },
              },
              f = Gd(u);
            return (f && (c.mechanism.data.handler = Hn(f)), ls(u, c));
          });
      }),
      e.apply(this, t)
    );
  };
}
function bI(e, t) {
  const i = De[e]?.prototype;
  i?.hasOwnProperty?.("addEventListener") &&
    (Et(i, "addEventListener", function (a) {
      return function (u, c, f) {
        try {
          NI(c) &&
            (c.handleEvent = ls(c.handleEvent, {
              mechanism: {
                data: { handler: Hn(c), target: e },
                handled: !1,
                type: "auto.browser.browserapierrors.handleEvent",
              },
            }));
        } catch {}
        return (
          t.unregisterOriginalCallbacks && jI(this, u, c),
          a.apply(this, [
            u,
            ls(c, {
              mechanism: {
                data: { handler: Hn(c), target: e },
                handled: !1,
                type: "auto.browser.browserapierrors.addEventListener",
              },
            }),
            f,
          ])
        );
      };
    }),
    Et(i, "removeEventListener", function (a) {
      return function (u, c, f) {
        try {
          const p = c.__sentry_wrapped__;
          p && a.call(this, u, p, f);
        } catch {}
        return a.call(this, u, c, f);
      };
    }));
}
function NI(e) {
  return typeof e.handleEvent == "function";
}
function jI(e, t, s) {
  e &&
    typeof e == "object" &&
    "removeEventListener" in e &&
    typeof e.removeEventListener == "function" &&
    e.removeEventListener(t, s);
}
const PI = () => ({
    name: "BrowserSession",
    setupOnce() {
      if (typeof De.document > "u") {
        Oa &&
          se.warn(
            "Using the `browserSessionIntegration` in non-browser environments is not supported."
          );
        return;
      }
      (my({ ignoreDuration: !0 }),
        gy(),
        Ix(({ from: e, to: t }) => {
          e !== void 0 && e !== t && (my({ ignoreDuration: !0 }), gy());
        }));
    },
  }),
  RI = "GlobalHandlers",
  II = (e = {}) => {
    const t = { onerror: !0, onunhandledrejection: !0, ...e };
    return {
      name: RI,
      setupOnce() {
        Error.stackTraceLimit = 50;
      },
      setup(s) {
        (t.onerror && (MI(s), Ly("onerror")),
          t.onunhandledrejection && (DI(s), Ly("onunhandledrejection")));
      },
    };
  },
  AI = II;
function MI(e) {
  SN((t) => {
    const { stackParser: s, attachStacktrace: i } = Mx();
    if (ot() !== e || Px()) return;
    const { msg: a, url: u, line: c, column: f, error: p } = t,
      g = FI(tf(s, p || a, void 0, i, !1), u, c, f);
    ((g.level = "error"),
      fx(g, {
        originalException: p,
        mechanism: { handled: !1, type: "auto.browser.global_handlers.onerror" },
      }));
  });
}
function DI(e) {
  _N((t) => {
    const { stackParser: s, attachStacktrace: i } = Mx();
    if (ot() !== e || Px()) return;
    const a = LI(t),
      u = Aa(a) ? OI(a) : tf(s, a, void 0, i, !0);
    ((u.level = "error"),
      fx(u, {
        originalException: a,
        mechanism: { handled: !1, type: "auto.browser.global_handlers.onunhandledrejection" },
      }));
  });
}
function LI(e) {
  if (Aa(e)) return e;
  try {
    if ("reason" in e) return e.reason;
    if ("detail" in e && "reason" in e.detail) return e.detail.reason;
  } catch {}
  return e;
}
function OI(e) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          value: `Non-Error promise rejection captured with value: ${String(e)}`,
        },
      ],
    },
  };
}
function FI(e, t, s, i) {
  const a = (e.exception = e.exception || {}),
    u = (a.values = a.values || []),
    c = (u[0] = u[0] || {}),
    f = (c.stacktrace = c.stacktrace || {}),
    p = (f.frames = f.frames || []),
    g = i,
    y = s,
    v = VI(t) ?? Wd();
  return (
    p.length === 0 && p.push({ colno: g, filename: v, function: yr, in_app: !0, lineno: y }),
    e
  );
}
function Ly(e) {
  Oa && se.log(`Global Handler attached: ${e}`);
}
function Mx() {
  return ot()?.getOptions() || { stackParser: () => [], attachStacktrace: !1 };
}
function VI(e) {
  if (!(!pn(e) || e.length === 0)) {
    if (e.startsWith("data:")) {
      const t = e.match(/^data:([^;]+)/),
        s = t ? t[1] : "text/javascript",
        i = e.includes("base64,");
      return `<data:${s}${i ? ",base64" : ""}>`;
    }
    return e;
  }
}
const BI = () => ({
    name: "HttpContext",
    preprocessEvent(e) {
      if (!De.navigator && !De.location && !De.document) return;
      const t = SR(),
        s = { ...t.headers, ...e.request?.headers };
      e.request = { ...t, ...e.request, headers: s };
    },
  }),
  $I = "cause",
  UI = 5,
  zI = "LinkedErrors",
  HI = (e = {}) => {
    const t = e.limit || UI,
      s = e.key || $I;
    return {
      name: zI,
      preprocessEvent(i, a, u) {
        const c = u.getOptions();
        nR(Zd, c.stackParser, s, t, i, a);
      },
    };
  },
  WI = HI;
function GI() {
  return KI()
    ? (Oa &&
        ys(() => {
          console.error(
            "[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/"
          );
        }),
      !0)
    : !1;
}
function KI() {
  if (typeof De.window > "u") return !1;
  const e = De;
  if (e.nw || !(e.chrome || e.browser)?.runtime?.id) return !1;
  const s = Wd(),
    i = ["chrome-extension", "moz-extension", "ms-browser-extension", "safari-web-extension"];
  return !(De === De.top && i.some((u) => s.startsWith(`${u}://`)));
}
function YI(e) {
  return [YP(), HP(), TI(), pI(), AI(), WI(), lR(), BI(), PI()];
}
function XI(e = {}) {
  const t = !e.skipBrowserExtensionCheck && GI();
  let s = e.defaultIntegrations == null ? YI() : e.defaultIntegrations;
  const i = {
    ...e,
    enabled: t ? !1 : e.enabled,
    stackParser: xN(e.stackParser || cI),
    integrations: mP({ integrations: e.integrations, defaultIntegrations: s }),
    transport: e.transport || qR,
  };
  return FP(AR, i);
}
function qI(e) {
  const t = { ...e };
  return (kx(t, "react"), lP("react", { version: _.version }), XI(t));
}
qI({
  dsn: "https://YOUR_KEY@sentry.io/YOUR_PROJECT",
  tracesSampleRate: 1,
  environment: "production",
});
BS.createRoot(document.getElementById("root")).render(
  h.jsx(dn.StrictMode, {
    children: h.jsx(iv, { children: h.jsx(nE, { children: h.jsx(dN, {}) }) }),
  })
);
