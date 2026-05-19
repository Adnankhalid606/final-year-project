import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

/**
 * Database connection config
 * - Development: connects to local XAMPP MySQL using .env values
 * - Production: connects to remote Aiven MySQL with SSL enabled
 */
const config = isProduction
  ? {
      // Remote — Aiven (or any cloud MySQL)
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  : {
      // Local — XAMPP
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "weblearnx",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

const db = mysql.createPool(config);

export default db;
