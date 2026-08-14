import { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { Header } from '../widgets/layout/Header';
import { BottomNav } from '../widgets/layout/BottomNav';
import { SplashScreen } from '../pages/common/SplashScreen';
import { OnboardingView } from '../pages/common/OnboardingView';
import { HomeView } from '../pages/player/HomeView';
import { CoachHomeView } from '../pages/coach/CoachHomeView';
import { LeaderboardView } from '../pages/player/LeaderboardView';
import { GamesView } from '../pages/common/GamesView';
import { ProfileView } from '../pages/player/ProfileView';
import { CoachView } from '../pages/coach/CoachView';
import { AttendanceView } from '../pages/coach/AttendanceView';
import { BillingView } from '../pages/coach/BillingView';
import { AchievementsView } from '../pages/player/AchievementsView';
import { Smartphone } from 'lucide-react';

export function App() {
  const { flowState, role, activeTab } = useAppStore();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();

      if (typeof tg.lockOrientation === 'function') {
        try { tg.lockOrientation(); } catch (e) { console.warn('lockOrientation:', e); }
      }

      if (typeof tg.requestFullscreen === 'function') {
        try {
          tg.requestFullscreen();
        } catch {
          tg.expand?.();
        }
      } else {
        tg.expand?.();
      }

      tg.disableVerticalSwipes?.();
      tg.setHeaderColor?.('#121212');
      tg.setBackgroundColor?.('#121212');
    }

    const checkOrientation = () => {
      const isMobileDevice = window.innerWidth <= 1024;
      const isHorizontal = window.innerWidth > window.innerHeight;
      setIsLandscape(isMobileDevice && isHorizontal);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // 1. Landscape Orientation Lock Screen Overlay for Mobile & Telegram
  if (isLandscape) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-6 text-center text-white select-none">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card mb-4 text-primary animate-bounce">
          <Smartphone className="h-8 w-8 rotate-90" />
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight text-white mb-2">
          Portrait Mode Required
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Please rotate your device back to portrait orientation to continue using the Volley app.
        </p>
      </div>
    );
  }

  // 2. Flow State: Splash Screen
  if (flowState === 'splash') {
    return <SplashScreen />;
  }

  // 3. Flow State: Onboarding Screen
  if (flowState === 'onboarding') {
    return <OnboardingView />;
  }

  // 4. Flow State: Main App Navigation View
  const renderTabContent = () => {
    if (role === 'coach' && activeTab === 'home') {
      return <CoachHomeView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'games':
        return <GamesView />;
      case 'profile':
        return <ProfileView />;
      case 'coach':
        return <CoachView />;
      case 'attendance':
        return <AttendanceView />;
      case 'billing':
        return <BillingView />;
      case 'achievements':
        return <AchievementsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="relative bg-background text-white selection:bg-primary selection:text-black">
      {activeTab === 'home' && <Header variant="main" sticky />}

      <main className="mx-auto max-w-[480px]">
        {renderTabContent()}
      </main>

      {activeTab !== 'profile' && activeTab !== 'attendance' && activeTab !== 'billing' && activeTab !== 'achievements' && (
        <>
          <div
            className="fixed bottom-0 inset-x-0 h-40 z-30 pointer-events-none bg-gradient-to-t from-background/80 via-background/40 to-transparent backdrop-blur-md"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
            }}
          />
          <BottomNav />
        </>
      )}
    </div>
  );
}

export default App;