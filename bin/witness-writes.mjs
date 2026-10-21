#!/usr/bin/env node
// When a session first wrote into the source folders, set against the plane verbs it called: the
// plan-before-build tripwire is a seat's first source write against its landed `accept_plan`. Caveats a
// ledger names with the result: a write made through a shell copy is not seen here (only the edit tools
// are), and a build's side effect can dirty a source folder with no seat edit at all. Read-only.
//
//   node witness-writes.mjs <file.jsonl> <worktree-folder-name> [--source-dirs src,tests] [--plane <server>] [--config <path>]
//   node witness-writes.mjs --self-test

import { rmSync } from 'node:fs';
import { contentOf, entries, flag, isMain, loadConfig, planePrefix, positionals, report, scratch, toolUse, writeTranscript } from './witness-lib.mjs';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function writes(file, key, sourceDirs, prefix) {
  const realTree = new RegExp(`${escape(key)}[\\\\/]+(${sourceDirs.map(escape).join('|')})[\\\\/]`);
  let first = null;
  let last = null;
  let count = 0;
  const plane = [];
  for await (const { line, entry } of entries(file)) {
    for (const c of contentOf(entry)) {
      if (c.type !== 'tool_use') continue;
      if (typeof c.name === 'string' && c.name.startsWith(prefix)) plane.push(`${line} ${entry.timestamp} ${c.name.slice(prefix.length)} ${JSON.stringify(c.input).slice(0, 120)}`);
      const path = String(c.input?.file_path ?? c.input?.notebook_path ?? '');
      if (!/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(c.name) || !realTree.test(path)) continue;
      count++;
      first ??= `${line} ${entry.timestamp} ${c.name} ${path}`;
      last = `${line} ${entry.timestamp}`;
    }
  }
  return [`first source write: ${first}`, `source writes: ${count}, last: ${last}`, 'plane calls:', ...plane];
}

async function selfTest() {
  const dir = scratch('witness-writes');
  try {
    const file = writeTranscript(dir, 'seat.jsonl', [
      toolUse(1, 'a', 'Write', { file_path: 'C:/work/pipeline-7/docs/notes.md' }),
      toolUse(2, 'b', 'mcp__plane__post_plan', { path: 'plan.md' }),
      toolUse(3, 'c', 'Bash', { command: 'cp draft.ts C:/work/pipeline-7/src/a.ts' }),
      toolUse(4, 'd', 'Edit', { file_path: 'C:\\work\\pipeline-7\\src\\a.ts' }),
      toolUse(5, 'e', 'Write', { file_path: 'C:/work/pipeline-7/tests/a.test.ts' }),
    ]);
    const lines = await writes(file, 'pipeline-7', ['src', 'tests'], 'mcp__plane__');
    return report('witness-writes', [
      { name: 'the first source write is the edit into src', ok: lines[0].startsWith('first source write: 4 ') && lines[0].includes('Edit'), detail: lines[0] },
      { name: 'both source writes are counted, and the plane call is listed', ok: lines[1].startsWith('source writes: 2') && lines.some((l) => l.includes('post_plan')), detail: lines.join(' | ') },
      { name: 'CONTROL: a docs write and a shell copy are not source writes', ok: !lines[0].includes('notes.md') && !lines[0].includes('cp '), detail: lines[0] },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const config = loadConfig(argv);
  const [file, key] = positionals(argv, ['--plane', '--config', '--source-dirs']);
  if (!file || !key) { console.log('usage: witness-writes.mjs <file.jsonl> <worktree-folder-name> [--source-dirs src,tests] [--plane <server>]'); process.exit(2); }
  const sourceDirs = (flag(argv, '--source-dirs') ?? config.sourceDirs.join(',')).split(',').filter(Boolean);
  for (const line of await writes(file, key, sourceDirs, planePrefix(argv, config))) console.log(line);
}
