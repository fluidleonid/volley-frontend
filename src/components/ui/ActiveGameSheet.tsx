import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { AvatarGroup } from './AvatarGroup';
import { FinishGameSheet } from './FinishGameSheet';
import { PlayerDetailSheet } from './PlayerDetailSheet';
import { BottomSheet } from './BottomSheet';
import { Player } from '../../types';
import { MOCK_PLAYERS } from '../../data/mockPlayers';

export interface ActiveGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
}

export const ActiveGameSheet: React.FC<ActiveGameSheetProps> = ({
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
}) => {
  const { currentUser, role } = useAppStore();
  const [isFinishSheetOpen, setIsFinishSheetOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!isOpen) return null;

  const teamAPlayers: Player[] = [
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

  const teamBPlayers: Player[] = [MOCK_PLAYERS[1], MOCK_PLAYERS[2]];

  const isUserInGame = teamAPlayers.some((p) => p.id === currentUser.id) || teamBPlayers.some((p) => p.id === currentUser.id);
  const canFinishGame = role === 'coach' || isUserInGame;

  const handleCloseAllSheets = () => {
    setSelectedPlayer(null);
    setIsFinishSheetOpen(false);
    if (onCloseAll) {
      onCloseAll();
    } else {
      onClose();
    }
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        onCloseAll={handleCloseAllSheets}
        hasParent={hasParent}
        title="Match details"
        zIndex={100}
      >
        <div className="-mx-4 px-[60px]">
          {/* Status Pill Badge */}
          <div className="flex justify-center my-3">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#1C1C1E]">
              <span className="font-sans text-xs font-medium text-[#8E8E93]">
                Playing
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
              onSelectPlayer={(p) => setSelectedPlayer(p)}
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
              onSelectPlayer={(p) => setSelectedPlayer(p)}
            />
          </div>

          {/* 3 Metrics Row (NO divider line) */}
          <div className="my-6 grid grid-cols-3 gap-x-2 text-left">
            <div>
              <div className="font-sans text-xs text-[#8E8E93] font-medium">Date</div>
              <div className="font-sans text-sm font-semibold text-white mt-1">Jul 1, 2026</div>
            </div>
            <div>
              <div className="font-sans text-xs text-[#8E8E93] font-medium">Time</div>
              <div className="font-sans text-sm font-semibold text-white mt-1">16m 40s</div>
            </div>
            <div>
              <div className="font-sans text-xs text-[#8E8E93] font-medium">Court</div>
              <div className="font-sans text-sm font-semibold text-white mt-1"># 1</div>
            </div>
          </div>

          {/* Finish Button */}
          <button
            onClick={() => setIsFinishSheetOpen(true)}
            disabled={!canFinishGame}
            className={`flex h-[52px] w-full items-center justify-center rounded-full font-sans text-base font-bold shadow-lg transition-all mt-[24px] ${
              canFinishGame
                ? 'bg-[#68BD44] text-[#050505] shadow-[#68BD44]/20 hover:bg-[#5AA739] active:scale-95 cursor-pointer'
                : 'bg-[#1C1C1E] text-[#8E8E93] border border-[#2C2C2E] opacity-50 cursor-not-allowed'
            }`}
          >
            {canFinishGame ? 'Finish' : 'Only players can finish'}
          </button>
        </div>
      </BottomSheet>

      {/* Finish Game Score Entry Sheet Modal */}
      <FinishGameSheet
        isOpen={isFinishSheetOpen}
        onClose={() => setIsFinishSheetOpen(false)}
        onCloseAll={handleCloseAllSheets}
        hasParent={true}
        onSuccess={() => {
          setIsFinishSheetOpen(false);
          onClose();
        }}
      />

      {/* Player Detail Sheet Modal (z-[140]) */}
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onCloseAll={handleCloseAllSheets}
        hasParent={true}
      />
    </>
  );
};
