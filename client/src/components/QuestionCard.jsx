import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Tag } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

const QuestionCard = ({ question }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-md bg-ink-800 border border-ink-700 p-8 transition-all duration-700 hover:border-copper-900/40 hover:shadow-2xl hover:shadow-copper-950/20">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="flex items-center gap-2 rounded-sm bg-ink-700 px-3 py-1 text-[10px] font-black text-parchment-200/40 border border-ink-600 uppercase tracking-widest">
          <Tag size={12} />
          {question.category.replace('-', ' ')}
        </span>
      </div>

      <h3 className="text-xl font-bold text-parchment-100 leading-snug mb-6 font-serif italic tracking-wide">
        "{question.question_text}"
      </h3>

      <div className="mt-auto border-t border-ink-700 pt-4">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-copper-500 hover:text-copper-400 transition-colors"
        >
          <Lightbulb size={16} />
          <span>{showHint ? 'Conceal Strategy' : 'Reveal Strategy'}</span>
        </button>

        {showHint && (
          <div className="mt-4 p-5 rounded-sm bg-ink-900/50 border-l-2 border-copper-700 text-xs text-parchment-200/50 leading-relaxed tracking-wider animate-in">
            {question.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
