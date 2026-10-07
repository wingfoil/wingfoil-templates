---
id: F-015
title: "One composer for packs, written in WingFoil-Templates and proposed to WingFoil"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

Formerly T15.

## Observed

Until WingFoil installs packs (v0.4, dl-138), nothing composes them, so nothing can validate them.
WingFoil-Templates therefore has its own composer (its adr-001; TypeScript on Node.js ≥ 22.12,
adr-002), implementing only composition as its spec-001 specifies: the merge, parameters, slots,
`requires`/`conflicts` and cardinalities. Download, lock, upgrade and three-way merge stay
WingFoil's. Two composers, one in each repository, can diverge, and a pack can then validate in one
and fail in the other. The composer depends on `yaml` 2.9.1, `ajv` 8.20.0 and `semver` 7.8.5 (its
adr-003); WingFoil uses `js-yaml`, which reads `format: 1.0` as the integer 1 with no trace of the
source text, while spec-001 §18 must reject it.

## Expected

WingFoil adopts this composer as the implementation of the composition step of `init`, `pack add`
and `upgrade`, instead of writing a second one. To decide in WingFoil: whether the composer moves
into WingFoil or becomes a package both repositories depend on; how it relates to the lock (F-005)
and the three-way merge (F-007); whether it takes `yaml` as a dependency or reimplements the source
check. A difference between the two composers, once WingFoil composes, is reported here.

Suggested kind in WingFoil: decision-log, with dl-138, during the v0.4 planning.
