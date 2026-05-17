import mysql from "mysql2/promise";

/**
 * Shared MySQL connection pool
 * Centralizes database access for all controllers and allows concurrent query reuse
 * without opening a new connection for every request.
 */
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // put your MySQL password here
  database: "weblearnx",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
