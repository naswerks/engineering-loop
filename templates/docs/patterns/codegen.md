# Code Generation

> What is generated in this repository, from what, by which command — and the one rule: never hand-write
> a generated file. Last verified {today}.
<!-- meta: type=pattern; status=draft; verified={today}; lineage=0 -->
<!-- naswerks-loop: draft; scanned={files} -->

---

## Overview

<!-- init: scan — generated/ folders, codegen configs (codegen.ts / codegen.yml, openapi*, *.proto,
     tgconfig.json, prisma/, graphql-codegen, source generators in *.csproj), package.json scripts named
     gen / codegen / generate, a scripts/ file that orchestrates them.
     fill — an ASCII diagram of each pipeline (source, tool, output) and a table
     `Pipeline | Tool | Input | Output | Purpose`, one row per pipeline found.
     absent — "No code generation detected — fill this in when a pipeline appears (an OpenAPI client, a
     GraphQL client, a protobuf, an ORM client). Until then there is no generated folder to protect." -->

## Running codegen

<!-- init: scan — the orchestrating script or the per-pipeline commands, and their preconditions (a
     built binary, a running server).
     fill — ONE fenced block: the exact command(s) from the repo root, with a comment per line naming its
     precondition. This is the command every seat runs; the skills point here.
     absent — "No codegen command detected — fill this in: the exact invocation from the repo root." -->

```
{the exact command}          # precondition: {what must be built or running}
```

## What is generated — never hand-written

<!-- init: fill — the list of generated folders/files, verbatim paths, each with the tool that owns it and
     the header it carries ("AUTO-GENERATED — DO NOT EDIT"). Then the rule:
     "**Never hand-write or manually edit files under these paths.** Run the command above; a hand-written
     'generated' file is overwritten on the next run and drifts silently until then."
     absent — "No generated folders detected — fill this in when one appears." -->

## Adding a generated type — checklist

<!-- init: scan — how a source type opts into generation (an attribute, an export, a schema entry).
     fill — a checklist: mark the source (the attribute/export), run the command, verify the output file
     exists and compiles, commit source and output together.
     absent — "- No opt-in mechanism detected — fill this in: how a type enters the pipeline." -->

## Removing a generated type — checklist

<!-- init: fill — the mirror checklist: remove the source mark, run the command, delete the orphaned
     output, grep consumers.
     absent — "- No pipeline detected — fill this in when one appears." -->

## Gotchas

<!-- init: scan — comments in the codegen config or script that warn about something; CONTRIBUTING notes.
     fill — one `### Gotcha:` per warning found, each with symptom, cause, remedy, and the file it came
     from.
     absent — "No codegen gotchas written down yet — fill this in the first time one bites." -->

## Key Files

| File | Purpose |
|------|---------|
<!-- init: scan — every config, script and generated folder named above.
     fill — one row per file, verbatim path.
     absent — "| (none detected) | fill this in: the configs, the script, the output folders |" -->

## Lineage
- **Related** — [backend-patterns](backend-patterns.md) · [frontend-patterns](frontend-patterns.md) · [testing](testing.md)
