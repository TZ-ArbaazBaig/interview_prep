const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design'],
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  orderIndex: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Question', questionSchema)
