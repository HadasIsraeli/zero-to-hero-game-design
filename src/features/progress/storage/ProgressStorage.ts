import type { ProgressState } from '../model/state';

/** Where progress lives. Async so a remote adapter (Supabase) can replace localStorage later. */
export type ProgressStorage = {
  /** Saved progress, or null if there is none (or it was unreadable and set aside). */
  load: () => Promise<ProgressState | null>;
  save: (state: ProgressState) => Promise<void>;
  clear: () => Promise<void>;
};
