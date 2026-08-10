import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Shield, User, Coffee, Sparkles, Box } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const TopHeader: React.FC = () => {
  const { role, setRole, currentUser, playerState, setActiveTab } = useAppStore();

  const getStatusDisplay = () => {
    switch (playerState) {
      case 'spectating':
        return { label: 'Spectating', icon: Box, color: 'text-[#8E8E93]' };
      case 'queued':
      case 'match_found':
        return { label: 'Queued', icon: Sparkles, color: 'text-[#8E8E93]' };
      case 'playing':
        return { label: 'Training', icon: Sparkles, color: 'text-[#8E8E93]' };
      case 'resting':
        return { label: 'Resting', icon: Coffee, color: 'text-[#8E8E93]' };
      default:
        return { label: 'Spectating', icon: Box, color: 'text-[#8E8E93]' };
    }
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

  // Level tracker 10 frames of 10px width each (Node 11420:16392)
  const filledFramesCount = Math.min(10, Math.max(1, Math.floor((currentUser.xp % 1000) / 100) || 7));

  return (
    <header className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-5 text-white border-b border-transparent">
      <div className="flex items-center justify-between max-w-[480px] mx-auto w-full px-4">
        {/* Left: Avatar with Level Ring & Name & Status (Clickable to Profile View) */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
          title="Open Profile"
        >
          {/* Avatar Container with Background Color Border & Level Accent Ring Shadow */}
          <div className="relative">
            <div className="rounded-full border-2 border-[#121212] shadow-[0_0_0_2px_#68BD44] transition-all duration-300 group-hover:shadow-[0_0_0_2px_#5AA739]">
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                initials={currentUser.name[0]}
                size="lg"
                className="border-none"
              />
            </div>
            {role === 'coach' && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#68BD44] text-[9px] font-bold text-black shadow-md" title="Coach">
                ★
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[30px] font-bold tracking-tight text-white leading-tight group-hover:text-[#68BD44] transition-colors">
                {currentUser.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-[#8E8E93] mt-0.5">
              <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.color}`} />
              <span className={statusInfo.color}>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Right: XP Value & 10-Frame Level Tracker for Player role only */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {role === 'player' && (
              <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
                {currentUser.xp.toFixed(1)} XP
              </span>
            )}

            {/* User Role Switcher for Testing (will be removed after testing) */}
            <button
              onClick={() => setRole(role === 'player' ? 'coach' : 'player')}
              className="rounded-full bg-[#1C1C1E] px-2 py-0.5 text-[10px] font-semibold text-[#8E8E93] hover:text-white transition-colors"
              title="Switch Role for Testing"
            >
              {role === 'coach' ? (
                <span className="text-[#68BD44] font-bold flex items-center gap-1">
                  <Shield className="h-3 w-3 text-[#68BD44]" /> Admin
                </span>
              ) : (
                <User className="h-3 w-3 inline" />
              )}
            </button>
          </div>

          {/* XP Level Tracker Bar: 10 Frame Segments (Only for Player role) */}
          {role === 'player' && (
            <div className="flex items-center gap-[3px]">
              {Array.from({ length: 10 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-[4px] w-[10px] rounded-full transition-colors duration-300 ${idx < filledFramesCount ? 'bg-white' : 'bg-[#2C2C2E]'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
