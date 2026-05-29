import dotenv from "dotenv";
dotenv.config(); // Must be first — loads env vars before any module reads process.env

import express from "express";
import cors from "cors";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import cheatsheetRoutes from "./routes/cheatsheetRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

const app = express();

/**
 * Global middleware stack
 * Parses JSON request bodies and enables CORS for frontend-to-backend communication.
 */
app.use(express.json());
app.use(cors());

/**
 * Route registration
 * All route groups are registered together before the server starts listening.
 */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/cheatsheets", cheatsheetRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/admin", adminRoutes);

/**
 * Protected smoke-test route
 * Confirms JWT middleware is attaching the authenticated user correctly.
 */
app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

/**
 * Public health route
 * Lightweight endpoint for confirming the API process is running.
 */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/**
 * Startup database connectivity check
 * Verifies the MySQL pool can execute queries when the server boots.
 */
const testDB = async () => {
  try {
    await db.execute("SELECT 1");
    console.log("MySQL Connected \u2705");
  } catch (err) {
    console.error("DB Error \u274C", err);
  }
};

testDB();

const PORT = process.env.PORT || 5000;

/**
 * Application entry point
 * Starts the Express server after middleware, routes, and database checks are configured.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
