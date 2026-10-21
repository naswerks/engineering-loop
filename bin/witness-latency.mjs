#!/usr/bin/env node
// Every tool call with its wait, from the call to its result: a long wait on a gated call is a park or an
// approval, and a long wait on a plane call is the plane. Read-only.
//
//   node witness-latency.mjs <file.jsonl> <sinceIso> [minSeconds]
//   node witness-latency.mjs --self-test

import { rmSync } from 'node:fs';
import { at, clip, contentOf, entries, isMain, positionals, report, resultText, scratch, toolResult, toolUse, writeTranscript } from './witness-lib.mjs';

export async function latency(file, since, min = 0) {
  const uses = new Map();
  const out = [];
  for await (const { entry } of entries(file)) {
    if ((entry.timestamp ?? '') < since) continue;
    for (const c of contentOf(entry)) {
      if (c.type === 'tool_use') uses.set(c.id, { ts: entry.timestamp, name: c.name, input: JSON.stringify(c.input) });
      else if (c.type === 'tool_result' && uses.has(c.tool_use_id)) {
        const use = uses.get(c.tool_use_id);
        uses.delete(c.tool_use_id);
        const lag = (Date.parse(entry.timestamp) - Date.parse(use.ts)) / 1000;
        if (lag < min) continue;
        out.push(`${lag.toFixed(0).padStart(5)}s ${use.ts.slice(11, 19)}Z ${use.name} ${clip(use.input, 150)} => ${c.is_error ? 'ERROR ' : ''}${clip(resultText(c), 140)}`);
      }
    }
  }
  return out;
}

async function selfTest() {
  const dir = scratch('witness-latency');
  try {
    const file = writeTranscript(dir, 'seat.jsonl', [
      toolUse(1, 'a', 'Bash', { command: 'git status' }),
      toolResult(1.05, 'a', 'clean'),
      toolUse(2, 'b', 'Bash', { command: 'a command a human had to approve' }),
      toolResult(4, 'b', 'approved'),
    ]);
    const lines = await latency(file, at(0), 60);
    return report('witness-latency', [
      { name: 'a two-minute wait is a line', ok: lines.length === 1 && lines[0].trim().startsWith('120s') && lines[0].includes('approved'), detail: lines.join(' | ') },
      { name: 'CONTROL: a three-second call under the floor is not', ok: !lines.some((l) => l.includes('git status')), detail: lines.join(' | ') },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, since, min] = positionals(argv);
  if (!file || !since) { console.log('usage: witness-latency.mjs <file.jsonl> <sinceIso> [minSeconds]'); process.exit(2); }
  for (const line of await latency(file, since, Number(min ?? 0))) console.log(line);
}
