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

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **`compat.yaml`:** release 0.3.1 after 0.3.0, with `format_key: true`, `reads` at format 1 for
   the seven kinds, `capabilities: [workflow-engine]` and `notes`: "Accepts the format: key; format
   1; no new capability (plan-051 ruling 2, dl-021 R4). A fresh 0.3.0 install resolving zod 4.6
   showed zod's bare message on a refused cadence; 0.3.1 names the key again (bug-415)." `format_key`
   and `reads` as verified by running 0.3.1 on a composed file with and without `format:` keys
   (the check recorded); a finding that 0.3.1 reads otherwise goes to the approver (dl-019).
2. **spec-001**, amended in place (the merge OK approves the text, as task-036): §12's example
   and `tests/fixtures/compose/tree/compat.yaml` equal to the real file (dl-010); §12's prose
   gaining 0.3.1's check (date, commands, result); an Execution Note. dl-009's Execution Note for
   0.3.1 (its note that publication mode runs 0.3.0 alone goes stale).
3. **`catalog.yaml`**, in the same commit as `compat.yaml` (or `check:packs`' `catalog-range`
   fails between them): the `wingfoil` field of `base` 1.0.0 and 2.0.0 edited by hand to the
   range `catalog-range` computes, `">=0.3.0 <=0.3.1"`, quoted as `toYaml` writes it (no tool
   rewrites a published entry; spec-001 §11 and §12 allow the field's edit, `catalog-manifest`
   skipping it and the digest not covering `catalog.yaml`). `npm run index`: the root `CATALOG.md`
   and `catalog-index.json` change (base's range); the fixture trees' outputs byte-unchanged,
   `install` empty.
4. **The tests**, each expectation re-derived (dl-018 R1–R3 for each changed test):
   - `tests/validate.test.ts`: a 0.3.1 stub printing `0.3.1 (870bd440)` beside 0.3.0's for
     `byRelease`; the golden fixture's packs require no capability, so its self-test selects 0.2.2
     and 0.3.1 (no longer 0.3.0: covered by the real packs, the overlays and publication mode),
     its publication 0.3.0 and 0.3.1 (13 runs → 26); the "0.3.0 warning" test retargeted to the
     newest release; this repository's `validate` 7 → 14 runs, `validate:publication` 7 → 14; the
     overlays 11 → 22 each; every label's release re-derived;
   - `tests/compat.test.ts`: the real releases (0.2.2, 0.3.0, 0.3.1), the range of a version
     requiring `workflow-engine` (`>=0.3.0 <=0.3.1`), the sample release after 0.3.1, the repeated
     release case;
   - unchanged, and said so: the tests on `fixtureCompat` (the fictitious 9.0.0 built on
     `FROZEN_COMPAT`), `range.test`, `matrix.test`, `runs.test`.
5. **CI:** `.github/workflows/ci.yml`'s header and step names, where they name a release;
   `tests/ci-workflow.test.ts` unchanged unless a name it asserts moves.
6. **After it**, on the branch: `npm run validate` (14 runs), the overlays (22 each), the golden
   step (0.2.2 tolerated and 0.3.1), `npm run validate:publication` (14 runs, 0.3.0 and 0.3.1),
   `npm run check:runs` (26 runs, 0 failed), `npm run check:packs` (`catalog-range` on the new
   ranges), each exit 0.
7. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays, the
   golden step, `workflow list`, `check:runs` and `npm audit` in the root and every matrix folder
   exit 0; `packs/` unchanged; the branch CI `success`, recorded; after the merge, `main`'s CI read.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
