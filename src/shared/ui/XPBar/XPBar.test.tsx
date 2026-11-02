import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { XPBar } from './XPBar';

describe('<XPBar>', () => {
  it('exposes progress to assistive technology', () => {
    render(<XPBar value={40} max={150} label="XP to next rank" />);
    const bar = screen.getByRole('progressbar', { name: 'XP to next rank' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '150');
    expect(bar).toHaveAttribute('aria-valuetext', '40 of 150 XP');
  });

  it('reads as full at the top rank', () => {
    render(<XPBar value={300} max={null} label="Top rank reached" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '300 XP, top rank');
  });
});
