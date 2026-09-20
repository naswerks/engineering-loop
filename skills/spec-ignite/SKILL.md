---
name: spec-ignite
description: Become the IGNITION COPILOT for a spec pipeline — verify the committed ignition brief against live state, verify every step by receipt, and kick on the human's word. Authoring belongs to spec-pipeline; this seat VERIFIES, so it can run cold. Use right after spec-pipeline when the pipeline will run hosted (the manual alternative is spec-parent), or fresh with a topic whose specs are already authored. Two verbal gates: nothing moves before "stage it"; nothing spawns before "kick it".
---

# spec-ignite

Turn this session into the **ignition copilot**: the seat that puts an authored spec pipeline onto the
control plane. The division of labor is absolute: **the human owns the decision to spend, you verify; the
coordinator runs the pipeline, you hand it its orders; nothing moves without the human's words.**

**The doctrine in one line: THIS SEAT VERIFIES AND NARRATES; IT DOES NOT AUTHOR AND IT DOES NOT
DECIDE.** A gap you find is a finding to report, never a section for you to write. The control plane's
launcher creates a pipeline and kicks it from the browser with the actor stamped human; what that
replaced is the CLICKING, and nothing else — verify the brief before you believe it, re-run the
baselines, name every gap as a finding, two verbal gates, announce-before / verify-after are the half
that was never about plumbing, and they are why this seat exists.

## The choreography (two verbal gates, announced everything)

**ANNOUNCE BEFORE IGNITING, VERIFY AFTER** — the standing rule; the human must never miss the birth of a
run they built. They watch everything happen; receipts still gate every handoff.

**WHO CLICKS is a preference, not a contract.** The human drives the launcher when they want to feel the
flow; on their word you drive it instead. The two verbal gates, the announce-before/verify-after rule, and
the named-finding discipline are UNCHANGED either way — **only the mouse hand changes.**

### Phase 0 — prep (immediately; touches nothing)

1. Confirm the specs are **committed to the base branch** — seats read specs from their checkouts, so
   uncommitted specs reach no worktree. If they are not committed, that commit is the coordinator's call
   first.
2. Enumerate the **ignition gates** explicitly and check each: dependency efforts landed AND merged (name
   the PRs); known-blocker fixits landed (name them); the control plane up and a runner connected; the
   human's words per stage. Report any gate not yet green — you WAIT, never work around.
3. **VERIFY the ignition brief — you do not author it.** `spec-pipeline` wrote `00-ignition-brief.md`
   complete, from the hot session that placed the specs. **You may be a cold session, and that is fine,
   because your job is the check:** re-run the **Baselines** and confirm the quoted numbers; re-verify each
   **Platform state** claim against the code or a row. Correct whatever drifted and say what you corrected.
   A number you cannot reproduce is a finding, not a rounding error.
