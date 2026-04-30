const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { generateQuestions } = require('../services/groq');

/**
 * POST /api/sessions
 * Generate questions from JD and save session
 */
router.post('/', async (req, res, next) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.length < 50) {
    return res.status(400).json({ error: 'Job description must be at least 50 characters.' });
  }

  // Basic check for highly repetitive text (gibberish prevention)
  const words = jobDescription.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (uniqueWords.size < 10 && words.length > 30) {
    return res.status(400).json({ error: 'This does not look like a valid job description (too repetitive).' });
  }

  if (jobDescription.length > 3000) {
    return res.status(400).json({ error: 'Job description must not exceed 3000 characters.' });
  }

  try {
    // 1. Generate questions via Groq
    const questionsData = await generateQuestions(jobDescription);

    // 2. Extract job title (heuristic: first line or first few words)
    const firstLine = jobDescription.split('\n')[0].trim();
    const jobTitle = firstLine.length < 100 ? firstLine : firstLine.substring(0, 97) + '...';

    // 3. Save session to DB
    const sessionInsert = db.prepare('INSERT INTO sessions (job_title, job_description) VALUES (?, ?)');
    const sessionResult = sessionInsert.run(jobTitle, jobDescription);
    const sessionId = sessionResult.lastInsertRowid;

    // 4. Save questions to DB
    const questionInsert = db.prepare(`
      INSERT INTO questions (session_id, question_text, difficulty, category, hint, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((questions) => {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        questionInsert.run(sessionId, q.question, q.difficulty, q.category, q.hint, i);
      }
    });

    transaction(questionsData);

    // 5. Fetch and return
    const questions = db.prepare('SELECT * FROM questions WHERE session_id = ? ORDER BY order_index ASC').all(sessionId);

    res.status(201).json({
      sessionId,
      jobTitle,
      questions
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions
 * Get all sessions with question counts
 */
router.get('/', (req, res, next) => {
  try {
    const sessions = db.prepare(`
      SELECT 
        s.*, 
        COUNT(q.id) as questionCount,
        (SELECT COUNT(*) FROM evaluations e JOIN questions q2 ON e.question_id = q2.id WHERE q2.session_id = s.id) as answeredCount
      FROM sessions s
      LEFT JOIN questions q ON s.id = q.session_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `).all();

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions/:id
 * Get specific session and its questions
 */
router.get('/:id', (req, res, next) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const questions = db.prepare(`
      SELECT q.*, e.ai_score, e.ai_feedback, e.better_answer, e.user_answer
      FROM questions q
      LEFT JOIN evaluations e ON q.id = e.question_id
      WHERE q.session_id = ?
      ORDER BY q.order_index ASC
    `).all(req.params.id);

    res.json({
      session,
      questions
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sessions/:id/progress
 * Get progress stats for a session
 */
router.get('/:id/progress', (req, res, next) => {
  try {
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM questions WHERE session_id = ?) as total,
        (SELECT COUNT(*) FROM evaluations e JOIN questions q ON e.question_id = q.id WHERE q.session_id = ?) as answered
    `).get(req.params.id, req.params.id);

    const total = stats.total || 0;
    const answered = stats.answered || 0;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    res.json({ total, answered, percentage });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
