import db from "../config/db.js";

/**
 * Mark Article Complete API
 * Records that the authenticated user finished a specific article.
 * Uses `INSERT IGNORE` so repeated completion requests do not create duplicate progress rows.
 */
export const markAsCompleted = async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId || isNaN(parseInt(articleId, 10))) {
      return res.status(400).json({ success: false, message: "Valid articleId is required" });
    }

    await db.execute(
      "INSERT IGNORE INTO progress (user_id, article_id) VALUES (?, ?)",
      [req.user.id, articleId]
    );

    return res.json({ success: true, message: "Completed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Get Course Progress API
 * Calculates learner progress for a course by comparing completed articles against
 * the total number of active articles in that course.
 * Combines aggregate queries so the client receives a ready-to-display percentage.
 */
export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    /**
     * Count active course articles only.
     * Deleted learning content should not affect completion percentages.
     */
    const [total] = await db.execute(
      "SELECT COUNT(*) as total FROM articles WHERE course_id = ? AND deleted_at IS NULL",
      [courseId]
    );

    /**
     * Count the authenticated user's completed articles within the requested course.
     * The join ensures progress is scoped to the correct course.
     */
    const [completed] = await db.execute(
      `SELECT COUNT(*) as completed
       FROM progress p
       JOIN articles a ON p.article_id = a.id
       WHERE p.user_id = ? AND a.course_id = ?`,
      [req.user.id, courseId]
    );

    const totalArticles = total[0].total;
    const completedCount = completed[0].completed;

    const progress =
      totalArticles === 0
        ? 0
        : Math.round((completedCount / totalArticles) * 100);

    return res.json({
      success: true,
      totalArticles,
      completedCount,
      progress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
