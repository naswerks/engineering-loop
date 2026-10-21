#!/usr/bin/env node
// Files the witness ledger into the run's sessions folder, on the human's word: the ledger's body
// unedited, under the header the repository's § Doc metadata (repository-owned) prescribes. The header is
// the config's `ledgerHeader` (a string, or a list of lines) with `{date}`, `{pipeline}` and `{topic}`
// filled in; the ledger is `ledger.md` in the witness folder, or --ledger <path>. It refuses to overwrite.
//
//   node witness-file-ledger.mjs <destPath> [--config <path>] [--ledger <path>]
//   -> e.g. docs/research/{topic}/sessions/witness-ledger-{date}.md
//   node witness-file-ledger.mjs --self-test

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag, isMain, loadConfig, positionals, report, scratch } from './witness-lib.mjs';

export function fileLedger(dest, config, ledgerPath, today = new Date().toISOString().slice(0, 10)) {
  if (existsSync(dest)) return { ok: false, out: [`EXISTS, refusing to overwrite: ${dest}`] };
  if (config.ledgerHeader === undefined) {
    return { ok: false, out: ['no ledgerHeader in the config - the filed ledger needs the header the repository\'s § Doc metadata (repository-owned) prescribes'] };
  }
  const template = Array.isArray(config.ledgerHeader) ? config.ledgerHeader.join('\n') : String(config.ledgerHeader);
  const header = template.replaceAll('{date}', today).replaceAll('{pipeline}', String(config.pipeline ?? '')).replaceAll('{topic}', String(config.topic ?? ''));
  const body = readFileSync(ledgerPath, 'utf8').replace(/\r/g, '');
  writeFileSync(dest, `${header}\n${body}`);
  return { ok: true, out: [`wrote ${header.length + 1 + body.length} chars to ${dest}; body ${body.length} chars = the ledger, unedited`] };
}

function selfTest() {
  const dir = scratch('witness-file-ledger');
  try {
    const ledger = join(dir, 'ledger.md');
    writeFileSync(ledger, '# Witness ledger\n\nW1 the kick, by its act.\n');
    const config = { pipeline: '42', topic: 'demo', ledgerHeader: ['---', 'title: "Witness ledger, pipeline {pipeline} ({date})"', 'status: deprecated', '---', ''] };
    const dest = join(dir, 'witness-ledger.md');
    const first = fileLedger(dest, config, ledger, 'the-date');
    const filed = readFileSync(dest, 'utf8');
    const second = fileLedger(dest, config, ledger, 'the-date');
    const headless = fileLedger(join(dir, 'other.md'), { ...config, ledgerHeader: undefined }, ledger);
    return report('witness-file-ledger', [
      { name: 'the ledger is filed under the configured header, its body unedited', ok: first.ok && filed === '---\ntitle: "Witness ledger, pipeline 42 (the-date)"\nstatus: deprecated\n---\n\n# Witness ledger\n\nW1 the kick, by its act.\n', detail: JSON.stringify(filed) },
      { name: 'CONTROL: a second filing refuses to overwrite', ok: !second.ok && second.out[0].startsWith('EXISTS'), detail: second.out[0] },
      { name: 'CONTROL: a config with no header refuses rather than inventing one', ok: !headless.ok && !existsSync(join(dir, 'other.md')), detail: headless.out[0] },
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(selfTest());
  const [dest] = positionals(argv, ['--config', '--ledger']);
  if (!dest) { console.log('usage: witness-file-ledger.mjs <destPath> [--config <path>] [--ledger <path>]'); process.exit(2); }
  const config = loadConfig(argv, { required: true });
  const { ok, out } = fileLedger(dest, config, flag(argv, '--ledger') ?? join(config.dir, 'ledger.md'));
  for (const line of out) console.log(line);
  process.exit(ok ? 0 : 1);
}
