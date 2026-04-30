const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

/**
 * GET /api/questions/:sessionId
 * This is a secondary route, primary data is fetched via /sessions/:id
 */
router.get('/:sessionId', (req, res, next) => {
  try {
    const questions = db.prepare('SELECT * FROM questions WHERE session_id = ? ORDER BY order_index ASC').all(req.params.sessionId);
    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
