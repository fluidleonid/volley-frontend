import React from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Dialog } from '../../shared/ui/Dialog';
import { LogOut, XSquare } from 'lucide-react';
import { useState } from 'react';

export interface PartyOptionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

export const PartyOptionsSheet: React.FC<PartyOptionsSheetProps> = ({
  isOpen,
  onClose,
  onLeave
}) => {
  const { t } = useTranslation();

  const [confirmAction, setConfirmAction] = useState<'leave' | 'close' | null>(null);

  const handleConfirm = () => {
    onLeave(); // For now both actions do the same under the hood
    onClose();
    setConfirmAction(null);
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t('party.options', 'Party options')}
      >
        <div className="flex flex-col gap-2 pb-8">
          <button
            onClick={() => setConfirmAction('leave')}
            className="w-full flex items-center justify-between p-4 rounded-[20px] bg-card hover:bg-card/80 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-active:scale-95 transition-transform">
                <LogOut className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-white text-base">{t('party.leave', 'Leave')}</span>
            </div>
          </button>

          <button
            onClick={() => setConfirmAction('close')}
            className="w-full flex items-center justify-between p-4 rounded-[20px] bg-card hover:bg-card/80 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-active:scale-95 transition-transform">
                <XSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-white text-base">{t('party.close', 'Close party')}</span>
            </div>
          </button>
        </div>
      </BottomSheet>

      <Dialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={t('common.areYouSure', 'Are you sure?')}
        description={
          confirmAction === 'leave'
            ? t('party.leaveConfirmDesc', 'Are you sure you want to leave the party?')
            : t('party.closeConfirmDesc', 'Are you sure you want to close the party? All members will be disconnected.')
        }
        primaryButtonText={t('common.confirm', 'Confirm')}
        primaryButtonOnClick={handleConfirm}
        secondaryButtonText={t('common.cancel', 'Cancel')}
        secondaryButtonOnClick={() => setConfirmAction(null)}
      />
    </>
  );
};
