import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { CourtCard } from '../components/courts/CourtCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import { PlayerDetailSheet } from '../components/ui/PlayerDetailSheet';
import { Player } from '../types';
import { Play, Plus, Pause, Square, Zap, Check, Users, CalendarClock } from 'lucide-react';

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
  const {
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
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleInvite = () => {
    navigator.clipboard.writeText('https://t.me/VolleyBot/app?startapp=invite');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCourtsCount = courts.filter((c) => c.isAvailable).length;

  return (
    <div className="space-y-6 pb-36 pt-3 px-4 max-w-md mx-auto select-none">
      {/* 1. Dynamic Action Buttons Container */}
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

        {/* STATE 2: Queued mode */}
        {playerState === 'queued' && (
          <div className="flex w-full items-center gap-2.5 text-center">
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

        {/* STATE 3: Resting mode */}
        {playerState === 'resting' && (
          <div className="grid w-full grid-cols-2 gap-3 text-center">
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

      {/* 2. Courts Horizontal Slider Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-lg font-bold text-white tracking-tight">Courts</h2>
          <span className="font-display text-lg font-normal text-[#8E8E93]">
            {activeCourtsCount}/6
          </span>
        </div>

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

      {/* 3. Today's Players Horizontal Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's players</h2>
            <span className="font-display text-lg font-normal text-[#8E8E93]">
              {todaysPlayers.length}
            </span>
          </div>

          <button className="flex items-center gap-1 text-sm font-bold text-[#68BD44] hover:opacity-80 transition-opacity">
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

      {/* 4. Today's Privates Section (Figma Node: 11562:13788) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-lg font-bold text-white tracking-tight">Today's privates</h2>
            <span className="font-display text-lg font-normal text-[#8E8E93]">
              {mockPrivateSessions.length}
            </span>
          </div>

          <button className="flex items-center gap-1 text-sm font-bold text-[#68BD44] hover:opacity-80 transition-opacity">
            <Plus className="h-4 w-4 stroke-[3]" /> Add
          </button>
        </div>

        {mockPrivateSessions.length > 0 ? (
          <div className="flex flex-col border-t border-[#2C2C2E]/60 pt-1">
            {mockPrivateSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-3 border-b border-[#2C2C2E]/60 last:border-b-0"
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

                <span className="font-display text-base font-normal text-[#8E8E93]">
                  {session.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No scheduled sessions yet" icon={CalendarClock} />
        )}
      </div>

      {/* Player Detail Sheet Modal (Admin View) */}
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
};
