---
id: task-032-the-conditional-part-of-a-pack-resolution-composition-isolation-lint-publication-and-both-legs-of-the-matrix-dl-022-spec-001-6.5
type: task
title: "The conditional part of a pack: resolution, composition, isolation lint, publication and both legs of the matrix (dl-022, spec-001 §6.5)"
status: approved
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

On `task/task-032-conditional`, through `tooling-delivery` v2 as `developer` (`code-quality`,
`testing`, `determinism`). Three red steps (dl-018 R3), each a test commit run red and counted,
then the code commit that makes it green, and the directive; one task, no split.

**Step 1: rules, resolution and composition.**
- Tests, red: in `tests/check-packs.test.ts` and `tests/resolve.test.ts`, Acceptance 2 and 3 (the
  R1 refusal gone; each rule, by the lint and by the composer; the entry's files using
  `software`'s content and parameters); in `tests/compose-documents.test.ts` and
  `tests/output.test.ts`, Acceptance 4 (with and without `software`, the include order, the
  per-part scope in `parameterScopes`); the golden `methodology/flow` of Acceptance 5, its README,
  CHANGELOG, two examples, and `expected-flow/` and `expected-flow-software/` written by hand
  before the code, checked in `tests/compose-cli.test.ts`. The existing rules on using
  `software`'s content stay characterizations, already mutation-checked by task-031.
- Code, green: a helper giving a pack's parts (`contents`, and the entry when the composition holds
  `software`); `inventoryProblems`, `formatKindsProblems`, `slotProblems` and the reserved names
  reading both parts; `foundationProblems` without the R1 refusal, with the new `conditional`
  rules (a pack requiring `software`; an empty entry, R7; the `delivery` placement); the resolver
  checking `with`; `readPackFiles` and `parameterScopes` per part; `workflowProblems` per part
  (isolation, and the slot hole closed for an always-composed workflow of a pack that does not
  require `software`); `readFiles` and `workflowsYaml` with the entry after the pack's own;
  `checkRoleDirectives` and the fragment checks against always-composed content. Then
  `npm run index` over the golden tree, the generated files reviewed by diff.

**Step 2: both legs.**
- Tests, red: in `tests/validate.test.ts`, Acceptance 6 (the derived leg and its label, the skip
  line without a methodology, R5's dropped values named, R6 in publication mode); in
  `tests/check-packs.test.ts`, the lint's legs and its choice of methodology; in
  `tests/evidence.test.ts`, the legs' lines (a characterization of the existing regexes, checked
  by mutation of `MATRIX_LINE`).
- Code, green: `src/validate.ts` (the legs, R5, R6), `src/overlay-rules.ts`.

**Step 3: publication.**
- Tests, red: in `tests/publish.test.ts` and `tests/tag-rules.test.ts`, Acceptance 7.
- Code, green: `src/publish.ts`, `src/tag-rules.ts`.

**The directive** (R4, Acceptance 8): one commit editing `pack-compatibility.md`, a documentation
change (dl-018 R2), checked by `workflow list`.

Then: the checks of Acceptance 1 from clean clones on both Node.js versions, against WingFoil 0.2.2
too; the independent review; the push and the CI run. The Execution Notes list each red run, the
commits, the adapted tests and counts, and the interim of the generated README and index.

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
- 2026-10-15, design written and committed on `main` (`35944f3`); task started
  (backlog → in-progress); branch `task/task-032-conditional` from `08c7032`.
- 2026-10-15, **step 1**, red on `9e38bff`: `node --test dist/tests/check-packs.test.js
  dist/tests/resolve.test.js dist/tests/output.test.js dist/tests/compose-cli.test.js`: 187 tests,
  17 fail (two cases already passed through the R1 refusal: the empty part and a pack requiring
  `software` with a part). Green in `1c3d040`, `npm run index` over the golden tree reviewed by
  diff.
- 2026-10-15, **step 2**, red on `4d8612f`: `check-packs`, `evidence`, `validate`: 132 tests, 8
  fail; the evidence test's expected release order was mine and wrong (the leg's line comes
  first), corrected in `291303f` before the code. Green in `7a4e6b1`. Characterizations (dl-018
  R2): `writeEvidence` with the legs' labels (mutating `MATRIX_LINE` to exclude `[` makes it fail);
  `validate:publication`, which shares `runValidate`, through the tests that call it with
  `mode: 'publication'`.
