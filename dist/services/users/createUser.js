"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = void 0;
var userRepository = _interopRequireWildcard(require("../../repositories/users/index"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createUser = async userData => {
  if (!userData.email || !userData.name || !userData.password) {
    throw (0, _errorHandler.createValidationError)("Email, name, and password are required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw (0, _errorHandler.createValidationError)("Invalid email format");
  }
  const existingUsers = await userRepository.getAllUsers();
  const userExists = existingUsers.some(user => user.email === userData.email);
  if (userExists) {
    throw (0, _errorHandler.createDatabaseError)("Duplicate entry found", "23505");
  }
  const password_hash = await _bcrypt.default.hash(userData.password, 10);
  return userRepository.createUser({
    email: userData.email,
    name: userData.name,
    role: "user",
    password_hash
  });
};
exports.createUser = createUser;