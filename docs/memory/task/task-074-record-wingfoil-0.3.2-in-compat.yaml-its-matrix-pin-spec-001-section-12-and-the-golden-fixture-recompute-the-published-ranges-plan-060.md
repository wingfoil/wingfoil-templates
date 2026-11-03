---
id: task-074-record-wingfoil-0.3.2-in-compat.yaml-its-matrix-pin-spec-001-section-12-and-the-golden-fixture-recompute-the-published-ranges-plan-060
type: task
title: "Record WingFoil 0.3.2 in compat.yaml, its matrix pin, spec-001 section 12 and the golden fixture, recompute the published ranges (plan-060)"
status: in-progress
pack: ""            # tooling task (wingfoil-release-intake › record, plan-060 ruling 1)
depends_on: []
tags: ["tooling","wingfoil","compat"]
---

## Context

plan-060's task (ruling 1): the intake proper of WingFoil 0.3.2, as task-059 recorded 0.3.1. Unlike
plan-051, no task before it: `check:runs` already runs every release the matrix selects (task-058),
so this task commits 0.3.2's pin and records it together. With 0.3.2 listed, the matrix selects
0.3.0 and 0.3.2 (the oldest and the newest compatible release, `selectReleases`) for every
composition requiring `workflow-engine`, and 0.2.2 and 0.3.2 for the golden tree; the run counts do
not change. `tests/compat.test.ts` holds `compat.yaml` byte-equal to spec-001 §12's example and to
the golden fixture's (dl-010), so the real file, the spec, the fixture and the tests change
together; the six published versions gain 0.3.2 in their computed range (spec-001 §12; plan-060
ruling 2). What 0.3.2 provides, and the scratch run that found every composition passing on it,
is plan-060's Context (no format version named; no new capability; the inputs 0.3.2 now refuses
met by no pack).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named. The branch is cut from
`main` after this body's acceptance.

1. **The pin:** `src/matrix/wingfoil-0.3.2/package.json` pinning `wingfoil` to exactly `0.3.2`, its
   description naming this task, as `wingfoil-0.3.1/`'s does, and its lockfile from
   `npm install --package-lock-only --ignore-scripts` in that folder; `npm audit` in it reports 0
   vulnerabilities; `npm run check:pins` exits 0.
