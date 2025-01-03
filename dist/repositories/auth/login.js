"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUserByEmail = void 0;
var _connection = _interopRequireDefault(require("../../connection"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const findUserByEmail = async email => {
  try {
    const result = await _connection.default.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
exports.findUserByEmail = findUserByEmail;