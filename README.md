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
To pick up a new release later: `claude plugin marketplace update engineering-loop`, then
`claude plugin update naswerks@engineering-loop` (an install over an existing install does nothing).

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

**In a repository that already has a docs convention** (frontmatter on every file, a pre-commit
validator, an indexer): the two method documents state one way of running the loop, opinionated on
purpose, and mark the four sections that are yours to replace — the header every doc carries, where a
finished effort is filed, the templates' header lines, the rails a commit passes. Keep each heading and
rewrite its body in your `docs/_meta/` copies, in your own words; `docs-workflow.md` § The repository-owned
sections lists what each must answer. One grep lists the four:

```
rg -n '^#+ .*\(repository-owned\)' docs/_meta/
```

If the repository already keeps an index of every doc, declare the loop's menu curated — put
`<!-- naswerks-loop: menu=curated; index=docs/INDEX.md -->` (your index's path) in `docs/_meta/doc-index.md`
— and the menu lists only the docs your seats read, each held to the loop's standard; every other doc stays
in your own index. A repository with no index of its own keeps the default, a menu of every living doc.

Every skill names the section it needs and never states the format itself, so the pack stays generic and
your conventions live in your repository. **Taking a newer pack:** `/naswerks:init refresh` writes only
those four sections and the version stamp into your copies — a dry run first, then `--write` on your word —
and never touches the rest of the text.

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
| `init` | — | make a repository ready for both loops; `init doctor` checks one, `init refresh` takes a newer pack's repository-owned sections |

`references/` carries the two method documents a repository copies into `docs/_meta/` and then
rewrites where they say (repository-owned);
`bin/verify-staged` is the staging receipt the seats run between `git add` and `git commit`. A
marketplace install puts nothing on PATH: `npm i -g @naswerks/engineering-loop` does, and the skills
carry the fallback `node <pack root>/bin/verify-staged.mjs`.

Running a skill through a child `claude -p` from inside another Claude Code session: scrub the
`CLAUDE_CODE_*` variables from the child's environment and name the repository root in the prompt,
or the child may resolve `docs/` paths against the parent session's workspace.

## Does it work

`npm test` runs the pins: one version across the package, the plugin manifest, the marketplace entry and
both method documents' stamps; every skill directory carries a `SKILL.md` named for its folder; no
byte-order marks; the vocabulary and content censuses; no skill states a format a repository owns, and
every skill that needs one carries the same find-format line; exactly four repository-owned sections, found
by the one grep; the loop's own preferences stay stated in the method documents; the menu's two shapes; `init refresh` leaves
every line outside those sections byte for byte. `node bin/verify-staged.mjs --self-test` drives the
receipt against a throwaway repository and reports each case.

## Releasing

The version lives in `package.json`, `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
(they must agree), in both method documents' stamps, and in a CHANGELOG section. The marketplace serves
the plugin from this repository at whatever `main` holds, so a CLI install never waits on npm; npm is the
runner lane.

To release: push the release commit to `main`, publish it to npm from the repository root (`npm login`,
then `npm publish --access public`), then push its `v*` tag. The tag's workflow runs the pins, finds the
version already on the registry and skips its own publish, and creates the GitHub release from the
CHANGELOG section. With a trusted publisher linked on npmjs.com for this repository and `release.yml`,
pushing the tag alone publishes; the workflow prints that remedy when a publish is refused.

## License

MIT.
