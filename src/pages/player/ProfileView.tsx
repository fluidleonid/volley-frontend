import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store/appStore';
import { ChevronRight, Calendar, Receipt, Banknote, Trash2 } from 'lucide-react';
import { AchievementData } from '../../shared/types/achievement';
import { PlayerCard } from '../../entities/player/ui/PlayerCard';
import { MenuRowItem } from '../../entities/menu/ui/MenuRowItem';
import { AchievementCard } from '../../entities/achievement/ui/AchievementCard';
import { AchievementDetailsSheet } from '../../entities/achievement/ui/AchievementDetailsSheet';
import { StatCard } from '../../entities/stats/ui/StatCard';
import { XpBar } from '../../shared/ui/XpBar';
import { Header } from '../../widgets/layout/Header';
import { MOCK_ACHIEVEMENTS } from '../../shared/api/mock/achievements';
import { getPlayerTierInfo } from '../../shared/lib/tier';
import { TrainingCostsView } from '../coach/TrainingCostsView';
import { PrivateSessionsScheduleView } from '../coach/PrivateSessionsScheduleView';
import { CoachPublicGamesView } from '../coach/CoachPublicGamesView';
import { LanguageSelectView } from '../../features/language/LanguageSelectView';
import { CalendarDays, CalendarClock, Activity, Globe } from 'lucide-react';
import { Dialog } from '../../shared/ui/Dialog';

const topAchievements = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).slice(0, 5);

export const ProfileView: React.FC = () => {
  const { currentUser, setActiveTab, setFlowState, role } = useAppStore();
  const [selected, setSelected] = useState<AchievementData | null>(null);
  const [isTrainingCostsOpen, setIsTrainingCostsOpen] = useState(false);
  const [isPrivateScheduleOpen, setIsPrivateScheduleOpen] = useState(false);
  const [isPublicGamesOpen, setIsPublicGamesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { t } = useTranslation();

  const earnedCount = MOCK_ACHIEVEMENTS.filter((a) => a.isEarned).length;
  
  const tierInfo = getPlayerTierInfo(currentUser.level);

  return (
    <div className="bg-background text-white pb-24 px-4 max-w-[480px] select-none">
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title={t('profile.title')} onBack={() => setActiveTab('home')} />

      <PlayerCard 
        avatarUrl={currentUser.avatarUrl} 
        iconCount={tierInfo.iconCount}
        accentColor={tierInfo.accentColor}
        ringColor={tierInfo.ringColor}
        glowColor={tierInfo.glowColor}
      />

      <div className="space-y-3 mt-6">
        <h2 className="font-display text-[30px] font-bold text-white text-center tracking-tight leading-none">
          {currentUser.name}
        </h2>

        {role === 'player' && (
          <XpBar current={9302} max={10000} label={tierInfo.tierName} />
        )}
      </div>

      {role === 'player' && (
        <>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <StatCard value={currentUser.gamesPlayed} label={t('profile.gamesPlayed')} />
            <StatCard value={currentUser.wins} label={t('profile.wins')} />
            <StatCard value={867} label={t('profile.bp')} />
          </div>

          <div className="space-y-3 pt-2 mt-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setActiveTab('achievements')}
            >
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-lg font-bold text-white tracking-tight">{t('profile.achievements')}</h3>
                <span className="font-display text-lg font-normal text-muted-foreground">{earnedCount}</span>
              </div>

              <button className="text-muted-foreground hover:text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
              {topAchievements.map((ach) => (
                <div key={ach.id} className="shrink-0" style={{ width: 'calc((min(100vw, 480px) - 56px) / 3)' }}>
                  <AchievementCard achievement={ach} onClick={setSelected} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-[4px] pt-2 mt-6">
        {role === 'coach' && (
          <>
            <MenuRowItem icon={Activity} label={t('profile.publicGames')} onClick={() => setIsPublicGamesOpen(true)} />
            <MenuRowItem icon={CalendarDays} label={t('profile.publicSchedule')} onClick={() => setActiveTab('public_schedule')} />
            <MenuRowItem icon={CalendarClock} label={t('profile.privateSchedule')} onClick={() => setIsPrivateScheduleOpen(true)} />
            <MenuRowItem icon={Banknote} label={t('profile.trainingCosts')} onClick={() => setIsTrainingCostsOpen(true)} />
          </>
        )}
        {role === 'player' && (
          <>
            <MenuRowItem icon={Calendar} label={t('profile.attendance')} onClick={() => setActiveTab('attendance')} />
            <MenuRowItem icon={Receipt} label={t('profile.billing')} onClick={() => setActiveTab('billing')} />
          </>
        )}
        <MenuRowItem icon={Globe} label={t('profile.language')} onClick={() => setIsLanguageOpen(true)} />
      </div>

      {role === 'player' && (
        <div className="mt-8">
          <MenuRowItem 
            icon={Trash2} 
            label={t('profile.deleteAccount')} 
            showChevron={false} 
            onClick={() => setIsDeleteConfirmOpen(true)} 
            className="text-destructive hover:text-destructive/80"
          />
        </div>
      )}

      <AchievementDetailsSheet
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        achievement={selected}
      />
      
      {isTrainingCostsOpen && (
        <TrainingCostsView onClose={() => setIsTrainingCostsOpen(false)} />
      )}
      {isPrivateScheduleOpen && (
        <PrivateSessionsScheduleView onClose={() => setIsPrivateScheduleOpen(false)} />
      )}
      {isPublicGamesOpen && (
        <CoachPublicGamesView onClose={() => setIsPublicGamesOpen(false)} />
      )}

      {isLanguageOpen && (
        <LanguageSelectView onClose={() => setIsLanguageOpen(false)} />
      )}

      <Dialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title={t('profile.deleteConfirmTitle')}
        description={t('profile.deleteConfirmDesc')}
        primaryButtonText={t('profile.deleteAccount')}
        primaryButtonOnClick={() => {
          setIsDeleteConfirmOpen(false);
          setFlowState('splash');
        }}
        secondaryButtonText={t('profile.cancel')}
        secondaryButtonOnClick={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

