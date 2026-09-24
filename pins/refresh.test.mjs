// The pins over `init refresh`: it writes only a repository's repository-owned sections and the version
// stamp into its copies of the method documents, and every other line comes back byte for byte — the loop
// text in a copy is the repository's, whatever it has done to it. Each behaviour has a control.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root } from './support.mjs';
import { OWNED, linesOf, findSection, railsItems } from '../skills/init/scripts/owned.mjs';

const refresh = join(root, 'skills', 'init', 'scripts', 'refresh.mjs');
const packVersion = JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8')).version;
const reference = (name) => readFileSync(join(root, 'references', name), 'utf8');
const RAILS = OWNED.find((o) => o.heading.includes('rails')).heading;

function repoWith(files) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-refresh-'));
  mkdirSync(join(dir, 'docs', '_meta'), { recursive: true });
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, 'docs', '_meta', name), text);
  return dir;
}
const run = (dir, ...args) => execFileSync(process.execPath, [refresh, dir, ...args], { encoding: 'utf8', timeout: 60000 });
const read = (dir, name) => readFileSync(join(dir, 'docs', '_meta', name), 'utf8');
const without = (text, heading) => {
  const lines = linesOf(text);
  const s = findSection(lines, heading);
  return [...lines.slice(0, s.start), ...lines.slice(s.end)].join('');
};
const restamp = (text, v) => text.replace(/version=[0-9][^ ]*/, `version=${v}`);

// A copy taken before the sections were marked: the pack's own text, headings unmarked, no rails, stamp behind.
function oldShape() {
  let workflow = restamp(reference('docs-workflow.md'), '0.2.1');
  for (const o of OWNED.filter((x) => x.file === 'docs-workflow.md')) workflow = workflow.replace(`${o.heading}\n`, `${o.earlier[0]}\n`);
  return { 'docs-workflow.md': workflow, 'engineering-loop.md': without(restamp(reference('engineering-loop.md'), '0.2.1'), RAILS) };
}

test('an old copy: refresh marks the headings, adds the rails in place and restamps — and a dry run writes nothing', () => {
  const before = oldShape();
  const dir = repoWith(before);
  try {
    const dry = run(dir);
    assert.match(dry, /writes only the repository-owned sections and the stamp; every other line is left as it is/);
    assert.match(dry, /heading marked — was "## Doc metadata \(header \+ lineage\)"/);
    assert.match(dry, /added — the pack's default, before "## Two loops/);
    assert.match(dry, /dry run — nothing written/);
    assert.equal(read(dir, 'docs-workflow.md'), before['docs-workflow.md']);
    assert.equal(read(dir, 'engineering-loop.md'), before['engineering-loop.md']);
    run(dir, '--write');
    assert.equal(read(dir, 'docs-workflow.md'), reference('docs-workflow.md'), 'only the three headings and the stamp moved');
    assert.equal(read(dir, 'engineering-loop.md'), reference('engineering-loop.md'), 'the rails landed where the pack has them');
    assert.match(run(dir), /nothing to do/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// A copy a repository has made its own: sections rewritten in its words, its loop text edited, CRLF line
// endings, a frontmatter block above the stamp, and five of the rails' six items recorded.
function adopterShape() {
  const wfLines = linesOf(restamp(reference('docs-workflow.md'), '0.3.0'));
  const dm = findSection(wfLines, '## Doc metadata (repository-owned)');
  let workflow = [
    ...wfLines.slice(0, dm.start),
    '## Doc metadata (repository-owned)\n', '\n',
    'Every doc opens with a YAML frontmatter block: `status` (stable, draft, deprecated) and `last_verified`.\n', '\n',
    ...wfLines.slice(dm.end),
  ].join('');
  workflow = workflow.replace('together into archive/{topic}/', "together into the feature's folder");
  workflow = `---\ntitle: Docs Workflow\n---\n\n${workflow}`.replace(/\n/g, '\r\n');

  const elLines = linesOf(restamp(reference('engineering-loop.md'), '0.3.0'));
  const rs = findSection(elLines, RAILS);
  const engineering = [
    ...elLines.slice(0, rs.start),
    `${RAILS}\n`, '\n',
    '- **Policy.** The team handbook, reached through CLAUDE.md.\n',
    '- **Gates a commit passes.** A pre-commit hook runs the linter.\n',
    '- **Before a PR.** The full suite.\n',
    '- **Where a PR goes.** `develop`, from a `feature/*` branch.\n',
    '- **Staging.** Explicit paths.\n', '\n',
    ...elLines.slice(rs.end),
  ].join('');
  return { 'docs-workflow.md': workflow, 'engineering-loop.md': engineering };
}

test('an adopted copy: every rewritten section and local edit survives byte for byte; the rails gain only the missing item; the stamp moves', () => {
  const before = adopterShape();
  const dir = repoWith(before);
  try {
    const dry = run(dir);
    assert.match(dry, /## Doc metadata \(repository-owned\) *\| kept — yours, byte for byte/);
    assert.match(dry, /rails item: Skills a seat meets here/);
    run(dir, '--write');
    assert.equal(read(dir, 'docs-workflow.md'), before['docs-workflow.md'].replace('version=0.3.0', `version=${packVersion}`), 'only the stamp moved');
    const packLines = linesOf(reference('engineering-loop.md'));
    const ps = findSection(packLines, RAILS);
    const skillsItem = railsItems(packLines.slice(ps.start, ps.end)).find((it) => it.name === 'Skills a seat meets here').text;
    const expected = before['engineering-loop.md']
      .replace('version=0.3.0', `version=${packVersion}`)
      .replace('- **Staging.** Explicit paths.\n', `- **Staging.** Explicit paths.\n${skillsItem}`);
    assert.equal(read(dir, 'engineering-loop.md'), expected, 'one rails item appended, the stamp moved, nothing else');
    assert.match(run(dir), /nothing to do/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CONTROL: the pack\'s loop text never crosses into a copy, and a file that is not a stamped copy is never written', () => {
  const before = adopterShape();
  const dir = repoWith({ ...before, 'engineering-loop.md': '# Our own engineering notes\n\nNothing loop-shaped here.\n' });
  try {
    run(dir, '--write');
    const after = read(dir, 'docs-workflow.md');
    assert.ok(after.includes("together into the feature's folder"), 'the copy keeps its own loop text');
    assert.ok(!after.includes('together into archive/{topic}/'), 'the pack\'s loop text did not replace it');
    assert.equal(read(dir, 'engineering-loop.md'), '# Our own engineering notes\n\nNothing loop-shaped here.\n');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
