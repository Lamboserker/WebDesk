"use strict";

var _express = _interopRequireDefault(require("express"));

var _db = require("./config/db.js");

var _users = _interopRequireDefault(require("./routes/users.js"));

var _videos = _interopRequireDefault(require("./routes/videos.js"));

var _messages = _interopRequireDefault(require("./routes/messages.js"));

var _workspaces = _interopRequireDefault(require("./routes/workspaces.js"));

var _Auth = _interopRequireDefault(require("./middleware/Auth.js"));

var _google0auth = _interopRequireDefault(require("./routes/google0auth.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _morgan["default"])("dev"));
(0, _db.connectDB)(); // Routes

app.use("/api/users", _users["default"]);
app.use("/api/video", _videos["default"]);
app.use("/api/messages", _messages["default"]);
app.use("/api/workspaces", _Auth["default"], _workspaces["default"]);
app.use("/api/google0auth", _google0auth["default"]); // Entfernen Sie `auth` von dieser Route

app.get("/", function (req, res) {
  res.send("API is running...");
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
var port = process.env.PORT || 9000;
app.listen(port, function () {
  return console.log("Server is running on port ".concat(port));
});