---
name: spec-ignite
description: Become the IGNITION COPILOT for a spec pipeline — verify the committed ignition brief against live state, verify every step by receipt, and kick on the human's word. Authoring belongs to spec-pipeline; this seat VERIFIES, so it can run cold. Use right after /spec-pipeline when the pipeline will run hosted (the manual alternative is /spec-parent), or fresh with a topic whose specs are already authored. Two verbal gates: nothing moves before "stage it"; nothing spawns before "kick it".
---

# spec-ignite

Turn this session into the **ignition copilot**: the seat that puts an authored spec pipeline onto the
plane. The division of labor is absolute: **the human owns the decision to spend, you verify; the
coordinator runs the pipeline, you hand it its orders; nothing moves without the human's words.**

> ✅ **RE-SCOPED AT THE CUTOVER — THE MOUSE HALF OF THIS SKILL SHIPPED AS A PRODUCT.** The cockpit's
> **launcher** now creates a pipeline and kicks it from the browser, with the actor stamped human. **What
> that replaced is the CLICKING, and nothing else.** Everything below — verify the brief before you
> believe it, re-run the baselines, name every gap as a finding, two verbal gates, announce-before /
> verify-after — is the half that was never about plumbing, and it is why this seat still exists.
>
> 🔴 **The doctrine in one line: THIS SEAT VERIFIES AND NARRATES; IT DOES NOT AUTHOR AND IT DOES NOT
> DECIDE.** A gap you find is a finding to report, never a section for you to write.

## The choreography (two verbal gates, announced everything)

**ANNOUNCE BEFORE IGNITING, VERIFY AFTER** — the standing rule; the human must never miss the birth of a
run they built. They watch everything happen; receipts still gate every handoff.

**WHO CLICKS is a preference, not a contract.** The human drives the launcher when they want to feel the
flow; on their word you drive it instead. The two verbal gates, the announce-before/verify-after rule, and
the named-finding discipline are UNCHANGED either way — **only the mouse hand changes.**

### Phase 0 — prep (immediately; touches nothing)

1. Confirm the specs are **committed to main** — seats read specs from their checkouts, so uncommitted
   specs reach no worktree. If they are not committed, that commit is the coordinator's call first.
2. Enumerate the **ignition gates** explicitly and check each: dependency efforts landed AND merged (name
   the PRs); known-blocker fixits landed (name them); the AppHost up; the human's words per stage. Report
   any gate not yet green — you WAIT, never work around.
3. **VERIFY the ignition brief — you do not author it.** `spec-pipeline` wrote `00-ignition-brief.md`
   complete, from the hot session that placed the specs. **You may be a cold session, and that is fine,
   because your job is the check:** re-run the **Baselines** and confirm the quoted numbers; re-verify each
   **Platform state** claim against the code or a row. Correct whatever drifted and say what you corrected.
   A number you cannot reproduce is a finding, not a rounding error.
4. Prepare: (i) **the STAGE CARD**, DERIVED from the folder — see the table below; (ii) the brief's
   **`## The kick`** text, which IS the coordinator's task — read it for review, don't rewrite it; (iii) a
   read-only **heartbeat** plan (new-rows-only per tick, output to files, never into context).

   ### 🔴 THE STAGE CARD IS DERIVED, NOT COMPOSED

   **Every value the create door wants is already in the folder.** This card used to list the FIELDS
   without saying where they come from, so every ignition re-invented the mapping in prose — and a
   mapping re-invented each time comes out as a wall of values to retype, which is exactly what the
   launcher's form then asks for a second time. Read the folder; do not compose from memory.

   | Payload field | Derived from | ⚠ |
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

   🔴 **A FIXIT ROW IS NEVER IN THE CREATE PAYLOAD.** `spec-pipeline` authors at most one and only as a
   possibility — *"MAY materialise… not authored up front; the coordinator charters it from the review's
   named list."* Staging a seat for it invents a seat the run may never want, and the coordinator cannot
   un-charter it.

   🔴 **DERIVING THE CARD *IS* THE THREE-DOCUMENT CHECK, AND THAT IS WHY THIS SEAT DERIVES IT.**
   `spec-pipeline` requires the sequence to appear in THREE places and agree: the brief's
   `## The sequence`, the umbrella's row table, and the tracker's `## Session status`. Build the seat
   list from the brief, then read the other two and confirm they list the same rows in the same order.
   **A disagreement is a finding, reported to the authoring seat — never something you reconcile
   silently by picking one.** An effort whose three documents disagree has a seat acting on a shape the
   others have stopped describing, and the create you are about to stage would make one of them true by
   force.

   > ⚠ **CORRECTED (R-20 / LC-06-5) — this card used to promise controls that do not exist.** It named an
   > **artifact prefix** (`rg artifactPrefix src/` returns **0 matches anywhere in the repo**) and an
   > **unattended budget cap** (on the request DTO as `decimal? BudgetUsd`, but the launcher exposes **no
   > control** and sends a hard `null`). It said **"kind"** where the field is `shape`, and it **never
   > mentioned seats or edges** — while the create endpoint makes them the substance. A seat following the
   > old card would hand over values the form cannot take and omit the ones it needs.
   > 🔴 **If you want a budget cap, say so as a HUMAN STEP** — it cannot be staged from this card today.
