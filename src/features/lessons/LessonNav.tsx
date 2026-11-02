import { Link } from 'react-router';
import { loadLesson } from './loadLesson';
import { lessonPath, type LessonRef } from './model/course';
import styles from './lessons.module.css';

// Start downloading a lesson as soon as the learner points at or tabs to its link.
const preload = (ref: LessonRef) => () => void loadLesson(ref.lesson);

type LessonNavProps = {
  previous: LessonRef | undefined;
  next: LessonRef | undefined;
};

export function LessonNav({ previous, next }: LessonNavProps) {
  return (
    <nav className={styles.nav} aria-label="Lesson">
      {previous && (
        <Link
          className={styles.navLink}
          to={lessonPath(previous)}
          rel="prev"
          onPointerEnter={preload(previous)}
          onFocus={preload(previous)}
        >
          <span className={styles.navHint}>Previous</span>
          {previous.lesson.title}
        </Link>
      )}
      {next && (
        <Link
          className={[styles.navLink, styles.navNext].join(' ')}
          to={lessonPath(next)}
          rel="next"
          onPointerEnter={preload(next)}
          onFocus={preload(next)}
        >
          <span className={styles.navHint}>Next</span>
          {next.lesson.title}
        </Link>
      )}
    </nav>
  );
}
