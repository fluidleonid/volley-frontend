import React from 'react';
import { useAppStore } from '../../store/appStore';
import { NavigationTab } from '../../types';
import { Home, Trophy, Menu, ShieldCheck } from 'lucide-react';
import { MatchingBanner } from './MatchingBanner';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role } = useAppStore();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'leaderboard', label: 'Leader board', icon: Trophy },
    { id: 'games', label: 'My games', icon: Menu },
    ...(role === 'coach' ? [{ id: 'coach' as NavigationTab, label: 'Coach', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="fixed bottom-8 left-4 right-4 z-50 mx-auto max-w-[361px]">
      {/* Outer Floating Container (matching Figma Tabbar/bar Node: 11507:13430, fill=#0a0a0b, NO borders!) */}
      <nav className="flex flex-col overflow-hidden rounded-[32px] bg-[#0A0A0B]/95 p-1 shadow-2xl backdrop-blur-2xl space-y-1">
        
        {/* Search / Matching Banner embedded INSIDE Floating Tabbar */}
        {activeTab === 'home' && <MatchingBanner />}

        {/* Tab Buttons Row (Node ID: I11507:13430;11507:11211, h=56px, w=353px, equal flex-1 children) */}
        <div className="flex h-[56px] items-center justify-between gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex h-full flex-1 flex-col items-center justify-center rounded-full py-1.5 px-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1C1C1E] text-white shadow-md'
                    : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-[#68BD44]' : 'text-[#8E8E93]'}`} />
                <span className={`text-[11px] tracking-tight font-medium ${isActive ? 'text-white font-semibold' : 'text-[#8E8E93]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
