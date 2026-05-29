import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Generate a signed JWT for authenticated sessions.
 * The token stores only the user ID and is later resolved to a fresh database user record.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Register API
 * Creates a new user account after verifying email uniqueness.
 * Passwords are hashed before storage so raw credentials never reach the database.
 * Returns a 201 with a token immediately to support authenticated onboarding after signup.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Input validation
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const allowedRoles = ["user", "organizer"];
    const selectedRole = allowedRoles.includes(role) ? role : "user";
    const account_status = selectedRole === "organizer" ? "pending" : "approved";

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role, account_status) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.trim(), hashed, selectedRole, account_status]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      token: generateToken(result.insertId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Login API
 * Authenticates a user by email and password, then issues a JWT for protected routes.
 * Soft-deleted users are excluded. Pending organizers are blocked from logging in.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // Exclude soft-deleted users
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Block pending or rejected organizers
    if (user.role === "organizer" && user.account_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Organizer account pending admin approval",
      });
    }

    return res.status(200).json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
