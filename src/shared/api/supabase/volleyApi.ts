import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './client';
import { Player, Court, Match, LeaderboardEntry, UserRole, AchievementData, NextScheduledSession } from '../../types/index';
import { initialCourts } from '../mock/mockCourts';
import { MOCK_ACHIEVEMENTS } from '../mock/achievements';
import { SkillTierId, getMinimumXpForTier } from '../../lib/rating-algorithm';
import { formatShortName, getInitialsFromName } from '../../lib/formatName';
import { retrieveLaunchParams } from '@tma.js/sdk';

export interface TelegramUserPayload {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface AuthSessionResult {
  role: UserRole;
  coachId?: string;
  user: Player;
  allPlayers?: Player[];
  onboardingCompleted: boolean;
  trainingCosts?: { public: number; private: number };
  weeklySchedule?: any[];
  specialDates?: any[];
}

export function extractTelegramContext(): { initDataRaw: string; user: TelegramUserPayload | null } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user as TelegramUserPayload;
      try {
        localStorage.setItem('volley_tg_user_cache', JSON.stringify(u));
      } catch {
        // ignore
      }
      return {
        initDataRaw: tg.initData || '',
        user: u,
      };
    }
  } catch {
    // ignore
  }

  try {
    const launchParams = retrieveLaunchParams();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (launchParams as any)?.initDataRaw || '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tgUser = (launchParams.initData as any)?.user || null;
    if (tgUser) {
      try {
        localStorage.setItem('volley_tg_user_cache', JSON.stringify(tgUser));
      } catch {
        // ignore
      }
      return { initDataRaw: raw, user: tgUser };
    }
  } catch {
    // Not inside Telegram WebApp container
  }

  // Fallback: check URL hash/search for tgWebAppData
  try {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(window.location.search);
    const tgWebAppData = hashParams.get('tgWebAppData') || searchParams.get('tgWebAppData');
    if (tgWebAppData) {
      const innerParams = new URLSearchParams(tgWebAppData);
      const userJson = innerParams.get('user');
      if (userJson) {
        return {
          initDataRaw: tgWebAppData,
          user: JSON.parse(userJson) as TelegramUserPayload,
        };
      }
    }
  } catch {
    // ignore
  }

  try {
    const cached = localStorage.getItem('volley_tg_user_cache');
    if (cached) {
      return { initDataRaw: '', user: JSON.parse(cached) as TelegramUserPayload };
    }
  } catch {
    // ignore
  }

  return { initDataRaw: '', user: null };
}

