import React, { useState, useMemo } from 'react';
import { BottomSheet } from './BottomSheet';
import { Avatar } from './Avatar';
import { Button } from './button';
import { Input } from './Input';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { Search, Plus, UserPlus, Check } from 'lucide-react';

interface SelectPlayerForSessionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'single' | 'multiple';
  title?: string;
  subtitle?: string;
  selectedPlayerIds?: string[];
  onSelectPlayer?: (player: Player) => void;
  onSelectPlayers?: (players: Player[]) => void;
  onAddGuest: () => void;
  onCreateNewPlayer: () => void;
}

export const SelectPlayerForSessionSheet: React.FC<SelectPlayerForSessionSheetProps> = ({
  isOpen,
  onClose,
  mode = 'single',
  title = 'Private session',
  subtitle = 'Select player for a session',
  selectedPlayerIds = [],
  onSelectPlayer,
  onSelectPlayers,
  onAddGuest,
  onCreateNewPlayer,
}) => {
  const { leaderboard } = useAppStore(); // Assuming leaderboard has all players
  
  // Extract Player objects from leaderboard entries
  const allPlayers = useMemo(() => leaderboard.map(entry => entry.player), [leaderboard]);

  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedPlayerIds);

  // Filter players by search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return allPlayers;
    return allPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allPlayers, searchQuery]);

  const handleSelect = () => {
    if (mode === 'single') {
      if (localSelectedIds.length > 0 && onSelectPlayer) {
        const player = allPlayers.find(p => p.id === localSelectedIds[0]);
        if (player) onSelectPlayer(player);
      }
    } else {
      if (onSelectPlayers) {
        const players = allPlayers.filter(p => localSelectedIds.includes(p.id));
        onSelectPlayers(players);
      }
    }
  };

  const togglePlayer = (id: string) => {
    if (mode === 'single') {
      setLocalSelectedIds([id]);
    } else {
      setLocalSelectedIds(prev => 
        prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
      );
    }
  };

  const titleNode = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        {title}
      </h3>
      <p className="font-sans text-xs text-[#8E8E93] font-normal">
        {subtitle}
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={160} topOffset={84}>
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden pt-1">
        {/* Search Input */}
        <div className="px-4 pb-4 shrink-0">
          <Input
            variant="search"
            icon={<Search className="h-5 w-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-36 scrollbar-none px-4">
          {/* Special Actions */}
          <div className="space-y-1 pb-4 border-b border-[#2C2C2E]/60 mb-4">
            <button
              onClick={onCreateNewPlayer}
              className="group relative flex w-full items-center gap-3 py-3.5 text-left border-0 bg-transparent select-none cursor-pointer"
            >
              <span className="absolute inset-y-0 -left-4 -right-4 bg-transparent group-active:bg-[#1C1C1E] transition-colors duration-150 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#1C1C1E] shrink-0">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="relative z-10 text-base font-semibold text-white tracking-tight">Create & schedule new player</span>
            </button>
            <button
              onClick={onAddGuest}
              className="group relative flex w-full items-center gap-3 py-3.5 text-left border-0 bg-transparent select-none cursor-pointer"
            >
              <span className="absolute inset-y-0 -left-4 -right-4 bg-transparent group-active:bg-[#1C1C1E] transition-colors duration-150 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#1C1C1E] shrink-0">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <span className="relative z-10 text-base font-semibold text-white tracking-tight">Schedule with guest player</span>
            </button>
          </div>

          {/* Player List */}
          <div className="space-y-2">
            {filteredPlayers.map((player) => {
              const isSelected = localSelectedIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`flex items-center justify-between p-3 rounded-[20px] transition-all cursor-pointer select-none ${isSelected
                    ? 'bg-[#1C1C1E] border border-[#68BD44]/40'
                    : 'bg-[#1C1C1E]/60 hover:bg-[#1C1C1E] border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      initials={player.name[0]}
                      size="lg"
                      hasBorder={false}
                    />
                    <h4 className="font-sans text-base font-semibold text-white tracking-tight">
                      {player.name}
                    </h4>
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayer(player.id);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95 shrink-0 ${isSelected
                      ? 'bg-[#68BD44] text-[#050505] shadow-md shadow-[#68BD44]/20'
                      : 'bg-[#2C2C2E] text-white hover:bg-[#3A3A3C]'
                      }`}
                  >
                    {isSelected ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progressive Blur and Action Button */}
        <div className="fixed bottom-0 inset-x-0 h-[100px] z-[165] pointer-events-none">
          <div
            className="mx-auto max-w-[480px] h-full bg-gradient-to-t from-[#121212] via-[#121212]/85 to-transparent backdrop-blur-md"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        <div className="fixed bottom-[48px] inset-x-0 z-[170] pointer-events-none">
          <div className="mx-auto max-w-[480px] px-4">
            <Button
              onClick={handleSelect}
              fullWidth
              disabled={localSelectedIds.length === 0}
              className="pointer-events-auto shadow-lg shadow-[#68BD44]/20"
            >
              {mode === 'single' ? 'Select' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
