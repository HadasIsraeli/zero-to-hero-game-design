import { progressSchema } from '../model/state';
import type { ProgressStorage } from './ProgressStorage';

export const PROGRESS_KEY = 'zero-to-hero:progress';

/**
 * Saves progress in localStorage. Unreadable data (corrupt JSON, wrong shape, unknown version)
 * is copied to a backup key and progress starts fresh, so a bad save never crashes the app.
 */
export function localStorageAdapter(
  storage: Storage = window.localStorage,
  key = PROGRESS_KEY,
): ProgressStorage {
  return {
    load() {
      const raw = storage.getItem(key);
      if (raw === null) return Promise.resolve(null);

      try {
        return Promise.resolve(progressSchema.parse(JSON.parse(raw)));
      } catch (error) {
        const backupKey = `${key}:unreadable:${new Date().toISOString()}`;
        storage.setItem(backupKey, raw);
        storage.removeItem(key);
        console.warn(`Saved progress was unreadable and was moved to "${backupKey}".`, error);
        return Promise.resolve(null);
      }
    },
    save(state) {
      storage.setItem(key, JSON.stringify(state));
      return Promise.resolve();
    },
    clear() {
      storage.removeItem(key);
      return Promise.resolve();
    },
  };
}
