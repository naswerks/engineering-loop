// The pins over the skills' CONTENT: the pack describes a method for any repository, in current words,
// and every document a skill sends a reader to is one `init` can put there. Each census names the file
// and line it flags; each has a control that proves the regex fires on a planted line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, walk, readText } from './support.mjs';

const CONTENT_FOLDERS = ['skills', 'references', 'templates'];

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
  const child = readText(join(root, 'skills', 'spec-child', 'SKILL.md'));
  for (const row of ['| **frontend** |', '| **backend** |', '| **mixed** |']) assert.ok(child.includes(row), `spec-child: ${row}`);
  for (const skill of ['spec-pipeline', 'spec-ignite']) {
    assert.ok(readText(join(root, 'skills', skill, 'SKILL.md')).includes('You are the COORDINATOR of the {topic} pipeline.'), `${skill}: the kick text`);
  }
  const pipeline = readText(join(root, 'skills', 'spec-pipeline', 'SKILL.md'));
  for (const anchor of ['00-ignition-brief.md', '01-{topic}.md', 'project-status.md', 'live-checks.md', 'sessions/', 'AN ESCAPE HATCH', 'Six things every slice carries']) {
    assert.ok(pipeline.includes(anchor), `spec-pipeline: ${anchor}`);
  }
});

test("init's own parts: the doctor parses, the settings pin is two objects, no template leaves an init marker unexplained", () => {
  execFileSync(process.execPath, ['--check', join(root, 'skills', 'init', 'scripts', 'doctor.mjs')]);
  const pin = JSON.parse(readFileSync(join(root, 'templates', 'settings-pin.json'), 'utf8'));
  assert.equal(typeof pin.extraKnownMarketplaces, 'object');
  assert.equal(typeof pin.enabledPlugins, 'object');
  assert.equal(pin.enabledPlugins['naswerks@engineering-loop'], true);
  assert.ok(existsSync(join(root, 'skills', 'init', 'SKILL.md')));
});
