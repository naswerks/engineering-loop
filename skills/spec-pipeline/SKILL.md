---
name: spec-pipeline
description: Graduate a plan into a numbered spec pipeline in docs/research/{topic}/ — an umbrella plus one self-contained spec per planned seat. Use when a research idea is "really getting into it" and a plan has come through (a plan-approval mode, if your harness has one) and you want to commit it as specs instead of executing it directly, or run spec-pipeline.
---

# spec-pipeline

Turn a *plan* into a durable, numbered **spec pipeline** in `docs/research/{topic}/`. This is phase 2 of
the two-phase backlog model: `docs-backlog` parks an idea; `spec-pipeline` graduates the plan behind it
into specs. **The plan is throwaway — the specs carry every crumb.** A future session reads ONE spec + the
umbrella and can build without the plan or the original conversation.

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

## The two-phase model

| Phase | When | Skill | Output |
|---|---|---|---|
| 1 — park the idea | a thought, no time to build | `docs-backlog` | a research doc in `research/` |
| 2 — graduate to specs | research exists, you're getting into it (a plan has come through) | **`spec-pipeline`** | numbered specs in `research/{topic}/`; **the plan is now ephemeral** |
| 3 — build | per spec | implement, then `docs-write` | working doc that `Source:`s its spec |
| 4 — compile | effort done | `docs-process` | living docs patched; specs + working docs archived together |

## What a pipeline folder contains

> **THIS FOLDER IS THE CREATE PAYLOAD.** Ignition does not compose a pipeline from memory or from a
> conversation — it DERIVES one from these files: the folder name is the topic, the umbrella's H1 is the
> title, `## The sequence` is the seat list, and the numbered specs are the seats. Author them knowing
> they will be read mechanically, and the ignition step becomes a verification rather than a
> transcription. The mapping is the table in `spec-ignite` § *the stage card is derived*; keep the two
> in step if either moves.

```
docs/research/{topic}/
  00-ignition-brief.md   the coordinator's standing orders for THIS run (template below)
  01-{topic}.md          the umbrella: vision, the row table, settled decisions, hard constraints
  02..NN-{slice}.md      one self-contained spec per planned seat, in build order
  project-status.md      the living tracker — the coordinator's journal (template below)
  live-checks.md         the human's verification rows, accumulated as the run proceeds
  sessions/              the CONVERSATION — see below. NOT authored here: the FIRST seat
                         brings it into existence when it files, so a fresh folder has none
```

### `sessions/` — the conversation, and its durable record

**Nobody creates this folder as an act.** The FIRST seat brings it into existence by committing its two
files at close-out; every later seat writes into the folder that is already there. So: **do not author it
here, and never place a `.gitkeep` in it** — git tracks files, not directories, so a placeholder is the only
way to commit an empty one and there is nothing to commit. **A freshly authored pipeline folder has no
`sessions/`, and that is correct.**

It is a DESTINATION MAP, described here because four seats need to know where their artifact goes:

```
sessions/                        WHO PUTS IT THERE
  {spec-slug}/plan.md            each build seat, in its own close-out commit — the full plan, posted
                                 once, corrected on pushback (PULL-only)
  {spec-slug}/tldr.md            each build seat, same commit — the two-voice CHAT: its TLDRs and
                                 questions with the coordinator's rulings appended beneath them. Read
                                 top-to-bottom it IS the session's whole conversation, in message order
  code-review.md                 the review seat, in its own commit, if the run has a review row
  parent-retrospective.md        the coordinator, at the close
  witness-ledger-*.md            a human commit — the witness is zero-writes by contract (its ticket
                                 cannot even carry the write scope), so its testimony reaches the repo
                                 by someone else's hand
```

- **Per-seat artifacts go in a `{spec-slug}/` subfolder; effort-wide artifacts sit at the `sessions/`
  root.** The first seat creates its subfolder and, incidentally, the parent folder; everything after
  writes into what exists.
