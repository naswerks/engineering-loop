#!/usr/bin/env node
// doctor — can the loop run in this repository? One row per thing the skills read, a verdict per row,
// non-zero exit on any FAIL. Node >= 22, no dependencies. Usage: node doctor.mjs [repo-root]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repo = resolve(process.argv[2] || process.cwd());
const packRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const rows = [];
const row = (verdict, subject, detail = '') => rows.push({ verdict, subject, detail });
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : null);
const rel = (p) => p.slice(repo.length + 1).replace(/\\/g, '/');

// ── the pack's own version, for the stamp check ─────────────────────────────────────────────────
let packVersion = null;
try { packVersion = JSON.parse(readFileSync(join(packRoot, '.claude-plugin', 'plugin.json'), 'utf8')).version; } catch { /* reported below */ }

// ── 1. the eight folders ────────────────────────────────────────────────────────────────────────
const FOLDERS = ['_meta', 'research', 'working', 'archive', 'guides', 'patterns', 'infrastructure', 'features'];
if (!existsSync(join(repo, 'docs'))) row('FAIL', 'docs/', 'missing — run init');
for (const f of FOLDERS) {
  const p = join(repo, 'docs', f);
  if (!existsSync(p)) row('FAIL', `docs/${f}/`, 'missing');
  else if (f !== '_meta') row(existsSync(join(p, 'README.md')) ? 'ok' : 'DEGRADE', `docs/${f}/README.md`, existsSync(join(p, 'README.md')) ? '' : 'missing (init writes it)');
}

// ── 2. the two method docs and their stamp ──────────────────────────────────────────────────────
const STAMP = /^<!-- naswerks-loop: version=([0-9]+\.[0-9]+\.[0-9]+[^ ]*) -->/m;
for (const name of ['docs-workflow.md', 'engineering-loop.md']) {
  const p = join(repo, 'docs', '_meta', name);
  const text = read(p);
  if (text === null) { row('FAIL', `docs/_meta/${name}`, 'missing'); continue; }
  const m = STAMP.exec(text.split('\n', 1)[0]);
  if (!m) { row('FAIL', `docs/_meta/${name}`, 'no naswerks-loop stamp on line 1 — an unstamped copy cannot be told from a stale one'); continue; }
  if (!packVersion) { row('DEGRADE', `docs/_meta/${name}`, `stamped ${m[1]}; the pack's own version could not be read`); continue; }
  const cmp = compareVersions(m[1], packVersion);
  if (cmp < 0) row('DEGRADE', `docs/_meta/${name}`, `stamp ${m[1]} is behind the pack ${packVersion} — diff against the pack's references/${name}`);
  else row('ok', `docs/_meta/${name}`, `stamp ${m[1]}`);
}

// ── 3. doc-index and its three repo slots ───────────────────────────────────────────────────────
{
  const p = join(repo, 'docs', '_meta', 'doc-index.md');
  const text = read(p);
  if (text === null) row('FAIL', 'docs/_meta/doc-index.md', 'missing');
  else {
    for (const heading of ['## Role reading lists', '## Apps and their build commands', '## The evidence tools']) {
      const section = sectionOf(text, heading);
      if (section === null) row('FAIL', `doc-index.md ${heading}`, 'section missing');
      else if (/fill this in|\(none detected\)/i.test(section)) row('DEGRADE', `doc-index.md ${heading}`, 'present, carries only the absent-line');
      else row('ok', `doc-index.md ${heading}`, '');
    }
  }
}

