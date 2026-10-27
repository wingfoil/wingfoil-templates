---
id: task-059-record-wingfoil-0.3.1-in-compat.yaml-spec-001-section-12-and-the-golden-fixture-recompute-base-s-published-ranges-plan-051
type: task
title: "Record WingFoil 0.3.1 in compat.yaml, spec-001 section 12 and the golden fixture, recompute base's published ranges (plan-051)"
status: draft
pack: ""            # tooling task (wingfoil-release-intake › record, plan-051 ruling 1)
depends_on: [task-058]
tags: ["tooling","wingfoil","compat"]
---

## Context

plan-051's second task (ruling 1): the intake proper of WingFoil 0.3.1, as task-036 recorded
0.3.0. task-058 committed 0.3.1's pin and made `check:runs` run on every selected release; this
task lists 0.3.1 in `compat.yaml`, so that the matrix, `check:runs` and the publication select
0.3.0 and 0.3.1 for every composition requiring `workflow-engine`. `tests/compat.test.ts` holds
`compat.yaml` byte-equal to spec-001 §12's example and to the golden fixture's (dl-010), so the
real file, the spec, the fixture and the tests change together; the published versions of `base`
gain 0.3.1 in their computed range (spec-001 §12). What 0.3.1 provides is plan-051's Context
(no format version named; `format_key`, `reads` verified by running it; no new capability,
ruling 2).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named. The task's branch is
cut from `main` after task-058's merge (`check:runs` on every release and 0.3.1's pin).

1. **`compat.yaml`:** release 0.3.1 after 0.3.0, with `format_key: true`, `reads` at format 1 for
   the seven kinds, `capabilities: [workflow-engine]` and `notes`: "Accepts the format: key; format
   1; no new capability (plan-051 ruling 2, dl-021 R4). A fresh 0.3.0 install resolving zod 4.6
   showed zod's bare message on a refused cadence; 0.3.1 names the key again (bug-415)." Nothing
   else in the file changes; `FROZEN_COMPAT` stays its byte prefix. `format_key` and `reads` as
   verified by running 0.3.1, as spec-001 §12 did for 0.3.0: the composed golden tree and the seven
   README examples, each committed in a scratch repository, `workflow list`, `dna show` and
   `directives list` with `--format json`, exit 0 and no warning; a finding that 0.3.1 reads
   otherwise goes to the approver (dl-019).
2. **spec-001**, amended in place (the merge OK approves the text, as task-036): §12's example and
   `tests/fixtures/compose/tree/compat.yaml` equal to the real file (dl-010), §12's new prose adding
   no YAML block before the example (`compat.test` reads the first fence); §12's prose gaining
   0.3.1's check (date, `--version` line, commands, result); an Execution Note listing the
   changes and their approval and saying that the
   intake applies the recomputed range to the published entries by hand and `check:packs`'
   `catalog-range` verifies it, so the edit is the computed value, not a chosen one (dl-002).
   dl-009's Execution Note for 0.3.1, superseding its note on 0.3.0: publication selects 0.3.0 and
   0.3.1 (the golden tree included); self-test runs a composition requiring `workflow-engine` on
   0.3.0 and 0.3.1, the golden tree on 0.2.2 and 0.3.1.
3. **`catalog.yaml`**, in the same commit as `compat.yaml` (or `check:packs`' `catalog-range`
   fails between them): the `wingfoil` field of `base` 1.0.0 and 2.0.0 edited by hand to
   `wingfoil: ">=0.3.0 <=0.3.1"`, byte for byte as `toYaml` writes it (so a later `addVersion`
   rewrite of `packs:` makes no diff on `base`); spec-001 §11 allows the field's edit
   (`catalog-manifest` skips it, the digest does not cover `catalog.yaml`). `npm run index`: the
   root `CATALOG.md` (base's range cell) and `catalog-index.json` (base's two ranges) change and
   nothing else; `llms.txt` and the fixture trees' outputs byte-unchanged, `install` empty.
4. **The tests, red first** (dl-018 R1–R3): the changed tests are written first and fail against
   the old `compat.yaml`, the failing counts recorded in the Execution Notes; then `compat.yaml`,
   the spec, the fixture and `catalog.yaml` change in one commit. In `tests/validate.test.ts`:
   - the stubs (around lines 46–65): a `stubbed031` printing `0.3.1 (870bd440)` and a third
     `byRelease` parameter, with a warned 0.3.1 stub for the retargeted warning test;
   - the golden self-test (111–127): 0.3.1's lines in place of 0.3.0's, the total still
     `26 runs, 0 failed, tolerance applied: 0.2.2`, the title renamed;
   - the warning test (129–146): on 0.3.1, still `26 runs, 13 failed`;
   - the golden publication (148–160): 26 runs, 0.3.0 and 0.3.1 lines, the title renamed;
   - the install-failure test (199–200): names 0.3.1, still 26 failed;
   - this repository's `validate` (264–273): 7 → 14, the title renamed; the overlays (286, 300):
     11 → 22; `validate:publication` (303–311): 7 → 14, the title renamed; the overlay test on the
     golden tree (679): `wingfoil@0.3.1 … (self-test)`;
   - unchanged, and said so: 162–173 (`FROZEN_COMPAT`), 176–189 (the noisy 0.2.2, 26 runs, 13
     failed), 555.
   In `tests/compat.test.ts`: the real releases (51–61: 0.2.2, 0.3.0, 0.3.1, and 0.3.1's `reads`);
   the range of a version requiring `workflow-engine` (`>=0.3.0 <=0.3.1`); the ascending test
   (72–77: `['0.2.2', '0.3.0', '0.3.1', '0.4.0']`); the repeated release (86–91: repeats 0.3.1,
   matching `/0\.3\.1/`). Unchanged, and said so: the tests on `fixtureCompat` (the fictitious
   9.0.0 built on `FROZEN_COMPAT`), `range.test`, `matrix.test`, `runs.test`.
5. **CI:** no change expected: `.github/workflows/ci.yml`'s header ("0.3.0 on") still holds and no
   step names a release; `tests/ci-workflow.test.ts` unchanged.
6. **After it**, on the branch: `npm run validate` (14 runs), the overlays `software-exit` and
   `scrum-exit` (22 each), the golden step (26 runs, 0.2.2 tolerated and 0.3.1),
   `npm run validate:publication` (14 runs, 0.3.0 and 0.3.1), `npm run check:runs` (26 runs, 0
   failed), `npm run check:packs` (`catalog-range` on the new ranges), each exit 0.
7. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays, the
   golden step, `workflow list`, `check:runs` and `npm audit` in the root and every matrix folder
   exit 0; `packs/` unchanged; the branch CI `success`, recorded; after the merge, `main`'s CI read.

Out of scope: the texts that describe 0.3.0's behaviour in `packs/software/README.md` and
`packs/base/README.md` (`packs/` unchanged here; `base`'s published README frozen until its next
version; plan-051's recheck and W9 take them), and the root `README.md`'s line on WingFoil v0.3.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-27: independent review of the body: approve after amendments, nothing blocking. Applied:
  every changed test named line by line, as task-036; `compat.test`'s three cases; task-036's two
  safeguards (`FROZEN_COMPAT` prefix, no YAML block before §12's example); the 0.3.1 check named as
  for 0.3.0; the hand edit of the range explained against §12's "never written by hand"; dl-009's
  superseded note; red first stated; the branch cut after task-058's merge; the out-of-scope texts;
  the CI's expected outcome.
- 2026-10-27: re-review: approve; its nit applied. Submitted.