- **RE-COPY BOTH FILES ONCE, IMMEDIATELY BEFORE THE FINAL PUSH.** A seat's close-out receipt is written
  AFTER the commit that carries its testimony, so a single copy always lands truncated — and a follow-up
  commit only moves the truncation, because a receipt about THAT commit is also written after it. The
  regress is infinite; the declared stopping point is one re-copy, leaving a residual of "I pushed X,
  status clean" that git already records. `spec-seat` carries the rule; it is stated here because THIS
  file is where the destination map lives.
- **Two files per build session — `plan.md` and `tldr.md`.** Questions ride the TLDR, so there is no
  separate questions file, and there are no status snapshots: the tracker is committed live, so its git
  history already carries the progression a snapshot would fake.
- **Append-only.** `tldr.md` grows; nobody rewrites it. The rev ladder is the history.
- **Who READS it:** the coordinator reads each TLDR and appends its rulings under `## PARENT RULING` · the
  review seat reads every session's TLDR as testimony **and reads nothing else** · the retro greps it for
  acceptance anchors and unanswered questions · the witness uses rev counts and mtimes as a zero-cost
  heartbeat.
- **It archives with the effort**, and it is TESTIMONY: an archive pass repairs links elsewhere and
  leaves `sessions/**` byte-untouched. Editing testimony to make it tidy is how a record stops being one.

## Steps

1. **Gather the inputs.** You need the *plan* (from a plan-approval mode, a conversation, or a written
   one) and the *research doc(s)* behind it. Pick the `{topic}` folder name (kebab-case; reuse an existing
   `research/{topic}/` if extending one).

2. **Decide the slices.** Each numbered spec is **one self-contained build seat**. Cut the plan along
   session boundaries — a slice a single session can build *and* verify **before its context compacts**.
   Put them in build order.

   **Size each spec for ONE session, and let the count fall out of that.** A pipeline of one or two specs
   is a pipeline; so is one of eight or ten. There is no target count — a plan stretched to fill a
   "usual" number of rows produces thin specs that each cost a full session's ceremony, and a plan
   compressed to hit a small number produces specs no session can finish before compaction. The test per
   slice: recon + plan + build + suite + FINAL TLDR fits in one session with room for two rulings.

2b. **Decide the pipeline's SHAPE — ask the human both questions, with your recommendation.** The bookends
   are rows in the row table like any other seat, which is why the decision belongs here: nothing
   downstream needs a flag, and the coordinator learns the shape by reading its own sequence.

   **"Do you want a REVIEW row?"** Recommend YES when the run ships a lot of code, touches security or
   an authorization/identity path, spans many sessions whose seams nobody owns, or repairs the machinery
   it runs on. Recommend NO for a docs-only effort or a single narrow slice. Say which and why — this is a
   judgement about *this* code, so make the case and let the human rule.

   **"Do you want DOCS-PROCESS as a row?"** In-pipeline gives you a zero-touch close: living docs patched
   and the effort archived without a second sitting. **State the trade honestly:** `docs-process` is
   designed as a fresh session over *merged* code, so in-pipeline it patches living docs against code that
   is only **about to be** merged, and the move from `research/{topic}` into the archive home rides the
   same PR. If the PR is not merged, or is partly reverted, those docs describe something absent. **Say in the
   brief that the living-doc patches are contingent on the merge.** Out-of-pipeline is equally valid and
   cheap — every artifact is durable, so it runs cold, later, over several efforts at once.

   **Each row's KIND is a real vocabulary, not a label** — `build` · `fixit` · `review` · `docs-process`
   · `coordinator` · `retro` · `witness`. The kind decides which skills a seat is seeded with and which
   verbs its credential admits, and a kind nobody has heard of composes NOTHING rather than something
   plausible. Name rows in those words.

   Then write the rows into the row table and the brief's sequence, in this order:

   ```
   02..NN   the build seats
   {R}      REVIEW      — spec-review, if chosen. Runs on `git diff {base}...<branch>` (the rails' base branch); no PR yet
   {F}      FIXIT       — MAY materialise, one maximum, only if the review classifies an (a)+(b)
                          finding AND the coordinator rules it in. Not authored up front; the
                          coordinator charters it from the review's named list
   —        the coordinator's retro + PR (its own close-out, not a row)
   {P}      DOCS-PROCESS — if chosen
   ```

   **The REVIEW row's seed carries NO coordinator beliefs** — no provenance list, no prior-shapes
   bullets, no framing about what is already settled. Every other seat's prompt deliberately carries those;
   this one must not, because the seat's whole value is the absence of the run's context. **Write that
   instruction into the brief**, or it will be seeded helpfully and destroy what it is buying.

   **The sequence you just decided lands in THREE documents, and they must agree**: the brief's
   `## The sequence`, the umbrella's row table, and the tracker's `## Session status`. Write all three
   in one pass, listing the same rows in the same order. **The coordinator re-checks this at ignition** —
   an effort whose three documents disagree has one seat acting on a shape the others have stopped
   describing.

