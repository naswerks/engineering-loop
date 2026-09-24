# State Management

> The store convention for the client side of this repository: the files per store, how a store is
> registered, how a component consumes it. Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at its draft status. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Structure

<!-- init: scan — the state library (from the manifest) and ONE existing store folder.
     fill — the library and version, then an ASCII tree of one REAL store with a comment per file, and the
     rule for sub-stores if the repo has them.
     absent — this doc is only drafted when a state library is found; if you are reading a draft with this
     line, the scan found the library but no store folder: "No store folder detected — fill this in: the
     files a store is made of." -->

```
{feature}/store/
  ...
```

## Actions / events

<!-- init: fill — how actions are declared and named (the naming convention read off the existing store,
     e.g. `[Feature] Verb Noun`), with a real example.
     absent — "No action convention detected — fill this in." -->

## Model

<!-- init: fill — where the state types come from (derived from generated types? hand-written?), with a
     real example.
     absent — "No model convention detected — fill this in." -->

## Data access

<!-- init: fill — the file that talks to the server on the store's behalf, and the rule that components
     never call it directly, with a real example.
     absent — "No data-access convention detected — fill this in." -->

## State class / reducer

<!-- init: fill — selectors, handlers, error handling, the realtime-event handlers if any, with a real
     example. -->

## Registration

<!-- init: scan — where stores are registered (app config, root module, a provider list).
     fill — the exact file and the one line to add.
     absent — "No registration point detected — fill this in." -->

## Component consumption

<!-- init: fill — how a component reads (a selector, a signal, a hook) and writes (dispatch), with a real
     example. -->

## Rules

<!-- init: scan — lint rules or CONTRIBUTING notes about state.
     fill — bold-lead imperative bullets, each citing its source when written down; the loop supplies one:
     "**Keep high-frequency streams OUT of the store** — a byte/token stream belongs in a plain service the
     component subscribes to; only low-frequency control events go through the store."
     absent — the one loop-supplied bullet, then "- No further store rules found written down — fill this
     in." -->

## Key Files

| File | Purpose |
|------|---------|

## Lineage
- **Related** — [frontend-patterns](frontend-patterns.md) · [code-organization](code-organization.md)
