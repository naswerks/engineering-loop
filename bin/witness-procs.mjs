#!/usr/bin/env node
// The processes doing a run's work, by the worktree they run in, and the runner's own processes. A quiet
// compile is a busy process, and no runner where there was one is a restart, which ends every live
// session. Windows reads the process table through PowerShell's CIM query, anything else through `ps`.
// Read-only.
//
//   node witness-procs.mjs [--key <worktree-folder-name>] [--pattern <regex>] [--config <path>]
//   -> one line per process: `RUNNER|<pid>` for the runner, `<pid>|<name>` for a match
//   node witness-procs.mjs --self-test

import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';
import { flag, isMain, loadConfig, report } from './witness-lib.mjs';

// Every process with its id, its name, its command line and its executable path.
export function listProcesses() {
  if (process.platform === 'win32') {
    const json = execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command',
      'Get-CimInstance Win32_Process | Select-Object ProcessId,Name,CommandLine,ExecutablePath | ConvertTo-Json -Compress'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    const rows = JSON.parse(json);
    return (Array.isArray(rows) ? rows : [rows]).map((r) => ({ pid: r.ProcessId, name: String(r.Name ?? ''), cmd: String(r.CommandLine ?? ''), exe: String(r.ExecutablePath ?? '') }));
  }
  const out = execFileSync('ps', ['-eo', 'pid=,comm=,args='], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\n').filter((l) => l.trim()).map((l) => {
    const m = l.trim().match(/^(\d+)\s+(\S+)\s+(.*)$/);
    return m ? { pid: Number(m[1]), name: m[2], cmd: m[3], exe: '' } : null;
  }).filter(Boolean);
}

// The runner is a node process whose command line names periscope; a match is a process of the
// configured pattern running in the worktree named by `key`. This tool never reports itself.
export function classify(processes, { key = '', pattern = null } = {}) {
  const re = pattern ? new RegExp(pattern, 'i') : null;
  const out = [];
  for (const p of processes) {
    const text = `${p.cmd} ${p.exe}`;
    if (/witness-procs/.test(text)) continue;
    if (/^node(\.exe)?$/i.test(p.name) && /periscope/i.test(p.cmd)) { out.push(`RUNNER|${p.pid}`); continue; }
    if (key && re && text.includes(key) && re.test(text)) out.push(`${p.pid}|${p.name}`);
  }
  return out.sort();
}

function selfTest() {
  const synthetic = [
    { pid: 10, name: 'node.exe', cmd: 'node C:/npm/node_modules/@scope/periscope/dist/bin/periscope.js serve', exe: '' },
    { pid: 11, name: 'dotnet', cmd: 'dotnet test --project tests/App.Tests', exe: 'C:/work/pipeline-7/x' },
    { pid: 12, name: 'dotnet', cmd: 'dotnet test --project tests/App.Tests', exe: 'C:/work/pipeline-9/x' },
    { pid: 13, name: 'node.exe', cmd: 'node vitest run C:/work/pipeline-7', exe: '' },
    { pid: 14, name: 'node.exe', cmd: 'node witness-procs.mjs --key pipeline-7', exe: '' },
  ];
  const lines = classify(synthetic, { key: 'pipeline-7', pattern: 'dotnet.*test|vitest' });
  let live = [];
  let liveError = '';
  try { live = listProcesses(); } catch (e) { liveError = String(e.message ?? e).slice(0, 120); }
  return report('witness-procs', [
    { name: 'the runner and the work in this worktree are reported', ok: JSON.stringify(lines) === JSON.stringify(['11|dotnet', '13|node.exe', 'RUNNER|10']), detail: JSON.stringify(lines) },
    { name: 'CONTROL: the same work in another worktree, and this tool itself, are not', ok: !lines.some((l) => l.startsWith('12|') || l.startsWith('14|')), detail: JSON.stringify(lines) },
    { name: 'the process table is read on this machine, this process in it', ok: live.some((p) => p.pid === process.pid), detail: liveError || `${live.length} processes, ${process.pid} absent` },
  ]);
}

if (isMain(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) process.exit(selfTest());
  const config = loadConfig(argv);
  const key = flag(argv, '--key') ?? (config.worktree ? basename(config.worktree) : '');
  const pattern = flag(argv, '--pattern') ?? config.testProcessPattern ?? null;
  for (const line of classify(listProcesses(), { key, pattern })) console.log(line);
}
