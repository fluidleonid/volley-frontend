import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { MatchHistoryCard } from '../../entities/match/ui/MatchHistoryCard';
import { Trophy } from 'lucide-react';
import { Match } from '../../shared/types/index';
import { Header } from '../../widgets/layout/Header';
import { Badge } from '../../shared/ui/badge';
import { CustomDateRangePicker, DateRange } from '../../shared/ui/CustomDateRangePicker';
import { ListGroupHeader } from '../../shared/ui/ListGroupHeader';

interface CoachPublicGamesViewProps {
  onClose: () => void;
}

export const CoachPublicGamesView: React.FC<CoachPublicGamesViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { recentMatches } = useAppStore();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ label: t('coach.allTime', 'All time'), start: null, end: null });

  const groupedByDate = useMemo(() => {
    const groups: Record<string, {
      matches: Match[];
      wins: number;
      losses: number;
      xp: number;
      bp: number;
    }> = {};

    recentMatches.forEach(match => {
      let dateLabel = match.date;
      if (match.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateLabel = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(match.date));
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = { matches: [], wins: 0, losses: 0, xp: 0, bp: 0 };
      }
      
      groups[dateLabel].matches.push(match);
      if (match.isWin) groups[dateLabel].wins++;
      else groups[dateLabel].losses++;
      
      groups[dateLabel].xp += (match.xpGained || 0);
      groups[dateLabel].bp += (match.bpGained || 0);
    });

    return groups;
  }, [recentMatches]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header 
        variant="page" 
        sticky 
        stickyClassName="-mx-4 px-4"
        title={t('profile.publicGames', 'Public games')}
        onBack={onClose}
        rightContent={
          <Badge 
            variant="neutral" 
            size="lg" 
            onClick={() => setIsDatePickerOpen(true)}
            className="h-[44px] px-4 flex items-center justify-center bg-card/60 backdrop-blur-md text-primary font-bold tracking-tight border-0 cursor-pointer hover:bg-card/80 active:scale-95 transition-all"
          >
            {dateRange.label}
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pt-2 pb-8">
        {Object.entries(groupedByDate).map(([dateLabel, stats]) => (
          <div key={dateLabel} className="space-y-3">
            <ListGroupHeader
              title={dateLabel}
              subtitle={t('games.matchesCount', '{{count}} matches', { count: stats.matches.length }).replace('{{count}}', stats.matches.length.toString())}
            />
            <div className="flex flex-col gap-2">
              {stats.matches.map((match) => (
                <MatchHistoryCard key={match.id} match={match} variant="coach" />
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedByDate).length === 0 && (
          <div className="text-center py-10">
            <Trophy className="w-12 h-12 text-secondary mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">{t('games.noGames', 'No games played yet')}</p>
          </div>
        )}
      </div>

      <CustomDateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={setDateRange}
        initialRange={dateRange}
      />
    </div>
  );
};
