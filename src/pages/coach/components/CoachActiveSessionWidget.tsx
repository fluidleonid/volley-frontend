import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Square, Plus } from 'lucide-react';
import { PlayerState } from '../../../shared/types/index';
import { ClosedSessionBanner } from '../../../widgets/layout/ClosedSessionBanner';

export interface CoachActiveSessionWidgetProps {
  isSessionActive: boolean;
  playerState: PlayerState;
  onToggleSession: () => void;
  onScheduleTraining: () => void;
  onStartTraining: () => void;
  onSitOut: () => void;
  onStopTraining: () => void;
  onContinueToPlay: () => void;
  onInvite: () => void;
}

export const CoachActiveSessionWidget: React.FC<CoachActiveSessionWidgetProps> = ({
  isSessionActive,
  playerState,
  onToggleSession,
  onScheduleTraining,
  onStartTraining,
  onSitOut,
  onStopTraining,
  onContinueToPlay,
  onInvite,
}) => {
  const { t } = useTranslation();

  if (!isSessionActive) {
    return (
      <ClosedSessionBanner>
        <button
          onClick={onToggleSession}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground font-sans text-sm font-bold transition-all active:scale-95 hover:bg-primary/90 cursor-pointer shadow-lg shadow-primary/20"
        >
          {t('home.startTraining')}
        </button>
        <button
          onClick={onScheduleTraining}
          className="w-full h-12 rounded-full bg-secondary text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-secondary/80 cursor-pointer border border-secondary/80"
        >
          {t('home.scheduleTraining')}
        </button>
      </ClosedSessionBanner>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* STATE 1: Spectating ("Start training" mode) */}
      {playerState === 'spectating' && (
        <div className="w-full text-center">
          <button
            onClick={onStartTraining}
            className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary/90"
          >
            <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground ml-0.5" />
          </button>
          <span className="mt-2 block font-sans text-sm font-medium text-muted-foreground">
            {t('home.startTraining')}
          </span>
        </div>
      )}

      {/* STATE 2: Queued / Match Found mode for Coach */}
      {(playerState === 'queued' || playerState === 'match_found') && (
        <div className="grid grid-cols-2 gap-2.5 w-full text-center">
          <div className="flex flex-col items-center">
            <button
              onClick={onSitOut}
              className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-secondary text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
            >
              <Pause className="h-5 w-5 fill-white text-white" />
            </button>
            <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
              {t('home.sitOut')}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onInvite}
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 stroke-[3] text-primary-foreground" />
            </button>
            <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
              {t('home.inviteToPlay')}
            </span>
          </div>
        </div>
      )}

      {/* STATE 3: Resting mode */}
      {playerState === 'resting' && (
        <div className="grid w-full grid-cols-2 gap-3 text-center">
          <div className="flex flex-col items-center">
            <button
              onClick={onStopTraining}
              className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-secondary text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
            >
              <Square className="h-5 w-5 fill-white text-white" />
            </button>
            <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
              {t('home.stop')}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onContinueToPlay}
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
            >
              <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground ml-0.5" />
            </button>
            <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
              {t('home.continueToPlay')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
