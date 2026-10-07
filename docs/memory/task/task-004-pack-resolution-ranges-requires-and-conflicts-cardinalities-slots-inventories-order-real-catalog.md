---
id: task-004-pack-resolution-ranges-requires-and-conflicts-cardinalities-slots-inventories-order-real-catalog
type: task
title: "Pack resolution: ranges, requires and conflicts, cardinalities, slots, inventories, order, real catalog"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-003-pack-digest-and-computed-wingfoil-range"]
tags: ["tooling","W5","F3.2"]
---

## Context

Task 4 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.2). Tooling task, no pack.

It comes from:
- **spec-001 §17 steps 1, 3 and 4:** the composer resolves the packs and their `requires`, fails on
  a missing pack, an unsatisfied range or a conflict; checks the cardinalities, the slots and the
  inventories; and orders the packs;
- **spec-001 §3** (axes, cardinalities, overlays, `base` required once), **§6.3** (`requires` and
  `conflicts` with the range subset), **§6.4** (`contents` is the inventory, both ways), **§7.1**
  (composition order, Kahn within an axis of cardinality "many", a `requires` pointing later is an
  error), **§9** (slots), **§11** (`axes` and `slots` are data of `catalog.yaml`, read rather than
  hard-coded);
- **dl-010:** the real `catalog.yaml` is written by this task, with the `axes` and `slots` of
  spec-001 §11 verbatim and empty `packs`, `transitions` and `presets`;
- **adr-003:** the range subset is checked before `semver` evaluates it, and `semver` runs without
  `loose` or `includePrerelease`.

Scope: resolving a composition from packs in a directory tree (this repository's working tree, or a
fixture tree), as the composer's first stage. Not in scope: parameters and the fragment merge
(task 5), the output (task 6), reading packs at a git tag (the release dry-run, task 11), the
§18 lint rules that are not resolution (task 9).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run check:pins` and `npm run check:schemas` exit 0;
   no dependency is added. `check:schemas` now checks 1 file, the real `catalog.yaml`.
2. **`catalog.yaml`** exists at the root: `format: 1`, `foundation: base`, the `axes` and `slots`
   of spec-001 §11 verbatim, `packs: []`, `transitions: []`, `presets: []`. A test compares its
   `axes` and `slots` with the §11 example parsed from spec-001.
3. **Ranges:** an entry is accepted only if it matches the schema's `requiresEntry` (for
   `requires`) or `conflictsEntry` (for `conflicts`) pattern; tests cover every form of §6.3 (`^1`,
   `^1.2`, `^1.2.3`, `~1.2`, `~1.2.3`, `1.2.3`, `>=1.2.0 <3.0.0`) with satisfying and unsatisfying
   versions, and the refused forms (`||`, `1.2.x`, `1.0.0 - 2.0.0`, `^1.0.0-rc.1`).
4. **Resolution,** from fixture trees under `tests/fixtures/resolve/`, each with a test:
   - the requested packs and every pack they require, transitively, are in the result; `base` is
     added when a request omits it (spec-001 §15);
   - failures, each naming the packs involved: a requested or required pack missing from the
     tree; an unsatisfied range; two packs of which one conflicts with the other (with and without
     a range); a pack that requires itself or another pack twice.
5. **Cardinalities and slots,** read from the fixture's catalog `axes` and `slots`, each failure
   with a test: no methodology; two methodologies; two packs of one phase slot; two team-modes; two
   stages; a phase pack without `workflows/<slot>.yaml`; a methodology without `delivery`; a pack
   other than the slot's filler shipping a slot workflow; a pack other than `base` shipping
   `sw-life-cycle` or `retrospective`. Any number of blueprints and governance packs passes.
6. **Inventories (§6.4):** a listed file missing, and a file present but unlisted, under
   `fragments/`, `directives/`, `workflows/`, `memory-templates/` and `agents/section.md`, each
   fail naming the file; `contents.fragments` out of the order `dna`, `roles`, `memory` fails.
7. **Order (§7.1):** a fixture with every axis gives `base`, methodology, phase packs in slot order,
   blueprints, governance, team-mode, stage; within blueprints, Kahn's order with byte-order ties
   (a test where the request order differs and the result does not); a blueprint requiring a stage
   fails.
8. **Determinism:** the result is the same whatever the order of the request and of the directory
   listing (a test shuffles the request deterministically, by a fixed permutation).
9. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
