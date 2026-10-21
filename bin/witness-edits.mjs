#!/usr/bin/env node
// Every edit and write a session made in a time window, the old and new text clipped, and its own words
// that match a filter: how to tell "fixed the code" from "loosened the test". Read-only.
//
//   node witness-edits.mjs <file.jsonl> <fromIso> <toIso> [textFilterRegex] [--worktree-key <folder>]
//   node witness-edits.mjs --self-test

import { rmSync } from 'node:fs';
import { assistantText, at, clip, contentOf, entries, flag, isMain, positionals, report, scratch, toolUse, writeTranscript } from './witness-lib.mjs';

export async function edits(file, from, to, filter = null, key = null) {
  const textFilter = filter ? new RegExp(filter, 'i') : null;
  const out = [];
  for await (const { entry } of entries(file)) {
    const ts = entry.timestamp ?? '';
    if (ts < from || ts > to) continue;
    for (const c of contentOf(entry)) {
      if (c.type === 'tool_use' && /^(Edit|Write|MultiEdit)$/.test(c.name)) {
        const full = String(c.input?.file_path ?? '');
        const path = key ? (full.split(new RegExp(`${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\\\/]`))[1] ?? full) : full;
        out.push(`${ts.slice(11, 19)} ${c.name} ${path}`);
        if (c.name === 'Edit') {
          out.push(`   - ${clip(c.input.old_string, 240)}`);
          out.push(`   + ${clip(c.input.new_string, 240)}`);
        }
      } else if (c.type === 'text' && textFilter && textFilter.test(c.text ?? '')) {
        out.push(`${ts.slice(11, 19)} TEXT ${clip(c.text, 420)}`);
      }
    }
  }
  return out;
}

async function selfTest() {
  const dir = scratch('witness-edits');
  try {
    const file = writeTranscript(dir, 'seat.jsonl', [
      toolUse(1, 'a', 'Edit', { file_path: 'C:/work/pipeline-7/src/a.ts', old_string: 'return 1', new_string: 'return 2' }),
      toolUse(10, 'b', 'Edit', { file_path: 'C:/work/pipeline-7/tests/a.test.ts', old_string: 'assert.equal(x, 2)', new_string: 'assert.ok(x)' }),
      assistantText(11, 'I loosened the assertion so the test passes'),
      toolUse(30, 'c', 'Write', { file_path: 'C:/work/pipeline-7/src/b.ts' }),
    ]);
    const lines = await edits(file, at(5), at(20), 'loosened', 'pipeline-7');
    return report('witness-edits', [
      { name: 'an edit in the window is listed with its old and new text, path inside the worktree', ok: lines.some((l) => l.endsWith('Edit tests/a.test.ts')) && lines.some((l) => l.includes('- assert.equal(x, 2)')), detail: lines.join(' | ') },
      { name: 'the session\'s own words matching the filter are listed', ok: lines.some((l) => l.includes('TEXT I loosened the assertion')), detail: lines.join(' | ') },
      { name: 'CONTROL: edits outside the window are not', ok: !lines.some((l) => l.includes('src/a.ts') || l.includes('src/b.ts')), detail: lines.join(' | ') },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, from, to, filter] = positionals(argv, ['--worktree-key']);
  if (!file || !from || !to) { console.log('usage: witness-edits.mjs <file.jsonl> <fromIso> <toIso> [textFilterRegex] [--worktree-key <folder>]'); process.exit(2); }
  for (const line of await edits(file, from, to, filter ?? null, flag(argv, '--worktree-key') ?? null)) console.log(line);
}
