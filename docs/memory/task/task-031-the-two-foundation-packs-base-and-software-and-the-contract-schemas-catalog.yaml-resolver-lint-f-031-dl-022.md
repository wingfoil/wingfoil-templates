---
id: task-031-the-two-foundation-packs-base-and-software-and-the-contract-schemas-catalog.yaml-resolver-lint-f-031-dl-022
type: task
title: "The two foundation packs base and software, and the contract: schemas, catalog.yaml, resolver, lint, F-031 (dl-022)"
status: in-progress
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
  `compose-documents.ts`; `tree-rules.ts` (`presetChecks` adds it to every preset);
  `overlay-rules.ts` (it composes every methodology × team-mode × stage, and every other pack once
  as `base` + the first methodology + the pack; nothing when the tree has no methodology);
  `workflow-rules.ts` (`lifeCycleProblems`: its `sw-life-cycle` includes the slots); `pack-rules.ts`
  (`BASE_ONLY_WORKFLOWS = ['sw-life-cycle', 'retrospective']`, rule `base-only`; `slotProblems` lets
  a slot's `default` pack ship it).
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

On `task/task-031-foundation`, through `tooling-delivery` v2 as `developer` (`code-quality`,
`testing`, `determinism`). Three red steps (dl-018 R3), each a test commit run red and counted,
then the code commit that makes it green; one task, no split: each step's tests can be written
before its code.

**Step 1: the contract and the composition with two foundation packs.** The catalog's schema
change forces the fixture split and the resolver in one green commit (ruling 1), so their tests
come together.
- Tests, red:
  - the schema samples of Acceptance 2, under `tests/fixtures/schema/{pack,catalog,preset}/`;
  - `tests/catalog.test.ts`: the foundation list, the `methodology` axis's `required_with`;
  - `tests/resolve.test.ts` and `tests/fixtures/resolve/`: Acceptance 4; the presets of
    Acceptance 5 in `tests/check-packs.test.ts` (the cardinalities judged on the resolved
    composition, with `required_with`; a preset naming `software`), which read the same
    `axesMessages`;
  - the golden split of Acceptance 6: the tree's `base` and `software`, kanban and the phase pack
    requiring `software@^1`, the tree's `catalog.yaml`, `software`'s README, CHANGELOG and
    example, `base/core-only`; `tests/fixtures/compose/expected` edited by hand where the split
    changes it (`workflows.yaml`'s include order, the AGENTS region, the order of `memory.yaml`'s
    types and of the copied files) and `tests/fixtures/compose/expected-base/` written by hand;
  - the ownership rules of §9 (Acceptance 5's `sw-life-cycle`, slot defaults, `retrospective`,
    `governance-evolution`), which the split needs at once;
  - `tests/support/pack-tree.ts`: a `SOFTWARE` spec and `FOUNDATION = [BASE, SOFTWARE]`; `BASE`
    without `sw-life-cycle`; `KANBAN` and a phase pack's default `requires` with `software@^1`;
    `tests/support/index-catalog.ts` likewise. The existing tests are adapted to the split in the
    same commit, each adaptation (a composition gaining `SOFTWARE`, a count) listed in the notes.
- Code, green: `schema/pack`, `catalog`, `preset`; `catalog.yaml`, spec-001 §11's example and
  bullet, the tree's `catalog.yaml` (one commit); `src/catalog.ts` (`foundation: string[]`, the
  core and the software layer, `AxisSpec.requiredWith`); `resolve.ts` (the queue from the core,
  `software` only as asked or required, the order, `required_with`, both foundation packs exempt
  from the axis check); `pack-rules.ts` (the reserved names split by owner, a slot's default read
  as the software layer); `workflow-rules.ts` (the software layer's `sw-life-cycle`);
  `compose-documents.ts`, `memory-merge.ts`, `output.ts`, `tree-rules.ts` reading the core;
  `npm run index` over the golden tree and `REFRESH_INDEX_EXPECTED=1` for
  `tests/fixtures/index/expected`, each reviewed by diff (Acceptance 9). Then F-031 (Acceptance
  10): `npm run feedback:note -- --schema --from task-031`, its body completed by hand, committed
  before the branch is pushed.

**Step 2: the §18 rules on the foundation.** Tests, red, in `tests/check-packs.test.ts` and
`tests/resolve.test.ts` (the composer refusing each, §17): `software` requiring a pack other than
`base`; a phase pack not requiring `software`; `software` defining `defaults`; `software`'s
section at level 1; a pack carrying `conditional` (R1). Code, green:
`pack-rules.ts` (`manifestProblems`), `memory-merge.ts`, `output.ts`, `tree-rules.ts`, and the
`conditional` refusal in the lint and the resolver. The rule on using `software` without requiring
it is existing behaviour: its four tests (type, include, directive, parameter) are
characterizations (dl-018 R2), each checked by a mutation that switches off the rule it relies on.

**Step 3: the lint's compositions.** Tests, red, in `tests/check-packs.test.ts` (Acceptance 7):
`base` alone refused (a broken core fragment); an overlay pair with no methodology refused; a pack
that does not reach `software` composed as `base` + the pack; `software` composed with the first
methodology; no composition of a pack needing `software` when the tree has no methodology. Code,
green: `overlay-rules.ts`.

Then: the grep of Acceptance 8; the checks of Acceptance 1 from a clean clone on both Node.js
versions; the independent review; the push, F-031 included (no pushed commit fails
`schema-note`), and the CI run. The Execution Notes list each red run (command, failing count),
the commits, the adapted tests, and the interim `Axis: software`.

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
- 2026-10-15, design written and committed on `main` (`ab97185`); task started
  (backlog → in-progress); branch `task/task-031-foundation` from `e39ae90`.
- 2026-10-15, **step 1**, red on `09aadea` (the tests, the golden split, the helpers and the
  existing tests adapted): `npx tsc -p tsconfig.json` 7 errors (exit 2), then
  `node --test "dist/tests/**/*.test.js"`: 837 tests, 501 pass, 291 fail, 45 cancelled. Green in
  `ff17b18` (schemas, `catalog.yaml` and §11's example and bullet in one commit, the code, the
  regenerated fixtures), then F-031 in `17ee0ce`; `ff17b18` alone fails `schema-note`, a local
  commit pushed only with `17ee0ce`. A fixture error of mine found after the red, before the code
  passed: the resolve fixture's `software` README linked `#pack-base` (corrected in `ff17b18`).
- 2026-10-15, **step 2**, red on `81c87ef`: `node --test dist/tests/check-packs.test.js
  dist/tests/resolve.test.js`: 132 tests, 10 fail. Three of them were wrong tests, corrected
  before the code in `d163577` (software's `adr` template missing; `base` defined `defaults`
  already, so software's were a tightening; a `pack.yaml` failing its schema is not loaded, so the
  lint's compositions report it too): 4 fail. Green in `9b54526`. The four tests of a pack using
  `software`'s content without requiring it are characterizations (dl-018 R2): renaming each rule
  id in `dist/` (`memory-type`, `include`, `directive`, `parameter-scope`) makes its test fail, 4
  of 4.
- 2026-10-15, **step 3**, red on `1a0ea8c`: the F3.5 overlays suite, 8 tests, 4 fail (the case
  "nothing needing software without a methodology" is a characterization: it passed). Green in
  `febe15e`, where one expectation was corrected: `software` is reached through the methodology
  that requires it, so it is not composed alone.
- **Adapted tests** (only as the split requires): `[BASE, KANBAN…]` trees gain `software`
  (`FOUNDATION`, `FOUNDATION_COMPOSABLE`, `SOFTWARE_COMPOSABLE` in `tests/support/pack-tree.ts`);
  `KANBAN` and a phase pack's default `requires` name `software@^1`; expected id lists gain
  `software`; the reserved-workflow tests split by owner (`base-only`, `software-only`); the index
  fixtures' kanban 1.1.0 requires `software@^1`; publication's `bump` moves `software`'s and
  kanban's `requires` with `base`'s major; `readme-generate` (kanban's requires; `adr` now
  `software`'s, its line `` - `adr`: — `` until task-033); the feedback-note test asserts
  "Changed since F-031".
- **Counts the split changes** (`ff17b18`): `validate` (schemas checked 9 → 10, examples 6 → 8,
  compositions 7 → 9 and 8 → 10, runs 7 → 9, failing-preset compositions 6 → 8, lint 54 → 61,
  index checked 9 → 10); `check-packs` and `example-rules` (16 → 20 files); `index` (unchanged
  7 → 8 and 9 → 10, checked 9 → 10). **Counts `9d291d9` changes** (base's `governance-evolution`):
  `validate` (lint 61 → 62, the golden preset's files 18 → 19).
- **Interim `Axis: software`:** the golden tree's `packs/software/README.md`, the resolve and merge
  fixtures' `software` READMEs and `tests/fixtures/index/expected/packs/software/README.md` read
  `Axis: software`, as `npm run index` generates it until task-033 (spec-002 §2.1).
- **Acceptance 8:** `git grep -nE "['\"\`](base|software)(['\"\`@/]|$)" -- src/` gives
  `src/index-model.ts:98` and `src/readme-generate.ts:92` only (task-033); `e4437e0` rewords a
  comment of `src/catalog.ts` that matched.
- **Acceptance 3, a deviation raised (dl-019):** the golden tree's
  `tests/fixtures/compose/tree/catalog.yaml` changed in the red commit `09aadea`, with the other
  test fixtures, not in `ff17b18` with `schema/catalog.schema.json`, `catalog.yaml` and §11's
  example, which are together as plan-038 ruling 1 asks. It was not moved, so that the red run
  stays on the commit it was counted on. For the approver's ruling.
- 2026-10-15, **build review** (independent subagent): approve after amendments, nothing
  blocking. Major: the lint's leg composing a pack that needs `software` with the first
  methodology had no test (a test added; mutating `else if (first !== undefined)` makes it fail);
  these notes. Minor: Acceptance 3's deviation (above); a test the base-alone case duplicated
  (replaced by the new one); the F-031 and `adr` assertions made exact; a preset of two
  methodologies without `software`. Nit: `catalog.ts`'s comment; `conditional[].contents` of
  `{}` passes the schema, left to task-032. Fixed in `40a5493`.
- 2026-10-15, **found at the acceptance run** (WingFoil 0.2.2, `npm run validate -- --tree
  tests/fixtures/compose/tree`): the example `base/core-only` failed the matrix,
  `E_NO_MAIN_WORKFLOW … at least one included workflow must be kind: main (REQ-STATE-03)`: a
  composition of `base` alone needs a main workflow. dl-022 S4 makes `governance-evolution`
  (`kind: main`) `base`'s, so the golden `base` ships it (`9d291d9`); the expected outputs and
  counts follow. For W8: `base`'s charter must keep a `kind: main` workflow, or a composition
  without `software` does not load.
- 2026-10-15, **re-review** (dl-017 R2, after `40a5493`, `9d291d9` and the notes): approve after
  amendments; findings 1–9 of the build review resolved or raised; one minor, the counts above
  split by cause and the schemas count added. Fixed in these notes; no rule changed.
- 2026-10-15, **Acceptance** from clean clones at `58d5af0` (the later commits change these notes
  only), on Node.js 22.21.0 and 22.12.0: `npm ci`, `build`, `test`, `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `index -- --check`, `validate` exit 0, and `validate -- --tree
  tests/fixtures/compose/tree --param project_name=Golden` exits 0 against WingFoil 0.2.2 (9
  compositions, 9 runs, 0 failed, the self-test tolerance applied). No dependency added;
  `compat.yaml` and `index/` unchanged; no `schema/*.v<N>.schema.json`.
