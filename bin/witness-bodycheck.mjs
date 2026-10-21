#!/usr/bin/env node
// A moved or filed file's body, byte-identical to its version at the old path in HEAD, its header aside:
// the proof that a filing changed where a doc lives and its header, and nothing a reader relies on. The
// header is a leading frontmatter block and any line matching --header-line (by default the loop's own
// `<!-- meta: … -->` line). Read-only.
//
//   node witness-bodycheck.mjs <worktree> <newRelDir> <oldRelDir> <relPath>... [--header-line <regex>]
//   node witness-bodycheck.mjs --self-test

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { flag, isMain, positionals, report, scratch } from './witness-lib.mjs';

const DEFAULT_HEADER_LINE = '^<!-- meta: .*-->\\s*$';
const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);

// The body of a file: what is left after its leading frontmatter and its header lines.
export function bodyOf(text, headerLine = DEFAULT_HEADER_LINE) {
  const fm = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const rest = fm ? text.slice(fm[0].length) : text;
  const header = new RegExp(headerLine);
  const lines = rest.split(/(?<=\n)/);
  return { header: (fm ? fm[0] : '') + lines.filter((l) => header.test(l)).join(''), body: lines.filter((l) => !header.test(l)).join('') };
}

export function bodycheck(worktree, newDir, oldDir, files, headerLine = DEFAULT_HEADER_LINE) {
  const out = [];
  let bad = 0;
  for (const f of files) {
    const now = readFileSync(join(worktree, newDir, f), 'utf8');
    let head;
    try { head = execFileSync('git', ['-C', worktree, 'show', `HEAD:${oldDir}/${f}`], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }); }
    catch { out.push(`?    ${f}: no HEAD version at ${oldDir}/${f}`); bad++; continue; }
    const n = bodyOf(now, headerLine);
    const h = bodyOf(head, headerLine);
    const same = n.body === h.body;
    if (!same) bad++;
    out.push(`${same ? 'SAME' : 'DIFF'} ${f}: body ${sha(n.body)} vs HEAD ${sha(h.body)}; header now ${n.header.length} chars, HEAD header ${h.header.length} chars`);
  }
  out.push(bad ? `${bad} file(s) NOT proven` : 'all bodies byte-identical to HEAD');
  return { ok: bad === 0, out };
}

function selfTest() {
  const dir = scratch('witness-bodycheck');
  try {
    const git = (...args) => execFileSync('git', ['-C', dir, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    git('init', '-q');
    mkdirSync(join(dir, 'research'), { recursive: true });
    const body = '# A doc\n\n> what it is\n\nThe body a reader relies on.\n';
    writeFileSync(join(dir, 'research', 'a.md'), body.replace('\n\n> what', '\n<!-- meta: type=research; status=draft -->\n\n> what'));
    writeFileSync(join(dir, 'research', 'b.md'), body);
    git('add', 'research');
    git('-c', 'user.name=t', '-c', 'user.email=t@local', 'commit', '-q', '-m', 'docs');
    mkdirSync(join(dir, 'archive'), { recursive: true });
    writeFileSync(join(dir, 'archive', 'a.md'), body.replace('\n\n> what', '\n<!-- meta: type=research; status=archived -->\n\n> what'));
    writeFileSync(join(dir, 'archive', 'b.md'), `---\nstatus: deprecated\n---\n${body.replace('relies on', 'once relied on')}`);
    const { out } = bodycheck(dir, 'archive', 'research', ['a.md', 'b.md']);
    return report('witness-bodycheck', [
      { name: 'a filed doc whose header alone changed reads SAME', ok: out.some((l) => l.startsWith('SAME a.md')), detail: out.join(' | ') },
      { name: 'CONTROL: a filed doc whose body changed reads DIFF, header aside', ok: out.some((l) => l.startsWith('DIFF b.md')), detail: out.join(' | ') },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(selfTest());
  const [worktree, newDir, oldDir, ...files] = positionals(argv, ['--header-line']);
  if (!worktree || !newDir || !oldDir || files.length === 0) { console.log('usage: witness-bodycheck.mjs <worktree> <newRelDir> <oldRelDir> <relPath>... [--header-line <regex>]'); process.exit(2); }
  const { ok, out } = bodycheck(worktree, newDir, oldDir, files, flag(argv, '--header-line') ?? DEFAULT_HEADER_LINE);
  for (const line of out) console.log(line);
  process.exit(ok ? 0 : 1);
}
