import { create } from 'zustand';
import { UserRole, AppFlowState, NavigationTab, PlayerState, Player, Court, Match, LeaderboardEntry, BannerStage } from '../../shared/types/index';
import { initialCourts, joinedCourts } from '../../shared/api/mock/mockCourts';

interface AppState {
  role: UserRole;
  flowState: AppFlowState;
  activeTab: NavigationTab;
  previousTab: NavigationTab | null;
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
  
  // Global Matching States
  bannerStage: BannerStage;
  userAccepted: boolean;
  acceptedCount: number;
  acceptProgress: number;

  isSessionActive: boolean;
  
  trainingCosts: { public: number; private: number };
  blacklistedPlayerIds: string[];

  // Party State
  partyPlayers: Player[];
  partyPlacement: 'any' | 'teammates' | 'rivals';
  isPartyActive: boolean;

  // Actions
  setRole: (role: UserRole) => void;
  setFlowState: (flowState: AppFlowState) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setPlayerState: (state: PlayerState) => void;
  setTrainingCosts: (costs: { public: number; private: number }) => void;
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
  toggleBlacklist: (playerId: string) => void;

  setBannerStage: (stage: BannerStage) => void;
  setUserAccepted: (accepted: boolean) => void;
  setAcceptedCount: (count: number) => void;
  setAcceptProgress: (progress: number) => void;

  // Party Actions
  setPartyPlayers: (players: Player[]) => void;
  setPartyPlacement: (placement: 'any' | 'teammates' | 'rivals') => void;
  setPartyActive: (active: boolean) => void;
  resetParty: () => void;

  savedStates: Record<string, any>;
}

import { todaysPlayers12, mockLeaderboard } from '../../shared/api/mock/mockPlayers';
import { mockMatches } from '../../shared/api/mock/mockMatches';

export const useAppStore = create<AppState>((set) => ({
  role: 'player',
  flowState: 'onboarding',
  activeTab: 'home',
  previousTab: null,
  playerState: 'spectating', // Initial default state: 'spectating' (Unjoined / Start training mode)
  isHardmode: false,
  isMatchDetailOpen: false,
  isInviteHost: false,
  
  bannerStage: 'searching',
  userAccepted: false,
  acceptedCount: 2,
  acceptProgress: 0,
  
  currentUser: {
    id: 'p-me',
    name: 'Anna P.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 12,
    xp: 9062.0,
    status: 'spectating',
    isHardmode: false,
    gamesPlayed: 122,
    wins: 70,
    bpToday: 0.0,
    winStreak: 4,
    hasTelegram: true,
  },
  
  partyPlayers: [],
  partyPlacement: 'any',
  isPartyActive: false,

  courts: initialCourts,
  todaysPlayers: [],
  recentMatches: mockMatches,
  leaderboard: mockLeaderboard,
  
  trainingCosts: { public: 4000, private: 10000 },
  
  isSessionActive: false,
  blacklistedPlayerIds: ['p3', 'p4'],

  savedStates: {
    coach: {
      playerState: 'spectating',
      bannerStage: 'searching',
      userAccepted: false,
      acceptedCount: 2,
      acceptProgress: 0,
      currentUser: {
        id: 'p-me',
        name: 'Alexey S.',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        level: 12,
        xp: 9062.0,
        status: 'spectating',
        isHardmode: false,
        gamesPlayed: 122,
        wins: 70,
        bpToday: 0.0,
        winStreak: 4,
        hasTelegram: true,
      },
    }
  },

  setRole: (newRole) => set((state) => {
    if (state.role === newRole) return {};

    const oldRole = state.role;
    const currentStateToSave = {
      playerState: state.playerState,
      bannerStage: state.bannerStage,
      userAccepted: state.userAccepted,
      acceptedCount: state.acceptedCount,
      acceptProgress: state.acceptProgress,
      currentUser: state.currentUser,
    };

    const savedStates = {
      ...state.savedStates,
      [oldRole]: currentStateToSave,
    };

    const newStateData = savedStates[newRole] || {
      // Default player state if missing
      playerState: 'spectating',
      bannerStage: 'searching',
      userAccepted: false,
      acceptedCount: 2,
      acceptProgress: 0,
      currentUser: {
        id: 'p-me',
        name: 'Anna P.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        level: 12,
        xp: 9062.0,
        status: 'spectating',
        isHardmode: false,
        gamesPlayed: 122,
        wins: 70,
        bpToday: 0.0,
        winStreak: 4,
        hasTelegram: true,
      },
    };

    return {
      role: newRole,
      savedStates,
      ...newStateData,
    };
  }),
  setFlowState: (flowState) => set({ flowState }),
  setActiveTab: (tab) => set((state) => ({ previousTab: state.activeTab, activeTab: tab })),
  setPlayerState: (playerState) => set({ playerState }),
  setTrainingCosts: (costs) => set({ trainingCosts: costs }),
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
      },
      {
        id: 'm3',
        date: 'Today',
        time: '11:15',
        courtName: '#3',
        isHardmode: true,
        teamA: [
          { name: 'Alex M.', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80' },
          { name: 'Max T.', avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80' }
        ],
        teamB: [
          { name: 'Anna P.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
          { name: 'Chris W.', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
        ],
        scoreA: 11,
        scoreB: 11,
        isWin: false,
        isUnresolved: true,
        xpGained: 0,
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
    // Otherwise, place the player directly back into the matchmaking queue.
    const nextPlayerState: PlayerState = state.invitedPlayers.length > 0 ? 'match_found' : 'queued';

    return {
      playerState: nextPlayerState,
      bannerStage: nextPlayerState === 'queued' ? 'searching' : state.bannerStage,
      currentUser: {
        ...state.currentUser,
        status: nextPlayerState === 'match_found' ? 'queued' : nextPlayerState,
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

  toggleBlacklist: (playerId) => set((state) => {
    const isBlacklisted = state.blacklistedPlayerIds.includes(playerId);
    return {
      blacklistedPlayerIds: isBlacklisted
        ? state.blacklistedPlayerIds.filter(id => id !== playerId)
        : [...state.blacklistedPlayerIds, playerId]
    };
  }),

  setPartyPlayers: (players) => set({ partyPlayers: players }),
  setPartyPlacement: (placement) => set({ partyPlacement: placement }),
  setPartyActive: (active) => set({ isPartyActive: active }),
  resetParty: () => set({ partyPlayers: [], partyPlacement: 'any', isPartyActive: false }),

  setBannerStage: (stage) => set({ bannerStage: stage }),
  setUserAccepted: (accepted) => set({ userAccepted: accepted }),
  setAcceptedCount: (count) => set({ acceptedCount: count }),
  setAcceptProgress: (progress) => set({ acceptProgress: progress }),
}));
