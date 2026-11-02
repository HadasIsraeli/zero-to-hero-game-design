// When may a lesson be marked complete? A lesson with toys waits for every toy's onComplete;
// a lesson without toys waits until the reader reaches its end.

export type LessonGateInput = {
  /** Toys mounted in the lesson, by id → has it reported onComplete? */
  activities: Readonly<Record<string, boolean>>;
  reachedEnd: boolean;
};

export type LessonGate = { ready: true } | { ready: false; hint: string };

export const GATE_HINTS = {
  activity: 'Finish the activity to complete this lesson',
  reading: 'Read to the end to complete this lesson',
} as const;

export function lessonGate({ activities, reachedEnd }: LessonGateInput): LessonGate {
  const states = Object.values(activities);
  if (states.length > 0) {
    return states.every(Boolean) ? { ready: true } : { ready: false, hint: GATE_HINTS.activity };
  }
  return reachedEnd ? { ready: true } : { ready: false, hint: GATE_HINTS.reading };
}
