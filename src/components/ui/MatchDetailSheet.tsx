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
        <div className="flex justify-center my-3 mb-8">
          <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full ${match.isWin ? 'bg-[#24351B]' : 'bg-[#FF453A]/10'}`}>
            <span className={`font-sans text-xs font-medium ${match.isWin ? 'text-[#5AA739]' : 'text-[#FF453A]'}`}>
              {match.isWin ? 'Win' : 'Loss'}
            </span>
          </div>
        </div>

        {/* Teams & Avatars & Scores */}
        <div className="flex items-start justify-between my-6">
          <div className="flex flex-col items-center">
            <AvatarGroup
              players={teamAPlayers}
              size="lg"
              stacked={true}
              hasBorder={false}
              ringColor="ring-[#121212]"
            />
            <span className="font-display text-[20px] font-bold text-white mt-2">
              {match.scoreA ?? 21}
            </span>
          </div>

          <span className="font-sans text-[20px] font-bold text-[#8E8E93] mt-2">
            :
          </span>

          <div className="flex flex-col items-center">
            <AvatarGroup
              players={teamBPlayers}
              size="lg"
              stacked={true}
              hasBorder={false}
              ringColor="ring-[#121212]"
            />
            <span className="font-display text-[20px] font-bold text-white mt-2">
              {match.scoreB ?? 18}
            </span>
          </div>
        </div>

        {/* 6 Metrics Grid (2 rows x 3 cols) */}
        <div className="my-8 grid grid-cols-3 gap-y-6 gap-x-2 text-left pb-4">
          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">Date</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.date || 'Jul 1, 2026'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">Time</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.time || '16m 40s'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">Court</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.courtName || '# 2'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">Mode</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.isHardmode ? 'Hard' : 'Default'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">XP</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.xpGained > 0 ? `+${match.xpGained}` : match.xpGained}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-[#8E8E93] font-medium mb-1">BP</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.bpGained || 50}
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
