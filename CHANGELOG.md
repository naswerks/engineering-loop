# Changelog

All notable changes to this package are recorded here. The format follows Keep a Changelog; the
version is the one in `package.json` and `.claude-plugin/plugin.json`, which must agree.

## [Unreleased]

## [0.8.0] - 2026-10-21

A minor: the skills act differently, and a repository must act — its method docs take new text, and every
pipeline folder in the old shape is carried over before it runs on this version (§ Upgrading from 0.7).

### Changed

- **One brief per pipeline.** A pipeline folder is `00-ignition-brief.md` — the coordinator seat's spec and
  the charter every seat reads, never a session — and `01..NN-{slice}.md`, each one build seat's spec. The
  umbrella `01-{topic}.md` is gone: its vision, settled decisions, hard constraints and sources live in the
  brief's `## Why`, `## The owner's rulings`, `## Law`, `## What this effort does NOT do` and
  `## Where it came from`. The brief's sections down to § Platform state bind every seat; its beliefs,
  close-out and kick are the coordinator's. Its H1 is the pipeline's title. The sequence is written once, in
  the brief; the tracker's status lines name its rows by id and copy nothing, and its `## Settled decisions`
  is `## Rulings made during the run`. `spec-pipeline`'s template, the coordinator's reading order and its
  one-comparison shape check, `spec-ignite`'s stage card, the build seat's reading list, the review's
  inventory (the brief down to § Platform state, read as claims), `docs-process` and `docs-write` (the
  brief's `Archive:` line) all say so. No skill carries a fallback for the old shape.
- **`step` rows and a role cell.** A sequence row that is not a seat — a publish, a merge, a human sitting
  — says `step` in its `Kind` cell, and is shown on the stage card and never staged. A misspelled kind is
  still refused by name, because no misspelling can equal `step`. A seat row may carry `backend`,
  `frontend` or `mixed` in a `Role` column. A human step files `sessions/{step-slug}/receipt.md`.
- **The hand-cranked relay.** A seat posts its PLAN TLDR and questions in the chat; the coordinator
  answers in one message of notes; on the human's approval the seat writes `plan.md` and `tldr.md` with
  the notes transcribed verbatim and runs to done without a stop — build, suites, `docs-write`, commits with
  `verify-staged`, its branch pushes — then posts its FINAL TLDR. The coordinator writes its acceptance into
  the seat's `tldr.md` after the push. The hosted ceremony is unchanged.
- **Live checks are the owner's.** `live-checks.md` is created with no rows and holds only the rows the
  owner dictates; the coordinator writes a row only on the owner's word and never aggregates seats' checks
  into it; a seat's FINAL TLDR section (e) is "what the owner could try", in the chat; the close offers the
  owner a short, ordered quick pass; `docs-process` adds no live check to a living doc.
- **The owner's standing rules:** one pipeline at a time (a GATE checks only that the predecessor merged);
  approved work includes its commit, its push and the coordinator's PR, and nobody asks for them again; the
  floor is cited from the brief's `## Baselines` and measured only for a lane the brief does not name.
- **What three watched runs taught the ceremony.** `spec-coordinator`: a ruling that binds a running seat
  goes onto its board in the same act as the tracker entry; a ruling counts only when its act lands;
  append at the end of a seat's file; stop instead of sleep-polling when the plane's calls fail; never advise
  a runner restart while a seat is live; an escalation is an act; keep each seed as sent; the hosted seed
  stops restating the skills and the role; the commit call no longer stages the tracker. `spec-seat`: write
  the board with the file tools, never a heredoc; the BELIEFS line near the top of both files; never route
  around a refusal by disguising a path. `spec-review`: its inventory wins over a narrower brief, and the
  report says whether it was cold or warm. `docs-process`: its board lives in `sessions/docs-process/`, and
  every input arrives as a list. `spec-retro`: a witness ledger is an input.
- **`spec-witness` is the outside watcher's playbook:** a session outside the control plane, usually on
  the runner's machine, never a declared seat, holding no credential — the packet, pre-registered
  expectations, the identity map, the instruments that need no credential (git, the transcripts, the board
  files, the process table, the plane's rows as another session's transcript shows them), what is and is
  not an event, human touches, the watch, the ledger and the control-plane incident ledger.
- `references/docs-workflow.md` takes the retire path for research the platform moved past
  (`archive/retired/`) and the provenance exception to the archive's frozen links.

### Added

- `bin/witness-*.mjs`, the witness's tools: a config-driven watcher (`witness-watch`) and the transcript,
  git and process probes `spec-witness` names, each with a `--self-test` that `npm test` runs. A run's own
  facts — its worktree, its folders, the plane's tool prefix, the process pattern, the noise paths — live in
  a `witness.config.json` beside the witness's folder.
- `init doctor` reads `step` rows and the role cell, and a pipeline folder whose `01-` file no sequence row
  names reads DEGRADE: "old shape — fold `01-{topic}.md` into the brief (CHANGELOG 0.8.0 § Upgrading)".
- Pins: `pins/shape.test.mjs` (a `step` row and its misspelled-kind control, the role cell, the old-shape
  row and its control, one `## The sequence` in the template, no umbrella in any skill) and
  `pins/witness-tools.test.mjs`; the content census reads `bin/` too.

### Fixed

- `verify-staged` on a large repository: every listing is read for the expected paths only, and an output
  past the buffer is an ERROR by name. A full listing over Node's default 1 MiB buffer made
  `--against head` print "HEAD is unreadable" and call a committed file never-added, and made the index
  mode fail the same way.

### Upgrading from 0.7

In this order:

1. **Take the release where every session loads it:** `claude plugin marketplace update engineering-loop`,
   then `claude plugin update naswerks@engineering-loop --scope <scope>`, and a new session. A runner that
   loads the pack from an npm install takes `@naswerks/engineering-loop@0.8.0` there (its pinned
   `package.json`, or a global install) and is restarted by its owner with no seat live — a runner left on
   0.7 serves the 0.7 skills, which read the old shape.
2. **Re-copy the loop text** of both references into `docs/_meta/`. The four repository-owned sections are
   yours, so neither the re-copy nor `init refresh` touches them; three carry changed text, offered as
   replacements you take or fit to your own patterns: § The archive convention (the `research/` retire
   path, the provenance exception and the `archive/retired/` home, the `specs/` line
   `00-ignition-brief · 01..NN slices`, the sessions map, the brief in a follow-on's back-link),
   § Doc metadata (the ignition brief goes in `Idea`), § Templates (the spec-doc preamble and its
   `Source: [brief / research]`). Then `init refresh` restamps both copies, and `init doctor` lists the
   folders to carry.
3. **Carry every old-shape folder over before it runs on 0.8.0** — each one the doctor marks "old shape". A
   pipeline that is mid-run finishes on its old pack first; never carry a live one. Per folder:
   - **Fold the umbrella into the brief, section by section, losing nothing:** its vision into `## Why`,
     its settled decisions into `## The owner's rulings`, its hard constraints into `## Law` and
     `## What this effort does NOT do`, its research sources into `## Where it came from` (with its
     `Archive:` line), and anything else into the section that fits or a `## Reference`. The brief's H1
     becomes the pipeline's title — the umbrella's H1 — and its blockquote says every seat reads it.
   - **One sequence:** reconcile the brief's `## The sequence` with the umbrella's row table and the
     tracker, keep it in the brief alone, and write each prose step (a publish, a merge, a human sitting) as
     a `step` row in its place.
   - **The tracker stops copying:** its status lines name the brief's rows by id, and
     `## Settled decisions` becomes `## Rulings made during the run`, holding only what the run ruled.
   - **Delete the umbrella**, and repair every link to it outside `docs/archive/` and `sessions/**` to point
     at the brief. Archives and testimony are never edited.
   - **Keep the specs' numbers.** A spec that was `02-` stays `02-`; the gap at `01` is the umbrella's.
   - **Check it:** every heading of the old umbrella is found in the brief or named where it merged, and
     `init doctor` reads the folder with no "old shape" row and no FAIL.

## [0.7.1] - 2026-10-04

### Changed

- `spec-coordinator` learns the control plane's verbs of 2026-10-04: `seat_spawn` defaults its host to the one
  carrying the coordinator's own session and takes `model` and `effort` overrides; `accept_plan` and `accept`
  take `answeringActId`, so one act rules and closes a question — and an act that names no question closes
  none; the coordinator reads for itself what the owner used to check (`seat_timeline`, `needs_you`, argless
  `seat_usage`, `seat_parks` with a charge's `seatId` or `all: true`, the roster's host and `re-raises`); it
  commits its tracker itself, after each reap and never in a seat's commit call; and, hosted, `finish` is its
  last call — the pipeline moves to `reviewing` and the PR's merge closes it.

### Upgrading from 0.7.0

Take the release (`claude plugin marketplace update engineering-loop`, then
`claude plugin update naswerks@engineering-loop --scope <scope>`, and a new session). A patch: no loop text
changed, nothing is restamped, and a hand-cranked repository's coordinator acts as before — every change but
the tracker's commit discipline is the hosted plane's. A control plane older than 2026-10-04 refuses the new
arguments and verbs by name.

## [0.7.0] - 2026-10-01

### Changed

- **The hosted plane runs the hand-cranked ceremony: one file, two voices, a poke each way.** A seat writes
  its `plan.md` and `tldr.md` with its own tools and posts each by `path` the first time — the control plane
  reads the file from the seat's runner (periscope 1.4.0's `workspace_read`) — then with nothing. The
  coordinator appends its ruling to the seat's `tldr.md` under its coordinator-voice heading and calls
  `accept_plan`, `accept` or `callout` with a one-line summary; the control plane mirrors the file before it
  records the act, and the seat is pointed at the section added. The act still decides. A runner older than
  periscope 1.4.0 keeps the old form: the seat posts `content`, and the verb carries the coordinator's words.
  `spec-seat`, `spec-coordinator` and `engineering-loop.md` § The blackboard say so.
- `spec-coordinator`: `seat_acts` is the coordinator's census (its mint carries `acts:read`, and
  `spec-retro` says so too); `read_blackboard` returns a window of a file or only the sections new since a
  revision; `accept` carries the commit call, and an acceptance written into the seat's file binds to that
  revision.
