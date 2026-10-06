---
id: dl-010-the-first-real-catalog.yaml-and-compat.yaml-arrive-with-the-tooling
type: decision-log
title: "The first real catalog.yaml and compat.yaml arrive with the tooling"
status: pending
tags: ["tooling","catalog","compatibility"]
---

## Context

spec-001 §11 and §12 specify `catalog.yaml` and `compat.yaml`, at the repository root, and their
schemas are under `schema/`. Milestone M0 closed with the specification and the schemas, not with
committed files (plan-012, review N9): the W3 and W4 exit criteria were met on paper. Today neither
file exists on `main`.

The tooling needs them:
- the resolver reads the axes, cardinalities, slots and stage scale from `catalog.yaml`, rather than
  hard-coding them (spec-001 §3, §17 step 1). Task 4 of plan-015;
- the compatibility matrix and the computed range read `compat.yaml` (spec-001 §12). Tasks 3 and 8.

The content is known now:
- `catalog.yaml`: `format: 1`, `foundation: base`, the `axes` and `slots` of spec-001 §11, and empty
  `packs`, `transitions` and `presets`. No pack charter is accepted yet, so no pack is listed, not
  even as `planned`. The schema allows empty lists. `foundation: base` then names a pack absent
  from `packs`; neither the schema nor spec-001 §18 rejects that, and the tooling must not either
  until `base`'s charter is accepted;
- `compat.yaml`: `format: 1`, the seven kinds, the capability vocabulary of spec-001 §12, and one
  release, 0.2.2, with `format_key: false`.

## Options

- **(a) With the tooling.** Each file is written by the tooling task that first reads it: the real
  `catalog.yaml` in task 4, the real `compat.yaml` in task 8 (task 3 tests the range on fixtures).
  From then on the validation command checks them like any other file of the repository.
  - For: the tooling runs on the real files from the start, not only on fixtures; the real files are
    validated by the tool that checks them; `compat.yaml` is in place for `wingfoil-release-intake`
    when v0.3 is released.
  - Against: `catalog.yaml` exists with no pack for a while; a WingFoil resolver reading it then
    finds nothing (none reads it before v0.4).
- **(b) With `base` (M2).** Both files are written by the first `pack-release` of `base`.
  - For: the catalog appears with its first entry.
  - Against: the composer and the matrix are proven on fixture catalogs only; `compat.yaml`, which
    does not depend on any pack, waits for an unrelated milestone.

## Decision

**Proposed: option (a)**, captured as proposed with plan-015 on 2026-10-06. The approver rules at
`memory approve`.

- The real `catalog.yaml` is written in task 4 of plan-015, the real `compat.yaml` in task 8.
- Fixtures used by the tests carry their own catalog and compat files under `tests/fixtures/`
  (`dna.yaml` `paths.tests`); the real files never list fixture packs.
- The `axes` and `slots` of the real catalog are spec-001 §11 verbatim. A later change to them is a
  change of spec-001.

Configuration changes this decision implies: none. `dna.yaml` already declares the `catalog` and
`compat` modules and lists both files in `paths.sources`.

## Execution Notes

- 2026-10-06: amended while `pending`, as the approver asked, after an independent review (plan-015
  Execution Notes): fixtures under `tests/fixtures/`, the `dna.yaml` tests folder;
  `foundation: base` with no `base` entry is stated as allowed.
