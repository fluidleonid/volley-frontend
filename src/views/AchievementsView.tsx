import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AchievementData } from '../types/achievement';
import { AchievementCard } from '../components/ui/AchievementCard';
import { AchievementDetailsSheet } from '../components/ui/AchievementDetailsSheet';
import { StickyPageHeader } from '../components/layout/StickyPageHeader';
import { MOCK_ACHIEVEMENTS, TOTAL_ACHIEVEMENTS_COUNT } from '../data/achievements';

const earnedAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned);
const lockedAchievements = MOCK_ACHIEVEMENTS.filter((a) => !a.isEarned);

export const AchievementsView: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const [selected, setSelected] = useState<AchievementData | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24 px-4 max-w-[480px] select-none mx-auto">
      <StickyPageHeader title="Achievements" onBack={() => setActiveTab('profile')} />

      <div className="flex items-center gap-2 mb-4 mt-2">
        <span className="font-display text-lg font-bold text-white tracking-tight">Earned</span>
        <span className="font-display text-lg font-normal text-[#8E8E93]">{earnedAchievements.length}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {earnedAchievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} onClick={setSelected} />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="font-display text-lg font-bold text-white tracking-tight">Locked</span>
        <span className="font-display text-lg font-normal text-[#8E8E93]">{TOTAL_ACHIEVEMENTS_COUNT}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {lockedAchievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} onClick={setSelected} />
        ))}
      </div>

      <AchievementDetailsSheet
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        achievement={selected}
      />
    </div>
  );
};
