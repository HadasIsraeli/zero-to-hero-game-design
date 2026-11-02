// The saved progress shape. Versioned so storage adapters can detect stale data.
import { z } from 'zod';

export const progressSchema = z.strictObject({
  version: z.literal(1),
  xp: z.int().nonnegative(),
  /** Lesson ids, `${level}/${slug}`. */
  completedLessons: z.array(z.string()),
  completedToys: z.record(
    z.string(),
    z.strictObject({ completedAt: z.string(), score: z.number().optional() }),
  ),
  /** Keyed `${quizId}/${questionId}`. */
  quizAnswers: z.record(
    z.string(),
    z.strictObject({ correct: z.boolean(), attempts: z.int().positive() }),
  ),
  badges: z.array(z.string()),
});

export type ProgressState = z.infer<typeof progressSchema>;

export function emptyProgress(): ProgressState {
  return {
    version: 1,
    xp: 0,
    completedLessons: [],
    completedToys: {},
    quizAnswers: {},
    badges: [],
  };
}

export function lessonId(level: number, slug: string): string {
  return `${String(level)}/${slug}`;
}
