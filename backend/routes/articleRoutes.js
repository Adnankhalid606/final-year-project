import express from "express";
import {
  createArticle,
  getArticlesByCourse,
  getArticleById,
  updateArticle,
  deleteArticle,
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
 * Single article route — GET for all authenticated users, PUT/DELETE for admins only.
 */
router.get("/:id", protect, getArticleById);
router.put("/:id", protect, admin, updateArticle);
router.delete("/:id", protect, admin, deleteArticle);

export default router;
