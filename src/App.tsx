import { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { SplashScreen } from './views/SplashScreen';
import { OnboardingView } from './views/OnboardingView';
import { HomeView } from './views/HomeView';
import { CoachHomeView } from './views/CoachHomeView';
import { LeaderboardView } from './views/LeaderboardView';
import { GamesView } from './views/GamesView';
import { ProfileView } from './views/ProfileView';
import { CoachView } from './views/CoachView';
import { AttendanceView } from './views/AttendanceView';
import { BillingView } from './views/BillingView';
import { AchievementsView } from './views/AchievementsView';
import { Smartphone } from 'lucide-react';

export function App() {
  const { flowState, role, activeTab } = useAppStore();
  const [isLandscape, setIsLandscape] = useState(false);

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
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#121212] p-6 text-center text-white select-none">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1C1C1E] mb-4 text-[#68BD44] animate-bounce">
          <Smartphone className="h-8 w-8 rotate-90" />
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight text-white mb-2">
          Portrait Mode Required
        </h2>
        <p className="text-sm text-[#8E8E93] max-w-xs leading-relaxed">
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
    <div className="relative min-h-screen bg-[#121212] text-white selection:bg-[#68BD44] selection:text-black">
      {activeTab === 'home' && <TopHeader />}

      <main className="mx-auto max-w-[480px]">
        {renderTabContent()}
      </main>

      {activeTab !== 'profile' && activeTab !== 'attendance' && activeTab !== 'billing' && activeTab !== 'achievements' && (
        <>
          <div
            className="fixed bottom-0 inset-x-0 h-40 z-30 pointer-events-none bg-gradient-to-t from-[#121212]/80 via-[#121212]/40 to-transparent backdrop-blur-md"
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