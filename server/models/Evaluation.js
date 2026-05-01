const mongoose = require('mongoose')

const evaluationSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  userAnswer: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  aiScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  aiFeedback: {
    type: String,
    required: true
  },
  betterAnswer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Evaluation', evaluationSchema)
