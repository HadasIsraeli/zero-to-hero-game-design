import { useEffect, useRef } from 'react';
import { ParticleBurst, RollingNumber } from '@shared/ui';
import { RANKS } from '../model/ranks';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

/** Celebrates a rank-up. A native modal <dialog>: traps focus, closes on Esc, restores focus. */
export function LevelUpDialog() {
  const rankUp = useProgress((state) => state.celebrations.find((c) => c.kind === 'rank-up'));
  const dismiss = useProgress((state) => state.dismissCelebration);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (rankUp && dialog && !dialog.open) dialog.showModal();
  }, [rankUp]);

  const rank = rankUp?.kind === 'rank-up' ? RANKS.find((r) => r.rank === rankUp.rank) : undefined;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="level-up-title"
      onClose={() => {
        if (rankUp) dismiss(rankUp.id);
      }}
    >
      {rank && (
        <>
          <ParticleBurst />
          <p className={styles.dialogEyebrow}>Rank up!</p>
          <h2 id="level-up-title" className={styles.dialogTitle}>
            Rank <RollingNumber value={rank.rank} from={rank.rank - 1} /> · {rank.title}
          </h2>
          <button
            type="button"
            className={styles.completeButton}
            onClick={() => {
              dialogRef.current?.close();
            }}
          >
            Keep going
          </button>
        </>
      )}
    </dialog>
  );
}
