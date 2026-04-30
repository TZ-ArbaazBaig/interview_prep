import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Tag } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

const QuestionCard = ({ question }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-primary-500/5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700 capitalize">
          <Tag size={12} />
          {question.category.replace('-', ' ')}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 leading-relaxed mb-4">
        {question.question_text}
      </h3>

      <div className="mt-auto">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          <Lightbulb size={16} />
          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showHint && (
          <div className="mt-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 text-sm text-slate-300 italic animate-in fade-in slide-in-from-top-1 duration-200">
            {question.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
