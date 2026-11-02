import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import styles from './routes/pages.module.css';

export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <main className={styles.page}>
      <title>Something broke · Game Design: Zero to Hero</title>
      <h1 className={styles.title}>Something broke</h1>
      <pre className={styles.error}>{message}</pre>
      <Link to="/">Back to the level map</Link>
    </main>
  );
}
