import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { CourtCard } from '../../entities/court/ui/CourtCard';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Avatar } from '../../shared/ui/Avatar';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { ActiveGameSheet } from '../../entities/match/ui/ActiveGameSheet';
import { Dialog } from '../../shared/ui/Dialog';
import { InviteView } from '../player/InviteView';
import { Player, Court } from '../../shared/types/index';
import { Play, Plus, Pause, Square, Users, CalendarClock } from 'lucide-react';
import { PrivateSessionFlow } from '../../widgets/flows/PrivateSessionFlow';
import { PublicAttendanceFlow } from '../../widgets/flows/PublicAttendanceFlow';
import { SessionDetailsSheet } from '../../features/session/SessionDetailsSheet';
import { ClosedSessionBanner } from '../../widgets/layout/ClosedSessionBanner';
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

import { ScheduleSessionView } from './ScheduleSessionView';

export const CoachHomeView: React.FC = () => {
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

  const activeCourtsCount = courts.filter((c) => c.isAvailable).length;

  return (
    <div className="space-y-6 pb-28 px-4 max-w-[480px] mx-auto select-none">
      {/* 1. Session Status Banner for Coach */}
      {!isSessionActive ? (
        <ClosedSessionBanner>
          <button
            onClick={toggleSession}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-sans text-sm font-bold transition-all active:scale-95 hover:bg-primary/90 cursor-pointer shadow-lg shadow-primary/20"
          >
            Start training
          </button>
          <button
            onClick={() => setActiveTab('public_schedule')}
            className="w-full h-12 rounded-full bg-secondary text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-secondary/80 cursor-pointer border border-secondary/80"
          >
            Schedule training
          </button>
        </ClosedSessionBanner>
      ) : (
        <>
          {/* Dynamic Action Buttons Container */}
          <div className="flex flex-col items-center">
            {/* STATE 1: Spectating ("Start training" mode) */}
            {playerState === 'spectating' && (
              <div className="w-full text-center">
                <button
                  onClick={startTraining}
                  className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary/90"
                >
                  <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground ml-0.5" />
                </button>
                <span className="mt-2 block font-sans text-sm font-medium text-muted-foreground">
                  Start training
                </span>
              </div>
            )}

            {/* STATE 2: Queued / Match Found mode for Coach */}
            {(playerState === 'queued' || playerState === 'match_found') && (
              <div className="grid grid-cols-2 gap-2.5 w-full text-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={sitOut}
                    className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-card text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
                  >
                    <Pause className="h-5 w-5 fill-white text-white" />
                  </button>
                  <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                    Sit out
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleInvite}
                    className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                  >
                    <Plus className="h-5 w-5 stroke-[3] text-primary-foreground" />
                  </button>
                  <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                    Invite to play
                  </span>
                </div>
              </div>
            )}

            {/* STATE 3: Resting mode */}
            {playerState === 'resting' && (
              <div className="grid w-full grid-cols-2 gap-3 text-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={stopTraining}
                    className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-card text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
                  >
                    <Square className="h-5 w-5 fill-white text-white" />
                  </button>
                  <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                    Stop
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={continueToPlay}
                    className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                  >
                    <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground ml-0.5" />
                  </button>
                  <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                    Continue to play
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Courts Horizontal Slider Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-bold text-white tracking-tight">Courts</h2>
                <span className="font-display text-lg font-normal text-muted-foreground">
                  {activeCourtsCount}/6
                </span>
              </div>

              <button
                onClick={() => setIsEndSessionConfirmOpen(true)}
                className="font-sans text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                End Session
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  showCoachToggle={role === 'coach'}
                  onToggleAvailability={toggleCourtAvailability}
                  onSelectCourt={(c) => setSelectedCourt(c)}
                />
              ))}
            </div>
          </div>

          {/* 3. Today's Players Horizontal Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's players</h2>
                <span className="font-display text-lg font-normal text-muted-foreground">
                  {todaysPlayers.length}
                </span>
              </div>

              <button 
                onClick={() => setIsPublicFlowOpen(true)}
                className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
              >
                <Plus className="h-4 w-4 stroke-[3]" /> Add
              </button>
            </div>

            {todaysPlayers.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                {todaysPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
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
              <EmptyState message="No players yet" icon={Users} />
            )}
          </div>
        </>
      )}

      {/* 4. Today's Privates Section (Figma Node: 11562:13788) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's privates</h2>
            <span className="font-display text-lg font-normal text-muted-foreground">
              {mockPrivateSessions.length}
            </span>
          </div>

          <button 
            onClick={() => setIsPrivateFlowOpen(true)}
            className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Add
          </button>
        </div>

        {mockPrivateSessions.length > 0 ? (
          <div className="flex flex-col border-t border-border/60 pt-1">
            {mockPrivateSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedPrivateSession(session)}
                className="flex items-center justify-between py-3 border-b border-dashed border-border/60 last:border-b-0 cursor-pointer hover:bg-brand-surfaceElevated transition-colors active:scale-[0.98] px-2 -mx-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={session.avatarUrl}
                    alt={session.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-display text-base font-semibold text-white tracking-tight">
                    {session.name}
                  </span>
                </div>

                <span className="font-display text-base font-normal text-muted-foreground">
                  {session.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No scheduled sessions yet" icon={CalendarClock} />
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
      />

      {/* Session Details Sheet Modal */}
      <SessionDetailsSheet
        isOpen={!!selectedPrivateSession}
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
        title="End Public Session"
        description="Are you sure you want to end the current training session? All active court matchmaking and player check-ins will be closed."
        primaryButtonText="Confirm End"
        primaryButtonOnClick={() => {
          setIsEndSessionConfirmOpen(false);
          toggleSession();
        }}
        secondaryButtonText="Cancel"
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
