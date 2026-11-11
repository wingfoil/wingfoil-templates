---
id: task-089-the-ci-s-margin-under-g12-the-validate-tests-split-across-files-ci.yml-and-intake.yml-s-verify-sharded-in-two-jobs-per-node-version-plan-068-task-a
type: task
title: "The CI's margin under G12: the validate tests split across files, ci.yml and intake.yml's verify sharded in two jobs per Node version (plan-068 task A)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-068 task (A)
depends_on: []
tags: ["tooling","ci"]
---

## Context

plan-068's only task (points 1 … 5 and 7, the approver's OK of 2026-11-11), for the row "The
CI's margin under G12's 25 minutes" of `docs/owed-items.md`. G12: a CI job over 25 minutes goes
to the approver.

What exists (`main` at plan-068's `submit`):
- **`ci.yml`:** one job `validate` per Node version (`22.12.0`, `22.21.0`), timeout 30, the matrix
  cache `.cache/wingfoil-matrix`; its steps: install, build, `npm test`, lint, pins, schemas, the
  pack lint, the site, three audits, then on a branch six `validate`/`check:runs` steps and on a
  tag `validate:publication`. On plan-067's branch run (43048922074) the 22.12.0 job took 24 min
  40 s: `Test` 19 min 25 s, the six steps about 4 min 30 s, the rest about a minute.
- **The suite:** `npm test` builds, then runs `node --test "dist/tests/**/*.test.js"`; 58 files,
  1288 tests; `node --test` runs files concurrently (on the runner's four vCPUs, three at once),
  each file's tests in order. `tests/validate.test.ts` (1241 lines) holds six top-level
  `describe`s, locally about 757 s (`npm run validate`), 345 s (`--overlay`), 71 s (the legs per
  entry, with a `before` hook), 55 s (both legs of a conditional part), 33 s (the waiver
  heuristic) and 18 s (the tensions' notices), about 21 minutes in all; no other file exceeds
  116 s. The suite's wall time is that file's.
- **`intake.yml`'s `verify`:** one job per Node version, timeout 40: applies the prepared
  artifact, runs `npm test` and every check of `ci.yml`'s self-test (each continuing on error),
  writes `checks.json` (`{ node, checks }`, fifteen ids, a step not run written `skipped`) and the
  summary `### Checks on Node.js <node>`, uploads `verify-<node>`, then fails when a check is not
  `success`. `report` downloads `verify-*`; `src/intake-report.ts`'s `parseChecks` accepts a
  `node` of `NODES` and the report lists one leg per Node version, `no checks` when missing; the
  verdict reads `needs.verify.result`, not the legs.
- **Tests on the workflows:** `tests/ci-workflow.test.ts` (the matrix, every check on every path,
  the branch and tag `if`s, the cache) and `tests/intake-workflow.test.ts` (the `test` step's
  `npm test`, the artifact name, the outcomes script).
- **Texts:** `tooling-delivery` (v3) and `kanban-delivery` (v5) record "its two jobs' durations";
  dl-039 R1 says the same. No ruleset requires a check by name (`protect-main`: `deletion`,
  `non_fast_forward`).

Not here: removing a check the tests repeat (plan-068, option 2, ruled out); fewer Node versions;
G12, dl-039 or the timeouts changed; what any test checks; `pages.yml` (no tests).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 3 … 6 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as
   such); the failing run recorded with its command and count. Acceptance 2 is a move of tests,
   checked by its counts, not by a red step.
2. **The validate tests split** (plan-068 point 1): `tests/validate.test.ts` becomes several files
   named `tests/validate-<part>.test.ts` (or as the design names them), one per top-level
   `describe` at least, `npm run validate`'s own `describe` split further, so that no file takes
   more than about 5 minutes locally (each file's duration in the notes); shared helpers in
   `tests/support/`. Every test keeps its name, its `describe` path and what it checks: the
   suite counts 1288 tests, 0 failing, and the list of test names (`node --test` with a reporter
   that prints them, sorted) is equal before and after. No two files write a shared path (the
   repository tree, a fixed temporary name), checked in the build review.
3. **The shard script** (point 2): an npm script runs `node --test --test-shard=<i>/2` with the
   option before the glob and without rebuilding, its shard from the environment or one script per
   shard; `npm test` unchanged, still the whole suite. Run locally, the two shards' counts add up to
   1288, no test in both (their name lists disjoint, their union Acceptance 2's list); each
   shard's wall time in the notes.
4. **`ci.yml`** (points 2 … 4): the matrix `node` × `shard: [1, 2]`, four jobs named
   `validate (<node>, <shard>)`, `fail-fast` and the timeout unchanged.
   - Every job: checkout, Node, install, build, the shard's tests through Acceptance 3's script.
   - Shard 1 only: the matrix cache (its key unchanged), and every other step, lint, pins,
     schemas, the pack lint, the site, the three audits, the six branch steps and
     `validate:publication` on a tag, each `if` in its `matrix.shard == 1` form (with
     `github.ref_type` as today); on a tag, shard 2 runs install, build and its tests.
   - The jobs balanced (point 3): shard 1 takes the lighter half of the tests (by the files'
     split or names, Node assigning the sorted files to the shards in turn), so that one Node
     version's two jobs end within about 3 minutes of each other on the branch CI.
   - `tests/ci-workflow.test.ts` checks the matrix, the shard's command (the option before the
     glob), every non-test step and the cache in shard 1 only, and the tag and branch paths.
5. **`intake.yml`'s `verify`** (point 7): the matrix `node` × `shard: [1, 2]`; every job applies
   the artifact; the `test` step runs Acceptance 3's script in both shards; shard 1 runs every
   other check, shard 2 none, each continuing on error as today.
   - `checks.json` gains `shard` and lists only the checks the shard runs: shard 2 `test` alone,
     shard 1 all fifteen; the step failing on a check not green therefore holds in both shards
     (a test runs the outcomes script with shard 2's steps and sees it exit 0 on green).
   - The summary's heading `### Checks on Node.js <node>, shard <shard>`; the artifact
     `verify-<node>-<shard>`; the timeouts (verify 40, report 10) unchanged.
   - `tests/intake-workflow.test.ts` checks the matrix, the `test` step's command, the ids per
     shard, the heading and the artifact name.
6. **`intake:report`** (point 7): `parseChecks` reads `shard` (1 or 2), refusing a leg without one
   or a duplicate `(node, shard)`; per Node version, `test` shows `success` only when both
   shards' do, `missing` when a shard is absent, every other check from shard 1; a missing shard
   is listed as `Node.js <node> shard <shard>: no checks`. The verdict still reads
   `needs.verify.result` only. The report's tests cover the four legs, one shard missing, a
   shard red, a duplicate.
7. **Texts** (point 5): `tooling-delivery` v4 and `kanban-delivery` v6 record every job's
   durations (`wf(config)`); `npm run -s wingfoil -- workflow list --format json` exits 0 and
   `directives list --format json` gives `warnings []`.
8. **The checks** (dl-039 R2, `tooling-delivery` v3): on the frozen commit, after the build
   review's fixes, the local list from a clean worktree on Node 22.21.0 exits 0; the branch CI's
   run green with its four jobs' durations, every job under 20 minutes (plan-068 point 6); the
   rehearsal of `intake.yml` dispatched on the branch (`gh workflow run intake.yml --ref <branch>
   -f rehearsal=true`), green, its four `verify` jobs' durations in the notes.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
