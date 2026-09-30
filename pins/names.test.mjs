// The pins over the skills' NAMES. A spec seat's skill is named for its seat kind, and every skill name
// the pack writes is a skill it carries — so a renamed skill cannot leave its old name behind in the prose,
// and a kind cannot be paired with a skill named for something else. The lists live in
// skills/init/scripts/owned.mjs, which the doctor reads too. Each census has a control.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, skillDirs, walk, readText } from './support.mjs';
import { KINDS, KIND_SKILLS, NOT_SKILLS, skillTokens } from '../skills/init/scripts/owned.mjs';

const skills = new Set(skillDirs());
const unknownIn = (text) => skillTokens(text).filter((t) => !skills.has(t) && !NOT_SKILLS.includes(t));

// The prose a reader meets: every skill, both method docs, every template, the README. The CHANGELOG is
// history and keeps the names each release shipped.
function* namedFiles() {
  for (const file of walk(root, ['skills', 'references', 'templates'])) if (file.endsWith('.md')) yield file;
  yield join(root, 'README.md');
}

test('every skill name the pack writes is a skill it carries', () => {
  const report = [];
  for (const file of namedFiles()) {
    readText(file).split(/\r?\n/).forEach((line, i) => {
      for (const token of unknownIn(line)) report.push(`${file.slice(root.length + 1)}:${i + 1} "${token}"`);
    });
  }
  assert.deepEqual(report, [], 'a skill-shaped name no skill carries: a renamed skill left behind, or a word NOT_SKILLS should list');
});

test('CONTROL: the census reads a name, skips a family, and flags a skill the pack does not carry', () => {
  assert.deepEqual(skillTokens('invoke `naswerks:spec-seat`, then spec-build'), ['spec-seat', 'spec-build']);
  assert.deepEqual(skillTokens('`docs-audit-*` and `docs-*` name families'), []);
  assert.deepEqual(unknownIn('invoke the spec-parent skill, then docs-workflow.md'), ['spec-parent']);
});

test("every seat kind runs a skill the pack carries, and a spec seat's skill is named for its kind", () => {
  assert.deepEqual(Object.keys(KIND_SKILLS).sort(), [...KINDS].sort(), 'KIND_SKILLS and KINDS name different kinds');
  for (const kind of KINDS) {
    const skill = KIND_SKILLS[kind];
    assert.ok(existsSync(join(root, 'skills', skill, 'SKILL.md')), `the kind ${kind} runs ${skill}, which the pack does not carry`);
    // fixit is the build job's no-spec variant; docs-process is the knowledge loop's own skill.
    const named = kind === 'fixit' ? KIND_SKILLS.build : kind === 'docs-process' ? 'docs-process' : `spec-${kind}`;
    assert.equal(skill, named, `the kind ${kind} runs ${skill}: a spec seat's skill is named for its kind`);
  }
});

test('spec-seat states the pairing the kinds declare', () => {
  const seat = readText(join(root, 'skills', 'spec-seat', 'SKILL.md'));
  const rows = [...seat.matchAll(/^\| (`[a-z-]+`(?: · `[a-z-]+`)*) \| `spec-seat` \+ \*\*`([a-z-]+)`\*\* \|\r?$/gm)];
  assert.ok(rows.length >= 3, 'spec-seat has lost its kind table');
  for (const [, kinds, skill] of rows) {
    for (const kind of kinds.match(/[a-z-]+/g)) assert.equal(KIND_SKILLS[kind], skill, `spec-seat pairs ${kind} with ${skill}`);
  }
  const own = /\(`([a-z-]+)` · `([a-z-]+)` · `([a-z-]+)`\) and are \*\*never\*\*/.exec(seat);
  assert.ok(own, 'spec-seat no longer names the three kinds that carry their own contract');
  assert.deepEqual(own.slice(1), [KIND_SKILLS.coordinator, KIND_SKILLS.retro, KIND_SKILLS.witness]);
});

// ── the doctor reads a brief's kick the same way ────────────────────────────────────────────────────
const doctor = join(root, 'skills', 'init', 'scripts', 'doctor.mjs');

function briefRepo(kickSkill) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-names-'));
  const topic = join(dir, 'docs', 'research', 'demo');
  mkdirSync(topic, { recursive: true });
  writeFileSync(join(topic, '02-a-slice.md'), '# A slice\n');
  writeFileSync(join(topic, '00-ignition-brief.md'), [
    '# Demo — Ignition Brief', '',
    '## The sequence', '', '| Seat | Spec | Kind |', '|---|---|---|',
    '| 0 · coordinator | — | `coordinator` |', '| 02 · a slice | `02-a-slice.md` | `build` |', '',
    '## The kick', '',
    `> You are the COORDINATOR of the demo pipeline. Invoke the \`${kickSkill}\` skill, then read`,
    '> `docs/research/demo/00-ignition-brief.md` and follow it.', '',
  ].join('\n'));
  return dir;
}
function briefRows(dir) {
  let out;
  try { out = execFileSync(process.execPath, [doctor, dir], { encoding: 'utf8', timeout: 60000 }); }
  catch (e) { out = `${e.stdout ?? ''}${e.stderr ?? ''}`; }
  return out.split('\n').filter((l) => l.includes('| docs/research/demo/00-ignition-brief.md '));
}

test("the doctor degrades a kick that names a skill the pack does not carry, and names the coordinator's skill", () => {
  const dir = briefRepo('spec-parent');
  try {
    const rows = briefRows(dir);
    assert.equal(rows.length, 1, rows.join('\n'));
    assert.match(rows[0], /DEGRADE .*`spec-parent`, a skill this pack does not carry.*`spec-coordinator`/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("CONTROL: a kick that names the coordinator's skill reads clean", () => {
  const dir = briefRepo(KIND_SKILLS.coordinator);
  try {
    const rows = briefRows(dir);
    assert.equal(rows.length, 1, rows.join('\n'));
    assert.match(rows[0], /ok .*the kick and the sequence read clean/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
