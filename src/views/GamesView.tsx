import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { MatchHistoryCard } from '../components/ui/MatchHistoryCard';
import { Trophy } from 'lucide-react';
import { Match } from '../types';

export const GamesView: React.FC = () => {
  const { recentMatches } = useAppStore();

  const groupedByDate = useMemo(() => {
    const groups: Record<string, {
      matches: Match[];
      wins: number;
      losses: number;
      xp: number;
      bp: number;
    }> = {};

    recentMatches.forEach(match => {
      // Parse date to Month D, YYYY
      let dateLabel = match.date;
      if (match.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateLabel = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(match.date));
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = { matches: [], wins: 0, losses: 0, xp: 0, bp: 0 };
      }
      
      groups[dateLabel].matches.push(match);
      if (match.isWin) groups[dateLabel].wins++;
      else groups[dateLabel].losses++;
      
      groups[dateLabel].xp += (match.xpGained || 0);
      groups[dateLabel].bp += (match.bpGained || 0);
    });

    return groups;
  }, [recentMatches]);

  return (
    <div className="relative min-h-screen pb-32 select-none bg-[#121212]">
      <div className="relative z-10 px-4 max-w-[480px] mx-auto pt-[84px]">
        {/* Header - Like Leaderboard but without BP badge */}
        <div className="flex items-center mb-5 h-[44px]">
          <h1 className="text-[28px] font-bold text-white tracking-tight">My Games</h1>
        </div>

        {/* Grouped Matches */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateLabel, stats]) => (
            <div key={dateLabel} className="space-y-3">
              <div>
                <h2 className="text-white text-sm font-bold tracking-tight">{dateLabel}</h2>
                <p className="text-[#8E8E93] text-[11px] font-medium mt-0.5">
                  {stats.matches.length} matches • {stats.wins}W - {stats.losses}L • +{stats.xp} XP • +{stats.bp} BP
                </p>
              </div>
              <div className="flex flex-col">
                {stats.matches.map((match) => (
                  <MatchHistoryCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedByDate).length === 0 && (
            <div className="text-center py-10">
              <Trophy className="w-12 h-12 text-[#2C2C2E] mx-auto mb-3" />
              <p className="text-[#8E8E93] text-sm font-medium">No games played yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
