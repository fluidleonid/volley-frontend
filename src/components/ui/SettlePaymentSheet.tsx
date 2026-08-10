import React from 'react';
import { BottomSheet } from './BottomSheet';
import { CreditCard, Banknote } from 'lucide-react';

interface SettlePaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

export const SettlePaymentSheet: React.FC<SettlePaymentSheetProps> = ({
  isOpen,
  onClose,
  amount,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full bg-[#121212] rounded-t-[32px]">
        {/* Header (No borders) */}
        <div className="relative flex items-center justify-center p-4">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-[#2C2C2E]" />
          <h2 className="text-lg font-bold text-white mt-4">Settle payment</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content with padding similar to match details */}
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          {/* Badge & Amount */}
          <div className="flex flex-col items-center justify-center mt-2 mb-8">
            <div className="bg-[#1C1C1E] text-[#8E8E93] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Unpaid
            </div>
            <div className="text-[28px] font-display font-bold text-white">
              {amount}
            </div>
          </div>

          {/* Details Row */}
          <div className="flex justify-between items-start mb-10 px-2">
            <div className="flex flex-col">
              <span className="text-[#8E8E93] text-sm mb-1">Date</span>
              <span className="text-white font-semibold">Jul 1, 2026</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#8E8E93] text-sm mb-1">Type</span>
              <span className="text-white font-semibold">Personal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#8E8E93] text-sm mb-1">Matches</span>
              <span className="text-white font-semibold">-</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-[#1C1C1E] rounded-[24px] py-4 flex items-center justify-center gap-2 text-white font-semibold hover:bg-[#2C2C2E] active:scale-95 transition-all"
            >
              <CreditCard className="w-5 h-5 text-[#8E8E93]" />
              Card
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#1C1C1E] rounded-[24px] py-4 flex items-center justify-center gap-2 text-white font-semibold hover:bg-[#2C2C2E] active:scale-95 transition-all"
            >
              <Banknote className="w-5 h-5 text-[#8E8E93]" />
              Cash
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
