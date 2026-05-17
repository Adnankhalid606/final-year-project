import express from "express";
import {
  createCheatsheet,
  getCheatsheets,
  getCheatsheetBySlug,
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

export default router;
