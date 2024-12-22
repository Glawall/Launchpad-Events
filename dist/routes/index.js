"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var adminEventController = _interopRequireWildcard(require("../controllers/admin/events/index"));
var usersController = _interopRequireWildcard(require("../controllers/users/index"));
var adminUserController = _interopRequireWildcard(require("../controllers/admin/users/index"));
var _errorHandler = require("../middleware/errorHandler.js");
var _auth = require("../middleware/auth.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// Admin Routes
router.get("/api/admin/users", _auth.checkAdmin, adminUserController.getAllUsers);
router.post("/api/admin/events", _auth.checkAdmin, adminEventController.createEvent);
router.put("/api/admin/events/:id", _auth.checkAdmin, adminEventController.updateEvent);
router.delete("/api/admin/events/:id", _auth.checkAdmin, adminEventController.deleteEvent);
router.patch("/api/admin/users/:id", _auth.checkAdmin, adminUserController.updateUser);

//User Routes
router.get("/api/events/:id", usersController.getEventById);
router.get("/api/users/:id", _auth.checkUser, usersController.getUserById);
router.delete("/api/users/:id", _auth.checkUser, usersController.deleteUser);
router.post("/api/events/:eventId/users/:userId/attendees", _auth.checkUser, usersController.addAttendee);
router.get("/api/events", usersController.getAllEvents);
router.delete("/api/events/:eventId/users/:userId/attendees", _auth.checkUser, usersController.deleteAttendee);

// Error handling
router.use(_errorHandler.errorHandler);
var _default = exports.default = router;