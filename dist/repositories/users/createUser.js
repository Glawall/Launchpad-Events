"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = void 0;
var _connection = _interopRequireDefault(require("../../connection.js"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const createUser = async ({
  email,
  name,
  role,
  password_hash
}) => {
  try {
    const {
      rows: [user]
    } = await _connection.default.query(`INSERT INTO users 
        (email, name, role, password_hash, created_at, updated_at)
       VALUES 
        ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, name, role, created_at, updated_at`, [email, name, role, password_hash]);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.createUser = createUser;