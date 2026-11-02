import { describe, expect, it } from 'vitest';
import { NOW, testCourse } from './model/fixtures';
import { emptyProgress } from './model/state';
import { memoryAdapter } from './storage/memoryAdapter';
import { createProgressStore } from './store';

function setup(saved = emptyProgress()) {
  const storage = memoryAdapter(saved);
  const store = createProgressStore({ storage, course: testCourse, now: () => NOW });
  return { storage, store };
}

describe('progress store', () => {
  it('ignores actions until saved progress has loaded', async () => {
    const { store } = setup({ ...emptyProgress(), xp: 40 });
    expect(store.getState().completeLesson('0/a1')).toBeNull();

    await store.getState().hydrate();
    expect(store.getState().progress.xp).toBe(40);
    expect(store.getState().completeLesson('0/a1')?.xpGained).toBe(50);
  });

  it('saves after every change', async () => {
    const { store, storage } = setup();
    await store.getState().hydrate();
    store.getState().completeLesson('0/a1');
    expect(storage.saved()?.completedLessons).toEqual(['0/a1']);
  });

  it('queues a rank-up before the badges earned by the same event', async () => {
    const { store } = setup({ ...emptyProgress(), xp: 60 });
    await store.getState().hydrate();
    store.getState().completeLesson('0/a1'); // 60 + 50 crosses 100 and earns First Steps

    expect(store.getState().celebrations).toMatchObject([
      { kind: 'rank-up', rank: 2 },
      { kind: 'badge', badgeId: 'first-steps' },
    ]);
  });

  it('does not save or celebrate when an event changes nothing', async () => {
    const { store, storage } = setup({ ...emptyProgress(), completedLessons: ['0/a1'] });
    await store.getState().hydrate();
    const before = storage.saved();
    store.getState().completeLesson('0/a1');
    expect(storage.saved()).toBe(before);
    expect(store.getState().celebrations).toEqual([]);
  });

  it('dismisses one celebration at a time', async () => {
    const { store } = setup();
    await store.getState().hydrate();
    store.getState().completeLesson('0/a1');
    const [first] = store.getState().celebrations;
    if (!first) throw new Error('expected a celebration');

    store.getState().dismissCelebration(first.id);
    expect(store.getState().celebrations).toEqual([]);
  });

  it('resets progress and storage', async () => {
    const { store, storage } = setup({ ...emptyProgress(), xp: 500 });
    await store.getState().hydrate();
    await store.getState().reset();
    expect(store.getState().progress).toEqual(emptyProgress());
    expect(storage.saved()).toBeNull();
  });
});
