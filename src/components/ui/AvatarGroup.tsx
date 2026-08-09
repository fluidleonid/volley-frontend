import React from 'react';
import { Avatar } from './Avatar';
import { Player } from '../../types';

export interface AvatarGroupProps {
  players: Player[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  stacked?: boolean; // Whether avatars overlap or just sit side by side
  ringColor?: string;
  hasBorder?: boolean;
  onSelectPlayer?: (player: Player) => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  players, 
  size = 'md', 
  className = '',
  stacked = true,
  ringColor = 'ring-[#1C1C1E]',
  hasBorder = true,
  onSelectPlayer,
}) => {
  if (!players || players.length === 0) return null;

  return (
    <div className={`flex items-center ${stacked ? '-space-x-1' : 'gap-1'} ${className}`}>
      {players.map((p, i) => (
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
          className={stacked && ringColor ? `relative ring-2 ${ringColor} z-[${players.length - i}]` : 'relative'}
        />
      ))}
    </div>
  );
};
