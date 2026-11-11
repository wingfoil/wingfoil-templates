---
id: task-089-the-ci-s-margin-under-g12-the-validate-tests-split-across-files-ci.yml-and-intake.yml-s-verify-sharded-in-two-jobs-per-node-version-plan-068-task-a
type: task
title: "The CI's margin under G12: the validate tests split across files, ci.yml and intake.yml's verify sharded in two jobs per Node version (plan-068 task A)"
status: pending
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
  116 s. The suite's wall time is that file's. The file's module-level stubs (`WINGFOIL`,
  `DEFAULTS`) are disposed by top-level `after` hooks; a split file creates and disposes its own.
- **`intake.yml`'s `verify`:** one job per Node version, timeout 40: applies the prepared
  artifact, runs `npm test`, the self-test's checks and `validate:publication` (each continuing
  on error), writes `checks.json` (`{ node, checks }`, fifteen ids, a step not run written
  `skipped`) and the summary `### Checks on Node.js <node>`, uploads `verify-<node>`, then fails
  when a check is not `success`. `report` downloads `verify-*`; `src/intake-report.ts`'s
  `parseChecks` accepts a `node` of `NODES` and the report lists one leg per Node version, `no
  checks` when missing; the verdict reads `needs.verify.result`, not the legs. `npm test`'s
  rebuild after `intake:apply` is not needed: the artifact's allowlist (`src/intake-artifact.ts`)
  holds no `.ts` file.
- **Tests on the workflows:** `tests/ci-workflow.test.ts` (the matrix, every check on every path,
  the branch and tag `if`s, the cache) and `tests/intake-workflow.test.ts` (the `test` step's
  `npm test`, the artifact name, the outcomes script).
- **Texts:** `tooling-delivery` (v3) and `kanban-delivery` (v5) record "its two jobs' durations";
  dl-039 R1 says the same. No ruleset requires a check by name (`protect-main`: `deletion`,
  `non_fast_forward`).

Not here: removing a check the tests repeat (plan-068, option 2, ruled out); fewer Node versions;
G12, dl-039 or the timeouts changed; what the moved validate tests check; `pages.yml` (no
tests); the owed row, moved at plan-068's close.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 3 … 6 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as
   such); the failing run recorded with its command and count. The report's red tests feed legs
   through `parseChecks`' text, so they compile before `CheckLeg` gains `shard`. Acceptance 2 is
   a move of tests, checked by its lists, not by a red step.
