#!/usr/bin/env node
// doctor — can the loop run in this repository? One row per thing the skills read, a verdict per row,
// non-zero exit on any FAIL. Node >= 22, no dependencies. Usage: node doctor.mjs [repo-root]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { OWNED, compareVersions, compareMinor, frontmatterListCount, linesOf, bare, h2Index, findSection, railsItems } from './owned.mjs';

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
// A repository rewrites the repository-owned sections of these two files to its own conventions, and the
// loop text around them is its copy from whenever it was taken — the doctor grades neither. It reads the
// version stamp (line 1, or the first line after a leading frontmatter block when the repository's own gate
// requires one on every file under docs/) and whether each repository-owned heading is where a skill looks.
const STAMP = /^<!-- naswerks-loop: version=([0-9]+\.[0-9]+\.[0-9]+[^ ]*) -->/m;
for (const name of ['docs-workflow.md', 'engineering-loop.md']) {
  const p = join(repo, 'docs', '_meta', name);
  const text = read(p);
  if (text === null) { row('FAIL', `docs/_meta/${name}`, 'missing'); continue; }
  const m = STAMP.exec(firstBodyLine(text));
  if (!m) { row('FAIL', `docs/_meta/${name}`, 'no naswerks-loop stamp on line 1 (or on the first line after a frontmatter block) — an unstamped copy cannot be told from a stale one'); continue; }
  if (!packVersion) { row('DEGRADE', `docs/_meta/${name}`, `stamped ${m[1]}; the pack's own version could not be read`); continue; }
  if (compareMinor(m[1], packVersion) < 0) row('DEGRADE', `docs/_meta/${name}`, `stamp ${m[1]} is behind the pack ${packVersion} — run init refresh: it adds this version's repository-owned sections and restamps, and never touches the loop text`);
  else row('ok', `docs/_meta/${name}`, compareVersions(m[1], packVersion) < 0 ? `stamp ${m[1]} (the pack is ${packVersion}: a patch never asks a copy to change)` : `stamp ${m[1]}`);

  // ── 2b. the repository-owned sections: present under the heading a skill looks them up by ─────────
  const lines = linesOf(text);
  const headings = h2Index(lines).map((h) => h.heading);
  for (const space of OWNED.filter((o) => o.file === name)) {
    if (headings.includes(space.heading)) row('ok', `docs/_meta/${name} ${space.heading}`, 'present');
    else {
      const was = space.earlier.find((h) => headings.includes(h));
      row('DEGRADE', `docs/_meta/${name} ${space.heading}`, was
        ? `unmarked (the copy says "${was}") — a skill finds this section by its heading; init refresh marks it`
        : 'missing — a skill finds this section by its heading; init refresh adds it');
    }
  }

  // ── 2c. the rails: every item the pack names is present, and none still carries its absent-line ───
  const rails = OWNED.find((o) => o.file === name && o.heading.includes('rails'));
  const sec = rails ? findSection(lines, rails.heading) : null;
  if (sec) {
    const section = lines.slice(sec.start, sec.end);
    const items = railsItems(section);
    const packItems = (() => {
      const t = read(join(packRoot, 'references', name));
      if (t === null) return [];
      const pl = linesOf(t);
      const ps = findSection(pl, rails.heading);
      return ps ? railsItems(pl.slice(ps.start, ps.end)).map((it) => it.name) : [];
    })();
    for (const n of packItems.filter((n) => !items.some((it) => it.name.toLowerCase() === n.toLowerCase()))) {
      row('DEGRADE', `rails: ${n}`, 'missing — init refresh adds it as its absent-line');
    }
    for (const it of items) row(/fill this in/i.test(it.text) ? 'DEGRADE' : 'ok', `rails: ${it.name}`, /fill this in/i.test(it.text) ? 'still the absent-line — fill it in (init drafts it from the scan)' : 'recorded');
    if (!items.length && /fill this in/i.test(section.map(bare).join('\n'))) row('DEGRADE', 'rails', 'carries only the absent-line');
  }
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
// A doc's status is read from whichever header the repository writes: the loop's own <!-- meta --> line,
// or a YAML frontmatter block with a status key. The one word the doctor needs is `draft`, which both forms
// spell the same way.
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
  const status = statusOf(text);
  if (status === null) row('DEGRADE', `docs/${relPath}`, 'no status in either header form (<!-- meta --> line or frontmatter status key)');
  else if (status.value === 'draft') row('DEGRADE', `docs/${relPath}`, `status=draft (${status.layer}) — scanned, not decided`);
  else row('ok', `docs/${relPath}`, `status=${status.value} (${status.layer})`);
  if (/<!-- init:/.test(text)) row('DEGRADE', `docs/${relPath}`, 'an <!-- init: --> instruction was left in the file');
}

