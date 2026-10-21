#!/usr/bin/env node
// Idle gaps between a transcript's consecutive entries, its first and last timestamps, and the entries a
// pattern matches. A transcript with no entry since T has not acted since T. Read-only.
//
//   node witness-gaps.mjs <file.jsonl> <minGapMinutes> [pattern]
//   node witness-gaps.mjs --self-test

import { rmSync } from 'node:fs';
import { assistantText, entries, isMain, positionals, report, scratch, userText, writeTranscript } from './witness-lib.mjs';

export async function gaps(file, min = 10, pattern = null) {
  const re = pattern ? new RegExp(pattern) : null;
  const out = [];
  let prev = null;
  let first = null;
  for await (const { entry } of entries(file)) {
    const ts = entry.timestamp;
    if (!ts) continue;
    first ??= ts;
    const minutes = prev ? (Date.parse(ts) - Date.parse(prev)) / 60000 : 0;
    if (prev && minutes >= min) out.push(`GAP ${minutes.toFixed(0)} min: ${prev} -> ${ts}`);
    if (re) {
      const hit = JSON.stringify(entry.message?.content ?? entry.content ?? '').match(re);
      if (hit) out.push(`MATCH ${ts} ${hit[0].slice(0, 160)}`);
    }
    prev = ts;
  }
  out.push(`first ${first} last ${prev}`);
  return out;
}

async function selfTest() {
  const dir = scratch('witness-gaps');
  try {
    const file = writeTranscript(dir, 'seat.jsonl', [
      userText(0, 'the seed'),
      assistantText(5, 'working'),
      assistantText(45, 'back after the limit reset'),
    ]);
    const lines = await gaps(file, 10, 'limit reset');
    return report('witness-gaps', [
      { name: 'a forty-minute gap is a line', ok: lines.some((l) => l.startsWith('GAP 40 min')), detail: lines.join(' | ') },
      { name: 'CONTROL: a five-minute gap under the floor is not', ok: !lines.some((l) => l.startsWith('GAP 5 ')), detail: lines.join(' | ') },
      { name: 'the pattern and the first and last timestamps are reported', ok: lines.some((l) => l.startsWith('MATCH')) && lines.at(-1).startsWith('first '), detail: lines.join(' | ') },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, min, pattern] = positionals(argv);
  if (!file) { console.log('usage: witness-gaps.mjs <file.jsonl> <minGapMinutes> [pattern]'); process.exit(2); }
  for (const line of await gaps(file, Number(min ?? 10), pattern ?? null)) console.log(line);
}
