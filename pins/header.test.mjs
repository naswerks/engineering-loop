// The pins over the doc header: the skills never state it themselves, they point at the repository's
// docs-workflow.md, whose repository-owned sections a repository rewrites to its own conventions; and the
// doctor reads a doc's status from whichever header form the repository writes, unaided by any config.
// Each behaviour has a control that shows the opposite reading fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, skillDirs, readText } from './support.mjs';

const doctor = join(root, 'skills', 'init', 'scripts', 'doctor.mjs');

// Skills that write a doc take its header from the repository's docs-workflow.md. A skill that spells the
// loop's own header out would keep writing it into a repository that has rewritten the section.
const WRITERS = ['docs-write', 'docs-process', 'docs-backlog', 'docs-audit-feature', 'docs-audit-full', 'docs-status', 'spec-pipeline', 'spec-parent', 'spec-review', 'init'];

test('no skill spells the metadata header out; the writers point at the repository-owned section instead', () => {
  const spelled = [];
  for (const dir of skillDirs()) {
    const text = readText(join(root, 'skills', dir, 'SKILL.md'));
    if (/<!-- meta:/.test(text)) spelled.push(`skills/${dir}/SKILL.md`);
  }
  assert.deepEqual(spelled, [], 'a skill states the header the repository is meant to own');
  for (const dir of WRITERS) {
    const text = readText(join(root, 'skills', dir, 'SKILL.md'));
    assert.ok(/repository-owned/.test(text), `skills/${dir}/SKILL.md names no repository-owned section`);
    assert.ok(/docs-workflow\.md/.test(text), `skills/${dir}/SKILL.md does not point at docs-workflow.md`);
  }
});

test('CONTROL: the header census fires on a planted header line and on a writer without the pointer', () => {
  assert.ok(/<!-- meta:/.test('emit one line: <!-- meta: type=working; status=wip -->'));
  assert.ok(!/repository-owned/.test('write the header the template shows'));
});

test('the method docs mark their repository-owned sections, and the marker is greppable', () => {
  for (const name of ['docs-workflow.md', 'engineering-loop.md']) {
    const text = readText(join(root, 'references', name));
    const marked = text.split('\n').filter((l) => /^##+ .*\(repository-owned\)/.test(l));
    assert.ok(marked.length >= 1, `references/${name} marks no section (repository-owned)`);
  }
  const workflow = readText(join(root, 'references', 'docs-workflow.md'));
  for (const heading of ['## The archive convention (repository-owned)', '## Doc metadata (repository-owned)', '## Templates (repository-owned)']) {
    assert.ok(workflow.includes(heading), `references/docs-workflow.md lacks "${heading}"`);
  }
});

// A minimal repository the doctor can read end to end.
function fixture(floorHeader, { workflowPrefix = '' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-doctor-'));
  for (const f of ['_meta', 'research', 'working', 'archive', 'guides', 'patterns', 'infrastructure', 'features']) {
    mkdirSync(join(dir, 'docs', f), { recursive: true });
    if (f !== '_meta') writeFileSync(join(dir, 'docs', f, 'README.md'), `# ${f}/\n`);
  }
  for (const name of ['docs-workflow.md', 'engineering-loop.md']) cpSync(join(root, 'references', name), join(dir, 'docs', '_meta', name));
  if (workflowPrefix) {
    const p = join(dir, 'docs', '_meta', 'docs-workflow.md');
    writeFileSync(p, workflowPrefix + readFileSync(p, 'utf8'));
  }
  const standard = ['patterns/codegen.md', 'patterns/state-management.md', 'patterns/ui-style-guide.md', 'patterns/design-tokens.md', 'patterns/long-running-workflows.md', 'infrastructure/realtime-events.md', 'infrastructure/background-work.md'];
  writeFileSync(join(dir, 'docs', '_meta', 'doc-index.md'), [
    '# Doc Index', '', '## Role reading lists', '', '| Doc | What it gives the seat | backend | frontend | mixed |', '|---|---|---|---|---|',
    ...standard.map((p) => `| \`${p}\` | not detected — the fixture has none | | | |`), '',
    '## Apps and their build commands', '', '| App | Path | Test | Production build |', '|---|---|---|---|', '| app | . | npm test | npm run build |', '',
    '## The evidence tools', '', '| Script | What it proves | Read with |', '|---|---|---|', '| `verify-staged` | the staged list | testing |', '',
  ].join('\n'));
  for (const p of ['code-organization', 'backend-patterns', 'frontend-patterns', 'testing']) writeFileSync(join(dir, 'docs', 'patterns', `${p}.md`), floorHeader(p));
  return dir;
}
function runDoctor(dir) {
  try { return { code: 0, out: execFileSync(process.execPath, [doctor, dir], { encoding: 'utf8', timeout: 60000 }) }; }
  catch (e) { return { code: e.status, out: `${e.stdout ?? ''}${e.stderr ?? ''}` }; }
}
const rowFor = (out, subject) => out.split('\n').find((l) => l.includes(`| ${subject}`)) ?? '';
const meta = (status) => (p) => `# ${p}\n\n> A doc.\n<!-- meta: type=pattern; status=${status}; verified=today; lineage=0 -->\n`;
const frontmatter = (status) => (p) => `---\ntitle: ${p}\nstatus: ${status}\nlast_verified: today\n---\n\n# ${p}\n\n> A doc.\n`;

test('the doctor reads status from the meta line and from a frontmatter block alike, with no configuration', () => {
  for (const [header, expect] of [[meta('current'), /ok .*status=current \(meta line\)/], [frontmatter('stable'), /ok .*status=stable \(frontmatter\)/]]) {
    const dir = fixture(header);
    try {
      const { code, out } = runDoctor(dir);
      assert.equal(code, 0, out);
      assert.match(rowFor(out, 'docs/patterns/testing.md'), expect, out);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
});

test('CONTROL: draft reads DEGRADE in both forms, and a doc with neither header reads DEGRADE', () => {
  for (const [header, expect] of [[meta('draft'), /DEGRADE .*status=draft/], [frontmatter('draft'), /DEGRADE .*status=draft/], [(p) => `# ${p}\n\n> A doc.\n`, /DEGRADE .*no status in either header form/]]) {
    const dir = fixture(header);
    try {
      assert.match(rowFor(runDoctor(dir).out, 'docs/patterns/testing.md'), expect);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
});

test('the version stamp is read after a leading frontmatter block, so a gate that requires one on every doc does not fail the method docs', () => {
  const dir = fixture(frontmatter('stable'), { workflowPrefix: '---\ntitle: Docs Workflow\nstatus: stable\n---\n\n' });
  try {
    const { code, out } = runDoctor(dir);
    assert.equal(code, 0, out);
    assert.match(rowFor(out, 'docs/_meta/docs-workflow.md'), /ok .*stamp/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CONTROL: a method doc with no stamp at all FAILs', () => {
  const dir = fixture(meta('current'));
  try {
    const p = join(dir, 'docs', '_meta', 'engineering-loop.md');
    writeFileSync(p, readFileSync(p, 'utf8').split('\n').slice(1).join('\n'));
    const { code, out } = runDoctor(dir);
    assert.equal(code, 1);
    assert.match(rowFor(out, 'docs/_meta/engineering-loop.md'), /FAIL .*no naswerks-loop stamp/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
