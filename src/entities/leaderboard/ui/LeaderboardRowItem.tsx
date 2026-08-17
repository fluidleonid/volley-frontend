import React from 'react';
import { User } from 'lucide-react';
import { Player } from '../../../shared/types/index';

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
        <div className="w-10 h-10 rounded-full bg-card mr-3 border border-border flex items-center justify-center overflow-hidden">
          {player.avatarUrl ? (
            <img src={player.avatarUrl} className="w-full h-full object-cover" alt={player.name} />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <span className="text-white text-[16px] font-medium">{player.name}</span>
      </div>
      <div className="text-right flex items-center gap-1.5">
        <span className="text-muted-foreground text-[13px] font-bold">{xp} BP</span>
      </div>
    </div>
  );
};
