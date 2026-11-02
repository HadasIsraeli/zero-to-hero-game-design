import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  GATE_HINTS,
  LessonActivityProvider,
  LessonEndMarker,
  useLessonActivity,
  useLessonGate,
} from '@features/lessons';
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

/** A tall lesson, so its end starts below the fold and has to be scrolled to. */
async function renderLesson({
  withToy,
  saved,
}: {
  withToy: boolean;
  saved?: Partial<ProgressState>;
}) {
  const storage = memoryAdapter({ ...emptyProgress(), ...saved });
  const store = createProgressStore({ storage, course: testCourse });
  await store.getState().hydrate();
  const screen = await render(
    <ProgressProvider storage={storage} course={testCourse} store={store}>
      <LessonActivityProvider
        onActivityComplete={(toyId, result) => store.getState().recordToyResult(toyId, result)}
      >
        {withToy && <FakeToy />}
        <Gated />
        <p style={{ height: '200vh' }}>Lesson text</p>
        <LessonEndMarker />
      </LessonActivityProvider>
    </ProgressProvider>,
  );
  const scrollToEnd = () => {
    screen.getByTestId('lesson-end').element().scrollIntoView();
  };
  return { screen, store, scrollToEnd };
}

describe('<CompleteLessonButton> in a lesson with a toy', () => {
  it('stays disabled with a hint until the toy reports onComplete', async () => {
    const { screen, store, scrollToEnd } = await renderLesson({ withToy: true });
    const complete = screen.getByRole('button', { name: 'Complete lesson' });
    await expect.element(complete).toBeDisabled();
    await expect.element(complete).toHaveAccessibleDescription(GATE_HINTS.activity);

    // Reaching the end of the text is not enough while a toy is unfinished.
    scrollToEnd();
    await expect.element(complete).toBeDisabled();

    await screen.getByRole('button', { name: 'Finish toy' }).click();
    await expect.element(complete).toBeEnabled();
    await expect.element(screen.getByText(GATE_HINTS.activity)).not.toBeInTheDocument();
    expect(store.getState().progress.completedToys['fake-toy']).toMatchObject({ score: 7 });
  });

  it('completes the lesson and awards XP once enabled', async () => {
    const { screen, store } = await renderLesson({ withToy: true });
    await screen.getByRole('button', { name: 'Finish toy' }).click();
    await screen.getByRole('button', { name: 'Complete lesson' }).click();

    await expect.element(screen.getByRole('status')).toMatchTextContent(/Lesson completed \+50 XP/);
    expect(store.getState().progress.completedLessons).toEqual(['0/a1']);
    expect(store.getState().progress.xp).toBe(80); // toy 30 + lesson 50
  });
});

describe('<CompleteLessonButton> in a lesson without a toy', () => {
  it('stays disabled with a hint until the reader reaches the end', async () => {
    const { screen, scrollToEnd } = await renderLesson({ withToy: false });
    const complete = screen.getByRole('button', { name: 'Complete lesson' });
    await expect.element(complete).toBeDisabled();
    await expect.element(complete).toHaveAccessibleDescription(GATE_HINTS.reading);

    scrollToEnd();
    await expect.element(complete).toBeEnabled();
  });
});

describe('<CompleteLessonButton> for a completed lesson', () => {
  it('shows the lesson as completed instead of a button', async () => {
    const { screen } = await renderLesson({
      withToy: false,
      saved: { completedLessons: ['0/a1'] },
    });
    await expect.element(screen.getByRole('status')).toMatchTextContent(/Lesson completed/);
    await expect
      .element(screen.getByRole('button', { name: 'Complete lesson' }))
      .not.toBeInTheDocument();
  });
});
