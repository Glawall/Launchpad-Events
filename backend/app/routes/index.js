import express from "express";
import * as adminEventController from "../controllers/admin/events/index";
import * as usersController from "../controllers/users/index";
import * as adminUserController from "../controllers/admin/users/index";

import { errorHandler } from "../middleware/errorHandler.js";
import { checkAdmin, checkUser } from "../middleware/auth.js";

const router = express.Router();

// Admin Routes
router.get("/api/admin/users", checkAdmin, adminUserController.getAllUsers);
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

// Error handling
router.use(errorHandler);

export default router;
