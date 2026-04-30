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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <Link to="/history" className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary-400 transition-colors">
          <ChevronLeft size={16} />
          Back to History
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">Performance Summary</h1>
            <p className="text-slate-400">{data.session.job_title}</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Score</p>
              <p className={`text-2xl font-black ${getScoreColor(averageScore)}`}>{averageScore} <span className="text-sm font-medium text-slate-500">/ 10</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-primary-400 mb-2"><Target size={20} /></div>
          <p className="text-2xl font-bold text-slate-100">{evaluationsWithScores.length} / {data.questions.length}</p>
          <p className="text-sm text-slate-500">Questions Answered</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-emerald-400 mb-2"><Award size={20} /></div>
          <p className="text-2xl font-bold text-slate-100">{data.questions.filter(q => q.ai_score >= 8).length}</p>
          <p className="text-sm text-slate-500">Strong Answers (8+)</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-amber-400 mb-2"><BarChart3 size={20} /></div>
          <p className="text-2xl font-bold text-slate-100">{data.questions.filter(q => q.ai_score < 5 && q.ai_score !== null).length}</p>
          <p className="text-sm text-slate-500">Areas for Improvement</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-primary-500" size={22} />
        Detailed Breakdown
      </h2>
      
      <div className="space-y-6">
        {data.questions.map((q, i) => (
          <div key={q.id} className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-600 bg-slate-800 px-2 py-1 rounded">Q{i+1}</span>
                  <h3 className="font-bold text-slate-200">{q.question_text}</h3>
                </div>
                
                {q.ai_score !== null ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getScoreColor(q.ai_score)}`}>Score: {q.ai_score}/10</span>
                    </div>
                    <p className="text-sm text-slate-400 italic">"{q.ai_feedback}"</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Not answered during this session.</p>
                )}
              </div>
              
              {q.ai_score !== null && (
                <div className="md:w-48 flex items-center justify-end">
                   <button 
                    onClick={() => navigate(`/mock/${sessionId}`)} // Ideally would deep link to this specific question
                    className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
                   >
                     RE-ATTEMPT <ArrowRight size={14} />
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all shadow-lg"
        >
          Start New Preparation
        </button>
      </div>
    </div>
  );
};

export default Results;
