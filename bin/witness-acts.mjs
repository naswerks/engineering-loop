#!/usr/bin/env node
// Every control-plane write in a transcript, and every plane call that failed, with its act number and
// outcome: the plane's rows as one session's tool results show them. Name them "rows via transcript" in a
// ledger, never a row you read. Read-only.
//
//   node witness-acts.mjs <label> <file.jsonl> [--plane <server>] [--config <path>]
//   -> TSV: time, label, verb, seat, act, ok|ERROR, detail
//   node witness-acts.mjs --self-test

import { rmSync } from 'node:fs';
import { PLANE_READS, clip, contentOf, entries, isMain, loadConfig, planePrefix, positionals, report, resultText, scratch, toolResult, toolUse, writeTranscript } from './witness-lib.mjs';

export async function acts(file, prefix, label) {
  const uses = new Map();
  const out = [];
  for await (const { entry } of entries(file)) {
    for (const c of contentOf(entry)) {
      if (c.type === 'tool_use' && typeof c.name === 'string' && c.name.startsWith(prefix)) {
        uses.set(c.id, { ts: entry.timestamp ?? '', verb: c.name.slice(prefix.length), input: c.input ?? {} });
      } else if (c.type === 'tool_result' && uses.has(c.tool_use_id)) {
        const use = uses.get(c.tool_use_id);
        uses.delete(c.tool_use_id);
        if (PLANE_READS.test(use.verb) && !c.is_error) continue;
        const body = resultText(c);
        const act = body.match(/"spawnedActId":(\d+)/)?.[1] ?? body.match(/\bact (\d{3,})/)?.[1] ?? '';
        const detail = c.is_error ? body : (use.input.verdict ?? use.input.ruling ?? use.input.basis ?? use.input.path ?? '');
        out.push([`${String(use.ts).slice(0, 19)}Z`, label, use.verb, use.input.seatId ?? '', act, c.is_error ? 'ERROR' : 'ok', clip(detail, 170)].join('\t'));
      }
    }
  }
  return out;
}

async function selfTest() {
  const dir = scratch('witness-acts');
  try {
    const file = writeTranscript(dir, 'coordinator.jsonl', [
      toolUse(1, 'a', 'mcp__plane__accept_plan', { seatId: 7, verdict: 'accept-with-riders' }),
      toolResult(2, 'a', 'Accepted. Recorded as act 1234; delivery: delivered'),
      toolUse(3, 'b', 'mcp__plane__seat_read', { seatId: 7 }),
      toolResult(3, 'b', 'seat 7 is building'),
      toolUse(4, 'c', 'mcp__plane__seat_acts', { seatId: 7 }),
      toolResult(4, 'c', 'HTTP 404 from the plane', true),
      toolUse(5, 'd', 'Read', { file_path: 'tldr.md' }),
      toolResult(5, 'd', 'the board says act 9999 landed'),
    ]);
    const lines = await acts(file, 'mcp__plane__', 'coord');
    return report('witness-acts', [
      { name: 'a plane write is a line, with its act number', ok: lines.some((l) => l.includes('\taccept_plan\t7\t1234\tok\taccept-with-riders')), detail: lines.join(' | ') },
      { name: 'a failed plane read is a line', ok: lines.some((l) => l.includes('\tseat_acts\t7\t\tERROR\tHTTP 404')), detail: lines.join(' | ') },
      { name: 'CONTROL: a read that answered, and a Read of a file that mentions an act, are not', ok: lines.length === 2, detail: `${lines.length} lines` },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [label, file] = positionals(argv, ['--plane', '--config']);
  if (!label || !file) { console.log('usage: witness-acts.mjs <label> <file.jsonl> [--plane <server>]'); process.exit(2); }
  for (const line of await acts(file, planePrefix(argv, loadConfig(argv)), label)) console.log(line);
}