// ── 4. the reading floor and the conditional docs ───────────────────────────────────────────────
const FLOOR = ['patterns/code-organization.md', 'patterns/backend-patterns.md', 'patterns/frontend-patterns.md', 'patterns/testing.md'];
const STANDARD = ['patterns/codegen.md', 'patterns/state-management.md', 'patterns/ui-style-guide.md', 'patterns/design-tokens.md', 'patterns/long-running-workflows.md', 'infrastructure/realtime-events.md', 'infrastructure/background-work.md'];
const roleRows = (() => { const t = read(join(repo, 'docs', '_meta', 'doc-index.md')); return t === null ? null : sectionOf(t, '## Role reading lists'); })();
for (const d of FLOOR) docRow(d, true);
for (const d of STANDARD) docRow(d, false);
function docRow(relPath, required) {
  const text = read(join(repo, 'docs', relPath));
  if (text === null) {
    if (required) { row('FAIL', `docs/${relPath}`, 'missing'); return; }
    const rowText = roleRows === null ? null : roleRows.split('\n').find((l) => l.includes(relPath));
    if (rowText && /not detected/i.test(rowText)) row('ok', `docs/${relPath}`, 'absent, and doc-index says why (not detected)');
    else row('FAIL', `docs/${relPath}`, 'absent with no doc-index row saying it was not detected — a seat meeting this path has no answer');
    return;
  }
  const meta = /<!-- meta:[^>]*status=([a-z]+)/.exec(text);
  if (!meta) row('DEGRADE', `docs/${relPath}`, 'no <!-- meta --> line');
  else if (meta[1] === 'draft') row('DEGRADE', `docs/${relPath}`, 'status=draft — scanned, not decided');
  else row('ok', `docs/${relPath}`, `status=${meta[1]}`);
  if (/<!-- init:/.test(text)) row('DEGRADE', `docs/${relPath}`, 'an <!-- init: --> instruction was left in the file');
}

// ── 4b. every path a Role reading lists row names resolves ─────────────────────────────────────
if (roleRows !== null) {
  for (const line of roleRows.split('\n').filter((l) => l.trim().startsWith('|') && !/^\|\s*-/.test(l.trim()) && !/^\|\s*Doc\s*\|/i.test(l.trim()))) {
    for (const m of line.matchAll(/`((?:patterns|infrastructure|guides|features)\/[A-Za-z0-9_.-]+\.md)`|\]\((?:\.\.\/)?((?:patterns|infrastructure|guides|features)\/[A-Za-z0-9_.-]+\.md)\)/g)) {
      const p = m[1] || m[2];
      if (/not detected/i.test(line)) continue;
      row(existsSync(join(repo, 'docs', p)) ? 'ok' : 'FAIL', `doc-index row: docs/${p}`, existsSync(join(repo, 'docs', p)) ? '' : 'the row names a path that does not exist');
    }
  }
}

// ── 5. CLAUDE.md / AGENTS.md stanza, settings pin ───────────────────────────────────────────────
for (const name of ['CLAUDE.md', 'AGENTS.md']) {
  const text = read(join(repo, name));
  if (text === null) { if (name === 'CLAUDE.md') row('DEGRADE', name, 'missing (init creates it with the stanza)'); continue; }
  row(text.includes('<!-- naswerks-loop:start-here -->') ? 'ok' : 'DEGRADE', `${name} stanza`, text.includes('<!-- naswerks-loop:start-here -->') ? '' : 'the Start-here stanza is not present');
}
{
  const p = join(repo, '.claude', 'settings.json');
  const text = read(p);
  if (text === null) row('DEGRADE', '.claude/settings.json', 'missing (init writes the plugin pin)');
  else {
    try {
      const j = JSON.parse(text);
      const mk = j.extraKnownMarketplaces && j.extraKnownMarketplaces['engineering-loop'];
      const en = j.enabledPlugins && j.enabledPlugins['naswerks@engineering-loop'] === true;
      row(mk && en ? 'ok' : 'DEGRADE', '.claude/settings.json pin', mk && en ? '' : `${mk ? '' : 'extraKnownMarketplaces.engineering-loop missing; '}${en ? '' : 'enabledPlugins["naswerks@engineering-loop"] missing'}`);
    } catch { row('DEGRADE', '.claude/settings.json', 'not valid JSON'); }
  }
}

// ── 6. verify-staged resolvable ─────────────────────────────────────────────────────────────────
{
  let ok = false;
  for (const [cmd, args] of [['verify-staged', ['--help']], ['npx', ['--no-install', 'verify-staged', '--help']]]) {
    try { execFileSync(cmd, args, { stdio: 'ignore', shell: process.platform === 'win32', timeout: 15000 }); ok = true; break; } catch { /* next */ }
  }
  const packBin = join(packRoot, 'bin', 'verify-staged.mjs');
  if (ok) row('ok', 'verify-staged', 'on PATH');
  else if (existsSync(packBin)) row('DEGRADE', 'verify-staged', `not on PATH; the skills' fallback is: node ${packBin.replace(/\\/g, '/')} {list}`);
  else row('DEGRADE', 'verify-staged', 'not on PATH and the pack bin was not found — install the pack (npm i -g @naswerks/engineering-loop)');
}

