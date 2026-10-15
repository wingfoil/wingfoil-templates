---
id: task-033-the-index-and-the-readmes-with-two-foundation-packs-and-the-conditional-part-dl-022-spec-002-plan-039-r3
type: task
title: "The index and the READMEs with two foundation packs and the conditional part (dl-022, spec-002, plan-039 R3)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-039)
depends_on: []
tags: ["tooling","base","index"]
---

## Context

plan-039's third task: the generated index and the READMEs' generated sections with the two
foundation packs and the conditional part (spec-002 §2.1, §2.2, §3.2, §3.3 as amended by plan-038
on 2026-10-15; plan-039 R3). It runs on `task/task-033-index`, its Design is committed on `main`,
and its `deliver` is that branch's `--no-ff` merge, then `done` on `main` (tooling-delivery v2). No
pack. It changes neither `catalog.yaml` nor `schema/` (spec-002 CB-8).

The text it implements:
- spec-002 §2.1 section 1: the foundation packs, `base` and `software`, write `Axis: foundation`;
- §2.1 section 4: for every pack but `base`, what it declares, over the foundation it requires;
  for a pack with a conditional part, that part's workflows and directives marked as present only
  with `software`; §2.2: the generated sections read only the pack's own files;
- §3.2: one section for the foundation packs, `base` then `software`, then one per axis;
- §3.3: `axis` and `slot` `null` for both foundation packs;
- plan-039 R3: each version object copies `conditional` as the catalog version entry does (its
  `with` only); each pack object gains `conditional_workflows` and `conditional_directives`, and
  its `workflows` and `directives` keep what is always composed; in `CATALOG.md`, the Summary cell
  of such a pack ends with ` (… only with software)` naming the part's workflows (its directives
  when it has no workflow); `catalog-index.json` stays at `format: 1`; R3 is recorded in
  spec-002's Execution Notes (dl-020 R1), to be folded back at the wave's close.

What exists, at `main` `d52fb91` (task-031 and task-032 done):
- `axisAndSlot` (`src/index-model.ts:97`) returns `null` only for the literal `base`; it serves
  the index and `readme-generate.ts` (`titleSection`), so `software` gets `Axis: software` and an
  `axis` of `software` in the index, which `index/catalog-index.schema.json` refuses (its `packId`
  pattern and `axis` enum name `base` only): task-031 and task-032 left `software` unpublished in
  every test for that reason;
- `compositionSection` (`src/readme-generate.ts:92`) writes "Declares" for every pack whose id is
  not the literal `base`, from the pack's own files; the files read (`src/index-source.ts`, the
  `PackFiles` of `readme-generate.ts`) are `contents` only, so a conditional part's workflows
  appear nowhere in a README or in the index;
- `packOf` (`src/index-model.ts:180`) fills `workflows` and `directives` from `contents`, and a
  version object (`versionOf`) copies `formats`, `requires_capabilities`, `requires`, `conflicts`;
- `renderCatalog` (`src/index-render.ts`) writes the foundation section from the packs with a
  `null` axis, in the index's byte order of ids;
- the fixtures: the golden tree's `software` and `flow` READMEs (task-031's interim `Axis:
  software`; flow's sections without its part), `tests/support/index-catalog.ts` (`software` in the
  tree, unpublished) and `tests/fixtures/index/expected/`.

Not in scope: `schema/`, `catalog.yaml`, `compat.yaml`; the `memory.yaml` keys (task-034); a pack
of `packs/` (W8). A README's generated sections read only the pack's own files (§2.2), so they
tell a foundation pack from its own `pack.yaml` (no `axis`), never from `catalog.yaml`.

## Acceptance

Run from a clean clone of `task/task-033-index`, on Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, `npm run validate`
   and `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exit 0;
   no dependency is added.
2. **READMEs** (tests in `tests/readme-generate.test.ts`): `software`'s title line reads
   `Axis: foundation`, as `base`'s does, read from its `pack.yaml` having no `axis`; section 4
   writes "Declares" for `software` and not for `base`; for a pack with a conditional part,
   section 4 lists that part's workflows and directives as present only with `software`, and
   section 5 lists its workflows with the same mark (a reading of §2.1, whose section 5 names the
   workflows a pack adds); the golden tree's READMEs are regenerated and reviewed by diff, the
   interims of task-031 and task-032 gone.
3. **The index** (tests in `tests/index-model.test.ts`, `tests/index-render.test.ts`): `axis` and
   `slot` `null` for `base` and `software`, read from `catalog.yaml`'s `foundation`; a version
   object of a pack with a conditional part carries `conditional: [{ with }]`, and one of a pack
   without it carries none; a pack object carries `conditional_workflows` and
   `conditional_directives` (sorted; empty without a part), its `workflows` and `directives`
   leaving the part out; `CATALOG.md`'s foundation section lists `base` then `software` in
   `catalog.yaml`'s order, and a pack with a part has its Summary cell marked (R3).
4. **The index schema** (`index/catalog-index.schema.json`) admits `software` in its `packId`
   pattern, the version object's optional `conditional` (its `with` only) and the pack object's two
   new required lists; `catalog-index.json` and the schema stay `format: 1`; an index of a tree
   that publishes `software` and a pack with a conditional part validates against it.
5. **The index fixtures:** `tests/support/index-catalog.ts` publishes `software` and a methodology
   with a conditional part; `tests/fixtures/index/expected/` is regenerated with
   `REFRESH_INDEX_EXPECTED=1` and reviewed by diff; the site tests (`tests/site.test.ts`) pass on
   it, `software` listed under the foundation filter.
6. **No foundation literal:** `git grep -nE "['\"\`](base|software)(['\"\`@/]|$)" -- src/` gives
   no hit.
7. **spec-002's Execution Notes** record R3 (dl-020 R1), as task-019 recorded its erratum; no other
   line of spec-002 changes.
8. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `src/`,
   `tests/`, `index/catalog-index.schema.json`, spec-002 (Execution Notes) and this element;
   `schema/`, the root `catalog.yaml`, `compat.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` at the root unchanged (no pack is published).
9. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
