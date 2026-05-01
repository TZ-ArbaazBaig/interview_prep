import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, ArrowRight, Filter, Sparkles } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import QuestionCard from '../components/QuestionCard';

const Practice = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await request({
          method: 'GET',
          url: `/sessions/${sessionId}`
        });
        setData(result);
      } catch (err) {}
    };
    fetchData();
  }, [sessionId, request]);

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
        <Link to="/" className="btn-chrome-secondary inline-flex">Return to Base</Link>
      </div>
    );
  }

  const filters = ['all', 'technical', 'behavioral', 'system-design'];
  const filteredQuestions = data.questions.filter(q => 
    filter === 'all' ? true : q.category === filter
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-silver-400 opacity-50 hover:text-violet-400 transition-colors">
            <ChevronLeft size={14} />
            Terminal Base
          </Link>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-black text-white tracking-tighter uppercase break-all line-clamp-3">
            {data.session.job_title}
          </h1>
          <p className="text-silver-400 max-w-2xl text-sm leading-relaxed font-medium tracking-wide">
            Neural mapping complete. 10 specialized interview segments identified. Review the tactical data before initiating the simulation.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/chat/${sessionId}`)}
            className="btn-chrome-secondary flex items-center justify-center gap-4 group px-8"
          >
            <Sparkles size={18} className="text-violet-500 group-hover:rotate-12 transition-transform" />
            <span>Chat with Dossier</span>
          </button>

          <button
            onClick={() => navigate(`/mock/${sessionId}`)}
            className="btn-chrome-primary flex items-center justify-center gap-4 group px-12"
          >
            <Play size={18} fill="currentColor" />
            <span>Initialize Simulation</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-12 flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-obsidian-800">
        <div className="flex items-center gap-3 text-silver-400/20 pr-6 border-r border-obsidian-800">
          <Filter size={16} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Sort Protocol</span>
        </div>
        <div className="flex gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
                filter === f
                  ? 'bg-violet-500/10 border-violet-500/50 text-violet-400 shadow-violet-glow'
                  : 'bg-obsidian-900/40 border-obsidian-800 text-silver-400/30 hover:border-obsidian-700 hover:text-silver-300'
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
    </div>
  );
};

export default Practice;
