import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { course } from '@content/course.manifest';
import { allLessons, loadLesson } from '@features/lessons';
import { revealObserved } from '../test/browserFakes';
import { renderApp } from '../test/renderApp';

// Kept in its own file: in router.test.tsx, an earlier test's lazy-page navigation leaves
// React's act() scheduling stuck in jsdom, so effects in later tests never run. Each Vitest
// file gets fresh React state. The same flow runs in a real browser in e2e/course.spec.ts.

beforeAll(async () => {
  await Promise.all([
    import('./routes/LessonPage'),
    ...allLessons(course).map(({ lesson }) => loadLesson(lesson)),
  ]);
}, 30_000);

describe('completing a lesson', () => {
  it('completes a lesson after reading to the end, updating rank XP and badges', async () => {
    const { store } = await renderApp('/level/0/what-is-a-game');
    await screen.findByRole('img', { name: /Act, feedback, reward/ });
    const complete = screen.getByRole('button', { name: 'Complete lesson' });
    expect(complete).toBeDisabled();

    // The end marker's observer starts in an effect, which may run just after the first paint.
    await waitFor(() => {
      revealObserved();
      expect(complete).toBeEnabled();
    });
    await userEvent.click(complete);

    expect(screen.getByRole('progressbar', { name: 'XP to next rank' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );
    expect(await screen.findByText('First Steps')).toBeInTheDocument();
    expect(store.getState().progress.completedLessons).toEqual(['0/what-is-a-game']);
  });
});
