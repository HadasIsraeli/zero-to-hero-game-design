import type { RouteObject } from 'react-router';
import { AppLayout } from './AppLayout';
import { HomePage, LessonPage, LevelPage, NotFoundPage, ProgressPage } from './pages';
import { RouteError } from './RouteError';

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'level/:level', element: <LevelPage /> },
      { path: 'level/:level/:lesson', element: <LessonPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
