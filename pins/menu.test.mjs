// The pins over the menu's two shapes. `doc-index.md` declares menu=all (it lists every living doc, the
// repository has no other index) or menu=curated (it lists the docs the seats read; the repository's own
// index lists every doc). The doctor holds each shape to its own rule: an all-menu may not miss a living
// doc; a curated menu may leave docs out but every doc it names meets the loop's standard. Each behaviour
// has a control that shows the opposite reading fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, readText } from './support.mjs';

const doctor = join(root, 'skills', 'init', 'scripts', 'doctor.mjs');
const STANDARD = ['patterns/codegen.md', 'patterns/state-management.md', 'patterns/ui-style-guide.md', 'patterns/design-tokens.md', 'patterns/long-running-workflows.md', 'infrastructure/realtime-events.md', 'infrastructure/background-work.md'];
const FLOOR = ['code-organization', 'backend-patterns', 'frontend-patterns', 'testing'];
const doc = (status, { keyFiles = true, related = '' } = {}) => `---\nstatus: ${status}\n${related}last_verified: today\n---\n\n# A doc\n\n> One line.\n\n## Overview\n\nText.\n${keyFiles ? '\n## Key Files\n\n| File | Purpose |\n|---|---|\n' : ''}`;

// A repository the doctor can read end to end, with a menu whose top and rows the test chooses.
function repoWith({ shapeLine, rows, docs, index }) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-menu-'));
  for (const f of ['_meta', 'research', 'working', 'archive', 'guides', 'patterns', 'infrastructure', 'features']) {
    mkdirSync(join(dir, 'docs', f), { recursive: true });
    if (f !== '_meta') writeFileSync(join(dir, 'docs', f, 'README.md'), `# ${f}/\n`);
  }
  for (const name of ['docs-workflow.md', 'engineering-loop.md']) cpSync(join(root, 'references', name), join(dir, 'docs', '_meta', name));
  for (const p of FLOOR) writeFileSync(join(dir, 'docs', 'patterns', `${p}.md`), doc('current'));
  for (const [p, text] of Object.entries(docs)) writeFileSync(join(dir, 'docs', p), text);
  if (index) writeFileSync(join(dir, index), '# Every doc\n');
  writeFileSync(join(dir, 'docs', '_meta', 'doc-index.md'), [
    '# Doc Index', '', '> The menu.', ...(shapeLine ? [shapeLine] : []), '',
    '| Doc | When to read |', '|---|---|', ...rows, '',
    '## Role reading lists', '', '| Doc | What it gives the seat | backend | frontend | mixed |', '|---|---|---|---|---|',
    ...STANDARD.map((p) => `| \`${p}\` | not detected — none here | | | |`), '',
    '## Apps and their build commands', '', '| App | Path | Test | Production build |', '|---|---|---|---|', '| app | . | npm test | npm run build |', '',
    '## The evidence tools', '', '| Script | What it proves | Read with |', '|---|---|---|', '| `verify-staged` | the staged list | testing |', '',
  ].join('\n'));
  return dir;
}
function runDoctor(dir) {
  try { return { code: 0, out: execFileSync(process.execPath, [doctor, dir], { encoding: 'utf8', timeout: 60000 }) }; }
  catch (e) { return { code: e.status, out: `${e.stdout ?? ''}${e.stderr ?? ''}` }; }
}
const rowFor = (out, subject) => out.split('\n').find((l) => l.includes(`| ${subject} `)) ?? '';
const floorRows = FLOOR.map((p) => `| [${p}](../patterns/${p}.md) | the floor |`);

