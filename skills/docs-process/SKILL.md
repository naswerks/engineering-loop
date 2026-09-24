---
name: docs-process
description: Patch the living docs from a session doc's "Living Docs to Update" checklist, verified against code. Use at the start of a session, when the user points at a working/archived session doc and asks to update the living docs, or run docs-process.
---

# docs-process

The **second** half of the bookend. Take a finished session doc (in `docs/working/`, or already filed
in its archive home) and bring the living docs up to current state.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

## Running as a pipeline row (`docs-process` seat)

Most of the time a human runs this cold, after a merge, and this section does not apply.

**When a pipeline arms you as its `docs-process` seat**, your contract is **`spec-seat`** — invoke it first if
you have not. It carries the blackboard, the question lane, the PLAN TLDR, the verdict vocabulary, the
six-section FINAL TLDR, and the close-out order. Two things are yours specifically:

- **You are handed a MANIFEST of this effort's working docs BY NAME. `docs/working/` is a SHARED QUEUE
  — never infer membership from the folder.** A seat that archives a neighbouring effort's docs cannot
  undo it. If your prompt did not name them, ask before you move anything.
- **Do NOT run `/docs-write`.** You are that skill's CONSUMER, never its caller — a working doc from you
  would be an orphan in the queue you just emptied, for an effort you just archived. Your artifacts are
  the patched living docs and the archive; go straight to the commit call.

**In-pipeline, your living-doc patches are contingent on the merge** — you verify against the pipeline's
branch, which is the truth for that PR, and you say so at close.

## Steps

1. **Read the session doc(s) for the effort** from `docs/working/` — that's where `docs-write` leaves
   them (it does not archive). A folder's `README.md` is never a queue entry. One effort may be a **SEQUENCE of working docs** across sessions (each
   `Builds on` the prior, all sharing one `Source:` research doc); treat the sequence as one unit. The
   combined **Living Docs to Update** sections are your checklist; the `## Archive` line names the archive
   home you'll file everything into in the last step. Run this when the effort is done (it's the
   finalizer) — mid-effort, just keep adding working docs and continue.

   **`docs/working/` is a SHARED QUEUE — it may hold other efforts' docs.** Invoked by hand you scope
   the effort yourself from the `Source:` / `Builds on` sequence. **Spawned as a pipeline seat you should have
   been handed the effort's working docs BY NAME, plus its archive target and its research/spec folder —
   if you were not, ask for the list rather than inferring membership from the folder.** Sweeping a
   neighbouring effort's docs into this archive is the failure this guards, and it is not reversible by
   the seat that does it.

   **If the effort was a spec pipeline, you have a SECOND input: `sessions/code-review.md`** — the review
   seat's outside look, filed beside `parent-retrospective.md`. Read both. **Every review finding gets a
   disposition, and the disposition is TOTAL:** a living-doc patch here · an existing fixit seat · a
   chartered follow-up · a new spec pipeline · or killed on record with the reason. **A finding with no named
   home is dropped, not deferred** — and the review's own classification (fixit candidate / deferred /
   documented / trivial) is its recommendation, not your ruling.

   **When you run as a seat INSIDE the pipeline** (before the PR merges) your living-doc patches describe
   code that is *about to* land. That is fine and deliberate — docs and code ride one PR instead of
   drifting — but say so in your summary: **the patches are contingent on the merge.** Verify against the
   pipeline branch's code, which is the truth for that PR.

