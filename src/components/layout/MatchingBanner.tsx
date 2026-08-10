import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Player } from '../../types';

export interface MatchingBannerProps {
  onAccept?: () => void;
}

export type BannerStage = 'searching' | 'waiting_user' | 'waiting_others' | 'all_accepted' | 'host_searching';

const TIMER_SECONDS = 30;

// Cyclic Radar loader: expanding concentric circles from center with fading opacity within 40x40 container
const RadarBadge: React.FC = () => (
  <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2C2C2E] shrink-0 overflow-hidden">
    {/* Inner core */}
    <span className="relative z-10 h-[8px] w-[8px] rounded-full bg-[#68BD44]" />
    
    {/* Ring 1 */}
    <span
      className="absolute h-full w-full rounded-full border border-[#68BD44] opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]"
      style={{ animationDelay: '0s' }}
    />
    
    {/* Ring 2 */}
    <span
      className="absolute h-full w-full rounded-full border border-[#68BD44] opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]"
      style={{ animationDelay: '0.66s' }}
    />

    {/* Ring 3 */}
    <span
      className="absolute h-full w-full rounded-full border border-[#68BD44] opacity-0 animate-[radarPulse_2s_infinite_cubic-bezier(0,0.2,0.8,1)]"
      style={{ animationDelay: '1.33s' }}
    />
  </div>
);

