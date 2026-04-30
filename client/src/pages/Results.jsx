import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Target, Award, ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const [data, setData] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sessionData = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        setData(sessionData);

        // Fetch evaluations for each question
        // In a real app, I'd have a single endpoint for this, 
        // but let's use the existing data if available or fetch
        // For simplicity, I'll update the server to include evaluations in /sessions/:id
      } catch (err) {}
    };
    fetchResults();
  }, [sessionId, request]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  // Calculate stats
  const evaluationsWithScores = data.questions.filter(q => q.ai_score !== null);
  const averageScore = evaluationsWithScores.length > 0
    ? (evaluationsWithScores.reduce((acc, q) => acc + q.ai_score, 0) / evaluationsWithScores.length).toFixed(1)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 space-y-6">
        <Link to="/history" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-parchment-200/30 hover:text-copper-500 transition-colors">
          <ChevronLeft size={14} />
          Session History
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h1 className="text-4xl font-black text-parchment-50 mb-3 font-serif italic">Performance Analysis</h1>
            <p className="text-parchment-200/40 text-[11px] uppercase tracking-[0.2em] font-bold">{data.session.job_title}</p>
          </div>
          <div className="flex items-center gap-6 p-8 rounded-lg bg-ink-800 border border-ink-700 shadow-2xl">
            <div className="p-4 rounded-md bg-copper-700/10 text-copper-500">
              <Trophy size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-parchment-200/20 uppercase tracking-[0.3em] mb-1">Average Calibration</p>
              <p className={`text-4xl font-black font-serif italic ${getScoreColor(averageScore)}`}>{averageScore} <span className="text-xs font-bold text-parchment-200/10 not-italic">/ 10.0</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 rounded-lg bg-ink-800/40 border border-ink-800 space-y-4">
          <div className="text-copper-500/30"><Target size={20} /></div>
          <p className="text-3xl font-black text-parchment-100 font-serif italic">{evaluationsWithScores.length} <span className="text-xs text-parchment-200/10">/ {data.questions.length}</span></p>
          <p className="text-[10px] text-parchment-200/20 uppercase tracking-widest font-black">Data Points Captured</p>
        </div>
        <div className="p-8 rounded-lg bg-ink-800/40 border border-ink-800 space-y-4">
          <div className="text-emerald-500/30"><Award size={20} /></div>
          <p className="text-3xl font-black text-parchment-100 font-serif italic">{data.questions.filter(q => q.ai_score >= 8).length}</p>
          <p className="text-[10px] text-parchment-200/20 uppercase tracking-widest font-black">Elite Articulations</p>
        </div>
        <div className="p-8 rounded-lg bg-ink-800/40 border border-ink-800 space-y-4">
          <div className="text-amber-500/30"><BarChart3 size={20} /></div>
          <p className="text-3xl font-black text-parchment-100 font-serif italic">{data.questions.filter(q => q.ai_score < 5 && q.ai_score !== null).length}</p>
          <p className="text-[10px] text-parchment-200/20 uppercase tracking-widest font-black">Vulnerabilities Identified</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <h2 className="text-[11px] font-black text-parchment-200/20 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
        <CheckCircle2 className="text-copper-700" size={16} />
        Dossier Breakdown
      </h2>
      
      <div className="space-y-8">
        {data.questions.map((q, i) => (
          <div key={q.id} className="rounded-lg bg-ink-800/20 border border-ink-800 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-copper-500 bg-copper-950/20 px-3 py-1 rounded-sm border border-copper-900/20 uppercase tracking-widest">SEG {i+1}</span>
                  <h3 className="text-lg font-bold text-parchment-100 font-serif italic">{q.question_text}</h3>
                </div>
                
                {q.ai_score !== null ? (
                  <div className="space-y-4 pl-4 border-l border-ink-700">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${getScoreColor(q.ai_score)}`}>Calibration: {q.ai_score}/10</span>
                    </div>
                    <p className="text-parchment-200/60 italic leading-relaxed font-medium">"{q.ai_feedback}"</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-parchment-200/10 uppercase tracking-widest font-bold italic">Bypassed during session.</p>
                )}
              </div>
              
              {q.ai_score !== null && (
                <div className="md:w-48 flex items-center justify-end">
                   <button 
                    onClick={() => navigate(`/mock/${sessionId}`)}
                    className="text-[10px] font-black text-copper-500 hover:text-copper-400 flex items-center gap-2 transition-colors uppercase tracking-widest"
                   >
                     RE-CALIBRATE <ArrowRight size={14} />
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
          className="px-12 py-5 rounded-md bg-copper-700 hover:bg-copper-600 text-parchment-50 font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(180,83,9,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Begin New Dossier
        </button>
      </div>
    </div>
  );
};

export default Results;
