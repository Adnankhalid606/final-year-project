import db from "../config/db.js";

/**
 * Create Course API
 * Admin-only endpoint for adding a new course container to the learning catalog.
 * Persists `created_by` so the database records which privileged user published the course.
 */
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Input validation
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const [result] = await db.execute(
      "INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)",
      [title.trim(), description.trim(), req.user.id]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      title,
      description,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * List Courses API
 * Returns all active courses available in the platform catalog.
 * Supports optional ?search= query param to filter by title.
 * Soft-deleted records are hidden to keep retired courses out of learner views.
 */
export const getCourses = async (req, res) => {
  try {
    const { search } = req.query
    let query = 'SELECT * FROM courses WHERE deleted_at IS NULL'
    const params = []
    if (search) {
      query += ' AND title LIKE ?'
      params.push(`%${search}%`)
    }
    const [rows] = await db.execute(query, params)
    return res.json({ success: true, data: rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Server Error' })
  }
};

/**
 * Get Single Course API
 * Fetches one active course by ID for detail pages and related content loading.
 * Soft-deleted courses are treated as unavailable.
 */
export const getCourseById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Update Course API
 * Admin-only endpoint for modifying an existing course's title and description.
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM courses WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await db.execute(
      "UPDATE courses SET title = ?, description = ? WHERE id = ?",
      [title.trim(), description.trim(), id]
    );

    return res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Delete Course API
 * Admin-only soft delete — sets deleted_at to hide the course and all its articles
 * from learner views without permanently removing the data.
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.execute(
      "SELECT id FROM courses WHERE id = ? AND deleted_at IS NULL",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await db.execute(
      "UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );

    return res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
