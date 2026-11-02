import { BADGES } from '../model/badges';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

export function BadgeGrid() {
  const earned = useProgress((state) => state.progress.badges);

  return (
    <ul className={styles.badges}>
      {BADGES.map((badge) => {
        const has = earned.includes(badge.id);
        return (
          <li key={badge.id} className={styles.badge} data-earned={has}>
            <span className={styles.badgeIcon} aria-hidden="true">
              {has ? badge.icon : '🔒'}
            </span>
            <span className={styles.badgeTitle}>{badge.title}</span>
            <span className={styles.badgeDescription}>{badge.description}</span>
            <span className="visually-hidden">{has ? 'Earned' : 'Locked'}</span>
          </li>
        );
      })}
    </ul>
  );
}
