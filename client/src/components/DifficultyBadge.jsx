import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const DifficultyBadge = ({ difficulty, className }) => {
  const styles = {
    easy: 'text-emerald-500/50 border-emerald-900/20 bg-emerald-950/10',
    medium: 'text-copper-500/50 border-copper-900/20 bg-copper-950/10',
    hard: 'text-red-500/50 border-red-900/20 bg-red-950/10',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-sm border px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]',
        styles[difficulty.toLowerCase()] || 'text-parchment-200/20 border-ink-700 bg-ink-800',
        className
      )}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
