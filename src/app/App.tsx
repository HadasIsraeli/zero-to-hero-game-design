import { createBrowserRouter, RouterProvider } from 'react-router';
import { course } from '@content/course.manifest';
import { localStorageAdapter, ProgressProvider } from '@features/progress';
import { routes } from './router';

const router = createBrowserRouter(routes);
const storage = localStorageAdapter();

export function App() {
  return (
    <ProgressProvider storage={storage} course={course}>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
