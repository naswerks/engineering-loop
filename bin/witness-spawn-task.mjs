#!/usr/bin/env node
// Each `seat_spawn` call's task exactly as the coordinator sent it, one file per spawn, and the plane's
// answer: what a seat was told, in the words that reached it. Writes only into <outDir>.
//
//   node witness-spawn-task.mjs <file.jsonl> <outDir> [--plane <server>] [--config <path>]
//   node witness-spawn-task.mjs --self-test

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentOf, entries, isMain, loadConfig, planePrefix, positionals, report, resultText, scratch, toolResult, toolUse, writeTranscript } from './witness-lib.mjs';

export async function spawnTasks(file, prefix, outDir) {
  mkdirSync(outDir, { recursive: true });
  const pending = new Set();
  const out = [];
  for await (const { entry } of entries(file)) {
    for (const c of contentOf(entry)) {
      if (c.type === 'tool_use' && c.name === `${prefix}seat_spawn`) {
        pending.add(c.id);
        const input = c.input ?? {};
        const path = join(outDir, `spawn-${input.seatId}-task-as-sent.txt`);
        writeFileSync(path, `${entry.timestamp}\n${JSON.stringify({ ...input, task: undefined })}\n\n${input.task ?? ''}`);
        out.push(`seat ${input.seatId} task ${String(input.task ?? '').length} chars -> ${path}`);
      } else if (c.type === 'tool_result' && pending.has(c.tool_use_id)) {
        pending.delete(c.tool_use_id);
        out.push(`  result: ${resultText(c)}`);
      }
    }
  }
  return out;
}

async function selfTest() {
  const dir = scratch('witness-spawn-task');
  try {
    const task = 'You are a BUILD SEAT.\nYour spec: 01-a-slice.md\n\tindented line, kept as sent';
    const file = writeTranscript(dir, 'coordinator.jsonl', [
      toolUse(1, 'a', 'mcp__plane__seat_spawn', { seatId: 12, task }),
      toolResult(2, 'a', 'spawned; act 4321'),
      toolUse(3, 'b', 'mcp__plane__seat_read', { seatId: 12 }),
      toolResult(3, 'b', 'seat 12: planning'),
    ]);
    const lines = await spawnTasks(file, 'mcp__plane__', join(dir, 'out'));
    const saved = readFileSync(join(dir, 'out', 'spawn-12-task-as-sent.txt'), 'utf8');
    return report('witness-spawn-task', [
      { name: 'the task is saved exactly as sent', ok: saved.endsWith(`\n\n${task}`), detail: JSON.stringify(saved.slice(-80)) },
      { name: 'the plane\'s answer is reported', ok: lines.some((l) => l.includes('result: spawned; act 4321')), detail: lines.join(' | ') },
      { name: 'CONTROL: another plane call is not a spawn', ok: lines.length === 2, detail: `${lines.length} lines` },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, outDir] = positionals(argv, ['--plane', '--config']);
  if (!file || !outDir) { console.log('usage: witness-spawn-task.mjs <file.jsonl> <outDir> [--plane <server>]'); process.exit(2); }
  for (const line of await spawnTasks(file, planePrefix(argv, loadConfig(argv)), outDir)) console.log(line);
}
