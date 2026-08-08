import React from 'react';
import { AvatarGroup } from './AvatarGroup';
import { Badge } from './badge';
import { Match } from '../../types';

export interface MatchHistoryCardProps {
  match: Match;
}

export const MatchHistoryCard: React.FC<MatchHistoryCardProps> = ({ match }) => {
  const isWin = match.isWin;

  // Convert match teams into Player-like objects for AvatarGroup
  const teamAPlayers = match.teamA.map((p, idx) => ({ id: `a-${idx}`, name: p.name, avatarUrl: p.avatarUrl, level: 1, xp: 0, status: 'spectating' as const, gamesPlayed: 0, wins: 0, bpToday: 0, winStreak: 0 }));
  const teamBPlayers = match.teamB.map((p, idx) => ({ id: `b-${idx}`, name: p.name, avatarUrl: p.avatarUrl, level: 1, xp: 0, status: 'spectating' as const, gamesPlayed: 0, wins: 0, bpToday: 0, winStreak: 0 }));

  return (
    <div className="flex flex-row items-center justify-between py-3 border-b border-[#2C2C2E] last:border-0 w-full">
      
      {/* Left: Win/Loss Indicator + Teams + Score */}
      <div className="flex items-center gap-3">
        
        {/* W/L Circle */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display font-extrabold text-sm ${
          isWin ? 'bg-[#68BD44]/20 text-[#68BD44]' : 'bg-[#2C2C2E] text-[#8E8E93]'
        }`}>
          {isWin ? 'W' : 'L'}
        </div>

        {/* Teams and Score */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <AvatarGroup players={teamAPlayers} size="sm" stacked={true} ringColor="ring-[#121212]" />
            <span className="font-sans text-xs font-semibold text-[#8E8E93]">vs</span>
            <AvatarGroup players={teamBPlayers} size="sm" stacked={true} ringColor="ring-[#121212]" />
          </div>
          
          <div className="font-display text-sm font-bold text-white tracking-tight">
            {match.scoreA} : {match.scoreB}
          </div>
        </div>

      </div>

      {/* Right: XP & BP Rewards in Badges */}
      <div className="flex flex-col items-end gap-1 text-right">
        <Badge variant="secondary" className="px-1.5 py-0.5 font-display text-[11px] font-bold">
          {isWin ? '+' : ''}{match.xpGained} XP
        </Badge>
        {match.bpGained !== undefined && match.bpGained > 0 && (
          <Badge variant="secondary" className="px-1.5 py-0.5 font-display text-[11px] font-bold">
            +{match.bpGained} BP
          </Badge>
        )}
      </div>

    </div>
  );
};
