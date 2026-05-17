import db from "../config/db.js";

/**
 * Create Article API
 * Admin-only endpoint for adding learning articles under a specific course.
 * Stores `created_by` from the authenticated user for ownership and audit visibility.
 */
export const createArticle = async (req, res) => {
  const { title, content, courseId, order } = req.body;

  const [result] = await db.execute(
    "INSERT INTO articles (title, content, course_id, `order`, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, content, courseId, order, req.user.id]
  );

  res.json({
    id: result.insertId,
    title,
    courseId,
  });
};

/**
 * List Course Articles API
 * Returns the ordered article sequence for a course so the client can render a learning path.
 * Soft-deleted articles are excluded from the result set.
 */
export const getArticlesByCourse = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM articles WHERE course_id = ? AND deleted_at IS NULL ORDER BY `order` ASC",
    [req.params.courseId]
  );

  res.json(rows);
};

/**
 * Get Single Article API
 * Fetches one active article record by ID for authenticated platform users.
 * Soft-deleted content is treated as unavailable and returns a not-found response.
 */
export const getArticleById = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL",
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(rows[0]);
};
