import { Link } from 'react-router';
import { course } from '@content/course.manifest';
import { lessonPath } from '@features/lessons';
import { courseProgress, type ModuleStatus } from '../model/skillTree';
import { useProgress } from '../progressContext';
import styles from './progress.module.css';

const STATUS_LABEL: Record<ModuleStatus, string> = {
  complete: 'complete',
  'in-progress': 'in progress',
  'not-started': 'not started',
  'coming-soon': 'coming soon',
};

/** Every level as a row of module nodes that light up as lessons are completed. */
export function SkillTree() {
  const progress = useProgress((state) => state.progress);
  const levels = courseProgress(course, progress);

  return (
    <div className={styles.tree}>
      {levels.map(({ level, completed, total, modules }) => (
        <section
          key={level.level}
          className={styles.treeLevel}
          aria-labelledby={`tree-${String(level.level)}`}
        >
          <h3 id={`tree-${String(level.level)}`} className={styles.treeTitle}>
            Level {level.level} · {level.title}
            <span className={styles.treeCount}>
              {total > 0 ? `${String(completed)} / ${String(total)} lessons` : 'Coming soon'}
            </span>
          </h3>
          <ol className={styles.treeModules}>
            {modules.map((module) => {
              const node = (
                <>
                  <span className={styles.node} data-status={module.status} aria-hidden="true" />
                  <span className={styles.nodeLabel}>{module.title}</span>
                  <span className="visually-hidden">, {STATUS_LABEL[module.status]}</span>
                </>
              );
              return (
                <li key={module.title} className={styles.treeModule}>
                  {module.nextLesson ? (
                    <Link
                      className={styles.nodeLink}
                      to={lessonPath({ level, lesson: module.nextLesson })}
                    >
                      {node}
                    </Link>
                  ) : (
                    <span className={styles.nodeLink}>{node}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
