# working/

Per-session handoff docs. `docs-write` finishes one at the end of every build session and leaves it here;
one effort may chain several (each `Builds on` the last, all with the same `Source:`). They leave only
through `docs-process`, which patches the living docs from their **Living Docs to Update** checklists and
then files the whole effort into `archive/{topic}/`. The folder is a shared queue: other efforts' docs may
sit beside yours, and membership is never inferred from the folder.

A README in this folder is never a queue entry.