// ── 7. every ignition brief, checked the way the control plane checks it ────────────────────────
const KINDS = new Set(['coordinator', 'build', 'fixit', 'review', 'retro', 'witness', 'docs-process']);
const researchDir = join(repo, 'docs', 'research');
if (existsSync(researchDir)) {
  for (const topic of readdirSync(researchDir)) {
    const briefPath = join(researchDir, topic, '00-ignition-brief.md');
    if (!statSync(join(researchDir, topic)).isDirectory() || !existsSync(briefPath)) continue;
    const text = read(briefPath);
    const problems = [];
    const kick = sectionOf(text, '## The kick');
    if (kick === null) problems.push('the brief has no `## The kick` section, so the task text could not be read');
    else if (!kick.split('\n').some((l) => l.trimStart().startsWith('>'))) problems.push('the `## The kick` section carries no blockquote; its whole text stands in for the task');
    const seq = sectionOf(text, '## The sequence');
    if (seq === null) problems.push('the brief has no `## The sequence` section, so no seats could be read');
    else {
      const tableRows = seq.split('\n').filter((l) => l.trim().startsWith('|'));
      if (tableRows.length === 0) problems.push('the `## The sequence` section holds no table, so no seats could be read');
      for (const line of tableRows.slice(1)) {
        const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim().replace(/^`|`$/g, '').trim());
        if (cells.every((c) => /^[-: ]*$/.test(c))) continue;
        if (!cells.some((c) => KINDS.has(c))) { problems.push(`a sequence row names no seat kind and composes nothing: \`${line.trim()}\``); continue; }
        const spec = cells.map((c) => /\b(\d{2}-[A-Za-z0-9._-]*?\.md)\b/.exec(c)).find(Boolean);
        if (spec && !existsSync(join(researchDir, topic, spec[1]))) problems.push(`the sequence names \`${spec[1]}\` and it is missing from disk`);
      }
    }
    if (problems.length) for (const pr of problems) row('FAIL', `docs/research/${topic}/00-ignition-brief.md`, pr);
    else row('ok', `docs/research/${topic}/00-ignition-brief.md`, 'the kick and the sequence read clean');
  }
}

// ── 8. the working queue's shape ────────────────────────────────────────────────────────────────
const workingDir = join(repo, 'docs', 'working');
if (existsSync(workingDir)) {
  for (const f of readdirSync(workingDir).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const text = read(join(workingDir, f));
    const missing = ['## Living Docs to Update', '## Archive'].filter((h) => !text.includes(h));
    row(missing.length ? 'DEGRADE' : 'ok', `docs/working/${f}`, missing.length ? `lacks ${missing.join(' and ')}` : 'carries its checklist and its archive target');
  }
}

// ── 9. anything else under docs/ ────────────────────────────────────────────────────────────────
if (existsSync(join(repo, 'docs'))) {
  for (const entry of readdirSync(join(repo, 'docs'))) {
    if (FOLDERS.includes(entry)) continue;
    row('ok', `docs/${entry}`, 'outside the loop\'s shape — not touched');
  }
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────
const width = Math.max(...rows.map((r) => r.subject.length), 10);
console.log(`doctor — ${repo}${packVersion ? ` — pack ${packVersion}` : ''}\n`);
console.log(`| verdict | subject${' '.repeat(width - 7)} | detail |`);
console.log(`|---------|${'-'.repeat(width + 2)}|--------|`);
for (const r of rows) console.log(`| ${r.verdict.padEnd(7)} | ${r.subject.padEnd(width)} | ${r.detail} |`);
const count = (v) => rows.filter((r) => r.verdict === v).length;
console.log(`\nFAIL ${count('FAIL')} · DEGRADE ${count('DEGRADE')} · ok ${count('ok')}`);
process.exit(count('FAIL') ? 1 : 0);

// ── helpers ─────────────────────────────────────────────────────────────────────────────────────
function sectionOf(text, heading) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.trimEnd().toLowerCase().startsWith(heading.toLowerCase()));
  if (start < 0) return null;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) { if (lines[i].startsWith('## ')) break; body.push(lines[i]); }
  return body.join('\n');
}
function compareVersions(a, b) {
  const pa = a.split(/[.-]/).map((x) => parseInt(x, 10) || 0), pb = b.split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
}
