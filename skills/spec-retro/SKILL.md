---
name: spec-retro
description: The COORDINATOR's close-out retrospective for a finished spec pipeline — a substrate-VERIFIED grade of the run, the ceremony audit (did the acts the seat believes it performed actually write rows?), the ledger reconciliation, the true economics, the blindnesses, and the ranked fixit backlog. Run at the close, after the last session's commit. Run spec-retro {topic}.
---

# spec-retro

The coordinator is the only participant who sees every session of a pipeline from the inside — and
today that perspective evaporates the moment the run closes. This skill turns it into an artifact.

**It is not a summary. It is an audit — of the pipeline, and of the seat that ran it.**

**Find the format first.** This repository writes its formats (the doc header and status words, where an effort is filed, its rails) in the sections `rg -n '^#+ .*\(repository-owned\)' docs/_meta/` lists; read the one a step names before that step writes. This skill names the section, never the format.

Run it as the **last act of the coordinator seat**, after the final session's close-out commit — before or
after the PR is cut, either works. Output: `docs/research/{topic}/sessions/parent-retrospective.md`. It is
a scoped write on the pipeline's branch, so it rides the PR to the base branch either way.

**You are one of the three kinds that do NOT compose `spec-seat`** — this skill is your whole contract,
and the control plane's seed says so rather than merely omitting it.

---

## THE ONE RULE

**The retro must be able to fail.**

If the ceremony audit shows the seat's acts wrote no rows, the retro says so **in the first paragraph, in
bold**, and the grade drops. If the ledger was wrong, it says how many times and who caught it.

> **A retrospective that cannot indict its own author is marketing.**

The section that justifies the skill is §2, and it exists because a coordinator can "accept" every final
TLDR of a run and have the platform record none of them — the close-out called a prose verb instead of
the receipt verb, and the push lane's own condition read a row the ceremony never wrote. One query would
have caught it on day one.

---

## Prerequisite: you must be able to see the substrate

<!-- control-plane-specific -->
**The first-line substrate read is the act sweep, called ARGLESS** — the unfiltered pass over ALL verbs,
human and exception rows included. **Start every audit with it: "what happened to this run that I did
not ask about."** A verb-filtered read can only confirm suspicions, never surface surprises — a run can
certify itself "zero-touch" while `approved_by_human` rows sit one unqueried verb away.

**Who holds the instrument, on the hosted plane:** a `retro` seat's ticket carries `acts:read`, so
`seat_acts` argless IS your sweep. A `coordinator` ticket deliberately does **not** carry it — its mint is
`seat:read` · `pipeline:read` · `drive:write` — so a coordinator writing this retro from its own seat
reads `read_blackboard` (argless = the roster) and takes the act sweep from the retro seat, the
effort's witness, or a credentialed operator. **Say which instrument produced every count in this
document** — a number whose lane you cannot name is testimony, not an audit.

**If the argless sweep is not runnable at your run's scale, that is a day-one escalation, not a
close-out discovery.** A few thousand rows can exceed the lane's page budget; you cannot retroactively
obtain the audit your own doctrine mandates. `spec-parent` carries this as a run-time obligation.

**Two instruments that share no code are the only way a ceremony audit means anything** — on one
instrument you are grading your own homework with your own pencil. Where the control plane offers a
second, code-disjoint read over the same rows, reconcile the two and record that you did; where it
offers one, say so in the retro rather than implying two.

**BEFORE ANY COUNT: STATE WHAT WRITES THE ROW.** A count over rows measures the paths that *write*
rows, not the population you have in mind — and the gap is invisible in the result. A probe that
returns **before** the row write when there is nothing to report writes nothing on a clean run: its
three rows are three *failures*, and every silent run was a success — while three artifacts in a row
describe it as *"never once worked."* **Absence of a row is not absence of the event.** Read the writer
before you read the count — one glance at the emit site tells you whether you are measuring the
population or only its failures.

**Query disciplines that each produce a confident false result:**

- **Verify your query FIRES on a known-positive row before you trust a clean result.** A
  silently-empty result is usually a broken query, not an empty table.
- **A search that times out is not a search that found nothing.** If a sweep backs an ABSENCE claim,
  re-run it on the tool that completes before you report the absence.
