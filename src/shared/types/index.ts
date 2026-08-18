export type UserRole = 'player' | 'coach';

export type AppFlowState = 'splash' | 'onboarding' | 'app';

export type NavigationTab = 'home' | 'leaderboard' | 'games' | 'profile' | 'coach' | 'attendance' | 'billing' | 'achievements' | 'players' | 'public_schedule' | 'blacklist';

export type PlayerState = 'spectating' | 'queued' | 'match_found' | 'resting' | 'playing';
export type CourtStatus = 'matchmaking' | 'in_progress' | 'reserved';

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  status: PlayerState;
  isHardmode?: boolean;
  hasTelegram?: boolean;
  isCoach?: boolean;
  gamesPlayed: number;
  wins: number;
  bpToday: number;
  winStreak: number;
  created_at?: string;
  updated_at?: string;
}

export interface Court {
  id: string;
  name: string;
  courtNumber: number;
  status: CourtStatus;
  isActive: boolean;
  isAvailable: boolean;
  isHardmode: boolean;
  timerSeconds: number;
  teamAIds: string[];
  teamBIds: string[];
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

export interface BlacklistEntry {
  id: string;
  userId: string;
  blockedId: string;
  created_at?: string;
}

export type { AchievementRarity, AchievementData } from './achievement';