5. Report **PREP READY** — stage card + the kick text + gate states + **what you re-verified and what
   drifted** + any precondition surprises, each named — and **STOP**.

### Phase 1 — STAGE (only on the human's "stage it")

6. Hand over the stage card. **Create happens in the launcher** — the human's click, or yours on their
   word. You verify it by receipt, never by the form having been submitted: read the created pipeline back
   and check **shape** / topic / path / defaults / **seats + edges** against the card (`shape`, not
   `kind` — `kind` is the SEAT-level field, a different axis, and asking for the wrong one is how a
   verification step reads as done while checking nothing). State plainly which values IF ANY are still wrong,
   and verify again after they are fixed. ⚠ **A create that answers 2xx is not a create that is right** —
   read the row.
7. Announce: **"Staged and verified — nothing running, zero spend. Open the cockpit."** STOP.

### Phase 2 — KICK (only on the human's "kick it", cockpit open, human watching)

8. **Kick from the launcher**, with the brief's `## The kick` text as the coordinator's task. Verify the
   kick by its receipt — the actor stamped on the act is the human's, and that stamp is the whole point of
   the browser path. **The successful call is the birth timestamp**: a refused attempt spawns nothing, so
   if a retry is needed, re-announce and say the failed attempts had zero side effects.
9. Verify ignition receipts — the coordinator's opening ledger write, its first `seat_spawn`, any scripted
   probe's refusal — and **narrate each beat as it lands**, plain language. Spawn runs a birth-time tool
   inventory: novel tools are classified at birth, unclassifiable ones auto-disallowed with one loud
   row. A loud row at ignite is information, not a failure.
10. **HANDS OFF.** Heartbeats only (one line per phase change; long output to files, never into context).
    The human owns the parks, the reaps, and the kill-switch from the first second. If the run wedges:
    report state + STOP — the kill-switch is theirs.

**Operator doctrine (when the human rules a running pipeline through you):** rulings must direct SEAT
action, never promise operator actions ("the grant is coming" recreates a wait on the unobservable) · a
grant only lands on a LIVE park (requests expire — have the seat re-request first) · **NEVER raw PTY
injects** — the human keyboard and the hardened ladders are the only submit paths.

> ⚙ **v1 PLANE (still running) — chain mode.** There the ruling lane is
> `POST /api/agent-network/runs/{parentRunId}/ruling` (durable row + `## OPERATOR RULING` blackboard
> append + laddered doorbell; honest `{recorded, delivered}` response), and a park request expires ~10 min
> from last hook contact.

## The kick text — it is a POINTER, and `spec-pipeline` already wrote it

The coordinator's task is the brief's own **`## The kick`** section, copied verbatim. Roughly:

> You are the COORDINATOR of the {topic} pipeline. Invoke the `spec-parent` skill, then read
> `docs/research/{topic}/00-ignition-brief.md` and follow it. Your branch is `nas/chain-{coordinatorId}`.

**Do not draft a constitution here.** The seat's PROCEDURE is the `spec-parent` skill; its POLICY rides the
un-skippable policy suffix the platform supplies on `session_new` (`SeatSeedComposer.PolicySuffix` — you do
not paste it, and you cannot override it); its HANDS are the coordinator charter the composer attaches to a
`coordinator` seed and to no other kind. This RUN's choreography is the committed brief. A task string
cannot be diffed or reviewed the way a committed file can, so anything longer than a pointer is law in the
worst available place — and accumulated prompt-law breaks the coordinator it was meant to steer.

**Your job is to READ it and confirm the brief behind it holds up** — the coordinator reviews the text
before kick. Before you hand it over, check the brief actually covers: the sequence and roles · the
coordinator's beliefs with provenance · effort-specific law and per-spec riders · verified baselines ·
platform state · close-out (artifact filing, live-checks aggregation, what the PR must say). **A gap you
find is a finding to report, not a section for you to write** — send it back to the authoring seat.

