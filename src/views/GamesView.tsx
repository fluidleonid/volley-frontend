import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { Activity, Calendar, ChevronRight } from 'lucide-react';

export const GamesView: React.FC = () => {
  const { recentMatches } = useAppStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <div className="space-y-4 pb-24 pt-2 px-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2C2C2E] pb-3">
        <div>
          <h1 className="text-lg font-bold text-white">My Games</h1>
          <p className="text-xs text-[#8E8E93]">History of played sessions</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#1C1C1E] px-3 py-1.5 text-xs text-[#68BD44] border border-[#2C2C2E]">
          <Activity className="h-4 w-4" />
          <span className="font-bold">48 total</span>
        </div>
      </div>

      {/* Matches List Grouped by Date */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8E8E93]">
          <Calendar className="h-3.5 w-3.5" />
          <span>Today</span>
        </div>

        {recentMatches.map((match) => (
          <Card
            key={match.id}
            onClick={() => setSelectedGame(selectedGame === match.id ? null : match.id)}
            className="cursor-pointer p-4 transition-all hover:border-[#68BD44]/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{match.courtName}</span>
                  {match.isHardmode && (
                    <span className="rounded bg-[#FF9500]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#FF9500]">
                      🔥 Hardmode
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-[#8E8E93]">
                  {match.teamA.map((t) => t.name).join(' & ')} vs {match.teamB.map((t) => t.name).join(' & ')}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-base font-extrabold ${match.isWin ? 'text-[#68BD44]' : 'text-red-400'}`}>
                  {match.scoreA} : {match.scoreB}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#8E8E93]">
                  <span>{match.time}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Game details modal/accordion */}
            {selectedGame === match.id && (
              <div className="mt-3 border-t border-[#2C2C2E] pt-3 text-xs space-y-1.5 animate-slide-up">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Match Status:</span>
                  <span className="text-[#68BD44] font-bold">{match.isWin ? 'Victory 🎉 (+120 XP)' : 'Defeat (+40 XP)'}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Duration:</span>
                  <span className="text-white">18 min</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
