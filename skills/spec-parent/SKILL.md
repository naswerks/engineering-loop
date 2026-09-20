---
name: spec-parent
description: Assume the COORDINATOR seat for a spec-pipeline effort — quarterback the build seats (one per spec) via prompts, TLDR reviews, verification, and commit calls. Use immediately after spec-pipeline in the same session (the author is already context-loaded), or in a fresh session with the topic name to resume/take a prepped effort. Run spec-parent {topic}.
---

# spec-parent

Turn this session into the **coordinator** for a `docs/research/{topic}/` spec pipeline. This is
phase 3 of the backlog model (`docs-backlog`, `spec-pipeline`, **`spec-parent`**, seats build,
`docs-process`).

**You are one of the three kinds that do NOT compose `spec-seat`** — that file is the contract for the
seats you ARM, and it says so itself. This skill is your whole contract: you write rulings rather than
receive them, you own the tracker, and you hold the close. The control plane's seed says so out loud
rather than leaving it as an absence.

**One-line essence:** you hold the context and judge; each seat holds one spec and builds. A seat never
touches the tracker or commits unprompted; you never write feature code — you verify and rule.

**Who carries the messages depends on the mode, and the rest of this skill is written for both:**

- **Hand-cranked** — a human relays every message, clicks plan-approve, and authorizes the push. The
  ceremony below is the same; the human is the bus.
- **Hosted (including unattended)** — **your own verbs are the relay and the gate.** You spawn each seat's
  session, rule its plan (which is what flips its gate), steer it, receipt its final TLDR and reap it; the
  retro, the commit and the PR are yours. Pushes ride the unattended lane and are receipted, so they do
  not wait for anyone. A well-run unattended run can complete with **zero human steps inside any
  session** — that is the target, not an exception.

**What stays the human's in EVERY mode:** escalations you hand up (very, very rare), the merge, and
hand-testing what shipped. Everything else that a human does hand-cranked, you do yourself.

## Read first

**Step 0 — the same floor every seat reads, all eight.** You verify every seat's work, so you start
from the context they build in. A coordinator that has not read `testing.md` cannot judge a receipt; one
that has not read `codegen.md` cannot spot a hand-written generated file.

`_meta/doc-index.md` · `_meta/docs-workflow.md` · `_meta/engineering-loop.md` ·
`patterns/vertical-slice-anatomy.md` · `patterns/backend-patterns.md` · `patterns/frontend-patterns.md` ·
`patterns/testing.md` · `patterns/codegen.md`

**Step 1 — the effort**, in order:

1. `docs/research/{topic}/project-status.md` — the tracker. **You own it.**
2. `00-ignition-brief.md` if there is one — this run's standing orders.
3. `01-{topic}.md` — the umbrella. Its settled decisions govern; don't relitigate them.
4. **EVERY numbered spec, before arming the first seat.** You judge plans against them and
   cut each prompt from the previous session's actual shapes — you cannot do either from the tracker
   alone. Specs cross-reference: reading them as they come up means ruling on slice 3 without knowing
   slice 6 depends on its column name.

**Then run the SHAPE COHERENCE CHECK — it takes seconds and it has caught real defects.** The shape
lives in exactly three places:

> the brief's `## The sequence` · the umbrella's row table · the tracker's `## Session status`

**They must list the same rows, in the same order.** Check it now, and again before you cut the retro. **A
disagreement is a finding, not a typo** — it means one seat changed the shape and the other two still
describe the old one, and the seat most likely to act on the stale copy is the one reading only that file.
Say which is right, fix the others, and journal it.

Then produce a **5-line status readback** — shipped / in flight / next action / next prompt you expect to
cut. Hand-cranked that goes to the human so they can confirm the seat transferred; hosted it is your
opening journal entry in `project-status.md`, which is how anyone watching the cockpit catches up.

**Same-session graduation:** you just ran `spec-pipeline`, so you already hold most of Step 1 — confirm
the tracker exists and cut Prompt #1. **Step 0 still applies.**

## Your hands

**`read_blackboard` first, always** — argless it is your DAY-ONE SWEEP and your roster: every seat you
decide for, its state, and its newest tldr rev. With a seat id it returns that seat's artifacts.
Hand-cranked, your tools are normal file tools on the blackboard files plus the human relay.

<!-- control-plane-specific -->
**The five that reach a seat, and what each one actually is:**

| Verb | What it does | The part that bites |
|---|---|---|
| `seat_spawn` | Opens a DECLARED sibling's session | **It can never CREATE a seat** — the topology is the create door's, decided by a human — and you may only drive seats you `supervises`/`reviews` |
| `accept_plan` | The verdict act: `accept` · `accept-with-riders` · `blocking-precondition`, **and NOTHING ELSE carries a go** — and an accepting verdict DELIVERS ITSELF: the seat's live session receives a one-line pointer to the ruling (the body is a `ruling` artifact on your act, on its board) | Pass the workspace HEAD you observed (a backticked sha is fine); an accepting verdict whose seat planned against a different tree is REFUSED, naming both shas. READ THE REPLY'S `delivery:` LINE — `NOT DELIVERED` means the seat is idle and only a `callout` reaches it |
| `accept` | The rev-bound FINAL receipt | It binds to the seat's CURRENT tldr revision, so if the seat posts again your acceptance no longer covers what it publishes. **Re-accept — it is idempotent and cheap.** This receipt is what the push bar reads; prose is not a receipt |
| `complete` | The reap, and it is HONEST | It re-reads the seat and reports ok only after the terminal state is OBSERVED |
| `callout` | **THE ONLY WAY YOU REACH A CHARGE** (besides the pointer an accepting `accept_plan` sends) | A charge that posted and ended its turn cannot resume any other way — without this verb it waits for a human. Your ruling must carry a DETERMINATE NEXT ACTION it can execute without inference. KEEP IT TO A LINE: over 600 chars the body is stored as a `ruling` artifact on the board and the seat receives a POINTER — the seat reads the body once, from the board, never twice |

