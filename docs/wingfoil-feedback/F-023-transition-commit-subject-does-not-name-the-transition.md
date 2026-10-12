---
id: F-023
title: "The commit subject of memory submit does not name the transition"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-026). From the periodic retrospective of 2026-10-12 (plan-025; `wingfoil-cli` W-05).

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`), the `task` type given the sequence `[draft, backlog, in-progress, waiting-review, done]`:

```
$ wingfoil memory submit task-001-demo                      # draft -> backlog, exit 0
$ wingfoil memory submit task-001-demo                      # backlog -> in-progress, exit 0
$ git log --format=%s -3
wf(task): submit task-001-demo
wf(task): submit task-001-demo
wf(task): add task-001-demo
```

Every forward step has the same subject. In this repository a task walks
`draft → pending → backlog → in-progress → in-review → approved → done` with four `submit`s; by
2026-10-12 its history held 100 commits `wf(task): submit task-…`, one subject for four different
transitions. The state is read from the frontmatter or from `memory history`, not from the log.
`approve` subjects already carry the transition, for example `[in-review → approved]`.

## Expected

The subject of every transition commit names the states, as `approve` does, for example
`wf(task): submit task-001-demo [backlog → in-progress]`.
