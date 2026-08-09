import React, { useState } from 'react';
import { AvatarGroup } from './AvatarGroup';
import { Match } from '../../types';
import { tokens } from '../../styles/tokens';
import bpIcon from '../../assets/bp-icon.svg';
import { MatchDetailSheet } from './MatchDetailSheet';

export interface MatchHistoryCardProps {
  match: Match;
  onClick?: () => void;
}

export const MatchHistoryCard: React.FC<MatchHistoryCardProps> = ({ match, onClick }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isWin = match.isWin;

  const handleClick = () => {
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
        className="flex flex-row items-center justify-between py-2 border-b border-[#2C2C2E] last:border-0 w-full h-[64px] min-h-[64px] max-h-[64px] cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        {/* 1. Status W/L Container (Exact Width: 100px, Full Height, Borderless Pill) */}
        <div className="w-[100px] shrink-0 self-stretch flex items-center justify-start">
          <div
            className="self-stretch w-[22px] min-w-[22px] max-w-[22px] rounded-[12px] flex items-center justify-center shrink-0 border-0"
            style={{
              backgroundColor: tokens.colors.bg.elevated,
            }}
          >
            <span
              className="font-display text-xs font-extrabold"
              style={{
                color: isWin ? tokens.colors.brand.primary : '#FF3B30',
              }}
            >
              {isWin ? 'W' : 'L'}
            </span>
          </div>
        </div>

        {/* 2. Teams & Scores Container (Fills All Remaining Space, Automatic Spacing) */}
        <div className="flex-1 flex items-center justify-between px-2">
          {/* Team A Column (Fixed Width: 40px) */}
          <div className="w-[40px] shrink-0 flex flex-col items-center justify-center gap-1">
            <AvatarGroup players={teamAPlayers} size="xs" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
            <span
              className="font-display text-[20px] font-extrabold tracking-tight leading-none mt-0.5"
              style={{ color: tokens.colors.text.primary }}
            >
              {match.scoreA}
            </span>
          </div>

          {/* Colon Separator (Vertically Centered) */}
          <div
            className="font-display text-xl font-bold self-center flex items-center justify-center opacity-60 leading-none"
            style={{ color: tokens.colors.text.secondary }}
          >
            :
          </div>

          {/* Team B Column (Fixed Width: 40px) */}
          <div className="w-[40px] shrink-0 flex flex-col items-center justify-center gap-1">
            <AvatarGroup players={teamBPlayers} size="xs" stacked={true} hasBorder={false} ringColor="ring-[#121212]" />
            <span
              className="font-display text-[20px] font-extrabold tracking-tight leading-none mt-0.5"
              style={{ color: tokens.colors.text.primary }}
            >
              {match.scoreB}
            </span>
          </div>
        </div>

        {/* 3. Rewards Container (Exact Width: 100px, Right Aligned) */}
        <div className="w-[100px] shrink-0 flex flex-col items-end justify-center text-right gap-1">
          {/* XP Text Layer */}
          <span
            className="font-display text-xs font-bold tracking-tight"
            style={{ color: tokens.colors.text.secondary }}
          >
            {xpValue >= 0 ? `+${xpValue}` : xpValue} XP
          </span>

          {/* BP Badge Container: Height 18px, Side Paddings 4px, Gap 2px, Same Color & Style as XP */}
          <div
            className="relative overflow-visible inline-flex items-center h-[18px] px-[4px] gap-[2px] rounded-full border-0"
            style={{
              backgroundColor: tokens.colors.bg.elevated,
            }}
          >
            <span
              className="font-display text-xs font-bold tracking-tight"
              style={{ color: tokens.colors.text.secondary }}
            >
              {bpValue}
            </span>

            {/* Icon Wrapper: Icon Size 16px, color matches text color (tokens.colors.text.secondary) */}
            <div className="relative w-[16px] h-[18px] flex items-center justify-center -translate-y-[4px] shrink-0 pointer-events-none">
              <div
                className="w-[18px] h-[18px] shrink-0"
                style={{
                  backgroundColor: tokens.colors.text.secondary,
                  WebkitMaskImage: `url(${bpIcon})`,
                  maskImage: `url(${bpIcon})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>
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
