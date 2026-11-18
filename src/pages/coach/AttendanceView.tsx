import React, { useMemo } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { Header } from '../../widgets/layout/Header';
import { EmptyState } from '../../shared/ui/EmptyState';
import { CalendarCheck } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  dateStr: string;
  type: 'Public' | 'Private';
  matchesCount: number;
}

interface MonthGroup {
  month: string;
  records: AttendanceRecord[];
}

const mockAttendance: MonthGroup[] = [
  {
    month: 'July, 2026',
    records: [
      { id: '1', dateStr: 'Jul 20', type: 'Public', matchesCount: 21 },
      { id: '2', dateStr: 'Jul 13', type: 'Private', matchesCount: 0 },
      { id: '3', dateStr: 'Jul 8', type: 'Public', matchesCount: 12 },
      { id: '4', dateStr: 'Jul 6', type: 'Public', matchesCount: 10 },
    ],
  },
  {
    month: 'June, 2026',
    records: [
      { id: '5', dateStr: 'Jun 12', type: 'Public', matchesCount: 21 },
      { id: '6', dateStr: 'Jun 8', type: 'Public', matchesCount: 12 },
      { id: '7', dateStr: 'Jun 3', type: 'Public', matchesCount: 12 },
      { id: '8', dateStr: 'Jun 1', type: 'Public', matchesCount: 10 },
    ],
  },
  {
    month: 'May, 2026',
    records: [
      { id: '9', dateStr: 'May 12', type: 'Public', matchesCount: 21 },
      { id: '10', dateStr: 'May 8', type: 'Public', matchesCount: 12 },
      { id: '11', dateStr: 'May 5', type: 'Public', matchesCount: 12 },
    ],
  },
];

export const AttendanceView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setActiveTab, isStaging, currentUser, recentMatches } = useAppStore();

  const locale = i18n.language === 'am' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const attendanceGroups: MonthGroup[] = useMemo(() => {
    if (isStaging) {
      // Never count Public session attendance if the user has 0 games played
      return mockAttendance
        .map((group) => ({
          ...group,
          records: group.records.filter(
            (r) => r.type === 'Private' || (currentUser.gamesPlayed > 0 && r.matchesCount > 0)
          ),
        }))
        .filter((group) => group.records.length > 0);
    }

    // Production: only count Public session attendance on days where the user actually played >= 1 game
    if (currentUser.gamesPlayed <= 0 || recentMatches.length === 0) {
      return [];
    }

    const byDate = new Map<string, { dateObj: Date; count: number }>();
    for (const m of recentMatches) {
      const d =
        m.date && m.date !== 'Today' && /^\d{4}-\d{2}-\d{2}$/.test(m.date)
          ? new Date(m.date + 'T12:00:00')
          : new Date();
      const dateKey = d.toISOString().split('T')[0];
      const existing = byDate.get(dateKey);
      if (existing) {
        existing.count += 1;
      } else {
        byDate.set(dateKey, { dateObj: d, count: 1 });
      }
    }

    const groupsMap = new Map<string, AttendanceRecord[]>();
    for (const [dateKey, info] of byDate.entries()) {
      // Strictly require at least 1 played game to count public game attendance
      if (info.count <= 0) continue;

      const monthLabel = new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(info.dateObj);
      const dateStr = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
      }).format(info.dateObj);

      const list = groupsMap.get(monthLabel) || [];
      list.push({
        id: dateKey,
        dateStr,
        type: 'Public',
        matchesCount: info.count,
      });
      groupsMap.set(monthLabel, list);
    }

    return Array.from(groupsMap.entries()).map(([month, records]) => ({
      month,
      records,
    }));
  }, [isStaging, currentUser.gamesPlayed, recentMatches, locale]);

  const totalTrainingsCount = useMemo(() => {
    return attendanceGroups.reduce((acc, g) => acc + g.records.length, 0);
  }, [attendanceGroups]);

  return (
    <div className="space-y-4 pb-24 max-w-[480px] mx-auto select-none px-4">
      <Header
        variant="page"
        sticky
        stickyClassName="-mx-4 px-4"
        title={t('coach.attendanceCheckins', 'Attendance & Check-ins')}
        onBack={() => setActiveTab('profile')}
        onClose={() => setActiveTab('home')}
      />

      <div className="flex gap-3">
        <div className="flex-1 bg-card rounded-2xl p-4 border-none">
          <div className="font-display text-[24px] font-bold text-white leading-tight">
            {totalTrainingsCount}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('coach.trainings', 'Trainings')}
          </div>
        </div>
        <div className="flex-1 bg-card rounded-2xl p-4 border-none">
          <div className="font-display text-[24px] font-bold text-white leading-tight">
            {currentUser.gamesPlayed}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('coach.games', 'Games')}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {attendanceGroups.length > 0 ? (
          attendanceGroups.map((group) => (
            <div key={group.month}>
              <h3 className="text-[12px] text-muted-foreground font-medium mb-2">
                {group.month}
              </h3>
              <div className="flex flex-col">
                {group.records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center py-3 border-b border-border/60 last:border-0 bg-transparent"
                  >
                    <div className="w-[80px] text-left shrink-0 font-bold text-white text-[16px]">
                      {record.dateStr}
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className="text-muted-foreground text-[15px]">
                        {t(`coach.${record.type.toLowerCase()}`, record.type)}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-1.5">
                      <span className="text-muted-foreground text-[15px]">
                        {record.type === 'Private'
                          ? '-'
                          : `${record.matchesCount} ${t('coach.matches', 'matches')}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            variant="page"
            icon={CalendarCheck}
            message={t('coach.noAttendanceTitle', 'No check-ins yet')}
            description={t('coach.noRecordsFound', 'No records found for this period.')}
          />
        )}
      </div>
    </div>
  );
};
