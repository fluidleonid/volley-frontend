import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Badge } from '../../shared/ui/badge';
import { CreditCard, Banknote } from 'lucide-react';
import { useAppStore } from '../../app/store/appStore';

import { Avatar } from '../../shared/ui/Avatar';
import { MOCK_PLAYERS } from '../../shared/api/mock/mockPlayers';

interface SettlePaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    amount: string;
    status: string;
    playerId?: string;
  } | null;
}

export const SettlePaymentSheet: React.FC<SettlePaymentSheetProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { role } = useAppStore();
  const isPaidAdmin = role === 'coach' && record?.status === 'Paid';
  const player = record?.playerId ? MOCK_PLAYERS.find(p => p.id === record.playerId) : null;

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose}
      title={isPaidAdmin ? 'Payment Details' : 'Settle payment'}
    >
      <div className="flex flex-col h-full bg-background">
        {/* Content with padding similar to match details */}
        <div className="flex-1 px-[60px] pb-6 overflow-y-auto pt-2">
          {/* Badge & Amount */}
          <div className="flex flex-col items-center justify-center mt-2 mb-8">
            <Badge size="lg" variant={isPaidAdmin ? 'default' : 'neutral'} className="mb-6">
              {isPaidAdmin ? 'Paid' : 'Unpaid'}
            </Badge>
            <div className="text-[28px] font-display font-bold text-white mb-3">
              {record?.amount}
            </div>
            
            {role === 'coach' && player && (
              <div className="flex items-center gap-2">
                <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="sm" hasBorder={false} />
                <span className="font-bold text-white text-[16px]">{player.name}</span>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="flex justify-between items-start mb-10 px-2">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Date</span>
              <span className="text-white font-semibold">Jul 1, 2026</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Type</span>
              <span className="text-white font-semibold">Personal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Matches</span>
              <span className="text-white font-semibold">-</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isPaidAdmin ? (
              <button
                onClick={onClose}
                className="w-full h-[44px] rounded-full bg-card flex items-center justify-center text-[#FF453A] font-semibold hover:bg-secondary active:scale-95 transition-all"
              >
                Mark as Unpaid
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 h-[44px] rounded-full bg-card flex items-center justify-center gap-2 text-white font-semibold hover:bg-secondary active:scale-95 transition-all"
                >
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  Card
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 h-[44px] rounded-full bg-card flex items-center justify-center gap-2 text-white font-semibold hover:bg-secondary active:scale-95 transition-all"
                >
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                  Cash
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
