import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DURATION_MS = 600;

type RollingNumberProps = {
  value: number;
  /** Where the first roll starts; defaults to `value` (no roll on mount). */
  from?: number;
};

/** Counts up (or down) to `value` with an ease-out roll; jumps instantly under reduced motion. */
export function RollingNumber({ value, from: initial = value }: RollingNumberProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? value : initial);
  const from = useRef(initial);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (reducedMotion || start === value) {
      const frame = requestAnimationFrame(() => {
        setShown(value);
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }

    const startedAt = performance.now();
    let frame = requestAnimationFrame(function tick(time) {
      const t = Math.min(1, (time - startedAt) / DURATION_MS);
      const eased = 1 - (1 - t) ** 3;
      setShown(Math.round(start + (value - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [value, reducedMotion]);

  // Screen readers get the real value straight away; the roll is visual only.
  return (
    <>
      <span aria-hidden="true">{shown}</span>
      <span className="visually-hidden">{value}</span>
    </>
  );
}
