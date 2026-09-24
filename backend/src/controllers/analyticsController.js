// src/controllers/analyticsController.js
const db = require('../models/db');

// --- Internal function to log a search query ---
// This is called by the searchFaqs controller
// Implements FAQ-F-041
exports.logSearch = async (searchTerm, resultsCount) => {
  try {
    await db.query(
      'INSERT INTO search_logs (search_term, results_count) VALUES ($1, $2)',
      [searchTerm, resultsCount]
    );
  } catch (err) {
    //console.error('Failed to log search:', err);
  }
};

// --- API Endpoint to increment FAQ view count ---
// This will be called by the frontend when a user views an FAQ
// Implements FAQ-F-040
exports.incrementFaqView = async (req, res) => {
  const { id } = req.params; // The ID of the FAQ
  try {
    // This "UPSERT" query will insert a new row or update the count
    const query = `
      INSERT INTO faq_views (faq_id, view_count)
      VALUES ($1, 1)
      ON CONFLICT (faq_id)
      DO UPDATE SET view_count = faq_views.view_count + 1
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    //console.error('Failed to increment view count:', err);
    res.status(500).send('Server Error');
  }
};

// --- API Endpoint for Admin Analytics Dashboard ---
// Gets the data for the dashboard
exports.getAnalytics = async (req, res) => {
  try {
    // Get Top 10 Searches (Implements FAQ-F-042)
    const topSearches = await db.query(`
      SELECT search_term, COUNT(search_term) AS frequency
      FROM search_logs
      GROUP BY search_term
      ORDER BY frequency DESC
      LIMIT 10;
    `);

    // Get Top 10 Zero-Result Searches (Implements FAQ-F-043)
    const zeroResults = await db.query(`
      SELECT search_term, COUNT(search_term) AS frequency
      FROM search_logs
      WHERE results_count = 0
      GROUP BY search_term
      ORDER BY frequency DESC
      LIMIT 10;
    `);
    
    // Get Top 10 Viewed FAQs (Implements FAQ-F-040)
    const topViews = await db.query(`
      SELECT f.question, v.view_count
      FROM faq_views v
      JOIN faqs f ON v.faq_id = f.id
      ORDER BY v.view_count DESC
      LIMIT 10;
    `);

    res.json({
      topSearches: topSearches.rows,
      zeroResults: zeroResults.rows,
      topViews: topViews.rows
    });

  } catch (err) {
    //console.error('Failed to get analytics:', err);
    res.status(500).send('Server Error');
  }
};