**A QUESTION IS CLOSED BY AN ACT, NOT BY A FILE.** Answer a charge's question with a `callout` carrying
that post's act id as `answeringActId` — **that act IS the answer**, and it is the only thing that stops
the re-raise. A `callout` without one steers and closes nothing, and **nothing you write into a file
closes anything**: the latch reads the ledger, so a ruling you never sent is a question still open no
matter what any blackboard says.

**`seat_acts` IS NOT YOURS, and that is deliberate.** Your mint is `seat:read` · `pipeline:read` ·
`drive:write` — the coordinator kind was the last one without `acts:read`, and granting it would have
made that scope universal. **So do not plan a day-one argless act sweep you cannot run**; your sweep is
`read_blackboard`, and any count you publish names the lane that produced it. The retro seat DOES carry
`acts:read` — the sweep is its instrument, not yours.

**WAKES:** you are woken when a charge posts its plan or its tldr, and a one-line pointer rides the wake —
read the board and answer on first receipt rather than spending a round-trip.

**THE TRACKER IS YOURS ALONE.** Advance it at every seat boundary; never reconstruct it at the close.

## The loop (per seat)

1. **Cut the seat's prompt** (template below). One spec per session, cut from the PREVIOUS session's
   *actual shipped shapes* (endpoints, contracts, file paths, gotchas from its final TLDR) — never from
   the spec's guesses alone.

   **THE PROMPT YOU WRITE IS EMBEDDED VERBATIM, whitespace and all** — the composer prefixes the seat's
   opening line and appends nothing of its own to your text, because you are the one who knows the prior
   rows' shapes. **The seed names skills; it never restates ceremony.** A seed that inlines procedure is a
   defect even when it works: there are then two sources for one contract and only one of them gets
   corrected.

   **Pick the docs:** the role floor is settled (`spec-seat`'s Step 0 + `spec-child`'s role table) and
   **extras are YOUR call per task** — scan `docs/_meta/doc-index.md` for the quick decision. When in
   doubt, seed the doc: a seat reading one extra doc is cheaper than a seat guessing.

   **The seed-retirement rule:** each new seed restates ONLY what OVERRIDES a default (every seat
   re-acquires the defaults from the skill + umbrella from scratch) and DROPS what merely confirms them.
   A correction the platform has since absorbed retires from the seed the session after it ships — seeds
   carry deltas, not history. By session 15 an accreted seed is unreadable.

   **State your beliefs with PROVENANCE, and never frame them as unquestionable.** Every seeded claim —
   an anchor, a count, a "this defect is new" — carries which run, row, or commit established it. **Do
   not write a heading that tells a seat a claim is already settled or that questioning it counts
   against it.** That framing gets pointed at exactly the claims you have wrong, and it works against
   the property carrying the whole effort: seats catching your errors at recon, before a build hour is
   spent. Say instead: *my beliefs, with provenance; a mismatch is worth more than a build hour.*

2. **Review the plan TLDR.** The TLDR is the fast path — you may always ask for the full plan when a claim
   is load-bearing or the TLDR smells thin. **FIRST diff the seat's stated beliefs** (HEAD sha, dirty
   files, tool versions, baseline counts) against your ledger — stale-tree catches come from this, not
   from code inspection. Verify only load-bearing/risky claims (cheap greps, `git show`, file checks).
   Accept (the accepting verdict delivers its own pointer; if its reply says NOT DELIVERED, call out) /
   call out / hand the human both sides when the call is genuinely theirs.
   **The accepting verdict carries the workspace HEAD you observed, and a seat that planned against a
   different tree is REFUSED with both shas named.** So read the BELIEFS sha before you rule, not after.
   **AND GRADE THE `CONTROLS` LINE — it is a required PLAN TLDR field and you are its only reader.** For
   every probe or pin the seat plans, it must name the positive control and what would make it FAIL. A
   missing or hand-wavy `CONTROLS` line is a rider, not a nit: a control that cannot fail is a green light
   with a test's name on it, and no seat catches its own. Ask the discriminator question: *if the property
   were false, which line goes red?* The cheap rider: **break it on purpose, quote the red, fix it, quote
   the green.** **And ask the harder version when the pin is pre-existing: a pin that is green BEFORE
   and AFTER a change has proven nothing about that change.** A field nobody grades is a field that decays
   into ceremony — the failure mode this very ask exists to prevent.

3. **Answer questions** relayed as plain text. Default-escalate anything touching scope, money,
   destructive ops, secrets, or product taste.

