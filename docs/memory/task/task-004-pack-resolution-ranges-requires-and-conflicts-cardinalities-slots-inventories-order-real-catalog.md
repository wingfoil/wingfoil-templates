---
id: task-004-pack-resolution-ranges-requires-and-conflicts-cardinalities-slots-inventories-order-real-catalog
type: task
title: "Pack resolution: ranges, requires and conflicts, cardinalities, slots, inventories, order, real catalog"
status: backlog
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
fixture tree), as the composer's first stage. A pack is found at `packs/<id>/pack.yaml`, one
version per pack in a tree, and its manifest passes the schema check of task-002 before use. A
request is a list of §6.3 entries or bare catalog pack ids. Not in scope: parameters and the
fragment merge (task 5); local paths outside the tree, and the output (task 6); reading packs at a
git tag (the release dry-run, task 11). Some checks here are also §18 lint rules (slot workflows,
fragment order, duplicate requirements); §17 and §18 say the composer refuses what the lint
rejects, so task 9 reuses these checks rather than writing them again.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.
`resolve(tree, catalog, request)` returns the ordered list of `{ id, version, path }`, or throws a
`ResolveError` whose message names the packs involved; the tests assert on both.

1. `npm ci`, `npm run build`, `npm test`, `npm run check:pins` and `npm run check:schemas` exit 0;
   no dependency is added. `check:schemas` now checks 1 file, the real `catalog.yaml`.
2. **`catalog.yaml`** exists at the root: `format: 1`, `foundation: base`, the `axes` and `slots`
   of spec-001 §11 verbatim, `packs: []`, `transitions: []`, `presets: []`. A test compares its
   `axes` and `slots` with the §11 example parsed from spec-001. The resolver loads it although
   `foundation: base` names a pack absent from `packs` (dl-010), and working-tree packs need no
   `packs[]` entry.
3. **Ranges:** an entry is accepted only if it matches the schema's `requiresEntry` (for
   `requires`) or `conflictsEntry` (for `conflicts`) pattern; tests cover every form of §6.3 (`^1`,
   `^1.2`, `^1.2.3`, `~1.2`, `~1.2.3`, `1.2.3`, `>=1.2.0 <3.0.0`) with satisfying and unsatisfying
   versions, and the refused forms (`||`, `1.2.x`, `1.0.0 - 2.0.0`, `^1.0.0-rc.1`). An empty
   intersection (`>=2.0.0 <1.0.0`) matches the pattern and is unsatisfiable: resolution fails on it.
4. **Resolution,** from fixture trees under `tests/fixtures/resolve/`, each with a test:
   - the requested packs and every pack they require, transitively, are in the result; `base` is
     added when a request omits it (spec-001 §15);
   - failures, each naming the packs involved:
     - a requested or required pack missing from the tree;
     - a requested entry whose range the tree's version does not satisfy
       (`methodology/kanban@^2` against 1.0.0);
     - a pack's `requires` whose range the required pack's version does not satisfy;
     - a conflict with a pack present, with and without a range;
     - a pack that requires itself; a pack that requires one id twice with different ranges
       (`x@^1`, `x@^1.2`);
     - a manifest whose `id` is not its directory; a phase manifest whose `slot` is not the middle
       segment of its `id`;
   - passes: a conflict whose range the present version does not satisfy; a conflict naming a
     pack absent from the composition; `base` appears once however many packs require it.
5. **Cardinalities and slots,** read from the catalog's `axes` and `slots`, each failure with a
   test: no methodology; two methodologies; two packs of one phase slot; two team-modes; two
   stages; a phase pack without `workflows/<slot>.yaml`; a methodology without `delivery`; a pack
   other than the slot's filler shipping a slot workflow; a pack other than `base` shipping
   `sw-life-cycle` or `retrospective`. Any number of blueprints and governance packs passes. The
   schema fixes each axis's `cardinality`, `required` and `overlay`, so the reading of other values
   is tested on an in-memory catalog object.
6. **Inventories (§6.4):** a listed file missing, and a file present but unlisted, under
   `fragments/`, `directives/`, `workflows/`, `memory-templates/` and `agents/section.md`, each
   fail naming the file; `contents.fragments` out of the order `dna`, `roles`, `memory` fails.
7. **Order (§7.1):** a fixture with every axis gives `base`, methodology, phase packs in slot order,
   blueprints, governance, team-mode, stage; within blueprints, Kahn's order with byte-order ties
   (a test where the request order differs and the result does not). Failures, each with a test:
   a `requires` cycle among blueprints (naming both); a blueprint requiring a stage; a
   `phase/inception/*` pack requiring a `phase/release/*` pack; a team-mode requiring a stage.
   A stage requiring a team-mode passes.
8. **Determinism:** the result is the same whatever the order of the request (a test applies a
   fixed permutation) and of the directory listing (the resolver reads directories through one
   sorted-listing helper, which a test feeds unsorted entries).
9. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review
  that validated the real catalog and the range patterns against the schemas: how a pack is
  located and checked; the request syntax; requested versus required unsatisfied ranges; cycle and
  "points later" cases; the two passing conflict cases; dl-010's `foundation` tolerance; the
  reuse of these checks by task 9; the result shape; the empty intersection; the listing seam.
