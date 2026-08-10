import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { User } from 'lucide-react';
import bgImage from '../assets/leaderboard.svg';
import place1Svg from '../assets/place1.svg';
import place2Svg from '../assets/place2.svg';
import place3Svg from '../assets/place3.svg';
import bpIcon from '../assets/bp-icon.svg';
import playerCardImg from '../assets/player-card.png';

type TabType = 'today' | 'week' | 'month' | 'total' | 'empty';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, currentUser } = useAppStore();
  const [tab, setTab] = useState<TabType>('total');

  const getPlayerByRank = (rank: number) => leaderboard.find((l) => l.rank === rank);
  
  const p1 = getPlayerByRank(1);
  const p2 = getPlayerByRank(2);
  const p3 = getPlayerByRank(3);
  
  const rest = leaderboard.filter((l) => l.rank > 3);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
    { id: 'total', label: 'Total' },
  ];

  const isEmpty = tab === 'today';

  return (
    <div className="relative min-h-screen pb-32 select-none bg-[#121212]">
      {/* Background Graphic */}
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
        }}
      />
      
      <div className="relative z-10 px-4 max-w-[480px] mx-auto pt-[64px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[28px] font-bold text-white tracking-tight">Leaderboard</h1>
          
          <div className="flex items-center gap-1.5 bg-[#1E311A]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#78D850]/20">
            <span className="text-[#78D850] font-bold text-sm tracking-tight">{currentUser?.bpToday || 867}</span>
            <img src={bpIcon} alt="BP" className="w-5 h-5 text-[#78D850]" />
          </div>
        </div>

        {/* Podium Section */}
        <div className="flex items-end justify-center px-1 mb-10 gap-0">
          {/* 2nd Place */}
          <div className="flex flex-col items-center justify-end flex-1">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-[#1E311A] flex items-center justify-center border-2 border-[#121212] z-10">
                  <User className="h-6 w-6 text-[#121212]" />
                </div>
              ) : (
                <img src={p2?.player.avatarUrl || playerCardImg} className="w-[60px] h-[60px] rounded-full object-cover border-2 border-[#121212] z-10" alt={p2?.player.name} />
              )}
              <div className="absolute -bottom-2 bg-[#78D850] text-[#121212] w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-[#121212] z-20">2</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 h-[40px] justify-start">
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p2?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p2?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3" />}
            <div 
              className="relative w-full max-w-[101px] h-[70px]" 
              style={{ backgroundImage: `url(${place2Svg})`, backgroundSize: '100% 100%', backgroundPosition: 'bottom' }}
            />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center justify-end flex-1 z-10 mx-[-8px]">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[68px] h-[68px] rounded-full bg-[#1E311A] flex items-center justify-center border-2 border-[#121212] z-10 shadow-[0_0_20px_rgba(120,216,80,0.15)]">
                  <User className="h-7 w-7 text-[#121212]" />
                </div>
              ) : (
                <img src={p1?.player.avatarUrl || playerCardImg} className="w-[68px] h-[68px] rounded-full object-cover border-2 border-[#121212] z-10 shadow-[0_0_20px_rgba(120,216,80,0.2)]" alt={p1?.player.name} />
              )}
              <div className="absolute -bottom-2.5 bg-[#78D850] text-[#121212] w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-[#121212] z-20">1</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 h-[40px] justify-start">
                <span className="text-[14px] font-bold text-white max-w-[86px] text-center truncate leading-tight">{p1?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p1?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3" />}
            <div 
              className="relative w-full max-w-[100px] h-[98px]" 
              style={{ backgroundImage: `url(${place1Svg})`, backgroundSize: '100% 100%', backgroundPosition: 'bottom' }}
            />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center justify-end flex-1">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-[#1E311A] flex items-center justify-center border-2 border-[#121212] z-10">
                  <User className="h-6 w-6 text-[#121212]" />
                </div>
              ) : (
                <img src={p3?.player.avatarUrl || playerCardImg} className="w-[60px] h-[60px] rounded-full object-cover border-2 border-[#121212] z-10" alt={p3?.player.name} />
              )}
              <div className="absolute -bottom-2 bg-[#78D850] text-[#121212] w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-[#121212] z-20">3</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 h-[40px] justify-start">
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p3?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p3?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3" />}
            <div 
              className="relative w-full max-w-[102px] h-[42px]" 
              style={{ backgroundImage: `url(${place3Svg})`, backgroundSize: '100% 100%', backgroundPosition: 'bottom' }}
            />
          </div>
        </div>

        {/* Segment Controller */}
        <div className="flex rounded-full bg-[#1C1C1E] p-1 mb-8 relative z-20">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all ${
                tab === t.id ? 'bg-[#2C2C2E] text-white shadow' : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#78D850] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 16H17M7 11H13M8 4H16C17.1046 4 18 4.89543 18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6C6 4.89543 6.89543 4 8 4Z" stroke="#78D850" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No rankings yet</h3>
            <p className="mt-1 text-sm text-[#8E8E93]">Players results will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col relative z-20">
            {rest.map((entry) => (
              <div key={entry.player.id} className="flex items-center justify-between py-3 border-b border-[#2C2C2E]/40 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-base w-6">{entry.rank}</span>
                  <img src={entry.player.avatarUrl || playerCardImg} className="w-9 h-9 rounded-full object-cover bg-[#2C2C2E]" alt={entry.player.name} />
                  <span className="text-white text-sm font-medium">{entry.player.name}</span>
                </div>
                <span className="text-[#D4D4D4] text-sm">{entry.xp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
