// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { YoutubeItem } from '../src/shared/lib/media-schema.ts';
import {
  checkVideo,
  formatTable,
  oembedUrl,
  toCheckFile,
  type CheckRow,
  type FetchLike,
} from './media-check.lib.ts';

const video: YoutubeItem = {
  id: 'art-of-screenshake',
  type: 'youtube',
  title: 'The Art of Screenshake',
  youtubeId: 'AJdEqssNZ-U',
  verified: false,
};

const respond =
  (status: number, body: unknown = {}): FetchLike =>
  () =>
    Promise.resolve({ ok: status === 200, status, json: () => Promise.resolve(body) });

describe('checkVideo', () => {
  it('passes when oEmbed knows the video, reporting its YouTube title', async () => {
    const row = await checkVideo(video, respond(200, { title: 'The Art of Screenshake' }));
    expect(row).toMatchObject({ ok: true, detail: 'YouTube title: The Art of Screenshake' });
  });

  it.each([
    [404, 'video not found'],
    [401, 'embedding disabled or video is private'],
    [500, 'unexpected response'],
  ])('fails on HTTP %i (%s)', async (status, reason) => {
    const row = await checkVideo(video, respond(status));
    expect(row).toMatchObject({ ok: false, detail: `HTTP ${String(status)}: ${reason}` });
  });

  it('fails on a network error instead of throwing', async () => {
    const row = await checkVideo(video, () => Promise.reject(new Error('offline')));
    expect(row).toMatchObject({ ok: false, detail: 'network error: offline' });
  });

  it('asks oEmbed about the watch URL for the id', () => {
    expect(oembedUrl('AJdEqssNZ-U')).toBe(
      'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAJdEqssNZ-U',
    );
  });
});

const rows: CheckRow[] = [
  { id: 'a', title: 'A', youtubeId: 'aaaaaaaaaaa', ok: true, detail: 'YouTube title: A' },
  {
    id: 'bb',
    title: 'B',
    youtubeId: 'bbbbbbbbbbb',
    ok: false,
    detail: 'HTTP 404: video not found',
  },
];

describe('toCheckFile', () => {
  it('records each result by media id with the youtubeId it was checked against', () => {
    expect(toCheckFile(rows, new Date('2026-11-02T10:00:00Z'))).toMatchObject({
      checkedAt: '2026-11-02T10:00:00.000Z',
      results: {
        a: { youtubeId: 'aaaaaaaaaaa', ok: true },
        bb: { youtubeId: 'bbbbbbbbbbb', ok: false },
      },
    });
  });
});

describe('formatTable', () => {
  it('prints an aligned pass/fail table', () => {
    expect(formatTable(rows)).toBe(
      [
        '      id  youtubeId    detail',
        'PASS  a   aaaaaaaaaaa  YouTube title: A',
        'FAIL  bb  bbbbbbbbbbb  HTTP 404: video not found',
      ].join('\n'),
    );
  });
});
