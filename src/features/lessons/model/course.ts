// Pure lookups over the course manifest. Route params arrive as strings, so parsing lives here.
import type { Course, Lesson, Level, Module } from '@content/course.manifest';

export type LessonRef = { level: Level; module: Module; lesson: Lesson };

export function findLevel(course: Course, param: string | undefined): Level | undefined {
  if (param === undefined || !/^\d+$/.test(param)) return undefined;
  const number = Number(param);
  return course.levels.find((level) => level.level === number);
}

export function allLessons(course: Course): LessonRef[] {
  return course.levels.flatMap((level) =>
    level.modules.flatMap((module) => module.lessons.map((lesson) => ({ level, module, lesson }))),
  );
}

export function findLesson(
  course: Course,
  levelParam: string | undefined,
  slug: string | undefined,
): LessonRef | undefined {
  const level = findLevel(course, levelParam);
  if (!level) return undefined;
  return allLessons(course).find((ref) => ref.level === level && ref.lesson.slug === slug);
}

/** Previous and next lessons across the whole course, so the last lesson of a level leads on. */
export function lessonNeighbours(
  course: Course,
  current: LessonRef,
): { previous: LessonRef | undefined; next: LessonRef | undefined } {
  const lessons = allLessons(course);
  const index = lessons.findIndex((ref) => ref.lesson === current.lesson);
  return { previous: lessons[index - 1], next: lessons[index + 1] };
}

export function levelPath(level: Level): string {
  return `/level/${String(level.level)}`;
}

export function lessonPath(ref: Pick<LessonRef, 'level' | 'lesson'>): string {
  return `${levelPath(ref.level)}/${ref.lesson.slug}`;
}

export function lessonCount(level: Level): number {
  return level.modules.reduce((total, module) => total + module.lessons.length, 0);
}