3. **Write the specs**, using the spec-doc template in `docs/_meta/docs-workflow.md`. Each per-seat
   spec opens with the spec-doc blockquote (`Builds on [prior]` + `Source: [umbrella / research]`) and the
   machine header `docs/_meta/docs-workflow.md` § Doc metadata (repository-owned) prescribes, at the word for
   `draft`, so the set stays navigable.

   **Six things every slice carries**, each earned by a session that did not have it:

   - **AN ESCAPE HATCH — what a truthful PARTIAL looks like for THIS slice.** Name the smaller thing that
     is still coherent and still shippable, and say what the builder must report when it stops there. This
     is the highest-value sentence in a spec and one of the cheapest: a slice that has one lets a seat
     stop cleanly on a measured number and say so; a slice without one leaves the cut to be improvised at
     build time, under budget pressure, by the seat least able to judge it. **A spec with no partial
     defined is a spec that can only succeed or lie.**
   - **A size signal — even a wrong one.** Rough diff size, file count, session-fraction: anything. A
     builder can correct an estimate at recon and will say so; it cannot correct silence, and a slice with
     no signal reads as "however big it turns out to be."
   - **The population, not an instance — and DERIVE it wherever you can.** *"Rename the verb at its 9 call
     sites"* and *"rename the verb across its 433 occurrences in 86 files"* are different sessions. Count
     the real population when you author the spec and write the number down; a census stated in instances
     will be read as the whole job.

     **A written count decays silently; a derived one cannot.** Prefer a spec that says *"derive the set
     with this command and report what you got"* over one that hands over a number. A documented count
     and a re-derived one have disagreed by a factor of two, and a correction has inherited the defect it
     was correcting — because nobody re-ran the command.

     **And say what produces the number you cite.** A count over rows measures only the paths that write
     rows — a probe that logs failures and returns silently on success will read as *"never worked"* from
     its row count when every silent run succeeded. **State the instrument before you state the figure.**
   - **Verification stated as a PROPERTY, not a mechanical result.** Say what must be TRUE when the slice
     is done, then offer commands as evidence for it. A prescribed result can be unsatisfiable by
     construction — *"these three greps return zero"* cannot hold for a ban that must quote the thing it
     bans, and the builder is then forced to choose between the letter and the point. State the property
     and the letter can never contradict it.
   - **A `last verified against` line — the date AND the sha the spec was checked against.** The
     header's verified date records authoring; this tells the BUILDER what the spec's facts are relative
     to. **Recon's first act is to test whether the slice is already satisfied** — specs do get overtaken
     between authoring and build, and a session that discovers this at recon closes in minutes while one
     that assumes the work is pending rebuilds what already exists.
   - **Cross-spec contracts written AS contracts.** When a slice produces something a later slice consumes
     — a name, a shape, a column, an invariant — state it in both specs, in the same words, and mark it as
     the contract. A dependency mentioned in prose in one spec and assumed in the other is not a contract;
     it is two beliefs that happen to agree today.

   **Cite symbols, not line numbers.** A spec outlives many commits, so name the symbol and use the line
   as a hint. A line number is a comment, not an address: an anchor can drift several times inside a
   single effort, invalidated each time by a seat documenting why the line mattered, and the only
   citations that survive are symbol-named.

   **When a slice REMOVES something, its census covers the copy that ADVERTISES it.** Not just the
   plumbing — the system prompts, wake digests, tool catalogs, and doc counts that offer the thing to a
   seat. A census that lists a tool's implementation and misses the two surfaces telling a seat the tool
   exists has a blind spot. **A count pinned in a doc needs a named owning session**, or it rots: say
   which spec moves it, and have the others leave it alone.

