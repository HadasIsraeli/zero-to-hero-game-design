/** What a toy reports when the learner has done what it asks. */
export type ToyResult = {
  /** Optional toy-specific score, saved with progress. */
  score?: number;
};

/** The one contract every toy implements (see CLAUDE.md). */
export type ToyProps = {
  onComplete: (result: ToyResult) => void;
};
