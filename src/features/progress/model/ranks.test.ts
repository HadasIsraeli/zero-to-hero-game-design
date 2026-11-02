import { describe, expect, it } from 'vitest';
import { rankForXp, RANKS } from './ranks';

describe('rankForXp', () => {
  it('starts at rank 1 with the first gap to fill', () => {
    expect(rankForXp(0)).toEqual({ rank: 1, title: 'Rookie', xpIntoRank: 0, xpForNextRank: 100 });
  });

  it.each([
    [99, 1, 99],
    [100, 2, 0],
    [249, 2, 149],
    [250, 3, 0],
    [1899, 7, 499],
  ])('%i XP is rank %i with %i XP into it', (xp, rank, into) => {
    expect(rankForXp(xp)).toMatchObject({ rank, xpIntoRank: into });
  });

  it('caps at the top rank with no next threshold', () => {
    const top = RANKS[RANKS.length - 1];
    expect(rankForXp(99_999)).toMatchObject({ rank: top?.rank, xpForNextRank: null });
  });

  it('treats negative or fractional XP safely', () => {
    expect(rankForXp(-5)).toMatchObject({ rank: 1, xpIntoRank: 0 });
    expect(rankForXp(100.9)).toMatchObject({ rank: 2, xpIntoRank: 0 });
  });

  it('has strictly increasing thresholds with growing gaps', () => {
    const gaps = RANKS.slice(1).map((rank, i) => rank.minXp - (RANKS[i]?.minXp ?? 0));
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThan(gaps[i - 1] ?? 0);
  });
});
