import jwt from "jsonwebtoken";
import db from "../config/db.js";

/**
 * Standardize authentication failure responses.
 * Keeps JWT and access-denied messages consistent across protected endpoints.
 */
const sendAuthError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Authentication middleware
 * Verifies the Bearer token, decodes the JWT payload, and loads the current user from the database.
 * Requests with missing, invalid, or stale tokens are blocked before reaching business logic.
 * The database lookup ensures route handlers receive current role and identity data.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendAuthError(res, 401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return sendAuthError(res, 401, "Not authorized");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error(error);
    return sendAuthError(res, 401, "Not authorized");
  }
};

/**
 * Admin-only authorization middleware
 * Used by content-management APIs where only administrators are allowed to create records.
 */
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return sendAuthError(res, 403, "Admin only");
};
