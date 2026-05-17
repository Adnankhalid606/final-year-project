import db from "../config/db.js";

/**
 * Create Course API
 * Admin-only endpoint for adding a new course container to the learning catalog.
 * Persists `created_by` so the database records which privileged user published the course.
 */
export const createCourse = async (req, res) => {
  const { title, description } = req.body;

  const [result] = await db.execute(
    "INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)",
    [title, description, req.user.id]
  );

  res.json({
    id: result.insertId,
    title,
    description,
  });
};

/**
 * List Courses API
 * Returns all active courses available in the platform catalog.
 * Soft-deleted records are hidden to keep retired courses out of learner views.
 */
export const getCourses = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM courses WHERE deleted_at IS NULL"
  );

  res.json(rows);
};

/**
 * Get Single Course API
 * Fetches one active course by ID for detail pages and related content loading.
 * Soft-deleted courses are treated as unavailable.
 */
export const getCourseById = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL",
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(rows[0]);
};
