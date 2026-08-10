import React from 'react';
import { useAppStore } from '../store/appStore';
import { MatchHistoryCard } from '../components/ui/MatchHistoryCard';
import { ChevronLeft, Trophy } from 'lucide-react';
import { Match } from '../types';

export const MyGamesView: React.FC = () => {
  const { recentMatches, currentUser, setActiveTab } = useAppStore();

  const groupedByDate = recentMatches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const winRate = currentUser.gamesPlayed > 0 
    ? Math.round((currentUser.wins / currentUser.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen pb-32 select-none bg-[#121212]">
      <div className="relative z-10 px-4 max-w-[480px] mx-auto pt-[84px]">
        {/* Header - Like Leaderboard but without BP badge */}
        <div className="flex items-center mb-5 h-[44px] gap-3">
          <button 
            onClick={() => setActiveTab('profile')} 
            className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#1C1C1E] text-white hover:bg-[#2C2C2E] transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>
          <h1 className="text-[28px] font-bold text-white tracking-tight">My Games</h1>
        </div>

        {/* Summary Card */}
        <div className="flex items-center justify-between bg-[#1C1C1E] rounded-[20px] p-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[#8E8E93] text-xs font-medium">Total Games</span>
            <span className="text-white text-xl font-bold">{currentUser.gamesPlayed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#8E8E93] text-xs font-medium">Wins</span>
            <span className="text-white text-xl font-bold">{currentUser.wins}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#8E8E93] text-xs font-medium">Win Rate</span>
            <span className="text-[#78D850] text-xl font-bold">{winRate}%</span>
          </div>
        </div>

        {/* Grouped Matches */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, matches]) => (
            <div key={date} className="space-y-3">
              <h2 className="text-[#8E8E93] text-sm font-bold uppercase tracking-wider">{date}</h2>
              <div className="bg-[#1C1C1E] rounded-[20px] px-4">
                {matches.map((match) => (
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
