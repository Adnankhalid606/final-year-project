import db from "../config/db.js";

/**
 * Shared server error handler for admin controllers.
 * Centralizes logging and hides internal details from API consumers.
 */
const sendServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ success: false, message: "Server Error" });
};

/**
 * Get all pending organizer requests
 * Admin can review organizer applications before granting access.
 */
export const getPendingOrganizers = async (req, res) => {
  try {
    const [organizers] = await db.query(`
      SELECT
        id,
        name,
        email,
        role,
        account_status,
        created_at
      FROM users
      WHERE role = 'organizer'
      AND account_status = 'pending'
      AND deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Pending organizers fetched successfully",
      data: organizers,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Approve organizer request
 * Changes organizer account_status from pending to approved.
 */
export const approveOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      `SELECT id FROM users
       WHERE id = ?
       AND role = 'organizer'
       AND deleted_at IS NULL`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Organizer not found" });
    }

    await db.query(
      "UPDATE users SET account_status = 'approved' WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Organizer approved successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Reject organizer request
 * Changes organizer account_status from pending to rejected.
 */
export const rejectOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      `SELECT id FROM users
       WHERE id = ?
       AND role = 'organizer'
       AND deleted_at IS NULL`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Organizer not found" });
    }

    await db.query(
      "UPDATE users SET account_status = 'rejected' WHERE id = ?",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Organizer rejected successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, email, role, account_status, created_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `)
    return res.status(200).json({ success: true, data: users })
  } catch (error) {
    return sendServerError(res, error)
  }
}

/**
 * Get all hackathons (admin view — includes soft-deleted)
 */
export const getAllHackathons = async (req, res) => {
  try {
    const [hackathons] = await db.query(`
      SELECT
        hackathons.*,
        users.name AS organizer_name
      FROM hackathons
      LEFT JOIN users ON hackathons.organizer_id = users.id
      WHERE hackathons.deleted_at IS NULL
      ORDER BY hackathons.created_at DESC
    `);
    return res.status(200).json({ success: true, data: hackathons });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Update hackathon status (admin only)
 * Allows admin to change status between upcoming, active, and completed.
 */
export const updateHackathonStatus = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["upcoming", "active", "completed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: upcoming, active, completed",
      });
    }

    const [rows] = await db.query(
      "SELECT id FROM hackathons WHERE id = ? AND deleted_at IS NULL",
      [hackathonId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }

    await db.query(
      "UPDATE hackathons SET status = ? WHERE id = ?",
      [status, hackathonId]
    );

    return res.status(200).json({
      success: true,
      message: "Hackathon status updated successfully",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Get all courses (admin view)
 * Returns every active course regardless of which admin created it.
 */
export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT
        courses.*,
        users.name AS created_by_name
      FROM courses
      LEFT JOIN users ON courses.created_by = users.id
      WHERE courses.deleted_at IS NULL
      ORDER BY courses.created_at DESC
    `);
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Get all articles for a course (admin view)
 * Returns every active article for the given course regardless of which admin created it.
 */
export const getAllArticlesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [articles] = await db.query(
      `SELECT
         articles.*,
         users.name AS created_by_name
       FROM articles
       LEFT JOIN users ON articles.created_by = users.id
       WHERE articles.course_id = ?
       AND articles.deleted_at IS NULL
       ORDER BY articles.\`order\` ASC`,
      [courseId]
    );
    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    return sendServerError(res, error);
  }
};

/**
 * Delete (soft delete) a user
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ? AND deleted_at IS NULL',
      [userId]
    )
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    await db.query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    )
    return res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    return sendServerError(res, error)
  }
}
