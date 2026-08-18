import React from 'react';
import { Player } from '../../../shared/types/index';
import { Avatar } from '../../../shared/ui/Avatar';
import { useTranslation } from 'react-i18next';
import { getPlayerTierInfo } from '../../../shared/lib/tier';

interface PlayerListItemProps {
  player: Player;
  onClick?: (player: Player) => void;
  rightContent?: React.ReactNode;
}

export const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, onClick, rightContent }) => {
  const { t } = useTranslation();
  const tierInfo = getPlayerTierInfo(player.level);

  return (
    <div
      onClick={() => onClick && onClick(player)}
      className="flex flex-row items-center justify-between py-3 border-b border-solid border-border/60 last:border-b-0 w-full cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="md" hasBorder={false} />
        <div>
          <span className="font-display text-base font-semibold text-white tracking-tight leading-tight">{player.name}</span>
          <div className="text-[13px] text-muted-foreground mt-0.5">{t(`levels.${tierInfo.tierName.toLowerCase().replace(' ', '')}`, tierInfo.tierName)}</div>
        </div>
      </div>
      {rightContent}
    </div>
  );
};
