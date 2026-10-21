---
id: task-036-record-wingfoil-0.3.0-in-compat.yaml-workflow-engine-spec-001-section-12-and-o10-the-ci-and-dl-009-plan-042
type: task
title: "Record WingFoil 0.3.0 in compat.yaml: workflow-engine, spec-001 section 12 and O10, the CI and dl-009 (plan-042)"
status: backlog
pack: ""            # tooling task (wingfoil-release-intake › record, plan-042)
depends_on: ["task-035-the-compatibility-matrix-runs-wingfoil-0.3.0-its-version-line-a-committed-scratch-repository-diagnostics-as-warnings-per-release-stubs-plan-042"]
tags: ["tooling","compat","intake"]
---

## Context

The second of plan-042's two tasks (the approver's ruling K, 2026-10-20): the intake proper of
WingFoil 0.3.0 (`wingfoil/wingfoil@v0.3.0` = `cc31d7a8`, on npm since 2026-10-19). task-035 made the
matrix able to run it and committed its pin (`src/matrix/wingfoil-0.3.0/`); a real run on a copy of
the golden tree with 0.3.0 listed passed (26 runs, 0 failed). This task lists 0.3.0 in the real
`compat.yaml`, as `wingfoil-release-intake` › `record` asks, and moves what that moves:
- `tests/compat.test.ts` holds `compat.yaml` byte-equal to spec-001 §12's example and to the compose
  fixture's `compat.yaml` (dl-010), and asserts the real file's releases;
- the golden fixture's `compat.yaml`, equal to the real one, makes `npm run validate` on the golden
  tree select both releases: 13 runs become 26, and publication mode, which excludes 0.2.2, passes
  against 0.3.0 alone (dl-009). Most of `tests/validate.test.ts` runs one stub for every release, so
  it moves to task-035's per-release stubs;
- spec-001's O10 ("no released WingFoil has `format_key: true` before v0.3") is now settled; §12's
  prose describes 0.2.2's check only; dl-009 foresaw that the self-tests also run a release with
  `format_key: true`;
- `.github/workflows/ci.yml`'s header says publication "fails by design until compat.yaml lists a
  WingFoil release with format_key: true", and its golden step is named after 0.2.2.

The two foundation charters require `workflow-engine` (plan-041 ruling 17, J): listing 0.3.0 with it
is what lets their computed range be non-empty at publication (spec-001 §12).

## Acceptance

Tests run by `npm test` unless named. `npm run build` precedes the commands; the matrix installs
0.3.0 (network).

1. **The release.** `compat.yaml` appends, after 0.2.2: `wingfoil: 0.3.0`, `format_key: true`,
   `reads` at `[1]` for the seven kinds, `capabilities: [workflow-engine]`, and `notes` saying that
   0.3.0 accepts the `format:` key, that the capability is recorded because its CHANGELOG names
   `workflow start`, `end`, `next` and `finalize` (dl-021 R4), and that the vocabulary's wording is
   provisional, WingFoil's to name (WingFoil dl-177). Nothing else in the file changes; task-035's
   frozen header stays its byte prefix. `catalog.yaml` is unchanged: `packs` is empty, so `record`
   has no range to recompute.
2. **spec-001, amended in place** (as plan-032 did; task-036's merge OK under plan-042 approves the
   text): §12's example equals the real file, and §12's new prose adds no YAML block before it
   (`tests/compat.test.ts` reads the first); §12's prose gains 0.3.0's check (the date, the commands
   with `--format json` on a committed scratch repository, the result: no warning on the golden
   tree); §16's O10 is settled; an Execution Note lists the changes and their approval. The compose
   fixture's `compat.yaml` equals the real file (dl-010).
