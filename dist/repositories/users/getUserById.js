"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserById = void 0;
var _connection = _interopRequireDefault(require("../../connection.js"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getUserById = async id => {
  try {
    const {
      rows
    } = await _connection.default.query(`
        SELECT 
          id,
          name,
          email,
          role,
          created_at,
          updated_at
        FROM users 
        WHERE id = $1
      `, [id]);
    return rows[0];
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.getUserById = getUserById;