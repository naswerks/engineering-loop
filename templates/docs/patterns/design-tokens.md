# Design Tokens

> The token authority: which colour, spacing and typography tokens exist, what each means, and how
> component CSS consumes them. Component usage (which class for which job) lives in
> [ui-style-guide](ui-style-guide.md). Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at the word for draft; where that section keeps no date in the blockquote, drop the `Last verified {today}.` above. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — a tokens/theme file (a CSS file defining --* custom properties, a tailwind/daisyui
     theme block, a design-system package), the global stylesheet, how themes are switched.
     fill — two to four sentences: the token system, the library that emits it, how a theme is selected.
     absent — this doc is only drafted when a tokens file or a UI library with a token layer is found. -->

## Token reference

<!-- init: fill — one table per family (`Token | CSS variable | Purpose | When to use`): brand, base /
     surface, status; each row read from the tokens file, never invented.
     absent — "No token definitions found — fill this in." -->

### Brand

| Token | CSS variable | Purpose | When to use |
|-------|-------------|---------|-------------|

### Base / surface

| Token | CSS variable | Purpose | When to use |
|-------|-------------|---------|-------------|

### Status

| Token | CSS variable | Purpose | When to use |
|-------|-------------|---------|-------------|

## Consuming tokens in component CSS

<!-- init: scan — how existing component styles reference tokens (var(--…), a theme() helper, a mixin).
     fill — the ONE rule in this repo's form ("use `var(--…)` directly; express opacity with `color-mix`;
     never a literal colour"), a fenced example copied from a real stylesheet, and the dead forms to grep for
     if the library moved majors.
     absent — "No token consumption found in component styles — fill this in." -->

## Rules

<!-- init: scan — a style lint, a stylesheet rule spec, a CONTRIBUTING note.
     fill — bold-lead imperative bullets, each citing its source when written down; the loop supplies one:
     "**A stylesheet never names a colour** — every value is a token or a mix over one, so a skin or a dark
     mode needs no per-component work."
     absent — the one loop-supplied bullet, then "- No further token rules found written down — fill this
     in." -->

## Key Files

| File | Purpose |
|------|---------|

## Lineage
- **Related** — [ui-style-guide](ui-style-guide.md) · [frontend-patterns](frontend-patterns.md)
