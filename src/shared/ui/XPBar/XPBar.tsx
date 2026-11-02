import { RollingNumber } from '../motion/RollingNumber';
import styles from './XPBar.module.css';

type XPBarProps = {
  /** XP earned within the current rank. */
  value: number;
  /** XP the current rank spans; null at the top rank. */
  max: number | null;
  label: string;
  compact?: boolean;
};

export function XPBar({ value, max, label, compact = false }: XPBarProps) {
  const percent = max === null ? 100 : Math.min(100, (value / max) * 100);
  return (
    <div className={compact ? styles.compact : styles.bar}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max ?? value}
        aria-valuenow={value}
        aria-valuetext={
          max === null ? `${String(value)} XP, top rank` : `${String(value)} of ${String(max)} XP`
        }
      >
        <div className={styles.fill} style={{ width: `${String(percent)}%` }} />
      </div>
      <span className={styles.numbers}>
        <RollingNumber value={value} />
        {max !== null && <> / {max}</>} XP
      </span>
    </div>
  );
}
