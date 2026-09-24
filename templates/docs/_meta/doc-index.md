# Doc Index

> The menu. Read this at session start, pick the 2-3 docs that match your task, read those for context.
> This is the curated short list — the compiled layer you read *before* diving into source.
<!-- naswerks-loop: menu=all -->
<!-- init: the shape line above stays in the output. It says menu=all unless the scan found an index the
     repository already keeps of every doc (a docs/INDEX.md or docs/index.md that lists them, a
     docs/SUMMARY.md, a mkdocs.yml nav, a docusaurus or vitepress sidebar); then it says
     menu=curated; index={that path}, and the tables below list only the docs init drafted plus the Meta
     rows. The owner adds each further doc that meets the loop's standard. -->

---

<!-- init: this file is written LAST, from the docs that exist under the four living folders after every
     other write. One row per doc; the `When to read` cell is a bold hook plus the ONE question only that
     doc answers. A doc the repo already owned (not drafted by init) is listed too, from its own blockquote.
     A drafted doc's hook ends with "(draft — scanned, not decided)". An empty folder keeps its table with
     the single row "| (none yet) | this folder holds … |". -->

## Guides — how to ADD a new thing (step-by-step walkthroughs)

| Doc | When to read |
|-----|-------------|
| (none yet) | this folder holds step-by-step walkthroughs for adding a new kind of thing; `docs-process` files the first one |

## Patterns — conventions to FOLLOW when writing code

| Doc | When to read |
|-----|-------------|
| [code-organization](../patterns/code-organization.md) | **Where the code lives and where a new piece goes** — the folder shape as it is, per stack, and the add-a-feature checklist |
| [backend-patterns](../patterns/backend-patterns.md) | **How the server side is built here** — data layer, API layer, write paths, registration |
| [frontend-patterns](../patterns/frontend-patterns.md) | **How the client side is built here** — architecture rules, component kinds and files, state, styling |
| [testing](../patterns/testing.md) | **How to write and RUN the suites** — the lanes and their exact commands, the run protocol, what to test where, the controls discipline |
<!-- init: add rows for codegen, state-management, ui-style-guide, design-tokens and long-running-workflows when they were drafted; the hook for each ends "(draft — scanned, not decided)". -->

## Infrastructure — what runs UNDER THE HOOD

| Doc | When to read |
|-----|-------------|
<!-- init: add rows for realtime-events and background-work when they were drafted; else the (none yet) row. -->

## Features — what EXISTS (one doc per feature)

| Doc | When to read |
|-----|-------------|
| (none yet) | one doc per feature, born from `docs-process` after code ships |

## Meta — how the docs system itself works

| Doc | When to read |
|-----|-------------|
| [docs-workflow](docs-workflow.md) | The loop, folder rules, templates (the doc header + `## Lineage` footer convention, the sections marked repository-owned, and the spec-doc template), the `docs-*` knowledge-loop + `spec-*` execution-loop skills — read before running `docs-write` / `docs-process` / `spec-pipeline` |
| [engineering-loop](engineering-loop.md) | The quick intro to how work gets built: the two loops (`docs-*` knowledge / `spec-*` execution, both hand-crankable), the seats, the ceremony, the blackboard + the question lane, and where a rule lives (policy / procedure / task) |

## Role reading lists

The docs a build seat reads on top of the floor every seat reads (`spec-seat` Step 0). The `spec-child`
skill names the loop's standard docs by path; this table is the repository's reserved space — one row per
doc, saying which roles read it. The coordinator copies a role's rows into every seat's seed as
`EXTRA DOCS`, so a seat sees paths, not this index. Add a row for any doc of your own a role should read;
add a role column if your seats have kinds the loop does not ship.

| Doc | What it gives the seat | backend | frontend | mixed |
|---|---|---|---|---|
<!-- init: one row per standard doc the scan found evidence for and drafted (codegen, state-management,
     ui-style-guide, design-tokens, realtime-events, background-work, long-running-workflows), with the
     roles that read it marked `x` (realtime-events: backend + frontend; state-management, ui-style-guide,
     design-tokens: frontend; background-work, long-running-workflows: backend; codegen: any seat that
     touches a generated folder). One row per standard doc NOT drafted, in the form
     "| `patterns/state-management.md` | not detected — no state library found | | | |" so a seat that
     meets the absent path knows why. `mixed` reads the rows for the surfaces its spec touches. -->
<!-- repo rows go here: a doc this repository has that the loop's standard set does not name -->

## Apps and their build commands

One row per application root. A seat `cd`s into the app it touched and runs THAT app's commands — the
wrong app builds green.

| App | Path | Test | Production build |
|-----|------|------|------------------|
<!-- init: scan — angular.json projects, apps/*, packages/* with a build script, web/* and services/* under src/,
     a *.csproj that is an executable; the test and build commands from each root's own scripts or the
     solution. fill — one row per app, commands verbatim. absent — "| (none detected) | fill this in: each app
     root, its test command, its production build command | | |" -->

## The evidence tools

Scripts that make a claim checkable. Each one exists because a green run once meant nothing.

| Script | What it proves | Read with |
|---|---|---|
| `verify-staged` (the loop pack's bin) | The staged list matches the list you meant to stage — `git add` drops ignored paths with exit 0 and no output. It validates the list it is GIVEN, never that list's completeness: pair it with `git diff --name-only` and `git ls-files --others --exclude-standard` | [testing](../patterns/testing.md) § The run protocol |
<!-- init: scan — scripts/ files with a .SYNOPSIS or a header comment that names what they check.
     fill — one row each. absent — leave the verify-staged row alone. -->

---

> **Other folders:** `research/` = the running tab of ideas (future-state, not built; archived *with* its
> working docs when shipped). `working/` = in-flight session docs / handoffs (one effort may chain several).
> `archive/` = completed efforts grouped by topic — research + working docs filed together (frozen history).
<!-- init: if docs/ held files or folders outside the loop's eight before init ran, list them here in one
     line each as "repo-owned, outside the loop's shape" so a reader knows they were seen and left alone. -->
