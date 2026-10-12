---
id: F-022
title: "memory submit commits uncommitted edits of the element's body in its own transition commit"
kind: defect
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-026). From the periodic retrospective of 2026-10-12 (plan-025; `wingfoil-cli` W-04).

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`):

```
$ wingfoil memory add --type task --title "Demo"                # JSON output omitted
$ echo "Body edit" >> docs/memory/task/task-001-demo.md
$ git status --short
 M docs/memory/task/task-001-demo.md
$ wingfoil memory submit task-001-demo                      # exit 0, JSON output omitted
$ git show --stat --format=%s HEAD
wf(task): submit task-001-demo
 docs/memory/task/task-001-demo.md | 3 ++-
 ...
$ git status --short                                        # clean
```

The state change and the uncommitted body edit land in one commit whose subject names only the
transition, with no warning. In this repository every body is therefore committed by hand before
`submit`, with its own message: two commits per transition, and a forgotten hand commit hides a
body change inside a state change.

## Expected

`submit` (and `approve`, `reject`) refuse to run when the element's file has uncommitted changes,
or commit the body first in a separate commit, or at least warn and name the change in the commit
message.
