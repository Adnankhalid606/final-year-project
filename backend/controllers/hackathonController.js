import db from "../config/db.js";

/**
 * Build a consistent success payload for hackathon APIs.
 * Keeps response structure uniform across create, update, delete, and bookmark flows.
 */
const sendSuccess = (res, statusCode, message, data = null, extra = {}) => {
  const response = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== null ? { data } : {}),
    ...extra,
  };

  return res.status(statusCode).json(response);
};

/**
 * Build a consistent error payload for validation, access, and business-rule failures.
 */
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Handle unexpected controller failures.
 * Centralizes logging and hides internal database details from API consumers.
 */
const sendServerError = (res, error) => {
  console.error(error);
  return sendError(res, 500, "Server Error");
};

/**
 * Load one active hackathon record by ID.
 * Soft-deleted rows are excluded so deleted listings cannot be updated, deleted again,
 * or bookmarked through normal application flows.
 */
const getActiveHackathonById = async (hackathonId) => {
  const [rows] = await db.query(
    `SELECT * FROM hackathons
     WHERE id = ?
     AND deleted_at IS NULL`,
    [hackathonId]
  );

  return rows[0] || null;
};

/**
 * Ownership and authorization check for mutating hackathon actions.
 * Admins can manage any listing, while organizers are limited to records they created.
 */
const canManageHackathon = (user, hackathon) => {
  return user.role === "admin" || hackathon.organizer_id === user.id;
};

/**
 * Get Single Hackathon API
 * Fetches one active hackathon by ID.
 */
export const getHackathonById = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await getActiveHackathonById(hackathonId);
    if (!hackathon) {
      return sendError(res, 404, "Hackathon not found");
    }
    return sendSuccess(res, 200, "Hackathon fetched successfully", hackathon);
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Create Hackathon API
 * Allows organizers and admins to create external hackathon listings.
 * Organizer ownership is derived from the authenticated JWT user instead of client input.
 * Persists a new hackathon row and returns the inserted record ID.
 */
