import db from "../config/db.js";

/**
 * Create Article API
 * Admin-only endpoint for adding learning articles under a specific course.
 * Validates that the target course exists before inserting.
 */
export const createArticle = async (req, res) => {
  try {
    const { title, content, courseId, order } = req.body;

    // Input validation
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }
    if (!courseId || isNaN(parseInt(courseId, 10))) {
      return res.status(400).json({ success: false, message: "Valid courseId is required" });
    }

    // Verify the course exists and is not soft-deleted
    const [course] = await db.execute(
      "SELECT id FROM courses WHERE id = ? AND deleted_at IS NULL",
      [courseId]
    );
    if (course.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const [result] = await db.execute(
      "INSERT INTO articles (title, content, course_id, `order`, created_by) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), content.trim(), courseId, order ?? null, req.user.id]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      title,
      courseId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * List Course Articles API
 * Returns the ordered article sequence for a course so the client can render a learning path.
 * Soft-deleted articles are excluded from the result set.
 */
export const getArticlesByCourse = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM articles WHERE course_id = ? AND deleted_at IS NULL ORDER BY `order` ASC",
      [req.params.courseId]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Get Single Article API
 * Fetches one active article record by ID for authenticated platform users.
 * Soft-deleted content is treated as unavailable and returns a not-found response.
 */
export const getArticleById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Update Article API
 * Admin-only endpoint for modifying an existing article's title, content, and order.
 */
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM articles WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await db.execute(
      "UPDATE articles SET title = ?, content = ?, `order` = ? WHERE id = ?",
      [title.trim(), content.trim(), order ?? null, id]
    );

    return res.json({ success: true, message: "Article updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Delete Article API
 * Admin-only soft delete — sets deleted_at to hide the article from learner views.
 */
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.execute(
      "SELECT id FROM articles WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await db.execute(
      "UPDATE articles SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );

    return res.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
