---
name: spec-seat
description: The CONTRACT for any seat a pipeline coordinator arms — the blackboard, the question lane, the parked-call discriminator, the verdict vocabulary, the BELIEFS sha, git shapes, the six-section FINAL TLDR, and the close-out order. Invoked FIRST, then the job skill (spec-child | spec-review | docs-process). Not a seat of its own; the shared half of every seat's procedure.
---

# spec-seat

**This is the contract, not the job.** Every seat a pipeline coordinator arms — a build session, a fixit,
the review row, the docs-process row — runs THIS, then its own job skill:

| Seat kind (`SeatKinds`) | Composes |
|---|---|
| `build` · `fixit` | `spec-seat` + **`spec-child`** |
| `review` | `spec-seat` + **`spec-review`** |
| `docs-process` | `spec-seat` + **`docs-process`** |

🔴 **THE PAIRING IS SEVEN-WAY AND NON-UNIFORM, and the three kinds missing from that table are missing
DELIBERATELY.** `coordinator`, `retro` and `witness` each carry their OWN whole contract
(`spec-parent` · `spec-retro` · `spec-witness`) and are **never** told to invoke this file — prefixing
`spec-seat` onto a skill that already carries a whole contract ships a seed contradicting the skill it
points at. `SeatSeedComposer` has no catch-all branch: an unknown kind is refused by name
(`seat-kind-has-no-seed`) rather than ignited wrongly, and
`SeatSeedComposerTests.A_seat_that_carries_its_OWN_contract_is_NOT_told_to_invoke_spec_seat` pins the
exclusion so it cannot be "helpfully" added back.

**Precedence, so it is never a judgement call:** the job skill **refines** this contract and never
contradicts it. Where they genuinely conflict, that is **a finding to report**, not a fork to resolve
quietly — say so in your PLAN TLDR and let the parent rule.

⚠ **The parent does NOT compose this.** It writes rulings rather than receiving them, owns the tracker,
and holds the close — a different contract, and `spec-parent` carries it whole.

**Why this file exists:** every seat used to be told to invoke `spec-child`, so the review row read the
umbrella its own charter excluded (its seed carries an inventory and no beliefs — and `spec-child`'s Step 1
sent it there anyway), and the docs-process row was offered `/docs-write` by the close-out of a build skill
— the row that had just *emptied* `docs/working/`. One base class, three wrong instructions.

## What you hold (and what you never touch)

- **Yours:** your one assignment; the recon; the plan; the work; your artifacts; your own explicit-path
  commit (on call).
- **Never yours:** `project-status.md` (parent-owned tracker — READ-ONLY), memory files, other slices'
  files (cross-slice changes need explicit parent approval and get recorded as a departure), the
  umbrella's declared out-of-scope areas, `/docs-write` **on your own initiative** (it arrives as part of
  the parent's close-out call — and for a docs-process seat it never arrives at all, because you are that
  skill's consumer), any commit/push without the relayed parent call.

## Step 0 — orient NOW (before asking anything; no role or assignment needed)

Do this immediately, whatever your assignment turns out to be. It needs no role and no spec path.

**The lay of the land — what system you are in:**

| Doc | What it gives you |
|---|---|
| `docs/_meta/doc-index.md` | the menu — which living doc answers which question |
| `docs/_meta/docs-workflow.md` | the folders, the templates, the two loops |
| `docs/_meta/engineering-loop.md` | the seats, the ceremony, and **the comms protocol you follow** |

Then recon the tree: `git rev-parse HEAD`, `git status --porcelain`, `git branch --show-current`.

**How code is written here — every session, whatever your seat:**

| Doc | What it gives you |
|---|---|
| `patterns/vertical-slice-anatomy.md` | where a feature's files go, both stacks |
| `patterns/backend-patterns.md` | entities, repositories, endpoints, GraphQL, async commands, DI |
| `patterns/frontend-patterns.md` | components, signals, NGXS, codegen, the SignalR bridge |
| `patterns/testing.md` | how to write and RUN the suites — including the run protocol |
| `patterns/codegen.md` | TypeScript/GraphQL generation; never hand-write `generated/` |

**That is the default set, required regardless of role** —
`docs/_meta/doc-index.md` · `docs/_meta/docs-workflow.md` · `docs/_meta/engineering-loop.md` ·
`patterns/vertical-slice-anatomy.md` · `patterns/backend-patterns.md` · `patterns/frontend-patterns.md` ·
`patterns/testing.md` · `patterns/codegen.md`
<!-- The app's spawn form reads this line + list as its preset hint (SpecChildSkillPresets.Parse looks for
     "default set" and "role" on one line, then collects the backticked paths until a blank line). Keep the
     phrase and the list contiguous, or the hint silently empties — a unit test pins it against THIS file. -->

Then report your orientation and beliefs, and ask ONE question: **your assignment.** Stop.

