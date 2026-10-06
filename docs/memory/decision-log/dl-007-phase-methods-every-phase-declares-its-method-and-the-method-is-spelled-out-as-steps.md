---
id: dl-007-phase-methods-every-phase-declares-its-method-and-the-method-is-spelled-out-as-steps
type: decision-log
title: "Phase methods: every phase declares its method, and the method is spelled out as steps"
status: pending
tags: ["process","packs"]
---

## Context

On 2026-10-06 a session compared the workflow phases of the four governed repositories, asking
which ones follow a named method. The findings:
- **Discovery and specification name theirs.** Lean Inception (all four), GQM (Benchmark), User
  Story Mapping, Specification by Example and Volere (WingFoil2, UI), TDD in WingFoil2's `dev-loop`,
  Kanban in Benchmark's and this repository's `kanban-delivery`.
- **Delivery mostly does not.** WingFoil2 and UI mark `release-planning`, `retrospective`,
  `release-submit`, `release-publishing` and `end-of-life` only as *"Best practice adapted to
  WingFoil"*. `release-cycle` says planning defines *"story points"*, yet no phase of
  `release-planning` estimates them.
- **Here**, `specification`, `pack-cycle`, `pack-release-cycle` and `pack-deprecation` name none.
- **The method is named only in comments and descriptions.** WingFoil's workflow format has no field
  for it, so a phase without one goes unnoticed (feedback notes, T16).

The pack model already gives most phases a place for a method: the `methodology` axis fills
`delivery` (dl-001 D1, dl-003 D4), and the `phase/<slot>` packs fill `inception`, `specification`
and, since dl-003 D11, `release`. Nothing yet says that a pack must declare its method, nor what
declaring one obliges it to ship.

The session also weighed the effect on WingFoil's Determinism Index (WingFoil dl-131). A bare label
changes none of its components:
- **I** is already 100% by tests;
- **P** only moves if a check reads the method;
- **O** hardly depends on planning or retrospective phases.

A label such as "Shape Up", with no steps behind it, leaves the definition to each model's own
knowledge, so two runs diverge more, not less.

The approver asked for this element on 2026-10-06 ("un altro per l'implementazione delle
metodologie come discusso qui sopra").

## Options

- **What a pack declares.**
  - (a) Nothing; methods stay in comments, as today.
  - (b) A label per workflow and phase.
  - (c) A label, plus the obligation to spell the method out as steps.
- **Where the declaration lives, until WingFoil has a key for it.**
  - (a) A YAML comment convention in the workflow file.
  - (b) A field of the pack format (spec-001), read by the composer and the validator.
  - (c) Wait for WingFoil's key (T16).
- **Which phases need a methodology.**
  - (a) Every phase.
  - (b) Every phase declares a method, which may be a methodology, a standard or house-made.

## Decision

The approver asked for the element; the points below are *proposed* and become rulings when it is
approved.

- **M1 — Every workflow a pack ships declares its method, per workflow and, where it differs, per
  phase** (options c, b, b). Three kinds:
  - `methodology`: a named method with a published source, e.g. Lean Inception, Scrum Guide 2020,
    the Kanban Method's cadences, Shape Up, TDD;
  - `standard`: a convention that governs a mechanical phase, e.g. SemVer 2.0, Keep a Changelog,
    ADRs;
  - `house`: no external method. Declaring it is required, so the absence is explicit.
- **M2 — The label never replaces the steps.** Every practice the declared method requires is
  spelled out as phases, checks, `produces`, Memory templates or directives. A practice the pack
  leaves out on purpose is listed in its README as an adaptation. Example: WingFoil2's `release-cycle` mentions
  story points, but no phase estimates them; under M2 the mention is either implemented or removed.
- **M3 — The source is cited with its edition** in the pack README (e.g. Scrum Guide, November
  2020), so a later edition of the method is a deliberate pack change under `pack-semver`.
- **M4 — Where the declaration lives.**
  - spec-001 adds a `method` entry per shipped workflow (and per phase, optionally) to the pack
    format; the composer and the validator read it.
  - When WingFoil adds a workflow key (feedback notes, T16), the pack format maps to it with a
    `pack-semver` minor, and the spec-001 entry is deprecated.
- **M5 — Where methods live in the pack model.**
  - The `methodology` axis declares the methods of `delivery`. Its packs implement the
    cadence-level planning, review and retrospective they promise: Sprint Planning, Review and
    Retrospective for `scrum`; replenishment, delivery planning and WIP limits for `kanban`.
  - `phase/<slot>` packs declare the method of their slot: `inception`, `specification`, `release`.
  - `base`'s slot defaults declare `house`.
  - `blueprint`, `stage`, `team-mode` and `governance` packs declare `standard` or `house` for the
    workflows they ship. They are not phase-oriented and need no methodology.
- **M6 — Candidates for the `release` slot.**
  - The Kanban Method's replenishment and delivery planning, Shape Up, and Agile Release Planning
    over story-map slices.
  - They are candidates only. The first scope stays dl-001 D5 as amended by dl-003 D7, and the
    sequencer is unchanged.
- **M7 — This repository's own workflows** declare their method in a header comment, because
  WingFoil 0.2.2 has no key for it:
  - `templates-inception`: methodology, Lean Inception (compact);
  - `kanban-delivery`: methodology, Kanban (WIP limits only);
  - the `specification` phase of `sw-life-cycle`: house;
  - `pack-release-cycle`: standard, SemVer 2.0 with this repository's compatibility matrix;
  - the retrospective of dl-006: methodology, Derby & Larsen, adapted.

Configuration changes this decision implies, applied after approval and each bumping `version:`:
- `pack-authoring`: rules M1–M3;
- the header comments of M7 (comment-only changes, recorded in each file's version comment).

## Execution Notes

- spec-001 must define the `method` entry of M4: its kinds, the source reference, and the optional
  per-phase override.
- Measurement is WingFoil2-Benchmark's to decide. A scenario that includes release planning, run
  with and without the method spelled out as steps, would measure the effect on Process
  conformance (P). Suggested to Benchmark through the feedback notes (T16), not ruled here.
- Related: dl-003 D11 (the `release` slot), dl-006 (the retrospective), feedback notes T16.
