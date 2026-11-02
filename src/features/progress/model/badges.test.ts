import { describe, expect, it } from 'vitest';
import { BADGES, newBadges } from './badges';
import { testCourse } from './fixtures';
import { emptyProgress, type ProgressState } from './state';

const state = (overrides: Partial<ProgressState>): ProgressState => ({
  ...emptyProgress(),
  ...overrides,
});

describe('badges', () => {
  it('have unique ids', () => {
    const ids = BADGES.map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('earns nothing from empty progress', () => {
    expect(newBadges(emptyProgress(), testCourse)).toEqual([]);
  });

  it('earns First Steps for any lesson', () => {
    expect(newBadges(state({ completedLessons: ['1/c1'] }), testCourse)).toEqual(['first-steps']);
  });

  it('earns Press Start only when every Level 0 lesson is done', () => {
    const partial = state({ completedLessons: ['0/a1', '0/a2'] });
    expect(newBadges(partial, testCourse)).not.toContain('press-start');
    const all = state({ completedLessons: ['0/a1', '0/a2', '0/b1'] });
    expect(newBadges(all, testCourse)).toContain('press-start');
  });

  it('does not award Boss Ready for a level with an unwritten module', () => {
    expect(newBadges(state({ completedLessons: ['1/c1'] }), testCourse)).not.toContain(
      'boss-ready',
    );
  });

  it('earns Toy Box for any finished toy', () => {
    const toys = { 'juice-slider': { completedAt: '2026-11-02T00:00:00.000Z' } };
    expect(newBadges(state({ completedToys: toys }), testCourse)).toEqual(['toy-box']);
  });

  it('earns Fair Failure only for a correct answer after a wrong one', () => {
    const firstTry = state({ quizAnswers: { 'q/1': { correct: true, attempts: 1 } } });
    expect(newBadges(firstTry, testCourse)).toEqual([]);
    const retried = state({ quizAnswers: { 'q/1': { correct: true, attempts: 2 } } });
    expect(newBadges(retried, testCourse)).toEqual(['fair-failure']);
  });

  it('never re-awards a badge already held', () => {
    const held = state({ completedLessons: ['0/a1'], badges: ['first-steps'] });
    expect(newBadges(held, testCourse)).toEqual([]);
  });
});
