export type UserRole = 'player' | 'coach';

export type AppFlowState = 'splash' | 'onboarding' | 'app';

export type NavigationTab = 'home' | 'leaderboard' | 'games' | 'profile' | 'coach' | 'attendance' | 'billing';

export type PlayerState = 'spectating' | 'queued' | 'match_found' | 'resting' | 'playing';

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  status: PlayerState;
  isHardmode?: boolean;
  gamesPlayed: number;
  wins: number;
  bpToday: number;
  winStreak: number;
}

export interface Court {
  id: string;
  name: string;
  courtNumber: number;
  statusText?: 'Matchmaking' | 'Matching...' | 'Matchmaking...' | 'In Progress' | 'Reserved...' | 'Reserved';
  isActive: boolean;
  isAvailable: boolean; // Admin/Coach toggle state
  isHardmode: boolean;
  timerSeconds: number;
  teamA: Player[];
  teamB: Player[];
  scoreA: number;
  scoreB: number;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  courtName: string;
  isHardmode: boolean;
  teamA: { name: string; avatarUrl?: string }[];
  teamB: { name: string; avatarUrl?: string }[];
  scoreA: number;
  scoreB: number;
  isWin: boolean;
  xpGained: number;
  bpGained?: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  wins: number;
  winRate: number;
  xp: number;
}
