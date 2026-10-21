#!/usr/bin/env node
// The witness's watcher, config-driven: one line per CHANGE in a running pipeline, read from git, the board
// files, the transcripts, the lane logs, the process table and the containers. Read-only on the run: it
// writes only its own state (`watch-state.json`), its event log (`events.log`) and its captures
// (`captures/`), all in the witness folder beside the config.
//
// Quiet by default: routine lane and process lines go to the event log only. A restart replays from the
// saved marks rather than re-baselining, so nothing written while the watcher was down is lost; a fresh
// baseline marks every existing transcript as already seeded, so a later first message there is a human
// touch. Commits are read by `--first-parent` and diffed against `{sha}~1`; lane output is read with its
// colour codes stripped; a flag fires only on a gated call's own result, never on text a seat read.
//
//   node witness-watch.mjs [--config <path>]          watch until stopped
//   node witness-watch.mjs --once [--config <path>]   one pass, then exit
//   node witness-watch.mjs --self-test
//
// The config (`witness.config.json`): worktree, topicDir, transcriptDir, mainCheckout, branches, logParent
// and logPrefix, logScan [{ parent, prefix }], extraLogDirs [{ label, dir }], ownerContainers, planeServer,
// testProcessPattern, sourceDirs, generatedPaths, noisePaths, hooksDir, seatContainerPrefix,
// reaperContainerPrefix, watchedCommands (extra patterns), pollSeconds, probes { processes, docker }.

import { execFileSync } from 'node:child_process';
import { appendFileSync, closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { PLANE_READS, clip, isMain, loadConfig, report, scratch, at } from './witness-lib.mjs';
import { classify, listProcesses } from './witness-procs.mjs';

const STALL_STEPS_MIN = [20, 40, 60, 90];
const QUIET = /^(PROC |LANE |BOARD sessions\/[^ ]+\/plan\.md )/;
const WATCHED = String.raw`git\s+(push|stash|reset\s+--hard|clean\s+-[a-z]*f|checkout\s+--\s|rebase|merge(?!-base)|cherry-pick|config\s+(?!--get|--show|--list|-l\b|get\b|list\b))|Stop-Process|taskkill|docker\s+(rm|stop|kill)\b|--no-verify`;
const RESULT_FLAGS = [
  [/This call was held for a person|nobody answered within \d+ ?s/i, 'PARK'],
  [/hook error: hook_timed_out/i, 'HOOK-TIMEOUT'],
  [/NOT DELIVERED|link-send-failed|no live link/i, 'UNDELIVERED'],
  [/Dynamic Client Registration rejected|HTTP 5\d\d|"status":5\d\d|seat-already-has-live-session/i, 'PLANE-FAIL'],
  [/hook error: shell-verb-unrecognised/i, 'GUARD-REFUSED'],
  [/head-mismatch/i, 'HEAD-MISMATCH'],
];
// Lane summaries, by the runners that print them. Non-ASCII is written as an escape.
const SUMMARIES = [
  { re: /Test run summary:[^\n]*(\n\s+(total|failed|succeeded|skipped|duration):[^\n]*)*/, zero: /total:\s*0\b/ },
  { re: /Test Files\s+[^\n]*\n\s*Tests\s+[^\n]*/, zero: /Tests\s+0\b/ },
  { re: /\u2139 tests \d+[^\n]*(\n\u2139 [a-z]+ \d+[^\n]*)*/, zero: /\u2139 tests 0\b/ },
  { re: /\u2716 \d+ problems? \([^)]*\)/, zero: null },
  { re: /\d+ Warning\(s\)\s*\n\s*\d+ Error\(s\)/, zero: null },
];
const FAILED = /Failed!|failed:\s*[1-9]|Tests\s+\d+ failed|Test Files\s+\d+ failed|\u2139 fail [1-9]|\(\s*[1-9]\d* errors?\b|\b[1-9]\d* Error\(s\)/;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const now = () => new Date().toTimeString().slice(0, 8);

function run(cmd, args) {
  try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).trim(); }
  catch { return null; }
}
const git = (dir, ...args) => run('git', ['--no-optional-locks', '-C', dir, ...args]);

function walk(dir, filter) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, filter));
    else if (filter(e.name)) out.push(p);
  }
  return out;
}

