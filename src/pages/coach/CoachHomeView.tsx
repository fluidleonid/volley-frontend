import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { ActiveGameSheet } from '../../entities/match/ui/ActiveGameSheet';
import { Dialog } from '../../shared/ui/Dialog';
import { InviteView } from '../player/InviteView';
import { Player, Court } from '../../shared/types/index';
import { Plus, CalendarClock } from 'lucide-react';
import { PrivateSessionFlow } from '../../widgets/flows/PrivateSessionFlow';
import { PublicAttendanceFlow } from '../../widgets/flows/PublicAttendanceFlow';
import { SessionDetailsSheet } from '../../features/session/SessionDetailsSheet';
import { SessionListItem } from '../../entities/session/ui/SessionListItem';
import { CoachActiveSessionWidget } from './components/CoachActiveSessionWidget';
import { CoachCourtsGrid } from './components/CoachCourtsGrid';
import { TodaysPlayersList } from './components/TodaysPlayersList';

interface PrivateSession {
  id: string;
  name: string;
  avatarUrl: string;
  time: string;
}

const mockPrivateSessions: PrivateSession[] = [
  {
    id: 'p-1',
    name: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    time: '10:00',
  },
  {
    id: 'p-2',
    name: 'Alena Krasnova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    time: '12:00',
  },
];


