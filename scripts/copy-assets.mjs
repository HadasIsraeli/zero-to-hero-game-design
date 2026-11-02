// Mirrors assets/images into public/assets/images so assets/ stays the only folder to edit.
// Runs before `dev` and `build` (see package.json). The target is gitignored.
import { cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../assets/images/', import.meta.url));
const target = fileURLToPath(new URL('../public/assets/images/', import.meta.url));

await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });

console.log('copy-assets: assets/images -> public/assets/images');
