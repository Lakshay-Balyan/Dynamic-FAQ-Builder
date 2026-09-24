// src/controllers/authController.js
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user (no change)
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (role !== 'Administrator' && role !== 'Editor') {
    return res.status(400).json({ message: 'Invalid role.' });
  }
  try {
    const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username already taken.' });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password_hash, role]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- UPDATED: Login ---
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- NEW: Send token in an HTTP-only cookie ---
    // This implements PRJ-SR-004
    res.cookie('token', token, {
      httpOnly: true,  // Prevents JS access (XSS)
      secure: process.env.NODE_ENV === 'production', // Use 'true' in production (HTTPS)
      sameSite: 'strict', // Mitigates CSRF
      maxAge: 3600000 // 1 hour
    });
    
    // Send user info (without token)
    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });

  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW: Logout ---
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) // Expire the cookie
  });
  res.json({ message: 'Logged out successfully' });
};

// --- NEW: Verify ---
// This endpoint lets the frontend check if the cookie is valid
exports.verify = (req, res) => {
  // The 'req.user' comes from the verifyToken middleware
  // If it exists, the token is valid.
  res.json(req.user);
};