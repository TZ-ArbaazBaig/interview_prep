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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-primary-400 transition-colors">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-50">{data.session.job_title}</h1>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            We've generated 10 tailored questions for this role. Review them below and start a mock interview when you're ready.
          </p>
        </div>
        
        <button
          onClick={() => navigate(`/mock/${sessionId}`)}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 group"
        >
          <Play size={20} fill="currentColor" />
          <span>Start Mock Interview</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 text-slate-400 pr-2 border-r border-slate-800">
          <Filter size={18} />
          <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
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
