"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserById = void 0;
var adminRepository = _interopRequireWildcard(require("../../repositories/users/index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getUserById = async userId => {
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }
  const user = await adminRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
exports.getUserById = getUserById;