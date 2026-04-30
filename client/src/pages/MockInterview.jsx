import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Send, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import DifficultyBadge from '../components/DifficultyBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const MockInterview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        setQuestions(data.questions);
      } catch (err) {}
    };
    fetchQuestions();
  }, [sessionId, request]);

  const handleSubmit = async () => {
    if (!answer || answer.length < 10) return;

    try {
      const currentQuestion = questions[currentIndex];
      const result = await request({
        method: 'POST',
        url: '/evaluate',
        data: {
          questionId: currentQuestion.id,
          questionText: currentQuestion.question_text,
          userAnswer: answer
        }
      });
      setEvaluation(result);
    } catch (err) {}
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setEvaluation(null);
      setShowModelAnswer(false);
    } else {
      navigate('/history');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (score >= 5) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  if (!questions.length && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Question Section */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <DifficultyBadge difficulty={currentQuestion?.difficulty || 'medium'} />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {currentQuestion?.category.replace('-', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-50 leading-tight">
              {currentQuestion?.question_text}
            </h2>
          </div>

          {!evaluation ? (
            /* Answer Section */
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  className="w-full min-h-[250px] rounded-3xl bg-slate-950 border border-slate-800 p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all resize-none shadow-inner"
                  placeholder="Type your answer here... Be as detailed as possible."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute bottom-6 right-6 text-xs text-slate-600">
                  {answer.length} characters
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all font-medium"
                >
                  <FastForward size={18} />
                  <span>Skip</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading || answer.length < 10}
                  className="flex items-center gap-2 px-10 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-primary-500/25"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Send size={20} />}
                  <span>{loading ? 'Evaluating...' : 'Submit Answer'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Results Section */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`md:col-span-1 rounded-3xl border flex flex-col items-center justify-center p-6 ${getScoreColor(evaluation.score)}`}>
                  <span className="text-sm font-bold uppercase tracking-widest mb-1 opacity-70">Score</span>
                  <span className="text-5xl font-black">{evaluation.score}</span>
                  <span className="text-xs font-medium mt-1">/ 10</span>
                </div>
                
                <div className="md:col-span-3 rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-primary-400 mb-3">
                    <CheckCircle2 size={20} />
                    <h4 className="font-bold uppercase tracking-wider text-xs">AI Feedback</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">
                    "{evaluation.feedback}"
                  </p>
                </div>
              </div>

              {/* Model Answer Accordion */}
              <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/50">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="font-semibold text-slate-200">View Model Answer</span>
                  </div>
                  {showModelAnswer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {showModelAnswer && (
                  <div className="p-6 border-t border-slate-800 bg-slate-950/50 text-slate-300 leading-relaxed whitespace-pre-wrap animate-in slide-in-from-top-2">
                    {evaluation.betterAnswer}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-10 py-4 rounded-xl bg-slate-100 text-slate-950 hover:bg-white font-bold transition-all shadow-lg group"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
