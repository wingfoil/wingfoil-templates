---
id: task-031-the-two-foundation-packs-base-and-software-and-the-contract-schemas-catalog.yaml-resolver-lint-f-031-dl-022
type: task
title: "The two foundation packs base and software, and the contract: schemas, catalog.yaml, resolver, lint, F-031 (dl-022)"
status: pending
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
`software`, the axes), §7.5 (`defaults` defined by `base` only), §7.6 (one owner per file, a slot
default, now `software`'s, excepted), §9 (`sw-life-cycle` and the slot
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
  `resolve.ts` (the queue starts from it; `axesMessages` exempts it from the axis check, line 212,
  and `order` places it first, line 263; an axis is required when `AxisSpec.required`, declared in
  `catalog.ts`, is true, read at line 219); `memory-merge.ts` (`defaults` defined by it only);
  `output.ts` (`agentsRegion`: its section opens at level 1, every other at level 2);
  `compose-documents.ts`; `tree-rules.ts` (`presetChecks` adds it to every preset); `overlay-rules.ts` (it composes every
  methodology × team-mode × stage, and every other pack once as `base` + the first methodology +
  the pack; nothing when the tree has no methodology); `workflow-rules.ts` (`lifeCycleProblems`:
  its `sw-life-cycle` includes the slots); `pack-rules.ts` (`BASE_ONLY_WORKFLOWS =
  ['sw-life-cycle', 'retrospective']`, rule `base-only`; `slotProblems` lets a slot's `default`
  pack ship it).
- **Fixtures.** The golden `tests/fixtures/compose/tree` (preset `golden`) has a `base` that ships
  `sw-life-cycle`, the slot defaults, `retrospective`, the types `task` and `adr` and the parameter
  `adr_path`; its packs require `base` only; `tests/fixtures/compose/expected` is its output.
  The golden tree has its own `catalog.yaml` (`foundation: base`, `default: base`), README examples
  under `tests/fixtures/compose/tree/tests/fixtures/examples/` (`base/kanban-team` among them) and
  the generated index files. `tests/fixtures/resolve/full`, the trees of
  `tests/support/pack-tree.ts` (`BASE`, `BASE_COMPOSABLE`, `KANBAN`) and
  `tests/support/index-catalog.ts`, and `tests/fixtures/index/expected` are built the same way.
- **The §18 rule on using `software`** ("a pack that uses a Memory type, a workflow, a directive or
  a parameter of `software` outside a conditional part requires it") needs no new rule: the
  existing ones already refuse a workflow's `element` or `iterate_over` type, an `include`, a
  roles directive and a `{{parameter}}` that the pack and the packs it requires do not ship
  (`workflow-rules.ts`, `pack-files.ts`); once `software` is a pack of its own, they apply to it.
- **The feedback inbox.** `npm run feedback:note -- --schema --from <task>` writes the next note
  with the schema digest and its ledger row; the `schema-note` lint rule fails while `schema/`
  differs from the newest note's digest (F-017 is the baseline; `wingfoil-cli` rule 8).

Not in scope: the conditional part's semantics (task-032; here a pack carrying `conditional` is
refused, R1); the index, the READMEs' generated sections and `index/` (task-033), so the golden
README of `software` keeps the title line `npm run index` generates, `Axis: software`, until then;
the `memory.yaml` keys of §7.5 (task-034); `compat.yaml`; any `packs/` content (W8). Until
task-032, a methodology that does not require `software` has no valid form (it must ship `delivery`,
and only a conditional part may hold it): the fixtures of such methodologies here are
resolution-only, where the axis message comes before the slot rule (`resolve.ts`). No previous
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
     and `directives`; `conditional` on `base` or `software`; `foundation: base`; a `methodology`
     axis with `required: true`; a slot `default: base`; a version entry's `conditional` holding
     `contents`.
3. **`catalog.yaml` and spec-001 §11** change in one commit with `schema/catalog.schema.json` and
   the golden tree's `tests/fixtures/compose/tree/catalog.yaml` (plan-038 ruling 1): the example
   block and both catalogs read `foundation: [base, software]`, `methodology: { cardinality: one,
   required_with: software }` and `default: software` on the four slots, the tree's `axes` and
   `slots` equal to the root's; §11's bullet that says the example still shows the old form is
   removed. `tests/catalog.test.ts` passes, holding them equal and asserting the foundation list.
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
   `conditional`, refused with a message naming spec-001 §6.5 as not implemented yet (R1). The rule
   on using `software` without requiring it is covered by the existing rules (Context), with one
   test per kind (type, include, directive, parameter) against `software`'s content.
6. **The golden composition**: the golden tree splits into `base` (`task`, `retrospective`, the DNA
   and roles fragments, its directive, its level-1 section) and `software` (`sw-life-cycle`, the
   slot defaults, `adr` with `adr_path`, a level-2 section), each with a README that passes the
   README rules and a CHANGELOG; `methodology/kanban` and every phase pack require `software@^1`,
   kanban shipping `delivery` in `contents` (plan-038 ruling 7). `software`'s README names an
   example under `tests/fixtures/examples/software/`, which holds a methodology; its generated
   title reads `Axis: software` until task-033, recorded in the Execution Notes.
   `tests/fixtures/compose/expected` is regenerated and reviewed by diff, its `workflows.yaml`
   including `software`'s workflows right after `base`'s. A new example of `base`,
   `base/core-only` (`packs: [base@^1]`), is composed by `npm run validate`, and its output is
   checked byte for byte against `tests/fixtures/compose/expected-base/`, as `expected` is. The
   counts that the fixture split changes (in `tests/validate.test.ts`: the examples, the
   compositions, the files; in `tests/index.test.ts`), and the assertions of
   `tests/readme-generate.test.ts` on `base`'s and kanban's sections, change only as the split
   requires, each listed in the Execution Notes.
7. **The lint's compositions** (`overlay-rules.ts`), each refusal a problem, tested:
   - rule `overlay`: besides every methodology × team-mode-or-none × stage-or-none (as today), every
     team-mode-or-none × stage-or-none except none × none with no methodology, when neither
     overlay reaches `software` through `requires`;
   - rule `compose`, for a pack no such combination reaches: `base` alone; a pack that does not
     reach `software` as `base` + the pack; a pack that reaches it, `software` itself included, as
     `base` + the tree's first methodology + the pack, and not at all when the tree has no
     methodology (plan-039, the limit for W8).
8. **No foundation literal.** `catalog.foundation` is a list, read as its first entry (the core)
   and its second (the software layer).
   ``git grep -nE "['\"`](base|software)(['\"`@/]|$)" -- src/`` gives only
   `src/index-model.ts` and `src/readme-generate.ts` (task-033); the reserved workflow names
   (`sw-life-cycle`, `retrospective`, `governance-evolution`) stay literals. The hits are listed
   in the Execution Notes.
9. **The index fixtures.** With `software` in the trees of `tests/support/index-catalog.ts` and the
   golden tree, `tests/fixtures/index/expected` is regenerated with `REFRESH_INDEX_EXPECTED=1` and
   reviewed by diff; `software` is published in no index fixture, so it is in no `packs` of an
   index output; `index/` is unchanged.
10. **F-031.** `npm run feedback:note -- --schema --from task-031` writes F-031 and its ledger row;
   its body is completed by hand before the commit with what changed for a reader of the contract
    (two foundation packs; `required_with`; the slots' default; `conditional` and its `with`;
    the format staying 1, plan-038 ruling 6) and what WingFoil is asked to do; `schema-note`
    passes. The note is committed in the same push as the schema change, so no pushed commit
    fails `schema-note` in CI; a red local commit between the two is recorded. No
    `schema/*.v<N>.schema.json` is added.
11. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `schema/`,
    `catalog.yaml`, spec-001 (§11, and its Execution Notes for an erratum, dl-020 R1), `src/`,
    `tests/`, `docs/wingfoil-feedback/` and this element; `compat.yaml` and `index/` unchanged.
12. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
    `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-15: written under plan-039; independent review of the body: approve after amendments,
  nothing blocking (the one commit of plan-038 ruling 1 with the catalog schema and the golden
  tree's `catalog.yaml`; the golden split's READMEs, examples, `base/core-only` and the counts it
  changes; the index fixtures; the exact grep of criterion 8; the lint's compositions made exact;
  an erratum allowed in spec-001's Execution Notes; the §18 rule on using `software` covered by the
  existing rules; resolution-only methodologies without `software`; F-031 in the same push as the
  schema). Amended; no finding changed a rule, so no re-review. Size: the Design lists the red
  steps by group, or proposes a split (031a contract and composer, 031b lint) through plan-039.