2. **`compat.yaml`:** release 0.3.2 after 0.3.1, with `format_key: true`, `reads` at format 1 for
   the seven kinds, `capabilities: [workflow-engine]` and `notes`: "Accepts the format: key; format
   1; no new capability: short element references are needed by no pack (plan-060 ruling 1, dl-021
   R4). Refuses a memory.yaml type path absolute or holding . or .., a malformed id_pattern, an
   extra dna.yaml paths category that is not a list of strings and a directive missing a header
   field: no pack ships one." Nothing else in the file changes; `FROZEN_COMPAT` stays its byte
   prefix. `format_key` and `reads` as verified by running 0.3.2 (Acceptance 6's check); a finding
   that 0.3.2 reads otherwise goes to the approver (dl-019).
3. **`catalog.yaml`**, in the same commit as `compat.yaml` (or `check:packs`' `catalog-range` fails
   between them): the `wingfoil` field of the six published versions (`base` 1.0.0, 2.0.0, 2.0.1;
   `software` 1.0.0; `methodology/scrum` 1.0.0; `methodology/kanban` 1.0.0) edited by hand to
   `wingfoil: ">=0.3.0 <=0.3.2"`, byte for byte as `toYaml` writes it; spec-001 §11 allows the
   field's edit. `npm run index`: the root `CATALOG.md` (its four range cells, one per pack) and
   `catalog-index.json` (the six ranges) change and nothing else; `llms.txt` and the fixture trees'
   outputs byte-unchanged, `install` empty.
4. **spec-001**, amended in place (the merge OK approves the text, as task-059): §12's example and
   `tests/fixtures/compose/tree/compat.yaml` equal to the real file (dl-010), no YAML block added
   before the example (`compat.test` reads the first fence); §12's prose gaining 0.3.2's check
   (date, `--version` line, commands, result); an Execution Note listing the changes, their
   approval by the merge OK, and the hand-applied computed range that `catalog-range` verifies.
   dl-009's Execution Note for 0.3.2, superseding its note on 0.3.1: publication selects 0.3.0 and
   0.3.2 (the golden tree included); self-test runs a composition requiring `workflow-engine` on
   0.3.0 and 0.3.2, the golden tree on 0.2.2 and 0.3.2; 0.3.1 stays in `compat.yaml` and in every
   range, outside the selection.
5. **The tests, red first** (dl-018 R1–R3): the changed tests are written first and fail against the
   old `compat.yaml`, the failing count recorded in the Execution Notes; then the record lands in
   one commit. Line numbers as at `main`'s `e354213`:
   - `tests/validate.test.ts`: beside the 0.3.1 stub of 57–64 (kept, so that the red run fails only
     on the changed expectations), a `stubbed032` printing `0.3.2 (6de2e13c)`, its comment naming
     this task, and a fourth `byRelease` parameter and map key `'0.3.2'` (71–73), as task-059 added
     0.3.1's; the golden self-test (121–133): 0.3.2's lines in place of 0.3.1's, the total
     unchanged; the warning test (141–149) on a warned 0.3.2 stub (`stubbed032` takes
     `diagnostics` as `stubbed031` does; the call at 146 becomes `byRelease(WINGFOIL,
     WINGFOIL_030, WINGFOIL_031, warned)`), its counts unchanged; the golden
     publication (159–165): 0.3.0 and 0.3.2; the install-failure test (205–217):
     `/wingfoil@0\.3\.2: npm ci failed/`, still `26 runs, 26 failed`; this repository's
     `validate` (279) and publication (332) titles naming 0.3.0 and 0.3.2, their counts unchanged;
     the overlay test on the golden tree (708): `wingfoil@0.3.2 … (self-test)`; the renamed titles
     (121, 141, 159, 279, 332) cite task-074 beside the tasks they cite;
   - `tests/compat.test.ts`: the real releases (53–58: 0.2.2, 0.3.0, 0.3.1, 0.3.2 with
     `workflow-engine`; 59: the `reads` loop over `[1, 2, 3]`); the range (67–71:
     `>=0.3.0 <=0.3.2`); the ascending test (77: `['0.2.2', '0.3.0', '0.3.1', '0.3.2', '0.4.0']`);
     the repeated release (90: repeats 0.3.2, matching `/0\.3\.2/`);
   - unchanged, and said so: the tests on `FROZEN_COMPAT` and `fixtureCompat`, `range.test.ts`,
     `matrix.test.ts` and `runs.test.ts` (synthetic releases or a fake `Compose`),
     `ci-workflow.test.ts`, `check-pins.test.ts` (its "passes on this repository" covers the new
     pin). `src/matrix/wingfoil-0.3.1/` stays: 0.3.1 stays listed in `compat.yaml`, its lockfile
     audited by the CI and part of the cache key.
6. **The 0.3.2 check**, before the record commit and recorded: with 0.3.2 from the matrix's cache,
   the golden tree and the nine README examples composed from the branch, each committed in a
   scratch repository by the matrix's own `runRelease` in publication mode (the golden fixture's
   `compat.yaml` lacks 0.3.2 before the record commit, so `validate` cannot run this check):
   `workflow list`, `dna show` and `directives list` with `--format json`, exit 0, no warning; the
   golden tree's `format:` keys accepted (`format_key: true`).
7. **After it**, on the branch: `npm run validate` (18 runs), the overlays `software-exit`,
   `scrum-exit` and `kanban-exit` (26 each), the golden step (26 runs, 0.2.2 tolerated and 0.3.2),
   `npm run validate:publication` (18 runs, 0.3.0 and 0.3.2), `npm run check:runs` (46 runs, 0
   failed, on 0.3.0 and 0.3.2), `npm run check:packs` (`catalog-range` on the new ranges), each exit
   0 with 0 failed.
8. **CI:** no change: `.github/workflows/ci.yml`'s header ("0.3.0 on") holds and no step names a
   release. The branch CI's conclusion and its two jobs' durations, step by step for `npm test`
   and the six matrix steps, recorded as G12's evidence (plan-060 ruling 4).
9. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other, on the same
   commit: `npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
   `index -- --check`, `validate`, the golden step, the three overlays, `workflow list`,
   `check:runs`, `validate:publication` and `npm audit` in the root and in every matrix folder exit
   0; `packs/` unchanged; the branch CI `success`, recorded; after the merge, `main`'s CI read.

Out of scope: the texts of the packs' READMEs (plan-060's recheck reads them; a published README is
frozen until its pack's next version), this repository's own WingFoil (0.2.2, W10), the root
`README.md`.

## Design

Branch `task/task-074-record-0.3.2` from `main`. A tooling task (dl-018 R1–R3).

**Red commit** (`test(compat): red first, …`): the tests of Acceptance 5 changed, nothing else.
Run against the unchanged `compat.yaml`; the failing count recorded, each failure for the right
reason (dl-018 R1): 9 failing, the 4 `compat.test` cases (53, 67, 77, 90: 0.3.2 not listed) and
the 5 `validate.test` cases asserting a 0.3.2 line or stub (121, 141, 159, 205, 708: the matrix
still selects 0.3.1); 279 and 332 change only their titles and stay green; no other test fails.

**Pin commit** (`build(matrix): pin WingFoil 0.3.2 …`): Acceptance 1. `check:pins` exits 0 (it
checks every folder of `src/matrix/`, listed or not), and `npm test` fails as at the red commit (the
pin alone selects nothing).

**Record commit** (`feat(compat): record WingFoil 0.3.2 …`), one commit: `compat.yaml`
(Acceptance 2), the golden fixture's `compat.yaml` and spec-001 §12's example byte-equal to it,
`catalog.yaml`'s six ranges, and the regenerated `CATALOG.md` and `catalog-index.json`.

**Texts commit** (`docs(memory): …`): spec-001 §12's prose, after the paragraph on 0.3.1's check,
a paragraph on 0.3.2's (Acceptance 6), with no YAML fence before the example; spec-001's Execution
Note; dl-009's Execution Note superseding its 0.3.1 note (Acceptance 4).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-03: independent review of the body: approve after amendments, one blocking finding (the
  install-failure test, which names the newest release, was missing); applied with it: the 0.3.1
  stub kept beside a new 0.3.2 one, so that the red run fails only on the changed expectations,
  and the expected failures named; 0.3.2's `reads` checked (the loop over `[1, 2, 3]`); the titles
  citing task-074; `CATALOG.md`'s four cells; the check's mechanism; the 0.3.1 pin kept.
- 2026-11-03: re-review: approve; its should-fix (279 and 332 change only their titles, so the red
  run expects 9 failures, named) and two nits (the warning test's fourth argument, line wrapping)
  applied. Submitted.
- 2026-11-03, red first (dl-018 R1), at `25b62f7` (the tests changed, `compat.yaml` unchanged):
  `node --test dist/tests/compat.test.js dist/tests/validate.test.js`: 69 tests, 60 pass, 9 fail,
  the nine the Design names. Pin at `c2744ba` (`npm audit` 0, `check:pins` exit 0). Record at the
  next commit; the same two files: 69 of 69.
- 2026-11-03, the 0.3.2 check (Acceptance 6), with `0.3.2 (6de2e13c004bbf419acfa7dc4d98d5a7468cd693)`
  from the matrix's cache, `npm run validate:publication` on the record's working tree: this
  repository's nine examples 18 runs, 0 failed; **the golden tree 26 runs, 13 failed**: every
  composition's `directives list` on 0.3.2 warns "directive 'security' bound to every role
  (roles.yaml 'global') has no directive file" and the same for `testing`. The golden fixture's
  `base` binds WingFoil's built-in `security` and `testing`, which spec-001 §7.4 allows; a project
  `init` created holds their files (`directives/built-in/`, checked on 0.3.2: removing
  `security.md` gives the same warning), the matrix's scratch repository does not, and 0.3.2 now
  warns on a binding with no file without `--role` (its CHANGELOG, `directives list`). Acceptance 6
  and 7 cannot hold for the golden tree; found during the build, taken to the approver (dl-019).
  The approver ruled on 2026-11-03: a defect of the matrix, bug-010, fixed by task-075 before this
  task records 0.3.2; this task waits for task-075's merge, then takes `main` and runs its checks
  again. The Acceptance text stays as approved.
- 2026-11-03: `main` merged into this branch after task-075's merge (`c4717ef`); the texts
  (`a67c2ae`): spec-001 §12's paragraph on 0.3.2 and its Execution Note, dl-009's note.
- 2026-11-03: independent review of the build: approve, nothing blocking; it ran the two test files
  (71 of 71, task-075 having added two), `check:packs`, `index -- --check`, the pin's audit and the
  golden tree on the real releases (26 runs, 0 failed, 0.2.2 tolerated and 0.3.2). Applied: the
  checks after the merge recorded (next note), §12's sentence on the binding warning reworded, the
  record commit named (`0501be2`).
