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
  const [skippedCount, setSkippedCount] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        setQuestions(data.questions);

        // Auto-resume: Find the first question that hasn't been answered yet
        const firstUnansweredIndex = data.questions.findIndex(q => q.ai_score === null);
        if (firstUnansweredIndex !== -1) {
          setCurrentIndex(firstUnansweredIndex);
        } else if (data.questions.length > 0) {
          // If all are answered, start from last or go to results
          setCurrentIndex(data.questions.length - 1);
        }
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
      navigate(`/results/${sessionId}`);
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
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-16">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        {skippedCount > 0 && (
          <p className="text-copper-500 text-[10px] uppercase tracking-widest mt-4 font-black">{skippedCount} focus points bypassed</p>
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
          <div className="rounded-lg bg-ink-800 border border-ink-700 p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <DifficultyBadge difficulty={currentQuestion?.difficulty || 'medium'} />
              <span className="text-[10px] font-black text-parchment-200/20 uppercase tracking-[0.2em]">
                {currentQuestion?.category.replace('-', ' ')}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-parchment-100 leading-tight font-serif italic">
              "{currentQuestion?.question_text}"
            </h2>
          </div>

          {!evaluation ? (
            /* Answer Section */
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  className="w-full min-h-[300px] rounded-lg bg-ink-900 border border-ink-800 p-8 text-parchment-100 placeholder:text-parchment-200/10 focus:outline-none focus:ring-1 focus:ring-copper-500/20 focus:border-copper-500/20 transition-all duration-700 resize-none shadow-inner"
                  placeholder="Articulate your response with precision..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-widest text-parchment-200/10 font-bold">
                  {answer.length} Characters recorded
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-5 rounded-md bg-red-950/20 border border-red-900/30 text-red-400 text-xs uppercase tracking-wider font-bold">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-6 pt-4">
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-parchment-200/30 hover:text-copper-500 transition-all"
                >
                  <FastForward size={16} />
                  <span>Bypass</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading || answer.length < 10}
                  className="flex items-center gap-3 px-12 py-5 rounded-md bg-copper-700 hover:bg-copper-600 disabled:bg-ink-800 disabled:text-ink-700 disabled:cursor-not-allowed text-parchment-50 font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(180,83,9,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Send size={18} />}
                  <span>{loading ? 'Processing...' : 'Submit Response'}</span>
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
                <div className={`md:col-span-1 rounded-lg border flex flex-col items-center justify-center p-8 bg-ink-800 border-ink-700 shadow-xl`}>
                  <span className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-30">Calibration</span>
                  <span className={`text-6xl font-black font-serif italic ${getScoreColor(evaluation.score)}`}>{evaluation.score}</span>
                  <span className="text-[10px] font-bold text-parchment-200/20 mt-2">/ 10.0</span>
                </div>
                
                <div className="md:col-span-3 rounded-lg bg-ink-800 border border-ink-700 p-8 flex flex-col justify-center shadow-xl">
                  <div className="flex items-center gap-3 text-copper-500 mb-4">
                    <CheckCircle2 size={18} />
                    <h4 className="font-black uppercase tracking-widest text-[10px]">Strategic Feedback</h4>
                  </div>
                  <p className="text-parchment-100 leading-relaxed italic text-lg font-serif">
                    "{evaluation.feedback}"
                  </p>
                </div>
              </div>

              {/* Model Answer Accordion */}
              <div className="rounded-lg border border-ink-800 overflow-hidden bg-ink-800/30">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="w-full flex items-center justify-between p-6 hover:bg-ink-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-sm bg-copper-700/10 text-copper-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px] text-parchment-200">View Ideal Articulation</span>
                  </div>
                  {showModelAnswer ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {showModelAnswer && (
                  <div className="p-8 border-t border-ink-800 bg-ink-900/50 text-parchment-200/70 leading-relaxed whitespace-pre-wrap animate-in font-medium tracking-wide italic">
                    {evaluation.betterAnswer}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-3 px-12 py-5 rounded-md bg-parchment-50 text-ink-900 hover:bg-white font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  <span>{currentIndex === questions.length - 1 ? 'Finalize' : 'Next Segment'}</span>
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
