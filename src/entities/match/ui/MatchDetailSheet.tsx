import React, { useState } from 'react';
import { Match, Player } from '../../../shared/types/index';
import { AvatarGroup } from '../../../shared/ui/AvatarGroup';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { useAppStore } from '../../../app/store/appStore';
import { PlayerDetailSheet } from '../../player/ui/PlayerDetailSheet';

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
  const { todaysPlayers, leaderboard, currentUser } = useAppStore();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!isOpen || !match) return null;

  // Attempt to find full player data by name
  const findFullPlayer = (name: string, fallbackId: string, avatarUrl?: string): Player => {
    if (currentUser.name === name || name.includes('(You)')) return currentUser;
    const fromToday = todaysPlayers.find(p => p.name === name);
    if (fromToday) return fromToday;
    const fromLB = leaderboard.find(l => l.player.name === name)?.player;
    if (fromLB) return fromLB;

    return {
      id: fallbackId,
      name,
      avatarUrl,
      level: 1,
      xp: 0,
      status: 'spectating',
      gamesPlayed: 0,
      wins: 0,
      bpToday: 0,
      winStreak: 0,
    };
  };

  // Convert Team A and Team B to Player objects for AvatarGroup
  const teamAPlayers: Player[] = match.teamA.map((p, idx) => 
    findFullPlayer(p.name, `sheet-a-${idx}`, p.avatarUrl)
  );

  const teamBPlayers: Player[] = match.teamB.map((p, idx) => 
    findFullPlayer(p.name, `sheet-b-${idx}`, p.avatarUrl)
  );


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
              onSelectPlayer={(p) => setSelectedPlayer(p)}
            />
            <span className="font-display text-[20px] font-bold text-white mt-2">
              {match.scoreA ?? 21}
            </span>
          </div>

          <span className="font-sans text-[20px] font-bold text-muted-foreground mt-2">
            :
          </span>

          <div className="flex flex-col items-center">
            <AvatarGroup
              players={teamBPlayers}
              size="lg"
              stacked={true}
              hasBorder={false}
              ringColor="ring-[#121212]"
              onSelectPlayer={(p) => setSelectedPlayer(p)}
            />
            <span className="font-display text-[20px] font-bold text-white mt-2">
              {match.scoreB ?? 18}
            </span>
          </div>
        </div>

        {/* 6 Metrics Grid (2 rows x 3 cols) */}
        <div className="my-8 grid grid-cols-3 gap-y-6 gap-x-2 text-left pb-4">
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Date</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.date || 'Jul 1, 2026'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Time</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.time || '16m 40s'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Court</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.courtName || '# 2'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Mode</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.isHardmode ? 'Hard' : 'Default'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">XP</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.xpGained > 0 ? `+${match.xpGained}` : match.xpGained}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">BP</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.bpGained || 50}
            </div>
          </div>
        </div>
      </div>
      
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onCloseAll={onCloseAll}
        hasParent={true}
      />
    </BottomSheet>
  );
};