4. **Name the RESEARCH the effort came from, in the umbrella, by path.** The idea that fed this work
   archives *with* it — that is how its archive home ends up holding the whole arc from "thing we'd like to
   do" to "done." When the research doc already lives at `research/{topic}/`, it travels for free. **When
   it does not** — a standalone `research/{something}.md`, or several — the umbrella's `Source:` / Lineage
   is the only record that it belongs to this effort.

   **Say it plainly, because a later seat has to act on it:** whoever archives this gets handed that
   list, and a research doc nobody named is one that stays behind in the running tab after its effort has
   shipped. Two lines in the umbrella now saves a hunt through a shared folder later.

5. **Name the archive destination when only you can.** Read `docs/_meta/docs-workflow.md` § The archive
   convention (repository-owned). If where a pipeline files depends on something only this session knows
   (which living feature the effort belongs to, say), resolve it now and write the path into the
   umbrella's blockquote as an `Archive:` line; `spec-parent` hands it to the docs-process row and
   `docs-process` files there. A convention that needs nothing from you needs no line.

6. **Stop.** The specs stay in `research/{topic}/`. Do NOT implement, do NOT touch living docs, do NOT
   archive — those are later phases. Output the new files only.

## The `00-ignition-brief.md` template

The coordinator's standing orders for this run, and **you write all of it here — every section, nothing
left blank.**

**Why here and not at ignition:** this is the hot session. You just placed the specs, counted the
populations, and read the code they cite, so you are the only seat that can state the baselines and the
platform state without guessing. **Ignition may be a cold session** — a different window, a different day —
whose job is to *verify* this brief against live HEAD and correct any drift, not to author it. Every
authoring act belongs to the session that has the context; every verifying act belongs to the one standing
next to the running system.

That includes the **kick text**: write the coordinator's task string here, ready to paste, so igniting
requires no authoring at all.

