import React, { useState } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Button } from '../../shared/ui/button';
import { Player } from '../../shared/types/index';
import { ChevronDown, Calendar, Clock, HatGlasses, IdCardLanyard } from 'lucide-react';
import { SelectPlayerForSessionSheet } from '../../features/session/SelectPlayerForSessionSheet';
import { AddGuestPlayerSheet } from '../../features/player/AddGuestPlayerSheet';
import { CreateNewPlayerSheet } from '../../features/player/CreateNewPlayerSheet';
import { CustomDatePicker } from '../../shared/ui/CustomDatePicker';
import { CustomTimePicker } from '../../shared/ui/CustomTimePicker';
import { Avatar } from '../../shared/ui/Avatar';

interface PrivateSessionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: { player: Player | { name: string, level?: string }; date: string; time: string }) => void;
  initialPlayer?: Player | null;
  readOnlyPlayer?: boolean;
}

export const PrivateSessionFlow: React.FC<PrivateSessionFlowProps> = ({ isOpen, onClose, onSchedule, initialPlayer, readOnlyPlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | { name: string, level?: string } | null>(initialPlayer || null);
  const [date, setDate] = useState<string>('Today');
  const [time, setTime] = useState<string>('10:00');

  const [isSelectPlayerOpen, setIsSelectPlayerOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isCreatePlayerOpen, setIsCreatePlayerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handleSchedule = () => {
    if (selectedPlayer && date && time) {
      onSchedule({ player: selectedPlayer, date, time });
      onClose();
      // Reset state
      setSelectedPlayer(null);
      setDate('Today');
      setTime('10:00');
    }
  };

  const titleNode = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        {readOnlyPlayer ? 'Reschedule session' : 'Private session'}
      </h3>
      <p className="font-sans text-xs text-muted-foreground font-normal">
        {readOnlyPlayer ? 'Select a new date and time' : 'Select player and schedule a session'}
      </p>
    </div>
  );

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={150}>
        <div className="space-y-4 pt-2">
          {/* Select Player (Hidden in reschedule mode) */}
          {!readOnlyPlayer && (
            <button
              onClick={() => setIsSelectPlayerOpen(true)}
              className="relative w-full h-[52px] bg-card border border-transparent hover:border-primary/50 rounded-full flex items-center transition-colors text-left pr-4"
            >
              <div className="text-muted-foreground shrink-0 pointer-events-none flex items-center justify-center pl-4">
                {selectedPlayer ? (
                  'id' in selectedPlayer ? (
                    <Avatar
                      src={selectedPlayer.avatarUrl}
                      alt={selectedPlayer.name}
                      initials={selectedPlayer.name.charAt(0).toUpperCase()}
                      size="xs"
                      hasBorder={false}
                    />
                  ) : (
                    <HatGlasses className="h-5 w-5" />
                  )
                ) : (
                  <IdCardLanyard className="h-5 w-5" />
                )}
              </div>
              <div className="relative flex-1 h-full flex flex-col justify-center">
                {selectedPlayer ? (
                  <div className="pt-4 pb-1 h-full flex flex-col justify-center">
                    <span className="absolute left-2 top-[4px] text-xs text-muted-foreground font-medium pointer-events-none">Player</span>
                    <span className="pl-2 pr-4 text-base text-white font-medium tracking-tight truncate block">
                      {'id' in selectedPlayer ? selectedPlayer.name : selectedPlayer.name}
                    </span>
                  </div>
                ) : (
                  <span className="pl-2 pr-4 text-base text-muted-foreground font-medium tracking-tight block">Select player</span>
                )}
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            </button>
          )}

          {/* Date Picker */}
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="relative w-full h-[52px] bg-card border border-transparent hover:border-primary/50 rounded-full flex items-center transition-colors text-left pr-4"
          >
            <div className="text-muted-foreground shrink-0 pointer-events-none flex items-center justify-center pl-4">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="relative flex-1 h-full flex flex-col justify-center pt-4 pb-1">
              <span className="absolute left-2 top-[4px] text-xs text-muted-foreground font-medium pointer-events-none">Date</span>
              <span className="pl-2 pr-4 text-base text-white font-medium tracking-tight truncate block">{date}</span>
            </div>
          </button>

          {/* Time Picker */}
          <button
            onClick={() => setIsTimePickerOpen(true)}
            className="relative w-full h-[52px] bg-card border border-transparent hover:border-primary/50 rounded-full flex items-center transition-colors text-left pr-4"
          >
            <div className="text-muted-foreground shrink-0 pointer-events-none flex items-center justify-center pl-4">
              <Clock className="h-5 w-5" />
            </div>
            <div className="relative flex-1 h-full flex flex-col justify-center pt-4 pb-1">
              <span className="absolute left-2 top-[4px] text-xs text-muted-foreground font-medium pointer-events-none">Time</span>
              <span className="pl-2 pr-4 text-base text-white font-medium tracking-tight truncate block">{time}</span>
            </div>
          </button>

          <div className="pt-2">
            <Button
              onClick={handleSchedule}
              fullWidth
              size="xl"
              disabled={!readOnlyPlayer && !selectedPlayer}
              className="shadow-lg shadow-primary/20"
            >
              {readOnlyPlayer ? 'Save' : 'Schedule session'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      <SelectPlayerForSessionSheet
        isOpen={isSelectPlayerOpen}
        onClose={() => setIsSelectPlayerOpen(false)}
        mode="single"
        title="Private session"
        subtitle="Select player for a session"
        selectedPlayerIds={selectedPlayer && 'id' in selectedPlayer ? [selectedPlayer.id] : []}
        onSelectPlayer={(p) => {
          setSelectedPlayer(p);
          setIsSelectPlayerOpen(false);
        }}
        onAddGuest={() => {
          setIsAddGuestOpen(true);
        }}
        onCreateNewPlayer={() => {
          setIsCreatePlayerOpen(true);
        }}
      />

      <AddGuestPlayerSheet
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        requireLevel={false}
        hasParent={true}
        onAddGuest={(data) => {
          setSelectedPlayer(data);
          setIsAddGuestOpen(false);
          setIsSelectPlayerOpen(false);
        }}
      />

      <CreateNewPlayerSheet
        isOpen={isCreatePlayerOpen}
        onClose={() => setIsCreatePlayerOpen(false)}
        hasParent={true}
        onCreatePlayer={(data) => {
          setSelectedPlayer(data); // In reality this would create it in the backend
          setIsCreatePlayerOpen(false);
          setIsSelectPlayerOpen(false);
        }}
      />

      <CustomDatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(d) => { setDate(d); setIsDatePickerOpen(false); }}
        initialDate={date === 'Today' ? new Date().toISOString().split('T')[0] : date}
      />

      <CustomTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(t) => { setTime(t); setIsTimePickerOpen(false); }}
        initialTime={time}
      />
    </>
  );
};
