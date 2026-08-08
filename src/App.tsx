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
    // Initialize Telegram WebApp SDK if available
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#121212');
      tg.setBackgroundColor('#121212');
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

  // 3. Flow State: Main Application with Top Header and Bottom Navigation
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans max-w-md mx-auto relative">
      {/* Sticky Top Header */}
      <TopHeader />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (role === 'coach' ? <CoachHomeView /> : <HomeView />)}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'games' && <GamesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'coach' && <CoachView />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default App;