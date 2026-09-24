// The repository-owned sections: the four spaces in the two method docs where a repository writes its own
// formats in place of the loop's. One list, read by the doctor, by refresh and by the pins, so the three can
// never disagree about what a space is. Everything else a space means (what the skills read from it, where
// the method docs echo it, the rails items) is read from the pack's own references/, never restated here.

// The one grep that lists every space, and nothing else, with its line number.
export const GREP = "rg -n '^#+ .*\\(repository-owned\\)' docs/_meta/";
export const MARKED = /^#+ .*\(repository-owned\)/;

// The line every skill that needs a format carries, verbatim, near its top.
export const FIND_FORMAT = "**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\\(repository-owned\\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.";

// Each space by its heading, in the order the pack writes them, with the spellings a copy taken before the
// sections were marked still carries. `earlier` is the only fact here that the references cannot supply.
export const OWNED = [
  { file: 'docs-workflow.md', heading: '## The archive convention (repository-owned)', title: 'The archive convention', earlier: ['## The archive convention'] },
  { file: 'docs-workflow.md', heading: '## Doc metadata (repository-owned)', title: 'Doc metadata', earlier: ['## Doc metadata (header + lineage)', '## Doc metadata'] },
  { file: 'docs-workflow.md', heading: '## Templates (repository-owned)', title: 'Templates', earlier: ['## Templates'] },
  { file: 'engineering-loop.md', heading: "## This repository's rails (repository-owned)", title: "This repository's rails", earlier: [] },
];

export const STAMP = /^(<!-- naswerks-loop: version=)([0-9]+\.[0-9]+\.[0-9]+[^ ]*)( -->)/;

export function compareVersions(a, b) {
  const pa = a.split(/[.-]/).map((x) => parseInt(x, 10) || 0), pb = b.split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
}

// A patch release never changes what a copy of the method docs carries, so a stamp is behind only when its
// major.minor is.
export function compareMinor(a, b) {
  const pa = a.split(/[.-]/).map((x) => parseInt(x, 10) || 0), pb = b.split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 2; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
}

// How many entries a frontmatter key lists: an inline `[a, b]`, indented `- item` lines, or one scalar. Zero
// when the key is absent or empty.
export function frontmatterListCount(text, key) {
  const t = text.replace(/\r\n/g, '\n');
  if (!t.startsWith('---\n')) return 0;
  const end = t.indexOf('\n---', 4);
  if (end < 0) return 0;
  const lines = t.slice(4, end).split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (i < 0) return 0;
  const inline = lines[i].slice(key.length + 1).trim();
  if (inline.startsWith('[')) return inline.replace(/^\[|\]$/g, '').split(',').map((x) => x.trim()).filter(Boolean).length;
  if (inline) return 1;
  let n = 0;
  for (let j = i + 1; j < lines.length && /^\s+-\s*\S/.test(lines[j]); j++) n++;
  return n;
}

// A file as lines that keep their own terminators, so an untouched line is written back byte for byte.
export function linesOf(text) {
  return text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
}
export const bare = (line) => line.replace(/\r?\n$/, '').replace(/^﻿/, '');
export const eolOf = (text) => (text.includes('\r\n') ? '\r\n' : '\n');

// The index of every H2 heading outside a fenced block. The Templates space holds fenced examples whose
// own `## ` lines are template text, not sections.
export function h2Index(lines) {
  const out = [];
  let fence = null;
  lines.forEach((raw, i) => {
    const line = bare(raw);
    const f = /^\s*(```|~~~)/.exec(line);
    if (f) { fence = fence === null ? f[1] : (fence === f[1] ? null : fence); return; }
    if (fence === null && /^## /.test(line)) out.push({ i, heading: line.trimEnd() });
  });
  return out;
}

// A section by heading: the heading line's index and the index of the next H2 (or the end of the file).
export function findSection(lines, heading) {
  const hs = h2Index(lines);
  const k = hs.findIndex((h) => h.heading === heading);
  if (k < 0) return null;
  return { start: hs[k].i, end: k + 1 < hs.length ? hs[k + 1].i : lines.length };
}

// The rails items a section carries, by the bold lead-in of each top-level bullet: `- **Policy.** ...`.
export function railsItems(sectionLines) {
  const items = [];
  for (let i = 0; i < sectionLines.length; i++) {
    const m = /^- \*\*(.+?)\.?\*\*/.exec(bare(sectionLines[i]));
    if (!m) continue;
    let j = i + 1;
    while (j < sectionLines.length && /^\s+\S/.test(bare(sectionLines[j]))) j++;
    items.push({ name: m[1].replace(/\.$/, ''), text: sectionLines.slice(i, j).join(''), first: i, last: j - 1 });
  }
  return items;
}

// The stamp line: line 1, or the first non-blank line after a leading frontmatter block.
export function stampIndex(lines) {
  let i = 0;
  if (bare(lines[0] ?? '') === '---') {
    i = 1;
    while (i < lines.length && bare(lines[i]) !== '---') i++;
    i++;
    while (i < lines.length && bare(lines[i]).trim() === '') i++;
  }
  return i < lines.length && STAMP.test(bare(lines[i])) ? i : -1;
}

// The map's rows in the pack's docs-workflow.md: what the skills read from each space, and where the method
// docs echo it. Keyed by the space's title.
export function mapOf(workflowText) {
  const lines = linesOf(workflowText.replace(/\r\n/g, '\n'));
  const sec = findSection(lines, '## The repository-owned sections');
  const out = {};
  if (!sec) return out;
  for (const raw of lines.slice(sec.start, sec.end)) {
    const m = /^\|\s*\*\*(.+?)\*\*[^|]*\|([^|]*)\|([^|]*)\|/.exec(bare(raw));
    if (m) out[m[1].trim()] = { reads: m[2].trim(), echoed: m[3].trim() };
  }
  return out;
}
