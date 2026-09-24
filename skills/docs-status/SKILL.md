---
name: docs-status
description: Read-only orientation at session start — what's recently archived, what's in progress in working/, and what ideas are waiting in research/. Use at session start or when the user asks for docs status, or runs docs-status.
---

# docs-status

A quick, read-only pulse of the docs pipeline. No files created. Report by name with context, not
just counts.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

## Steps

1. **`working/` — in flight.** List each doc in `docs/working/` with a one-line "what it's about /
   how far along." A folder's `README.md` is never a queue entry — skip it. These are active efforts; a non-empty queue means living docs may be going stale.

2. **`research/` — waiting ideas.** List each doc in `docs/research/` (and topic subfolders) by name
   with a one-line hook. This is the backlog of things to pick up next.

3. **Recently done.** List the most recently modified filed efforts in the archive home
   `docs/_meta/docs-workflow.md` § The archive convention (repository-owned) names (a handful, newest first)
   so the user can see what just shipped.

4. **Meta sweep — the condensed status table.** Run the sweep command `docs/_meta/docs-workflow.md` § Doc
   metadata (repository-owned) gives — it is spelled there for whichever header this repository writes.
   Parse each doc's status and verified date (and any other field that header carries) into a compact
   one-line-per-doc table (group by folder), in that section's status words. This is the headline pulse —
   richer than the old date-only scan. Read-only; do not write anything. Flag, in order of concern:
   - **missing header** — a living doc (`guides/ patterns/ infrastructure/ features/`) the sweep does not
     list. Read its verified date from wherever else the section says it may live, **prefer the header**,
     and list it as a gap to fill.
   - **stale** — a verified date older than ~14 days, a candidate for `docs-audit-feature` (the existing
     nudge; note the harder 90-day line the future `docs_freshness` tool will use).
   - **dead lineage** — where the section keeps `## Lineage`: a link whose target file no longer exists (a
     broken breadcrumb).
   - **low-lineage feature** — where the section keeps `## Lineage`: a feature doc with no Lineage rows =
     ungrounded; worth wiring its lineage.

5. **Open issues.** Grep living docs for an `## Open Issues` section; list which docs/features carry
   unresolved, code-verified problems (and how many) so known risks surface at orientation instead of
   rotting silently. These are candidates to fix, or to graduate into a `working/` effort.

6. **Recommend a next action, escalating by scale:**
   - Working queue non-empty: "process the working doc X" first.
   - Clear: "pick up research idea Y" (with a one-line why).
   - A few stale docs: `docs-audit-feature` on those specific docs.
   - **Many stale docs, or a long absence (~30+ days of no doc activity)**: recommend `docs-audit-full`
     to get a prioritized re-verify plan instead of one-off audits.

## Notes
- Output is a conversational summary only. There is no backlog doc and no release doc to read —
  `working/`, `research/`, and the archive home ARE the status.
