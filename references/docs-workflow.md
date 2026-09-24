<!-- naswerks-loop: version=0.4.0 -->
# Docs Workflow

> How knowledge flows through `docs/`: the loop, the folder rules, the templates, and the `docs-*` skills.
> For the menu of what to read, see [doc-index.md](doc-index.md).

---

## The Loop

```
research/          the running tab of ideas to do — search a topic, file it     (docs-backlog)
   |  pick one up: plan + implement
working/           per-session handoff doc(s). A multi-session effort chains several —
                   each `Builds on` the last, all tagged `Source:` the research doc
   |  docs-write at each session's end — doc(s) STAY in working/ (the queue)
docs-process       finalizer (effort done): patch living docs, then archive the
                   research doc + ALL its working docs together into archive/{topic}/
   |
living docs        guides/ · patterns/ · infrastructure/ · features/  (current state)
```

A research doc is the *running tab*: it stays in `research/` through the build — which may take several
sessions and several chained working docs — and is archived **with** its working docs when the effort
finishes, so the idea and the work that delivered it land in the same `archive/{topic}/` folder.

`docs-write` runs at each session's end while context is fresh; it records the archive target (an
`## Archive` line) but **moves nothing** — that keeps `working/` an honest queue. `docs-process` is the
**finalizer**, run once the effort is done: it patches the living docs (the working docs' **Living Docs
to Update** checklists are the bridge), then files the research doc + the whole working-doc chain into
`archive/`. Releases/changelogs are **not** tracked here — git history covers that.

Splitting `write` from `process` is deliberate (the two-session boundary): `process` runs later, with
**fresh eyes**, and verifies every claim against the actual code rather than trusting the just-written
narrative. That's also why it's a separate session, not the tail of the implementation one.

---

## Folders

| Folder | What it holds | Lifecycle |
|--------|---------------|-----------|
| `_meta/` | This system — `doc-index` (the menu) + `docs-workflow` (this file) + `engineering-loop` (the seats and the ceremony) | Maintained as the system evolves; the sections marked **(repository-owned)** are rewritten by each repository to its own conventions |
| `research/` | The running tab of ideas to do, not yet built. The folder is the queue. | Created by `docs-backlog`; stays through the build, then **archived with its working doc(s)** by `docs-process` |
| `working/` | Active + finished-but-unprocessed session docs (one effort may chain several). The folder is the queue. | **Leaves via `docs-process`** — research + the whole chain archived together once the living docs are patched |
| `archive/` | Completed/abandoned session docs, grouped into **topic** folders (or the home "The archive convention" below names for them) | Write-once. Frozen history — never edit archived docs |
| `guides/` | How to ADD a new thing — step-by-step walkthroughs | Living — patched by `docs-process` |
| `patterns/` | Conventions to FOLLOW when writing code | Living — patched by `docs-process` |
| `infrastructure/` | What runs under the hood (technologies/plumbing) | Living — patched by `docs-process` |
| `features/` | What exists — one doc per feature | Living — patched by `docs-process`, audited vs code |

**Living docs vs session docs:** living docs describe what exists NOW (overwritten with current
state). Session docs describe how we got there (written once, then frozen in `archive/`).

**Two kinds of living doc — opposite truth sources.** Prescriptive docs (`patterns/`, `guides/`)
answer *"how should I?"* — they're rules you decided, so **truth is by decision** and code should
*conform* to them; they can exist before the code does. Descriptive docs (`infrastructure/`,
`features/`) answer *"how did we?"* — born from `docs-process` after code ships, so **code is truth**
and they're verified against source. This flips the audit direction: for a descriptive doc you fix the
doc to match code; for a prescriptive doc you check whether the *code* matches the doc — and a mismatch
is usually a code problem to flag, not a doc to rewrite (unless the rule itself deliberately changed).

---

## The repository-owned sections

This file and [engineering-loop](engineering-loop.md) state one way of running the loop, and they are
opinionated on purpose. Where a repository's conventions differ, they differ in four places only — the
sections whose heading ends **(repository-owned)**. Each one declares this repository's preference for one
thing; another repository **keeps the heading and replaces the body** in its `docs/_meta/` copy, in its own
words. Every other section is the loop and reads the same everywhere. One grep lists the four, with their
line numbers; each runs to the next `## ` heading:

