import express from "express";

import {
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
  getAllUsers,
  deleteUser,
  getAllHackathons,
  updateHackathonStatus,
  getAllCourses,
  getAllArticlesByCourse,
} from "../controllers/adminController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Get all pending organizer requests
 */
router.get(
  "/organizers/pending",
  protect,
  admin,
  getPendingOrganizers
);

/**
 * Approve organizer request
 */
router.put(
  "/organizers/:userId/approve",
  protect,
  admin,
  approveOrganizer
);

/**
 * Reject organizer request
 */
router.put(
  "/organizers/:userId/reject",
  protect,
  admin,
  rejectOrganizer
);

/**
 * Get all users
 */
router.get("/users", protect, admin, getAllUsers);

/**
 * Delete (soft delete) a user
 */
router.delete("/users/:userId", protect, admin, deleteUser);

/**
 * Get all hackathons (admin view)
 */
router.get("/hackathons", protect, admin, getAllHackathons);

/**
 * Update hackathon status (admin only)
 */
router.patch("/hackathons/:hackathonId/status", protect, admin, updateHackathonStatus);

/**
 * Get all courses (admin view)
 */
router.get("/courses", protect, admin, getAllCourses);

/**
 * Get all articles for a course (admin view)
 */
router.get("/courses/:courseId/articles", protect, admin, getAllArticlesByCourse);

export default router;