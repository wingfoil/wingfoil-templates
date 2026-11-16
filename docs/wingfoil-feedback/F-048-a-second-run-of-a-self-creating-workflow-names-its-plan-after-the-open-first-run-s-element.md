---
id: F-048
title: "A second run of a self-creating workflow names its plan after the open first run's element"
kind: gap
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-092). From this repository's plan-073, which ran a draft pack's capture workflow
on 0.3.2 once per incoming item: the second run's plan was named after the first run's item. A
workflow that declares no `element` and creates its element at a step is bound to that element
(spec-017 §3.4); a workflow that declares no `element` also takes the active instance's element as
its context element (§3.5), and the plan's `{phase}` and `element` come from the bound element or,
before one exists, from the context (§7.1). 0.3.2 follows these rules, but they do not tell a
self-creating run, whose bound element arrives later, from a workflow that creates none: a second
run started while the first is open is named, and keeps its plan's `element`, after an element
that belongs to another run. Distinct from F-038 (which fields `workflow start` fills at all).

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git
identity). No configuration written by hand: the scaffold's `bug-ingest` declares no `element`,
its `capture` runs `memory.add(type: bug)`, and the plan type's `id_pattern` is
`{workflow}-{phase}-plan`.

Excerpts: omitted lines shown as `…`, long lines wrapped; every command exits 0.

```
$ wingfoil workflow start bug-ingest
started bug-ingest as bug-ingest-1-plan (active)
$ wingfoil memory add --type bug --title "First bug" --workflow bug-ingest-1-plan
    --step bug-ingest.capture
$ wingfoil memory submit bug-001-first-bug             # draft → pending
$ wingfoil memory approve bug-001-first-bug --reason triaged
$ wingfoil workflow status
open workflows: 1
* bug-ingest-1-plan (bug-ingest) — active, complete
    element: bug:bug-001-first-bug (approved)
    phases: capture complete, approve complete
$ wingfoil workflow start bug-ingest                   # the first run not ended
started bug-ingest as bug-ingest-bug-001-first-bug-plan (active)
$ wingfoil memory add --type bug --title "Second bug"
    --workflow bug-ingest-bug-001-first-bug-plan --step bug-ingest.capture
$ wingfoil workflow status
open workflows: 2
* bug-ingest-bug-001-first-bug-plan (bug-ingest) — active
    element: bug:bug-002-second-bug (draft)
    phases: capture current, approve pending
    …
  bug-ingest-1-plan (bug-ingest) — complete
    element: bug:bug-001-first-bug (approved)
    …
$ head -10 docs/memory/plan/bug-ingest/bug-ingest-bug-001-first-bug-plan.md
---
id: bug-ingest-bug-001-first-bug-plan
type: plan
title: "bug-ingest — bug-001-first-bug"
status: active
workflow: "bug-ingest"
phase: "bug-001-first-bug"
element: "bug-001-first-bug"
…
```

The second run is bound to `bug-002-second-bug`, but its plan's id, title, `phase` and `element`
name `bug-001-first-bug`, and keep it after the second bug exists. For contrast, in a second
scratch project set up the same way, with `workflow end bug-ingest-1-plan` (exit 0, "active:
none") before the second start: `started bug-ingest as bug-ingest-1-2-plan (active)`, `phase:
"1-2"`, `element: ""`.

## Expected

A self-creating workflow takes no context element from another instance of a workflow, or at
least not from an instance of itself, so a second run started while the first is open gets a plan
named as when none is open (`bug-ingest-1-2-plan`, `element` empty until its element is created);
or the plan's `element` is rewritten to the bound element once the run creates it, and the id is
not taken from the context. Either way, the plan's `element` and `workflow status` name the same
element.