## The v2 doors — what the launcher drives, and what to call when it cannot

**Everything here was measured 2026-08-17 against the running plane.** Use the launcher when it can do
the step; these are the same doors underneath it, and they are what you verify receipts against.

🔴 **THE CREDENTIAL IS THE HUMAN'S OWN ENTRA BEARER.** There is no worker key on this plane and there
will not be one. `Authorization: Bearer <token>`, audience-scoped to the API. A seat's job ticket
CANNOT create or start a pipeline — `Pipeline` is the one `IScopedEntity` and the owner stamp refuses
when there is no user claim.

**WHERE ONE COMES FROM, because naming the credential without naming its source is why this section
read as a wall you could not climb:** `periscope login` runs an interactive device-code flow and
writes the result to **`~/.periscope/token-cache.json`** — or `$PERISCOPE_CONFIG_DIR/token-cache.json`
when that is set (`tokenCachePath()` in `@naswerks/periscope`'s `src/host/paths.ts` is the one source for
the location, and the daemon reads the same file). So the token is **a file on this machine**, and a
session with shell access can use it.

⚠ **IT IS A CACHE, NOT A BARE TOKEN.** The shape belongs to the identity library, not to us — read it
as a cache and take what is actually there; do not hard-code a field name into a skill, and never
paste a token into a doc, a commit, or a task string.

⚠ **AND IT EXPIRES SILENTLY — see the field notes.** The 24-hour death that empties the hosts read is
the same credential. If the hosts read is empty, assume the token before you assume the host.

🔴 **THIS IS WHY "the skill pops it into existence" IS ALREADY POSSIBLE.** Create + start are two
authenticated calls, the credential is a file, and both doors are documented below. **The launcher is
the mouse path, not the only path** — the choreography and the two verbal gates are unchanged either
way, and WHO CLICKS was already a preference rather than a contract (see The choreography). What is
NOT optional: the human's words before each stage, and a receipt read back after.

### Phase 0 — the hosts read, and it ends the guessing

```
GET {ApiBase}/api/periscope/hosts
→ { "hosts": [ { "hostId": "…", "scopedToYou": true, "connectedAt": "…" } ] }
```

🔴 **AN EMPTY LIST MEANS NOTHING CAN BE KICKED.** The agent host is a SEPARATE PROCESS that dials OUT —
it is not part of the API. If the list is empty, stop and read the field notes below before staging
anything; the cause is almost always the token, and the host will look like it started.

### Phase 1 — create

```
POST {ApiBase}/api/pipelines
{ "shape": "supervisor", "topic": "…", "title": "…", "specPath": "docs/research/{topic}/",
  "defaultModel": "<allowlist-exact>", "defaultEffort": "…",
  "seats": [ { "kind": "coordinator"|"build", "stageOrdinal": 0, "ordinal": 0,
               "title": "…", "specPath": "docs/research/{topic}/NN-….md" } ],
  "edges": [ { "fromSeatIndex": 0, "toSeatIndex": 1, "relation": "supervises" } ] }
→ { "pipelineId", "seatIds": [ … ], "edgeCount" }
```

⚠ **NEVER SEND `""` FOR AN OPTIONAL — send `null` or omit it.** An empty string defeats `??` defaulting
server-side and travels to the wire as a value. This shipped as a real defect twice.

### Phase 2 — start

```
POST {ApiBase}/api/pipelines/{id}/start
{ "hostId": "<from the hosts read — never guessed>",
  "task":   "<the brief's `## The kick` text, VERBATIM>",
  "cwd":    null,          <-- null = "the host's provider decides". Omitting is fine; "" is NOT.
  "dispatch": "link" }     <-- "none" writes bookkeeping only; that is what an integration test wants
→ { coordinatorSeatId, sessionId, sessionKey, spawnedActId, ticket, ticketScopes,
    ticketRefusal, pipelineState, poll, + the kick DISPOSITION }
