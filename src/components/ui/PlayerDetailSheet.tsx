import React from 'react';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { ChevronRight, Receipt, CalendarClock, Dumbbell, Box } from 'lucide-react';
import { MenuRowItem } from './MenuRowItem';
import { PlayerCard } from './PlayerCard';
import { BottomSheet } from './BottomSheet';

export interface PlayerDetailSheetProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
}

export const PlayerDetailSheet: React.FC<PlayerDetailSheetProps> = ({
  player,
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
}) => {
  const { role } = useAppStore();

  if (!isOpen || !player) return null;

  const isTraining = player.status !== 'spectating';
  const isAdmin = role === 'coach';

  const xpValue = player.xp || 9302;
  const xpTotal = 10000;
  const filledFrames = Math.min(10, Math.max(1, Math.floor((xpValue % 10000) / 1000) || 4));

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title="Player details"
      zIndex={140}
    >
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
        <div className="space-y-[4px] pt-2">
          {/* Billing row item */}
          <MenuRowItem icon={Receipt} label="Billing" />

          {/* Schedule private session row item */}
          <MenuRowItem icon={CalendarClock} label="Schedule private session" />

          {/* Action Button: Check-in (Green) when NOT on training, Check-out (Dark) when ON training (24px top margin) */}
          {isTraining ? (
            <button
              onClick={onClose}
              className="w-full h-[52px] rounded-full bg-[#1C1C1E] text-white font-sans text-base font-bold transition-all active:scale-95 hover:bg-[#242426] mt-[24px]"
            >
              Check-out
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full h-[52px] rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739] mt-[24px]"
            >
              Check-in
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
};
