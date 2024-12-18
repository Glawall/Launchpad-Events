import express from "express";
import * as userController from "../controllers/index.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { checkAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin Routes
router.get("/api/admin/users", checkAdmin, userController.getAllUsers);

// Error handling
router.use(errorHandler);

export default router;
