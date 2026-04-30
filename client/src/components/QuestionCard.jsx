import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Tag } from 'lucide-react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import DifficultyBadge from './DifficultyBadge';

const QuestionCard = ({ question }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="chrome-card group p-8 rounded-lg">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(143,0,255,0.8)]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-400 opacity-50">
              {question.category.replace('-', ' ')}
            </span>
          </div>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>

      <h3 className="text-xl font-display font-bold text-white leading-tight mb-8 break-words">
        {question.question_text}
      </h3>

      <div className="pt-6 border-t border-obsidian-700 space-y-4">
        {!showHint ? (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-silver-400 hover:text-violet-400 transition-colors"
          >
            <div className="p-1 rounded-sm bg-violet-500/10 text-violet-500">
              <Zap size={14} />
            </div>
            Reveal Strategic Hint
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-obsidian-950 p-6 rounded-md border border-obsidian-700"
          >
            <p className="text-xs font-medium text-silver-300 leading-relaxed italic border-l-2 border-violet-500 pl-4">
              {question.hint}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
