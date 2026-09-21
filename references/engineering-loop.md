<!-- naswerks-loop: version=0.2.1 -->
# The Engineering Loop — flow, seats, skills, and the ceremony

> The quick intro to how work gets built with this loop: the two loops (`docs-*` knowledge, `spec-*`
> execution), the seats (Human / Coordinator / Seat, plus the read-only Witness), the ceremony per
> session, and a bare-bones exchange showing the back-and-forth. Point newcomers at this plus
> [doc-index](doc-index.md) + [docs-workflow](docs-workflow.md). Operational templates live in the
> `spec-parent` skill; the seat contract in `spec-seat`.
<!-- meta: type=guide; status=current; verified={date}; lineage=1 -->

---

## The loop at a glance

**As states, which is what answers "where is this effort right now" — and the shape decides where
`processed` falls relative to the merge:**

```
idea -> chartered -> building -> REVIEWED -> fixed? -> retro -> PR'd -> ?

   with a P row      -> processed -> merged <- HUMAN     P runs on the BRANCH and rides the PR, so the
                                                       living docs and the archive land WITH the code —
                                                       and its patches are contingent on that merge

   without one       -> merged <- HUMAN -> processed    a cold session later, on the base branch, over
                                                       one or several finished efforts at once
```

**That fork is the whole of the P-row decision.** In-pipeline buys docs and code landing together;
out-of-pipeline buys a clean PR diff and no contingency. Nothing else about the sequence changes.

**As skills:**

```
Idea                    -> docs-backlog          -> research doc in docs/research/
Research matures        -> a plan (a plan-approval mode, if the harness has one)
Plan graduates          -> spec-pipeline         -> docs/research/{topic}/: umbrella + one spec
                                                    per session + project-status.md (the plan is
                                                    now throwaway — the specs carry every crumb)
Same session — CHOOSE THE SEAT:
  hand-cranked          -> spec-parent           -> this session becomes the COORDINATOR and cuts
                                                    Prompt #1 (you relay every message)
  hosted                -> spec-ignite           -> this session becomes the IGNITION COPILOT:
                                                    verify the brief, derive the stage card, YOU
                                                    click Create, "kick it", a hosted coordinator
                                                    runs the whole pipeline; you own parks +
                                                    completes + the kill-switch
Per spec (new session)  -> BUILD SEAT            -> recon, PLAN TLDR, rulings, build,
                                                    FINAL TLDR, docs-write, commit (on call)
Builds done, if chosen  -> spec-review           -> the OUTSIDE look, before the retro and before the
  (a pipeline row)                                  PR: code + patterns + composition across seams +
                                                    the loop's own comms; sessions/code-review.md.
                                                    Classifies which findings earn a fixit
  if it found one       -> FIXIT row             -> one per pipeline MAX, coordinator-ruled, only when
                                                    the pipeline would otherwise ship something untrue
Close (coordinator)     -> spec-retro            -> the INSIDE look: the ceremony audit, the ledger
                                                    reconciliation, the true economics; then
                                                    BUILD COMPLETE + the PR
Effort done             -> docs-process          -> living docs patched (consuming the working docs
  (fresh session, or a                              AND code-review.md); specs + working docs
   pipeline row if chosen)                          archived together to docs/archive/{topic}/
Then, and ONLY these    -> the human MERGES the PR, and runs the live-checks rows <- THE TWO HUMAN GATES
Anytime / periodic      -> docs-status, docs-audit-feature, docs-audit-full  <- NEVER a pipeline row
Alongside, optional     -> spec-witness — a session OUTSIDE the worktree, read-only, zero writes: a
                           window into a running pipeline so the human can take its pulse without the UI
```

**Two things are the human's, permanently and by design:** the **merge** (a person in the merge path is
the point, not a gap) and the **live-checks** rows (a machine cannot hand-test a UI). Everything between
`idea` and `archived` a pipeline can do for itself.

**`docs-audit-*` is never a pipeline row.** It runs off-hours and scheduled, over the whole doc tree — not
inside an effort, and not at an effort's close. A stale living doc is not something a pipeline must stop for.

