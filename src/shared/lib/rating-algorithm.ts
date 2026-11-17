import { Player } from '../types/index';

export type SkillTierId = 'beginner' | 'amateur' | 'advanced' | 'pro';

export interface TierThreshold {
  id: SkillTierId;
  name: string;
  minLevel: number;
  maxLevel: number;
  minXp: number;
  maxXp: number;
  xpPerLevel: number;
}

/**
 * Realistic progression curve for physical badminton sessions.
 * Assuming ~25-35 XP per win and -10 to -20 XP per loss:
 * - Beginner (Lv 1-9): 0 - 2,999 XP (~333 XP / level)
 * - Amateur (Lv 10-19): 3,000 - 8,999 XP (600 XP / level)
 * - Advanced (Lv 20-29): 9,000 - 17,999 XP (900 XP / level)
 * - Pro (Lv 30-40): 18,000 - 30,000+ XP (1,200 XP / level)
 */
export const TIER_THRESHOLDS: Record<SkillTierId, TierThreshold> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    minLevel: 1,
    maxLevel: 9,
    minXp: 0,
    maxXp: 3000,
    xpPerLevel: 333,
  },
  amateur: {
    id: 'amateur',
    name: 'Amateur',
    minLevel: 10,
    maxLevel: 19,
    minXp: 3000,
    maxXp: 9000,
    xpPerLevel: 600,
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced',
    minLevel: 20,
    maxLevel: 29,
    minXp: 9000,
    maxXp: 18000,
    xpPerLevel: 900,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    minLevel: 30,
    maxLevel: 40,
    minXp: 18000,
    maxXp: 30000,
    xpPerLevel: 1200,
  },
};

export function getTierByLevel(level: number): TierThreshold {
  if (level < 10) return TIER_THRESHOLDS.beginner;
  if (level < 20) return TIER_THRESHOLDS.amateur;
  if (level < 30) return TIER_THRESHOLDS.advanced;
  return TIER_THRESHOLDS.pro;
}

export function calculateLevelFromXp(xp: number): number {
  const safeXp = Math.max(0, xp);
  if (safeXp < TIER_THRESHOLDS.amateur.minXp) {
    const lvl = 1 + Math.floor(safeXp / TIER_THRESHOLDS.beginner.xpPerLevel);
    return Math.min(9, Math.max(1, lvl));
  }
  if (safeXp < TIER_THRESHOLDS.advanced.minXp) {
    const delta = safeXp - TIER_THRESHOLDS.amateur.minXp;
    const lvl = 10 + Math.floor(delta / TIER_THRESHOLDS.amateur.xpPerLevel);
    return Math.min(19, Math.max(10, lvl));
  }
  if (safeXp < TIER_THRESHOLDS.pro.minXp) {
    const delta = safeXp - TIER_THRESHOLDS.advanced.minXp;
    const lvl = 20 + Math.floor(delta / TIER_THRESHOLDS.advanced.xpPerLevel);
    return Math.min(29, Math.max(20, lvl));
  }
  const delta = safeXp - TIER_THRESHOLDS.pro.minXp;
  const lvl = 30 + Math.floor(delta / TIER_THRESHOLDS.pro.xpPerLevel);
  return Math.min(40, Math.max(30, lvl));
}

export function getMinimumXpForTier(tierId: SkillTierId): { level: number; xp: number } {
  const tier = TIER_THRESHOLDS[tierId] || TIER_THRESHOLDS.beginner;
  return {
    level: tier.minLevel,
    xp: tier.minXp,
  };
}

/**
 * When a coach manually changes a player's skill tier:
 * - XP is reset to the minimum XP of that tier.
 * - Level is set to the minimum level of that tier.
 * - BP (bpToday, total BP) and achievement statistics (gamesPlayed, wins, winStreak) are preserved!
 */
export function applyCoachTierOverride(player: Player, tierId: SkillTierId): Player {
  const { level, xp } = getMinimumXpForTier(tierId);
  return {
    ...player,
    level,
    xp,
  };
}

export interface MatchRewardResult {
  xpDelta: number; // Positive on win, negative on loss
  bpGained: number; // Always >= 0 (never subtracted)
  newXp: number;
  newLevel: number;
  isWin: boolean;
}

