# UI Style Guide

> Which class or component to reach for, for which job, and the composition rules that keep screens
> consistent. The tokens themselves are the authority of [design-tokens](design-tokens.md). Last verified {today}.
<!-- init: write here the machine header docs/_meta/docs-workflow.md § Doc metadata (repository-owned) prescribes, at its draft status. The loop's own header is the one-line meta comment: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## The mental model

Every element on screen falls into one of these roles. Name the role before you pick a class.

| Role | What it is | Visual weight | Example |
|------|-----------|---------------|---------|
| **Primary action** | the thing you WANT the user to do | highest — filled, coloured | Create, Send, Save |
| **Secondary action** | useful but not the main goal | medium — outlined | View, Details, Refresh |
| **Passive action** | navigation away, undo, dismiss | lowest — ghost / minimal | Back, Cancel, Close |
| **Destructive action** | permanent data loss | high, danger-coloured | Delete, Remove |
| **User content** | text the user wrote or data they own | emphasised | names, values, messages |
| **System content** | app-generated text, metadata | neutral, de-emphasised | helper text, timestamps |
| **Status indicator** | communicates state without action | colour-coded by meaning | badges, alerts |
| **Navigation** | moves between pages | subtle until hovered | breadcrumbs, tabs, sidebar |
| **Metadata** | labels, counts, ids | minimal, neutral outline | pagination, "Showing X of Y" |

## Action hierarchy

**One primary action per context** (page header, card, modal, form). Everything else is secondary or
passive.

<!-- init: scan — the UI library (tailwind, daisyui, mui, chakra, bootstrap, shadcn …) and two existing
     pages/components (a header with actions, a form footer).
     fill — the button decision tree in this repo's class names, then "Current patterns": a fenced
     snippet each for a page header, card actions, a modal footer, a form bottom, copied from real files.
     absent — "No UI library detected — fill this in: the class or component for each role above." -->

## Content roles

<!-- init: fill — three tables (`Element | Style | Why`) for user content, system content, and status
     indicators (positive / warning / error / info / neutral / category), in this repo's classes.
     absent — "No content-role classes detected — fill this in." -->

## Page layout and page states

Every data-driven page handles four states: **loading**, **error**, **empty**, **content**.

<!-- init: scan — a shared page-header / empty-state / loading / error component, if any.
     fill — the standard page skeleton (an ASCII box), the shared components to use for the four states,
     and the state-switch idiom the repo uses.
     absent — "No shared page components detected — fill this in: the page skeleton and the four-state
     components." -->

## Tokens

Snapshot — the token authority is [design-tokens](design-tokens.md): which tokens exist, what each
means, and the one rule for consuming them in component CSS. This page names the class for the job; that
page names the value behind the class.

<!-- init: fill — one sentence naming the token family this UI library exposes (from design-tokens.md when
     drafted). absent — "No design tokens detected — the classes above are the whole vocabulary; fill this in
     if a token layer appears." -->

## Forms

<!-- init: fill — the field pattern, input states, validation display, in this repo's classes.
     absent — "No form convention detected — fill this in." -->

## Quick reference: element to style

<!-- init: fill — a two-column table `Element | Style` compiled from the sections above.
     absent — "Compile this table once the sections above are filled." -->

| Element | Style |
|---------|-------|

## Lineage
- **Related** — [frontend-patterns](frontend-patterns.md) · [design-tokens](design-tokens.md)
