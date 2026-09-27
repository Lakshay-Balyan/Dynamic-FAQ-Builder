// src/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');
const publicRoutes = require('./routes/publicRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// --- Middleware ---

// Configure CORS to allow credentials
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// --- NEW: Cookie Parser Middleware ---
app.use(cookieParser());

// --- API Routes ---
// Mount the routes
app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Dynamic FAQ Builder API is running...');
});

module.exports = app;
