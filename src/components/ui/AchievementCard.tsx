import React from 'react';

export interface AchievementData {
  id: string;
  title: string;
  desc: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  icon: string; // URL or emoji
  isEarned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
  glowColor?: string;
}

interface AchievementCardProps {
  achievement: AchievementData;
  onClick: (ach: AchievementData) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const isImage = achievement.icon.startsWith('http') || achievement.icon.startsWith('/') || achievement.icon.startsWith('data:');

  // Fallback glow color if none specified
  const glow = achievement.glowColor || (
    achievement.rarity === 'Common' ? 'rgba(150,150,150,0.5)' : 
    achievement.rarity === 'Rare' ? 'rgba(0,122,255,0.5)' : 'rgba(48,209,88,0.5)'
  );

  const badgeColor = 
    achievement.rarity === 'Common' ? 'bg-[#242426] text-[#8E8E93]' :
    achievement.rarity === 'Rare' ? 'bg-[#007AFF]/20 text-[#007AFF]' :
    'bg-[#30D158]/20 text-[#30D158]';

  return (
    <div 
      onClick={() => onClick(achievement)}
      className="relative w-full rounded-xl bg-[#1C1C1E] px-[10px] pt-[16px] pb-[10px] flex flex-col items-center text-center overflow-hidden border border-[#2C2C2E]/40 cursor-pointer"
    >
      {/* Blurs */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '150px',
          height: '150px',
          left: '-40px',
          top: '-60px',
          background: isImage ? `url(${achievement.icon}) center/cover` : glow,
          filter: 'blur(45px)',
          opacity: 0.6,
          borderRadius: '50%',
        }}
      />
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '150px',
          height: '150px',
          right: '-40px',
          top: '-60px',
          background: isImage ? `url(${achievement.icon}) center/cover` : glow,
          filter: 'blur(45px)',
          opacity: 0.6,
          borderRadius: '50%',
        }}
      />

      {/* Content Container (relative to stay above blurs) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Icon */}
        <div className="w-[56px] h-[56px] flex items-center justify-center">
          {isImage ? (
            <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain drop-shadow-lg" />
          ) : (
            <span className="text-[50px] leading-none drop-shadow-lg">{achievement.icon}</span>
          )}
        </div>

        {/* Text Area */}
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
            <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {achievement.rarity}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
