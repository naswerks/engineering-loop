// The pins over the witness tools in bin/: each one's self-test passes, and the set `spec-witness` names
// is the set the pack ships — a tool the skill names that does not exist sends the witness to nothing, and
// a tool that ships unnamed is one nobody runs. Each self-test carries its own controls.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, readText } from './support.mjs';

const shipped = readdirSync(join(root, 'bin')).filter((f) => /^witness-.+\.mjs$/.test(f) && f !== 'witness-lib.mjs').sort();

function selfTest(tool) {
  try {
    return { exit: 0, out: execFileSync(process.execPath, [join(root, 'bin', tool), '--self-test'], { encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { exit: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

test('the pack ships the witness tools', () => {
  assert.ok(shipped.length >= 14, `expected the witness tool set; found ${shipped.join(', ')}`);
});

for (const tool of shipped) {
  test(`${tool}: its self-test passes`, () => {
    const { exit, out } = selfTest(tool);
    assert.equal(exit, 0, out);
    assert.match(out, /^SELF-TEST PASSED: /m, out);
  });
}

const named = () => [...new Set([...readText(join(root, 'skills', 'spec-witness', 'SKILL.md')).matchAll(/`(witness-[a-z-]+\.mjs)`/g)].map((m) => m[1]))].sort();

test('spec-witness names exactly the tools the pack ships', () => {
  assert.deepEqual(named(), shipped);
});

test('CONTROL: the comparison sees a named tool that does not ship', () => {
  assert.notDeepEqual([...named(), 'witness-missing.mjs'].sort(), shipped);
});
