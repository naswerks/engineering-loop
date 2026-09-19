---
name: docs-backlog
description: Capture an idea, improvement, or future-state design as a research doc in docs/research/. Use when the user has thoughts/ideas to park for later, wants to capture research, or runs docs-backlog.
---

# docs-backlog

Capture ideas as research docs. `docs/research/` is the idea inbox — the folder itself is the queue.

## Steps

1. **Scan existing research titles** in `docs/research/` — quick check for an obvious duplicate or a
   doc this should extend instead of duplicate.

2. **For each idea, create a research doc** at `docs/research/{topic}.md` using the research-doc
   template in `docs/_meta/docs-workflow.md`: Current State, Desired End State, Design Options /
   Recommendation, Open Questions. Capture the idea while it's fresh — verify "Current State" against
   code if quick, otherwise note it's unverified.

   **The research doc must be self-contained.** It's the durable jump-off point; assume everything else
   from this session disappears. Inline the substance — plans, code sketches, config, command output,
   findings — directly into the doc. Do **not** point at ephemeral artifacts as the source of truth: a
   scratch plan file (`~/.claude/plans/*`), a chat transcript, a subagent's report, a temp file, or
   "see the plan above." Those vanish; the research doc stays. Cross-links to *other durable docs*
   (living docs, sibling research docs) are fine — links to throwaway state are not. If the idea came
   from a plan or long exploration, copy the load-bearing content in (an Appendix is fine) rather than
   referencing where it lived.

3. **Output**: new research doc(s) only.

## Notes
- Does NOT create working docs, patch living docs, or archive anything. Research docs are the output.
- **Self-contained or it failed its job.** Before finishing, reread the doc and strip any reference that
  makes it depend on something that won't survive the session (plan-file paths, "the plan I just made",
  transcript/tool-output you didn't inline). If you mention an artifact, its content must already be in
  the doc.
- When an idea is later picked up and built, link it via the session doc's **Source** field. The
  research doc **stays in `research/` through the build** (it's the running tab, and a build may span
  several sessions / working docs). When the effort finishes, `docs-process` archives the research doc
  **alongside its working doc(s)** in the same `archive/{topic}/` folder — research and the work that
  delivered it are filed together, not deleted.
