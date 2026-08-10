import React from 'react';
import { Match, Player } from '../../types';
import { AvatarGroup } from './AvatarGroup';
import { BottomSheet } from './BottomSheet';

export interface MatchDetailSheetProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
}

export const MatchDetailSheet: React.FC<MatchDetailSheetProps> = ({
  match,
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
}) => {
  if (!isOpen || !match) return null;

  // Convert Team A and Team B to Player objects for AvatarGroup
  const teamAPlayers: Player[] = match.teamA.map((p, idx) => ({
    id: `sheet-a-${idx}`,
    name: p.name,
    avatarUrl: p.avatarUrl,
    level: 1,
    xp: 0,
    status: 'spectating' as const,
    gamesPlayed: 0,
    wins: 0,
    bpToday: 0,
    winStreak: 0,
  }));

  const teamBPlayers: Player[] = match.teamB.map((p, idx) => ({
    id: `sheet-b-${idx}`,
    name: p.name,
    avatarUrl: p.avatarUrl,
    level: 1,
    xp: 0,
    status: 'spectating' as const,
    gamesPlayed: 0,
    wins: 0,
    bpToday: 0,
    winStreak: 0,
  }));

  const statusDisplay = (match as { statusText?: string }).statusText || 'Playing';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title="Match details"
      zIndex={100}
    >
      <div className="-mx-4 px-[60px]">
        {/* Status Pill Badge */}
        <div className="flex justify-center my-3">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#1C1C1E]">
            <span className="font-sans text-xs font-medium text-[#8E8E93]">
              {statusDisplay}
            </span>
          </div>
        </div>

        {/* Teams & Avatars (44px avatars, vs in center, NO Team A/B text) */}
        <div className="flex items-center justify-between my-6">
          <AvatarGroup
            players={teamAPlayers}
            size="lg"
            stacked={true}
            hasBorder={false}
            ringColor="ring-[#121212]"
          />

          <span className="font-sans text-[20px] font-bold text-[#8E8E93]">
            vs
          </span>

          <AvatarGroup
            players={teamBPlayers}
            size="lg"
            stacked={true}
            hasBorder={false}
            ringColor="ring-[#121212]"
          />
        </div>

        {/* 3 Metrics Row (NO divider line) */}
        <div className="my-6 grid grid-cols-3 gap-x-2 text-left">
          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium">Date</div>
            <div className="font-sans text-sm font-semibold text-white mt-1">
              {match.date || 'Jul 1, 2026'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium">Time</div>
            <div className="font-sans text-sm font-semibold text-white mt-1">
              {match.time || '16m 40s'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium">Court</div>
            <div className="font-sans text-sm font-semibold text-white mt-1">
              {match.courtName || '# 1'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold shadow-lg transition-all active:scale-95 cursor-pointer mt-6"
        >
          Finish
        </button>
      </div>
    </BottomSheet>
  );
};
