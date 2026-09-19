import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const skillDirs = () =>
  readdirSync(join(root, 'skills'))
    .filter((d) => statSync(join(root, 'skills', d)).isDirectory())
    .sort();

export const readText = (file) => readFileSync(file, 'utf8');

export function* walk(base, tops) {
  for (const top of tops) {
    const start = join(base, top);
    if (!existsSync(start)) continue;
    const stack = [start];
    while (stack.length) {
      const dir = stack.pop();
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else yield full;
      }
    }
  }
}
