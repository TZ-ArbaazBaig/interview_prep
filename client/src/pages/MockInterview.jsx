import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  FastForward,
  Zap
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import DifficultyBadge from '../components/DifficultyBadge';

const MockInterview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useApi();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [skippedCount, setSkippedCount] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        
        const unansweredIndex = data.questions.findIndex(q => q.ai_score === null);
        setQuestions(data.questions);
        setCurrentIndex(unansweredIndex === -1 ? 0 : unansweredIndex);
        
        const skipped = data.questions.filter(q => q.ai_score === null && data.questions.indexOf(q) < unansweredIndex).length;
        setSkippedCount(skipped);
      } catch (err) {}
    };
    fetchQuestions();
  }, [sessionId, request]);

  const handleSubmit = async () => {
    if (answer.length < 10) {
      setError('Answer must be at least 10 characters long.');
      return;
    }

    setError(null);
    try {
      const result = await request({
        method: 'POST',
        url: '/evaluate',
        data: {
          questionId: questions[currentIndex].id,
          userAnswer: answer,
          questionText: questions[currentIndex].question_text || questions[currentIndex].questionText
        }
      });
      setEvaluation(result);
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setEvaluation(null);
      setShowModelAnswer(false);
    } else {
      navigate(`/results/${sessionId}`);
    }
  };

  const handleSkip = () => {
    setSkippedCount(prev => prev + 1);
    handleNext();
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]';
    if (score >= 5) return 'text-violet-400 drop-shadow-[0_0_8px_rgba(143,0,255,0.3)]';
    return 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]';
  };

  if (loading && !questions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-16">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        {skippedCount > 0 && (
          <p className="text-violet-500 text-xs font-mono font-bold uppercase tracking-widest mt-4">
            {skippedCount} Questions Skipped
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Question Section */}
          <div className="chrome-card p-10 rounded-lg">
            <div className="flex items-center gap-4 mb-6">
              <DifficultyBadge difficulty={currentQuestion?.difficulty || 'medium'} />
              <span className="text-xs font-mono font-bold text-silver-400 opacity-60 uppercase tracking-widest">
                {currentQuestion?.category.replace('-', ' ')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
              {currentQuestion?.question_text}
            </h2>
          </div>

          {!evaluation ? (
            /* Answer Section */
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  className="w-full min-h-[300px] rounded-lg bg-obsidian-950 border border-obsidian-800 p-8 text-silver-100 placeholder:text-silver-400/20 text-lg focus:outline-none focus:ring-1 focus:ring-violet-500/20 focus:border-violet-500/20 transition-all duration-700 resize-none shadow-inner"
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute bottom-6 right-8 text-xs font-mono font-bold uppercase tracking-widest text-silver-400/20">
                  {answer.length} Characters
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-5 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-400 text-sm font-bold uppercase tracking-wider">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-6 pt-4">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest text-silver-500 hover:text-violet-400 transition-all"
                >
                  <FastForward size={16} />
                  <span>Skip Question</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading || answer.length < 10}
                  className="btn-chrome-primary flex items-center gap-3 px-12 text-sm"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Send size={20} />}
                  <span>{loading ? 'Analyzing...' : 'Submit Answer'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Results Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 chrome-card flex flex-col items-center justify-center p-8 bg-obsidian-900 shadow-violet-glow">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest mb-4 opacity-40">Your Score</span>
                  <span className={`text-6xl font-display font-black italic ${getScoreColor(evaluation.score)}`}>{evaluation.score}</span>
                  <span className="text-xs font-mono font-bold text-silver-400/20 mt-2">/ 10</span>
                </div>
                
                <div className="md:col-span-3 chrome-card p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-violet-400 mb-4">
                    <CheckCircle2 size={20} />
                    <h4 className="font-mono font-bold uppercase tracking-widest text-xs">AI Feedback</h4>
                  </div>
                  <p className="text-silver-100 leading-relaxed font-medium text-xl italic">
                    "{evaluation.feedback}"
                  </p>
                </div>
              </div>

              {/* Model Answer Accordion */}
              <div className="chrome-card overflow-hidden bg-obsidian-900/40">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="w-full flex items-center justify-between p-6 hover:bg-obsidian-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-sm bg-violet-500/10 text-violet-400">
                      <Zap size={18} />
                    </div>
                    <span className="font-mono font-bold uppercase tracking-widest text-xs text-silver-200">View Model Answer</span>
                  </div>
                  {showModelAnswer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {showModelAnswer && (
                  <div className="p-8 border-t border-obsidian-800 bg-obsidian-950 text-silver-300 leading-relaxed whitespace-pre-wrap animate-in font-medium tracking-wide text-lg">
                    {evaluation.betterAnswer}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleNext}
                  className="btn-chrome-secondary flex items-center gap-3 px-12 group text-sm"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Finish Session' : 'Next Question'}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-violet-500" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
