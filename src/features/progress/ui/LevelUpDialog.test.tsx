import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { setReducedMotion } from '../../../test/browserFakes';
import { testCourse } from '../model/fixtures';
import { emptyProgress } from '../model/state';
import { ProgressProvider } from '../ProgressProvider';
import { memoryAdapter } from '../storage/memoryAdapter';
import { createProgressStore } from '../store';
import { LevelUpDialog } from './LevelUpDialog';

async function renderAndRankUp() {
  const storage = memoryAdapter({ ...emptyProgress(), xp: 60 });
  const store = createProgressStore({ storage, course: testCourse });
  render(
    <ProgressProvider storage={storage} course={testCourse} store={store}>
      <button type="button">Somewhere else</button>
      <LevelUpDialog />
    </ProgressProvider>,
  );
  await act(() => store.getState().hydrate());
  act(() => {
    store.getState().completeLesson('0/a1'); // 60 + 50 → rank 2
  });
  return store;
}

describe('<LevelUpDialog>', () => {
  it('opens on a rank-up and names the new rank', async () => {
    await renderAndRankUp();
    const dialog = screen.getByRole('dialog', { name: /Rank 2 · Apprentice/ });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByTestId('particle-burst')).toBeInTheDocument();
  });

  it('closes and clears the celebration from its button', async () => {
    const store = await renderAndRankUp();
    await userEvent.click(screen.getByRole('button', { name: 'Keep going' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(store.getState().celebrations.some((c) => c.kind === 'rank-up')).toBe(false);
  });

  it('skips the particle burst under reduced motion but still celebrates', async () => {
    setReducedMotion(true);
    await renderAndRankUp();
    expect(screen.getByRole('dialog', { name: /Rank 2/ })).toBeInTheDocument();
    expect(screen.queryByTestId('particle-burst')).not.toBeInTheDocument();
  });
});
