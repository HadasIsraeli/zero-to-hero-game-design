import { Suspense } from 'react';
import { Link, useParams } from 'react-router';
import { course } from '@content/course.manifest';
import {
  findLesson,
  LessonContent,
  LessonNav,
  lessonNeighbours,
  levelPath,
} from '@features/lessons';
import { NotFound } from './NotFoundPage';
import styles from './pages.module.css';

export default function LessonPage() {
  const params = useParams();
  const ref = findLesson(course, params.level, params.lesson);
  if (!ref) return <NotFound />;

  const { level, lesson } = ref;
  const { previous, next } = lessonNeighbours(course, ref);

  return (
    <article>
      <title>{`${lesson.title} · ${course.title}`}</title>
      <Link className={styles.eyebrow} to={levelPath(level)}>
        Level {level.level}: {level.title}
      </Link>
      <h1 className={styles.title}>{lesson.title}</h1>
      <Suspense fallback={<p className={styles.muted}>Loading lesson…</p>}>
        <LessonContent key={lesson.slug} lesson={lesson} />
      </Suspense>
      <LessonNav previous={previous} next={next} />
    </article>
  );
}