function readRange(file, from) {
  const size = statSync(file).size;
  if (size <= from) return '';
  const fd = openSync(file, 'r');
  const buf = Buffer.alloc(size - from);
  readSync(fd, buf, 0, size - from, from);
  closeSync(fd);
  return buf.toString('utf8');
}
const tail = (file, bytes) => readRange(file, Math.max(0, statSync(file).size - bytes)).replace(/\r/g, '').replace(/\x1b\[[0-9;]*m/g, '');

const matchesAny = (path, entries) => entries.some((e) => path.includes(e));

export class Watcher {
  constructor(config, write = (line) => console.log(line)) {
    if (!config.worktree || !config.topicDir || !config.transcriptDir) throw new Error('the config needs worktree, topicDir and transcriptDir');
    this.c = config;
    this.wt = config.worktree;
    this.key = basename(config.worktree);
    this.main = config.mainCheckout ?? config.worktree;
    this.topic = join(config.worktree, config.topicDir);
    this.prefix = config.planeServer ? `mcp__${config.planeServer}__` : null;
    this.watched = new RegExp([WATCHED, ...config.watchedCommands].join('|'));
    this.realTree = new RegExp(`${esc(this.key)}[\\\\/]+(${config.sourceDirs.map(esc).join('|')})[\\\\/]`);
    this.stateFile = join(config.dir, 'watch-state.json');
    this.events = join(config.dir, 'events.log');
    this.write = write;
  }

  emit(msg) {
    const line = `${now()} ${msg}`;
    if (!QUIET.test(msg)) this.write(line);
    appendFileSync(this.events, `${line}\n`);
  }

  logDirs() {
    const scans = [...(this.c.logParent ? [{ parent: this.c.logParent, prefix: this.c.logPrefix ?? '' }] : []), ...this.c.logScan];
    const found = scans.flatMap(({ parent, prefix }) => (existsSync(parent)
      ? readdirSync(parent, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name.startsWith(prefix)).map((e) => ({ label: e.name, dir: join(parent, e.name) }))
      : []));
    return [{ label: '', dir: join(this.wt, 'logs') }, ...this.c.extraLogDirs, ...found];
  }

  transcriptFiles() {
    const dir = this.c.transcriptDir;
    if (!existsSync(dir)) return [];
    const top = readdirSync(dir).filter((n) => n.endsWith('.jsonl'));
    const subagents = readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && existsSync(join(dir, e.name, 'subagents')))
      .flatMap((e) => readdirSync(join(dir, e.name, 'subagents')).filter((n) => n.endsWith('.jsonl')).map((n) => `${e.name}/subagents/${n}`));
    return [...top, ...subagents];
  }

  snapshot() {
    const s = { board: {}, head: null, transcripts: {}, logs: {}, logAbs: {}, ends: [], reapers: 0, seatStack: [], owner: {}, testProcs: [], runner: [] };
    for (const f of walk(this.topic, (n) => n.endsWith('.md'))) s.board[f.slice(this.topic.length + 1).replace(/\\/g, '/')] = statSync(f).size;
    s.head = git(this.wt, 'rev-parse', '--short', 'HEAD');
    for (const f of this.transcriptFiles()) s.transcripts[f] = statSync(join(this.c.transcriptDir, f)).size;
    for (const { label, dir } of this.logDirs()) {
      for (const f of walk(dir, (n) => n.endsWith('.txt') || n.endsWith('.log') || n.endsWith('.end'))) {
        const rel = (label ? `${label}:` : '') + f.slice(dir.length + 1).replace(/\\/g, '/');
        if (f.endsWith('.end')) s.ends.push(rel);
        else { s.logs[rel] = statSync(f).size; s.logAbs[rel] = f; }
      }
    }
    if (this.c.probes.docker) {
      const names = (run('docker', ['ps', '--format', '{{.Names}}']) ?? '').split('\n').filter(Boolean);
      for (const name of names) {
        if (name.startsWith(this.c.reaperContainerPrefix)) s.reapers++;
        if (this.c.seatContainerPrefix && name.startsWith(this.c.seatContainerPrefix)) s.seatStack.push(name);
      }
      for (const c of this.c.ownerContainers) s.owner[c] = names.includes(c);
    }
    if (this.c.probes.processes) {
      let lines = [];
      try { lines = classify(listProcesses(), { key: this.key, pattern: this.c.testProcessPattern ?? null }); } catch { lines = []; }
      for (const l of lines) (l.startsWith('RUNNER|') ? s.runner : s.testProcs).push(l);
    }
    const porcelain = (git(this.wt, 'status', '--porcelain', '-uall', '--', ...this.c.sourceDirs) ?? '').split('\n').filter(Boolean);
    s.noiseDirty = porcelain.filter((l) => matchesAny(l, this.c.noisePaths)).length;
    s.srcDirty = porcelain.length - s.noiseDirty;
    s.worktrees = (git(this.main, 'worktree', 'list', '--porcelain') ?? '').split('\n').filter((l) => l.startsWith('worktree ')).map((l) => l.slice(9)).sort();
    s.hooksPath = git(this.main, 'config', '--get', 'core.hooksPath');
    s.hooksWired = this.c.hooksDir ? existsSync(join(this.wt, this.c.hooksDir)) : null;
    return s;
  }

  newestHeading(rel) {
    try { return readFileSync(join(this.topic, rel), 'utf8').split('\n').filter((l) => l.startsWith('## ')).at(-1)?.slice(3, 120) ?? '(no heading)'; }
    catch { return '?'; }
  }

  // New transcript bytes: plane writes and their results, the first source write, watch-listed commands,
  // flags on gated calls, limits, compaction, and the seed / delivery / human turns.
  scanTranscript(name, from, seen) {
    const text = readRange(join(this.c.transcriptDir, name), from);
    const complete = text.lastIndexOf('\n');
    if (complete < 0) return from;
    const sid = basename(name, '.jsonl').slice(0, 8);
    for (const raw of text.slice(0, complete).split('\n')) {
      if (!raw.trim()) continue;
      let e;
      try { e = JSON.parse(raw); } catch { continue; }
      if (e.type === 'system' && /compact/i.test(e.subtype ?? '')) this.emit(`TX ${sid} COMPACTION (${e.subtype})`);
      const msg = e.message;
      if (!msg) continue;
      const content = Array.isArray(msg.content) ? msg.content : [{ type: 'text', text: msg.content }];
      for (const c of content) {
        if (c.type === 'tool_use') {
          const isPlane = this.prefix !== null && String(c.name).startsWith(this.prefix);
          const verb = isPlane ? c.name.slice(this.prefix.length) : null;
          if (isPlane && !PLANE_READS.test(verb)) {
            this.emit(`PLANE ${sid} ${verb} ${clip(JSON.stringify(c.input), 160)}`);
            seen.pending[c.id] = `${sid} ${verb}`;
          }
          seen.uses[c.id] = { name: c.name, read: isPlane && PLANE_READS.test(verb), label: `${c.name} ${clip(JSON.stringify(c.input), 90)}` };
          const p = String(c.input?.file_path ?? '');
          if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(c.name) && this.realTree.test(p)) {
            seen.srcWrites[sid] = (seen.srcWrites[sid] ?? 0) + 1;
            if (seen.srcWrites[sid] === 1) this.emit(`FIRST-WRITE ${sid} first source write at ${e.timestamp}: ${p.split(new RegExp(`${esc(this.key)}[\\\\/]+`))[1]} : check it against this seat's accept_plan`);
          }
          const cmd = String(c.input?.command ?? '');
          if (this.watched.test(cmd)) this.emit(`CMD ${sid} watch-listed command: ${clip(cmd, 200)}`);
        } else if (c.type === 'tool_result') {
          const body = Array.isArray(c.content) ? c.content.map((x) => x.text ?? '').join(' ') : String(c.content ?? '');
          if (seen.pending[c.tool_use_id]) {
            this.emit(`PLANE ${seen.pending[c.tool_use_id]} -> ${c.is_error ? 'ERROR ' : ''}${clip(body, 200)}`);
            delete seen.pending[c.tool_use_id];
          }
          // A flag fires on the gated call's own result, never on text a seat merely read.
          const use = seen.uses[c.tool_use_id];
          const echoes = !use || /^(Read|Grep|Glob|TodoWrite)$/.test(use.name) || (use.read && !c.is_error);
          if (!echoes) {
            for (const [re, tag] of RESULT_FLAGS) {
              if (!re.test(body)) continue;
              this.emit(`${tag} ${sid} at ${e.timestamp} on ${use.label}: ${clip(body.match(new RegExp(`.{0,80}${re.source}.{0,100}`, 'i'))?.[0] ?? body, 220)}`);
              break;
            }
          }
          delete seen.uses[c.tool_use_id];
        } else if (c.type === 'text' && msg.role === 'assistant') {
          if (/hit your (session|usage) limit/i.test(String(c.text ?? ''))) this.emit(`LIMIT ${sid} at ${e.timestamp}: ${clip(c.text, 160)}`);
        } else if (c.type === 'text' && msg.role === 'user' && !e.isMeta && !e.toolUseResult) {
          const t = String(c.text ?? '');
          if (/hit your (session|usage) limit/i.test(t)) { this.emit(`LIMIT ${sid} at ${e.timestamp}: ${clip(t, 160)}`); continue; }
          if (/^<(task-notification|system-reminder|command-|local-command)/.test(t.trim()) || t.startsWith('Base directory for this skill')) continue;
          if (t.startsWith('This session is being continued from a previous conversation')) { this.emit(`TX ${sid} post-compaction summary at ${e.timestamp} (the session's own account of its beliefs: read it)`); continue; }
          if (!seen.seeded[sid]) { seen.seeded[sid] = true; this.emit(`SEED ${sid} first prompt at ${e.timestamp} (the seed, not a human touch): ${clip(t, 120)}`); continue; }
          if (/^\s*\[[^\]]*\bact \d+/.test(t)) { this.emit(`DELIVERY ${sid} plane-delivered turn at ${e.timestamp}: ${clip(t, 140)}`); continue; }
          this.emit(`HUMAN? ${sid} user text at ${e.timestamp}: ${clip(t, 160)}`);
        }
      }
    }
    return from + Buffer.byteLength(text.slice(0, complete + 1), 'utf8');
  }

  diff(prev, cur) {
    cur.txMark = { ...(prev.txMark ?? {}) };
    cur.lastHeading = { ...(prev.lastHeading ?? {}) };
    cur.seen = prev.seen;
    for (const [f, size] of Object.entries(cur.board)) {
      if (prev.board[f] === undefined) this.emit(`BOARD new file ${f} (${size} B), newest heading: ${this.newestHeading(f)}`);
      else if (prev.board[f] !== size) {
        const h = this.newestHeading(f);
        if (cur.lastHeading[f] !== h) { cur.lastHeading[f] = h; this.emit(`BOARD ${f} ${prev.board[f]} -> ${size} B, newest heading: ${h}`); }
      }
    }
    if (prev.head && cur.head && prev.head !== cur.head) {
      const shas = (git(this.wt, 'log', '--first-parent', '--format=%h', `${prev.head}..${cur.head}`) ?? '').split('\n').filter(Boolean).reverse();
      if (!shas.length) this.emit(`GIT HEAD moved ${prev.head} -> ${cur.head} (not a fast-forward: a reset or a checkout?)`);
      for (const c of shas) {
        const subject = git(this.wt, 'log', '-1', '--format=%s', c) ?? '';
        const files = (git(this.wt, 'diff', '--name-only', `${c}~1`, c) ?? '').split('\n').filter(Boolean);
        const src = files.filter((f) => this.c.sourceDirs.some((d) => f.startsWith(`${d}/`))).length;
        const generated = files.filter((f) => matchesAny(f, this.c.generatedPaths)).length;
        const noise = files.filter((f) => matchesAny(f, this.c.noisePaths)).length;
        const parents = (git(this.wt, 'rev-list', '--parents', '-n', '1', c) ?? '').split(' ').length - 1;
        const brought = parents > 1 ? ` (a merge: brings ${git(this.wt, 'rev-list', '--count', `${c}^1..${c}^2`)} commits)` : '';
        this.emit(`GIT commit ${c} "${clip(subject, 100)}" : ${files.length} files (source ${src}, generated ${generated}, noise ${noise})${brought}`);
      }
      if (this.c.branches.length) {
        const remote = git(this.wt, 'ls-remote', '--heads', 'origin', ...this.c.branches);
        if (remote) this.emit(`GIT PUSHED? remote heads now: ${clip(remote, 200)}`);
      }
    }
    for (const [f, size] of Object.entries(cur.transcripts)) {
      if (prev.transcripts[f] === undefined) this.emit(`SESSION new transcript ${f} (a new seat or session)`);
      const from = cur.txMark[f] ?? (prev.transcripts[f] ?? 0);
      if (size > from) cur.txMark[f] = this.scanTranscript(f, from, cur.seen);
    }
    for (const end of cur.ends) if (!prev.ends.includes(end)) this.emit(`LANE finished: ${end}`);
    cur.summaries = { ...(prev.summaries ?? {}) };
    cur.exits = { ...(prev.exits ?? {}) };
    for (const [f, size] of Object.entries(cur.logs)) {
      if (prev.logs[f] === size) continue;
      if (prev.logs[f] === undefined) this.emit(`LANE new log ${f}`);
      const t = tail(cur.logAbs[f], 6000);
      for (const { re, zero } of SUMMARIES) {
        const m = t.match(re);
        if (!m || cur.summaries[f + m[0]]) continue;
        cur.summaries[f + m[0]] = true;
        const flat = m[0].replace(/\s+/g, ' ');
        this.emit(`${zero && zero.test(flat) ? 'ALERT ZERO-TESTS ' : FAILED.test(flat) ? 'FAIL ' : 'LANE '}${f}: ${flat}`);
      }
      const exit = t.match(/(EXIT|exit)[=: ]\s*\d+/g)?.at(-1);
      if (exit && !cur.exits[f + exit + size]) {
        cur.exits[f + exit + size] = true;
        const failed = !/[=: ]\s*0$/.test(exit);
        this.emit(`${failed ? 'FAIL ' : 'LANE '}${f}: ${exit}`);
        if (failed) {
          const cap = join(this.c.dir, 'captures');
          mkdirSync(cap, { recursive: true });
          copyFileSync(cur.logAbs[f], join(cap, `${now().replace(/:/g, '')}-${f.replace(/[\\/:]/g, '_')}`));
        }
      }
    }
    if ((prev.srcDirty ?? 0) === 0 && cur.srcDirty > 0) this.emit(`TREE first dirty source path since the last commit (${cur.srcDirty})`);
    if ((prev.srcDirty ?? 0) >= 5 && cur.srcDirty <= prev.srcDirty / 2 && prev.head === cur.head) this.emit(`ALERT uncommitted source changes dropped ${prev.srcDirty} -> ${cur.srcDirty} with NO commit : a stash, a reset or a clean?`);
    if (!prev.noiseDirty && cur.noiseDirty) this.emit('TREE a noise path is dirty (a build side effect or a real change: never sweep it into a commit)');
    for (const f of Object.keys(cur.board)) if (prev.board[f] === undefined && f.includes('sessions/') && cur.srcDirty > 0) this.emit(`ORDER new board file ${f} while ${cur.srcDirty} uncommitted source path(s) remain`);
    if ((prev.testProcs ?? []).join() !== cur.testProcs.join()) this.emit(`PROC work processes: ${cur.testProcs.length ? cur.testProcs.join(', ') : 'none'}`);
    if (this.c.probes.processes && (prev.runner ?? []).join() !== cur.runner.join()) this.emit(`RUNNER processes: ${cur.runner.length ? cur.runner.join(', ') : 'NONE (a restart ends every live session)'}`);
    for (const [c, up] of Object.entries(cur.owner)) if (prev.owner?.[c] && !up) this.emit(`OWNER container ${c} is no longer running : check whether the run touched it`);
    const added = cur.worktrees.filter((w) => !(prev.worktrees ?? []).includes(w));
    const gone = (prev.worktrees ?? []).filter((w) => !cur.worktrees.includes(w));
    if (added.length || gone.length) this.emit(`WORKTREE list changed: +[${added.join(', ')}] -[${gone.join(', ')}]`);
    if (prev.hooksPath !== cur.hooksPath) this.emit(`HOOKS shared core.hooksPath changed: ${prev.hooksPath} -> ${cur.hooksPath}`);
    if (prev.hooksWired !== cur.hooksWired) this.emit(`HOOKS this worktree's ${this.c.hooksDir} ${cur.hooksWired ? 'now present (hooks fire)' : 'GONE (hooks silently off)'}`);
    cur.reaperHighPolls = cur.reapers > 1 ? (prev.reaperHighPolls ?? 0) + 1 : 0;
    if (cur.reaperHighPolls === 2) this.emit(`DOCKER ${cur.reapers} test sessions for two polls : more than one suite running`);
    if (cur.seatStack.join() !== prev.seatStack.join()) this.emit(`DOCKER seat stack: ${cur.seatStack.length ? cur.seatStack.join(', ') : 'none running'}`);
    const newest = Math.max(0, ...Object.keys(cur.transcripts).map((f) => statSync(join(this.c.transcriptDir, f)).mtimeMs));
    const idleMin = newest ? Math.floor((Date.now() - newest) / 60000) : 0;
    const level = STALL_STEPS_MIN.filter((m) => idleMin >= m).length;
    cur.stallLevel = prev.stallLevel ?? 0;
    if (level > cur.stallLevel) this.emit(`STALL no transcript activity in ${idleMin} min : check the process table before calling it stuck`);
    if (level === 0 && cur.stallLevel > 0) this.emit('STALL cleared: transcripts moving again');
    cur.stallLevel = level;
  }

  // Arm from the saved marks, or take a fresh baseline; then one pass, or a pass per poll.
  async watch({ once = false } = {}) {
    let prev = existsSync(this.stateFile) ? JSON.parse(readFileSync(this.stateFile, 'utf8')) : null;
    if (!prev) {
      prev = this.snapshot();
      prev.summaries = {}; prev.exits = {}; prev.stallLevel = 0;
      prev.seen = { pending: {}, uses: {}, srcWrites: {}, seeded: Object.fromEntries(Object.keys(prev.transcripts).map((f) => [basename(f, '.jsonl').slice(0, 8), true])) };
      prev.txMark = { ...prev.transcripts };
      writeFileSync(this.stateFile, JSON.stringify(prev));
      this.emit(`ARMED baseline: head ${prev.head}, board files ${Object.keys(prev.board).length}, transcripts ${Object.keys(prev.transcripts).length} (marks at their current size), source dirty ${prev.srcDirty}, hooks wired ${prev.hooksWired}, runner ${prev.runner.length}`);
      if (once) return;
    } else {
      prev.seen.uses ??= {}; prev.seen.seeded ??= {};
      this.emit(`RE-ARMED from saved marks (head ${prev.head}); replaying anything since`);
    }
    for (;;) {
      const cur = this.snapshot();
      this.diff(prev, cur);
      writeFileSync(this.stateFile, JSON.stringify(cur));
      prev = cur;
      if (once) return;
      await new Promise((r) => setTimeout(r, this.c.pollSeconds * 1000));
    }
  }
}

