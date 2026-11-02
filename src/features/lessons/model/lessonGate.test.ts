import { describe, expect, it } from 'vitest';
import { GATE_HINTS, lessonGate } from './lessonGate';

describe('lessonGate', () => {
  describe('a lesson without toys', () => {
    it('waits for the reader to reach the end', () => {
      expect(lessonGate({ activities: {}, reachedEnd: false })).toEqual({
        ready: false,
        hint: GATE_HINTS.reading,
      });
    });

    it('is ready once the end is reached', () => {
      expect(lessonGate({ activities: {}, reachedEnd: true })).toEqual({ ready: true });
    });
  });

  describe('a lesson with toys', () => {
    it('waits for the toy even if the reader reached the end', () => {
      expect(lessonGate({ activities: { slider: false }, reachedEnd: true })).toEqual({
        ready: false,
        hint: GATE_HINTS.activity,
      });
    });

    it('waits until every toy has completed', () => {
      expect(lessonGate({ activities: { a: true, b: false }, reachedEnd: true }).ready).toBe(false);
    });

    it('is ready once every toy has completed, without needing the end', () => {
      expect(lessonGate({ activities: { a: true, b: true }, reachedEnd: false })).toEqual({
        ready: true,
      });
    });
  });
});