test('a curated menu: every doc it names is held to the loop\'s standard, and a doc it leaves out is not its concern', () => {
  const dir = repoWith({
    shapeLine: '<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->',
    index: 'docs/INDEX.md',
    rows: ['| [good](../features/good.md) | meets it |', '| [drafty](../features/drafty.md) | a draft |', '| [nokeys](../features/nokeys.md) | no Key Files |'],
    docs: { 'features/good.md': doc('stable'), 'features/drafty.md': doc('draft'), 'features/nokeys.md': doc('stable', { keyFiles: false }), 'features/unlisted.md': doc('stable') },
  });
  try {
    const { code, out } = runDoctor(dir);
    assert.equal(code, 0, out);
    assert.match(rowFor(out, 'menu shape'), /ok .*menu=curated; index=docs\/INDEX\.md/, out);
    assert.match(rowFor(out, 'menu: docs/features/good.md'), /ok .*meets the loop's standard/);
    assert.match(rowFor(out, 'menu: docs/features/drafty.md'), /DEGRADE .*status draft/);
    assert.match(rowFor(out, 'menu: docs/features/nokeys.md'), /DEGRADE .*no ## Key Files/);
    assert.equal(rowFor(out, 'menu: docs/features/unlisted.md'), '', 'a curated menu leaves docs out on purpose');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a curated doc names its code in either form: a ## Key Files section, or a frontmatter related_files list', () => {
  const dir = repoWith({
    shapeLine: '<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->',
    index: 'docs/INDEX.md',
    rows: ['| [listed](../features/listed.md) | a block list |', '| [inline](../features/inline.md) | an inline list |'],
    docs: {
      'features/listed.md': doc('stable', { keyFiles: false, related: 'related_files:\n  - src/app/feature.ts\n  - src/app/feature.spec.ts\n' }),
      'features/inline.md': doc('stable', { keyFiles: false, related: 'related_files: [src/app/other.ts]\n' }),
    },
  });
  try {
    const out = runDoctor(dir).out;
    assert.match(rowFor(out, 'menu: docs/features/listed.md'), /ok .*meets the loop's standard/, out);
    assert.match(rowFor(out, 'menu: docs/features/inline.md'), /ok .*meets the loop's standard/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CONTROL: an empty related_files list names no code', () => {
  const dir = repoWith({
    shapeLine: '<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->',
    index: 'docs/INDEX.md',
    rows: ['| [empty](../features/empty.md) | an empty list |'],
    docs: { 'features/empty.md': doc('stable', { keyFiles: false, related: 'related_files: []\n' }) },
  });
  try {
    assert.match(rowFor(runDoctor(dir).out, 'menu: docs/features/empty.md'), /DEGRADE .*names no code/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CONTROL: an all-menu flags the same unlisted doc, and names every living doc when nothing is missing', () => {
  const dir = repoWith({ shapeLine: '<!-- naswerks-loop: menu=all -->', rows: [...floorRows, '| [good](../features/good.md) | a feature |'], docs: { 'features/good.md': doc('stable'), 'features/unlisted.md': doc('stable') } });
  try {
    const out = runDoctor(dir).out;
    assert.match(rowFor(out, 'menu shape'), /ok .*menu=all/);
    assert.match(rowFor(out, 'menu: docs/features/unlisted.md'), /DEGRADE .*a living doc the menu does not name/);
    assert.equal(rowFor(out, 'menu: docs/features/good.md'), '', 'an all-menu does not grade the docs it names');
  } finally { rmSync(dir, { recursive: true, force: true }); }
  const whole = repoWith({ shapeLine: null, rows: [...floorRows, '| [good](../features/good.md) | a feature |'], docs: { 'features/good.md': doc('stable') } });
  try {
    const out = runDoctor(whole).out;
    assert.match(rowFor(out, 'menu shape'), /ok .*menu=all \(no shape line: the default\)/);
    assert.match(rowFor(out, 'menu entries'), /ok .*names every living doc \(5\), each present/);
  } finally { rmSync(whole, { recursive: true, force: true }); }
});

test('a doc the menu names must exist in either shape; a row saying not detected is exempt', () => {
  for (const shapeLine of ['<!-- naswerks-loop: menu=all -->', '<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->']) {
    const dir = repoWith({ shapeLine, index: 'docs/INDEX.md', rows: [...floorRows, '| [gone](../features/gone.md) | moved away |'], docs: {} });
    try {
      const { code, out } = runDoctor(dir);
      assert.equal(code, 1, 'a dead path on the menu stops the loop');
      assert.match(rowFor(out, 'menu: docs/features/gone.md'), /FAIL .*does not exist/);
      assert.equal(rowFor(out, 'menu: docs/patterns/codegen.md'), '', 'the not-detected rows name absent docs on purpose');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
});

test('CONTROL: an unknown shape FAILs; a curated menu with no index, or a missing one, degrades', () => {
  const cases = [
    ['<!-- naswerks-loop: menu=some -->', null, /FAIL .*menu=some is not a shape the loop knows/],
    ['<!-- naswerks-loop: menu=curated -->', null, /DEGRADE .*names no index/],
    ['<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->', null, /DEGRADE .*does not exist/],
  ];
  for (const [shapeLine, index, expect] of cases) {
    const dir = repoWith({ shapeLine, index, rows: floorRows, docs: {} });
    try {
      assert.match(rowFor(runDoctor(dir).out, 'menu shape'), expect);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
});

test('the menu template declares menu=all, and the map, init and docs-process all speak both shapes', () => {
  assert.ok(readText(join(root, 'templates', 'docs', '_meta', 'doc-index.md')).includes('<!-- naswerks-loop: menu=all -->'));
  const map = readText(join(root, 'references', 'docs-workflow.md'));
  for (const needle of ['<!-- naswerks-loop: menu=all -->', '<!-- naswerks-loop: menu=curated; index={path} -->', "**The loop's standard for a doc on a curated menu:**"]) {
    assert.ok(map.includes(needle), `docs-workflow.md lacks ${needle}`);
  }
  for (const skill of ['init', 'docs-process', 'docs-status', 'docs-audit-full']) {
    const text = readText(join(root, 'skills', skill, 'SKILL.md'));
    assert.ok(/menu=all/.test(text) && /menu=curated/.test(text), `skills/${skill}/SKILL.md does not speak both shapes`);
  }
});
