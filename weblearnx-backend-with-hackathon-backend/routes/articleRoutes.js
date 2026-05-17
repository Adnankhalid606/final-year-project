import express from "express";
import {
  createArticle,
  getArticlesByCourse,
  getArticleById,
} from "../controllers/articleController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Article route group
 * Reading article content requires authentication, while article creation is restricted to admins.
 */
router.post("/", protect, admin, createArticle);

/**
 * Course article listing route
 * Protected so learning content is available only to authenticated users.
 */
router.get("/course/:courseId", protect, getArticlesByCourse);

/**
 * Single article route
 * Protected endpoint for reading one active article record.
 */
router.get("/:id", protect, getArticleById);

export default router;
