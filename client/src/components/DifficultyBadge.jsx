import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const DifficultyBadge = ({ difficulty, className }) => {
  const styles = {
    easy: 'text-violet-400 border-violet-500/20 bg-violet-500/10',
    medium: 'text-zinc-300 border-zinc-700 bg-zinc-800',
    hard: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-sm border px-3 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em]',
        styles[difficulty.toLowerCase()] || 'text-zinc-500 border-zinc-800 bg-zinc-900',
        className
      )}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
