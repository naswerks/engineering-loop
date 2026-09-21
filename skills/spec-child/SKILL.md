---
name: spec-child
description: The BUILD JOB for a pipeline seat — one spec, the role's reading list, the pin taxonomy, the suite protocol, and the fixit variant. Composed AFTER spec-seat, which carries the seat contract (blackboard, question lane, verdicts, FINAL TLDR, close-out). Use when a prompt says you are a build or fixit session, or run spec-child {role} {spec-path}. Roles: backend | frontend | mixed.
---

# spec-child

**Your seat contract is `spec-seat` — invoke it first if you have not.** It carries the blackboard, the
question lane, the parked-call discriminator, the verdict vocabulary, the BELIEFS sha, git shapes, the
six-section FINAL TLDR, and the close-out order. **This file is the BUILD JOB only**, and it refines that
contract — where the two genuinely conflict, that is a finding to report, not a fork to resolve quietly.

You build exactly one spec. The coordinator judges and rules; you recon, plan, build, and report honestly.
Hand-cranked, a human relays messages; hosted inside a pipeline, your coordinator drives you itself and
the relay is machine-carried — **your contract is identical either way.**

Invoked as `spec-child {role} {spec-path}`, or told "you are a build session" with the spec path.

## Step 1 — with your role and spec in hand

**If your prompt handed you a MANIFEST, that manifest is your reading list and this section does not
apply** (`spec-seat`, Step 0). This list is for a build seat working from a spec.

1. **Your spec** — fully, INCLUDING any Addendum sections. It is self-contained.
2. **The umbrella** (`01-{topic}.md`) — settled decisions; don't relitigate them.
3. **The tracker** — `docs/research/{topic}/project-status.md`. The coordinator's live journal and
   READ-ONLY to you. Prior session rows, deferred findings, and process incidents are your contract: build
   against what ACTUALLY shipped, not the spec's guesses. **If anything in it disagrees with your spec or
   doesn't make sense, say so in your PLAN TLDR** — asking is always allowed.
4. **Your role's adds** (below) + any extra docs the prompt names.
5. **Grep the living docs' `## Open Issues` for your subject.** One command, and it is the step efforts
   keep skipping: a defect can sit dated and described in a living doc while several seats check the code
   and conclude it is new.

## Role — the adds, on top of spec-seat's Step 0 floor

The loop's standard docs, by path. **Read every one that exists for your role.** One that is absent was
not detected by `init` — `docs/_meta/doc-index.md` § Role reading lists carries a row saying so — and is
not a missing-file finding. `patterns/codegen.md` is read by any seat that touches a generated folder.

| Role | Adds |
|---|---|
| **frontend** | `patterns/state-management.md` · `patterns/ui-style-guide.md` · `patterns/design-tokens.md` · `infrastructure/realtime-events.md` (the poke/refetch concept trips sessions up — read it even for "pure UI" work) · `patterns/codegen.md` when the client consumes generated types |
| **backend** | `infrastructure/realtime-events.md` (the poke/refetch concept trips sessions up — read it even for "pure API" work) · `infrastructure/background-work.md` · `patterns/long-running-workflows.md` as the task warrants · `patterns/codegen.md` when the server side emits generated code |
| **mixed** | **NOT every set by default** — read the adds for the surfaces your spec ACTUALLY touches, decided at recon once you have read the spec. **This is the default role and it covers every surface with no role of its own** — a CLI, a sidecar, a worker project; docs work needs nothing beyond the Step 0 floor |

**This repository's own docs reach you as paths too, not as an index to consult:** the coordinator copies
your role's rows from `docs/_meta/doc-index.md` § Role reading lists into your prompt's `EXTRA DOCS` line.
Read those the same way. If your prompt carries no `EXTRA DOCS` line, read that section yourself once and
say in your PLAN TLDR which rows you took.

A role is *which docs does this build session read* — nothing else. Jobs are SEAT KINDS, not roles:
`docs-process` is a session type of its own, and a spec that touches a surface with no role of its own is
`mixed` with that surface's rows.

## Recon — the build seat's first act

**Re-verify EVERY anchor your spec cites against HEAD** — specs age and prior sessions move line numbers,
so **report drift, don't trust**. **Recon's first act is to test whether the slice is already satisfied**:
specs do get overtaken between authoring and build, and discovering that at recon closes a session in
minutes while assuming the work is pending rebuilds what already exists.

Run `git status`; identify which dirty files are yours-to-be vs NOT yours (coordinator-owned docs appear
mid-run — never stage them). Answer any STANDING RECON QUESTION your spec or prompt carries.

**Measure your own baseline for any lane you touch, BEFORE you edit.** A same-day coordinator-verified
baseline is an acceptable substitute when cited, but measuring your own is the norm — and a number you
cannot reproduce is a finding.

## Build

State your HEAD sha again in your FIRST implementation message (the coordinator diffs your beliefs
against its ledger — stale-tree catches come from this).

**If HEAD moves mid-build**: disclose FIRST in your next report — old sha to new sha, clean-ancestor or
not, `git diff --stat` overlap with YOUR files, and proof of coexistence if any overlap (marker greps +
suite on the combined tree). **Absorb-and-prove, never silently rebase your beliefs.**

