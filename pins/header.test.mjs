// The pins over the repository-owned sections: the four spaces in the two method docs where a repository
// writes its own formats. The skills name a section and the concept they need from it and never state the
// format; one grep lists the spaces and nothing else; the doctor reads a doc's status from whichever header
// form the repository writes, and reports a space a copy lacks. Each behaviour has a control that shows the
// opposite reading fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, skillDirs, readText } from './support.mjs';
import { OWNED, GREP, MARKED, FIND_FORMAT, linesOf, findSection } from '../skills/init/scripts/owned.mjs';

const doctor = join(root, 'skills', 'init', 'scripts', 'doctor.mjs');
const skill = (dir) => readText(join(root, 'skills', dir, 'SKILL.md'));
const reference = (name) => readText(join(root, 'references', name));
const flat = (text) => text.replace(/\s+/g, ' ');
const sectionText = (text, heading) => {
  const lines = linesOf(text.replace(/\r\n/g, '\n'));
  const s = findSection(lines, heading);
  return s ? lines.slice(s.start, s.end).join('') : null;
};

// ── the census: what a skill must never spell, because it is the repository's to write ──────────────
const Spelled = /<!-- meta:|\blineage=|\bstatus=(?:current|wip|draft|shipped|final|stale)\b|\bverified=|Last verified(?! against)|archive\/\{topic\}|docs\/archive\/\{/;

function spelledIn(dir) {
  const found = [];
  skill(dir).split(/\r?\n/).forEach((line, i) => {
    const m = Spelled.exec(line);
    if (m) found.push(`skills/${dir}/SKILL.md:${i + 1} "${m[0]}"`);
  });
  return found;
}

test('no skill spells the loop\'s own header, status words, verified date or archive destination', () => {
  assert.deepEqual(skillDirs().flatMap(spelledIn), [], 'a skill states a format the repository is meant to own');
});

test('CONTROL: the census fires on each thing a skill must not spell, and passes the concept words', () => {
  for (const planted of ['emit <!-- meta: type=working -->', 'set lineage=3', 'at status=current', 'at status=final', 'verified=today', 'bump its Last verified date', 'into archive/{topic}/', 'to docs/archive/{topic}/x']) {
    assert.ok(Spelled.test(planted), `must fire on: ${planted}`);
  }
  for (const ok of ['the word for `current`', 'the verified date', '**Last verified against:** {date}', 'the archive home § The archive convention (repository-owned) names']) {
    assert.ok(!Spelled.test(ok), `must pass: ${ok}`);
  }
});

// ── the find-format line: every skill that needs a format carries it, verbatim ────────────────────────
const NEEDS_A_FORMAT = ['docs-write', 'docs-process', 'docs-status', 'docs-backlog', 'docs-audit-feature', 'docs-audit-full', 'spec-pipeline', 'spec-parent', 'spec-review', 'spec-retro', 'spec-seat', 'init'];
const lacksTheLine = (dirs, read) => dirs.filter((d) => !read(d).includes(FIND_FORMAT));

test('every skill that needs a format carries the find-format line verbatim, and so does every skill that names a section', () => {
  assert.deepEqual(lacksTheLine(NEEDS_A_FORMAT, skill), []);
  assert.deepEqual(lacksTheLine(skillDirs().filter((d) => /\(repository-owned\)/.test(skill(d))), skill), []);
  assert.ok(FIND_FORMAT.includes(GREP), 'the line carries the one grep');
});

test('CONTROL: a skill with the line deleted is caught', () => {
  const read = (d) => (d === 'docs-write' ? skill(d).replace(FIND_FORMAT, '') : skill(d));
  assert.deepEqual(lacksTheLine(NEEDS_A_FORMAT, read), ['docs-write']);
});

// ── citations: a skill cites a space by its exact heading, and nothing inside it ──────────────────────
const TITLES = OWNED.map((o) => o.title);
const Cited = /§ ([A-Z][A-Za-z' ]{2,40}?) \(repository-owned\)/g;
const ShortForm = new RegExp(`§ (${TITLES.join('|')})(?! \\(repository-owned\\))`, 'g');

function badCitations(text) {
  const bad = [];
  for (const m of flat(text).matchAll(Cited)) if (!TITLES.includes(m[1])) bad.push(`§ ${m[1]}`);
  for (const m of flat(text).matchAll(ShortForm)) bad.push(`§ ${m[1]} without its (repository-owned)`);
  return bad;
}

test('skills cite a repository-owned section only by its exact heading', () => {
  const bad = skillDirs().flatMap((d) => badCitations(skill(d)).map((b) => `skills/${d}/SKILL.md: ${b}`));
  assert.deepEqual(bad, []);
});

test('CONTROL: a citation of an unknown section or a short form is caught', () => {
  assert.deepEqual(badCitations('the header § Doc metadata (repository-owned) prescribes'), []);
  assert.equal(badCitations('see § Header rules (repository-owned)').length, 1);
  assert.equal(badCitations('where § The archive convention says').length, 1);
});

// The parts of the two spaces a skill might be tempted to quote — their sub-headings and bold lead-ins. An
// adopter who replaces a space keeps its heading, not its insides, so a skill that quotes one dangles.
function partsOf(heading) {
  const text = sectionText(reference('docs-workflow.md'), heading) ?? '';
  const cores = [];
  let fenced = false;
  for (const line of text.split('\n').slice(1)) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const h3 = /^### (.+)$/.exec(line);
    const lead = /^(?:- )?\*\*(.+?)\*\*/.exec(line);
    const raw = h3 ? h3[1] : lead ? lead[1] : null;
    if (!raw) continue;
    const core = raw.split(/ \(| —|[.:]\s*$/)[0].replace(/[.:]$/, '').trim();
    if (core.length >= 4) cores.push(core);
  }
  return cores;
}
const quotes = (text, core) => text.includes(`"${core}`) || text.includes(`\`${core}\``) || text.includes(`“${core}`);

test('no skill quotes a sub-heading or lead-in from inside The archive convention or Doc metadata', () => {
  const cores = [...partsOf('## The archive convention (repository-owned)'), ...partsOf('## Doc metadata (repository-owned)')];
  assert.ok(cores.includes('Two topic-folder shapes') && cores.includes('Follow-on pipelines'), 'the parts were read from the reference');
  const found = [];
  for (const d of skillDirs()) for (const c of cores) if (quotes(flat(skill(d)), c)) found.push(`skills/${d}/SKILL.md quotes "${c}"`);
  assert.deepEqual(found, []);
});

test('CONTROL: a quoted part is caught', () => {
  assert.ok(quotes('pick the shape (see "Two topic-folder shapes" in docs-workflow.md)', 'Two topic-folder shapes'));
  assert.ok(quotes('See the section named `Follow-on pipelines`', 'Follow-on pipelines'));
  assert.ok(!quotes('file it where the archive convention says', 'Two topic-folder shapes'));
});

// ── the loop's states: every "word for `X`" a skill names is a state the map lists ─────────────────────
const statesOf = (text) => new Set([...(sectionText(text, '## The repository-owned sections') ?? '').matchAll(/^\| `([a-z]+)` \|/gm)].map((m) => m[1]));
const unknownStates = (text, states) => [...flat(text).matchAll(/word for `([a-z]+)`/g)].map((m) => m[1]).filter((w) => !states.has(w));

test('every loop state a skill names is one the map in docs-workflow.md lists', () => {
  const states = statesOf(reference('docs-workflow.md'));
  assert.deepEqual([...states].sort(), ['current', 'draft', 'shipped', 'wip']);
  const bad = skillDirs().flatMap((d) => unknownStates(skill(d), states).map((w) => `skills/${d}/SKILL.md: ${w}`));
  assert.deepEqual(bad, []);
});

test('CONTROL: a state the map does not list is caught', () => {
  assert.deepEqual(unknownStates('at the word for `final`', new Set(['draft', 'wip', 'current', 'shipped'])), ['final']);
});

// ── the one grep: exactly the four spaces, whole H2 sections, and every document cites it ────────────
const markedIn = (texts) => Object.entries(texts).flatMap(([name, t]) => t.split(/\r?\n/).filter((l) => MARKED.test(l)).map((l) => `${name}|${l.trim()}`));
const Partial = /^#+ .*\(repository-owned:/;

test('one grep lists exactly the four repository-owned sections, each a whole H2, and the documents cite it', () => {
  const texts = { 'docs-workflow.md': reference('docs-workflow.md'), 'engineering-loop.md': reference('engineering-loop.md') };
  assert.deepEqual(markedIn(texts).sort(), OWNED.map((o) => `${o.file}|${o.heading}`).sort());
  assert.ok(OWNED.every((o) => o.heading.startsWith('## ')), 'every space is an H2');
  for (const [name, t] of Object.entries(texts)) assert.ok(!t.split(/\r?\n/).some((l) => Partial.test(l)), `${name} carries a partial marker`);
  for (const f of ['references/docs-workflow.md', 'references/engineering-loop.md', 'README.md']) {
    assert.ok(readText(join(root, f)).includes(GREP), `${f} does not cite the one grep`);
  }
});

test('CONTROL: a fifth marked heading and a partial marker are both caught', () => {
  const texts = { 'docs-workflow.md': reference('docs-workflow.md') + '\n## Our extras (repository-owned)\n', 'engineering-loop.md': reference('engineering-loop.md') };
  assert.equal(markedIn(texts).length, OWNED.length + 1);
  assert.ok(Partial.test('### Where a rule lives (repository-owned: the POLICY row)'));
});

// ── templates: each header instruction names the section and carries the blockquote-date clause ──────
test('every drafted template takes its header from § Doc metadata and drops the blockquote date where that section keeps none', () => {
  const bad = [];
  for (const group of ['patterns', 'infrastructure']) {
    for (const f of readdirSync(join(root, 'templates', 'docs', group))) {
      const t = readText(join(root, 'templates', 'docs', group, f));
      if (!t.includes('§ Doc metadata (repository-owned)') || !t.includes('drop the `Last verified {today}.` above')) bad.push(`templates/docs/${group}/${f}`);
    }
  }
  assert.deepEqual(bad, []);
});

// ── the doctor ──────────────────────────────────────────────────────────────────────────────────────
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
const editMeta = (dir, name, fn) => { const p = join(dir, 'docs', '_meta', name); writeFileSync(p, fn(readFileSync(p, 'utf8'))); };

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

test('a stamp a patch behind the pack is current; a stamp a minor behind degrades', () => {
  const pack = JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8')).version;
  const [major, minor] = pack.split('.').map((x) => parseInt(x, 10));
  const restampTo = (dir, v) => editMeta(dir, 'docs-workflow.md', (t) => t.replace(/version=[0-9][^ ]*/, `version=${v}`));
  const dir = fixture(meta('current'));
  try {
    restampTo(dir, `${major}.${minor}.0`);
    assert.match(rowFor(runDoctor(dir).out, 'docs/_meta/docs-workflow.md'), /ok .*stamp/);
    if (minor > 0) {
      restampTo(dir, `${major}.${minor - 1}.9`);
      assert.match(rowFor(runDoctor(dir).out, 'docs/_meta/docs-workflow.md'), /DEGRADE .*behind the pack/);
    }
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

test('the doctor finds each repository-owned section by its heading, and names init refresh for one that is unmarked or missing', () => {
  const dir = fixture(meta('current'));
  try {
    let out = runDoctor(dir).out;
    for (const o of OWNED) assert.match(rowFor(out, `docs/_meta/${o.file} ${o.heading}`), /ok .*present/, out);
    editMeta(dir, 'docs-workflow.md', (t) => t.replace('## Templates (repository-owned)\n', '## Templates\n'));
    editMeta(dir, 'engineering-loop.md', (t) => {
      const lines = linesOf(t);
      const s = findSection(lines, OWNED[3].heading);
      return [...lines.slice(0, s.start), ...lines.slice(s.end)].join('');
    });
    const { code, out: after } = runDoctor(dir);
    out = after;
    assert.equal(code, 0, 'a space a copy lacks degrades the copy; it does not stop the loop');
    assert.match(rowFor(out, 'docs/_meta/docs-workflow.md ## Templates (repository-owned)'), /DEGRADE .*unmarked .*init refresh marks it/);
    assert.match(rowFor(out, "docs/_meta/engineering-loop.md ## This repository's rails (repository-owned)"), /DEGRADE .*missing .*init refresh adds it/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the doctor reads the rails: an item still carrying its absent-line is DEGRADE, a recorded one is ok, a missing one is DEGRADE', () => {
  const dir = fixture(meta('current'));
  try {
    let out = runDoctor(dir).out;
    assert.match(rowFor(out, 'rails: Policy'), /DEGRADE .*still the absent-line/);
    editMeta(dir, 'engineering-loop.md', (t) => t
      .replace(/- \*\*Policy\.\*\* No policy document recorded[^\n]*\n[^\n]*\n/, '- **Policy.** The team handbook, reached through CLAUDE.md.\n')
      .replace(/- \*\*Staging\.\*\* No staging rule recorded[^\n]*\n[^\n]*\n/, ''));
    out = runDoctor(dir).out;
    assert.match(rowFor(out, 'rails: Policy'), /ok .*recorded/);
    assert.match(rowFor(out, 'rails: Staging'), /DEGRADE .*missing .*init refresh adds it/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
