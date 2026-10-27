---
id: task-056-the-scrum-pack-s-exit-criterion-compositions-of-the-four-governed-software-repositories-parameters-plan-050
type: task
title: "The scrum pack's exit criterion: compositions of the four governed software repositories' parameters (plan-050)"
status: draft
pack: "pack-methodology-scrum"
depends_on: ["task-055"]
tags: ["packs","scrum"]
---

## Context

`pack-methodology-scrum`'s Acceptance: task-049's compositions of the four governed software
repositories' parameters, redone with `methodology/scrum` in place of `methodology/fixture`,
compose and validate on WingFoil 0.3.0 with no warning. plan-050 ruling 2: a new overlay,
`tests/fixtures/scrum-exit/`, with compositions only, and a CI step; `software-exit` unchanged.

## Acceptance

1. **The compositions**: `tests/fixtures/scrum-exit/compositions/<set>/example.yaml` for the four
   sets of `tests/fixtures/software-exit/compositions/` (task-049): `defaults`, `flat-releases`,
   `release-folders`, `release-folders-lean`, the same parameter values and fictional identities,
   `packs: [software@^1, methodology/scrum@^1]`, `scrum`'s parameters on their defaults; no
   `packs/` folder. They name no `base`, so plan-050 ruling 1's cascade does not touch them.
   The Execution Notes state which repository each matches, copied from task-049's.
2. **Validation:** `npm run validate -- --overlay tests/fixtures/scrum-exit` passes, every
   composition composed twice byte-identical and run on WingFoil 0.3.0 with no failed run and no
   warning: `compositions: 11` (the tree's seven examples and the four sets) and `matrix:
   self-test, 11 runs, 0 failed, tolerance applied: none`. A case in `tests/validate.test.ts`, as
   task-049's, pins the four `composed twice` lines and the counts, written red first with the CI
   pin.
3. **CI:** a step in `.github/workflows/ci.yml` running that command off tags, after the
   `software-exit` step; `tests/ci-workflow.test.ts`, which pins the CI's overlay commands, extended
   red first (dl-018: the test is written, red on `main`'s `ci.yml`, then the step), the red run
   recorded; a developer change under `tests/` and `.github/` inside a pack task, as task-047's.
4. **Tests:** `npm test` passes on Node.js 22.21 and on the floor 22.12.0 in clean clones; the CI
   run on the branch is `success` and recorded, the new step included. No file under `packs/`,
   `src/` or `.wingfoil/` changes.

## Design

<!-- Written at design. -->

## Execution Notes

- 2026-10-27: written under plan-050 (step 4).
