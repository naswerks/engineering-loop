#!/usr/bin/env node
// The staging receipt.
//
// `git add <dir>` skips gitignored children with exit 0 and no output, and `git status` cannot show
// the loss: an ignored file is neither staged nor dirty, so a silently skipped add makes status look
// CLEANER, not worse. Run this between `git add` and `git commit` over the SAME path list you gave to
// `git add`; a non-zero exit names every file that did not land and the ignore rule that ate it.
//
//   verify-staged docs/research/topic/sessions/slug src/x.cs
//   verify-staged --from-file .staging-list.txt --against head
//   verify-staged --self-test
//
// States. Red: IGNORED, NEVER-ADDED, NOT-STAGED, MISSING-FROM-DISK, TOO-BROAD, ERROR.
// Green (notes): STAGED, IN-HEAD, ALREADY-COMMITTED-CLEAN.
//
// Deliberately not a fix for .gitignore: widening or anchoring a repository's ignore rules is a
// repository decision, and force-adding against one is a ruling, not a default.
//
// Every listing is read for the expected paths only, never for the whole tree: a large repository's
// full listing is megabytes, and a listing cut short by a buffer reads as files that were never added.
// An output that still overflows is an ERROR by name, never a partial listing.
//
// Paths with embedded newlines are not supported (line-delimited git output, core.quotepath=false).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, sep } from 'node:path';

const DIR_EXPANSION_CAP = 2000;
const MAX_BUFFER = 256 * 1024 * 1024;
// Paths per git call, so one call stays well under the Windows command-line limit.
const PATHSPEC_BATCH = 100;

function git(root, args, maxBuffer = MAX_BUFFER) {
  try {
    const out = execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer,
    });
    return { ok: true, exit: 0, overflow: false, lines: out.split(/\r?\n/).filter((l) => l.length > 0) };
  } catch (e) {
    const out = typeof e.stdout === 'string' ? e.stdout : '';
    return {
      ok: false,
      exit: typeof e.status === 'number' ? e.status : 1,
      overflow: e.code === 'ENOBUFS',
      lines: out.split(/\r?\n/).filter((l) => l.length > 0),
    };
  }
}

// One listing, read for the given paths only, in batches. Each path is a literal pathspec (case-insensitive
// when the repository is), so a path holding `*` or `?` names itself and nothing else.
function gitFor(root, args, paths, caseInsensitive, maxBuffer) {
  const lines = [];
  const magic = caseInsensitive ? ':(literal,icase)' : ':(literal)';
  for (let i = 0; i < paths.length; i += PATHSPEC_BATCH) {
    const batch = paths.slice(i, i + PATHSPEC_BATCH).map((p) => magic + p);
    const r = git(root, [...args, '--', ...batch], maxBuffer);
    if (!r.ok) return { ...r, lines: [...lines, ...r.lines] };
    lines.push(...r.lines);
  }
  return { ok: true, exit: 0, overflow: false, lines };
}

const overflowFinding = (what) => ({
  file: what,
  state: 'ERROR',
  detail: 'git output exceeded the buffer, so this listing is incomplete and nothing is judged against it',
});

function toRepoRelative(root, input) {
  let p = input.trim().replace(/\\/g, '/').replace(/\/+$/, '');
  if (isAbsolute(p) || /^[A-Za-z]:\//.test(p)) {
    const rootNorm = root.replace(/\\/g, '/').replace(/\/+$/, '');
    if (!p.toLowerCase().startsWith(rootNorm.toLowerCase())) return null;
    p = p.slice(rootNorm.length).replace(/^\/+/, '');
  }
  return p.length === 0 ? null : p;
}