```

🔴 **THE STATUS LINE IS TRUSTWORTHY SINCE D1 ROW 05 — and it changed under you if you remember 200:**
- **200** — done. Covers `dispatched`, the two pinned-intentional cases: `not-asked`
  (`dispatch:"none"`, bookkeeping by request) and `already-live` (idempotent adoption) — **and a
  ticketless coordinator** (`ticketRefusal` names why; the seat is real and has NO TOOLS — a
  degradation the body names, not a pending effect; ruled at D1 row 07, R-8: a ticket is minted at
  open only, so a 202 there promised an effect that can never arrive).
- **202** — accepted, effect NOT yet observable: `deferred-to-replay` only (the reconnect replay
  delivers). The body's `poll` member names the read to watch.
- **409** — the kick REFUSED, **and the error body is the FULL receipt** (sessionId, spawnedActId,
  ticket state, `dispatchRefusal` by name; `pipelineState` stays `planned`). The committed rows are
  facts — parse the 409 body, never discard it. Also `pipeline-not-startable` (a terminal pipeline)
  and, on a second /start against a live coordinator, 400 `seat-already-has-live-session` — the
  respawn recipe below is the sanctioned path, not /start-again.
- **400** — a pre-flight refusal by name, zero rows written.

**The disposition still rides the body and is still the authoritative DETAIL** — the status stopped
contradicting it, that is all. ⚠ The pre-row-05 contract answered `200` for a REFUSED kick with the
truth only in the body; if a door answers that shape you are on an old build, and that is a finding.

**The refusal vocabulary, exact literals:** `kick-names-no-host` (you omitted `hostId`) ·
`kick-names-no-task` (you omitted the task — refuses BEFORE writing any row) · `no-live-link-for-host`
(the host you named is not connected) · `pipeline-has-no-coordinator` / `pipeline-has-many-coordinators` ·
`unknown-seat-kind` / `unknown-seat-relation` (the CREATE door validates both since row 05, listing the
closed set) · `path-input-missing` (a no-provider host got a null `cwd`) ·
`session-already-closed:{state}` · `session-has-no-host` (the STOP door only, where it is true).

### The release door — and the trap it replaced

```
POST {ApiBase}/api/pipelines/{id}/sessions/{sid}/release      ends the session, seat stays usable
```

Ends a session **without spending the seat**: `running → planned`, respawnable, pinned by
`A_RELEASED_seat_can_be_RESPAWNED`.

⛔ **NEVER USE `/close` TO RETRY A START.** Close ABANDONS the seat, `abandoned` is TERMINAL, and the
pipeline is burned — a `/start` afterwards answers `seat-terminal`. That cost a pipeline on 2026-08-17.

### Field notes — each one measured, most of them the hard way

- 🔴 **THE PERISCOPE TOKEN DIES AFTER 24 HOURS OF INACTIVITY, AND THE HOST EXITS CLEAN.** It 401s and
  finishes with a success-shaped exit — `Finished` on the Aspire dashboard. **If the hosts read is empty
  but the resource "ran", this is why.** Remedy: `periscope login` (an interactive browser flow — the
  ruled Model B shape, there is no non-interactive grant), then restart the periscope resource.
  ⚠ A gap of one day between sittings is enough. Nothing warns you.
- 🔴 **THE HOST IS NOT PART OF THE API.** It is a Node process Aspire starts (`AddNpmApp("periscope", …)`),
  it dials OUT over a WebSocket, and it needs `npm ci` + a fresh `dist/`. A stale `dist/` serves old code
  silently.
- **`ticketRefusal: null` is the receipt that the coordinator got TOOLS.** Non-null means a toolless seat
  that will look alive and do nothing.
- **`cwd: null` is meaningful, `""` is fatal.** A required member arriving null is refused at the host's
  DECODER — and under the no-ack law that refusal goes to **host stdout and nowhere else**, so the
  controller sees nothing. The encoder now validates outbound frames, which is why this is now a named
  refusal instead of a silent wedge.
- **PS 5.1 cannot serialize the body** — same rule as v1: write the complete JSON to a UTF-8 file and POST
  it with `--data-binary "@file"`. Never inline a multi-line `task` through a shell.
- **Every restart rotates Aspire resource and docker container names.** Re-discover before any substrate
  check; a stale name fails as "No such container", which reads as a broken stack.

> 🔴 **IF THIS SECTION AND THE CODE DISAGREE, THE CODE WINS AND THE DISAGREEMENT IS A FINDING.** These
> doors were built and corrected inside a week. Report what you found rather than working around it.

## The v1 fallback, and the field notes it earned

> ⚙ **v1 PLANE (still running) — chain mode.** Everything in THIS section is the old plane's plumbing,
> kept because that plane still runs every real chain until the launcher's cutover merges. **On the hosted
> plane you use the launcher and none of this applies.** Its value now is diagnostic: when a v1 ignition
> misbehaves, these are the failures it will be.

**The fallback parent-spawn call (KICK only, on the human's word):**

```
POST {BffBase}/api/agent-network/runs        <-- the REST prefix is /api (SPA baseUrl = apiUrl + '/api')
Headers: X-Worker-Key, X-Worker-User-Id, Content-Type: application/json; charset=utf-8
Body: { "harnessId": "coding", "executorKind": "external-cli", "agentCount": 1,
        "totalTurns": 1, "stepMode": false, "cliSessionMode": "persistent",
        "coordinatorId": <staged id>, "role": "parent", "name": "<topic>-parent",
        "isCoordinatorParent": true, "model": "<allowlist-exact>", "effort": "max",
        "transport": "pty" | "stream-json",          <-- omit for pty; an all-headless run
                                                         sets chainDefaultTransport at CREATE
        "task": "<the brief's `## The kick` text, verbatim>" }
