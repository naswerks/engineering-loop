// Shared by the witness tools in this folder: the config, a transcript read one line at a time, the
// plane's tool prefix, and the self-test helpers. Nothing here writes outside the paths a tool is given.
//
// The config is `witness.config.json` in the witness folder (or `--config <path>`). The folder is the
// witness's durable folder: the watcher keeps its state, its event log and its captures there, and the
// filed ledger is read from it. Every run-specific fact lives in the config, never in a tool.

import { createReadStream, existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULTS = {
  sourceDirs: ['src', 'tests'],
  generatedPaths: [],
  noisePaths: [],
  watchedCommands: [],
  branches: [],
  logScan: [],
  extraLogDirs: [],
  ownerContainers: [],
  reaperContainerPrefix: 'testcontainers-ryuk',
  pollSeconds: 20,
  probes: { processes: true, docker: true },
};

// The value after `name` in argv, or `fallback`.
export function flag(argv, name, fallback = undefined) {
  const at = argv.indexOf(name);
  return at >= 0 && at + 1 < argv.length ? argv[at + 1] : fallback;
}

// argv without the flags in `valued` (each with its value) and without bare `--` switches.
export function positionals(argv, valued = []) {
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    if (valued.includes(argv[i])) { i++; continue; }
    if (argv[i].startsWith('--')) continue;
    out.push(argv[i]);
  }
  return out;
}

export function loadConfig(argv, { required = false } = {}) {
  const path = resolve(flag(argv, '--config', 'witness.config.json'));
  if (!existsSync(path)) {
    if (required) throw new Error(`no witness config at ${path} - pass --config <path>`);
    return { ...DEFAULTS, dir: process.cwd(), path: null };
  }
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return { ...DEFAULTS, ...raw, probes: { ...DEFAULTS.probes, ...(raw.probes ?? {}) }, dir: dirname(path), path };
}

// The tool-name prefix of the plane's MCP server: `--plane <server>`, else the config's `planeServer`.
export function planePrefix(argv, config) {
  const server = flag(argv, '--plane') ?? config?.planeServer;
  if (!server) throw new Error('name the control plane\'s MCP server: --plane <server>, or planeServer in the config');
  return `mcp__${server}__`;
}

// The plane's read verbs. A read that succeeded is not an act; a read that failed is worth a line.
export const PLANE_READS = /^(read_blackboard|seat_read|seat_acts|seat_siblings|seat_usage|seat_parks|seat_content|seat_findings|seat_promises|seat_timeline|needs_you)$/;

export const clip = (value, n) => {
  const t = String(value ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n)}...` : t;
};

// A transcript entry's content blocks, whether the message holds a string or a list.
export function contentOf(entry) {
  const message = entry?.message;
  if (!message) return [];
  return Array.isArray(message.content) ? message.content : [{ type: 'text', text: message.content }];
}

export function resultText(block) {
  return Array.isArray(block.content) ? block.content.map((x) => x.text ?? '').join(' ') : String(block.content ?? '');
}

// Every entry of a transcript, one line at a time from `fromByte`, so a transcript of tens of megabytes is
// never held whole. Lines that do not parse are skipped.
export async function* entries(file, fromByte = 0) {
  const lines = createInterface({ input: createReadStream(file, { start: fromByte, encoding: 'utf8' }), crlfDelay: Infinity });
  let line = 0;
  for await (const raw of lines) {
    line++;
    if (!raw.trim()) continue;
    let entry;
    try { entry = JSON.parse(raw); } catch { continue; }
    yield { line, entry };
  }
}

export const isMain = (url) => Boolean(process.argv[1]) && pathToFileURL(resolve(process.argv[1])).href === url;

// --- self-test helpers ------------------------------------------------------------------------------

export const scratch = (prefix) => mkdtempSync(join(tmpdir(), `${prefix}-`));

// A timestamp `minutes` after a fixed base, so a fixture names no date of its own.
export const at = (minutes) => new Date(Date.UTC(2030, 0, 1) + minutes * 60000).toISOString();

export const userText = (minutes, text, extra = {}) => ({ type: 'user', timestamp: at(minutes), message: { role: 'user', content: text }, ...extra });
export const assistantText = (minutes, text) => ({ type: 'assistant', timestamp: at(minutes), message: { role: 'assistant', content: [{ type: 'text', text }] } });
export const toolUse = (minutes, id, name, input) => ({ type: 'assistant', timestamp: at(minutes), message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
export const toolResult = (minutes, id, text, isError = false) => ({ type: 'user', timestamp: at(minutes), message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: [{ type: 'text', text }], is_error: isError }] } });

export function writeTranscript(dir, name, events) {
  const path = join(dir, name);
  writeFileSync(path, events.map((e) => JSON.stringify(e)).join('\n') + '\n');
  return path;
}

// Prints one line per case and the verdict; returns the exit code. A case is { name, ok, detail }.
export function report(tool, cases) {
  let failed = 0;
  for (const c of cases) {
    if (!c.ok) failed++;
    console.log(`  [${c.ok ? 'PASS' : 'FAIL'}] ${c.name}${c.ok ? '' : ` - ${c.detail ?? ''}`}`);
  }
  console.log(failed === 0 ? `SELF-TEST PASSED: ${tool}` : `SELF-TEST FAILED: ${tool}: ${failed} case(s)`);
  return failed === 0 ? 0 : 1;
}
