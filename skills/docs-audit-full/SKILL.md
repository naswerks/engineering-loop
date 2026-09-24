---
name: docs-audit-full
description: Master health check across all docs — staleness/age scan, convention spot-checks, research that looks resolved — producing a prioritized re-verify plan. Use monthly, after an extended absence, or run docs-audit-full.
---

# docs-audit-full

A deep-clean sweep. Does NOT re-audit every feature in depth — it produces the prioritized plan of
what to audit next.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

## Steps

1. **Freshness scan** — read the verified dates across all living docs (`guides/ patterns/
   infrastructure/ features/`), wherever `docs/_meta/docs-workflow.md` § Doc metadata (repository-owned)
   says that date lives (its sweep command reads them all at once). Flag anything older than ~14 days; sort
   oldest-first.

2. **Feature completeness** — quick `docs/features/` folder pass (per `docs-audit-feature`'s
   folder mode): any features in code with no doc, or docs whose feature is gone. Then the menu against its
   shape line (`rg -n 'naswerks-loop: menu=' docs/_meta/doc-index.md`; none means `menu=all`): on
   `menu=all`, living docs it does not name; on `menu=curated`, docs it names that fall short of the loop's
   standard (`docs/_meta/docs-workflow.md` § The repository-owned sections).

3. **Convention spot-check** — sample 2-3 source files per major convention against the
   `docs/patterns/` docs; note drift.

4. **Research scan** — scan `docs/research/`; flag ideas that look already-implemented (so they can be
   graduated/removed) and ideas worth surfacing.

5. **Working/archive sanity** — note any docs lingering in `docs/working/` that look done (should be
   filed via `docs-process`), and confirm the filed efforts are intact where § The archive convention
   (repository-owned) puts them.

6. **Read the previous report first.** Before writing anything, find the most recent health report —
   where § The archive convention (repository-owned) files audit reports — and read it in full. The new
   report continues from it: note what was flagged last time and is now fixed, what's still outstanding,
   and anything that regressed. If there is **no** prior report, say so — this run is the baseline.

7. **Produce a health report** — `health-report-{date}.md`, beside the previous one — with a prioritized,
   actionable list (which `docs-audit-feature` runs, which docs to re-verify, which research to clear).
   Open with a **"Since last report"** section that diffs against the report from step 6 (or marks this
   as the baseline if none existed).

## Anti-fabrication rule (read before writing the report)

The report is a **pure function of the scan output above it**. Fabricated dates, feature lists, and
counts are the main failure mode of this skill.

- **Gather first, write last.** Run ALL of steps 1-6 and SEE their output before you create the
  report file. Never put the report `Write` in the same batch as the commands that feed it — they run
  together, so the report would be written from memory, not data.
- **Every factual cell traces to a command in THIS run.** Dates, file names, feature names, counts —
  if you can't point at the tool output that produced it, it does not go in the report.
- **No identifiers from memory.** Feature names, endpoint names, and dates must come from a fresh read
  of the tree in this run, not from recollection of the codebase or earlier-session summaries.
- If a scan didn't run or its output is unclear, say "not verified" — never guess a plausible value.

## Notes
- Output is a plan + report, not a mass edit. Run the recommended `docs-audit-feature` / `docs-process`
  actions separately.
