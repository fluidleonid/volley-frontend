import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ChevronRight, Calendar, Receipt, LogOut } from 'lucide-react';
import { PlayerCard } from '../components/ui/PlayerCard';
import { MenuRowItem } from '../components/ui/MenuRowItem';
import { PageHeader } from '../components/layout/PageHeader';
import { AchievementCard, AchievementData } from '../components/ui/AchievementCard';
import { AchievementDetailsSheet } from '../components/ui/AchievementDetailsSheet';
import bloodImg from '../assets/blood.png';
import ach2Img from '../assets/ach2.png';
import ach3Img from '../assets/ach3.png';
import ach4Img from '../assets/ach4.png';
import ach5Img from '../assets/ach5.png';

// Dummy data for top 5 earned
const topAchievements: AchievementData[] = [
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
    id: 'ach-6',
    title: 'Team Player',
    desc: 'Play 50 matches with friends',
    rarity: 'Common',
    icon: ach5Img, // Just re-using ach5Img here
    isEarned: true,
    earnedDate: 'August 5, 2026',
    glowColor: 'rgba(48, 209, 88, 0.5)',
  },
];

export const ProfileView: React.FC = () => {
  const { currentUser, setActiveTab, setFlowState } = useAppStore();
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementData | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24 px-4 max-w-[480px] select-none">
      {/* 1. Sticky Header with PageHeader component */}
      <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-5 -mx-4 px-4">
        <PageHeader
          title="Profile"
          onBack={() => setActiveTab('home')}
        />
      </div>

      {/* 2. Hero Player Banner Card — flush below header, no gap */}
      <PlayerCard avatarUrl={currentUser.avatarUrl} iconCount={4} />

      {/* 3. User Name & Rank Progress */}
      <div className="space-y-3 mt-6">
        <h2 className="font-display text-[30px] font-bold text-white text-center tracking-tight leading-none">
          {currentUser.name}
        </h2>

        {/* Pro Rank & XP Tracker */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between font-display">
            <span className="text-base font-bold text-white">Pro</span>
            <span className="text-xs text-[#8E8E93]">
              <strong className="text-white">9302</strong>/10000
            </span>
          </div>

          {/* 10 Segment Progress Bar */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span
                key={idx}
                className={`h-[4px] flex-1 rounded-full transition-colors duration-300 ${idx < 4 ? 'bg-white' : 'bg-[#2C2C2E]'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Quick Stats 3 Grid Cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="rounded-[20px] bg-[#1C1C1E] p-4 flex flex-col justify-between h-[90px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight">
            {currentUser.gamesPlayed}
          </span>
          <span className="font-sans text-xs text-[#8E8E93] font-medium leading-tight">
            Games played
          </span>
        </div>

        <div className="rounded-[20px] bg-[#1C1C1E] p-4 flex flex-col justify-between h-[90px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight">
            {currentUser.wins}
          </span>
          <span className="font-sans text-xs text-[#8E8E93] font-medium leading-tight">
            Wins
          </span>
        </div>

        <div className="rounded-[20px] bg-[#1C1C1E] p-4 flex flex-col justify-between h-[90px]">
          <span className="font-display text-2xl font-extrabold text-white tracking-tight">
            867
          </span>
          <span className="font-sans text-xs text-[#8E8E93] font-medium leading-tight">
            BP
          </span>
        </div>
      </div>

      {/* 5. Achievements Section */}
      <div className="space-y-3 pt-2 mt-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setActiveTab('achievements')}
        >
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Achievements
            </h3>
            <span className="font-display text-lg font-normal text-[#8E8E93]">4</span>
          </div>

          <button className="text-[#8E8E93] hover:text-white transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {topAchievements.map((ach) => (
            <div key={ach.id} className="shrink-0" style={{ width: 'calc((min(100vw, 480px) - 56px) / 3)' }}>
              <AchievementCard 
                achievement={ach} 
                onClick={setSelectedAchievement} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Action Menu Links (4px gap between menu items) */}
      <div className="space-y-[4px] pt-2 mt-6">
        <MenuRowItem icon={Calendar} label="Attendance" onClick={() => setActiveTab('attendance')} />
        <MenuRowItem icon={Receipt} label="Billing" onClick={() => setActiveTab('billing')} />
        <MenuRowItem icon={LogOut} label="Log out" showChevron={false} onClick={() => setFlowState('splash')} />
      </div>

      <AchievementDetailsSheet
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        achievement={selectedAchievement}
      />
    </div>
  );
};
