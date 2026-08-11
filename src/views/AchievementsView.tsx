import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useAppStore } from '../store/appStore';
import { AchievementCard, AchievementData } from '../components/ui/AchievementCard';
import { AchievementDetailsSheet } from '../components/ui/AchievementDetailsSheet';
import bloodImg from '../assets/blood.png';
import ach2Img from '../assets/ach2.png';
import ach3Img from '../assets/ach3.png';
import ach4Img from '../assets/ach4.png';
import ach5Img from '../assets/ach5.png';

// Dummy data for all achievements
const allAchievements: AchievementData[] = [
  {
    id: 'ach-1',
    title: 'Fresh Blood',
    desc: 'Attended your very first training session',
    rarity: 'Common',
    icon: bloodImg,
    isEarned: true,
    earnedDate: 'July 3, 2026',
    glowColor: 'rgba(255, 59, 48, 0.5)',
  },
  {
    id: 'ach-2',
    title: 'Marathon Man',
    desc: 'Played 15+ matches in a single day',
    rarity: 'Rare',
    icon: ach2Img,
    isEarned: false,
    progress: 4,
    maxProgress: 15,
    glowColor: 'rgba(0, 122, 255, 0.5)',
  },
  {
    id: 'ach-3',
    title: 'Welcome to Hell',
    desc: 'Won your first Hard Mode match',
    rarity: 'Uncommon',
    icon: ach3Img,
    isEarned: true,
    earnedDate: 'July 10, 2026',
    glowColor: 'rgba(255, 69, 58, 0.6)',
  },
  {
    id: 'ach-4',
    title: '25 Hard Mode Wins',
    desc: 'Won 25 Hard Mode matches',
    rarity: 'Uncommon',
    icon: ach4Img,
    isEarned: true,
    earnedDate: 'August 1, 2026',
    glowColor: 'rgba(255, 159, 10, 0.5)',
  },
  {
    id: 'ach-5',
    title: 'Sniper',
    desc: 'Score 10 aces in one match',
    rarity: 'Rare',
    icon: ach5Img,
    isEarned: false,
    progress: 2,
    maxProgress: 10,
    glowColor: 'rgba(50, 173, 230, 0.5)',
  },
  {
    id: 'ach-6',
    title: 'Team Player',
    desc: 'Play 50 matches with friends',
    rarity: 'Common',
    icon: '🤝',
    isEarned: true,
    earnedDate: 'August 5, 2026',
    glowColor: 'rgba(48, 209, 88, 0.5)',
  },
  {
    id: 'ach-7',
    title: 'Unstoppable',
    desc: 'Win 10 matches in a row',
    rarity: 'Rare',
    icon: '🔥',
    isEarned: false,
    progress: 4,
    maxProgress: 10,
    glowColor: 'rgba(255, 59, 48, 0.7)',
  }
];

export const AchievementsView: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementData | null>(null);

  const earnedAchievements = allAchievements.filter(a => a.isEarned);
  const lockedAchievements = allAchievements.filter(a => !a.isEarned);

  // Note: Using 80 for Locked count as per screenshot, but we'll use the actual array length for realism or hardcode 80 if preferred.
  // The screenshot shows "Locked 80". We'll just use lockedAchievements.length for now.

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24 px-4 max-w-[480px] select-none mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-5 -mx-4 px-4">
        <PageHeader
          title="Achievements"
          onBack={() => setActiveTab('profile')}
        />
      </div>

      {/* Earned Section */}
      <div className="flex items-center gap-2 mb-4 mt-2">
        <span className="font-display text-lg font-bold text-white tracking-tight">
          Earned
        </span>
        <span className="font-display text-lg font-normal text-[#8E8E93]">
          {earnedAchievements.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {earnedAchievements.map((ach) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            onClick={setSelectedAchievement} 
          />
        ))}
      </div>

      {/* Locked Section */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-display text-lg font-bold text-white tracking-tight">
          Locked
        </span>
        <span className="font-display text-lg font-normal text-[#8E8E93]">
          80 {/* Hardcoded to 80 as in screenshot, or could be lockedAchievements.length */}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {lockedAchievements.map((ach) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            onClick={setSelectedAchievement} 
          />
        ))}
      </div>

      {/* Details Sheet */}
      <AchievementDetailsSheet
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        achievement={selectedAchievement}
      />
    </div>
  );
};
