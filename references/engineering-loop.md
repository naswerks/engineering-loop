<!-- naswerks-loop: version=0.1.0 -->
# The Engineering Loop — flow, seats, skills, and the ceremony

> The quick intro to how work gets built here: the two loops (`docs-*` knowledge, `spec-*`
> execution), the three seats (Human / Parent / Child), the ceremony per session, and a
> bare-bones exchange showing the back-and-forth. Point newcomers at this plus
> [doc-index](doc-index.md) + [docs-workflow](docs-workflow.md). Full verbatim artifacts +
> skeletons live with the chain that automates this
> ([ceremony-examples](../archive/agent-chain-mode/specs/ceremony-examples.md)); operational
> templates live in the `spec-parent` skill. Written 2026-07-08, slimmed 2026-07-10,
> blackboard added 2026-07-13.
<!-- meta: type=guide; status=current; verified=2026-07-10; lineage=1 -->

---

## The loop at a glance

**As states, which is what answers "where is this effort right now" — and the shape decides where
`processed` falls relative to the merge:**

```
idea → chartered → building → REVIEWED → fixed? → retro → PR'd → ?

   with a P row      → processed → merged ⟵ HUMAN     P runs on the BRANCH and rides the PR, so the
                                                      living docs and the archive land WITH the code —
                                                      and its patches are contingent on that merge

   without one       → merged ⟵ HUMAN → processed     a cold session later, on main, over one or
                                                      several finished efforts at once
```

**That fork is the whole of the P-row decision.** In-chain buys docs and code landing together; out-of-chain
buys a clean PR diff and no contingency. Nothing else about the sequence changes.

**As skills:**

```
Idea                    → /docs-backlog        → research doc in docs/research/
Research matures        → plan mode (a session) → an approved plan
Plan graduates          → /spec-pipeline           → docs/research/{topic}/: umbrella + one spec
                                                  per session + project-status.md (the plan is
                                                  now throwaway — the specs carry every crumb)
Same session — CHOOSE THE SEAT:
  hand-cranked          → /spec-parent          → this session becomes the PARENT and cuts
                                                  Prompt #1 (you relay every message)
  on the rails          → /spec-ignite          → this session becomes the IGNITION COPILOT:
                                                  commit the chain, stage card → YOU click
                                                  Create in the app → "kick it" → a RAILS
                                                  parent runs the whole chain; you own parks +
                                                  completes + the kill-switch
Per spec (new window)   → CHILD build session   → recon → PLAN TLDR → rulings → build →
                                                  FINAL TLDR → /docs-write → commit (on call)
Builds done, if chosen  → /spec-review          → the OUTSIDE look, before the retro and before the
  (a chain row)                                   PR: code + patterns + composition across seams +
                                                  the loop's own comms → sessions/code-review.md.
                                                  Classifies which findings earn a fixit
  ↳ if it found one     → FIXIT row              → one per chain MAX, parent-ruled, only when the
                                                  chain would otherwise ship something untrue
Chain close (parent)    → /spec-retro           → the INSIDE look: the ceremony audit, the ledger
                                                  reconciliation, the true economics → then
                                                  BUILD COMPLETE + the PR
Effort done             → /docs-process         → living docs patched (consuming the working docs
  (fresh session, or a                            AND code-review.md); chain + working docs
   chain row if chosen)                           archived together to docs/archive/{topic}/
Then, and ONLY these    → the human MERGES the PR, and runs the live-checks rows ⟵ THE TWO HUMAN GATES
Anytime / periodic      → /docs-status, /docs-audit-feature, /docs-audit-full  ⟵ NEVER a chain row
Alongside, optional     → /spec-witness — a session OUTSIDE the worktree, read-only, zero writes: a
                          window into a running chain so the human can take its pulse without the UI
```

**Two things are the human's, permanently and by design:** the **merge** (a person in the merge path is
the point, not a gap) and the **live-checks** rows (a machine cannot hand-test a UI). Everything between
`idea` and `archived` a chain can do for itself.

**`docs-audit-*` is never a chain row.** It runs off-hours and scheduled, over the whole doc tree — not
inside an effort, and not at an effort's close. A stale living doc is not something a chain must stop for.

**The chain's SHAPE is decided at authoring, not by a runtime flag.** `spec-pipeline` asks whether the effort
wants a review row and a docs-process row, and writes them into the chain table — so the parent learns the
shape by reading its own sequence, and nothing needs a toggle. A chain can be plain, `+review`,
`+review +process`, or `+process`.

