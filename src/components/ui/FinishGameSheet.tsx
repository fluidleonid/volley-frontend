import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Avatar } from './Avatar';

export interface FinishGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FinishGameSheet: React.FC<FinishGameSheetProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, finishMatch } = useAppStore();
  const [scoreA, setScoreA] = useState(21);
  const [scoreB, setScoreB] = useState(18);

  if (!isOpen) return null;

  const handleSave = () => {
    finishMatch(scoreA, scoreB);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container (Node 11545:10258) */}
      <div className="relative w-full max-w-md rounded-t-[32px] bg-[#121212] border-t border-[#2C2C2E]/60 p-6 pb-8 text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle Bar */}
        <div className="w-9 h-[4px] rounded-full bg-[#3A3A3C] mx-auto mb-4" />

        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            Finish game
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#242426] text-[#8E8E93] transition-colors hover:bg-[#2C2C2E] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subtitle / Info */}
        <div className="text-center mb-6">
          <div className="text-xs text-[#8E8E93] font-medium">Court #2 • Set final score</div>
        </div>

        {/* Score Counters Row */}
        <div className="flex items-center justify-between gap-4 rounded-[24px] bg-[#1C1C1E] p-4 mb-8 border border-[#2C2C2E]">
          {/* Team A Counter */}
          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              <Avatar src={currentUser.avatarUrl} initials={currentUser.name[0]} size="sm" />
              <span className="text-xs font-bold text-white">Team A</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScoreA((prev) => Math.max(0, prev - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2E] text-white active:scale-95 transition-all"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-2xl font-black text-white w-8 text-center">
                {scoreA}
              </span>
              <button
                onClick={() => setScoreA((prev) => prev + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2E] text-white active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <span className="font-display text-xl font-bold text-[#8E8E93] opacity-40">:</span>

          {/* Team B Counter */}
          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                initials="M"
                size="sm"
              />
              <span className="text-xs font-bold text-white">Team B</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScoreB((prev) => Math.max(0, prev - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2E] text-white active:scale-95 transition-all"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-2xl font-black text-white w-8 text-center">
                {scoreB}
              </span>
              <button
                onClick={() => setScoreB((prev) => prev + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2E] text-white active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Save Button */}
        <button
          onClick={handleSave}
          className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] font-bold text-sm shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739]"
        >
          Save results
        </button>
      </div>
    </div>
  );
};
