import React, { useState } from 'react';
import { useAppStore } from '../../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { AvatarGroup } from '../../../shared/ui/AvatarGroup';
import { EditMatchScoreSheet } from '../../../features/match/EditMatchScoreSheet';
import { PlayerDetailSheet } from '../../player/ui/PlayerDetailSheet';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { Player } from '../../../shared/types/index';
import { MOCK_PLAYERS } from '../../../shared/api/mock/mockPlayers';
import { Badge } from '../../../shared/ui/badge';

export interface ActiveGameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
  isMatchmaking?: boolean;
}

export const ActiveGameSheet: React.FC<ActiveGameSheetProps> = ({
  isOpen,
  onClose,
  onCloseAll,
  hasParent,
  isMatchmaking = false,
}) => {
  const { t } = useTranslation();
  const { 
    currentUser, 
    role,
    bannerStage,
    userAccepted,
    acceptProgress,
    setUserAccepted,
    setBannerStage,
    setAcceptedCount,
    matchedTeamA,
    matchedTeamB,
  } = useAppStore();
  const [isFinishSheetOpen, setIsFinishSheetOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setIsFinishSheetOpen(false);
      setSelectedPlayer(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAcceptMatch = () => {
    if (!userAccepted) {
      setUserAccepted(true);
      setBannerStage('waiting_others');
      setAcceptedCount(2);
    }
  };

  const rawTeamAPlayers: Player[] =
    matchedTeamA && matchedTeamA.length > 0
      ? matchedTeamA
      : [
          {
            id: currentUser.id,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
            level: currentUser.level,
            xp: currentUser.xp,
            status: 'queued',
            gamesPlayed: currentUser.gamesPlayed,
            wins: currentUser.wins,
            bpToday: currentUser.bpToday,
            winStreak: currentUser.winStreak,
          },
          MOCK_PLAYERS[0],
        ];

  const rawTeamBPlayers: Player[] =
    matchedTeamB && matchedTeamB.length > 0 ? matchedTeamB : [MOCK_PLAYERS[1], MOCK_PLAYERS[2]];

  const teamAPlayers: Player[] = rawTeamAPlayers.map((p, i) => ({
    ...p,
    isAccepted: !isMatchmaking || bannerStage === 'playing' ? true : (i === 0 ? userAccepted || bannerStage === 'all_accepted' : true)
  }));

  const acceptedCountStr = useAppStore.getState().acceptedCount || 2;
  const teamBPlayers: Player[] = rawTeamBPlayers.map((p, i) => ({
    ...p,
    isAccepted: !isMatchmaking || bannerStage === 'playing' ? true : (bannerStage === 'all_accepted' || (i === 0 ? acceptedCountStr >= 3 : acceptedCountStr >= 4))
  }));

  const isUserInGame = teamAPlayers.some((p) => p.id === currentUser.id) || teamBPlayers.some((p) => p.id === currentUser.id);
  const canFinishGame = role === 'coach' || isUserInGame;

  const handleCloseAllSheets = () => {
    setSelectedPlayer(null);
    setIsFinishSheetOpen(false);
    if (onCloseAll) {
      onCloseAll();
    } else {
      onClose();
    }
  };

  return (
    <>
      {!isFinishSheetOpen && (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        onCloseAll={handleCloseAllSheets}
        hasParent={hasParent}
        title={isMatchmaking && (bannerStage === 'searching' || bannerStage === 'host_searching') ? t('banner.findingMatch', 'Finding match...') : t('home.matchDetails', 'Match details')}
        zIndex={100}
      >
        <div className="w-full flex flex-col">
          {/* Status Pill Badge */}
          {(!isMatchmaking || (bannerStage !== 'searching' && bannerStage !== 'host_searching')) && (
            <div className="flex justify-center my-3">
              <Badge variant="neutral" size="lg">
                {!isMatchmaking || bannerStage === 'all_accepted' || bannerStage === 'playing'
                  ? t('home.playing', 'Playing')
                  : t('banner.matching', 'Matching')}
              </Badge>
            </div>
          )}

          {/* Content Area */}
          {isMatchmaking && (bannerStage === 'searching' || bannerStage === 'host_searching') ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary shrink-0 overflow-hidden mb-4">
                <span className="relative z-10 h-3 w-3 rounded-full bg-primary" />
                <span className="absolute h-full w-full rounded-full border border-primary opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]" style={{ animationDelay: '0s' }} />
                <span className="absolute h-full w-full rounded-full border border-primary opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]" style={{ animationDelay: '0.66s' }} />
                <span className="absolute h-full w-full rounded-full border border-primary opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]" style={{ animationDelay: '1.33s' }} />
              </div>
              <div className="text-sm font-semibold text-white animate-pulse">
                {t('banner.findingMatch', 'Finding match...')}
              </div>
            </div>
          ) : (
            <>
              {/* Teams & Avatars (44px avatars, vs in center, NO Team A/B text) */}
              <div className="flex items-center justify-center gap-[20px] my-6">
                <AvatarGroup
                  players={teamAPlayers}
                  size="lg"
                  stacked={true}
                  hasBorder={false}
                  ringColor="ring-[#121212]"
                  onSelectPlayer={(p) => setSelectedPlayer(p)}
                />

                <span className="font-sans text-[20px] font-bold text-muted-foreground">
                  vs
                </span>

                <AvatarGroup
                  players={teamBPlayers}
                  size="lg"
                  stacked={true}
                  hasBorder={false}
                  ringColor="ring-[#121212]"
                  onSelectPlayer={(p) => setSelectedPlayer(p)}
                />
              </div>

              {/* 3 Metrics Row (NO divider line) */}
              <div className="my-6 grid grid-cols-[1fr_1fr_auto] gap-x-2 text-left">
                <div>
                  <div className="font-sans text-xs text-muted-foreground font-medium">{t('common.date', 'Date')}</div>
                  <div className="font-sans text-sm font-semibold text-white mt-1">Jul 1, 2026</div>
                </div>
                <div>
                  <div className="font-sans text-xs text-muted-foreground font-medium">{t('common.time', 'Time')}</div>
                  <div className="font-sans text-sm font-semibold text-white mt-1">{isMatchmaking && bannerStage !== 'playing' ? '-' : '16m 40s'}</div>
                </div>
                <div>
                  <div className="font-sans text-xs text-muted-foreground font-medium">{t('common.court', 'Court')}</div>
                  <div className="font-sans text-sm font-semibold text-white mt-1"># 1</div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Action Button */}
          {isMatchmaking && (bannerStage === 'searching' || bannerStage === 'host_searching') ? (
            <button
              disabled
              className="flex h-[52px] w-full items-center justify-center rounded-full font-sans text-base font-bold transition-all mt-[24px] bg-[#2C2C2E] text-muted-foreground cursor-not-allowed"
            >
              {t('banner.findingMatch', 'Finding match...')}
            </button>
          ) : isMatchmaking && bannerStage === 'waiting_user' && !userAccepted ? (
            <button
              onClick={handleAcceptMatch}
              className="relative overflow-hidden flex h-[52px] w-full items-center justify-center rounded-full font-sans text-base font-bold transition-all mt-[24px] bg-[#2C2C2E] text-primary-foreground hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <div 
                className="absolute right-0 top-0 bottom-0 bg-primary transition-all duration-75"
                style={{ width: `${Math.max(0, (1 - acceptProgress) * 100)}%` }}
              />
              <span className="relative z-10">{t('banner.accept', 'Accept match')}</span>
            </button>
          ) : isMatchmaking && (bannerStage === 'waiting_others' || (bannerStage === 'waiting_user' && userAccepted)) ? (
            <button
              disabled
              className="flex h-[52px] w-full items-center justify-center rounded-full font-sans text-base font-bold transition-all mt-[24px] bg-[#2C2C2E] text-muted-foreground cursor-not-allowed"
            >
              {t('banner.waitingForMore', { count: 4 - (useAppStore.getState().acceptedCount || 2), defaultValue: 'Waiting for others...' })}
            </button>
          ) : (
            <button
              onClick={() => setIsFinishSheetOpen(true)}
              disabled={!canFinishGame}
              className={`flex h-[52px] w-full items-center justify-center rounded-full font-sans text-base font-bold shadow-lg transition-all mt-[24px] ${
                canFinishGame
                  ? 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 active:scale-95 cursor-pointer'
                  : 'bg-card text-muted-foreground border border-border opacity-50 cursor-not-allowed'
              }`}
            >
              {canFinishGame ? t('common.finish', 'Finish') : t('home.onlyPlayersFinish', 'Only players can finish')}
            </button>
          )}
        </div>
      </BottomSheet>
      )}

      {/* Finish Game Score Entry Sheet Modal */}
      <EditMatchScoreSheet
        isOpen={isFinishSheetOpen}
        onClose={() => setIsFinishSheetOpen(false)}
        onCloseAll={handleCloseAllSheets}
        hasParent={true}
        teamA={teamAPlayers}
        teamB={teamBPlayers}
        onSave={(scoreA, scoreB) => {
          useAppStore.getState().finishMatch(scoreA, scoreB);
          setIsFinishSheetOpen(false);
          onClose();
        }}
      />

      {/* Player Detail Sheet Modal (z-[140]) */}
      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onCloseAll={handleCloseAllSheets}
        hasParent={true}
      />
    </>
  );
};
