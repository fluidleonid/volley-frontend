import { create } from 'zustand';
import {
  UserRole,
  AppFlowState,
  NavigationTab,
  PlayerState,
  Player,
  Court,
  Match,
  LeaderboardEntry,
  BannerStage,
  AchievementData,
  NextScheduledSession,
} from '../../shared/types/index';
import { initialCourts, joinedCourts } from '../../shared/api/mock/mockCourts';
import { todaysPlayers12, mockLeaderboard, MOCK_PLAYERS } from '../../shared/api/mock/mockPlayers';
import { mockMatches } from '../../shared/api/mock/mockMatches';
import { MOCK_ACHIEVEMENTS } from '../../shared/api/mock/achievements';
import {
  SkillTierId,
  applyCoachTierOverride,
  buildMatchmakingTeams,
  calculatePlayerMatchReward,
  getMinimumXpForTier,
} from '../../shared/lib/rating-algorithm';
import { formatShortName, getInitialsFromName } from '../../shared/lib/formatName';
import { IS_STAGING, supabase } from '../../shared/api/supabase/client';
import {
  authenticateWithTelegram,
  evaluateAndSyncAchievements,
  fetchAllPlayersFromDb,
  fetchProductionState,
  findNextScheduledSession,
  saveOnboardingSkillTier,
  updatePlayerTierByCoachInDb,
} from '../../shared/api/supabase/volleyApi';

interface AppState {
  isStaging: boolean;
  role: UserRole;
  coachId: string | null;
  activeSessionId: string | null;
  flowState: AppFlowState;
  activeTab: NavigationTab;
  previousTab: NavigationTab | null;
  playerState: PlayerState;
  isHardmode: boolean;
  currentUser: Player;
  courts: Court[];
  todaysPlayers: Player[];
  allPlayers: Player[];
  recentMatches: Match[];
  leaderboard: LeaderboardEntry[];
  achievements: AchievementData[];
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
  matchedTeamA: Player[];
  matchedTeamB: Player[];

  isSessionActive: boolean;
  nextScheduledSession: NextScheduledSession | null;
  coachesList: any[];

  trainingCosts: { public: number; private: number };
  weeklySchedule: any[];
  specialDates: any[];
  blacklistedPlayerIds: string[];

  // Party State
  partyPlayers: Player[];
  partyPlacement: 'any' | 'teammates' | 'rivals';
  isPartyActive: boolean;

