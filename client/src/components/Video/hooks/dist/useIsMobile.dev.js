"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactResponsive = require("react-responsive");

var useIsMobile = function useIsMobile(maxWidth) {
  var isMobile = (0, _reactResponsive.useMediaQuery)({
    maxWidth: maxWidth || 767
  });
  return isMobile;
};

var _default = useIsMobile;
exports["default"] = _default;