require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || "mongodb+srv://arbaazbaig98:3CB3osIBUQIxJucx@interview-prep.yvhgxoj.mongodb.net/interviewprep";

// Define schemas
const sessionSchema = new mongoose.Schema({
  userId: String,
  jobTitle: String,
  jobDescription: String,
  createdAt: Date
});

const questionSchema = new mongoose.Schema({
  sessionId: mongoose.Schema.Types.ObjectId,
  questionText: String,
  difficulty: String,
  category: String,
  hint: String,
  orderIndex: Number
});

const evaluationSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  sessionId: mongoose.Schema.Types.ObjectId,
  userAnswer: String,
  aiScore: Number,
  aiFeedback: String,
  betterAnswer: String,
  createdAt: Date
});

const Session = mongoose.model('Session', sessionSchema);
const Question = mongoose.model('Question', questionSchema);
const Evaluation = mongoose.model('Evaluation', evaluationSchema);

async function check() {
  try {
    await mongoose.connect(uri);

    const userId = "user_3FJEbWxnuIIjWITEorWJ0K84cVi";

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

    console.log("SIMULATED API RESPONSE:");
    console.log(JSON.stringify({ sessions: sessionsWithCount }, null, 2));

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
