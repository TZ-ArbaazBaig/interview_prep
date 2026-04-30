import React from 'react';

const ProgressBar = ({ current, total }) => {
  const progress = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-mono font-bold text-silver-400 uppercase tracking-[0.3em]">
          Simulation Progress
        </span>
        <span className="text-xl font-display font-black text-white italic">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-obsidian-800 rounded-none border border-obsidian-700 overflow-hidden">
        <div 
          className="h-full bg-violet-500 shadow-[0_0_10px_rgba(143,0,255,0.5)] transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
