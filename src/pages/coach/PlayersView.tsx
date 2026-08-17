import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { Header } from '../../widgets/layout/Header';
import { StatCard } from '../../entities/stats/ui/StatCard';
import { MOCK_PLAYERS } from '../../shared/api/mock/mockPlayers';
import { Player } from '../../shared/types/index';
import { Avatar } from '../../shared/ui/Avatar';
import { Badge } from '../../shared/ui/badge';
import { Plus, Search, ChevronLeft } from 'lucide-react';
import { CreateNewPlayerSheet } from '../../features/player/CreateNewPlayerSheet';
import { PlayerDetailSheet } from '../../entities/player/ui/PlayerDetailSheet';
import { useScroll } from '../../shared/hooks/useScroll';
import { getPlayerTierInfo } from '../../shared/lib/tier';

type TabType = 'authorized' | 'manual';

export const PlayersView: React.FC = () => {
  const [tab, setTab] = useState<TabType>('authorized');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrolled = useScroll();

  const authorizedPlayers = MOCK_PLAYERS.filter(p => p.hasTelegram);
  const manualPlayers = MOCK_PLAYERS.filter(p => !p.hasTelegram);

  const displayedPlayers = isSearchMode 
    ? MOCK_PLAYERS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : (tab === 'authorized' ? authorizedPlayers : manualPlayers);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'authorized', label: 'Authorized' },
    { id: 'manual', label: 'Manual' },
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
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] rounded-full bg-card px-4 text-base font-medium text-white placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/50 transition-colors"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full animate-fade-in">
              <h1 className="text-[30px] font-bold text-white tracking-tight">Players</h1>

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
            <StatCard value={MOCK_PLAYERS.length} label="Total players" />
            <StatCard value={Math.max(1, Math.floor(MOCK_PLAYERS.length * 0.7))} label="Active 7D" />
            <StatCard value={manualPlayers.length} label="Manual 7D" />
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
            const tierInfo = getPlayerTierInfo(player.level);
            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="flex items-center justify-between py-3 border-b border-dashed border-border/60 last:border-b-0 cursor-pointer hover:bg-brand-surfaceElevated transition-colors active:scale-[0.98] px-2 -mx-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="md" hasBorder={false} />
                  <div>
                    <span className="font-display text-base font-semibold text-white tracking-tight leading-tight">{player.name}</span>
                    <div className="text-[13px] text-muted-foreground mt-0.5">{tierInfo.tierName} • {player.xp} XP</div>
                  </div>
                </div>
                {player.hasTelegram && (
                  <Badge 
                    variant="neutral" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      console.log('Message player', player.name); 
                    }} 
                    className="px-3 py-1 cursor-pointer text-white hover:bg-brand-surfaceElevated shadow-sm"
                  >
                    Message
                  </Badge>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No players found in this category.</p>
          </div>
        )}
      </div>

      <CreateNewPlayerSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreatePlayer={(data) => {
          console.log('Created new player', data);
          setIsCreateOpen(false);
        }}
      />

      <PlayerDetailSheet
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        player={selectedPlayer}
      />
    </div>
  );
};