export const CoachHomeView: React.FC = () => {
  const { t } = useTranslation();
  const {
    role,
    playerState,
    toggleCourtAvailability,
    startTraining,
    sitOut,
    stopTraining,
    continueToPlay,
    courts,
    todaysPlayers,
    isSessionActive,
    toggleSession,
    setActiveTab,
  } = useAppStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEndSessionConfirmOpen, setIsEndSessionConfirmOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const [isPrivateFlowOpen, setIsPrivateFlowOpen] = useState(false);
  const [isRescheduleFlowOpen, setIsRescheduleFlowOpen] = useState(false);
  const [reschedulePlayer, setReschedulePlayer] = useState<PrivateSession | null>(null);
  const [isPublicFlowOpen, setIsPublicFlowOpen] = useState(false);
  const [selectedPrivateSession, setSelectedPrivateSession] = useState<PrivateSession | null>(null);

  const handleInvite = () => {
    setIsInviteOpen(true);
  };

  return (
    <div className="space-y-6 pb-28 px-4 max-w-[480px] mx-auto select-none">
      {/* 1. Session Status Banner & Dynamic Action Buttons */}
      <CoachActiveSessionWidget
        isSessionActive={isSessionActive}
        playerState={playerState}
        onToggleSession={toggleSession}
        onScheduleTraining={() => setActiveTab('public_schedule')}
        onStartTraining={startTraining}
        onSitOut={sitOut}
        onStopTraining={stopTraining}
        onContinueToPlay={continueToPlay}
        onInvite={handleInvite}
      />

      {isSessionActive && (
        <>
          {/* 2. Courts Horizontal Slider Section */}
          <CoachCourtsGrid
            courts={courts}
            todaysPlayers={todaysPlayers}
            role={role}
            onToggleAvailability={toggleCourtAvailability}
            onSelectCourt={(c) => setSelectedCourt(c)}
            onEndSession={() => setIsEndSessionConfirmOpen(true)}
          />

          {/* 3. Today's Players Horizontal Row */}
          <TodaysPlayersList
            players={todaysPlayers}
            onAddPlayer={() => setIsPublicFlowOpen(true)}
            onSelectPlayer={(p) => setSelectedPlayer(p)}
          />
        </>
      )}

      {/* 4. Today's Privates Section (Figma Node: 11562:13788) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">
              {t('home.todaysPrivates', "Today's privates")}
              <span className="font-normal text-muted-foreground ml-1.5">
                {mockPrivateSessions.length}
              </span>
            </h2>
          </div>

          <button 
            onClick={() => setIsPrivateFlowOpen(true)}
            className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> {t('common.add', 'Add')}
          </button>
        </div>

        {mockPrivateSessions.length > 0 ? (
          <div className="flex flex-col border-t border-border/60 pt-1">
            {mockPrivateSessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                onClick={(s) => setSelectedPrivateSession(s)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={t('home.noScheduledSessionsYet', 'No scheduled sessions yet')} icon={CalendarClock} />
        )}
      </div>

      {/* Active Game Sheet Modal for Coach */}
      <ActiveGameSheet
        isOpen={!!selectedCourt}
        onClose={() => setSelectedCourt(null)}
      />

      {/* Player Detail Sheet Modal (Admin View) */}
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        hasParent={!!selectedPrivateSession}
        onCloseAll={() => {
          setSelectedPlayer(null);
          setSelectedPrivateSession(null);
        }}
      />

      {/* Session Details Sheet Modal */}
      <SessionDetailsSheet
        isOpen={!!selectedPrivateSession && !selectedPlayer}
        onClose={() => setSelectedPrivateSession(null)}
        player={selectedPrivateSession ? {
          id: selectedPrivateSession.id,
          name: selectedPrivateSession.name,
          avatarUrl: selectedPrivateSession.avatarUrl,
          level: 10,
          xp: 0,
          status: 'spectating',
          gamesPlayed: 0,
          wins: 0,
          bpToday: 0,
          winStreak: 0,
          hasTelegram: true,
        } : null}
        sessionTime={selectedPrivateSession?.time}
        onReschedule={() => {
          setReschedulePlayer(selectedPrivateSession);
          setSelectedPrivateSession(null);
          setIsRescheduleFlowOpen(true);
        }}
        onCancel={() => {
          setSelectedPrivateSession(null);
        }}
        onAvatarClick={() => {
          if (selectedPrivateSession) {
            setSelectedPlayer({
              id: selectedPrivateSession.id,
              name: selectedPrivateSession.name,
              avatarUrl: selectedPrivateSession.avatarUrl,
              level: 10,
              xp: 0,
              status: 'spectating',
              gamesPlayed: 0,
              wins: 0,
              bpToday: 0,
              winStreak: 0,
              hasTelegram: true,
            });
          }
        }}
      />

      {/* Full Page Invite View Overlay */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-[100] bg-background !mt-0">
          <InviteView onClose={() => setIsInviteOpen(false)} />
        </div>
      )}

      {/* Full Page Schedule Session View Overlay */}
      {/* End Session Confirmation Dialog */}
      <Dialog
        isOpen={isEndSessionConfirmOpen}
        onClose={() => setIsEndSessionConfirmOpen(false)}
        title={t('home.endSessionTitle')}
        description={t('home.endSessionDesc')}
        primaryButtonText={t('home.confirmEnd')}
        primaryButtonOnClick={() => {
          setIsEndSessionConfirmOpen(false);
          toggleSession();
        }}
        secondaryButtonText={t('home.cancel')}
        secondaryButtonOnClick={() => setIsEndSessionConfirmOpen(false)}
      />

      <PrivateSessionFlow 
        isOpen={isPrivateFlowOpen}
        onClose={() => setIsPrivateFlowOpen(false)}
        onSchedule={(data) => {
          console.log('Scheduled private session', data);
        }}
      />

      <PrivateSessionFlow 
        isOpen={isRescheduleFlowOpen}
        onClose={() => {
          setIsRescheduleFlowOpen(false);
          setReschedulePlayer(null);
        }}
        initialPlayer={reschedulePlayer ? {
          id: reschedulePlayer.id,
          name: reschedulePlayer.name,
          avatarUrl: reschedulePlayer.avatarUrl,
          level: 10,
          xp: 0,
          status: 'spectating',
          gamesPlayed: 0,
          wins: 0,
          bpToday: 0,
          winStreak: 0,
          hasTelegram: true,
        } : null}
        readOnlyPlayer={true}
        onSchedule={(data) => {
          console.log('Rescheduled private session', data);
        }}
      />

      <PublicAttendanceFlow 
        isOpen={isPublicFlowOpen}
        onClose={() => setIsPublicFlowOpen(false)}
        onAddPlayers={(players) => {
          console.log('Added players to public session', players);
        }}
        onAddGuest={(data) => {
          console.log('Added guest to public session', data);
        }}
        onCreatePlayer={(data) => {
          console.log('Created player in public session', data);
        }}
      />
    </div>
  );
};