2. **The validate tests split** (plan-068 point 1): `tests/validate.test.ts` becomes several files
   named `tests/validate-<part>.test.ts` (or as the design names them), one per top-level
   `describe` at least, `npm run validate`'s own `describe` and the `--overlay` one split further,
   so that no file takes more than about 5 minutes locally (each file's duration in the notes);
   shared helpers in `tests/support/`, each file creating and disposing its own stubs.
   - **The list:** every test as its `describe` path › name, read from `node --test`'s TAP
     output; captured on `main` before the split (its count, 1288, and a hash in the notes), it is
     equal as a multiset after the split, 0 failing.
   - No two files write a shared path (the repository tree, a fixed temporary name), checked in
     the build review.
3. **The shard script** (point 2): an npm script runs `node --test --test-shard=$SHARD/2`, its
   shard from the environment, with the option before the glob, the same glob as `npm test`, and
   no build; run with `SHARD` unset or `SHARD=3` it exits non-zero (checked locally, in the
   notes). `npm test` unchanged, the whole suite.
   - A test reads `package.json` and checks the script's form (the option before the glob, the
     glob equal to `npm test`'s, no build) and `npm test` unchanged.
   - Run locally, each shard's list (keyed by file and path) is disjoint from the other's and
     their union, the file dropped, is Acceptance 2's list as a multiset; each shard's wall time
     in the notes.
4. **`ci.yml`** (points 2 … 4): the matrix exactly `node: ['22.12.0', '22.21.0']` × `shard: [1,
   2]`, four jobs named `validate (<node>, <shard>)`, `fail-fast` and the timeout unchanged.
   - Every job: checkout, Node, install, build, the shard's tests through Acceptance 3's script,
     its step with no `if` and `SHARD: ${{ matrix.shard }}` in its `env`; no step runs `npm test`.
   - Shard 1 only: the matrix cache (its key unchanged), and every other step, lint, pins,
     schemas, the pack lint, the site, the three audits, the six branch steps and
     `validate:publication` on a tag, each `if` in its `matrix.shard == 1` form (with
     `github.ref_type` as today); on a tag, shard 2 runs install, build and its tests.
   - The jobs balanced (point 3): shard 1 takes the lighter half of the tests (by the files'
     split or names, Node assigning the sorted files to the shards in turn), so that one Node
     version's two jobs end within about 3 minutes of each other on the branch CI.
   - `tests/ci-workflow.test.ts` checks the matrix, the test step's command and `env`, no `npm
     test`, every non-test step and the cache in shard 1 only, and the tag and branch paths.
5. **`intake.yml`'s `verify`** (point 7): the matrix `node` × `shard: [1, 2]`; every job applies
   the artifact; the `test` step runs Acceptance 3's script with `SHARD` in its `env` and no
   `if`, in both shards; the fourteen other checks `if: matrix.shard == 1`, each continuing on
   error as today.
   - `checks.json` gains `shard` (the write step's `env` gains `SHARD`) and lists only the checks
     the shard runs: shard 2 `test` alone, shard 1 all fifteen; the step failing on a check not
     green therefore holds in both shards.
   - The summary's heading `### Checks on Node.js <node>, shard <shard>`; the artifact
     `verify-<node>-<shard>`; the timeouts (verify 40, report 10) unchanged.
   - `tests/intake-workflow.test.ts` checks the matrix, the `test` step's command, `env` and no
     `if`, the others' `if`, the heading and the artifact name, and runs the outcomes script with
     each shard's steps: shard 2's keys `['test']` with `shard: 2`, shard 1's all fifteen, the
     fail step exiting 0 on green in both.
6. **`intake:report`** (point 7): `parseChecks` reads `shard` (1 or 2) and refuses (returns
   nothing for) a leg without one, or a shard 2 with an id other than `test`; two legs of one
   `(node, shard)` are both dropped. Per Node version, `test` shows `success` when both shards'
   are, `failure` when either is red, `missing` when a shard is absent; every other check comes
   from shard 1, `missing` when it is absent. A missing shard is listed as `- verify on Node.js
   <node> shard <shard>: no checks`. The verdict still reads `needs.verify.result` only. The
   report's tests cover the four legs, one shard missing, a shard red, a duplicate, a malformed
   leg.
7. **Texts** (point 5): `tooling-delivery` v4 and `kanban-delivery` v6 record every job's
   durations (`wf(config)`); dl-039 R1's "two jobs" read as every job's, a reading recorded in
   plan-068's Execution Notes; `npm run -s wingfoil -- workflow list --format json` exits 0 and
   `directives list --format json` gives `warnings []`.
8. **The checks** (dl-039 R2, `tooling-delivery` v3): on the frozen commit, after the build
   review's fixes, the local list from a clean worktree on Node 22.21.0 exits 0; the branch CI's
   run green with its four jobs' durations, every job under 20 minutes or, between 20 and 25,
   the approver's ruling (plan-068 point 6); the rehearsal of `intake.yml` dispatched on the
   branch (`gh workflow run intake.yml --ref <branch> -f rehearsal=true`), its four `verify` jobs
   and `report` `success` with their durations, `detect`'s outcome recorded.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-11: body review: approve after amendments, two blocking, applied: a test of the shard
  script's form in `package.json` (red first), and the lists keyed by `describe` path › name, as
  multisets, captured on `main` before the split; with the nits: the shard's `env`, no `npm
  test` in `ci.yml`, the ids per shard tested, a duplicate dropped, shard 1 missing, the red
  tests through `parseChecks`, dl-039 R1's reading, the 20 … 25 route, the rehearsal's outcomes,
  the `--overlay` describe split, the stubs per file, two Context wordings.
- 2026-11-11: re-review: approve, four nits, applied: the shard from the environment only, the
  unset and invalid shard checked locally, the union without the file, a reflow.
