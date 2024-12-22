"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventById = void 0;
var eventService = _interopRequireWildcard(require("../../services/users/index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await eventService.getEventById(eventId);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};
exports.getEventById = getEventById;