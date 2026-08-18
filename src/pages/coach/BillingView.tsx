import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../shared/ui/badge';
import { SettlePaymentSheet } from '../../features/payment/SettlePaymentSheet';
import { StatCard } from '../../entities/stats/ui/StatCard';
import { CustomDateRangePicker, DateRange } from '../../shared/ui/CustomDateRangePicker';
import { TransactionListItem } from '../../entities/billing/ui/TransactionListItem';
import { PlayerBillingSheet } from '../../entities/player/ui/PlayerBillingSheet';
import { Player } from '../../shared/types/index';
import { MOCK_PLAYERS } from '../../shared/api/mock/mockPlayers';

import { useScroll } from '../../shared/hooks/useScroll';
import { ChevronLeft } from 'lucide-react';

import { ListGroupHeader } from '../../shared/ui/ListGroupHeader';

// -------------------------------------------------------------
// PLAYER MOCK DATA (Original)
// -------------------------------------------------------------
interface PlayerBillingRecord {
  id: string;
  dateStr: string;
  type: string;
  amount: string;
  status: 'Paid' | 'Settle';
}

interface PlayerMonthGroup {
  month: string;
  records: PlayerBillingRecord[];
}

const playerMockBilling: PlayerMonthGroup[] = [
  {
    month: 'July, 2026',
    records: [
      { id: '1', dateStr: 'Jul 20', type: 'Card', amount: '4,000 ֏', status: 'Paid' },
      { id: '2', dateStr: 'Jul 13', type: '-', amount: '10,000 ֏', status: 'Settle' },
      { id: '3', dateStr: 'Jul 8', type: 'Card', amount: '4,000 ֏', status: 'Paid' },
      { id: '4', dateStr: 'Jul 20', type: 'Card', amount: '4,000 ֏', status: 'Paid' },
    ]
  },
  {
    month: 'June, 2026',
    records: [
      { id: '5', dateStr: 'Jun 12', type: 'Cash', amount: '4,000 ֏', status: 'Paid' },
      { id: '6', dateStr: 'Jun 8', type: 'Cash', amount: '4,000 ֏', status: 'Paid' },
      { id: '7', dateStr: 'Jun 3', type: 'Cash', amount: '4,000 ֏', status: 'Paid' },
      { id: '8', dateStr: 'Jun 1', type: 'Cash', amount: '4,000 ֏', status: 'Paid' },
    ]
  },
  {
    month: 'May, 2026',
    records: [
      { id: '9', dateStr: 'May 12', type: 'Card', amount: '4,000 ֏', status: 'Paid' },
      { id: '10', dateStr: 'May 8', type: 'Public', amount: '4,000 ֏', status: 'Paid' },
    ]
  }
];

// -------------------------------------------------------------
// COACH MOCK DATA
// -------------------------------------------------------------
interface CoachBillingRecord {
  id: string;
  playerId: string;
  amount: string;
  status: 'Paid' | 'Settle';
  dateStr: string;
  isPublic: boolean;
}

interface CoachDateGroup {
  date: string;
  records: CoachBillingRecord[];
}

const coachMockBillingRaw: CoachBillingRecord[] = [
  { id: 'c1', playerId: 'p1', amount: '4,000 ֏', status: 'Paid', dateStr: 'Aug 15', isPublic: true },
  { id: 'c2', playerId: 'p2', amount: '10,000 ֏', status: 'Settle', dateStr: 'Aug 15', isPublic: true },
  { id: 'c3', playerId: 'p5', amount: '4,000 ֏', status: 'Paid', dateStr: 'Aug 14', isPublic: true },
  { id: 'c4', playerId: 'p6', amount: '4,000 ֏', status: 'Settle', dateStr: 'Aug 14', isPublic: false },
  { id: 'c5', playerId: 'p1', amount: '4,000 ֏', status: 'Paid', dateStr: 'Aug 12', isPublic: false },
  { id: 'c6', playerId: 'p3', amount: '12,000 ֏', status: 'Paid', dateStr: 'Aug 10', isPublic: true },
  { id: 'c7', playerId: 'p8', amount: '4,000 ֏', status: 'Settle', dateStr: 'Aug 10', isPublic: false },
];

