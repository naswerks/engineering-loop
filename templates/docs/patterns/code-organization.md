# Code Organization

> Where the code lives and where a new piece goes — the folder shape this repository actually uses, per
> stack, and the checklist for adding a feature to it. Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at its draft status. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## The shape

<!-- init: scan — the folder layout two deep for every stack (Features/, src/app/, apps/*, packages/*,
     cmd/, internal/, lib/, a layered src/{Domain,Application,Infrastructure}), and ONE existing feature or
     module per stack.
     fill — name the organization as it IS (vertical slices, layers, packages in a monorepo, a flat
     module tree — whatever the folders say), then one ASCII tree per stack showing a REAL feature/module
     as it exists, side by side when there are two, with a comment per folder saying what goes there; then
     one sentence per stack on what lives OUTSIDE a feature (shared infrastructure, cross-cutting code).
     Do not describe a pattern the folders do not show.
     absent — "No code layout detected — fill this in: where a feature's or module's files go, per
     stack, as a tree copied from a real one." -->

```
{stack A}                                 {stack B, if any}
{root}/{Feature}/                         {root}/{feature}/
  ...                                       ...
```

## The kinds of file, and their roles

<!-- init: scan — the kinds the trees above show (endpoint / model / query / service; page / component /
     store; command / handler; a module's public surface).
     fill — a table `Kind | Role | Where | Owns` with one row per kind.
     absent — "No kinds detected — fill this in: each kind of file a feature holds, and what it owns." -->

| Kind | Role | Where | Owns |
|------|------|-------|------|

## Checklist: adding a feature

<!-- init: scan — the trees above, the registration points (composition root, router, module list), the
     test conventions in patterns/testing.md § What to test where.
     fill — an ordered `- [ ]` checklist per stack: create X in {path} (one line on what it must extend
     or implement), register it in {file}, add the route/handler in {file}, add the tests the testing doc
     names for each kind, run the build. Each item is a real path.
     absent — "- [ ] No layout detected — fill this in: the ordered steps that add a feature, each naming
     its file." -->

### {stack A}

- [ ]

### {stack B}

- [ ]

## Gotchas

<!-- init: scan — CONTRIBUTING.md, CLAUDE.md, AGENTS.md, lint rules that fire on layout (import
     boundaries, dependency-cruiser, ArchUnit-style rules, banned-symbol lists).
     fill — one `### Gotcha:` per written-down layout rule, citing its source file.
     absent — "No layout gotchas written down yet — fill this in the first time one bites." -->

## Lineage
- **Related** — [backend-patterns](backend-patterns.md) · [frontend-patterns](frontend-patterns.md) · [testing](testing.md)
