"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAttendee = void 0;
var userService = _interopRequireWildcard(require("../../services/users/deleteAttendee"));
var _checkValidation = require("../../middleware/checkValidation");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const deleteAttendee = async (req, res, next) => {
  try {
    const {
      eventId,
      userId
    } = (0, _checkValidation.checkEventAttendanceIds)(req.params.eventId, req.params.userId);
    const requestingUserId = parseInt(req.get("user-id"));
    const userRole = req.get("user-role");
    (0, _checkValidation.checkUserAccess)(userRole, requestingUserId, userId, "attend");
    await userService.deleteAttendee(eventId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
exports.deleteAttendee = deleteAttendee;