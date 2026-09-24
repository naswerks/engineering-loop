# Changelog

All notable changes to this package are recorded here. The format follows Keep a Changelog; the
version is the one in `package.json` and `.claude-plugin/plugin.json`, which must agree.

## [Unreleased]

## [0.3.0] - 2026-09-22

### Changed

- **The repository's copy of `docs-workflow.md` is the authority for a doc's header and for where an
  effort is filed.** Three of its sections are marked `(repository-owned)`: The archive convention, Doc
  metadata, Templates. A repository whose docs already carry a metadata convention (YAML frontmatter with
  its own keys and status words, a validator, an indexer) or already have a home for an effort's history
  rewrites those sections in its `docs/_meta/` copy, in one voice; `engineering-loop.md` gains a
  `This repository's rails (repository-owned)` section for the policy document, gates, suite and PR
  target, and marks the POLICY row of where-a-rule-lives the same way. `rg -n 'repository-owned'
  docs/_meta/` lists every such section.
- Every skill that writes or files a doc points at those sections instead of stating the header or the
  destination itself: `docs-write`, `docs-process`, `docs-status`, `docs-backlog`, `docs-audit-feature`,
  `docs-audit-full`, `spec-pipeline`, `spec-parent`, `spec-review`, `init`. `spec-seat`'s Step 0 rows say
  the two method docs carry the repository's conventions. The eleven templates carry an init instruction
  in place of the loop's own header line, so a fresh repository's drafts are written in whatever header
  its copy prescribes. A pin holds the census: no skill spells `<!-- meta:` any more, and every writer
  names the repository-owned section.
- `init doctor` reads a doc's status from either header form unaided, the loop's meta line or a
  frontmatter `status:` key, needing only the word `draft`; the method docs' version stamp is read after
  a leading frontmatter block when a repository's gate requires one on every file. `init` no longer calls
  the method docs byte copies. A pin drives the doctor over both header forms, with controls.
- `docs-workflow.md` § The archive convention describes a third shape beside flat and split: a pipeline
  filed as one package into a home the repository already has, with `spec-pipeline` recording the resolved
  destination in the umbrella's `Archive:` line when only the authoring session can know it.
- The marketplace entry sources the plugin from this repository (`./`) instead of the npm package at a
  pinned version. `claude plugin install naswerks@engineering-loop` no longer depends on a registry that
  can lag a tag; npm remains the runner lane (`npm i -g @naswerks/engineering-loop`). A pin keeps it so.
- The release workflow names the remedy when a publish is refused: the package has no trusted publisher
  linked on npmjs.com for this repository and `release.yml`.

## [0.2.2] - 2026-09-21

### Changed

- `spec-child`'s `mixed` row names where its reading list lives — the rows for those surfaces in
  `docs/_meta/doc-index.md` § Role reading lists — so the default role is no longer the one role told to
  read "the adds for the surfaces your spec touches" without a path to them.

## [0.2.1] - 2026-09-20

### Changed

- `spec-seat`'s fallback for a `verify-staged` that is not on PATH names the pack root as `${CLAUDE_PLUGIN_ROOT}`
  (substituted under Claude Code), with the folder two levels above the skill as the reading elsewhere — a
  seat in a fresh worktree no longer has to locate the pack before it can take a staging receipt.

## [0.2.0] - 2026-09-20

### Changed

- The reading floor every seat reads is four documents plus the `_meta` trio: `patterns/code-organization.md`
  (was `vertical-slice-anatomy.md` — it describes the layout a repository actually has and presumes no
  pattern), `backend-patterns.md`, `frontend-patterns.md`, `testing.md`. `codegen.md` leaves the floor.
- The standard set a role reads on top of the floor is seven documents, each drafted by `init` only when the
  repository shows the concern and each carrying a `doc-index.md` row either way: `codegen`,
  `state-management`, `ui-style-guide`, `design-tokens` (the token authority, split out of the style guide),
  `long-running-workflows` (split out of `background-work`), `realtime-events`, `background-work`.
  `spec-child` names them by path and says an absent one has a row saying `not detected`.
- `docs/_meta/doc-index.md` § Role reading lists is the repository's reserved space: `Doc | what it gives
  the seat | backend | frontend | mixed`. `spec-parent` copies a role's rows into every seed's `EXTRA DOCS`
  line, so a team's own documents reach a seat as paths in its prompt rather than as an index to consult.
- `spec-pipeline` sizes every spec for one session before context compacts, with no target count;
  `engineering-loop.md` says the same in place of a session range.
- `init doctor` fails a standard document that is absent without its `not detected` row, and any
  Role-reading-lists row whose path does not exist.

### Added

- Templates `code-organization.md`, `design-tokens.md`, `long-running-workflows.md`.

### Removed

- The snapshot-stub pattern for the standard names: a repository names its documents with the standard
  names directly; no pointer documents.

## [0.1.0] - 2026-09-20

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
