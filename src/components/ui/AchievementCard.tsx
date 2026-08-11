import React from 'react';
import { AchievementData } from '../../types/achievement';
import { isIconUrl, rarityBadgeClass, rarityGlow } from '../../lib/achievement-utils';

interface AchievementCardProps {
  achievement: AchievementData;
  onClick: (ach: AchievementData) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const iconIsUrl = isIconUrl(achievement.icon);
  const glow = rarityGlow(achievement.rarity, achievement.glowColor);
  const badgeClass = rarityBadgeClass(achievement.rarity);

  const blurStyle = (side: 'left' | 'right') => ({
    width: '150px',
    height: '150px',
    [side]: '-40px',
    top: '-60px',
    background: iconIsUrl ? `url(${achievement.icon}) center/cover` : glow,
    filter: 'blur(45px)',
    opacity: 0.6,
    borderRadius: '50%',
  });

  return (
    <div
      onClick={() => onClick(achievement)}
      className="relative w-full rounded-xl bg-[#1C1C1E] px-[10px] pt-[16px] pb-[10px] flex flex-col items-center text-center overflow-hidden border border-[#2C2C2E]/40 cursor-pointer"
    >
      <div className="absolute pointer-events-none" style={blurStyle('left')} />
      <div className="absolute pointer-events-none" style={blurStyle('right')} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-[56px] h-[56px] flex items-center justify-center">
          {iconIsUrl ? (
            <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain drop-shadow-lg" />
          ) : (
            <span className="text-[50px] leading-none drop-shadow-lg">{achievement.icon}</span>
          )}
        </div>

        <div className="w-full flex flex-col mt-[12px]">
          <div className="font-display text-xs font-bold text-white truncate leading-tight">
            {achievement.title}
          </div>

          {achievement.isEarned ? (
            <div className="text-[10px] text-[#8E8E93] truncate leading-tight">
              {achievement.desc}
            </div>
          ) : (
            <div className="w-full flex flex-col">
              <div className="text-[10px] text-[#8E8E93] truncate leading-tight">
                {achievement.progress}/{achievement.maxProgress} {achievement.desc.split(' ')[0]}
              </div>
              <div className="w-full h-1 bg-[#2C2C2E] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#8E8E93]"
                  style={{ width: `${((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-[6px]">
            <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
