import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const DifficultyBadge = ({ difficulty, className }) => {
  const styles = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        styles[difficulty.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        className
      )}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
