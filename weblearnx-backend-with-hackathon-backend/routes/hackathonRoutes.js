import express from "express";
import {
  bookmarkHackathon,
  createHackathon,
  deleteHackathon,
  getHackathons,
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
 * Combines public discovery endpoints with protected bookmark and organizer/admin management APIs.
 * Route-level middleware handles authentication and role checks before controller business logic runs.
 */

/**
 * Public listing route
 * No authentication is required because hackathon discovery is available to all clients.
 */
router.get("/", getHackathons);

/**
 * Bookmark route
 * Restricted to authenticated users with the learner role.
 */
router.post(
  "/:hackathonId/bookmark",
  protect,
  authorizeRoles("user"),
  bookmarkHackathon
);

/**
 * Bookmark listing route
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
 * Update route
 * Only organizers and admins can attempt updates.
 * Final ownership checks are enforced inside the controller using database record ownership.
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
