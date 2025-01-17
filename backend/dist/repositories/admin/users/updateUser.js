"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = void 0;
var _connection = _interopRequireDefault(require("../../../connection.js"));
var _errorHandler = require("../../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const updateUser = async (id, role) => {
  try {
    const {
      rows
    } = await _connection.default.query(`
        UPDATE users 
        SET role = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [role, id]);
    return rows[0];
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.updateUser = updateUser;