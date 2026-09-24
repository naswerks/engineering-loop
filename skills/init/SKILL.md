---
name: init
description: Make a repository able to run the loop — create the docs/ shape, the two method docs, a scanned first draft of every doc the loop's skills read, the doc-index menu with the repo's own slots, the Start-here stanza and the plugin pin; then say what is still missing. Run init in a repository that has none of this; run init doctor to check one that does; run init refresh to bring a repository's copies of the method docs up to a newer pack (it writes only their repository-owned sections and the stamp). A second init writes nothing and prints the doctor report.
---

# init

Every seat the loop arms reads `docs/_meta/*` and a floor of `patterns/*` docs before it writes a line;
the coordinator keeps a tracker in `docs/research/{topic}/`; `docs-write` files into `docs/working/`; the
control plane admits a spec folder only when the repository carries `docs/_meta/docs-workflow.md`.
`init` creates all of that in a repository that has none of it — as REAL first drafts scanned off the
repo, never as empty headings — and `init doctor` says, per path, whether the loop can run.

**Three invocations:** `init` (create what is missing, then the report) · `init doctor` (the report only) ·
`init refresh` (a newer pack's repository-owned sections into the copies that exist — see § refresh). A
second `init` writes nothing and IS the doctor report.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

**The law of the draft:** a section is filled only from files the scan opened, and every drafted doc
names them in its provenance line. Stack, trees, commands, config keys and Key Files are copied verbatim.
**Rules and gotchas are never invented** — a rule is written only when the repository already wrote it
down somewhere (a CONTRIBUTING, an analyzer config, a lint rule, a base-class docstring), and the bullet
cites that file. A section with nothing to fill carries the literal absent-line and nothing else:

```
No {X} detected — fill this in: {what the section must answer}.
```

The loop itself supplies exactly three seed rules that need no source: never hand-write a generated
folder (when one exists); suites run serially with the output captured to a UTF-8 file and the summary
block read, never the exit code alone; a pin must be able to fail.

## What init creates — the closed set

```
docs/
  _meta/docs-workflow.md          a copy of the pack's references/docs-workflow.md (stamped); its sections marked
                                  (repository-owned) are the repository's to rewrite to its own conventions
  _meta/engineering-loop.md       a copy of references/engineering-loop.md (stamped), under the same rule
  _meta/doc-index.md              the menu, written LAST — every doc that exists + three repo slots:
                                  ## Role reading lists · ## Apps and their build commands · ## The evidence tools
  research/ working/ archive/ guides/ patterns/ infrastructure/ features/     each with a README.md
  patterns/code-organization.md  patterns/backend-patterns.md
  patterns/frontend-patterns.md  patterns/testing.md               the floor — always drafted; a repo
                                                                   with no server side or no client side
                                                                   gets an honest "not detected" doc
  patterns/codegen.md  patterns/state-management.md  patterns/ui-style-guide.md
  patterns/design-tokens.md  patterns/long-running-workflows.md
  infrastructure/realtime-events.md  infrastructure/background-work.md
                                                                   the standard set — drafted ONLY when
                                                                   the scan finds the concern; every one
                                                                   gets a doc-index row either way
CLAUDE.md                          the Start-here stanza appended (created with only the stanza if absent)
AGENTS.md                          the same stanza, only when the file already exists
.claude/settings.json              the plugin pin merged in (never clobbers existing keys)
```

Eight folders, and the set is closed. Anything else already under `docs/` is left alone and reported as
"outside the loop's shape — not touched" — never an error, never a queue entry.

**The standard set is shaped by what an engineering team usually has, and a team that lacks one of them
is told so, not handed a placeholder.** A concern the scan finds no evidence for is NOT drafted; its
`doc-index.md` § Role reading lists row says `not detected — no {library/mechanism} found`, and the
report lists it under "not in this codebase". A seat that later meets the absent path reads that row and
moves on. The floor four are the exception: every repository can answer "where the code lives", "how
the server side is built", "how the client side is built" and "how tests run" — even when the answer to
one of them is "no client side here" — so those are always written.

**The reserved space.** § Role reading lists in `doc-index.md` is the repository's own table: one row
per doc a role should read, standard or not. The coordinator copies a role's rows into every seat's
`EXTRA DOCS` line, so a team's own docs reach a seat as paths in its prompt. `init` seeds the standard
rows; the team adds its own, and can add a role column if its seats have kinds the loop does not ship.

**Every template lives at the pack root under `templates/`** (`templates/docs/patterns/*.md`,
`templates/docs/infrastructure/*.md`, `templates/docs/_meta/doc-index.md`, `templates/docs/readme-*.md`,
`templates/claude-md-stanza.md`, `templates/settings-pin.json`). Under Claude Code the pack root is
`${CLAUDE_PLUGIN_ROOT}` and this skill's own folder is `${CLAUDE_SKILL_DIR}`; in another harness, the
pack root is the folder that holds `.claude-plugin/plugin.json` — two levels above this SKILL.md.

## The scan — read everything first, write nothing yet

Run all three passes with your file tools before the first write. Keep a table in your turn — `file ·
what it says` — and cite from it. A draft written mid-scan is a draft written from memory.

1. **Refuse outside a git repository**: `git rev-parse --show-toplevel` (the refusal is
   `init-needs-a-git-repository`). Everything below is relative to that root.
2. **The stacks.** `*.sln`, `*.slnx`, `*.csproj`, `Directory.Build.props`, `Directory.Packages.props` ·
   `package.json` (+ lockfile, `workspaces`), `pnpm-workspace.yaml` · `pyproject.toml`, `setup.cfg`,
   `requirements*.txt` · `go.mod` · `Cargo.toml` · `Gemfile` · `pom.xml`, `build.gradle*`. Frameworks and
   versions by dependency name.
3. **The commands and the shape.** Test runners and scripts (`package.json` `scripts`, `Makefile`,
   `justfile`, `scripts/*`) · CI workflow files (`.github/workflows/*.yml`, `azure-pipelines.yml`,
   `.gitlab-ci.yml`) — the jobs are the lanes · app roots (`angular.json` projects, `apps/*`,
   `packages/*`, `web/*` and `services/*` under `src/`, `cmd/*`, an executable `*.csproj`) · `generated/` folders
   and codegen configs (`codegen.ts`, `codegen.yml`, `openapi*`, `*.proto`, `tgconfig.json`, `prisma/`) ·
   the folder layout two deep · `git log --oneline -20` (the message convention) · the remote's default
   branch (`git symbolic-ref refs/remotes/origin/HEAD`) · a realtime library
   (signalr, socket.io, ws, sse, pusher, ably) · a state library (ngxs, ngrx, redux, zustand, pinia,
   mobx) · a UI library or tokens file (tailwind, daisyui, mui, chakra, bootstrap, shadcn) · a queue,
   worker or scheduler (a service bus, RabbitMQ, SQS, BullMQ, Hangfire, Quartz, Celery, sidekiq).
4. **The rules the repository already wrote down.** `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`, a
   README "Conventions" section · `.editorconfig`, eslint / biome / prettier / stylelint configs ·
   analyzer configs (`.stylecop`, `.globalconfig`, `Directory.Build.props` rules such as
   `TreatWarningsAsErrors`, `Nullable`, banned-API lists) · `tsconfig*.json` strictness ·
   `BannedSymbols.txt`, `FLAKY-TESTS.md` · CODEOWNERS · `.husky/`, `.githooks/` · PR templates · the
   existing `docs/` tree · `.claude/settings.json`.

## The write order — create-if-missing at every step

An existing file always wins and is reported `repo-owned`, whether it is a draft or not, loop-shaped or
not. `init` never overwrites, never reorders, never deletes.

1. The seven folders, each with its `README.md` from `templates/docs/readme-{folder}.md` — the README is
   the only file init writes into a folder that already exists.
2. `docs/_meta/docs-workflow.md` and `docs/_meta/engineering-loop.md` — copies of the pack's
   `references/*` (their first line is the version stamp; copy it with the file). **If the repository
   already carries a copy, read its repository-owned sections before writing any draft:** the header every
   draft below carries is the one that copy's § Doc metadata (repository-owned) prescribes, not the
   templates' own line. An existing copy is never rewritten by `init`; `init refresh` is the one path that
   writes into a copy, and only into its repository-owned sections. When the repository's own gate requires
   frontmatter on every file under `docs/`, the block may sit above the stamp; the doctor reads the stamp
   after it.

   **When `init` writes the copies itself, it drafts § This repository's rails (repository-owned)** in the
   new `engineering-loop.md` from the scan, under the law of the draft: each item carries only what a file
   the scan opened states — CONTRIBUTING, `CLAUDE.md` / `AGENTS.md`, `.husky/` / `.githooks/`, the CI
   workflows, a pull-request template, CODEOWNERS, the remote's default branch — and cites it, or keeps
   its absent-line.
3. The four floor drafts (`code-organization`, `backend-patterns`, `frontend-patterns`, `testing`) from
   `templates/docs/patterns/*.md`, filled as below.
4. The standard-set drafts — `codegen`, `state-management`, `ui-style-guide`, `design-tokens`,
   `long-running-workflows`, `realtime-events`, `background-work` — only where pass 3 found the concern.
   Evidence per concern: a `generated/` folder or codegen config; a state library; a UI library; a tokens
   file or token layer; a saga / workflow / state-machine mechanism; a realtime library on either side; a
   queue, worker or scheduler.
5. `docs/_meta/doc-index.md` from its template, LAST, listing every doc that now exists under the four
   living folders (drafted or repo-owned), the three repo slots filled from the scan.
6. The Start-here stanza (`templates/claude-md-stanza.md`) appended to `CLAUDE.md` (created if absent)
   and to `AGENTS.md` (only if present); skipped when the opening marker
   `<!-- naswerks-loop:start-here -->` is already there.
7. `.claude/settings.json` — merge the two keys from `templates/settings-pin.json`; create the file if
   absent; never remove or reorder existing keys.

Then the report: one table, one row per path — `created` · `repo-owned` · `skipped: marker present` —
followed by the doctor verdict line.

## Filling a template

Every template section carries an `<!-- init: scan … fill … absent … -->` instruction with three parts:
**scan** (what to read), **fill** (what a real fill looks like — a fenced command, a tree, a table row),
**absent** (the exact line to write when nothing was found). Replace the comment with the fill or the
absent-line; **never leave an `<!-- init: -->` comment in the output** (`doctor` reads one as DEGRADE).
Replace `{today}` with today's date and `{files}` in the provenance line with the comma-separated files
the scan opened for that doc.

The shape every drafted doc keeps — because it is the shape the seats know how to read:

1. the H1, the one-line blockquote, the machine header `docs/_meta/docs-workflow.md` § Doc metadata
   (repository-owned) prescribes at the word for `draft` — placed and spelled as that section says, the
   verified date included wherever it keeps one (the templates carry the loop's own header, and each
   template's init instruction says what to drop when this repository's differs) — then the
   `<!-- naswerks-loop: draft; scanned=… -->` line;
2. Overview, then Stack, then the shape (a tree copied from a REAL folder), then one section per
   concept in the micro-grammar *prose rule, a REAL example, `### Rules`, `### Gotcha:`*;
3. decision tables that decide, checklists whose items are real paths, a `Legacy (never use)` column
   where the repo has one;
4. exact commands in fenced blocks; identifiers in backticks;
5. `## Key Files`, and `## Lineage` where § Doc metadata (repository-owned) keeps it.

**The templates speak the loop's own formats** — the header, the status words in the Start-here stanza and
the folder READMEs, the archive home in the `archive/` and `working/` READMEs and in the doc-index. When
this repository's copy has replaced the section a line echoes, write that line in the copy's words instead.

A section the scan can only half-fill says which half. A rule with no cited source is not written.

## doctor

`node ${CLAUDE_SKILL_DIR}/scripts/doctor.mjs [repo-root]` — the `scripts/` folder beside this SKILL.md;
Node 22 or later, no dependencies. It prints one row per thing the skills read and exits non-zero on any
FAIL, so a CI job or a control plane can call it.

| Row | FAIL | DEGRADE | ok |
|---|---|---|---|
| each of the eight folders | missing | README missing | present |
| `_meta/docs-workflow.md`, `_meta/engineering-loop.md` | missing, or no stamp on line 1 (or on the first line after a frontmatter block) | stamp behind the pack's version (`init refresh` restamps) | stamp equals it |
| each repository-owned heading, in its file | — | unmarked (an earlier spelling) or missing — `init refresh` marks or adds it | present |
| each item of § This repository's rails (repository-owned) | — | missing, or still its absent-line | recorded |
| `_meta/doc-index.md` and its three slot sections | missing | a slot carries only the absent-line | filled |
| the four floor docs | missing | the word `draft` (read from either header form), or an `<!-- init: -->` left in | a decided status |
| the seven standard docs | absent AND no doc-index row saying `not detected` | the word `draft` when present; absent with its row | present and decided, or absent with its row |
| every path a § Role reading lists row names | the row's path does not exist | — | resolves |
| `CLAUDE.md` / `AGENTS.md` stanza · `.claude/settings.json` pin | — | missing | present |
| `verify-staged` | — | not on PATH (the row carries the fallback) | resolvable |
| every `docs/research/*/00-ignition-brief.md` | the five problems the control plane's parser emits (no `## The kick`; the kick has no blockquote; no `## The sequence`; the sequence holds no table; a row names no kind from `coordinator build fixit review retro witness docs-process`), or a spec a row names is missing from disk | — | clean |
| every `docs/working/*.md` | — | lacks `## Living Docs to Update` or `## Archive` | carries both |
| anything else under `docs/` | — | — | "outside the loop's shape — not touched" |

**If `node` is absent**, walk the same rows by hand with your file tools, in that order, and print the
same table: the checks are file existence, a first-line stamp, a heading grep, a `status` read in either
header form, and the brief's two sections.

A repository fresh from `init` reads DEGRADE on every draft and ok on the shape. That is the intended
state: the owner promotes each draft to the word for `current` as they confirm it, section by section.

The doctor never grades the loop text of the two method docs, and never their repository-owned sections'
content: a repository rewrites both as it sees fit. It reads the stamp, the owned headings, and the rails
items' absent-lines.

## refresh

`node ${CLAUDE_SKILL_DIR}/scripts/refresh.mjs [repo-root]` is a dry run; add `--write` to apply it. Node 22
or later, no dependencies. **What it does, in the line it prints first: it writes only the repository-owned
sections and the stamp; every other line is left as it is.** A repository updating the pack is taking new
skills, not new prose — the loop text in its copies is its own, whatever it has done to it, and refresh
never touches it.

It reads the pack's `references/` for what each repository-owned section is, and prints one row per section:

| Row | When | What `--write` does |
|---|---|---|
| **kept** | the copy has the section under its exact heading | nothing — the section is the repository's, byte for byte |
| **heading marked** | the copy has it under an earlier spelling (`## The archive convention`, `## Doc metadata (header + lineage)`, `## Templates`) | rewrites that one heading line and nothing else |
| **added** | the copy lacks the section | inserts the pack's default before the first following section the copy also has |
| **item added** | § This repository's rails (repository-owned) lacks an item this pack names | appends that item's absent-line to the end of the section |
| **stamp** | the stamp is behind the pack | restamps (after any frontmatter the stamp sits under) |

Then, for each section, what this pack's skills read from it and which loop passages echo it (from the
pack's § The repository-owned sections), so the owner can check that a rewritten section still answers each
item. It never deletes, never reorders, keeps every line's own ending, and a second run writes nothing.

**Run it this way:** the dry run first; show the human its table; `--write` only on their word. After the
write, offer — and ask before doing either — to fill each new absent-line from the scan as `init` would
(the law of the draft), and to move into its new item any fact the repository had parked in its loop text
(a paragraph naming its own skills, say). Then run `init doctor`.

## Notes

- `init` is the front door of the pack; `docs-status` is the pulse after it. Run `docs-status` once the
  drafts are promoted to see the queue the way a session will.
- The floor four are always drafted, even in a repository with no frontend — the reading floor must
  RESOLVE for every seat kind, and "No frontend detected — fill this in" is an honest doc. The standard
  seven are drafted only on evidence; their absence is recorded, never papered over.
- Counterpart skills: `spec-seat` (reads the floor), `spec-child` (reads the role rows), `spec-pipeline`
  (writes the brief `doctor` checks), `docs-write` / `docs-process` (the queue `doctor` reads).
