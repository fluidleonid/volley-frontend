import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Avatar } from '../../shared/ui/Avatar';
import { Player } from '../../shared/types/index';
import { useAppStore } from '../../app/store/appStore';
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
        <p className="font-sans text-xs text-muted-foreground font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );

  const footerButton = (
    <button
      type="button"
      onClick={onClose}
      className="w-full h-[52px] rounded-full bg-primary text-primary-foreground font-sans text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90 cursor-pointer"
    >
      Done
    </button>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={headerTitle}
      zIndex={150}
      topOffset={84}
      isScrollable={true}
      footer={footerButton}
    >
      {mockCandidates.map((player) => {
        const isSelected = selectedPlayerIds.includes(player.id);
        const isOnCourt = player.status !== 'spectating';

        return (
          <div
            key={player.id}
            onClick={() => onTogglePlayer(player)}
            className={`flex items-center justify-between p-3 rounded-[20px] transition-all cursor-pointer select-none ${isSelected
              ? 'bg-card border border-primary/40'
              : 'bg-card/60 hover:bg-card border border-transparent'
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

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isOnCourt ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Dumbbell className="h-3 w-3" /> On court
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
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
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95 ${isSelected
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-secondary text-white hover:bg-secondary/80'
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
    </BottomSheet>
  );
};
