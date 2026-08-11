import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { StickyPageHeader } from '../components/layout/StickyPageHeader';
import { SettlePaymentSheet } from '../components/ui/SettlePaymentSheet';

interface BillingRecord {
  id: string;
  dateStr: string;
  type: string;
  amount: string;
  status: 'Paid' | 'Settle';
}

interface MonthGroup {
  month: string;
  records: BillingRecord[];
}

const mockBilling: MonthGroup[] = [
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

export const BillingView: React.FC = () => {
  const { setActiveTab, role } = useAppStore();
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);

  return (
    <>
      <div className="space-y-4 pb-24 max-w-[480px] mx-auto select-none px-4">
        <StickyPageHeader
          title="Billing"
          onBack={() => setActiveTab('profile')}
          onClose={() => setActiveTab('home')}
        />
        <div className="flex gap-3">
          <div className="flex-1 bg-[#1C1C1E] rounded-2xl p-4 border-none">
            <div className="font-display text-[24px] font-bold text-white leading-tight">160K ֏</div>
            <div className="text-sm text-[#8E8E93] mt-1">Total</div>
          </div>
          <div className="flex-1 bg-[#1C1C1E] rounded-2xl p-4 border-none">
            <div className="font-display text-[24px] font-bold text-white leading-tight">16,000 ֏</div>
            <div className="text-sm text-[#8E8E93] mt-1">This month</div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {mockBilling.map((group) => (
            <div key={group.month}>
              <h3 className="text-[12px] text-[#8E8E93] font-medium mb-2">{group.month}</h3>
              <div className="flex flex-col">
                {group.records.map((record, index) => (
                  <div key={`${record.id}-${index}`} className="grid grid-cols-4 w-full items-center py-3 border-b border-[#2C2C2E]/60 last:border-0 bg-transparent">
                    <div className="col-span-1 text-left shrink-0 font-bold text-white text-[16px]">
                      {record.dateStr}
                    </div>
                    <div className="col-span-1 pl-[12px] text-[#8E8E93] text-[15px] truncate">
                      {record.type}
                    </div>
                    <div className="col-span-1 flex justify-end text-[#8E8E93] text-[15px] pr-2 truncate">
                      {record.amount}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      {record.status === 'Paid' ? (
                        role === 'coach' ? (
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="bg-[#68BD44]/10 text-[#68BD44] px-3 py-1 rounded-full text-[13px] font-bold w-[72px] text-center active:scale-95 transition-transform"
                          >
                            Paid
                          </button>
                        ) : (
                          <div className="bg-[#68BD44]/10 text-[#68BD44] px-3 py-1 rounded-full text-[13px] font-bold w-[72px] text-center">
                            Paid
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="bg-[#1C1C1E] text-white hover:bg-[#242426] px-3 py-1 rounded-full text-[13px] font-bold w-[72px] text-center active:scale-95 transition-all"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SettlePaymentSheet
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </>
  );
};
