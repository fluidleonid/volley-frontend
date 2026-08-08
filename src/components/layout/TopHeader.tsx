import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Shield, User, Coffee, Sparkles, Box } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { role, setRole, currentUser, playerState } = useAppStore();

  const getStatusDisplay = () => {
    switch (playerState) {
      case 'spectating':
        return { label: 'Spectating', icon: Box, color: 'text-[#8E8E93]' };
      case 'queued':
        return { label: 'Queued', icon: Sparkles, color: 'text-[#68BD44]' };
      case 'resting':
        return { label: 'Resting', icon: Coffee, color: 'text-amber-400' };
      default:
        return { label: 'Spectating', icon: Box, color: 'text-[#8E8E93]' };
    }
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#121212] px-4 pt-3 pb-2 text-white">
      <div className="flex items-center justify-between">
        {/* Left: Avatar & Name & Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-[#1C1C1E]">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-[#68BD44]">
                  {currentUser.name[0]}
                </div>
              )}
            </div>
            {role === 'coach' && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#68BD44] text-[9px] font-bold text-black" title="Coach">
                ★
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">{currentUser.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8E8E93]">
              <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.color}`} />
              <span className={statusInfo.color}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Right: XP & Progress Dotted Bar & Role Switcher */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white">
              {currentUser.xp.toFixed(1)} XP
            </span>
            <button
              onClick={() => setRole(role === 'player' ? 'coach' : 'player')}
              className="rounded-full bg-[#1C1C1E] px-2 py-0.5 text-[10px] font-semibold text-[#8E8E93] hover:text-white"
              title="Switch Role"
            >
              {role === 'coach' ? <Shield className="h-3 w-3 text-[#68BD44] inline" /> : <User className="h-3 w-3 inline" />}
            </button>
          </div>

          {/* Dotted / Pill Progress Indicator Bar (Figma spec: --- -------) */}
          <div className="flex items-center gap-0.5">
            <span className="h-1 w-2 rounded-full bg-[#68BD44]" />
            <span className="h-1 w-2 rounded-full bg-[#68BD44]" />
            <span className="h-1 w-2 rounded-full bg-[#68BD44]" />
            <span className="h-1 w-3.5 rounded-full bg-[#68BD44]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
            <span className="h-1 w-1.5 rounded-full bg-[#2C2C2E]" />
          </div>
        </div>
      </div>
    </header>
  );
};