- **A gate scanner matches TEXT.** A query or command whose text contains `git` and `push`, or
  `git` + `branch` + a `-d` flag, parks by design. **Reshape the command — never re-request it.** (The
  boundary half of `spec-seat`'s discriminator.)

**READS ONLY. Never write to the platform's store.**

---

## The ten sections

### 1. THE GRADE

Per dimension, each citing evidence — a grade nobody can dispute because it cites rows.

| dimension | what it measures |
|---|---|
| **Execution** | sessions shipped · commits landed · plans rejected · undisclosed reds · receipt reconciliation |
| **Epistemics** | how many times was the seat WRONG, and did the errors propagate? |
| **Ceremony fidelity** | §2 — did the ceremony write the rows it claims? |
| **Discovery** | findings the specs never anticipated |
| **Outcome** | did the run do what it existed to do? |

Grade process and outcome **separately**. A pipeline can execute flawlessly and still be unable to
demonstrate its effect; collapsing the two hides which one failed.

### 2. THE CEREMONY AUDIT — *the section that justifies the skill*

**For every ceremonial act you believe you performed, does a durable row exist?**

<!-- control-plane-specific -->
**THE ONE FACT THIS SECTION RESTS ON: a verb count is NOT an act count.** Several acts write rows under
MORE verbs than their own name, and a row does not always land on the actor's own seat. Before reading
ANY per-verb count as a population of acts, read the act-to-rows mapping the control plane publishes —
it is the difference between an audit and an arithmetic error dressed as one.

**The verb type is CLOSED** — a bare string cannot become a verb — and two axes are declared SEPARATELY
because they are different questions: the verbs that mean *an answer exists* are exactly
`escalation_resolved` and `operator_ruling` — **the only verbs a "was this answered?" reader may count**
— while the verbs that *terminate an escalation* include three that close the object without anybody
answering anything (`escalation_defaulted`, `escalation_expired`, `escalation_default_withheld`).
`injected_by_human` is deliberately in NEITHER: **a human touch is not an answer.**

**Start UNFILTERED** (the Prerequisite above), then narrow — by verb, then by actor, because the
(verb, actor) pair is what separates a seat's own act from the coordinator acting on the seat.

**Any zero-touch or ceremony-fidelity claim must cite the argless sweep**, never a verb list the seat
picked itself — that is the difference between a self-report and an audit. If the sweep could not run,
say so and state the claim as a FLOOR. The human-touch family is `approved_by_human` /
`denied_by_human` / `edited_by_human` / `injected_by_human` (one receipt per burst of terminal input)
plus `operator_ruling`; `escalation_defaulted` and `escalation_expired` are POLICY receipts and never
count.

Then reconcile, explicitly:

| the seat believes | the substrate says | verdict |
|---|---|---|
| N plans accepted | N `accept_plan` acts? | |
| N TLDRs accepted | **at least N** `accept` acts? | |
| M seats reaped | M `complete` acts? | |
| K escalations held | K escalation acts? | |
| Q questions answered | Q `callout` acts carrying an `answeringActId`? | |

**Read the second row as at-least, not equals.** Argless re-accepts write their own rows, so more
acceptances than final TLDRs is the healthy case.

**RECONCILE THE EXCESS TO AN OBSERVED CAUSE — do not attribute it.** At least two different paths write
that row: a **forced** re-accept after a rev-bound refusal, and a coordinator **choosing** to re-bind
inside its own ruling. They are indistinguishable by count. **A count over rows measures every path that
writes them, not the one you had in mind.** For each excess row, name which path produced it or say you
could not tell. And do not flatten predicates that were measured apart: a content post after acceptance
stales a PUSH; a close-out-receipt append does not stale a REAP. Report what you observe; never
generalise one park into a law.

**The derived-row path:** the acceptance's durable record is the `## PARENT ACCEPT (final — {slice})`
anchor in each seat's `tldr.md`, and the receipt DERIVES from it. Reconcile file against substrate:

```bash
rg -n "## PARENT ACCEPT" docs/research/{topic}/sessions/*/tldr.md
```

**AUDIT THE QUESTION LANE THE SAME WAY — it is a heading grep, not a row query.** A seat asks by appending
to its own `tldr.md` and posting; there is no park, no request id, no queryable object. **An audit that
looks only for question rows finds zero and concludes nobody ever asked** — which can be flatly false in a
run whose seats asked repeatedly and changed a ruling by it.

**AND ON THE HOSTED PLANE THE FILE IS NOT THE CLOSE PREDICATE — audit BOTH halves, because they answer
different questions.** *Was one asked?* is a fact about the file (the heading grep below, mirroring the
control plane's grammar). *Was it answered?* is a fact about the LEDGER — the ruling act carrying the
asking post's id — and it is deliberately not read from the file, because a seat can type a parent-voice
heading into its own blackboard. **A retro that audits only the file can be shown a question that
answered itself.** Reconcile the grep's hits against the ruling acts, and report any hit with no act as an
unanswered question whatever the file says.

**Use the tolerant predicate the platform itself uses** — an anchored `^## MID-BUILD QUESTION` misses
prefixed and plural headings, and the lane has TWO headings: `## QUESTIONS` (recon-phase) and
`## MID-BUILD QUESTION` (post-accept). The grep mirrors the platform regex, including its
`QUESTIONS ANSWERED` refusal:

```bash
rg -niE '^##[[:space:]]*(\[[^]]*\][[:space:]]*)?(MID-BUILD[[:space:]]+)?QUESTIONS?\b' docs/research/{topic}/sessions/*/tldr.md | rg -viE 'QUESTIONS?[[:space:]]+ANSWERED'
```

Reconcile each hit against the parent-voice append that answered it (`## PARENT RULING` / `## PARENT NOTE`
in the same file) — an unanswered question is the finding. **Your audit instrument must be at least as
tolerant as the code it audits.**

- **Hosted:** N `## PARENT ACCEPT` anchors imply N acceptance acts (rev-bound: the act carries the tldr
  rev, the HEAD and a content hash). An anchor with no act means the derivation failed (LOUD in the
  logs — find it); an act with no anchor is a cockpit accept (legitimate; the act says so).
  Acceptance-shaped PROSE without the anchor writes nothing by design — flag it as a ceremony miss.
- **Hand-cranked:** there is no machinery and no derivation — expect ZERO acceptance acts; the anchors
  plus the coordinator's tracker rows ARE the receipts. Reconcile anchors against tracker rows instead.

**If ceremony and substrate disagree, that IS the finding — and it is ALWAYS the ceremony's fault, never
the lane's.** A lane that requires a durable, attributable receipt is correct. A ceremony that produces
prose instead of a receipt is broken. **Do not "fix" it by weakening the lane.**

### 3. THE GATE-INTEGRITY CHECK

**Every execution row must have exactly one gate-decision row.** Score it TEXTUALLY, never by count
arithmetic — gate rows cover *all* tool calls while execution rows are transcript-ingested, so the counts
legitimately differ and a real leak can hide inside that gap.

The doctrine, plane-agnostic and the part to carry:
- **CLEAN only exists with a live control.** Refuse to say clean when the inverted-predicate control
  (turns carrying BOTH populations) is 0 — "0 un-gated" and "the join matched nothing" are the same
  output otherwise, and that is the false-green shape this check exists to catch.
- **INCONCLUSIVE is a real result.** Report it as INCONCLUSIVE — never as clean, and never as "not
  performed".
- **A LEAK names its turns** — expand the named rows before drawing conclusions.
- **Join on the turn-correlation id both row kinds carry**, and nothing else: joining by id-proximity
  collapses many executions onto few gate rows, which yields a confident wrong answer rather than a null
  one.
- **Establish two things before you claim a result:** is the stamp the join needs DEPLOYED on the build
  this run used (a run that hosts itself cannot restart the gate it runs on — if not, report NOT
  PERFORMED with that reason, an honest non-result worth more than a confident number the substrate
  cannot support); and does your query fire on a known-positive.

<!-- control-plane-specific -->
On the hosted plane the instruments are `seat_acts` (the ceremony half), `seat_parks` (every park with
its verdict), and `seat_promises` (declared consequents that were never kept — a ruling that never became
work is a LEFT JOIN with no match rather than a judgement call). Key park-audit queries on the control
plane's byte-stable park reasons, never on an annotation's presence.

### 4. THE LEDGER RECONCILIATION

Every load-bearing claim in the coordinator's ledger, checked against substrate: costs, suite counts,
commit shas, row counts. **Report every divergence.**

**ONE ledger:** `docs/research/{topic}/project-status.md`, which the coordinator owns and advances **live**
with ordinary file tools in both modes. Check it against substrate; do not go looking for a second one.

**THE RETRO CONFIRMS THE ROWS — IT NEVER ADVANCES THEM.** Add the audit and the economics; do **not**
rewrite session rows to match reality at close. **If a retro has to supersede its own session rows, the
ledger was not kept, and that is itself the finding to report.** The named anti-pattern is a tracker whose
close-out section reads *"RETRO ADVANCE — verified reality as of {date} (supersedes the stale rows above)"*.

**Verify the readability bound PER ENTRY, not by total size.** Each `### Session X` section must return
from an ordinary offset/limit read. **A line count is the wrong instrument** — it falls as cells grow, so a
ledger kept as giant table cells scores *better* on lines while being unreadable to any reader that exists.

*Seats read the coordinator's ledger as authoritative.* A wrong count in the tracker is copied by the
next seat, then the next, and reaches shipped code comments. A ledger that cannot be checked will drift,
and its drift will be inherited.

### 5. THE TRUE ECONOMICS

**Economics is read one row per instrument and NEVER summed across them** — that is the shipped rule, not a
style note: two instruments measuring the same spend by different paths do not add up, they cross-check.
Report per-seat totals, your own line, the run total, the account rate-limit rails, per-turn model truth,
**and the uncosted-turn count** — a total with no uncosted count is a claim with no error bar.

<!-- control-plane-specific -->
The seat-side read is `seat_usage`, one row per instrument. Never sum session footers: they ride the
seats' wakes and silently omit the coordinator's own spend.

**THE PUBLISHED-TOTAL RULE: every total you publish names its exclusion.** Dollar figures are per-seat
turn usage — subagent (sidechain) spend is excluded from them, and `uncostedTurnCount 0` does NOT make a
dollar total the whole cost: *a true number that is not the whole number is worse than an obviously
missing one.* Where the instruments report sidechain TOKENS, quote totals as **"$X plus N sidechain
tokens"**, and treat the token figure as a FLOOR (it appears only after the conversation sweep ingests
the session; tokens are deliberately unpriced).

**THE COORDINATOR-SHARE CURVE RULE: the share is a CURVE, not a constant.** It opens high (recon before
any seat exists), falls through the build, and turns SHARPLY UPWARD at close — the close-out is
disproportionately coordinator work. **Any share you publish, and any cross-effort comparison, must say
WHERE ON THE CURVE it was taken.** And a retro reporting its own run's cost can never report a final
number — writing the figure costs money — so publish it as a floor "at the time of writing".

**`escalation_defaulted` rows are NEVER human touches.** A declared conservative default coming into
effect at its deadline is a POLICY receipt — every human-decision count in this retro must exclude it, and
a run that went on a declared default says so as "policy resolved the wait", never as a human ruling.
**`escalation_expired` is a THIRD outcome and not a synonym for the second:** the window closed on
silence with nothing declared. Collapsing expire into fire forges a policy receipt for a decision nobody
made.

**When two instruments disagree, exactly ONE difference is expected: a run that has been DELETED.** An
instrument that attributes usage by coordinator id keeps a deleted run's spend; one that enumerates
runs and joins usage onto them drops it. **If a run was deleted, publish the coordinator-attributed
figure — it is the MORE COMPLETE one** — and say that a deletion explains the gap. **Any other
divergence is a FINDING, not a retry** — it means one lane is wrong, which is exactly what having two is
for. Do not generalise the deletion case into a licence to pick the bigger number.

Report: total · coordinator share (%) · per-session · uncosted turns. **Every total is a FLOOR while
`uncostedTurnCount > 0`** — report it with the count, never as a total.

A hosted coordinator is not a thin router: it reads plans, verifies claims in source, and writes a live
ledger, so a coordinator share around a fifth of the run is cheap rather than alarming. An *unusually
expensive* coordinator is the signal — it is usually diagnosing platform bugs, which is itself an anomaly
to report.

### 6. THE BLINDNESSES

**What could this seat not see, and what would have made it visible?** Each becomes a candidate tool. This
is the highest-value section for the platform, because the seat's blind spots are the platform's missing
surfaces. Include the instruments you *read* as well as the ones you lacked — a surface you consult every
turn can be lying to you for the whole run.

### 7. THE CORRECTIONS — *the honesty rail*

**Every time you were wrong, and WHO caught it.**

A seat that never concedes gets told only good news. If a seat corrected you and you changed the record,
say so — that property is entirely social, nothing in the design protects it, and it is doing
more work than any rail.

**And do not manufacture symmetry.** A coordinator that has been logging its own slips can tip into
*inventing* one to keep the accounting even; a record whose value is accuracy is damaged as much by a
fabricated error as by a hidden one. **Self-accounting that reaches for errors is no longer measuring
anything.**

**Check this section's own claims against HEAD before you file it.** A retro cataloguing stale-anchor
errors can ship a fresh one *inside the entry that corrected the previous one*, because a later seat's
docstring moved the line. **Name symbols here too.**

### 8. THE PAIN LOG — the ranked fixit backlog

Every friction point, converted into a proposed fixit, **ranked by the cost of NOT doing it** (not by
effort). The pipeline exists to widen the seat's autonomy — **so every wall it hit is a spec.**

### 9. WHAT FELL THROUGH THE CRACKS

Named explicitly, because the alternative is that it stays fallen. Include the open questions the run
could not settle, and say plainly that they are open. **Check the effort's `live-checks.md`** — unaggregated
verification rows are the most common thing to fall through.

### 10. THE FINDINGS DISPOSITION PASS — *the drain, and it is the section that decides whether the effort's findings survive it*

**Read `project-status.md` § `## Deferred findings log` entry by entry, and give every one an exit.** The
log is a HOLDING PEN for a running effort. Nothing else in the ceremony empties it, so when the effort
archives, every entry archives with it — findable only by someone who already knows it exists, which is
nobody. **A finding correctly found, correctly reasoned, and honestly written down still dies here.**

**The test, and it is the only one that matters:**

> **Can an effort that never read this one's review find this finding?**
> A finding is findable if a later effort reaches it from something it reads ANYWAY. A closed tracker is
> not that. Neither is `sessions/code-review.md`, which is testimony.

Every entry leaves for exactly one of these, and **the set is closed** — if the destination you want is
not on this list, the honest answer is CLOSED with a reason:

| Destination | Why a later effort reaches it |
|---|---|
| A working doc's **Living-Docs checklist** | `docs-process` patches a living doc; living docs get read |
| A **`live-checks.md` row** | The owed-checks authority is read at every sitting |
| A named input in the **NEXT pipeline's brief** | The only legal forward-carry — no standing ledgers |
| An **in-code revisit note at the symbol** | Grep-findable by whoever next opens that file |
| A **chartered fixit**, with its discharge record | Someone is building it, and the record closes |
| **CLOSED — won't-fix, with the reason** | A complete result, and often the right one |

**A destination that does not exist yet is not a destination.** "Row 11 will handle it" is homing a
finding to an unauthored document. If the row is not written, the finding is unhomed — say so, and pick
another exit.

**PUBLISH THE TALLY, with its derivation:**

```
N logged · N forwarded · N closed · N UNHOMED
```

**`UNHOMED` must be zero.** A non-zero count is not a footnote — it is this section's headline finding,
and it names the run's real defect rather than the findings'.

**Count by SUBSTANCE, not by id.** Grep the log's distinctive text at its destination and confirm it
landed. An id that appears downstream under a *different* finding is a collision, not a placement — and
narrative prose mentioning a finding inside a process-incident entry is **not** a log record: no id, no
destination, no status. A review can produce fifteen findings and fourteen can reach nothing; two of
those can *appear* in the tracker as prose inside an incident narrative, which is worse than absence — it
is the look of a record with none of a record's properties.

---

## Ceremony

1. **Read** your own ledger — `docs/research/{topic}/project-status.md`, the one ledger of §4 — every
   session's `tldr.md`, and the working docs.
2. **Query** the substrate for §§2-5. Verify each query FIRES on a known-positive row before trusting a
   clean result.
3. **Write** `docs/research/{topic}/sessions/parent-retrospective.md` — NATIVELY, in the tree you were born
   in: the coordinator lives in the effort's worktree, so the scoped write (the effort home's own `.md`
   files, `sessions/`, the tracker, `live-checks.md` and the specs) lands on the effort's branch and rides
   its PR. Every write earns its loud audit row. **If the write REFUSES, that is a PLATFORM DEFECT:**
   record the refusal verbatim as a finding, escalate, and stop. Never spawn a helper to route around a
   defect the next effort needs fixed.