export function testStagedList(root, paths, mode = 'index', options = {}) {
  const maxBuffer = options.maxBuffer ?? MAX_BUFFER;
  const findings = [];
  const notes = [];
  const top = git(root, ['rev-parse', '--show-toplevel'], maxBuffer);
  if (!top.ok || top.lines.length === 0) {
    findings.push({ file: root, state: 'ERROR', detail: 'not inside a git repository (rev-parse --show-toplevel failed)' });
    return { ok: false, findings, notes, expected: 0, green: 0 };
  }
  const repoTop = top.lines[0];
  const igc = git(root, ['config', 'core.ignorecase'], maxBuffer);
  const caseInsensitive = igc.ok && igc.lines[0]?.trim() === 'true';
  const key = (s) => (caseInsensitive ? s.toLowerCase() : s);
  const setOf = (lines) => new Set(lines.map(key));

  const expected = [];
  const seen = new Set();
  for (const raw of paths) {
    if (!raw || raw.trim().length === 0) continue;
    const rel = toRepoRelative(repoTop, raw);
    if (rel === null) {
      findings.push({ file: raw, state: 'ERROR', detail: 'path is outside the repository (or empty after normalization)' });
      continue;
    }
    const onDisk = join(repoTop, rel.split('/').join(sep));
    if (existsSync(onDisk) && statSync(onDisk).isDirectory()) {
      const inDir = [];
      let overflowed = false;
      for (const spec of [
        ['ls-files', '--cached', '--', rel],
        ['ls-files', '--others', '--exclude-standard', '--', rel],
        ['ls-files', '--others', '--ignored', '--exclude-standard', '--', rel],
      ]) {
        const r = git(root, spec, maxBuffer);
        if (r.overflow) overflowed = true;
        inDir.push(...r.lines);
      }
      if (overflowed) {
        findings.push(overflowFinding(rel));
        continue;
      }
      if (inDir.length > DIR_EXPANSION_CAP) {
        findings.push({ file: rel, state: 'TOO-BROAD', detail: `directory expands to ${inDir.length} files (cap ${DIR_EXPANSION_CAP}) - name explicit paths` });
        continue;
      }
      if (inDir.length === 0) {
        findings.push({ file: rel, state: 'MISSING-FROM-DISK', detail: 'directory exists but contains no files git can see - an empty filing is a citation to nothing' });
        continue;
      }
      for (const f of inDir) if (!seen.has(key(f))) { seen.add(key(f)); expected.push(f); }
    } else if (!seen.has(key(rel))) {
      seen.add(key(rel));
      expected.push(rel);
    }
  }

  // The listings, for the expected paths only.
  const read = (args) => gitFor(root, args, expected, caseInsensitive, maxBuffer);
  const lsFiles = read(['ls-files', '--cached']);
  const listings = [lsFiles];
  let head = null;
  let staged = null;
  let dirty = null;
  if (mode === 'head') {
    // `ls-tree` takes no `icase` magic, so on a case-insensitive repository each expected path is read in
    // the case the index spells it (after the commit, the index and HEAD agree on every committed path).
    const spelled = new Map(lsFiles.lines.map((l) => [key(l), l]));
    const asCommitted = expected.map((p) => spelled.get(key(p)) ?? p);
    const lsTree = gitFor(root, ['ls-tree', '-r', '--name-only', 'HEAD'], asCommitted, false, maxBuffer);
    listings.push(lsTree);
    head = setOf(lsTree.lines);
    if (!lsTree.ok && !lsTree.overflow) notes.push('HEAD is unreadable (empty repository?) - every expected file will read as missing from HEAD');
  } else {
    const cached = read(['diff', '--cached', '--no-renames', '--name-only']);
    const worktree = read(['diff', '--name-only']);
    listings.push(cached, worktree);
    staged = setOf(cached.lines);
    dirty = setOf(worktree.lines);
  }
  if (listings.some((l) => l.overflow)) {
    findings.push(overflowFinding(`${expected.length} expected file(s)`));
    return { ok: false, findings, notes, expected: expected.length, green: 0 };
  }
  const tracked = setOf(lsFiles.lines);

  let green = 0;
  for (const f of expected) {
    const onDisk = join(repoTop, f.split('/').join(sep));
    const exists = existsSync(onDisk) && statSync(onDisk).isFile();
    const k = key(f);
    if (mode === 'head') {
      if (head.has(k)) { green++; continue; }
    } else if (staged.has(k)) {
      green++;
      continue;
    } else if (tracked.has(k) && !dirty.has(k)) {
      notes.push(`already committed, clean: ${f}`);
      green++;
      continue;
    }
    if (mode !== 'head' && tracked.has(k)) {
      findings.push({ file: f, state: 'NOT-STAGED', detail: 'tracked and MODIFIED (or deleted) but the change was never added' });
    } else if (exists) {
      const ci = git(root, ['check-ignore', '-v', '--', f]);
      if (ci.exit === 0 && ci.lines.length > 0) {
        const rule = ci.lines[0].split('\t')[0];
        findings.push({ file: f, state: 'IGNORED', detail: `eaten by ${rule} - git add skipped it with exit 0 and NO output` });
      } else {
        findings.push({ file: f, state: 'NEVER-ADDED', detail: 'on disk, not ignored, and not staged - the add never named it (path typo, or the add ran from the wrong directory?)' });
      }
    } else {
      findings.push({ file: f, state: 'MISSING-FROM-DISK', detail: 'named in the list but no such file exists - a committed citation to this path would point at nothing' });
    }
  }
  return { ok: findings.length === 0, findings, notes, expected: expected.length, green };
}

