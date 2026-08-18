import React from 'react';
import { Player } from '../../../shared/types/index';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../app/store/appStore';
import { Receipt, CalendarClock, Dumbbell, Box, Ban } from 'lucide-react';
import { Badge } from '../../../shared/ui/badge';
import { MenuRowItem } from '../../menu/ui/MenuRowItem';
import { ChangeLevelSheet } from './ChangeLevelSheet';
import { PlayerCard } from './PlayerCard';
import { XpBar } from '../../../shared/ui/XpBar';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { SelectPlayerForSessionSheet } from '../../../features/session/SelectPlayerForSessionSheet';
import { SessionDetailsSheet } from '../../../features/session/SessionDetailsSheet';
import { PrivateSessionFlow } from '../../../widgets/flows/PrivateSessionFlow';
import { PlayerBillingSheet } from './PlayerBillingSheet';
import { MessageCircle } from 'lucide-react';
import { getPlayerTierInfo } from '../../../shared/lib/tier';

export interface PlayerDetailSheetProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
}

export const PlayerDetailSheet: React.FC<PlayerDetailSheetProps> = ({
  player,
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
}) => {
  const { t } = useTranslation();
  const { role, todaysPlayers, isSessionActive, blacklistedPlayerIds, toggleBlacklist } = useAppStore();
  const [isChangeLevelOpen, setIsChangeLevelOpen] = React.useState(false);
  const [isLinkAccountOpen, setIsLinkAccountOpen] = React.useState(false);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = React.useState(false);
  const [isPrivateSessionFlowOpen, setIsPrivateSessionFlowOpen] = React.useState(false);
  const [isBillingOpen, setIsBillingOpen] = React.useState(false);

  if (!isOpen || !player) return null;

  const isAnySubSheetOpen = isChangeLevelOpen || isLinkAccountOpen || isSessionDetailsOpen || isPrivateSessionFlowOpen || isBillingOpen;

  const isTraining = player.status !== 'spectating';
  const isAdmin = role === 'coach';
  const isPlayer = role === 'player';
  const isCheckedIn = todaysPlayers.some((p) => p.id === player.id);
  const isBlacklisted = blacklistedPlayerIds.includes(player.id);

  const xpValue = player.xp || 9302;
  const xpTotal = 10000;
  
  const tierInfo = getPlayerTierInfo(player.level);

  return (
    <>
      <BottomSheet
        isOpen={!isAnySubSheetOpen}
        onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title={t('coach.players.playerDetails', 'Player details')}
      zIndex={140}
    >
      {/* Hero Player Card Banner */}
      <PlayerCard 
        avatarUrl={player.avatarUrl} 
        iconCount={tierInfo.iconCount}
        accentColor={tierInfo.accentColor}
        ringColor={tierInfo.ringColor}
        glowColor={tierInfo.glowColor}
      />

      {/* Player Name, Status & XpBar */}
      <div className="space-y-3 mt-6">
        <div className="text-center space-y-1">
          <h2 className="font-display text-[30px] font-bold text-white tracking-tight leading-none">
            {player.name}
          </h2>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-1">
            {isTraining ? (
              <>
                <Dumbbell className="h-3.5 w-3.5" />
                <span>{t('home.training', 'Training')}</span>
              </>
            ) : (
              <>
                <Box className="h-3.5 w-3.5" />
                <span>{t('home.spectating', 'Spectating')}</span>
              </>
            )}
          </div>
        </div>

        <XpBar 
          current={xpValue} 
          max={xpTotal} 
          label={tierInfo.tierName} 
          onLabelClick={isAdmin ? () => setIsChangeLevelOpen(true) : undefined}
        />
      </div>

      <div className="space-y-[4px] pt-2 mt-6">
        {/* Contact Row */}
        <MenuRowItem
          icon={MessageCircle}
          label={t('common.contact', 'Contact')}
          showChevron={false}
          rightElement={
            player.hasTelegram ? (
              <Badge variant="neutral" className="px-3 cursor-pointer active:scale-95 transition-all text-white hover:bg-brand-surfaceElevated text-center">
                {t('common.message', 'Message')}
              </Badge>
            ) : isAdmin ? (
              <Badge variant="neutral" onClick={() => setIsLinkAccountOpen(true)} className="px-3 cursor-pointer active:scale-95 transition-all text-white hover:bg-brand-surfaceElevated text-center">
                {t('coach.players.linkAccount', 'Link account')}
              </Badge>
            ) : (
              <Badge variant="neutral">{t('coach.players.inPersonOnly', 'In person only')}</Badge>
            )
          }
        />

        {/* Admin Only Row Items & Buttons */}
        {isAdmin && (
          <>
            {/* Billing row item */}
            <MenuRowItem icon={Receipt} label={t('nav.billing', 'Billing')} onClick={() => setIsBillingOpen(true)} />

            {/* Schedule private session row item */}
            <MenuRowItem 
              icon={CalendarClock} 
              label={t('coach.players.schedulePrivate', 'Schedule private session')} 
              onClick={() => setIsPrivateSessionFlowOpen(true)}
            />

          </>
        )}
      </div>

      {/* Action Button: Check-in (Green) when NOT on training, Check-out (Dark) when ON training (24px top margin) */}
      {isAdmin && isSessionActive && (
        <div className="mt-[24px]">
          {isCheckedIn ? (
            <button
              onClick={onClose}
              className="w-full h-[52px] rounded-full bg-card text-white font-sans text-base font-bold transition-all active:scale-95 hover:bg-brand-surfaceElevated"
            >
              {t('coach.session.checkOut', 'Check-out')}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full h-[52px] rounded-full bg-primary text-primary-foreground font-sans text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
            >
              {t('coach.session.checkIn', 'Check-in')}
            </button>
          )}
        </div>
      )}
      
      {isPlayer && (
        <div className="mt-[24px]">
          <button
            className={`w-full h-[52px] flex items-center justify-center rounded-full bg-card font-sans text-base font-bold transition-all active:scale-95 hover:bg-brand-surfaceElevated ${isBlacklisted ? 'text-white' : 'text-destructive'}`}
            onClick={() => toggleBlacklist(player.id)}
          >
            <Ban className="w-5 h-5 mr-2" />
            {isBlacklisted ? t('profile.removeFromBlacklist', 'Remove from black list') : t('profile.addToBlacklist', 'Add to black list')}
          </button>
        </div>
      )}
      </BottomSheet>

      <SelectPlayerForSessionSheet
        isOpen={isLinkAccountOpen}
        onClose={() => setIsLinkAccountOpen(false)}
        onCloseAll={onCloseAll || onClose}
        title={t('coach.players.linkAccount', 'Link account')}
        subtitle={t('coach.players.selectPlayerToLink', 'Select a player to link')}
        mode="single"
        hideAddButtons
        onSelectPlayer={() => setIsLinkAccountOpen(false)}
      />

      <SessionDetailsSheet
        isOpen={isSessionDetailsOpen}
        onClose={() => setIsSessionDetailsOpen(false)}
        onCloseAll={onCloseAll || onClose}
        player={player}
        onAvatarClick={() => setIsSessionDetailsOpen(false)}
        hasParent
      />

      <PrivateSessionFlow
        isOpen={isPrivateSessionFlowOpen}
        onClose={() => setIsPrivateSessionFlowOpen(false)}
        onCloseAll={onCloseAll || onClose}
        hasParent
        initialPlayer={player}
        onSchedule={() => setIsPrivateSessionFlowOpen(false)}
      />

      <PlayerBillingSheet
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        onCloseAll={onCloseAll || onClose}
        player={player}
        hasParent
      />

      <ChangeLevelSheet 
        isOpen={isChangeLevelOpen}
        onClose={() => setIsChangeLevelOpen(false)}
        onCloseAll={onCloseAll || onClose}
        player={player}
        hasParent
      />
    </>
  );
};
