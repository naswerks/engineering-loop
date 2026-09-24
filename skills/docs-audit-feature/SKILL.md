---
name: docs-audit-feature
description: Deep-audit one or more living docs (features, infrastructure, or patterns) against the actual code — write an audit report per doc and correct the doc. Use right after touching an area, when a doc is suspected stale, or run docs-audit-feature <doc-path...> (a single doc, a list, or a whole folder).
---

# docs-audit-feature

Verify living docs against the real implementation and correct them. Works on a single doc, a list of
docs, or a whole folder — in `docs/features/`, `docs/infrastructure/`, or `docs/patterns/`. This is
the one audit skill for "does this doc still match the code"; it produces both the **audit report**
and the **corrected living doc**.

> **The system:** `docs/_meta/doc-index.md` (the menu of living docs) + `docs/_meta/docs-workflow.md`
> (the loop, folders, templates) explain how the docs are organized. Skim them if you need to place a
> doc or find its siblings.

> **Audit direction depends on the doc type.** Descriptive docs (`infrastructure/`, `features/`) —
> **code is truth**: where they disagree, fix the doc. Prescriptive docs (`patterns/`, `guides/`) — the
> doc is the **decided rule**: audit whether the *code conforms to the doc*; a mismatch is usually a
> code problem to flag (or a convention to confirm), **not** a doc to rewrite — only edit the doc if the
> rule itself genuinely changed.

**One doc or many.** Pass a single doc, a group, or a folder — e.g.
`docs-audit-feature auth signalr postgres` or `docs-audit-feature docs/features/`. Apply the Steps
below to **each doc in turn** — one full read, verify, report, fix pass per doc, never batching the
writes across docs. End with a one-line-per-doc summary (stale-count / added-count / clean).

## Steps (per doc)

1. **Read the living doc** (`docs/features/{x}.md`, `docs/infrastructure/{x}.md`, or
   `docs/patterns/{x}.md`).

2. **Read the corresponding code** — the backend `Features/{Feature}/` slice and matching frontend
   feature folder for feature docs; the relevant subsystem for infrastructure/pattern docs. Confirm
   entities, endpoints, stores, routes, services, config, key files.

3. **Check against conventions** — cross-check the doc's claims against `docs/patterns/` (and
   `docs/infrastructure/` where relevant) so the doc matches how things are actually built.

4. **Report findings** — write a short audit report to `docs/archive/audit/{group}/{doc-name}-audit.md`,
   where `{group}` mirrors the living doc's folder (`guides/`, `patterns/`, `infrastructure/`, or
   `features/`; create the subfolder if absent). Date in header: what was accurate, what was stale,
   what's undocumented, and any **code risks / bugs / tech-debt** you noticed against the source.
   (The master `health-report-*.md` from `docs-audit-full` stays at the `audit/` root — it's cross-cutting.)

5. **Update the living doc** with the corrections and bump its "Last verified" date — **and refresh the
   machine header in lockstep** (the one `docs/_meta/docs-workflow.md` § Doc metadata (repository-owned)
   prescribes: its verified date = today, its status, `lineage=N` recomputed). This is
   allowed here only because you just did the full doc-vs-code pass; the meta `verified` obeys the same
   anti-fabrication rule as the blockquote date (the two always move together). **Verify the `## Lineage`
   footer** — check every link resolves; flag any dead breadcrumb into `## Open Issues` (or the audit report)
   and recompute `lineage=N` to match. **Soft-check `Spec` / `Built` symmetry** — for a spec-driven feature, a
`Built` session whose per-slice spec is absent from `Spec` (or vice-versa) is usually an under-scoped row;
note it and complete it *unless* the doc is deliberately scoped tighter than the effort (judgment, not a hard
fail — see the Lineage rules in `docs-workflow.md`). **Reconcile its `## Open Issues` section** — add any real, code-verified
   risk/bug/tech-debt you found (dated, with `file:line`), and remove any listed issue the code now resolves.
   (The archived report is the history; `## Open Issues` is the live signal `docs-status` reads.)

## When auditing a whole folder (optional completeness pass)

If pointed at a folder rather than named docs, first **list it and diff against the code** so nothing
is missed:
- **In code, no doc**: a real feature/subsystem with no living doc. Create the doc (Steps 1-5 against
  the code), or at minimum flag it in the summary.
- **Doc, no code**: the thing it documents is gone. Flag for archiving/deleting the doc.
- **Both exist**: run the per-doc audit above.

For `docs/features/`, the folder (one doc per feature) IS the inventory — there is no separate
catalog. Build the real list from `Features/` + the frontend feature folders/routes via actual
`ls`/`find` output in this run, then diff.

## Anti-fabrication rule

- **Read the code before you write a word of the doc or report.** Steps 1-3 (read doc, read code,
  check conventions) must complete and their output be visible before step 4/5 write anything. Never
  batch the write with the reads.
- **Every claim traces to a file you opened in this run** — entity names, endpoints, routes, key
  files, line references. No identifiers or dates from memory. When listing a folder, build the
  feature/doc lists from real `ls`/`find` output, not memory.
- Only stamp **"Last verified: <today>"** on a doc you actually checked against code in this run.
  Stamping a date you didn't verify is the exact failure this rule exists to prevent.
- The header's verified date (whatever `docs-workflow.md` § Doc metadata (repository-owned) calls it) is
  bound by the **same** rule and always equals the blockquote's `Last verified` — refresh it, the status
  and `lineage=N` only after the full doc-vs-code pass this run.

## Notes
- **Descriptive docs (`infrastructure/`, `features/`):** code is truth — where doc and code disagree,
  the code wins, fix the doc. **Prescriptive docs (`patterns/`, `guides/`):** the doc is the decided
  rule — a mismatch usually means the *code* should change (flag it); only edit the doc if the rule
  itself changed.
