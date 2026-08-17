import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { Card } from '../../shared/ui/card';
import { CourtCard } from '../../entities/court/ui/CourtCard';
import { EmptyState } from '../../shared/ui/EmptyState';
import { MatchHistoryCard } from '../../entities/match/ui/MatchHistoryCard';
import { Avatar } from '../../shared/ui/Avatar';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { ActiveGameSheet } from '../../entities/match/ui/ActiveGameSheet';
import { InviteView } from './InviteView';
import { Player, Court } from '../../shared/types/index';
import { Play, Plus, Pause, Square, Zap, Users, History } from 'lucide-react';

import { Dialog } from '../../shared/ui/Dialog';
import { ClosedSessionBanner } from '../../widgets/layout/ClosedSessionBanner';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    role,
    playerState,
    isHardmode,
    toggleHardmode,
    toggleCourtAvailability,
    startTraining,
    sitOut,
    stopTraining,
    continueToPlay,
    courts,
    todaysPlayers,
    recentMatches,
    isMatchDetailOpen,
    setMatchDetailOpen,
    isSessionActive,
    toggleSession,
    setActiveTab,
  } = useAppStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEndSessionConfirmOpen, setIsEndSessionConfirmOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedGameCourt, setSelectedGameCourt] = useState<Court | null>(null);

  const handleInvite = () => {
    setIsInviteOpen(true);
  };

  return (
    <div className="space-y-6 pb-36 px-4 max-w-[480px] mx-auto select-none">
      {/* 1. Statistics Section (Figma Node: 11420:16325, gap=8px, h=73px, radius=20px) */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="flex flex-col justify-between p-2.5 bg-card rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.gamesPlayed}
          </span>
          <span className="font-sans text-xs font-medium text-muted-foreground tracking-tight">
            Games played
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-card rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.wins}
          </span>
          <span className="font-sans text-xs font-medium text-muted-foreground tracking-tight">
            Wins
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-card rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.bpToday.toFixed(1)}
          </span>
          <span className="font-sans text-xs font-medium text-muted-foreground tracking-tight">
            BP today
          </span>
        </Card>
      </div>

      {/* 2. Dynamic Action Buttons Container (Only shown when a training session is active) */}
      {isSessionActive && (
        <div className="flex flex-col items-center">
          {/* STATE 1: Spectating ("Start training" mode) */}
          {playerState === 'spectating' && (
            <div className="w-full text-center">
              <button
                onClick={startTraining}
                className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary/90"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </button>
              <span className="mt-2 block font-sans text-sm font-medium text-muted-foreground">
                Start training
              </span>
            </div>
          )}

          {/* STATE 2: Queued / Match Found / Active mode */}
          {(playerState === 'queued' || playerState === 'match_found' || playerState === 'playing') && (
            <div className="flex w-full items-center gap-2.5 text-center">
              {/* Sit out button */}
              <div className="flex flex-[0.9] flex-col items-center">
                <button
                  onClick={sitOut}
                  className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-card text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
                >
                  <Pause className="h-5 w-5 fill-current" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                  Sit out
                </span>
              </div>

              {/* Invite to play button */}
              <div className="flex flex-[1.6] flex-col items-center">
                <button
                  onClick={handleInvite}
                  className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                >
                  <Plus className="h-5 w-5 stroke-[3]" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                  Invite to play
                </span>
              </div>

              {/* Hard mode button */}
              <div className="flex flex-[0.9] flex-col items-center">
                <button
                  onClick={toggleHardmode}
                  className={`flex h-[44px] w-full items-center justify-center rounded-[20px] transition-all active:scale-95 ${isHardmode
                      ? 'bg-primary/20 text-primary'
                      : 'bg-card text-white hover:bg-brand-surfaceElevated'
                    }`}
                >
                  <Zap className="h-5 w-5" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                  Hard mode
                </span>
              </div>
            </div>
          )}

          {/* STATE 3: Resting mode ("Sit out" active) */}
          {playerState === 'resting' && (
            <div className="grid w-full grid-cols-2 gap-3 text-center">
              {/* Stop button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={stopTraining}
                  className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-card text-white transition-all active:scale-95 hover:bg-brand-surfaceElevated"
                >
                  <Square className="h-5 w-5 fill-current" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                  Stop
                </span>
              </div>

              {/* Continue to play button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={continueToPlay}
                  className="flex h-[44px] w-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                >
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-muted-foreground">
                  Continue to play
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Session Status Banner / Controls (Courts & Players disabled when training has not started) */}
      {!isSessionActive ? (
        (() => {
          const nextSession = "Today at 20:00";
          return (
            <div className="space-y-4">
              <ClosedSessionBanner
                nextSessionTime={nextSession}
                description={
                  role === 'coach'
                    ? undefined // Uses default universal coach text
                    : nextSession
                      ? 'A training session is scheduled. Get ready to join when it starts!'
                      : 'There are no active training sessions scheduled right now. Check back soon!'
                }
              >
            {/* Coach Actions */}
            {role === 'coach' && (
              <>
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
              </>
            )}
          </ClosedSessionBanner>
        </div>
          );
        })()
      ) : (
        <>
          {/* 3. Courts Horizontal Slider Section (Scrollbar Hidden, radius=24px) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-bold text-white tracking-tight">Courts</h2>
                <span className="font-display text-lg font-normal text-muted-foreground">
                  {courts.filter((c) => c.isAvailable).length}/6
                </span>
              </div>

              {role === 'coach' && (
                <button
                  onClick={() => setIsEndSessionConfirmOpen(true)}
                  className="font-sans text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  End Session
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Courts with Invisible Scrollbar */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {courts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  showCoachToggle={role === 'coach'}
                  onToggleAvailability={toggleCourtAvailability}
                  onSelectCourt={(c) => setSelectedGameCourt(c)}
                />
              ))}
            </div>
          </div>

          {/* 4. Today's Players Horizontal Row */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's players</h2>
              <span className="font-display text-lg font-normal text-muted-foreground">
                {todaysPlayers.length}
              </span>
            </div>

            {todaysPlayers.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                {todaysPlayers.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    onClick={() => setSelectedPlayer(player)}
                    className="cursor-pointer hover:opacity-90 active:scale-95 transition-all"
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

      {/* Player Detail Sheet Modal */}
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

      {/* Active Game Detail Sheet Modal */}
      <ActiveGameSheet
        isOpen={isMatchDetailOpen || !!selectedGameCourt}
        onClose={() => {
          setMatchDetailOpen(false);
          setSelectedGameCourt(null);
        }}
      />

      {/* 5. Recent Games Section */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-white tracking-tight">Recent games</h2>

        {recentMatches.length > 0 ? (
          <div className="flex flex-col">
            {recentMatches.map((match) => (
              <MatchHistoryCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <EmptyState message="No games yet" icon={History} />
        )}
      </div>

      {/* Full Page Invite View Overlay (z-[100] hides tab bar completely) */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-[100] bg-background animate-in fade-in slide-in-from-bottom duration-200 !mt-0">
          <InviteView onClose={() => setIsInviteOpen(false)} />
        </div>
      )}

      {/* Modals and Sheets */}

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
    </div>
  );
};
