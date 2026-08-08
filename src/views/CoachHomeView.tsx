import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { CourtCard } from '../components/courts/CourtCard';
import { EmptyState } from '../components/ui/EmptyState';
import { MatchHistoryCard } from '../components/ui/MatchHistoryCard';
import { Avatar } from '../components/ui/Avatar';
import { Play, Plus, Pause, Square, Zap, Check, Lock, Users, History } from 'lucide-react';

export const CoachHomeView: React.FC = () => {
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
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    navigator.clipboard.writeText('https://t.me/VolleyBot/app?startapp=invite');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-36 pt-3 px-4 max-w-md mx-auto select-none">
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

      {/* 2. Dynamic Action Buttons Container (2nd type: Buttons with label under container, h=44px, icon color=#050505) */}
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

        {/* STATE 2: Queued mode ("In queue" active, Node: 11420:16289) */}
        {playerState === 'queued' && (
          <div className="flex w-full items-center gap-2.5 text-center">
            {/* Hard mode button (w=90.5px, h=44px, radius=20px) */}
            <div className="flex flex-[0.9] flex-col items-center">
              <button
                onClick={toggleHardmode}
                className={`flex h-[44px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] transition-all active:scale-95 ${
                  isHardmode
                    ? 'bg-[#FF9500]/20 text-[#FF9500] shadow-[0_0_15px_rgba(255,149,0,0.3)]'
                    : 'text-white hover:bg-[#242426]'
                }`}
              >
                <Zap className={`h-5 w-5 ${isHardmode ? 'text-[#FF9500] fill-[#FF9500]' : 'text-white'}`} />
              </button>
              <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                {isHardmode ? 'Hard mode ON' : 'Hard mode'}
              </span>
            </div>

            {/* Invite to play button (w=160px, h=44px, radius=100px) */}
            <div className="flex flex-[1.6] flex-col items-center">
              <button
                onClick={handleInvite}
                className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-[#050505] shadow-lg shadow-[#68BD44]/20 transition-all active:scale-95 hover:bg-[#5AA739]"
              >
                {copied ? <Check className="h-5 w-5 stroke-[3] text-[#050505]" /> : <Plus className="h-5 w-5 stroke-[3] text-[#050505]" />}
              </button>
              <span className="mt-2 font-sans text-sm font-medium text-[#8E8E93]">
                {copied ? 'Copied' : 'Invite to play'}
              </span>
            </div>

            {/* Sit out button (w=90.5px, h=44px, radius=20px) */}
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

      {/* 3. Courts Horizontal Slider Section with Coach Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Courts</h2>
            <span className="font-display text-lg font-normal text-[#8E8E93]">5/6</span>
          </div>

          <span className="font-sans text-xs font-semibold text-[#68BD44]">
            Coach Availability Toggle
          </span>
        </div>

        {/* Horizontal Scrollable Courts with Admin Toggle Switch & Invisible Scrollbar */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              showCoachToggle={role === 'coach'}
              onToggleAvailability={toggleCourtAvailability}
            />
          ))}
        </div>
      </div>

      {/* 4. Private Sessions Section (Coach feature) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-lg font-bold text-white tracking-tight">Private sessions</h2>
          <span className="font-display text-lg font-normal text-[#8E8E93]">0</span>
        </div>

        <Card className="flex items-center justify-between p-3.5 bg-[#1C1C1E] rounded-[20px] border border-[#2C2C2E]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C2C2E] text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-white">Reserve Court 1 for 1-on-1</div>
              <div className="font-sans text-xs text-[#8E8E93]">Coach privilege</div>
            </div>
          </div>
          <button className="rounded-full bg-[#2C2C2E] px-3 py-1 font-display text-xs font-bold text-white hover:bg-[#3A3A3C]">
            Reserve
          </button>
        </Card>
      </div>

      {/* 5. Today's Players Horizontal Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's players</h2>
          <span className="font-display text-lg font-normal text-[#8E8E93]">
            {todaysPlayers.length}
          </span>
        </div>

        {todaysPlayers.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {todaysPlayers.map((player) => (
              <Avatar
                key={player.id}
                src={player.avatarUrl}
                alt={player.name}
                initials={player.name[0]}
                size="lg"
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No players yet" icon={Users} />
        )}
      </div>

      {/* 6. Recent Games Section */}
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
    </div>
  );
};
