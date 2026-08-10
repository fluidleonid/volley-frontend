import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { CourtCard } from '../components/courts/CourtCard';
import { EmptyState } from '../components/ui/EmptyState';
import { MatchHistoryCard } from '../components/ui/MatchHistoryCard';
import { Avatar } from '../components/ui/Avatar';
import { PlayerDetailSheet } from '../components/ui/PlayerDetailSheet';
import { ActiveGameSheet } from '../components/ui/ActiveGameSheet';
import { InviteView } from './InviteView';
import { Player, Court } from '../types';
import { Play, Plus, Pause, Square, Zap, Users, History } from 'lucide-react';

import { BottomSheet } from '../components/ui/BottomSheet';
import { ScheduleSessionView } from './ScheduleSessionView';

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
  } = useAppStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
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
        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.gamesPlayed}
          </span>
          <span className="font-sans text-xs font-medium text-[#8E8E93] tracking-tight">
            Games played
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.wins}
          </span>
          <span className="font-sans text-xs font-medium text-[#8E8E93] tracking-tight">
            Wins
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.bpToday.toFixed(1)}
          </span>
          <span className="font-sans text-xs font-medium text-[#8E8E93] tracking-tight">
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
                className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] shadow-lg shadow-[#68BD44]/20 transition-all active:scale-[0.98] hover:bg-[#5AA739]"
              >
                <Play className="h-5 w-5 fill-[#050505] text-[#050505] ml-0.5" />
              </button>
              <span className="mt-2 block font-sans text-sm font-medium text-[#8E8E93]">
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
                  className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] text-white transition-all active:scale-95 hover:bg-[#242426]"
                >
                  <Pause className="h-5 w-5 fill-white text-white" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                  Sit out
                </span>
              </div>

              {/* Invite to play button */}
              <div className="flex flex-[1.6] flex-col items-center">
                <button
                  onClick={handleInvite}
                  className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739]"
                >
                  <Plus className="h-5 w-5 stroke-[3] text-[#050505]" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                  Invite to play
                </span>
              </div>

              {/* Hard mode button */}
              <div className="flex flex-[0.9] flex-col items-center">
                <button
                  onClick={toggleHardmode}
                  className={`flex h-[44px] w-full items-center justify-center rounded-[20px] transition-all active:scale-95 ${
                    isHardmode
                      ? 'bg-[#68BD44]/20 text-[#68BD44]'
                      : 'bg-[#1C1C1E] text-white hover:bg-[#242426]'
                  }`}
                >
                  <Zap className={`h-5 w-5 ${isHardmode ? 'text-[#68BD44]' : 'text-white'}`} />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
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
                  className="flex h-[44px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] text-white transition-all active:scale-95 hover:bg-[#242426]"
                >
                  <Square className="h-5 w-5 fill-white text-white" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                  Stop
                </span>
              </div>

              {/* Continue to play button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={continueToPlay}
                  className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739]"
                >
                  <Play className="h-5 w-5 fill-[#050505] text-[#050505] ml-0.5" />
                </button>
                <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                  Continue to play
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Session Status Banner / Controls (Courts & Players disabled when training has not started) */}
      {!isSessionActive ? (
        <div className="space-y-4">
          {/* Banner Card with h-[400px] matching requested height */}
          <div className="relative overflow-hidden rounded-[40px] bg-[#1C1C1E] p-6 border border-[#2C2C2E]/60 shadow-2xl flex flex-col justify-between h-[400px]">
            {/* Banner Decorative Background Placeholder Graphic */}
            <div className="absolute right-0 top-1/3 -translate-y-1/2 w-64 h-64 rounded-full bg-[#68BD44]/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 pointer-events-none flex items-center justify-center text-white text-9xl font-bold">
              🎾
            </div>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2C2C2E] px-3.5 py-1 text-xs font-semibold text-[#8E8E93]">
                <span>Public Open Session</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-snug">
                No active training session
              </h3>
              <p className="font-sans text-sm text-[#8E8E93] leading-relaxed max-w-[320px]">
                {role === 'coach'
                  ? 'Start or schedule a training session to open court matchmaking and player check-ins.'
                  : 'There are no active training sessions scheduled right now. Check back soon!'}
              </p>
            </div>

            {/* Coach Actions */}
            {role === 'coach' && (
              <div className="flex flex-col gap-2.5 pt-4 z-10 w-full">
                <button
                  onClick={toggleSession}
                  className="w-full h-12 rounded-full bg-[#68BD44] text-[#050505] font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer shadow-lg shadow-[#68BD44]/20"
                >
                  Start training
                </button>
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full h-12 rounded-full bg-[#2C2C2E] text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#3A3A3C] cursor-pointer border border-[#3A3A3C]"
                >
                  Schedule training
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 3. Courts Horizontal Slider Section (Scrollbar Hidden, radius=24px) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-bold text-white tracking-tight">Courts</h2>
                <span className="font-display text-lg font-normal text-[#8E8E93]">
                  {courts.filter((c) => c.isAvailable).length}/6
                </span>
              </div>

              {role === 'coach' && (
                <button
                  onClick={() => setIsEndSessionConfirmOpen(true)}
                  className="font-sans text-sm font-bold text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
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
              <span className="font-display text-lg font-normal text-[#8E8E93]">
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
        <div className="fixed inset-0 z-[100] bg-[#121212] animate-in fade-in slide-in-from-bottom duration-200">
          <InviteView onClose={() => setIsInviteOpen(false)} />
        </div>
      )}

      {/* Full Page Schedule Session View Overlay */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-[100] bg-[#121212] animate-in fade-in slide-in-from-bottom duration-200">
          <ScheduleSessionView onClose={() => setIsScheduleOpen(false)} />
        </div>
      )}

      {/* End Session Confirmation Bottom Sheet */}
      <BottomSheet
        isOpen={isEndSessionConfirmOpen}
        onClose={() => setIsEndSessionConfirmOpen(false)}
        title="End Public Session"
      >
        <div className="space-y-4 pt-2 pb-4 text-center">
          <p className="font-sans text-sm text-[#8E8E93] leading-relaxed">
            Are you sure you want to end the current training session? All active court matchmaking and player check-ins will be closed.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsEndSessionConfirmOpen(false)}
              className="flex-1 h-12 rounded-full bg-[#2C2C2E] text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#3A3A3C] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsEndSessionConfirmOpen(false);
                toggleSession();
              }}
              className="flex-1 h-12 rounded-full bg-[#1C1C1E] text-white border border-[#2C2C2E] font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#242426] cursor-pointer"
            >
              Confirm End
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
