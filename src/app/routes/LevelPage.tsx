import { Link, useParams } from 'react-router';
import { course } from '@content/course.manifest';
import { findLevel, lessonPath } from '@features/lessons';
import { NotFound } from './NotFoundPage';
import styles from './pages.module.css';

export default function LevelPage() {
  const level = findLevel(course, useParams().level);
  if (!level) return <NotFound />;

  return (
    <>
      <title>{`Level ${String(level.level)}: ${level.title} · ${course.title}`}</title>
      <p className={styles.eyebrow}>Level {level.level}</p>
      <h1 className={styles.title}>{level.title}</h1>
      <p className={styles.lead}>{level.theme}</p>
      <p className={styles.muted}>Built around {level.anchors}.</p>

      {level.modules.map((module) => (
        <section key={module.title} className={styles.module} aria-label={module.title}>
          <h2 className={styles.moduleTitle}>{module.title}</h2>
          {module.lessons.length > 0 ? (
            <ul className={styles.lessonList}>
              {module.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link className={styles.lessonLink} to={lessonPath({ level, lesson })}>
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>Coming soon</p>
          )}
        </section>
      ))}

      <section className={styles.boss} aria-labelledby="boss-fight">
        <h2 id="boss-fight" className={styles.moduleTitle}>
          Boss fight
        </h2>
        <p>{level.bossFight}</p>
      </section>
    </>
  );
}
