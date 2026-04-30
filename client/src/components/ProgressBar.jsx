import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-[10px] font-black text-parchment-200/20 uppercase tracking-[0.2em]">
        <span>Segment {current} / {total}</span>
        <span>{Math.round(percentage)}% Index</span>
      </div>
      <div className="h-1 w-full overflow-hidden bg-ink-800 rounded-none border border-ink-700">
        <div
          className="h-full bg-copper-700 transition-all duration-700 ease-out shadow-[2px_0_10px_rgba(180,83,9,0.2)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
