// src/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// @route   GET api/public/search
// @desc    Allows any user to search for FAQs [cite: 541-543]
// @access  Public
router.get('/search', faqController.searchFaqs);

// We can also move the public 'getCategories' route here
// @route   GET api/public/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', faqController.getCategories);

module.exports = router;