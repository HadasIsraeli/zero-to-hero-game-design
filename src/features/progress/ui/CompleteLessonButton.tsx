import { useId, useState } from 'react';
import type { LessonGate } from '@features/lessons';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

type CompleteLessonButtonProps = {
  lessonId: string;
  gate: LessonGate;
};

export function CompleteLessonButton({ lessonId, gate }: CompleteLessonButtonProps) {
  const hintId = useId();
  const hydrated = useProgress((state) => state.hydrated);
  const completed = useProgress((state) => state.progress.completedLessons.includes(lessonId));
  const completeLesson = useProgress((state) => state.completeLesson);
  const [gained, setGained] = useState<number | null>(null);

  if (completed) {
    return (
      <p className={styles.completed} role="status">
        <span aria-hidden="true">✓</span> Lesson completed
        {gained !== null && <span className={styles.gain}> +{gained} XP</span>}
      </p>
    );
  }

  const enabled = hydrated && gate.ready;
  return (
    <div className={styles.complete}>
      <button
        type="button"
        className={styles.completeButton}
        disabled={!enabled}
        aria-describedby={gate.ready ? undefined : hintId}
        onClick={() => {
          const outcome = completeLesson(lessonId);
          if (outcome && outcome.xpGained > 0) setGained(outcome.xpGained);
        }}
      >
        Complete lesson
      </button>
      {!gate.ready && (
        <p id={hintId} className={styles.hint}>
          {gate.hint}
        </p>
      )}
    </div>
  );
}