function report(result, mode, pathCount) {
  for (const n of result.notes) console.log(`  note: ${n}`);
  if (result.ok) {
    console.log(`STAGING VERIFIED: ${pathCount} path(s) -> ${result.expected} file(s), all accounted for (against ${mode}).`);
    return;
  }
  console.log(`STAGING INCOMPLETE: ${result.findings.length} of ${result.expected} expected file(s) are NOT accounted for (against ${mode}).`);
  for (const f of result.findings) {
    console.log(`  MISSING (${f.state}): ${f.file}`);
    console.log(`      ${f.detail}`);
  }
  console.log('  A silently-skipped add is INVISIBLE to git status. Do NOT commit.');
  console.log('  Moves: rename the artifact off the ignored pattern, or raise the question for a ruling.');
  console.log('  git add -f is a ruling, not a default, and .gitignore is never edited from a seat.');
}

// A throwaway tree's removal. Windows can still hold files git just wrote, so the removal retries; one that
// still fails is a warning naming the folder, never a failed self-test — the verdict is the cases'.
function cleanUp(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  } catch (e) {
    console.log(`  warning: could not remove the self-test folder ${dir} (${e.code ?? e.message}); remove it by hand`);
  }
}

function selfTest() {
  const tmp = mkdtempSync(join(tmpdir(), 'verify-staged-selftest-'));
  const cases = [];
  try {
    git(tmp, ['init', '-q']);
    writeFileSync(join(tmp, '.gitignore'), 'bin/\n*.log\n');
    mkdirSync(join(tmp, 'docs', 'session'), { recursive: true });
    mkdirSync(join(tmp, 'src', 'bin'), { recursive: true });
    writeFileSync(join(tmp, 'docs', 'session', 'a.md'), 'artifact\n');
    writeFileSync(join(tmp, 'docs', 'session', 'receipt.log'), 'receipt\n');
    writeFileSync(join(tmp, 'src', 'bin', 'tool.txt'), 'composition root\n');
    writeFileSync(join(tmp, 'loose.txt'), 'never added\n');
    git(tmp, ['add', 'docs/session', 'src']);

    cases.push({ name: '*.log eats a receipt under an added dir', shouldFail: true, result: testStagedList(tmp, ['docs/session']), expect: 'IGNORED', detail: '.gitignore:2' });
    cases.push({ name: 'unanchored bin/ eats src/bin at depth', shouldFail: true, result: testStagedList(tmp, ['src']), expect: 'IGNORED', detail: '.gitignore:1' });
    cases.push({ name: 'a not-ignored miss reads NEVER-ADDED', shouldFail: true, result: testStagedList(tmp, ['loose.txt']), expect: 'NEVER-ADDED', detail: '' });
    cases.push({ name: 'a citation to a path that does not exist', shouldFail: true, result: testStagedList(tmp, ['docs/session/scratch-notes.md']), expect: 'MISSING-FROM-DISK', detail: '' });
    cases.push({ name: 'positive control: a staged file verifies green', shouldFail: false, result: testStagedList(tmp, ['docs/session/a.md']) });
    git(tmp, ['-c', 'user.name=selftest', '-c', 'user.email=selftest@local', 'commit', '-q', '-m', 'selftest']);
    cases.push({ name: 'positive control: committed-clean is a note, not a red', shouldFail: false, result: testStagedList(tmp, ['docs/session/a.md']) });
    cases.push({ name: 'head mode: the eaten receipt is absent from the commit', shouldFail: true, result: testStagedList(tmp, ['docs/session'], 'head'), expect: 'IGNORED', detail: '' });
    cases.push(...largeTreeCases());

    let failed = 0;
    for (const c of cases) {
      let verdict;
      if (c.verdict !== undefined) {
        verdict = c.verdict;
      } else if (c.shouldFail) {
        const hit = c.result.findings.filter((f) => f.state === c.expect);
        if (c.result.ok) verdict = 'DID NOT FIRE - the detector is broken';
        else if (hit.length === 0) verdict = `fired with the WRONG state (wanted ${c.expect})`;
        else if (c.detail && !hit[0].detail.includes(c.detail)) verdict = `fired without naming the rule (wanted '${c.detail}' in: ${hit[0].detail})`;
        else verdict = 'PASS - fired, named correctly';
      } else {
        verdict = c.result.ok ? 'PASS - stayed green on good input' : 'FIRED on good input - false positive';
      }
      if (!verdict.startsWith('PASS')) failed++;
      console.log(`  [${verdict.startsWith('PASS') ? 'PASS' : 'FAIL'}] ${c.name}: ${verdict}`);
    }
    if (failed === 0) {
      console.log('SELF-TEST PASSED: the detector fires on both ignore sightings, discriminates never-added from ignored, stays silent on good input, and reads a repository whose listing is over 1 MiB.');
      return 0;
    }
    console.log(`SELF-TEST FAILED: ${failed} case(s) - do not trust this detector until it fires correctly.`);
    return 1;
  } finally {
    cleanUp(tmp);
  }
}

