#!/usr/bin/env node
// refresh — bring a repository's copies of the two method docs up to this pack version by writing ONLY their
// repository-owned sections and the stamp. Every other line is left exactly as it is: the loop text in a
// copy is the repository's, whatever it has done to it. Dry run by default; --write applies the rows it
// printed. Node >= 22, no dependencies. Usage: node refresh.mjs [repo-root] [--write]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OWNED, STAMP, compareVersions, linesOf, bare, eolOf, h2Index, findSection, railsItems, stampIndex, mapOf } from './owned.mjs';

const args = process.argv.slice(2);
const write = args.includes('--write');
const repo = resolve(args.find((a) => !a.startsWith('--')) || process.cwd());
const packRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const packVersion = JSON.parse(readFileSync(join(packRoot, '.claude-plugin', 'plugin.json'), 'utf8')).version;
const packText = (file) => readFileSync(join(packRoot, 'references', file), 'utf8').replace(/\r\n/g, '\n');

const rows = [];
const row = (file, subject, action) => rows.push({ file, subject, action });
let changedFiles = 0;

console.log(`init refresh — ${repo} — pack ${packVersion}`);
console.log('writes only the repository-owned sections and the stamp; every other line is left as it is.\n');

for (const file of ['docs-workflow.md', 'engineering-loop.md']) {
  const path = join(repo, 'docs', '_meta', file);
  const shown = `docs/_meta/${file}`;
  if (!existsSync(path)) { row(shown, '(file)', 'missing — `init` writes it; refresh only updates a copy that exists'); continue; }
  const original = readFileSync(path, 'utf8');
  const eol = eolOf(original);
  let lines = linesOf(original);
  const sIdx = stampIndex(lines);
  if (sIdx < 0) { row(shown, '(file)', 'no naswerks-loop stamp on its first line — not recognised as a copy of the method doc; nothing written'); continue; }

  const packLines = linesOf(packText(file));
  const withEol = (text) => text.replace(/\r?\n/g, eol);
  let changed = false;

  for (const space of OWNED.filter((o) => o.file === file)) {
    const hs = h2Index(lines);
    const present = hs.find((h) => h.heading === space.heading);
    if (present) {
      row(shown, space.heading, 'kept — yours, byte for byte');
    } else {
      const was = hs.find((h) => space.earlier.includes(h.heading));
      if (was) {
        const raw = lines[was.i];
        lines[was.i] = space.heading + raw.slice(bare(raw).length);
        row(shown, space.heading, `heading marked — was "${was.heading}"; only that line changes`);
        changed = true;
      } else {
        // Insert the pack's own section before the first pack heading after it that this copy also has.
        const pack = findSection(packLines, space.heading);
        const packHs = h2Index(packLines);
        const after = packHs.filter((h) => h.i > pack.start).map((h) => h.heading);
        const anchor = after.map((h) => hs.find((c) => c.heading === h)).find(Boolean);
        const chunk = linesOf(withEol(packLines.slice(pack.start, pack.end).join('')));
        if (anchor) {
          lines.splice(anchor.i, 0, ...chunk);
          row(shown, space.heading, `added — the pack's default, before "${anchor.heading}"`);
        } else {
          if (lines.length && !/\n$/.test(lines[lines.length - 1])) lines[lines.length - 1] += eol;
          lines.push(eol, ...chunk);
          row(shown, space.heading, 'added — the pack\'s default, at the end of the file');
        }
        changed = true;
      }
    }

    // The rails: a bullet this version names that the copy's section lacks is appended as its absent-line.
    if (space.heading.includes('rails')) {
      const packSec = findSection(packLines, space.heading);
      const packItems = railsItems(packLines.slice(packSec.start, packSec.end));
      const sec = findSection(lines, space.heading);
      const have = railsItems(lines.slice(sec.start, sec.end)).map((it) => it.name.toLowerCase());
      const missing = packItems.filter((it) => !have.includes(it.name.toLowerCase()));
      if (missing.length) {
        let at = sec.end;
        while (at > sec.start + 1 && bare(lines[at - 1]).trim() === '') at--;
        if (!/\n$/.test(lines[at - 1])) lines[at - 1] += eol;
        const add = [];
        if (!have.length) add.push(eol);
        for (const it of missing) add.push(...linesOf(withEol(it.text)));
        lines.splice(at, 0, ...add);
        for (const it of missing) row(shown, `rails item: ${it.name}`, 'item added — its absent-line, at the end of the section');
        changed = true;
      }
    }
  }

  // The stamp names the pack version whose repository-owned sections this copy carries.
  const stampAt = stampIndex(lines);
  const current = STAMP.exec(bare(lines[stampAt]))[2];
  const cmp = compareVersions(current, packVersion);
  if (cmp < 0) {
    const raw = lines[stampAt];
    const bom = raw.startsWith('﻿') ? '﻿' : '';
    lines[stampAt] = bom + raw.slice(bom.length).replace(STAMP, `$1${packVersion}$3`);
    row(shown, 'stamp', `${current} to ${packVersion}`);
    changed = true;
  } else if (cmp > 0) row(shown, 'stamp', `${current} — ahead of this pack; left as it is`);
  else row(shown, 'stamp', `${current} — current`);

  if (changed) {
    changedFiles++;
    if (write) writeFileSync(path, lines.join(''));
  }
}

const width = Math.max(...rows.map((r) => r.subject.length), 7);
const fw = Math.max(...rows.map((r) => r.file.length), 4);
console.log(`| ${'file'.padEnd(fw)} | ${'section'.padEnd(width)} | action |`);
console.log(`|${'-'.repeat(fw + 2)}|${'-'.repeat(width + 2)}|--------|`);
for (const r of rows) console.log(`| ${r.file.padEnd(fw)} | ${r.subject.padEnd(width)} | ${r.action} |`);

const map = mapOf(packText('docs-workflow.md'));
if (Object.keys(map).length) {
  console.log('\nyours — what this version\'s skills read from each section (check that yours answers each), and the');
  console.log('loop passages that echo it (rewrite them too if you replaced the section):');
  for (const space of OWNED) {
    const m = map[space.title];
    if (m) console.log(`- ${space.title}: reads ${m.reads}${m.echoed && m.echoed !== '—' ? `; echoed in ${m.echoed}` : ''}`);
  }
}

console.log(`\nloop text — not touched. The pack's own is in ${join(packRoot, 'references').replace(/\\/g, '/')}/ to compare.`);
if (!changedFiles) console.log('\nnothing to do — every section present, every stamp current.');
else if (write) console.log(`\nwritten — ${changedFiles} file(s), exactly the rows above.`);
else console.log('\ndry run — nothing written. Run again with --write to apply exactly the rows above.');
