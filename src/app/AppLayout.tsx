import { Suspense } from 'react';
import { Link, Outlet, ScrollRestoration } from 'react-router';
import { course } from '@content/course.manifest';
import { BadgeToast, HeaderProgress, LevelUpDialog } from '@features/progress';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          {course.title}
        </Link>
        <HeaderProgress />
      </header>
      <main id="main" className={styles.main} tabIndex={-1}>
        <Suspense fallback={<p className={styles.loading}>Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <LevelUpDialog />
      <BadgeToast />
      <ScrollRestoration />
    </>
  );
}
