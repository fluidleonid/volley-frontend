import React from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarGroup } from '../../shared/ui/AvatarGroup';
import { Player } from '../../shared/types/index';
import squadImg from '../../shared/assets/images/squad.png';

interface SquadGameBannerProps {
  isPartyActive: boolean;
  partyPlayers: Player[];
  onClick: () => void;
}

export const SquadGameBanner: React.FC<SquadGameBannerProps> = ({
  isPartyActive,
  partyPlayers,
  onClick
}) => {
  const { t } = useTranslation();

  if (isPartyActive) {
    return (
      <div 
        onClick={onClick}
        className="w-full h-[60px] rounded-[30px] bg-card border border-border/60 shadow-lg flex items-center justify-between px-4 cursor-pointer hover:bg-card/80 active:scale-[0.98] transition-all"
      >
        <div className="flex flex-col justify-center">
          <span className="font-sans text-[15px] font-semibold text-white leading-tight">
            {t('party.active', 'Party active')}
          </span>
          <span className="font-sans text-xs text-muted-foreground mt-0.5 leading-tight max-w-[180px] line-clamp-1">
            {t('party.activeDesc', 'Matches you together before other players')}
          </span>
        </div>
        <div className="flex items-center">
          <AvatarGroup players={partyPlayers} size="md" stacked={true} hasBorder={false} ringColor="ring-card" maxCount={5} />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-[30px] bg-card p-5 border border-border/60 shadow-lg cursor-pointer hover:bg-card/80 active:scale-[0.98] transition-all mt-3"
    >
      {/* Blur element: white, opacity 20, blur 240 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/20 blur-[100px] pointer-events-none" />

      {/* Image: right 0, top 0, bottom 0 */}
      <img
        src={squadImg}
        alt="Squad Game"
        className="absolute right-0 top-0 bottom-0 h-full w-auto pointer-events-none z-0 object-contain"
      />

      <div className="flex flex-col gap-1.5 z-10 relative">
        <h3 className="font-display text-xl font-bold text-white tracking-tight leading-snug">
          {t('party.playWithFriends', 'Play with friends')}
        </h3>
        <p className="font-sans text-[13px] text-muted-foreground leading-snug max-w-[200px]">
          {t('party.groupUp', 'Group up to prioritize matches together')}
        </p>
      </div>
    </div>
  );
};
