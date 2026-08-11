import React from 'react';
import { BottomSheet } from './BottomSheet';
import { AchievementData } from './AchievementCard';

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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="relative flex flex-col items-center text-center px-4 pt-8 pb-12 w-full -mt-[68px]">
        {/* Glow Effects (2 images, going off-screen top and sides) */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '320px',
            height: '320px',
            left: '-60px',
            top: '-100px',
            background: isImage ? `url(${achievement.icon}) center/cover` : glow,
            filter: 'blur(80px)',
            opacity: 0.6,
            borderRadius: '50%',
          }}
        />
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '320px',
            height: '320px',
            right: '-60px',
            top: '-100px',
            background: isImage ? `url(${achievement.icon}) center/cover` : glow,
            filter: 'blur(80px)',
            opacity: 0.6,
            borderRadius: '50%',
          }}
        />

        {/* Big Icon */}
        <div className="relative z-10 w-[96px] h-[96px] flex items-center justify-center mb-[24px]">
          {isImage ? (
            <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain drop-shadow-2xl" />
          ) : (
            <span className="text-[80px] drop-shadow-2xl">{achievement.icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Date */}
          {achievement.isEarned && achievement.earnedDate && (
            <div className="text-sm text-[#8E8E93] font-medium mb-[24px]">
              Earned {achievement.earnedDate}
            </div>
          )}
          
          {/* Text Block */}
          <div className="flex flex-col items-center mb-[24px]">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {achievement.title}
            </h2>
            
            {achievement.isEarned ? (
              <p className="text-sm text-white/80">
                {achievement.desc}
              </p>
            ) : (
              <div className="w-full flex flex-col items-center max-w-[240px]">
                <p className="text-sm text-white/80 mb-4">
                  {achievement.desc}
                </p>
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

          {/* Badge */}
          <div>
            <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${badgeColor}`}>
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
