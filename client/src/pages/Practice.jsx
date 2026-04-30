import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Play, Filter, ArrowRight } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const Practice = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        setData(result);
      } catch (err) {
        // Error handled by useApi
      }
    };
    fetchSession();
  }, [sessionId, request]);

  const filteredQuestions = useMemo(() => {
    if (!data) return [];
    if (filter === 'All') return data.questions;
    
    return data.questions.filter(q => 
      q.difficulty.toLowerCase() === filter.toLowerCase() || 
      q.category.toLowerCase() === filter.toLowerCase()
    );
  }, [data, filter]);

  const filters = ['All', 'Easy', 'Medium', 'Hard', 'Technical', 'Behavioral', 'System-Design'];

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || (!loading && !data)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Session Not Found</h2>
        <p className="text-slate-400 mb-8">{error || "We couldn't find the practice session you're looking for."}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-all">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-parchment-200/30 hover:text-copper-500 transition-colors">
            <ChevronLeft size={14} />
            Return to Base
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-parchment-50 font-serif italic leading-tight">
            {data.session.job_title}
          </h1>
          <p className="text-parchment-200/40 max-w-2xl text-sm leading-relaxed font-medium uppercase tracking-wider">
            Analysis complete. 10 specialized focus points generated. Review the dossier below before initiating the tactical simulation.
          </p>
        </div>
        
        <button
          onClick={() => navigate(`/mock/${sessionId}`)}
          className="flex items-center justify-center gap-4 px-10 py-5 rounded-md bg-emerald-800 hover:bg-emerald-700 text-parchment-50 font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(6,78,59,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] group"
        >
          <Play size={20} fill="currentColor" />
          <span>Tactical Entry</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-12 flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-ink-800">
        <div className="flex items-center gap-3 text-parchment-200/20 pr-6 border-r border-ink-800">
          <Filter size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Sort Protocol</span>
        </div>
        <div className="flex gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                filter === f
                  ? 'bg-copper-700 border-copper-600 text-parchment-50 shadow-inner'
                  : 'bg-ink-800/40 border-ink-700 text-parchment-200/20 hover:border-ink-600 hover:text-parchment-100'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      
      {filteredQuestions.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-500">No questions match the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Practice;
