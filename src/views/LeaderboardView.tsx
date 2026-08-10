import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { Flame, Crown, Award } from 'lucide-react';
import bgImage from '../assets/leaderboard.svg';
import place1Svg from '../assets/place1.svg';
import place2Svg from '../assets/place2.svg';
import place3Svg from '../assets/place3.svg';
import playerCardImg from '../assets/player-card.png';

export const LeaderboardView: React.FC = () => {
  const { leaderboard } = useAppStore();
  const [tab, setTab] = useState<'total' | 'today' | 'empty'>('total');

  const getPlayerByRank = (rank: number) => leaderboard.find((l) => l.rank === rank);
  
  const p1 = getPlayerByRank(1);
  const p2 = getPlayerByRank(2);
  const p3 = getPlayerByRank(3);
  
  const rest = leaderboard.filter((l) => l.rank > 3);

  return (
    <div className="relative min-h-screen pb-32 select-none overflow-hidden">
      {/* Background Graphic */}
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] z-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />
      
      <div className="relative z-10 px-4 max-w-[480px] mx-auto pt-[84px]">
        <h1 className="text-2xl font-display font-black text-white text-center tracking-tight mb-6 uppercase italic">
          Leaderboard
        </h1>

        {/* Segment Controller */}
        <div className="flex rounded-[16px] bg-[#1C1C1E]/80 backdrop-blur-md p-1 border border-[#2C2C2E] mb-12 relative z-20">
          <button
            onClick={() => setTab('total')}
            className={`flex-1 rounded-[12px] py-2.5 text-xs font-bold transition-all ${
              tab === 'total' ? 'bg-[#2C2C2E] text-white shadow' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTab('today')}
            className={`flex-1 rounded-[12px] py-2.5 text-xs font-bold transition-all ${
              tab === 'today' ? 'bg-[#2C2C2E] text-white shadow' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Today
          </button>
        </div>

        {tab === 'empty' ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-[#1C1C1E]/80 backdrop-blur-md border-[#2C2C2E]">
            <Award className="h-12 w-12 text-[#8E8E93] mb-3" />
            <h3 className="text-sm font-bold text-white">Leaderboard is empty</h3>
            <p className="mt-1 text-xs text-[#8E8E93]">Play your first match today to claim the top spot!</p>
          </Card>
        ) : (
          <>
            {/* Podium Section */}
            {p1 && (
              <div className="flex items-end justify-center px-1 mb-8 gap-0.5">
                {/* 2nd Place */}
                {p2 ? (
                  <div className="flex flex-col items-center justify-end flex-1 mb-[-2px]">
                    <div className="flex flex-col items-center mb-2">
                      <img src={p2.player.avatarUrl || playerCardImg} className="w-[52px] h-[52px] rounded-full object-cover border-[3px] border-[#1C1C1E] shadow-xl" alt={p2.player.name} />
                      <span className="text-[11px] font-bold text-white mt-2 max-w-[76px] text-center truncate">{p2.player.name}</span>
                      <span className="text-[10px] text-[#8E8E93] font-bold">{p2.xp} XP</span>
                    </div>
                    <div 
                      className="relative flex justify-center items-start pt-2 w-[101px] h-[70px]" 
                      style={{ backgroundImage: `url(${place2Svg})`, backgroundSize: '100% 100%' }}
                    >
                      <span className="text-2xl font-display font-black italic text-white/20">2</span>
                    </div>
                  </div>
                ) : <div className="flex-1" />}

                {/* 1st Place */}
                <div className="flex flex-col items-center justify-end flex-1 z-10 mx-[-8px]">
                  <div className="flex flex-col items-center mb-2 relative">
                    <Crown className="absolute -top-6 h-6 w-6 text-[#78D850] fill-[#78D850] drop-shadow-[0_0_10px_rgba(120,216,80,0.5)] z-20" />
                    <img src={p1.player.avatarUrl || playerCardImg} className="w-[64px] h-[64px] rounded-full object-cover border-[3px] border-[#78D850] shadow-[0_0_20px_rgba(120,216,80,0.3)] z-10" alt={p1.player.name} />
                    <span className="text-[13px] font-black text-[#78D850] mt-2 max-w-[86px] text-center truncate">{p1.player.name}</span>
                    <span className="text-[11px] text-white font-bold">{p1.xp} XP</span>
                  </div>
                  <div 
                    className="relative flex justify-center items-start pt-3 w-[100px] h-[98px]" 
                    style={{ backgroundImage: `url(${place1Svg})`, backgroundSize: '100% 100%' }}
                  >
                    <span className="text-3xl font-display font-black italic text-[#78D850]/20">1</span>
                  </div>
                </div>

                {/* 3rd Place */}
                {p3 ? (
                  <div className="flex flex-col items-center justify-end flex-1 mb-[-2px]">
                    <div className="flex flex-col items-center mb-2">
                      <img src={p3.player.avatarUrl || playerCardImg} className="w-[52px] h-[52px] rounded-full object-cover border-[3px] border-[#1C1C1E] shadow-xl" alt={p3.player.name} />
                      <span className="text-[11px] font-bold text-white mt-2 max-w-[76px] text-center truncate">{p3.player.name}</span>
                      <span className="text-[10px] text-[#8E8E93] font-bold">{p3.xp} XP</span>
                    </div>
                    <div 
                      className="relative flex justify-center items-start pt-1.5 w-[102px] h-[42px]" 
                      style={{ backgroundImage: `url(${place3Svg})`, backgroundSize: '100% 100%' }}
                    >
                      <span className="text-xl font-display font-black italic text-white/20">3</span>
                    </div>
                  </div>
                ) : <div className="flex-1" />}
              </div>
            )}

            {/* List for ranks 4+ */}
            <div className="space-y-2 relative z-20">
              {rest.map((entry) => (
                <Card
                  key={entry.player.id}
                  className={`flex items-center justify-between p-3 transition-all ${
                    entry.player.id === 'p-me'
                      ? 'border-[#68BD44] bg-[#68BD44]/10 shadow-[0_0_15px_rgba(104,189,68,0.1)]'
                      : 'bg-[#1C1C1E]/80 backdrop-blur-md border-[#2C2C2E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center font-bold text-sm text-[#8E8E93]">
                      #{entry.rank}
                    </div>

                    <div className="flex items-center gap-2">
                      <img src={entry.player.avatarUrl || playerCardImg} className="w-8 h-8 rounded-full object-cover border border-[#2C2C2E]" alt={entry.player.name} />
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
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold text-[#68BD44]">{entry.wins} wins</span>
                    <span className="text-[10px] text-[#8E8E93]">{entry.xp} XP</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