4. **Do not fix anything.** Findings become proposed fixits. The retro is a read.
5. **Then** commit the retro (explicit path) and push it (`git push origin <the effort's branch>`), and
   write `BUILD COMPLETE` into `docs/research/{topic}/project-status.md` (the tracker's close marker). **If no
   PR exists yet, create it yourself** — on the effort's branch, where and how `docs/_meta/engineering-loop.md`
   § This repository's rails (repository-owned) says (when it names no route, ask the human once and suggest
   recording the answer there); one branch, one PR from any seat. **If one is already open, the push is enough.** These three git commands are your own close-out
   lane and they are gated and receipted like any other publish. **The push command must be the ENTIRE
   command** — a leading `cd` disqualifies it — and keep git-verb words out of any echo label you write
   around it; the deny layer matches TEXT, not parsed verbs.
6. **Sweep for stale beliefs BY MEANING, NEVER BY PHRASE — and sweep the SIBLINGS that restate a rule, not
   just the rule's own home.** A sweep keyed on wording only finds the wording it thought of. Ask what each
   instruction *depends on being true* — which file it names, which lane it assumes exists, who it thinks
   holds the tools — and check that, not the string. A correction that lands on the primary document and
   leaves an identical belief standing in a sibling that words it differently has to be made twice.

## Related
- `spec-parent` (the seat, and the run-time half of this skill's close-out demands) · `spec-child` (the
  builders) · `spec-seat` (their shared contract) · `spec-witness` (the read-only verifier) ·
  `spec-pipeline` (which authored the specs you are grading)