export const createHackathon = async (req, res) => {
  try {
    const {
      title,
      description,
      banner,
      registration_link,
      start_date,
      end_date
    } = req.body;
    const organizerId = req.user.id;

    const [result] = await db.query(
      `INSERT INTO hackathons
       (title, description, banner, registration_link, start_date, end_date, organizer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        banner,
        registration_link,
        start_date,
        end_date,
        organizerId
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: {
        hackathonId: result.insertId,
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * List Hackathons API
 * Public endpoint for browsing available hackathons with optional title search and status filtering.
 * Joins the users table to include organizer display information in the response.
 * Soft-deleted records remain hidden by enforcing `deleted_at IS NULL` in the query.
 */
export const getHackathons = async (req, res) => {
  try {
    const { search, status } = req.query;
    const queryValues = [];

    let query = `
      SELECT
        hackathons.*,
        users.name AS organizer_name
      FROM hackathons
      LEFT JOIN users ON hackathons.organizer_id = users.id
      WHERE hackathons.deleted_at IS NULL
    `;

    if (search) {
      query += " AND hackathons.title LIKE ?";
      queryValues.push(`%${search}%`);
    }

    if (status) {
      query += " AND hackathons.status = ?";
      queryValues.push(status);
    }

    query += " ORDER BY hackathons.created_at DESC";

    const [hackathons] = await db.query(query, queryValues);

    res.status(200).json({
      success: true,
      message: "Hackathons fetched successfully",
      data: hackathons,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Update Hackathon API
 * Allows organizers and admins to modify an existing active hackathon listing.
 * Ownership is verified before the update so organizers can edit only their own listings,
 * while admins retain global management access.
 * Updates the existing database row instead of creating a replacement record.
 */
export const updateHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const {
      title,
      description,
      banner,
      registration_link,
      start_date,
      end_date,
      status
    } = req.body;

    const hackathon = await getActiveHackathonById(hackathonId);

    if (!hackathon) {
      return sendError(res, 404, "Hackathon not found");
    }

    if (!canManageHackathon(req.user, hackathon)) {
      return sendError(res, 403, "You can only edit your own hackathons");
    }

    // Use existing status if not provided in request
    const newStatus = status !== undefined ? status : hackathon.status;

    // Validate status value if provided
    const allowedStatuses = ["upcoming", "active", "completed"];
    if (status !== undefined && !allowedStatuses.includes(status)) {
      return sendError(res, 400, "Status must be one of: upcoming, active, completed");
    }

    await db.query(
      `UPDATE hackathons
       SET
         title = ?,
         description = ?,
         banner = ?,
         registration_link = ?,
         start_date = ?,
         end_date = ?,
         status = ?
       WHERE id = ?`,
      [
        title,
        description,
        banner || null,
        registration_link,
        start_date,
        end_date,
        newStatus,
        hackathonId,
      ]
    );

    return sendSuccess(res, 200, "Hackathon updated successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Soft Delete Hackathon API
 * Organizers can only delete their own hackathons, while admins can delete any listing.
 * The delete is implemented as a soft delete by setting `deleted_at`, preserving history
 * and keeping removed records out of normal public and bookmark queries.
 */
export const deleteHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await getActiveHackathonById(hackathonId);

    if (!hackathon) {
      return sendError(res, 404, "Hackathon not found");
    }

    if (!canManageHackathon(req.user, hackathon)) {
      return sendError(res, 403, "You can only delete your own hackathons");
    }

    await db.query(
      `UPDATE hackathons
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [hackathonId]
    );

    return sendSuccess(res, 200, "Hackathon deleted successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Remove Bookmark API
 * Allows authenticated learners to remove a previously saved hackathon bookmark.
 */
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId } = req.params;

    const [existingBookmark] = await db.query(
      `SELECT id FROM bookmarks WHERE user_id = ? AND hackathon_id = ?`,
      [userId, hackathonId]
    );

    if (existingBookmark.length === 0) {
      return sendError(res, 404, "Bookmark not found");
    }

    await db.query(
      `DELETE FROM bookmarks WHERE user_id = ? AND hackathon_id = ?`,
      [userId, hackathonId]
    );

    return sendSuccess(res, 200, "Bookmark removed successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Bookmark Hackathon API
 * Allows authenticated learners to save an active hackathon for later reference.
 * Verifies the target listing exists and prevents duplicate bookmark rows for the same user.
 */
export const bookmarkHackathon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId } = req.params;

    const hackathon = await getActiveHackathonById(hackathonId);

    if (!hackathon) {
      return sendError(res, 404, "Hackathon not found");
    }

    const [existingBookmark] = await db.query(
      `SELECT id FROM bookmarks
       WHERE user_id = ?
       AND hackathon_id = ?`,
      [userId, hackathonId]
    );

    if (existingBookmark.length > 0) {
      return sendError(res, 400, "Already bookmarked");
    }

    await db.query(
      `INSERT INTO bookmarks (user_id, hackathon_id)
       VALUES (?, ?)`,
      [userId, hackathonId]
    );

    return sendSuccess(res, 201, "Hackathon bookmarked successfully");
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Get My Bookmarks API
 * Returns the authenticated user's saved hackathons in reverse chronological order.
 * Joins bookmarks with hackathons so the client receives listing details directly.
 * Soft-deleted hackathons are excluded to avoid surfacing removed content in saved lists.
 */
export const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookmarks] = await db.query(
      `SELECT
         bookmarks.id AS bookmark_id,
         hackathons.*
       FROM bookmarks
       JOIN hackathons ON bookmarks.hackathon_id = hackathons.id
       WHERE bookmarks.user_id = ?
       AND hackathons.deleted_at IS NULL
       ORDER BY bookmarks.created_at DESC`,
      [userId]
    );

    return sendSuccess(res, 200, "Bookmarks fetched successfully", bookmarks);
  } catch (error) {
    return sendServerError(res, error);
  }
};
