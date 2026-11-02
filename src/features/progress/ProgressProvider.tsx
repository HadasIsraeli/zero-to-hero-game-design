import { useEffect, useState, type ReactNode } from 'react';
import type { Course } from '@content/course.manifest';
import { ProgressContext } from './progressContext';
import { createProgressStore, type ProgressStore } from './store';
import type { ProgressStorage } from './storage/ProgressStorage';

type ProgressProviderProps = {
  storage: ProgressStorage;
  course: Course;
  /** Inject a ready-made store (tests); otherwise one is created from `storage`. */
  store?: ProgressStore;
  children: ReactNode;
};

export function ProgressProvider({
  storage,
  course,
  store: given,
  children,
}: ProgressProviderProps) {
  const [store] = useState(() => given ?? createProgressStore({ storage, course }));

  useEffect(() => {
    void store.getState().hydrate();
  }, [store]);

  return <ProgressContext value={store}>{children}</ProgressContext>;
}
