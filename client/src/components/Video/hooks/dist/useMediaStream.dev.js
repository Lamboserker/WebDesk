"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactSdk = require("@videosdk.live/react-sdk");

var _MeetingAppContextDef = require("../MeetingAppContextDef");

var useMediaStream = function useMediaStream() {
  var _useMeetingAppContext = (0, _MeetingAppContextDef.useMeetingAppContext)(),
      selectedWebcam = _useMeetingAppContext.selectedWebcam,
      webCamResolution = _useMeetingAppContext.webCamResolution;

  var getVideoTrack = function getVideoTrack(_ref) {
    var webcamId, encoderConfig, track;
    return regeneratorRuntime.async(function getVideoTrack$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            webcamId = _ref.webcamId, encoderConfig = _ref.encoderConfig;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap((0, _reactSdk.createCameraVideoTrack)({
              cameraId: webcamId ? webcamId : selectedWebcam.id,
              encoderConfig: encoderConfig ? encoderConfig : webCamResolution,
              optimizationMode: "motion",
              multiStream: false
            }));

          case 4:
            track = _context.sent;
            return _context.abrupt("return", track);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", null);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 8]]);
  };

  return {
    getVideoTrack: getVideoTrack
  };
};

var _default = useMediaStream;
exports["default"] = _default;