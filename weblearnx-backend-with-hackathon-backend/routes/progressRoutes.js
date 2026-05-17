import express from "express";
import {
  markAsCompleted,
  getCourseProgress,
} from "../controllers/progressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Progress route group
 * All progress operations are scoped to the authenticated user through JWT middleware.
 */
router.post("/complete", protect, markAsCompleted);

/**
 * Course progress route
 * Declared after `/complete` so the dynamic `:courseId` parameter does not capture that static path.
 */
router.get("/:courseId", protect, getCourseProgress);

export default router;
