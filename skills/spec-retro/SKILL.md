---
name: spec-retro
description: The COORDINATOR's close-out retrospective for a finished spec pipeline — a substrate-VERIFIED grade of the run, the ceremony audit (did the acts the seat believes it performed actually write rows?), the ledger reconciliation, the true economics, the blindnesses, and the ranked fixit backlog. Run at the close, after the last session's commit. Run spec-retro {topic}.
---

# spec-retro

The coordinator is the only participant who sees every session of a pipeline from the inside — and
today that perspective evaporates the moment the run closes. This skill turns it into an artifact.

**It is not a summary. It is an audit — of the pipeline, and of the seat that ran it.**

Run it as the **last act of the coordinator seat**, after the final session's close-out commit — before or
after the PR is cut, either works. Output: `docs/research/{topic}/sessions/parent-retrospective.md`. It is
a scoped write on the pipeline's branch, so it rides the PR to main either way.

⚠ **You are one of the three kinds that do NOT compose `spec-seat`** — this skill is your whole contract,
and `SeatSeedComposer` pins that exclusion rather than merely omitting it.

---

## THE ONE RULE

**The retro must be able to fail.**

If the ceremony audit shows the seat's acts wrote no rows, the retro says so **in the first paragraph, in
bold**, and the grade drops. If the ledger was wrong, it says how many times and who caught it.

> **A retrospective that cannot indict its own author is marketing.**

The section that justifies the skill is §2, and it exists because one effort discovered in its SIXTH
session that the coordinator had "accepted" five final TLDRs and the platform had recorded **zero** of
them — the close-out called the prose verb instead of the receipt verb, and the push lane's own condition
read a row the ceremony never wrote. One query would have caught it on day one.

---

## Prerequisite: you must be able to see the substrate

**The first-line substrate read is your own act sweep, called ARGLESS** — the unfiltered pass over ALL
verbs, human and exception rows included. **Start every audit with it: "what happened to my run that I did
not ask about."** A verb-filtered read can only confirm suspicions, never surface surprises — one
coordinator audited the five verbs it had in mind and certified "zero-touch" while three
`approved_by_human` rows sat one unqueried verb away.

⚠ **If the argless sweep is not runnable at your run's scale, that is a day-one escalation, not a
close-out discovery.** A few thousand rows can exceed the lane's page budget; you cannot retroactively
obtain the audit your own doctrine mandates. `spec-parent` carries this as a run-time obligation — check
it early.

🔴 **AND ON THE HOSTED PLANE, CHECK WHETHER YOU CAN SWEEP AT ALL BEFORE YOU PLAN A RETRO AROUND IT.** A
`coordinator` ticket deliberately does **not** carry `acts:read` — its mint is `seat:read` ·
`pipeline:read` · `drive:write`, and that exclusion is load-bearing rather than an oversight: granting it
would have made `acts:read` universal and vacated the pin that keeps the mint table falsifiable. So the
argless act sweep is **not** a coordinator's own instrument there. Your reads are `read_blackboard`
(argless = the roster) and whatever the effort's witness or a credentialed operator can hand you. **Say
which instrument produced every count in this document** — a number whose lane you cannot name is
testimony, not an audit.

> ⚙ **v1 PLANE (still running) — chain mode.** Everything from here to the end of this section names the
> OLD plane's three instruments. They are the ones a real chain is audited with today, and they are why
> §2 can be performed at all — but none of the calls below exists on the hosted plane.

🔴 **YOU HOLD TWO INSTRUMENTS, AND THE SECOND ONE IS WHY §2 MEANS ANYTHING.**
Besides `chain_rows` (in-band, no credential) there is the **audit seam** — `GET
/api/agent-network/audit/{coordinatorId}/…` (GETs only) — with `runs` · `rows` (`verbs`, `groupBy`,
`sinceId`, `rowId`) · `gate` · `usage` · `digest`.

⚠ **The seam is NOT credential-free, and this skill used to say it was — chain-46's parent filed C0
as "could not be performed" on the strength of that wrong word.** It needs the worker key, and a
governed seat already holds it ON DISK: `.nas/hook-key` at your worktree root (written at every
governed spawn — SF-6 moved the key out of your *environment*, not off your disk). The recipe:

