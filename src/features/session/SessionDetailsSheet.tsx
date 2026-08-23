import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Player } from '../../shared/types/index';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/button';
import { Dialog } from '../../shared/ui/Dialog';
import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import whistleIcon from '../../shared/assets/icons/whistle-fill.svg';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { useAppStore } from '../../app/store/appStore';

interface SessionDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  player: Player | null;
  onAvatarClick?: () => void;
  hasParent?: boolean;
  sessionDate?: string;
  sessionTime?: string;
  onReschedule?: () => void;
  onCancel?: () => void;
  isPast?: boolean;
}

export const SessionDetailsSheet: React.FC<SessionDetailsSheetProps> = ({
  isOpen,
  onClose,
  onCloseAll,
  player,
  hasParent,
  sessionDate = new Date().toISOString().split('T')[0],
  sessionTime = '18:00',
  onReschedule,
  onCancel,
  isPast,
}) => {
  const { t } = useTranslation();
  const { role, currentUser } = useAppStore();
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isPlayerProfileOpen, setIsPlayerProfileOpen] = useState(false);
  const [isCoachProfileOpen, setIsCoachProfileOpen] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setIsCancelConfirmOpen(false);
      setIsPlayerProfileOpen(false);
      setIsCoachProfileOpen(false);
    }
  }, [isOpen]);

  if (!isOpen || !player) return null;

  const displayPlayer = role === 'player' ? currentUser : player;

  const displayCoach: Player = role === 'coach' ? currentUser : {
    id: player.id || 'coach-1',
    name: player.name,
    avatarUrl: player.avatarUrl,
    level: 10,
    xp: 0,
    status: 'spectating',
    gamesPlayed: 0,
    wins: 0,
    bpToday: 0,
    winStreak: 0,
    hasTelegram: true,
  };

  return (
    <>
    <BottomSheet isOpen={isOpen && !isPlayerProfileOpen && !isCoachProfileOpen} onClose={onClose} title={t('profile.sessionDetails', 'Session details')} hasParent={hasParent}>
      <div className="flex flex-col items-center mt-2 px-2 pb-2">
          <div className="flex items-center justify-center gap-5">
            {/* Player Avatar */}
            <div className="relative cursor-pointer active:scale-95 transition-transform" onClick={() => setIsPlayerProfileOpen(true)}>
              <Avatar 
                src={displayPlayer.avatarUrl} 
                alt={displayPlayer.name} 
                initials={displayPlayer.name[0]} 
                size="xl" 
                className="border-0"
              />
            </div>
            
            <span className="font-display text-2xl font-bold text-muted-foreground">&</span>
            
            {/* Coach Avatar */}
            <div className="relative cursor-pointer active:scale-95 transition-transform" onClick={() => setIsCoachProfileOpen(true)}>
              <Avatar 
                src={displayCoach.avatarUrl} 
                alt={displayCoach.name} 
                initials={displayCoach.name[0]} 
                size="xl" 
                className="border-0"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1d82f5] flex items-center justify-center border-2 border-background">
                <div className="w-3 h-3 bg-white" style={{ maskImage: `url("${whistleIcon}")`, WebkitMaskImage: `url("${whistleIcon}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
              </div>
            </div>
          </div>

        {/* Metrics Grid similar to MatchDetailSheet */}
        <div className="my-8 grid grid-cols-2 gap-y-6 gap-x-2 text-left pb-4 w-full px-4">
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.date', 'Date')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {sessionDate === new Date().toISOString().split('T')[0] ? t('player.leaderboard.today', 'Today') : sessionDate}
            </div>
          </div>
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.time', 'Time')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {sessionTime}
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="w-full space-y-3 mt-4">
            <Button fullWidth size="xl" variant="secondary" className="gap-2" onClick={() => {
              if (onReschedule) onReschedule();
              else onClose();
            }}>
              <CalendarClock className="w-5 h-5" />
              {t('profile.reschedule', 'Reschedule')}
            </Button>
            <button 
              className="w-full h-[52px] rounded-full bg-card flex items-center justify-center text-[#FF453A] font-bold hover:bg-brand-surfaceElevated active:scale-95 transition-all" 
              onClick={() => setIsCancelConfirmOpen(true)}
            >
              {t('profile.cancelSession', 'Cancel session')}
            </button>
          </div>
        )}
      </div>

      <Dialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        title={t('profile.cancelConfirmTitle', 'Cancel session')}
        description={t('profile.cancelConfirmDesc', 'Are you sure you want to cancel this session? this action cannot be undone.')}
        primaryButtonText={t('profile.cancelSession', 'Cancel session')}
        primaryButtonOnClick={() => {
          setIsCancelConfirmOpen(false);
          if (onCancel) onCancel();
          else onClose();
        }}
        secondaryButtonText={t('common.keep', 'Keep')}
        secondaryButtonOnClick={() => setIsCancelConfirmOpen(false)}
      />
    </BottomSheet>
    
    <PlayerDetailSheet
      isOpen={isPlayerProfileOpen}
      onClose={() => setIsPlayerProfileOpen(false)}
      onCloseAll={onCloseAll || onClose}
      player={displayPlayer}
      hasParent
    />
    
    <PlayerDetailSheet
      isOpen={isCoachProfileOpen}
      onClose={() => setIsCoachProfileOpen(false)}
      onCloseAll={onCloseAll || onClose}
      player={displayCoach}
      isCoachProfile={true}
      hasParent
    />
    </>
  );
};
