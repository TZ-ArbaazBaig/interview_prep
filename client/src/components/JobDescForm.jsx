import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const JobDescForm = ({ onSubmit, loading, error }) => {
  const [jobDescription, setJobDescription] = useState(
    () => localStorage.getItem('draft_jd') || ''
  );
  
  const charCount = jobDescription.length;

  useEffect(() => {
    localStorage.setItem('draft_jd', jobDescription);
  }, [jobDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDescription.length < 50) return;
    localStorage.removeItem('draft_jd');
    onSubmit(jobDescription);
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <textarea
          className="w-full min-h-[250px] rounded-lg bg-obsidian-950 border border-obsidian-700 p-8 text-silver-100 placeholder:text-silver-400/40 text-base focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all duration-700 resize-none shadow-inner"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={loading}
        />
        <div className={`absolute bottom-6 right-8 text-xs font-mono font-bold uppercase tracking-wider ${charCount > 2500 ? 'text-rose-500' : 'text-silver-400/40'}`}>
          {charCount} / 3000 Characters
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-400 text-sm font-bold uppercase tracking-wider">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading || charCount < 50}
          className="btn-chrome-primary flex items-center gap-4 group min-w-[320px] justify-center text-sm"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Start Practice Session</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobDescForm;
