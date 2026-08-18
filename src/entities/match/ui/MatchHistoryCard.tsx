import React, { useState } from 'react';
import { AvatarGroup } from '../../../shared/ui/AvatarGroup';
import { Match } from '../../../shared/types/index';
import { MatchDetailSheet } from './MatchDetailSheet';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../../shared/ui/badge';
import { BpIcon } from '../../../shared/ui/icons/BpIcon';

export interface MatchHistoryCardProps {
  match: Match;
  onClick?: () => void;
  variant?: 'player' | 'coach';
}

export const MatchHistoryCard: React.FC<MatchHistoryCardProps> = ({ match, onClick, variant = 'player' }) => {
  const { t } = useTranslation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isWin = match.isWin;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      setIsSheetOpen(true);
    }
  };

  // Convert match teams into Player-like objects for AvatarGroup
  const teamAPlayers = match.teamA.map((p, idx) => ({
    id: `a-${idx}`,
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

  const teamBPlayers = match.teamB.map((p, idx) => ({
    id: `b-${idx}`,
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

  const bpValue = match.bpGained !== undefined ? match.bpGained : 0;
  const xpValue = match.xpGained;

  return (
    <>
      <div
        onClick={handleClick}
        className="flex flex-row items-center justify-between py-3 border-b border-solid border-border/60 last:border-b-0 w-full cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        {variant === 'coach' ? (
          <>
            <div className="flex-1 flex justify-start pl-2">
              <AvatarGroup players={teamAPlayers} size="md" stacked={true} hasBorder={false} ringColor="ring-[#1C1C1E]" />
            </div>
            
            <div className="flex items-center justify-center shrink-0 w-[100px]">
              <span className="font-display text-[20px] font-bold text-white w-[30px] text-right">
                {match.scoreA ?? 21}
              </span>
              <span className="font-sans text-[20px] font-bold text-muted-foreground mx-2">
                :
              </span>
              <span className="font-display text-[20px] font-bold text-white w-[30px] text-left">
                {match.scoreB ?? 18}
              </span>
            </div>

            <div className="flex-1 flex justify-end pr-2">
              <AvatarGroup players={teamBPlayers} size="md" stacked={true} hasBorder={false} ringColor="ring-[#1C1C1E]" />
            </div>
          </>
        ) : (
          <>
            {/* 1. Status W/L Container (Exact Width: 100px, Full Height, Borderless Pill) */}
            <div className="w-[100px] shrink-0 self-stretch flex items-center justify-start">
              <div
                className="self-stretch w-[22px] min-w-[22px] max-w-[22px] rounded-[12px] flex items-center justify-center shrink-0 border-0 bg-brand-surfaceElevated"
              >
                <span
                  className={`font-display text-xs font-extrabold ${isWin ? 'text-primary' : 'text-[#FF3B30]'}`}
                >
                  {isWin ? t('games.winsShort', 'W') : t('games.lossesShort', 'L')}
                </span>
              </div>
            </div>

            {/* 2. Teams & Scores Container (Fills All Remaining Space, Automatic Spacing) */}
            <div className="flex-1 flex items-center justify-between px-2">
              {/* Team A Column (Fixed Width: 40px) */}
              <div className="w-[40px] shrink-0 flex flex-col items-center justify-center gap-1">
                <AvatarGroup players={teamAPlayers} size="xs" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
                <span
                  className="font-display text-[20px] font-extrabold tracking-tight leading-none mt-0.5 text-white"
                >
                  {match.scoreA}
                </span>
              </div>

              {/* Colon Separator (Vertically Centered) */}
              <div
                className="font-display text-xl font-bold self-center flex items-center justify-center opacity-60 leading-none text-muted-foreground"
              >
                :
              </div>

              {/* Team B Column (Fixed Width: 40px) */}
              <div className="w-[40px] shrink-0 flex flex-col items-center justify-center gap-1">
                <AvatarGroup players={teamBPlayers} size="xs" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
                <span
                  className="font-display text-[20px] font-extrabold tracking-tight leading-none mt-0.5 text-white"
                >
                  {match.scoreB}
                </span>
              </div>
            </div>

            {/* 3. Rewards Container (Exact Width: 100px, Right Aligned) */}
            <div className="w-[100px] shrink-0 flex flex-col items-end justify-center text-right gap-1">
              {/* XP Text Layer */}
              <span
                className="font-display text-xs font-bold tracking-tight text-muted-foreground"
              >
                {xpValue >= 0 ? `+${xpValue}` : xpValue} XP
              </span>

              {/* BP Badge Container: Height 18px, Side Paddings 4px, Gap 2px, Same Color & Style as XP */}
              <Badge variant="secondary" size="sm">
                <span>{bpValue}</span>
                <BpIcon />
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Match Details Sheet Modal */}
      <MatchDetailSheet
        match={match}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
};
