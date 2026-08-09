import React from 'react';
import { Match, Player } from '../../types';
import { AvatarGroup } from './AvatarGroup';
import { X } from 'lucide-react';
import { tokens } from '../../styles/tokens';

export interface MatchDetailSheetProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDetailSheet: React.FC<MatchDetailSheetProps> = ({
  match,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !match) return null;

  const isWin = match.isWin;

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

  const xpFormatted = match.xpGained >= 0 ? `+${match.xpGained}` : `${match.xpGained}`;
  const bpFormatted = match.bpGained !== undefined ? match.bpGained : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal Container */}
      <div className="relative w-full max-w-md rounded-t-[32px] bg-[#121212] border-t border-[#2C2C2E]/60 p-6 pb-8 text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle Pill Bar */}
        <div className="w-9 h-[4px] rounded-full bg-[#3A3A3C] mx-auto mb-4" />

        {/* Header Row */}
        <div className="relative flex items-center justify-center mb-4">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            Match details
          </h3>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#242426] text-[#8E8E93] transition-colors hover:bg-[#2C2C2E] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Win / Loss Status Badge */}
        <div className="flex justify-center my-3">
          <div
            className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#242426]"
          >
            <span
              className="font-display text-sm font-bold"
              style={{ color: isWin ? tokens.colors.brand.primary : '#FF3B30' }}
            >
              {isWin ? 'Win' : 'Loss'}
            </span>
          </div>
        </div>

        {/* Teams & Scores Center Display */}
        <div className="flex items-center justify-center gap-6 my-6">
          {/* Team A */}
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup players={teamAPlayers} size="lg" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
            <span className="font-display text-3xl font-extrabold text-white tracking-tight leading-none">
              {match.scoreA}
            </span>
          </div>

          {/* Colon Separator */}
          <span className="font-display text-xl font-bold text-[#8E8E93] opacity-60 self-center -mt-6">
            :
          </span>

          {/* Team B */}
          <div className="flex flex-col items-center gap-2">
            <AvatarGroup players={teamBPlayers} size="lg" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
            <span className="font-display text-3xl font-extrabold text-white tracking-tight leading-none">
              {match.scoreB}
            </span>
          </div>
        </div>

        {/* 6 Metrics Grid (2 rows x 3 columns) */}
        <div className="mt-8 pt-4 border-t border-[#2C2C2E]/40 grid grid-cols-3 gap-y-6 gap-x-2 text-left">
          {/* Row 1 */}
          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">Date</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {match.date || 'Jul 1, 2026'}
            </div>
          </div>

          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">Time</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {match.time || '10m 40s'}
            </div>
          </div>

          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">Court</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {match.courtName || '# 1'}
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">Mode</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {match.isHardmode ? 'Hardmode' : 'Default'}
            </div>
          </div>

          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">XP</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {xpFormatted}
            </div>
          </div>

          <div>
            <div className="font-display text-xs text-[#8E8E93] font-medium">BP</div>
            <div className="font-display text-sm font-semibold text-white mt-1">
              {bpFormatted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
