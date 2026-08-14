import React from 'react';
import { useAppStore } from '../../app/store/appStore';
import { Header } from '../../widgets/layout/Header';

interface AttendanceRecord {
  id: string;
  dateStr: string;
  type: 'Public' | 'Private';
  matches: string;
}

interface MonthGroup {
  month: string;
  records: AttendanceRecord[];
}

const mockAttendance: MonthGroup[] = [
  {
    month: 'July, 2026',
    records: [
      { id: '1', dateStr: 'Jul 20', type: 'Public', matches: '21 matches' },
      { id: '2', dateStr: 'Jul 13', type: 'Private', matches: '-' },
      { id: '3', dateStr: 'Jul 8', type: 'Public', matches: '12 matches' },
      { id: '4', dateStr: 'Jul 6', type: 'Public', matches: '10 matches' },
    ]
  },
  {
    month: 'June, 2026',
    records: [
      { id: '5', dateStr: 'Jun 12', type: 'Public', matches: '21 matches' },
      { id: '6', dateStr: 'Jun 8', type: 'Public', matches: '12 matches' },
      { id: '7', dateStr: 'Jun 3', type: 'Public', matches: '12 matches' },
      { id: '8', dateStr: 'Jun 1', type: 'Public', matches: '10 matches' },
    ]
  },
  {
    month: 'May, 2026',
    records: [
      { id: '9', dateStr: 'May 12', type: 'Public', matches: '21 matches' },
      { id: '10', dateStr: 'May 8', type: 'Public', matches: '12 matches' },
      { id: '11', dateStr: 'May 5', type: 'Public', matches: '12 matches' },
    ]
  }
];

export const AttendanceView: React.FC = () => {
  const { setActiveTab } = useAppStore();

  return (
    <div className="space-y-4 pb-24 max-w-[480px] mx-auto select-none px-4">
      <Header
        variant="page"
        sticky
        stickyClassName="-mx-4 px-4"
        title="Attendance & Check-ins"
        onBack={() => setActiveTab('profile')}
        onClose={() => setActiveTab('home')}
      />

      <div className="flex gap-3">
        <div className="flex-1 bg-card rounded-2xl p-4 border-none">
          <div className="font-display text-[24px] font-bold text-white leading-tight">40</div>
          <div className="text-sm text-muted-foreground mt-1">Trainings</div>
        </div>
        <div className="flex-1 bg-card rounded-2xl p-4 border-none">
          <div className="font-display text-[24px] font-bold text-white leading-tight">122</div>
          <div className="text-sm text-muted-foreground mt-1">Games</div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {mockAttendance.map((group) => (
          <div key={group.month}>
            <h3 className="text-[12px] text-muted-foreground font-medium mb-2">{group.month}</h3>
            <div className="flex flex-col">
              {group.records.map((record) => (
                <div key={record.id} className="flex items-center py-3 border-b border-border/60 last:border-0 bg-transparent">
                  <div className="w-[80px] text-left shrink-0 font-bold text-white text-[16px]">
                    {record.dateStr}
                  </div>
                  <div className="flex-1 flex items-center">
                    <span className="text-muted-foreground text-[15px]">{record.type}</span>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <span className="text-muted-foreground text-[15px]">{record.matches}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
