"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEvent = void 0;
var adminService = _interopRequireWildcard(require("../../../services/admin/events/index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const updatedEvent = await adminService.updateEvent(eventId, req.body);
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};
exports.updateEvent = updateEvent;