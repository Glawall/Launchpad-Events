"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = void 0;
var adminRepository = _interopRequireWildcard(require("../../../repositories/admin/users/index"));
var userRepository = _interopRequireWildcard(require("../../../repositories/users/index"));
var _errorHandler = require("../../../middleware/errorHandler");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const VALID_ROLES = ["admin", "user"];
const updateUser = async (userId, role) => {
  if (isNaN(userId)) {
    throw (0, _errorHandler.createValidationError)("Invalid user ID");
  }
  if (!VALID_ROLES.includes(role)) {
    throw (0, _errorHandler.createValidationError)('Invalid role. Must be either "admin" or "user"');
  }
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return await adminRepository.updateUser(userId, role);
};
exports.updateUser = updateUser;