```
curl -s -H "X-Worker-Key: $(cat .nas/hook-key)" -H "X-Nas-Session: $NAS_SESSION_ID" \
  "$BFF_URL/api/agent-network/audit/{coordinatorId}/digest"
```

Send `X-Nas-Session` ONLY — never `X-Worker-User-Id`; the two headers are mutually exclusive (auth
FAILS if both are present) and the session resolves your ownership server-side, fail-closed. If the
file is missing or the read 404s, that is a day-one escalation (`spec-parent` carries it), not a
close-out shrug.

**It shares no code with `chain_rows`:** different endpoint,
different repository, Dapper raw SQL instead of EF Core, ownership enforced in the WHERE clause, JSON
instead of rendered text. That non-overlap is pinned by a test
(`NasPlatform.ArchitectureTests.AuditSeamIndependenceRules`), so it cannot rot quietly.
⚠ One stated blindness: **the seam reads the ceremony half only** (`plugin_name='agent_network'` sits
in its shared scope fragment) — it cannot see execution rows. The execution half's instruments are
`chain_rows(lane='execution')` and the reserved psql lane below (filed platform gap: seam
execution-lane parity).

**Why that matters here, in one sentence:** *an audit lane that can only be audited by itself is not
audited; it is asserted.* Reconciling a count across `chain_rows` and the seam is a real cross-check,
where `chain_rows` verifying `chain_rows` is not.

**The reserved cross-check — `psql`, a THIRD instrument, and now only when you want one.** Neither
lane above needs a database credential or a local docker socket; both work off-box. So reach for psql
deliberately — for a number you are about to publish as fact — rather than by default:

```
PG=$(docker ps --format '{{.Names}}' | grep -i postgres | head -1)   # renamed per boot; image pgvector/pgvector:pg17
PW=$(docker exec $PG printenv POSTGRES_PASSWORD)
docker exec -e PGPASSWORD=$PW $PG psql -U postgres -d nas-bff-db -t -A -F ' | ' -c "<QUERY>"
```

⚠ **The PS→sh→psql quoting trap applies to THIS block and not to the two lanes above:** nested quotes
mangle silently and psql exits 0 with EMPTY output. Silently-empty ≠ empty table. Single quotes only
INSIDE the double-quoted SQL, and verify the pipe with a `SELECT count(*)` you know is non-zero before
believing a clean result.

**READS ONLY. Never write to the platform DB.**

🔴 **STATE WHICH INSTRUMENT PRODUCED WHICH NUMBER — every time, in the retro itself.** "The two agreed"
is worth nothing unless a reader can tell WHICH two, and "which instrument produced this?" must stay
answerable after the chain is archived. The seam helps: every payload carries an `instrument` field you
can quote verbatim.

🔴 **BEFORE ANY COUNT: STATE WHAT WRITES THE ROW.** A count over rows measures the paths that *write*
rows, not the population you have in mind — and the gap is invisible in the result.

The case that cost four seats: a birth-time probe was reported across three artifacts as *"never once
worked — three rows in the platform's entire history, all `available:false`."* It had succeeded **twenty
silent times.** The code returns **before** the row write when there is nothing to report, so a clean run
writes nothing: the three rows were three *failures*, and every silent spawn was a success. A witness, a
chain charter and a skills seat each repeated the conclusion because none asked what the instrument
records.

**Absence of a row is not absence of the event.** Read the writer before you read the count — one glance
at the emit site tells you whether you are measuring the population or only its failures.

**Three query disciplines, and every one of them has produced a confident false result:**

- **Verify your query FIRES on a known-positive row before you trust a clean result.** A
  silently-empty result is usually a broken query, not an empty table.
- **PostgreSQL's `\b` is backspace, not a word boundary.** Use `\y`.
- **Gate rows store their args double-encoded** (`"` escapes). A naive predicate returns **zero rows** — a
  confident FALSE ALL-CLEAR on the most important check in the audit.

