---
id: F-006
title: "init asks one question; the vision asked for more"
kind: gap
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T6.

## Observed

`selectTemplate` (`src/cli/init-command.ts`) asks only `Select a methodology template [Scrum,
Kanban]`. The vision (`docs/01_vision/X_cli-cmds.md:196`) planned `--mode wizard/params/infer`,
`--tech-stack` and `--team-size`.

## Expected

- `wingfoil init --preset <name>`, or one flag per axis (`--methodology`, `--team-mode`,
  `--blueprint`, `--stage`, `--phase inception=lean-inception`);
- an interactive wizard that asks the same questions;
- `--no-interactive` that requires the flags;
- `wingfoil template list` / `template show <pack>` to browse the catalog.

The current `--template Scrum|Kanban` stays as an alias for `--methodology` during a deprecation
window. Suggested kind in WingFoil: tech-spec update (spec-008 init) + tasks.
