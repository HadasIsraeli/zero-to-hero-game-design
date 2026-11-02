import type { MDXContent } from 'mdx/types';
import type { Lesson } from '@content/course.manifest';

type LessonModule = { default: MDXContent };

// React's `use` reads `status`/`value` off a thenable: a promise already marked fulfilled
// renders synchronously instead of suspending. Tracking it lets preloaded lessons appear instantly.
type TrackedPromise<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
};

const loaded = new WeakMap<Lesson, TrackedPromise<LessonModule>>();

/** Starts (or reuses) the lesson's chunk download. Safe to call repeatedly, e.g. on hover. */
export function loadLesson(lesson: Lesson): Promise<LessonModule> {
  const cached = loaded.get(lesson);
  if (cached) return cached;

  const promise: TrackedPromise<LessonModule> = lesson.load();
  promise.status = 'pending';
  promise.then(
    (value) => {
      promise.status = 'fulfilled';
      promise.value = value;
    },
    (reason: unknown) => {
      promise.status = 'rejected';
      promise.reason = reason;
    },
  );
  loaded.set(lesson, promise);
  return promise;
}
