---
id: task-090-the-first-presets-classic-scrum-and-classic-kanban-and-the-validation-s-stand-in-values-for-a-preset-s-required-parameters-plan-070-task-a
type: task
title: "The first presets, Classic Scrum and Classic Kanban, and the validation's stand-in values for a preset's required parameters (plan-070 task A)"
status: in-review
pack: ""            # tooling task (tooling-delivery v4), plan-070 task (A)
depends_on: []
tags: ["tooling","presets"]
---

## Context

plan-070's only task (points 1 … 6, the approver's OK of 2026-11-12): W10's first presets (F2.6),
Classic Scrum and Classic Kanban, and the stand-in values that let the validation compose a
preset with no project value (the approver's option (A)).

What exists (`main` at plan-070's `submit`):
- **Presets:** spec-001 §15 and §18, `schema/preset.schema.json`, the lint's `preset-name`,
  `preset-cardinality` and `preset-value` rules and the index check of `catalog.yaml`'s
  `presets[]` (`src/tree-rules.ts`); no `presets/` folder; `catalog.yaml` has `presets: []`.
- **The gap:** `base` declares `project_name`, `approver_name`, `approver_email` and
  `agent_name` with no default (`packs/base/pack.yaml`); a composition fails without a value
  (spec-001 §8.1), and a preset may not set a project value (§15). `presetComposition`
  (`src/validate.ts`) reads only the preset's own `parameters`, so a preset of `software` and a
  methodology fails with `parameter project_name of base is required and has no value`.
- **One code path:** `npm run validate`, `validate:publication` (`src/validate-publication-cli.ts`)
  and `publish:pack` (`src/publish.ts`) all compose through `runValidate`.
- **`--param`:** refused when it names a value the preset sets (`--param <name> overrides the value
  the preset sets`); CI's golden run passes `--param project_name=Golden` to a fixture preset
  that leaves it unset.
- **Legs:** a `[-pack]` or `[+pack]` leg derived from a composition takes the preset's values
  filtered by what the leg declares (plan-039 R5); plan-066 ruling 4 skips a leg when a pack it
  adds has a required parameter with no value.
- **Index:** `npm run index` writes `CATALOG.md`, `catalog-index.json`, `llms.txt` and the
  generated sections of the packs' READMEs; a pack's `profiles` come from the presets that name
  it; `npm run validate` runs `index --check`.
- **Tests pinned to the repository:** `tests/validate-2-run.test.ts` (the schemas', the lint's and
  the compositions' counts, the overlays' and the publication's runs); `tests/catalog.test.ts`
  compares the fixture catalog with `catalog.yaml` after `unpublished()`, which empties its
  `packs`, `transitions` and `presets` blocks, so the presets leave it unchanged.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018 R1), in plan-070 point 5's order: the tests of Acceptance 4 first, then
   those of Acceptance 2, committed before the code and the content, so that the build passes and
   they fail by assertion; each failing run recorded with its command and count.
2. **Stand-ins** (plan-070 point 2), in one module of `src/` that `runValidate` uses:
   - a fixed stand-in value for each required parameter with no default that the composition of a
     preset (`presets/*.yaml`) declares, the preset does not set and no `--param` gives;
     fictional, generic, valid for the parameter's type (§8.1), modelled on the examples' values
     (an email on the `.example` domain), the same for every preset, never written to the preset
     or to a pack (read in the diff); the design lists them, and a required parameter with no
     stand-in still fails as today;
   - ranked last: a preset's own value and a `--param` each win over a stand-in; a stand-in is
     never counted as a value the preset sets, so the `--param` refusal and CI's golden run behave
     as today, and a leg's `dropped` list (plan-039 R5) names no stand-in;
   - a leg derived from a preset inherits its stand-ins for the parameters of the packs it holds;
     a leg whose added pack has a required parameter with no value is still skipped (plan-066
     ruling 4);
   - an example, an overlay composition and `entries` get none; `npm run compose` with no value
     still fails;
   - tests: a fixture preset with no values composes through `runValidate` in both modes and
     through one `publish:pack` case; the stand-ins appear in the composed `dna.yaml`; a preset's
     value and a `--param` each win; an example and an overlay composition get none; on a fixture
     preset written by the test (as `tests/validate-6-legs.test.ts` does) holding a pack with a
     conditional part, a `[-pack]` leg composes with the stand-ins
     and a `[+pack]` leg whose added pack has an unset parameter is skipped; `compose` alone
     fails.
3. **The presets** (points 1, 3): `presets/classic-scrum.yaml` (`format: 1`, `id: classic-scrum`,
   `title: "Classic Scrum"`, `packs: [software@^1, methodology/scrum@^1]`, `parameters: {}`,
   `profile: "Team developer"`) and `presets/classic-kanban.yaml` (`id: classic-kanban`, `title:
   "Classic Kanban"`, `packs: [software@^1, methodology/kanban@^1]`, `parameters: {}`, `profile:
   "Solo developer"`), each `description` one sentence naming its packs; `catalog.yaml`'s
   `presets[]` with both, `{ id, path }`, sorted by id, no pack's entry edited; no file under
   `packs/` changed and no `pack-release` (plan-070 point 6).
4. **The pinned tests** (point 5): `tests/validate-2-run.test.ts`'s counts and runs raised by the
   two presets' compositions, each new number explained in the notes by the compositions it
   counts; `tests/catalog.test.ts` unchanged and passing (its `unpublished()` empties `presets`).
5. **The generated files** (point 4): regenerated by `npm run index` in the content's commit, the
   presets listed; `software` lists both profiles, `methodology/scrum` Team developer,
   `methodology/kanban` Solo developer, `base` none; `npm run index -- --check` exit 0.
6. **spec-001 amended in place** (point 2): §15 gains the rule (a preset needs no value for a
   required parameter; the validation supplies a stand-in, the adopter gives the real value at
   `init`) and §18 names the validation that supplies it; an Execution Note lists the change. No
   schema changes, so no feedback note (`wingfoil-cli` rule 8).
7. **Checks on the frozen commit** (dl-039): the branch CI green, every job's duration in the
   notes (dl-039 R3, G12); dl-039's local list on Node 22.21.0 from a clean worktree; `npm run
   validate` composing both presets on 0.3.0 and 0.3.2, exit 0 and no warning, their lines in
   the notes.

## Design

- **The module** `src/preset-stand-ins.ts` (Acceptance 2): `STAND_INS`, the fixed values by
  parameter name, and `withStandIns(params, packs)`, which returns `params` with a stand-in added
  for each parameter a resolved pack declares with no default, absent from `params` and named in
  `STAND_INS`; any other required parameter is left unset, so the composer still fails on it
  (`src/parameters.ts`). The values, for `base`'s four (the only required parameters with no
  default in the published packs):
  - `project_name: "Preset Check"`;
  - `approver_name: "Preset Approver"`;
  - `approver_email: "approver@preset-check.example"`;
  - `agent_name: "Preset Agent"`.
  Each a `string`, with no `{{`, no `<`, `>` or line break; WingFoil 0.3.0 and 0.3.2 check no
  member's email format.
- **`src/validate.ts`:** `Composition` gains `standIns?: boolean`, set only by the loop over
  `presets/*.yaml` (not by the examples', the overlay's or `entries`' loops). `runOne` applies
  `withStandIns` to `params` after the preset's values and `--param` are in, when the
  composition's `standIns` is true; `composition.preset` is untouched, so the `--param` refusal,
  the dropped list (plan-039 R5) and the leg's filtered values read the preset alone. The leg's
  call of `runOne` passes `standIns: composition.standIns`; ruling 4's `unset` check is
  unchanged (it reads the preset's values and `--param`, and a stand-in name is `base`'s, never
  an added pack's: one pack declares each name, spec-001 §8.1).
- **The red steps** (Acceptance 1), each committed and seen failing before what makes it pass:
  1. the pinned counts (Acceptance 4): `tests/validate-2-run.test.ts`'s numbers raised by the
     two presets, failing on the current tree;
  2. the stand-ins (Acceptance 2): a new `tests/validate-10-presets.test.ts` (the next number of
     the split, so the shards stay alternated) with, on a tree written by the test: a preset with
     no values composing (exit 0) in branch and in publication mode, `dna.yaml` holding the four
     stand-ins; a preset value and a `--param` each winning; an example with no values still
     failing; a `[-pack]` leg of a preset composing with the stand-ins and a `[+pack]` leg with
     an unset parameter skipped; `npm run compose` with no value failing; and in
     `tests/publish.test.ts` one case publishing a pack whose only composition is a preset with
     no values.
- **The content** (Acceptance 3, 5), after the code: the two presets, `catalog.yaml`'s
  `presets[]`, `npm run index`; then `tests/catalog.test.ts` run unchanged.
- **spec-001** (Acceptance 6): §15, a bullet after `parameters`: "A preset need not set a required
  parameter: the validation (`npm run validate`, `validate:publication`, `publish:pack`) composes
  it with a fixed stand-in value for each required parameter with no default that neither the
  preset nor `--param` sets (task-090), and the adopter gives the real value at `init`. A
  stand-in is never written to the preset or to a pack"; §18, under **Presets**, a line naming
  the stand-ins as the validation's, not the composer's (§17 unchanged); an Execution Note.

## Execution Notes

- 2026-11-12: body review: approve after amendments, one blocking, applied: `tests/catalog.test.ts`
  empties `presets` before its comparison, so it stays unchanged; a departure from plan-070
  point 5, which named it among the pinned tests (a misreading), for the approver at `backlog`.
  With the nits: the fixture preset with a conditional part written by the test; the stand-ins
  never written to a preset or a pack, a leg's `dropped` list without them, a parameter with no
  stand-in failing as today; the presets listed in the generated files; no file under `packs/`
  and no `pack-release`; the red steps in point 5's order.
- 2026-11-12, design: written (`75247105`); `base`'s four parameters are the published packs'
  only required ones with no default (`packs/*/pack.yaml` read), so `STAND_INS` names them alone.
- 2026-11-12, red 1 (Acceptance 4, `5b210ecc`): `tests/validate-2-run.test.ts` raised to schemas 8
  files (6 + the two presets), lint 76 files (74 + 2), compositions 11 (9 examples + 2 presets) and
  22 runs (each composition on 0.3.0 and 0.3.2), the three overlays 15 compositions and 30 runs (13
  + the tree's 2 presets), the publication 22 runs; `node --test --test-name-pattern="validates this
  repository|governed repositories|passes a publication run of this repository"
  dist/tests/validate-2-run.test.js`: 5 tests, 0 pass, 5 fail, by assertion.
- 2026-11-12, red 2 (Acceptance 2, `0d6fcc35`): `tests/validate-10-presets.test.ts`, on the
  fixture tree (whose `base` requires `project_name`) with three presets written by the test, run
  with no `--param`, with it, and in publication mode, the composed `dna.yaml` read through the
  determinism check's `compare`: 5 tests, 3 pass, 2 fail; the two failing ("composes a preset
  that sets no required parameter", "gives a preset's leg its stand-ins") on `parameter
  project_name of base is required and has no value`. Already green on `main`, as guards: a
  preset's value and `--param` winning, an example with no value failing, `compose` failing.
  The fixture's `stage/keyed` renamed `stage/locked` (a name `blueprint/keyed` holds, dl-004) and
  set at format 2 (a `with` other than `software` needs it).
- 2026-11-12, red 3 (Acceptance 2, `a8288862`): the `publish:pack` case first held `software`
  and `methodology/kanban` with no examples, which the README rule refuses (spec-002 §2.4: a tree
  with a methodology gives examples); rewritten on a `base`-only preset, with `base` requiring
  `project_name`; red without the code (the module removed and `src/validate.ts` stashed, built):
  1 test, 0 pass, on `composition presets/bare.yaml: parameter project_name of base is required
  and has no value`.
- 2026-11-12, green: `src/preset-stand-ins.ts` and `src/validate.ts` (`e1e83647`); the three
  test files pass. The presets, `catalog.yaml` and the index (`3d56a8d0`): `npm run index` wrote
  `CATALOG.md` and `catalog-index.json`, 5 files unchanged (`llms.txt` and the READMEs'
  generated sections name no preset or profile); `profiles`: `software` both, `methodology/kanban`
  Solo developer, `methodology/scrum` Team developer, `base` none. spec-001 §15 and §18
  (`648436b4`). `npm run validate` on the repository: exit 0, `compositions: 11`, `matrix:
  self-test, 22 runs, 0 failed, tolerance applied: none`; `presets/classic-kanban.yaml` 36
  files and `presets/classic-scrum.yaml` 37, byte-identical, `workflow list`, `dna show` and
  `directives list` passing on 0.3.0 and 0.3.2.
- 2026-11-12, `npm test` after the content: 1305 tests, 1304 pass, 1 fail:
  `tests/check-packs.test.ts` pins this repository's lint count too (`lint: checked 74 files`), a
  pinned test neither plan-070 nor the body review named; it failed red by assertion on the
  content's commit (`76` against `74`), the same two preset files as Acceptance 4's lint count, and
  is raised to 76 with its name in the same commit as these notes (a departure from Acceptance 1's
  order, recorded). Rerun: the file's 127 tests pass. `npm run lint`: 0 problems.
- 2026-11-12, build review: approve after amendments, two blocking, applied: spec-001 §15 and §18
  narrowed to `base`'s four parameters, any other required parameter still needing a value, as
  the code does; an overlay's composition with no values shown failing (Acceptance 2's claim had
  no test). With the nits: the `--param` refusal and a leg's `dropped` list without a stand-in
  asserted; `STAND_INS` imported by the test (the fixture's `base` requires `project_name` alone,
  so its stand-in is the one read); the presets' descriptions under 100 characters ("Kanban on the
  software layer: a continuous flow of tasks under WIP limits.", "Scrum on the software layer:
  Sprints with planning, review and retrospective."), the index regenerated (1 file). Rerun:
  `tests/validate-10-presets.test.ts` 6 tests pass; `npm run check:packs` 76 files, 0 problems.
  The spec change narrows the rule to what the code does: no re-review of the code.
- 2026-11-12, checks on the frozen `0a477364` (Acceptance 7, dl-039): the branch CI, run
  43255467176, `success`: `validate (22.12.0, 1)` 11 min 25 s, `(22.12.0, 2)` 6 min 59 s,
  `(22.21.0, 1)` 11 min 7 s, `(22.21.0, 2)` 6 min 1 s, every job under 20 minutes (G12). The
  local list from a clean worktree on Node 22.21.0, after `npm ci` and `npm run build`:
  `npm run validate:publication` exit 0 (`compositions: 11`, `matrix: publication, 22 runs, 0
  failed`, `presets/classic-kanban.yaml` 36 files and `presets/classic-scrum.yaml` 37,
  byte-identical, `workflow list`, `dna show` and `directives list` passing on 0.3.0 and 0.3.2);
  the golden tree in publication mode exit 0 (26 runs, 0 failed); `npm run -s wingfoil --
  workflow list` exit 0. The privacy check of the branch's diff found no local or scratch path,
  no private project and no session.
