import React from 'react';
import { Player } from '../../../shared/types/index';
import { Avatar } from '../../../shared/ui/Avatar';
import { useTranslation } from 'react-i18next';
import { getPlayerTierInfo } from '../../../shared/lib/tier';
import whistleIcon from '../../../shared/assets/icons/whistle-fill.svg';

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
        <div className="relative">
          <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="md" hasBorder={false} />
          {player.isCoach && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#3b82f6] shadow-sm border-[1.5px] border-background" title="Coach">
              <div className="w-2.5 h-2.5 bg-white" style={{ maskImage: `url("${whistleIcon}")`, WebkitMaskImage: `url("${whistleIcon}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
            </span>
          )}
        </div>
        <div>
          <span className="font-display text-base font-semibold text-white tracking-tight leading-tight">{player.name}</span>
          <div className="text-[13px] text-muted-foreground mt-0.5">{t(`levels.${tierInfo.tierName.toLowerCase().replace(' ', '')}`, tierInfo.tierName)}</div>
        </div>
      </div>
      {rightContent}
    </div>
  );
};
