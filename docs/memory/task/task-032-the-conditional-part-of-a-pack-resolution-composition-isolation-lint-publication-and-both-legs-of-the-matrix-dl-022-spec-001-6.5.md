---
id: task-032-the-conditional-part-of-a-pack-resolution-composition-isolation-lint-publication-and-both-legs-of-the-matrix-dl-022-spec-001-6.5
type: task
title: "The conditional part of a pack: resolution, composition, isolation lint, publication and both legs of the matrix (dl-022, spec-001 §6.5)"
status: pending
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
  is skipped with a report line; the lint's compositions likewise; R4: the directive's sentence);
- plan-039 R5–R7 (the approver, 2026-10-15): the `[-software]` leg drops a preset's values for
  absent packs and names them; publication fails without a leg with `software` that ran; an empty
  conditional part is refused.

What exists, at `main` `6e35a92` (task-031 done):
- the schemas accept `conditional` (pack and catalog version entry) and F-031 reports it; the
  lint and the resolver refuse it (`foundationProblems` in `src/pack-rules.ts`, rule
  `conditional`, plan-039 R1); `PackManifest.conditional` is typed in `src/resolve.ts`;
- `listedFiles(contents)` (`src/pack-rules.ts`) is the inventory, read by `inventoryProblems`,
  `formatKindsProblems`, `readPackFiles` (`src/pack-files.ts`) and `readFiles`
  (`src/compose-documents.ts`); `workflowsYaml` (`src/output.ts`) reads `contents.workflows`;
- `workflowProblems` (`src/workflow-rules.ts`) judges a pack's files against what the pack and its
  direct requires declare (`declared`), and lets any slot name be included (line 112), so an
  always-composed workflow of a pack that does not require `software` can include a slot today;
  `slotProblems` reads `contents.workflows`; `checkRoleDirectives` (`src/compose-documents.ts`)
  accepts the directives of `contents.directives` only;
- the parameter scope is per pack (`scopeOf` in `src/pack-files.ts`, `parameterScopes` in
  `src/parameters.ts`);
- `src/publish.ts` writes a version entry from `pack.yaml` (`formats`, `requires_capabilities`,
  `requires`, `conflicts`); `src/tag-rules.ts` compares those fields with the tag's `pack.yaml`;
- `npm run validate` (`src/validate.ts`) composes each preset, example and entries once (twice
  for determinism) and runs the matrix; `validate:publication` shares `runValidate`; a skipped
  composition already reports `matrix <label>: skipped`; `src/evidence.ts` reads
  `matrix <label> wingfoil@<v>` and `composition <label>: composed twice` lines, matching a label
  with `\S+`, so a leg's label carries no space: `<label>[+software]`, R2's "for example" form
  adapted;
- `src/overlay-rules.ts` composes the lint's combinations (task-031); its `first` methodology is
  the first in byte order, so a `methodology/flow` in the golden tree becomes `first`;
- `readme-generate.ts` and `index-model.ts` read `contents.workflows` only, so a pack's generated
  README and index entry leave out its conditional workflows until task-033 (an interim, recorded
  as task-031's `Axis: software` was).
- `.wingfoil/directives/custom/pack-compatibility.md` has no sentence on `software` (R4).

"Requires `software`" means, as in §11 and §15's "unconditionally", through `requires`, directly
or transitively (`reachable`). §7.1's rule reads `with` as a requirement; in format 1 it cannot
fail, since `software` is always composed second.

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
   workflow that includes, or a fragment (dna, roles, memory) that names, a workflow or directive
   of the entry; an always-composed workflow of a pack that does not require `software` that
   includes a slot, `delivery` among them (a new rule: today slots pass as includes); an
   always-composed file that uses `software`'s type, workflow, directive or parameter (the
   existing rules, kept, as characterizations); a methodology that does not require `software`
   and ships `delivery` in `contents`, or that requires it and ships `delivery` in the entry; an
   entry that ships a slot it does not fill, `sw-life-cycle`, `retrospective` or
   `governance-evolution`; an entry whose `contents` lists no workflow and no directive (R7);
   `formats` missing a kind only the entry ships, and no `formats`
   problem for a kind only the entry ships. The entry's files may use `software`'s content and
   parameters, in the lint and in the composer (`parameterScopes` per part), tested.
