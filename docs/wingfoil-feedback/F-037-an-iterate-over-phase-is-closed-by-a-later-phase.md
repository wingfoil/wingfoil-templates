---
id: F-037
title: "An iterate_over phase is closed by a later phase, so a candidate added afterwards never runs"
kind: request
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-052). From this repository's dl-026 D5 (plan-047): a methodology with two repeating
streams, Sprints and releases, cannot run both as phases of one workflow. Distinct from F-018 (a
`where:` on `iterate_over` that 0.2.2 did not evaluate), F-032 (suspending an instance) and F-033
(closing a plan that is not an instance): here a later phase of one open instance closes its
earlier `iterate_over` phase.

## Observed

WingFoil 0.3.0 from npm, in a scratch project (`git init`, `wingfoil init --template Kanban
--no-interactive`), with two custom workflows included in `workflows.yaml` and committed:

```yaml
# .wingfoil/workflows/custom/stream.yaml
name: stream
kind: main
description: "A repeating phase followed by a later phase"
version: 1
format: 1
phases:
  - name: items
    description: "Each task, one at a time."
    iterate_over: task
    include: item
  - name: report
    description: "Write the report."
    role: developer
    produces:
      - "docs/report.md"
```

```yaml
# .wingfoil/workflows/custom/item.yaml
name: item
kind: sub
element: task
description: "One task"
version: 1
format: 1
phases:
  - name: submit
    description: "Submit the task (draft to pending)."
    role: developer
    actions:
      - memory.submit
```

```
$ wingfoil memory add --type task --title "First"
{ "id": "task-001-first", ... }                                                  # exit 0
$ wingfoil workflow start stream                                                 # excerpt
started stream as stream-1-plan (active)
next step: item.submit@task:task-001-first                                       # exit 0
$ wingfoil memory submit task-001-first                                          # exit 0
$ wingfoil workflow next
workflow: stream (stream-1-plan)
next step: stream.report
  evidence missing: produces                                                     # exit 0
$ git add docs/report.md && git commit -m report     # docs/report.md written first; exit 0
$ wingfoil workflow next
workflow: stream (stream-1-plan)
no next step: workflow 'stream' is complete                                      # exit 0
$ wingfoil memory add --type task --title "Second"
{ "id": "task-002-second", ... }                                                 # exit 0
$ wingfoil workflow next
workflow: stream (stream-1-plan)
no next step: workflow 'stream' is complete                                      # exit 0
$ wingfoil workflow status                                                       # excerpt
* stream-1-plan (stream) — active, complete
    phases: items complete (complete 1, late 1), report complete
    late: task:task-002-second (draft)                                           # exit 0
```

Once `report` completed, `items` is closed: the task added afterwards is reported `late`, no step
is offered for it, and the workflow is complete. In a methodology this is the normal case: once a
Sprint's retrospective, or a release, completes, the earlier Sprint phase is closed and the next
Sprint is `late`; a release completing inside a Sprint closes the Sprint's task phase and leaves
its open items `late`.

## Expected

Request, for WingFoil's release planning and not a commitment: a way for one workflow to run two
repeating streams, for example
1. a phase that later phases do not close (an `iterate_over` phase declared open, which stays live
   while its `where:` can still select candidates), or
2. a `late` candidate that can still be run, by a verb or by `workflow next`, instead of only being
   reported.

Until then a methodology nests its second stream inside the first (this repository's
`methodology/scrum` runs releases inside each Sprint, dl-026), which ties a release to a Sprint.
