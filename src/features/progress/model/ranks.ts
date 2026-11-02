// XP rewards and the rank curve. "Rank" is the player's progression; "Level" is a course level.

export const XP_REWARDS = {
  lessonCompleted: 50,
  toyCompleted: 30,
  quizCorrectFirstTry: 10,
  quizCorrectAfterRetry: 5,
} as const;

/** Each rank starts at `minXp`. Gaps grow so later ranks take longer. */
export const RANKS = [
  { rank: 1, title: 'Rookie', minXp: 0 },
  { rank: 2, title: 'Apprentice', minXp: 100 },
  { rank: 3, title: 'Tinkerer', minXp: 250 },
  { rank: 4, title: 'Designer', minXp: 450 },
  { rank: 5, title: 'Systems Thinker', minXp: 700 },
  { rank: 6, title: 'Lead Designer', minXp: 1000 },
  { rank: 7, title: 'Creative Director', minXp: 1400 },
  { rank: 8, title: 'Auteur', minXp: 1900 },
] as const;

export type RankInfo = {
  rank: number;
  title: string;
  /** XP earned since this rank started. */
  xpIntoRank: number;
  /** XP this rank spans; null at the top rank. */
  xpForNextRank: number | null;
};

export function rankForXp(xp: number): RankInfo {
  const total = Math.max(0, Math.floor(xp));
  let index = 0;
  while (index + 1 < RANKS.length && total >= (RANKS[index + 1]?.minXp ?? Infinity)) index++;

  const current = RANKS[index] ?? RANKS[0];
  const next = RANKS[index + 1];
  return {
    rank: current.rank,
    title: current.title,
    xpIntoRank: total - current.minXp,
    xpForNextRank: next ? next.minXp - current.minXp : null,
  };
}