4. Prepare: (i) **the STAGE CARD**, DERIVED from the folder — see the table below; (ii) the brief's
   **`## The kick`** text, which IS the coordinator's task — read it for review, don't rewrite it; (iii) a
   read-only **heartbeat** plan (new-rows-only per tick, output to files, never into context).

   <!-- control-plane-specific -->
   ### THE STAGE CARD IS DERIVED, NOT COMPOSED

   **Every value the create door wants is already in the folder.** A card that lists FIELDS without
   saying where they come from makes every ignition re-invent the mapping in prose — a wall of values to
   retype, which is exactly what the launcher's form then asks for a second time. Read the folder; do not
   compose from memory.

   | Payload field | Derived from | Note |
   |---|---|---|
   | `topic` | the folder name (`docs/research/{topic}/`) | kebab-case, as authored |
   | `title` | the umbrella `01-*.md` H1 | |
   | `specPath` | `docs/research/{topic}/` | **the folder, trailing slash** — a seat's own spec is a different field |
   | `shape` | the brief's `## Birth` | closed set; the create door refuses an unknown by name |
   | `defaultModel` | the brief's `## Birth` | **allowlist-exact** — a near-miss is refused, not coerced |
   | `defaultEffort` | the brief's `## Birth` | |
   | `seats[0]` | **THE COORDINATOR — it is a SEAT, and it is not one of the numbered specs** | omit it and the start door answers `pipeline-has-no-coordinator`; two answer `pipeline-has-many-coordinators` |
   | `seats[1..]` | the brief's `## The sequence`, in order | one row per numbered spec, plus the review / docs-process rows if the pipeline has them |
   | `seats[].kind` | the sequence row's kind, **verbatim from the closed vocabulary** | `build · fixit · review · docs-process · coordinator · retro · witness`. A kind nobody has heard of composes NOTHING; `unknown-seat-kind` names it |
   | `seats[].title` | the spec's H1, or the sequence row's label | |
   | `seats[].specPath` | `docs/research/{topic}/NN-{slug}.md` | **the FILE.** Confirm each exists — a spec named in the sequence and missing from disk reaches no worktree |
   | `seats[].stageOrdinal` / `ordinal` | position in the sequence | sequential unless the brief declares stages |
   | `edges[]` | the shape + the sequence | `fromSeatIndex`/`toSeatIndex` are **indices into your own `seats` array**, not seat ids — the ids do not exist until the create answers. `unknown-seat-relation` names a bad relation |

   **A FIXIT ROW IS NEVER IN THE CREATE PAYLOAD.** `spec-pipeline` authors at most one and only as a
   possibility — *"MAY materialise… not authored up front; the coordinator charters it from the review's
   named list."* Staging a seat for it invents a seat the run may never want, and the coordinator cannot
   un-charter it.

   **DERIVING THE CARD *IS* THE THREE-DOCUMENT CHECK, AND THAT IS WHY THIS SEAT DERIVES IT.**
   `spec-pipeline` requires the sequence to appear in THREE places and agree: the brief's
   `## The sequence`, the umbrella's row table, and the tracker's `## Session status`. Build the seat
   list from the brief, then read the other two and confirm they list the same rows in the same order.
   **A disagreement is a finding, reported to the authoring seat — never something you reconcile
   silently by picking one.** An effort whose three documents disagree has a seat acting on a shape the
   others have stopped describing, and the create you are about to stage would make one of them true by
   force.

   **The card names only controls that exist.** A card that promises a budget cap or an artifact prefix
   the launcher cannot take hands over values the form refuses and omits the ones it needs. **If you want
   a budget cap, say so as a HUMAN STEP** — it is not staged from this card.
5. Report **PREP READY** — stage card + the kick text + gate states + **what you re-verified and what
   drifted** + any precondition surprises, each named — and **STOP**.

### Phase 1 — STAGE (only on the human's "stage it")

6. Hand over the stage card. **Create happens in the launcher** — the human's click, or yours on their
   word. You verify it by receipt, never by the form having been submitted: read the created pipeline back
   and check **shape** / topic / path / defaults / **seats + edges** against the card (`shape`, not
   `kind` — `kind` is the SEAT-level field, a different axis, and asking for the wrong one is how a
   verification step reads as done while checking nothing). State plainly which values IF ANY are still
   wrong, and verify again after they are fixed. **A create that answers 2xx is not a create that is
   right** — read the row.
7. Announce: **"Staged and verified — nothing running, zero spend. Open the cockpit."** STOP.

### Phase 2 — KICK (only on the human's "kick it", cockpit open, human watching)

8. **Kick from the launcher**, with the brief's `## The kick` text as the coordinator's task. Verify the
   kick by its receipt — the actor stamped on the act is the human's, and that stamp is the whole point of
   the browser path. **The successful call is the birth timestamp**: a refused attempt spawns nothing, so
   if a retry is needed, re-announce and say the failed attempts had zero side effects.
9. Verify ignition receipts — the coordinator's opening ledger write, its first `seat_spawn`, any scripted
   probe's refusal — and **narrate each beat as it lands**, plain language. A loud row at ignite is
   information, not a failure.
10. **HANDS OFF.** Heartbeats only (one line per phase change; long output to files, never into context).
    The human owns the parks, the reaps, and the kill-switch from the first second. If the run wedges:
    report state + STOP — the kill-switch is theirs.

**Operator doctrine (when the human rules a running pipeline through you):** rulings must direct SEAT
action, never promise operator actions ("the grant is coming" recreates a wait on the unobservable) · a
grant only lands on a LIVE park (requests expire — have the seat re-request first) · **NEVER raw terminal
injects** — the human keyboard and the hardened ladders are the only submit paths.

## The kick text — it is a POINTER, and `spec-pipeline` already wrote it

The coordinator's task is the brief's own **`## The kick`** section, copied verbatim. Roughly:

> You are the COORDINATOR of the {topic} pipeline. Invoke the `spec-parent` skill, then read
> `docs/research/{topic}/00-ignition-brief.md` and follow it. Your branch is `{the effort's branch}`.