export const BillingView: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveTab, role } = useAppStore();
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const scrolled = useScroll();
  
  const [coachTab, setCoachTab] = useState<'public' | 'private'>('public');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    label: 'All time',
    start: null,
    end: null,
  });
  const [selectedBillingPlayer, setSelectedBillingPlayer] = useState<Player | null>(null);

  const filteredCoachRecords = coachMockBillingRaw.filter(r => r.isPublic === (coachTab === 'public'));
  const coachGroups = filteredCoachRecords.reduce((acc, record) => {
    let group = acc.find(g => g.date === record.dateStr);
    if (!group) {
      group = { date: record.dateStr, records: [] };
      acc.push(group);
    }
    group.records.push(record);
    return acc;
  }, [] as CoachDateGroup[]);

  const handleDateConfirm = (range: DateRange) => {
    setDateRange(range);
    setIsDatePickerOpen(false);
  };

  const getPlayer = (id: string) => MOCK_PLAYERS.find(p => p.id === id);

  return (
    <div className="relative pb-32 select-none">
      
      <div className="relative z-10 px-4 max-w-[480px] mx-auto">
        {/* Header section (Sticky) */}
        <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-5 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between h-[44px]">
            {role === 'coach' ? (
              <h1 className="text-[30px] font-bold text-white tracking-tight">
                {t('nav.cashflow', 'Cashflow')}
              </h1>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-card/60 backdrop-blur-md text-white hover:bg-brand-surfaceElevated active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-[28px] font-bold text-white tracking-tight">
                  {t('player.billingHistory', 'Billing History')}
                </h1>
              </div>
            )}

            {role === 'coach' && (
              <Badge 
                variant="neutral" 
                size="lg" 
                onClick={() => setIsDatePickerOpen(true)}
                className="h-[44px] px-4 flex items-center justify-center bg-card/60 backdrop-blur-md text-primary font-bold tracking-tight border-0 cursor-pointer hover:bg-card/80 active:scale-95 transition-all"
              >
                {dateRange.label === 'All time' ? t('coach.allTime', 'All time') :
                 dateRange.label === 'This month' ? t('coach.thisMonth', 'This month') :
                 dateRange.label === 'Last month' ? t('coach.lastMonth', 'Last month') :
                 dateRange.label === 'This year' ? t('coach.thisYear', 'This year') :
                 dateRange.label === 'Last year' ? t('coach.lastYear', 'Last year') :
                 dateRange.label === 'Custom' ? t('common.custom', 'Custom') :
                 dateRange.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Top Cards & Segments */}
        <div className="pt-2">
          {role === 'coach' ? (
            <div className={`grid gap-3 ${dateRange.label === 'All time' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <StatCard value="160K ֏" label={t('coach.total', 'Total')} />
              {dateRange.label === 'All time' && (
                <StatCard value="16,000 ֏" label={t('coach.thisMonth', 'This month')} />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard value="160K ֏" label={t('coach.total', 'Total')} />
              <StatCard value="16,000 ֏" label={t('coach.thisMonth', 'This month')} />
            </div>
          )}

          {role === 'coach' && (
            <div className="flex rounded-[20px] bg-card p-1 mt-6 relative w-full shadow-lg">
              {['public', 'private'].map((tab, i) => {
                const isActive = coachTab === tab;
                return (
                  <div key={tab} className="relative flex-1 flex">
                    <button
                      onClick={() => setCoachTab(tab as 'public' | 'private')}
                      className={`flex-1 rounded-[20px] py-1.5 text-sm font-bold transition-all relative z-10 capitalize ${
                        isActive ? 'bg-secondary text-white shadow' : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {t(`coach.${tab}`, tab)}
                    </button>
                    {!isActive && i === 0 && coachTab !== 'private' && (
                      <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-secondary pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Billing Rows */}
        <div className="mt-6 space-y-6">
          {role === 'coach' ? (
            coachGroups.length > 0 ? coachGroups.map((group) => {
              const parseAmount = (amt: string) => parseInt(amt.replace(/[^\d]/g, ''), 10) || 0;
              const formatAmount = (num: number) => num.toLocaleString('en-US') + ' ֏';
              
              const totalEarned = group.records.reduce((sum, r) => sum + parseAmount(r.amount), 0);
              const unpaidEarnedCount = group.records.filter(r => r.status === 'Settle').length;

              return (
                <div key={group.date}>
                  <ListGroupHeader 
                    title={group.date}
                    subtitle={`${formatAmount(totalEarned)} ${t('coach.total', 'total').toLowerCase()}`}
                    rightContent={
                      unpaidEarnedCount > 0 ? (
                        <span className="text-[#FF453A]">• {unpaidEarnedCount} {unpaidEarnedCount === 1 ? t('coach.paymentToSettle', 'payment to settle') : t('coach.paymentsToSettle', 'payments to settle')}</span>
                      ) : undefined
                    }
                  />
                  <div className="flex flex-col border-t border-border/60 pt-1">
                    {group.records.map((record, index) => {
                      const p = getPlayer(record.playerId);
                      return (
                        <TransactionListItem
                          key={`${record.id}-${index}`}
                          record={record as any}
                          player={p}
                          onClick={(r) => setSelectedRecord(r as any)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('coach.noRecordsFound', 'No records found for this period.')}</p>
              </div>
            )
          ) : (
            playerMockBilling.map((group) => (
              <div key={group.month}>
                <h3 className="text-[12px] text-muted-foreground font-medium mb-2">{group.month}</h3>
                <div className="flex flex-col">
                  {group.records.map((record, index) => (
                    <div key={`${record.id}-${index}`} className="grid grid-cols-4 w-full items-center py-3 border-b border-border/60 last:border-0 bg-transparent">
                      <div className="col-span-1 text-left shrink-0 font-bold text-white text-[16px]">
                        {record.dateStr}
                      </div>
                      <div className="col-span-1 pl-[12px] text-muted-foreground text-[15px] truncate">
                        {record.type}
                      </div>
                      <div className="col-span-1 flex justify-end text-muted-foreground text-[15px] pr-2 truncate">
                        {record.amount}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Badge variant={record.status === 'Paid' ? 'default' : 'neutral'} className="min-w-[72px] w-auto px-2 whitespace-nowrap">
                          {t(`coach.${record.status.toLowerCase()}`, record.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SettlePaymentSheet
        isOpen={!!selectedRecord && !selectedBillingPlayer}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        onPlayerClick={(player) => setSelectedBillingPlayer(player)}
      />
      
      <PlayerBillingSheet
        isOpen={!!selectedBillingPlayer}
        onClose={() => setSelectedBillingPlayer(null)}
        player={selectedBillingPlayer}
        hasParent={true}
        onCloseAll={() => {
          setSelectedBillingPlayer(null);
          setSelectedRecord(null);
        }}
      />
      
      <CustomDateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={handleDateConfirm}
        initialRange={dateRange}
      />
    </div>
  );
};
