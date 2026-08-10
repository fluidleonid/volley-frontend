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
          {/* Banner Placeholder Card matching app design system */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#1C1C1E] p-5 border border-[#2C2C2E]/60 shadow-xl flex flex-col justify-between h-[160px]">
            {/* Banner Background Decorative Placeholder Graphic */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#68BD44]/10 blur-2xl pointer-events-none" />
            <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 pointer-events-none flex items-center justify-center text-white text-7xl font-bold">
              🎾
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2C2C2E] px-3 py-1 text-xs font-semibold text-[#8E8E93] mb-2">
                <span>Public Open Session</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                No active training session
              </h3>
              <p className="font-sans text-xs text-[#8E8E93] mt-1 max-w-[260px] leading-relaxed">
                {role === 'coach'
                  ? 'Start or schedule a training session to open court matchmaking and player check-ins.'
                  : 'There are no active training sessions scheduled right now. Check back soon!'}
              </p>
            </div>

            {/* Coach Actions */}
            {role === 'coach' && (
              <div className="flex items-center gap-2 pt-2 z-10">
                <button
                  onClick={toggleSession}
                  className="flex-1 h-9 rounded-full bg-[#68BD44] text-[#050505] font-sans text-xs font-bold transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer"
                >
                  Start training
                </button>
                <button
                  onClick={toggleSession}
                  className="flex-1 h-9 rounded-full bg-[#2C2C2E] text-white font-sans text-xs font-bold transition-all active:scale-95 hover:bg-[#3A3A3C] cursor-pointer"
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
                  onClick={toggleSession}
                  className="font-sans text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
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
    </div>
  );
};
