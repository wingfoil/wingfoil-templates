---
id: F-010
title: "The first packs fix known scaffold gaps"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T10.

## Observed

WingFoil's scaffold has known gaps already reported: benchmark note N1 (the scaffold's
`sw-life-cycle` has empty phases, there is no inception workflow and no `plan` type, and the ingest
workflows have no actions); bug-144 (the Kanban template includes a workflow by path).

## Expected

Extracting the first packs from WingFoil's own workflows (as `minor-v0.4.md` already proposes)
closes these gaps. A pack is accepted into WingFoil-Templates only if every preset composed from it
passes `wingfoil workflow list` and the config validation with zero errors, mirroring task-199 for
the dogfood workflows; WingFoil-Templates CI runs that check against the WingFoil releases its
`compat.yaml` lists as compatible.

Suggested kind in WingFoil: an acceptance criterion on the P4.18 tasks; a CI contract between the
two repositories.