```

The coordinator's policy suffix is supplied by the platform at creation — you do not paste it.

**Field notes (each cost a live retry):**

- **Forgetting `/api` reads as 404 on every endpoint** — it is the prefix, not auth, not the port. Probe a
  known-good GET first.
- **`X-Worker-User-Id` must be a real GUID — a non-GUID is a 401, refused at the door** (since `94530f8`,
  the identity gate: shape is REFUSED, not coerced — pinned by
  `AgentNetworkIdentityGateTests.A_NON_GUID_worker_user_id_is_REFUSED_rather_than_becoming_a_null_user`).
  The answer is ON THE RESPONSE LINE now; there is no invisible run to hunt. If a kicked coordinator never
  appears in the UI, the header CAN no longer be this failure silently — read the status code first.
  Two sibling rules from the same gate an igniter WILL hit: (a) presenting **both** `X-Worker-User-Id`
  and `X-Nas-Session` is a 401 (mutually exclusive by design — pick the one lane your call is); (b)
  `X-Worker-User-Id` is refused outright on `/api/credentials`, `/api/agent-network/repo-connections`,
  `/api/agent-network/mcp/code-graph` and `/api/agent-network/mcp/knowledge-graph` — do not aim
  worker-identity calls at those.
- **PS 5.1 cannot serialize the body**: `ConvertTo-Json` wraps long strings into `{value: …}` objects (the
  server rejects `task` as StartObject) and `JavaScriptSerializer` throws circular-reference on hashtables.
  The reliable path: write the complete JSON body to a UTF-8 FILE with hand-escaped `task` (`\n`, `\"`),
  POST it as raw bytes (`[IO.File]::ReadAllBytes` → `-Body $bytes`). Never inline a multi-line task into a
  shell-serialized body.
- **Every restart rotates names** — Aspire resource suffixes AND docker container names (postgres included).
  Re-discover (`aspire describe`, `docker ps`) before any substrate check; a stale container name fails as
  "No such container", not as a hint.
- **Model allowlist is a Phase-0 check**: the create form and the endpoint both refuse models missing from
  `AgentNetworkCli:AllowedModels` (code defaults in `CliExecutorOptions`). A new model = code-default edit +
  rebuild + restart BEFORE stage — verify via `GET /api/agent-network/spawn-options`, the running system's
  truth. (`ModelCatalog` pricing is separate — check it too or cost lines read incomplete.)
- **The kick timestamp is the SUCCESSFUL POST** — a 400'd attempt spawns nothing; if a retry is needed,
  re-announce so the witness's baseline is the real birth, and say the failed attempts had zero side effects.
- Rebuilding while the AppHost runs hits the exe lock (MSB3027-class errors) — `aspire start`
  stops-then-rebuilds cleanly; don't panic-debug the 2 errors first.

## Hard fences

- Nothing is created, spawned, or spent before the human's words — per stage, every time.
- Every UI shortfall is a NAMED FINDING, never a silent script step.
- You never approve parks, never reap seats, never touch the kill-switch — those are the human's; you
  verify and narrate.
- The touch budget is stated HONESTLY at prep (parks + reaps per session count), including known
  anomalies that may change it — surprises are findings, not adjustments.

## Related
- `spec-pipeline` (authors what you ignite, including the brief you complete) · `spec-parent` (the
  coordinator's procedure, and the HAND-CRANKED alternative) · `spec-seat` + `spec-child` (what
  `SeatSeedComposer` seeds into every build seat) · `spec-retro` (the close-out audit) · `spec-witness`
  (point one at the run you just ignited)
- `docs/research/agent-docs-processor.md` § the Igniter — the platform feature this skill precedes.
- `docs/research/chain-comms-drill/` — a reusable acceptance harness: re-ignite it after machinery changes;
  it passes clean or names the regressed lane.

*History: the rules here were earned by live incidents; the receipts live in `docs/archive/`.*
