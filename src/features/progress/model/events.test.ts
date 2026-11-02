import { describe, expect, it } from 'vitest';
import { applyEvent, type ProgressEvent } from './events';
import { NOW, testCourse } from './fixtures';
import { XP_REWARDS } from './ranks';
import { emptyProgress, type ProgressState } from './state';

const context = { course: testCourse, now: NOW };

function run(events: ProgressEvent[], start: ProgressState = emptyProgress()) {
  return events.reduce(
    (acc, event) => {
      const outcome = applyEvent(acc.state, event, context);
      return { state: outcome.state, outcomes: [...acc.outcomes, outcome] };
    },
    { state: start, outcomes: [] as ReturnType<typeof applyEvent>[] },
  );
}

describe('lessonCompleted', () => {
  it('awards lesson XP once', () => {
    const { state, outcomes } = run([
      { type: 'lessonCompleted', lessonId: '0/a1' },
      { type: 'lessonCompleted', lessonId: '0/a1' },
    ]);
    expect(outcomes.map((o) => o.xpGained)).toEqual([XP_REWARDS.lessonCompleted, 0]);
    expect(state.completedLessons).toEqual(['0/a1']);
    expect(state.xp).toBe(XP_REWARDS.lessonCompleted);
  });

  it('returns the same state object when nothing changes', () => {
    const { state } = run([{ type: 'lessonCompleted', lessonId: '0/a1' }]);
    const again = applyEvent(state, { type: 'lessonCompleted', lessonId: '0/a1' }, context);
    expect(again.state).toBe(state);
  });
});

describe('toyCompleted', () => {
  it('awards toy XP once and records the score and time', () => {
    const { state, outcomes } = run([
      { type: 'toyCompleted', toyId: 'juice-slider', score: 3 },
      { type: 'toyCompleted', toyId: 'juice-slider', score: 9 },
    ]);
    expect(outcomes.map((o) => o.xpGained)).toEqual([XP_REWARDS.toyCompleted, 0]);
    expect(state.completedToys['juice-slider']).toEqual({
      completedAt: NOW.toISOString(),
      score: 3,
    });
  });
});

describe('quizAnswered', () => {
  const answer = (correct: boolean): ProgressEvent => ({
    type: 'quizAnswered',
    quizId: 'level-0',
    questionId: 'q1',
    correct,
  });

  it('gives full XP for a first-try answer', () => {
    expect(run([answer(true)]).outcomes[0]?.xpGained).toBe(XP_REWARDS.quizCorrectFirstTry);
  });

  it('gives reduced XP after a wrong attempt, and nothing for the wrong attempt itself', () => {
    const { state, outcomes } = run([answer(false), answer(false), answer(true)]);
    expect(outcomes.map((o) => o.xpGained)).toEqual([0, 0, XP_REWARDS.quizCorrectAfterRetry]);
    expect(state.quizAnswers['level-0/q1']).toEqual({ correct: true, attempts: 3 });
  });

  it('ignores answers once a question is right', () => {
    const { outcomes } = run([answer(true), answer(true), answer(false)]);
    expect(outcomes.map((o) => o.xpGained)).toEqual([XP_REWARDS.quizCorrectFirstTry, 0, 0]);
  });
});

describe('rank-ups and badges', () => {
  it('reports the new rank when an event crosses a threshold', () => {
    const { outcomes } = run([
      { type: 'lessonCompleted', lessonId: '0/a1' },
      { type: 'lessonCompleted', lessonId: '0/a2' },
    ]);
    expect(outcomes.map((o) => o.rankUp)).toEqual([null, 2]);
  });

  it('reports each badge once, the moment it is earned', () => {
    const { state, outcomes } = run([
      { type: 'lessonCompleted', lessonId: '0/a1' },
      { type: 'lessonCompleted', lessonId: '0/a2' },
      { type: 'lessonCompleted', lessonId: '0/b1' },
    ]);
    expect(outcomes.map((o) => o.newBadges)).toEqual([
      ['first-steps'],
      [],
      ['press-start', 'boss-ready'],
    ]);
    expect(state.badges).toEqual(['first-steps', 'press-start', 'boss-ready']);
  });
});
