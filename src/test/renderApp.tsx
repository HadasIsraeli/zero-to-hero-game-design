import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { course } from '@content/course.manifest';
import { routes } from '@app/router';
import {
  createProgressStore,
  emptyProgress,
  memoryAdapter,
  ProgressProvider,
  type ProgressState,
} from '@features/progress';

/**
 * Renders the whole app at `path` with in-memory progress, already loaded, so tests don't
 * depend on when the provider's hydrate effect runs.
 */
export async function renderApp(path: string, progress: Partial<ProgressState> = {}) {
  const storage = memoryAdapter({ ...emptyProgress(), ...progress });
  const store = createProgressStore({ storage, course });
  await store.getState().hydrate();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <ProgressProvider storage={storage} course={course} store={store}>
      <RouterProvider router={router} />
    </ProgressProvider>,
  );
  return { router, store, storage };
}
