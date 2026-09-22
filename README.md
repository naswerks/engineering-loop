# engineering-loop

The engineering loop as a Claude Code plugin: a **knowledge loop** (`docs-*`) that keeps a repository's
living documentation true, and an **execution loop** (`spec-*`) that turns an approved plan into a numbered
pipeline of agent sessions with a coordinator, build seats, a review seat and a retrospective. `init`
makes a fresh repository ready for both.

The package root is the plugin root: `.claude-plugin/` and `skills/` sit at the top, so the same tree serves
a person's CLI (through the marketplace, from this repository), a hosted runner (through npm), and a
repository's pin.

## Install

**In your own Claude Code** (every repository on the machine):

```
claude plugin marketplace add naswerks/engineering-loop
claude plugin install naswerks@engineering-loop
```

The marketplace is this repository, and the plugin is sourced from it: no registry sits between you and a
release. Plugins load at session start, so start a new session (or run `/reload-plugins`) after installing.
To pick up a new release later: `claude plugin marketplace update engineering-loop`, then the install line again.

Skills are namespaced by the plugin: `/naswerks:docs-write`, `/naswerks:spec-pipeline`, `/naswerks:init`.

**On a runner** (sessions started through the Agent SDK load a plugin only from a local path):

```
npm i -g @naswerks/engineering-loop
```

then point the runner at `$(npm root -g)/@naswerks/engineering-loop` — with periscope, the
`PERISCOPE_PLUGIN_DIRS` key, or the Plugins field on the control plane's runner page.

**In a repository** (so everyone who clones it gets the loop): `/naswerks:init` writes the `docs/`
structure the skills read, the two method documents, a `CLAUDE.md` pointer and the plugin pin in
`.claude/settings.json`. A team member still installs the plugin once per machine; the pin enables it.

## What is in the box

| Skill | Loop | One line |
|---|---|---|
| `docs-backlog` | docs | park an idea as a research doc |
| `docs-status` | docs | orient at session start: archived, in flight, waiting |
| `docs-write` | docs | finalize the session's working doc |
| `docs-process` | docs | patch living docs from working docs, verified against code, then archive |
| `docs-audit-feature` · `docs-audit-full` | docs | audit living docs against code |
| `spec-pipeline` | spec | explode an approved plan into numbered specs |
| `spec-parent` | spec | the coordinator seat |
| `spec-seat` | spec | the contract every armed seat follows |
| `spec-child` | spec | the build job for one spec |
| `spec-review` | spec | the outside look before the retrospective |
| `spec-retro` | spec | the coordinator's close-out audit |
| `spec-witness` | spec | a read-only verifier |
| `spec-ignite` | spec | the ignition copilot for a hosted run |
| `init` | — | make a repository ready for both loops |

`references/` carries the two method documents a repository copies into `docs/_meta/`;
`bin/verify-staged` is the staging receipt the seats run between `git add` and `git commit`. A
marketplace install puts nothing on PATH: `npm i -g @naswerks/engineering-loop` does, and the skills
carry the fallback `node <pack root>/bin/verify-staged.mjs`.

Running a skill through a child `claude -p` from inside another Claude Code session: scrub the
`CLAUDE_CODE_*` variables from the child's environment and name the repository root in the prompt,
or the child may resolve `docs/` paths against the parent session's workspace.

## Does it work

`npm test` runs the pins: one version across the package, the plugin manifest and the marketplace
entry; every skill directory carries a `SKILL.md` named for its folder; no byte-order marks; the
method documents carry the version stamp; the vocabulary censuses. `node bin/verify-staged.mjs
--self-test` drives the receipt against a throwaway repository and reports each case.

## Releasing

The version lives in `package.json` and `.claude-plugin/plugin.json` (they must agree). A `v*` tag
runs the pins and publishes to npm through trusted publishing; the GitHub release notes are the
CHANGELOG section for that version. The marketplace serves the plugin from this repository at whatever
`main` holds, so a CLI install never waits on npm; npm is the runner lane, and a refused publish leaves
runners one version behind until the trusted publisher on npmjs.com matches this repository and
`release.yml` (the workflow prints that remedy when it happens).

## License

MIT.
