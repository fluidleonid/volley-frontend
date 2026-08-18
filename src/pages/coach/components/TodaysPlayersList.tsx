import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users } from 'lucide-react';
import { Player } from '../../../shared/types/index';
import { Avatar } from '../../../shared/ui/Avatar';
import { EmptyState } from '../../../shared/ui/EmptyState';

export interface TodaysPlayersListProps {
  players: Player[];
  onAddPlayer: () => void;
  onSelectPlayer: (player: Player) => void;
}

export const TodaysPlayersList: React.FC<TodaysPlayersListProps> = ({
  players,
  onAddPlayer,
  onSelectPlayer,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <h2 className="font-display text-lg font-bold text-white tracking-tight">
            {t('home.todaysPlayers', "Today's Players")}
            <span className="font-normal text-muted-foreground ml-1.5">
              {players.length}
            </span>
          </h2>
        </div>

        <button 
          onClick={onAddPlayer}
          className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> {t('common.add', 'Add')}
        </button>
      </div>

      {players.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              title={`View ${player.name} details`}
            >
              <Avatar
                src={player.avatarUrl}
                alt={player.name}
                initials={player.name[0]}
                size="lg"
                hasBorder={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message={t('home.noPlayers', 'No players yet')} icon={Users} />
      )}
    </div>
  );
};
