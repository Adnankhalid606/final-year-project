import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * Authentication route group
 * Exposes public registration and login endpoints that issue JWTs for later protected access.
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
