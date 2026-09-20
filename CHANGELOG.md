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
- `init`: makes a repository ready for both loops. Creates the `docs/` shape with a README per folder,
  copies the two method documents with the pack's version stamp, writes `docs/_meta/doc-index.md` with
  the sections the skills read, drafts first versions of every document the skills send a reader to by
  scanning the repository (and the four stack-conditional ones only where the stack is found), adds
  the start-here stanza to `CLAUDE.md` and `AGENTS.md` where they exist, and the plugin pin to
  `.claude/settings.json`. Idempotent: a second run writes nothing and reports. `init doctor`
  (`skills/init/scripts/doctor.mjs`) grades a repository FAIL / DEGRADE / ok per row.
- The skills describe the method for any repository: repository-specific knowledge moved to the
  documents `init` writes, one plane's retired vocabulary left, hosted-control-plane recipes are marked
  as such.
- The pins (`npm test`): manifest and package versions agree, every skill directory carries a
  `SKILL.md` whose `name` is its folder, no byte-order marks, the vocabulary censuses, and the content
  censuses (no private product or dated incident, no glyphs, no link into an archived effort, every
  document a skill names is one `init` writes, the parser contracts a control plane reads).