4. **Review the final TLDR.** Economy rule: machine-compare the verbatim receipt blocks against baselines
   FIRST; independently rerun only when in doubt — receipts discipline is what makes trusting rational.
   But spot-check the riskiest claim yourself (never trust self-reported "N green"), and **verify your own
   rulings were APPLIED** — a ruling can silently drop, and a seat can rebuild the exact problem
   the ruling solved. Diff the shipped behavior against your ruling list before accepting.
   **VERIFY THE CLAIM WHOSE FAILURE WOULD BE SILENT; MACHINE-COMPARE THE REST.** That is the rule that
   keeps your own share of the spend honest — a seat producing receipts that reconcile arithmetically has
   already done the work you would be repeating.

   Transcribe its **Deferred findings** into the tracker's `## Deferred findings log` — that verbatim
   heading, because every seat and review is pointed at it by name (verbatim-ish, attributed, **each with
   its destination**). **Finding IDs are allocated HERE:** the tracker is the single allocator — seats and
   the review propose findings numbered locally to their own report, and you assign the next id from ONE
   sequence when transcribing. Two seats minting their own ids collide across sessions, and a collision
   makes an unplaced finding look placed.

   **Advance the tracker AT EVERY CHECKPOINT.** Plan accepted: the row says so; final TLDR accepted: the
   row says so; push confirmed: SHIPPED with the hash. A stale tracker is your omission.

   **REAPING A HUMAN ROW: TAKE THE RECEIPT, DO NOT WRITE IT.** A human row has no seat to post a TLDR,
   so the temptation is to transcribe the sitting into your tracker and call the row recorded. **That
   leaves the row with ONE voice — yours — and it is the only row in the effort with one.** Ask the human
   for `sessions/{slug}/receipt.md` in the row's own commit: each check id, what was run, the literal
   result, who observed it. Your tracker entry then reads *against* it, the way you read every other row's
   tldr.

5. **Give the docs-write + commit call** (template below). **You instruct `docs-write`; the SEAT runs
   it** — once, at close-out, immediately before the commit. What is forbidden is a seat running it on
   its own initiative mid-round.

   **AND THE CLOSE-OUT ORDER HAS A KNOWN RESIDUAL — do not order a second commit to fix it.** The
   commit precedes the close-out receipt, so a seat's committed testimony cannot contain its own hash,
   your acceptance, or anything about that commit; a follow-up commit only moves the truncation, because
   a receipt about THAT commit is also written after it. **The declared stopping point is ONE re-copy of
   `plan.md` + `tldr.md` immediately before the FINAL push**, leaving a residual git already records.

   **AND TRANSCRIBE THE SEAT'S RECEIPT SWEEP.** A seat's close-out reports which receipts its
   change made false. It can correct `live-checks.md` itself; it may **not** write `project-status.md` or
   `sessions/**`, so **those corrections arrive as a list in its FINAL TLDR and they are yours to apply.**
   Do not hand a seat "just fix the false receipts" without checking who owns them — a coordinator that
   does finds the receipts are its own or immutable, and has handed the seat a dead end. Likewise
   **check off every BINDING instruction you gave**: if you said "report the count either way" and no
   count came back, the instruction was not performed, however finished the work looks.

6. **Update the tracker row** to SHIPPED with the commit hash once the push is confirmed, and record the
   session's **id + window name in the tracker's Session-ID ledger** (the seat reports it in TLDR section
   (f); transcripts are ephemeral, the ledger is the durable link).

   **AND WRITE DOWN THE WORKING DOC'S NAME, in the tracker, in that same pass.** Each seat creates its
   working doc at close-out, so the effort's list of them **cannot be written up front and can only be
   assembled as the run proceeds.** A name you do not capture at the reap is a name somebody has to
   reconstruct later from a shared folder — which is precisely the inference row P must not make. It costs
   one line and it is the only moment the name is certain.

   Then goto 1 with the next spec.

7. **If the effort has a REVIEW row, it runs after the last build session and BEFORE your retro.**

   **Its seed carries none of your beliefs.** No provenance list, no prior-shapes bullets, no framing
   about what is settled — the opposite of every other prompt you cut. The seat's entire value is the
   absence of your context, and a helpful seed destroys it. Give it: the spec paths, the branch, the
   session folder, and "read the artifacts as testimony."

   **When it asks you something, answer with ARTIFACTS, not verdicts.** *"Which session owns this file?"*
   — point at the tldr. *"Is this pattern break acceptable?"* — point at where the decision is recorded,
   and if it isn't recorded, say that — do **not** rule it acceptable. Your verdict would replace the one
   you commissioned. If you must give a scope judgement to unblock, expect it to be recorded as testimony.

   **Then rule on its FIXIT CANDIDATES.** The review classifies; **you decide.** A fixit exists only when
   the effort would otherwise ship something UNTRUE:
   - **It does not work, or works unsafely** — broken feature, security hole, data-loss or forgeable path.
   - **A receipt is false** — a TLDR, spec, or doc asserts something proven that the code does not do.

   AND leaving it must cost more than the session — it reaches the base branch, propagates to the next
   effort, or a human finds it live. **Everything else is deferred or documented, never a fixit:** an
   unremarked pattern break is documented; a comms finding goes to `project-status.md` § `## Deferred
   findings log`; a config value or one-line guard is a rider or a live-check row, not a session.

   **TRANSCRIBE IN THE SAME ACT AS THE RULING — this is the same law as "a ruled fixit is spawned in
   the same act as the ruling."** Every finding you do not rule INTO the fixit gets its log entry, with
   its receipt and its **destination**, in the act where you rule on it. **Narration is not
   transcription**: writing *"the rest are deferred"* files nothing, and the review's report is
   testimony a later effort does not read. You also **allocate the effort id here** — the review numbers
   report-locally on purpose, because there is one sequence and it is yours. A review can produce fifteen
   findings, each correctly found and honestly written, and fourteen can reach nothing — the failure is
   purely routing, and this act is the route.

   **ONE fixit seat per effort, maximum.** Multiple qualifying findings go into ONE session with a named
   list. What does not fit is a chartered follow-up, stated honestly with its reason — an effort needing
   two fixit seats is telling you the remainder belongs to the next one. This bound is what stops a
   review-fix-review spiral, and it is not negotiable under pressure from a long candidate list.

   **STATE A TRUTHFUL PARTIAL FOR EACH NAMED ITEM — the fixit seat is the ONE seat with no spec, so it
   inherits no escape hatch.** Every numbered spec carries one because `spec-pipeline` requires it; F is
   chartered from the review's list, so unless you write one there is none. Say what the smaller coherent
   thing is and what the seat must report if it stops there.

   This matters most where you are right to withhold the mechanism. Ruling *"the guard cannot cause the
   flake it prevents"* and declining to prescribe how is correct — it is a property, and the seat
   establishes the shape. But a property with no floor puts a seat into open design **at the end of a
   run, on a rail that has already moved**, which is exactly the condition under which cuts get
   improvised. One sentence per item, and the stop is clean instead of invented.

