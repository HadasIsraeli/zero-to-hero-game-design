import rawMedia from '@assets/media.json';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closestIds, createMediaLibrary, getMedia, getMediaForLevel, getUnityTrack } from './media';
import { parseMediaFile, type MediaCheckFile, type MediaFile } from './media-schema';

const noChecks: MediaCheckFile = { checkedAt: null, results: {} };

const fixture: MediaFile = {
  version: 1,
  levels: [
    {
      level: 0,
      title: 'Press Start',
      media: [
        { id: 'loop', type: 'diagram', file: 'images/diagrams/loop.svg', alt: 'A loop.' },
        {
          id: 'paper',
          type: 'pdf',
          title: 'A paper',
          url: 'https://example.com/paper.pdf',
          verified: true,
        },
        {
          id: 'page',
          type: 'link',
          title: 'A page',
          url: 'https://example.com/',
          source: 'Example',
          verified: true,
        },
        {
          id: 'talk',
          type: 'youtube',
          title: 'A talk',
          youtubeId: 'abcdefghijk',
          start: 90,
          verified: false,
        },
        {
          id: 'trusted-talk',
          type: 'youtube',
          title: 'A trusted talk',
          youtubeId: 'zyxwvutsrqp',
          verified: true,
        },
      ],
    },
  ],
  unityTrack: [],
};

function withMedia(media: unknown[]): unknown {
  return { version: 1, levels: [{ level: 0, title: 'Press Start', media }], unityTrack: [] };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('parseMediaFile', () => {
  it('accepts the real assets/media.json', () => {
    expect(() => parseMediaFile(rawMedia)).not.toThrow();
  });

  it('rejects duplicate ids', () => {
    const page = { id: 'dup', type: 'link', title: 'x', url: 'https://a.com', verified: true };
    expect(() => parseMediaFile(withMedia([page, page]))).toThrow(/Duplicate media id "dup"/);
  });

  it('rejects a diagram without alt text', () => {
    const diagram = { id: 'd', type: 'diagram', file: 'images/diagrams/d.svg' };
    expect(() => parseMediaFile(withMedia([diagram]))).toThrow(/alt/);
  });

  it('rejects an unknown media type', () => {
    expect(() => parseMediaFile(withMedia([{ id: 'x', type: 'podcast' }]))).toThrow(/type/);
  });

  it('rejects misspelled fields instead of silently dropping them', () => {
    const video = {
      id: 'v',
      type: 'youtube',
      title: 'x',
      youtubeID: 'abcdefghijk',
      verified: false,
    };
    expect(() => parseMediaFile(withMedia([video]))).toThrow(/youtubeID|youtubeId/);
  });
});

describe('media library', () => {
  const library = createMediaLibrary(fixture, noChecks);

  it('finds an item by id', () => {
    expect(library.getMedia('paper')).toMatchObject({ type: 'pdf', title: 'A paper' });
  });

  it('throws in dev for an unknown id and suggests close matches', () => {
    expect(() => library.getMedia('lop')).toThrow(/Unknown media id "lop".*loop/);
  });

  it('logs and returns undefined in production for an unknown id', () => {
    vi.stubEnv('DEV', false);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(library.getMedia('nope')).toBeUndefined();
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Unknown media id "nope"'));
  });

  it('lists media for a level, and nothing for an unknown level', () => {
    expect(library.getMediaForLevel(0).map((item) => item.id)).toEqual([
      'loop',
      'paper',
      'page',
      'talk',
      'trusted-talk',
    ]);
    expect(library.getMediaForLevel(9)).toEqual([]);
  });
});

describe('toMediaView', () => {
  const view = (id: string, checks = noChecks) => {
    const library = createMediaLibrary(fixture, checks);
    const item = library.getMedia(id);
    if (!item) throw new Error(`fixture is missing ${id}`);
    return library.toMediaView(item);
  };

  it('serves diagrams from the copied assets folder', () => {
    expect(view('loop')).toEqual({
      kind: 'image',
      id: 'loop',
      src: '/assets/images/diagrams/loop.svg',
      alt: 'A loop.',
    });
  });

  it('renders pdfs and links as cards', () => {
    expect(view('paper')).toMatchObject({ kind: 'card', label: 'PDF' });
    expect(view('page')).toMatchObject({ kind: 'card', label: 'Link', source: 'Example' });
  });

  it('embeds hand-verified videos with youtube-nocookie', () => {
    expect(view('trusted-talk')).toMatchObject({
      kind: 'video',
      embedUrl: 'https://www.youtube-nocookie.com/embed/zyxwvutsrqp',
    });
  });

  it('falls back to a watch-link card for an unverified video that has not passed the check', () => {
    expect(view('talk')).toMatchObject({
      kind: 'card',
      label: 'Video',
      href: 'https://www.youtube.com/watch?v=abcdefghijk&t=90s',
    });
  });

  it('embeds an unverified video that passed the check, keeping its start time', () => {
    const passed: MediaCheckFile = {
      checkedAt: '2026-11-02T00:00:00.000Z',
      results: { talk: { youtubeId: 'abcdefghijk', ok: true, detail: '' } },
    };
    expect(view('talk', passed)).toMatchObject({
      kind: 'video',
      embedUrl: 'https://www.youtube-nocookie.com/embed/abcdefghijk?start=90',
    });
  });

  it('ignores a passing check recorded for a different youtubeId', () => {
    const stale: MediaCheckFile = {
      checkedAt: '2026-11-02T00:00:00.000Z',
      results: { talk: { youtubeId: 'oldoldoldol', ok: true, detail: '' } },
    };
    expect(view('talk', stale)).toMatchObject({ kind: 'card' });
  });
});

describe('closestIds', () => {
  it('ranks near matches and drops distant ones', () => {
    expect(closestIds('mda-diagrm', ['mda-paper', 'mda-diagram', 'flow-diagram'])).toEqual([
      'mda-diagram',
    ]);
    expect(closestIds('mda-papr', ['mda-paper', 'mda-diagram'])).toEqual(['mda-paper']);
    expect(closestIds('zzz', ['mda-diagram'])).toEqual([]);
  });
});

describe('default library', () => {
  it('loads the real media file', () => {
    expect(getMedia('mda-diagram')).toMatchObject({ type: 'diagram' });
    expect(getMediaForLevel(0).length).toBeGreaterThan(0);
    expect(getUnityTrack().map((item) => item.id)).toContain('unity-essentials');
  });
});
