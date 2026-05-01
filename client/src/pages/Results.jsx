import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Trophy, 
  Target, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.get(`/sessions/${sessionId}`);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-rose-500 mb-6 font-bold uppercase tracking-widest">{error || 'Session not found'}</p>
        <Link to="/" className="btn-chrome-secondary inline-flex">Return Home</Link>
      </div>
    );
  }

  const evaluationsWithScores = data.questions.filter(q => q.ai_score !== null);
  const averageScore = evaluationsWithScores.length > 0
    ? (evaluationsWithScores.reduce((acc, q) => acc + q.ai_score, 0) / evaluationsWithScores.length).toFixed(1)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-violet-400';
    return 'text-rose-400';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 space-y-8">
        <Link to="/history" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-silver-500 hover:text-violet-400 transition-colors">
          <ChevronLeft size={16} />
          Back to History
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h1 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">Your Results</h1>
            <p className="text-silver-400 text-xs sm:text-sm font-bold uppercase tracking-widest mt-4 break-all line-clamp-2">{data.session.job_title}</p>
          </div>
          <div className="flex items-center gap-6 p-8 chrome-card shadow-violet-glow-lg bg-obsidian-900">
            <div className="p-4 rounded-md bg-violet-500/10 text-violet-500">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-silver-400 uppercase tracking-widest mb-1 opacity-50">Average Score</p>
              <p className={`text-6xl font-display font-black ${getScoreColor(averageScore)}`}>{averageScore} <span className="text-sm font-mono font-bold text-silver-400/20 not-italic">/ 10</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 chrome-card space-y-4 bg-obsidian-900/40">
          <div className="text-violet-500/40"><Target size={24} /></div>
          <p className="text-4xl font-display font-black text-white">{evaluationsWithScores.length} <span className="text-xs font-mono font-bold text-silver-400/20">/ {data.questions.length}</span></p>
          <p className="text-xs font-mono font-bold text-silver-400 uppercase tracking-widest opacity-60">Answered Questions</p>
        </div>
        <div className="p-8 chrome-card space-y-4 bg-obsidian-900/40">
          <div className="text-emerald-500/40"><Award size={24} /></div>
          <p className="text-4xl font-display font-black text-white">{data.questions.filter(q => q.ai_score >= 8).length}</p>
          <p className="text-xs font-mono font-bold text-silver-400 uppercase tracking-widest opacity-60">Strong Answers</p>
        </div>
        <div className="p-8 chrome-card space-y-4 bg-obsidian-900/40">
          <div className="text-rose-500/40"><BarChart3 size={24} /></div>
          <p className="text-4xl font-display font-black text-white">{data.questions.filter(q => q.ai_score < 5 && q.ai_score !== null).length}</p>
          <p className="text-xs font-mono font-bold text-silver-400 uppercase tracking-widest opacity-60">Needs Work</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <h2 className="text-xs font-mono font-bold text-silver-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-obsidian-800" />
        Detailed Breakdown
        <div className="h-px flex-1 bg-obsidian-800" />
      </h2>
      
      <div className="space-y-8">
        {data.questions.map((q, i) => (
          <div key={q.id} className="chrome-card overflow-hidden bg-obsidian-900/40">
            <div className="p-8 flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/5 px-3 py-1 rounded-sm border border-violet-500/20 uppercase tracking-widest">Question {i+1}</span>
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">{q.question_text}</h3>
                </div>
                
                {q.ai_score !== null ? (
                  <div className="space-y-4 pl-6 border-l-2 border-obsidian-700">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono font-bold uppercase tracking-widest ${getScoreColor(q.ai_score)}`}>Score: {q.ai_score}/10</span>
                    </div>
                    <p className="text-silver-200 italic leading-relaxed font-medium text-lg">"{q.ai_feedback}"</p>
                  </div>
                ) : (
                  <p className="text-xs font-mono font-bold text-silver-500 uppercase tracking-widest italic opacity-30">Skipped during session.</p>
                )}
              </div>
              
              {q.ai_score !== null && (
                <div className="md:w-48 flex items-center justify-end">
                   <button 
                    onClick={() => navigate(`/mock/${sessionId}`)}
                    className="text-xs font-mono font-bold text-violet-500 hover:text-violet-400 flex items-center gap-2 transition-colors uppercase tracking-widest"
                   >
                     Retry <ArrowRight size={16} />
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="btn-chrome-primary px-16 text-sm"
        >
          Start New Practice
        </button>
      </div>
    </div>
  );
};

export default Results;
