import React, { useState, useMemo } from 'react';
import { BottomSheet } from './BottomSheet';
import { Avatar } from './Avatar';
import { Button } from './button';
import { Input } from './Input';
import { Player } from '../../types';
import { useAppStore } from '../../store/appStore';
import { Search, Plus, UserPlus } from 'lucide-react';

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
          <div className="space-y-4 pb-4 border-b border-[#2C2C2E]/60 mb-4">
            <button
              onClick={onCreateNewPlayer}
              className="flex items-center gap-4 w-full text-left"
            >
              <Plus className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Create & schedule new player</span>
            </button>
            <button
              onClick={onAddGuest}
              className="flex items-center gap-4 w-full text-left"
            >
              <UserPlus className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Schedule with guest player</span>
            </button>
          </div>

          {/* Player List */}
          <div className="space-y-4">
            {filteredPlayers.map((player) => {
              const isSelected = localSelectedIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded-md border-2 ${isSelected ? 'border-[#68BD44] bg-[#68BD44]' : 'border-[#2C2C2E]'}`}>
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <Avatar
                    src={player.avatarUrl}
                    alt={player.name}
                    initials={player.name[0]}
                    size="sm"
                    hasBorder={false}
                  />
                  <span className="text-sm font-medium text-white">{player.name}</span>
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
