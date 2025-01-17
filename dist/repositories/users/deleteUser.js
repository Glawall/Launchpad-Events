"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = void 0;
var _connection = _interopRequireDefault(require("../../connection.js"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const deleteUser = async id => {
  try {
    await _connection.default.query(`
        DELETE FROM users
        WHERE id = $1
      `, [id]);
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.deleteUser = deleteUser;