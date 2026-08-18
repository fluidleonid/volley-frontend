import React from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../shared/ui/Badge';
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
  } | null;
  hasParent?: boolean;
  onCloseAll?: () => void;
  onPlayerClick?: (player: any) => void;
  zIndex?: number;
}

export const SettlePaymentSheet: React.FC<SettlePaymentSheetProps> = ({
  isOpen,
  onClose,
  record,
  hasParent,
  onCloseAll,
  onPlayerClick,
  zIndex,
}) => {
  const { t, i18n } = useTranslation();
  const { role } = useAppStore();
  const isPaidAdmin = role === 'coach' && record?.status === 'Paid';
  const player = record?.playerId ? MOCK_PLAYERS.find(p => p.id === record.playerId) : null;

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose}
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title={isPaidAdmin ? t('billing.paymentDetails', 'Payment Details') : t('billing.settlePayment', 'Settle payment')}
      zIndex={zIndex || 200}
    >
      <div className="flex flex-col h-full bg-background">
        {/* Content with padding similar to match details */}
        <div className="flex-1 px-[60px] pb-6 overflow-y-auto pt-2">
          {/* Badge & Amount */}
          <div className="flex flex-col items-center justify-center mt-2 mb-8">
            <Badge size="lg" variant={isPaidAdmin ? 'default' : 'neutral'} className="mb-6">
              {isPaidAdmin ? t('billing.paid', 'Paid') : t('billing.unpaid', 'Unpaid')}
            </Badge>
            <div className="text-[28px] font-display font-bold text-white mb-3">
              {record?.amount}
            </div>
            
            {role === 'coach' && player && (
              <div 
                className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95 hover:opacity-80"
                onClick={() => onPlayerClick && onPlayerClick(player)}
              >
                <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="sm" hasBorder={false} />
                <span className="font-bold text-white text-[16px]">{player.name}</span>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="flex justify-between items-start mb-10 px-2">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">{t('common.date', 'Date')}</span>
              <span className="text-white font-semibold">{new Date('2026-07-01').toLocaleDateString(i18n.language === 'am' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">{t('billing.type', 'Type')}</span>
              <span className="text-white font-semibold">{t('billing.personal', 'Personal')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">{t('common.matches', 'Matches')}</span>
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
                {t('billing.markUnpaid', 'Mark as Unpaid')}
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 h-[44px] rounded-full bg-card flex items-center justify-center gap-2 text-white font-semibold hover:bg-secondary active:scale-95 transition-all"
                >
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  {t('billing.card', 'Card')}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 h-[44px] rounded-full bg-card flex items-center justify-center gap-2 text-white font-semibold hover:bg-secondary active:scale-95 transition-all"
                >
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                  {t('billing.cash', 'Cash')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
