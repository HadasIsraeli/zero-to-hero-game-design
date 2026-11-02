import { lazy } from 'react';

// Each page is its own chunk; lessons are split further in the manifest.
export const HomePage = lazy(() => import('./routes/HomePage'));
export const LevelPage = lazy(() => import('./routes/LevelPage'));
export const LessonPage = lazy(() => import('./routes/LessonPage'));
export const NotFoundPage = lazy(() => import('./routes/NotFoundPage'));
export const ProgressPage = lazy(() => import('./routes/ProgressPage'));
