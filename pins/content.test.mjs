// The pins over the skills' CONTENT: the pack describes a method for any repository, in current words,
// and every document a skill sends a reader to is one `init` can put there. Each census names the file
// and line it flags; each has a control that proves the regex fires on a planted line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, walk, readText } from './support.mjs';
import { KIND_SKILLS } from '../skills/init/scripts/owned.mjs';

// `bin` is content too: the witness tools are ported from a run's notes, and a private name that rode in
// with them would ship.
const CONTENT_FOLDERS = ['skills', 'references', 'templates', 'bin'];

function* contentFiles() {
  for (const file of walk(root, CONTENT_FOLDERS)) {
    if (/\.(md|mjs|json)$/.test(file)) yield file;
  }
}

function hits(regex, text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(regex);
    if (m) out.push({ line: i + 1, match: m[0], text: lines[i].trim().slice(0, 100) });
  }
  return out;
}

function census(regex) {
  const report = [];
  for (const file of contentFiles()) {
    for (const hit of hits(regex, readText(file))) {
      report.push(`${file.slice(root.length + 1)}:${hit.line} "${hit.match}" - ${hit.text}`);
    }
  }
  return report;
}

// A private product, a retired plane, an effort id, a dated incident: none of them describes a method.
const Banned =
  /nas-platform|NasBff|NasAgentOps|nas-bff|X-Worker|X-Nas-Session|agent-network|src\/web\/|\.ps1\b|\.nas\/|chain_rows|read_usage|_child\b|psql|pgvector|\bCK-\d|\bE1-\d|\bC1-\d|\bRWS-\d|\bHR-\d|\bCR-\d|\bSF-\d|\bLC-\d|chain-[0-9]|20[0-9]{2}-[0-9]{2}-[0-9]{2}|v1 PLANE/;

test('no private product, retired plane, effort id or dated incident anywhere in the content', () => {
  assert.deepEqual(census(Banned), []);
});

test('CONTROL: the ban fires on each class it names', () => {
  for (const planted of ['built for nas-platform', 'see CK-12', 'on 2026-09-19 the', 'run psql here', 'the v1 PLANE aside']) {
    assert.ok(Banned.test(planted), `the ban must fire on: ${planted}`);
  }
  assert.ok(!Banned.test('a repository the loop runs in'), 'and stay silent on ordinary prose');
});

// Glyphs: the periscope law, plus the four arrows the method docs used to carry.
const Glyph = /\p{Extended_Pictographic}|[☀-➿]|[⬀-⯿]|←|→|⇒|★|⚪|↔|↓|⟵|↳/u;

test('no emoji or symbol glyphs in the content', () => {
  assert.deepEqual(census(Glyph), []);
});

test('CONTROL: the glyph census fires on an emoji, an arrow and a check mark', () => {
  for (const planted of ['ready \u{1F4CB}', 'a → b', 'done ✅', 'so ↳ then']) {
    assert.ok(Glyph.test(planted), `must fire on: ${JSON.stringify(planted)}`);
  }
  assert.ok(!Glyph.test('plain words, an em dash —, and a middle dot ·'));
});

