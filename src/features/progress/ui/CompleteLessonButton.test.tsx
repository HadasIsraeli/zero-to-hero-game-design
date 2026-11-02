import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  GATE_HINTS,
  LessonActivityProvider,
  LessonEndMarker,
  useLessonActivity,
  useLessonGate,
} from '@features/lessons';
import { revealObserved } from '../../../test/browserFakes';
import { testCourse } from '../model/fixtures';
import { emptyProgress, type ProgressState } from '../model/state';
import { ProgressProvider } from '../ProgressProvider';
import { memoryAdapter } from '../storage/memoryAdapter';
import { createProgressStore } from '../store';
import { CompleteLessonButton } from './CompleteLessonButton';

function FakeToy() {
  const { onComplete } = useLessonActivity('fake-toy');
  return (
    <button
      type="button"
      onClick={() => {
        onComplete({ score: 7 });
      }}
    >
      Finish toy
    </button>
  );
}

function Gated() {
  return <CompleteLessonButton lessonId="0/a1" gate={useLessonGate()} />;
}

function renderLesson({ withToy, saved }: { withToy: boolean; saved?: Partial<ProgressState> }) {
  const storage = memoryAdapter({ ...emptyProgress(), ...saved });
  const store = createProgressStore({ storage, course: testCourse });
  render(
    <ProgressProvider storage={storage} course={testCourse} store={store}>
      <LessonActivityProvider
        onActivityComplete={(toyId, result) => store.getState().recordToyResult(toyId, result)}
      >
        <p>Lesson text</p>
        {withToy && <FakeToy />}
        <LessonEndMarker />
        <Gated />
      </LessonActivityProvider>
    </ProgressProvider>,
  );
  return store;
}

const completeButton = () => screen.getByRole('button', { name: 'Complete lesson' });

describe('<CompleteLessonButton> in a lesson with a toy', () => {
  it('stays disabled with a hint until the toy reports onComplete', async () => {
    const store = renderLesson({ withToy: true });
    await screen.findByText(GATE_HINTS.activity);

    expect(completeButton()).toBeDisabled();
    expect(completeButton()).toHaveAccessibleDescription(
      'Finish the activity to complete this lesson',
    );

    // Reaching the end of the text is not enough while a toy is unfinished.
    revealObserved();
    expect(completeButton()).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Finish toy' }));
    expect(completeButton()).toBeEnabled();
    expect(screen.queryByText(GATE_HINTS.activity)).not.toBeInTheDocument();
    expect(store.getState().progress.completedToys['fake-toy']).toMatchObject({ score: 7 });
  });

  it('completes the lesson and awards XP once enabled', async () => {
    const store = renderLesson({ withToy: true });
    await userEvent.click(await screen.findByRole('button', { name: 'Finish toy' }));
    await userEvent.click(completeButton());

    expect(screen.getByRole('status')).toHaveTextContent('Lesson completed +50 XP');
    expect(store.getState().progress.completedLessons).toEqual(['0/a1']);
    expect(store.getState().progress.xp).toBe(80); // toy 30 + lesson 50
  });
});

describe('<CompleteLessonButton> in a lesson without a toy', () => {
  it('stays disabled with a hint until the reader reaches the end', async () => {
    renderLesson({ withToy: false });
    await screen.findByText(GATE_HINTS.reading);
    expect(completeButton()).toBeDisabled();

    revealObserved();
    expect(completeButton()).toBeEnabled();
  });
});

describe('<CompleteLessonButton> for a completed lesson', () => {
  it('shows the lesson as completed instead of a button', async () => {
    renderLesson({ withToy: false, saved: { completedLessons: ['0/a1'] } });
    expect(await screen.findByRole('status')).toHaveTextContent('Lesson completed');
    expect(screen.queryByRole('button', { name: 'Complete lesson' })).not.toBeInTheDocument();
  });
});
