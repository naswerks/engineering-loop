# Long-Running Workflows

> How multi-stage work is orchestrated in this repository: the stages, per-item progress, exactly-once
> transitions, and how progress reaches the client. The transport it runs on is
> [background-work](../infrastructure/background-work.md). Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at its draft status. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — a saga / orchestration / workflow / state-machine base class or library (a saga
     framework, a durable-functions style runtime, a job with named stages), the entities that record
     stage state.
     fill — two to four sentences: what a workflow is here, what guarantees it makes, and which features
     use it.
     absent — this doc is only drafted when a multi-stage workflow mechanism is found. -->

## The shape

<!-- init: fill — an ASCII diagram of one REAL workflow (trigger, stages, the transition that starts the
     next stage, completion), then the base classes / tables that hold it.
     absent — "No workflow found to diagram — fill this in with the first one." -->

```
{trigger} -> stage 1 -> stage 2 -> ... -> complete
```

## Exactly-once transitions

<!-- init: scan — the code that decides a stage is done (a TryComplete, a row lock, a compare-and-set, an
     idempotency key).
     fill — what guarantees a stage transition happens once, with the real symbol named; what happens on a
     retry; who owns the transition.
     absent — "No transition guard found — fill this in: how a stage completes exactly once under
     concurrency." -->

## Per-item progress and failure

<!-- init: fill — how an item starts, completes and fails inside a stage; what a stuck item looks like and
     who reaps it; how progress is reported (an event, a poke, a row).
     absent — "No per-item tracking found — fill this in." -->

## Creating a new workflow — checklist

<!-- init: fill — an ordered `- [ ]` list: the base class to extend, the stage events or handlers to add,
     the registration, the tests the testing doc names (the concurrency test especially).
     absent — "- [ ] No workflow mechanism detected — fill this in when one appears." -->

## Rules

<!-- init: scan — comments on the base class, CONTRIBUTING notes.
     fill — bold-lead imperative bullets citing their source.
     absent — "- No workflow rules found written down — fill this in." -->

## Key Files

| File | Purpose |
|------|---------|

## Lineage
- **Related** — [background-work](../infrastructure/background-work.md) · [backend-patterns](backend-patterns.md) · [testing](testing.md)
