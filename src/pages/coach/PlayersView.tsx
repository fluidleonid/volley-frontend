import React, { useState } from 'react';
import { StatCard } from '../../entities/stats/ui/StatCard';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { PlayerListItem } from '../../entities/player/ui/PlayerListItem';
import { Plus, Search, ChevronLeft, MessageSquare, Users } from 'lucide-react';
import { EmptyState } from '../../shared/ui/EmptyState';
import { CreateNewPlayerSheet } from '../../features/player/CreateNewPlayerSheet';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { useScroll } from '../../shared/hooks/useScroll';
import { SelectPlayerForSessionSheet } from '../../features/session/SelectPlayerForSessionSheet';
import { Player } from '../../shared/types/index';
import { Dialog } from '../../shared/ui/Dialog';
import { Button } from '../../shared/ui/button';

type TabType = 'authorized' | 'manual';

export const PlayersView: React.FC = () => {
  const { t } = useTranslation();
  const { allPlayers, createManualPlayer } = useAppStore();
  const [tab, setTab] = useState<TabType>('authorized');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrolled = useScroll();

  // Link Account Flow States
  const [linkTargetPlayer, setLinkTargetPlayer] = useState<Player | null>(null);
  const [isSelectPlayerOpen, setIsSelectPlayerOpen] = useState(false);
  const [isConfirmLinkOpen, setIsConfirmLinkOpen] = useState(false);
  const [playerToMerge, setPlayerToMerge] = useState<Player | null>(null);

  const authorizedPlayers = allPlayers.filter(p => p.hasTelegram);
  const manualPlayers = allPlayers.filter(p => !p.hasTelegram);

  const displayedPlayers = isSearchMode 
    ? allPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : (tab === 'authorized' ? authorizedPlayers : manualPlayers);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'authorized', label: t('coach.players.authorized', 'Authorized') },
    { id: 'manual', label: t('coach.players.manual', 'Manual') },
  ];

  return (
    <div className="bg-background text-white pb-32 px-4 max-w-[480px] select-none mx-auto relative">
      {/* Sticky Header */}
      <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-5 transition-all duration-300 ${scrolled || isSearchMode ? 'bg-background/90 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="flex items-center h-[44px]">
          {isSearchMode ? (
            <div className="flex items-center gap-3 w-full animate-fade-in">
              <button 
                onClick={() => { setIsSearchMode(false); setSearchQuery(''); }}
                className="flex shrink-0 h-[44px] w-[44px] items-center justify-center rounded-full bg-card hover:bg-brand-surfaceElevated active:scale-95 transition-all text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <input
                type="text"
                autoFocus
                placeholder={t('coach.players.searchPlaceholder', 'Search players...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] rounded-full bg-card px-4 text-base font-medium text-white placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full animate-fade-in">
              <h1 className="text-[30px] font-bold text-white tracking-tight">{t('nav.players', 'Players')}</h1>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSearchMode(true)}
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-card hover:bg-brand-surfaceElevated active:scale-95 transition-all text-white"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 active:scale-95 transition-all"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isSearchMode && (
        <>
          <div className="grid grid-cols-3 gap-3 my-6 animate-fade-in">
            <StatCard value={allPlayers.length} label={t('coach.players.totalPlayers', 'Total players')} />
            <StatCard value={allPlayers.length > 0 ? Math.max(1, Math.floor(allPlayers.length * 0.7)) : 0} label={t('coach.players.active7d', 'Active 7D')} />
            <StatCard value={manualPlayers.length} label={t('coach.players.manual7d', 'Manual 7D')} />
          </div>

          {/* Segment Controller */}
          <div className="flex rounded-[20px] bg-card p-1 mb-6 relative w-full animate-fade-in">
            {tabs.map((t, i) => {
              const isActive = tab === t.id;
              return (
                <div key={t.id} className="relative flex-1 flex">
                  <button
                    onClick={() => setTab(t.id)}
                    className={`flex-1 rounded-[20px] py-1.5 text-sm font-bold transition-all relative z-10 ${
                      isActive ? 'bg-secondary text-white shadow' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                  {/* Vertical Divider */}
                  {!isActive && i < tabs.length - 1 && tab !== tabs[i + 1].id && (
                    <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-secondary pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Players List */}
      <div className="flex flex-col mt-2">
        {displayedPlayers.length > 0 ? (
          displayedPlayers.map((player) => {
            return (
              <PlayerListItem
                key={player.id}
                player={player}
                onClick={(p) => setSelectedPlayer(p)}
                rightContent={
                  player.hasTelegram ? (
                    <Button 
                      variant="secondary"
                      size="sm"
                      fullWidth={false}
                      onClick={(e: React.MouseEvent) => { 
                        e.stopPropagation(); 
                        console.log('Message player', player.name); 
                      }}
                      className="shadow-sm font-semibold"
                    >
                      <MessageSquare />
                      {t('common.message', 'Message')}
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary"
                      size="sm"
                      fullWidth={false}
                      onClick={(e: React.MouseEvent) => { 
                        e.stopPropagation(); 
                        setLinkTargetPlayer(player);
                        setIsSelectPlayerOpen(true);
                      }} 
                      className="shadow-sm font-semibold"
                    >
                      {t('profile.linkAccount', 'Link account')}
                    </Button>
                  )
                }
              />
            );
          })
        ) : (
          <EmptyState
            variant="page"
            icon={Users}
            message={t('coach.players.noPlayersTitle', 'No players yet')}
            description={t('coach.players.noPlayersFound', 'No players found in this category.')}
          />
        )}
      </div>

      <CreateNewPlayerSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreatePlayer={async (data) => {
          await createManualPlayer({ name: data.name, phone: data.phone, level: data.level });
          setIsCreateOpen(false);
        }}
      />

      <PlayerDetailSheet
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        player={selectedPlayer}
      />

      <SelectPlayerForSessionSheet
        isOpen={isSelectPlayerOpen}
        onClose={() => setIsSelectPlayerOpen(false)}
        title={t('coach.players.linkAccount', 'Link account')}
        subtitle={t('coach.players.selectPlayerToLink', 'Select a player to link')}
        mode="single"
        hideAddButtons
        onSelectPlayer={(selectedPlayer) => {
          setIsSelectPlayerOpen(false);
          if (selectedPlayer) {
            setPlayerToMerge(selectedPlayer);
            setIsConfirmLinkOpen(true);
          }
        }}
      />

      <Dialog
        isOpen={isConfirmLinkOpen}
        onClose={() => setIsConfirmLinkOpen(false)}
        title={t('coach.players.confirmLinkTitle', 'Confirm merge')}
        description={t('coach.players.confirmLinkDesc', 'Players will be merged. BP will be summed up, and the higher level and XP will be kept. the manual player will be removed.')}
        primaryButtonText={t('common.confirm', 'Confirm')}
        primaryButtonOnClick={() => {
          console.log('Merging', linkTargetPlayer?.name, 'with', playerToMerge?.name);
          setIsConfirmLinkOpen(false);
        }}
        secondaryButtonText={t('common.cancel', 'Cancel')}
        secondaryButtonOnClick={() => setIsConfirmLinkOpen(false)}
      />
    </div>
  );
};
