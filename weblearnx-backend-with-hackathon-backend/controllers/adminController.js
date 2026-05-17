import db from "../config/db.js";

/**
 * Get all pending organizer requests
 * Admin can review organizer applications
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

    res.status(200).json({
      success: true,
      message: "Pending organizers fetched successfully",
      data: organizers,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * Approve organizer request
 * Changes organizer account status from pending to approved
 */
export const approveOrganizer = async (req, res) => {
  try {

    const { userId } = req.params;

    const [users] = await db.query(
      `SELECT * FROM users
       WHERE id = ?
       AND role = 'organizer'
       AND deleted_at IS NULL`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found",
      });
    }

    await db.query(
      `UPDATE users
       SET account_status = 'approved'
       WHERE id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Organizer approved successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * Reject organizer request
 * Changes organizer account status from pending to rejected
 */
export const rejectOrganizer = async (req, res) => {
  try {

    const { userId } = req.params;

    const [users] = await db.query(
      `SELECT * FROM users
       WHERE id = ?
       AND role = 'organizer'
       AND deleted_at IS NULL`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found",
      });
    }

    await db.query(
      `UPDATE users
       SET account_status = 'rejected'
       WHERE id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Organizer rejected successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};