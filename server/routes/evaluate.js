const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { evaluateAnswer } = require('../services/groq');

/**
 * POST /api/evaluate
 * Evaluate a user's answer
 */
router.post('/', async (req, res, next) => {
  const { questionId, userAnswer, questionText } = req.body;

  if (!questionId || isNaN(parseInt(questionId))) {
    return res.status(400).json({ error: 'Valid questionId is required.' });
  }

  if (!userAnswer || userAnswer.length < 10) {
    return res.status(400).json({ error: 'Answer must be at least 10 characters.' });
  }

  if (userAnswer.length > 2000) {
    return res.status(400).json({ error: 'Answer must not exceed 2000 characters.' });
  }

  try {
    // 1. Check if evaluation already exists
    const existing = db.prepare('SELECT * FROM evaluations WHERE question_id = ?').get(questionId);
    
    // 2. Call AI to evaluate
    const evaluation = await evaluateAnswer(questionText, userAnswer);

    // 3. Save to DB
    if (existing) {
      db.prepare(`
        UPDATE evaluations 
        SET user_answer = ?, ai_score = ?, ai_feedback = ?, better_answer = ?
        WHERE question_id = ?
      `).run(userAnswer, evaluation.score, evaluation.feedback, evaluation.betterAnswer, questionId);
    } else {
      db.prepare(`
        INSERT INTO evaluations (question_id, user_answer, ai_score, ai_feedback, better_answer)
        VALUES (?, ?, ?, ?, ?)
      `).run(questionId, userAnswer, evaluation.score, evaluation.feedback, evaluation.betterAnswer);
    }

    res.json({
      score: evaluation.score,
      feedback: evaluation.feedback,
      betterAnswer: evaluation.betterAnswer
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