## Two loops — both hand-crankable

- **`docs-*` is the knowledge loop** and runs standalone, forever: small/everyday efforts are
  just *plan → build → `/docs-write` → `/docs-process`* — no chain, no parent, a flat working
  doc. This is the default and it never requires the harness.
- **`spec-*` is the execution loop** for BIG features (3–15 sessions): `/spec-pipeline` graduates
  the plan, `/spec-parent` takes the seat, child sessions build one spec each. It hands off to
  the knowledge loop at both ends (research docs in, working docs out).
- **Either loop runs by hand or on the rails.** The manual version is this document's ceremony
  with the human relaying; the automated version is Agent Network **Chain Mode**
  (`docs/archive/agent-chain-mode/`) — same ceremony, machine-relayed. When they drift, this
  doc + the `spec-parent` skill are the requirements; the rails follow.

## The three seats

| Seat | Who | Holds | Never does |
|---|---|---|---|
| **Human** | you | final approvals (plan-approve click, hard questions, push/publish, hand-testing), the relay in manual mode | writes feature code mid-chain |
| **Parent** | one long-lived Claude session per effort | the north star + full chain context; cuts each child prompt from the previous session's *actual* results; judges PLAN/FINAL TLDRs; rules with rationale; verifies load-bearing claims itself; owns `project-status.md` | writes feature code; trusts self-reported "N green" |
| **Child** | one fresh Claude session per spec | exactly ONE spec; recons the real code first; builds; reports honestly | touches the tracker or memory; commits without the relayed call; runs `/docs-write` unprompted |
| **Witness** *(optional, `/spec-witness`)* | a read-only session with substrate access | testifies from rows/transcripts/buffers when claims conflict or a chain looks wedged; answers "whose turn is it" | writes anything; injects anything; rules on anything |

The seat, not the chat, is the product: `project-status.md` must stay current enough that a
fresh session can resume as parent losslessly (`/spec-parent {topic}`). Two more seats are
coming from [the processor research](../research/agent-docs-processor.md): the **Processor**
(docs-process on rails — the loop's back door) and the **Igniter** (spec handoff onto rails —
its front door).

## The skills

