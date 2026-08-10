import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export interface MatchingBannerProps {
  onAccept?: () => void;
}

export type BannerStage = 'searching' | 'waiting_user' | 'waiting_others' | 'all_accepted';

const TIMER_SECONDS = 30;

export const MatchingBanner: React.FC<MatchingBannerProps> = ({ onAccept }) => {
  const { playerState, setPlayerState, currentUser, setMatchDetailOpen } = useAppStore();
  const [dotCount, setDotCount] = useState(1);
  const [bannerStage, setBannerStage] = useState<BannerStage>('searching');
  const [userAccepted, setUserAccepted] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(2);
  const [progress, setProgress] = useState(0); // 0.0 to 1.0 continuously (60fps)

  // Reset stage when player state changes
  useEffect(() => {
    if (playerState === 'queued') {
      setBannerStage('searching');
      setUserAccepted(false);
      setAcceptedCount(2);
      setProgress(0);
    } else if (playerState === 'match_found') {
      setBannerStage('waiting_user');
      setProgress(0);
    }
  }, [playerState]);

  // Dots animation sequence for searching state: ".", "..", "..."
  useEffect(() => {
    if (playerState === 'queued' && bannerStage === 'searching') {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [playerState, bannerStage]);

  // Demo auto-progression: queued -> waiting_user (Match found) after 3.5s
  useEffect(() => {
    if (playerState === 'queued' && bannerStage === 'searching') {
      const timer = setTimeout(() => {
        setBannerStage('waiting_user');
        setPlayerState('match_found');
        setProgress(0);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [playerState, bannerStage, setPlayerState]);

  // Ultra-smooth 60fps RequestAnimationFrame timer for 30s Accept button radial fill
  useEffect(() => {
    if (bannerStage === 'waiting_user' && !userAccepted) {
      const startTime = Date.now();
      let animFrameId: number;

      const updateProgress = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const currentProgress = Math.min(1, elapsed / TIMER_SECONDS);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          // 30 seconds expired without pressing Accept -> return to searching state
          setBannerStage('searching');
          setPlayerState('queued');
          setUserAccepted(false);
          setAcceptedCount(2);
          setProgress(0);
        } else {
          animFrameId = requestAnimationFrame(updateProgress);
        }
      };

      animFrameId = requestAnimationFrame(updateProgress);

      return () => cancelAnimationFrame(animFrameId);
    } else {
      setProgress(0);
    }
  }, [bannerStage, userAccepted, setPlayerState]);

  // Demo progression: after user accepts, simulate remaining players joining over time
  useEffect(() => {
    if (userAccepted && bannerStage === 'waiting_others' && acceptedCount < 4) {
      const timer1 = setTimeout(() => {
        setAcceptedCount(3);
      }, 3000);

      const timer2 = setTimeout(() => {
        setAcceptedCount(4);
        setBannerStage('all_accepted');
      }, 6000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [userAccepted, bannerStage, acceptedCount]);

  if (playerState !== 'queued' && playerState !== 'match_found') {
    return null;
  }

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userAccepted) {
      setUserAccepted(true);
      setBannerStage('waiting_others');
      setAcceptedCount(2); // You accepted
    } else {
      if (onAccept) {
        onAccept();
      } else {
        setPlayerState('spectating');
      }
    }
  };

  const handleBannerClick = () => {
    if (bannerStage === 'all_accepted') {
      setMatchDetailOpen(true);
    }
  };

  const animatedDots = '.'.repeat(dotCount);

  // Smooth 60fps Radial fill angle: 0deg (100% green) at start -> 360deg (100% gray) at 30s
  const fillAngle = Math.min(360, Math.max(0, progress * 360));

  // Mock players grouped into Team A and Team B
  const teamA = [
    {
      id: 'p1',
      name: 'You',
      avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isAccepted: userAccepted,
    },
    {
      id: 'p2',
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isAccepted: true,
    },
  ];

  const teamB = [
    {
      id: 'p3',
      name: 'Marcus K.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isAccepted: acceptedCount >= 3,
    },
    {
      id: 'p4',
      name: 'Elena T.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      isAccepted: acceptedCount >= 4,
    },
  ];

  const remainingToWait = 4 - (userAccepted ? 2 : 1) - (acceptedCount >= 3 ? 1 : 0);

  return (
    <div
      onClick={handleBannerClick}
      className={`flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up transition-all duration-300 ${
        bannerStage === 'all_accepted' ? 'cursor-pointer hover:bg-[#242426]' : ''
      }`}
    >
      {bannerStage === 'searching' ? (
        /* STATE 1: Searching / Finding match... */
        <div>
          <div className="text-xs font-bold text-white leading-none flex items-center">
            <span>Finding match</span>
            <span className="inline-block w-3 text-left">{animatedDots}</span>
          </div>
          <div className="mt-1 text-[11px] text-[#8E8E93] leading-none">
            Looking for free players around
          </div>
        </div>
      ) : (
        /* STATE 2, 3 & 4: Match Found / Waiting for N players / Playing */
        <>
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col justify-center">
              {/* All Titles in Uniform Primary White Text (#FFFFFF) */}
              <div className="text-xs font-bold text-white leading-none mb-1">
                {bannerStage === 'all_accepted'
                  ? 'Playing'
                  : bannerStage === 'waiting_others'
                  ? `Waiting for ${remainingToWait > 0 ? remainingToWait : 1} player${remainingToWait !== 1 ? 's' : ''}...`
                  : 'Match found!'}
              </div>

              {/* Team A vs Team B Avatars Stack (Outer border = banner background #1C1C1E) */}
              <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
                {/* Team A (2 Avatars) */}
                <div className="flex items-center -space-x-1.5">
                  {teamA.map((p) => (
                    <div key={p.id} className="relative z-10">
                      {p.isAccepted ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-[22px] w-[22px] rounded-full object-cover border-2 border-[#1C1C1E]"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2C2C2E] border-2 border-[#1C1C1E] text-[10px] font-bold text-[#8E8E93] animate-pulse">
                          ?
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>

                {/* Team B (2 Avatars) */}
                <div className="flex items-center -space-x-1.5">
                  {teamB.map((p) => (
                    <div key={p.id} className="relative z-10">
                      {p.isAccepted ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-[22px] w-[22px] rounded-full object-cover border-2 border-[#1C1C1E]"
                        />
                      ) : (
                        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2C2C2E] border-2 border-[#1C1C1E] text-[10px] font-bold text-[#8E8E93] animate-pulse">
                          ?
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Circular / Oval Court Badge #2 (w=40px, h=40px) OR Accept button (h=40px) */}
          <div className="flex items-center gap-2">
            {userAccepted || bannerStage === 'all_accepted' ? (
              /* Circular / Oval Court Number Badge (h=40px, min-w=40px, px=3) - Noto Sans (font-sans 16px body-base) */
              <div className="flex h-[40px] min-w-[40px] px-3 items-center justify-center rounded-full bg-[#2C2C2E] font-sans text-[16px] font-bold text-white animate-fade-in shrink-0">
                #2
              </div>
            ) : (
              /* Accept Button (h=40px, w=90px) with 60fps Silky Smooth Radial Conic Gray Fill Animation */
              <button
                onClick={handleAccept}
                style={{
                  background: `conic-gradient(from 0deg, #2C2C2E 0deg ${fillAngle}deg, #68BD44 ${fillAngle}deg 360deg)`,
                }}
                className="relative flex h-[40px] w-[90px] items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 font-extrabold text-[#050505]">
                  Accept
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
