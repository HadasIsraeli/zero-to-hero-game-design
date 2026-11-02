import { Link } from 'react-router';
import { course } from '@content/course.manifest';
import styles from './pages.module.css';

export function NotFound() {
  return (
    <>
      <title>{`Page not found · ${course.title}`}</title>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.lead}>This level or lesson doesn&apos;t exist (yet).</p>
      <Link to="/">Back to the level map</Link>
    </>
  );
}

export default NotFound;
