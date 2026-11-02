import { createStore } from 'zustand/vanilla';
import type { Course } from '@content/course.manifest';
import type { ToyResult } from '@features/toys';
import { applyEvent, type EventOutcome, type ProgressEvent } from './model/events';
import { emptyProgress, type ProgressState } from './model/state';
import type { ProgressStorage } from './storage/ProgressStorage';

/** Something the UI should celebrate, queued so several can arrive from one event. */
export type Celebration =
  { id: number; kind: 'rank-up'; rank: number } | { id: number; kind: 'badge'; badgeId: string };

export type ProgressStoreState = {
  progress: ProgressState;
  /** False until saved progress has loaded; actions are ignored before then. */
  hydrated: boolean;
  celebrations: Celebration[];

  hydrate: () => Promise<void>;
  completeLesson: (lessonId: string) => EventOutcome | null;
  recordToyResult: (toyId: string, result: ToyResult) => EventOutcome | null;
  recordQuizAnswer: (quizId: string, questionId: string, correct: boolean) => EventOutcome | null;
  dismissCelebration: (id: number) => void;
  reset: () => Promise<void>;
};

export type ProgressStore = ReturnType<typeof createProgressStore>;

export function createProgressStore({
  storage,
  course,
  now = () => new Date(),
}: {
  storage: ProgressStorage;
  course: Course;
  now?: () => Date;
}) {
  let nextId = 1;

  return createStore<ProgressStoreState>()((set, get) => {
    function dispatch(event: ProgressEvent): EventOutcome | null {
      if (!get().hydrated) return null;

      const outcome = applyEvent(get().progress, event, { course, now: now() });
      if (outcome.state === get().progress) return outcome;

      const celebrations: Celebration[] = [
        ...(outcome.rankUp === null
          ? []
          : [{ id: nextId++, kind: 'rank-up' as const, rank: outcome.rankUp }]),
        ...outcome.newBadges.map((badgeId) => ({ id: nextId++, kind: 'badge' as const, badgeId })),
      ];
      set((current) => ({
        progress: outcome.state,
        celebrations: [...current.celebrations, ...celebrations],
      }));
      storage.save(outcome.state).catch((error: unknown) => {
        console.error('Could not save progress.', error);
      });
      return outcome;
    }

    return {
      progress: emptyProgress(),
      hydrated: false,
      celebrations: [],

      async hydrate() {
        if (get().hydrated) return;
        const saved = await storage.load().catch((error: unknown) => {
          console.error('Could not load progress.', error);
          return null;
        });
        set({ progress: saved ?? emptyProgress(), hydrated: true });
      },
      completeLesson: (lessonId) => dispatch({ type: 'lessonCompleted', lessonId }),
      recordToyResult: (toyId, result) =>
        dispatch(
          result.score === undefined
            ? { type: 'toyCompleted', toyId }
            : { type: 'toyCompleted', toyId, score: result.score },
        ),
      recordQuizAnswer: (quizId, questionId, correct) =>
        dispatch({ type: 'quizAnswered', quizId, questionId, correct }),
      dismissCelebration(id) {
        set((current) => ({
          celebrations: current.celebrations.filter((celebration) => celebration.id !== id),
        }));
      },
      async reset() {
        await storage.clear();
        set({ progress: emptyProgress(), celebrations: [] });
      },
    };
  });
}
