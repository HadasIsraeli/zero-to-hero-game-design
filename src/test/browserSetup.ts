import { beforeEach } from 'vitest';
import { commands } from 'vitest/browser';

declare module 'vitest/browser' {
  interface BrowserCommands {
    /** Turns `prefers-reduced-motion: reduce` on or off for this test page. */
    setReducedMotion: (reduce: boolean) => Promise<void>;
  }
}

beforeEach(async () => {
  window.localStorage.clear();
  window.scrollTo(0, 0);
  await commands.setReducedMotion(false);
});
