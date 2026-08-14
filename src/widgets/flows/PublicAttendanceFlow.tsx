import React, { useState } from 'react';
import { Player } from '../../shared/types/index';
import { SelectPlayerForSessionSheet } from '../../features/session/SelectPlayerForSessionSheet';
import { AddGuestPlayerSheet } from '../../features/player/AddGuestPlayerSheet';
import { CreateNewPlayerSheet } from '../../features/player/CreateNewPlayerSheet';

interface PublicAttendanceFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayers: (players: Player[]) => void;
  onAddGuest: (data: { name: string; level?: string }) => void;
  onCreatePlayer: (data: { name: string; phone: string; username: string; level: string }) => void;
}

export const PublicAttendanceFlow: React.FC<PublicAttendanceFlowProps> = ({ 
  isOpen, 
  onClose,
  onAddPlayers,
  onAddGuest,
  onCreatePlayer
}) => {
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isCreatePlayerOpen, setIsCreatePlayerOpen] = useState(false);

  return (
    <>
      <SelectPlayerForSessionSheet
        isOpen={isOpen && !isAddGuestOpen && !isCreatePlayerOpen}
        onClose={onClose}
        mode="multiple"
        title="Today's attendance"
        subtitle="Check in registered players"
        onSelectPlayers={(players) => {
          onAddPlayers(players);
          onClose();
        }}
        onAddGuest={() => setIsAddGuestOpen(true)}
        onCreateNewPlayer={() => setIsCreatePlayerOpen(true)}
      />

      <AddGuestPlayerSheet
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title="Add a guest player"
        subtitle="Check in guest player"
        requireLevel={true}
        onAddGuest={(data) => {
          onAddGuest(data);
          setIsAddGuestOpen(false);
          onClose();
        }}
      />

      <CreateNewPlayerSheet
        isOpen={isCreatePlayerOpen}
        onClose={() => setIsCreatePlayerOpen(false)}
        onCreatePlayer={(data) => {
          onCreatePlayer(data);
          setIsCreatePlayerOpen(false);
          onClose();
        }}
      />
    </>
  );
};
