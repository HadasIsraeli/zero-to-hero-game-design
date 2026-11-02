// `npm run media:check`: looks up every YouTube id in assets/media.json with YouTube's
// oEmbed endpoint, prints a pass/fail table, and records results for the app in
// src/shared/lib/media-check.generated.json. Unverified videos that fail render as link cards.
import { readFile, writeFile } from 'node:fs/promises';
import { parseMediaFile } from '../src/shared/lib/media-schema.ts';
import { checkVideo, formatTable, toCheckFile, youtubeItems } from './media-check.lib.ts';

const mediaPath = new URL('../assets/media.json', import.meta.url);
const outputPath = new URL('../src/shared/lib/media-check.generated.json', import.meta.url);

const file = parseMediaFile(JSON.parse(await readFile(mediaPath, 'utf8')));
const rows = await Promise.all(youtubeItems(file).map((item) => checkVideo(item, fetch)));

console.log(formatTable(rows));
await writeFile(outputPath, `${JSON.stringify(toCheckFile(rows, new Date()), null, 2)}\n`);

const failed = rows.filter((row) => !row.ok);
if (failed.length > 0) {
  console.error(
    `\n${String(failed.length)} of ${String(rows.length)} videos failed. They will show as link cards.` +
      `\nFix their youtubeId in assets/media.json, then run npm run media:check again:` +
      failed.map((row) => `\n  - ${row.id} (${row.youtubeId}): ${row.detail}`).join(''),
  );
  process.exitCode = 1;
} else {
  console.log(`\nAll ${String(rows.length)} videos passed.`);
}