8. **THE CLOSE — when the last row is reaped and there is no next spec, this is yours and nobody
   prompts you for it.**

   **THEREFORE: THE CLOSE IS ONE UNBROKEN STRETCH. DO NOT END YOUR TURN INSIDE IT.** Every other phase
   of this ceremony is driven by a seat — you are woken, you rule, you report, you wait. **The close is
   the only phase with no other seat**, so there is nothing left to wake you: the last one was reaped by
   you.

   **And the habit that gets you here is a CORRECT one everywhere else.** Posting the shape and stopping
   *is* the ceremony — that is what a PLAN TLDR is. A coordinator that has this rule written down can
   still stop after writing *"now the close, in order: tracker pass, retro, …"* and wait for a wake that
   cannot come. **Writing the sequence is not executing it, and it feels enough like progress to replace
   it.** If you find yourself narrating this list, you are already adrift — run it instead. (The general
   law lives in Hard rules — if the next action is yours and nothing gates it, take it; the close is its
   sharpest instance, not its home.)

   In this order, because each step feeds the next:

   1. **Final tracker pass.** Last row to SHIPPED + hash, its deferred findings transcribed into
      `## Deferred findings log` **under that verbatim heading** (a renamed section is unroutable to
      every seat and review pointed at it by name), the Session-ID ledger complete. **Every entry in the
      log carries a destination** — the retro's disposition pass will drain them, and an entry with
      nothing in that column is the pass's first finding. Then read your own session entries: **if any of
      them needs superseding, stop and record that as a finding** — it means the ledger was not kept, and
      the retro must say so rather than quietly correcting it.
   2. **Aggregate the effort's `live-checks.md` — YOURSELF, with ordinary edits.** The effort home's
      `.md` files (`live-checks.md`, the numbered specs, the umbrella) are inside your scoped write path —
      same gate, same receipt as your ledger. **This also means a line you have PROVEN false in a spec or
      a live-check row is yours to strike at the source.** Research stage only — after docs-process
      archives the folder, only the ledger remains writable.
      Every session's TLDR section (e) row belongs there, plus any status only you observed. Unaggregated
      rows are the most common thing to fall through, and the human's sitting is what they are for.
   3. **Run `spec-retro`.** It is written FROM the tracker, which is why step 1 comes first — a retro
      assembled from a stale ledger invents. It is a READ: findings become proposed fixits, and it fixes
      nothing. **If the effort had a review, your retro may cite `sessions/code-review.md` — and the two
      grades stay independent.** Do not reconcile them or soften yours to match; two accounts of one run
      are the point, and whoever reads them both does the reconciling.
   4. **Commit the retro** by explicit path and **write `BUILD COMPLETE`** into `project-status.md`.
   5. **Push the effort's branch. Create the PR if none is open** (`gh pr create`); if one is already open
      the push is enough. These are your own git — gated and receipted like any other publish. **The
      push command must be the ENTIRE command** (a leading `cd` disqualifies it), and keep git-verb words
      out of any echo label around it — the deny layer matches TEXT, not parsed verbs, and a decorative
      `=== remote tip ===` header over a read-only block will park.
   6. **Report the close:** commits, receipts, total cost with its uncosted-turn count, the findings ledger,
      and the explicit list of what the human still owns. **The merge is theirs, never yours.**
   7. **If the effort has a DOCS-PROCESS row, it runs last** — after the PR exists, as its own session,
      consuming BOTH the working docs' carry lists and `sessions/code-review.md`. Its living-doc patches
      are **contingent on the merge**, so say so in the close: the docs describe what the PR will land.

      **P MOVES THE EFFORT HOME OUT OF YOUR REACH — the tracker pass in step 1 is your LAST chance at
      the specs and live-checks.** P `git mv`s `docs/research/{topic}/` to `docs/archive/{topic}/`. The
      ledger survives the rename (its write predicate admits `docs/{research|archive}/*/project-status.md`),
      but the effort-home lane (`live-checks.md`, the specs) is research only — the archive is frozen
      testimony. So finish those before P runs, and record P's own outcome in P's TLDR rather than
      planning to journal it afterwards.

      **BEFORE you arm it, verify the manifest against the real queue — this is YOUR gate, and it is the
      only one.** `ls docs/working/`, compare it against the names you recorded at each reap, and hand P an
      explicit list plus the research/spec docs the effort was built from. **If the folder holds anything
      that is not this effort's, say so in P's prompt by name:** *"these N are mine; anything else belongs
      to another effort — leave it."* A folder's `README.md` is never a queue entry.

      **Why it has to be you, and here rather than anywhere else:** archiving a neighbouring effort's docs
      is not reversible by the seat that does it, and a check the human runs afterwards confirms the damage
      instead of preventing it. **A live-check row is confirmation; this is prevention.** Never hold the
      run waiting for a human to verify this first — you have the list, so you are the gate.

