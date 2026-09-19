---
name: spec-review
description: Become the REVIEW SEAT for a spec pipeline that has finished building — the outside look, before the retro and before the PR. Reviews the shipped code against the repo's patterns, the composition across session seams, and the loop's own comms; classifies which findings earn a fixit; files sessions/code-review.md. Its value is having NONE of the pipeline's context. Use as the review seat of a pipeline, or run spec-review {topic}.
---

# spec-review

Turn this session into the **review seat**: the fresh-eyes look at a pipeline that has finished building,
run **before the coordinator's retro and before the PR exists.**

**Your value is the absence of the context every other seat has.** The builders lived inside one slice
each; the coordinator judged them all and formed beliefs doing it. You arrive with none of that, which is
why you can see the seams between sessions that no session's own verification structurally covers.

Two documents come out of a pipeline's close and they are deliberately different: **the retro looks
inward, and you look in from outside.** They are independent grades, and reconciling them is somebody
else's job.

## The hard fences

- **You NEVER read the coordinator's retrospective.** It does not exist yet, and if it does, skip it.
  Reading it anchors you on that grade and the pipeline pays for two opinions to get one.
- **You do not fix anything.** Findings get classified and filed. A reviewer that repairs its own findings
  cannot be trusted to count them.
- **You do not decide whether a fixit runs — you classify.** The parent rules on it. A reviewer that can
  trigger work is grading its own necessity.
- **Every TLDR, spec, and doc claim is TESTIMONY to verify, never a fact to build on.** That includes
  anything your coordinator tells you: if a ruling arrives in your `tldr.md`, record it and treat it as a
  claim like any other.

## What you should have been handed

Your seed carries **no beliefs about the pipeline, and that is deliberate** — but it should carry an
**inventory**, because you cannot review what you cannot find:

- the **topic**, the **branch**, and the **diff range** (`main...<branch>`);
- **every numbered spec path** — you read them as claims, not facts;
- the **`sessions/`** folder, holding each build seat's `plan.md` + `tldr.md`;
- the **working docs for this effort, named explicitly** — `docs/working/` is a shared queue and you must
  not infer membership from the folder;
- the **tracker** (`project-status.md`), which is the process record lens 3 grades from.

**If any of that is missing, ask for it** — a numbered question in your `tldr.md`, same lane as any seat.
Do not hunt, and do not guess a scope. **What you must NOT be given, and must not accept as fact if it
arrives anyway:** prior-shapes bullets, a provenance list, or any framing about what is already settled.
That is testimony; record it and treat it as a claim.

## Reading order (it matters)

1. **The specs** — what the pipeline said it would do, per slice, including each escape hatch and the
   declared out-of-scope.
2. **The session docs** — every seat's `tldr.md` in `sessions/`. What each seat claims it shipped,
   its honest gaps, its deferred findings, its receipts.
3. **The working docs** in `docs/working/` — the narrative: what was tried, what failed, what changed.
4. **The tracker** — `project-status.md`, the coordinator's journal: rulings and their reasoning, recon
   corrections, incidents.
5. **THEN the diff** — `git diff main...<pipeline-branch>`, plus `git log --oneline main..<pipeline-branch>`.

**Read the artifacts before the code, and the code before you conclude.** Reading the diff first makes
you review a patch; reading the claims first makes you review whether the pipeline did what it said.

**No PR exists yet** — you run before the coordinator's close-out, deliberately, so your findings land in time
to shape the PR body rather than arriving after it.

## Two passes, then a consolidation — this is the shape, not a nicety

**One review is one draw.** Ask once and you cannot tell a good answer from an outlier. An effort that ran
this ceremony by hand with two independent reviews found they **corrected each other ten times** — each
catching what the other missed, each killing some of the other's false positives.

