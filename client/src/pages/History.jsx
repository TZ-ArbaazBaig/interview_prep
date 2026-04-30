import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, ChevronRight, Search, PlusCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';

const History = () => {
  const navigate = useNavigate();
  const { request, loading } = useApi();
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSessions = sessions.filter(s => 
    s.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && !sessions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Practice History</h1>
          <p className="text-slate-400">Review and resume your past preparation sessions.</p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-lg"
        >
          <PlusCircle size={18} />
          <span>New Session</span>
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          placeholder="Search by job title..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => navigate(`/practice/${session.id}`)}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-primary-500/50 hover:bg-slate-800/50 transition-all cursor-pointer shadow-lg hover:shadow-primary-500/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary-400 transition-colors">
                  {session.job_title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    {formatDate(session.created_at)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} />
                    {session.questionCount} Questions
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-primary-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Resume</span>
                <ChevronRight size={20} />
              </div>
            </div>
            
            {/* Selection indicator */}
            <div className="absolute left-0 top-0 h-full w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {filteredSessions.length === 0 && !loading && (
          <div className="text-center py-24 rounded-3xl bg-slate-900/20 border border-dashed border-slate-800">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">No sessions found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              {searchTerm ? `No results for "${searchTerm}"` : "You haven't started any practice sessions yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