// Team avatars row
const TeamAvatars: React.FC<{ players: (Player & { isAccepted?: boolean })[]; forceAccepted?: boolean }> = ({
  players,
  forceAccepted = false,
}) => (
  <div className="flex items-center -space-x-1.5">
    {players.map((p) => {
      const showAvatar = forceAccepted || p.isAccepted !== false;
      return (
        <div key={p.id} className="relative z-10">
          {showAvatar ? (
            <img
              src={p.avatarUrl}
              alt={p.name}
              className="h-[22px] w-[22px] rounded-full object-cover border-2 border-[#1C1C1E]"
            />
          ) : (
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2C2C2E] border-2 border-[#1C1C1E] text-[10px] font-bold text-[#8E8E93] animate-pulse">
              ?
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export const MatchingBanner: React.FC<MatchingBannerProps> = ({ onAccept }) => {
  const {
    playerState,
    setPlayerState,
    setMatchDetailOpen,
    isInviteHost,
    inviteTeamA,
    inviteTeamB,
    invitedPlayers,
  } = useAppStore();

  const [dotCount, setDotCount] = useState(1);
  const [bannerStage, setBannerStage] = useState<BannerStage>('searching');
  const [userAccepted, setUserAccepted] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(2);
  const [progress, setProgress] = useState(0);

  // Sync banner state with playerState & host flag
  useEffect(() => {
    if (playerState === 'queued') {
      setBannerStage(isInviteHost ? 'host_searching' : 'searching');
      setUserAccepted(false);
      setAcceptedCount(2);
      setProgress(0);
    } else if (playerState === 'match_found') {
      if (!isInviteHost) {
        setBannerStage('waiting_user');
        setProgress(0);
      }
    }
  }, [playerState, isInviteHost]);

  // Dots animation for regular searching
  useEffect(() => {
    if (playerState === 'queued' && bannerStage === 'searching') {
      const interval = setInterval(() => setDotCount((prev) => (prev % 3) + 1), 500);
      return () => clearInterval(interval);
    }
  }, [playerState, bannerStage]);

  // Regular: queued -> match_found after 3.5s
  useEffect(() => {
    if (playerState === 'queued' && bannerStage === 'searching') {
      const t = setTimeout(() => {
        setBannerStage('waiting_user');
        setPlayerState('match_found');
        setProgress(0);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [playerState, bannerStage, setPlayerState]);

  // Host: host_searching -> all_accepted (Playing) after 4s (court found)
  useEffect(() => {
    if (bannerStage === 'host_searching') {
      const t = setTimeout(() => {
        setBannerStage('all_accepted');
        setUserAccepted(true);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [bannerStage]);

  // Radial timer for Accept button
  useEffect(() => {
    if (bannerStage === 'waiting_user' && !userAccepted) {
      const startTime = Date.now();
      let raf: number;
      const update = () => {
        const p = Math.min(1, (Date.now() - startTime) / 1000 / TIMER_SECONDS);
        setProgress(p);
        if (p >= 1) {
          setBannerStage('searching');
          setPlayerState('queued');
          setUserAccepted(false);
          setAcceptedCount(2);
          setProgress(0);
        } else {
          raf = requestAnimationFrame(update);
        }
      };
      raf = requestAnimationFrame(update);
      return () => cancelAnimationFrame(raf);
    } else {
      setProgress(0);
    }
  }, [bannerStage, userAccepted, setPlayerState]);

  // Simulate others accepting
  useEffect(() => {
    if (userAccepted && bannerStage === 'waiting_others' && acceptedCount < 4) {
      const t1 = setTimeout(() => setAcceptedCount(3), 3000);
      const t2 = setTimeout(() => {
        setAcceptedCount(4);
        setBannerStage('all_accepted');
      }, 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [userAccepted, bannerStage, acceptedCount]);

  if (playerState !== 'queued' && playerState !== 'match_found' && playerState !== 'playing') {
    return null;
  }

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userAccepted) {
      setUserAccepted(true);
      setBannerStage('waiting_others');
      setAcceptedCount(2);
    } else {
      onAccept ? onAccept() : setPlayerState('spectating');
    }
  };

  const handleBannerClick = () => {
    if (bannerStage === 'all_accepted') setMatchDetailOpen(true);
  };

  const fillAngle = Math.min(360, Math.max(0, progress * 360));

  const hasInviteTeams = inviteTeamA.length > 0 || inviteTeamB.length > 0;
  const mockTeamA: Player[] = [
    { id: 'p1', name: 'You', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 12, xp: 9000, status: 'playing', gamesPlayed: 10, wins: 5, bpToday: 1, winStreak: 2 },
    { id: 'p2', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', level: 15, xp: 4200, status: 'playing', gamesPlayed: 80, wins: 55, bpToday: 2.4, winStreak: 6 },
  ];
  const mockTeamB: Player[] = [
    { id: 'p3', name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', level: 11, xp: 2300, status: 'playing', gamesPlayed: 40, wins: 22, bpToday: 1.2, winStreak: 2 },
    { id: 'p4', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', level: 14, xp: 3900, status: 'playing', gamesPlayed: 75, wins: 48, bpToday: 3.1, winStreak: 3 },
  ];

  const displayTeamA = hasInviteTeams ? inviteTeamA : mockTeamA;
  const displayTeamB = hasInviteTeams ? inviteTeamB : mockTeamB;

  const teamAWithAccepted = displayTeamA.map((p, i) => ({
    ...p,
    isAccepted: i === 0 ? userAccepted || bannerStage === 'all_accepted' : true,
  }));
  const teamBWithAccepted = displayTeamB.map((p, i) => ({
    ...p,
    isAccepted: bannerStage === 'all_accepted' || (i === 0 ? acceptedCount >= 3 : acceptedCount >= 4),
  }));

  const totalPlayers = displayTeamA.length + displayTeamB.length;
  const acceptedSoFar =
    (userAccepted ? displayTeamA.length : displayTeamA.length - 1) +
    (acceptedCount >= 3 ? 1 : 0) +
    (acceptedCount >= 4 ? displayTeamB.length - 1 : 0);
  const remainingToWait = Math.max(1, totalPlayers - acceptedSoFar);

  // Check if player is currently playing AND has an incoming/queued invite
  const isPlayingAndHasInvite = playerState === 'playing' && invitedPlayers.length > 0;

  // Single Banner rendering helper
  const renderSingleBanner = () => {
    if (bannerStage === 'searching' && playerState !== 'playing') {
      return (
        <div className="flex h-[56px] items-center rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up w-full">
          <div>
            <div className="text-xs font-bold text-white leading-none flex items-center">
              <span>Finding match</span>
              <span className="inline-block w-3 text-left">{'.'.repeat(dotCount)}</span>
            </div>
            <div className="mt-1 text-[11px] text-[#8E8E93] leading-none">
              Looking for free players around
            </div>
          </div>
        </div>
      );
    }

    if (bannerStage === 'host_searching' && playerState !== 'playing') {
      return (
        <div className="flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up w-full">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-bold text-white leading-none mb-1">Finding a court…</div>
            <div className="flex items-center gap-1.5">
              <TeamAvatars players={displayTeamA} forceAccepted />
              <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>
              <TeamAvatars players={displayTeamB} forceAccepted />
            </div>
          </div>
          <RadarBadge />
        </div>
      );
    }

    return (
      <div
        onClick={handleBannerClick}
        className={`flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up transition-all duration-300 w-full ${
          bannerStage === 'all_accepted' || playerState === 'playing' ? 'cursor-pointer hover:bg-[#242426]' : ''
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-bold text-white leading-none mb-1">
              {playerState === 'playing' || bannerStage === 'all_accepted'
                ? 'Playing'
                : bannerStage === 'waiting_others'
                ? `Waiting for ${remainingToWait} more…`
                : 'Match found!'}
            </div>
            <div className="flex items-center gap-1.5">
              <TeamAvatars players={teamAWithAccepted} />
              <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>
              <TeamAvatars players={teamBWithAccepted} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userAccepted || bannerStage === 'all_accepted' || playerState === 'playing' ? (
            <div className="flex h-[40px] min-w-[40px] px-3 items-center justify-center rounded-full bg-[#2C2C2E] font-sans text-[16px] font-bold text-white animate-fade-in shrink-0">
              #2
            </div>
          ) : (
            <button
              onClick={handleAccept}
              style={{
                background: `conic-gradient(from 0deg, #2C2C2E 0deg ${fillAngle}deg, #68BD44 ${fillAngle}deg 360deg)`,
              }}
              className="relative flex h-[40px] w-[90px] items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 font-extrabold text-[#050505]">Accept</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // If currently playing AND received/created an invite pool for next game:
  if (isPlayingAndHasInvite) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {/* Main Active Playing Banner (Shrunk width so next banner peeks 40px) */}
          <div className="w-[calc(100%-44px)] shrink-0">
            {renderSingleBanner()}
          </div>

          {/* Second Queued/Invited Game Banner (Shows Next Match & Avatars, No status button, 40px peek) */}
          <div className="w-[calc(100%-44px)] shrink-0 flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-white leading-none mb-1">Finding a court…</div>
              <div className="flex items-center gap-1.5">
                <TeamAvatars players={displayTeamA} forceAccepted />
                <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>
                <TeamAvatars players={displayTeamB} forceAccepted />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderSingleBanner();
};
