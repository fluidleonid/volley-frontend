import React from 'react';
import { BottomSheet } from './BottomSheet';
import { AchievementData } from '../../types/achievement';
import { isIconUrl, rarityBadgeClass, rarityGlow } from '../../lib/achievement-utils';

interface AchievementDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: AchievementData | null;
}

export const AchievementDetailsSheet: React.FC<AchievementDetailsSheetProps> = ({
  isOpen,
  onClose,
  achievement,
}) => {
  if (!achievement) return null;

  const iconIsUrl = isIconUrl(achievement.icon);
  const glow = rarityGlow(achievement.rarity, achievement.glowColor);
  const badgeClass = rarityBadgeClass(achievement.rarity);

  const bgSource = iconIsUrl ? `url(${achievement.icon}) center/cover` : glow;

  const blurStyle = (side: 'left' | 'right') => ({
    width: '320px',
    height: '320px',
    [side]: '-60px',
    top: '-100px',
    background: bgSource,
    filter: 'blur(80px)',
    opacity: 0.6,
    borderRadius: '50%',
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="relative flex flex-col items-center text-center px-4 pt-8 pb-12 w-full -mt-[68px]">
        <div className="absolute pointer-events-none" style={blurStyle('left')} />
        <div className="absolute pointer-events-none" style={blurStyle('right')} />

        <div className="relative z-10 w-[96px] h-[96px] flex items-center justify-center mb-[24px]">
          {iconIsUrl ? (
            <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain drop-shadow-2xl" />
          ) : (
            <span className="text-[80px] drop-shadow-2xl">{achievement.icon}</span>
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">
          {achievement.isEarned && achievement.earnedDate && (
            <div className="text-sm text-[#8E8E93] font-medium mb-[24px]">
              Earned {achievement.earnedDate}
            </div>
          )}

          <div className="flex flex-col items-center mb-[24px]">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {achievement.title}
            </h2>

            {achievement.isEarned ? (
              <p className="text-sm text-white/80">{achievement.desc}</p>
            ) : (
              <div className="w-full flex flex-col items-center max-w-[240px]">
                <p className="text-sm text-white/80 mb-4">{achievement.desc}</p>
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs text-[#8E8E93] font-medium mb-2">
                    {achievement.progress}/{achievement.maxProgress} matches
                  </div>
                  <div className="w-full h-1.5 bg-[#2C2C2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${badgeClass}`}>
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
