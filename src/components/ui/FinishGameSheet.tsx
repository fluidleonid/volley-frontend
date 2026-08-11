import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { AvatarGroup } from './AvatarGroup';
import { BottomSheet } from './BottomSheet';
import { Input } from './Input';
import { Player } from '../../types';
import { MOCK_PLAYERS } from '../../data/mockPlayers';

export interface FinishGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
  onSuccess?: () => void;
  teamA?: Player[];
  teamB?: Player[];
}

export const FinishGameSheet: React.FC<FinishGameSheetProps> = ({
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
  onSuccess,
  teamA,
  teamB,
}) => {
  const { currentUser, finishMatch } = useAppStore();
  const [scoreA, setScoreA] = useState<string>('0');
  const [scoreB, setScoreB] = useState<string>('0');

  if (!isOpen) return null;

  const defaultTeamA: Player[] = teamA || [
    {
      id: currentUser.id,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      level: currentUser.level,
      xp: currentUser.xp,
      status: 'queued',
      gamesPlayed: currentUser.gamesPlayed,
      wins: currentUser.wins,
      bpToday: currentUser.bpToday,
      winStreak: currentUser.winStreak,
    },
    MOCK_PLAYERS[0],
  ];

  const defaultTeamB: Player[] = teamB || [MOCK_PLAYERS[1], MOCK_PLAYERS[2]];

  const handleSave = () => {
    const numA = parseInt(scoreA, 10) || 0;
    const numB = parseInt(scoreB, 10) || 0;
    finishMatch(numA, numB);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title="Enter score"
      zIndex={120}
    >
      <div className="-mx-4 px-[60px]">
        {/* Teams & Score Input Row */}
        <div className="flex items-center justify-between my-6">
          {/* Team A Column */}
          <div className="flex flex-col items-center gap-3">
            {/* Avatars (Centered above 84px input whether 1 or 2 players) */}
            <div className="flex justify-center">
              <AvatarGroup
                players={defaultTeamA}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
              />
            </div>

            {/* Score Input Box (Width 84px, No +/- buttons) */}
            <Input
              variant="score"
              type="number"
              min="0"
              max="99"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>

          {/* vs Separator */}
          <span className="font-sans text-[20px] font-bold text-[#8E8E93] self-center -mt-6">
            vs
          </span>

          {/* Team B Column */}
          <div className="flex flex-col items-center gap-3">
            {/* Avatars (Centered above 84px input whether 1 or 2 players) */}
            <div className="flex justify-center">
              <AvatarGroup
                players={defaultTeamB}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
              />
            </div>

            {/* Score Input Box (Width 84px, No +/- buttons) */}
            <Input
              variant="score"
              type="number"
              min="0"
              max="99"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          onClick={handleSave}
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold shadow-lg transition-all active:scale-95 cursor-pointer mt-6"
        >
          Submit
        </button>
      </div>
    </BottomSheet>
  );
};
