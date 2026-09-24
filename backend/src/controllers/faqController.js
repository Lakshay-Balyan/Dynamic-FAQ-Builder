// src/controllers/faqController.js
const db = require('../models/db');
// Import the logSearch function
const { logSearch } = require('./analyticsController');

// Create a new FAQ
// Implements requirement FAQ-F-010 [cite: 641]
exports.createFaq = async (req, res) => {
  const { question, answer, category_id } = req.body;
  const created_by = req.user.id; // From authMiddleware

  if (!question || !answer || !category_id) {
    return res.status(400).json({ message: 'Question, answer, and category are required.' });
  }

  try {
    // Use parameterized query to prevent SQL Injection (PRJ-SR-003) [cite: 666]
    const newFaq = await db.query(
      'INSERT INTO faqs (question, answer, category_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [question, answer, category_id, created_by]
    );

    // This response matches your SAD specification [cite: 140]
    res.status(201).json({ 
      faqId: newFaq.rows[0].id, 
      status: "success", 
      data: newFaq.rows[0] 
    });
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing FAQ
// Implements requirement FAQ-F-012 [cite: 641]
exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, category_id } = req.body;

  try {
    const updatedFaq = await db.query(
      'UPDATE faqs SET question = $1, answer = $2, category_id = $3, last_updated_at = NOW() WHERE id = $4 RETURNING *',
      [question, answer, category_id, id]
    );

    if (updatedFaq.rows.length === 0) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    res.json(updatedFaq.rows[0]);
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an FAQ
// Implements requirement FAQ-F-013 [cite: 642]
exports.deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteOp = await db.query('DELETE FROM faqs WHERE id = $1 RETURNING id', [id]);

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    res.json({ message: `FAQ with id ${id} deleted successfully.` });
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// --- Category Management (Implements FAQ-F-014) ---

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  try {
    const newCategory = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories.rows);
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Get all FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const allFaqs = await db.query(
      `SELECT f.id, f.question, f.answer, c.name AS category_name 
       FROM faqs f
       LEFT JOIN categories c ON f.category_id = c.id
       ORDER BY f.last_updated_at DESC`
    );
    res.json(allFaqs.rows);
  } catch (err)
 {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// --- Public Search Service---
exports.searchFaqs = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // This is the full, correct query.
    // It uses 'simple' to find "How" and avoids the ".." error.
    const query = `
      SELECT 
        f.id, 
        f.question, 
        f.answer, 
        c.name AS category_name,
        ts_rank(
          to_tsvector('simple', f.question || ' ' || f.answer), 
          websearch_to_tsquery('simple', $1)
        ) AS rank
      FROM faqs f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE 
        to_tsvector('simple', f.question || ' ' || f.answer) @@ 
        websearch_to_tsquery('simple', $1)
      ORDER BY rank DESC;
    `;

    const results = await db.query(query, [q]);

    // Log the search
    logSearch(q, results.rows.length);

    res.json(results.rows);
    
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('Server Error');
  }
};