async function selfTest() {
  const root = scratch('witness-watch');
  try {
    const wt = join(root, 'pipeline-7');
    const tx = join(root, 'transcripts');
    const witness = join(root, 'witness');
    for (const d of [join(wt, 'src'), join(wt, 'docs', 'research', 'demo', 'sessions', '01-a-slice'), join(wt, 'logs'), tx, witness]) mkdirSync(d, { recursive: true });
    const g = (...args) => execFileSync('git', ['-C', wt, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    g('init', '-q');
    writeFileSync(join(wt, 'src', 'a.ts'), 'export const a = 1;\n');
    const board = join(wt, 'docs', 'research', 'demo', 'sessions', '01-a-slice', 'tldr.md');
    writeFileSync(board, '## [seat·01-a-slice] PLAN TLDR\n');
    g('add', '.');
    g('-c', 'user.name=t', '-c', 'user.email=t@local', 'commit', '-q', '-m', 'baseline');
    const line = (e) => `${JSON.stringify(e)}\n`;
    const seat = join(tx, 'aaaaaaaa-seat.jsonl');
    writeFileSync(seat, line({ type: 'user', timestamp: at(0), message: { role: 'user', content: 'You are a BUILD SEAT. The seed.' } }));
    const config = { worktree: wt, topicDir: 'docs/research/demo', transcriptDir: tx, planeServer: 'plane', sourceDirs: ['src', 'tests'], noisePaths: ['package-lock.json'], generatedPaths: [], watchedCommands: [], branches: [], logScan: [], extraLogDirs: [], ownerContainers: [], reaperContainerPrefix: 'testcontainers-ryuk', pollSeconds: 20, probes: { processes: false, docker: false }, dir: witness };
    const printed = [];
    const watcher = new Watcher(config, (l) => printed.push(l));
    await watcher.watch({ once: true });

    // The run moves: a ruling lands on the board, a commit, a plane write, a park on a gated call and the
    // same words in a file the seat read, a source write, a human message, a delivered turn, a new
    // session, and a lane that ran no tests.
    writeFileSync(board, '## [seat·01-a-slice] PLAN TLDR\n\n## COORDINATOR RULING (plan — accept)\n');
    writeFileSync(join(wt, 'src', 'a.ts'), 'export const a = 2;\n');
    writeFileSync(join(wt, 'package-lock.json'), '{}\n');
    g('add', '.');
    g('-c', 'user.name=t', '-c', 'user.email=t@local', 'commit', '-q', '-m', 'the slice');
    const tu = (m, id, name, input) => ({ type: 'assistant', timestamp: at(m), message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
    const tr = (m, id, text) => ({ type: 'user', timestamp: at(m), message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: [{ type: 'text', text }] }] } });
    appendFileSync(seat, [
      tu(1, 'p1', 'mcp__plane__post_tldr', { path: 'tldr.md' }), tr(1, 'p1', 'posted rev 2'),
      tu(2, 'b1', 'Bash', { command: 'git push origin topic' }), tr(3, 'b1', 'This call was held for a person; nobody answered within 40 s'),
      tu(4, 'r1', 'Read', { file_path: 'brief.md' }), tr(4, 'r1', 'the brief says: This call was held for a person'),
      tu(5, 'e1', 'Edit', { file_path: join(wt, 'src', 'a.ts'), old_string: '1', new_string: '2' }), tr(5, 'e1', 'ok'),
      { type: 'user', timestamp: at(6), message: { role: 'user', content: 'are you stuck?' } },
      { type: 'user', timestamp: at(7), message: { role: 'user', content: '[coordinator act 4321] read your tldr' } },
    ].map(line).join(''));
    writeFileSync(join(tx, 'bbbbbbbb-review.jsonl'), line({ type: 'user', timestamp: at(8), message: { role: 'user', content: 'You are the REVIEW SEAT.' } }));
    writeFileSync(join(wt, 'logs', 'unit.txt'), 'Test run summary: Passed!\n  total: 0\n  failed: 0\nEXIT=0\n');
    await new Watcher(config, (l) => printed.push(l)).watch({ once: true });

    const log = readFileSync(join(witness, 'events.log'), 'utf8');
    const has = (re) => re.test(log);
    const count = (re) => log.split('\n').filter((l) => re.test(l)).length;
    await new Watcher(config, (l) => printed.push(l)).watch({ once: true });
    const after = readFileSync(join(witness, 'events.log'), 'utf8').slice(log.length);
    return report('witness-watch', [
      { name: 'a fresh baseline arms and marks the existing transcript as seeded', ok: has(/ARMED baseline/) && !has(/SEED aaaaaaaa/), detail: log },
      { name: 'the ruling\'s heading on the board is reported', ok: has(/BOARD sessions\/01-a-slice\/tldr\.md .*COORDINATOR RULING \(plan/), detail: log },
      { name: 'the commit is reported by --first-parent with its file classes', ok: has(/GIT commit [0-9a-f]+ "the slice" : 3 files \(source 1, generated 0, noise 1\)/), detail: log },
      { name: 'the plane write and its result are reported', ok: has(/PLANE aaaaaaaa post_tldr/) && has(/PLANE aaaaaaaa post_tldr -> posted rev 2/), detail: log },
      { name: 'the park on the gated call is flagged, the watch-listed command too', ok: count(/^\S+ PARK /) === 1 && has(/PARK aaaaaaaa .* on Bash/) && has(/CMD aaaaaaaa watch-listed command: git push/), detail: log },
      { name: 'CONTROL: the same words in a file the seat read are not a park', ok: !has(/PARK aaaaaaaa .* on Read/), detail: log },
      { name: 'the first source write is reported', ok: has(/FIRST-WRITE aaaaaaaa first source write .*src[\\/]a\.ts/), detail: log },
      { name: 'a later user message is a human touch, a delivered turn is a delivery, a new session\'s first message is its seed', ok: has(/HUMAN\? aaaaaaaa user text .*are you stuck/) && has(/DELIVERY aaaaaaaa/) && has(/SESSION new transcript bbbbbbbb-review\.jsonl/) && has(/SEED bbbbbbbb/), detail: log },
      { name: 'a lane that ran no tests is an alert', ok: has(/ALERT ZERO-TESTS unit\.txt/), detail: log },
      { name: 'CONTROL: a restart replays from the saved marks and reports nothing twice', ok: /RE-ARMED from saved marks/.test(after) && !/PARK|GIT commit|HUMAN\?/.test(after), detail: after },
      { name: 'quiet mode: routine lane lines go to the log, not the terminal', ok: !printed.some((l) => / LANE new log/.test(l)) && has(/LANE new log unit\.txt/), detail: printed.join(' | ') },
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(await selfTest());
  await new Watcher(loadConfig(argv, { required: true })).watch({ once: argv.includes('--once') });
}