- `spec-seat`: a search is data only as a quoted literal given to a read-only search tool, with no `$`, no
  backtick, no interpreter and no `xargs` in the pipeline. On a periscope 1.4.0 runner the native reads
  reach outside the workspace, credential material excepted; on an older one a file outside it is read with
  a shell command.

### Added

- **`## [seat·…] ABOUT TO PARK`, the seat's third anchor:** the next call waits on a human, and here it is —
  the verbatim command and what it waits on, posted before the call runs. Non-staling, like `HOLDING`.
- Both skills: a control-plane verb that fails with a transport error (`ECONNRESET`) is called once more,
  then disclosed; a refusal has a name and a dropped connection does not.

### Upgrading from 0.6

1. Take the release: `claude plugin marketplace update engineering-loop`, then
   `claude plugin update naswerks@engineering-loop --scope <scope>`, and a new session.
2. Re-copy the loop text of `references/engineering-loop.md` into `docs/_meta/engineering-loop.md` — § The
   blackboard changed — keeping your repository-owned sections. Then `init refresh` restamps both copies; it
   never touches loop text.
3. A control plane that reads the seat anchors treats `## [seat·…] ABOUT TO PARK` as it treats
   `## [seat·…] HOLDING` — a post-acceptance append that does not stale the acceptance. Until it does, the
   append stales one.

