import mysql from "mysql";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  port: 4306,
  user: "Admin",
  password: "Password",
  database: "high_street_gym",
});

export default pool; // Export the pool
