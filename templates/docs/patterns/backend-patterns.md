# Backend Patterns

> Rules and conventions for the server side of this repository. Last verified {today}.
<!-- meta: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — the server-side project files (*.csproj, *.sln*, go.mod, pyproject.toml, Cargo.toml,
     a Node service's package.json) and their frameworks.
     fill — two to four sentences: what the server side is (an API, a worker, a CLI), the framework, and
     the claim "every server-side feature follows these conventions; read this before writing any
     server-side code."
     absent — "No server-side stack detected — fill this in: what runs server-side here, if anything." -->

## Stack

<!-- init: scan — runtime + version, web framework, persistence library, database, messaging, DI,
     validation, serialization — each from a manifest with its version.
     fill — one bullet per item: name, version, role.
     absent — "No server-side dependencies detected — fill this in: the runtime, the framework, the data
     access library, the database." -->

## Feature folder structure

<!-- init: scan — the folder layout two deep under the server-side root; one existing feature folder.
     fill — an ASCII tree of ONE real feature as it exists, with a comment per folder saying what goes
     there, then one sentence on when a feature grows a second sub-folder (a service, a second entity).
     absent — "No feature layout detected — fill this in: where an endpoint, a model, a query and a
     service go, as a tree." -->

```
{root}/
  {Feature}/
    ...
```

## Data layer

<!-- init: scan — the persistence library, an existing entity/model file, a base class or interface
     every entity shares, the migration or schema tool, one repository/data-access file.
     fill — the rule for an entity (base class, ids, timestamps, ownership fields), one REAL entity as the
     example, "the one way to query" (ORM vs raw SQL and when each), then `### Rules` as bold-lead
     bullets and any `### Gotcha:` the repo has written down (cite the file).
     absent — "No persistence layer detected — fill this in: how data is modelled, stored and queried." -->

### Rules

<!-- init: fill — bold-lead imperative bullets, each testable, each citing its source when the repo wrote
     it down (a CONTRIBUTING section, an analyzer rule, a base class docstring).
     absent — "- No data-layer rules found written down — fill this in: the entity contract, the naming,
     the one way to query." -->

## API layer

<!-- init: scan — the web framework, one existing endpoint/handler/controller, the routing convention (a
     global prefix, plural resources), how business logic is shared between transports if there are two.
     fill — one REAL endpoint as the example, the route convention as a table (pattern, example, resulting
     URL), then `### Rules`.
     absent — "No HTTP layer detected — fill this in: how a request enters and what a handler owns." -->

### Rules

<!-- init: absent — "- No API-layer rules found written down — fill this in: request/response shape,
     where validation lives, what a handler may and may not do." -->

## Write paths — sync, or long-running

<!-- init: scan — a queue, a worker, a job runner, a saga/orchestration in the dependencies or folders.
     fill — the decision table `Work | The one way to build it | Pokes the client?` with the sentence
     "there is no runtime flag — the kind of work picks the path", and the rule for when a command/queue
     is warranted (duration, fan-out, burstiness, durability, decoupling — two or more).
     absent — "No asynchronous write path detected — every write is a synchronous request/response;
     fill this in when a queue or worker appears." -->

## Registration & DI

<!-- init: scan — the composition root (Program.cs, main.go, app.py, index.ts), how features register
     themselves, the DI conventions in use.
     fill — where a new feature registers what, as a short table (Class type | How it is registered),
     and the one rule that bites (an unregistered X silently does not exist).
     absent — "No composition root detected — fill this in: where a new feature registers itself." -->

## Key Files

| File | Purpose |
|------|---------|
<!-- init: scan — every file the sections above named: the base entity, the db context, the composition
     root, the example feature's files.
     fill — one row per file, verbatim path.
     absent — "| (none detected) | fill this in: the base entity, the data context, the composition root |" -->

## Lineage
- **Related** — [vertical-slice-anatomy](vertical-slice-anatomy.md) · [testing](testing.md) · [codegen](codegen.md)
