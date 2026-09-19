#!/usr/bin/env node
// The publish gate. `"private": true` stands until every item below is satisfied; the gate reports
// the outstanding items on every run and refuses (exit 1) only once `private` is gone and an item
// is still missing. Run: node pins/publish-gate.mjs
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './support.mjs';

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const missing = [];
const need = (ok, item) => {
  if (!ok) missing.push(item);
};
const read = (rel) => (existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8') : '');

need(read('LICENSE').startsWith('MIT License'), 'LICENSE (the MIT text)');
need(existsSync(join(root, 'README.md')), 'README.md');
need(read('CHANGELOG.md').includes(`## [${pkg.version}]`), `CHANGELOG.md section for ${pkg.version}`);
need((pkg.repository?.url ?? '').includes('naswerks/engineering-loop'), 'package.json repository.url');
need(existsSync(join(root, 'skills', 'init', 'SKILL.md')), 'skills/init: a fresh repository must be able to host the loop before the pack is public');
need(!/nas-platform|NasBff|NasAgentOps/.test(read('README.md')), 'README names no private product');

if (missing.length === 0) {
  console.log(`publish gate: clear for ${pkg.name}@${pkg.version}`);
  process.exit(0);
}
console.log(`publish gate: ${missing.length} item(s) outstanding for ${pkg.name}@${pkg.version}:`);
for (const m of missing) console.log(`  - ${m}`);
if (pkg.private === true) {
  console.log('package.json carries private: true; the gate is informational until it is removed.');
  process.exit(0);
}
process.exit(1);