- 2026-10-15, **step 3**, red on `44917f4`: `publish`, `tag-rules`: 34 tests, 2 fail. Green in
  `bcd8a53`, where the publication test was corrected: it validated `software` alone (no
  methodology) and published `software`, which the index refuses until task-033.
- 2026-10-15, **the directive** (R4) in `aadb14d`, a documentation change (dl-018 R2);
  `npx wingfoil workflow list` exits 0.
- **Adapted tests** (only as the new rules and the new pack require): fixtures whose methodology
  lacked `software` now name it (`requires-self`, `requires-twice`, the preset with two
  methodologies, the order test's phase pack); cases that now also report `isolation`, since
  their always-composed workflow includes a slot without `software` (a methodology shipping
  `delivery` in `contents` without `software`; `sw-life-cycle` shipped by `base` or a blueprint):
  `failsWith` compares exact sets, so the tests tighten; the golden tree's `flow` README follows
  `npm run index`.
- **Counts** (`1c3d040`, the golden `flow` and its two examples): `validate` (schemas 10 → 11,
  lint 62 → 70, index 10 → 11, compositions 9 → 11, 10 → 12, 8 → 10, runs 9 → 11); `index`
  (unchanged 8 → 9 and 10 → 11, checked 10 → 11). (`7a4e6b1`, flow's two other legs):
  `validate` (compositions 11 → 13, 12 → 14, 10 → 12, runs 11 → 13, the matrix and orphan lists
  gain the legs).
- **Interims until task-033:** the generated README and index entry of a pack leave out its
  conditional workflows (`readme-generate.ts`, `index-model.ts` read `contents` only); `software`
  is published in no test (the index schema refuses it).
- **Readings:** "requires `software`" is read through `requires`, directly or transitively; for a
  phase pack the transitive reading changes nothing in format 1, since a phase pack can require
  no later pack that would bring `software` in. In format 1, the `dna` and `memory` fragments name
  no workflow or directive, so the roles fragment is the one whose assignments the isolation
  checks. A conditional part's empty `contents` is refused (R7).
- 2026-10-15, **build review** (independent subagent): request changes. Major: the composer let an
  always-composed workflow include a slot when the composition held no `software` (the lint
  refused it); the composer-side tests were thin. Fixed red first: the composer tests in
  `3940021` (62 tests, 3 fail; two of them were my test errors, a helper declaring a directive
  kind and a `formats` case that belongs to `planOutput`, corrected in `ebb4ad5`: 1 fail), the
  code in `00eafa5` (the software layer's id read from the catalog). Minor, fixed in `00eafa5`: a
  `[-software]` leg that cannot resolve is reported; the lint's choice of methodology checks
  conflicts both ways; `reached` required; one `reachableIds` helper for four walks over
  `requires`; a stale comment; R6's passing case asserted in the publication test. Re-review
  requested (dl-017 R2).
- 2026-10-15, **re-review** (dl-017 R2): approve; findings 1–11 fixed or recorded. Three minor
  findings: a test where only the methodology declares the conflict, added in the next commit
  (written after `00eafa5`, so checked by mutation: dropping `conflicting(methodology, pack)`
  makes it fail); the `[-software]` leg that cannot resolve is not reachable with the current
  rules (removing `software` from a composition that resolved only lowers what it requires, and a
  pack that requires `software` brings it back), so its failure line stays untested; `validate.ts`
  keeps a local `byBytes`, as every other module of `src/` does but `index-data.ts`.
- 2026-10-15, **Acceptance** from clean clones at `0b777de` (the later commits change these notes
  only), on Node.js 22.21.0 and 22.12.0: `npm ci`, `build`, `test`, `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `index -- --check`, `validate`, `validate -- --tree
  tests/fixtures/compose/tree --param project_name=Golden` (13 compositions, against WingFoil
  0.2.2) and `npx wingfoil workflow list` exit 0. No dependency added; `schema/`, the root
  `catalog.yaml`, `compat.yaml` and `index/` unchanged.
- 2026-10-15, **CI** (Acceptance 10): run 38795573963 on `b66f246`, conclusion `success`
  (`validate (22.12.0)` and `validate (22.21.0)` both `success`). Submitted `in-review`.
