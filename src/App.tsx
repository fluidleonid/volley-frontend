import { useEffect } from 'react';
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

export function App() {
  const { flowState, role, activeTab } = useAppStore();

  useEffect(() => {
    // Initialize Telegram WebApp SDK & Trigger Fullscreen Mode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();

      // Request Fullscreen Mode (Telegram Mini App Bot API 8.0+)
      if (typeof tg.requestFullscreen === 'function') {
        try {
          tg.requestFullscreen();
        } catch (e) {
          console.log('requestFullscreen not supported or deferred:', e);
          tg.expand();
        }
      } else if (typeof tg.expand === 'function') {
        tg.expand();
      }

      // Disable vertical swipe down gesture to prevent accidental closing
      if (typeof tg.disableVerticalSwipes === 'function') {
        tg.disableVerticalSwipes();
      }

      if (typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor('#121212');
      }
      if (typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor('#121212');
      }
    }
  }, []);

  // 1. Flow State: Splash Screen
  if (flowState === 'splash') {
    return <SplashScreen />;
  }

  // 2. Flow State: Onboarding Screen
  if (flowState === 'onboarding') {
    return <OnboardingView />;
  }

  // 3. Flow State: Main App Navigation View
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
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121212] text-white selection:bg-[#68BD44] selection:text-black">
      {/* Top Header Navigation */}
      <TopHeader />

      {/* Main Page View Content */}
      <main className="mx-auto max-w-md">
        {renderTabContent()}
      </main>

      {/* Floating Bottom Capsule Tabbar */}
      <BottomNav />
    </div>
  );
}

export default App;