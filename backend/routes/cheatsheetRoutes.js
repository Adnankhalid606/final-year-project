import express from "express";
import {
  createCheatsheet,
  getCheatsheets,
  getCheatsheetBySlug,
  updateCheatsheet,
  deleteCheatsheet,
} from "../controllers/cheatsheetController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Cheatsheet route group
 * Authenticated users can read cheatsheets, while only admins can publish new ones.
 */
router
  .route("/")
  .get(protect, getCheatsheets)
  .post(protect, admin, createCheatsheet);

/**
 * Slug-based detail route
 * Protected endpoint for fetching a single active cheatsheet by public identifier.
 */
router.get("/:slug", protect, getCheatsheetBySlug);

/**
 * Update and delete routes by ID
 * Admin-only — update content/metadata or soft-delete a cheatsheet.
 */
router.put("/:id", protect, admin, updateCheatsheet);
router.delete("/:id", protect, admin, deleteCheatsheet);

export default router;