```
rg -n '^#+ .*\(repository-owned\)' docs/_meta/
```

**The skills read these sections and never restate them.** A skill names the section and the thing it
needs from it — *the header § Doc metadata prescribes*, *the archive home § The archive convention names*,
*the base branch § This repository's rails names* — and takes the value from this repository's copy. What
each section answers, and where the two method docs echo the preference in passing (the lines a repository
that replaces the section rewrites alongside it):

| Section | What the skills read from it | Also echoed in |
|---------|------------------------------|----------------|
| **The archive convention** (this file) | the archive home for each kind of effort (hand-cranked, spec pipeline, follow-on round) and for audit reports · the shape inside it · what a working doc's `## Archive` line says, and whether an umbrella carries an `Archive:` line · the links a move repairs · what is frozen once filed | The Loop (the diagram and its prose) · Folders (`research/`, `working/`, `archive/`) · "Living docs vs session docs" · the skills table (`docs-process`) · Conventions (incident receipts, archived docs) · `engineering-loop.md` "The loop at a glance" |
| **Doc metadata** (this file) | the header — its form and its place · the sweep: one command, one line per doc · the word for each loop state (below) · where the verified date lives, and the rule that moves it · whether `## Lineage` stays · the gates a doc passes, and the folders they exempt · whether `doc-index.md` is kept by hand or generated | the skills table (`docs-status`) · Conventions (the machine layer; dates in the header) · `engineering-loop.md`'s own header line and its `## Lineage` |
| **Templates** (this file) | each template's header lines, at the state its writer names | — |
| **This repository's rails** (`engineering-loop.md`) | the policy document, and how a seat reaches it · the gates a commit passes · the suite before a PR · the base branch, the PR target, the branch names and how a PR is opened · the staging rule · the repository's own skills a seat meets | the POLICY row of "Where a rule lives" · the Hard rules, which the rails add to and never subtract from |

**The loop's states.** The skills speak in four states, and § Doc metadata says which word this repository
writes for each.

| State | Written by | Means |
|-------|------------|-------|
| `draft` | `init`, `spec-pipeline`, `docs-backlog` | scanned or authored, not yet decided or verified |
| `wip` | `docs-write` mid-effort, the pipeline's tracker | in progress |
| `current` | `docs-process` for a doc it creates, `docs-audit-feature` | describes the code as it is |
| `shipped` | `docs-write` for an effort's last session, `spec-review`'s report | finished — frozen once filed |

*Stale* is a date, not a state: `docs-status` computes it from the verified date, and no seat writes it.

**Silence.** A section that says nothing about an item leaves the loop's default: the menu is kept by hand
(`docs-process` adds a row for a new feature doc), no gate runs on a commit, the base branch is the remote's
default (`git symbolic-ref refs/remotes/origin/HEAD`), and a seat with no PR route asks the human once and
suggests recording the answer in the rails. Any other unanswered item is a question for the human, never a
guess.

### Replacing a section

Keep what the skills need to find, change the words to yours:
- **The header and how to sweep it.** Name the fields (a status, a verified date, a type) and where they
  live, and give the one command `docs-status` runs to list every doc's status in one line each. For the
  loop's own header that command is `rg -o '<!-- meta:.*-->' docs/`; for a frontmatter convention it is a
  grep over the keys.
- **The status words.** Say which word of yours a seat writes for each loop state above, in one line — *"a
  seat that would write `current` or `shipped` writes `stable`; `wip` and `draft` are `draft`"*. `draft` is
  the one word `init doctor` looks for, in either header form.
- **What the verified date means.** It moves only when a doc is checked against code in that run, whatever
  it is called; state the rule in your words so the anti-fabrication rule survives the rename.
- **Whether `## Lineage` stays.** It is the footer that carries Idea, Spec, Built and Related; a repository
  whose own tooling derives that graph may drop it and say so.
- **Your gates.** Name the validator or index a commit must pass, and which of the loop's folders it
  exempts. The loop's session folders (`research/`, `working/`, `archive/`) hold breadcrumbs, not living
  docs, and are the usual exemption.
