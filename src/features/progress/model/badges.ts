// Badges are rules over progress, checked after every event.
import type { Course, Level } from '@content/course.manifest';
import { lessonId, type ProgressState } from './state';

export type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: (state: ProgressState, course: Course) => boolean;
};

const levelLessonIds = (level: Level) =>
  level.modules.flatMap((module) =>
    module.lessons.map((lesson) => lessonId(level.level, lesson.slug)),
  );

const allDone = (ids: string[], state: ProgressState) =>
  ids.length > 0 && ids.every((id) => state.completedLessons.includes(id));

export const BADGES: readonly Badge[] = [
  {
    id: 'first-steps',
    icon: '👣',
    title: 'First Steps',
    description: 'Complete your first lesson.',
    earned: (state) => state.completedLessons.length > 0,
  },
  {
    id: 'press-start',
    icon: '🎮',
    title: 'Press Start',
    description: 'Complete every Level 0 lesson.',
    earned: (state, course) => {
      const level = course.levels.find((entry) => entry.level === 0);
      return level !== undefined && allDone(levelLessonIds(level), state);
    },
  },
  {
    id: 'toy-box',
    icon: '🧸',
    title: 'Toy Box',
    description: 'Finish your first toy.',
    earned: (state) => Object.keys(state.completedToys).length > 0,
  },
  {
    id: 'fair-failure',
    icon: '💀',
    title: 'Fair Failure',
    description: 'Get a quiz question right after getting it wrong.',
    earned: (state) =>
      Object.values(state.quizAnswers).some((answer) => answer.correct && answer.attempts > 1),
  },
  {
    id: 'boss-ready',
    icon: '⚔️',
    title: 'Boss Ready',
    description: 'Complete every module of a level and face its boss fight.',
    earned: (state, course) =>
      course.levels.some(
        (level) =>
          level.modules.every((module) => module.lessons.length > 0) &&
          allDone(levelLessonIds(level), state),
      ),
  },
];

export function findBadge(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}

/** Badges earned in `state` that it doesn't already hold, in BADGES order. */
export function newBadges(state: ProgressState, course: Course): string[] {
  return BADGES.filter(
    (badge) => !state.badges.includes(badge.id) && badge.earned(state, course),
  ).map((badge) => badge.id);
}
