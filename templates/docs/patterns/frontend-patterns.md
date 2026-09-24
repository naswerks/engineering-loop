# Frontend Patterns

> Rules and conventions for the client side of this repository. Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at its draft status. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — a frontend framework config (angular.json, next.config.*, vite.config.*, nuxt.config.*,
     svelte.config.*, a React/Vue dependency), the app roots.
     fill — two to four sentences: what the client side is, the framework, and the claim "every client
     feature follows these conventions; read this before writing any client code."
     absent — "No frontend detected — fill this in when a client-side stack appears. This file exists so
     the reading floor resolves; a seat with a frontend role has nothing to read here yet." -->

## Stack

<!-- init: scan — framework + version, state library, data-fetching client, realtime client, styling
     library, auth library — from the manifest with versions.
     fill — one bullet per item: name, version, role.
     absent — "No frontend dependencies detected — fill this in." -->

## Architecture rules

<!-- init: scan — tsconfig strictness, lint config rules, a framework's recommended conventions the repo
     has pinned (standalone components, a change-detection strategy, hooks rules).
     fill — the table `Rule | Pattern | Legacy (never use)` — the modern form the repo uses beside the
     form it forbids, each row from a real config or an existing component.
     absent — "No architecture rules found written down — fill this in: the component/module model, the
     change-detection or rendering model, the DI or hook conventions, each with its forbidden legacy." -->

| Rule | Pattern | Legacy (never use) |
|------|---------|-------------------|

## Component architecture

<!-- init: scan — one feature folder in the client app; the kinds of component it holds.
     fill — the kinds table (`Type | Store access | Location | Role`) and an ASCII tree of one REAL feature.
     absent — "No component folders detected — fill this in: the component kinds and where each lives." -->

## Component files

<!-- init: scan — how existing components lay out their template, styles and spec (inline vs separate
     files; the file naming).
     fill — the rule as this repo practises it (e.g. "template and styles are separate files beside the
     component, named {component}.component.{html,css}; a spec sits beside them"), citing two existing
     components. This is the rule a coordinator enforces at every seat's commit.
     absent — "No component-file convention detected — fill this in: whether templates and styles are
     inline or separate files, and how they are named." -->

## State

<!-- init: scan — the state library, one store folder.
     fill — the store convention in one paragraph and a pointer to `patterns/state-management.md` when
     that doc exists (Snapshot — the authority is state-management.md).
     absent — "No state library detected — fill this in: how client state is held and shared." -->

## Styling

<!-- init: scan — the styling library, a tokens/theme file, a global stylesheet.
     fill — the approach in three bullets (utility-first / component CSS / tokens), the one rule for
     component-scoped CSS, and a pointer to `patterns/ui-style-guide.md` when it exists.
     absent — "No styling library detected — fill this in: how components are styled and themed." -->

## Realtime

<!-- init: scan — a realtime client (signalr, socket.io, ws, sse, pusher, ably).
     fill — one paragraph: how server events reach the client and the poke/refetch rule; a pointer to
     `infrastructure/realtime-events.md` when it exists.
     absent — "No realtime client detected — the client reads on navigation and on user action only;
     fill this in when a realtime channel appears." -->

## Codegen pointer

<!-- init: scan — a generated/ folder inside the client app, a codegen config.
     fill — "Never hand-write or edit files in `{generated folder}` — they are produced by {tool} and
     overwritten on the next run. Everything else is the authority of `patterns/codegen.md`."
     absent — "No generated client code detected — fill this in when a codegen pipeline appears." -->

## Key Files

| File | Purpose |
|------|---------|
<!-- init: scan — the app config/composition root, the router, the shared components folder, the global
     stylesheet, the constants file.
     fill — one row per file, verbatim path.
     absent — "| (none detected) | fill this in: the app config, the routes, the shared components |" -->

## Lineage
- **Related** — [code-organization](code-organization.md) · [testing](testing.md) · [codegen](codegen.md) · [backend-patterns](backend-patterns.md)
