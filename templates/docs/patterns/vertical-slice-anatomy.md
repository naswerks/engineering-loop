# Vertical Slice Anatomy

> Where to place each piece when building a feature in this repository. Last verified {today}.
<!-- meta: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Feature structure

<!-- init: scan — the folder layout two deep for every stack (Features/, src/app/, apps/*, packages/*,
     cmd/, internal/, lib/), and ONE existing feature per stack.
     fill — one ASCII tree per stack showing a REAL feature as it exists, side by side when there are
     two, with a comment per folder saying what goes there; then one sentence per stack on what lives
     OUTSIDE a feature (shared infrastructure, cross-cutting stores).
     absent — "No feature layout detected — fill this in: where a feature's files go, per stack, as a
     tree copied from a real one." -->

```
{stack A}                                 {stack B, if any}
{root}/{Feature}/                         {root}/{feature}/
  ...                                       ...
```

## The kinds of file, and their roles

<!-- init: scan — the kinds the trees above show (endpoint / model / query / service; page / component /
     store; command / handler).
     fill — a table `Kind | Role | Where | Owns` with one row per kind.
     absent — "No kinds detected — fill this in: each kind of file a feature holds, and what it owns." -->

| Kind | Role | Where | Owns |
|------|------|-------|------|

## Checklist: new feature

<!-- init: scan — the trees above, the registration points (composition root, router, module list), the
     test conventions in patterns/testing.md § What to test where.
     fill — an ordered `- [ ]` checklist per stack: create X in {path} (one line on what it must extend
     or implement), register it in {file}, add the route/handler in {file}, add the tests the testing doc
     names for each kind, run the build. Each item is a real path.
     absent — "- [ ] No feature layout detected — fill this in: the ordered steps that add a feature,
     each naming its file." -->

### {stack A}

- [ ]

### {stack B}

- [ ]

## Gotchas

<!-- init: scan — CONTRIBUTING.md, CLAUDE.md, AGENTS.md, lint rules that fire on layout (import
     boundaries, dependency-cruiser, ArchUnit-style rules).
     fill — one `### Gotcha:` per written-down layout rule, citing its source file.
     absent — "No layout gotchas written down yet — fill this in the first time one bites." -->

## Lineage
- **Related** — [backend-patterns](backend-patterns.md) · [frontend-patterns](frontend-patterns.md) · [testing](testing.md)
