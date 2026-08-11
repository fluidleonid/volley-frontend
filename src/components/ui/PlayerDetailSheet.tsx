import React from 'react';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { Receipt, CalendarClock, Dumbbell, Box } from 'lucide-react';
import { MenuRowItem } from './MenuRowItem';
import { PlayerCard } from './PlayerCard';
import { XpBar } from './XpBar';
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

      <div className="my-5">
        <XpBar current={xpValue} max={xpTotal} label="Pro" />
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
