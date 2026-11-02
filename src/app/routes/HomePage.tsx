import { Link } from 'react-router';
import { course } from '@content/course.manifest';
import { lessonPath, levelPath } from '@features/lessons';
import { courseProgress, recommendedNext, useProgress } from '@features/progress';
import styles from './pages.module.css';

export default function HomePage() {
  const progress = useProgress((state) => state.progress);
  const levels = courseProgress(course, progress);
  const next = recommendedNext(course, progress);

  return (
    <>
      <title>{course.title}</title>
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.lead}>Seven levels, from Press Start to Ship It.</p>

      {next && (
        <Link className={styles.continue} to={lessonPath(next)}>
          <span className={styles.cardEyebrow}>
            {progress.completedLessons.length > 0 ? 'Continue' : 'Start here'}
          </span>
          <span className={styles.cardTitle}>{next.lesson.title}</span>
          <span className={styles.cardBody}>
            Level {next.level.level}: {next.level.title}
          </span>
        </Link>
      )}

      <ol className={styles.map} aria-label="Level map">
        {levels.map(({ level, completed, total }) => {
          const isNext = next?.level === level;
          return (
            <li key={level.level} className={styles.mapStop}>
              <span
                className={styles.mapNode}
                data-done={total > 0 && completed === total}
                aria-hidden="true"
              >
                {level.level}
              </span>
              <Link className={styles.card} to={levelPath(level)} data-next={isNext}>
                <span className={styles.cardEyebrow}>
                  Level {level.level}
                  {isNext && <span className={styles.nextTag}> · Next up</span>}
                </span>
                <span className={styles.cardTitle}>{level.title}</span>
                <span className={styles.cardBody}>{level.theme}</span>
                {total > 0 ? (
                  <span className={styles.cardMeta}>
                    <span className={styles.miniBar} aria-hidden="true">
                      <span style={{ width: `${String((completed / total) * 100)}%` }} />
                    </span>
                    {completed} / {total} lessons
                  </span>
                ) : (
                  <span className={styles.cardMeta}>Coming soon</span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
