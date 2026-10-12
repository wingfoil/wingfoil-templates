---
id: F-026
title: "A workflow phase has one role, so the role cannot depend on the element"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-026). From the periodic retrospective of 2026-10-12 (plan-025; this repository's
bug-001; `wingfoil-cli` W-13).

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`), the `build` phase of the scaffolded `kanban-delivery` given two roles
(`role: [developer, pack-author]`):

```
$ wingfoil workflow list
error: E_VALIDATION phases.1.role (/tmp/x/.wingfoil/workflows/custom/kanban-delivery.yaml):
Invalid input: expected string, received array                                    # exit 1
```

A phase takes one role. In this repository the same delivery loop serves two kinds of task: a
pack's task, built as `pack-author`, and a tooling task (empty `pack`), built as `developer`, each
role loading different directives. With one role per phase the loop exists twice
(`kanban-delivery` and `tooling-delivery`), differing only in roles and descriptions, and every
change to one is checked against the other.

## Expected

A phase can take its role from the element, for example a role selected by a frontmatter field
(`role: { by_field: pack, empty: developer, otherwise: pack-author }`), or a list of roles of which
the element names one; or WingFoil documents the duplicated sub-workflow as the pattern.
