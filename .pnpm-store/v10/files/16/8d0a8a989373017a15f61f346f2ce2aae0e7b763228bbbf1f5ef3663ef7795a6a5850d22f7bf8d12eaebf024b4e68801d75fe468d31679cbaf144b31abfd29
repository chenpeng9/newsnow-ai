"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryOverflowScrollElements = tryOverflowScrollElements;
var _configuration = require("../shared/configuration");
var _getScrollBy = require("./get-scroll-by");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function tryOverflowScrollElements(_ref) {
  var input = _ref.input,
    source = _ref.source,
    entries = _ref.entries,
    timeSinceLastFrame = _ref.timeSinceLastFrame,
    underUsersPointer = _ref.underUsersPointer;
  // For now we are auto scrolling any element that wants to.
  // Otherwise it's hard to know what should scroll first as we might
  // be scrolling elements that have no hierarchical relationship
  var _iterator = _createForOfIteratorHelper(entries),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _entry$getConfigurati, _entry$getAllowedAxis, _entry$getAllowedAxis2;
      var entry = _step.value;
      // "overflow" scrolling not relevant when directly over the element
      // "over element" scrolling is responsible for scrolling when over an element
      // 1. If we are over the element, then we want to exit and let the "overflow" scroller take over
      // 2. The overflow hitbox area for an edge actually stretches over the element
      //    This check is used to "mask" or "cut out" the element hitbox from the overflow hitbox
      if (entry.element.contains(underUsersPointer)) {
        continue;
      }
      var feedback = {
        input: input,
        source: source,
        element: entry.element
      };

      // Scrolling not allowed for this entity
      // Note: not marking engagement if an entity is opting out of scrolling
      if (entry.canScroll && !entry.canScroll(feedback)) {
        continue;
      }
      var config = (0, _configuration.getInternalConfig)((_entry$getConfigurati = entry.getConfiguration) === null || _entry$getConfigurati === void 0 ? void 0 : _entry$getConfigurati.call(entry, feedback));
      var allowedAxis = (_entry$getAllowedAxis = (_entry$getAllowedAxis2 = entry.getAllowedAxis) === null || _entry$getAllowedAxis2 === void 0 ? void 0 : _entry$getAllowedAxis2.call(entry, feedback)) !== null && _entry$getAllowedAxis !== void 0 ? _entry$getAllowedAxis : 'all';
      var scrollBy = (0, _getScrollBy.getScrollBy)({
        entry: entry,
        input: input,
        timeSinceLastFrame: timeSinceLastFrame,
        allowedAxis: allowedAxis,
        config: config
      });
      if (scrollBy) {
        entry.element.scrollBy(scrollBy);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}