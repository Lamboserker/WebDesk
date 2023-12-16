"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _reactSdk = require("@videosdk.live/react-sdk");

var useIsRecording = function useIsRecording() {
  var _useMeeting = (0, _reactSdk.useMeeting)(),
      recordingState = _useMeeting.recordingState;

  var isRecording = (0, _react.useMemo)(function () {
    return recordingState === _reactSdk.Constants.recordingEvents.RECORDING_STARTED || recordingState === _reactSdk.Constants.recordingEvents.RECORDING_STOPPING;
  }, [recordingState]);
  return isRecording;
};

var _default = useIsRecording;
exports["default"] = _default;