// A repository whose full listing is over 1 MiB: twelve thousand paths written to the index alone (no files
// on disk) and committed, plus one real file that sorts after all of them, so a listing cut short at the
// buffer is exactly the listing that loses it. The CONTROL reads the full listing at Node's default buffer
// and must overflow; if it does not, the fixture is too small to prove anything about a large repository.
function largeTreeCases() {
  const tmp = mkdtempSync(join(tmpdir(), 'verify-staged-large-'));
  try {
    git(tmp, ['init', '-q']);
    writeFileSync(join(tmp, 'zz-kept.md'), 'committed\n');
    git(tmp, ['add', 'zz-kept.md']);
    const blob = execFileSync('git', ['-C', tmp, 'hash-object', '-w', '--stdin'], { input: 'padding\n', encoding: 'utf8' }).trim();
    const folder = `padding/${'p'.repeat(80)}`;
    const entries = [];
    for (let i = 0; i < 12000; i++) entries.push(`100644 ${blob}\t${folder}/${String(i).padStart(5, '0')}.txt`);
    execFileSync('git', ['-C', tmp, 'update-index', '--index-info'], { input: `${entries.join('\n')}\n` });
    git(tmp, ['-c', 'user.name=selftest', '-c', 'user.email=selftest@local', 'commit', '-q', '-m', 'large']);

    let overflowed = false;
    try {
      execFileSync('git', ['-C', tmp, 'ls-tree', '-r', '--name-only', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
      overflowed = e.code === 'ENOBUFS';
    }
    return [
      {
        name: 'CONTROL: the large fixture\'s full listing overflows the default buffer',
        verdict: overflowed ? 'PASS - the fixture is over 1 MiB' : 'the full listing fit the default buffer - the fixture proves nothing',
      },
      { name: 'large repository, head mode: a committed file reads IN-HEAD', shouldFail: false, result: testStagedList(tmp, ['zz-kept.md'], 'head') },
      { name: 'large repository, index mode: thousands of index-only paths do not hide a clean file', shouldFail: false, result: testStagedList(tmp, ['zz-kept.md']) },
      {
        name: 'an overflowing listing is an ERROR by name, never a partial listing',
        shouldFail: true,
        result: testStagedList(tmp, ['padding'], 'index', { maxBuffer: 64 * 1024 }),
        expect: 'ERROR',
        detail: 'exceeded the buffer',
      },
    ];
  } finally {
    cleanUp(tmp);
  }
}

function main(argv) {
  const paths = [];
  let fromFile = '';
  let against = 'index';
  let root = process.cwd();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--self-test') return selfTest();
    if (a === '--from-file') { fromFile = argv[++i] ?? ''; continue; }
    if (a === '--against') { against = (argv[++i] ?? 'index').toLowerCase(); continue; }
    if (a === '--repo-root') { root = argv[++i] ?? root; continue; }
    paths.push(a);
  }
  if (against !== 'index' && against !== 'head') {
    console.log(`STAGING INCOMPLETE: --against must be index or head, not '${against}'.`);
    return 1;
  }
  if (fromFile) {
    if (!existsSync(fromFile)) {
      console.log(`STAGING INCOMPLETE: --from-file '${fromFile}' does not exist - the staging list itself is missing.`);
      return 1;
    }
    for (const line of readFileSync(fromFile, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (t.length > 0 && !t.startsWith('#')) paths.push(t);
    }
  }
  if (paths.length === 0) {
    console.log('STAGING INCOMPLETE: no paths were given - an empty staging list verifies nothing (pass the SAME list you gave to git add).');
    return 1;
  }
  const result = testStagedList(root, paths, against);
  report(result, against, paths.length);
  return result.ok ? 0 : 1;
}

if (process.argv[1] && /verify-staged\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) {
  process.exit(main(process.argv.slice(2)));
}
