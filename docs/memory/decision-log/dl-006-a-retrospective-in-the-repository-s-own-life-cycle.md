---
id: dl-006-a-retrospective-in-the-repository-s-own-life-cycle
type: decision-log
title: "A retrospective in the repository's own life cycle"
status: approved
tags: ["process","retrospective"]
---

## Context

This repository's `sw-life-cycle` has no retrospective. Its phases are inception, specification,
`pack-delivery` (`pack-cycle`, with `kanban-delivery` and `pack-release-cycle`) and sunset. The
other three governed repositories have one: WingFoil2 and UI close each `release-cycle` with
`retrospective`, and Benchmark closes its `release-cycle` with one.

Three reasons make the gap matter here more than elsewhere:
- **This repository meets WingFoil's friction first** (`wingfoil-feedback` directive). Its findings
  go to the feedback notes, which WingFoil reads at *its* retrospective and release planning
  (dl-001 D6). Nothing reads them for *this* repository's own process.
- **This repository adopts `base` first** (dl-003 D10), and `base` ships `retrospective`, included
  by the methodology's delivery at its own cadence (dl-003 D2, D4).
- **Kanban has no sprint end** (dl-005 G1: continuous flow). A retrospective needs an explicit
  cadence or it never happens.

The approver asked for this element on 2026-10-06 ("apri dl-006 per la retrospective"), after the
session that compared the phases of the four repositories.

## Options

1. **No retrospective of our own.** Rely on WingFoil's retrospective through the feedback notes.
   Rejected: those notes carry WingFoil's defects, not this repository's process friction.
2. **A phase of `pack-release-cycle`.** Rejected: it would run for every patch release.
3. **A phase of `pack-cycle` after `first-release`, plus a startable main for periodic runs.** Once
   per pack, when a whole charter-to-release cycle has just been lived, and periodically for the
   work between packs (pack releases, tooling, governance).
4. **Only a periodic main.** Simpler, but the end of a pack's first cycle, where most is learned,
   depends on someone remembering to start it.

## Decision

The approver asked for the element; the points below are *proposed* and become rulings when it is
approved.

- **R1 — Option 3.** A sub-workflow `retrospective`:
  - included by `pack-cycle` as a phase after `first-release` and before `activate`;
  - included by a new startable main, `retrospective-periodic`. A main cannot be included, and an
    included workflow must be `kind: sub`, so the periodic entry point is a thin main of its own.
- **R2 — Phases**, the same as WingFoil2's `retrospective` and the draft `base` one, so that adopting
  `base` (dl-003 D10) replaces this workflow without changing its shape:
  1. `explore` (facilitator): mine the Execution Notes of every element closed in the period — tasks,
     packs, pack-releases, bugs, decision-logs, plans — and the feedback notes added in it; build a
     friction inventory grouped by theme, each point citing its source.
  2. `additional-points` (approver): a checkpoint, no commit. The approver adds points to analyse.
  3. `capture` (facilitator): a decision-log with what to keep and what to change. A change of
     process is its own decision-log; a WingFoil defect is a feedback note, not a decision.
  4. `approve`: the approver rules the retrospective, so its actions are committed.
- **R3 — Cadence of the periodic run.** At least once between two WingFoil releases, before
  WingFoil's release planning, so that the WingFoil-side points it finds reach the feedback notes
  in time (dl-001 D6). Also after any `pack-deprecation`.
- **R4 — Where the inventory lives.** `docs/retrospectives/`, outside every Memory path, as in
  WingFoil2 (its approver ruling of 2026-10-05). The friction inventory is a phase output that an
  engine can test for existence.
- **R5 — Method.** The four phases follow the shape of Derby & Larsen's retrospective (gather data,
  generate insights, decide what to do), adapted to Execution Notes as the data. dl-007 records how a
  phase declares that.

Configuration changes this decision implies, applied after approval:
- a new `workflows/custom/retrospective.yaml` (sub) and `workflows/custom/retrospective-periodic.yaml`
  (main), both included by `workflows.yaml`;
- `pack-cycle`: a `retrospective` phase after `first-release`, `version: 1 → 2`;
- `sw-life-cycle`: its header comment names the periodic retrospective, `version: 1 → 2`.

## Execution Notes

- The configuration changes are a task of their own after approval; the `.wingfoil/` configuration
  commit `539e943` is not amended again, because commits now sit on top of it.
- When `base` is adopted (dl-003 D10), `base`'s `retrospective` replaces this one. Any difference
  found then is resolved in `base`, not here.
