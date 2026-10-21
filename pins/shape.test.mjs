// The pins over the pipeline folder's SHAPE. One brief is the coordinator's spec and the charter every seat
// reads; every numbered file is one seat's spec; a row that is not a seat says `step`; a row may carry a role;
// and a folder that still carries an umbrella reads as old shape. The doctor reads briefs the way the
// control plane does, so each rule is pinned through the doctor itself. Each has a control.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, walk, readText } from './support.mjs';
import { KIND_SKILLS } from '../skills/init/scripts/owned.mjs';

const doctor = join(root, 'skills', 'init', 'scripts', 'doctor.mjs');
const BRIEF = '| docs/research/demo/00-ignition-brief.md ';

// A repository holding one pipeline folder: a brief whose sequence is `rows` under `header`, and `files`.
function folder({ header = '| Seat | Spec | Kind |', rows, files = {} }) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-shape-'));
  const topic = join(dir, 'docs', 'research', 'demo');
  mkdirSync(topic, { recursive: true });
  for (const [name, body] of Object.entries(files)) writeFileSync(join(topic, name), body);
  const rule = `|${header.split('|').slice(1, -1).map(() => '---').join('|')}|`;
  writeFileSync(join(topic, '00-ignition-brief.md'), [
    '# Demo', '',
    '## The sequence', '', header, rule, ...rows, '',
    '## The kick', '',
    `> You are the COORDINATOR of the demo pipeline. Invoke the \`${KIND_SKILLS.coordinator}\` skill, then read`,
    '> `docs/research/demo/00-ignition-brief.md` and follow it.', '',
  ].join('\n'));
  return dir;
}

function briefRows(dir) {
  let out;
  try { out = execFileSync(process.execPath, [doctor, dir], { encoding: 'utf8', timeout: 60000 }); }
  catch (e) { out = `${e.stdout ?? ''}${e.stderr ?? ''}`; }
  return out.split('\n').filter((l) => l.includes(BRIEF));
}

function withFolder(spec, check) {
  const dir = folder(spec);
  try { check(briefRows(dir)); } finally { rmSync(dir, { recursive: true, force: true }); }
}

const SLICE = { '01-a-slice.md': '# A slice\n' };
const COORDINATOR = '| 0 · coordinator | `00-ignition-brief.md` | `coordinator` |';
const BUILD = '| 01 · a slice | `01-a-slice.md` | `build` |';

test('a `step` row reads ok: a human act in its place in the order, not a seat', () => {
  withFolder({ rows: [COORDINATOR, BUILD, '| publish | — | `step` |'], files: SLICE }, (rows) => {
    assert.equal(rows.length, 1, rows.join('\n'));
    assert.match(rows[0], /ok .*the kick and the sequence read clean/);
  });
});

test('CONTROL: a misspelled kind on a spec-less row still FAILs by name — it never reads as a step', () => {
  for (const misspelled of ['stpe', 'biuld']) {
    withFolder({ rows: [COORDINATOR, BUILD, `| publish | — | \`${misspelled}\` |`], files: SLICE }, (rows) => {
      assert.ok(rows.some((r) => /FAIL .*names no seat kind/.test(r) && r.includes(misspelled)), `\`${misspelled}\` must FAIL:\n${rows.join('\n')}`);
    });
  }
});

test('a Role cell carrying backend, frontend or mixed reads ok, and a row may leave it empty', () => {
  const header = '| Seat | Spec | Kind | Role |';
  const rows = [`${COORDINATOR} — |`, `${BUILD} \`mixed\` |`, '| 02 · a page | `02-a-page.md` | `build` | `frontend` |', '| publish | — | `step` | |'];
  withFolder({ header, rows, files: { ...SLICE, '02-a-page.md': '# A page\n' } }, (found) => {
    assert.equal(found.length, 1, found.join('\n'));
    assert.match(found[0], /ok .*read clean/);
  });
});

test('CONTROL: a misspelled role FAILs by name', () => {
  withFolder({ header: '| Seat | Spec | Kind | Role |', rows: [`${COORDINATOR} — |`, `${BUILD} \`mxied\` |`], files: SLICE }, (rows) => {
    assert.ok(rows.some((r) => /FAIL .*role `mxied` is not one of/.test(r)), rows.join('\n'));
  });
});

test('an old-shape folder — an `01-` file no sequence row names — reads DEGRADE, pointing at the upgrade note', () => {
  const rows = [COORDINATOR, '| 02 · a slice | `02-a-slice.md` | `build` |'];
  withFolder({ rows, files: { '01-demo.md': '# Demo umbrella\n', '02-a-slice.md': '# A slice\n' } }, (found) => {
    assert.ok(found.some((r) => /DEGRADE .*old shape — fold `01-demo\.md` into the brief \(CHANGELOG 0\.8\.0 § Upgrading\)/.test(r)), found.join('\n'));
    assert.ok(!found.some((r) => /FAIL/.test(r)), `an old-shape folder still runs on an older pack and must not FAIL:\n${found.join('\n')}`);
  });
});

test('CONTROL: the same folder whose sequence names its `01-` file as a seat reads clean', () => {
  const rows = [COORDINATOR, '| 01 · the demo | `01-demo.md` | `build` |', '| 02 · a slice | `02-a-slice.md` | `build` |'];
  withFolder({ rows, files: { '01-demo.md': '# Demo\n', '02-a-slice.md': '# A slice\n' } }, (found) => {
    assert.equal(found.length, 1, found.join('\n'));
    assert.match(found[0], /ok .*read clean/);
  });
});

// The brief template holds the sequence exactly once: it is the only copy, and the tracker copies nothing.
const sequenceHeadings = (text) => text.split(/\r?\n/).filter((l) => l.trim() === '## The sequence').length;

test('the brief template carries exactly one `## The sequence`', () => {
  assert.equal(sequenceHeadings(readText(join(root, 'skills', 'spec-pipeline', 'SKILL.md'))), 1);
});

test('CONTROL: a second `## The sequence` is counted', () => {
  const text = readText(join(root, 'skills', 'spec-pipeline', 'SKILL.md'));
  assert.equal(sequenceHeadings(`${text}\n## The sequence\n`), 2);
});

// No skill, method doc or template names an umbrella: the brief is the charter, and there is no fallback
// clause for the shape it replaced. The doctor's own code names it, to recognise an old-shape folder.
const Umbrella = /\bumbrella\b/i;

function umbrellaCensus() {
  const out = [];
  for (const file of walk(root, ['skills', 'references', 'templates'])) {
    if (!file.endsWith('.md')) continue;
    readText(file).split(/\r?\n/).forEach((line, i) => {
      if (Umbrella.test(line)) out.push(`${file.slice(root.length + 1)}:${i + 1} ${line.trim().slice(0, 100)}`);
    });
  }
  return out;
}

test('no skill, method doc or template names an umbrella', () => {
  assert.deepEqual(umbrellaCensus(), []);
});

test('CONTROL: the census fires on a planted umbrella and passes the brief', () => {
  assert.ok(Umbrella.test('then read the umbrella (01-*.md)'));
  assert.ok(Umbrella.test('the Umbrella row table'));
  assert.ok(!Umbrella.test('the brief is the coordinator\'s spec and the charter every seat reads'));
});
