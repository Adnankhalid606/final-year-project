import db from "../config/db.js";

/**
 * Create Cheatsheet API
 * Admin-only endpoint for publishing quick-reference content.
 * Saves `created_by` for auditability and future ownership tracking.
 */
export const createCheatsheet = async (req, res) => {
  try {
    const { title, slug, category, content } = req.body;

    // Input validation
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!slug || !String(slug).trim()) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }
    if (!category || !String(category).trim()) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const [result] = await db.execute(
      "INSERT INTO cheatsheets (title, slug, category, content, created_by) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), slug.trim(), category.trim(), content.trim(), req.user.id]
    );

    return res.status(201).json({ success: true, id: result.insertId, title, slug });
  } catch (error) {
    // Handle duplicate slug (unique key violation)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "A cheatsheet with this slug already exists" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * List Cheatsheets API
 * Returns all active cheatsheets for authenticated users.
 * Soft-deleted rows remain hidden from normal retrieval.
 */
export const getCheatsheets = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM cheatsheets WHERE deleted_at IS NULL"
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Get Cheatsheet By Slug API
 * Uses the slug as a stable lookup key for friendly content URLs.
 * Soft-deleted cheatsheets are intentionally excluded from retrieval.
 */
export const getCheatsheetBySlug = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM cheatsheets WHERE slug = ? AND deleted_at IS NULL",
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Cheatsheet not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
