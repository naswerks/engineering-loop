#!/usr/bin/env node
// A transcript digest, one line per event: its line number, its time, its kind and a clipped payload. The
// fastest read of what a session did, without holding the transcript in context. Read-only.
//
//   node witness-tx.mjs <file.jsonl> [fromLine] [maxText]
//   node witness-tx.mjs --self-test

import { rmSync } from 'node:fs';
import { assistantText, at, clip, contentOf, entries, isMain, positionals, report, resultText, scratch, toolResult, toolUse, userText, writeTranscript } from './witness-lib.mjs';

export async function digest(file, from = 0, max = 400) {
  const out = [];
  let last = '?';
  let count = 0;
  for await (const { line, entry } of entries(file)) {
    count = line;
    last = entry.timestamp ?? last;
    if (line < from) continue;
    const ts = (entry.timestamp ?? '').replace('T', ' ').slice(0, 19);
    if (!entry.message) { out.push(`${line} ${ts} ${entry.type ?? '?'} ${clip(entry.subtype ?? entry.content ?? '', max)}`); continue; }
    for (const c of contentOf(entry)) {
      if (c.type === 'text') out.push(`${line} ${ts} ${entry.message.role}:text ${clip(c.text, max)}`);
      else if (c.type === 'tool_use') out.push(`${line} ${ts} tool_use ${c.name} ${clip(JSON.stringify(c.input), max)}`);
      else if (c.type === 'tool_result') out.push(`${line} ${ts} tool_result${c.is_error ? ' ERROR' : ''} ${clip(resultText(c), max)}`);
      else if (c.type === 'thinking') out.push(`${line} ${ts} thinking ${clip(c.thinking, max)}`);
      else out.push(`${line} ${ts} ${c.type}`);
    }
  }
  out.push(`-- ${count} lines; last ts ${last}`);
  return out;
}

async function selfTest() {
  const dir = scratch('witness-tx');
  try {
    const file = writeTranscript(dir, 'seat.jsonl', [
      userText(0, 'the seed'),
      toolUse(1, 'a', 'Bash', { command: 'git status' }),
      toolResult(1, 'a', 'boom', true),
      assistantText(2, 'x'.repeat(50)),
      { type: 'system', subtype: 'compact_boundary', timestamp: at(3) },
    ]);
    const lines = await digest(file, 0, 20);
    return report('witness-tx', [
      { name: 'each event kind gets its line', ok: ['user:text the seed', 'tool_use Bash', 'tool_result ERROR boom', 'system compact_boundary'].every((k) => lines.some((l) => l.includes(k))), detail: lines.join(' | ') },
      { name: 'a long text is clipped to the limit', ok: lines.some((l) => l.includes(`assistant:text ${'x'.repeat(20)}...`)), detail: lines.join(' | ') },
      { name: 'CONTROL: lines before fromLine are skipped and the total still counts them', ok: (await digest(file, 4, 20)).every((l) => !l.includes('the seed')) && lines.at(-1).startsWith('-- 5 lines'), detail: lines.at(-1) },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, from, max] = positionals(argv);
  if (!file) { console.log('usage: witness-tx.mjs <file.jsonl> [fromLine] [maxText]'); process.exit(2); }
  for (const line of await digest(file, Number(from ?? 0), Number(max ?? 400))) console.log(line);
}
