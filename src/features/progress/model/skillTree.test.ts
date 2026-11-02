import { describe, expect, it } from 'vitest';
import { testCourse } from './fixtures';
import { courseProgress, recommendedNext } from './skillTree';
import { emptyProgress, type ProgressState } from './state';

const withLessons = (completedLessons: string[]): ProgressState => ({
  ...emptyProgress(),
  completedLessons,
});

describe('courseProgress', () => {
  it('reports module status and counts per level', () => {
    const [zero, one] = courseProgress(testCourse, withLessons(['0/a1', '0/b1']));
    expect(zero).toMatchObject({ completed: 2, total: 3 });
    expect(zero?.modules.map((m) => m.status)).toEqual(['in-progress', 'complete']);
    expect(one?.modules.map((m) => m.status)).toEqual(['not-started', 'coming-soon']);
  });

  it('points each module at its first unfinished lesson', () => {
    const [zero] = courseProgress(testCourse, withLessons(['0/a1']));
    expect(zero?.modules[0]?.nextLesson?.slug).toBe('a2');
  });

  it('points a finished module back at its first lesson, and an empty one at nothing', () => {
    const [zero, one] = courseProgress(testCourse, withLessons(['0/b1']));
    expect(zero?.modules[1]?.nextLesson?.slug).toBe('b1');
    expect(one?.modules[1]?.nextLesson).toBeUndefined();
  });
});

describe('recommendedNext', () => {
  it('starts at the first lesson', () => {
    expect(recommendedNext(testCourse, emptyProgress())?.lesson.slug).toBe('a1');
  });

  it('skips completed lessons, even out of order', () => {
    expect(recommendedNext(testCourse, withLessons(['0/a1', '0/b1']))?.lesson.slug).toBe('a2');
  });

  it('moves on to the next level', () => {
    const next = recommendedNext(testCourse, withLessons(['0/a1', '0/a2', '0/b1']));
    expect(next?.level.level).toBe(1);
    expect(next?.lesson.slug).toBe('c1');
  });

  it('returns nothing when every lesson is done', () => {
    expect(recommendedNext(testCourse, withLessons(['0/a1', '0/a2', '0/b1', '1/c1']))).toBe(
      undefined,
    );
  });
});