/**
 * Calculates realistic XP (can decrease on loss) and BP (strictly additive for leaderboard)
 * for a finished badminton match.
 */
export function calculatePlayerMatchReward(params: {
  player: Player;
  teammates: Player[];
  opponents: Player[];
  teamScore: number;
  opponentScore: number;
  isHardmode: boolean;
}): MatchRewardResult {
  const { player, teammates, opponents, teamScore, opponentScore, isHardmode } = params;
  const isWin = teamScore > opponentScore;

  const myTeam = [player, ...teammates.filter((p) => p.id !== player.id)];
  const avgMyLevel =
    myTeam.reduce((sum, p) => sum + (p.level || 1), 0) / Math.max(1, myTeam.length);
  const avgOppLevel =
    opponents.length > 0
      ? opponents.reduce((sum, p) => sum + (p.level || 1), 0) / opponents.length
      : avgMyLevel;

  // Expected probability of winning (ELO curve over levels 1..40)
  const levelDiff = avgOppLevel - avgMyLevel;
  const expectedWin = 1 / (1 + Math.pow(10, levelDiff / 12));

  // Score margin factor (badminton games to 15 or 21)
  const scoreDiff = Math.abs(teamScore - opponentScore);
  const maxScore = Math.max(15, teamScore, opponentScore);
  const marginRatio = Math.min(1, scoreDiff / maxScore);
  const marginMultiplier = 1 + marginRatio * 0.25; // 1.0x to 1.25x

  const kFactor = isHardmode ? 45 : 30;

  let xpDelta = 0;
  let bpGained = 0;

  if (isWin) {
    const rawGain = kFactor * (1 - expectedWin * 0.5) * marginMultiplier;
    const minGain = isHardmode ? 26 : 16;
    const maxGain = isHardmode ? 58 : 38;
    xpDelta = Math.round(Math.min(maxGain, Math.max(minGain, rawGain)));

    // BP: strictly positive, used for Leaderboard rankings
    const baseBp = isHardmode ? 1.5 : 1.0;
    const upsetBonus = levelDiff > 0 ? Math.min(0.5, (levelDiff / 10) * 0.4) : 0;
    const marginBonus = marginRatio >= 0.35 ? 0.3 : marginRatio >= 0.2 ? 0.15 : 0;
    bpGained = Number((baseBp + upsetBonus + marginBonus).toFixed(1));
  } else {
    // XP decreases on loss, scaled by how favored the player's team was
    const lossFactor = kFactor * 0.45 * (0.5 + expectedWin * 0.5);
    const minLoss = isHardmode ? 12 : 8;
    const maxLoss = isHardmode ? 28 : 20;
    const rawLoss = Math.round(Math.min(maxLoss, Math.max(minLoss, lossFactor)));
    xpDelta = -rawLoss;

    // BP is NEVER subtracted on loss; narrow losses / hard mode grant small participation BP
    const isCloseMatch = scoreDiff <= 2;
    if (isHardmode) {
      bpGained = isCloseMatch ? 0.4 : 0.3;
    } else {
      bpGained = isCloseMatch ? 0.3 : 0.2;
    }
  }

  const newXp = Number(Math.max(0, (player.xp || 0) + xpDelta).toFixed(1));
  const newLevel = calculateLevelFromXp(newXp);

  return {
    xpDelta,
    bpGained,
    newXp,
    newLevel,
    isWin,
  };
}

export interface MatchmakingRequest {
  anchorPlayer: Player;
  candidatePool: Player[];
  isHardmode: boolean;
  blacklistedIds?: string[];
  partyPlayers?: Player[];
  partyPlacement?: 'any' | 'teammates' | 'rivals';
}

export interface MatchmakingResult {
  teamA: Player[];
  teamB: Player[];
  isHardmode: boolean;
  levelDelta: number;
}

/**
 * Dual-Mode Matchmaking Engine:
 * 1. Balanced Mode: selects 3 players from the queue and forms 2v2 teams minimizing the average level difference.
 * 2. Hard Mode: selects stronger opponents (level >= anchorPlayer.level where possible) and pits anchorPlayer's team against the stronger duo.
 * Respects Blacklist and Party placement ('teammates' | 'rivals' | 'any').
 */
