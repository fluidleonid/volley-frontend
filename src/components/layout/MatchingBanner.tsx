import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export interface MatchingBannerProps {
  onAccept?: () => void;
}

export type BannerStage = 'searching' | 'waiting_user' | 'waiting_others' | 'all_accepted' | 'host_searching';

const TIMER_SECONDS = 30;

// Radar pulse in a 40×40 pill — shown while host is searching for a court
const RadarBadge: React.FC = () => (
  <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2C2C2E] shrink-0">
    <span
      className="absolute inset-0 rounded-full border-2 border-[#68BD44]/50 animate-ping"
      style={{ animationDuration: '1.3s' }}
    />
    <span
      className="absolute inset-[6px] rounded-full border border-[#68BD44]/40 animate-ping"
      style={{ animationDuration: '1.3s', animationDelay: '0.43s' }}
    />
    <span className="relative z-10 h-[9px] w-[9px] rounded-full bg-[#68BD44]" />
  </div>
);

// Avatar row for a team — shows real avatars from store
const TeamAvatars: React.FC<{ players: { id: string; name: string; avatarUrl?: string }[]; accepted?: boolean }> = ({
  players,
  accepted = true,
}) => (
  <div className="flex items-center -space-x-1.5">
    {players.map((p) => (
      <div key={p.id} className="relative z-10">
        {accepted ? (
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
    ))}
  </div>
);

export const MatchingBanner: React.FC<MatchingBannerProps> = ({ onAccept }) => {
  const {
    playerState, setPlayerState,
    setMatchDetailOpen,
    isInviteHost,
    inviteTeamA, inviteTeamB,
  } = useAppStore();

  const [dotCount, setDotCount] = useState(1);
  const [bannerStage, setBannerStage] = useState<BannerStage>('searching');
  const [userAccepted, setUserAccepted] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(2);
  const [progress, setProgress] = useState(0);

  // Reset stage when playerState changes
  useEffect(() => {
    if (playerState === 'queued') {
      setBannerStage(isInviteHost ? 'host_searching' : 'searching');
      setUserAccepted(false);
      setAcceptedCount(2);
      setProgress(0);
    } else if (playerState === 'match_found') {
      // Only go to waiting_user if NOT coming from host flow
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

  // Regular: queued → match_found after 3.5s
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

  // Host: radar → court found → all_accepted (Playing) after 4s, NO Accept step
  useEffect(() => {
    if (bannerStage === 'host_searching') {
      const t = setTimeout(() => {
        // Jump straight to Playing, skip Accept entirely
        setBannerStage('all_accepted');
        setUserAccepted(true);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [bannerStage]);

  // 60fps radial timer for Accept button
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

  // Simulate others accepting after user accepts
  useEffect(() => {
    if (userAccepted && bannerStage === 'waiting_others' && acceptedCount < 4) {
      const t1 = setTimeout(() => setAcceptedCount(3), 3000);
      const t2 = setTimeout(() => { setAcceptedCount(4); setBannerStage('all_accepted'); }, 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [userAccepted, bannerStage, acceptedCount]);

  if (playerState !== 'queued' && playerState !== 'match_found') return null;

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

  // Use real invite teams when available, fall back to mock for regular matching
  const hasInviteTeams = inviteTeamA.length > 0 || inviteTeamB.length > 0;
  const mockTeamA = [
    { id: 'p1', name: 'You', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 'p2', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];
  const mockTeamB = [
    { id: 'p3', name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 'p4', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  ];

  const displayTeamA = hasInviteTeams ? inviteTeamA : mockTeamA;
  const displayTeamB = hasInviteTeams ? inviteTeamB : mockTeamB;

  // Accepted state per player for waiting stages
  const teamAWithAccepted = displayTeamA.map((p, i) => ({
    ...p,
    isAccepted: i === 0 ? userAccepted || bannerStage === 'all_accepted' : true,
  }));
  const teamBWithAccepted = displayTeamB.map((p, i) => ({
    ...p,
    isAccepted: bannerStage === 'all_accepted' || (i === 0 ? acceptedCount >= 3 : acceptedCount >= 4),
  }));

  const totalPlayers = displayTeamA.length + displayTeamB.length;
  const acceptedSoFar = (userAccepted ? displayTeamA.length : displayTeamA.length - 1) +
    (acceptedCount >= 3 ? 1 : 0) + (acceptedCount >= 4 ? displayTeamB.length - 1 : 0);
  const remainingToWait = Math.max(1, totalPlayers - acceptedSoFar);

  // ── STATE 1: Regular searching ───────────────────────────────────────────
  if (bannerStage === 'searching') {
    return (
      <div className="flex h-[56px] items-center rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up">
        <div>
          <div className="text-xs font-bold text-white leading-none flex items-center">
            <span>Finding match</span>
            <span className="inline-block w-3 text-left">{'.'
              .repeat(dotCount)}</span>
          </div>
          <div className="mt-1 text-[11px] text-[#8E8E93] leading-none">
            Looking for free players around
          </div>
        </div>
      </div>
    );
  }

  // ── STATE HOST SEARCHING: "Finding a court" + real team avatars + radar badge ──
  if (bannerStage === 'host_searching') {
    return (
      <div className="flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up">
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold text-white leading-none mb-1">Finding a court…</div>
          <div className="flex items-center gap-1.5">
            <TeamAvatars players={displayTeamA} accepted />
            <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>
            <TeamAvatars players={displayTeamB} accepted />
          </div>
        </div>
        <RadarBadge />
      </div>
    );
  }

  // ── STATES 2, 3, 4: Match Found / Waiting / Playing ─────────────────────
  return (
    <div
      onClick={handleBannerClick}
      className={`flex h-[56px] items-center justify-between rounded-[28px] bg-[#1C1C1E] p-2 pl-3.5 animate-slide-up transition-all duration-300 ${
        bannerStage === 'all_accepted' ? 'cursor-pointer hover:bg-[#242426]' : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold text-white leading-none mb-1">
            {bannerStage === 'all_accepted'
              ? 'Playing'
              : bannerStage === 'waiting_others'
              ? `Waiting for ${remainingToWait} more…`
              : 'Match found!'}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center -space-x-1.5">
              {teamAWithAccepted.map((p) => (
                <div key={p.id} className="relative z-10">
                  {p.isAccepted ? (
                    <img src={p.avatarUrl} alt={p.name}
                      className="h-[22px] w-[22px] rounded-full object-cover border-2 border-[#1C1C1E]" />
                  ) : (
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2C2C2E] border-2 border-[#1C1C1E] text-[10px] font-bold text-[#8E8E93] animate-pulse">?</div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-[9px] font-bold text-[#8E8E93]/70 uppercase tracking-tight">vs</span>
            <div className="flex items-center -space-x-1.5">
              {teamBWithAccepted.map((p) => (
                <div key={p.id} className="relative z-10">
                  {p.isAccepted ? (
                    <img src={p.avatarUrl} alt={p.name}
                      className="h-[22px] w-[22px] rounded-full object-cover border-2 border-[#1C1C1E]" />
                  ) : (
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2C2C2E] border-2 border-[#1C1C1E] text-[10px] font-bold text-[#8E8E93] animate-pulse">?</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {userAccepted || bannerStage === 'all_accepted' ? (
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
