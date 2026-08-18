import React from 'react';
import { useTranslation } from 'react-i18next';
import { Court, Player } from '../../../shared/types/index';
import { CourtCard } from '../../../entities/court/ui/CourtCard';

export interface CoachCourtsGridProps {
  courts: Court[];
  todaysPlayers: Player[];
  role: 'coach' | 'player';
  onToggleAvailability: (courtId: string) => void;
  onSelectCourt: (court: Court) => void;
  onEndSession: () => void;
}

export const CoachCourtsGrid: React.FC<CoachCourtsGridProps> = ({
  courts,
  todaysPlayers,
  role,
  onToggleAvailability,
  onSelectCourt,
  onEndSession,
}) => {
  const { t } = useTranslation();
  const activeCourtsCount = courts.filter((c) => c.isAvailable).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <h2 className="font-display text-lg font-bold text-white tracking-tight">
            {t('home.courts')}
            <span className="font-normal text-muted-foreground ml-1.5">
              {activeCourtsCount}/{courts.length}
            </span>
          </h2>
        </div>

        <button
          onClick={onEndSession}
          className="font-sans text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer"
        >
          {t('home.endSession')}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {courts.map((court) => {
          const teamAPlayers = court.teamAIds.map(id => todaysPlayers.find(p => p.id === id)).filter(Boolean) as Player[];
          const teamBPlayers = court.teamBIds.map(id => todaysPlayers.find(p => p.id === id)).filter(Boolean) as Player[];
          return (
            <CourtCard
              key={court.id}
              court={court}
              teamAPlayers={teamAPlayers}
              teamBPlayers={teamBPlayers}
              showCoachToggle={role === 'coach'}
              onToggleAvailability={onToggleAvailability}
              onSelectCourt={onSelectCourt}
            />
          );
        })}
      </div>
    </div>
  );
};
