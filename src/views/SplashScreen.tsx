import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const SplashScreen: React.FC = () => {
  const { setFlowState } = useAppStore();

  useEffect(() => {
    // Auto transition from Splash to Onboarding after 2 seconds
    const timer = setTimeout(() => {
      setFlowState('onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setFlowState]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#68BD44] p-6 text-black">
      {/* Brand Cursive Logotype in Splash Center */}
      <div className="flex flex-col items-center text-center animate-pulse-subtle">
        <h1 className="font-serif italic text-6xl font-extrabold tracking-tight text-black select-none">
          volley
        </h1>
      </div>
    </div>
  );
};
