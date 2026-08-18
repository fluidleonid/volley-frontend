import React from 'react';
import { Avatar } from './Avatar';
import { Player } from '../types/index';

export interface AvatarGroupProps {
  players: Player[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  stacked?: boolean; // Whether avatars overlap or just sit side by side
  ringColor?: string;
  hasBorder?: boolean;
  onSelectPlayer?: (player: Player) => void;
  maxCount?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  players, 
  size = 'md', 
  className = '',
  stacked = true,
  ringColor = 'ring-[#1C1C1E]',
  hasBorder = false,
  onSelectPlayer,
  maxCount,
}) => {
  if (!players || players.length === 0) return null;

  const showMoreBadge = maxCount && players.length > maxCount;
  const visiblePlayers = showMoreBadge ? players.slice(0, maxCount - 1) : players;
  const hiddenCount = showMoreBadge ? players.length - (maxCount - 1) : 0;

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-6 h-6 text-[10px]';
      case 'sm': return 'w-8 h-8 text-xs';
      case 'md': return 'w-10 h-10 text-sm';
      case 'lg': return 'w-12 h-12 text-base';
      case 'xl': return 'w-16 h-16 text-lg';
      default: return 'w-10 h-10 text-sm';
    }
  };

  return (
    <div className={`flex items-center ${stacked ? '-space-x-2' : 'gap-1'} ${className}`}>
      {visiblePlayers.map((p, i) => (
        <Avatar
          key={p.id}
          src={p.avatarUrl}
          alt={p.name}
          initials={p.name[0]}
          size={size}
          hasBorder={hasBorder}
          onClick={(e) => {
            if (onSelectPlayer) {
              e.stopPropagation();
              onSelectPlayer(p);
            }
          }}
          className={stacked ? `relative ring-2 ${ringColor} z-[${players.length - i}]` : 'relative'}
        />
      ))}
      
      {showMoreBadge && (
        <div className={`relative flex items-center justify-center rounded-full bg-secondary text-white font-medium ${stacked ? `ring-2 ${ringColor} z-0` : ''} ${getSizeClasses()}`}>
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};