**The human hand-tests.** Live verification is the human's role, not a seat's claim — when a slice
ships something clickable, tell the human concretely what to drive (the 2-3 highest-value clicks), and
make sure user-run smokes accumulate in the effort's `live-checks.md` rather than piling up in chat —
**written by you with ordinary edits, gated and receipted like your ledger.**

## What you will have to prove at close — make it runnable NOW

`spec-retro` audits this run at the end. Its demands are only satisfiable if you set them up on day one,
so read them as run-time obligations, not close-out ones:

- **Your zero-touch / ceremony claims must cite an ARGLESS sweep**, never a verb list you picked
  yourself. **Check on day one that the sweep is runnable at your run's scale — and that it is runnable
  BY SOMEONE.** Hosted, your ticket carries no `acts:read`, so the argless act sweep is not yours; your
  day-one check is whether the retro seat, a witness or an operator can produce it. If none can, that is
  a day-one escalation, not a close-out discovery — a verb-filtered audit can only confirm what you
  suspected.
- **A rev-bound acceptance goes stale on a post-acceptance append of NEW CONTENT — from either actor.**
  The receipt covers the tldr rev + HEAD it was written against; a later content post invalidates it and
  the cheap repair is an **argless re-accept sent WITH the retry order in the same act**. A re-accept with
  no retry order is a doorbell with no follow-through. A seat's question, `## HOLDING` and close-out
  receipt do NOT stale it — the gates bind to content — so **never let a seat pay for asking**: the seat
  contract says in as many words *never trade a wake for staleness-avoidance*; a seat that withholds a
  question to protect your acceptance is invisible, and invisibility is what brings the human back in.
  **Excess acceptance rows do not prove a trigger either.** Choosing to re-bind inside your own
  ruling writes the same row a forced re-accept would. **A count over rows measures every path that writes
  them, not the one you had in mind** — so reconcile the excess to an observed cause before naming one.
- **Seats read your ledger as authoritative.** A wrong number in it propagates: a wrong count in the
  tracker gets copied by the next seat, then the next, and reaches shipped code comments. Cite, don't
  assert.
- **Verify a query FIRES on a known-positive before you trust a clean result.** A silently-empty result
  is usually a broken query, not an empty table — and a false all-clear on an audit query is worse than
  no query.
- **Costs: uncosted turns count $0**, so any total is a FLOOR while the uncosted-turn count is above zero.
  Report it with the count. **Never sum across instruments** — session footers ride the seats' wakes and
  omit your own spend.

## Hard rules (bake into every seat's prompt; enforce as coordinator)

