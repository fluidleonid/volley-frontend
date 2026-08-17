import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Player } from '../../shared/types/index';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/button';
import { Dialog } from '../../shared/ui/Dialog';
import { useState } from 'react';

interface SessionDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onAvatarClick?: () => void;
  hasParent?: boolean;
  sessionDate?: string;
  sessionTime?: string;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export const SessionDetailsSheet: React.FC<SessionDetailsSheetProps> = ({
  isOpen,
  onClose,
  player,
  onAvatarClick,
  hasParent,
  sessionDate = 'Today',
  sessionTime = '18:00',
  onReschedule,
  onCancel,
}) => {
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  if (!isOpen || !player) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Session details" hasParent={hasParent}>
      <div className="flex flex-col items-center mt-2 px-2 pb-2">
        <div 
          className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
          onClick={onAvatarClick}
        >
          <Avatar 
            src={player.avatarUrl} 
            alt={player.name} 
            initials={player.name[0]} 
            size="xl" 
          />
          <h2 className="font-display text-xl font-bold text-white mt-3">
            {player.name}
          </h2>
        </div>

        {/* Metrics Grid similar to MatchDetailSheet */}
        <div className="my-8 grid grid-cols-2 gap-y-6 gap-x-2 text-left pb-4 w-full px-4">
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Date</div>
            <div className="font-sans text-sm font-semibold text-white">
              {sessionDate}
            </div>
          </div>
          <div>
            <div className="font-sans text-xs text-muted-foreground font-medium mb-1">Time</div>
            <div className="font-sans text-sm font-semibold text-white">
              {sessionTime}
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 mt-4">
          <Button fullWidth size="lg" variant="secondary" onClick={() => {
            if (onReschedule) onReschedule();
            else onClose();
          }}>
            Reschedule
          </Button>
          <button 
            className="w-full h-[52px] rounded-full bg-card flex items-center justify-center text-[#FF453A] font-bold hover:bg-brand-surfaceElevated active:scale-95 transition-all" 
            onClick={() => setIsCancelConfirmOpen(true)}
          >
            Cancel session
          </button>
        </div>
      </div>

      <Dialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        title="Cancel Session"
        description="Are you sure you want to cancel this private session? The player will be notified."
        primaryButtonText="Cancel Session"
        primaryButtonOnClick={() => {
          setIsCancelConfirmOpen(false);
          if (onCancel) onCancel();
          else onClose();
        }}
        secondaryButtonText="Keep Session"
        secondaryButtonOnClick={() => setIsCancelConfirmOpen(false)}
      />
    </BottomSheet>
  );
};
