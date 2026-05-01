const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Session = require('../models/Session');

/**
 * GET /api/questions/:sessionId
 * Get all questions for a specific session (ownership verified)
 */
router.get('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    // Verify session ownership
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found or access denied.' });
    }

    const questions = await Question.find({ sessionId }).sort({ orderIndex: 1 }).lean();
    
    // Add snake_case aliases
    const formatted = questions.map(q => ({
      ...q,
      id: q._id,
      question_text: q.questionText,
      order_index: q.orderIndex
    }));

    res.json({ questions: formatted });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

module.exports = router;
