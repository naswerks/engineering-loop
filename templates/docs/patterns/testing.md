# Testing Patterns

> How to write and run tests in this repository — every lane. Last verified {today}.
<!-- meta: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — the test frameworks in the dependency manifests and the CI jobs that run tests.
     fill — two to four sentences: which kinds of test carry the weight here (unit / integration / e2e),
     against what (real database, real HTTP, fakes), ending with the claim "every feature follows these
     conventions; read this before writing any test."
     absent — "No test framework detected — fill this in: what kinds of test this repository relies on,
     and against what boundaries." -->

## Stack

<!-- init: scan — every test-related dependency with its version (vitest, jest, mocha, xunit, nunit,
     pytest, go test, cargo test, playwright, cypress, testcontainers, wiremock, msw …).
     fill — one bullet per tool: name, version, what it is for.
     absent — "No test framework detected — fill this in: the runner, the assertion library, the fakes." -->

## Running tests

<!-- init: scan — package.json scripts, Makefile/justfile targets, *.sln/*.csproj test projects, CI
     workflow steps; the app roots (one lane per app or project).
     fill — ONE fenced block per lane: the exact command, the working directory it runs from, and a
     comment saying what a green run prints (the summary line). Commands verbatim from the scan, never
     paraphrased.
     absent — "No test command detected — fill this in: the exact invocation per lane, from the
     directory it runs in, and what a green run prints." -->

```
# lane: {name} — from {directory}
{the exact command}                      # green prints: {the summary line}
```

## The run protocol

Follow this before trusting any red OR green:

- **Suites run SERIALLY, never concurrently** — concurrent runners flake, and a failure seen only in a
  concurrent run is rerun standalone before it is investigated.
- **Capture the full runner output to a UTF-8 file and search failure names** — a "last N lines" filter
  destroys the names; a run whose output file is empty proved nothing.
- **Read the summary block, never the exit code alone** — a run that printed no totals ran nothing,
  whatever its exit code said; a green exit is a claim, not a receipt. Implausible speed is a failure
  signal.
- **Disclose every red run WITH its rerun** — never present a flake as clean.
- **A number without its invocation is not a receipt** — quote what ran, from where, and the scope.

<!-- init: scan — FLAKY-TESTS.md, a "known flaky" list in CONTRIBUTING.md, CI retry configuration.
     fill — a "Known flaky tests" list by name, with the reason and what to do (rerun once; stop on two).
     absent — leave the five bullets above as they are; add nothing. -->

## What to test where

<!-- init: scan — the folder layout (Features/, apps/*, packages/*), existing test folders and their
     naming, one existing test file per kind as the example.
     fill — one bullet per slice kind ("a sync endpoint: …", "a repository: …", "a store: …", "a pure
     service: …"), each naming an existing test file as its reference. Plus the test-naming convention
     read off the existing tests (plain-English behavioural sentences, or the repo's own).
     absent — "No test folders detected — fill this in: what each kind of code is tested with, and one
     reference test per kind." -->

## Controls — a pin must be able to fail

A test that cannot go red is a green light with a test's name on it. For every probe, pin or scanner:

- **Name its positive control** — the case that MUST go red — and state what would make it fail.
- **The pair must disagree.** One variable changes between the subject and its control; if the same
  input produces the same verdict on both sides, you have one observation wearing two names.
- **Prove it once:** break the thing on purpose, watch the control go red, fix it, watch it go green,
  and quote both runs. A control asserted is a control assumed.
- **Pin the PROPERTY, not the wording.** Assert the behaviour in the assertion's own message; source
  any literal you must name from the producer's own constant, and assert that constant is non-empty.

<!-- init: scan — an existing test that pairs a subject with its own control (a "CONTROL" or "inverted"
     case), if one exists.
     fill — name that test as the shape to copy.
     absent — leave the four bullets; add "No paired control found in the existing tests — fill this in:
     the first pin that carries its own control becomes the reference here." -->

## Coverage

<!-- init: scan — coverage configuration (a floor file, a threshold in the runner config, a CI gate).
     fill — the floor, the command that measures it, and the gate that enforces it.
     absent — "No coverage gate detected — fill this in: whether coverage is measured, the floor, and
     the gate." -->

## Key Files

| File | Purpose |
|------|---------|
<!-- init: scan — every file the sections above named (runner configs, shared fixtures, CI workflows,
     the flaky list).
     fill — one row per file, verbatim path.
     absent — "| (none detected) | fill this in: the runner config, the shared fixtures, the CI workflow |" -->

## Lineage
- **Related** — [backend-patterns](backend-patterns.md) · [frontend-patterns](frontend-patterns.md) · [vertical-slice-anatomy](vertical-slice-anatomy.md)
