const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const Question = require('../models/Question');
const Session = require('../models/Session');
const { evaluateAnswer } = require('../services/groq');

/**
 * POST /api/evaluate
 * Evaluate user answer and save to MongoDB
 */
router.post('/', async (req, res) => {
  try {
    const { questionId, userAnswer, questionText } = req.body;
    const userId = req.userId;

    if (!userAnswer || userAnswer.trim().length < 10) {
      return res.status(400).json({
        error: 'Answer too short. Please write at least a sentence.'
      });
    }

    // 1. Get the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // 2. Verify user owns the session this question belongs to
    const session = await Session.findOne({
      _id: question.sessionId,
      userId
    });

    if (!session) {
      return res.status(403).json({ 
        error: 'You do not have access to this question.' 
      });
    }

    // 3. Check if already evaluated
    const existingEvaluation = await Evaluation.findOne({ questionId });
    if (existingEvaluation) {
      return res.json({
        score: existingEvaluation.aiScore,
        feedback: existingEvaluation.aiFeedback,
        betterAnswer: existingEvaluation.betterAnswer,
        alreadyEvaluated: true
      });
    }

    // 4. Generate AI evaluation
    const evaluation = await evaluateAnswer(questionText, userAnswer);

    // 5. Save to MongoDB
    const evaluationDoc = await Evaluation.create({
      questionId,
      sessionId: question.sessionId,
      userAnswer: userAnswer.trim(),
      aiScore: evaluation.score,
      aiFeedback: evaluation.feedback,
      betterAnswer: evaluation.betterAnswer
    });

    res.json({
      score: evaluation.score,
      feedback: evaluation.feedback,
      betterAnswer: evaluation.betterAnswer
    });

  } catch (err) {
    console.error('Evaluate error:', err);
    res.status(500).json({
      error: 'Failed to evaluate answer. Please try again.'
    });
  }
});

module.exports = router;
