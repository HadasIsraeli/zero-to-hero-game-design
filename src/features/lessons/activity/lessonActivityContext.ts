import { createContext, use, useEffect } from 'react';
import type { ToyResult } from '@features/toys';
import type { LessonGate } from '../model/lessonGate';

export type LessonActivityContextValue = {
  gate: LessonGate;
  register: (activityId: string) => () => void;
  complete: (activityId: string, result: ToyResult) => void;
  markEndReached: () => void;
};

export const LessonActivityContext = createContext<LessonActivityContextValue | null>(null);

export function useLessonActivityContext(): LessonActivityContextValue {
  const context = use(LessonActivityContext);
  if (!context) throw new Error('Lesson activities must be inside <LessonActivityProvider>');
  return context;
}

/** Whether the current lesson may be completed, and why not. */
export function useLessonGate(): LessonGate {
  return useLessonActivityContext().gate;
}

/**
 * For toys: registers the toy with its lesson while mounted and returns the `onComplete`
 * to pass as its ToyProps. The lesson can't be completed until every registered toy reports.
 */
export function useLessonActivity(activityId: string): {
  onComplete: (result: ToyResult) => void;
} {
  const { register, complete } = useLessonActivityContext();

  // React Compiler keeps `register` stable, so this runs once per mounted toy.
  useEffect(() => register(activityId), [register, activityId]);

  return {
    onComplete: (result) => {
      complete(activityId, result);
    },
  };
}
