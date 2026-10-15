---
id: task-031-the-two-foundation-packs-base-and-software-and-the-contract-schemas-catalog.yaml-resolver-lint-f-031-dl-022
type: task
title: "The two foundation packs base and software, and the contract: schemas, catalog.yaml, resolver, lint, F-031 (dl-022)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-039)
depends_on: []
tags: ["tooling","base","spec"]
---

## Context

plan-039 (`tooling-change` › `deliver`, `active`) implements the tooling actions of dl-022
(`approved` 2026-10-14) on spec-001 and spec-002 as amended in place by plan-038 (2026-10-15). This
is its first task: the two foundation packs, `base` and `software`, and every change of the
contract under `schema/` (plan-039 R1). It runs on `task/task-031-foundation`, its Design is
committed on `main`, and its `deliver` is that branch's `--no-ff` merge, then `done` on `main`
(tooling-delivery v2). No pack.

The amended text it implements: spec-001 §3 (`base` always, `software` at most one; `methodology`
exactly one with `software`, at most one without; phase packs require `software`), §4 (the catalog
pack id `software`), §6.2 and §6.3 (no `axis` on either foundation pack; `base` requires nothing,
`software` only `base@^<major>`; no conflict with a foundation pack), §7.1 (the order `base`,
`software`, the axes), §7.5 (`defaults` defined by `base` only), §9 (`sw-life-cycle` and the slot
defaults shipped by `software`; `retrospective` and `governance-evolution` by `base`), §10
(`software`'s section opens with a level-2 heading), §11 (`foundation: [base, software]`,
`required_with: software`, the slots' `default: software`, `conditional` in a version entry), §15
(presets with and without `software`), §18 (the checks of all the above).

What exists, at `main` `d99241f`:
- **Schemas.** The catalog pack id pattern (`$defs.packId` and the entry patterns of
  `pack.schema.json`, `catalog.schema.json` and `preset.schema.json`, and the catalog's `path`)
  admits `base` but not `software`. `pack.schema.json` forbids `axis` and `slot` on `base` only,
  requires `base@^<major>` of every other pack and refuses a conflict with `base` only; it has no
  `conditional`. `catalog.schema.json` has `foundation: { const: base }`, `required` on every
  axis, `default: base` on four slots, and no `conditional` in a version entry.
  `src/digest.ts` reads the id pattern from `pack.schema.json`.
- **`catalog.yaml`** and spec-001 §11's example block still show `foundation: base`,
  `methodology: { …, required: true }` and `default: base`; §11's prose already describes the new
  form, with a bullet saying the example still shows the old one. `tests/catalog.test.ts` holds
  `catalog.yaml`'s `axes` and `slots` equal to the example, and asserts `foundation` is `base`.
- **Code reading the foundation as one id** (`Catalog.foundation: string`, `src/catalog.ts`):
  `resolve.ts` (the queue starts from it; `axesMessages` and the order place it first; an axis is
  `required: boolean`); `memory-merge.ts` (`defaults` defined by it only); `output.ts`
  (`agentsRegion`: its section opens at level 1, every other at level 2); `compose-documents.ts`;
  `tree-rules.ts` (`presetChecks` adds it to every preset); `overlay-rules.ts` (it composes every
  methodology × team-mode × stage, and every other pack once as `base` + the first methodology +
  the pack; nothing when the tree has no methodology); `workflow-rules.ts` (`lifeCycleProblems`:
  its `sw-life-cycle` includes the slots); `pack-rules.ts` (`BASE_ONLY_WORKFLOWS =
  ['sw-life-cycle', 'retrospective']`, rule `base-only`; `slotProblems` lets a slot's `default`
  pack ship it).
- **Fixtures.** The golden `tests/fixtures/compose/tree` (preset `golden`) has a `base` that ships
  `sw-life-cycle`, the slot defaults, `retrospective`, the types `task` and `adr` and the parameter
  `adr_path`; its packs require `base` only; `tests/fixtures/compose/expected` is its output.
  `tests/fixtures/resolve/full` and the trees of `tests/support/pack-tree.ts` and
  `tests/support/index-catalog.ts` are built the same way.
- **The feedback inbox.** `npm run feedback:note -- --schema --from <task>` writes the next note
  with the schema digest and its ledger row; the `schema-note` lint rule fails while `schema/`
  differs from the newest note's digest (F-017 is the baseline; `wingfoil-cli` rule 8).

Not in scope: the conditional part's semantics (task-032; here a pack carrying `conditional` is
refused, R1); the index, the READMEs' generated sections and `index/` (task-033), so the golden
README of `software` keeps the title line `npm run index` generates, `Axis: software`, until then;
the `memory.yaml` keys of §7.5 (task-034); `compat.yaml`; any `packs/` content (W8). No previous
schema is frozen: `pack.yaml` and `catalog.yaml` stay at format 1 (plan-038 ruling 6, spec-001 §5).

## Acceptance

Run from a clean clone of `task/task-031-foundation`, on Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` exit 0; no dependency is added (adr-003).
2. **Schemas**, each case a sample under `tests/fixtures/schema/` run by the existing schema tests:
   - valid: a `software` manifest without `axis` requiring `base@^1` only; a methodology requiring
     `base@^1` and `software@^1`; a manifest with one `conditional` entry
     `{ with: software@^1, contents: { workflows: [delivery], directives: [] } }`; a catalog with
     `foundation: [base, software]`, `methodology: { cardinality: one, required_with: software }`
     and the slots' `default: software`; a catalog version entry with `conditional: [{ with:
     software@^1 }]`; a preset naming `software@^1`;
   - invalid: `axis` or `slot` on `software`; `software` requiring nothing, or anything besides
     `base@^<major>`; any pack conflicting with `software` or `base`; `conditional` with two
     entries, a `with` other than `software@^<major>`, or `contents` keys other than `workflows`
     and `directives`; `conditional` on `base` or `software`; `foundation: base`; a `methodology` axis
     with `required: true`; a slot `default: base`; a version entry's `conditional` holding
     `contents`.
3. **`catalog.yaml` and spec-001 §11** change in one commit: the example block and `catalog.yaml`
   read `foundation: [base, software]`, `methodology: { cardinality: one, required_with: software }`
   and `default: software` on the four slots; §11's bullet that says the example still shows the
   old form is removed; no other line of spec-001 changes. `tests/catalog.test.ts` passes, holding
   them equal and asserting the foundation list.
4. **Resolution** (tests in `tests/resolve.test.ts`, fixtures in `tests/fixtures/resolve/`):
   `base` alone resolves (no methodology needed); `software` is in the composition only when
   requested or required by a resolved pack; the order is `base`, `software`, then the axes,
   whatever the request's order; with `software` and no methodology the resolution fails naming
   the `methodology` axis; two methodologies fail with or without `software`; a phase pack brings
   `software` in through its `requires`.
5. **§18 rules**, each reported by `npm run check:packs` and refused by the composer (spec-001
   §17), with a test each: `software` requiring a pack other than `base`; a phase pack not
   requiring `software`; a pack other than `software` shipping `sw-life-cycle` or a slot default;
   a pack other than `base` shipping `retrospective` or `governance-evolution`; `software`
   defining `defaults`; `software`'s agents section opening at level 1; a preset whose resolved
   composition holds `software` and no methodology, or two methodologies; a pack carrying
   `conditional`, refused with a message naming spec-001 §6.5 as not implemented yet (R1).
6. **The golden composition**: the fixtures split into `base` (`task`, `retrospective`, the DNA
   and roles fragments, its directive, its level-1 section) and `software` (`sw-life-cycle`, the
   slot defaults, `adr` with `adr_path`, a level-2 section); `methodology/kanban` and every phase
   pack require `software@^1`, kanban shipping `delivery` in `contents` (plan-038 ruling 7);
   `tests/fixtures/compose/expected` is regenerated and reviewed by diff, its `workflows.yaml`
   including `software`'s workflows right after `base`'s. A composition of `base` alone, from the
   same tree, gives an expected output of its own.
7. **The lint's compositions** (`overlay-rules.ts`): `base` is composed alone; a pack that does
   not reach `software` through `requires` is composed as `base` + the pack; a team-mode or stage
   overlay that does not reach `software` is also composed with no methodology; a pack that
   reaches `software` is composed with the tree's first methodology, as today, and nothing when the
   tree has none. A refusal in each case is a problem, tested.
8. **No foundation literal.** `catalog.foundation` is a list, read as its first entry (the core)
   and its second (the software layer); a grep of `src/` for `'base'` and `'software'` gives only
   `index-model.ts` and `readme-generate.ts` (task-033) and schema-independent messages, listed in
   the Execution Notes.
9. **F-031.** `npm run feedback:note -- --schema --from task-031` writes F-031 and its ledger row;
   its body is completed by hand before the commit with what changed for a reader of the contract
   (two foundation packs; `required_with`; the slots' default; `conditional` and its `with`; the
   format staying 1, plan-038 ruling 6) and what WingFoil is asked to do; `schema-note` passes.
   No `schema/*.v<N>.schema.json` is added.
10. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `schema/`,
    `catalog.yaml`, spec-001 (§11 only), `src/`, `tests/`, `docs/wingfoil-feedback/` and this
    element; `compat.yaml` and `index/` unchanged.
11. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
    `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
