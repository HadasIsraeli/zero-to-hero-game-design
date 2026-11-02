import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MediaView } from '@shared/lib/media';
import { Media } from './Media';

// Whether a real video embeds depends on media-check.generated.json, so the view is stubbed here.
const views: Record<string, MediaView> = {
  embedded: {
    kind: 'video',
    id: 'embedded',
    title: 'The Art of Screenshake',
    embedUrl: 'https://www.youtube-nocookie.com/embed/AJdEqssNZ-U',
  },
  unchecked: {
    kind: 'card',
    id: 'unchecked',
    title: 'Juice it or lose it',
    href: 'https://www.youtube.com/watch?v=clRfPR9X91E&t=3551s',
    label: 'Video',
  },
};

vi.mock('@shared/lib/media', () => ({
  getMedia: (id: string) => ({ id }),
  toMediaView: ({ id }: { id: string }) => views[id],
}));

describe('<Media> videos', () => {
  it('embeds a playable video lazily from youtube-nocookie, labelled by its title', () => {
    render(<Media id="embedded" />);
    const frame = screen.getByTitle('The Art of Screenshake');
    expect(frame.tagName).toBe('IFRAME');
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame.getAttribute('src')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  });

  it('shows an unchecked video as a link card instead of an embed', () => {
    render(<Media id="unchecked" />);
    expect(screen.queryByTitle('Juice it or lose it')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Juice it or lose it/ })).toHaveTextContent('Video');
  });
});