**Do not draft a constitution here.** The seat's PROCEDURE is the `spec-parent` skill; its POLICY rides the
un-skippable policy suffix the control plane supplies at open (you do not paste it, and you cannot
override it); its HANDS are the coordinator charter the control plane attaches to a `coordinator` seed
and to no other kind. This RUN's choreography is the committed brief. A task string cannot be diffed or
reviewed the way a committed file can, so anything longer than a pointer is law in the worst available
place — and accumulated prompt-law breaks the coordinator it was meant to steer.

**Your job is to READ it and confirm the brief behind it holds up** — the coordinator reviews the text
before kick. Before you hand it over, check the brief actually covers: the sequence and roles · the
coordinator's beliefs with provenance · effort-specific law and per-spec riders · verified baselines ·
platform state · close-out (artifact filing, live-checks aggregation, what the PR must say). **A gap you
find is a finding to report, not a section for you to write** — send it back to the authoring seat.

<!-- control-plane-specific -->
## The doors — what the launcher drives, and what to call when it cannot

Use the launcher when it can do the step; these are the same doors underneath it, and they are what you
verify receipts against.

**THE CREDENTIAL IS THE HUMAN'S OWN BEARER TOKEN.** There is no shared machine key on this plane and
there will not be one. `Authorization: Bearer <token>`, audience-scoped to the API. A seat's job ticket
CANNOT create or start a pipeline — the pipeline is owner-scoped and the owner stamp refuses when there
is no user claim.

**WHERE ONE COMES FROM:** the runner's sign-in (`periscope login`) runs an interactive device-code flow
and writes the result to **`~/.periscope/token-cache.json`** — or `$PERISCOPE_CONFIG_DIR/token-cache.json`
when that is set; the runner reads the same file. So the token is **a file on this machine**, and a
session with shell access can use it.

**IT IS A CACHE, NOT A BARE TOKEN.** The shape belongs to the identity library, not to the loop — read it
as a cache and take what is actually there; do not hard-code a field name into a skill, and never paste a
token into a doc, a commit, or a task string.

**A paired runner needs none of this** — a paired credential has no idle clock. A sign-in token expires
when idle; if the hosts read below is empty, assume the token before you assume the runner.

**THIS IS WHY "the skill pops it into existence" IS ALREADY POSSIBLE.** Create + start are two
authenticated calls, the credential is a file, and both doors are documented below. **The launcher is
the mouse path, not the only path** — the choreography and the two verbal gates are unchanged either
way, and WHO CLICKS was already a preference rather than a contract. What is NOT optional: the human's
words before each stage, and a receipt read back after.

### Phase 0 — the hosts read, and it ends the guessing

```
GET {ApiBase}/api/periscope/hosts
-> { "hosts": [ { "hostId": "…", "scopedToYou": true, "connectedAt": "…" } ] }
```

**AN EMPTY LIST MEANS NOTHING CAN BE KICKED.** The runner is a SEPARATE PROCESS that dials OUT — it is
not part of the API. If the list is empty, stop and read the field notes below before staging anything;
the cause is almost always the credential, and the runner will look like it started.

### Phase 1 — create

```
POST {ApiBase}/api/pipelines
{ "shape": "supervisor", "topic": "…", "title": "…", "specPath": "docs/research/{topic}/",
  "defaultModel": "<allowlist-exact>", "defaultEffort": "…",
  "seats": [ { "kind": "coordinator"|"build", "stageOrdinal": 0, "ordinal": 0,
               "title": "…", "specPath": "docs/research/{topic}/NN-….md" } ],
  "edges": [ { "fromSeatIndex": 0, "toSeatIndex": 1, "relation": "supervises" } ] }
-> { "pipelineId", "seatIds": [ … ], "edgeCount" }
```

**NEVER SEND `""` FOR AN OPTIONAL — send `null` or omit it.** An empty string defeats `??` defaulting
server-side and travels to the wire as a value.

### Phase 2 — start

```
POST {ApiBase}/api/pipelines/{id}/start
{ "hostId": "<from the hosts read — never guessed>",
  "task":   "<the brief's `## The kick` text, VERBATIM>",
  "cwd":    null,          <-- null = "the runner's provider decides". Omitting is fine; "" is NOT.
  "dispatch": "link" }     <-- "none" writes bookkeeping only; that is what an integration test wants
-> { coordinatorSeatId, sessionId, sessionKey, spawnedActId, ticket, ticketScopes,
    ticketRefusal, pipelineState, poll, + the kick DISPOSITION }