| Skill | Loop | When | One line |
|---|---|---|---|
| `docs-backlog` | docs | an idea, no time to build | park it as a research doc |
| `docs-status` | docs | session start | orient: archived / in flight / waiting |
| `docs-write` | docs | end of any build session (in a chain: on the parent's call) | finalize the working doc into `docs/working/` |
| `docs-process` | docs | effort done, fresh session | patch living docs (verified vs code), archive |
| `docs-audit-feature` / `docs-audit-full` | docs | doc suspected stale / monthly | deep-audit docs against code |
| `spec-pipeline` | spec | a plan came through and you're committing to it | explode the plan into a numbered spec pipeline — *spare no crumb* |
| `spec-parent` | spec | right after `spec-pipeline` (same session) or fresh with the topic | assume the parent seat |
| `spec-seat` | spec | **every** seat the parent arms, invoked FIRST | **the CONTRACT, not a seat** — the shared half of every seat's procedure. `spec-parent` does NOT compose it: the parent writes rulings rather than receiving them |
| `spec-child` | spec | igniting a build or fixit seat — manual (`/spec-child {role} {spec}`) or platform-spawned | **the BUILD JOB only** — one spec, the role's adds, the pin taxonomy, the suite protocol, the fixit variant. Its ceremony comes from `spec-seat` |
| `spec-ignite` | spec | when an authored chain runs ON THE RAILS (the `/spec-parent` alternative) | the ignition copilot, and it can run COLD: gates → re-verify the brief's baselines + platform state against live HEAD → stage card (human clicks Create) → "kick it" with the brief's own kick text as the task → rails-parent runs the chain; every UI gap = an Igniter finding |
| `spec-review` | spec | a chain's builds are done, if the chain has a review row | the OUTSIDE look, before the retro and before the PR: correctness/security/**composition across session seams** · the patterns, with every departure identified · the loop's own comms. Two independent passes, consolidated. Classifies which findings earn a fixit; **its value is having none of the chain's context** |
| `spec-retro` | spec | the parent's LAST act, after any review and any fixit | the INSIDE look: a substrate-verified grade, the ceremony audit (did the acts write rows?), the ledger reconciliation, the true economics, the blindnesses, the ranked fixit backlog — *a retrospective that cannot indict its own author is marketing* |
| `spec-witness` | spec | a chain looks wedged, or actors' claims conflict | the read-only fourth seat: substrate access, zero writes, zero rulings |

### Where a rule lives — policy, procedure, task

A ruling from the chain-mode era, and the thing that keeps prompts and skills from drifting apart:

| Kind | Home | Why there |
|---|---|---|
| **POLICY** | the un-skippable system-prompt suffix (`--append-system-prompt`) | cannot be skipped, present on every turn |
| **PROCEDURE — shared** | `spec-seat` | the contract for ANY seat the parent arms: blackboard, question lane, parked-call discriminator, verdicts, BELIEFS sha, git shapes, six-section FINAL TLDR, close-out order |
| **PROCEDURE — per job** | `spec-child` · `spec-review` · `docs-process` | what THIS seat does. The job skill **refines** the seat contract and never contradicts it; a genuine conflict is a finding, not a fork |
| **TASK** | the seed prompt + the chain's `00-ignition-brief.md` | per-run; dies with the run |

A seed's first act is therefore to **invoke its skills** — `spec-seat`, then the job — not to restate them.
One copy per rule: where a prompt and a skill would say the same thing, the prompt points and the skill
holds it.

⚠ **Why the split exists.** Every seat used to be told to invoke `spec-child`, so the REVIEW row read the
umbrella its own charter excluded, and the DOCS-PROCESS row was offered `/docs-write` by a build skill's
close-out — the row that had just *emptied* `docs/working/`. One base class, three wrong instructions, and
none of it visible until the loop ran end to end for the first time.

Session boundaries: plan/spec authoring is one session; each spec is one build session;
`docs-process` is deliberately a *fresh* session; the chain's final spec audits the cumulative
diff.

## The ceremony (one child session)

1. **Parent cuts the child prompt** from the PREVIOUS session's actual shipped shapes — never
   from the spec's guesses alone. (Template: `spec-parent` skill.)
2. **Child recons, states its beliefs** (HEAD sha, dirty files, versions, baselines), then a
   **PLAN TLDR as plain text** — before any plan-mode presentation — with **questions as
   numbered options + an embedded recommendation, then STOP**. Never the AskUserQuestion tool.
3. **Parent rules**: verdict (`accept` / `accept-with-riders` — fold in and go /
   `blocking-precondition` / `read-full-plan`), one CAPS ruling per question, decision first
   then the WHY. Parent diffs the child's beliefs against the ledger before ruling.
4. **Plan-approve = the freedom moment** (manual: approve + bypass-permissions; rails: the gate
   flips). Child builds uninterrupted; mid-run questions repeat the relay loop.
5. **Child ends with the six-section FINAL TLDR** — shipped+verification, verbatim runner
   summaries (with invocation commands), honest gaps, deferred findings, live checklist
   entries, staging list + commit HELD + session cost.
6. **Parent verifies one load-bearing claim itself** (receipts compared first; rerun only in
   doubt), then the **close-out call**: optional fix/rerun → `/docs-write` with an itemized
   carry → COMMIT CALL with the child's own staging list → push (human approves the push).
7. **Parent flips the tracker row** to SHIPPED + hash and transcribes deferred findings — the
   child never writes the tracker. **The parent also commits the closing seat's post-push
   close-out append, byte-untouched, as part of closing the row** — the append lands after the
   seat's own commit, so left alone it hands the NEXT seat a dirty tree (RWS-11; standing practice
   since runner-workspace-seams, where it ran five times). Goto 1.

**Hard rules:** no commit/push without the relayed call; explicit staging, never `git add -A`;
codegen via `scripts/codegen.ps1` only; separate `.html`/`.css`;
additive-only, never amend pushed commits; parallel sessions only when specs share no files —
commits sequence regardless; children run the chain's declared default model (allowlist-exact, set at
chain creation), and an investigation-heavy seat may warrant a reasoning-heavier one.

## The exchange, bare bones (headers only — what a session looks like)

