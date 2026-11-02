import { Link } from 'react-router';
import { course } from '@content/course.manifest';
import { lessonCount, levelPath } from '@features/lessons';
import styles from './pages.module.css';

export default function HomePage() {
  return (
    <>
      <title>{course.title}</title>
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.lead}>Seven levels, from Press Start to Ship It.</p>

      <ol className={styles.map} aria-label="Level map">
        {course.levels.map((level) => {
          const lessons = lessonCount(level);
          return (
            <li key={level.level} className={styles.mapStop}>
              <span className={styles.mapNode} aria-hidden="true">
                {level.level}
              </span>
              <Link className={styles.card} to={levelPath(level)}>
                <span className={styles.cardEyebrow}>Level {level.level}</span>
                <span className={styles.cardTitle}>{level.title}</span>
                <span className={styles.cardBody}>{level.theme}</span>
                <span className={styles.cardMeta}>
                  {lessons > 0
                    ? `${String(lessons)} ${lessons === 1 ? 'lesson' : 'lessons'}`
                    : 'Coming soon'}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
