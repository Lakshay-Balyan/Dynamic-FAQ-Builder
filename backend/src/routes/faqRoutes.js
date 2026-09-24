// src/routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { verifyToken, isEditorOrAdmin } = require('../middleware/authMiddleware');

// All routes in this file are for the admin-facing FAQ Management Service 
// We apply the middleware to all of them.

// @route   GET api/faqs
// @desc    Get all FAQs (for admin dashboard)
// @access  Private (Editor or Admin)
router.get('/', [verifyToken, isEditorOrAdmin], faqController.getAllFaqs);

// @route   POST api/faqs
// @desc    Create a new FAQ [cite: 138]
// @access  Private (Editor or Admin) [cite: 638]
router.post('/', [verifyToken, isEditorOrAdmin], faqController.createFaq);

// @route   PUT api/faqs/:id
// @desc    Update an existing FAQ
// @access  Private (Editor or Admin)
router.put('/:id', [verifyToken, isEditorOrAdmin], faqController.updateFaq);

// @route   DELETE api/faqs/:id
// @desc    Delete an FAQ
// @access  Private (Editor or Admin)
router.delete('/:id', [verifyToken, isEditorOrAdmin], faqController.deleteFaq);

// @route   POST api/faqs/categories
// @desc    Create a new category
// @access  Private (Editor or Admin)
router.post('/categories', [verifyToken, isEditorOrAdmin], faqController.createCategory);

// @route   GET api/faqs/categories
// @desc    Get all categories
// @access  Public (for both admin form and public search)
router.get('/categories', faqController.getCategories);

module.exports = router;