---
name: docs-write
description: Finalize the working doc at the end of an implementation session and leave it in docs/working/ as the queue for docs-process to patch + file. Use at the end of a coding session, when the user says to write up the work, document the session, book-end it, or run docs-write.
---

# docs-write

Capture an implementation session into a finished session doc that **stays in `docs/working/`** as the
queue for `docs-process`. This is the **first** half of the bookend — it does NOT patch living docs and
does NOT archive. Both happen in `docs-process`, once the living docs are patched and verified against
code. Leaving the doc in `working/` is what makes `working/` a real queue (`docs-status` reads it) and
keeps the doc editable until its living-doc obligations are discharged.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

## Steps

1. **Review what happened** — prefer conversation memory (you just did the work). Use `git diff --stat` only as a fallback to confirm file paths.

2. **Write/finish the working doc.** If a doc for this effort already exists in `docs/working/`, finish it; otherwise create `docs/working/{topic}-{description}.md`. Use the session-doc template in `docs/_meta/docs-workflow.md`. Required sections:
   - Title + one-line summary; completion date; branch
   - **Header** — the machine header `docs/_meta/docs-workflow.md` § Doc metadata (repository-owned) prescribes, in that section's own words: the doc's type is working, its status the word for `wip` while the effort continues or the word for `shipped` on its last session, its verified date today, and any field that section derives (a count of the doc's provenance links, say) computed the way it says.
   - **Session-comment** — next line: `<!-- session: claude-session-id={the harness's session id} -->` (Claude Code: `$CLAUDE_CODE_SESSION_ID` / `$env:CLAUDE_CODE_SESSION_ID`). Applies to EVERY session that writes a working doc — solo sessions with no pipeline, no coordinator, and no research doc included; the id alone is the point. Append `; name={...}` only when the session actually has a human-given window name (pipeline seats do; most solo sessions won't — omit it, never invent one). The harness's transcript store is ephemeral (a retention window, and the format moves between releases); this line is the durable link from the work to its conversation, so audit-grade sessions can be found later.
   - **Builds on** — if this continues prior work, link the prior doc: `Builds on [prior](prior.md)`
   - **Source** — if idea-driven, link the `research/` doc
   - **The Problem** / **The Target**
   - **Research & Decisions** — options, verdicts, rationale (table). Write this for **future us**: capture **what we actually did vs. what we set out to do** (where the plan changed and why), **what we tried that didn't work** (dead-ends, gotchas, abandoned approaches — so nobody re-walks them), and **every decision we made** with its reasoning. The point of a session doc is the narrative a later session can't reconstruct from the diff: the diff shows the final state, not the choices or the things that failed on the way there.
   - **Implementation** — what changed, before/after where useful
   - **Change shape** — orientation, NOT a file-by-file inventory (the commit is the inventory). Name the key new/moved pieces and the structural facts a later session needs; defer the full list to the commit. A file-by-file dump makes the doc read like a review.
   - **Verification** — build/test results; what's tested, what isn't
   - **Watch-Outs** — edge cases, gotchas
   - **Living Docs to Update** — the bridge to `docs-process`. For each stale living doc, name it and say what changed and in what form. Be specific ("references `OldEntity`, should be `NewEntity`"), not vague.

3. **Record the archive target — don't move the file.** Add an `## Archive` line to the doc, in the form the session template gives it (`docs/_meta/docs-workflow.md` § Templates (repository-owned)), naming where § The archive convention (repository-owned) files this effort — reuse what that section says to reuse, and name it the way that section names things. When the effort has a spec pipeline whose umbrella carries an `Archive:` line, that path is the target. `docs-process` files it there later. The doc itself **stays in `docs/working/`**.

4. **Stop.** The finished doc sits in `docs/working/` as the queue. Do NOT patch living docs, do NOT grep for stale references, do NOT file it — all of that is `docs-process`.

## Notes
- **Provenance carries into the living docs.** The `Source:` (research) and `Builds on` (prior working) links
  in the blockquote already *are* lineage edges — at `docs-process` time they populate the living doc's
  `## Lineage` (`Idea` / `Built` rows), where § Doc metadata (repository-owned) keeps that footer. Optionally
  also render a `## Lineage` block in the working doc itself for symmetry, but the blockquote links are the
  load-bearing record.
- **Write for future us, not for review.** Record **what we did vs. what we thought we were going to do**, **what we tried that didn't work**, and **the decisions we made (and why)**. Those three are the load-bearing content — the commit already captures the final file state; the doc captures the reasoning, the reversals, and the dead-ends so the next session doesn't repeat them.
- The doc becomes frozen history only when `docs-process` files it into its archive home (after the living docs are patched). Until then it's editable in `working/`.
- If the work was pure research/exploration with no code change, use `docs-backlog` instead.
