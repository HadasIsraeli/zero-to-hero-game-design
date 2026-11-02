// @vitest-environment node
// Every diagram listed in assets/media.json must exist on disk, or the copied build would 404.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseMediaFile } from '../src/shared/lib/media-schema.ts';

const assets = new URL('../assets/', import.meta.url);
const file = parseMediaFile(JSON.parse(readFileSync(new URL('media.json', assets), 'utf8')));
const diagrams = file.levels
  .flatMap((level) => level.media)
  .filter((item) => item.type === 'diagram');

describe('every diagram in assets/media.json', () => {
  it.each(diagrams.map((item) => [item.id, item.file]))('%s exists at assets/%s', (_, path) => {
    expect(existsSync(new URL(path, assets))).toBe(true);
  });
});
