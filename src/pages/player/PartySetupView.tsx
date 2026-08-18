import React, { useState, useEffect } from 'react';
import { Plus, Rotate3D, Shield, Sword, MoreVertical, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { Avatar } from '../../shared/ui/Avatar';
import { Player } from '../../shared/types/index';
import { Header } from '../../widgets/layout/Header';
import { SelectPlayerSheet } from '../../features/session/SelectPlayerSheet';
import { TeamPlacementSheet } from '../../features/party/TeamPlacementSheet';
import { PartyOptionsSheet } from '../../features/party/PartyOptionsSheet';

export interface PartySetupViewProps {
  onClose?: () => void;
}

export const PartySetupView: React.FC<PartySetupViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { currentUser, setActiveTab, partyPlayers, setPartyPlayers, partyPlacement, setPartyPlacement, isPartyActive, setPartyActive } = useAppStore();

  const [localPlayers, setLocalPlayers] = useState<Player[]>(
    partyPlayers.length > 0 ? partyPlayers : [currentUser]
  );
  
  const [localPlacement, setLocalPlacement] = useState<'any' | 'teammates' | 'rivals'>(partyPlacement);

  const [isPlayerPickerOpen, setIsPlayerPickerOpen] = useState(false);
  const [isPlacementSheetOpen, setIsPlacementSheetOpen] = useState(false);
  const [isOptionsSheetOpen, setIsOptionsSheetOpen] = useState(false);

  const isPlacementLocked = localPlayers.length > 2;

  useEffect(() => {
    if (isPlacementLocked && localPlacement !== 'any') {
      setLocalPlacement('any');
    }
  }, [isPlacementLocked, localPlacement]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab('home');
    }
  };

  const handleAction = () => {
    setPartyPlayers(localPlayers);
    setPartyPlacement(localPlacement);
    setPartyActive(true);
    handleBack();
  };

  const handleTogglePlayer = (player: Player) => {
    setLocalPlayers((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) return prev.filter((p) => p.id !== player.id);
      return [...prev, player];
    });
  };

  const getPlacementIcon = () => {
    switch(localPlacement) {
      case 'teammates': return <Shield className="h-5 w-5" />;
      case 'rivals': return <Sword className="h-5 w-5" />;
      default: return <Rotate3D className="h-5 w-5" />;
    }
  };

  const getPlacementLabel = () => {
    switch(localPlacement) {
      case 'teammates': return t('party.teammates', 'Teammates');
      case 'rivals': return t('party.rivals', 'Rivals');
      default: return t('party.any', 'Any');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header
        variant="page"
        title={t('party.title', 'Party setup')}
        onBack={handleBack}
        sticky
        stickyClassName="-mx-4 px-4"
        rightContent={
          isPartyActive ? (
            <button
              onClick={() => setIsOptionsSheetOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-card hover:bg-card/80 transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-none pt-2">
        <div className="space-y-6">
          
          {/* Avatar Block */}
          <div className="bg-card rounded-[24px] p-4 flex flex-wrap gap-3">
            {localPlayers.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <Avatar src={p.avatarUrl} alt={p.name} initials={p.name[0]} size="lg" hasBorder={false} />
              </div>
            ))}
            
            <div className="flex flex-col items-center">
              <button 
                onClick={() => setIsPlayerPickerOpen(true)}
                className="h-[44px] w-[44px] rounded-full bg-secondary text-white flex items-center justify-center hover:bg-brand-surfaceElevated active:scale-95 transition-all"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Placement Selector */}
          <div className="space-y-2">
            <button
              disabled={isPlacementLocked}
              onClick={() => setIsPlacementSheetOpen(true)}
              className={`relative w-full h-[52px] bg-card border border-transparent rounded-full flex items-center transition-colors text-left pr-4 ${isPlacementLocked ? 'opacity-80 cursor-not-allowed' : 'hover:border-primary/50'}`}
            >
              <div className="text-muted-foreground shrink-0 pointer-events-none flex items-center justify-center pl-4 pr-1">
                {getPlacementIcon()}
              </div>
              <div className="relative flex-1 h-full flex flex-col justify-center pt-4 pb-1">
                <span className="absolute left-2 top-[4px] text-xs text-muted-foreground font-medium pointer-events-none">{t('party.teamPlacement', 'Team placement')}</span>
                <span className="pl-2 pr-4 text-base text-white font-medium tracking-tight truncate block">
                  {getPlacementLabel()}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            </button>
            {isPlacementLocked && (
              <p className="text-xs text-muted-foreground text-center px-4 leading-tight">
                {t('party.placementLockedHint', 'Team placement is locked to Any when there are more than 2 players.')}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Footer Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md z-40 max-w-[480px] mx-auto pb-10">
        <button
          onClick={handleAction}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-sans text-base font-bold transition-all active:scale-[0.98] hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {isPartyActive ? t('common.saveChanges', 'Save changes') : t('party.createParty', 'Create party')}
        </button>
      </div>

      {/* Picker Sheets */}
      <SelectPlayerSheet
        isOpen={isPlayerPickerOpen}
        onClose={() => setIsPlayerPickerOpen(false)}
        title={t('party.selectPlayersTitle', 'Select players')}
        subtitle={t('party.selectPlayersSubtitle', 'Add friends to your party')}
        selectedPlayerIds={localPlayers.map(p => p.id)}
        onTogglePlayer={handleTogglePlayer}
      />

      <TeamPlacementSheet 
        isOpen={isPlacementSheetOpen}
        onClose={() => setIsPlacementSheetOpen(false)}
        selected={localPlacement}
        onSelect={setLocalPlacement}
      />

      <PartyOptionsSheet
        isOpen={isOptionsSheetOpen}
        onClose={() => setIsOptionsSheetOpen(false)}
        onLeave={() => {
          setPartyActive(false);
          handleBack();
        }}
      />
    </div>
  );
};
