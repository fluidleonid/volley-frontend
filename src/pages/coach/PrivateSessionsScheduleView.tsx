import React, { useState } from 'react';
import { Header } from '../../widgets/layout/Header';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Plus } from 'lucide-react';
import { EmptyState } from '../../shared/ui/EmptyState';
import { PrivateSessionFlow } from '../../widgets/flows/PrivateSessionFlow';
import { SessionListItem } from '../../entities/session/ui/SessionListItem';
import { ListGroupHeader } from '../../shared/ui/ListGroupHeader';
import { SessionDetailsSheet } from '../../features/session/SessionDetailsSheet';
import { Player } from '../../shared/types/index';

interface PrivateSessionsScheduleViewProps {
  onClose: () => void;
}

interface PrivateSession {
  id: string;
  name: string;
  avatarUrl: string;
  time: string;
}

interface SessionGroup {
  dateLabel: string;
  sessions: PrivateSession[];
}

const UPCOMING_MOCK_GROUPS: SessionGroup[] = [
  {
    dateLabel: 'August 12, 2026',
    sessions: [
      { id: 'p-1', name: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', time: '10:00' },
      { id: 'p-2', name: 'Alena Krasnova', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', time: '12:00' },
      { id: 'p-3', name: 'Mike Smith', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', time: '15:00' },
    ]
  },
  {
    dateLabel: 'August 13, 2026',
    sessions: [
      { id: 'p-4', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', time: '09:00' },
    ]
  }
];

const PAST_MOCK_GROUPS: SessionGroup[] = [
  {
    dateLabel: 'August 9, 2026',
    sessions: [
      { id: 'p-5', name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', time: '14:00' },
      { id: 'p-6', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', time: '16:00' },
    ]
  }
];

export const PrivateSessionsScheduleView: React.FC<PrivateSessionsScheduleViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isPrivateFlowOpen, setIsPrivateFlowOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PrivateSession | null>(null);

  const groups = tab === 'upcoming' ? UPCOMING_MOCK_GROUPS : PAST_MOCK_GROUPS;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header 
        variant="page" 
        sticky 
        stickyClassName="-mx-4 px-4" 
        title={t('profile.privateSchedule', 'Private schedule')} 
        onBack={onClose} 
        rightContent={
          tab === 'upcoming' && (
            <button 
              onClick={() => setIsPrivateFlowOpen(true)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 active:scale-95 transition-all"
            >
              <Plus className="h-6 w-6" />
            </button>
          )
        }
      />

      {/* Segment Controller */}
      <div className="flex rounded-[20px] bg-card p-1 mb-6 mt-4 relative w-full animate-fade-in">
        {(['upcoming', 'past'] as const).map((tabKey, i) => {
          const isActive = tab === tabKey;
          return (
            <div key={tabKey} className="relative flex-1 flex">
              <button
                onClick={() => setTab(tabKey)}
                className={`flex-1 rounded-[20px] py-1.5 text-sm font-bold transition-all relative z-10 capitalize ${
                  isActive ? 'bg-secondary text-white shadow' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {t(`coach.schedule.${tabKey}`, tabKey)}
              </button>
              {/* Vertical Divider */}
              {!isActive && i === 0 && tab !== 'past' && (
                <div className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-secondary pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pb-8 scrollbar-none">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.dateLabel}>
              <ListGroupHeader 
                title={group.dateLabel}
                subtitle={t('coach.schedule.totalSessionsCount', '{{count}} total sessions', { count: group.sessions.length }).replace('{{count}}', group.sessions.length.toString())}
              />

              <div className="flex flex-col border-t border-border/60 pt-1">
                {group.sessions.map((session) => (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    onClick={(s) => {
                      setSelectedSession(s);
                      setIsDetailsOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="pt-10">
            <EmptyState message={t(`coach.schedule.no${tab.charAt(0).toUpperCase() + tab.slice(1)}Sessions`, `No ${tab} sessions`)} icon={CalendarClock} />
          </div>
        )}
      </div>

      <PrivateSessionFlow 
        isOpen={isPrivateFlowOpen}
        onClose={() => {
          setIsPrivateFlowOpen(false);
          setTimeout(() => setSelectedSession(null), 300);
        }}
        onSchedule={(data) => {
          console.log('Scheduled private session', data);
        }}
        initialPlayer={selectedSession ? { name: selectedSession.name, avatarUrl: selectedSession.avatarUrl } as Player : undefined}
        readOnlyPlayer={!!selectedSession}
      />

      <SessionDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        player={selectedSession ? {
          id: selectedSession.id,
          name: selectedSession.name,
          avatarUrl: selectedSession.avatarUrl,
          level: 10,
          xp: 0,
          status: 'spectating',
          gamesPlayed: 0,
          wins: 0,
          bpToday: 0,
          winStreak: 0,
          hasTelegram: true,
        } : null}
        sessionTime={selectedSession?.time}
        isPast={tab === 'past'}
        onReschedule={() => {
          setIsDetailsOpen(false);
          setIsPrivateFlowOpen(true);
        }}
      />
    </div>
  );
};
