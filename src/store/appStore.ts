import { create } from 'zustand';
import { UserRole, AppFlowState, NavigationTab, PlayerState, Player, Court, Match, LeaderboardEntry } from '../types';

interface AppState {
  role: UserRole;
  flowState: AppFlowState;
  activeTab: NavigationTab;
  playerState: PlayerState;
  isHardmode: boolean;
  currentUser: Player;
  courts: Court[];
  todaysPlayers: Player[];
  recentMatches: Match[];
  leaderboard: LeaderboardEntry[];
  isMatchDetailOpen: boolean;
  invitedPlayers: Player[];
  inviteTeamA: Player[];
  inviteTeamB: Player[];
  isInviteHost: boolean;
  
  isSessionActive: boolean;
  
  // Actions
  setRole: (role: UserRole) => void;
  setFlowState: (flowState: AppFlowState) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setPlayerState: (state: PlayerState) => void;
  toggleSession: () => void;
  toggleHardmode: () => void;
  toggleCourtAvailability: (courtId: string) => void;
  startTraining: () => void;
  sitOut: () => void;
  stopTraining: () => void;
  continueToPlay: () => void;
  sendInvite: (teamA: Player[], teamB: Player[]) => void;
  completeOnboarding: (asRole?: UserRole) => void;
  finishMatch: (scoreA: number, scoreB: number) => void;
  setMatchDetailOpen: (open: boolean) => void;
}

