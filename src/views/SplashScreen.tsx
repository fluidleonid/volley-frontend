import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import logoSvg from '../assets/logo.svg';

export const SplashScreen: React.FC = () => {
  const { setFlowState } = useAppStore();

  useEffect(() => {
    // Automatically transition to onboarding after 2.2 seconds
    const timer = setTimeout(() => {
      setFlowState('onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [setFlowState]);

  return (
    <div
      onClick={() => setFlowState('onboarding')}
      className="flex min-h-screen w-full cursor-pointer flex-col items-center justify-center bg-[#68BD44] px-6 text-white max-w-md mx-auto transition-opacity duration-500 select-none overflow-hidden"
    >
      {/* Centered Full Brand Logo (Figma Node: 11404:11369, w=140px visually centered) */}
      <div className="flex items-center justify-center animate-fade-in my-auto">
        <img
          src={logoSvg}
          alt="Volley"
          className="w-[140px] h-auto object-contain"
        />
      </div>
    </div>
  );
};
