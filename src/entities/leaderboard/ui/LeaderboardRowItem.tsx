import React from 'react';
import { Player } from '../../../shared/types/index';
import { Avatar } from '../../../shared/ui/Avatar';
import { formatShortName } from '../../../shared/lib/formatName';

export interface LeaderboardRowItemProps {
  rank: number;
  player: Player;
  xp: number;
  onClick?: () => void;
}

export const LeaderboardRowItem: React.FC<LeaderboardRowItemProps> = ({ rank, player, xp, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center py-3 border-b border-border/60 last:border-0 bg-transparent ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform select-none' : ''}`}
    >
      <div className="w-[60px] text-left shrink-0 font-bold text-white text-[20px]">{rank}</div>
      <div className="flex-1 flex items-center">
        <Avatar
          src={player.avatarUrl}
          alt={player.fullName || player.name}
          initials={player.initials}
          size="md"
          hasBorder={false}
          className="w-10 h-10 mr-3 border border-border"
        />
        <span className="text-white text-[16px] font-medium">{formatShortName(player.name)}</span>
      </div>
      <div className="text-right flex items-center gap-1.5">
        <span className="text-muted-foreground text-[13px] font-bold">{xp} BP</span>
      </div>
    </div>
  );
};
