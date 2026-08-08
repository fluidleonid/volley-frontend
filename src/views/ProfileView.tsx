import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Calendar, CreditCard, Award, Flame, Zap, ChevronRight } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser } = useAppStore();
  const [activeSection, setActiveSection] = useState<'achievements' | 'attendance' | 'billing'>('achievements');

  const categories = [
    { title: '🏋️ Training Attendance', count: '8 achievements', icon: Calendar },
    { title: '🏸 Matches Played', count: '8 achievements', icon: Trophy },
    { title: '🏆 Total Wins', count: '9 achievements', icon: Award },
    { title: '⚡ Hard Mode Wins', count: '9 achievements', icon: Flame },
    { title: '🔥 Win Streaks', count: '8 achievements', icon: Zap },
    { title: '💀 Hard Mode Streaks', count: '8 achievements', icon: Flame },
  ];

  return (
    <div className="space-y-4 pb-24 pt-2 px-4">
      {/* Profile Header */}
      <Card className="p-4 bg-[#1C1C1E] border-[#2C2C2E]">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#68BD44] bg-[#242426]">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-xl text-[#68BD44]">
                {currentUser.name[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-base font-bold text-white">{currentUser.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="default" className="text-[10px]">
                Level {currentUser.level}
              </Badge>
              <span className="text-xs text-[#8E8E93]">{currentUser.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#2C2C2E] pt-3 text-center">
          <div>
            <span className="block text-[10px] text-[#8E8E93]">Games</span>
            <span className="text-sm font-bold text-white">{currentUser.gamesPlayed}</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#8E8E93]">Wins</span>
            <span className="text-sm font-bold text-[#68BD44]">{currentUser.wins}</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#8E8E93]">Streak</span>
            <span className="text-sm font-bold text-[#FF9500]">🔥 {currentUser.winStreak}</span>
          </div>
        </div>
      </Card>

      {/* Tabs Switcher */}
      <div className="flex rounded-xl bg-[#1C1C1E] p-1 border border-[#2C2C2E]">
        <button
          onClick={() => setActiveSection('achievements')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeSection === 'achievements' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveSection('attendance')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeSection === 'attendance' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveSection('billing')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeSection === 'billing' ? 'bg-[#68BD44] text-black shadow' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Balance
        </button>
      </div>

      {/* Section Content */}
      {activeSection === 'achievements' && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Achievement Categories (50 Total)</h2>
          {categories.map((cat, idx) => (
            <Card key={idx} className="flex items-center justify-between p-3.5 bg-[#1C1C1E] border-[#2C2C2E] hover:border-[#68BD44]/40 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
                  <cat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{cat.title}</div>
                  <span className="text-[10px] text-[#8E8E93]">{cat.count}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8E8E93]" />
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'attendance' && (
        <Card className="p-4 bg-[#1C1C1E] border-[#2C2C2E] text-center space-y-2">
          <Calendar className="h-10 w-10 text-[#68BD44] mx-auto" />
          <h3 className="text-sm font-bold text-white">Attendance Calendar</h3>
          <p className="text-xs text-[#8E8E93]">Attended 12 training sessions this month. Perfect attendance!</p>
        </Card>
      )}

      {activeSection === 'billing' && (
        <Card className="p-4 bg-[#1C1C1E] border-[#2C2C2E] text-center space-y-3">
          <CreditCard className="h-10 w-10 text-[#68BD44] mx-auto" />
          <h3 className="text-sm font-bold text-white">Account Balance</h3>
          <span className="block text-2xl font-extrabold text-[#68BD44]">$ 0</span>
          <p className="text-xs text-[#8E8E93]">All past sessions are paid</p>
        </Card>
      )}
    </div>
  );
};
