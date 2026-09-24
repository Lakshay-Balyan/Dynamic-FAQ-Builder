// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware

// ... (register and login routes are the same)
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- NEW: Logout Route ---
router.post('/logout', authController.logout);

// --- NEW: Verify Route ---
// This route is protected. If the token cookie is valid,
// it will return the user data. If not, it returns a 401.
router.get('/verify', verifyToken, authController.verify);

module.exports = router;