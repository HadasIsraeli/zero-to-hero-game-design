// Every way to earn XP goes through applyEvent, so scoring rules live in one place.
// Events are idempotent: repeating one never awards XP twice.
import type { Course } from '@content/course.manifest';
import { newBadges } from './badges';
import { rankForXp, XP_REWARDS } from './ranks';
import type { ProgressState } from './state';

export type ProgressEvent =
  | { type: 'lessonCompleted'; lessonId: string }
  | { type: 'toyCompleted'; toyId: string; score?: number }
  | { type: 'quizAnswered'; quizId: string; questionId: string; correct: boolean };

export type EventOutcome = {
  state: ProgressState;
  xpGained: number;
  /** The new rank number, if this event crossed a rank boundary. */
  rankUp: number | null;
  newBadges: string[];
};

export function applyEvent(
  state: ProgressState,
  event: ProgressEvent,
  context: { course: Course; now: Date },
): EventOutcome {
  const { next, xp } = reduce(state, event, context.now);
  if (next === state) return { state, xpGained: 0, rankUp: null, newBadges: [] };

  const withXp = { ...next, xp: state.xp + xp };
  const earned = newBadges(withXp, context.course);
  const final = earned.length > 0 ? { ...withXp, badges: [...withXp.badges, ...earned] } : withXp;

  const before = rankForXp(state.xp).rank;
  const after = rankForXp(final.xp).rank;
  return {
    state: final,
    xpGained: xp,
    rankUp: after > before ? after : null,
    newBadges: earned,
  };
}

function reduce(
  state: ProgressState,
  event: ProgressEvent,
  now: Date,
): { next: ProgressState; xp: number } {
  switch (event.type) {
    case 'lessonCompleted':
      if (state.completedLessons.includes(event.lessonId)) return { next: state, xp: 0 };
      return {
        next: { ...state, completedLessons: [...state.completedLessons, event.lessonId] },
        xp: XP_REWARDS.lessonCompleted,
      };

    case 'toyCompleted': {
      if (event.toyId in state.completedToys) return { next: state, xp: 0 };
      const record =
        event.score === undefined
          ? { completedAt: now.toISOString() }
          : { completedAt: now.toISOString(), score: event.score };
      return {
        next: { ...state, completedToys: { ...state.completedToys, [event.toyId]: record } },
        xp: XP_REWARDS.toyCompleted,
      };
    }

    case 'quizAnswered': {
      const key = `${event.quizId}/${event.questionId}`;
      const previous = state.quizAnswers[key];
      if (previous?.correct) return { next: state, xp: 0 };

      const attempts = (previous?.attempts ?? 0) + 1;
      const xp = !event.correct
        ? 0
        : attempts === 1
          ? XP_REWARDS.quizCorrectFirstTry
          : XP_REWARDS.quizCorrectAfterRetry;
      return {
        next: {
          ...state,
          quizAnswers: { ...state.quizAnswers, [key]: { correct: event.correct, attempts } },
        },
        xp,
      };
    }
  }
}
