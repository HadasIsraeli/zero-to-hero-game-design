import type { Lesson } from '@content/course.manifest';
import { describe, expect, it, vi } from 'vitest';
import { loadLesson } from './loadLesson';

const Content = () => null;

function lesson(load: Lesson['load']): Lesson {
  return { slug: 'x', title: 'X', load };
}

describe('loadLesson', () => {
  it('starts the download once per lesson', async () => {
    const load = vi.fn(() => Promise.resolve({ default: Content }));
    const target = lesson(load);
    const first = loadLesson(target);
    expect(loadLesson(target)).toBe(first);
    await first;
    expect(load).toHaveBeenCalledOnce();
  });

  it('marks the promise fulfilled so React can render it without suspending', async () => {
    const promise = loadLesson(lesson(() => Promise.resolve({ default: Content })));
    expect(promise).toMatchObject({ status: 'pending' });
    await promise;
    expect(promise).toMatchObject({ status: 'fulfilled', value: { default: Content } });
  });

  it('marks the promise rejected when the chunk fails to load', async () => {
    const error = new Error('chunk failed');
    const promise = loadLesson(lesson(() => Promise.reject(error)));
    await expect(promise).rejects.toBe(error);
    expect(promise).toMatchObject({ status: 'rejected', reason: error });
  });
});