**The pipeline's SHAPE is decided at authoring, not by a runtime flag.** `spec-pipeline` asks whether the
effort wants a review row and a docs-process row, and writes them into the row table — so the coordinator
learns the shape by reading its own sequence, and nothing needs a toggle. A pipeline can be plain,
`+review`, `+review +process`, or `+process`.

## Two loops — both hand-crankable

- **`docs-*` is the knowledge loop** and runs standalone, forever: small/everyday efforts are
  just *plan, build, `docs-write`, `docs-process`* — no pipeline, no coordinator, a flat working
  doc. This is the default and it never requires a control plane.
- **`spec-*` is the execution loop** for work that is more than one session: `spec-pipeline`
  graduates the plan, `spec-parent` takes the seat, build seats build one spec each. **Each spec is sized
  for ONE session** — recon, plan, build, suite and FINAL TLDR before the session's context compacts —
  and the spec count falls out of that: a pipeline of two specs is a pipeline, and so is one of ten. It
  hands off to the knowledge loop at both ends (research docs in, working docs out).
- **Either loop runs by hand or hosted.** The manual version is this document's ceremony with the human
  relaying; the hosted version is the control plane running the same ceremony, machine-relayed. When they
  drift, this doc + the `spec-parent` skill are the requirements; the control plane follows.

## The seats

| Seat | Who | Holds | Never does |
|---|---|---|---|
| **Human** | you | final approvals (plan-approve click, hard questions, push/publish, hand-testing), the relay in manual mode | writes feature code mid-pipeline |
| **Coordinator** | one long-lived session per effort | the north star + full pipeline context; cuts each seat prompt from the previous session's *actual* results; judges PLAN/FINAL TLDRs; rules with rationale; verifies load-bearing claims itself; owns `project-status.md` | writes feature code; trusts self-reported "N green" |
| **Seat** | one fresh session per spec | exactly ONE spec; recons the real code first; builds; reports honestly | touches the tracker or memory; commits without the relayed call; runs `docs-write` unprompted |
| **Witness** *(optional, `spec-witness`)* | a read-only session with substrate access | testifies from rows/transcripts/git when claims conflict or a pipeline looks wedged; answers "whose turn is it" | writes anything; injects anything; rules on anything |

The seat, not the chat, is the product: `project-status.md` must stay current enough that a
fresh session can resume as coordinator losslessly (`spec-parent {topic}`).

## The skills

