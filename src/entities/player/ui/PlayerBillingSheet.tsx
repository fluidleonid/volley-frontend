import React, { useState, useEffect } from 'react';
import { Player } from '../../../shared/types/index';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { TransactionListItem } from '../../billing/ui/TransactionListItem';
import { SettlePaymentSheet } from '../../../features/payment/SettlePaymentSheet';

interface PlayerBillingSheetProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  hasParent?: boolean;
  onCloseAll?: () => void;
}

// MOCK DATA for Player Billing
const mockPlayerBilling = [
  { id: '1', dateStr: 'Jul 20', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '2', dateStr: 'Jul 13', type: '-', amount: '10,000 ֏', status: 'Settle', playerId: '1' },
  { id: '3', dateStr: 'Jul 8', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '4', dateStr: 'Jul 20', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '5', dateStr: 'Jul 22', type: 'Cash', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '6', dateStr: 'Jul 25', type: '-', amount: '8,000 ֏', status: 'Settle', playerId: '1' },
  { id: '7', dateStr: 'Jul 27', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '8', dateStr: 'Jul 29', type: 'Card', amount: '12,000 ֏', status: 'Paid', playerId: '1' },
  { id: '9', dateStr: 'Aug 1', type: 'Cash', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '10', dateStr: 'Aug 3', type: '-', amount: '4,000 ֏', status: 'Settle', playerId: '1' },
  { id: '11', dateStr: 'Aug 5', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '12', dateStr: 'Aug 8', type: 'Card', amount: '16,000 ֏', status: 'Paid', playerId: '1' },
  { id: '13', dateStr: 'Aug 10', type: 'Cash', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
  { id: '14', dateStr: 'Aug 12', type: '-', amount: '4,000 ֏', status: 'Settle', playerId: '1' },
  { id: '15', dateStr: 'Aug 15', type: 'Card', amount: '4,000 ֏', status: 'Paid', playerId: '1' },
];

export const PlayerBillingSheet: React.FC<PlayerBillingSheetProps> = ({
  player,
  isOpen,
  onClose,
  hasParent,
  onCloseAll,
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'public' | 'private'>('private');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
    }
  }, [isOpen]);

  if (!isOpen || !player) return null;

  return (
    <>
      <BottomSheet
        isOpen={isOpen && !selectedRecord}
        onClose={onClose}
        onCloseAll={onCloseAll}
        hasParent={hasParent}
        title={
          <div className="text-center space-y-0.5">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              {t('nav.billing', 'Billing')}
            </h3>
            <p className="font-sans text-xs text-muted-foreground font-normal">
              {player.name}
            </p>
          </div>
        }
        topOffset={isExpanded ? 44 : undefined}
        isScrollable={isExpanded}
      >
        {/* Segment Controller */}
        <div className="flex rounded-[20px] bg-card p-1 mt-2 mb-6 relative w-full shadow-lg">
          {['public', 'private'].map((tName, i) => {
            const isActive = tab === tName;
            return (
              <div key={tName} className="relative flex-1 flex">
                <button
                  onClick={() => setTab(tName as 'public' | 'private')}
                  className={`flex-1 rounded-[20px] py-1.5 text-sm font-bold transition-all relative z-10 capitalize ${
                    isActive ? 'bg-secondary text-white shadow' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {t(`coach.${tName}`, tName)}
                </button>
                {!isActive && i === 0 && tab !== 'private' && (
                  <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-secondary pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* List of transactions */}
        <div 
          className={`flex flex-col border-t border-border/60 pt-1 flex-1 overflow-y-auto min-h-0 pb-12 hide-scrollbar ${!isExpanded ? 'max-h-[350px] overflow-hidden' : ''}`}
          onTouchMove={() => { if (!isExpanded) setIsExpanded(true); }}
          onWheel={() => { if (!isExpanded) setIsExpanded(true); }}
        >
          {mockPlayerBilling.map((record, index) => (
            <TransactionListItem
              key={`${record.id}-${index}`}
              record={record as any}
              player={player}
              onClick={(r) => setSelectedRecord(r)}
            />
          ))}
        </div>
      </BottomSheet>

      <SettlePaymentSheet
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onCloseAll={onCloseAll || onClose}
        record={selectedRecord}
        hasParent={true}
        onPlayerClick={() => setSelectedRecord(null)}
      />
    </>
  );
};
