import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types';
import { use } from 'react';
import type { Lesson } from '@content/course.manifest';
import { Media } from '@shared/ui';
import { loadLesson } from './loadLesson';
import styles from './lessons.module.css';

/** Components every lesson can use without importing them. */
const lessonComponents: MDXComponents = { Media };

/** Renders a lesson's MDX. Suspends while its chunk loads; wrap in <Suspense>. */
export function LessonContent({ lesson }: { lesson: Lesson }) {
  const { default: Content } = use(loadLesson(lesson));
  return (
    <div className={styles.prose}>
      <MDXProvider components={lessonComponents}>
        <Content />
      </MDXProvider>
    </div>
  );
}
