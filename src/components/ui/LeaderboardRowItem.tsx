import React from 'react';
import { User } from 'lucide-react';
import { Player } from '../../types';

export interface LeaderboardRowItemProps {
  rank: number;
  player: Player;
  xp: number;
}

export const LeaderboardRowItem: React.FC<LeaderboardRowItemProps> = ({ rank, player, xp }) => {
  return (
    <div className="flex items-center py-3 border-b border-[#2C2C2E]/60 last:border-0 bg-transparent">
      <div className="w-7 text-center mr-3 font-bold text-white text-[20px]">{rank}</div>
      <div className="flex-1 flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#1C1C1E] mr-3 border border-[#2C2C2E] flex items-center justify-center overflow-hidden">
          {player.avatarUrl ? (
            <img src={player.avatarUrl} className="w-full h-full object-cover" alt={player.name} />
          ) : (
            <User className="h-5 w-5 text-[#8E8E93]" />
          )}
        </div>
        <span className="text-white text-[16px] font-medium">{player.name}</span>
      </div>
      <div className="text-right flex items-center gap-1.5">
        <span className="text-[#8E8E93] text-[13px] font-bold">{xp} BP</span>
      </div>
    </div>
  );
};
