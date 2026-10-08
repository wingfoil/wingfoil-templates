---
id: F-013
title: "wingfoil migrate and wingfoil capabilities"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T13.

## Observed

WingFoil has no command that rewrites a project's files from one format to the next, and none that
reports which formats and capabilities the running WingFoil provides. A pack resolver, and this
repository's `compat.yaml`, must otherwise read changelogs.

## Expected

- **`wingfoil migrate [--to <format>] [--dry-run]`.** Rewrites a project's files from format N to
  N+1 for each file kind: deterministic, the diff shown before writing, one commit
  (`wf(migrate): workflow 1 → 2 [...]`); each step shipped by WingFoil with the release that
  introduces the new format. Without it, every WingFoil project has to rewrite its files by hand at
  the first format change. In WingFoil-Templates, migrations also produce the first draft of a
  pack's next version in the new format.
- **`wingfoil capabilities --format json`.** Prints the format versions the running WingFoil reads
  per file kind, and the capabilities it provides (for example `workflow-engine`, `agent-execute`,
  `pack-install`, `stage-transitions`, `migrate`). The pack resolver of `init` / `pack add` /
  `upgrade` matches it against a pack's `formats` and `requires_capabilities`; WingFoil-Templates
  reads it to keep its `compat.yaml` true. The vocabulary proposed in this repository's spec-001 §12
  is a starting point; WingFoil owns the names.

`migrate` is needed in the first release that ships a format 2 (v0.3 if F-012's change lands there,
else v0.4); `capabilities` with pack installation (v0.4). Suggested kind in WingFoil: decision-log +
tech-spec (migration step contract) + tasks.