```markdown
# {Topic} — Ignition Brief (the coordinator's standing orders)

> You are the COORDINATOR of the {topic} pipeline. Read this, then the umbrella (01-*.md), then the
> tracker (project-status.md — yours), then EVERY numbered spec before arming the first seat.
{the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at the word for `draft`}

**Last verified against:** {date}, `{sha}`. Ignition re-verifies this brief against live HEAD and
corrects drift; it does not re-author it.

## Birth
Topic · spec path · receipt prefix · attended/unattended · branch `{the effort's branch}`.

## The sequence
| Seat | Spec | Kind | Why it sits here |

**THE `Kind` COLUMN IS THE VOCABULARY WORD, VERBATIM** — `build` · `fixit` · `review` ·
`docs-process` · `coordinator` · `retro` · `witness` — **not a prose role.** This table is READ, not
just read by people: ignition derives the create payload from it (`spec-ignite` § the stage card is
derived), and the create door validates the kind against a closed set and refuses an unknown by name.
A cell saying "the one that reviews" composes nothing.

**AND THE COORDINATOR IS A ROW.** It is a seat on the create payload like any other, it is not one
of the numbered specs, and a pipeline without exactly one is refused at start
(`pipeline-has-no-coordinator` / `-has-many-coordinators`). List it first, at stage 0, with the brief
as its spec.

Include the REVIEW and DOCS-PROCESS rows if the pipeline has them, and say which it does NOT have —
the coordinator needs to know whether a review precedes its retro. If there is a review row, add:
**its seed carries no coordinator beliefs, no provenance, no already-settled framing** · a FIXIT row
may follow it (one maximum, coordinator-ruled from the review's named candidates) · **the retro comes
after the review and after any fixit**, never before. If docs-process is a row, note that its
living-doc patches are contingent on the merge.

## The coordinator's beliefs, with provenance
Each load-bearing claim and which pipeline, row, or commit established it. A seat that finds a mismatch
has produced something worth more than a build hour. **Never head this section with a claim that
questioning it counts against the session** — that framing gets pointed at exactly the claims that
turn out to be wrong.

## Pipeline-specific law (beyond the prompt and the skills)
Only what OVERRIDES a default: the suite/coverage lane, spend fences, ordering constraints that are not
obvious from the specs, per-spec riders already ruled.

## Baselines
MEASURE these — run the suites and quote the real numbers. Ignition re-verifies; it cannot invent them.
Per lane: the result, **the exact invocation**, and **the environment it was measured in**. Three things
that each cost a live run:
- **A number without its invocation is not a receipt** — it invites the next reader to widen its scope.
  Say which projects ran, not just a total.
- **State the environment.** A baseline measured with the stack down is a different number from one
  measured with it up, and a seat that runs the wrong one sees a wall of red and suspects its own diff.
  If a lane cannot run without infrastructure, say so and say what to do instead — do not invent a total.
- **A KNOWN-RED gets its own block, and it says "this is not your regression."** Quote the failure, name
  why it fails, and say which count means fixed vs newly-broken. A seat meeting an undisclosed red will
  reasonably suspect itself and burn a turn proving otherwise.
- **Name the LOAD ARTIFACTS and the tests that flake, individually.** A lane can be green in substance and
  unstable under load — five failures that are all `Test timed out in 5000ms` with zero assertion failures
  are a machine artifact, not a defect, and a runner that crashes outright on 1 of 2 runs is a third state
  again. **List the flaky tests by name**, because "5 timeouts" is indistinguishable from a seat's own
  breakage, and the ones nearest the session's subject are exactly where it will misattribute. Say what to
  do: run the lane unloaded, never beside another suite, re-run once on a crash and stop on two.

## Platform state
What is known-broken or known-fixed in the machinery this pipeline stands on, and what a seat should do
when one of them misbehaves. VERIFY each claim against the code or a row; never write it from memory.
A brief that calls a fixed defect broken teaches the coordinator to work around nothing.

If this pipeline CHANGES the machinery it runs on — the ledger, the wake digest, the audit lane, the
sentinel, the gate — say so here, and tell the coordinator to expect to meet that defect while fixing it.
Meeting it is a first-hand receipt worth more than the spec's analysis: journal it and cite it in the fix.

## Close-out
Per-seat artifact filing · live-checks aggregation · what the PR must say · the receipt this pipeline
owes about itself.

**A HUMAN ROW OWES A RECEIPT, NOT A NARRATION.** If the pipeline has a human row, carry this rule
into the brief verbatim: the row is exempt from `plan.md` (there is no build to plan) and is **NOT**
exempt from an independent record. It files `sessions/{slug}/receipt.md` in the row's own commit —
each check id, what was run, the literal result, and who observed it. Every other row has TWO
voices, the seat's tldr and the coordinator's tracker, and the retro's ceremony audit is built on
cross-reading them; a human row recorded only by the coordinator has ONE, and the one voice is the
one whose errors nobody else catches.

## The kick — paste this verbatim as the coordinator's task
> You are the COORDINATOR of the {topic} pipeline. Invoke the `spec-parent` skill, then read
> `docs/research/{topic}/00-ignition-brief.md` and follow it. Your branch is `{the effort's branch}`.

Deltas true of THIS kick only (a concurrent pipeline, a model override, a one-off probe) go here as a
short list. Everything else is already in this brief — the task string is a POINTER, not a copy, and it
stays short because a task buried in a run row cannot be diffed or reviewed the way this file can.
```

**Do not restate the ceremony here.** The coordinator's procedure lives in `spec-parent` and its policy
is the one § This repository's rails (repository-owned) names, which a hosted run also carries in the
un-skippable policy suffix the control plane supplies; a brief that re-teaches them accretes
into prompt-law that breaks the coordinator it was meant to steer. The brief carries THIS RUN's
choreography and nothing else.

**The brief must be committed to the base branch before the run is kicked.** The coordinator reads it
from its worktree checkout, and the kick text points at it — so an uncommitted brief leaves it with almost
nothing. That makes it ignition's first gate, and it is the reason this file is worth authoring carefully.

## The `project-status.md` template

Not a spec — the **living tracker**, the coordinator's live journal. Ship it with its section
notes intact: they are where the tracker's own rules live, and they render invisibly in a markdown
viewer because they are instructions to the coordinator, not content for the human reading it.

```markdown
# {Topic} — Project Status

> The coordinator's ledger. Advanced at every session boundary, never reconstructed at close.
{the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at the word for `wip`}

## What this is
{one paragraph}

## Session status
<!-- ready -> building -> SHIPPED {sha} / PARKED {sha}. One line each, no prose. -->

## Settled decisions
<!-- The don't-relitigate list, carried from the umbrella; append rulings that become standing. -->

## What's verified (trust basis)
<!-- What a build session may take on faith, and what it must re-check itself. -->

### Session {X} — spec {NN}
<!-- The journal, one prose section per session. The ruling AND its reasoning, recon corrections,
     what the coordinator verified itself, mid-build directives, anything worth not forgetting.
     Every entry stays independently readable by an ordinary offset/limit read — a section can be
     paged and addressed by heading index; a table cell cannot be split by any reader that exists.
     This is the raw material the retro is written FROM. -->

## Deferred findings log
<!-- THIS HEADING IS VERBATIM AND MUST NOT BE RENAMED. It is the destination every seat, review
     and retro is pointed at by path + heading; a pipeline that renames it makes its own findings
     unroutable to anyone who does not already know it — a review seat, whose entire value is having
     none of the run's context, files to the name it was given and nowhere else.

     {PREFIX}-n from ONE sequence for the whole pipeline, allocated by the coordinator only. One record per
     finding; tag category INSIDE the record rather than opening a second log with its own numbering.
     A SEAT OR REVIEW NEVER MINTS ITS OWN ID NAMESPACE — a second sequence beside the coordinator's
     produces two findings under one id, and a reader who sees the id believes it handled.
     Written at the moment of the finding, never batched at close.

     Each record carries FIVE fields, and the fourth is what makes it a record rather than a note:
       {PREFIX}-n · what is untrue or at risk · the receipt (file:line) · DESTINATION · status
     A record with no DESTINATION is a note. The legal destinations are the closed set in
     `spec-retro`'s findings disposition pass — this log is a HOLDING PEN, not an exit, and
     "deferred log" is therefore never itself a destination.

     THIS LOG IS DRAINED AT PIPELINE CLOSE by the retro's disposition pass: every entry leaves with a
     destination or an explicit CLOSE, and the tally is published. Author the log knowing it must
     drain — a log that is never drained outlives its pipeline and is read by nobody. -->

## Process incidents log
<!-- The moment behaviour is wrong — including the coordinator's own slips. -->

## Session-ID ledger
<!-- Seat -> the harness's session id -> window name. Written as each seat is armed. -->

## Working-doc manifest   <- INCLUDE THIS SECTION ONLY IF THE PIPELINE HAS A P ROW
<!-- Row P is handed a LIST, never a directory: docs/working/ is a shared queue, and a seat that infers
     membership from the folder can archive a neighbouring effort's docs — which it cannot undo.
     DERIVE this as the pipeline runs; do NOT budget it at authoring. You cannot know the names up front
     (each seat creates its working doc at close-out) and you cannot know the COUNT either — a
     conditional fixit row adds one.
     The coordinator writes each name at the reap that creates it, in the same pass as the SHIPPED row.
     Rows that produce NO working doc — the review row — are recorded as such, not left blank. -->

| # | Working doc | Produced by | Status |
|---|---|---|---|
```

**Never generate a `## Checkpoint ledger` or a `## Parent decisions` section.** The session section
*is* the decision record; a parallel section splits one narrative across two places.

## `live-checks.md`

One file at the effort's root, created with the specs. Every parked demo and human-verification row lands
here — a seat's FINAL TLDR section (e) rows get transcribed into it **at close-out, in the same commit as
the work**. Rows scattered across five sessions' TLDRs and never aggregated is the most common thing to
fall through: name the file at authoring time so nobody invents a new one.

**The status vocabulary carries a PARTIAL, not just pass/fail:**
`owed` · `passed` · `failed` (a failure is a finding, not a retry) · `not exercised` (with the reason — an
honest and useful result) · **`partly` (with which half held and which did not)** · `superseded` (with
what replaced it).

**And a row whose subject decomposes into halves owned by different actors is authored as TWO rows.** A
single passed/failed cell over a check whose seed half was clean and whose platform half defeated it has
to invent a status to record the truth. **If you can name two owners while writing the row, write two
rows.**

**TWO WRITERS ON THIS FILE IS A DIVERGENCE WAITING TO HAPPEN — and it is the file the review grades
from.** The coordinator dictates rows into a seat's close-out call and the SEAT stages them; a seat never
writes it unprompted. Author the file knowing that, and do not write instructions telling the coordinator
to edit it directly.

## Notes

- **Cardinal rule — *spare no crumb*.** `spec-pipeline` is an **exploder**, not a condenser. Carry every
  decision, every rejected alternative, every verified fact, every gotcha out of the plan and into the
  specs. If a spec is *shorter* than the plan section it came from, it probably dropped a crumb.
- **Self-contained, like `docs-backlog`.** Assume the plan file (a scratch file under the harness's own
  folder), the chat transcript, and any subagent reports vanish. Inline their load-bearing content; never
  point at ephemeral state as the source of truth. Cross-links to *other durable docs* are fine.
- **Lifecycle.** Specs live in `research/{topic}/` through the build. When the effort ships, `docs-process`
  archives the umbrella + every spec + the working docs together into the home `docs-workflow.md` § The
  archive convention (repository-owned) names, in its shape — the spec set *is* the design history.
- **Anti-fabrication.** A spec's header verified date is the date it was *authored against the code it
  cites*, not a promise the code stays unchanged. Only write facts you actually checked this run.
- **Author against the HEAD the run will start from — and know what that does not buy you.** Authoring close
  to HEAD reduces drift; it does not substitute for a seat reading the code. Specs authored against the
  exact HEAD they ran on have still had a load-bearing claim overturned at recon in every one. So write
  specs as HYPOTHESES: state assumptions explicitly, because they are the first things recon tests, and
  make them easy to correct.
- **Anchor-checking isn't design-checking.** A spec can ship with every anchor verified and a genuine
  arithmetic bug. Work the DESIGN against real seeded state, not just the citations.
- **Leave one genuine fork OPEN per spec, with an embedded recommendation** (options a/b + "my
  recommendation, confirm"). It guarantees the judging seat actually judges, and the builder's answer has
  beaten both the spec's and the coordinator's designs.
- **Size for rider accretion.** Specs grow ~40% past authored size once riders land; cut slices with
  headroom, and let overflow spin a `.5` fixit session rather than bloating a build session.
- Does NOT create working docs, patch living docs, or archive anything.