2. **For each listed living doc** (in `guides/`, `patterns/`, `infrastructure/`, `features/`):
   - Read the living doc and the session doc's description of what changed.
   - **Patch the stale sections** — don't rewrite. Preserve everything still accurate.
   - **Verify against code** — open the actual source file for each claimed change. Code is truth.
   - **Leave the verified date alone.** You verified the *specific* checklist changes against
     code — but you did NOT re-read the whole doc against the whole codebase, and the verified date (wherever
     § Doc metadata (repository-owned) says it lives) is a *whole-doc* claim. Stamping it for a targeted patch
     (rename or substantive alike) overclaims and hides real staleness in the untouched sections from the next
     `docs-status` scan. That date is `docs-audit-feature`'s to set (it does the full doc-vs-code pass — see
     its anti-fabrication rule). **Exception:** a doc you *create from scratch* here by reading the code is
     verified-today by definition — set its date.
   - **Update the Key Files table** if files were renamed, created, or deleted.
   - **Write / update the header + `## Lineage`** — the header is the one `docs/_meta/docs-workflow.md`
     § Doc metadata (repository-owned) prescribes, in its words, and `## Lineage` is written where that
     section keeps it:
     - *Creating a doc from scratch* here: write the header at the word for `current`, its verified date
       today, **and** a `## Lineage` footer. You already know the `Source:` research doc (the `Idea` row), any
       spec pipeline (the `Spec` row), and the working-doc sequence / `## Archive` target (the `Built` row);
       derive `Related` from existing peer links. Compute any field the header derives from those links the
       way the section says. **Keep `Spec` and `Built` symmetric** — list **every per-slice spec that a
       `Built` session implemented** (the umbrella + `00-operating-frame` go in `Idea`, not `Spec`); a `Built`
       session whose spec is missing from `Spec` is the smell (the `## Lineage` rules § Doc metadata
       (repository-owned) gives).
     - *Patching an existing doc*: update the status if it changed and recompute any field the header
       derives; append any new `Built`/`Spec` rows for this effort. **Do NOT restamp the verified date** — same
       anti-fabrication rule as above (a targeted patch is not a whole-doc re-verify).
     - **Migrate `## Related Docs`.** If the doc still carries a `## Related Docs` section and the section
       keeps `## Lineage`, fold its links into the `## Lineage` `Related` row and remove the old section (the
       convention supersedes it).
   - **Flag code risks you spot.** If you notice a genuine bug / risk / tech-debt *outside* what you're
     documenting — while verifying against code, or as a still-unresolved item in the working doc's
     **Watch-Outs** — add a dated one-line bullet (with `file:line`) to that doc's `## Open Issues`
     section (create the section if absent). Only what you actually saw in the code this pass — never
     speculation. A sizable design idea goes to `docs-backlog` (research/) instead. `docs-status`
     surfaces these so they aren't lost.

3. **New feature?** If the work added a feature, ensure it has a doc in `docs/features/` (one doc per
   feature) and add it to the menu in `docs/_meta/doc-index.md` — unless `docs-workflow.md` § Doc metadata
   (repository-owned) says a repository tool generates the menu, in which case leave it alone.

4. **Closing grep** — if the session doc notes deletions or renames, grep all living
   docs (`guides/ patterns/ infrastructure/ features/ _meta/`) for stale references and fix them. Do
   NOT touch a filed doc — wherever § The archive convention (repository-owned) files them, they are frozen
   history.

5. **File the effort — research/spec docs AND working doc(s), together.** Now that the living docs are
   patched and verified, file the whole effort where `docs/_meta/docs-workflow.md` § The archive convention
   (repository-owned) says, in the shape it gives for this kind of effort (a small effort, a spec pipeline,
   a follow-on round). That section holds the destination, the shape and the links a move repairs; this
   step holds the procedure, which is the same everywhere. A pipeline whose umbrella carries an `Archive:`
   line files there.

   **FIRST, RECONCILE THE DESTINATIONS — `rg -A1 '^## Archive' <every working doc in the effort>`, plus
   the umbrella's `Archive:` line when there is a pipeline.**
   This step says *"one archive home"* and *"use the `## Archive` line"* — a singular read over a PLURAL
   source, so the set is checked before any move. **If the docs disagree, STOP and ask.** Do not pick the
   majority, do not pick the first, and do not pick the one you happen to be reading. The failure is not
   recoverable by you: one working doc naming a different, populated effort's home is enough to sweep
   this effort's docs into a neighbour's, and a filed effort is frozen history. No seat can see it
   alone — each wrote one working doc and each line is individually plausible; the divergence exists only
   in the SET, which is why the check belongs here and not upstream.
   - Move **every working doc** in the effort from `docs/working/` into that home, in the section's shape.
   - Move the **`Source:`** research/spec docs from `docs/research/` into the **same** home — the idea and
     the work that delivered it are filed together. Do NOT delete and do NOT leave in `research/` (that's
     what kept shipped ideas cluttering the running tab).
   - **`git mv` STAGES immediately** — in a shared working tree, another session's commit can silently sweep
     your staged renames. Commit promptly after the moves, or announce the staged state before yielding
     the tree.
   - **A `sessions/` folder moves wholesale and byte-untouched** — it is testimony, and no link repair
     reaches into it.
   - **Never file into a frozen effort.** An effort that continues one already filed (a follow-on round)
     goes where the section puts a follow-on — never inside the earlier round's home.
   - **Repair the links the move breaks** — the ones the section names (relative depths change), inside the
     effort and in the live feature doc that points at it. **Leave pre-existing cross-effort links** as
     historical record. Verify with a link-resolution pass before finishing.
   This clears both the `working/` queue and the research idea. After this the docs are frozen history.

6. **Summary** — list which living docs were updated, what changed in each, which source files you read
   to confirm accuracy, and where the session doc was filed.

## Notes
- Skip doc updates for pure bug fixes that restored behavior the doc already described correctly.
- `docs-write` leaves the doc in `working/`; **this skill is what files it** (step 5) — only after the
  living docs are current. That keeps `working/` an honest queue of unprocessed sessions.
- No releases/changelog step — git history covers that.
