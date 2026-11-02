// Course manifest + progress → what's done, per level and module, and what to do next.
import type { Course, Lesson, Level } from '@content/course.manifest';
import { lessonId, type ProgressState } from './state';

export type ModuleStatus = 'complete' | 'in-progress' | 'not-started' | 'coming-soon';

export type ModuleProgress = {
  title: string;
  status: ModuleStatus;
  completed: number;
  total: number;
  /** First lesson not yet completed, else the first lesson. */
  nextLesson: Lesson | undefined;
};

export type LevelProgress = {
  level: Level;
  completed: number;
  total: number;
  modules: ModuleProgress[];
};

export function levelProgress(level: Level, state: ProgressState): LevelProgress {
  const done = (lesson: Lesson) =>
    state.completedLessons.includes(lessonId(level.level, lesson.slug));

  const modules = level.modules.map((module): ModuleProgress => {
    const total = module.lessons.length;
    const completed = module.lessons.filter(done).length;
    const status: ModuleStatus =
      total === 0
        ? 'coming-soon'
        : completed === total
          ? 'complete'
          : completed > 0
            ? 'in-progress'
            : 'not-started';
    return {
      title: module.title,
      status,
      completed,
      total,
      nextLesson: module.lessons.find((lesson) => !done(lesson)) ?? module.lessons[0],
    };
  });

  return {
    level,
    completed: modules.reduce((sum, module) => sum + module.completed, 0),
    total: modules.reduce((sum, module) => sum + module.total, 0),
    modules,
  };
}

export function courseProgress(course: Course, state: ProgressState): LevelProgress[] {
  return course.levels.map((level) => levelProgress(level, state));
}

/** The first lesson in course order that isn't completed yet. */
export function recommendedNext(
  course: Course,
  state: ProgressState,
): { level: Level; lesson: Lesson } | undefined {
  for (const level of course.levels) {
    for (const module of level.modules) {
      const lesson = module.lessons.find(
        (entry) => !state.completedLessons.includes(lessonId(level.level, entry.slug)),
      );
      if (lesson) return { level, lesson };
    }
  }
  return undefined;
}
