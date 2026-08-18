import React from 'react';
import playerCardPng from '../../../shared/assets/images/player-card.png';
import shuttleIconSvg from '../../../shared/assets/icons/shuttle-icon.svg';
import { Avatar } from '../../../shared/ui/Avatar';
import { useTranslation } from 'react-i18next';
import whistleIconSvg from '../../../shared/assets/icons/whistle-fill.svg';

export interface PlayerCardProps {
  avatarUrl?: string;
  accentColor?: string;
  ringColor?: string;
  glowColor?: string;
  className?: string;
  backgroundImage?: string;
  isCoachCard?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  avatarUrl,
  accentColor = '#68BD44',
  ringColor = '#68BD44',
  iconCount = 4,
  glowColor = 'rgba(104,189,68,0.9)',
  className = '',
  backgroundImage = playerCardPng,
  isCoachCard = false,
}) => {
  const { t } = useTranslation();

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
    <div className={`relative flex flex-col items-center justify-center rounded-[32px] bg-card p-3.5 transition-all duration-300 w-full ${className}`}>
      <div className="relative w-full">
        <svg
          viewBox="0 0 333 172"
          className="w-full h-auto overflow-visible transition-all duration-300"
          style={{
            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
          }}
        >
          <defs>
            <clipPath id="playerCardContourClipReusable">
              <path d={cardContourPath} />
            </clipPath>
          </defs>

          {/* Background Image clipped to exact contour path */}
          <image
            href={backgroundImage}
            x="0"
            y="0"
            width="333"
            height="172"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#playerCardContourClipReusable)"
            opacity="0.85"
          />

          {/* Contour Stroke along exact cutout shape */}
          <path
            d={cardContourPath}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.75"
            className="transition-colors duration-300"
          />
        </svg>

        {/* Central Circular Avatar */}
        <div
          className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300"
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        >
          <Avatar
            src={avatarUrl}
            alt="Player Avatar"
            size="xl"
            className="border-2 shadow-xl"
            style={{ borderColor: ringColor }}
          />
        </div>

        {/* Shuttlecock Level Icons or Coach Label (Inside the bottom cutout tab) */}
        <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20">
          {isCoachCard ? (
            <div className="flex items-center gap-1.5">
              <div
                className="h-[20px] w-[20px] shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: accentColor,
                  maskImage: `url("${whistleIconSvg}")`,
                  WebkitMaskImage: `url("${whistleIconSvg}")`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
              <span 
                className="font-display font-black tracking-widest text-[16px] uppercase leading-none"
                style={{ color: accentColor }}
              >
                {t('roles.coach', 'COACH')}
              </span>
            </div>
          ) : (
            Array.from({ length: iconCount }).map((_, idx) => (
              <div
                key={idx}
                className="h-5 w-5 shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: accentColor,
                  maskImage: `url("${shuttleIconSvg}")`,
                  WebkitMaskImage: `url("${shuttleIconSvg}")`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