## [0.6.0] - 2026-09-29

### Changed

- **Two skills are named for the seat kinds that run them.** `spec-parent` is now `spec-coordinator`, and
  `spec-child` is now `spec-build`. A spec seat's skill is `spec-{kind}` for every kind; `fixit` rides
  `spec-build`, and `docs-process` is its own skill. Invoke them as `/naswerks:spec-coordinator` and
  `/naswerks:spec-build`. A control plane that seeds skills by name seeds the new names, with this version
  as its pack floor.
- **The coordinator's voice is spelled `COORDINATOR`.** The anchors are `## COORDINATOR RULING`,
  `## COORDINATOR NOTE` and `## COORDINATOR ACCEPT` (beside `## OPERATOR RULING`), the ruling templates open
  `COORDINATOR RESPONSE`, and a seat's own anchors are `## [seat·…] CLOSE-OUT RECEIPT` and
  `## [seat·…] HOLDING`. A board written before this version spells them `## PARENT …` and `[child·…]`:
  every grep the skills run reads both spellings, a parser that reads the anchors should too, and no seat
  rewrites a heading already on its board.
- The coordinator's close-out audit is filed as `sessions/coordinator-retrospective.md`; a reader takes
  `sessions/parent-retrospective.md` in an effort begun before this version.
- `spec-coordinator` no longer names a `parallel` spawn argument: a shared worktree holds one live seat at a
  time, and parallel seats need separate worktrees, decided when the pipeline is created.
- The retired-vocabulary census retires `parent` beside `chain` and `child`.
- `docs-workflow.md` says the ignition brief is written whole at authoring and verified at ignition. The
  sentence sits in § Templates, which a copy owns: see Upgrading, step 3.

### Added

- `pins/names.test.mjs`: every skill name the pack writes is a skill it carries, and every seat kind runs a
  skill named for it. The kinds, their skills and the words shaped like a skill name that name none are one
  list in `skills/init/scripts/owned.mjs`, which the doctor reads too.
- `init doctor` degrades a brief whose `## The kick` names a skill this pack does not carry, and names the
  coordinator's skill.

### Upgrading from 0.5

1. Take the release (`claude plugin marketplace update engineering-loop`, then
   `claude plugin update naswerks@engineering-loop`) between efforts: a session that invokes `spec-parent`
   or `spec-child` after the update finds no such skill.
2. Re-copy the loop text of both references into `docs/_meta/`, keeping your repository-owned sections;
   `init refresh` restamps and never touches loop text.
3. Three places are yours, so neither `init refresh` nor a re-copy reaches them. Change each one that still
   carries the old text:
   - § The archive convention (repository-owned): `parent-retrospective.md` is `coordinator-retrospective.md`.
   - § Templates (repository-owned): the ignition brief is "the coordinator seat's standing orders for the
     run — written whole at authoring, verified at ignition" (it read "the parent seat's standing orders
     for the run — two sections completed at ignition").
   - `docs/_meta/doc-index.md`: the build-seat paragraph `init` wrote from its template names `spec-build`
     (it read `spec-child`).
4. Run `init doctor`. A brief whose kick still names a retired skill shows a DEGRADE row; change the kick.

## [0.5.1] - 2026-09-24

### Fixed

- A doc on a curated menu meets the loop's standard when it names the code it describes in either form: a
  `## Key Files` section, or a frontmatter `related_files` list. The doctor checked for the heading alone and
  flagged docs that name their code in frontmatter.
- A patch release never asks a copy of the method docs to change, so `init doctor` and `init refresh` read a
  stamp as behind only when its minor version is.

## [0.5.0] - 2026-09-24

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