// An archive link into a specific effort is history; the loop's own destinations are not.
const ArchiveIntoAnEffort = /docs\/archive\/(?!audit\/|\{topic\}|\{[a-z-]+\}|'|$)[a-z0-9-]+\//;

test('no link into a specific archived effort (the loop names its destinations, never its history)', () => {
  assert.deepEqual(census(ArchiveIntoAnEffort), []);
});

test('CONTROL: the archive census fires on an effort folder and passes the destinations', () => {
  assert.ok(ArchiveIntoAnEffort.test('see docs/archive/chain-night-shift/sessions/x.md'));
  for (const allowed of ['docs/archive/{topic}/', 'docs/archive/audit/health-report-{date}.md', 'lands in docs/archive/ later']) {
    assert.ok(!ArchiveIntoAnEffort.test(allowed), `must pass: ${allowed}`);
  }
});

// A skill's text is loaded with its invocation's arguments substituted in: `$ARGUMENTS`, and `$0`, `$1`, …
// by position. A dollar sign written before a digit is therefore rewritten at load — "counts $0" reads
// "counts <the first argument>" to the session that invoked the skill with one. A skill spells an amount out.
const ArgumentToken = /\$(?:\d|ARGUMENTS\b)/;

function argumentTokenCensus() {
  const out = [];
  for (const file of walk(root, ['skills'])) {
    if (!file.endsWith('SKILL.md')) continue;
    for (const hit of hits(ArgumentToken, readText(file))) out.push(`${file.slice(root.length + 1)}:${hit.line} "${hit.match}" - ${hit.text}`);
  }
  return out;
}

test('no skill text carries a token its harness substitutes at load', () => {
  assert.deepEqual(argumentTokenCensus(), []);
});

test('CONTROL: the census fires on a dollar sign before a digit and on the arguments token, and passes a spelled-out amount', () => {
  for (const planted of ['uncosted turns count $0', 'about $12 a run', 'run it on $ARGUMENTS']) {
    assert.ok(ArgumentToken.test(planted), `must fire on: ${planted}`);
  }
  for (const allowed of ['an uncosted turn counts as nothing', 'about twelve dollars a run', 'a `${list}` in a template', 'the $ sign alone']) {
    assert.ok(!ArgumentToken.test(allowed), `must pass: ${allowed}`);
  }
});

// The gate a hosted seat's call passes reads the command the shell would run, so a skill that tells a seat
// the gate matches words sends it to police its echo labels and its searches for nothing.
const TextMatching = /matches (?:TEXT|text)\b|text-scanned|out of (?:any )?echo (?:text|label)|git-verb (?:words|vocabulary)/;

test('no skill says the gate matches words', () => {
  assert.deepEqual(census(TextMatching), []);
});

test('CONTROL: the census fires on each way the stale rule was written, and passes the rule as it stands', () => {
  for (const planted of ['the deny layer matches TEXT, not parsed verbs', 'the deny layer matches text', 'defeats every text-scanned rule', 'Keep the word "push" out of echo text', 'keep git-verb words out of any echo label']) {
    assert.ok(TextMatching.test(planted), `must fire on: ${planted}`);
  }
  assert.ok(!TextMatching.test('The gate reads the command the shell would run, not its words: an echo label is data'));
});

test('every docs path a skill or method doc names is one init creates', () => {
  const named = new Set();
  const pattern = /docs\/_meta\/[a-z-]+\.md|(?:patterns|infrastructure|guides|features)\/[a-z-]+\.md/g;
  for (const file of walk(root, ['skills', 'references'])) {
    if (!file.endsWith('.md')) continue;
    for (const m of readText(file).matchAll(pattern)) named.add(m[0]);
  }
  assert.ok(named.size >= 10, `expected the floor to be named; found ${named.size} paths`);
  const missing = [];
  for (const path of [...named].sort()) {
    const rel = path.startsWith('docs/') ? path.slice('docs/'.length) : path;
    const asTemplate = join(root, 'templates', 'docs', rel);
    const asReference = rel.startsWith('_meta/') ? join(root, 'references', rel.slice('_meta/'.length)) : null;
    if (existsSync(asTemplate)) continue;
    if (asReference !== null && existsSync(asReference)) continue;
    missing.push(path);
  }
  assert.deepEqual(missing, [], 'a skill sends a reader to a document init never writes');
});

test('the parser contracts the control plane reads still hold', () => {
  const seat = readText(join(root, 'skills', 'spec-seat', 'SKILL.md'));
  assert.ok(/default set.*role|role.*default set/.test(seat), 'spec-seat: the reading-floor line names the default set and the role');
  assert.ok(seat.includes('NOT BLOCKING') && seat.includes('MID-BUILD UPDATE'));
  const build = readText(join(root, 'skills', KIND_SKILLS.build, 'SKILL.md'));
  for (const row of ['| **frontend** |', '| **backend** |', '| **mixed** |']) assert.ok(build.includes(row), `${KIND_SKILLS.build}: ${row}`);
  for (const skill of ['spec-pipeline', 'spec-ignite']) {
    const text = readText(join(root, 'skills', skill, 'SKILL.md'));
    assert.ok(text.includes('You are the COORDINATOR of the {topic} pipeline.'), `${skill}: the kick text`);
    assert.ok(text.includes(`Invoke the \`${KIND_SKILLS.coordinator}\` skill`), `${skill}: the kick names the coordinator's skill`);
  }
  const pipeline = readText(join(root, 'skills', 'spec-pipeline', 'SKILL.md'));
  for (const anchor of ['00-ignition-brief.md', '01..NN-{slice}.md', 'project-status.md', 'live-checks.md', 'sessions/', 'AN ESCAPE HATCH', 'Six things every slice carries', '## The sequence', '`step`', '## Rulings made during the run', 'An optional `Repository` column', 'Optional `Runtime`, `Endpoint` and `Model` columns', 'directly after the']) {
    assert.ok(pipeline.includes(anchor), `spec-pipeline: ${anchor}`);
  }
});

// A control plane that seeds a seat with a further repository says where the seat's tree is and leaves the
// procedure to spec-seat § Git shapes, so that section must carry every part of it. Line breaks are folded
// before the search, so a clause may wrap.
const SecondRepositoryProcedure = [
  'WHEN YOUR ROW NAMES A FURTHER REPOSITORY, YOU WORK IN TWO TREES',
  'Your home is this repository',
  "nothing of the pipeline's record is ever written in the other repository",
  "in your own tree of it — never its owner's checkout",
  'read it, never build the path',
  'an explicit staging list and its `verify-staged` receipt, run inside that tree',
  'the whole of ITS gate',
  'follow ITS rules',
  'open a DRAFT one at your first push and read its checks after every push',
  'cd "$TREE" && git push origin <branch>',
  'never reshape it',
  'You never merge, tag or publish there',
];
const folded = (text) => text.replace(/\s+/g, ' ');

test('spec-seat carries the whole procedure for a second repository', () => {
  const seat = folded(readText(join(root, 'skills', 'spec-seat', 'SKILL.md')));
  for (const part of SecondRepositoryProcedure) assert.ok(seat.includes(part), `spec-seat § Git shapes: ${part}`);
});

test('CONTROL: the search finds a clause that wraps, and misses one that is not there', () => {
  assert.ok(folded('the whole of\n    ITS gate').includes('the whole of ITS gate'));
  assert.ok(!folded('its gate, in part').includes('the whole of ITS gate'));
});

// One repository is the usual case: a line a template gives a further repository sits under a line saying
// when it applies, so a seat whose row names none reads a template with nothing added to it.
const RepositoryLine = /^\s*(?:ALSO WRITING|You also write:|Also:) \{repository\}/;
const RepositoryCondition = /\{(?:only )?when [^}]*further repository/;

function unconditionalRepositoryLines(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!RepositoryLine.test(lines[i])) continue;
    // The condition may wrap, so it is looked for on the two lines above.
    if (!lines.slice(Math.max(0, i - 2), i).some((line) => RepositoryCondition.test(line))) out.push(`${i + 1}: ${lines[i].trim().slice(0, 80)}`);
  }
  return out;
}