// ── 4b. the menu: its shape, and every doc it names ────────────────────────────────────────────
// doc-index.md declares one of two shapes (docs-workflow.md § The repository-owned sections): menu=all lists
// every living doc; menu=curated lists the docs the seats read and names the index that lists every doc. A
// menu with no shape line is menu=all. Every doc a menu names must exist (a row saying `not detected` is
// exempt); a curated menu's docs must also meet the loop's standard: a status in either header form, not
// draft, and names the code it describes: a `## Key Files` section, or a frontmatter `related_files` list.
{
  const menu = read(join(repo, 'docs', '_meta', 'doc-index.md'));
  if (menu !== null) {
    const line = /<!-- naswerks-loop: menu=([A-Za-z-]+)(?:;\s*index=(\S+?))?\s*-->/.exec(menu);
    const shape = line ? line[1] : 'all';
    if (!['all', 'curated'].includes(shape)) row('FAIL', 'menu shape', `menu=${shape} is not a shape the loop knows (all | curated)`);
    else if (shape === 'curated') {
      const index = line[2];
      if (!index) row('DEGRADE', 'menu shape', 'menu=curated names no index of every doc, so docs-process cannot say where a new doc is registered');
      else if (!existsSync(join(repo, index))) row('DEGRADE', 'menu shape', `menu=curated; its index ${index} does not exist`);
      else row('ok', 'menu shape', `menu=curated; index=${index}`);
    } else row('ok', 'menu shape', line ? 'menu=all' : 'menu=all (no shape line: the default)');

    const named = new Set();
    for (const l of menu.split('\n')) {
      if (/not detected/i.test(l)) continue;
      for (const m of l.matchAll(/(?:\]\(|`)(?:\.\.\/)?((?:guides|patterns|infrastructure|features)\/[A-Za-z0-9_./-]+\.md)/g)) named.add(m[1]);
    }
    const missing = [...named].filter((p) => !existsSync(join(repo, 'docs', p))).sort();
    for (const p of missing) row('FAIL', `menu: docs/${p}`, 'the menu names a doc that does not exist');
    if (shape === 'curated') {
      for (const p of [...named].filter((q) => !missing.includes(q)).sort()) {
        const text = read(join(repo, 'docs', p));
        const short = [];
        const st = statusOf(text);
        if (st === null) short.push('no status in either header form');
        else if (st.value === 'draft') short.push('status draft');
        if (!/^## Key Files\b/m.test(text) && frontmatterListCount(text, 'related_files') === 0) short.push('names no code (no ## Key Files section, no related_files list)');
        row(short.length ? 'DEGRADE' : 'ok', `menu: docs/${p}`, short.length ? `below the loop's standard: ${short.join(', ')}` : "meets the loop's standard");
      }
    } else if (shape === 'all') {
      const unnamed = livingDocs().filter((p) => !named.has(p) && !menu.includes(p));
      for (const p of unnamed) row('DEGRADE', `menu: docs/${p}`, 'a living doc the menu does not name (menu=all) — add its row, or declare the menu curated');
      if (!unnamed.length && !missing.length) row('ok', 'menu entries', `names every living doc (${named.size}), each present`);
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
// A doc's status from whichever header it carries: the <!-- meta --> line first, then a frontmatter
// `status:` key. Returns { value, layer } or null.
function statusOf(text) {
  const m = /<!-- meta:[^>]*\bstatus=([A-Za-z-]+)/.exec(text);
  if (m) return { value: m[1], layer: 'meta line' };
  const fm = frontmatterOf(text);
  if (fm && fm.status !== undefined) return { value: fm.status, layer: 'frontmatter' };
  return null;
}
// The leading YAML frontmatter block as flat key: value pairs (scalars only — that is all the doctor reads).
function frontmatterOf(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  if (end < 0) return null;
  const out = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}
// The living docs a menu=all menu lists: every .md directly under the four living folders, and each
// feature folder's own docs one level down (a filed effort's notes sit deeper and are history, not living).
function livingDocs() {
  const out = [];
  for (const f of ['guides', 'patterns', 'infrastructure', 'features']) {
    const dir = join(repo, 'docs', f);
    if (!existsSync(dir)) continue;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md') out.push(`${f}/${e.name}`);
      else if (f === 'features' && e.isDirectory()) {
        for (const g of readdirSync(join(dir, e.name), { withFileTypes: true })) {
          if (g.isFile() && g.name.endsWith('.md') && g.name !== 'README.md') out.push(`features/${e.name}/${g.name}`);
        }
      }
    }
  }
  return out.sort();
}
function firstBodyLine(text) {
  let body = text;
  if (text.startsWith('---\n')) { const end = text.indexOf('\n---', 4); if (end >= 0) body = text.slice(end + 4).replace(/^\n+/, ''); }
  return body.split('\n', 1)[0];
}
