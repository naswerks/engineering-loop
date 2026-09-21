# Background Work

> What runs outside a request in this repository — workers, queues, schedulers — and how long-running,
> multi-stage work is orchestrated. Last verified {today}.
<!-- meta: type=infrastructure; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — queue / worker / scheduler libraries (a service bus, RabbitMQ, SQS, BullMQ, Hangfire,
     Quartz, Celery, sidekiq, a cron), a worker project or folder, the message contracts.
     fill — two to four sentences: what runs in the background, on what transport, triggered by what.
     absent — this doc is only drafted when a queue, worker or scheduler is found. -->

## Sync vs async — the decision

| Work | The one way to build it | Notifies the client? |
|------|-------------------------|----------------------|
<!-- init: fill — one row per kind of work the repo has (CRUD: sync; ingest/index/fan-out: a command to
     the queue), with the sentence "there is no runtime flag — the kind of work picks the path" and the
     rule for reaching for a queue (two or more of: duration, fan-out, burstiness, durability, decoupling).
     absent — "| (no async kinds detected) | every write is synchronous today | no |" -->

## Workers, queues, schedulers

<!-- init: fill — the worker's entry point, how a handler is registered, the message naming (commands
     imperative, events past-tense; subject conventions), retries and idempotency, how a worker calls back
     into the API and with what identity.
     absent — "No worker detected — fill this in." -->

## Long-running workflows

Snapshot — multi-stage work (stages, per-item progress, exactly-once transitions) is the authority of
[long-running-workflows](../patterns/long-running-workflows.md) when the repo has one; this page is the
transport it runs on.

<!-- init: fill — one sentence naming the workflow mechanism (from long-running-workflows.md when drafted).
     absent — "No multi-stage workflow detected — every background job here is single-stage; fill this in
     when one appears." -->

## Gotchas

<!-- init: scan — comments in the worker/handler code, CONTRIBUTING notes.
     fill — one `### Gotcha:` per written-down warning, with symptom, cause, remedy, source file.
     absent — "No background-work gotchas written down yet — fill this in the first time one bites." -->

## Key Files

| File | Purpose |
|------|---------|

## Lineage
- **Related** — [backend-patterns](../patterns/backend-patterns.md) · [realtime-events](realtime-events.md) · [long-running-workflows](../patterns/long-running-workflows.md)
