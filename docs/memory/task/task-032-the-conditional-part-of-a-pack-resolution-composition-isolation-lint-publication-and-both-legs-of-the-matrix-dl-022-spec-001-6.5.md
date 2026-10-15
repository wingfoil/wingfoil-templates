---
id: task-032-the-conditional-part-of-a-pack-resolution-composition-isolation-lint-publication-and-both-legs-of-the-matrix-dl-022-spec-001-6.5
type: task
title: "The conditional part of a pack: resolution, composition, isolation lint, publication and both legs of the matrix (dl-022, spec-001 §6.5)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-039)
depends_on: ["task-031-the-two-foundation-packs-base-and-software-and-the-contract-schemas-catalog.yaml-resolver-lint-f-031-dl-022"]
tags: ["tooling","base","spec"]
---

## Context

plan-039's second task: the conditional part of a pack (spec-001 §6.5, as amended by plan-038 on
2026-10-15; plan-038 rulings 5 and 7; plan-039 R2 and R4). It runs on
`task/task-032-conditional`, its Design is committed on `main`, and its `deliver` is that branch's
`--no-ff` merge, then `done` on `main` (tooling-delivery v2). No pack.

The text it implements:
- §6.5: `conditional: [{ with: software@^<major>, contents: { workflows, directives } }]`, at most
  one entry, only on a pack that is not a foundation pack and does not require `software`; `with`
  counts only in a composition holding `software`, never adds a pack, a `software` outside its
  range is an error, it names no pack of `requires`; isolation (nothing always composed references
  the entry's workflows or directives; `software`'s parameters, types, workflows and directives are
  used only inside the entry; the parameter scope of §8.1 per part); fragments never conditional;
  one owner and slots on the composition with `software`; a methodology ships `delivery` in the
  entry when it does not require `software`, in `contents` when it does;
- §6.4: the two parts' inventories together match the files present, each file listed once;
- §5, §12: `formats` counts the kinds of both parts;
- §7.1: `with` counts as a requirement for the rule against requiring a later pack;
- §7.7, §17 steps 1, 3 and 5: the entry's files are copied, and its workflows included after the
  pack's own, only with `software`;
- §8.1: a conditional part's files may also use the parameters of `software` and of the packs it
  requires;
- §9, §18: the slot rule reads both parts;
- §11: a catalog version entry copies `conditional` with its `with` only;
- §15 and `pack-compatibility`: a pack with a conditional part is validated with and without
  `software` (R2: `validate` derives the other leg; without a methodology the leg with `software`
  is skipped with a report line; the lint's compositions likewise; R4: the directive's sentence).

What exists, at `main` `6e35a92` (task-031 done):
- the schemas accept `conditional` (pack and catalog version entry) and F-031 reports it; the
  lint and the resolver refuse it (`foundationProblems` in `src/pack-rules.ts`, rule
  `conditional`, plan-039 R1); `PackManifest.conditional` is typed in `src/resolve.ts`;
- `listedFiles(contents)` (`src/pack-rules.ts`) is the inventory, read by `inventoryProblems`,
  `formatKindsProblems`, `readPackFiles` (`src/pack-files.ts`) and `readFiles`
  (`src/compose-documents.ts`); `workflowsYaml` (`src/output.ts`) reads `contents.workflows`;
- `workflowProblems` (`src/workflow-rules.ts`) judges a pack's files against what the pack and its
  direct requires declare (`declared`), and lets any slot name be included; `slotProblems` reads
  `contents.workflows`;
- the parameter scope is per pack (`scopeOf` in `src/pack-files.ts`, `parameterScopes` in
  `src/parameters.ts`);
- `src/publish.ts` writes a version entry from `pack.yaml` (`formats`, `requires_capabilities`,
  `requires`, `conflicts`); `src/tag-rules.ts` compares those fields with the tag's `pack.yaml`;
- `npm run validate` (`src/validate.ts`) composes each preset, example and entries once (twice
  for determinism) and runs the matrix; `src/evidence.ts` reads `matrix <label> wingfoil@<v>` and
  `composition <label>: composed twice` lines, labels without spaces;
- `src/overlay-rules.ts` composes the lint's combinations (task-031);
- `.wingfoil/directives/custom/pack-compatibility.md` has no sentence on `software` (R4).

Not in scope: the index and the READMEs' marking of a conditional part (task-033, R3); the
`memory.yaml` keys (task-034); `schema/` (no change: R1), `catalog.yaml`, `compat.yaml`.

## Acceptance

Run from a clean clone of `task/task-032-conditional`, on Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, `npm run validate`
   and `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exit 0;
   `npx wingfoil workflow list` exits 0 (R4 edits a directive); no dependency is added.
2. **The refusal of R1 is gone:** a pack with a valid conditional part passes the lint and composes.
3. **Rules**, each reported by `npm run check:packs` and refused by the composer (spec-001 §17),
   with a test each: a pack that requires `software` and carries `conditional`; `with` outside the
   range of the `software` composed; a file listed in both parts, or in neither; an always-composed
   workflow that includes, or a roles fragment that assigns, a workflow or directive of the entry;
   an always-composed file that uses `software`'s type, workflow, directive or parameter (the
   existing rules, kept); a methodology that does not require `software` and ships `delivery` in
   `contents`, or that requires it and ships `delivery` in the entry; `formats` missing a kind
   only the entry ships. The entry's files may use `software`'s content and parameters, tested.
4. **Composition** (tests in `tests/compose-documents.test.ts`, `tests/output.test.ts`): with
   `software`, the entry's workflows and directives are copied and its workflows included after
   the pack's own, each in its written order; without it, neither; a slot of the entry replaces
   nothing it should not (one owner, §7.6, checked with `software`).
5. **The golden tree** gains a methodology with a conditional part (`methodology/flow`, requiring
   `base` only, `delivery` in its entry), with a README, CHANGELOG and examples; a composition of
   `base` and it, without `software`, is checked byte for byte against
   `tests/fixtures/compose/expected-flow/`; the expected output with `software` is checked too.
6. **Both legs (R2)**, tests in `tests/validate.test.ts` and `tests/check-packs.test.ts`:
   - `validate` composes, for each preset, example or entries holding a pack with a conditional
     part, the other leg: with `software` added (`<label>[+software]`), or without it when it is
     present and no pack requires it unconditionally (`<label>[-software]`); each leg composed
     twice and run through the matrix; without a methodology, `matrix <label>[+software]: skipped,
     no methodology`;
   - `validate:publication` does the same;
   - `writeEvidence` lists the legs' compositions and releases and counts no skip line as a run;
   - the lint composes a pack with a conditional part with and without `software`, the leg with
     `software` taking the first methodology the pack does not conflict with when the pack is not
     a methodology.
7. **Publication:** `publish:pack` writes `conditional` (its `with` only) in the version entry of a
   pack that carries one, and nothing for one that does not; the tag rules compare it with the
   tag's `pack.yaml`; tested in a fixture repository.
8. **`pack-compatibility`** (R4) says that a pack with a conditional part is validated in
   compositions with and without `software`, the leg with `software` from a documented combination
   that holds a methodology; one commit of its own on the branch; `workflow list` exits 0.
9. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `src/`,
   `tests/`, `pack-compatibility.md` and this element; `schema/`, `catalog.yaml`, `compat.yaml`
   and `index/` unchanged.
10. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
    `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
