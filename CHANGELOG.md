# Changelog

All notable changes to this package are recorded here. The format follows Keep a Changelog; the
version is the one in `package.json` and `.claude-plugin/plugin.json`, which must agree.

## [Unreleased]

## [0.1.0] - unreleased

### Added

- The fourteen loop skills as a plugin: `docs-audit-feature`, `docs-audit-full`, `docs-backlog`,
  `docs-process`, `docs-status`, `docs-write`, `spec-child`, `spec-ignite`, `spec-parent`,
  `spec-pipeline`, `spec-retro`, `spec-review`, `spec-seat`, `spec-witness`.
- `references/docs-workflow.md` and `references/engineering-loop.md`, the method documents a
  repository copies into `docs/_meta/`, each stamped with the pack version.
- `bin/verify-staged.mjs`, the staging receipt: proves every path handed to `git add` actually
  landed, naming the ignore rule that ate any that did not.
- The pins (`npm test`): manifest and package versions agree, every skill directory carries a
  `SKILL.md` whose `name` is its folder, no byte-order marks.
