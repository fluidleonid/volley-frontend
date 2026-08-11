import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from './button';
import { Player } from '../../types';
import { ChevronDown, Calendar, Clock, User } from 'lucide-react';
import { SelectPlayerForSessionSheet } from './SelectPlayerForSessionSheet';
import { AddGuestPlayerSheet } from './AddGuestPlayerSheet';
import { CreateNewPlayerSheet } from './CreateNewPlayerSheet';
import { CustomDatePicker } from './CustomDatePicker';
import { CustomTimePicker } from './CustomTimePicker';

interface PrivateSessionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: { player: Player | { name: string, level?: string }; date: string; time: string }) => void;
}

export const PrivateSessionFlow: React.FC<PrivateSessionFlowProps> = ({ isOpen, onClose, onSchedule }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | { name: string, level?: string } | null>(null);
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
        Private session
      </h3>
      <p className="font-sans text-xs text-[#8E8E93] font-normal">
        Select player and schedule a session
      </p>
    </div>
  );

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={150}>
        <div className="p-4 space-y-4 pt-2">
          {/* Select Player */}
          <button
            onClick={() => setIsSelectPlayerOpen(true)}
            className="w-full h-[56px] bg-[#1C1C1E] border border-transparent hover:border-[#68BD44]/50 rounded-[20px] px-4 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="h-[22px] w-[22px] text-[#8E8E93]" />
              {selectedPlayer ? (
                <div className="flex flex-col items-start justify-center h-full pt-0.5">
                  <span className="text-[11px] text-[#8E8E93] font-medium leading-none mb-1">Player</span>
                  <span className="text-base text-white font-medium leading-none tracking-tight">
                    {'id' in selectedPlayer ? selectedPlayer.name : selectedPlayer.name}
                  </span>
                </div>
              ) : (
                <span className="text-base text-[#8E8E93] font-medium tracking-tight">Select player</span>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-[#8E8E93]" />
          </button>

          {/* Date Picker */}
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="w-full h-[56px] bg-[#1C1C1E] border border-transparent hover:border-[#68BD44]/50 rounded-[20px] px-4 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-[22px] w-[22px] text-[#8E8E93]" />
              <div className="flex flex-col items-start justify-center h-full pt-0.5">
                <span className="text-[11px] text-[#8E8E93] font-medium leading-none mb-1">Date</span>
                <span className="text-base text-white font-medium leading-none tracking-tight">{date}</span>
              </div>
            </div>
          </button>

          {/* Time Picker */}
          <button
            onClick={() => setIsTimePickerOpen(true)}
            className="w-full h-[56px] bg-[#1C1C1E] border border-transparent hover:border-[#68BD44]/50 rounded-[20px] px-4 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="h-[22px] w-[22px] text-[#8E8E93]" />
              <div className="flex flex-col items-start justify-center h-full pt-0.5">
                <span className="text-[11px] text-[#8E8E93] font-medium leading-none mb-1">Time</span>
                <span className="text-base text-white font-medium leading-none tracking-tight">{time}</span>
              </div>
            </div>
          </button>

          <div className="pt-2">
            <Button
              onClick={handleSchedule}
              fullWidth
              disabled={!selectedPlayer}
              className="shadow-lg shadow-[#68BD44]/20"
            >
              Schedule session
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
          setIsSelectPlayerOpen(false);
          setIsAddGuestOpen(true);
        }}
        onCreateNewPlayer={() => {
          setIsSelectPlayerOpen(false);
          setIsCreatePlayerOpen(true);
        }}
      />

      <AddGuestPlayerSheet
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        requireLevel={false}
        onAddGuest={(data) => {
          setSelectedPlayer(data);
          setIsAddGuestOpen(false);
        }}
      />

      <CreateNewPlayerSheet
        isOpen={isCreatePlayerOpen}
        onClose={() => setIsCreatePlayerOpen(false)}
        onCreatePlayer={(data) => {
          setSelectedPlayer(data); // In reality this would create it in the backend
          setIsCreatePlayerOpen(false);
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