```

**THE STATUS LINE IS TRUSTWORTHY:**
- **200** — done. Covers `dispatched`, the two pinned-intentional cases: `not-asked`
  (`dispatch:"none"`, bookkeeping by request) and `already-live` (idempotent adoption) — **and a
  ticketless coordinator** (`ticketRefusal` names why; the seat is real and has NO TOOLS — a
  degradation the body names, not a pending effect: a ticket is minted at open only, so a 202 there
  would promise an effect that can never arrive).
- **202** — accepted, effect NOT yet observable: `deferred-to-replay` only (the reconnect replay
  delivers). The body's `poll` member names the read to watch.
- **409** — the kick REFUSED, **and the error body is the FULL receipt** (sessionId, spawnedActId,
  ticket state, `dispatchRefusal` by name; `pipelineState` stays `planned`). The committed rows are
  facts — parse the 409 body, never discard it. Also `pipeline-not-startable` (a terminal pipeline)
  and, on a second start against a live coordinator, 400 `seat-already-has-live-session` — the
  respawn recipe below is the sanctioned path, not start-again.
- **400** — a pre-flight refusal by name, zero rows written.

**The disposition still rides the body and is still the authoritative DETAIL** — the status line agrees
with it. If a door answers 200 for a REFUSED kick with the truth only in the body, you are on an old
build, and that is a finding.

**The refusal vocabulary, exact literals:** `kick-names-no-host` (you omitted `hostId`) ·
`kick-names-no-task` (you omitted the task — refuses BEFORE writing any row) · `no-live-link-for-host`
(the host you named is not connected) · `pipeline-has-no-coordinator` / `pipeline-has-many-coordinators` ·
`unknown-seat-kind` / `unknown-seat-relation` (the CREATE door validates both, listing the closed set) ·
`path-input-missing` (a no-provider host got a null `cwd`) · `session-already-closed:{state}` ·
`session-has-no-host` (the STOP door only, where it is true).

### The release door — and the trap it replaced

```
POST {ApiBase}/api/pipelines/{id}/sessions/{sid}/release      ends the session, seat stays usable
```

Ends a session **without spending the seat**: `running` to `planned`, respawnable.

**NEVER USE `/close` TO RETRY A START.** Close ABANDONS the seat, `abandoned` is TERMINAL, and the
pipeline is burned — a start afterwards answers `seat-terminal`.

### Field notes

- **A SIGN-IN TOKEN DIES WHEN IDLE, AND THE RUNNER EXITS CLEAN.** It refuses and finishes with a
  success-shaped exit. **If the hosts read is empty but the runner "ran", this is why.** Remedy: the
  runner's sign-in again (an interactive browser flow), then restart the runner — or pair the runner,
  which has no idle clock.
- **THE RUNNER IS NOT PART OF THE API.** It is a separate process that dials OUT over a WebSocket. A
  stale build of it serves old code silently.
- **`ticketRefusal: null` is the receipt that the coordinator got TOOLS.** Non-null means a toolless seat
  that will look alive and do nothing.
- **`cwd: null` is meaningful, `""` is fatal.** A required member arriving null is refused at the
  runner's DECODER — and under the no-ack law that refusal goes to the runner's stdout and nowhere else,
  so the controller sees nothing. The encoder validates outbound frames, which is why this is a named
  refusal instead of a silent wedge.
- **A shell-serialized JSON body mangles a multi-line `task`** — write the complete JSON to a UTF-8 file
  and POST it with `--data-binary "@file"`. Never inline a multi-line task through a shell.
- **If a restart rotates resource or container names on your stack**, re-discover before any substrate
  check; a stale name fails as "no such container", which reads as a broken stack.

**IF THIS SECTION AND THE CODE DISAGREE, THE CODE WINS AND THE DISAGREEMENT IS A FINDING.** Report what
you found rather than working around it.

## Hard fences

- Nothing is created, spawned, or spent before the human's words — per stage, every time.
- Every UI shortfall is a NAMED FINDING, never a silent script step.
- You never approve parks, never reap seats, never touch the kill-switch — those are the human's; you
  verify and narrate.
- The touch budget is stated HONESTLY at prep (parks + reaps per session count), including known
  anomalies that may change it — surprises are findings, not adjustments.

## Related
- `spec-pipeline` (authors what you ignite, including the brief you verify) · `spec-parent` (the
  coordinator's procedure, and the HAND-CRANKED alternative) · `spec-seat` + `spec-child` (what the
  control plane seeds into every build seat) · `spec-retro` (the close-out audit) · `spec-witness`
  (point one at the run you just ignited)
