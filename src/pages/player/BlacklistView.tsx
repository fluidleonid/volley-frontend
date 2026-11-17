import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { Header } from '../../widgets/layout/Header';
import { PlayerListItem } from '../../entities/player/ui/PlayerListItem';
import { MOCK_PLAYERS } from '../../shared/api/mock/mockPlayers';
import { Badge } from '../../shared/ui/badge';
import { Ban } from 'lucide-react';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { Player } from '../../shared/types/index';

interface BlacklistViewProps {
  onClose?: () => void;
}

export const BlacklistView: React.FC<BlacklistViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { blacklistedPlayerIds, toggleBlacklist, setActiveTab, previousTab, isStaging, allPlayers } = useAppStore();
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab(previousTab || 'home');
    }
  };

  const blacklistedPlayers = (isStaging ? MOCK_PLAYERS : allPlayers).filter(p => blacklistedPlayerIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header 
        variant="page" 
        sticky 
        stickyClassName="-mx-4 px-4"
        title={t('profile.blacklist', 'Blacklist')} 
        onBack={handleBack} 
      />

      <div className="flex-1 overflow-y-auto pb-24 mt-4 space-y-2">
        {blacklistedPlayers.length > 0 ? (
          blacklistedPlayers.map((player) => (
            <PlayerListItem
              key={player.id}
              player={player}
              onClick={() => setSelectedPlayer(player)}
              rightContent={
                <Badge
                  variant="neutral"
                  className="min-w-[72px] w-auto px-2 whitespace-nowrap cursor-pointer active:scale-95 transition-transform"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    toggleBlacklist(player.id);
                  }}
                >
                  {t('common.remove', 'Remove')}
                </Badge>
              }
            />
          ))
        ) : (
          <EmptyState
            variant="page"
            icon={Ban}
            message={t('profile.blacklistEmpty', 'No players in blacklist')}
            description={t('profile.blacklistEmptyDesc', 'Blocked players will appear here')}
          />
        )}
      </div>

      <PlayerDetailSheet
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        hasParent
      />
    </div>
  );
};
