// The skills describe ONE system, in its current words. Two censuses over the prose of every skill
// (code spans and fenced blocks are names, not vocabulary, and are left alone):
//
//   1. the build instruction never hard-codes one application's path: a repository's applications
//      are the repository's to name (its docs/_meta/doc-index.md), never the skill's;
//   2. a retired ceremony vocabulary (chain / child as the unit of work) survives only inside a
//      section that says it is describing that retired plane.
//
// Both are ported from the consuming control plane's own pins, where they caught real drift.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { root, skillDirs, readText } from './support.mjs';

const HardcodedBuildPath = /cd\s+src\/web\/(?<app>[A-Za-z0-9._-]+)\s*;\s*npm run build/;

test('no skill hard-codes one application into the frontend build instruction', () => {
  const offences = [];
  for (const dir of skillDirs()) {
    const text = readText(join(root, 'skills', dir, 'SKILL.md'));
    const m = text.match(HardcodedBuildPath);
    if (m) offences.push(`skills/${dir}/SKILL.md -> cd src/web/${m.groups.app}; npm run build`);
  }
  assert.deepEqual(offences, []);
});

test('CONTROL: the build-path regex flags the shipped text and passes the ruled form', () => {
  assert.ok(HardcodedBuildPath.test('cd src/web/agent-ops; npm run build'));
  assert.ok(!HardcodedBuildPath.test('run the build of every app the role touched (the repository names them)'));
});

const MarkerToken = 'v1 PLANE (still running)';
const V1Word = /\b(chains?|child(?:ren)?)\b/i;
const ExemptTokens = /spec-child|spec-chain|spec-pipeline|chain-\d+|child·|chain_rows|chainDefaultTransport|chain_complete|nas\/chain-/gi;
const Heading = /^#{2,3}\s/;
const CodeSpan = /`[^`]*`/g;

export function scan(text) {
  const violations = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const marked = new Set();
  const sectionOf = [];
  let section = 0;
  let fenced = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trimStart().startsWith('```')) {
      fenced = !fenced;
      sectionOf[i] = section;
      continue;
    }
    if (!fenced && Heading.test(raw)) section++;
    sectionOf[i] = section;
    if (!fenced && raw.includes(MarkerToken)) marked.add(section);
  }
  fenced = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trimStart().startsWith('```')) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const prose = raw.replace(CodeSpan, ' ').replace(ExemptTokens, ' ');
    const m = prose.match(V1Word);
    if (m && !marked.has(sectionOf[i])) violations.push({ line: i + 1, word: m[1], text: raw.trim() });
  }
  return violations;
}

const family = [
  'spec-pipeline', 'spec-seat', 'spec-child', 'spec-parent', 'spec-review', 'spec-retro',
  'spec-witness', 'spec-ignite', 'docs-process', 'docs-write',
];

test('retired ceremony vocabulary appears only in sections marked as describing the retired plane', () => {
  const report = [];
  for (const dir of family) {
    for (const hit of scan(readText(join(root, 'skills', dir, 'SKILL.md')))) {
      report.push(`skills/${dir}/SKILL.md:${hit.line} "${hit.word}" - ${hit.text.slice(0, 100)}`);
    }
  }
  assert.deepEqual(report, []);
});

test('CONTROL: the census fires on an unmarked v1 word and not on a marked or quoted one', () => {
  assert.equal(scan('## A\nthe chain runs\n').length, 1);
  assert.equal(scan('## A\n> v1 PLANE (still running)\nthe chain runs\n').length, 0);
  assert.equal(scan('## A\n`the chain` is a name\n').length, 0);
});
