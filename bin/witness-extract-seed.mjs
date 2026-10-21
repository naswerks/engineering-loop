#!/usr/bin/env node
// A session's seed (its first user message) and its prompt snapshots, saved verbatim. The seed is what the
// session was told; the policy text a control plane appends to the system prompt lives in the
// `prompt_snapshot` attachments, not in the seed. Writes <outPrefix>-seed-as-kicked.txt and
// <outPrefix>-prompt-snapshots.txt.
//
//   node witness-extract-seed.mjs <file.jsonl> <outPrefix>
//   node witness-extract-seed.mjs --self-test

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { at, entries, isMain, positionals, report, scratch, userText, writeTranscript } from './witness-lib.mjs';

// A user message shorter than this is a command or a meta line, never a seed.
const SEED_FLOOR = 200;

export async function extractSeed(file, outPrefix) {
  let seed = null;
  const snapshots = [];
  for await (const { entry } of entries(file)) {
    if (seed === null && entry.message?.role === 'user' && !entry.isMeta) {
      const c = entry.message.content;
      const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x.type === 'text').map((x) => x.text).join('\n') : '';
      if (text.length > SEED_FLOOR) seed = `${entry.timestamp}\n${text}`;
    }
    if (entry.type === 'attachment' && /prompt_snapshot/.test(JSON.stringify(entry.attachment?.type ?? ''))) {
      snapshots.push(`${entry.timestamp}\n${JSON.stringify(entry.attachment, null, 1)}`);
    }
  }
  writeFileSync(`${outPrefix}-seed-as-kicked.txt`, seed ?? '(no seed found)');
  writeFileSync(`${outPrefix}-prompt-snapshots.txt`, snapshots.join('\n\n=====\n\n') || '(no prompt_snapshot attachments)');
  return [`seed ${seed === null ? 0 : seed.length} chars; prompt snapshots ${snapshots.length}`];
}

async function selfTest() {
  const dir = scratch('witness-extract-seed');
  try {
    const seed = `You are the COORDINATOR. ${'Read the brief and follow it. '.repeat(10)}`;
    const file = writeTranscript(dir, 'seat.jsonl', [
      userText(0, '<command-name>/clear</command-name>'),
      userText(1, seed),
      { type: 'attachment', timestamp: at(1), attachment: { type: 'prompt_snapshot', text: 'the policy suffix' } },
      userText(9, `a later human message ${'x'.repeat(SEED_FLOOR)}`),
    ]);
    const prefix = join(dir, 'coordinator');
    await extractSeed(file, prefix);
    const saved = readFileSync(`${prefix}-seed-as-kicked.txt`, 'utf8');
    const snapshots = readFileSync(`${prefix}-prompt-snapshots.txt`, 'utf8');
    return report('witness-extract-seed', [
      { name: 'the seed is the first user message long enough to be one, saved verbatim', ok: saved.endsWith(`\n${seed}`), detail: saved.slice(0, 80) },
      { name: 'the prompt snapshot is saved', ok: snapshots.includes('the policy suffix'), detail: snapshots.slice(0, 80) },
      { name: 'CONTROL: a short command line before it and a later message are not the seed', ok: !saved.includes('/clear') && !saved.includes('a later human message'), detail: saved.slice(0, 80) },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, outPrefix] = positionals(argv);
  if (!file || !outPrefix) { console.log('usage: witness-extract-seed.mjs <file.jsonl> <outPrefix>'); process.exit(2); }
  for (const line of await extractSeed(file, outPrefix)) console.log(line);
}