**Gate-command false-park warning:** the backstop scans the WHOLE command string. A query whose text
contains the words `git` and `push` (even inside a SQL string literal), or `git` + `branch` + a `-d` flag
(psql's own database flag), will park by design. **Reshape the command — never re-request it.**
Re-requesting a parked boundary command is the known fail-open. *(This is the boundary half of the shared
discriminator in `spec-child`: a park on a BOUNDARY-shaped command is reshaped; a park blocking a child's
own legitimate in-worktree work is re-requested + disclosed.)*

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

🔴 **THE ONE FACT THIS SECTION RESTS ON, AND IT IS TRUE ON BOTH PLANES: a verb count is NOT an act
count.** Several acts write rows under MORE verbs than their own name, and a row does not always land on
the actor's own run. Before reading ANY per-verb count as a population of acts, read the act→rows mapping
for the plane you are on — it is code-pinned on both, and it is the difference between an audit and an
arithmetic error dressed as one.

> ⚙ **v1 PLANE (still running) — chain mode.** *(Verb vocabulary: the canonical table lives in
> `docs/infrastructure/agent-network-mcp.md` § Ceremony verb vocabulary — check it at run time; the
> catalog moves.)* There `accept_child_plan` alone writes `callout` + `tldr_rev` + `gate_policy` rows
> beside `plan_accepted` (all on the CHILD's run), and a redelivered identical ruling re-writes the
> callout but never a second `plan_accepted` — so chain-46's parent counted 5 "callouts" as steering on
> a chain with zero steering, and nearly filed it. The mapping is `AgentNetworkVerbs.MultiVerbActs`,
> pinned by `CeremonyActFootprintTests`.
>
> **On the hosted plane the equivalent is the CLOSED verb type** — 19 canonical `CeremonyVerb`
> instances with a private constructor, so a bare string cannot become a verb; and the two axes are
> declared SEPARATELY because they are different questions: `MeansAnAnswerExists` is exactly
> `{escalation_resolved, operator_ruling}` — **the only verbs a "was this answered?" reader may
> count** — while `TerminatesAnEscalation` is five, three of which close the object without anybody
> answering anything. ⚠ `injected_by_human` is deliberately in NEITHER: **a human touch is not an
> answer.** Which verbs have real writers is readable from
> `VerbWriterClassificationPinTests` rather than inferred from a count.

**Start UNFILTERED** (the Prerequisite above), then narrow — and **narrow on BOTH lanes, because this
is the section where the second instrument earns its keep**:

```
chain_rows(groupBy='verb')                       # instrument A — EF Core, rendered text
chain_rows(groupBy='actor')                      # the (verb, actor) pair is what separates a seat's
                                                 # own act from the parent acting on the seat's run
GET …/audit/{coordinatorId}/rows?groupBy=verb    # instrument B — Dapper, JSON, no shared code
GET …/audit/{coordinatorId}/rows?groupBy=actor
```

**Reconcile the two, and record that you did.** Equal counts across independent lanes is the C0-shaped
evidence this section exists to produce; a divergence is a finding about an instrument, and finding one
is a *success* of the method, not a failure of the run.

The same question in the reserved cross-check (#psql, only for a number you will publish as fact):

```sql
-- Ceremony receipts for this coordinator's seats.
-- Compare each count against what the seat BELIEVES it did.
SELECT function_name, actor, count(*)
FROM tool_invocation_events
WHERE orchestration_id IN (SELECT id FROM agentnetwork_orchestrations WHERE coordinator_id = <COORD>)
  AND function_name IN ('plan_accepted','reviewed','reaped','escalated','spawned','budget_pause','auto_push')
GROUP BY 1,2 ORDER BY 1;
```

**Any zero-touch or ceremony-fidelity claim must cite the argless sweep**, never a verb list the seat
picked itself — that is the difference between a self-report and an audit. If the sweep could not run, say
so and state the claim as a FLOOR. The human-touch family is `approved_by_human` / `denied_by_human` /
`edited_by_human` / **`injected_by_human`** (chain-49: raw-box terminal input rows now — one receipt per
burst; before it, a raw-box nudge left zero rows and every "unattended" claim was unfalsifiable) plus
`operator_ruling`; `escalation_defaulted` and `escalation_expired` are POLICY receipts and never count.

Then reconcile, explicitly:

| the seat believes | the substrate says | verdict |
|---|---|---|
| N plans accepted | N `plan_accepted` rows? | |
| N TLDRs accepted | **≥ N** `reviewed` rows (actor=`parent`)? | |
| M seats reaped | M `reaped` rows? | |
| K escalations held | K `escalated` rows? | |

**Read that second row as `≥`, not `=`.** Argless re-accepts write their own doorbell rows, so more
`reviewed` rows than acceptances is the healthy case.

⚠ **RECONCILE THE EXCESS TO AN OBSERVED CAUSE — do not attribute it.** At least two different paths write
that row: a **forced** re-accept after a rev-bound refusal, and a coordinator **choosing** to re-bind inside
its own ruling. They are indistinguishable by count. One effort read the excess as proof that a mid-build
question stales the acceptance — it correlated 2-for-2 there and **the next one cleared three reaps under
the same documented refusal condition with no re-accept at all.**
✅ **PART OF THAT IS NOW ESTABLISHED, and the narrowing is worth carrying:** a post-acceptance append DOES
stale a PUSH — observed with the refusal naming both revs, and observed from BOTH actors (a coordinator
staling its own acceptance by steering, a seat staling it by ASKING). What is still open is why a
close-out-receipt append did NOT stale a REAP across three further revisions. ⚠ **So the reap and the push
do not apply the same predicate — do not flatten them into one rule**, and the discriminating case
(accepting BEFORE answering a held question) has still never been run.

**A count over rows measures every path that writes them, not the one you had in mind.** For each excess
row, name which path produced it or say you could not tell.

**The derived-row path:** the acceptance's durable record is the `## PARENT ACCEPT (final — {slice})` anchor
in each seat's `tldr.md`, and the `reviewed` row DERIVES from it. Reconcile file against
substrate:

```bash
grep -rn "## PARENT ACCEPT" <sessions-or-blackboard-dir>/*/tldr.md
```

**AUDIT THE QUESTION LANE THE SAME WAY — it is a heading grep, not a row query.** A seat asks by appending
to its own `tldr.md` and posting; there is no park, no request id, no queryable object. **An audit that
looks only for question rows finds zero and concludes nobody ever asked** — which can be flatly false in a
run whose seats asked repeatedly and changed a ruling by it.

🔴 **AND ON THE HOSTED PLANE THE FILE IS NOT THE CLOSE PREDICATE — audit BOTH halves, because they answer
different questions.** *Was one asked?* is a fact about the file (the heading grep below, mirroring
`BlackboardGrammar`). *Was it answered?* is a fact about the LEDGER — the ruling act carrying the asking
post's id — and it is deliberately not read from the file, because a seat can type a parent-voice heading
into its own blackboard. **A retro that audits only the file can be shown a question that answered
itself.** Reconcile the grep's hits against the ruling acts, and report any hit with no act as an
unanswered question whatever the file says.

**Use the tolerant predicate the platform itself uses** — an anchored `^## MID-BUILD QUESTION` misses
prefixed and plural headings (a retro has already nearly certified a false negative that way), and since
chain-45 fixits the lane has TWO headings: `## QUESTIONS` (recon-phase) and `## MID-BUILD QUESTION`
(post-accept). The grep mirrors the platform regex, including its `QUESTIONS ANSWERED` refusal:

```bash
grep -rniE '^##[[:space:]]*(\[[^]]*\][[:space:]]*)?(MID-BUILD[[:space:]]+)?QUESTIONS?\b' <dir>/*/tldr.md | grep -viE 'QUESTIONS?[[:space:]]+ANSWERED'
```

Reconcile each hit against the parent-voice append that answered it (`## PARENT RULING` / `## PARENT NOTE`
in the same file) — an unanswered question is the finding. **Your audit instrument must be at least as
tolerant as the code it audits.**

- **Rails:** N `## PARENT ACCEPT` anchors ⇒ N `reviewed` rows (rev-bound: args carry
  `tldrRev`/`headSha`/`contentHash`). An anchor with no row = the derivation failed (LOUD in the logs —
  find it); a row with no anchor = a doorbell/cockpit accept (legitimate, args say
  `derivedFrom: "accept-doorbell"`). Acceptance-shaped PROSE without the anchor writes nothing by design —
  flag it as a ceremony miss.
- **Hand-cranked:** there is no sidecar and no derivation — expect ZERO `reviewed` rows; the anchors plus
  the parent's tracker rows ARE the receipts. Reconcile anchors against tracker rows instead.

**If ceremony and substrate disagree, that IS the finding — and it is ALWAYS the ceremony's fault, never
the lane's.** A lane that requires a durable, attributable receipt is correct. A ceremony that produces
prose instead of a receipt is broken. **Do not "fix" it by weakening the lane.**

### 3. THE GATE-INTEGRITY CHECK (C0)

**Every execution row must have exactly one gate-decision row.** Score it TEXTUALLY, never by count
arithmetic — gate rows cover *all* tool calls while execution rows are transcript-ingested, so the counts
legitimately differ and a real leak can hide inside that gap.

> ⚙ **v1 PLANE (still running) — chain mode.** The instruments in this section — the `gate-integrity`
> grouping, the audit seam's `gate` route, the reserved psql lane and the byte-stable park-reason
> constants — are the old plane's. The DOCTRINE is plane-agnostic and is the part to carry: score
> textually, refuse a clean zero without a live control, and report INCONCLUSIVE as a real result.

🔴 **The first-line read is `chain_rows(groupBy='gate-integrity')` — C0 as one call.** Built after
chain-46, whose parent discovered the sanctioned lane was structurally blind to the execution half
(`groupBy='verb'` returned 16 verbs and not one tool name while psql over the same table showed Bash
352 / Edit 236 / Read 195) — and whose §3 was first filed "could not be performed" when the truth was
"never attempted." One call returns: stamped turns · turns with executions · **UN-GATED turns NAMED
individually** (run + turn + execution row ids) · execution and gate-decision counts (the verb set it
counted is printed in the output) · unstamped executions as a named coverage floor · **and the
inverted-predicate CONTROL — turns carrying BOTH populations — always computed, always rendered.**

Read the verdict line literally:
- **CLEAN only exists with a live control.** The tool refuses to say clean when the control is 0 —
  "0 un-gated" and "the join matched nothing" are the same output otherwise, and that is the
  false-green shape this repo has shipped three times.
- **INCONCLUSIVE is a real result.** Report it as INCONCLUSIVE — never as clean, and never as "not
  performed" (chain-46's costume).
- **LEAK names its turns** — expand the named rows (`expandRowId`, or page `lane='execution'` with
  `sinceId`) before drawing conclusions.

**The execution half is also directly readable**: `chain_rows(lane='execution')` pages the
transcript-ingested tool rows (`verbs` matches tool names verbatim there), and `groupBy='verb'` over
that lane is the tool histogram psql used to be needed for. The ceremony default is UNCHANGED and
pinned — an argless `chain_rows()` still means exactly what it meant in every past retro.

**The gate half's independent instrument stays `GET …/audit/{coordinatorId}/gate`** (worker key +
`X-Nas-Session` — the recipe above) — the gate verbs the timeline excludes as noise, plus the durable
decision plane with its non-terminal rows NAMED individually. The seam cannot see execution rows
(stated blindness, filed gap), so the execution-side cross-check for any number you are about to
publish as fact is the reserved psql instrument below.

**The join is `(orchestration_id, round_number)`** — the turn-correlation id, carried by both gate rows and
execution rows, proven end-to-end against real Postgres. Use it, and nothing else: a negative control shows
that joining by id-proximity collapses many executions onto few gate rows, which yields a confident wrong
answer rather than a null one.

⚠ **Two things to establish before you claim a result:**

1. **Is the stamp DEPLOYED on the build this run used?** A run that hosts itself cannot restart the gate
   it runs on, so one running on an older binary has NULL `round_number` on every gate row. The
   primitive surfaces this itself (every execution lands in the unstamped floor and the verdict goes
   INCONCLUSIVE); if you are in psql instead: **report C0 as NOT PERFORMED, say the reason is "the id
   exists and is not loaded on this build," and move on.** That is an honest non-result and it is worth
   more than a confident number the substrate cannot support.
2. **Does your query fire on a known-positive?** The primitive carries its control in-band; the moment
   you drop to psql you own that discipline again — run the inverted predicate (turns with BOTH) and
   refuse your own clean zero if it returns 0. See the Prerequisite's three disciplines — the
   double-encoded args have produced a false all-clear on exactly this check.

**Park-reason grep contracts:** boundary parks carry per-pattern BYTE-STABLE reasons in `result_summary` —
key park-audit queries on those constants (`chain backstop: pushes/branch-ops need the human` · `chain
backstop: git remote surgery needs the human` · `chain backstop: branch deletion is human-only` · `chain
backstop: gh pr merge — merging is the human's boundary` · `chain backstop: gh pr edit beyond the chain's
own PR needs the human`), **never on the `unattended` annotation's presence** — only push-shaped parks
carry that annotation, so annotation-keyed queries silently miss every other boundary park.

### 4. THE LEDGER RECONCILIATION

Every load-bearing claim in the parent's ledger, checked against substrate: costs, suite counts, commit
shas, row counts. **Report every divergence.**

**ONE ledger:** `docs/research/{topic}/project-status.md`, which the coordinator owns and advances **live**
with ordinary file tools in both modes. Check it against substrate; do not go looking for a second one.

🚫 **THE RETRO CONFIRMS THE ROWS — IT NEVER ADVANCES THEM.** Add the audit and the economics; do **not**
rewrite session rows to match reality at close. **If a retro has to supersede its own session rows, the
ledger was not kept, and that is itself the finding to report.** The named anti-pattern is a tracker whose
close-out section reads *"RETRO ADVANCE — verified reality as of {date} (supersedes the stale rows above)"*.

**Verify the readability bound PER ENTRY, not by total size.** Each `### Session X` section must return
from an ordinary offset/limit read. **A line count is the wrong instrument** — it falls as cells grow, so a
ledger kept as giant table cells scores *better* on lines while being unreadable to any reader that exists.

*Seats read the coordinator's ledger as authoritative.* One coordinator wrote a wrong character count, a
seat copied it, the next copied that, **and the wrong number reached two shipped code comments.** A ledger
that cannot be checked will drift, and its drift will be inherited.

### 5. THE TRUE ECONOMICS

**Economics is read one row per instrument and NEVER summed across them** — that is the shipped rule, not a
style note: two instruments measuring the same spend by different paths do not add up, they cross-check.
Report per-seat totals, your own line, the run total, the account rate-limit rails, per-turn model truth,
**and the uncosted-turn count** — a total with no uncosted count is a claim with no error bar.

> ⚙ **v1 PLANE (still running) — chain mode.** The first-line read there is `read_usage`, argless — to
> this section what `chain_rows` is to §2. Never sum session footers: they ride the *children's* wakes
> and silently omit the parent's own spend. On the hosted plane the seat-side equivalent is `seat_usage`.

🔴 **THE PUBLISHED-TOTAL RULE: every total you publish names its exclusion.** The DOLLAR figures read
`agent_turn_usage`, which is per-seat — Task-subagent (sidechain) spend is excluded from them, and
`uncostedTurnCount 0` does NOT make a dollar total the whole cost (chain-46 published "$233.87,
uncostedTurnCount 0" as a TRUE TOTAL while ~744k sidechain tokens were invisible — *a true number that
is not the whole number, which is worse than an obviously missing one*). **Since the chain-48 harness
fixes the sidechain TOKENS are REPORTED by both instruments** (`read_usage` per-seat `sidechain` totals
+ `coordinatorSidechainTokens`; the seam's per-seat + total `subagentTokens`) — the tokens were always
in the substrate (`agent_conversation_messages`), absent only from the rollups. Quote totals as
**"$X plus N sidechain tokens"**, and treat the token figure as a FLOOR (it appears only after the
conversation sweep ingests the session; tokens are deliberately unpriced — per-model sidechain pricing
is the API rebuild's).

🔴 **THE COORDINATOR-SHARE CURVE RULE (chain-48 §5): the share is a CURVE, not a constant.** It opens high
(recon before any seat exists), falls through the build, and turns SHARPLY UPWARD at close — the
close-out is disproportionately coordinator work (chain-48: 20.8% mid-curve → 27.1% one correction later;
four seats built for ~$130, then the coordinator spent ~$14 alone writing up what they did). **Any share
you publish, and any cross-effort comparison, must say WHERE ON THE CURVE it was taken.** And a retro
reporting its own run's cost can never report a final number — writing the figure costs money — so
publish it as a floor "at the time of writing".

⚠ **`escalation_defaulted` rows are NEVER human touches.** A declared conservative default coming into
effect at its deadline is a POLICY receipt (actor `waker`, `humanTouch:false` in its own args) — every
human-decision count in this retro must exclude it, and a run that went on a declared default says so
as "policy resolved the wait", never as a human ruling. ⚠ **`escalation_expired` is a THIRD outcome and
not a synonym for the second:** the window closed on silence with nothing declared. Collapsing expire
into fire forges a policy receipt for a decision nobody made.

**The second instrument is `GET …/audit/{coordinatorId}/usage`** — per-seat totals, the coordinator sum,
the parent's own line and `uncostedTurnCount`, on a code path that shares nothing with `read_usage`. Cost is
the figure most often quoted out of a retro and least often cross-checked; reconcile the two here and say
you did. *(The account rate-limit rails live on `read_usage` only — the seam reads the engine's own
`agent_turn_usage`, never the machine-wide store, and the two must never be summed.)*

🔴 **They are NOT the same numbers, and exactly ONE difference is expected: A RUN THAT HAS BEEN DELETED.**
`read_usage` counts a usage row by its stamped `coordinator_id` **or** its surviving run, so a deleted run's
spend still counts. The seam enumerates runs and LEFT JOINs usage onto them, so a row whose run row is gone
has nothing to join to and drops out. **If a run was deleted, publish `read_usage` — not because it is the
default but because it is the MORE COMPLETE figure: it is coordinator-attributed and survives the deletion,
while the seam undercounts by every orphaned row.** Say which instrument you published and that a deletion
explains the gap. **Any other divergence is still a FINDING, not a retry** (live-check L-17) — it means one
lane is wrong, which is exactly what having two is for. Do not generalise the deletion case into a licence
to pick the bigger number: it is the only quantity on which these two lanes legitimately differ.

The same question in the reserved cross-check (psql, for a figure you are about to publish):

```sql
SELECT sum(estimated_cost_usd) AS total,
       sum(estimated_cost_usd) FILTER (WHERE orchestration_id = <PARENT_RUN>) AS parent_share,
       count(*) FILTER (WHERE estimated_cost_usd IS NULL) AS uncosted_turns
FROM agent_turn_usage
WHERE orchestration_id IN (SELECT id FROM agentnetwork_orchestrations WHERE coordinator_id = <COORD>);
```

Report: total · parent share (%) · per-session · uncosted turns. **Every total is a FLOOR while
`uncostedTurnCount > 0`** — report it with the count, never as a total.

A rails parent is not a thin router: it reads plans, verifies claims in source, and writes a live ledger, so
a parent share around a fifth of the chain is cheap rather than alarming. An *unusually expensive* parent is
the signal — it is usually diagnosing platform bugs, which is itself an anomaly to report.

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

⚠ **And do not manufacture symmetry.** A coordinator that has been logging its own slips can tip into
*inventing* one to keep the accounting even; a record whose value is accuracy is damaged as much by a
fabricated error as by a hidden one. **Self-accounting that reaches for errors is no longer measuring
anything.**

⚠ **Check this section's own claims against HEAD before you file it.** A retro cataloguing stale-anchor
errors has shipped a fresh one *inside the entry that corrected the previous one*, because a later seat's
docstring moved the line. **Name symbols here too.**

### 8. THE PAIN LOG → the ranked fixit backlog

Every friction point, converted into a proposed fixit, **ranked by the cost of NOT doing it** (not by
effort). The pipeline exists to widen the seat's autonomy — **so every wall it hit is a spec.**

### 9. WHAT FELL THROUGH THE CRACKS

Named explicitly, because the alternative is that it stays fallen. Include the open questions the run
could not settle, and say plainly that they are open. **Check the effort's `live-checks.md`** — unaggregated
verification rows are the most common thing to fall through.

### 10. 🔴 THE FINDINGS DISPOSITION PASS — *the drain, and it is the section that decides whether the effort's findings survive it*

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

🚫 **A destination that does not exist yet is not a destination.** "Row 11 will handle it" is homing a
finding to an unauthored document. If the row is not written, the finding is unhomed — say so, and pick
another exit.

**PUBLISH THE TALLY, with its derivation:**

```
N logged · N forwarded · N closed · N UNHOMED
```

**`UNHOMED` must be zero.** A non-zero count is not a footnote — it is this section's headline finding,
and it names the run's real defect rather than the findings'.

⚠ **Count by SUBSTANCE, not by id.** Grep the log's distinctive text at its destination and confirm it
landed. An id that appears downstream under a *different* finding is a collision, not a placement — and
narrative prose mentioning a finding inside a process-incident entry is **not** a log record: no id, no
destination, no status. **This exact failure has shipped**: one effort's review produced 15 findings, and
14 reached nothing. Two of those 14 *appeared* in the tracker as prose inside an incident narrative,
which is worse than absence — it is the look of a record with none of a record's properties.

---

## Ceremony

1. **Read** your own ledger — `docs/research/{topic}/project-status.md`, the one ledger of §4 — every
   session's `tldr.md`, and the working docs.
2. **Query** the substrate for §§2-5. Verify each query FIRES on a known-positive row before trusting a
   clean result.
3. **Write** `docs/research/{topic}/sessions/parent-retrospective.md` — NATIVELY, in the tree you were born
   in: the coordinator lives in the effort's worktree, so the scoped write (`docs/research/*/sessions/` +
   `.nas/agents/parent/` + the effort's `project-status.md` + — since the chain-48 widening — the effort
   home's own `.md` files, `live-checks.md` and the specs) lands on the effort's branch and rides its
   PR. Every write earns its loud `auto_approved` audit row. **If the write REFUSES, that is a PLATFORM
   DEFECT:** record the refusal verbatim as a finding, escalate, and stop. Never spawn a helper
   to route around a defect the next effort needs fixed.
4. **Do not fix anything.** Findings become proposed fixits. The retro is a read.
5. **Then** commit the retro (explicit path) and push it (`git push origin nas/chain-{id}`), and write
   `BUILD COMPLETE` into `docs/research/{topic}/project-status.md` (the PR-pointer trigger). **If no PR
   exists yet, create it yourself** — `gh pr create` on the effort's branch; one branch ⇒ one PR from any
   seat. **If one is already open, the push is enough.** These three git commands are your own close-out
   lane and they are gated and receipted like any other publish. ⚠ **The push command must be the ENTIRE
   command** — a leading `cd` disqualifies it — and keep git-verb words out of any echo label you write
   around it; the deny layer matches TEXT, not parsed verbs.
6. **Sweep for stale beliefs BY MEANING, NEVER BY PHRASE — and sweep the SIBLINGS that restate a rule, not
   just the rule's own home.** A sweep keyed on wording only finds the wording it thought of. Ask what each
   instruction *depends on being true* — which file it names, which lane it assumes exists, who it thinks
   holds the tools — and check that, not the string. This has now cost three separate corrections: each
   landed on the primary document and left an identical belief standing in a sibling that happened to word
   it differently.

## Lineage
- **Origin** — the `chain-night-shift` parent retrospective
  (`docs/archive/chain-night-shift/sessions/parent-retrospective.md` — an archive folder name, kept
  verbatim so it stays greppable), the run that discovered the ceremony wrote no receipts and the gate
  could allow but not deny
- **Related** — `spec-parent` (the seat, and the run-time half of this skill's close-out demands) ·
  `spec-child` (the builders) · `spec-seat` (their shared contract) · `spec-witness` (the read-only
  verifier) · `spec-pipeline` (which authored the specs you are grading)
