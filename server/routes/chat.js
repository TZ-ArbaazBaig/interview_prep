const express = require('express')
const router = express.Router()
const { answerWithRAG } = require('../services/rag')
const Session = require('../models/Session')

// POST /api/chat/:sessionId
router.post('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { question } = req.body

    if (!question || question.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Question is too short. Please ask a specific question about the role.' 
      })
    }

    if (question.length > 500) {
      return res.status(400).json({ 
        error: 'Question exceeds character limit. Please keep it concise.' 
      })
    }

    // Check if session exists in MongoDB
    const session = await Session.findById(sessionId)

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' })
    }

    const result = await answerWithRAG(
      sessionId, 
      question.trim(), 
      session.jobTitle,
      session.jobDescription   // ← pass full JD so RAG can re-hydrate if memory was wiped
    )

    res.json({ 
      question: question.trim(),
      answer: result.answer,
      chunksUsed: result.chunksUsed
    })

  } catch (err) {
    console.error('Chat route error:', err)
    res.status(500).json({ 
      error: 'The intelligence system is temporarily unavailable. Please try again in a moment.' 
    })
  }
})

module.exports = router
