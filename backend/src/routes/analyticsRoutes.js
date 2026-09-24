// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, isEditorOrAdmin } = require('../middleware/authMiddleware');

// --- Public Route ---
// Anyone can trigger a view count increment
// POST /api/analytics/view/:id
router.post('/view/:id', analyticsController.incrementFaqView);

// --- Admin Route ---
// Only admins/editors can see the analytics dashboard
// GET /api/analytics/dashboard
router.get(
  '/dashboard',
  [verifyToken, isEditorOrAdmin],
  analyticsController.getAnalytics
);

module.exports = router;