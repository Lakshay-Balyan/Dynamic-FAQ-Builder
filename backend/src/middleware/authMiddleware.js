// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- UPDATED: verifyToken ---
// Now reads from 'req.cookies'
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
}

// ... (isAdmin and isEditorOrAdmin are unchanged) ...

function isAdmin(req, res, next) {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Access denied. Administrator role required.' });
  }
  next();
}

function isEditorOrAdmin(req, res, next) {
  if (req.user.role !== 'Editor' && req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Access denied. Editor or Admin role required.' });
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin,
  isEditorOrAdmin,
};