4. **Composition** (tests in `tests/compose-documents.test.ts`, `tests/output.test.ts`): with
   `software`, the entry's workflows and directives are copied and its workflows included after
   the pack's own, each in its written order; without it, neither; a slot of the entry replaces
   nothing it should not (one owner, §7.6, checked with `software`).
5. **The golden tree** gains a methodology with a conditional part (`methodology/flow`, requiring
   `base` only, `delivery` in its entry), with a README, a CHANGELOG and two examples:
   `flow/core-team` (`base` and `flow`, no `software`) and `flow/delivery-team` (with `software`),
   each with its derived other leg. Their compositions are checked byte for byte against
   `tests/fixtures/compose/expected-flow/` and `expected-flow-software/`. The golden tree's
   generated files (`CATALOG.md`, `catalog-index.json`, `llms.txt`, the READMEs) follow; `flow`
   becomes the tree's first methodology in byte order, and the compositions that used kanban as
   `first` are re-checked. The count changes (`validate`, `check-packs`, `example-rules`) are listed
   in the Execution Notes.
6. **Both legs (R2)**, tests in `tests/validate.test.ts` and `tests/check-packs.test.ts`:
   - `validate` composes, for each preset, example or entries holding a pack with a conditional
     part, the other leg: with `software` added (`<label>[+software]`), or without it when it is
     present and no pack requires it unconditionally (`<label>[-software]`); each leg composed
     twice and run through the matrix; without a methodology, `matrix <label>[+software]: skipped,
     no methodology`; the `[-software]` leg drops a preset's values for parameters of packs absent
     from it, and its composition line names them (R5);
   - in publication mode, `validate` fails when a pack with a conditional part, among the packs of
     the compositions it validates, has no composition with `software` that ran (R6), naming it;
   - `validate:publication` does the same (it shares `runValidate`: a characterization);
   - `writeEvidence` lists the legs' compositions and releases and counts no skip line as a run (a
     characterization of the existing regexes, with the `[+software]` label);
   - the lint: every combination of its compositions (methodology × team-mode × stage, and a lone
     pack) that holds a pack with a conditional part also gets its other leg; the leg with
     `software` of a pack that is not a methodology takes the first methodology it does not
     conflict with.
7. **Publication:** `publish:pack` writes `conditional` (its `with` only) in the version entry of a
   pack that carries one, and nothing for one that does not; the tag rules compare the entry's
   `with` values with the tag's `pack.yaml`, two absent fields comparing equal; tested in a fixture
   repository.
8. **`pack-compatibility`** (R4) says that a pack with a conditional part is validated in
   compositions with and without `software`, the leg with `software` from a documented combination
   that holds a methodology; one commit of its own on the branch; `workflow list` exits 0.
9. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `src/`,
   `tests/`, `pack-compatibility.md` and this element; `schema/`, the root `catalog.yaml`,
   `compat.yaml` and `index/` unchanged.
10. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
    `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-15: written under plan-039; independent review of the body: approve after amendments
  (the slot hole of `workflowProblems`; isolation of fragments; `formats` both ways; the per-part
  scope in the composer; the golden `flow` and its fixtures named; the lint's legs; the label
  format; "requires" transitive; §7.1 vacuous in format 1). Three findings needed the approver:
  ruled on 2026-10-15 as plan-039 R5–R7; amended. Re-review: approve; its minor findings (R6's
  scope, plan-039's references to R5–R7) amended without changing a rule. Size: the Design lists
  the red steps (rules, resolver, composer and the golden `flow`; the legs in `validate` and the
  lint, and evidence; publication and the tag rules; the directive as a documentation exception,
  dl-018 R2), or proposes a split (032a, 032b) through plan-039.
