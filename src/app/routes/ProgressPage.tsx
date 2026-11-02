import { course } from '@content/course.manifest';
import { BadgeGrid, rankForXp, SkillTree, useProgress } from '@features/progress';
import { XPBar } from '@shared/ui';
import styles from './pages.module.css';

export default function ProgressPage() {
  const xp = useProgress((state) => state.progress.xp);
  const rank = rankForXp(xp);

  return (
    <>
      <title>{`Your progress · ${course.title}`}</title>
      <p className={styles.eyebrow}>Your progress</p>
      <h1 className={styles.title}>
        Rank {rank.rank} · {rank.title}
      </h1>
      <p className={styles.muted}>{xp} XP total</p>
      <div className={styles.rankBar}>
        <XPBar
          value={rank.xpIntoRank}
          max={rank.xpForNextRank}
          label={rank.xpForNextRank === null ? 'Top rank reached' : 'XP to next rank'}
        />
      </div>

      <section className={styles.module} aria-labelledby="badges">
        <h2 id="badges" className={styles.moduleTitle}>
          Badges
        </h2>
        <BadgeGrid />
      </section>

      <section className={styles.module} aria-labelledby="skill-tree">
        <h2 id="skill-tree" className={styles.moduleTitle}>
          Skill tree
        </h2>
        <SkillTree />
      </section>
    </>
  );
}