**Before you delete a pin, ask what it encodes.** A pin that describes the **MECHANISM** you are removing
dies with it ("this verb is seat evidence"). A pin that encodes a **DECISION** — a boundary verdict, an
accepted residual, a known-positive control — dies with nothing, and removing it vacates a ruling nobody
made. **When in doubt it is a DECISION: say so and ask.**

**If ANY existing test requires modification to pass, STOP and report.** A test needing an edit is the
signal that a VERDICT changed, not that the test is stale.

## The suite protocol

Run the suite lanes **SERIALLY** — the lanes and their exact invocations are `patterns/testing.md`
§ Running tests; concurrent runs flake.

**Capture FULL runner output to a UTF-8 file and search failures by name** — redirect to a file, then
search `^failed ` / `Failed!`. Piping through a "last N lines" filter destroys failure names.

### USE `rg`, NOT `grep`, FOR ANYTHING THAT MIGHT NOT BE ASCII — AND NEVER TRUST A LOCAL TEST

**Two instruments return `0` for text that is present.** Both are silent: they exit clean and read as
"not found", which is indistinguishable from a correct negative.

| instrument | the lie | measured |
|---|---|---|
| `grep` on a non-ASCII pattern | **locale-dependent** — the SAME binary on the SAME file | `LANG` unset: 64 · `LC_ALL=C`: 64 · `LANG=en_US.UTF-8`: 0 |
| PowerShell `Get-Content -Raw` | reads UTF-8 as the ANSI codepage | with `-Encoding utf8`: 83 · without: 0 |

**THE LOCALE ONE IS WHY "IT WORKS FOR ME" IS NOT EVIDENCE.** Whether your shell exports `LANG` is not
something you chose or can see, two seats on one machine can disagree, and an ASCII control passes in both
— so a test that "proves" grep is fine proves only that your environment is the lucky one. `rg` is
unaffected under every locale above.

**So:** `rg` for content search, always. `Get-Content` only with `-Encoding utf8`. And author regexes with
your file tools, never through a shell heredoc — a heredoc can collapse `\\s` to `\s` and break both a pin
and that pin's own control, so neither can announce the other.

**PowerShell 5.1 `Tee-Object` writes UTF-16** — `rg` detects the BOM and reads it; plain `grep` finds
nothing. Prefer a UTF-8 path anyway so the file is legible to everything.

**Read the build's exit code BEFORE trusting a green summary** — a stale binary passes every assertion
in it. And **require the summary block itself**: a run that printed no totals ran nothing, whatever its
exit code said. Disclose every red run WITH its rerun; never present a flake as clean.

**Any session that touched frontend code ALSO runs the production build** — a test transform does NOT
catch what the strict production compiler rejects: duplicate class members, cross-session member
collisions, private-in-template. A green test run can sit over a broken build. The build receipt goes in
FINAL TLDR section (b) alongside the suite.

**`cd` INTO THE APP YOU TOUCHED — a repo can hold several, and the wrong one builds green.** The apps
and their test and production-build commands are `docs/_meta/doc-index.md` § Apps and their build
commands. An instruction that named ONE app for years sent seats on other surfaces to run a production
build over a tree they had not touched, and they got a **passing receipt that proved nothing** — the
false-green genus, embedded in the manual instead of in a test. Name the app you edited and run its
commands from its root.

## Fix-it variant (`spec-child fixit`)

No spec — your contract is the prompt + the coordinator's ledger (READ-ONLY). **STEP 0 — INVESTIGATE,
REPORT, STOP:** (1) reproduce/characterize cheaply, (2) find the cheapest reliable RECEIPT for the fixed
state, (3) report the verdict as plain text — root cause, evidence, proposed fix shape + blast radius —
then STOP for the coordinator's go. After the go: the minimal fix + MAKE THE FAILURE LOUD (log + trace row
— never silent) + a regression pin + an E2E receipt re-running the original failing scenario
+ **SWEEP THE RECEIPTS YOUR FIX INVALIDATED** (`spec-seat`'s close-out step, and a fixit is the diff
most likely to need it — you are changing behaviour something already made a claim about). A fixit that
repairs a pane silently re-makes a `superseded` live-check TRUE, so its "do not run this" marker becomes
false. **Grep `live-checks.md`, the tracker and the working docs for every behaviour you changed**,
correct what is yours in the same commit, and hand back what is not.

**A fixit chartered from a review's findings inherits no escape hatch** — every numbered spec carries one
because `spec-pipeline` requires it, and you have no spec. If the charter you were handed did not state
what a truthful partial looks like per named item, **ask for it** before you start designing.

## Notes

- **The spec's anchors are hypotheses; HEAD is the truth.** The biggest catches — stale trees, false
  greens, dropped rulings — are all belief-vs-ledger mismatches. Your beliefs block exists so the
  coordinator can catch them cheaply.
- Counterpart skills: `spec-seat` (your contract) · `spec-parent` (the seat that arms you) ·
  `spec-pipeline` (how your spec came to exist). The hosted version of you runs THIS same pair — the
  control plane's seed names both skills, in this order.
