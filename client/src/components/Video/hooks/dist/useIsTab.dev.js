"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactResponsive = require("react-responsive");

var useIsTab = function useIsTab() {
  var isTablet = (0, _reactResponsive.useMediaQuery)({
    minWidth: 768,
    maxWidth: 1223 // 991,

  });
  return isTablet;
};

var _default = useIsTab;
exports["default"] = _default;