import React, { useState } from 'react';
import { Match, Player } from '../../../shared/types/index';
import { useTranslation } from 'react-i18next';
import { AvatarGroup } from '../../../shared/ui/AvatarGroup';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { useAppStore } from '../../../app/store/appStore';
import { PlayerDetailSheet } from '../../player/ui/PlayerDetailSheet';
import { Badge } from '../../../shared/ui/badge';

export interface MatchDetailSheetProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
}

export const MatchDetailSheet: React.FC<MatchDetailSheetProps> = ({
  match,
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
}) => {
  const { t, i18n } = useTranslation();
  const { todaysPlayers, leaderboard, currentUser, role } = useAppStore();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!isOpen || !match) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = {
      ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      am: ['Հնվ', 'Փտր', 'Մար', 'Ապր', 'Մայ', 'Հնս', 'Հլս', 'Օգս', 'Սեպ', 'Հոկ', 'Նոյ', 'Դեկ']
    };
    const lang = i18n.language === 'ru' ? 'ru' : (i18n.language === 'am' ? 'am' : 'en');
    const m = months[lang][date.getMonth()];
    const d = date.getDate();
    const y = date.getFullYear();
    
    return lang === 'en' ? `${m} ${d}, ${y}` : `${d} ${m} ${y}`;
  };

  // Attempt to find full player data by name
  const findFullPlayer = (name: string, fallbackId: string, avatarUrl?: string): Player => {
    if (currentUser.name === name || name.includes('(You)')) return currentUser;
    const fromToday = todaysPlayers.find(p => p.name === name);
    if (fromToday) return fromToday;
    const fromLB = leaderboard.find(l => l.player.name === name)?.player;
    if (fromLB) return fromLB;

    return {
      id: fallbackId,
      name,
      avatarUrl,
      level: 1,
      xp: 0,
      status: 'spectating',
      gamesPlayed: 0,
      wins: 0,
      bpToday: 0,
      winStreak: 0,
    };
  };

  // Convert Team A and Team B to Player objects for AvatarGroup
  const teamAPlayers: Player[] = match.teamA.map((p, idx) => 
    findFullPlayer(p.name, `sheet-a-${idx}`, p.avatarUrl)
  );

  const teamBPlayers: Player[] = match.teamB.map((p, idx) => 
    findFullPlayer(p.name, `sheet-b-${idx}`, p.avatarUrl)
  );

  const isCurrentUserInMatch = teamAPlayers.some(p => p.id === currentUser.id) || teamBPlayers.some(p => p.id === currentUser.id);
  const showStatsRow = role !== 'coach' && isCurrentUserInMatch;


  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title={t('home.matchDetails', 'Match details')}
      zIndex={100}
    >
      <div className="-mx-4 px-[60px]">
        {/* Status Pill Badge */}
        {role !== 'coach' && (
          <div className="flex justify-center my-3 mb-8">
            <Badge variant={match.isWin ? 'default' : 'destructive'} size="lg">
              {match.isWin ? t('common.win', 'Win') : t('common.loss', 'Loss')}
            </Badge>
          </div>
        )}

        {/* Teams & Avatars & Scores */}
        {role === 'coach' ? (
          <div className="flex items-center justify-between my-6 w-full">
            <div className="flex-1 flex justify-start pl-4">
              <AvatarGroup
                players={teamAPlayers}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
                onSelectPlayer={(p) => setSelectedPlayer(p)}
              />
            </div>
            
            <div className="flex items-center justify-center shrink-0 w-[120px]">
              <span className="font-display text-[24px] font-bold text-white w-[40px] text-right">
                {match.scoreA ?? 21}
              </span>
              <span className="font-sans text-[24px] font-bold text-muted-foreground mx-3">
                :
              </span>
              <span className="font-display text-[24px] font-bold text-white w-[40px] text-left">
                {match.scoreB ?? 18}
              </span>
            </div>

            <div className="flex-1 flex justify-end pr-4">
              <AvatarGroup
                players={teamBPlayers}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
                onSelectPlayer={(p) => setSelectedPlayer(p)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between my-6">
            <div className="flex flex-col items-center">
              <AvatarGroup
                players={teamAPlayers}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
                onSelectPlayer={(p) => setSelectedPlayer(p)}
              />
              <span className="font-display text-[20px] font-bold text-white mt-2">
                {match.scoreA ?? 21}
              </span>
            </div>

            <span className="font-sans text-[20px] font-bold text-muted-foreground mt-2">
              :
            </span>

            <div className="flex flex-col items-center">
              <AvatarGroup
                players={teamBPlayers}
                size="lg"
                stacked={true}
                hasBorder={false}
                ringColor="ring-[#121212]"
                onSelectPlayer={(p) => setSelectedPlayer(p)}
              />
              <span className="font-display text-[20px] font-bold text-white mt-2">
                {match.scoreB ?? 18}
              </span>
            </div>
          </div>
        )}

        {/* 6 Metrics Grid (2 rows x 3 cols) */}
        <div className="my-8 grid grid-cols-3 gap-y-6 gap-x-2 text-left pb-4">
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.date', 'Date')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {formatDate(match.date || '2026-07-01')}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.time', 'Time')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.time || '16m 40s'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.court', 'Court')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.courtName || '# 2'}
            </div>
          </div>

          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">{t('common.mode', 'Mode')}</div>
            <div className="font-sans text-sm font-semibold text-white">
              {match.isHardmode ? t('common.hard', 'Hard') : t('common.default', 'Default')}
            </div>
          </div>

          {showStatsRow && (
            <>
              <div>
                <div className="font-sans text-xs text-muted-foreground font-medium mb-1">XP</div>
                <div className="font-sans text-sm font-semibold text-white">
                  {match.xpGained > 0 ? `+${match.xpGained}` : match.xpGained}
                </div>
              </div>

              <div>
                <div className="font-sans text-xs text-muted-foreground font-medium mb-1">BP</div>
                <div className="font-sans text-sm font-semibold text-white">
                  {match.bpGained || 50}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onCloseAll={onCloseAll}
        hasParent={true}
      />
    </BottomSheet>
  );
};
