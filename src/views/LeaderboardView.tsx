import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { Trophy, Flame, Crown, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard } = useAppStore();
  const [tab, setTab] = useState<'total' | 'today' | 'empty'>('total');

  return (
    <div className="space-y-4 pb-24 px-4 max-w-[480px] mx-auto select-none">
      {/* Sticky Header Section (No border) */}
      <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-3 space-y-3 -mx-4 px-4">
        {/* Top Banner Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#68BD44]/20 via-[#1C1C1E] to-[#1C1C1E] p-4 border border-[#68BD44]/30">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#68BD44] text-black font-extrabold shadow-lg shadow-[#68BD44]/30">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Leaderboard</h1>
              <p className="text-xs text-[#8E8E93]">Top club players by XP and win rate</p>
            </div>
          </div>
        </div>

        {/* Segment Controller (Tabs: All Time / Today / Empty) */}
        <div className="flex rounded-xl bg-[#1C1C1E] p-1 border border-[#2C2C2E]">
          <button
            onClick={() => setTab('total')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'total' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTab('today')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'today' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTab('empty')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'empty' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Empty State
          </button>
        </div>
      </div>

      {/* Leaderboard Content */}
      {tab === 'empty' ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-[#1C1C1E] border-[#2C2C2E]">
          <Award className="h-12 w-12 text-[#8E8E93] mb-3" />
          <h3 className="text-sm font-bold text-white">Leaderboard is empty</h3>
          <p className="mt-1 text-xs text-[#8E8E93]">Play your first match today to claim the top spot!</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <Card
              key={entry.player.id}
              className={`flex items-center justify-between p-3 transition-all ${
                entry.player.id === 'p-me'
                  ? 'border-[#68BD44] bg-[#68BD44]/10 shadow-[0_0_15px_rgba(104,189,68,0.1)]'
                  : 'bg-[#1C1C1E] border-[#2C2C2E]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className="flex h-8 w-8 items-center justify-center font-bold text-sm">
                  {entry.rank === 1 ? (
                    <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  ) : entry.rank === 2 ? (
                    <Award className="h-6 w-6 text-slate-300" />
                  ) : entry.rank === 3 ? (
                    <Award className="h-6 w-6 text-amber-600" />
                  ) : (
                    <span className="text-[#8E8E93]">#{entry.rank}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{entry.player.name}</span>
                    {entry.player.winStreak >= 4 && (
                      <span className="flex items-center text-[10px] font-bold text-[#FF9500]">
                        <Flame className="h-3 w-3" /> {entry.player.winStreak}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8E8E93]">
                    Lv. {entry.player.level} • {entry.winRate}% win rate
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs font-bold text-[#68BD44]">{entry.wins} wins</span>
                <span className="text-[10px] text-[#8E8E93]">{entry.xp} XP</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
