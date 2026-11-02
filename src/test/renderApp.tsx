import { createMemoryRouter, RouterProvider } from 'react-router';
import { expect } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import { course } from '@content/course.manifest';
import { routes } from '@app/router';
import {
  createProgressStore,
  emptyProgress,
  memoryAdapter,
  ProgressProvider,
  type ProgressState,
} from '@features/progress';

/** Renders the whole app at `path` with in-memory progress, already loaded. */
export async function renderApp(path: string, progress: Partial<ProgressState> = {}) {
  const storage = memoryAdapter({ ...emptyProgress(), ...progress });
  const store = createProgressStore({ storage, course });
  await store.getState().hydrate();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const screen = await render(
    <ProgressProvider storage={storage} course={course} store={store}>
      <RouterProvider router={router} />
    </ProgressProvider>,
  );
  return { screen, router, store, storage };
}

/** Really scrolls the end-of-lesson marker into view, as a reader would. */
export async function scrollToLessonEnd(screen: RenderResult) {
  const marker = screen.getByTestId('lesson-end');
  await expect.element(marker).toBeInTheDocument();
  marker.element().scrollIntoView();
}
