import express from "express";
import * as adminEventController from "../controllers/admin/events/index";
import * as usersController from "../controllers/users/index";
import * as adminUserController from "../controllers/admin/users/index";
import * as authController from "../controllers/auth/index.js";

import { errorHandler } from "../middleware/errorHandler.js";
import { checkAdmin, checkUser } from "../middleware/auth.js";

const router = express.Router();

// Auth route
router.post("/api/auth/login", authController.login);

// Admin Routes
router.post("/api/admin/events", checkAdmin, adminEventController.createEvent);
router.put(
  "/api/admin/events/:id",
  checkAdmin,
  adminEventController.updateEvent
);
router.delete(
  "/api/admin/events/:id",
  checkAdmin,
  adminEventController.deleteEvent
);
router.patch(
  "/api/admin/users/:id",
  checkAdmin,
  adminUserController.updateUser
);

//User Routes
router.get("/api/events/:id", usersController.getEventById);
router.get("/api/users/:id", checkUser, usersController.getUserById);
router.delete("/api/users/:id", checkUser, usersController.deleteUser);
router.post(
  "/api/events/:eventId/users/:userId/attendees",
  checkUser,
  usersController.addAttendee
);
router.get("/api/events", usersController.getAllEvents);
router.delete(
  "/api/events/:eventId/users/:userId/attendees",
  checkUser,
  usersController.deleteAttendee
);
router.get("/api/users", usersController.getAllUsers);
router.post("/api/users", usersController.createUser);

// Error handling
router.use(errorHandler);

export default router;
