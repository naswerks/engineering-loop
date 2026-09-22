// The pins over the pack's shape. `npm test` runs them; the release workflow runs them on the tag.
// A pin states one thing the tree must be true of, and fails naming the file that is not.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { root, skillDirs, walk, readText } from './support.mjs';

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const plugin = JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
const marketplace = JSON.parse(readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'));

test('the package, the plugin manifest and the marketplace entry name ONE version', () => {
  assert.equal(plugin.version, pkg.version, 'plugin.json and package.json disagree on the version');
  const entry = marketplace.plugins.find((p) => p.name === plugin.name);
  assert.ok(entry, `marketplace.json has no entry for plugin "${plugin.name}"`);
  assert.equal(entry.version, pkg.version, 'the marketplace entry and package.json disagree on the version');
});

test('the plugin is named naswerks and the marketplace engineering-loop', () => {
  assert.equal(plugin.name, 'naswerks');
  assert.equal(marketplace.name, 'engineering-loop');
});

test('every directory under skills/ carries a SKILL.md whose name is its folder', () => {
  const dirs = skillDirs();
  assert.ok(dirs.length >= 14, `expected at least the fourteen loop skills, found ${dirs.length}`);
  for (const dir of dirs) {
    const file = join(root, 'skills', dir, 'SKILL.md');
    assert.ok(existsSync(file), `skills/${dir}/ has no SKILL.md`);
    const text = readText(file);
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(fm, `skills/${dir}/SKILL.md has no frontmatter block`);
    const name = fm[1].match(/^name:\s*(.+)$/m);
    assert.ok(name, `skills/${dir}/SKILL.md frontmatter has no name`);
    assert.equal(name[1].trim(), dir, `skills/${dir}/SKILL.md names itself "${name[1].trim()}"`);
    assert.ok(/^description:\s*\S/m.test(fm[1]), `skills/${dir}/SKILL.md frontmatter has no description`);
  }
});

test('no file in the pack starts with a byte-order mark', () => {
  const offenders = [];
  for (const file of walk(root, ['skills', 'references', 'templates', 'bin', '.claude-plugin'])) {
    const head = readFileSync(file).subarray(0, 3);
    if (head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf) offenders.push(file);
  }
  assert.deepEqual(offenders, [], 'a BOM breaks frontmatter parsing on the first line');
});

test('the files the package ships are the files the plugin needs', () => {
  for (const must of ['.claude-plugin/', 'skills/', 'references/', 'bin/', 'LICENSE', 'README.md', 'CHANGELOG.md']) {
    assert.ok(pkg.files.includes(must), `package.json files[] does not ship ${must}`);
  }
  assert.equal(pkg.bin['verify-staged'], 'bin/verify-staged.mjs');
  assert.ok(statSync(join(root, 'bin', 'verify-staged.mjs')).isFile());
});

test('the two method documents carry the pack version stamp', () => {
  for (const doc of ['docs-workflow.md', 'engineering-loop.md']) {
    const text = readText(join(root, 'references', doc));
    const stamp = text.match(/<!-- naswerks-loop: version=([^\s]+) -->/);
    assert.ok(stamp, `references/${doc} has no version stamp`);
    assert.equal(stamp[1], pkg.version, `references/${doc} is stamped ${stamp[1]}, the package is ${pkg.version}`);
  }
});

test('CHANGELOG.md has a section for the package version', () => {
  const text = readText(join(root, 'CHANGELOG.md'));
  assert.ok(text.includes(`## [${pkg.version}]`), `CHANGELOG.md has no "## [${pkg.version}]" section`);
});

// The marketplace installs the plugin from this repository. A registry lags a tag whenever a publish
// fails, and an entry pinned to a registry version then refuses every fresh install until someone
// notices; the repository at the release commit is the same bytes with nothing in between.
test('the marketplace entry sources the plugin from this repository, not from a registry', () => {
  const entry = marketplace.plugins.find((p) => p.name === plugin.name);
  assert.equal(entry.source, './', 'the marketplace entry must source the plugin from the repository root');
});
