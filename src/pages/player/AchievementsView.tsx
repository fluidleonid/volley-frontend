import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { AchievementData } from '../../shared/types/achievement';
import { AchievementCard } from '../../entities/achievement/ui/AchievementCard';
import { AchievementDetailsSheet } from '../../entities/achievement/ui/AchievementDetailsSheet';
import { Header } from '../../widgets/layout/Header';
import { MOCK_ACHIEVEMENTS, TOTAL_ACHIEVEMENTS_COUNT } from '../../shared/api/mock/achievements';

const earnedAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned);
const lockedAchievements = MOCK_ACHIEVEMENTS.filter((a) => !a.isEarned);

export const AchievementsView: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useAppStore();
  const [selected, setSelected] = useState<AchievementData | null>(null);

  return (
    <div className="bg-background text-white pb-24 px-4 max-w-[480px] select-none mx-auto">
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title={t('profile.achievements', 'Achievements')} onBack={() => setActiveTab('profile')} />

      <div className="flex items-center gap-2 mb-4 mt-2">
        <span className="font-display text-lg font-bold text-white tracking-tight">{t('player.achievements.earned', 'Earned')}</span>
        <span className="font-display text-lg font-normal text-muted-foreground">{earnedAchievements.length}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {earnedAchievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} onClick={setSelected} />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="font-display text-lg font-bold text-white tracking-tight">{t('player.achievements.locked', 'Locked')}</span>
        <span className="font-display text-lg font-normal text-muted-foreground">{TOTAL_ACHIEVEMENTS_COUNT}</span>
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
