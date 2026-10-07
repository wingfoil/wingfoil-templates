---
id: F-009
title: "The agent-first overlay depends on v0.3/v0.4 agent work"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T9.

## Observed

The `agent-first` overlay declares `team.agents` with `executes_as` (humans kept as approvers),
sizes tasks small with machine-checkable acceptance criteria, turns the WIP limit into parallel
worktrees/agents, turns ceremonies into asynchronous checkpoints (the sprint review becomes an
approval gate, the retrospective a generated decision-log), and makes the determinism and
claim-evidence directives mandatory. It leans on work not yet landed in WingFoil: adapters
(spec-016, adr-012, task-196 installs them at init), `paths.runs` (task-138), `agent execute`
(v0.3), and perennial agents (dl-080, unmerged).

## Expected

WingFoil publishes these pieces as capabilities a pack can require (see F-013), so that the
overlay's `pack.yaml` declares what it needs instead of a minimum WingFoil version.

Suggested kind in WingFoil: a dependency note on the v0.4 planning; no element by itself.
