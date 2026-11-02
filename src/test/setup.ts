import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { installBrowserFakes } from './browserFakes';

// Node-environment tests (scripts/) have no window.
if (typeof window !== 'undefined') {
  beforeEach(() => {
    installBrowserFakes();
    window.localStorage.clear();
  });
}

afterEach(() => {
  cleanup();
});
