---
id: task-056-the-scrum-pack-s-exit-criterion-compositions-of-the-four-governed-software-repositories-parameters-plan-050
type: task
title: "The scrum pack's exit criterion: compositions of the four governed software repositories' parameters (plan-050)"
status: in-review
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

**Red first** (dl-018), on branch `task/task-056-scrum-exit`:
1. `tests/ci-workflow.test.ts`: the branch-only commands gain `npm run validate -- --overlay
   tests/fixtures/scrum-exit`; red on `main`'s `ci.yml` (no such step).
2. `tests/validate.test.ts`: a case as task-049's, validating the overlay
   `tests/fixtures/scrum-exit` and pinning the four `composed twice` lines, `compositions: 11` and `matrix: self-test, 11 runs,
   0 failed, tolerance applied: none`; red with no overlay directory.
Then the compositions (`tests/fixtures/scrum-exit/compositions/{defaults,flat-releases,
release-folders,release-folders-lean}/example.yaml`, copied from `software-exit`'s with
`methodology/scrum@^1`), then the CI step after `software-exit`'s.

**Checks:** the two tests green; `npm run validate -- --overlay tests/fixtures/scrum-exit`; the full
suite in clean clones on both Node.js versions; the branch CI, the new step included.

**Commits:** the red tests; the compositions and the CI step; the notes.

## Execution Notes

- 2026-10-27: written under plan-050 (step 4).
- 2026-10-27: independent review (approve after amendments), amended, re-reviewed (approve);
  submitted.
- 2026-10-27: Design written; `backlog → in-progress`.
- 2026-10-27, red run (dl-018), the tests only (`f85e206`), `main`'s `ci.yml` and no overlay
  directory: `npm run build && node --test --test-name-pattern="self-test mode on branches|task-056"
  dist/tests/ci-workflow.test.js dist/tests/validate.test.js`: 2 tests, 0 pass, 2 fail (no step runs
  the command; `validate` exits non-zero on a missing overlay).
- 2026-10-27, the compositions and the CI step (`64afe4c`): each composition is
  `tests/fixtures/software-exit`'s with `methodology/scrum@^1` in place of `methodology/fixture@^1`,
  one line apart. Which repository each matches, from task-049's notes: `defaults` is this
  repository's set, `flat-releases` WingFoil-Benchmark's, `release-folders` WingFoil's,
  `release-folders-lean` WingFoil-UI's. `scrum`'s parameters stay on their defaults, so
  `sprint_path` is `docs/memory/sprint/{id}.md` even where the others file under
  `docs/04_memory/`, as the Acceptance asks.
- 2026-10-27: `npm run validate -- --overlay tests/fixtures/scrum-exit`: `overlay: checked 4 files,
  0 problems`, the four `composed twice, 37 files, byte-identical` lines, `compositions: 11`,
  `matrix: self-test, 11 runs, 0 failed, tolerance applied: none`, no warning. A first run
  printed `compositions: 10`: `dist/` was rebuilt by a concurrent build in the same worktree while
  it ran; rerun alone, 11. The two task-056 tests and `ci-workflow` (10 of 10) pass; the full
  suite in clean clones at `64afe4c`: 1003 of 1003 on Node.js 22.21.0 and on the floor 22.12.0.
- 2026-10-27: independent review: approve; the notes above complete it.
- 2026-10-27: branch CI run 40507121569 on `2f3cb13`, conclusion `success` (`validate (22.12.0)`
  and `validate (22.21.0)` both `success`), the new step "Validate methodology/scrum with the
  governed repositories' parameters" `success` with the four `composed twice` lines. Privacy: no
  local path, private repository or private project in the diff. `in-progress → in-review`; the
  merge waits for `base@2.0.0`'s tag (plan-049's session asked that `main` stay still until it).
