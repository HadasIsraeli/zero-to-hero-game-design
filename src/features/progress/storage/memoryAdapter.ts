import type { ProgressState } from '../model/state';
import type { ProgressStorage } from './ProgressStorage';

/** Keeps progress in memory. For tests, and anywhere persistence isn't wanted. */
export function memoryAdapter(initial: ProgressState | null = null): ProgressStorage & {
  saved: () => ProgressState | null;
} {
  let current = initial;
  return {
    load: () => Promise.resolve(current),
    save: (state) => {
      current = state;
      return Promise.resolve();
    },
    clear: () => {
      current = null;
      return Promise.resolve();
    },
    saved: () => current,
  };
}
