# Realtime Events

> How server-side events reach the client in this repository, and the poke/refetch pattern that keeps
> the two consistent. Last verified {today}.
<!-- meta: type=infrastructure; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — the realtime library on each side (signalr, socket.io, ws, sse, pusher, ably, phoenix
     channels), the hub / channel / gateway classes, the client connection service.
     fill — two to four sentences: the transport, who connects, what travels (events, not data).
     absent — this doc is only drafted when a realtime library is found. -->

## The poke/refetch pattern

The server sends a small **poke** (an event naming what changed, and a correlation id when the change
answers a request); the client **refetches** the affected read through its normal data path. Events carry
identity, not payload — the read stays the one source of shape, and a missed event costs one refetch,
never a divergent copy.

<!-- init: scan — an existing event/notification type and its client handler.
     fill — one REAL event as the example (server emit, client handler), and the correlation-id rule if the
     repo uses one (a long-running command returns an id; the completion event carries it; the client
     clears its pending state on match).
     absent — "No event/handler pair found — fill this in with the first one." -->

## Backend

<!-- init: fill — the hub/channel classes, how a feature emits, the user/connection identity rule (which
     claim keys a connection — a wrong claim finds no connections silently), the auth on the connection.
     absent — "No server-side emitter detected — fill this in." -->

## Frontend

<!-- init: fill — the connection service, how a feature registers handlers, the guard every handler
     carries (skip events for a different entity than the one loaded), reconnect and its catch-up.
     absent — "No client-side handler registry detected — fill this in." -->

## Gotchas

<!-- init: scan — comments in the hub/handler code, CONTRIBUTING notes.
     fill — one `### Gotcha:` per written-down warning, with symptom, cause, remedy, source file.
     absent — "No realtime gotchas written down yet — fill this in the first time one bites." -->

## Key Files

| File | Purpose |
|------|---------|

## Lineage
- **Related** — [backend-patterns](../patterns/backend-patterns.md) · [frontend-patterns](../patterns/frontend-patterns.md) · [background-work](background-work.md)
