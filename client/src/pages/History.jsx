import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, BookOpen, ChevronRight, ArrowRight, ChevronLeft, Search } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const History = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await api.get('/sessions');
        setSessions(data.sessions || []);
      } catch (err) {
        console.error('Fetch history error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    const answered = s.answeredCount || 0;
    const total = s.questionCount || 0;
    if (filter === 'completed') return answered === total;
    if (filter === 'in-progress') return answered > 0 && answered < total;
    return true;
  });

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

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
    if (answered === 0) return { label: 'New', color: 'text-violet-400 border-violet-500/20 bg-violet-500/5' };
    if (answered < total) return { label: 'In Progress', color: 'text-silver-300 border-obsidian-700 bg-obsidian-800' };
    return { label: 'Completed', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
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
      <div className="mb-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-silver-500 hover:text-violet-400 transition-colors">
              <ChevronLeft size={16} />
              Return Home
            </Link>
            <h1 className="text-5xl sm:text-7xl font-display font-black text-white uppercase tracking-tighter">Your History</h1>
            <p className="text-silver-400 text-base max-w-xl font-medium">
              Review your past practice sessions and track your improvement over time.
            </p>
          </div>
          
          <div className="flex bg-obsidian-900 p-1.5 rounded-md border border-obsidian-800">
            {['all', 'in-progress', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-widest transition-all duration-500 ${
                  filter === tab
                    ? 'bg-violet-500 text-white shadow-violet-glow'
                    : 'text-silver-500 hover:text-silver-200'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-silver-600 group-focus-within:text-violet-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by job title..."
            className="w-full pl-16 pr-6 py-5 rounded-lg bg-obsidian-900 border border-obsidian-800 text-silver-100 text-lg placeholder:text-silver-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all duration-500 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {paginatedSessions.length === 0 ? (
        <div className="text-center py-32 rounded-lg bg-obsidian-900/40 border border-obsidian-800 border-dashed">
          <p className="text-sm font-mono font-bold text-silver-600 uppercase tracking-widest">No matching sessions found in history.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
            {paginatedSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  if (session.answeredCount === session.questionCount) {
                    navigate(`/results/${session.id}`);
                  } else {
                    navigate(`/practice/${session.id}`);
                  }
                }}
                className="group chrome-card p-10 rounded-lg cursor-pointer bg-obsidian-900/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-tight break-all line-clamp-2">
                      {session.job_title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-mono font-bold text-silver-500 uppercase tracking-widest">
                      <Calendar size={14} />
                      {formatDate(session.created_at)}
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-widest h-fit whitespace-nowrap ${getStatus(session).color}`}>
                    {getStatus(session).label}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-obsidian-800">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-silver-500 uppercase tracking-widest mb-2">
                    <span>Progress</span>
                    <span className="text-silver-100">{session.answeredCount} / {session.questionCount} Questions</span>
                  </div>
                  <div className="h-2 w-full bg-obsidian-950 rounded-none border border-obsidian-800 overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 shadow-[0_0_8px_rgba(143,0,255,0.5)] transition-all duration-1000 group-hover:bg-violet-400" 
                      style={{ width: `${(session.answeredCount / (session.questionCount || 1)) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-violet-500 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                    <span>View Session</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-10 pt-10 border-t border-obsidian-800">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 rounded-md bg-obsidian-900 border border-obsidian-800 text-silver-600 hover:text-violet-500 disabled:opacity-10 disabled:hover:text-silver-600 transition-all duration-500"
              >
                <ChevronLeft size={28} />
              </button>
              
              <div className="flex items-center gap-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`text-sm font-mono font-bold uppercase tracking-widest transition-all duration-500 ${
                      currentPage === i + 1 ? 'text-violet-500 border-b-2 border-violet-500 pb-1' : 'text-silver-600 hover:text-silver-200'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-4 rounded-md bg-obsidian-900 border border-obsidian-800 text-silver-600 hover:text-violet-500 disabled:opacity-10 disabled:hover:text-silver-600 transition-all duration-500"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
