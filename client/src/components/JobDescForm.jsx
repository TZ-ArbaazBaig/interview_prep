import React, { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const JobDescForm = ({ onSubmit, loading, error }) => {
  const [jobDescription, setJobDescription] = useState(
    () => localStorage.getItem('draft_jd') || ''
  );
  const MAX_CHARS = 3000;

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
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="relative group">
        <textarea
          className="w-full min-h-[300px] rounded-lg bg-ink-800 border border-ink-700 p-8 text-parchment-100 placeholder:text-parchment-200/20 focus:outline-none focus:ring-1 focus:ring-copper-500/30 focus:border-copper-500/30 transition-all duration-700 resize-none shadow-inner"
          placeholder="Begin writing the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={loading}
          maxLength={MAX_CHARS}
        />
        
        <div className={`text-right text-[10px] uppercase tracking-widest mt-2 font-bold ${jobDescription.length > 2500 ? 'text-red-500' : 'text-parchment-200/20'}`}>
          {jobDescription.length} / {MAX_CHARS} VOLUME
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 rounded-md bg-red-950/20 border border-red-900/30 text-red-400 text-xs uppercase tracking-wider font-bold">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-ink-800">
        <p className="text-[11px] text-parchment-200/30 uppercase tracking-[0.2em] font-bold">
          <span className="text-copper-600">Protocol:</span> Provide full context for optimal AI mapping.
        </p>
        
        <button
          type="submit"
          disabled={loading || jobDescription.length < 50}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-md bg-copper-700 hover:bg-copper-600 disabled:bg-ink-800 disabled:text-ink-700 disabled:cursor-not-allowed text-parchment-50 font-black uppercase tracking-widest transition-all duration-500 shadow-[4px_4px_0px_0px_rgba(180,83,9,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Initialize Generation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default JobDescForm;
