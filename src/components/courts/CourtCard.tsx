import React, { useState, useEffect } from 'react';
import { Court } from '../../types';
import { Timer } from 'lucide-react';
import { AvatarGroup } from '../ui/AvatarGroup';
import courtSm from '../../assets/court-sm.svg';

export interface CourtCardProps {
  court: Court;
  showCoachToggle?: boolean;
  onToggleAvailability?: (courtId: string) => void;
  onSelectCourt?: (court: Court) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  showCoachToggle = false,
  onToggleAvailability,
  onSelectCourt,
}) => {
  const isPlaying = court.teamA.length > 0 || court.teamB.length > 0;
  const isAvailable = court.isAvailable;

  // Real-time live match timer (seconds)
  const initialSeconds = court.timerSeconds > 0 ? court.timerSeconds : 731; // default 12:11
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleOpenMatchDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying && onSelectCourt) {
      onSelectCourt(court);
    }
  };

  return (
    <div
      className={`relative flex h-[206px] min-h-[206px] max-h-[206px] w-[140px] min-w-[140px] max-w-[140px] shrink-0 flex-col justify-between rounded-[20px] bg-[#1C1C1E] p-3.5 shadow-lg overflow-hidden transition-all duration-200 ${
        isAvailable ? 'opacity-100' : 'opacity-40'
      }`}
    >
      {/* Top Heading: Court Name & Coach Toggle */}
      <div className="flex items-center justify-between z-10">
        <span className="font-display text-base font-extrabold text-white tracking-tight">
          {court.name}
        </span>

        {showCoachToggle && onToggleAvailability && (
          /* Coach Availability Admin Toggle Switch */
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(court.id);
            }}
            className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              court.isAvailable ? 'bg-[#68BD44]' : 'bg-[#3A3A3C]'
            }`}
            title="Toggle Court Availability"
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                court.isAvailable ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        )}
      </div>

      {/* Center Content: Team A & Team B Avatars (Tap Zone for Match details, active only when players exist) */}
      <div
        onClick={isPlaying ? handleOpenMatchDetails : undefined}
        className={`my-auto flex flex-col items-center justify-center gap-4 z-10 py-1.5 rounded-xl ${
          isPlaying && onSelectCourt
            ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all'
            : ''
        }`}
      >
        {isPlaying ? (
          <>
            {/* Team A Avatars */}
            <AvatarGroup players={court.teamA} size="lg" stacked={true} />
            
            {/* Team B Avatars */}
            <AvatarGroup players={court.teamB} size="lg" stacked={true} />
          </>
        ) : (
          <div className="h-10" />
        )}
      </div>

      {/* ABSOLUTE VERTICAL CENTER NOTCH CUTOUT (Full-bleed edge-to-edge dashed line, notch shapes sit on top) */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-0">
        {/* Full-bleed Edge-to-Edge Dashed Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-b border-dashed border-[#2C2C2E]/60 z-0" />
        
        {/* Left Cutout Notch Vector (On Top) */}
        <img src={courtSm} alt="" className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-[22px] z-10" />
        
        {/* Right Cutout Notch Vector (Rotated 180 deg, On Top) */}
        <img src={courtSm} alt="" className="absolute right-0 top-1/2 -translate-y-1/2 w-[6px] h-[22px] z-10 rotate-180" />
      </div>

      {/* Bottom Status / Time Counter */}
      <div className="text-center pt-1 z-10">
        {isPlaying || court.timerSeconds > 0 ? (
          <div className="flex items-center justify-center gap-1 font-mono text-xs text-[#8E8E93]">
            <Timer className="h-3.5 w-3.5 text-inherit animate-pulse" />
            <span>{formattedTime}</span>
          </div>
        ) : (
          <div className="font-sans text-[11px] font-medium text-[#8E8E93] flex items-center justify-center">
            {!isAvailable ? 'Reserved' : 'Matchmaking'}
          </div>
        )}
      </div>
    </div>
  );
};
