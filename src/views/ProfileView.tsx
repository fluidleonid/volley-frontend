import React from 'react';
import { useAppStore } from '../store/appStore';
import { ChevronRight, Calendar, Receipt, LogOut, Trophy } from 'lucide-react';
import { PlayerCard } from '../components/ui/PlayerCard';
import { MenuRowItem } from '../components/ui/MenuRowItem';
import { PageHeader } from '../components/layout/PageHeader';

export const ProfileView: React.FC = () => {
  const { currentUser, setActiveTab, setFlowState } = useAppStore();

  const achievements = [
    {
      id: 'ach-1',
      title: 'Fresh Blood',
      desc: 'Attended your ver...',
      rarity: 'Common',
      badgeColor: 'bg-[#242426] text-[#8E8E93]',
      icon: '💧',
    },
    {
      id: 'ach-2',
      title: 'Marathon Man',
      desc: 'Played 15+ match...',
      rarity: 'Rare',
      badgeColor: 'bg-[#007AFF]/20 text-[#007AFF]',
      icon: '👟',
    },
    {
      id: 'ach-3',
      title: 'Welcome to Hell',
      desc: 'Won your first Har...',
      rarity: 'Uncommon',
      badgeColor: 'bg-[#30D158]/20 text-[#30D158]',
      icon: '👹',
    },
  ];

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
        <h2 className="font-display text-2xl font-bold text-white text-center tracking-tight">
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
        <div className="flex items-center justify-between">
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

        {/* Achievements Cards Horizontal Row */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="w-[125px] min-w-[125px] h-[155px] rounded-[20px] bg-[#1C1C1E] p-3.5 flex flex-col items-center justify-between text-center shrink-0 border border-[#2C2C2E]/40"
            >
              <div className="text-3xl my-auto">{ach.icon}</div>
              <div className="w-full space-y-1">
                <div className="font-display text-xs font-bold text-white truncate">
                  {ach.title}
                </div>
                <div className="text-[10px] text-[#8E8E93] truncate">
                  {ach.desc}
                </div>
                <div className="pt-1">
                  <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full ${ach.badgeColor}`}>
                    {ach.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Action Menu Links (4px gap between menu items) */}
      <div className="space-y-[4px] pt-2 mt-6">
        <MenuRowItem icon={Trophy} label="My Games" onClick={() => setActiveTab('my_games')} />
        <MenuRowItem icon={Calendar} label="Attendance" />
        <MenuRowItem icon={Receipt} label="Billing" />
        <MenuRowItem icon={LogOut} label="Log out" showChevron={false} onClick={() => setFlowState('splash')} />
      </div>
    </div>
  );
};