| Skill | Loop | When | One line |
|---|---|---|---|
| `docs-backlog` | docs | an idea, no time to build | park it as a research doc |
| `docs-status` | docs | session start | orient: archived / in flight / waiting |
| `docs-write` | docs | end of any build session (in a pipeline: on the coordinator's call) | finalize the working doc into `docs/working/` |
| `docs-process` | docs | effort done, fresh session | patch living docs (verified vs code), archive |
| `docs-audit-feature` / `docs-audit-full` | docs | doc suspected stale / monthly | deep-audit docs against code |
| `spec-pipeline` | spec | a plan came through and you're committing to it | explode the plan into a numbered spec pipeline — *spare no crumb* |
| `spec-parent` | spec | right after `spec-pipeline` (same session) or fresh with the topic | assume the coordinator seat |
| `spec-seat` | spec | **every** seat the coordinator arms, invoked FIRST | **the CONTRACT, not a seat** — the shared half of every seat's procedure. `spec-parent` does NOT compose it: the coordinator writes rulings rather than receiving them |
| `spec-child` | spec | igniting a build or fixit seat — manual (`spec-child {role} {spec}`) or hosted | **the BUILD JOB only** — one spec, the role's adds, the pin taxonomy, the suite protocol, the fixit variant. Its ceremony comes from `spec-seat` |
| `spec-ignite` | spec | when an authored pipeline runs HOSTED (the `spec-parent` alternative) | the ignition copilot, and it can run COLD: gates, re-verify the brief's baselines + platform state against live HEAD, derive the stage card (human clicks Create), "kick it" with the brief's own kick text as the task; every UI gap a named finding |
| `spec-review` | spec | a pipeline's builds are done, if it has a review row | the OUTSIDE look, before the retro and before the PR: correctness/security/**composition across session seams** · the patterns, with every departure identified · the loop's own comms. Two independent passes, consolidated. Classifies which findings earn a fixit; **its value is having none of the pipeline's context** |
| `spec-retro` | spec | the coordinator's LAST act, after any review and any fixit | the INSIDE look: a substrate-verified grade, the ceremony audit (did the acts write rows?), the ledger reconciliation, the true economics, the blindnesses, the ranked fixit backlog — *a retrospective that cannot indict its own author is marketing* |
| `spec-witness` | spec | a pipeline looks wedged, or actors' claims conflict | the read-only fourth seat: substrate access, zero writes, zero rulings |
| `init` | — | a repository that has none of this yet | create the `docs/` shape, the method docs, first drafts of every doc the skills read; `init doctor` says what is missing |

### Where a rule lives — policy, procedure, task

The thing that keeps prompts and skills from drifting apart:

| Kind | Home | Why there |
|---|---|---|
| **POLICY** | the un-skippable system-prompt suffix the control plane supplies at open | cannot be skipped, present on every turn |
| **PROCEDURE — shared** | `spec-seat` | the contract for ANY seat the coordinator arms: blackboard, question lane, parked-call discriminator, verdicts, BELIEFS sha, git shapes, six-section FINAL TLDR, close-out order |
| **PROCEDURE — per job** | `spec-child` · `spec-review` · `docs-process` | what THIS seat does. The job skill **refines** the seat contract and never contradicts it; a genuine conflict is a finding, not a fork |
| **TASK** | the seed prompt + the pipeline's `00-ignition-brief.md` | per-run; dies with the run |

A seed's first act is therefore to **invoke its skills** — `spec-seat`, then the job — not to restate them.
One copy per rule: where a prompt and a skill would say the same thing, the prompt points and the skill
holds it.

**Why the split exists.** A single base contract every seat kind shared, with the build job mixed in,
sends the REVIEW row into the umbrella its own charter excludes and offers the DOCS-PROCESS row a
`docs-write` from a build skill's close-out — the row that has just *emptied* `docs/working/`. One base
class, three wrong instructions, and none of it visible until the loop runs end to end.

Session boundaries: plan/spec authoring is one session; each spec is one build session;
`docs-process` is deliberately a *fresh* session; the pipeline's final spec audits the cumulative
diff.

## The ceremony (one build session)

1. **Coordinator cuts the seat prompt** from the PREVIOUS session's actual shipped shapes — never
   from the spec's guesses alone. (Template: `spec-parent` skill.)
2. **Seat recons, states its beliefs** (HEAD sha, dirty files, versions, baselines), then a
   **PLAN TLDR as plain text** — before any plan-approval presentation — with **questions as
   numbered options + an embedded recommendation, then STOP**. Never an interactive question tool.
3. **Coordinator rules**: verdict (`accept` / `accept-with-riders` — fold in and go /
   `blocking-precondition` / `read-full-plan`), one CAPS ruling per question, decision first
   then the WHY. The coordinator diffs the seat's beliefs against the ledger before ruling.
4. **Plan-approve = the freedom moment** (manual: approve + bypass-permissions; hosted: the gate
   flips). The seat builds uninterrupted; mid-run questions repeat the relay loop.
5. **Seat ends with the six-section FINAL TLDR** — shipped+verification, verbatim runner
   summaries (with invocation commands), honest gaps, deferred findings, live checklist
   entries, staging list + commit HELD + session cost.
6. **Coordinator verifies one load-bearing claim itself** (receipts compared first; rerun only in
   doubt), then the **close-out call**: optional fix/rerun, `docs-write` with an itemized
   carry, COMMIT CALL with the seat's own staging list, push (human approves the push).
7. **Coordinator flips the tracker row** to SHIPPED + hash and transcribes deferred findings — the
   seat never writes the tracker. **The coordinator also commits the closing seat's post-push
   close-out append, byte-untouched, as part of closing the row** — the append lands after the
   seat's own commit, so left alone it hands the NEXT seat a dirty tree. Goto 1.

**Hard rules:** no commit/push without the relayed call; explicit staging, never `git add -A`, verified
with `verify-staged`; codegen only through the command `patterns/codegen.md` names (when the repo has
one); component files as
`patterns/frontend-patterns.md` states; additive-only, never amend pushed commits; parallel sessions only
when specs share no files — commits sequence regardless; seats run the pipeline's declared default model
(allowlist-exact, set at creation), and an investigation-heavy seat may warrant a reasoning-heavier one.

## The exchange, bare bones (headers only — what a session looks like)

```
COORDINATOR -> Prompt #N: docs preamble, ##PROMPT##, ONE spec + context docs + prior ACTUAL shapes
               + CEREMONY block
SEAT        -> PLAN TLDR (BELIEFS: head/dirty/versions/baselines · the plan, 5-10 lines ·
               QUESTIONS 1..n, options + recommendation), STOP
COORDINATOR -> PARENT RESPONSE — PLAN {ACCEPTED / ACCEPTED-WITH-RIDERS / …} · rulings 1..n
               (DECISION — why) · riders · "Go build."
SEAT        -> (builds free; mid-run question: numbered text, STOP; COORDINATOR ruling; resume)
SEAT        -> FINAL TLDR — (a) SHIPPED+VERIFICATION (b) VERBATIM RUNNER SUMMARIES (c) HONEST GAPS
               (d) DEFERRED FINDINGS (e) LIVE CHECKLIST (f) STAGING + commit HELD + cost
COORDINATOR -> FINAL TLDR ACCEPTED (+ what the coordinator verified itself) · 1. docs-write, carry: …
               · 2. COMMIT CALL — message: … · then push, report hash
SEAT        -> books the working doc, commits, pushes, reports hash + post-push status
COORDINATOR -> tracker row SHIPPED {hash}; transcribes findings; cuts Prompt #N+1
```

## The blackboard — where the exchange lives

The exchange above is not just chat — it is a pair of FILES per build session:

- **`tldr.md` — the chat.** Append-only, two voices: the seat's PLAN TLDR + numbered
  questions, the coordinator's ruling appended beneath them, optional mid-build updates +
  `## PARENT NOTE`s, then the FINAL TLDR. Read top-to-bottom it IS the session's whole
  conversation, greppable by anchor.
- **`plan.md` — the document.** The full plan, posted once, corrected on pushback. PULL-only:
  the coordinator reads it on a `read-full-plan` verdict; it is never force-fed into a wake or chat.

**`sessions/` is the pipeline's conversation, and the whole effort's durable record.** One folder per
pipeline, **brought into existence by the FIRST seat's close-out commit** — never authored when the
pipeline is written, and never with a placeholder — then written into by every later seat, and archived
with the effort:

```
docs/research/{topic}/sessions/         <- per-session work in {spec-slug}/, effort-wide at the root
  {spec-slug}/plan.md        each seat   the full plan, posted once, corrected on pushback (PULL-only)
  {spec-slug}/tldr.md        each seat   the two-voice chat — seat turns AND coordinator rulings interleaved
  code-review.md             the review  the outside look, if the pipeline had a review row
  parent-retrospective.md    the coord.  the close-out audit (the inside look)
  witness-ledger-*.md        a human     the witness is zero-writes, so its ledger arrives by hand
```

Two files per build session; questions ride the TLDR, and there are no status snapshots because the
tracker is committed live. **It is TESTIMONY** — an archive pass repairs links elsewhere and leaves
`sessions/**` byte-untouched, because editing a record to make it tidy is how it stops being one.

Where they live — **hand-cranked:** `docs/research/{topic}/sessions/{spec-slug}/` (ordinary
repo files, staged at close-out; the coordinator appends rulings with its own file tools; the
human's relay is a one-line nudge each way).

<!-- control-plane-specific -->
**Hosted — there is no folder tree the controller can read.** A seat **carries its bytes** to
`post_plan` / `post_tldr` (verbs under `acts:write`, so a witness ticket structurally cannot post), and
everything identifying is **server-derived** — pipeline and seat from the verified ticket, and **the rev**
(newest + 1). *A rev nobody can misstate cannot regress by accident.* The append-only guard is what
survives the transport: the ladder only climbs, a shorter file is refused, and the same rev with
different bytes is refused — so the mirror **cannot be clobbered or rewound by a caller that lies, even
though it can be fed.**

**The coordinator's voice is NOT in the seat's file on the hosted plane.** A coordinator answers with
`callout` (its sixth drive verb, machine-written, the only downward path), which persists on its own
artifact lane and closes the question in the **acts ledger**. So **the file says whether a question was
ASKED; the ledger says whether it was ANSWERED**, and a seat typing a parent-voice heading into its own
TLDR closes nothing. `callout` **refuses when the charge has no live session** — a coordinator must
`seat_spawn` before it can rule — and reports **"RULING RECORDED, NOT DELIVERED"** in those words if the
transport drops it.

The parent-voice block (machinery-written hosted; the hand-cranked coordinator writes it — hand-cranked
there is no rev counter, so the heading is `## PARENT RULING (plan — {verdict})`; the stable grep prefix
`## PARENT RULING` is the contract in both modes):

```
## PARENT RULING (plan rev N — {accept | accept-with-riders | blocking-precondition})

PARENT RESPONSE — PLAN TLDR {VERDICT}. {one sentence naming the best thing in the plan}
Answers:
1. {RULING IN CAPS} — {decision first, then the why}.
...
Go build. Fold the riders in — no re-approval round-trip.
```

Callouts and nudges append as `## PARENT NOTE` (actor-suffixed when known, e.g. `(operator)`).

**The seat's own two anchors:**

```
## [child·{slug} · run {id}] CLOSE-OUT RECEIPT     <- after the push
## [child·{slug} · run {id}] HOLDING              <- "I have pushed and I am waiting"
```

**A question heading, a HOLDING and a close-out receipt are ALL non-staling** — the gates bind an
acceptance to the accepted CONTENT, not to the revision number, so appending your own *state* leaves it
intact. Only **new content** stales. A seat that has pushed and is waiting is otherwise indistinguishable
from a seat that has done nothing, and a coordinator reading a wake led by its own acceptance concludes
there is nothing to rule — the HOLDING anchor is what prevents that. The token is the literal `child·`
whatever seat you are — it is a protocol anchor, not a description of you.

### Questions ride the same blackboard

**When you need a decision at any point after your plan:** append a `## MID-BUILD QUESTION` section
(during recon/plan time the heading is `## QUESTIONS` — two literal headings, one lane, both poke) —
**that literal heading, in every phase including close-out**, because the detector is heading-matched and a
synonym is a question no banner announces and no re-raise can reach — to your own `tldr.md`, post it, and
**end your turn**. The coordinator is woken with your question, and its ruling *is* the answer — so you
pick it up from your own file and resume. Your turn never stays open waiting, and asking costs the
pipeline nothing but the round-trip. Plan-time questions and mid-build questions are the same lane and the
same shape.

An unanswered question is re-raised to the coordinator on a cooldown until a ruling lands, so if the
coordinator cannot rule yet it appends a note saying so — one append ends the reminder.

<!-- control-plane-specific -->
**The human-touch receipt is the loop's own instrument.** Every hand-delivered message to a seat leaves an
`injected_by_human` row, so "how autonomous was this run" is a number, not a floor. The control plane
mints it on the one authenticated steering door, before the bytes move. The count's credibility rests on
the credential: **a receipt the audited party can mint is not a receipt** — which is why the steering
door takes the human's own token and never a seat's job ticket.

## Lineage
- **Related** — [docs-workflow](docs-workflow.md) · [doc-index](doc-index.md) · the `spec-parent` and `spec-seat` skills (the operational templates and the seat contract)
