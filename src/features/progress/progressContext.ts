import { createContext, use } from 'react';
import { useStore } from 'zustand';
import type { ProgressStore, ProgressStoreState } from './store';

export const ProgressContext = createContext<ProgressStore | null>(null);

/** Subscribe to part of the progress store. Select primitives or stored references. */
export function useProgress<T>(selector: (state: ProgressStoreState) => T): T {
  const store = use(ProgressContext);
  if (!store) throw new Error('useProgress must be used inside <ProgressProvider>');
  return useStore(store, selector);
}