test('every template line for a further repository is conditional on the row naming one', () => {
  let found = 0;
  for (const skill of ['spec-seat', 'spec-coordinator']) {
    const text = readText(join(root, 'skills', skill, 'SKILL.md'));
    found += text.split(/\r?\n/).filter((line) => RepositoryLine.test(line)).length;
    assert.deepEqual(unconditionalRepositoryLines(text), [], `${skill}: a further repository's line every seat would read as its own`);
  }
  assert.equal(found, 3, 'the seat\'s ALSO WRITING line, the prompt\'s "You also write" line and the review manifest\'s "Also" line');
});

test('CONTROL: a further repository\'s line with no condition above it is reported, and a wrapped condition passes', () => {
  assert.deepEqual(unconditionalRepositoryLines('BELIEFS: HEAD {sha}\nALSO WRITING {repository}: commit {sha}'), ['2: ALSO WRITING {repository}: commit {sha}']);
  assert.deepEqual(unconditionalRepositoryLines('{only when the seat\'s row names a further repository, one line each;\n hosted, the seed says where:}\nYou also write: {repository} — your tree'), []);
});

test("init's own parts: the doctor parses, the settings pin is two objects, no template leaves an init marker unexplained", () => {
  execFileSync(process.execPath, ['--check', join(root, 'skills', 'init', 'scripts', 'doctor.mjs')]);
  const pin = JSON.parse(readFileSync(join(root, 'templates', 'settings-pin.json'), 'utf8'));
  assert.equal(typeof pin.extraKnownMarketplaces, 'object');
  assert.equal(typeof pin.enabledPlugins, 'object');
  assert.equal(pin.enabledPlugins['naswerks@engineering-loop'], true);
  assert.ok(existsSync(join(root, 'skills', 'init', 'SKILL.md')));
});
