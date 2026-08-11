import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ChevronRight, Calendar, Receipt, LogOut } from 'lucide-react';
import { AchievementData } from '../types/achievement';
import { PlayerCard } from '../components/ui/PlayerCard';
import { MenuRowItem } from '../components/ui/MenuRowItem';
import { AchievementCard } from '../components/ui/AchievementCard';
import { AchievementDetailsSheet } from '../components/ui/AchievementDetailsSheet';
import { StatCard } from '../components/ui/StatCard';
import { XpBar } from '../components/ui/XpBar';
import { StickyPageHeader } from '../components/layout/StickyPageHeader';
import { MOCK_ACHIEVEMENTS } from '../data/achievements';

const topAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).slice(0, 5);

export const ProfileView: React.FC = () => {
  const { currentUser, setActiveTab, setFlowState } = useAppStore();
  const [selected, setSelected] = useState<AchievementData | null>(null);

  const earnedCount = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).length;

  return (
    <div className="bg-[#121212] text-white pb-24 px-4 max-w-[480px] select-none">
      <StickyPageHeader title="Profile" onBack={() => setActiveTab('home')} />

      <PlayerCard avatarUrl={currentUser.avatarUrl} iconCount={4} />

      <div className="space-y-3 mt-6">
        <h2 className="font-display text-[30px] font-bold text-white text-center tracking-tight leading-none">
          {currentUser.name}
        </h2>

        <XpBar current={9302} max={10000} label="Pro" />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <StatCard value={currentUser.gamesPlayed} label="Games played" />
        <StatCard value={currentUser.wins} label="Wins" />
        <StatCard value={867} label="BP" />
      </div>

      <div className="space-y-3 pt-2 mt-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setActiveTab('achievements')}
        >
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Achievements</h3>
            <span className="font-display text-lg font-normal text-[#8E8E93]">{earnedCount}</span>
          </div>

          <button className="text-[#8E8E93] hover:text-white transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {topAchievements.map((ach) => (
            <div key={ach.id} className="shrink-0" style={{ width: 'calc((min(100vw, 480px) - 56px) / 3)' }}>
              <AchievementCard achievement={ach} onClick={setSelected} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-[4px] pt-2 mt-6">
        <MenuRowItem icon={Calendar} label="Attendance" onClick={() => setActiveTab('attendance')} />
        <MenuRowItem icon={Receipt} label="Billing" onClick={() => setActiveTab('billing')} />
        <MenuRowItem icon={LogOut} label="Log out" showChevron={false} onClick={() => setFlowState('splash')} />
      </div>

      <AchievementDetailsSheet
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        achievement={selected}
      />
    </div>
  );
};
