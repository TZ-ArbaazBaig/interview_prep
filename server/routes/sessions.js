const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Question = require('../models/Question');
const Evaluation = require('../models/Evaluation');
const { generateQuestions } = require('../services/groq');
const { storeJobDescription } = require('../services/pinecone');

/**
 * POST /api/sessions
 * Generate questions from JD and save to MongoDB + Pinecone
 */
router.post('/', async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.userId;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        error: 'Job description too short. Please paste the full JD.'
      });
    }

    if (jobDescription.length > 3000) {
      return res.status(400).json({
        error: 'Job description too long. Keep it under 3000 characters.'
      });
    }

    // 1. Generate questions via Groq
    const questionsData = await generateQuestions(jobDescription);

    // 2. Extract job title — use first non-empty line, fallback to 'Untitled Position'
    const firstNonEmptyLine = jobDescription
      .split('\n')
      .map(l => l.trim())
      .find(l => l.length > 0) || 'Untitled Position';
    const jobTitle = firstNonEmptyLine.length < 100
      ? firstNonEmptyLine
      : firstNonEmptyLine.substring(0, 97) + '...';

    // 3. Save session to MongoDB WITH userId
    const session = await Session.create({
      userId,
      jobTitle,
      jobDescription: jobDescription.trim()
    });

    // 4. Save questions to MongoDB
    const questionDocs = await Question.insertMany(
      questionsData.map((q, index) => ({
        sessionId: session._id,
        questionText: q.question,
        difficulty: q.difficulty,
        category: q.category,
        hint: q.hint,
        orderIndex: index
      }))
    );

    // 5. Store JD in local store (replaces Pinecone) for RAG WITH userId
    await storeJobDescription(session._id, jobDescription, userId).catch(e => 
      console.error('Store JD Error:', e)
    );

    res.status(201).json({
      sessionId: session._id,
      jobTitle: session.jobTitle,
      questions: questionDocs
    });

  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({
      error: 'Failed to generate questions. Please try again.'
    });
  }
});

/**
 * GET /api/sessions
 * Get all sessions for THIS user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get question count, answered count, and overall score for each session
    const sessionsWithCount = await Promise.all(
      sessions.map(async (session) => {
        const questionCount = await Question.countDocuments({
          sessionId: session._id
        });
        const evaluations = await Evaluation.find({
          sessionId: session._id
        }).lean();
        
        const answeredCount = evaluations.length;
        const overallScore = answeredCount > 0
          ? (evaluations.reduce((sum, e) => sum + e.aiScore, 0) / answeredCount)
          : null;
        
        return { 
          ...session, 
          id: session._id,
          // snake_case aliases for frontend compatibility
          job_title: session.jobTitle,
          created_at: session.createdAt,
          questionCount, 
          answeredCount,
          overallScore,
          overall_score: overallScore
        };
      })
    );

    res.json({ sessions: sessionsWithCount });

  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

/**
 * GET /api/sessions/:id
 * Get specific session (if owned by user) and its questions
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.userId;

    const session = await Session.findOne({ 
      _id: req.params.id,
      userId 
    }).lean();

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const questions = await Question.find({ sessionId: session._id })
      .sort({ orderIndex: 1 })
      .lean();

    // Join with evaluations
    const questionsWithEvals = await Promise.all(
      questions.map(async (q) => {
        const evaluation = await Evaluation.findOne({ questionId: q._id }).lean();
        return {
          ...q,
          id: q._id,
          // snake_case aliases for frontend compatibility
          question_text: q.questionText,
          order_index: q.orderIndex,
          ai_score: evaluation ? evaluation.aiScore : null,
          ai_feedback: evaluation ? evaluation.aiFeedback : null,
          better_answer: evaluation ? evaluation.betterAnswer : null,
          user_answer: evaluation ? evaluation.userAnswer : null
        };
      })
    );

    const evaluations = await Evaluation.find({ sessionId: session._id }).lean();
    const overallScore = evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + e.aiScore, 0) / evaluations.length)
      : null;

    res.json({ 
      session: { 
        ...session, 
        id: session._id, 
        job_title: session.jobTitle, 
        job_description: session.jobDescription, 
        created_at: session.createdAt,
        overallScore,
        overall_score: overallScore
      }, 
      questions: questionsWithEvals 
    });

  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
});

/**
 * GET /api/sessions/:id/progress
 */
router.get('/:id/progress', async (req, res) => {
  try {
    const total = await Question.countDocuments({ sessionId: req.params.id });
    const answered = await Evaluation.countDocuments({ sessionId: req.params.id });

    res.json({
      total,
      answered,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

module.exports = router;
