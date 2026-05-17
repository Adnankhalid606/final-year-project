import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
} from "../controllers/courseController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Course route group
 * Reading course data requires authentication, while course creation is admin-only.
 */
router
  .route("/")
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

/**
 * Course detail route
 * Protected endpoint for loading one active course.
 */
router.route("/:id").get(protect, getCourseById);

export default router;
