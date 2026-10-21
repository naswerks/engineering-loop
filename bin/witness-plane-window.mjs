#!/usr/bin/env node
// Every plane call in a time window, reads included, with its full result: what a session asked the plane
// and what the plane answered, for the minutes a claim is about. Read-only.
//
//   node witness-plane-window.mjs <file.jsonl> <fromIso> <toIso> [maxChars] [--plane <server>] [--config <path>]
//   node witness-plane-window.mjs --self-test

import { rmSync } from 'node:fs';
import { contentOf, entries, isMain, loadConfig, planePrefix, positionals, report, resultText, scratch, toolResult, toolUse, writeTranscript, at } from './witness-lib.mjs';

export async function window(file, prefix, from, to, max = 700) {
  const uses = new Map();
  const out = [];
  for await (const { entry } of entries(file)) {
    for (const c of contentOf(entry)) {
      if (c.type === 'tool_use' && typeof c.name === 'string' && c.name.startsWith(prefix)) {
        uses.set(c.id, { ts: entry.timestamp ?? '', verb: c.name.slice(prefix.length), input: c.input ?? {} });
      } else if (c.type === 'tool_result' && uses.has(c.tool_use_id)) {
        const use = uses.get(c.tool_use_id);
        uses.delete(c.tool_use_id);
        if (use.ts < from || use.ts > to) continue;
        const body = resultText(c).replace(/\s+/g, ' ');
        out.push(`${use.ts} -> ${entry.timestamp} ${use.verb} ${JSON.stringify(use.input).slice(0, 80)} => ${c.is_error ? 'ERROR ' : ''}${body.slice(0, max)}`);
      }
    }
  }
  return out;
}

async function selfTest() {
  const dir = scratch('witness-plane-window');
  try {
    const file = writeTranscript(dir, 'coordinator.jsonl', [
      toolUse(1, 'a', 'mcp__plane__seat_read', { seatId: 3 }),
      toolResult(1, 'a', 'seat 3: building'),
      toolUse(10, 'b', 'mcp__plane__callout', { seatId: 3, ruling: 'go' }),
      toolResult(11, 'b', 'RULING RECORDED, NOT DELIVERED'),
      toolUse(30, 'c', 'mcp__plane__seat_read', { seatId: 3 }),
      toolResult(30, 'c', 'seat 3: waiting'),
    ]);
    const lines = await window(file, 'mcp__plane__', at(5), at(20));
    return report('witness-plane-window', [
      { name: 'a call inside the window is a line, with its result', ok: lines.length === 1 && lines[0].includes('callout') && lines[0].includes('RECORDED, NOT DELIVERED'), detail: lines.join(' | ') },
      { name: 'CONTROL: calls before and after the window are not', ok: !lines.some((l) => l.includes('seat_read')), detail: lines.join(' | ') },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, from, to, max] = positionals(argv, ['--plane', '--config']);
  if (!file || !from || !to) { console.log('usage: witness-plane-window.mjs <file.jsonl> <fromIso> <toIso> [maxChars] [--plane <server>]'); process.exit(2); }
  for (const line of await window(file, planePrefix(argv, loadConfig(argv)), from, to, Number(max ?? 700))) console.log(`${line}\n`);
}