const initialCourts: Court[] = [
  { id: 'court-1', name: '#1', courtNumber: 1, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-2', name: '#2', courtNumber: 2, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-3', name: '#3', courtNumber: 3, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-4', name: '#4', courtNumber: 4, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-5', name: '#5', courtNumber: 5, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-6', name: '#6', courtNumber: 6, statusText: 'Reserved', isActive: false, isAvailable: false, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
];

const joinedCourts: Court[] = [
  { id: 'court-1', name: '#1', courtNumber: 1, statusText: 'Matchmaking', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  {
    id: 'court-2',
    name: '#2',
    courtNumber: 2,
    statusText: 'In Progress',
    isActive: true,
    isAvailable: true,
    isHardmode: false,
    timerSeconds: 731, // 12:11
    teamA: [
      { id: 'p1', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', level: 15, xp: 4200, status: 'spectating', gamesPlayed: 80, wins: 55, bpToday: 2.4, winStreak: 6 },
      { id: 'p2', name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', level: 11, xp: 2300, status: 'spectating', gamesPlayed: 40, wins: 22, bpToday: 1.2, winStreak: 2 }
    ],
    teamB: [
      { id: 'p3', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', level: 14, xp: 3900, status: 'spectating', gamesPlayed: 75, wins: 48, bpToday: 3.1, winStreak: 3 },
      { id: 'p4', name: 'Jessica P.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', level: 10, xp: 1900, status: 'spectating', gamesPlayed: 30, wins: 18, bpToday: 0.8, winStreak: 1 }
    ],
    scoreA: 18,
    scoreB: 16,
  },
  {
    id: 'court-3',
    name: '#3',
    courtNumber: 3,
    statusText: 'In Progress',
    isActive: true,
    isAvailable: true,
    isHardmode: true,
    timerSeconds: 412,
    teamA: [
      { id: 'p5', name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', level: 12, xp: 3100, status: 'spectating', gamesPlayed: 50, wins: 30, bpToday: 2.0, winStreak: 3 },
      { id: 'p6', name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', level: 13, xp: 3500, status: 'spectating', gamesPlayed: 60, wins: 38, bpToday: 4.2, winStreak: 5 }
    ],
    teamB: [
      { id: 'p7', name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', level: 10, xp: 2000, status: 'spectating', gamesPlayed: 32, wins: 19, bpToday: 1.1, winStreak: 1 },
      { id: 'p8', name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', level: 9, xp: 1800, status: 'spectating', gamesPlayed: 28, wins: 15, bpToday: 0.9, winStreak: 2 }
    ],
    scoreA: 11,
    scoreB: 9,
  },
  { id: 'court-4', name: '#4', courtNumber: 4, statusText: 'Matching...', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-5', name: '#5', courtNumber: 5, statusText: 'Matching...', isActive: true, isAvailable: true, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
  { id: 'court-6', name: '#6', courtNumber: 6, statusText: 'Reserved', isActive: false, isAvailable: false, isHardmode: false, timerSeconds: 0, teamA: [], teamB: [], scoreA: 0, scoreB: 0 },
];

const todaysPlayers12: Player[] = [
  { id: 'p-me', name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', level: 12, xp: 9062, status: 'queued', gamesPlayed: 122, wins: 70, bpToday: 0.0, winStreak: 4 },
  { id: 'tp-1', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', level: 15, xp: 4200, status: 'spectating', gamesPlayed: 80, wins: 55, bpToday: 2.4, winStreak: 6 },
  { id: 'tp-2', name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', level: 11, xp: 2300, status: 'spectating', gamesPlayed: 40, wins: 22, bpToday: 1.2, winStreak: 2 },
  { id: 'tp-3', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', level: 14, xp: 3900, status: 'spectating', gamesPlayed: 75, wins: 48, bpToday: 3.1, winStreak: 3 },
  { id: 'tp-4', name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', level: 10, xp: 2100, status: 'queued', gamesPlayed: 35, wins: 20, bpToday: 1.5, winStreak: 2 },
  { id: 'tp-5', name: 'Jessica P.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', level: 10, xp: 1900, status: 'spectating', gamesPlayed: 30, wins: 18, bpToday: 0.8, winStreak: 1 },
  { id: 'tp-6', name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', level: 13, xp: 3500, status: 'resting', gamesPlayed: 60, wins: 38, bpToday: 4.2, winStreak: 5 },
  { id: 'tp-7', name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', level: 10, xp: 2000, status: 'spectating', gamesPlayed: 32, wins: 19, bpToday: 1.1, winStreak: 1 },
  { id: 'tp-8', name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', level: 9, xp: 1800, status: 'spectating', gamesPlayed: 28, wins: 15, bpToday: 0.9, winStreak: 2 },
  { id: 'tp-9', name: 'Dmitry V.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', level: 12, xp: 2800, status: 'queued', gamesPlayed: 45, wins: 26, bpToday: 1.8, winStreak: 4 },
  { id: 'tp-10', name: 'Maria K.', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80', level: 11, xp: 2400, status: 'spectating', gamesPlayed: 38, wins: 21, bpToday: 1.4, winStreak: 2 },
  { id: 'tp-11', name: 'Pavel N.', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', level: 13, xp: 3200, status: 'spectating', gamesPlayed: 52, wins: 32, bpToday: 2.1, winStreak: 3 },
];

export const useAppStore = create<AppState>((set) => ({
  role: 'player',
  flowState: 'splash',
  activeTab: 'home',
  playerState: 'spectating', // Initial default state: 'spectating' (Unjoined / Start training mode)
  isHardmode: false,
  isMatchDetailOpen: false,
  isInviteHost: false,
  
  currentUser: {
    id: 'p-me',
    name: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 12,
    xp: 9062.0,
    status: 'spectating',
    isHardmode: false,
    gamesPlayed: 122,
    wins: 70,
    bpToday: 0.0,
    winStreak: 4,
  },
  
  courts: initialCourts,
  todaysPlayers: [],
  recentMatches: [
    {
      id: 'm1',
      date: '2026-08-10',
      time: '14:30',
      courtName: '#1',
      isHardmode: true,
      teamA: [
        { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
        { name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
      ],
      teamB: [
        { name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        { name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
      ],
      scoreA: 15,
      scoreB: 12,
      isWin: true,
      xpGained: 54,
      bpGained: 12
    },
    {
      id: 'm2',
      date: '2026-08-10',
      time: '12:00',
      courtName: '#2',
      isHardmode: false,
      teamA: [
        { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
      ],
      teamB: [
        { name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' }
      ],
      scoreA: 8,
      scoreB: 15,
      isWin: false,
      xpGained: 12,
      bpGained: 0
    },
    {
      id: 'm3',
      date: '2026-08-09',
      time: '18:15',
      courtName: '#3',
      isHardmode: true,
      teamA: [
        { name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
        { name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
      ],
      teamB: [
        { name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
        { name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' }
      ],
      scoreA: 21,
      scoreB: 19,
      isWin: true,
      xpGained: 120,
      bpGained: 25
    }
  ],
  leaderboard: [
    { rank: 1, player: { id: 'lb-1', name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', level: 15, xp: 4200, status: 'spectating', gamesPlayed: 80, wins: 55, bpToday: 2.4, winStreak: 6 }, wins: 55, winRate: 68.7, xp: 4200 },
    { rank: 2, player: { id: 'lb-2', name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', level: 13, xp: 3500, status: 'resting', gamesPlayed: 60, wins: 38, bpToday: 4.2, winStreak: 5 }, wins: 38, winRate: 63.3, xp: 3500 },
    { rank: 3, player: { id: 'p-me', name: 'John Doe (You)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', level: 12, xp: 9062, status: 'spectating', gamesPlayed: 122, wins: 70, bpToday: 0.0, winStreak: 4 }, wins: 70, winRate: 57.3, xp: 9062 },
    { rank: 4, player: { id: 'lb-4', name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', level: 14, xp: 3300, status: 'queued', gamesPlayed: 75, wins: 48, bpToday: 3.1, winStreak: 3 }, wins: 48, winRate: 64.0, xp: 3300 },
    { rank: 5, player: { id: 'lb-5', name: 'Alex R.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', level: 10, xp: 3100, status: 'spectating', gamesPlayed: 35, wins: 20, bpToday: 1.5, winStreak: 2 }, wins: 20, winRate: 57.1, xp: 3100 },
    { rank: 6, player: { id: 'lb-6', name: 'Michael B.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', level: 10, xp: 2900, status: 'spectating', gamesPlayed: 32, wins: 19, bpToday: 1.1, winStreak: 1 }, wins: 19, winRate: 59.3, xp: 2900 },
    { rank: 7, player: { id: 'lb-7', name: 'Anna S.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', level: 9, xp: 2750, status: 'spectating', gamesPlayed: 28, wins: 15, bpToday: 0.9, winStreak: 2 }, wins: 15, winRate: 53.5, xp: 2750 },
    { rank: 8, player: { id: 'lb-8', name: 'Dmitry V.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', level: 12, xp: 2600, status: 'queued', gamesPlayed: 45, wins: 26, bpToday: 1.8, winStreak: 4 }, wins: 26, winRate: 57.7, xp: 2600 }
  ],
  
  isSessionActive: false,

  setRole: (role) => set({ role }),
  setFlowState: (flowState) => set({ flowState }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPlayerState: (playerState) => set({ playerState }),
  toggleSession: () => set((state) => {
    const nextSession = !state.isSessionActive;
    return {
      isSessionActive: nextSession,
      courts: nextSession ? joinedCourts : initialCourts,
      todaysPlayers: nextSession ? todaysPlayers12 : [],
    };
  }),
  
  toggleHardmode: () => set((state) => ({ 
    isHardmode: !state.isHardmode,
    currentUser: { ...state.currentUser, isHardmode: !state.isHardmode } 
  })),

  toggleCourtAvailability: (courtId: string) => set((state) => ({
    courts: state.courts.map((court) =>
      court.id === courtId
        ? {
            ...court,
            isAvailable: !court.isAvailable,
            statusText: !court.isAvailable ? 'Matching...' : 'Reserved',
          }
        : court
    ),
  })),
  
  startTraining: () => set((state) => ({
    isSessionActive: true,
    playerState: 'queued',
    currentUser: { ...state.currentUser, status: 'queued' },
    courts: joinedCourts,
    todaysPlayers: todaysPlayers12,
    recentMatches: [
      {
        id: 'm1',
        date: 'Today',
        time: '14:30',
        courtName: '#1',
        isHardmode: true,
        teamA: [
          { name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
          { name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
        ],
        teamB: [
          { name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
          { name: 'Jessica P.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
        ],
        scoreA: 15,
        scoreB: 12,
        isWin: true,
        xpGained: 54,
        bpGained: 12
      },
      {
        id: 'm2',
        date: 'Today',
        time: '12:00',
        courtName: '#2',
        isHardmode: false,
        teamA: [
          { name: 'David L.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
        ],
        teamB: [
          { name: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
        ],
        scoreA: 8,
        scoreB: 15,
        isWin: false,
        xpGained: 12,
        bpGained: 0
      }
    ]
  })),

  sitOut: () => set((state) => ({
    playerState: 'resting',
    currentUser: { ...state.currentUser, status: 'resting' }
  })),

  stopTraining: () => set((state) => ({
    playerState: 'spectating',
    isInviteHost: false,
    currentUser: { ...state.currentUser, status: 'spectating' },
    courts: initialCourts,
    todaysPlayers: [],
    recentMatches: []
  })),

  invitedPlayers: [],
  inviteTeamA: [],
  inviteTeamB: [],

  continueToPlay: () => set((state) => ({
    playerState: 'queued',
    currentUser: { ...state.currentUser, status: 'queued' }
  })),

  sendInvite: (teamA: Player[], teamB: Player[]) => set((state) => {
    const allInvited = [...teamA.filter(p => p.id !== state.currentUser.id), ...teamB];

    return {
      invitedPlayers: allInvited,
      inviteTeamA: teamA,
      inviteTeamB: teamB,
      playerState: 'queued',
      isInviteHost: true,
      currentUser: { ...state.currentUser, status: 'queued' },
    };
  }),

  completeOnboarding: (asRole = 'player') => set({
    role: asRole,
    flowState: 'app',
    activeTab: 'home'
  }),

  finishMatch: (scoreA: number, scoreB: number) => set((state) => {
    const isWin = scoreA > scoreB;
    const newMatch: Match = {
      id: `m-${Date.now()}`,
      date: 'Today',
      time: 'Just now',
      courtName: '#2',
      isHardmode: state.isHardmode,
      teamA: [
        { name: state.currentUser.name, avatarUrl: state.currentUser.avatarUrl },
        { name: 'Sarah M.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      ],
      teamB: [
        { name: 'Marcus K.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        { name: 'Elena T.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
      ],
      scoreA,
      scoreB,
      isWin,
      xpGained: isWin ? 65 : 20,
      bpGained: isWin ? 1.5 : 0.5,
    };

    // If there is an accepted invited game pending, immediately show the invited game banner ('match_found')!
    const nextPlayerState: PlayerState = state.invitedPlayers.length > 0 ? 'match_found' : 'spectating';

    return {
      playerState: nextPlayerState,
      currentUser: {
        ...state.currentUser,
        status: nextPlayerState === 'match_found' ? 'queued' : 'spectating',
        gamesPlayed: state.currentUser.gamesPlayed + 1,
        wins: isWin ? state.currentUser.wins + 1 : state.currentUser.wins,
        xp: state.currentUser.xp + (isWin ? 65 : 20),
        bpToday: state.currentUser.bpToday + (isWin ? 1.5 : 0.5),
        winStreak: isWin ? state.currentUser.winStreak + 1 : 0,
      },
      recentMatches: [newMatch, ...state.recentMatches],
      isMatchDetailOpen: false,
    };
  }),

  setMatchDetailOpen: (open: boolean) => set({ isMatchDetailOpen: open }),
}));
