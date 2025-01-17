"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _routes = _interopRequireDefault(require("./routes"));
var _express = _interopRequireDefault(require("express"));
var _errorHandler = require("./middleware/errorHandler");
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_routes.default);
app.use(_errorHandler.errorHandler);
var _default = exports.default = app;