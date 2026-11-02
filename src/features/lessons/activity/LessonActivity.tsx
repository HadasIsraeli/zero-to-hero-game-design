import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ToyResult } from '@features/toys';
import { lessonGate } from '../model/lessonGate';
import {
  LessonActivityContext,
  useLessonActivityContext,
  type LessonActivityContextValue,
} from './lessonActivityContext';

type LessonActivityProviderProps = {
  /** Called once per activity the first time it reports completion (e.g. to award XP). */
  onActivityComplete?: (activityId: string, result: ToyResult) => void;
  children: ReactNode;
};

/** Tracks the toys in one lesson and whether the reader reached its end. Key it by lesson. */
export function LessonActivityProvider({
  onActivityComplete,
  children,
}: LessonActivityProviderProps) {
  const [activities, setActivities] = useState<Record<string, boolean>>({});
  const [reachedEnd, setReachedEnd] = useState(false);

  // `register` and `markEndReached` only touch state setters, so React Compiler gives them a
  // stable identity. Toys and the end marker depend on them in effects; if they changed with
  // `activities`, registering would re-trigger itself forever.
  const register = (activityId: string) => {
    setActivities((current) =>
      activityId in current ? current : { ...current, [activityId]: false },
    );
    return () => {
      setActivities((current) =>
        Object.fromEntries(Object.entries(current).filter(([id]) => id !== activityId)),
      );
    };
  };
  const markEndReached = () => {
    setReachedEnd(true);
  };

  const value: LessonActivityContextValue = {
    gate: lessonGate({ activities, reachedEnd }),
    register,
    complete(activityId, result) {
      if (activities[activityId] === true) return;
      setActivities((current) => ({ ...current, [activityId]: true }));
      onActivityComplete?.(activityId, result);
    },
    markEndReached,
  };

  return <LessonActivityContext value={value}>{children}</LessonActivityContext>;
}

/** Invisible marker after the lesson's last paragraph; reports when it scrolls into view. */
export function LessonEndMarker() {
  const { markEndReached } = useLessonActivityContext();
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    if (typeof IntersectionObserver === 'undefined') {
      markEndReached();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        markEndReached();
        observer.disconnect();
      }
    });
    observer.observe(marker);
    return () => {
      observer.disconnect();
    };
  }, [markEndReached]);

  return <div ref={markerRef} data-testid="lesson-end" aria-hidden="true" />;
}
