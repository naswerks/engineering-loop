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

test('a Repository cell naming one repository or several reads ok, and a row may leave it empty', () => {
  const header = '| Seat | Spec | Kind | Repository |';
  const rows = [`${COORDINATOR} — |`, `${BUILD} \`a-package\` |`, '| 02 · a page | `02-a-page.md` | `build` | a-package · `another.repo` |', '| the release | — | `step` | |'];
  withFolder({ header, rows, files: { ...SLICE, '02-a-page.md': '# A page\n' } }, (found) => {
    assert.equal(found.length, 1, found.join('\n'));
    assert.match(found[0], /ok .*read clean/);
  });
});

test('CONTROL: a kind word, `step` or an illegal name in a Repository cell FAILs by name, and is never read as the row\'s kind', () => {
  const header = '| Seat | Spec | Kind | Repository |';
  for (const notAName of ['review', 'step', 'a package', '../elsewhere']) {
    // The row's own kind cell is misspelled, so only the Repository cell could supply a kind or a step.
    withFolder({ header, rows: [`${COORDINATOR} — |`, `| 01 · a slice | \`01-a-slice.md\` | \`biuld\` | ${notAName} |`], files: SLICE }, (rows) => {
      assert.ok(rows.some((r) => /FAIL .*repository `[^`]+` is not a repository's name/.test(r) && r.includes(notAName)), `\`${notAName}\` must FAIL by name:\n${rows.join('\n')}`);
      assert.ok(!rows.some((r) => /ok .*read clean/.test(r)), `a row whose only kind word sits in its Repository cell must not read clean:\n${rows.join('\n')}`);
    });
  }
});

