import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { MatchHistoryCard } from '../../entities/match/ui/MatchHistoryCard';
import { Trophy } from 'lucide-react';
import { Match } from '../../shared/types/index';
import { useScroll } from '../../shared/hooks/useScroll';
import { ListGroupHeader } from '../../shared/ui/ListGroupHeader';

export const GamesView: React.FC = () => {
  const { recentMatches, role } = useAppStore();
  const scrolled = useScroll();
  const { t, i18n } = useTranslation();

  const groupedByDate = useMemo(() => {
    const groups: Record<string, {
      matches: Match[];
      wins: number;
      losses: number;
      xp: number;
      bp: number;
    }> = {};

    recentMatches.forEach(match => {
      // Parse date to Month D, YYYY
      let dateLabel = match.date;
      if (match.date === 'Today') {
        dateLabel = t('player.leaderboard.today', 'Today');
      } else if (match.date === 'Yesterday') {
        dateLabel = t('common.yesterday', 'Yesterday');
      } else if (match.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateLabel = new Intl.DateTimeFormat(i18n.language === 'am' ? 'hy-AM' : (i18n.language === 'ru' ? 'ru-RU' : 'en-US'), { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(match.date));
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
  }, [recentMatches, i18n.language]);

  return (
    <div className="pb-32 select-none bg-background">
      <div className="relative z-10 px-4 max-w-[480px] mx-auto">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-5 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
          }`}>
          <div className="flex items-center h-[44px]">
            <h1 className="text-[30px] font-bold text-white tracking-tight">{t('games.title')}</h1>
          </div>
        </div>

        {/* Grouped Matches */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateLabel, stats]) => (
            <div key={dateLabel} className="space-y-3">
              <ListGroupHeader
                title={dateLabel}
                subtitle={role === 'coach' ? `${t('games.matchesCount', { count: stats.matches.length })}` : `${t('games.matchesCount', { count: stats.matches.length })} • ${stats.wins}${t('games.winsShort')} - ${stats.losses}${t('games.lossesShort')} • +${stats.xp} XP • +${stats.bp} BP`}
              />
              <div className="flex flex-col">
                {stats.matches.map((match) => (
                  <MatchHistoryCard key={match.id} match={match} variant={role === 'coach' ? 'coach' : 'player'} />
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedByDate).length === 0 && (
            <div className="text-center py-10">
              <Trophy className="w-12 h-12 text-secondary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">{t('games.noGames')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
