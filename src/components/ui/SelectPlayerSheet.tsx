import React from 'react';
import { BottomSheet } from './BottomSheet';
import { Avatar } from './Avatar';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { Plus, Check, Box, Dumbbell } from 'lucide-react';

export interface SelectPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  selectedPlayerIds: string[];
  onTogglePlayer: (player: Player) => void;
}

export const SelectPlayerSheet: React.FC<SelectPlayerSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  selectedPlayerIds,
  onTogglePlayer,
}) => {
  const { todaysPlayers, currentUser } = useAppStore();

  if (!isOpen) return null;

  // Available candidate players today (excluding current logged-in user who is already in Team A)
  const candidatePlayers = todaysPlayers.filter((p) => p.id !== currentUser.id);

  // Fallback mock players if todaysPlayers has few items
  const mockCandidates: Player[] = candidatePlayers.length > 0 ? candidatePlayers : [
    {
      id: 'p-101',
      name: 'Alexander V.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      level: 14,
      xp: 4500,
      status: 'queued',
      gamesPlayed: 65,
      wins: 40,
      bpToday: 2.5,
      winStreak: 4,
    },
    {
      id: 'p-102',
      name: 'Maria S.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      level: 12,
      xp: 3200,
      status: 'spectating',
      gamesPlayed: 50,
      wins: 30,
      bpToday: 1.8,
      winStreak: 2,
    },
    {
      id: 'p-103',
      name: 'Dmitry K.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      level: 16,
      xp: 5800,
      status: 'queued',
      gamesPlayed: 90,
      wins: 62,
      bpToday: 3.4,
      winStreak: 5,
    },
    {
      id: 'p-104',
      name: 'Elena R.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      level: 11,
      xp: 2900,
      status: 'spectating',
      gamesPlayed: 35,
      wins: 18,
      bpToday: 1.1,
      winStreak: 1,
    },
  ];

  const headerTitle = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="font-sans text-xs text-[#8E8E93] font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={headerTitle}
      zIndex={150}
      topOffset={84}
    >
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden pt-1">
        {/* Scrollable Player List with bottom padding for blur button */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-36 scrollbar-none">
          {mockCandidates.map((player) => {
            const isSelected = selectedPlayerIds.includes(player.id);
            const isOnCourt = player.status !== 'spectating';

            return (
              <div
                key={player.id}
                onClick={() => onTogglePlayer(player)}
                className={`flex items-center justify-between p-3 rounded-[20px] transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#1C1C1E] border border-[#68BD44]/40'
                    : 'bg-[#1C1C1E]/60 hover:bg-[#1C1C1E] border border-transparent'
                }`}
              >
                {/* Left: Avatar & Name & Status Badge */}
                <div className="flex items-center gap-3">
                  <Avatar
                    src={player.avatarUrl}
                    alt={player.name}
                    initials={player.name[0]}
                    size="lg"
                    hasBorder={false}
                  />

                  <div className="space-y-0.5">
                    <h4 className="font-sans text-base font-semibold text-white tracking-tight">
                      {player.name}
                    </h4>

                    {/* Player Status Badge (Players on court CAN still be invited!) */}
                    <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
                      {isOnCourt ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#8E8E93] font-medium">
                          <Dumbbell className="h-3 w-3" /> On court
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-[#8E8E93] font-medium">
                          <Box className="h-3 w-3" /> Spectating
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Plus / Check Circle Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlayer(player);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#68BD44] text-[#050505] shadow-md shadow-[#68BD44]/20'
                      : 'bg-[#2C2C2E] text-white hover:bg-[#3A3A3C]'
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-5 w-5 stroke-[3]" />
                  ) : (
                    <Plus className="h-5 w-5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Progressive Blur Layer */}
        <div
          className="absolute bottom-0 inset-x-0 h-44 z-20 pointer-events-none bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent backdrop-blur-md rounded-b-[32px] -mx-4"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Action Button positioned at EXACTLY 48px from bottom edge */}
        <div className="absolute bottom-[48px] inset-x-0 z-30 pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-[52px] rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer pointer-events-auto"
          >
            Done
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
