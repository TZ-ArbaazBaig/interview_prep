import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs font-medium text-slate-400">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% Complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-primary-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(14,165,233,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
