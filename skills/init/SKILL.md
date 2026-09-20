---
name: init
description: Make a repository able to run the loop — create the docs/ shape, the two method docs, a scanned first draft of every doc the loop's skills read, the doc-index menu with the repo's own slots, the Start-here stanza and the plugin pin; then say what is still missing. Run init in a repository that has none of this; run init doctor to check one that does. A second init writes nothing and prints the doctor report.
---

# init

Every seat the loop arms reads `docs/_meta/*` and a floor of `patterns/*` docs before it writes a line;
the coordinator keeps a tracker in `docs/research/{topic}/`; `docs-write` files into `docs/working/`; the
control plane admits a spec folder only when the repository carries `docs/_meta/docs-workflow.md`.
`init` creates all of that in a repository that has none of it — as REAL first drafts scanned off the
repo, never as empty headings — and `init doctor` says, per path, whether the loop can run.

**Two invocations:** `init` (create what is missing, then the report) · `init doctor` (the report only).
A second `init` writes nothing and IS the doctor report.

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
  _meta/docs-workflow.md          a byte copy of the pack's references/docs-workflow.md (stamped)
  _meta/engineering-loop.md       a byte copy of references/engineering-loop.md (stamped)
  _meta/doc-index.md              the menu, written LAST — every doc that exists + three repo slots:
                                  ## Role reading lists · ## Apps and their build commands · ## The evidence tools
  research/ working/ archive/ guides/ patterns/ infrastructure/ features/     each with a README.md
  patterns/vertical-slice-anatomy.md  patterns/backend-patterns.md  patterns/frontend-patterns.md
  patterns/testing.md  patterns/codegen.md                          the floor — always drafted
  patterns/state-management.md  patterns/ui-style-guide.md
  infrastructure/realtime-events.md  infrastructure/background-work.md   only when the scan finds the concern
CLAUDE.md                          the Start-here stanza appended (created with only the stanza if absent)
AGENTS.md                          the same stanza, only when the file already exists
.claude/settings.json              the plugin pin merged in (never clobbers existing keys)
```

Eight folders, and the set is closed. Anything else already under `docs/` is left alone and reported as
"outside the loop's shape — not touched" — never an error, never a queue entry.

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
   the folder layout two deep · `git log --oneline -20` (the message convention) · a realtime library
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
2. `docs/_meta/docs-workflow.md` and `docs/_meta/engineering-loop.md` — byte copies of the pack's
   `references/*` (their first line is the version stamp; copy it with the file).
3. The five floor drafts from `templates/docs/patterns/*.md`, filled as below.
4. The conditional drafts — `state-management`, `ui-style-guide`, `realtime-events`, `background-work` —
   only where pass 3 found the concern.
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

1. the H1, the one-line blockquote ending `Last verified {today}.`, the `<!-- meta: … status=draft … -->`
   line, the `<!-- naswerks-loop: draft; scanned=… -->` line;
2. Overview, then Stack, then the shape (a tree copied from a REAL folder), then one section per
   concept in the micro-grammar *prose rule, a REAL example, `### Rules`, `### Gotcha:`*;
3. decision tables that decide, checklists whose items are real paths, a `Legacy (never use)` column
   where the repo has one;
4. exact commands in fenced blocks; identifiers in backticks;
5. `## Key Files`, `## Lineage`.

A section the scan can only half-fill says which half. A rule with no cited source is not written.

## doctor

`node ${CLAUDE_SKILL_DIR}/scripts/doctor.mjs [repo-root]` — the `scripts/` folder beside this SKILL.md;
Node 22 or later, no dependencies. It prints one row per thing the skills read and exits non-zero on any
FAIL, so a CI job or a control plane can call it.

| Row | FAIL | DEGRADE | ok |
|---|---|---|---|
| each of the eight folders | missing | README missing | present |
| `_meta/docs-workflow.md`, `_meta/engineering-loop.md` | missing, or no stamp on line 1 | stamp behind the pack's version | stamp equals it |
| `_meta/doc-index.md` and its three slot sections | missing | a slot carries only the absent-line | filled |
| the five floor docs | missing | `status=draft`, or an `<!-- init: -->` left in | `status=current` |
| the four conditional docs | — | `status=draft` when present | present and current, or absent |
| `CLAUDE.md` / `AGENTS.md` stanza · `.claude/settings.json` pin | — | missing | present |
| `verify-staged` | — | not on PATH (the row carries the fallback) | resolvable |
| every `docs/research/*/00-ignition-brief.md` | the five problems the control plane's parser emits (no `## The kick`; the kick has no blockquote; no `## The sequence`; the sequence holds no table; a row names no kind from `coordinator build fixit review retro witness docs-process`), or a spec a row names is missing from disk | — | clean |
| every `docs/working/*.md` | — | lacks `## Living Docs to Update` or `## Archive` | carries both |
| anything else under `docs/` | — | — | "outside the loop's shape — not touched" |

**If `node` is absent**, walk the same rows by hand with your file tools, in that order, and print the
same table: the checks are file existence, a first-line stamp, a heading grep, a `status=` read, and the
brief's two sections.

A repository fresh from `init` reads DEGRADE on every draft and ok on the shape. That is the intended
state: the owner promotes each draft to `status=current` as they confirm it, section by section.

## Notes

- `init` is the front door of the pack; `docs-status` is the pulse after it. Run `docs-status` once the
  drafts are promoted to see the queue the way a session will.
- The floor is always drafted, even in a repository with no frontend or no codegen — the reading floor
  must RESOLVE for every seat kind, and "No frontend detected — fill this in" is an honest doc.
- Counterpart skills: `spec-seat` (reads the floor), `spec-child` (reads the role rows), `spec-pipeline`
  (writes the brief `doctor` checks), `docs-write` / `docs-process` (the queue `doctor` reads).
