import express from "express";

import {
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
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

export default router;