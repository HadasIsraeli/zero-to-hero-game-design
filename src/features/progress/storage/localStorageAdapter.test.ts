import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../model/state';
import { localStorageAdapter, PROGRESS_KEY } from './localStorageAdapter';

/** A Map-backed Storage, so this pure-logic test runs in Node. */
function memoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => {
      items.clear();
    },
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key);
    },
    setItem: (key, value) => {
      items.set(key, value);
    },
  };
}

const keys = (storage: Storage) =>
  Array.from({ length: storage.length }, (_, i) => storage.key(i) ?? '');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('localStorageAdapter', () => {
  it('returns null when nothing is saved', async () => {
    expect(await localStorageAdapter(memoryStorage()).load()).toBeNull();
  });

  it('round-trips saved progress, as across a reload', async () => {
    const storage = memoryStorage();
    const progress = { ...emptyProgress(), xp: 120, completedLessons: ['0/what-is-a-game'] };
    await localStorageAdapter(storage).save(progress);
    expect(await localStorageAdapter(storage).load()).toEqual(progress);
  });

  it.each([
    ['corrupt JSON', '{not json'],
    ['the wrong shape', JSON.stringify({ xp: 'lots' })],
    ['an unknown version', JSON.stringify({ ...emptyProgress(), version: 99 })],
  ])('backs up %s and starts fresh instead of crashing', async (_, raw) => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const storage = memoryStorage();
    storage.setItem(PROGRESS_KEY, raw);

    expect(await localStorageAdapter(storage).load()).toBeNull();
    expect(storage.getItem(PROGRESS_KEY)).toBeNull();
    const backups = keys(storage).filter((key) => key.startsWith(`${PROGRESS_KEY}:unreadable:`));
    expect(backups).toHaveLength(1);
    expect(storage.getItem(backups[0] ?? '')).toBe(raw);
  });

  it('clears saved progress', async () => {
    const adapter = localStorageAdapter(memoryStorage());
    await adapter.save(emptyProgress());
    await adapter.clear();
    expect(await adapter.load()).toBeNull();
  });
});
