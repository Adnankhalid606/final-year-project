import express from "express";
import {
  bookmarkHackathon,
  removeBookmark,
  createHackathon,
  deleteHackathon,
  getHackathons,
  getHackathonById,
  getUserBookmarks,
  updateHackathon,
} from "../controllers/hackathonController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateCreateHackathon,
  validateUpdateHackathon,
} from "../middleware/hackathonValidationMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Hackathon route group
 * Static routes are declared before dynamic /:hackathonId routes to prevent
 * Express from matching "bookmarks/me" as a hackathon ID.
 */

/**
 * Public listing route
 * No authentication required — hackathon discovery is open to all clients.
 */
router.get("/", getHackathons);

/**
 * Bookmark listing route — MUST be before /:hackathonId routes
 * Returns saved hackathons for the currently authenticated learner only.
 */
router.get("/bookmarks/me", protect, authorizeRoles("user"), getUserBookmarks);

/**
 * Create route
 * Only organizers and admins can publish new hackathon listings.
 * Validation runs before the controller to reject invalid payloads early.
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin", "organizer"),
  validateCreateHackathon,
  createHackathon
);

/**
 * Bookmark route — dynamic, must come after static /bookmarks/me
 * Restricted to authenticated users with the learner role.
 */
router.post(
  "/:hackathonId/bookmark",
  protect,
  authorizeRoles("user"),
  bookmarkHackathon
);

/**
 * Remove bookmark route
 * Allows users to delete a previously saved bookmark.
 */
router.delete(
  "/:hackathonId/bookmark",
  protect,
  authorizeRoles("user"),
  removeBookmark
);

/**
 * Get single hackathon by ID
 */
router.get("/:hackathonId", getHackathonById);

/**
 * Update route
 * Only organizers and admins can attempt updates.
 * Final ownership checks are enforced inside the controller.
 */
router.put(
  "/:hackathonId",
  protect,
  authorizeRoles("admin", "organizer"),
  validateUpdateHackathon,
  updateHackathon
);

/**
 * Delete route
 * Only organizers and admins can request deletion.
 * Controller applies ownership rules and soft-delete behavior.
 */
router.delete(
  "/:hackathonId",
  protect,
  authorizeRoles("admin", "organizer"),
  deleteHackathon
);

export default router;
