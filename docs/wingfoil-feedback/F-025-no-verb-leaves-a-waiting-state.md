---
id: F-025
title: "No verb leaves a waiting state except deprecate"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-026). From the periodic retrospective of 2026-10-12 (plan-025; `wingfoil-cli` W-07;
this repository's dl-003 D3).

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`), the `task` type given `sequence: [draft, backlog, in-progress, waiting-review, done]` and
`waiting: [waiting-review]`:

```
$ wingfoil memory submit task-001-demo                      # in-progress -> waiting-review, exit 0
$ wingfoil memory submit task-001-demo
error: illegal transition waiting-review -> backlog for type 'task'           # exit 1
$ wingfoil memory approve task-001-demo --reason x
error: illegal transition waiting-review -> (none) for type 'task'            # exit 1
$ wingfoil memory deprecate task-001-demo                   # exit 0, status: deprecated
```

`memory.yaml` accepts `waiting` states, and `submit` enters one, but neither `submit` nor `approve`
leaves it; only `deprecate`, which retires the element, does. `submit` reports a target, `backlog`,
that is neither the next state of the sequence nor explained. This repository therefore declares no
`waiting` state (dl-003 D3).

## Expected

A verb (or the workflow engine) moves an element out of a `waiting` state to the next state of the
sequence, or the schema refuses `waiting` until one does; the error names what is expected.
