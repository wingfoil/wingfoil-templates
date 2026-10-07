---
id: F-016
title: "A workflow phase cannot declare the method it follows"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

Formerly T16.

## Observed

Approved as a proposal by the approver on 2026-10-06, in the session that compared the phases of the
four governed repositories. The workflow format has no field for the method a phase follows. The
method is named only in YAML comments and descriptions, so a phase without one goes unnoticed: named
— `lean-inception` (Lean Inception), `specification-downcast` (User Story Mapping, BDD, Volere),
`dev-loop` (TDD) in WingFoil2 and UI, GQM and Kanban in Benchmark; house-made, marked only *"Best
practice adapted to WingFoil"* — `release-planning`, `retrospective`, `release-submit`,
`release-publishing`, `end-of-life`. `release-cycle` even says *"story points"* for planning, but no
phase of `release-planning` estimates them.

## Expected

An optional per-phase (or per-workflow) key, for example
`method: { kind: methodology | standard | house, ref: "Kanban Method — replenishment" }`. `house`
makes the absence of a method explicit; `standard` covers mechanical phases (SemVer, Keep a
Changelog, ADRs). The rule that must come with it: the label never replaces the steps — every
practice the method requires is spelled out as phases, checks, `produces` or Memory templates,
since a bare reference leaves the definition to each agent's own knowledge and the variance between
runs grows.

Effect on the Determinism Index (dl-131): **I** none, it is already 100% by tests; **P** none
while no check reads the key, growing only if a method maps to checks P can measure (e.g. Kanban:
replenishment yields an ordered backlog within the WIP limits); **O** small and not measurable yet,
since the phases concerned (planning, retrospective, roadmap) hardly change the software's
behaviour. The real gain is traceability, and checking a pack against the method it claims;
WingFoil2-Benchmark could measure P with and without the expanded method on a scenario that
includes release planning. This repository's dl-007 (phase methods) waits for it, and its
`pack-authoring` directive then adopts the rule. Suggested kind in WingFoil: decision-log,
with the workflow format (dl-149), during the v0.4 planning.
