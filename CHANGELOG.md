# Changelog

All notable changes to this package are recorded here. The format follows Keep a Changelog; the
version is the one in `package.json` and `.claude-plugin/plugin.json`, which must agree.

## [Unreleased]

### Added

- **The menu declares its shape.** `docs/_meta/doc-index.md` carries `<!-- naswerks-loop: menu=all -->` (it
  lists every living doc: the repository has no other index; the default, and what a menu with no such line
  means) or `<!-- naswerks-loop: menu=curated; index={path} -->` (the repository already indexes every doc in
  `{path}`; the menu lists the docs its seats read). `docs-workflow.md` § The repository-owned sections
  explains both, and the loop's standard for a doc on a curated menu: a header at a decided status and a
  `## Key Files` section. `init` writes `menu=curated` when its scan finds an index the repository already
  keeps; `docs-process` registers a new doc where the shape says; `docs-status` and `docs-audit-full` flag a
  menu that has drifted; `init doctor` reads the shape, FAILs a doc the menu names that does not exist,
  flags a living doc an all-menu misses, and holds every doc a curated menu names to the standard.
  `pins/menu.test.mjs` holds both shapes.

### Changed

- The map's Doc metadata row no longer asks whether the menu is kept by hand; the menu's shape line says
  what the menu is.

- `docs-workflow.md` § The repository-owned sections no longer says which words this repository writes for
  the loop's states; that is § Doc metadata's to say, so a repository that pastes the section verbatim no
  longer inherits a line that is untrue for it.
- README: taking a new release is `claude plugin update`; the pins and the release path read as they are.

## [0.4.0] - 2026-09-23

### Changed

- **The two method documents state one way of running the loop, opinionated on purpose, and name the four
  places a repository replaces with its own.** Each is a whole section whose heading ends
  `(repository-owned)`: in `docs-workflow.md`, The archive convention, Doc metadata and Templates; in
  `engineering-loop.md`, This repository's rails. One grep lists them and nothing else:
  `rg -n '^#+ .*\(repository-owned\)' docs/_meta/`. The heading is the contract: a repository keeps it and
  replaces the body in its `docs/_meta/` copy, in its own words. The loop's own preferences stay stated
  concretely in the references: the `<!-- meta -->` header and its Obsidian interop, `## Lineage`, the
  topic folders under `archive/{topic}/`, flat and split.
- `docs-workflow.md` gains § The repository-owned sections: what the skills read from each section, where
  the two documents echo it in passing, the loop's four states (`draft`, `wip`, `current`, `shipped`) and
  who writes each, what silence in a section means, how to replace one (filing a pipeline as one package
  into a home the repository already has among the examples), and what the version stamp means.
- `engineering-loop.md` § This repository's rails is six items, each an absent-line until the repository
  fills it: Policy, Gates a commit passes, Before a PR, Where a PR goes, Staging, Skills a seat meets here.
  They add to the Hard rules and never subtract. The POLICY row of where-a-rule-lives points at the rails'
  policy document, and in hosted mode at the control plane's suffix.
- **The skills name the section and the concept, never the value.** A header is written at the word for a
  loop state, "the verified date" is wherever § Doc metadata keeps it, an effort files into "the archive
  home" § The archive convention names, and the base branch and the PR route come from the rails. Every
  skill that needs a format carries the same line near its top, "Find the format first", with the grep.
  `docs-process` holds the filing procedure only; the shapes and the link repairs are the archive
  convention's. `spec-review` and `spec-pipeline` diff against the rails' base branch; `spec-parent` and
  `spec-retro` open the PR where and how the rails say.
- The templates keep the loop's own header; their init instruction drops the blockquote date where
  § Doc metadata keeps none. `init` writes the Start-here stanza's and the folder READMEs' echo lines in the
  copy's words when the copy has replaced the section they echo, and drafts § This repository's rails from
  the scan.
- `init doctor` reads a doc's status from either header form unaided, the loop's meta line or a
  frontmatter `status:` key, needing only the word `draft`; reads the version stamp after a leading
  frontmatter block; and reports each repository-owned heading (unmarked or missing: DEGRADE) and each
  rails item (missing, or still its absent-line: DEGRADE). It never grades the loop text or the content of
  a repository-owned section.
- The marketplace entry sources the plugin from this repository (`./`) instead of the npm package at a
  pinned version. `claude plugin install naswerks@engineering-loop` no longer depends on a registry that
  can lag a tag; npm remains the runner lane (`npm i -g @naswerks/engineering-loop`). A pin keeps it so.
- The release workflow names the remedy when a publish is refused: the package has no trusted publisher
  linked on npmjs.com for this repository and `release.yml`.

### Added

- `init refresh` (`skills/init/scripts/refresh.mjs`): brings a repository's copies of the method documents
  up to this pack by writing only their repository-owned sections and the stamp. A dry run by default, one
  row per section (kept, heading marked, added, item added, stamp); `--write` applies exactly those rows. It
  never touches the loop text, never deletes, never reorders, keeps every line's own ending, and a second
  run writes nothing.
- `skills/init/scripts/owned.mjs`: the one list of repository-owned sections the doctor, refresh and the
  pins share.
- Pins: a census that no skill spells the loop's own header or archive destination; the one-grep pin
  (exactly four marked headings, equal to `owned.mjs`, no partial marker); section citations by exact
  heading only; the loop states a skill names; the find-format line; `pins/preferences.test.mjs`, which
  keeps the loop's own preferences in the references; `pins/refresh.test.mjs`.

### Fixed

- `docs-audit-full` named `docs-write` as the skill that files a finished working doc; it is
  `docs-process`.
- `spec-review` wrote its report at a status no loop state names; it writes the word for `shipped`.

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
