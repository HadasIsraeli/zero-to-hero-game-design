import { Link } from 'react-router';
import { XPBar } from '@shared/ui';
import { rankForXp } from '../model/ranks';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

/** Rank and XP in the app header; links to the progress page. */
export function HeaderProgress() {
  const xp = useProgress((state) => state.progress.xp);
  const rank = rankForXp(xp);

  return (
    <Link
      className={styles.header}
      to="/progress"
      aria-label={`Rank ${String(rank.rank)}, ${rank.title}. View progress`}
    >
      <span className={styles.headerRank} aria-hidden="true">
        Rank {rank.rank} · {rank.title}
      </span>
      {/* Keyed by rank so the bar starts fresh after a rank-up instead of rolling backwards. */}
      <XPBar
        key={rank.rank}
        compact
        value={rank.xpIntoRank}
        max={rank.xpForNextRank}
        label="XP to next rank"
      />
    </Link>
  );
}