test('CONTROL: a name past the length a launcher carries, a ninth name and a name twice each FAIL by name', () => {
  const header = '| Seat | Spec | Kind | Repository |';
  const cases = [
    [`a${'b'.repeat(200)}`, /FAIL .*is not a repository's name \(one path segment of at most 200 characters/],
    [Array.from({ length: 9 }, (_, i) => `r${i}`).join(' · '), /FAIL .*names 9 repositories and a seat writes at most 8/],
    ['a-package, a-package', /FAIL .*names the repository `a-package` twice/],
  ];
  for (const [cell, expected] of cases) {
    withFolder({ header, rows: [`${COORDINATOR} — |`, `${BUILD} ${cell} |`], files: SLICE }, (rows) => {
      assert.ok(rows.some((r) => expected.test(r)), `${expected} must be reported:\n${rows.join('\n')}`);
    });
  }
  // The bounds themselves pass: a name of exactly 200 characters, and eight names.
  for (const cell of ['a'.repeat(200), Array.from({ length: 8 }, (_, i) => `r${i}`).join(', ')]) {
    withFolder({ header, rows: [`${COORDINATOR} — |`, `${BUILD} ${cell} |`], files: SLICE }, (rows) => {
      assert.equal(rows.length, 1, rows.join('\n'));
      assert.match(rows[0], /ok .*read clean/);
    });
  }
});

// The Runtime, Endpoint and Model columns: each cell's value is its backticked word, and a cell with none is a remark.
const RUN_ON = '| Seat | Spec | Kind | Runtime | Endpoint | Model |';

test('Runtime, Endpoint and Model cells holding backticked values read ok, and a cell with no backticked word is a remark', () => {
  const rows = [
    `${COORDINATOR} \`a-runtime\` | — | \`a-model[1m]\` |`,
    `${BUILD} \`another.runtime\` | \`an-endpoint\` | \`vendor/a-model-1.5\` |`,
    '| 02 · a page | `02-a-page.md` | `build` | `a-runtime` | — (its own sign-in) | its own default |',
    '| the release | — | `step` | | | |',
  ];
  withFolder({ header: RUN_ON, rows, files: { ...SLICE, '02-a-page.md': '# A page\n' } }, (found) => {
    assert.equal(found.length, 1, found.join('\n'));
    assert.match(found[0], /ok .*read clean/);
  });
});

test('CONTROL: a kind word, `step` or a value that is not a name or a model id FAILs by name, and is never read as the row\'s kind', () => {
  const cases = [
    ['runtime', 0, 'review'], ['runtime', 0, 'step'], ['runtime', 0, '-leading-dash'], ['runtime', 0, 'a/b'],
    ['endpoint', 1, 'build'], ['endpoint', 1, 'step'], ['endpoint', 1, 'a:b'],
    ['model', 2, 'coordinator'], ['model', 2, 'step'], ['model', 2, 'a*model'],
  ];
  for (const [word, at, value] of cases) {
    const cells = ['', '', ''];
    cells[at] = `\`${value}\``;
    // The row's own kind cell is misspelled, so only the named column could supply a kind or a step.
    const row = `| 01 · a slice | \`01-a-slice.md\` | \`biuld\` | ${cells.join(' | ')} |`;
    withFolder({ header: RUN_ON, rows: [`${COORDINATOR} | | |`, row], files: SLICE }, (rows) => {
      const named = new RegExp(`FAIL .*${word} \`[^\`]+\` is not a ${word}'s name`);
      assert.ok(rows.some((r) => named.test(r) && r.includes(value)), `${word} \`${value}\` must FAIL by name:\n${rows.join('\n')}`);
      assert.ok(!rows.some((r) => /ok .*read clean/.test(r)), `a row whose only kind word sits in its ${word} cell must not read clean:\n${rows.join('\n')}`);
    });
  }
});

test('CONTROL: a runtime or an endpoint past 64 characters FAILs by name, and one of exactly 64 reads ok', () => {
  for (const at of [0, 1]) {
    for (const [length, clean] of [[65, false], [64, true]]) {
      const cells = ['', '', ''];
      cells[at] = `\`${'r'.repeat(length)}\``;
      withFolder({ header: RUN_ON, rows: [`${COORDINATOR} | | |`, `${BUILD} ${cells.join(' | ')} |`], files: SLICE }, (rows) => {
        if (clean) {
          assert.equal(rows.length, 1, rows.join('\n'));
          assert.match(rows[0], /ok .*read clean/);
        } else {
          assert.ok(rows.some((r) => /FAIL .*is not a (runtime|endpoint)'s name \(a name of at most 64 characters/.test(r)), rows.join('\n'));
        }
      });
    }
  }
});

test('CONTROL: a bare word in a Model cell names no model and fails nothing; the same cell backticked is read', () => {
  withFolder({ header: RUN_ON, rows: [`${COORDINATOR} | | |`, `${BUILD} | | none of its own |`], files: SLICE }, (rows) => {
    assert.equal(rows.length, 1, rows.join('\n'));
    assert.match(rows[0], /ok .*read clean/);
  });
  withFolder({ header: RUN_ON, rows: [`${COORDINATOR} | | |`, `${BUILD} | | \`a*model\` |`], files: SLICE }, (rows) => {
    assert.ok(rows.some((r) => /FAIL .*model `a\*model` is not a model's name/.test(r)), rows.join('\n'));
  });
});

test('CONTROL: a sequence with no Repository column reads a seat-kind word in any cell as before', () => {
  withFolder({ rows: [COORDINATOR, BUILD], files: SLICE }, (rows) => {
    assert.equal(rows.length, 1, rows.join('\n'));
    assert.match(rows[0], /ok .*read clean/);
  });
});

// A listed fixit is the one its review implies only when it is the next seat row after that review.
const REVIEW = '| R · the review | — | `review` |';
const FIXIT = '| F · the fixit | — | `fixit` |';
const DOCS = '| P · docs-process | — | `docs-process` |';

test('a fixit row listed directly after its review reads ok, and a `step` between them does not count', () => {
  for (const rows of [[COORDINATOR, BUILD, REVIEW, FIXIT, DOCS], [COORDINATOR, BUILD, REVIEW, '| a sitting | — | `step` |', FIXIT, DOCS]]) {
    withFolder({ rows, files: SLICE }, (found) => {
      assert.equal(found.length, 1, found.join('\n'));
      assert.match(found[0], /ok .*read clean/);
    });
  }
});

test('CONTROL: a fixit row listed anywhere else FAILs by name, and a fixit with no review row is left alone', () => {
  for (const rows of [[COORDINATOR, BUILD, REVIEW, DOCS, FIXIT], [COORDINATOR, FIXIT, BUILD, REVIEW]]) {
    withFolder({ rows, files: SLICE }, (found) => {
      assert.ok(found.some((r) => /FAIL .*lists a `fixit` row that is not the next seat row after its `review` row/.test(r)), found.join('\n'));
    });
  }
  withFolder({ rows: [COORDINATOR, BUILD, FIXIT], files: SLICE }, (found) => {
    assert.equal(found.length, 1, found.join('\n'));
    assert.match(found[0], /ok .*read clean/);
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
