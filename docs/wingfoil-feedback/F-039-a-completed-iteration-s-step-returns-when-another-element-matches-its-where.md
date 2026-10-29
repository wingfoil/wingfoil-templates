---
id: F-039
title: "A completed iteration's step returns to the frontier when another element matches its where"
kind: request
status: open
wingfoil_version: 0.3.1
answered_by: []
---

New note (task-064). From this repository's bug-008, option (iii) (plan-052 ruling 2): a
methodology that iterates a sub over Sprints, the sub ending with an `approve` that selects the
retrospective's decision-log by a tag, sees Sprint 1's step come back once Sprint 2's decision-log
waits for approval. It follows from spec-017 §4.7 (a selection is a live query; its two rules do not
cover the last phase of a completed iteration); this is a request. Distinct from F-018 (`where:` on
`iterate_over` not evaluated by 0.2.2), F-034 (the arguments a `memory.add` action drops) and F-037
(an `iterate_over` phase closed by a later phase: here a completed iteration reopens).

## Observed

WingFoil 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfiles
`src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`,
`wingfoil init --template Kanban --no-interactive`, a member `Tester` with the role `approver` in
`dna.yaml`), with two custom workflows included in `workflows.yaml` and committed:

```yaml
# .wingfoil/workflows/custom/cycles.yaml
name: cycles
kind: main
description: "One cycle per task"
version: 1
format: 1
phases:
  - name: cycles
    description: "Each task, one cycle."
    iterate_over: task
    include: cycle
```

```yaml
# .wingfoil/workflows/custom/cycle.yaml
name: cycle
kind: sub
element: task
description: "A cycle: its work, then its retrospective approved"
version: 1
format: 1
phases:
  - name: work
    description: "Submit the task (draft to pending)."
    role: developer
    actions:
      - memory.submit
  - name: approve
    description: "Approve the retrospective's decision-log."
    role: approver
    where: { type: decision-log, status: [pending], tags: [retrospective] }
    actions:
      - memory.approve
    approval: { by_role: approver }
```

Both releases give the same result (each command exits 0; outputs are excerpts):

```
$ wingfoil memory add --type task --title "First"
$ wingfoil workflow start cycles
$ wingfoil memory submit task-001-first
$ wingfoil memory add --type decision-log --title "Retro one" --tags retrospective
$ wingfoil memory submit dl-001-retro-one
$ wingfoil memory approve dl-001-retro-one --reason ok
$ wingfoil workflow status
* cycles-1-plan (cycles) — active, complete
    phases: cycles complete (complete 1)
$ wingfoil memory add --type task --title "Second"
$ wingfoil memory submit task-002-second
$ wingfoil memory add --type decision-log --title "Retro two" --tags retrospective
$ wingfoil memory submit dl-002-retro-two
$ wingfoil workflow status
* cycles-1-plan (cycles) — active
    phases: cycles current (entered 2)
    frontier:
      - cycle.approve@task:task-001-first (approver; missing: selection)
      - cycle.approve@task:task-002-second (approver; missing: selection)
pending approvals: 2
  human needed: approve or reject dl-002-retro-two — routed to Tester <t@example.com> (cycles-1-plan, cycle.approve@task:task-001-first)
  human needed: approve or reject dl-002-retro-two — routed to Tester <t@example.com> (cycles-1-plan, cycle.approve@task:task-002-second)
```

The first cycle was complete; its `approve` returns to the frontier, awaiting `dl-002-retro-two`,
and the one decision-log is counted once per step. `workflow next` offers
`cycle.approve@task:task-001-first` first. Binding the `where` to the scope with a token
(`tags: ["{id}"]`) avoids it inside an iteration, but the same sub included where no element is in
scope (a periodic retrospective) leaves the token unresolved (`W_UNRESOLVED_TOKEN`).

## Expected

Request, for WingFoil's release planning and not a commitment, either of:
1. a completed iteration's steps are not deduced again: an element that matches later is reported as
   `late`, as §4.7 does for an `iterate_over` phase closed by a later phase; or
2. a `where` key that applies only when an element is in scope and is skipped otherwise, so that one
   sub can bind its selection to its iteration and still run where nothing is in scope.
