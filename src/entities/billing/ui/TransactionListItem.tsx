import React from 'react';
import { Avatar } from '../../../shared/ui/Avatar';
import { Badge } from '../../../shared/ui/Badge';
import { useTranslation } from 'react-i18next';
import { Player } from '../../../shared/types/index';

// Depending on your actual backend model, adjust this interface
export interface TransactionRecord {
  id: string;
  playerId?: string;
  amount: string;
  status: 'Paid' | 'Unpaid';
  dateStr?: string;
  type?: 'Game' | 'Training';
}

interface TransactionListItemProps {
  record: TransactionRecord;
  player?: Player;
  onClick?: (record: TransactionRecord) => void;
  showStatusBadge?: boolean;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ 
  record, 
  player, 
  onClick,
  showStatusBadge = true
}) => {
  const { t } = useTranslation();

  return (
    <div 
      onClick={() => onClick && onClick(record)}
      className="flex flex-row items-center justify-between py-3 border-b border-solid border-border/60 last:border-b-0 w-full cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 pointer-events-none">
        {player && <Avatar src={player.avatarUrl} alt={player.name} initials={player.name[0]} size="sm" hasBorder={false} />}
        <span className="font-bold text-white text-[16px]">{player ? player.name : (record.type ? t(`coach.${record.type.toLowerCase()}`, record.type) : t('coach.unknownPlayer', 'Unknown Player'))}</span>
      </div>
      <div className="flex items-center gap-3 pointer-events-none">
        <span className="font-medium text-white text-[15px] text-right w-[75px] shrink-0 whitespace-nowrap">{record.amount}</span>
        {showStatusBadge && (
          <div className="flex justify-end shrink-0 w-[90px]">
            {record.status === 'Paid' ? (
              <Badge variant="default" className="min-w-[72px] w-auto px-2 whitespace-nowrap">
                {t('coach.paid', 'Paid')}
              </Badge>
            ) : (
              <Badge variant="neutral" className="min-w-[72px] w-auto px-2 whitespace-nowrap">
                {t('coach.settle', 'Settle')}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
