import React from 'react';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { X, ChevronRight, Receipt, CalendarClock, Dumbbell, Box } from 'lucide-react';
import { MenuRowItem } from './MenuRowItem';
import { PlayerCard } from './PlayerCard';

export interface PlayerDetailSheetProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerDetailSheet: React.FC<PlayerDetailSheetProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  const { role } = useAppStore();

  if (!isOpen || !player) return null;

  const isTraining = player.status !== 'spectating';
  const isAdmin = role === 'coach';

  const xpValue = player.xp || 9302;
  const xpTotal = 10000;
  const filledFrames = Math.min(10, Math.max(1, Math.floor((xpValue % 10000) / 1000) || 4));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Container */}
      <div className="relative w-full max-w-md rounded-t-[32px] bg-[#121212] border-t border-[#2C2C2E]/60 p-6 pb-8 text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle Pill Bar */}
        <div className="w-9 h-[4px] rounded-full bg-[#3A3A3C] mx-auto mb-4" />

        {/* Header Row */}
        <div className="relative flex items-center justify-center mb-4">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            Player details
          </h3>

          <button
            onClick={onClose}
            className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#242426] text-[#8E8E93] transition-colors hover:bg-[#2C2C2E] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Player Card Banner */}
        <PlayerCard avatarUrl={player.avatarUrl} iconCount={4} />

        {/* Player Name & Status Subtitle */}
        <div className="text-center mt-4 space-y-1">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            {player.name}
          </h2>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#8E8E93]">
            {isTraining ? (
              <>
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Training</span>
              </>
            ) : (
              <>
                <Box className="h-3.5 w-3.5" />
                <span>Spectating</span>
              </>
            )}
          </div>
        </div>

        {/* Pro Rank & XP Tracker */}
        <div className="space-y-2 my-5">
          <div className="flex items-center justify-between font-display">
            <div className="flex items-center gap-1 text-base font-bold text-white cursor-pointer hover:text-[#68BD44]">
              <span>Pro</span>
              <ChevronRight className="h-4 w-4 text-[#8E8E93]" />
            </div>

            <span className="text-xs text-[#8E8E93]">
              <strong className="text-white">{xpValue}</strong>/{xpTotal}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span
                key={idx}
                className={`h-[4px] flex-1 rounded-full transition-colors duration-300 ${
                  idx < filledFrames ? 'bg-white' : 'bg-[#2C2C2E]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Admin Only Row Items & Buttons */}
        {isAdmin && (
          <div className="space-y-2.5 pt-2">
            {/* Billing row item */}
            <MenuRowItem icon={Receipt} label="Billing" />

            {/* Schedule private session row item */}
            <MenuRowItem icon={CalendarClock} label="Schedule private session" />

            {/* Action Button: Check-in (Green) when NOT on training, Check-out (Dark) when ON training */}
            {isTraining ? (
              <button
                onClick={onClose}
                className="w-full h-[52px] rounded-full bg-[#1C1C1E] text-white font-display text-base font-bold transition-all active:scale-95 hover:bg-[#242426] mt-4"
              >
                Check-out
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full h-[52px] rounded-full bg-[#68BD44] text-[#050505] font-display text-base font-bold shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739] mt-4"
              >
                Check-in
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
