const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true          
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 3000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Session', sessionSchema)
