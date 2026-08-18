import React, { useState } from 'react';
import { Player } from '../../shared/types/index';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { LeaderboardRowItem } from '../../entities/leaderboard/ui/LeaderboardRowItem';
import bgImage from '../../shared/assets/images/leaderboard.png';
import lightSvg from '../../shared/assets/icons/light.svg';
import place1Svg from '../../shared/assets/icons/place1.svg';
import place2Svg from '../../shared/assets/icons/place2.svg';
import place3Svg from '../../shared/assets/icons/place3.svg';
import { useScroll } from '../../shared/hooks/useScroll';
import { Badge } from '../../shared/ui/badge';
import { BpIcon } from '../../shared/ui/icons/BpIcon';

type TabType = 'today' | 'week' | 'month' | 'total' | 'empty';

export const LeaderboardView: React.FC = () => {
  const { t } = useTranslation();
  const { leaderboard, currentUser, role } = useAppStore();
  const [tab, setTab] = useState<TabType>('total');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const scrolled = useScroll();

  const filteredLeaderboard = (role === 'coach' ? leaderboard.filter(l => l.player.id !== currentUser.id) : leaderboard)
    .map((l, index) => ({ ...l, rank: index + 1 }));

  const getPlayerByRank = (rank: number) => filteredLeaderboard.find((l) => l.rank === rank);

  const p1 = getPlayerByRank(1);
  const p2 = getPlayerByRank(2);
  const p3 = getPlayerByRank(3);

  const rest = filteredLeaderboard.filter((l) => l.rank > 3);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'today', label: t('player.leaderboard.today', 'Today') },
    { id: 'week', label: t('player.leaderboard.thisWeek', 'This week') },
    { id: 'month', label: t('player.leaderboard.thisMonth', 'This month') },
    { id: 'total', label: t('player.leaderboard.total', 'Total') },
  ];

  const isEmpty = tab === 'today';

  return (
    <div className="relative pb-32 select-none bg-background">
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

      <div className="relative z-10 px-4 max-w-[480px] mx-auto">

        {/* Sticky Header */}
        <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-5 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
          }`}>
          <div className="flex items-center justify-between h-[44px]">
            <h1 className="text-[30px] font-bold text-white tracking-tight">{t('nav.leaderboard', 'Leaderboard')}</h1>

            {role !== 'coach' && (
              <Badge variant="neutral" size="lg" className="bg-primary/20 backdrop-blur-md text-primary font-bold tracking-tight border-0">
                <span>{currentUser?.bpToday || 867}</span>
                <BpIcon />
              </Badge>
            )}
          </div>
        </div>

        {/* Podium Section */}
        <div className="relative flex items-end justify-center mb-6 h-[226px] overflow-hidden">
          {/* 2nd Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-10">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-secondary flex items-center justify-center z-10">
                  <span className="text-white text-xl font-bold">?</span>
                </div>
              ) : (
                <img 
                  src={p2?.player.avatarUrl} 
                  className="w-[60px] h-[60px] rounded-full object-cover z-10 cursor-pointer active:scale-95 transition-transform" 
                  alt={p2?.player.name} 
                  onClick={() => p2 && setSelectedPlayer(p2.player)}
                />
              )}
              <div className="absolute -bottom-2 bg-primary text-primary-foreground w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black leading-none z-20">2</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start cursor-pointer active:scale-95 transition-transform" onClick={() => p2 && setSelectedPlayer(p2.player)}>
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p2?.player.name}</span>
                <span className="text-[11px] text-muted-foreground">{p2?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place2Svg} className="w-[100px] h-[70px] object-fill" alt="2nd place pedestal" />
          </div>

          {/* 1st Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-20">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-secondary flex items-center justify-center z-10">
                  <span className="text-white text-2xl font-bold">?</span>
                </div>
              ) : (
                <img 
                  src={p1?.player.avatarUrl} 
                  className="w-[60px] h-[60px] rounded-full object-cover z-10 cursor-pointer active:scale-95 transition-transform" 
                  alt={p1?.player.name} 
                  onClick={() => p1 && setSelectedPlayer(p1.player)}
                />
              )}
              <div className="absolute -bottom-2.5 bg-primary text-primary-foreground w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black leading-none z-20">1</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start cursor-pointer active:scale-95 transition-transform" onClick={() => p1 && setSelectedPlayer(p1.player)}>
                <span className="text-[14px] font-bold text-white max-w-[86px] text-center truncate leading-tight">{p1?.player.name}</span>
                <span className="text-[11px] text-muted-foreground">{p1?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place1Svg} className="w-[100px] h-[98px] object-fill" alt="1st place pedestal" />
          </div>

          {/* 3rd Place */}
          <div className="relative flex flex-col items-center justify-end w-[100px] h-full z-10">
            <div className="flex flex-col items-center mb-1 relative">
              {isEmpty ? (
                <div className="w-[60px] h-[60px] rounded-full bg-secondary flex items-center justify-center z-10">
                  <span className="text-white text-xl font-bold">?</span>
                </div>
              ) : (
                <img 
                  src={p3?.player.avatarUrl} 
                  className="w-[60px] h-[60px] rounded-full object-cover z-10 cursor-pointer active:scale-95 transition-transform" 
                  alt={p3?.player.name} 
                  onClick={() => p3 && setSelectedPlayer(p3.player)}
                />
              )}
              <div className="absolute -bottom-2 bg-primary text-primary-foreground w-[20px] h-[20px] rounded-full flex items-center justify-center text-[14px] font-black leading-none z-20">3</div>
            </div>
            {!isEmpty && (
              <div className="flex flex-col items-center mt-3 mb-2 h-[40px] justify-start cursor-pointer active:scale-95 transition-transform" onClick={() => p3 && setSelectedPlayer(p3.player)}>
                <span className="text-[13px] font-bold text-white max-w-[80px] text-center truncate leading-tight">{p3?.player.name}</span>
                <span className="text-[11px] text-muted-foreground">{p3?.xp} BP</span>
              </div>
            )}
            {isEmpty && <div className="h-[40px] mt-3 mb-2" />}
            <img src={place3Svg} className="w-[100px] h-[42px] object-fill" alt="3rd place pedestal" />
          </div>
        </div>

        {/* Segment Controller */}
        <div className="flex rounded-[20px] bg-card p-1 mb-6 relative z-20 w-full">
          {tabs.map((t, i) => {
            const isActive = tab === t.id;
            return (
              <div key={t.id} className="relative flex-1 flex">
                <button
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-[20px] py-1.5 text-sm font-bold transition-all relative z-10 ${isActive ? 'bg-secondary text-white shadow' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                  {t.label}
                </button>
                {/* Vertical Divider */}
                {!isActive && i < tabs.length - 1 && tab !== tabs[i + 1].id && (
                  <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-secondary pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* List Content */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 16H17M7 11H13M8 4H16C17.1046 4 18 4.89543 18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6C6 4.89543 6.89543 4 8 4Z" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">{t('player.leaderboard.noRankings', 'No rankings yet')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('player.leaderboard.noRankingsDesc', 'Players results will appear here')}</p>
          </div>
        ) : (
          <div className="flex flex-col relative z-20">
            {rest.map((entry) => (
              <LeaderboardRowItem
                key={entry.player.id}
                rank={entry.rank}
                player={entry.player}
                xp={entry.xp}
                onClick={() => setSelectedPlayer(entry.player)}
              />
            ))}</div>
        )}
      </div>

      <PlayerDetailSheet
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        player={selectedPlayer}
      />
    </div>
  );
};