export function mapDbPlayerToClient(row: any): Player {
  const rawName = row.name || 'Player';
  const gamesPlayed = Number(row.games_played ?? 0);
  return {
    id: row.id,
    name: formatShortName(rawName),
    fullName: rawName,
    initials: getInitialsFromName(rawName),
    telegramUsername: row.telegram_username || undefined,
    telegramId: row.telegram_id ? Number(row.telegram_id) : undefined,
    avatarUrl: row.avatar_url || undefined,
    level: Number(row.level ?? 1),
    xp: Number(row.xp ?? 0),
    bpToday: Number(row.bp_today ?? 0),
    bpTotal: Number(row.bp_total ?? 0),
    status: row.status || 'spectating',
    isHardmode: Boolean(row.is_hardmode),
    hasTelegram: Boolean(row.has_telegram),
    hasAttendedTraining: gamesPlayed > 0 || Boolean(row.has_private_session),
    gamesPlayed,
    wins: Number(row.wins ?? 0),
    winStreak: Number(row.win_streak ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapDbCoachToPlayer(coach: any): Player {
  const rawCoachName = coach.name || 'Coach';
  return {
    id: coach.id,
    name: formatShortName(rawCoachName),
    fullName: rawCoachName,
    initials: getInitialsFromName(rawCoachName),
    telegramUsername: coach.telegram_username || undefined,
    telegramId: coach.telegram_id ? Number(coach.telegram_id) : undefined,
    avatarUrl: coach.avatar_url || undefined,
    level: 30,
    xp: 18000,
    status: 'spectating',
    isCoach: true,
    hasTelegram: true,
    gamesPlayed: 0,
    wins: 0,
    bpToday: 0,
    winStreak: 0,
  };
}

/**
 * Authenticates the current user via Telegram WebApp SDK against the `telegram-auth` Edge Function.
 * Coaches are stored in `public.coaches`; Players are stored in `public.players`.
 * Sets the signed Supabase Auth JWT session so all subsequent queries run as `authenticated`.
 */
export function getCachedAuthSession(): AuthSessionResult | null {
  try {
    const { user } = extractTelegramContext();
    if (!user?.id) return null;
    const raw = localStorage.getItem(`volley_auth_cache_${user.id}`);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSessionResult;
  } catch {
    return null;
  }
}

export async function authenticateWithTelegram(): Promise<AuthSessionResult | null> {
  const { initDataRaw, user } = extractTelegramContext();
  if (!user) {
    return null;
  }

  try {
    let skipSession = false;
    try {
      const { data: sessData } = await supabase.auth.getSession();
      const existingTgId = sessData?.session?.user?.app_metadata?.telegram_id;
      if (sessData?.session && Number(existingTgId) === Number(user.id)) {
        skipSession = true;
      }
    } catch {
      // ignore
    }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/telegram-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        initData: initDataRaw,
        fallbackUser: user,
        skipSession,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      if (data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      let result: AuthSessionResult | null = null;

      if (data.role === 'coach' && data.coach) {
        const coach = data.coach;
        const allPlayers = Array.isArray(data.allPlayers)
          ? data.allPlayers.map((row: any) => mapDbPlayerToClient(row))
          : undefined;
        result = {
          role: 'coach',
          coachId: coach.id,
          onboardingCompleted: true,
          allPlayers,
          trainingCosts: {
            public: Number(coach.public_training_cost ?? 4000),
            private: Number(coach.private_training_cost ?? 10000),
          },
          weeklySchedule: Array.isArray(coach.weekly_schedule) ? coach.weekly_schedule : [],
          specialDates: Array.isArray(coach.special_dates) ? coach.special_dates : [],
          user: mapDbCoachToPlayer(coach),
        };
      } else if (data.role === 'player' && data.player) {
        result = {
          role: 'player',
          onboardingCompleted: Boolean(data.player.onboarding_completed),
          user: mapDbPlayerToClient(data.player),
        };
      }

      if (result) {
        try {
          const toCache: AuthSessionResult = { ...result, allPlayers: undefined };
          localStorage.setItem(`volley_auth_cache_${user.id}`, JSON.stringify(toCache));
        } catch {
          // ignore
        }
        return result;
      }
    }
  } catch (err) {
    console.warn('Edge function auth fallback:', err);
  }

  return null;
}

/**
 * Finds the nearest upcoming public session across all coaches' weekly schedules and special dates.
 */
export function findNextScheduledSession(coachesList: any[], now = new Date()): NextScheduledSession | null {
  if (!Array.isArray(coachesList) || coachesList.length === 0) return null;

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const cutoffTime = now.getTime() - 2 * 60 * 60 * 1000;

  const candidates: (NextScheduledSession & { timestamp: number })[] = [];

  const toIsoDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  for (const c of coachesList) {
    const coachPlayer = mapDbCoachToPlayer(c);
    const weeklySchedule = Array.isArray(c.weekly_schedule) ? c.weekly_schedule : [];
    const specialDates = Array.isArray(c.special_dates) ? c.special_dates : [];

    // 1. Check special dates
    for (const sp of specialDates) {
      if (sp?.date && sp?.time) {
        const [y, mo, d] = String(sp.date).split('-').map(Number);
        const [h, m] = String(sp.time).split(':').map(Number);
        if (isNaN(y) || isNaN(h)) continue;
        const slotDate = new Date(y, (mo || 1) - 1, d || 1, h, m || 0, 0);
        if (slotDate.getTime() >= cutoffTime) {
          const slotMidnight = new Date(y, (mo || 1) - 1, d || 1).getTime();
          const dayOffset = Math.round((slotMidnight - todayMidnight) / (24 * 60 * 60 * 1000));
          const dayId = dayNames[slotDate.getDay()];
          candidates.push({
            timestamp: slotDate.getTime(),
            dayOffset,
            dayId,
            dateIso: sp.date,
            time: sp.time,
            coach: coachPlayer,
          });
        }
      }
    }

    // 2. Check weekly schedule over the next 7 days (0..7)
    for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
      const dayId = dayNames[targetDate.getDay()];
      const dayEntry = weeklySchedule.find((entry: any) => entry.id === dayId && entry.enabled);
      if (dayEntry && Array.isArray(dayEntry.slots)) {
        for (const slot of dayEntry.slots) {
          const [h, m] = String(slot).split(':').map(Number);
          if (isNaN(h)) continue;
          const slotDate = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            targetDate.getDate(),
            h,
            m || 0,
            0
          );
          if (slotDate.getTime() >= cutoffTime) {
            candidates.push({
              timestamp: slotDate.getTime(),
              dayOffset,
              dayId,
              dateIso: toIsoDate(targetDate),
              time: slot,
              coach: coachPlayer,
            });
          }
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.timestamp - b.timestamp);
  const nearest = candidates[0];
  return {
    dayOffset: nearest.dayOffset,
    dayId: nearest.dayId,
    dateIso: nearest.dateIso,
    time: nearest.time,
    coach: nearest.coach,
  };
}

/**
 * Fetches all players and marks `hasAttendedTraining = true` strictly if the player
 * has attended a public training (`games_played > 0`) OR a private training (`private_sessions`).
 */
export async function fetchAllPlayersFromDb(): Promise<Player[]> {
  const PUBLIC_PLAYER_COLS =
    'id, name, avatar_url, telegram_username, telegram_id, level, xp, bp_total, bp_today, status, is_hardmode, has_telegram, games_played, wins, win_streak, created_at, updated_at';

  const [{ data: rows }, { data: privRows }] = await Promise.all([
    supabase
      .from('players')
      .select(PUBLIC_PLAYER_COLS)
      .order('created_at', { ascending: false }),
    supabase
      .from('private_sessions')
      .select('player_id')
      .neq('status', 'cancelled'),
  ]);

  const privatePlayerIds = new Set(
    (privRows || []).map((r: any) => r.player_id).filter(Boolean)
  );

  return (rows || []).map((row: any) => {
    const p = mapDbPlayerToClient(row);
    return {
      ...p,
      hasAttendedTraining: p.gamesPlayed > 0 || privatePlayerIds.has(p.id),
    };
  });
}

export async function fetchProductionState(coachId?: string, playerId?: string) {
  const PUBLIC_PLAYER_COLS =
    'id, name, avatar_url, telegram_username, telegram_id, level, xp, bp_total, bp_today, status, is_hardmode, has_telegram, games_played, wins, win_streak, created_at, updated_at';

  // 1. Fetch active training session, coaches, and all players in parallel
  let sessionQuery = supabase
    .from('training_sessions')
    .select('*')
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1);

  if (coachId) {
    sessionQuery = sessionQuery.eq('coach_id', coachId);
  }

  const [{ data: activeSessions }, { data: coachesList }, allPlayers] = await Promise.all([
    sessionQuery,
    supabase.from('coaches').select('id, name, avatar_url, telegram_username, telegram_id, weekly_schedule, special_dates'),
    fetchAllPlayersFromDb(),
  ]);

  const activeSession = activeSessions?.[0] || null;
  const isSessionActive = Boolean(activeSession);
  const nextScheduledSession = findNextScheduledSession(coachesList || []);

  const courts: Court[] =
    activeSession && Array.isArray(activeSession.courts) && activeSession.courts.length > 0
      ? activeSession.courts
      : isSessionActive
      ? initialCourts
      : [];

  // 2. Fetch today's checked-in players for the active session
  let todaysPlayers: Player[] = [];
  if (activeSession) {
    const { data: attendances } = await supabase
      .from('session_attendances')
      .select(`player_id, players(${PUBLIC_PLAYER_COLS})`)
      .eq('session_id', activeSession.id)
      .eq('is_active', true);

    if (attendances) {
      todaysPlayers = attendances
        .map((a: any) => (a.players ? mapDbPlayerToClient(a.players) : null))
        .filter(Boolean) as Player[];
    }
  }

  // 3. Leaderboard sorted strictly by BP (bp_total DESC)
  const leaderboard: LeaderboardEntry[] = allPlayers
    .filter((p) => (p.bpTotal ?? 0) > 0)
    .sort((a, b) => (b.bpTotal ?? 0) - (a.bpTotal ?? 0))
    .slice(0, 50)
    .map((p, idx) => {
      const winRate = p.gamesPlayed > 0 ? Number(((p.wins / p.gamesPlayed) * 100).toFixed(1)) : 0;
      return {
        rank: idx + 1,
        player: p,
        wins: p.wins,
        winRate,
        xp: Number(p.bpTotal ?? 0),
      };
    });

  // 4. Fetch Recent Matches
  let matchesQuery = supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (coachId) {
    matchesQuery = matchesQuery.eq('coach_id', coachId);
  }

  const { data: matchRows } = await matchesQuery;
  const recentMatches: Match[] = (matchRows || []).map((m: any) => {
    const userXpDelta = playerId && m.xp_deltas ? Number(m.xp_deltas[playerId] ?? 0) : 0;
    const userBpDelta = playerId && m.bp_deltas ? Number(m.bp_deltas[playerId] ?? 0) : 0;
    const isTeamA = Array.isArray(m.team_a_ids) && playerId ? m.team_a_ids.includes(playerId) : true;
    const isWin = isTeamA ? m.score_a > m.score_b : m.score_b > m.score_a;

    return {
      id: m.id,
      date: m.played_date || 'Today',
      time: m.played_time || '12:00',
      courtName: m.court_name || '#1',
      isHardmode: Boolean(m.is_hardmode),
      teamA: Array.isArray(m.team_a_snapshot) ? m.team_a_snapshot : [],
      teamB: Array.isArray(m.team_b_snapshot) ? m.team_b_snapshot : [],
      scoreA: Number(m.score_a ?? 0),
      scoreB: Number(m.score_b ?? 0),
      isWin,
      xpGained: userXpDelta,
      bpGained: userBpDelta,
    };
  });

  // 5. Fetch Player Achievements & Blacklist
  let achievements: AchievementData[] = MOCK_ACHIEVEMENTS.map((a) => ({
    ...a,
    isEarned: false,
    progress: 0,
    earnedDate: undefined,
  }));
  let blacklistedPlayerIds: string[] = [];

  if (playerId) {
    const [{ data: playerAch }, { data: blacklistRows }] = await Promise.all([
      supabase.from('player_achievements').select('*').eq('player_id', playerId),
      supabase.from('player_blacklist').select('blocked_player_id').eq('player_id', playerId),
    ]);

    if (playerAch && playerAch.length > 0) {
      const achMap = new Map(playerAch.map((row: any) => [row.achievement_id, row]));
      achievements = achievements.map((item) => {
        const record = achMap.get(item.id);
        if (!record) return item;
        return {
          ...item,
          isEarned: Boolean(record.is_earned),
          progress: Number(record.progress ?? 0),
          earnedDate: record.earned_at
            ? new Date(record.earned_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : undefined,
        };
      });
    }

    if (blacklistRows) {
      blacklistedPlayerIds = blacklistRows.map((r: any) => r.blocked_player_id);
    }
  }

  return {
    activeSessionId: activeSession?.id || null,
    isSessionActive,
    nextScheduledSession,
    coachesList: coachesList || [],
    allPlayers,
    courts,
    todaysPlayers,
    leaderboard,
    recentMatches,
    achievements,
    blacklistedPlayerIds,
  };
}

export async function saveOnboardingSkillTier(playerId: string, tierId: SkillTierId) {
  const { level, xp } = getMinimumXpForTier(tierId);
  try {
    localStorage.setItem('volley_onboarding_done', 'true');
  } catch {
    // ignore
  }
  await Promise.allSettled([
    fetch(`${SUPABASE_URL}/functions/v1/telegram-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        action: 'complete_onboarding',
        playerId,
        level,
        xp,
      }),
    }),
    supabase
      .from('players')
      .update({
        level,
        xp,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', playerId),
  ]);
}

/**
 * Coach changes a player's skill tier:
 * Resets XP to the minimum of that tier, while keeping BP and achievement progress intact.
 */
export async function updatePlayerTierByCoachInDb(playerId: string, tierId: SkillTierId) {
  const { level, xp } = getMinimumXpForTier(tierId);
  await supabase
    .from('players')
    .update({
      level,
      xp,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId);
}

/**
 * Evaluates and updates player achievements in `public.player_achievements`.
 */
export async function evaluateAndSyncAchievements(params: {
  playerId: string;
  gamesPlayed: number;
  matchesToday: number;
  hardmodeWins: number;
  winStreak: number;
  partyMatchesPlayed: number;
  sessionsAttended: number;
}) {
  const {
    playerId,
    gamesPlayed,
    matchesToday,
    hardmodeWins,
    winStreak,
    partyMatchesPlayed,
    sessionsAttended,
  } = params;

  const checks: { id: string; progress: number; max: number }[] = [
    { id: 'ach-1', progress: gamesPlayed > 0 ? Math.min(1, Math.max(1, sessionsAttended)) : 0, max: 1 },
    { id: 'ach-2', progress: Math.min(15, matchesToday), max: 15 },
    { id: 'ach-3', progress: Math.min(1, hardmodeWins), max: 1 },
    { id: 'ach-4', progress: Math.min(25, hardmodeWins), max: 25 },
    { id: 'ach-6', progress: Math.min(50, partyMatchesPlayed), max: 50 },
    { id: 'ach-7', progress: Math.min(10, winStreak), max: 10 },
  ];

  const nowIso = new Date().toISOString();

  for (const c of checks) {
    const isEarned = c.progress >= c.max;
    await supabase.from('player_achievements').upsert(
      {
        player_id: playerId,
        achievement_id: c.id,
        progress: c.progress,
        is_earned: isEarned,
        earned_at: isEarned ? nowIso : null,
        updated_at: nowIso,
      },
      { onConflict: 'player_id,achievement_id' }
    );
  }
}
