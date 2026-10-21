#!/usr/bin/env node
// One tool call's command, written to a file byte for byte, with its line count and every non-ASCII
// character named: a refused command is often explained by one character a terminal never shows.
// Writes only <outFile>.
//
//   node witness-extract-cmd.mjs <file.jsonl> <toolUseId> <outFile>
//   node witness-extract-cmd.mjs --self-test

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentOf, entries, isMain, positionals, report, scratch, toolUse, writeTranscript } from './witness-lib.mjs';

export async function extractCmd(file, id, outFile) {
  for await (const { entry } of entries(file)) {
    for (const c of contentOf(entry)) {
      if (c.type !== 'tool_use' || c.id !== id) continue;
      const command = String(c.input?.command ?? '');
      writeFileSync(outFile, command);
      const lines = command.split('\n');
      const out = [`${lines.length} line(s), ${Buffer.byteLength(command)} bytes -> ${outFile}`];
      lines.forEach((line, i) => {
        const odd = [...line].filter((ch) => ch.charCodeAt(0) > 127);
        if (odd.length) out.push(`non-ascii on line ${i + 1}: ${odd.map((ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join(' ')}`);
      });
      return out;
    }
  }
  return [`no tool call ${id} in ${file}`];
}

async function selfTest() {
  const dir = scratch('witness-extract-cmd');
  try {
    const command = 'cat >> tldr.md <<\'EOF\'\nC:\\work\\path and a dash — here\nEOF';
    const file = writeTranscript(dir, 'seat.jsonl', [
      toolUse(1, 'toolu_one', 'Bash', { command: 'git status' }),
      toolUse(2, 'toolu_two', 'Bash', { command }),
    ]);
    const out = join(dir, 'command.txt');
    const lines = await extractCmd(file, 'toolu_two', out);
    return report('witness-extract-cmd', [
      { name: 'the command is written byte for byte, backslashes included', ok: readFileSync(out, 'utf8') === command, detail: JSON.stringify(readFileSync(out, 'utf8')) },
      { name: 'its non-ASCII character is named with its line', ok: lines.some((l) => l === 'non-ascii on line 2: U+2014'), detail: lines.join(' | ') },
      { name: 'CONTROL: an id not in the transcript says so', ok: (await extractCmd(file, 'toolu_none', out))[0].startsWith('no tool call'), detail: '' },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  const [file, id, outFile] = positionals(argv);
  if (!file || !id || !outFile) { console.log('usage: witness-extract-cmd.mjs <file.jsonl> <toolUseId> <outFile>'); process.exit(2); }
  for (const line of await extractCmd(file, id, outFile)) console.log(line);
}
