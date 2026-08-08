import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { Play, Plus, Pause, Square, Zap, Check, Timer, Calendar } from 'lucide-react';

export const CoachHomeView: React.FC = () => {
  const {
    currentUser,
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

  const privateSessions = [
    { id: 'ps-1', playerName: 'Alex Mercer', time: '14:00 - 15:00', court: 'Court #1', status: 'In Progress' },
    { id: 'ps-2', playerName: 'Sophia Chen', time: '16:30 - 17:30', court: 'Court #3', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 pb-36 pt-3 px-4 max-w-md mx-auto">
      {/* 1. Statistics Section (Figma Node: 11420:16325, gap=8px, h=73px, radius=20px) */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.gamesPlayed}
          </span>
          <span className="text-[11px] font-medium text-[#8E8E93] tracking-tight">
            Games played
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.wins}
          </span>
          <span className="text-[11px] font-medium text-[#8E8E93] tracking-tight">
            Wins
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-2.5 bg-[#1C1C1E] rounded-[20px] h-[73px]">
          <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
            {currentUser.bpToday.toFixed(1)}
          </span>
          <span className="text-[11px] font-medium text-[#8E8E93] tracking-tight">
            BP today
          </span>
        </Card>
      </div>

      {/* 2. Dynamic Action Buttons Container (Spectating / Queued / Resting) */}
      <div className="flex flex-col items-center">
        {/* STATE 1: Spectating ("Start training" mode) */}
        {playerState === 'spectating' && (
          <div className="w-full text-center">
            <button
              onClick={startTraining}
              className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#68BD44] text-black shadow-lg shadow-[#68BD44]/25 transition-all active:scale-[0.98] hover:bg-[#5AA739]"
            >
              <Play className="h-7 w-7 fill-black text-black ml-1" />
            </button>
            <span className="mt-2 block text-xs font-medium text-[#8E8E93]">
              Start training
            </span>
          </div>
        )}

        {/* STATE 2: Queued mode ("In queue" active) */}
        {playerState === 'queued' && (
          <div className="flex w-full items-center gap-2.5 text-center">
            {/* Hard mode button */}
            <div className="flex flex-[0.9] flex-col items-center">
              <button
                onClick={toggleHardmode}
                className={`flex h-[68px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] transition-all active:scale-95 ${
                  isHardmode
                    ? 'bg-[#FF9500]/20 text-[#FF9500] shadow-[0_0_15px_rgba(255,149,0,0.3)]'
                    : 'text-white hover:bg-[#242426]'
                }`}
              >
                <Zap className={`h-6 w-6 ${isHardmode ? 'text-[#FF9500] fill-[#FF9500]' : 'text-white'}`} />
              </button>
              <span className="mt-2 text-xs font-medium text-[#8E8E93]">
                {isHardmode ? 'Hard mode ON' : 'Hard mode'}
              </span>
            </div>

            {/* Invite to play button */}
            <div className="flex flex-[1.6] flex-col items-center">
              <button
                onClick={handleInvite}
                className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#68BD44] text-black shadow-lg shadow-[#68BD44]/25 transition-all active:scale-95 hover:bg-[#5AA739]"
              >
                {copied ? <Check className="h-7 w-7 stroke-[3]" /> : <Plus className="h-7 w-7 stroke-[3]" />}
              </button>
              <span className="mt-2 text-xs font-medium text-[#8E8E93]">
                {copied ? 'Copied' : 'Invite to play'}
              </span>
            </div>

            {/* Sit out button */}
            <div className="flex flex-[0.9] flex-col items-center">
              <button
                onClick={sitOut}
                className="flex h-[68px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] text-white transition-all active:scale-95 hover:bg-[#242426]"
              >
                <Pause className="h-6 w-6 fill-white text-white" />
              </button>
              <span className="mt-2 text-xs font-medium text-[#8E8E93]">
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
                className="flex h-[68px] w-full items-center justify-center rounded-[20px] bg-[#1C1C1E] text-white transition-all active:scale-95 hover:bg-[#242426]"
              >
                <Square className="h-6 w-6 fill-white text-white" />
              </button>
              <span className="mt-2 text-xs font-medium text-[#8E8E93]">
                Stop
              </span>
            </div>

            {/* Continue to play button */}
            <div className="flex flex-col items-center">
              <button
                onClick={continueToPlay}
                className="flex h-[68px] w-full items-center justify-center rounded-full bg-[#68BD44] text-black shadow-lg shadow-[#68BD44]/25 transition-all active:scale-95 hover:bg-[#5AA739]"
              >
                <Play className="h-7 w-7 fill-black text-black ml-1" />
              </button>
              <span className="mt-2 text-xs font-medium text-[#8E8E93]">
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
            <h2 className="text-base font-bold text-white">Courts</h2>
            <span className="text-xs font-semibold text-[#8E8E93]">5/6</span>
          </div>

          <span className="text-[11px] font-semibold text-[#68BD44]">
            Coach Availability Toggle
          </span>
        </div>

        {/* Horizontal Scrollable Courts with Admin Toggle Switch */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {courts.map((court) => (
            <div
              key={court.id}
              className={`relative flex h-52 w-36 shrink-0 flex-col justify-between rounded-[24px] bg-[#1C1C1E] p-3.5 shadow-lg overflow-hidden transition-opacity duration-200 ${
                court.isAvailable ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {/* Top Heading */}
              <div className="flex items-center justify-between z-10">
                <span className="text-base font-extrabold text-white">
                  {court.name}
                </span>

                {/* Coach Admin Toggle Switch */}
                <button
                  onClick={() => toggleCourtAvailability(court.id)}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    court.isAvailable ? 'bg-[#68BD44]' : 'bg-[#3A3A3C]'
                  }`}
                  title="Toggle Availability"
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      court.isAvailable ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Center Content: Avatars Grid */}
              <div className="my-auto flex items-center justify-center z-10">
                {court.teamA.length > 0 || court.teamB.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 justify-items-center">
                    {court.teamA.map((p) => (
                      <div key={p.id} className="h-9 w-9 overflow-hidden rounded-full border border-white/20">
                        <img src={p.avatarUrl} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {court.teamB.map((p) => (
                      <div key={p.id} className="h-9 w-9 overflow-hidden rounded-full border border-white/20">
                        <img src={p.avatarUrl} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-10" />
                )}
              </div>

              {/* ABSOLUTE VERTICAL CENTER NOTCH DIVIDER */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between pointer-events-none z-0">
                <div className="h-4 w-2 rounded-r-full bg-[#121212]" />
                <div className="w-full border-b border-dashed border-[#2C2C2E]/60 mx-1" />
                <div className="h-4 w-2 rounded-l-full bg-[#121212]" />
              </div>

              {/* Bottom Status / Timer */}
              <div className="text-center pt-1 z-10">
                {court.timerSeconds > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-xs font-mono text-[#8E8E93]">
                    <Timer className="h-3 w-3 text-[#68BD44]" />
                    <span>12:11</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-[#8E8E93]">
                    {court.isAvailable ? (court.statusText || 'Matching...') : 'Disabled'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Private Sessions Section (Figma Node: 11594:28481) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-white">Private sessions</h2>
            <span className="text-xs font-semibold text-[#68BD44]">{privateSessions.length}</span>
          </div>
          <span className="text-[11px] text-[#8E8E93]">1-on-1 Coaching</span>
        </div>

        <div className="space-y-2">
          {privateSessions.map((session) => (
            <Card key={session.id} className="flex items-center justify-between p-3.5 bg-[#1C1C1E] rounded-[20px]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#68BD44]/20 text-[#68BD44]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{session.playerName}</div>
                  <div className="text-[10px] text-[#8E8E93]">{session.court} • {session.time}</div>
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                session.status === 'In Progress'
                  ? 'bg-[#68BD44]/20 text-[#68BD44]'
                  : 'bg-amber-400/20 text-amber-400'
              }`}>
                {session.status}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Today's Players Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-white">Today's players</h2>
          <span className="text-xs font-semibold text-[#8E8E93]">
            {todaysPlayers.length}
          </span>
        </div>

        {todaysPlayers.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {todaysPlayers.map((player) => (
              <div key={player.id} className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-[#1C1C1E]">
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#68BD44]">
                    {player.name[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#8E8E93]">No players yet</div>
        )}
      </div>

      {/* 6. Recent Games Section */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Recent games</h2>

        {recentMatches.length > 0 ? (
          <div className="space-y-2">
            {recentMatches.map((match) => (
              <Card key={match.id} className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-[20px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#68BD44]/20 text-[#68BD44] font-extrabold text-xs">
                    W
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {match.teamA.map((t, idx) => (
                          <div key={idx} className="h-5 w-5 overflow-hidden rounded-full border border-black bg-zinc-700">
                            {t.avatarUrl && <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#8E8E93]">vs</span>
                      <div className="flex -space-x-1.5">
                        {match.teamB.map((t, idx) => (
                          <div key={idx} className="h-5 w-5 overflow-hidden rounded-full border border-black bg-zinc-700">
                            {t.avatarUrl && <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#68BD44]">+{match.xpGained} XP</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#8E8E93]">No games yet</div>
        )}
      </div>
    </div>
  );
};
