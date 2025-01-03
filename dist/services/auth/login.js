"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var authRepository = _interopRequireWildcard(require("../../repositories/auth/login"));
var _errorHandler = require("../../middleware/errorHandler");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const login = async (email, password) => {
  if (!email || !password) {
    throw (0, _errorHandler.createValidationError)("Email and password are required");
  }
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw (0, _errorHandler.createAuthenticationError)("Invalid email or password");
  }
  const isValidPassword = await _bcryptjs.default.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw (0, _errorHandler.createAuthenticationError)("Invalid email or password");
  }
  const token = _jsonwebtoken.default.sign({
    email: user.email
  }, "SECRET_KEY", {
    expiresIn: "1h"
  });
  return token;
};
exports.login = login;