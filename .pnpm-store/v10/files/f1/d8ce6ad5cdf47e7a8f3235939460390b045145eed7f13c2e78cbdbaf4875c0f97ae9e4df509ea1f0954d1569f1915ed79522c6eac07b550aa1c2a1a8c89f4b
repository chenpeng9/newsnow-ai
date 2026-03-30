"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryScroll = tryScroll;
var _configuration = require("../shared/configuration");
var _engagementHistory = require("../shared/engagement-history");
var _dataAttributes = require("./data-attributes");
var _getScrollBy = require("./get-scroll-by");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function isScrollingAvailable(value) {
  return Boolean(value.top || value.left);
}
function tryScrollElements(_ref) {
  var _container$getConfigu, _container$getAllowed, _container$getAllowed2;
  var target = _ref.target,
    input = _ref.input,
    source = _ref.source,
    findEntry = _ref.findEntry,
    timeSinceLastFrame = _ref.timeSinceLastFrame,
    _ref$available = _ref.available,
    available = _ref$available === void 0 ? {
      top: true,
      left: true
    } : _ref$available;
  // we cannot do any more scrolling
  if (!isScrollingAvailable(available)) {
    return available;
  }

  // run out of parents to search
  if (!target) {
    return available;
  }
  var element = target.closest(_dataAttributes.selector);

  // cannot find any more scroll containers
  if (!element) {
    return available;
  }
  var container = findEntry(element);

  // cannot find registration, this is bad.
  // fail and just exit
  if (!container) {
    return available;
  }
  function continueSearchUp() {
    var _element$parentElemen;
    return tryScrollElements({
      target: (_element$parentElemen = element === null || element === void 0 ? void 0 : element.parentElement) !== null && _element$parentElemen !== void 0 ? _element$parentElemen : null,
      findEntry: findEntry,
      source: source,
      timeSinceLastFrame: timeSinceLastFrame,
      input: input,
      available: available
    });
  }
  var feedback = {
    input: input,
    source: source,
    element: element
  };

  // Engagement is not marked if scrolling is explicitly not allowed
  if (container.canScroll && !container.canScroll(feedback)) {
    return continueSearchUp();
  }

  // Marking engagement even if no edges are scrollable.
  // We are marking engagement as soon as the element is scrolled over
  var engagement = (0, _engagementHistory.markAndGetEngagement)(element);
  var config = (0, _configuration.getInternalConfig)((_container$getConfigu = container.getConfiguration) === null || _container$getConfigu === void 0 ? void 0 : _container$getConfigu.call(container, feedback));
  var allowedAxis = (_container$getAllowed = (_container$getAllowed2 = container.getAllowedAxis) === null || _container$getAllowed2 === void 0 ? void 0 : _container$getAllowed2.call(container, feedback)) !== null && _container$getAllowed !== void 0 ? _container$getAllowed : 'all';
  var scrollBy = (0, _getScrollBy.getScrollBy)({
    element: element,
    engagement: engagement,
    input: input,
    timeSinceLastFrame: timeSinceLastFrame,
    allowedAxis: allowedAxis,
    config: config
  });

  // Only allow scrolling in directions that have not already been used
  var scroll = {
    top: 0,
    left: 0
  };
  if (available.top && scrollBy.top !== 0) {
    scroll.top = scrollBy.top;
    // can no longer scroll on the top after this
    available.top = false;
  }
  if (available.left && scrollBy.left !== 0) {
    scroll.left = scrollBy.left;
    // can no longer scroll on the left after this
    available.left = false;
  }

  // Only scroll if there is something to scroll
  if (scroll.top !== 0 || scroll.left !== 0) {
    element.scrollBy(scroll);
  }
  return continueSearchUp();
}
function tryScrollWindow(_ref2) {
  var input = _ref2.input,
    timeSinceLastFrame = _ref2.timeSinceLastFrame,
    available = _ref2.available,
    source = _ref2.source,
    entries = _ref2.entries;
  var element = document.documentElement;
  var feedback = {
    input: input,
    source: source,
    element: element
  };
  var _iterator = _createForOfIteratorHelper(entries),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _entry$getConfigurati, _entry$getAllowedAxis, _entry$getAllowedAxis2;
      var entry = _step.value;
      // this entry is not allowing scrolling, we need to look for another
      if (entry.canScroll && !entry.canScroll(feedback)) {
        continue;
      }

      // Note: if we had an event for when the user is leaving a tab
      // we _could_ conceptually reset the engagement
      var engagement = (0, _engagementHistory.markAndGetEngagement)(element);
      var config = (0, _configuration.getInternalConfig)((_entry$getConfigurati = entry.getConfiguration) === null || _entry$getConfigurati === void 0 ? void 0 : _entry$getConfigurati.call(entry, feedback));
      var allowedAxis = (_entry$getAllowedAxis = (_entry$getAllowedAxis2 = entry.getAllowedAxis) === null || _entry$getAllowedAxis2 === void 0 ? void 0 : _entry$getAllowedAxis2.call(entry, feedback)) !== null && _entry$getAllowedAxis !== void 0 ? _entry$getAllowedAxis : 'all';
      var scrollBy = (0, _getScrollBy.getScrollBy)({
        element: element,
        engagement: engagement,
        input: input,
        config: config,
        allowedAxis: allowedAxis,
        getRect: function getRect(element) {
          return DOMRect.fromRect({
            y: 0,
            x: 0,
            width: element.clientWidth,
            height: element.clientHeight
          });
        },
        timeSinceLastFrame: timeSinceLastFrame
      });
      var scroll = {
        top: available.top ? scrollBy.top : 0,
        left: available.left ? scrollBy.left : 0
      };

      // only trigger a scroll if we are actually scrolling
      if (scroll.top !== 0 || scroll.left !== 0) {
        element.scrollBy(scroll);
      }

      // We only want the window to scroll once
      break;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function tryScroll(_ref3) {
  var input = _ref3.input,
    findEntry = _ref3.findEntry,
    timeSinceLastFrame = _ref3.timeSinceLastFrame,
    source = _ref3.source,
    getWindowScrollEntries = _ref3.getWindowScrollEntries,
    underUsersPointer = _ref3.underUsersPointer;
  // We are matching browser behaviour and scrolling inner elements
  // before outer ones. So we try to scroll scroller containers before
  // the window.
  var remainder = tryScrollElements({
    target: underUsersPointer,
    timeSinceLastFrame: timeSinceLastFrame,
    input: input,
    source: source,
    findEntry: findEntry
  });

  // Check if we can do any window scrolling
  if (!isScrollingAvailable(remainder)) {
    return;
  }
  tryScrollWindow({
    input: input,
    source: source,
    entries: getWindowScrollEntries(),
    timeSinceLastFrame: timeSinceLastFrame,
    available: remainder
  });
}