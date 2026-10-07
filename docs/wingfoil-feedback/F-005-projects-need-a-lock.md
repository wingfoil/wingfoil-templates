---
id: F-005
title: "Projects need a lock to make init reproducible and upgrades possible"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T5.

## Observed

Nothing in a project records which template produced its `.wingfoil/`, apart from
`project.methodology` in `dna.yaml`, a free string that nothing reads afterwards.

## Expected

`.wingfoil/templates.lock` records the source (repository plus tag or commit), every pack with its
version and parameters, the current stage, and a digest of every generated file. The digests let an
upgrade tell "the pack changed this file" from "the user changed this file" (a three-way merge).
The lock also makes `init` repeatable on another machine.

Open question (planning, 4): cache location and offline behaviour — `~/.cache/wingfoil/templates`,
plus an `--offline` flag that uses only bundled and cached packs?

Related: WingFoil dl-138 Q1 (vendored and pinned, with a lock). Suggested kind in WingFoil:
tech-spec (lock format) + task.
