"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteEvent = void 0;
var _connection = _interopRequireDefault(require("../../../connection.js"));
var _errorHandler = require("../../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const deleteEvent = async id => {
  try {
    await _connection.default.query(`
        DELETE FROM events
        WHERE id = $1
      `, [id]);
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.deleteEvent = deleteEvent;