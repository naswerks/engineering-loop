// The pins over the loop's own preferences. The method documents state one way of running the loop,
// opinionated on purpose, and they keep stating it concretely inside their repository-owned sections: a
// repository that replaces a section needs something real to replace, and one that keeps it needs the
// loop's own format written out. An edit that generalizes a preference away fails here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { root, readText } from './support.mjs';
import { linesOf, findSection } from '../skills/init/scripts/owned.mjs';

// Each preference, by the document and section that states it, and the words that state it.
const PREFERENCES = [
  ['docs-workflow.md', '## Doc metadata (repository-owned)', [
    '<!-- meta: type=', '| Key | Values | Notes |', '### The `## Lineage` footer', '### Obsidian interop',
  ]],
  ['docs-workflow.md', '## The archive convention (repository-owned)', [
    'archive/{topic}/', '- **Flat (no specs)**', '- **Split (has specs)**', '**Follow-on pipelines',
  ]],
  ['docs-workflow.md', '## Templates (repository-owned)', [
    '<!-- meta: type=working;', '<!-- meta: type=spec;', 'Topic folder: `archive/{topic}/`',
  ]],
  ['docs-workflow.md', '## Conventions', [
    'a one-line `<!-- meta: … -->` header',
  ]],
];

function missing(read) {
  const out = [];
  for (const [file, heading, needles] of PREFERENCES) {
    const lines = linesOf(read(file).replace(/\r\n/g, '\n'));
    const s = findSection(lines, heading);
    const body = s ? lines.slice(s.start, s.end).join('') : '';
    for (const n of needles) if (!body.includes(n)) out.push(`${file} ${heading}: ${n}`);
  }
  return out;
}
const reference = (file) => readText(join(root, 'references', file));

test('the references keep the loop\'s own preferences, stated concretely in the sections that declare them', () => {
  assert.deepEqual(missing(reference), []);
});

test('CONTROL: stripping any one preference is caught', () => {
  for (const [file, heading, needles] of PREFERENCES) {
    for (const n of needles) {
      const stripped = (f) => (f === file ? reference(f).split(n).join('') : reference(f));
      assert.ok(missing(stripped).includes(`${file} ${heading}: ${n}`), `stripping "${n}" must be caught`);
    }
  }
});
