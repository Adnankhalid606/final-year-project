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
 * Returns a token immediately to support authenticated onboarding after signup.
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const [existing] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    return res.status(400).json({ message: "User exists" });
  }
  const allowedRoles = ["user", "organizer"];

  const selectedRole = allowedRoles.includes(role)
    ? role
    : "user";

  const account_status =
    selectedRole === "organizer"
      ? "pending"
      : "approved";
  const hashed = await bcrypt.hash(password, 10);

  const [result] = await db.execute(
    "INSERT INTO users (name, email, password, role, account_status) VALUES (?, ?, ?, ?, ?)",
    [
      name,
      email,
      hashed,
      selectedRole,
      account_status
    ]
  );

  res.json({
    id: result.insertId,
    token: generateToken(result.insertId),
  });
};

/**
 * Login API
 * Authenticates a user by email and password, then issues a JWT for protected routes.
 * Uses bcrypt comparison so stored password hashes remain the source of truth.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }
  if (
    user.role === "organizer" &&
    user.account_status !== "approved"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Organizer account pending admin approval",
    });
  }

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
};