```
PARENT  → Prompt #N: docs preamble → ##PROMPT## → ONE spec + context docs + prior ACTUAL shapes
          + CEREMONY block
CHILD   → PLAN TLDR (BELIEFS: head/dirty/versions/baselines · the plan, 5-10 lines ·
          QUESTIONS 1..n, options + recommendation) → STOP
PARENT  → PARENT RESPONSE — PLAN {ACCEPTED / ACCEPTED-WITH-RIDERS / …} · rulings 1..n
          (DECISION — why) · riders · "Go build."
CHILD   → (builds free; mid-run question → numbered text, STOP → PARENT ruling → resume)
CHILD   → FINAL TLDR — (a) SHIPPED+VERIFICATION (b) VERBATIM RUNNER SUMMARIES (c) HONEST GAPS
          (d) DEFERRED FINDINGS (e) LIVE CHECKLIST (f) STAGING + commit HELD + cost
PARENT  → FINAL TLDR ACCEPTED (+ what parent verified itself) · 1. /docs-write, carry: …
          · 2. COMMIT CALL — message: … · then push, report hash
CHILD   → books the working doc, commits, pushes, reports hash + post-push status
PARENT  → tracker row → SHIPPED {hash}; transcribes findings; cuts Prompt #N+1
```

## The blackboard — where the exchange lives

The exchange above is not just chat — it is a pair of FILES per child session (human-ruled
2026-07-13; first proven live by the chain-blackboard fixit session itself, which built the
rails half while running the hand-cranked half):

- **`tldr.md` — the chat.** Append-only, two voices: the child's PLAN TLDR + numbered
  questions, the parent's ruling appended beneath them, optional mid-build updates +
  `## PARENT NOTE`s, then the FINAL TLDR. Read top-to-bottom it IS the session's whole
  conversation, greppable by anchor.
- **`plan.md` — the document.** The full plan, posted once, corrected on pushback. PULL-only:
  the parent reads it on a `read-full-plan` verdict; it is never force-fed into a wake or chat.

**`sessions/` is the chain's conversation, and the whole effort's durable record.** One folder per chain,
**brought into existence by the FIRST child's close-out commit** — never authored when the chain is
written, and never with a placeholder — then written into by every later seat, and archived with the
effort:

```
docs/research/{topic}/sessions/         ← per-session work in {spec-slug}/, chain-wide at the root
  {spec-slug}/plan.md        each child   the full plan, posted once, corrected on pushback (PULL-only)
  {spec-slug}/tldr.md        each child   the two-voice chat — child turns AND parent rulings interleaved
  code-review.md             the review   the outside look, if the chain had a review row
  parent-retrospective.md    the parent   the close-out audit (the inside look)
  witness-ledger-*.md        a human      the witness is zero-writes, so its ledger arrives by hand
```

Two files per build session; questions ride the TLDR, and there are no status snapshots because the
tracker is committed live. **It is TESTIMONY** — an archive pass repairs links elsewhere and leaves
`sessions/**` byte-untouched, because editing a record to make it tidy is how it stops being one.