export function buildMatchmakingTeams(req: MatchmakingRequest): MatchmakingResult | null {
  const {
    anchorPlayer,
    candidatePool,
    isHardmode,
    blacklistedIds = [],
    partyPlayers = [],
    partyPlacement = 'any',
  } = req;

  const blacklistSet = new Set(blacklistedIds);

  // Filter out anchorPlayer and blacklisted players
  const eligible = candidatePool.filter(
    (p) => p.id !== anchorPlayer.id && !blacklistSet.has(p.id)
  );

  if (eligible.length < 3) {
    return null;
  }

  const activePartyFriends = partyPlayers.filter(
    (p) => p.id !== anchorPlayer.id && !blacklistSet.has(p.id)
  );

  // Sort candidates based on mode:
  // - Hard mode: prefer candidates with level >= anchorPlayer.level (closest above first, then highest available)
  // - Balanced mode: prefer candidates closest in level to anchorPlayer.level
  const sortedCandidates = [...eligible].sort((a, b) => {
    if (isHardmode) {
      const aAbove = a.level >= anchorPlayer.level;
      const bAbove = b.level >= anchorPlayer.level;
      if (aAbove && !bAbove) return -1;
      if (!aAbove && bAbove) return 1;
      if (aAbove && bAbove) {
        return a.level - anchorPlayer.level - (b.level - anchorPlayer.level);
      }
      return b.level - a.level;
    }
    return Math.abs(a.level - anchorPlayer.level) - Math.abs(b.level - anchorPlayer.level);
  });

  // Ensure party members are included first if present
  const selectedThree: Player[] = [];
  for (const friend of activePartyFriends) {
    if (selectedThree.length < 3) {
      selectedThree.push(friend);
    }
  }
  for (const cand of sortedCandidates) {
    if (selectedThree.length >= 3) break;
    if (!selectedThree.some((p) => p.id === cand.id)) {
      selectedThree.push(cand);
    }
  }

  if (selectedThree.length < 3) return null;

  const [p1, p2, p3] = selectedThree;

  // All 3 possible 2v2 partitions where anchorPlayer is in Team A
  const partitions: { teamA: Player[]; teamB: Player[] }[] = [
    { teamA: [anchorPlayer, p1], teamB: [p2, p3] },
    { teamA: [anchorPlayer, p2], teamB: [p1, p3] },
    { teamA: [anchorPlayer, p3], teamB: [p1, p2] },
  ];

  // Filter partitions by partyPlacement if exactly 1 friend is in party
  let validPartitions = partitions;
  if (activePartyFriends.length === 1) {
    const friendId = activePartyFriends[0].id;
    if (partyPlacement === 'teammates') {
      validPartitions = partitions.filter((part) =>
        part.teamA.some((p) => p.id === friendId)
      );
    } else if (partyPlacement === 'rivals') {
      validPartitions = partitions.filter((part) =>
        part.teamB.some((p) => p.id === friendId)
      );
    }
  }

  if (validPartitions.length === 0) {
    validPartitions = partitions;
  }

  // Pick the best partition according to mode:
  // - Balanced: minimize |sum(TeamA) - sum(TeamB)|
  // - Hard mode: prefer Team B having higher total level than Team A (tougher opponents)
  let best = validPartitions[0];
  let bestScore = Infinity;

  for (const part of validPartitions) {
    const sumA = part.teamA.reduce((s, p) => s + p.level, 0);
    const sumB = part.teamB.reduce((s, p) => s + p.level, 0);
    const diff = Math.abs(sumA - sumB);

    if (isHardmode) {
      // In hard mode we want sumB >= sumA (opponents stronger by 2-8 combined levels)
      const challengeGap = sumB - sumA;
      const score = challengeGap >= 0 ? Math.abs(challengeGap - 4) : 100 + Math.abs(challengeGap);
      if (score < bestScore) {
        bestScore = score;
        best = part;
      }
    } else {
      if (diff < bestScore) {
        bestScore = diff;
        best = part;
      }
    }
  }

  const sumA = best.teamA.reduce((s, p) => s + p.level, 0);
  const sumB = best.teamB.reduce((s, p) => s + p.level, 0);

  return {
    teamA: best.teamA,
    teamB: best.teamB,
    isHardmode,
    levelDelta: Math.abs(sumA - sumB),
  };
}
