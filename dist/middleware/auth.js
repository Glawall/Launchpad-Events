"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUser = exports.checkAuth = exports.checkAdmin = void 0;
var _checkValidation = require("./checkValidation");
const checkAuth = (req, res, next) => {
  const userRole = req.get("user-role");
  if (!userRole) {
    return res.status(401).json({
      message: "You need to be signed in"
    });
  }
  req.userRole = userRole;
  next();
};
exports.checkAuth = checkAuth;
const checkAdmin = exports.checkAdmin = [checkAuth, (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      message: "You need to be an admin to carry out this action"
    });
  }
  next();
}];
const checkUser = exports.checkUser = [checkAuth, (req, res, next) => {
  try {
    const userRole = req.get("user-role");
    const userId = parseInt(req.get("user-id"));
    if (req.params.userId) {
      const requestedUserId = parseInt(req.params.userId);
      if (requestedUserId !== userId && userRole !== "admin") {
        return res.status(403).json({
          message: "You can only manage your own attendance"
        });
      }
    } else if (req.params.id) {
      const requestedUserId = parseInt(req.params.id);
      req.userAccess = (0, _checkValidation.checkUserAccess)(userRole, userId, requestedUserId);
    }
    next();
  } catch (error) {
    next(error);
  }
}];