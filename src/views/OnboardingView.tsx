import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Check } from 'lucide-react';
import logotextSvg from '../assets/logotext.svg';
import playerCardPng from '../assets/player-card.png';
import shuttleIconSvg from '../assets/shuttle-icon.svg';

export interface SkillLevelOption {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  ringColor: string;
  iconCount: number;
  glowColor: string;
}

const skillLevels: SkillLevelOption[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'I want to learn',
    accentColor: '#68BD44',
    ringColor: '#68BD44',
    iconCount: 1,
    glowColor: 'rgba(104,189,68,0.9)',
  },
  {
    id: 'amateur',
    title: 'Amateur',
    subtitle: 'I play for fun',
    accentColor: '#34C759',
    ringColor: '#34C759',
    iconCount: 2,
    glowColor: 'rgba(52,199,89,0.9)',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'I play to win',
    accentColor: '#FF9500',
    ringColor: '#FF9500',
    iconCount: 3,
    glowColor: 'rgba(255,149,0,0.95)',
  },
  {
    id: 'pro',
    title: 'Pro',
    subtitle: 'I live for this game',
    accentColor: '#AF52DE',
    ringColor: '#AF52DE',
    iconCount: 4,
    glowColor: 'rgba(175,82,222,0.95)',
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

  // Exact vector contour path (rounded rectangle + bottom cutout notch)
  const cardContourPath = `
    M 22,0
    H 311
    A 22,22 0 0 1 333,22
    V 150
    A 22,22 0 0 1 311,172
    H 251.531
    C 246.252,172 241.736,168.202 240.832,162.999
    C 239.926,157.796 235.41,154 230.131,154
    H 102.869
    C 97.59,154 93.074,157.796 92.168,162.999
    C 91.264,168.202 86.748,172 81.469,172
    H 22
    A 22,22 0 0 1 0,150
    V 22
    A 22,22 0 0 1 22,0
    Z
  `;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#121212] px-4 py-6 text-white max-w-md mx-auto select-none">
      {/* Top Header & Brand Logo (Figma Node: 11411:13797, h=28px) */}
      <div className="flex flex-col items-center pt-2 text-center">
        <img
          src={logotextSvg}
          alt="volley"
          className="h-[28px] w-auto object-contain select-none"
        />

        <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-white leading-tight">
          Welcome to the Game!
        </h1>
        <p className="mt-1 text-[13px] font-medium text-[#8E8E93]">
          Choose your skill level
        </p>
      </div>

      {/* Center Player Card Component (Clean Outer Box, Concentric Equal Padding, Crisp Border Contour Glow) */}
      <div className="my-4 flex justify-center">
        <div className="relative flex flex-col items-center justify-center rounded-[32px] bg-[#08080A] p-3.5 transition-all duration-300 w-full max-w-[361px]">
          
          {/* True Vector Shape Card Window */}
          <div className="relative w-full max-w-[333px]">
            <svg
              viewBox="0 0 333 172"
              className="w-full h-auto overflow-visible transition-all duration-300"
              style={{
                filter: `drop-shadow(0px 0px 4px ${activeLevel.glowColor})`,
              }}
            >
              <defs>
                {/* SVG ClipPath with exact cutout contour */}
                <clipPath id="playerCardContourClip">
                  <path d={cardContourPath} />
                </clipPath>
              </defs>

              {/* Background Image clipped to exact contour path */}
              <image
                href={playerCardPng}
                width="333"
                height="172"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#playerCardContourClip)"
                opacity="0.85"
              />

              {/* Contour Stroke along exact cutout shape */}
              <path
                d={cardContourPath}
                fill="none"
                stroke={activeLevel.accentColor}
                strokeWidth="1.75"
                className="transition-colors duration-300"
              />
            </svg>

            {/* Central Circular Avatar */}
            <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className="h-20 w-20 overflow-hidden rounded-full border-2 bg-[#242426] shadow-xl transition-all duration-300"
                style={{ borderColor: activeLevel.ringColor }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Player Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Shuttlecock Level Icons (Inside the bottom cutout tab) */}
            <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20">
              {Array.from({ length: activeLevel.iconCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-4 w-4 shrink-0 transition-colors duration-300"
                  style={{
                    backgroundColor: activeLevel.accentColor,
                    maskImage: `url(${shuttleIconSvg})`,
                    WebkitMaskImage: `url(${shuttleIconSvg})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Level Options List (Selected items ALWAYS use Primary Brand Green #68BD44!) */}
      <div className="space-y-2.5 max-w-[361px] mx-auto w-full">
        {skillLevels.map((level) => {
          const isSelected = selectedLevelId === level.id;

          return (
            <div
              key={level.id}
              onClick={() => setSelectedLevelId(level.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-[20px] px-4 py-3.5 transition-all duration-200 active:scale-[0.99] ${
                isSelected
                  ? 'bg-[#1C1C1E] border border-[#68BD44] shadow-[0_0_15px_rgba(104,189,68,0.25)]'
                  : 'bg-[#1C1C1E]/70 hover:bg-[#1C1C1E] border border-transparent'
              }`}
            >
              {/* Left Side: Title & Subtitle ONLY */}
              <div>
                <div className="text-base font-semibold text-white leading-snug">
                  {level.title}
                </div>
                <div className="text-xs font-normal text-[#8E8E93]">
                  {level.subtitle}
                </div>
              </div>

              {/* Right Side: Checkmark Badge in Primary Brand Green #68BD44 when selected */}
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#68BD44] text-black font-bold shadow-md">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions (Figma Node: 11411:13925, button/base w=361px, h=44px, bg=#68BD44 for ALL levels) */}
      <div className="mt-6 flex flex-col gap-3 max-w-[361px] mx-auto w-full">
        <button
          onClick={handleContinue}
          className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#68BD44] text-sm font-extrabold text-black shadow-lg shadow-[#68BD44]/25 transition-all active:scale-[0.98] hover:bg-[#5AA739]"
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
