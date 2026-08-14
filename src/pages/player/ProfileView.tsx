import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { ChevronRight, Calendar, Receipt, LogOut } from 'lucide-react';
import { AchievementData } from '../../shared/types/achievement';
import { PlayerCard } from '../../entities/player/ui/PlayerCard';
import { MenuRowItem } from '../../entities/menu/ui/MenuRowItem';
import { AchievementCard } from '../../entities/achievement/ui/AchievementCard';
import { AchievementDetailsSheet } from '../../entities/achievement/ui/AchievementDetailsSheet';
import { StatCard } from '../../entities/stats/ui/StatCard';
import { XpBar } from '../../shared/ui/XpBar';
import { Header } from '../../widgets/layout/Header';
import { MOCK_ACHIEVEMENTS } from '../../shared/api/mock/achievements';

const topAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).slice(0, 5);

export const ProfileView: React.FC = () => {
  const { currentUser, setActiveTab, setFlowState } = useAppStore();
  const [selected, setSelected] = useState<AchievementData | null>(null);

  const earnedCount = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).length;

  return (
    <div className="bg-background text-white pb-24 px-4 max-w-[480px] select-none">
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title="Profile" onBack={() => setActiveTab('home')} />

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
            <span className="font-display text-lg font-normal text-muted-foreground">{earnedCount}</span>
          </div>

          <button className="text-muted-foreground hover:text-white transition-colors">
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
