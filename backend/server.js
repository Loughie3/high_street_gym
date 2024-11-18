// server.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import pool from "./connection.js";
import { hashPassword } from "./hashPasswords.js";

const app = express();
const secretKey = process.env.JWT_SECRET || "AAA"; // Set up a strong secret in .env

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Middleware to verify the JWT and extract userId
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded); // Log the decoded token for debugging
    req.userId = decoded.userId; // Attach userId to request
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid token." });
  }
};

// Retrieve logged-in user data
app.get("/api/user", verifyToken, (req, res) => {
  const userId = req.userId;

  const query = `SELECT first_name, user_name FROM users WHERE user_id = ?`;
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(results[0]);
  });
});

// Fetch booked classes for the logged-in user
app.get("/api/bookedClasses", verifyToken, (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT 
      booking.booking_id,
      calendar.day,
      calendar.class_time,
      calendar.duration,
      calendar.fitness_level,
      classes.class_name,
      trainer.first_name AS trainer_first_name,
      trainer.last_name AS trainer_last_name
    FROM booking
    JOIN calendar ON booking.calendar_id = calendar.calendar_id
    JOIN classes ON calendar.class_id = classes.class_id
    JOIN trainer ON calendar.trainer_id = trainer.trainer_id
    WHERE booking.user_id = ?
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching booked classes:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});

/// Get Calendar info
app.get("/api/calendar", (req, res) => {
  const query = `
    SELECT 
      calendar.calendar_id,
      calendar.day,
      calendar.class_time,
      calendar.duration,
      calendar.fitness_level,
      classes.class_name,
      trainer.first_name AS trainer_first_name,
      trainer.last_name AS trainer_last_name
    FROM calendar
    JOIN classes ON calendar.class_id = classes.class_id
    JOIN trainer ON calendar.trainer_id = trainer.trainer_id
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// Endpoint to book a class
app.post("/api/bookClass", verifyToken, (req, res) => {
  const userId = req.userId; // Extracted from the verified token
  const { calendarId } = req.body; // The ID of the class to book

  if (!calendarId) {
    console.error("Class ID is required for booking.");
    return res.status(400).json({ error: "Class ID is required for booking" });
  }

  // Check if the user has already booked the class
  const checkQuery = `SELECT * FROM booking WHERE user_id = ? AND calendar_id = ?`;

  pool.query(checkQuery, [userId, calendarId], (err, results) => {
    if (err) {
      console.error("Error checking for existing booking:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length > 0) {
      // If a record is found, it means the user has already booked this class
      return res
        .status(409)
        .json({ error: "You have already booked this class" });
    }

    // Proceed to book the class if no existing booking is found
    const insertQuery = `INSERT INTO booking (user_id, calendar_id) VALUES (?, ?)`;

    pool.query(insertQuery, [userId, calendarId], (err, result) => {
      if (err) {
        console.error("Error executing booking query:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.status(201).json({
        message: "Class booked successfully",
        bookingId: result.insertId,
      });
    });
  });
});

// Get Blog Information
app.get("/api/blog", (req, res) => {
  const query = `
    SELECT blog.blog_id, blog.blog_data, blog.user_id, users.user_name
    FROM blog 
    JOIN users ON blog.user_id = users.user_id
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching blog:", err);
      res.status(500).json({ error: "Database query failed" });
      return;
    }
    res.json(results);
  });
});

// Endpoint to post a new comment to the `blog` table
app.post("/api/newComment", verifyToken, (req, res) => {
  const userId = req.userId;
  const { blog_data } = req.body;

  if (!blog_data) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const query = "INSERT INTO blog (blog_data, user_id) VALUES (?, ?)";
  pool.query(query, [blog_data, userId], (err, result) => {
    if (err) {
      console.error("Error posting comment:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(201).json({
      message: "Comment posted successfully",
      commentId: result.insertId,
    });
  });
});

// Delete a comment
app.delete("/api/deleteComment/:commentId", verifyToken, (req, res) => {
  const userId = req.userId; // Extracted from the verified token
  const commentId = req.params.commentId;

  // Check if the comment belongs to the user
  const checkQuery = "SELECT user_id FROM blog WHERE blog_id = ?";
  pool.query(checkQuery, [commentId], (err, results) => {
    if (err) {
      console.error("Error checking comment ownership:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (results[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    // Delete the comment if ownership is confirmed
    const deleteQuery = "DELETE FROM blog WHERE blog_id = ?";
    pool.query(deleteQuery, [commentId], (err) => {
      if (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.status(200).json({ message: "Comment deleted successfully" });
    });
  });
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE user_name = ?`;

  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }

    if (results.length === 0) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        res.status(500).send("Server error");
        return;
      }

      if (!isMatch) {
        res.status(401).send("Invalid credentials");
        return;
      }

      const token = jwt.sign(
        { userId: user.user_id, role: user.user_role }, // Updated 'user'
        secretKey,
        { expiresIn: "1h" }
      );

      res.json({ token, role: user.user_role });
    });
  });
});

// Registration route
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, userName, userRole, password } = req.body;

  try {
    // Directly hash the password without checking if it's already hashed
    const hashedPassword = await hashPassword(password);

    const query =
      "INSERT INTO users (first_name, last_name, user_name, user_role, password) VALUES (?, ?, ?, ?, ?)";
    const values = [firstName, lastName, userName, userRole, hashedPassword];

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.status(201).json({ message: "User registered successfully" });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
