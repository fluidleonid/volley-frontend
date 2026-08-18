import React, { useState, useMemo } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/Input';
import { Player } from '../../shared/types/index';
import { useAppStore } from '../../app/store/appStore';
import { Search, Plus, Check, HatGlasses } from 'lucide-react';

interface SelectPlayerForSessionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  mode?: 'single' | 'multiple';
  title?: string;
  subtitle?: string;
  selectedPlayerIds?: string[];
  onSelectPlayer?: (player: Player) => void;
  onSelectPlayers?: (players: Player[]) => void;
  onAddGuest?: () => void;
  onCreateNewPlayer?: () => void;
  hideAddButtons?: boolean;
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
  hideAddButtons = false,
}) => {
  const { t } = useTranslation();
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
      <p className="font-sans text-xs text-muted-foreground font-normal">
        {subtitle}
      </p>
    </div>
  );

  const footerButton = (
    <Button
      onClick={handleSelect}
      fullWidth
      size="xl"
      disabled={localSelectedIds.length === 0}
      className="pointer-events-auto shadow-lg shadow-primary/20"
    >
      {mode === 'single' ? t('common.select', 'Select') : t('common.add', 'Add')}
    </Button>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={160} topOffset={84} footer={footerButton}>
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden pt-1">
        {/* Search Input */}
        <div className="pb-4 shrink-0">
          <Input
            variant="search"
            icon={<Search className="h-5 w-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('coach.players.searchPlaceholder', 'Search player')}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-36 scrollbar-none -mx-4 px-4">
          {/* Special Actions */}
          {!hideAddButtons && (
            <div className="space-y-1 pb-4 border-b border-border/60 mb-4">
              <button
                onClick={onCreateNewPlayer}
                className="group relative flex w-full items-center gap-3 py-3.5 text-left border-0 bg-transparent select-none cursor-pointer"
              >
                <span className="absolute inset-y-0 -left-4 -right-4 bg-transparent group-active:bg-card transition-colors duration-150 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-secondary shrink-0">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <span className="relative z-10 text-base font-semibold text-white tracking-tight">{t('coach.players.createScheduleNew', 'Create & schedule new player')}</span>
              </button>
              <button
                onClick={onAddGuest}
                className="group relative flex w-full items-center gap-3 py-3.5 text-left border-0 bg-transparent select-none cursor-pointer"
              >
                <span className="absolute inset-y-0 -left-4 -right-4 bg-transparent group-active:bg-card transition-colors duration-150 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-secondary shrink-0">
                  <HatGlasses className="h-5 w-5 text-primary" />
                </div>
                <span className="relative z-10 text-base font-semibold text-white tracking-tight">{t('coach.players.scheduleWithGuest', 'Schedule with guest player')}</span>
              </button>
            </div>
          )}

          {/* Player List */}
          <div className="space-y-2">
            {filteredPlayers.map((player) => {
              const isSelected = localSelectedIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`flex items-center justify-between p-3 rounded-[20px] transition-all cursor-pointer select-none ${isSelected
                    ? 'bg-card border border-primary/40'
                    : 'bg-card/60 hover:bg-card border border-transparent'
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
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-secondary text-white hover:bg-secondary/80'
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
      </div>
    </BottomSheet>
  );
};
