import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { User } from 'lucide-react';
import bgImage from '../assets/leaderboard.png';
import lightSvg from '../assets/light.svg';
import place1Svg from '../assets/place1.svg';
import place2Svg from '../assets/place2.svg';
import place3Svg from '../assets/place3.svg';
import bpIcon from '../assets/bp-icon.svg';

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
      <div className="absolute top-0 inset-x-0 h-[374px] z-0 overflow-hidden pointer-events-none flex justify-center bg-[#0a0a0b] rounded-b-[20px]">
        <div
          className="w-[633px] shrink-0 h-full relative"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Light Effect */}
          <img
            src={lightSvg}
            className="absolute bottom-[98px] left-1/2 -translate-x-1/2 blur-[16px]"
            alt=""
          />
        </div>
      </div>

      <div className="relative z-10 px-4 max-w-[480px] mx-auto pt-[84px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 h-[44px]">
          <h1 className="text-[28px] font-bold text-white tracking-tight">Leaderboard</h1>

          <div className="flex items-center justify-center gap-1 bg-[#1C2817]/80 backdrop-blur-md px-1.5 h-[28px] rounded-full">
            <span className="text-[#78D850] font-bold text-[14px] tracking-tight">{currentUser?.bpToday || 867}</span>
            <div
              className="w-[22px] h-[22px] bg-[#78D850] -translate-y-[2px]"
              style={{
                maskImage: `url(${bpIcon})`,
                WebkitMaskImage: `url(${bpIcon})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            />
          </div>
        </div>

        {/* Podium Section */}
        <div className="relative flex items-end justify-center mb-6 h-[226px] overflow-hidden">
          {/* 2nd Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-10">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-[#2C2C2E] flex items-center justify-center z-10">
                  <span className="text-white text-xl font-bold">?</span>
                </div>
              ) : (
                <img src={p2?.player.avatarUrl} className="w-[60px] h-[60px] rounded-full object-cover z-10" alt={p2?.player.name} />
              )}
              <div className="absolute -bottom-2 bg-[#78D850] text-[#121212] w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black border-2 border-[#121212] z-20">2</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start">
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p2?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p2?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place2Svg} className="w-[100px] h-[70px] object-fill" alt="2nd place pedestal" />
          </div>

          {/* 1st Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-20">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-[#2C2C2E] flex items-center justify-center z-10">
                  <span className="text-white text-2xl font-bold">?</span>
                </div>
              ) : (
                <img src={p1?.player.avatarUrl} className="w-[60px] h-[60px] rounded-full object-cover z-10" alt={p1?.player.name} />
              )}
              <div className="absolute -bottom-2.5 bg-[#78D850] text-[#121212] w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black border-2 border-[#121212] z-20">1</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start">
                <span className="text-[14px] font-bold text-white max-w-[86px] text-center truncate leading-tight">{p1?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p1?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place1Svg} className="w-[100px] h-[98px] object-fill" alt="1st place pedestal" />
          </div>

          {/* 3rd Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-10">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-[#2C2C2E] flex items-center justify-center z-10">
                  <span className="text-white text-xl font-bold">?</span>
                </div>
              ) : (
                <img src={p3?.player.avatarUrl} className="w-[60px] h-[60px] rounded-full object-cover z-10" alt={p3?.player.name} />
              )}
              <div className="absolute -bottom-2 bg-[#78D850] text-[#121212] w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black border-2 border-[#121212] z-20">3</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start">
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p3?.player.name}</span>
                <span className="text-[11px] text-[#8E8E93]">{p3?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place3Svg} className="w-[100px] h-[42px] object-fill" alt="3rd place pedestal" />
          </div>
        </div>

        {/* Segment Controller */}
        <div className="flex rounded-[20px] bg-[#1C1C1E] p-1 mb-6 relative z-20 w-full">
          {tabs.map((t, i) => {
            const isActive = tab === t.id;
            return (
              <div key={t.id} className="relative flex-1 flex">
                <button
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-[20px] py-1.5 text-xs font-bold transition-all relative z-10 ${isActive ? 'bg-[#2C2C2E] text-white shadow' : 'text-[#8E8E93] hover:text-white'
                    }`}
                >
                  {t.label}
                </button>
                {/* Vertical Divider */}
                {!isActive && i < tabs.length - 1 && tab !== tabs[i + 1].id && (
                  <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-[#2C2C2E] pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* List Content */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#78D850] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 16H17M7 11H13M8 4H16C17.1046 4 18 4.89543 18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6C6 4.89543 6.89543 4 8 4Z" stroke="#78D850" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No rankings yet</h3>
            <p className="mt-1 text-sm text-[#8E8E93]">Players results will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col relative z-20">
            {rest.map((entry) => (
              <div key={entry.player.id} className="flex items-center px-4 py-3 border-b border-[#2C2C2E]/60 last:border-0 bg-transparent">
                <div className="w-7 text-center mr-3 font-bold text-white text-[20px]">{entry.rank}</div>
                <div className="flex-1 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1C1C1E] mr-3 border border-[#2C2C2E] flex items-center justify-center overflow-hidden">
                    {entry.player.avatarUrl ? (
                      <img src={entry.player.avatarUrl} className="w-full h-full object-cover" alt={entry.player.name} />
                    ) : (
                      <User className="h-5 w-5 text-[#8E8E93]" />
                    )}
                  </div>
                  <span className="text-white text-[16px] font-medium">{entry.player.name}</span>
                </div>
                <div className="text-right flex items-center gap-1.5">
                  <span className="text-[#8E8E93] text-[16px]">{entry.xp} BP</span>
                </div>
              </div>
            ))}</div>
        )}
      </div>
    </div>
  );
};