3. **Tests.**
   - `tests/compat.test.ts`: the real file's releases are 0.2.2 then 0.3.0, 0.3.0 with
     `format_key: true` and `capabilities: [workflow-engine]`; its sample second release is 0.4.0,
     and the repeated-release case repeats the last release; a version requiring `workflow-engine`
     gets the computed range `"0.3.0"` from the real file.
   - `tests/validate.test.ts`, on the golden tree, with per-release stubs (task-035): self-test
     gives `matrix: self-test, 26 runs, 0 failed, tolerance applied: 0.2.2`, 0.2.2's lines
     `pass (self-test, tolerated 1)` and 0.3.0's `pass (self-test)`; publication gives
     `matrix: publication, 13 runs, 0 failed, tolerance applied: none` with only
     `wingfoil@0.3.0 … pass (publication)` lines; a noisy 0.2.2 stub gives 26 runs, 13 failed; a
     0.3.0 `warning` diagnostic gives 26 runs, 13 failed, 0.2.2 still tolerated; an install
     failure exits 2 with 26 failed. task-035's two-release test is folded into these (the golden
     tree now lists 0.3.0 itself). The empty compatible set keeps its test on a tree copy whose
     `compat.yaml` is task-035's frozen 0.2.2-only header: `matrix presets/golden.yaml: no
     compatible release (publication)`.
   - Expected unchanged: `readme-rules`, `readme-generate`, `example-rules`, `check-packs`,
     `ci-workflow` and every test built on `treeRepo`/`fixtureCompat`.
4. **The commands after it**, from a clean clone, recorded in the Execution Notes:
   `npm run validate` exits 0 on this repository (no composition, 0 runs);
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exits 0
   with 26 runs, 0 failed; `npm run validate:publication` exits 1 on this repository
   ("publication mode with no composition"); `npm run validate:publication -- --tree
   tests/fixtures/compose/tree --param project_name=Golden` exits 0 against 0.3.0 alone, 13 runs.
5. **dl-009 and the CI.** dl-009's Execution Note records that the self-tests now also run a release
   with `format_key: true`, the tolerance applying to 0.2.2 only, and that a composition requiring
   `workflow-engine` runs 0.3.0 alone. `ci.yml`'s header says that publication selects the releases
   with `format_key: true` (0.3.0) and that a tag run fails while the tree holds no composition;
   its golden step's name does not name 0.2.2 alone.
6. **The index.** `npm run index` changes no output (`CATALOG.md`, `catalog-index.json`,
   `llms.txt`, the READMEs' generated regions), at the root and in the fixture trees; `git status`
   clean: `install` stays empty, no release providing `pack-install`.
7. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`
   and `npm run validate` exit 0; the CI run on the pushed branch concludes `success`.

Out of scope, left as they are until this repository moves to 0.3.0 (W9): `wingfoil-cli`'s W-01,
which cites O10 for this repository's own WingFoil 0.2.2, and the root README's sentence on the
publication after v0.3.

## Design

Written 2026-10-21, before the build. Branch `task/task-036-record-wingfoil-0.3.0` from `main`.

Order (dl-018):
1. **Red** — tests only, committed first, the red counted:
   - `tests/compat.test.ts`: the real releases 0.2.2 then 0.3.0, 0.3.0's `format_key` and
     `capabilities`; `SECOND_RELEASE` becomes 0.4.0, the repeated case repeats the last release;
     `computeRange` on the real file gives `"0.3.0"` to a version requiring `workflow-engine`.
   - `tests/validate.test.ts`: the default `validate()` helper installs per release
     (`stubsPerRelease`: 0.2.2 with its format warning, 0.3.0 printing `0.3.0 (cc31d7a8)` and JSON
     with no diagnostics or warnings); the golden expectations of criterion 3 (26 self-test runs with
     both releases' lines; publication 13 runs on 0.3.0 alone; a noisy 0.2.2, a 0.3.0 warning, an
     install failure); task-035's two-release test folded in; the empty compatible set on a tree
     copy whose `compat.yaml` is `FROZEN_COMPAT`.
2. **Green** — `compat.yaml`, `tests/fixtures/compose/tree/compat.yaml` and spec-001 §12's example
   together (held byte-equal), with 0.3.0's entry as criterion 1.
3. **Documentation** (red-first exceptions): §12's prose (0.3.0's check, after the example), O10
   settled, spec-001's Execution Note; dl-009's Execution Note; `ci.yml`'s header and golden step
   name.
4. **The commands** of criterion 4, by hand, and `npm run index` with `git status` clean.


## Execution Notes

- 2026-10-21: independent review of the body: approve after amendments, nothing blocking (task-035's
  two-release test folds into the golden one; the empty compatible set keeps a test; the CI header;
  exact counts and commands; the notes' wording; the out-of-scope texts). Amended.
