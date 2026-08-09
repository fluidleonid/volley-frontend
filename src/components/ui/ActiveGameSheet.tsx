import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { AvatarGroup } from './AvatarGroup';
import { X } from 'lucide-react';
import { FinishGameSheet } from './FinishGameSheet';
import { PlayerDetailSheet } from './PlayerDetailSheet';
import { Player } from '../../types';

export interface ActiveGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveGameSheet: React.FC<ActiveGameSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAppStore();
  const [isFinishSheetOpen, setIsFinishSheetOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!isOpen) return null;

  // Mock active game players on Court #2
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
    {
      id: 'p2',
      name: 'Sarah M.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      level: 15,
      xp: 4200,
      status: 'queued',
      gamesPlayed: 80,
      wins: 55,
      bpToday: 2.4,
      winStreak: 6,
    },
  ];

  const teamBPlayers: Player[] = [
    {
      id: 'p3',
      name: 'Marcus K.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      level: 11,
      xp: 2300,
      status: 'queued',
      gamesPlayed: 40,
      wins: 22,
      bpToday: 1.2,
      winStreak: 2,
    },
    {
      id: 'p4',
      name: 'Elena T.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      level: 14,
      xp: 3900,
      status: 'queued',
      gamesPlayed: 75,
      wins: 48,
      bpToday: 3.1,
      winStreak: 3,
    },
  ];

  // Check if current logged-in user is a participant in this game
  const isUserInGame = teamAPlayers.some((p) => p.id === currentUser.id) || teamBPlayers.some((p) => p.id === currentUser.id);

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        {/* Backdrop Overlay */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sheet Container (Node 11507:13578) */}
        <div className="relative w-full max-w-md rounded-t-[32px] bg-[#121212] border-t border-[#2C2C2E]/60 p-6 pb-8 text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
          {/* Top Handle Bar */}
          <div className="w-9 h-[4px] rounded-full bg-[#3A3A3C] mx-auto mb-4" />

          {/* Header */}
          <div className="relative flex items-center justify-center mb-4">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Match details
            </h3>

            <button
              onClick={onClose}
              className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#242426] text-[#8E8E93] transition-colors hover:bg-[#2C2C2E] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center my-3">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#68BD44]/15 border border-[#68BD44]/30">
              <span className="font-display text-xs font-bold text-[#68BD44]">
                Playing • In Progress
              </span>
            </div>
          </div>

          {/* Teams & Current Scores */}
          <div className="flex items-center justify-center gap-6 my-6">
            {/* Team A */}
            <div className="flex flex-col items-center gap-2">
              <AvatarGroup players={teamAPlayers} size="lg" stacked={true} hasBorder={false} ringColor="ring-[#121212]" onSelectPlayer={(p) => setSelectedPlayer(p)} />
              <span className="font-display text-3xl font-extrabold text-white tracking-tight leading-none">
                18
              </span>
              <span className="text-[11px] font-semibold text-[#8E8E93]">Team A</span>
            </div>

            <span className="font-display text-xl font-bold text-[#8E8E93] opacity-60 self-center -mt-6">
              :
            </span>

            {/* Team B */}
            <div className="flex flex-col items-center gap-2">
              <AvatarGroup players={teamBPlayers} size="lg" stacked={true} hasBorder={false} ringColor="ring-[#121212]" onSelectPlayer={(p) => setSelectedPlayer(p)} />
              <span className="font-display text-3xl font-extrabold text-white tracking-tight leading-none">
                16
              </span>
              <span className="text-[11px] font-semibold text-[#8E8E93]">Team B</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-6 pt-4 border-t border-[#2C2C2E]/40 grid grid-cols-3 gap-y-4 gap-x-2 text-left mb-6">
            <div>
              <div className="font-display text-xs text-[#8E8E93] font-medium">Court</div>
              <div className="font-display text-sm font-semibold text-white mt-0.5"># 2</div>
            </div>
            <div>
              <div className="font-display text-xs text-[#8E8E93] font-medium">Time</div>
              <div className="font-display text-sm font-semibold text-white mt-0.5">12m 11s</div>
            </div>
            <div>
              <div className="font-display text-xs text-[#8E8E93] font-medium">Mode</div>
              <div className="font-display text-sm font-semibold text-white mt-0.5">Default</div>
            </div>
          </div>

          {/* Finish Button - Enabled ONLY for players in this game */}
          <button
            onClick={() => setIsFinishSheetOpen(true)}
            disabled={!isUserInGame}
            className={`flex h-[44px] w-full items-center justify-center rounded-full text-sm font-bold shadow-lg transition-all ${
              isUserInGame
                ? 'bg-[#68BD44] text-[#050505] shadow-[#68BD44]/20 hover:bg-[#5AA739] active:scale-95 cursor-pointer'
                : 'bg-[#1C1C1E] text-[#8E8E93] border border-[#2C2C2E] opacity-50 cursor-not-allowed'
            }`}
          >
            {isUserInGame ? 'Finish game' : 'Only players can finish'}
          </button>
        </div>
      </div>

      {/* Finish Game Score Entry Sheet Modal (Node 11545-10258) */}
      <FinishGameSheet
        isOpen={isFinishSheetOpen}
        onClose={() => setIsFinishSheetOpen(false)}
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
      />
    </>
  );
};
