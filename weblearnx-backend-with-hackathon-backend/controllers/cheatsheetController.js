import db from "../config/db.js";

/**
 * Create Cheatsheet API
 * Admin-only endpoint for publishing quick-reference content.
 * Saves `created_by` for auditability and future ownership tracking.
 */
export const createCheatsheet = async (req, res) => {
  const { title, slug, category, content } = req.body;

  const [result] = await db.execute(
    "INSERT INTO cheatsheets (title, slug, category, content, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, slug, category, content, req.user.id]
  );

  res.json({ id: result.insertId, title, slug });
};

/**
 * List Cheatsheets API
 * Returns all active cheatsheets for authenticated users.
 * Soft-deleted rows remain hidden from normal retrieval.
 */
export const getCheatsheets = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM cheatsheets WHERE deleted_at IS NULL"
  );

  res.json(rows);
};

/**
 * Get Cheatsheet By Slug API
 * Uses the slug as a stable lookup key for friendly content URLs.
 * Soft-deleted cheatsheets are intentionally excluded from retrieval.
 */
export const getCheatsheetBySlug = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM cheatsheets WHERE slug = ? AND deleted_at IS NULL",
    [req.params.slug]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(rows[0]);
};