  // Actions
  initProductionSession: () => Promise<void>;
  refreshPlayers: () => Promise<void>;
  setRole: (role: UserRole) => void;
  setFlowState: (flowState: AppFlowState) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setPlayerState: (state: PlayerState) => void;
  setTrainingCosts: (costs: { public: number; private: number }) => void;
  saveCoachSchedule: (weeklySchedule: any[], specialDates: any[]) => Promise<void>;
  changePlayerLevel: (playerId: string, tierId: SkillTierId) => Promise<void>;
  createManualPlayer: (data: { name: string; phone?: string; level?: string; checkInToday?: boolean }) => Promise<Player>;
  checkInPlayersToday: (players: Player[]) => Promise<void>;
  toggleSession: () => void;
  toggleHardmode: () => void;
  toggleCourtAvailability: (courtId: string) => void;
  startTraining: () => void;
  sitOut: () => void;
  stopTraining: () => void;
  continueToPlay: () => void;
  sendInvite: (teamA: Player[], teamB: Player[]) => void;
  completeOnboarding: (asRole?: UserRole, selectedTier?: SkillTierId) => void;
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

const emptyProductionUser: Player = {
  id: 'prod-user',
  name: 'Player',
  fullName: 'Player',
  initials: 'P',
  avatarUrl: undefined,
  level: 1,
  xp: 0.0,
  status: 'spectating',
  isHardmode: false,
  gamesPlayed: 0,
  wins: 0,
  bpToday: 0.0,
  bpTotal: 0.0,
  winStreak: 0,
  hasTelegram: true,
};

const stagingDefaultUser: Player = {
  id: 'p-me',
  name: 'Anna',
  fullName: 'Anna P.',
  initials: 'AP',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 12,
  xp: 9062.0,
  status: 'spectating',
  isHardmode: false,
  gamesPlayed: 122,
  wins: 70,
  bpToday: 0.0,
  bpTotal: 867.0,
  winStreak: 4,
  hasTelegram: true,
};

const emptyAchievements: AchievementData[] = MOCK_ACHIEVEMENTS.map((a) => ({
  ...a,
  isEarned: false,
  progress: 0,
  earnedDate: undefined,
}));

export const useAppStore = create<AppState>((set, get) => ({
  isStaging: IS_STAGING,
  role: 'player',
  coachId: null,
  activeSessionId: null,
  flowState: IS_STAGING ? 'onboarding' : 'splash',
  activeTab: 'home',
  previousTab: null,
  playerState: 'spectating',
  isHardmode: false,
  isMatchDetailOpen: false,
  isInviteHost: false,

  bannerStage: 'searching',
  userAccepted: false,
  acceptedCount: 2,
  acceptProgress: 0,
  matchedTeamA: [],
  matchedTeamB: [],

  currentUser: IS_STAGING ? stagingDefaultUser : emptyProductionUser,

  partyPlayers: [],
  partyPlacement: 'any',
  isPartyActive: false,

  // Staging has mock data and active session by default; Production starts completely empty
  courts: IS_STAGING ? joinedCourts : [],
  todaysPlayers: IS_STAGING ? todaysPlayers12 : [],
  allPlayers: IS_STAGING ? MOCK_PLAYERS : [],
  recentMatches: IS_STAGING ? mockMatches : [],
  leaderboard: IS_STAGING ? mockLeaderboard : [],
  achievements: IS_STAGING ? MOCK_ACHIEVEMENTS : emptyAchievements,

  trainingCosts: { public: 4000, private: 10000 },
  weeklySchedule: [],
  specialDates: [],

  isSessionActive: IS_STAGING ? true : false,
  nextScheduledSession: null,
  coachesList: [],
  blacklistedPlayerIds: IS_STAGING ? ['p3', 'p4'] : [],

  savedStates: {
    coach: {
      playerState: 'spectating',
      bannerStage: 'searching',
      userAccepted: false,
      acceptedCount: 2,
      acceptProgress: 0,
      currentUser: {
        id: 'p-me',
        name: 'Alexey',
        fullName: 'Alexey S.',
        initials: 'AS',
        avatarUrl:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        level: 12,
        xp: 9062.0,
        status: 'spectating',
        isHardmode: false,
        gamesPlayed: 122,
        wins: 70,
        bpToday: 0.0,
        bpTotal: 867.0,
        winStreak: 4,
        hasTelegram: true,
      },
    },
  },

  initProductionSession: async () => {
    if (IS_STAGING) return;

    const authResult = await authenticateWithTelegram();
    if (authResult) {
      const isCoach = authResult.role === 'coach';
      const prodData = await fetchProductionState(
        isCoach ? authResult.coachId : undefined,
        !isCoach ? authResult.user.id : undefined
      );

      const mappedAllPlayers: Player[] = (authResult.allPlayers && authResult.allPlayers.length > 0)
        ? authResult.allPlayers
        : prodData.allPlayers;

      set({
        role: authResult.role,
        coachId: authResult.coachId || null,
        currentUser: authResult.user,
        flowState: authResult.onboardingCompleted ? 'app' : 'onboarding',
        trainingCosts: authResult.trainingCosts || { public: 4000, private: 10000 },
        weeklySchedule: authResult.weeklySchedule || [],
        specialDates: authResult.specialDates || [],
        activeSessionId: prodData.activeSessionId,
        isSessionActive: prodData.isSessionActive,
        nextScheduledSession: prodData.nextScheduledSession,
        coachesList: prodData.coachesList,
        courts: prodData.courts,
        todaysPlayers: prodData.todaysPlayers,
        allPlayers: mappedAllPlayers,
        leaderboard: prodData.leaderboard,
        recentMatches: prodData.recentMatches,
        achievements: prodData.achievements,
        blacklistedPlayerIds: prodData.blacklistedPlayerIds,
      });
    } else {
      // Even without Telegram container (e.g. direct browser preview on prod), load live public state
      const prodData = await fetchProductionState();
      set({
        flowState: 'onboarding',
        activeSessionId: prodData.activeSessionId,
        isSessionActive: prodData.isSessionActive,
        nextScheduledSession: prodData.nextScheduledSession,
        coachesList: prodData.coachesList,
        courts: prodData.courts,
        todaysPlayers: prodData.todaysPlayers,
        leaderboard: prodData.leaderboard,
        recentMatches: prodData.recentMatches,
        achievements: prodData.achievements,
      });
    }
  },

  refreshPlayers: async () => {
    if (IS_STAGING) return;
    const players = await fetchAllPlayersFromDb();
    set({ allPlayers: players });
  },

  setRole: (newRole) =>
    set((state) => {
      // Role switching is only permitted in Staging environment
      if (!state.isStaging) return {};
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
        playerState: 'spectating',
        bannerStage: 'searching',
        userAccepted: false,
        acceptedCount: 2,
        acceptProgress: 0,
        currentUser: stagingDefaultUser,
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

  setTrainingCosts: (costs) => {
    set({ trainingCosts: costs });
    const { isStaging, coachId } = get();
    if (!isStaging && coachId) {
      supabase
        .from('coaches')
        .update({
          public_training_cost: costs.public,
          private_training_cost: costs.private,
          updated_at: new Date().toISOString(),
        })
        .eq('id', coachId)
        .then(() => {});
    }
  },

  saveCoachSchedule: async (weeklySchedule, specialDates) => {
    const { isStaging, coachId, coachesList, currentUser } = get();

    let updatedCoaches = [...coachesList];
    if (coachId) {
      const idx = updatedCoaches.findIndex((c: any) => c.id === coachId);
      if (idx >= 0) {
        updatedCoaches[idx] = {
          ...updatedCoaches[idx],
          weekly_schedule: weeklySchedule,
          special_dates: specialDates,
        };
      } else {
        updatedCoaches.push({
          id: coachId,
          name: currentUser.fullName || currentUser.name,
          avatar_url: currentUser.avatarUrl,
          weekly_schedule: weeklySchedule,
          special_dates: specialDates,
        });
      }
    } else {
      updatedCoaches = [
        {
          id: currentUser.id,
          name: currentUser.fullName || currentUser.name,
          avatar_url: currentUser.avatarUrl,
          weekly_schedule: weeklySchedule,
          special_dates: specialDates,
        },
      ];
    }

    const nextScheduledSession = findNextScheduledSession(updatedCoaches);

    set({
      weeklySchedule,
      specialDates,
      coachesList: updatedCoaches,
      nextScheduledSession,
    });

    if (!isStaging && coachId) {
      await supabase
        .from('coaches')
        .update({
          weekly_schedule: weeklySchedule,
          special_dates: specialDates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', coachId);
    }
  },

  changePlayerLevel: async (playerId, tierId) => {
    set((state) => {
      const updateList = (list: Player[]) =>
        list.map((p) => (p.id === playerId ? applyCoachTierOverride(p, tierId) : p));

      const updatedUser =
        state.currentUser.id === playerId
          ? applyCoachTierOverride(state.currentUser, tierId)
          : state.currentUser;

      return {
        currentUser: updatedUser,
        todaysPlayers: updateList(state.todaysPlayers),
        allPlayers: updateList(state.allPlayers),
        leaderboard: state.leaderboard.map((entry) =>
          entry.player.id === playerId
            ? { ...entry, player: applyCoachTierOverride(entry.player, tierId) }
            : entry
        ),
      };
    });

    if (!IS_STAGING) {
      await updatePlayerTierByCoachInDb(playerId, tierId);
    }
  },

  createManualPlayer: async ({ name, phone, level = 'Beginner', checkInToday = false }) => {
    const tierId = (level.toLowerCase() as SkillTierId) || 'beginner';
    const { level: numLevel, xp } = getMinimumXpForTier(tierId);
    const state = get();

    let newPlayer: Player = {
      id: `manual-${Date.now()}`,
      name: formatShortName(name),
      fullName: name,
      initials: getInitialsFromName(name),
      level: numLevel,
      xp,
      status: 'spectating',
      hasTelegram: false,
      gamesPlayed: 0,
      wins: 0,
      bpToday: 0,
      bpTotal: 0,
      winStreak: 0,
    };

    if (!state.isStaging) {
      const { data: inserted } = await supabase
        .from('players')
        .insert({
          name,
          phone: phone || null,
          level: numLevel,
          xp,
          bp_total: 0,
          bp_today: 0,
          status: 'spectating',
          has_telegram: false,
          is_guest: !phone,
          created_by_coach_id: state.coachId,
          onboarding_completed: true,
        })
        .select('*')
        .single();

      if (inserted) {
        newPlayer = {
          ...newPlayer,
          id: inserted.id,
        };
        if (state.coachId) {
          await supabase.from('coach_players').upsert(
            {
              coach_id: state.coachId,
              player_id: inserted.id,
            },
            { onConflict: 'coach_id,player_id' }
          );
        }
        if (checkInToday && state.activeSessionId && state.coachId) {
          await supabase.from('session_attendances').upsert(
            {
              session_id: state.activeSessionId,
              coach_id: state.coachId,
              player_id: inserted.id,
              is_active: true,
            },
            { onConflict: 'session_id,player_id' }
          );
          await supabase.from('billing_transactions').insert({
            coach_id: state.coachId,
            player_id: inserted.id,
            session_type: 'public',
            amount: state.trainingCosts.public,
            status: 'unpaid',
            session_date: new Date().toISOString().split('T')[0],
          });
        }
      }
    }

    set((s) => ({
      allPlayers: [newPlayer, ...s.allPlayers],
      todaysPlayers: checkInToday ? [...s.todaysPlayers, newPlayer] : s.todaysPlayers,
    }));

    return newPlayer;
  },

  checkInPlayersToday: async (players) => {
    const state = get();
    set((s) => {
      const existingIds = new Set(s.todaysPlayers.map((p) => p.id));
      const added = players.filter((p) => !existingIds.has(p.id));
      return {
        todaysPlayers: [...s.todaysPlayers, ...added],
      };
    });

    if (!state.isStaging && state.activeSessionId && state.coachId) {
      for (const p of players) {
        await supabase.from('session_attendances').upsert(
          {
            session_id: state.activeSessionId,
            coach_id: state.coachId,
            player_id: p.id,
            is_active: true,
          },
          { onConflict: 'session_id,player_id' }
        );
        await supabase.from('billing_transactions').insert({
          coach_id: state.coachId,
          player_id: p.id,
          session_type: 'public',
          amount: state.trainingCosts.public,
          status: 'unpaid',
          session_date: new Date().toISOString().split('T')[0],
        });
      }
    }
  },

  toggleSession: () => {
    const state = get();
    const nextSession = !state.isSessionActive;

    if (state.isStaging) {
      set({
        isSessionActive: nextSession,
        courts: nextSession ? joinedCourts : initialCourts,
        todaysPlayers: nextSession ? todaysPlayers12 : [],
      });
      return;
    }

    // Production: create or end training_session in Supabase for this coach
    const nextCourts = nextSession ? initialCourts : [];
    set({
      isSessionActive: nextSession,
      courts: nextCourts,
      todaysPlayers: nextSession ? state.todaysPlayers : [],
    });

    if (state.coachId) {
      if (nextSession) {
        supabase
          .from('training_sessions')
          .insert({
            coach_id: state.coachId,
            status: 'active',
            started_at: new Date().toISOString(),
            courts: initialCourts,
          })
          .select('*')
          .single()
          .then(({ data }) => {
            if (data) set({ activeSessionId: data.id });
          });
      } else if (state.activeSessionId) {
        supabase
          .from('training_sessions')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString(),
          })
          .eq('id', state.activeSessionId)
          .then(() => {
            set({ activeSessionId: null });
          });
      }
    }
  },

  toggleHardmode: () =>
    set((state) => {
      const nextHard = !state.isHardmode;
      const candidatePool =
        state.todaysPlayers.length >= 4 ? state.todaysPlayers : state.allPlayers;
      const mm = buildMatchmakingTeams({
        anchorPlayer: state.currentUser,
        candidatePool,
        isHardmode: nextHard,
        blacklistedIds: state.blacklistedPlayerIds,
        partyPlayers: state.isPartyActive ? state.partyPlayers : [],
        partyPlacement: state.partyPlacement,
      });

      if (!state.isStaging && state.currentUser.id !== 'prod-user') {
        supabase
          .from('players')
          .update({ is_hardmode: nextHard, updated_at: new Date().toISOString() })
          .eq('id', state.currentUser.id)
          .then(() => {});
      }

      return {
        isHardmode: nextHard,
        currentUser: { ...state.currentUser, isHardmode: nextHard },
        matchedTeamA: mm ? mm.teamA : state.matchedTeamA,
        matchedTeamB: mm ? mm.teamB : state.matchedTeamB,
      };
    }),

  toggleCourtAvailability: (courtId: string) =>
    set((state) => {
      const nextCourts = state.courts.map((court) =>
        court.id === courtId
          ? {
              ...court,
              isAvailable: !court.isAvailable,
              statusText: !court.isAvailable ? 'Matching...' : 'Reserved',
            }
          : court
      );

      if (!state.isStaging && state.activeSessionId) {
        supabase
          .from('training_sessions')
          .update({ courts: nextCourts })
          .eq('id', state.activeSessionId)
          .then(() => {});
      }

      return { courts: nextCourts };
    }),

  startTraining: () =>
    set((state) => {
      const candidatePool =
        state.todaysPlayers.length >= 4
          ? state.todaysPlayers
          : state.isStaging
          ? todaysPlayers12
          : state.allPlayers;

      const mm = buildMatchmakingTeams({
        anchorPlayer: state.currentUser,
        candidatePool,
        isHardmode: state.isHardmode,
        blacklistedIds: state.blacklistedPlayerIds,
        partyPlayers: state.isPartyActive ? state.partyPlayers : [],
        partyPlacement: state.partyPlacement,
      });

      if (!state.isStaging && state.currentUser.id !== 'prod-user') {
        supabase
          .from('players')
          .update({ status: 'queued', updated_at: new Date().toISOString() })
          .eq('id', state.currentUser.id)
          .then(() => {});
      }

      return {
        isSessionActive: true,
        playerState: 'queued',
        currentUser: { ...state.currentUser, status: 'queued' },
        courts: state.isStaging ? joinedCourts : state.courts.length > 0 ? state.courts : initialCourts,
        todaysPlayers: state.isStaging ? todaysPlayers12 : state.todaysPlayers,
        matchedTeamA: mm ? mm.teamA : [],
        matchedTeamB: mm ? mm.teamB : [],
      };
    }),

  sitOut: () =>
    set((state) => ({
      playerState: 'resting',
      currentUser: { ...state.currentUser, status: 'resting' },
    })),

  stopTraining: () =>
    set((state) => ({
      playerState: 'spectating',
      isInviteHost: false,
      currentUser: { ...state.currentUser, status: 'spectating' },
    })),

  invitedPlayers: [],
  inviteTeamA: [],
  inviteTeamB: [],

  continueToPlay: () =>
    set((state) => ({
      playerState: 'queued',
      currentUser: { ...state.currentUser, status: 'queued' },
    })),

  sendInvite: (teamA: Player[], teamB: Player[]) =>
    set((state) => {
      const allInvited = [...teamA.filter((p) => p.id !== state.currentUser.id), ...teamB];

      return {
        invitedPlayers: allInvited,
        inviteTeamA: teamA,
        inviteTeamB: teamB,
        playerState: 'queued',
        isInviteHost: true,
        currentUser: { ...state.currentUser, status: 'queued' },
      };
    }),

  completeOnboarding: (asRole = 'player', selectedTier: SkillTierId = 'beginner') => {
    const state = get();
    if (state.isStaging) {
      set({
        role: asRole,
        flowState: 'app',
        activeTab: 'home',
      });
      return;
    }

    const { level, xp } = getMinimumXpForTier(selectedTier);
    const updatedUser: Player = {
      ...state.currentUser,
      level,
      xp,
    };

    set({
      role: asRole,
      currentUser: updatedUser,
      flowState: 'app',
      activeTab: 'home',
    });

    if (state.currentUser.id && state.currentUser.id !== 'prod-user') {
      saveOnboardingSkillTier(state.currentUser.id, selectedTier);
    }
  },

  finishMatch: (scoreA: number, scoreB: number) => {
    const state = get();
    const teamAPlayers =
      state.inviteTeamA.length > 0
        ? state.inviteTeamA
        : state.matchedTeamA.length > 0
        ? state.matchedTeamA
        : [
            state.currentUser,
            ...(state.todaysPlayers.filter((p) => p.id !== state.currentUser.id).slice(0, 1)),
          ];

    const teamBPlayers =
      state.inviteTeamB.length > 0
        ? state.inviteTeamB
        : state.matchedTeamB.length > 0
        ? state.matchedTeamB
        : state.todaysPlayers
            .filter((p) => !teamAPlayers.some((a) => a.id === p.id))
            .slice(0, 2);

    // Calculate realistic ELO-based XP (can decrease on loss!) & strictly additive BP
    const reward = calculatePlayerMatchReward({
      player: state.currentUser,
      teammates: teamAPlayers,
      opponents: teamBPlayers,
      teamScore: scoreA,
      opponentScore: scoreB,
      isHardmode: state.isHardmode,
    });

    const isWin = reward.isWin;
    const newGamesPlayed = state.currentUser.gamesPlayed + 1;
    const newWins = isWin ? state.currentUser.wins + 1 : state.currentUser.wins;
    const newWinStreak = isWin ? state.currentUser.winStreak + 1 : 0;
    const newBpToday = Number((state.currentUser.bpToday + reward.bpGained).toFixed(1));
    const newBpTotal = Number(((state.currentUser.bpTotal ?? 0) + reward.bpGained).toFixed(1));

    const newMatch: Match = {
      id: `m-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      courtName: '#2',
      isHardmode: state.isHardmode,
      teamA: teamAPlayers.map((p) => ({ name: p.name, avatarUrl: p.avatarUrl })),
      teamB: teamBPlayers.map((p) => ({ name: p.name, avatarUrl: p.avatarUrl })),
      scoreA,
      scoreB,
      isWin,
      xpGained: reward.xpDelta,
      bpGained: reward.bpGained,
    };

    const nextPlayerState: PlayerState =
      state.invitedPlayers.length > 0 ? 'match_found' : 'queued';

    const updatedUser: Player = {
      ...state.currentUser,
      status: nextPlayerState === 'match_found' ? 'queued' : nextPlayerState,
      level: reward.newLevel,
      xp: reward.newXp,
      gamesPlayed: newGamesPlayed,
      wins: newWins,
      bpToday: newBpToday,
      bpTotal: newBpTotal,
      winStreak: newWinStreak,
    };

    // Update Leaderboard sorted by BP (strictly additive)
    const existingIdx = state.leaderboard.findIndex((e) => e.player.id === updatedUser.id);
    let nextLeaderboard = [...state.leaderboard];
    const winRate = Number(((newWins / Math.max(1, newGamesPlayed)) * 100).toFixed(1));
    if (existingIdx >= 0) {
      nextLeaderboard[existingIdx] = {
        ...nextLeaderboard[existingIdx],
        player: updatedUser,
        wins: newWins,
        winRate,
        xp: newBpTotal,
      };
    } else if (newBpTotal > 0) {
      nextLeaderboard.push({
        rank: nextLeaderboard.length + 1,
        player: updatedUser,
        wins: newWins,
        winRate,
        xp: newBpTotal,
      });
    }
    nextLeaderboard = nextLeaderboard
      .sort((a, b) => b.xp - a.xp)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    set({
      playerState: nextPlayerState,
      bannerStage: nextPlayerState === 'queued' ? 'searching' : state.bannerStage,
      currentUser: updatedUser,
      recentMatches: [newMatch, ...state.recentMatches],
      leaderboard: nextLeaderboard,
      isMatchDetailOpen: false,
    });

    // Persist to Supabase in Production
    if (!state.isStaging && state.currentUser.id !== 'prod-user') {
      const userId = state.currentUser.id;
      supabase
        .from('players')
        .update({
          level: reward.newLevel,
          xp: reward.newXp,
          bp_today: newBpToday,
          bp_total: newBpTotal,
          games_played: newGamesPlayed,
          wins: newWins,
          win_streak: newWinStreak,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .then(() => {});

      supabase
        .from('matches')
        .insert({
          session_id: state.activeSessionId,
          coach_id: state.coachId,
          court_name: '#2',
          is_hardmode: state.isHardmode,
          team_a_ids: teamAPlayers.map((p) => p.id).filter((id) => id.length === 36),
          team_b_ids: teamBPlayers.map((p) => p.id).filter((id) => id.length === 36),
          team_a_snapshot: newMatch.teamA,
          team_b_snapshot: newMatch.teamB,
          score_a: scoreA,
          score_b: scoreB,
          winner_team: scoreA > scoreB ? 'A' : 'B',
          xp_deltas: { [userId]: reward.xpDelta },
          bp_deltas: { [userId]: reward.bpGained },
          played_date: new Date().toISOString().split('T')[0],
          played_time: newMatch.time,
        })
        .then(() => {});

      const matchesTodayCount =
        state.recentMatches.filter((m) => m.date === 'Today').length + 1;
      const hardmodeWinsCount =
        state.recentMatches.filter((m) => m.isHardmode && m.isWin).length +
        (state.isHardmode && isWin ? 1 : 0);

      evaluateAndSyncAchievements({
        playerId: userId,
        gamesPlayed: newGamesPlayed,
        matchesToday: matchesTodayCount,
        hardmodeWins: hardmodeWinsCount,
        winStreak: newWinStreak,
        partyMatchesPlayed: state.isPartyActive ? 1 : 0,
        sessionsAttended: 1,
      });
    }
  },

  setMatchDetailOpen: (open: boolean) => set({ isMatchDetailOpen: open }),

  toggleBlacklist: (playerId) =>
    set((state) => {
      const isBlacklisted = state.blacklistedPlayerIds.includes(playerId);
      const nextList = isBlacklisted
        ? state.blacklistedPlayerIds.filter((id) => id !== playerId)
        : [...state.blacklistedPlayerIds, playerId];

      if (!state.isStaging && state.currentUser.id !== 'prod-user') {
        if (isBlacklisted) {
          supabase
            .from('player_blacklist')
            .delete()
            .eq('player_id', state.currentUser.id)
            .eq('blocked_player_id', playerId)
            .then(() => {});
        } else {
          supabase
            .from('player_blacklist')
            .insert({
              player_id: state.currentUser.id,
              blocked_player_id: playerId,
            })
            .then(() => {});
        }
      }

      return { blacklistedPlayerIds: nextList };
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
