import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../model/state';
import { localStorageAdapter, PROGRESS_KEY } from './localStorageAdapter';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('localStorageAdapter', () => {
  it('returns null when nothing is saved', async () => {
    expect(await localStorageAdapter().load()).toBeNull();
  });

  it('round-trips saved progress, as across a reload', async () => {
    const progress = { ...emptyProgress(), xp: 120, completedLessons: ['0/what-is-a-game'] };
    await localStorageAdapter().save(progress);
    expect(await localStorageAdapter().load()).toEqual(progress);
  });

  it.each([
    ['corrupt JSON', '{not json'],
    ['the wrong shape', JSON.stringify({ xp: 'lots' })],
    ['an unknown version', JSON.stringify({ ...emptyProgress(), version: 99 })],
  ])('backs up %s and starts fresh instead of crashing', async (_, raw) => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    window.localStorage.setItem(PROGRESS_KEY, raw);

    expect(await localStorageAdapter().load()).toBeNull();
    expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
    const backups = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(`${PROGRESS_KEY}:unreadable:`),
    );
    expect(backups).toHaveLength(1);
    expect(window.localStorage.getItem(backups[0] ?? '')).toBe(raw);
  });

  it('clears saved progress', async () => {
    const adapter = localStorageAdapter();
    await adapter.save(emptyProgress());
    await adapter.clear();
    expect(await adapter.load()).toBeNull();
  });
});