Where they live — **hand-cranked:** `docs/research/{topic}/sessions/{spec-slug}/` (ordinary
repo files, staged at close-out; the parent appends rulings with its own file tools; the
human's relay is a one-line nudge each way).

**On the rails — and the two planes differ, so name the one you are on:**

> ⚙ **v1 PLANE (still running) — chain mode.** The chain worktree's `.nas/agents/{runId}/` —
> children edit the files and post ARGLESS (`post_plan`/`post_tldr` read the file, rev-snapshot it,
> and wake the parent; the TLDR wake carries the file's text); `accept_child_plan`/`callout_child`
> auto-append the parent's full text AND inject it; the parent's `status.md` mirrors into
> `.nas/agents/parent/` with revs. One folder tree = the whole run's conversation; the DB timeline
> stays the exact per-message mirror.

**v2 plane (`NasAgentOps.Api`) — there is no folder tree and no file the controller can read.** A seat
**carries its bytes** to `post_plan` / `post_tldr` (MCP verbs under `acts:write`, so a witness ticket
structurally cannot post), and everything identifying is **server-derived** — pipeline and seat from
the verified ticket, and **the rev** (`newest.Rev + 1`). *A rev nobody can misstate cannot regress by
accident.* The append-only guard is what survives the transport change: the ladder only climbs, a
shorter file is refused, and the same rev with different bytes is refused — so the mirror **cannot be
clobbered or rewound by a caller that lies, even though it can be fed.**

🔴 **The parent's voice is NOT in the seat's file on v2.** A coordinator answers with **`callout`**
(its 6th drive verb, machine-written, the only downward path), which persists on its own artifact lane
(`ArtifactKinds.Ruling`) and closes the question in the **acts ledger**. ⇒ **The file says whether a
question was ASKED; the ledger says whether it was ANSWERED**, and a seat typing a parent-voice heading
into its own TLDR closes nothing. `callout` **refuses when the charge has no live session** — a
coordinator must `seat_spawn` before it can rule — and reports **"RULING RECORDED, NOT DELIVERED"** in
those words if the transport drops it.

The parent-voice block (machinery-written on the rails; the hand-cranked parent writes it —
hand-cranked there is no rev counter, so the heading is `## PARENT RULING (plan — {verdict})`;
the stable grep prefix `## PARENT RULING` is the contract in both modes):

```
## PARENT RULING (plan rev N — {accept | accept-with-riders | blocking-precondition})

PARENT RESPONSE — PLAN TLDR {VERDICT}. {one sentence naming the best thing in the plan}
Answers:
1. {RULING IN CAPS} — {decision first, then the why}.
...
Go build. Fold the riders in — no re-approval round-trip.
```

Callouts and nudges append as `## PARENT NOTE` (actor-suffixed when known: `(operator)`,
`(request_status)`).

🔴 **The seat's own two anchors, and the second one is the fix for a 6h08m deadlock:**

```
## [child·{slug} · run {id}] CLOSE-OUT RECEIPT     ← after the push
## [child·{slug} · run {id}] HOLDING              ← "I have pushed and I am waiting"
```

**A question heading, a HOLDING and a close-out receipt are ALL non-staling** — the gates bind an
acceptance to the accepted CONTENT, not to the revision number, so appending your own *state* leaves it
intact. Only **new content** stales. ⚠ **If you find yourself reasoning *"I should not post this because
it would stale my acceptance"* — that was correct once, it is wrong now, and post.** A seat that has
pushed and is waiting used to be indistinguishable from a seat that had done nothing; a coordinator
read a wake led by its own acceptance, concluded *"nothing to rule"*, and both seats ended their turns
cleanly while the pipeline sat for **246 minutes**. The token is the literal `child·` whatever seat you
are — it is a protocol anchor, not a description of you.

*(Snapshot — the authority for the anchor grammar and its matchers is
[agent-network-comms](../infrastructure/agent-network-comms.md).)*

### Questions ride the same blackboard — *Snapshot; the authority is [agent-network-comms](../infrastructure/agent-network-comms.md)*

**When you need a decision at any point after your plan:** append a `## MID-BUILD QUESTION` section
(during recon/plan time the heading is `## QUESTIONS` — two literal headings, one lane, both poke) —
**that literal heading, in every phase including close-out**, because the detector is heading-matched and a
synonym is a question no banner announces and no re-raise can reach — to your own `tldr.md`,
poke (`post_tldr`, argless), and **end your turn**. The parent is woken with your question text, and its
append under a parent-voice heading *is* the answer — so you pick it up from your own file and resume.
Your turn never stays open waiting, and asking costs the chain nothing but the round-trip. Plan-time
questions and mid-build questions are the same lane and the same shape.

An unanswered question is re-raised to the parent on a cooldown until a parent-voice heading lands above it,
so if the parent cannot rule yet it appends a note saying so — one append ends the reminder.

*(Snapshot — just enough to act. The lanes, the wake composition, the re-raise mechanics and the park
vocabulary live in [agent-network-comms](../infrastructure/agent-network-comms.md).)* **Worked example — a complete two-voice session, the pattern's first live
run:** [chain-blackboard/sessions/fixit-blackboard/tldr.md](../archive/chain-night-shift/sessions/fixit-blackboard/tldr.md)
(archives with the effort to `docs/archive/chain-blackboard/`).

## Where the full artifacts live

- **The earned lessons** (read before parenting or authoring your first chain):
  [parent-retrospective](../archive/agent-chain-mode/specs/parent-retrospective.md) — ten
  incident-backed notes from the loop's first automated run (specs are hypotheses; belief-vs-
  ledger; fail-soft + missing scope = silent data loss; judge arithmetic, not assent) — and
  [witness-notes](../archive/agent-chain-mode/specs/witness-notes.md) (the substrate-is-reality
  doctrine + the observation playbook).
- **Operational templates** (child prompt body, ruling format, close-out call) —
  `.claude/skills/spec-parent/SKILL.md` (authoritative).
- **Verbatim historical exchanges + complete blank skeletons** (real PLAN TLDR, rulings,
  close-outs, fix-it prompt, verdict vocabulary) —
  [agent-chain-mode/ceremony-examples](../archive/agent-chain-mode/specs/ceremony-examples.md)
  (archived with that chain).
- **The schemas the platform enforces** — chain-mode specs
  [04](../archive/agent-chain-mode/specs/04-stop-based-turn-protocol.md) +
  [05](../archive/agent-chain-mode/specs/05-spawn-child-and-prompts.md).

## Manual ↔ automated (Agent Network Chain Mode)

> ⚙ **v1 PLANE (still running) — chain mode.** This table maps the manual ceremony onto the v1 rails
> (`NasBff.Api`). The **v2 plane** (`NasAgentOps.Api`) runs the same ceremony through different verbs:
> a **kick** (`session_new` + a composed seed) instead of `spawn_child` · argless `post_plan`/`post_tldr`
> that **carry bytes** rather than read a file · a coordinator's **six drive verbs**
> (`seat_spawn` · `accept_plan` · `accept` · `complete` · `read_blackboard` · `callout`) instead of
> `accept_child_plan`/`callout_child` · a **park** the operator answers at
> `/pipelines/{id}/parks/{row}/…` instead of an approval card · and the `/pipelines` cockpit instead of
> the chain cockpit. See [agent-ops](../infrastructure/agent-ops.md) and
> [agent-ops-cockpit](../features/agent-ops-cockpit.md).

| Manual ceremony step | Chain Mode rail (v1) |
|---|---|
| Human pastes prompts between windows | Parent's `spawn_child` MCP tool + terminal inject |
| Child appends PLAN/FINAL TLDR to its blackboard `tldr.md`, stops | Argless `post_tldr` reads the file, rev-snapshots, wakes the parent with its text; the Stop hook's `TurnEnded` signal carries the final message |
| Human nudges; parent appends its ruling into the child's `tldr.md` | `accept_child_plan` / `callout_child` auto-append the full text into the child's `tldr.md` AND inject it into the terminal |
| Child raises a mid-build question in chat; human carries it | Child appends `## MID-BUILD QUESTION` (or `## QUESTIONS` at plan time — both headings poke) to its own `tldr.md`, pokes, and ends its turn; the waker re-raises it on a cooldown until a parent-voice heading answers it |
| Human clicks plan-approve, flips to bypass-permissions | Parent accepts the plan TLDR → server flips that run to auto-approve (worktree-scoped; push stays parked) |
| Human runs `/docs-write`, authorizes commits | Parent's close-out call, executed by the child; `git push` parks for the human |
| Human watches windows | The cockpit: live graph, terminals, tracker panel, chain timeline, escalation inbox |
| Parent keeps `project-status.md` by hand | **Same — the parent keeps `project-status.md`**, in the chain worktree, with ordinary file tools, committed as the chain runs. The two modes converge here; only the relay differs |

**The human-touch receipt is the loop's own instrument.** Every hand-delivered message to a seat is
supposed to leave an `injected_by_human` row, so "how autonomous was this run" is a number, not a
floor. On the agent-network plane the sidecar posts it from the ticket-gated browser lane; on the
`NasAgentOps` plane the **API mints it on the one authenticated steering door**, before the bytes
move ([agent-ops-ceremony](../infrastructure/agent-ops-ceremony.md)). The count's credibility rests
on the credential: **a receipt the audited party can mint is not a receipt** — which is why the
steering door takes the human's own JWT and never a seat's job ticket.

## Lineage
- **Idea** — the spec-kit era guide (`archive/docs/archive/spec-kit-journey/spec-kit-session-guide.md`) · the lean redesign that replaced it (absorbed wholly into the `docs-*` skills; its research doc no longer exists)
- **Spec** — [agent-chain-mode umbrella](../archive/agent-chain-mode/specs/01-agent-chain-mode.md)
- **Related** — [docs-workflow](docs-workflow.md) · [doc-index](doc-index.md) · [ceremony-examples](../archive/agent-chain-mode/specs/ceremony-examples.md) · [agent-network-engine](../features/agent-network-engine.md) · `.claude/skills/spec-parent/SKILL.md` · `.claude/skills/spec-pipeline/SKILL.md`
