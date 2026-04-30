import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const JobDescForm = ({ onSubmit, loading, error }) => {
  const [jobDescription, setJobDescription] = useState('');
  const MAX_CHARS = 3000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDescription.length < 50) return;
    onSubmit(jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <textarea
          className="w-full min-h-[250px] rounded-2xl bg-slate-900 border border-slate-800 p-5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all resize-none"
          placeholder="Paste the full job description here (Role, Requirements, Responsibilities...)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={loading}
          maxLength={MAX_CHARS}
        />
        
        <div className={`absolute bottom-4 right-4 text-xs ${
          jobDescription.length >= MAX_CHARS ? 'text-rose-500' : 'text-slate-500'
        }`}>
          {jobDescription.length} / {MAX_CHARS}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          <span className="text-primary-500 font-medium">Tip:</span> Paste the full description for highly tailored questions.
        </p>
        
        <button
          type="submit"
          disabled={loading || jobDescription.length < 50}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-primary-500/20"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Generating Questions...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Generate Questions</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default JobDescForm;