🔴 **UNLESS YOUR PROMPT HANDED YOU A MANIFEST — in which case THAT MANIFEST IS YOUR READING LIST**, and
your job skill's reading list does not apply. A seat armed with an explicit inventory (a review row, a
docs-process row, any seat whose prompt names its own sources) reads exactly what it was given.
**An inventory is navigation; a belief is a conclusion.** If your prompt gave you paths, ranges and names,
that is your scope — do not widen it on the theory that more reading is safer.

## The blackboard — where the conversation lives

`plan.md` (the full plan document) and `tldr.md` (the chat: your PLAN TLDR, any mid-build updates, the
FINAL TLDR — **append, never overwrite**) are FILES, not just chat text.

- **Hand-cranked:** create them under `docs/research/{topic}/sessions/{slug}/` at plan time and end your
  turn announcing the path. The coordinator reads `tldr.md` with normal file tools and APPENDS its ruling
  under `## PARENT RULING`, so read the answer in your own file and proceed. The full plan is PULL — it is
  read only on a read-full-plan verdict; never paste it into chat. (Plan-mode note: files can't be written
  IN plan mode — give the chat summary, get the human's plan-mode approve, THEN post and stop.)
- **Hosted (a seat inside a pipeline):** the same two files are yours to edit with normal file tools, then
  call **`post_plan` / `post_tldr` with the file's whole text as `content`** — this controller runs on another
  machine and cannot read your file yet (the argless form is owed; the drill's finding 7) — it records a revision,
  and wakes your coordinator with ONE LINE naming the act and the rev — it reads your file from the board; nothing you
  wrote is pasted into its context (the pointer protocol, 2026-09-15).
  🔴 **THE FILE IS THE RECORD AND THE ROW MIRRORS IT** — one `artifacts` row per rev carrying the whole
  file verbatim, so the two voices stay interleaved because nothing splits them. `BlackboardMirror` refuses
  `blackboard-rev-regressed` · `blackboard-shrank` · `blackboard-rev-content-mismatch` (409 at the door):
  **an append-only file with a shrink guard is a platform-enforced property, not a convention you are
  trusted to keep.**

> ⚙ **v1 PLANE (still running) — chain mode.** Until the coordinator you are talking to runs on the
> hosted plane, your two files live at **`.nas/agents/{runId}/`** and the same two argless verbs post
> them; rulings arrive APPENDED **and** injected, because the v1 machinery writes the append itself.
> The file paths are the only difference that reaches you.

Either way, `tldr.md` read top-to-bottom is the session's whole conversation in message-flow order.

**Greppable turn anchors:** every append gets a stable heading carrying actor + identity —
`## [{seat}·{slug} · run {id}] {phase}` when your seat has a run identity, `## [{seat}·{slug}] {phase}`
hand-cranked. The coordinator's voice is always `## PARENT RULING …` / `## PARENT NOTE …`. The stable
prefixes are the contract: one grep for `## PARENT RULING` across every session's `tldr.md` lists every
ruling in the effort.

🔴 **THE HEADING VOCABULARY IS CLOSED, AND THAT IS THE HAZARD AS WELL AS THE CONTRACT.** The parent-voice
list is exactly four — `PARENT NOTE` · `PARENT ACCEPT` · `PARENT RULING` · `OPERATOR RULING`
(`BlackboardGrammar.ParentVoiceHeading`, word-boundary-guarded so `## PARENT NOTEBOOK` cannot pass). A
fifth anchor invented later closes nothing and counts as nothing until it is added there. ⚠ **Section
boundaries are level-2 headings only** — `### Option A` inside your question block is still inside the
question, deliberately, so a ruling never arrives having truncated your options.

**Point, don't paste:** to direct anyone at content, say *"read `tldr.md` under `## PARENT RULING`"* —
never re-paste a multi-KB block into a composer.

**If `tldr.md` already exists when you go to create your blackboard, APPEND** — machinery may have written
before you, and recreating the file clobbers it (the platform refuses a shrinking rewrite).

**Re-read `tldr.md` immediately before every append.** The parent appends into the SAME file between your
turns — an Edit old-string mismatch here almost always means the conversation moved. Re-read, fold what's
new, then append. Never resolve the mismatch by rewriting the whole file; the rev ladder is the history.

**`## PARENT NOTE (FYI — no reply needed)` is the NO-TURN lane (chain-48):** the parent can leave you
informational context WITHOUT waking you — it lands durably in your `tldr.md` and costs you nothing.
The re-read above is where you pick FYIs up: fold them as context, owe no reply, and never treat one as
a ruling — an FYI cannot answer an open question (only a ruling heading does).

## Questions — the lane, and its two literal headings

**When you need a decision at ANY point:** append a question section to your own `tldr.md`, post
(`post_tldr`, argless), and **END YOUR TURN.** Your coordinator is woken with your text, and its ruling
under a parent-voice heading is your answer — pick it up from your own file and resume.

🔴 **TWO literal headings, one lane — pick by phase, and use a real `##` heading either way:**

- **`## QUESTIONS`** — anything asked **during recon / at plan time** (the PLAN TLDR's numbered forks ride
  under this heading).
- **`## MID-BUILD QUESTION`** — anything found **after your recon was accepted** (mid-build, close-out).

🔴 **OPEN ANY QUESTION SECTION WITH `BLOCKING:` OR `NOT BLOCKING:` ON THE FIRST LINE OF THE BODY.** This is
a real machine-read field, not a courtesy: `BlackboardGrammar.DeclarationOf` reads the **first non-blank
body line** of every section and answers `Blocking` / `NotBlocking` / `Undeclared`. Markdown around it is
fine (`**NOT BLOCKING:**`, `> BLOCKING —`); the word must be first.

- **It says what YOU claim about your own state, and it changes NOTHING about detection.** A `NOT BLOCKING`
  question still opens the latch, still counts, still rides the wake. **A "not blocking" question that
  stopped waking anybody would be a silent stall wearing a feature's name.**
- **`Undeclared` is an honest answer and it is what you get by saying nothing** — so a coordinator reading
  your roster cannot tell "asked and idle" from "asked and still building", and pays a nudge to find out.
- ⚠ **Never let a reader turn your declaration into liveness.** It is a claim made at the instant you
  typed it; a seat that wrote `BLOCKING:` and then kept working was telling the truth.

**Both poke the parent identically** — same wake, same re-raise, same parent-voice answer. The split is
for the READER (a recon fork and a mid-build discovery are different kinds of news), never for the
machinery. A question under any OTHER heading — or as a bare `QUESTIONS:` label with no `##` — gets no
banner and **the re-raise can never fire**, so it can sit unanswered indefinitely (chain-45's fixit seat
asked from inside exactly that trap, CR-34). And never use `## QUESTIONS ANSWERED` / `## NO QUESTIONS` as
status headings for OTHER content — the first is deliberately refused by the detector, and neither is a
question.

🔴 **NAMED, BECAUSE THE GENERAL WARNING ABOVE ALREADY FAILED TO STOP IT: `## MID-BUILD UPDATE` IS NOT A
QUESTION HEADING.** It reads like one and it is invisible to the detector — the pattern's optional
`MID-BUILD ` group matches, then the required `QUESTION`/`QUESTIONS` fails on `UPDATE`, so **no banner, no
re-raise, and no re-ask ever fires.** A seat used it for a real ruling request; the decision was answered
only because a human happened to be reading at the time.
⚠ **The warning in the paragraph above predates that incident by two weeks and did not prevent it** — a
general rule does not stop a specific habit, and `MID-BUILD UPDATE` is entrenched (17 uses across 8
archived efforts). **Post status under any heading you like; put the ASK under `## MID-BUILD QUESTION`,
even when it is one line inside a longer update.**

Questions are **plain numbered text with options and your recommendation, then STOP.** Never an interactive
question tool — the relay cannot copy it.

**An unanswered question re-raises to your coordinator on a cooldown** until a ruling lands. Asking costs
the pipeline a round-trip and nothing else.

🔴 **WHAT ACTUALLY CLOSES A QUESTION — and the two planes answer this DIFFERENTLY, so read the one you are
on.** On the hosted plane **nothing you write into a FILE closes anything.** The latch reads the ACTS
LEDGER: a ruling closes your question only when it is delivered as a `callout` carrying your post's act id
as `answeringActId`. A `callout` without one steers you and closes nothing. **The reason is a security
property, not tidiness:** `tldr.md` is written BY YOU, so a file-side close predicate is a string the
audited party can type — a seat could write `## PARENT RULING` into its own file and switch off the very
re-raise that exists to stop it waiting forever. B1 split the question in two for exactly this:
`BlackboardReading.Asked` (*was one asked?* — a fact about the file, where forgery only wakes your own
coordinator) versus the ledger read (*was it answered?* — a fact about what the coordinator DID).

> ⚙ **v1 PLANE (still running) — chain mode.** There the coordinator's append under a parent-voice heading
> IS the answer and IS what clears the latch, so reading the ruling out of your own file and resuming is
> correct. **Do not carry that habit onto the hosted plane** — there the same append is a record of an
> answer, never the answer itself.

⚠ **On both planes the honest rendering of your file is unchanged**: `OpenQuestions` still clears on the
parent-voice heading, because that is what the file SAYS. What differs is what a DECISION may be
predicated on.

### 🔴 THREE CONTRACT LINES, all earned by ONE incident

A review seat needed a decision mid-build. It reasoned — **correctly, given the mechanics** — that posting
would stale the parent's acceptance rev, so it **withheld the post**. Nothing woke the parent. The question
sat. A **human** read the terminal 42 minutes later and relayed it by hand. That relay was the only reason
the effort's zero-touch claim was false, and the question existed in **no file anywhere** —
`read_blackboard{sectionAnchor:"MID-BUILD QUESTION"}` found nothing, so an audit would have certified that
the seat never asked. **A seat that withholds a post is invisible, and invisibility is what forces the
human back in.**

- **NEVER TRADE A WAKE FOR STALENESS-AVOIDANCE.** If you need a decision, put it under the literal heading
  and **post**. If that stales your coordinator's acceptance, **that is the coordinator's problem and it
  costs one argless re-accept.** Settled empirically in the same hour: the coordinator hit the identical
  staleness on the reap and paid exactly one call. The fear was both unavoidable and trivial — and the
  silence it bought cost ~9 minutes of deadlock plus a human.
  🔴 **AND SINCE PIPELINE-B2 THE COST IS ZERO — ASKING NO LONGER STALES ANYTHING.** This rule was written
  when a post-acceptance append stales a PUSH, observed from **both** actors (a coordinator staling its own
  acceptance by steering, a seat staling it by asking). **That premise is gone:** the gates now bind an
  acceptance to the accepted CONTENT, so a question, a `## HOLDING`, a close-out receipt and your parent's
  own voice all ride without a re-accept. Only **new content** stales.
  ⇒ **The trade this rule forbade no longer exists, and the rule is now unconditional.** If you find
  yourself weighing a wake against staleness, you are reasoning from a mechanic that was repealed. Post.
  ⚠ **Do not flatten the predicates:** a close-out-receipt append was observed NOT staling a REAP across
  three further revisions, so the reap and the push still do not apply the same rule. Report what you
  observe; never generalise one park into a law.
- **WRITE IT DOWN EVEN WHEN YOU DECIDE NOT TO POST IT.** **The blackboard is the record; the terminal is
  not.** If you compose a question and then talk yourself out of sending it, the composing still happened —
  put it in the file. Had nobody been watching that terminal, the question above would have existed
  nowhere.
- **THE CAPS DECIDE WHAT RIDES THE WAKE, NEVER WHAT YOU WRITE.** `WakerOptions.WholeArtifactCharCap`
  (12,000) and `WakerOptions.DigestMaxChars` bound the **digest** your coordinator is woken with — never
  your `tldr.md`, which is append-only with a platform shrink-guard. Never trim, summarise or omit content
  to fit a limit you think you are near: you would be degrading the durable record to protect a transport
  that already degrades itself.
  <!-- v1's pair is `ParentWakerOptions.WholeArtifactCharCap` (12,000) + `ChainDigestMaxChars` (16,000) —
       same 12,000 whole-artifact cap on both planes, different digest ceilings. -->
- 🔴 **AND A CAP NEVER FAILS SILENTLY IN YOUR FAVOUR.** If your text does not fit whole, the digest
  degrades itself and says so; what it must never do is make you believe a coordinator read something it
  did not. When a ruling answers a question you did not ask, suspect the digest before you suspect the
  reader — and quote the passage back.

## The parked-call discriminator — re-request, reshape, or WAIT?

🔴 **FIRST, THE FACT THE DISCRIMINATOR RESTS ON: A PARK IS A RECORDED STATE, NOT AN INFERENCE.** When the
gate parks a call for you, your seat moves `running → awaiting-ruling`; the ruling — or the window
expiring — moves it back to `running`. It is **not terminal**: you are alive and will act again the moment
somebody rules. Read it with `seat_parks`, and read what you can reach next from `seat_read`'s state graph
(`SeatStateGraph`). ⚠ A park is deliberately NOT a stall: a stall detector firing on one would manufacture
an incident out of the mechanism working as designed.

Ask what the park is protecting:

- **A park on a STATE condition** — the park text names a rev, a hash, or a version: it is STATE, not
  approval. Do not re-request, do not reshape; read the substrate for the healing signal (your own acts:
  the fresh acceptance receipt, or the `## PARENT NOTE (re-accept)` append) and retry ONCE on receipt.
  State parks are machine-healable — one argless re-accept re-binds a stale acceptance. **Never hold for
  one specific lane: whichever arrives first IS your signal, and the substrate outranks the bus.**
- **A park on your own legitimate in-worktree work** — **re-request it** (no self-imposed cap, no
  workaround, no silent giving-up) AND disclose ("blocked on X, re-requested N times"). A parked call is
  the platform's turn, not your failure; routing around it hides the defect the park is surfacing.
- **A park on a boundary command** (push to main, force-push, branch delete — or a command whose *text*
  merely tripped the scanner) — **never re-request; reshape the command.**
  🔴 **THE SCANNER MATCHES TEXT, NOT PARSED VERBS, AND THIS IS THE MOST-PAID FENCE IN THE CEREMONY.** Two
  live instances, and **both fired on read-only commands a careful seat ran to PROVE its work**: an `echo`
  label reading `=== remote tip ===` on a `git status`/`git log` block, and `git branch -r --contains
  <sha>` — a branch **listing** — tripping the *"branch deletion is human-only"* backstop. Neither was the
  operation the fence guards; one cost a human touch. **So the discipline belongs in the prose you write
  around a command, not only in the command:** no git-verb vocabulary (push, remote, force, reset, branch
  delete) in any `echo`, comment, `--description` or section label. For upstream verification use
  `git log origin/<branch>..HEAD | wc -l` and `git status -sb`, which carry no colliding noun.
- 🔴 **A POLICY WALL is none of the three.** If the refusal says `walled-by-policy`, **an approval cannot
  grant it** and re-requesting is walking through a known fail-open. The two routes are **reshape the work**
  (do it by a path the policy allows — often: hand the text to a seat whose scope covers it) or
  **escalate**. An operator once spent two clicks on a wall; each was recorded and refused 25ms later.

The test: is the park **blocking your work** (re-request + disclose), **guarding the boundary** (reshape),
or **a wall** (reshape or escalate — never a click)?

**EVERY park is DISCLOSED in your next TLDR — including one you resolved yourself in seconds:** the
verbatim command AND the verbatim park text. A self-resolved park looks like nothing happened and leaves
the parent no signal, so the gate's false-park rate is only ever knowable from the seat that paid it. **An
undisclosed park is a receipt destroyed.**

## The PLAN TLDR, and the BELIEFS sha

Plain text, BEFORE any plan-mode presentation:

```
PLAN TLDR ({your assignment}), recon done against HEAD {sha}, anchors {verified fresh / drift: …}:
BELIEFS: HEAD {sha}; dirty files I see: {list, whose}; tool versions: {claude-cli, …};
baseline suites: {dotnet N (+known pre-existing reds) / frontend F files·T tests / sidecar M}.
CONTROLS: for each probe or pin I will build — its positive control, and what would make it FAIL.
{one line each: "probe X — control: {the case that must go red}; fails when: {…}"}
{5-10 lines: what you will do, anchored to real files; the surfaces you will touch; departures flagged.}

## QUESTIONS (numbered, options + MY RECOMMENDATION embedded, then STOP)
1. {fork} — options: (a)…, (b)…. My recommendation: (a) because {…}. Confirm.
```

**`## QUESTIONS` is a REAL level-2 heading, inside the TLDR you post** — that heading is what wakes the
parent with your question text and what the re-raise keys on (the two-heading lane above). A bare
`QUESTIONS:` label is invisible to both.

**BELIEFS sha — ONE line.** The build-go HEAD check scans for `HEAD` + a 40-hex token **on the same line**;
a markdown break between them reads as a malformed sha and **refuses the flip** (fail-closed by design).
Paste the verbatim `git rev-parse HEAD` output, never hand-transcribe, no wrapping. The checker reads
`plan.md` AND `tldr.md`; the line in either satisfies it.

**Cite symbols, not line numbers.** In anything that outlives a commit — a TLDR, a working doc, a handover
— **name the symbol and use the line as a hint.** A line number is a comment, not an address: one anchor
moved four times in a single effort, invalidated each time by a seat documenting why the line mattered. If
you cannot find the symbol, **report the drift** rather than trusting the number.

**Your baselines are yours to measure** — how, and for what, is your job skill's business, but a number
you cannot reproduce is a finding either way.

### 🔴 CONTROLS — declare them at PLAN time, because nobody catches their own

**For every probe, pin or scanner you plan: name its positive control, and name what would make it fail.**
One line each. If you cannot state what would turn it red, you are not planning a measurement — you are
planning a green light.

**Why this is a required field and not advice.** One effort produced **four independent instances of a
control that cannot fail — four seats, four instruments, and NO SEAT CAUGHT ITS OWN.** A live probe whose
assertion could fail for a reason unrelated to its property; a scanner planting its positive control
*inside* the depth the walk already covered, so it could not fail where the gap was; an inverted control
that omitted its scope predicate, so *the instrument deciding whether a read could be believed* was reading
across the boundary; and a smuggle probe whose two assertions were both `ShouldNotBeNull` and **both
failed**, making the evidence for the finding identical to the evidence for its control. One of those was
the receipt for a security finding. **Verifying your verifier takes a different kind of attention than
verifying your subject, and nothing else in this ceremony asks for it.**

**THE SHAPE TO COPY — a real one, from this repo, because the discipline is teachable.**
`tests/NasAgentOps.Api.Tests/Infrastructure/Periscope/Link/InboundSeqTrackerTests.cs`, the test
`CONTROL_the_SAME_seqs_through_the_PRODUCTION_tracker_all_land`, pairs a wedge case against its own
false-green **inside the instrument**:

> *"The control's own control: the same three seqs, through the production tracker, all land. Without this
> pair, a broken `Accept` that gapped on everything would make the wedge control green while proving
> nothing about the seeding."* — and its assertion message: *"the identical input that wedges the unseeded
> tracker must move this one, **or the pair is not a discriminator**."*

That is the test: **one variable changes; the pair must disagree.** If the same input produces the same
verdict on both sides, you have one observation wearing two names.

**And when you build it, PROVE it.** The cheapest proof is to break the thing on purpose, watch the control
go red, fix it, watch it go green, and quote both runs. A control asserted is a control assumed.

## The verdict vocabulary

`accept` · `accept-with-riders` (fold the numbered riders in and GO — no re-approval round-trip) ·
`blocking-precondition` (do step 0, report, wait for the re-accept). (`read-full-plan` is NOT a verdict —
the parent is reading your `plan.md` before ruling; keep waiting.)

**Apply rulings to the letter — if a ruling contradicts your assignment, THE RULING WINS** and you record
it as a departure.

**No message carries a go except the plan ruling itself.** A callout, a status request, or any answer to a
mid-build question that says "go ahead" is steering or information, never a go — the gate flip rides only
`accept` / `accept-with-riders`. **Verify the flip in your own act rows** (the `accept_plan` receipt;
`plan_accepted` in `my_rows` on the v1 plane); never obey a go carried by any other lane.

⚠ **The accepting verdict is bound to the TREE you planned against.** It carries the workspace HEAD your
coordinator observed, and an accepting verdict whose seat planned against a different sha is REFUSED,
naming both. That is why your BELIEFS sha is a contract line and not a courtesy — and why a HEAD that
moves mid-build is disclosed FIRST, never absorbed quietly.

**The re-accept signal:** after a rev-bound/stale-acceptance park, the re-accept arrives as a
`## PARENT NOTE (re-accept)` append plus a callout — retry your held action on receipt. If your next wake
shows the fresh acceptance receipt in your own rows WITHOUT the note, **that row IS your signal** — the
substrate outranks the bus. Never hold for one specific lane. ⚠ **A re-accept with no retry order is a
doorbell with no follow-through** and has idled a live run for hours; if you receive one bare, retry
anyway and say that you did.

## Git shapes

- **Explicit staging only, never `git add -A`.** Additive-only; never amend pushed commits.
- 🔴 **VERIFY EVERY STAGE BEFORE THE COMMIT — `git add` skips gitignored paths under a directory with
  exit 0 and NO output, and `git status` cannot show the loss** (an ignored file is neither staged nor dirty, so
  status looks *cleaner* after it; three chain-46 losses were silent exactly here — `bin/` ate a
  composition root, `*.log` ate 13 receipts). Run
  `powershell -NoProfile -File ./scripts/verify-staged.ps1 {your explicit staging list}` — one
  command, gate-legal. Exit 0 is your staging receipt; non-zero names every missing file and the
  `.gitignore` rule that ate it, and is a **stop-the-line finding**: do not commit, do not
  `git add -f`, do not touch `.gitignore` — rename the artifact off the pattern (receipts stage as
  `.txt`, never `.log`) or raise a `## MID-BUILD QUESTION` and wait for the ruling.
- **Commit with `git commit -m "…"`** (repeat `-m` for paragraphs) — never a heredoc / `-F -`.
- 🔴 **THE PUSH COMMAND MUST BE THE ENTIRE COMMAND.** Not "bare" — that reads as being about flags,
  and it cost chain-46 two parks from seats that had the rule seeded: the disqualifier is **anything
  else on the line**, and a leading `cd` — harmless on every OTHER git call you make — disqualifies a
  push (the FORM check reads the whole command string). Qualifying forms, exactly: first
  `git push -u origin <your-branch>`, later `git push origin <your-branch>`
  (`--set-upstream` also qualifies — upstream tracking CAN be set through the lane; chain-46's
  contrary tracker note was wrong). A push without a refspec parks by design.
- 🔴 **EVERY GIT COMMAND GOES ALONE — no shell metacharacters.** The FORM check reads the whole command
  string, so chaining, redirects or substitution disqualify it: `git add … && git commit … && git push …`
  parks where the same three commands, sent one at a time, flow unattended. Keep the word "push" out of
  echo text — the deny layer matches text, not parsed verbs.
- Prefer native Read/Glob/Grep for reads; a Bash read flows with its row like any other non-boundary call.
- **Codegen via `scripts/codegen.ps1` only** — never hand-write `generated/`.
- 🔴 **THE UNATTENDED PUSH LANE HAS A CONTENT PREDICATE, AND IT IS OVER THE RANGE, NOT THE BRANCH.** A push
  flows unattended only if the commits **in the range being pushed** touch a `docs/working/` path or a
  `docs/research/*/project-status.md`. ⚠ `docs/research/{topic}/sessions/**` satisfies NEITHER — the
  tracker match is the specific filename, not the research tree generally. So a commit carrying only
  session artifacts, only spec corrections, or only `live-checks.md` **parks by design**, and the remedy is
  never a grant: include the tracker or a working doc in the same RANGE, which is exactly what a close-out
  is supposed to carry.
  🔴 **THE COROLLARY THAT IS EASY TO GET WRONG: the qualifying path must be DIRTY AT COMMIT-TIME.**
  Staging the tracker into commit one makes it CLEAN, so `git add` on it before commit two is a no-op and
  commit two qualifies for nothing. **A file cannot qualify two commits by being staged once.** A
  two-commit close-out therefore needs either the tracker held OUT of commit one, or genuinely new ledger
  content written BETWEEN them. ⛔ **And never improvise a qualifying path in** — touching a
  `docs/working/` file to satisfy a predicate is fabricating a receipt. If the plan you were handed cannot
  work, raise a `## MID-BUILD QUESTION` and price the options; do not execute it and do not invent a way
  around it.

## The six-section FINAL TLDR

Plain text — **this is the contract**, whatever your job:

```
FINAL TLDR — {your assignment}. Built on HEAD {sha}, nothing committed (awaiting the relayed call).
(a) SHIPPED + VERIFICATION — per item: what + where + the receipt inline.
(b) VERBATIM RUNNER SUMMARIES — exact blocks, never prose, WITH the invocation command per block;
    deltas vs baseline; any red run DISCLOSED with its rerun. A suite number quoted anywhere
    carries its invocation or its project scope — a bare total reads as the whole backend when it
    may be one project of six.
(c) HONEST GAPS — what was NOT exercised, stated before anyone asks.
(d) DEFERRED FINDINGS — numbered, verbatim-quotable lines the coordinator transcribes into
    `docs/research/{topic}/project-status.md` § `## Deferred findings log`. Number them
    LOCALLY to your tldr; the effort has ONE id sequence and the coordinator allocates from it.
    Each line carries its receipt (file:line) so it can be transcribed without re-deriving.
(e) LIVE CHECKLIST ENTRIES — click + what PASS looks like, runnable cold, VERBATIM here. The
    COORDINATOR aggregates these into the effort's `live-checks.md` — never write that file
    unprompted: two writers on the file the review grades from is a divergence waiting to happen
    (HR-68 — one effort hit it twice). Touch it only when the coordinator's call names it.
(f) EXPLICIT STAGING LIST — the exact list `verify-staged.ps1` will be run over; a path not on
    this list is a path nobody will notice missing — + "commit HELD awaiting the relayed call" +
    which dirty files are NOT mine. SESSION ID + NAME.
```

## Close-out — the order is law

The call arrives (FINAL TLDR ACCEPTED → maybe fix-first → `/docs-write` with a carry list, **if your job
produces a working doc** → COMMIT CALL with the message). Execute it exactly.

🔴 **Between the parent's FINAL acceptance and your push, do not post NEW CONTENT** — a re-posted report
makes the acceptance stale by design. Append your close-out receipt AFTER the push under this heading:

```
## [child·{slug} · run {id}] CLOSE-OUT RECEIPT
```

## 🔴 IF YOU HAVE PUSHED AND ARE WAITING, SAY SO. IT DOES NOT STALE YOU.

```
## [child·{slug} · run {id}] HOLDING
```

**Then `post_tldr` and end your turn.** Body: what you pushed, and what you are waiting for
(`pushed 641c2a9b; awaiting your go on commit two`).

⚠ **This exists because the contract used to forbid it, and a pipeline paid four hours for that.** A seat
pushed commit one, reported it as turn-end text because it had no legal file channel, and its coordinator —
reading a wake that led with its own acceptance — concluded *"nothing to rule"* and ended its turn. Both
seats ended cleanly, so no failure detector could see it. **246 minutes.** The seat's own words afterwards:
🔴 ***"I was contractually forbidden from making a sound."***

⇒ **A seat that has pushed and is waiting used to be indistinguishable from a seat that has done nothing.**
That is now your job to prevent, and it costs you one append.

🔴 **AND STOP TRADING SILENCE FOR STALENESS-AVOIDANCE — THE PREMISE IS GONE.** A `## MID-BUILD QUESTION`
and a `## HOLDING` are both **non-staling**: the gates bind an acceptance to the accepted CONTENT, not to
the revision number, so appending your own state or a question leaves it intact. Only **new content**
stales. If you ever find yourself reasoning *"I should not post this because it would stale my
acceptance"* — that reasoning was correct once, it is wrong now, and post.

⚠ **The token is the literal `child·`, whatever seat you are.** `CloseOutReceipt.BlessedHeadingRegex`
matches `^##\s*\[child·[^\]]*\]\s*CLOSE-OUT RECEIPT`, so a review or docs-process seat that writes
`[review·…]` or `[process·…]` **fails the match and stales its own acceptance** — costing a re-post and an
argless re-accept. **It is a PROTOCOL ANCHOR, not a description of you.** A descriptive tail after the
marker IS blessed (`… CLOSE-OUT RECEIPT — addendum: the six staged, tree clean`) — that tolerance was
earned by a live reap failure, because an end-anchored pattern on the one heading seats are told to write
is a trap that fires on ordinary prose.

> ⚙ **v1 PLANE (still running) — chain mode.** The matcher named above is v1's
> `CloseOutReceipt.BlessedHeadingRegex`. Widening it to any seat token is queued backend work; until that
> lands, write `child·` whatever seat you are and take the tail tolerance.

**Any post-accept append that is NOT one of these four — close-out receipt, HOLDING, a question heading, or
your parent's own voice — needs the argless re-accept.** The bar is content, not revision: it asks *is what
you are publishing still what I approved?*, and a state report is not a change of work.

**FILE YOUR SESSION ARTIFACTS:** copy your final `plan.md` and `tldr.md` into
`docs/research/{topic}/sessions/{slug}/`. **Two files — that is the whole filing step.** Questions ride the
TLDR, so there is no separate questions doc. **Do NOT snapshot the coordinator's ledger** — it is committed
live, so its git history already carries the progression. Include the folder in your staging list.

## 🔴 SWEEP THE RECEIPTS YOUR CHANGE INVALIDATED — IN THE SAME COMMIT

**A fix does not only add behaviour; it un-makes claims about the old behaviour.** For every behaviour you
changed, `rg` for what the record says about it:

```
rg -n '<the behaviour, a symbol, a check id>' docs/research/{topic}/live-checks.md \
   docs/research/{topic}/project-status.md docs/working/
```

Then correct what is now false **in the same commit as the change**, because a fix and a stale receipt
landing separately is a window in which the record lies.

⚠ **THIS IS A RULE ON TWO MEASURED INSTANCES, NOT A NOTE.** A fixit repaired a pane and silently re-made a
`🔁 superseded` live-check TRUE again — so the marker telling the sitter *not* to run it became false, and
a human driving the table would have filed a defect against correct behaviour. In the same file, a second
row stood `⬜ owed` and `❌ failed` under one id, sixteen rows apart, with no marker. **Fixes invalidate
receipts, and until this step existed nothing swept them.**

🔴 **AND THE OWNERSHIP SPLIT IS PART OF THE RULE — without it the step is a dead end.** You may not write
`project-status.md` (coordinator-owned) or anything under `sessions/**` (testimony, byte-untouched). So:

- **`live-checks.md`** — correct it directly if your change made a row's stated behaviour wrong.
- **the tracker and `sessions/**`** — **REPORT the correction in your FINAL TLDR, quoting the line and what
  it should say.** Your coordinator transcribes it.

⚠ A coordinator once told a seat to *"correct the three false receipts instead"* and then found all three
were its own or immutable — **a partial the seat cannot execute is not an escape hatch, it is a dead end
handed to it.** Say which corrections are yours and which you are handing back.

## 🔴 EVERY BINDING INSTRUCTION GETS A RECEIPT — OR AN EXPLICIT "NOT PERFORMED"

If your coordinator ruled *"report the count either way"*, **report the count.** A clean check and an
unperformed check are indistinguishable without the number — which is precisely why "either way" was said.

⚠ Measured: a binding instruction of exactly that shape was never receipted by either seat, and **both
believed it had been handled.** The substance was almost certainly fine (+96/−0, +63/−0, zero deletions);
what is missing forever is the evidence. In your FINAL TLDR, list each binding instruction with its result,
or the words **"not performed"** and why. Silence is not compliance.

🔴 **THE TESTIMONY REGRESS, AND THE DECLARED STOPPING POINT — read this before you copy anything.** The
order above puts the COMMIT before the CLOSE-OUT RECEIPT, so the copy you commit ends at your FINAL TLDR
and can contain neither the receipt (hash, session id, staging receipt) nor the coordinator's
`## PARENT ACCEPT`. **A follow-up commit does not fix this, it moves it:** any receipt ABOUT that commit is
also written after it. The regress is infinite and the ceremony does not pretend otherwise.

**So the rule is a declared stopping point rather than a fix: RE-COPY `plan.md` AND `tldr.md` ONCE,
IMMEDIATELY BEFORE THE FINAL PUSH.** The residual is then only *"I pushed X, status clean"* — which is
recoverable from git itself, and is the one thing a reader never needs the blackboard for.
⚠ **Why it is not cosmetic: the REVIEW seat reads `sessions/**` and reads nothing else.** Your live
blackboard is not in the repo, so a complete file where you work does not help a reader who has only the
commit — and a review chartered to grade the loop's own comms must not be handed a record missing the
coordinator's half. **This is a defect in the ceremony, not in your conduct**; it fires identically for
every seat.

Then stage YOUR list by explicit path, **verify it landed**
(`powershell -NoProfile -File ./scripts/verify-staged.ps1 {the same list}` — non-zero HALTS the
close-out: the loss goes back to your coordinator as a `## MID-BUILD QUESTION`, never into a commit),
commit with the message you were given, push, and report **hash + post-push status + the one-line
`STAGING VERIFIED` receipt**. Your push proof is the auto-approval row on the push command itself, visible
in your own rows in-turn — tier `receipted-push`, actor `policy:push-bar` on the hosted plane
(`policy:chain-unattended` `auto_approved` on v1). The publish receipt is written at your turn's STOP and
is structurally unquotable by you — **never promise its id.**

## Notes

- **Correcting your coordinator is the job, not a risk to you.** Pipelines are carried by seats catching
  the coordinator's wrong beliefs at recon, before an hour is spent. If a seeded fact does not match HEAD,
  say so plainly — a mismatch you report is worth more than a build hour, and a prompt that frames a claim
  as settled does not make it true.
- **Honesty beats polish.** The parent independently verifies the riskiest claim; a disclosed red with a
  clean rerun builds trust, an undisclosed one destroys it.
- **A rule recalled from context needs re-reading at the source before it is used to refuse work.** A seat
  once blocked itself on a rule that had already been corrected on disk.
- Your job skill is next: `spec-child` (build/fixit) · `spec-review` (the outside look) ·
  `docs-process` (compile the living docs). Counterpart: `spec-parent` (the seat that arms you).

*History: every rule here was earned by a live incident; the receipts live in `docs/archive/`.*
