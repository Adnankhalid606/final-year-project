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