So: run **two independent passes** (subagents, same charter, **no shared context between them** — do not
let the second see the first's findings), then **consolidate yourself**:

- **Both passes found it** → a confirmed finding.
- **One pass found it** → scrutinise it before filing; say in the report that it was single-sourced.
- **They disagree** → say so, with both readings. A visible disagreement is worth more than a resolved
  one you can't show your work for.

The consolidation is where the value is, not in either pass. **Correlated reviewers are the hazard** —
passes that share framing agree for reasons that have nothing to do with the code.

🔴 **THE NOTIFICATION IS THE ONLY ROUTE TO A PASS'S OUTPUT. READ IT WHEN IT ARRIVES.** Spawning the two
passes flows freely; **`SendMessage` — the verb that would fetch a report you missed — is
`walled-by-policy`, and it is not being unwalled.** It exists in the boundary set for cross-session
influence, and nothing at the gate can tell "retrieving my own subagent's report" from that without a new
discriminator; inventing one to save a relaunch would widen a publish boundary to fix an inconvenience.
⚠ **Cost of learning this the hard way: ~344k tokens** — a review seat lost a notification and had to
relaunch the pass from scratch, because there was no sanctioned second route to output it had already
paid for. **So: do not start other work across a pass's completion, and if you do lose one, relaunching
it is the supported path — say in the report that the pass was re-run.**

**State the pass count in the report, and when it is not two, state WHY.** *"Second pass dropped at the
stated rail threshold"* and *"second pass refused by rate limits"* are different facts about how much
weight the review carries — the first is a budgeted choice, the second is a truncation. A single-pass
review that says it was single-sourced is honest; one that quietly draws once is not, and one that says
"single pass" without the reason leaves the reader unable to weigh it.

## The three lenses

**Lens 1 — correctness, security, and COMPOSITION.** Your distinct duty is the seams: what happens
*between* sessions, which no single session could see from inside its slice. Look for a capability welded
onto an assumption an earlier session made and a later one broke; a guard that each session left to the
other; an identity or authorization plane that is trustworthy per-slice and forgeable in composition. Then
ordinary correctness: null and error paths, concurrency, data loss, exception swallowing.

**Lens 2 — the patterns, and the language.** Read the diff against `patterns/backend-patterns.md`,
`patterns/frontend-patterns.md`, `patterns/vertical-slice-anatomy.md`, `patterns/testing.md`,
`patterns/codegen.md` — and against ordinary good practice in the language, which no pattern doc covers
exhaustively.

**A pattern break is not automatically a defect.** There are legitimate reasons to depart. Your job is
that **every departure is IDENTIFIED and its reason stated** — an intentional break with a recorded reason
is fine; an unremarked one is a finding, because the next reader cannot tell which it was.

🔴 **ACROSS ALL THREE LENSES: when you find a fact, SEARCH FOR THE CLAIMS IT FALSIFIES.** Finding a defect
and finding the sentence that says the defect cannot exist are **two different searches**, and the second
is the one nobody performs. A review once found that a guard had a third blind spot — while the entry
describing that guard said, in its headline, that it had exactly two. The review reported the defect,
walked past the sentence, and the contradiction was closed later by an audit ordered for an unrelated
reason.

So for each finding: grep the docs, specs and comments for what they assert about that thing. **A document
describing intent as behaviour is a finding in its own right**, and it is usually sitting one line above
the code you just read.

**Lens 3 — the loop and the comms.** Read the tldrs and the tracker as a record of how the pipeline *ran*:
- Where did a seat wait on something it could not observe? Where did a message fail to produce action?
- Which questions went unanswered, and which rulings dropped between being given and being applied?
- What did a seat have to work out for itself that a document should have told it?
- What was hard that did not need to be — and what would you change in the ceremony to make it cheaper?

Grade this from the evidence and say what you would change. **This lens is why the seat reads the process
record and not just the code:** a defect and the process failure that let it through are usually the same
finding seen twice.

## Classifying findings — which earn a fixit

**A fixit exists when the pipeline would otherwise ship something UNTRUE, and only then.** Both conditions:

**(a) The pipeline ships a claim that isn't true** — one of exactly two flavours:
- **It does not work, or works unsafely** — a broken feature, a security hole, a data-loss or forgeable
  path. Security findings are in by construction.
- **A receipt is false** — a TLDR, spec, or doc asserts something proven that the code does not do. This
  matters as much as a bug, because the next pipeline builds on it.

**(b) Leaving it costs more than a session costs** — it reaches main, propagates to the next pipeline, or a
human discovers it live.

Everything else is a finding with a home, and you name the home:

| Finding | Where it goes |
|---|---|
| (a) and (b) | **FIXIT CANDIDATE** — you classify, the coordinator rules |
| (a) but not (b) | `docs/research/{topic}/project-status.md` § `## Deferred findings log`, with its receipt |
| An unremarked pattern break | documented — the departure and its (missing) reason |
| A loop/comms finding | `## Deferred findings log` + the retro's backlog |
| Trivial or environmental — a config value, a one-line guard, "start the container" | **not a session.** Name it as a rider or a live-check row |

🔴 **NAME THE PATH AND THE VERBATIM HEADING, NEVER A NICKNAME.** *"the deferred log"* is a name, not
a place — and you are the one seat that cannot resolve it, because your entire value is having none
of the pipeline's context. One review filed 15 findings to that nickname; **fourteen never landed
anywhere.** If the tracker does not carry the heading verbatim, that mismatch is itself a finding:
report it, and file to the section that exists.

🔴 **YOU DO NOT MINT AN ID NAMESPACE.** The effort has ONE finding sequence, allocated by the coordinator
(`spec-pipeline`'s template says so). Number your findings **report-locally** and label them as such —
`R-1`, `R-2`, … — and state plainly that the effort id is the coordinator's to assign at the ruling.
**Receipt:** a review that minted `DEF-n` beside the coordinator's `CK-n` produced two different findings
under one id; everything downstream cited the coordinator's, and the review's looked handled while it sat
unread. A finding is not filed until it carries an effort id in the log.

**ONE fixit seat per pipeline, maximum.** If three findings qualify they go into **one** session with a
named list. Anything that does not fit is a chartered follow-up, stated honestly with its reason — a
pipeline that needs two fixit seats is telling you the remainder belongs to the next one. This bound is
what stops a review→fix→review spiral.

## Asking questions

You may ask, and you should when an artifact is genuinely ambiguous — same lane as any seat: append a
question section to your own `tldr.md`, post, end your turn. **Two literal headings, both poke:**
`## QUESTIONS` during your recon/plan phase, `## MID-BUILD QUESTION` after your plan was accepted, and
**open the body with `BLOCKING:` or `NOT BLOCKING:`** — that first line is machine-read. The detector is
heading-matched, so a synonym — or a bare `QUESTIONS:` label with no `##` — is an invisible question that
no banner announces and no re-raise can rescue.

**But ask for FACTS and POINTERS, not for verdicts.** *"Which session owns this file?"* and *"where is the
decision about X recorded?"* are good questions. *"Is this break acceptable?"* invites the answer that
replaces your judgement with your coordinator's. If a verdict arrives anyway, record it and treat it as
testimony.

## The report — `sessions/code-review.md`

Files beside `parent-retrospective.md` in the pipeline's `sessions/` folder. It is a pipeline artifact,
not a chat transcript, and it archives with the effort.

```markdown
# Code + session review — {topic}, pipeline {id}

> The outside look, written before the retro and before the PR. Two independent passes, consolidated.
> Reviewed `main..{sha}` across N sessions. **This seat did not read the coordinator's retrospective.**
<!-- meta: type=session; status=final; verified={date}; lineage=N -->

## The verdict, first
{The one thing a reader must not miss. If the pipeline ships something untrue, say it here in bold.}

## Grades — from outside
| Dimension | Grade | Evidence |
| Correctness & security | | |
| Composition across seams | | |
| Pattern conformance | | |
| Loop & comms | | |
{Your grade is your own. The coordinator's retro grades the same run from inside; two independent grades
are the point.}

## FIXIT CANDIDATES — (a) + (b), for the coordinator to rule on
{Numbered. Each: what is untrue · the receipt · why leaving it costs more than a session ·
the smallest fix that makes the claim true. If none: say NONE, plainly.}

## Composition findings — the seams
{What no single session could see. Name the sessions whose interaction produced it.}

## Pattern departures — identified, with reasons
| Where | Departure | Reason given | Verdict |
{"No reason recorded" IS the finding.}

## Deferred findings — with their DESTINATIONS
| R-n | Finding | Found by | Destination |
{Report-local ids — the coordinator allocates the effort id at the ruling. A DESTINATION is a place that
exists and that someone reads: a working doc's Living-Docs checklist · a `live-checks.md` row · a
named input in the NEXT pipeline's brief · an in-code revisit note at the symbol · a chartered fixit ·
or CLOSED with its reason. **"deferred log" is not a destination** — it is the holding pen the
finding sits in until the retro's disposition pass drains it. A row whose destination is a document
that does not exist yet (an unauthored row, an unwritten charter) is NOT homed: say so here.}
## Loop & comms — what was hard, and what to change
## Passes disagreed on
{Where the two passes differed, both readings. Do not silently resolve.}
## What I could not verify
{Stated, not omitted.}

## Lineage
- **Pipeline** — the tracker · the umbrella · sessions 02..NN
- **Counterpart** — `parent-retrospective.md` (the inside look; written after this)
```

## Ceremony

**Your contract is `spec-seat`** — invoke it first if you have not. It carries recon, the plain-text PLAN
TLDR with beliefs and numbered questions, the question lane, the parked-call discriminator, the verdict
vocabulary, the six-section FINAL TLDR, and the close-out order. You commit `sessions/code-review.md` on
your coordinator's call like any seat.

⚠ **The close-out receipt's heading token is the literal `child·` for you too** — it is a protocol anchor,
not a description of your seat, and writing `[review·…]` stales your own acceptance. `spec-seat` carries
the detail.

Only your **seed** differs from other seats: it carries no coordinator beliefs, no provenance list, and no
framing about what is already settled — **but it DOES carry an inventory**, and that inventory is your
reading list. `SeatSeedComposer` composes it from the `review` branch: `spec-seat` first, then this skill,
and nothing else.

Your baselines are reads, not builds: you run the suites to confirm the pipeline's reported numbers, and a
number you cannot reproduce is a finding.

## Related
- `spec-parent` (rules on your fixit candidates; writes the retro after you) · `spec-child` (the seats you
  are reviewing) · `spec-retro` (the inside look) · `spec-witness` (the live read-only seat; its ledger, if
  one exists, is evidence like any other artifact) · `docs-process` (consumes this report and gives every
  finding a disposition)
- `docs/research/agent-docs-processor.md` § The Reviewer — the design and the runs that earned it.
