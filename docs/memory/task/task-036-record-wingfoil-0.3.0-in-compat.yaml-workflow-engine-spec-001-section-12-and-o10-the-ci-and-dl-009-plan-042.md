---
id: task-036-record-wingfoil-0.3.0-in-compat.yaml-workflow-engine-spec-001-section-12-and-o10-the-ci-and-dl-009-plan-042
type: task
title: "Record WingFoil 0.3.0 in compat.yaml: workflow-engine, spec-001 section 12 and O10, the CI and dl-009 (plan-042)"
status: draft
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

Tests run by `npm test` unless named.

1. **The release.** `compat.yaml` appends, after 0.2.2:
   `wingfoil: 0.3.0`, `format_key: true`, `reads` at `[1]` for the seven kinds,
   `capabilities: [workflow-engine]`, and `notes` saying the capability is recorded because 0.3.0's
   CHANGELOG names `workflow start`, `end`, `next` and `finalize` (dl-021 R4), and that 0.3.0
   accepts the `format:` key. Nothing else in the file changes; task-035's frozen header stays its
   byte prefix.
2. **spec-001, amended in place** (as plan-032 did; the merge OK approves the text):
   §12's example equals the real file; §12's prose gains 0.3.0's check (the date, the commands with
   `--format json` on a committed scratch repository, the result: no warning on the golden tree);
   §16's O10 is settled; an Execution Note lists the changes. The compose fixture's `compat.yaml`
   equals the real file (`tests/compat.test.ts`, dl-010).
3. **Tests.** `tests/compat.test.ts`: the real file's releases are 0.2.2 then 0.3.0; its sample
   second release is another version (for example 0.4.0), so the ordering and duplicate tests keep
   their meaning. `tests/validate.test.ts` runs per-release stubs (task-035) wherever the golden
   tree's two releases are selected, and its expectations follow: 26 runs in self-test mode with
   0.3.0's lines `pass (self-test)`; publication mode on the golden tree passes against 0.3.0 alone;
   a failing stub fails its release's runs. Any other test that reads the real `compat.yaml`
   (`readme-rules`, `example-rules`, `check-packs`) passes, adjusted only where its assertion named
   0.2.2 as the last release.
4. **The commands after it**, from a clean clone: `npm run validate` exits 0 on this repository
   (no pack) and on the golden tree with 26 runs, 0 failed; `npm run validate:publication` exits 1
   on this repository ("publication mode with no composition") and exits 0 on the golden tree
   against 0.3.0 alone. Recorded in the Execution Notes.
5. **dl-009 and the CI.** dl-009's Execution Note records that the self-tests now also run a release
   with `format_key: true`, the tolerance applying to 0.2.2 only. `ci.yml`'s header no longer says
   publication fails by design, and its golden step's name does not name 0.2.2 alone.
6. **The index.** `npm run index` leaves `CATALOG.md` and `catalog-index.json` byte-unchanged, at
   the root and in the fixture trees: `install` stays empty, no release providing `pack-install`.
7. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`
   and `npm run validate` exit 0; the CI run on the pushed branch concludes `success`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
