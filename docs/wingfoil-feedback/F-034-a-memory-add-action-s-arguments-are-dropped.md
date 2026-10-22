---
id: F-034
title: "The command offered for a memory.add action drops its arguments but type"
kind: gap
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-041). From this repository's plan-045 (ruling H) and task-038's ruling S: the `base`
pack's `retrospective` › `capture` declares `memory.add(type: decision-log, tags: [retrospective])`,
and its facilitator must pass `--tags retrospective` by hand. Distinct from F-011, where `memory add
--set` fills only id tokens: here the arguments never reach the command.

## Observed

WingFoil 0.3.0 from npm, in a scratch project (`git init`, `wingfoil init --template Kanban`), with
one custom workflow included in `workflows.yaml` and committed:

```yaml
# .wingfoil/workflows/custom/tagged-capture.yaml
name: tagged-capture
kind: main
format: 1
description: "Add a task tagged demo"
phases:
  - name: capture
    actions:
      - 'memory.add(type: task, tags: [demo])'
```

```
$ wingfoil workflow list --format json
... "diagnostics":[]                                                             # exit 0
$ wingfoil workflow start tagged-capture
started tagged-capture as tagged-capture-1-plan (active)
  actions:
    - memory.add(type: task, tags: [demo]) [wingfoil: wingfoil memory add --type task
      --title <title> --workflow tagged-capture-1-plan --step tagged-capture.capture]  # exit 0
$ wingfoil workflow next
  actions:
    - memory.add(type: task, tags: [demo]) [wingfoil: wingfoil memory add --type task
      --title <title> --workflow tagged-capture-1-plan --step tagged-capture.capture]  # exit 0
$ wingfoil memory add --type task --title "Demo task" --workflow tagged-capture-1-plan \
    --step tagged-capture.capture
{ "id": "task-001-demo-task", ... }                                              # exit 0
```

The action is accepted with no diagnostic, and printed with its `tags`, but the offered command
has no `--tags demo`; the task it creates has no `tags` field.

## Expected

The offered command carries every argument of the action that `memory add` accepts (here
`--tags demo`), or the workflow is refused, with a diagnostic, for an argument the binding does not
pass.