- **Your archive home.** A repository whose living docs already have a home for an effort's history (a
  feature's own folder, say) may file a spec pipeline **as one package** into that home: nothing is
  re-sorted, every file keeps its name and its place, `sessions/` rides along untouched, and the effort's
  working docs join the package under `implementation/`, with the tracker still the "read me first" at its
  root. When where a pipeline files depends on something only its authoring session knows, say so —
  `spec-pipeline` then records the resolved path in the umbrella's blockquote as an `Archive:` line.
- **Your rails.** Fill each item of `engineering-loop.md` § This repository's rails from what the
  repository already wrote down — a policy document, hooks, CI, a pull-request template.

**The version stamp** on line 1 names the pack version whose repository-owned sections this copy carries.
The loop text around them is this repository's copy from whenever it was taken: `init doctor` never grades
it, and `init refresh` never touches it — refresh adds a section or a rails item a newer pack reads, and
restamps.

---

## The archive convention (repository-owned)

> **Repository-owned.** This section says where a finished effort is filed and in what shape. A
> repository whose living docs already have a home for an effort's history rewrites it in its
> `docs/_meta/` copy; every skill that files a doc reads this copy, never its own text.
> [The repository-owned sections](#the-repository-owned-sections) lists what it must answer.

A multi-session effort becomes a **topic folder** under `archive/` (e.g. `archive/{topic}/`).
Docs are **not numbered** — they use descriptive names and chain via a header link:

```markdown
# GraphRAG Hardening — Part 2

> {One-line summary}. Builds on [{prior}]({prior}.md).
> Completed {date} on branch `{branch}`.
```

Each archived doc carries the full narrative: Research & Decisions (the plan), Implementation,
Change shape, Verification, Watch-Outs. The chain (`Builds on …`) is how a reader replays the
effort across sessions.

If the effort began as a research idea, its **research doc is filed into the same topic folder** by
`docs-process` — so the topic folder holds the original idea plus the working-doc chain that delivered
it, the complete arc from "thing we'd like to do" to "done."

### Two topic-folder shapes (flat vs. spec-driven split)

**There is always a working doc; a spec pipeline is added only when the work is large enough to plan as
one** (via `spec-pipeline`). The trigger for the layout is simply *"does this effort have a spec pipeline?"*:

- **Flat (no specs)** — the default. A small/single-session effort is just its working doc(s) (plus
  any `Source:` research doc) at the topic-folder root, chained by `Builds on`. This is how the legacy
  topic folders look.
- **Split (has specs)** — when the effort used `spec-pipeline`, separate the two halves so the folder stays
  navigable as it grows:

  ```
  archive/{topic}/
    project-status.md        <- the tracker/index — root, "read me first" (spans both halves)
    live-checks.md           <- the human's verification rows, accumulated as the pipeline ran
    specs/                   <- the spec pipeline: 00-ignition-brief · 01 umbrella · 02..NN slices
    implementation/          <- the per-session working docs that built it
    sessions/                <- THE PIPELINE'S CONVERSATION, archived intact:
                                 {spec-slug}/plan.md  + {spec-slug}/tldr.md  per build session
                                   (TWO files — questions ride the PLAN TLDR, and there are no
                                    status snapshots, because the tracker is committed live and
                                    its git history carries every revision)
                                 code-review.md            the review seat's outside look, if
                                                           the pipeline had a review row
                                 parent-retrospective.md   the parent's inside look
                               These are TESTIMONY: an archive pass repairs links elsewhere and
                               leaves sessions/** byte-untouched. Older archived sessions may
                               still hold questions.md / status-after-*.md; that is historical
                               record, not the convention.
  ```

**Follow-on pipelines (multi-round families).** A second (third, …) spec pipeline that continues an
already-archived effort gets its **own sibling topic folder**, never filed inside the frozen one.
Rules: (a) name the new topic `{family-prefix}-{subtopic}` so the family groups
alphabetically; (b) each folder keeps the full split shape (own `project-status.md` at root); (c) the
**family index is the living feature doc's `## Lineage`** — it accumulates Idea/Spec/Built rows from
every round; (d) the new pipeline's umbrella/tracker back-link to the prior round's archive (allowed —
cross-effort links into archives are historical record). Never reopen a frozen topic folder to add
a round.

**Fix the intra-effort links the move breaks.** Moving files changes relative depths, so on archive
`docs-process` repairs the links *within* the effort (and the live feature doc that points at it):
working docs' `Source:` to the spec's new path (`../specs/NN-*.md`), the spec / `project-status` links, the
index's links into `specs/`, and the feature doc's `## Lineage` rows (`Spec` to `specs/…`,
`Built` to `implementation/…`). **Pre-existing cross-effort links** in archived docs (to *other* topic
folders / research chains) are **left as historical record** — don't chase those.

**`archive/audit/` is the one exception to topic-folder grouping.** Audit reports mirror the *living-doc
groups* instead — `archive/audit/{guides,patterns,infrastructure,features}/{doc}-audit.md` — so each
report sits beside the docs it audits. The cross-cutting `health-report-{date}.md` (from
`docs-audit-full`) stays at the `audit/` root.

---

## Doc metadata (repository-owned)

> **Repository-owned.** This section prescribes the machine header every doc the loop writes carries.
> What follows is the loop's own header. A repository whose docs already carry a metadata convention
> (YAML frontmatter with its own keys and status words, a validator, an indexer) rewrites this section
> and the templates below in its `docs/_meta/` copy to say that convention, in one voice; every skill
> that writes a doc takes the header from this copy. [The repository-owned sections](#the-repository-owned-sections)
> lists what it must answer.

Two additive machine layers wrap a doc's unchanged human content: an invisible **header meta-comment**
(greppable status/identity) and a visible **`## Lineage` footer** (the clickable provenance breadcrumb).
Both render cleanly in any markdown viewer, and both have an Obsidian (frontmatter + `[[wikilink]]`)
equivalent so imported vaults work too.

### The header meta-comment

One line, directly **below** the blockquote (which stays exactly as-is), the comment opening at column 0:

```markdown
# Knowledge Ingestion Feature

> Multi-format content ingestion… Last verified {date}.
<!-- meta: type=feature; status=current; verified={date}; lineage=3 -->
```

**Grammar:** `<!-- meta: key=value; key=value; … -->` — one line, `;`-separated, `key=value`. Invisible in
render; `rg -o '<!-- meta:.*-->' docs/` yields one line per doc (the condensed status report); a parser splits
on `;` then `=`. Keep it **one line** — multi-line comments grep badly.

| Key | Values | Notes |
|-----|--------|-------|
| `type` | `feature` \| `infrastructure` \| `pattern` \| `guide` \| `research` \| `spec` \| `working` | mirrors the folder |
| `status` | `current` \| `wip` \| `draft` \| `stale` \| `shipped` | descriptive docs are `current`; specs go `draft` then `shipped` |
| `verified` | `YYYY-MM-DD` | **equals** the blockquote's `Last verified` date — the two move together |
| `lineage` | integer | count of `## Lineage` links — a quick "how grounded is this doc" signal |

The blockquote header is **untouched** — the meta line is additive, so the legacy `Last verified` grep keeps
working through any transition. `type`/`status`/`verified` map 1:1 to Obsidian frontmatter keys (see interop).

### The `## Lineage` footer

The visible `Idea / Spec / Built / Related` breadcrumb. It **supersedes `## Related Docs`** — the old peer
links become the `Related` row:

```markdown
## Lineage
- **Idea**    — [{research doc}](../archive/{topic}/{research-doc}.md)
- **Spec**    — [{NN-slice}](../archive/{topic}/specs/{NN-slice}.md)
- **Built**   — [{working doc}](../archive/{topic}/{working-doc}.md)
- **Related** — [{peer}]({peer}.md) · [{peer}]({peer}.md)
```

| Row | Points at | Edge type (for a doc-graph tool, if the repo has one) |
|-----|-----------|------------------------------|
| `Idea` | the `research/` (or archived research) doc the idea came from | `SOURCE_OF` |
| `Spec` | the spec doc(s) it was built from (if the effort used the spec stage) | `SPEC_OF` |
| `Built` | the working/archived implementation doc(s) — the real WHY | `BUILT_BY` |
| `Related` | peer living docs (the old `## Related Docs` content) | `RELATED` |

**Rules:**
- All rows optional — omit a row that doesn't apply. Native links are **relative markdown links**;
  `[[wikilinks]]` are also accepted (interop).
- **Real lineage only.** Wire a row only where the idea/implementation origin is *genuine* — never on
  coincidental topic overlap (junk links would pollute the graph's communities).
- Most `patterns/`/`guides/` docs carry only `Related` (maybe `Built`); `features/` carry the full chain.
- **`Spec` mirrors `Built`; the vision goes to `Idea`.** For a spec-driven effort: put the umbrella +
  any `00-operating-frame` (the *why/what*) in `Idea`, and list in `Spec` **every per-slice spec that a
  listed `Built` session implemented** — the two rows stay symmetric. A session in `Built` whose spec is
  missing from `Spec` (or vice-versa) is the smell. Don't silently drop chain members because they feel
  "adjacent" — the chain that built the doc *is* its lineage.

### `related_files` — the doc-to-code bridge (derived, no authoring)

Most feature/infra docs already list code paths in their `## Key Files` table (plus inline `path/File.cs:line`
mentions). A doc-graph tool can reverse-index those into a `related_files` set per doc — a `COVERS` edge
from the doc to the matching code file. **No new field, no new authoring** — just keep `## Key Files` accurate.

### Obsidian interop (two encodings of the same fields)

The format is two encodings of one set of fields, which a doc-graph parser treats as equivalent:
- **Native:** `<!-- meta -->` (status/identity) + `## Lineage` relative links (edges).
- **Imported (Obsidian):** YAML frontmatter keys `type/status/verified` + `[[wikilinks]]` anywhere.

Native is the default because a plain markdown renderer shows the HTML comment invisibly and relative links
cleanly, whereas frontmatter shows as a stray paragraph + `<hr>` and `[[ ]]` as literal text. Embrace-and-extend
Obsidian; don't imitate it.

---

## Templates (repository-owned)

> **Repository-owned.** A repository that rewrote "Doc metadata" rewrites each template's header lines
> here to match; the sections beneath them are the loop's and stay.

### Session / working doc (created during a session, archived by `docs-write`)

```markdown
# {Feature/Topic} — {Subtitle}

> {One-line summary}. Builds on [{prior}]({path}) (if continuing prior work).
> Source: [{research-doc}](../research/{x}.md) (if idea-driven).
> Completed {date} on branch `{branch}`.
<!-- meta: type=working; status={wip|shipped}; verified={date}; lineage=N -->
<!-- session: claude-session-id={the harness's session id}; name={window name, only if one exists} -->

## The Problem
{what was wrong or missing}

## The Target
{desired end state}

## Research & Decisions
| Option | Verdict | Why |
|--------|---------|-----|

## Implementation
{what changed, before/after where useful}

## Change shape
{orientation only — the new/moved pieces and the structural facts a later session needs. The commit
is the file-by-file inventory; don't duplicate it (a full dump makes the doc read like a review).}

## Verification
- [ ] build / tests
- [ ] manual check

## Watch-Outs
{edge cases, gotchas}

## Living Docs to Update
| Doc | What to change |
|-----|----------------|
> The bridge to docs-process. Be specific about form, not just topic.

## Archive
Topic folder: `archive/{topic}/`
```

### Living doc (guides / patterns / infrastructure / features)

```markdown
# {Topic}

> {One-line description}. Last verified {date}.
<!-- meta: type={feature|infrastructure|pattern|guide}; status=current; verified={date}; lineage=N -->

## Overview
{what it is, why it exists, how it fits}

## {Sections per concept}
{rules, patterns, code examples — real relative file links}

## Key Files
| File | Purpose |
|------|---------|

## Open Issues   _(optional — omit the section entirely if none)_
- {YYYY-MM-DD} {one-line, code-verified risk / bug / tech-debt not yet fixed} — `path/File.cs:line`

## Lineage   _(supersedes `## Related Docs`; omit any row that doesn't apply — see "Doc metadata" above)_
- **Idea**    — [{research doc}]({relative-path})
- **Spec**    — [{spec doc(s)}]({relative-path})
- **Built**   — [{working/archived doc(s)}]({relative-path})
- **Related** — [{peer doc}]({relative-path}) · [{peer doc}]({relative-path})
```

`## Open Issues` is the one place a living doc records "this is currently *wrong/risky*" (the rest of the
doc describes what works). `docs-process` and `docs-audit-feature` add to it when they spot a real,
code-verified problem while reading; `docs-status` surfaces docs that carry one; the bullet is removed
once the code is fixed. Keep entries one line, dated, and pointing at a `file:line` — never speculation.

### Research doc (future-state, pre-implementation)

```markdown
# {Topic} — Future-State Design

> {One-line summary of what this explores}.

## Current State
{what exists today, verified vs code}

## Desired End State
{what we want to build}

## Design Options / Recommendation
{options with trade-offs; the recommended approach}

## Open Questions
{unresolved decisions}
```

### Spec doc (a numbered pipeline — `spec-pipeline`)

When a research idea graduates into a real plan, `spec-pipeline` explodes it into a numbered pipeline in
`docs/research/{topic}/`: `00-ignition-brief.md` (the parent seat's standing orders for the run — two
sections completed at ignition) · `01-{topic}.md` (the umbrella) · `02..NN-{slice}.md` (**one
self-contained spec per planned session**) · `project-status.md` (the tracker, which carries its own
section notes) · `live-checks.md` (the human's verification rows).
Each per-session spec uses this template (carries `Builds on`/`Source:` so the chain stays navigable):

```markdown
# Spec NN — {Slice title}

> {what this slice builds} — {why / the gap it closes}. {what it builds on / supersedes / defers}.
> Builds on [{prior}]({prior}.md). Source: [{umbrella / research}](...). Written {date}.
<!-- meta: type=spec; status=draft; verified={date}; lineage=N -->

## The Problem / The Target
## Design & Decisions   (table: Option | Verdict | Why)
## Implementation   (concrete, file-level, with verified `path:line` where known)
## Verification
## Watch-Outs
## Deferred to other specs
```

Specs stay physically in `research/{topic}/` through the build; when the effort ships, `docs-process` archives
the umbrella + specs + working docs together into `archive/{topic}/` — a spec-driven effort splits into
`specs/` + `implementation/` with `project-status.md` at the root (see "Two topic-folder shapes" above). The
spec set *is* the design history.

---

## The skills — two loops, two prefixes

**`docs-*` = the knowledge loop** (what the repo knows: capture, compile, audit).
**`spec-*` = the execution loop** (how big work gets built: graduate a plan, a coordinator seat,
build seats). They hand off at both ends: research docs feed `spec-pipeline`; every build session
closes with `docs-write`; `docs-process` compiles the results back into living docs. A seat prompt
never restates a rule a skill holds — the prompt points, the skill holds it. And a skill never restates
what this file's repository-owned sections hold: the header a doc carries and where an effort is filed
come from this copy, so a repository changes them once, here.

| Skill | When | What it does |
|-------|------|-------------|
| `docs-backlog` | Have an idea | Capture it as a research doc in `research/` |
| `spec-pipeline` | A research idea is graduating into a real plan | Explode the plan into a numbered spec pipeline (umbrella + one self-contained spec per session + `project-status`) in `research/{topic}/`; the plan becomes ephemeral |
| `spec-parent` | Right after `spec-pipeline` (same session, context-loaded) or to resume an effort fresh | Assume the coordinator seat: cut seat prompts (one per spec), review/verify TLDRs, give commit calls, own `project-status.md` — the same loop hand-cranked or hosted |
| `spec-seat` | **Every** seat a coordinator arms — invoked FIRST, before the job skill | The CONTRACT, not a seat: the shared half of every seat's procedure — beliefs, plain-text PLAN TLDR, numbered questions w/ recommendations, six-section FINAL TLDR, commit only on the relayed call |
| `spec-child` | Igniting a build or fixit seat — manually or platform-spawned, after `spec-seat` | The BUILD JOB only: one spec, the role's reading list, the pin taxonomy, the suite protocol; `fixit` variant for no-spec defect sessions. Its ceremony comes from `spec-seat` |
| `spec-witness` | A pipeline looks wedged, actors' claims conflict, or you want a substrate-verified state report | The read-only fourth seat: the control plane's read lanes, transcripts, git; zero writes, zero rulings — the seats act, the human judges, the witness testifies |
| `spec-ignite` | Right after `spec-pipeline` when the pipeline runs HOSTED (vs `spec-parent` for hand-cranked) | The ignition copilot: verify the committed brief, derive the stage card (the human clicks Create), "kick it", a hosted coordinator runs the pipeline; two verbal gates, everything announced, every UI gap a named finding |
| `spec-review` | A pipeline's builds are done and it has a review row | The outside look, before the retro and before the PR: code + patterns + composition across session seams + the loop's own comms, in two independent passes. Files `sessions/code-review.md` and classifies which findings earn a fixit. **Its value is having none of the pipeline's context** |
| `spec-retro` | The parent's LAST act, after any review and any fixit | The inside look: a substrate-verified grade, the ceremony audit (did the acts the seat believes it performed actually write rows?), the ledger reconciliation, the true economics, the blindnesses, and the ranked fixit backlog |
| `docs-status` | Session start | Report what's recently archived, what's in `working/`, what's in `research/`; sweep the meta-comments for the condensed status table |
| `docs-write` | End of a session | Finalize the working doc; it stays in `working/` (records its `## Archive` target) |
| `docs-process` | Start of a session, `working/` has docs | Patch living docs from the working doc's checklist (verified vs code), then file the doc into `archive/` |
| `docs-audit-feature` | Touched/suspect a doc, or periodic | Deep-audit one or more living docs (features / infrastructure / patterns) against code — audit report + corrected doc. Takes a single doc, a list, or a whole folder (folder mode also flags code with no doc) |
| `docs-audit-full` | Monthly / after absence | Scan all docs for staleness/age, produce a prioritized re-verify plan |

---

## Conventions

- **kebab-case** filenames. No date prefixes — dates go in the header.
- **Relative links** between docs (clickable, survive moves within a group).
- **One *authority* per fact** — not one mention. *Orientation* docs (e.g. `frontend-patterns`, the build-from-this
  snapshots) may carry a **condensed snapshot** of an adjacent topic — just enough to act — and back-link to its
  authority for the rest. That overlap is *fortifying*, not redundant: it keeps the doc self-contained so a reader
  can build without opening every deep-dive, and escalates only when stuck. The line that keeps it healthy:
  **exhaustive or drift-prone detail** (exact commands, config keys, audit tables, full mechanics, edge-case lists)
  lives **only** in the authority — a snapshot reinforces the *shape* and points forward, it never holds the
  authoritative detail in two places. Mark snapshots as such and link the authority (e.g. "Snapshot — see X").
- **Write the capability and the situation that calls for it — never its history.** This applies to living
  docs, skills, and the system prompts alike. Say *"when you need a decision mid-build, append a
  `## MID-BUILD QUESTION` and end your turn"* — never *"X was removed, use Y instead."* A reader who has to
  learn the retired lane in order to understand the live one is paying for history they will never need, and
  a rule stated as a correction invites re-litigation instead of action.
  - If a mechanism **no longer exists**, don't mention it. Its absence is not a fact a seat can act on.
  - If a tool **exists but is wrong for this job**, say what it *is* for and move on — that answers the
    reader's real question ("then when do I use it?") instead of leaving a warning they must remember.
  - **Contrasting two LIVE choices is different, and it stays** — *"a property, not a mechanical result"*,
    *"a journal entry, not a status cell"*, *"the floor, not the ceiling"*. These steer away from a tempting
    wrong answer a reader might otherwise pick. The test: would the reader plausibly choose the other side
    today? If yes it is clarification; if the other side is gone, it is archaeology.
  - Incident receipts belong in `archive/` — the retro, the session doc, the git history. A living
    instruction cites a rule; the effort that earned it keeps the story.
- **Cite an artifact from `sessions/…` down, never from the effort root.** A receipt path belongs in the
  doc that reads it, but effort folder names carry ceremony words (`spec`, `chain`, `park`, `verdict`) and
  some shipped packages fail their own build when one appears in source. Writing
  `sessions/10-packaging/artifacts/coverage-baseline.txt` keeps the citation usable from inside a
  script header or a test comment; the effort-root prefix belongs only in prose that will never be
  vendored.
- **Code is truth — for descriptive docs** (`infrastructure/`, `features/`): verify every update against
  the actual source. For prescriptive docs (`patterns/`, `guides/`) the doc is the decided rule — check
  that code conforms to it instead (see "Two kinds of living doc" above).
- **Every living / spec / working doc carries the machine layer** — a one-line `<!-- meta: … -->` header
  below the blockquote + a `## Lineage` footer (see "Doc metadata (repository-owned)" above). The meta
  `verified` date moves with the blockquote's `Last verified` and obeys the same anti-fabrication rule:
  only stamp it for a doc actually checked against code this run.
- **Don't edit archived docs** — stale references there are historical record.
