import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Check } from 'lucide-react';

export interface SkillLevelOption {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  ringColor: string;
  badgeIcon: string;
  cardPatternClass: string;
}

const skillLevels: SkillLevelOption[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'I want to learn',
    accentColor: '#68BD44',
    ringColor: '#D4AF37',
    badgeIcon: '🪶',
    cardPatternClass: 'from-[#68BD44]/15 via-[#1C1C1E] to-[#1C1C1E]',
  },
  {
    id: 'amateur',
    title: 'Amateur',
    subtitle: 'I play for fun',
    accentColor: '#34C759',
    ringColor: '#34C759',
    badgeIcon: '🏸',
    cardPatternClass: 'from-[#34C759]/15 via-[#1C1C1E] to-[#1C1C1E]',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'I play to win',
    accentColor: '#FF9500',
    ringColor: '#FF9500',
    badgeIcon: '🔥',
    cardPatternClass: 'from-[#FF9500]/20 via-[#1C1C1E] to-[#1C1C1E]',
  },
  {
    id: 'pro',
    title: 'Pro',
    subtitle: 'I live for this game',
    accentColor: '#AF52DE',
    ringColor: '#FFD700',
    badgeIcon: '👑',
    cardPatternClass: 'from-[#AF52DE]/25 via-[#1C1C1E] to-[#1C1C1E]',
  },
];

export const OnboardingView: React.FC = () => {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('beginner');
  const { completeOnboarding } = useAppStore();

  const activeLevel = skillLevels.find((l) => l.id === selectedLevelId) || skillLevels[0];

  const handleContinue = () => {
    completeOnboarding('player');
  };

  const handleCoachLogin = () => {
    completeOnboarding('coach');
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#121212] px-5 py-6 text-white max-w-md mx-auto">
      {/* Top Header & Brand Logo */}
      <div className="flex flex-col items-center pt-2 text-center">
        {/* Volley Cursive Logo Header */}
        <div className="font-serif italic text-3xl font-extrabold tracking-tight text-white select-none">
          volley
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          Welcome to the Game!
        </h1>
        <p className="mt-1 text-sm font-medium text-[#8E8E93]">
          Choose your skill level
        </p>
      </div>

      {/* Center Card with Dynamic Level Styling, Net Pattern & Avatar */}
      <div className="my-5 flex justify-center">
        <div
          className={`relative flex h-44 w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-b shadow-2xl transition-all duration-300 ${activeLevel.cardPatternClass}`}
          style={{ borderColor: activeLevel.accentColor + '60' }}
        >
          {/* Badminton Net Background Pattern SVG */}
          <svg className="absolute inset-0 h-full w-full opacity-20 stroke-[#555]" xmlns="http://www.w3.org/2000/svg">
            <pattern id="net-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#net-pattern)" />
          </svg>

          {/* Central Avatar with Dynamic Level Ring */}
          <div
            className="relative z-10 h-20 w-20 overflow-hidden rounded-full border-2 bg-[#242426] shadow-xl transition-all duration-300"
            style={{ borderColor: activeLevel.ringColor }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Player Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Dynamic Badge Icon for Level */}
          <div className="relative z-10 mt-3 text-sm transition-transform duration-300 animate-bounce">
            {activeLevel.badgeIcon}
          </div>
        </div>
      </div>

      {/* Skill Level Options List */}
      <div className="space-y-2.5">
        {skillLevels.map((level) => {
          const isSelected = selectedLevelId === level.id;

          return (
            <div
              key={level.id}
              onClick={() => setSelectedLevelId(level.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-200 active:scale-[0.99] ${
                isSelected
                  ? 'bg-[#1C1C1E]'
                  : 'border-[#2C2C2E] bg-[#1C1C1E]/80 hover:border-[#444]'
              }`}
              style={{
                borderColor: isSelected ? level.accentColor : undefined,
                boxShadow: isSelected ? `0 0 15px ${level.accentColor}30` : undefined,
              }}
            >
              <div>
                <div className="text-base font-semibold text-white">
                  {level.title}
                </div>
                <div className="text-xs font-normal text-[#8E8E93]">
                  {level.subtitle}
                </div>
              </div>

              {isSelected && (
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-black font-bold"
                  style={{ backgroundColor: level.accentColor }}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleContinue}
          className="flex h-13 w-full items-center justify-center rounded-full bg-[#68BD44] py-3.5 text-base font-bold text-black shadow-lg shadow-[#68BD44]/25 transition-all active:scale-[0.98] hover:bg-[#5AA739]"
        >
          Continue
        </button>

        {/* Coach Entrance Link */}
        <div className="text-center">
          <button
            onClick={handleCoachLogin}
            className="text-xs font-semibold text-[#68BD44] underline-offset-4 hover:underline"
          >
            Enter as Coach →
          </button>
        </div>
      </div>
    </div>
  );
};
