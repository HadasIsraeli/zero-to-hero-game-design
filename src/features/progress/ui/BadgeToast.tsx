import { useEffect } from 'react';
import { findBadge } from '../model/badges';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

const VISIBLE_MS = 4000;

/** Announces newly earned badges one at a time. The live region is always mounted. */
export function BadgeToast() {
  const celebration = useProgress((state) => state.celebrations.find((c) => c.kind === 'badge'));
  const dismiss = useProgress((state) => state.dismissCelebration);
  const badge = celebration?.kind === 'badge' ? findBadge(celebration.badgeId) : undefined;

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => {
      dismiss(celebration.id);
    }, VISIBLE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [celebration, dismiss]);

  return (
    <div className={styles.toastRegion} role="status" aria-live="polite">
      {badge && (
        <div className={styles.toast}>
          <span className={styles.toastIcon} aria-hidden="true">
            {badge.icon}
          </span>
          <span>
            Badge unlocked: <strong>{badge.title}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