- Plan TLDR as **plain text BEFORE any plan-approval mode**; questions as **plain numbered text, then
  STOP** — never an interactive question tool (the human can't copy from it).
- **No commit/push without your relayed call.** Explicit staging only — never `git add -A`.
- **The unattended git form, and it binds YOU as much as the seats: one git command per call, no shell
  metacharacters.** The FORM check reads the whole command string, so chaining, redirects or substitution
  disqualify it — `git add … && git commit … && git push …` parks, while the same three sent separately
  flow. Pushes always name the refspec; a push without one parks by design. Keep git-verb words out of
  echo text and section labels — **including `branch`**, which parks a read-only branch LISTING on the
  branch-deletion backstop. The fence fires on the commands a careful seat runs to PROVE its work.
- Seats never edit `project-status.md` or memory files; never run `docs-write` unprompted; respect the
  umbrella's out-of-scope list; codegen only through the command `patterns/codegen.md` § Running codegen
  names; component files laid out as `patterns/frontend-patterns.md` § Component files states. Run the
  suite lanes SERIALLY.
- Cross-slice changes (touching a shipped spec's files) need your explicit approval and get recorded as
  a departure. Additive-only; never amend pushed commits.
- **Cite symbols, not bare `file:line`.** In a seed, a ruling, or the tracker, name the symbol and use the
  line as a hint — a line number is a comment, not an address, and the seat documenting why a line matters
  is what moves it.
- Model policy: seats run **the effort's declared default model** (allowlist-exact, set at creation);
  investigation-heavy sessions may warrant a reasoning-heavier one. Parallel sessions only when
  the specs share no files — and sequence the *commits* regardless.
- **The gate is inverted (means are free, protocol is law):** benign tools/methods flow with audit rows;
  only the ceremony's boundaries park — in EVERY tier, recon included. Reads, execs, suites, pipes,
  redirects and in-worktree writes all flow pre-accept. **Do not seed tool-avoidance rules the platform
  does not require** — seeds carry CEREMONY, not tooling micromanagement.
- **A fact you did not establish this session carries its source — and you re-check it AT THE SOURCE, never
  in the copy.** Anchors, counts, orderings, "this is how X works" all decay, and a fact copied between
  documents decays invisibly, because the copy still reads as confident as the day it was written. If a
  claim matters and you inherited it, open the thing it describes. This is the general form of the rules
  below it: cite a value, carry the invocation, treat the spec as a hypothesis.
- **A ruling that names a column, a table, or a store must cite one observed value or one line of schema.
  Otherwise it is a guess wearing a ruling's clothes.** One query, one schema line, one line of the model
  — then rule. The failure this closes is reasoning from what a thing is CALLED to what it CONTAINS. **Note
  the asymmetry it corrects:** every seat opens with a BELIEFS block diffed against your ledger — you
  were required to state nothing, and so were the one seat whose wrong beliefs nobody was positioned to
  catch. Cite, and your beliefs become checkable too.
- **No message of yours carries a build order except the plan ruling itself.** Answers, callouts, and
  status requests are steering or information; the go IS the `accept`/`accept-with-riders` verdict.
- **If the next action is yours and nothing gates it, TAKE it — do not describe it.** Any turn of
  yours that ends with a plan instead of an act is a defect, and not a close-out quirk: a coordinator
  that rules a fixit IN, writes the brief, and ends the turn sits idle with nothing gating it. The human
  ruling: **a ruled-in fixit is spawned in the SAME act as the ruling.** The trap has a name — *the
  narration consumed the intent* — writing the sequence is not executing it, and it feels enough like
  progress to replace it. The close-out section states this for its own stretch; this rule is the general
  form — ANY turn.
- **A park is a WAIT, never a puzzle to route around.** When a boundary command parks, the answer is to
  wait or to reshape the command — not to complete a run or curl past the fence. **And a park that sails
  through anyway is DATA:** record it immediately as an incident, because a fence that failed silently once
  will fail silently again, and your record is the only trace.
- **`parallel:true` is for specs that share no files — that is its whole purpose.** A refused spawn means
  the previous seat is still holding the shared effort worktree and needs reaping; the answer is to reap
  it, or to wait if it has not closed out yet. Reaching for `parallel` there is a category error rather
  than a shortcut: it does not free the worktree, it just puts two seats in it.

## The steering channel — shape your callouts by SOLICITATION

**A callout must carry a determinate next action the seat can execute without inference.**

- **A ruling on a held question already carries one** — the plan verdict flips the gate, so the
  ceremony determines what happens next. Length and placement are then free; long rulings work.
- **An unsolicited note carries none**, so it must supply it: an explicit imperative list, and an
  explicit instruction not to reply.

The mechanism is the state transition, not the word count. A standalone callout has no transition, so its
text alone determines the seat's next action — and an injected note IS the turn, so processing it is the
turn's work. A note that opens with "no question pending; you are clear to finish" and buries "GO" under
39 lines consumes a turn and produces nothing. Lead with the imperative, make it the whole message, and
send context attached to a ruling instead.

## The seat prompt template

The ceremony rides the **`spec-child` skill** — the prompt is an IGNITER, not a ceremony restatement.

```
You are a BUILD SEAT in a coordinator-run effort: invoke the spec-child skill with
role={backend | frontend | mixed} before anything else, and ALWAYS after `spec-seat`: the seat header
names `spec-seat` first, the job skill second.

Your spec: {absolute path to the spec}
Pipeline context: {umbrella path} (settled decisions — don't relitigate) + {project-status.md path}
(READ-ONLY, coordinator-owned — prior rows, deferred findings, and process incidents are your contract).

EXTRA DOCS for this task (beyond your role's floor — read them):
{the coordinator's picks from doc-index.md}

PRIOR SPECS ARE SHIPPED at {hash} — build against their ACTUAL shapes:
{bullet the real endpoints, contracts, helpers-to-reuse, caveats, and coordinator-adopted requirements
from prior final TLDRs. Note which anchors MOVED at that hash.}

MY BELIEFS, WITH PROVENANCE (a mismatch is worth more than a build hour — report it):
{each load-bearing claim + which pipeline/row/commit established it. Name symbols, not bare lines.}

STANDING RECON QUESTION (answer in your PLAN TLDR): {if any}
Known coordinator-owned dirty files (never stage): {list}
Baselines: {per lane, as patterns/testing.md names them: N (+known pre-existing reds)}

THE TASK: {compressed spec restatement with the load-bearing specifics inline.}
```

For investigation-first work, add **STEP 0 — INVESTIGATE, REPORT, STOP** before the task, or use
`role={...} fixit` for no-spec defect sessions (the skill carries the fix-it ceremony). Fallback: if the
seat can't invoke skills, paste the ceremony from the `spec-child` skill inline.

### The bookend rows (R and P) get a MANIFEST instead of prior shapes

Neither has a spec file — the skill is its contract — so **the skill supplies the procedure and you supply
the inventory.** A bookend spawned with nothing but a skill name has to hunt for what it is working on, and
a seat that hunts guesses.

**An inventory is navigation; a belief is a conclusion.** Paths, names and ranges are inventory. "Spec 03
shipped X", "that anchor moved", "this departure is fine" are conclusions. **R gets the first and never the
second** — this is the whole point of the row.

```
REVIEW row (R):
  You are the REVIEW SEAT: invoke the spec-review skill before anything else.
  Topic: {topic} · branch: {branch} · diff range: {base}...{branch}
  Specs (read as claims, not facts): {every numbered spec path}
  Session artifacts: docs/research/{topic}/sessions/  (each seat's plan.md + tldr.md)
  Working docs for THIS effort: {explicit list of docs/working/*.md}
  Tracker (the process record you grade from): docs/research/{topic}/project-status.md
  The coordinator's retrospective does NOT exist yet, and you do not wait for it.
  {NOTHING ELSE. No prior-shapes bullets, no provenance list, no "already settled".}

DOCS-PROCESS row (P):
  You are the DOCS-PROCESS seat: invoke the docs-process skill before anything else.
  Effort: {topic} · archive target: docs/archive/{topic}/
  Working docs for THIS effort, and ONLY these: {explicit list — docs/working/ is a shared
    queue and may hold other efforts' docs; do not infer membership from the folder}
  Research/spec docs to archive: docs/research/{topic}/
  The review's report: docs/research/{topic}/sessions/code-review.md  {omit if no R row}
  Running IN-PIPELINE before the merge: verify against this branch, and say in your summary
    that the living-doc patches are contingent on the merge.
```

**Name the working docs explicitly for BOTH.** It is the one field a bookend cannot derive safely, and for
P it is the difference between archiving this effort and sweeping somebody else's into it.

## Ruling template (plan review / question answers)

```
PARENT RESPONSE — PLAN TLDR {ACCEPTED / ACCEPTED WITH RIDERS / BLOCKING-PRECONDITION}.
{Verdict vocabulary: accept · accept-with-riders (numbered rulings anchored to the SEAT'S OWN item
numbers — it folds them in and GOES, no re-approval round-trip; the dominant verdict) ·
blocking-precondition ("accept, but step 0 first") · read-full-plan (not a verdict you send — you
read plan.md, then rule).}
{One sentence naming the best thing in the plan — reinforce what you want more of.}
Answers:
1. {RULING IN CAPS} — {the decision, then the rationale in one or two sentences. Rationale is
   mandatory: seats generalize from the WHY to the next hundred micro-decisions.}
2. ...
{Optional call-outs that don't block.}
Go build. Ending ceremony as before; no commit without the relayed call.
```

Rules: one numbered ruling per question, decision-first then rationale, never leave a question
unanswered, bounded instructions over open-ended ones ("try X; if it fails do Y; don't sink more than the
recon check into it"), and correct any stale premise in the seat's question explicitly.

**AND THE RULING IS AN ACT, NOT A PARAGRAPH.** What closes a question is the ruling act carrying the
asking post's id — **not the words, and not the file.** A ruling you wrote and never sent is a question
still open, however good the prose; the seat is still holding and the re-raise is still armed.

**The blackboard append.** Hand-cranked, the seat's `plan.md` and `tldr.md` are live FILES at
`docs/research/{topic}/sessions/{spec-slug}/` — read the TLDR there with normal file tools instead of
asking for a paste (`read-full-plan` = read `plan.md`, a pull, never force-fed). Deliver every ruling by
**APPENDING it verbatim to the seat's `tldr.md`**, right under the questions it answers. Hosted, your
verbs ARE the appends and the machinery writes them for you.

**Anchor grammar (canonical — the witness greps these):** rulings land under
`## PARENT RULING (plan — {verdict})` hand-cranked, `## PARENT RULING (plan rev N — {verdict})` when the
rev ladder exists; notes under `## PARENT NOTE ({context})`. The parent-voice vocabulary is a CLOSED list
of four — `PARENT NOTE` · `PARENT ACCEPT` · `PARENT RULING` · `OPERATOR RULING` — so a fifth anchor you
invent counts as nothing. **Never vary the prefixes**, and **never discuss the anchor grammar inside a
steering note**: the detector matches the STRING, not your intent, and naming an anchor while explaining
it derives a spurious acceptance receipt. Refer to it obliquely ("the acceptance anchor").
**Point, don't paste:** steer with *"read your `tldr.md` under `## PARENT RULING`"*, never by re-pasting a
multi-KB block into a composer.

**When to read (hand-cranked):** the human's nudge is your wake signal, and the human is the ONLY bus — so
before cutting each next prompt, sweep `sessions/*/tldr.md` mtimes for appends you were never nudged
about. A missed nudge must cost one `ls`, not a wedged run.

**Human relay mechanic:** when pasting a ruling into the seat's session, the human prepends *"Here
is the response from the coordinator, take account for the notes and pop up the plan i will approve it."*
— so the seat applies the rulings, then presents its plan for the human's explicit approve. This
plan-approval click is the human's counterpart of the product's accept-gate — keep it.

## Docs-write + commit call template

```
PARENT RESPONSE — FINAL TLDR ACCEPTED {(+ what I verified myself)}.
1. Run docs-write. Carry: {departures, honest gaps, deferred findings verbatim, gotchas}.
2. COMMIT CALL — approved. Stage explicitly (never git add -A): YOUR diff + working doc,
   PLUS docs/research/{topic}/project-status.md — my ledger rides your commit,
   which is its only route to durability. You stage it; you never edit it. Other research
   notes stay untouched. Re-copy plan.md + tldr.md into sessions/{slug}/ ONCE, immediately
   before the final push.
   VERIFY before committing: verify-staged {same list} — commit only on exit 0. Non-zero means
   git add silently dropped files (usually a .gitignore rule); STOP, report the output verbatim,
   and wait — do not force-add, do not widen .gitignore.
   Message: {conventional message naming the spec}
   Trailer: {the trailer this repo's commit convention requires, if any — name YOUR model}
   Then push. Post-commit status must show only the known coordinator-owned/unrelated files, and
   the close-out report carries the one-line STAGING VERIFIED receipt — a commit report
   without it is incomplete (the whole defect class is silence; an unrequired receipt is
   optional exactly when it matters).
```

**THE ACCEPTANCE IS A RECEIPT VERB, AND PROSE IS NOT A RECEIPT.** Send the acceptance act carrying your
text; it lands in the seat's `tldr.md` under `## PARENT ACCEPT (final — {slice})` and the rev-bound
receipt derives from it. **An acceptance delivered as a steering note records zero rows** — and the push
bar reads the row, not the paragraph.

**Close-out order is law:** the text-carrying acceptance comes FIRST with the commit call EMBEDDED in it
(the receipt binds pre-commit), then the seat commits and pushes. **The receipt is rev-bound:** it covers
the tldr rev + HEAD it was written against — if the seat re-posts its TLDR CONTENT after your acceptance,
the unattended push parks naming both revs, and one **argless re-accept** is the cheap repair, **sent with
the retry order in the same act**. A seat's post-push `## [child·…] CLOSE-OUT RECEIPT` append does NOT
stale your acceptance — reap without a re-accept after it.

**Hand-cranked:** append the same `## PARENT ACCEPT (final — {slice})` heading to the seat's
`sessions/{slug}/tldr.md` yourself — there is no machinery and no derivation; the anchor + your tracker
row ARE the receipts.

**Settle after EACH commit, not once at the close.** Before cutting the next prompt: run the production
build for any touched surface — **`cd` into the app that was actually edited** (the apps and their build
commands are `docs/_meta/doc-index.md` § Apps and their build commands). **Naming one app here is a false
green**: the wrong app builds successfully, so the receipt says PASS about a tree nobody touched. Then
check whether the just-shipped diff and the NEXT spec's declared files touch the same regions. The settle
catches cross-session collisions and a session's self-collision, attached to their author rather than
post-merge.

## Notes

- **The tracker is the seat — ONE ledger, and you write it live.** `project-status.md` is your journal: you
  own it, you advance it at every boundary, and the human never edits it. That file, not the chat, is the
  product of this skill. **The mechanism is ordinary file tools** — edit it exactly as a seat edits
  `tldr.md`/`plan.md`; the gate permits the path. Git commits are the receipt: timestamped, attributed,
  carrying the diff.
- **The session entry is a JOURNAL entry, not a status cell.** The ruling *and its reasoning*, recon
  corrections, what you verified yourself, mid-build directives, and anything you don't want to forget —
  written when it happens, never reconstructed at close. **The tracker's own section notes say what each
  section holds**; follow them rather than inventing structure. Do **not** add a `## Checkpoint ledger` or
  a `## Parent decisions` section — the session entry *is* the decision record, and a parallel section
  splits one narrative across two places.
- **If a retro has to supersede your session rows, the ledger was not kept.** A retro confirms the rows
  and adds the audit and economics; it never corrects facts that should already be written.
- **BOUNDED means READABLE, not short.** Every entry must stay **independently readable by an ordinary
  offset/limit read**. Prefer prose sections (`### Session X — spec NN`) over a mega-table: a section can
  be paged and addressed by heading index; a table cell cannot be split by any reader that exists. **Do
  not measure this in lines** — a line count falls as cells grow, so the format that causes the defect
  scores best on it. Superseded detail rolls off; git history keeps it.
- **Sweep your own docs BEFORE cutting each prompt, not after each close-out** — a seat recons the
  COMMITTED tracker; your uncommitted rulings are invisible to it.
- **Shared-tree staging hazard:** when multiple sessions share one working tree, `git status` the INDEX
  before staging — another session's `git mv`/`git add` leaves staged entries that YOUR commit will
  silently sweep. Explicit paths protect files, not the index.
- **The incidents log applies to you.** Record your own protocol slips beside the seats' — the
  ledger's credibility IS your authority. **But do not reach for them:** a coordinator that has been
  logging its own slips can tip into inventing one to keep the accounting even, and a record whose value
  is accuracy is damaged as much by a fabricated error as by a hidden one.
- **Downstream recon is the quality gate.** Each seat's "build against actual shapes" recon audits the
  previous ship — it catches real bugs cheaply. Never drop that clause from a prompt.
- **The stall sentinel watches you too:** a seat idle past the control plane's threshold with a held
  expectation writes a stall row and lights the cockpit. Your job is to make it never fire.
- **`docs-audit-feature` and `docs-audit-full` are never yours.** They run off-hours, scheduled, against
  the whole doc tree — not inside a run and not at its close. Do not spawn them, do not add them to
  a sequence, and do not treat a stale living doc as something this effort must fix.
- Periodically remind the human to sweep your doc edits into a small `docs` commit.
- Counterpart skills: `spec-seat` (the contract of every seat you arm — read it to know what they were
  told) · `spec-child` (the builders' job skill) · `spec-pipeline` (how the specs came to exist) ·
  `spec-review` (the outside look, before your retro) · `spec-retro` (your close-out audit) ·
  `spec-witness` (the read-only verifier) · `spec-ignite` (the ignition copilot that puts an authored
  effort onto the plane).
