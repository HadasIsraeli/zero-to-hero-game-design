import { course } from '@content/course.manifest';
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.shell}>
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.subtitle}>Level 0 — Press Start. Coming soon.</p>
    </main>
  );
}
