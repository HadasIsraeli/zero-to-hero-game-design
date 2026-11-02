import { Suspense } from 'react';
import { Link, useParams } from 'react-router';
import { course } from '@content/course.manifest';
import {
  findLesson,
  LessonActivityProvider,
  LessonContent,
  LessonNav,
  lessonNeighbours,
  levelPath,
  useLessonGate,
} from '@features/lessons';
import { CompleteLessonButton, lessonId, useProgress } from '@features/progress';
import { NotFound } from './NotFoundPage';
import styles from './pages.module.css';

export default function LessonPage() {
  const params = useParams();
  const ref = findLesson(course, params.level, params.lesson);
  const recordToyResult = useProgress((state) => state.recordToyResult);
  if (!ref) return <NotFound />;

  const { level, lesson } = ref;
  const { previous, next } = lessonNeighbours(course, ref);
  const id = lessonId(level.level, lesson.slug);

  return (
    <article>
      <title>{`${lesson.title} · ${course.title}`}</title>
      <Link className={styles.eyebrow} to={levelPath(level)}>
        Level {level.level}: {level.title}
      </Link>
      <h1 className={styles.title}>{lesson.title}</h1>
      {/* Keyed so toys and "reached the end" reset when moving to another lesson. */}
      <LessonActivityProvider
        key={id}
        onActivityComplete={(toyId, result) => {
          recordToyResult(toyId, result);
        }}
      >
        <Suspense fallback={<p className={styles.muted}>Loading lesson…</p>}>
          <LessonContent lesson={lesson} />
        </Suspense>
        <LessonCompletion lessonId={id} />
      </LessonActivityProvider>
      <LessonNav previous={previous} next={next} />
    </article>
  );
}

function LessonCompletion({ lessonId }: { lessonId: string }) {
  return <CompleteLessonButton lessonId={lessonId} gate={useLessonGate()} />;
}
