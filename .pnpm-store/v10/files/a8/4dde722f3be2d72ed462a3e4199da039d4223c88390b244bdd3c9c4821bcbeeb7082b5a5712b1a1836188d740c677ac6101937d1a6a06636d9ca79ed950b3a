"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHitbox = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _axis = require("../shared/axis");
var _getOverElementHitbox = require("../shared/get-over-element-hitbox");
// Borrowing the hitbox calculation from over-element
// So we can be sure that the 'insideEdge' calculations
// line up perfectly with the 'over element' edge calculations

function makeGetHitbox(_ref) {
  var axis = _ref.axis,
    side = _ref.side;
  return function hitbox(_ref2) {
    var clientRect = _ref2.clientRect,
      overflow = _ref2.overflow,
      config = _ref2.config;
    var _axisLookup$axis = _axis.axisLookup[axis],
      mainAxis = _axisLookup$axis.mainAxis,
      crossAxis = _axisLookup$axis.crossAxis;
    var edge = mainAxis[side];
    var spacingForEdge = overflow[edge];
    var overElementHitbox = _getOverElementHitbox.getOverElementHitbox[edge]({
      clientRect: clientRect,
      config: config
    });
    // Same as the over element hitbox,
    // but we are stretching out on the cross axis (if needed)
    var insideOfEdge = DOMRect.fromRect((0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)({}, mainAxis.point, overElementHitbox[mainAxis.point]), mainAxis.size, overElementHitbox[mainAxis.size]), crossAxis.point, overElementHitbox[crossAxis.point] - spacingForEdge[crossAxis.start]), crossAxis.size, overElementHitbox[crossAxis.size] + spacingForEdge[crossAxis.start] + spacingForEdge[crossAxis.end]));

    // Note: this will be "cut out" by the "overElementHitbox"
    var outsideOfEdge = DOMRect.fromRect((0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)((0, _defineProperty2.default)({}, mainAxis.point, side === 'start' ?
    // begin from before the start edge and growing forward
    clientRect[mainAxis.point] - spacingForEdge[mainAxis.start] :
    // begin from on the end edge and go outwards
    clientRect[mainAxis.end]), crossAxis.point, clientRect[crossAxis.point] - spacingForEdge[crossAxis.start]), mainAxis.size, side === 'start' ? spacingForEdge[mainAxis.start] : spacingForEdge[mainAxis.end]), crossAxis.size, spacingForEdge[crossAxis.start] + clientRect[crossAxis.size] + spacingForEdge[crossAxis.end]));
    return {
      insideOfEdge: insideOfEdge,
      outsideOfEdge: outsideOfEdge
    };
  };
}
var getHitbox = exports.getHitbox = {
  top: makeGetHitbox({
    axis: 'vertical',
    side: 'start'
  }),
  right: makeGetHitbox({
    axis: 'horizontal',
    side: 'end'
  }),
  bottom: makeGetHitbox({
    axis: 'vertical',
    side: 'end'
  }),
  left: makeGetHitbox({
    axis: 'horizontal',
    side: 'start'
  })
};