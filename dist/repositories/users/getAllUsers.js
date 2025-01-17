"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsers = void 0;
var _connection = _interopRequireDefault(require("../../connection.js"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllUsers = async () => {
  try {
    const {
      rows
    } = await _connection.default.query(`
        SELECT 
          id,
          email,
          name,
          role,
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `);
    if (!rows) {
      throw new Error("No users found");
    }
    return rows;
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.getAllUsers = getAllUsers;