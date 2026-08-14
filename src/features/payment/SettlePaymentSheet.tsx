import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { CreditCard, Banknote } from 'lucide-react';
import { useAppStore } from '../../app/store/appStore';

interface SettlePaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    amount: string;
    status: string;
  } | null;
}

export const SettlePaymentSheet: React.FC<SettlePaymentSheetProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { role } = useAppStore();
  const isPaidAdmin = role === 'coach' && record?.status === 'Paid';

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
            <div className={`text-sm font-semibold px-4 py-1.5 rounded-full mb-6 ${isPaidAdmin ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground'}`}>
              {isPaidAdmin ? 'Paid' : 'Unpaid'}
            </div>
            <div className="text-[28px] font-display font-bold text-white">
              {record?.amount}
            </div>
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
