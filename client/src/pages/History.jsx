import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, BookOpen, ChevronRight, ArrowRight, ChevronLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const History = () => {
  const navigate = useNavigate();
  const { request, loading } = useApi();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await request({
          method: 'GET',
          url: '/sessions'
        });
        setSessions(data.sessions);
      } catch (err) {}
    };
    fetchHistory();
  }, [request]);

  const filteredSessions = sessions.filter(s => {
    if (filter === 'all') return true;
    const answered = s.answeredCount || 0;
    const total = s.questionCount || 0;
    if (filter === 'completed') return answered === total;
    if (filter === 'in-progress') return answered > 0 && answered < total;
    return true;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatus = (session) => {
    const answered = session.answeredCount || 0;
    const total = session.questionCount || 0;
    if (answered === 0) return { label: 'Start', color: 'border-parchment-200/20 text-parchment-200/40' };
    if (answered < total) return { label: 'Resume', color: 'border-copper-800 text-copper-400' };
    return { label: 'Completed', color: 'border-emerald-900/50 text-emerald-600' };
  };

  if (loading && !sessions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-parchment-200/30 hover:text-copper-500 transition-colors">
            <ChevronLeft size={14} />
            Return to Base
          </Link>
          <h1 className="text-4xl font-black text-parchment-50 font-serif italic">Archive</h1>
          <p className="text-parchment-200/40 text-[11px] uppercase tracking-[0.2em] font-bold max-w-xl">
            A chronological record of past simulations and intelligence gathering. Track your evolution through the dossier logs.
          </p>
        </div>
        
        <div className="flex bg-ink-800 p-1.5 rounded-lg border border-ink-700">
          {['all', 'in-progress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                filter === tab
                  ? 'bg-copper-700 text-parchment-50 shadow-inner'
                  : 'text-parchment-200/20 hover:text-parchment-100'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-32 rounded-lg bg-ink-800/10 border border-ink-800 border-dashed">
          <p className="text-[10px] font-black text-parchment-200/10 uppercase tracking-[0.4em]">No archives retrieved from this coordinate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                if (session.answeredCount === session.questionCount) {
                  navigate(`/results/${session.id}`);
                } else {
                  navigate(`/practice/${session.id}`);
                }
              }}
              className="group relative overflow-hidden rounded-lg bg-ink-800/40 border border-ink-800 p-10 hover:border-copper-900/40 hover:bg-ink-800 transition-all duration-700 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-copper-950/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-parchment-50 font-serif italic group-hover:text-copper-400 transition-colors">
                    {session.job_title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-parchment-200/20 uppercase tracking-widest">
                    <Calendar size={12} />
                    {formatDate(session.created_at)}
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-sm border text-[9px] font-black uppercase tracking-[0.2em] h-fit whitespace-nowrap ${getStatus(session).color}`}>
                  {getStatus(session).label}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-ink-700">
                <div className="flex justify-between items-center text-[10px] font-black text-parchment-200/20 uppercase tracking-widest mb-2">
                  <span>Dossier Depth</span>
                  <span className="text-parchment-100">{session.answeredCount} / {session.questionCount}</span>
                </div>
                <div className="h-1 w-full bg-ink-900 rounded-none border border-ink-800 overflow-hidden">
                  <div 
                    className="h-full bg-copper-700 transition-all duration-1000 group-hover:bg-copper-500" 
                    style={{ width: `${(session.answeredCount / (session.questionCount || 1)) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-copper-500 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                  <span>ACCESS ARCHIVE</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
