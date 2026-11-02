import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { XPBar } from './XPBar';

describe('<XPBar>', () => {
  it('exposes progress to assistive technology', async () => {
    const screen = await render(<XPBar value={40} max={150} label="XP to next rank" />);
    const bar = screen.getByRole('progressbar', { name: 'XP to next rank' });
    await expect.element(bar).toHaveAttribute('aria-valuenow', '40');
    await expect.element(bar).toHaveAttribute('aria-valuemax', '150');
    await expect.element(bar).toHaveAttribute('aria-valuetext', '40 of 150 XP');
  });

  it('reads as full at the top rank', async () => {
    const screen = await render(<XPBar value={300} max={null} label="Top rank reached" />);
    await expect
      .element(screen.getByRole('progressbar'))
      .toHaveAttribute('aria-valuetext', '300 XP, top rank');
  });
});
