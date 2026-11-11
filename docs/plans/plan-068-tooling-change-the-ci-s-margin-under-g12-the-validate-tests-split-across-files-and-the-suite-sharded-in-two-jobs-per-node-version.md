---
id: plan-068-tooling-change-the-ci-s-margin-under-g12-the-validate-tests-split-across-files-and-the-suite-sharded-in-two-jobs-per-node-version
type: plan
title: "tooling-change: the CI's margin under G12, the validate tests split across files and the suite sharded in two jobs per Node version"
status: active
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","ci"]
---

## Context

The `deliver` phase of `tooling-change` for the row "The CI's margin under G12's 25 minutes" of
`docs/owed-items.md` (plan-066, 2026-11-09), which the approver asked to take next on 2026-11-11,
after plan-067's close, choosing the split and the shards (option 1) and not the removal of
duplicated checks (option 2).

**What exists** (`main`): `ci.yml` runs one job per Node version (`22.12.0`, `22.21.0`), timeout
30 minutes. On plan-067's branch run (43048922074) the 22.12.0 job took 24 min 40 s, of which the
`Test` step took 19 min 25 s, the six `validate` and `check:runs` steps about 4 min 30 s, the rest
about a minute; `main`'s run on plan-067's merge (43067667780) took 24 min 17 s on 22.12.0. The
suite has 58 test files, run concurrently by `node --test`, each file's tests in order;
`tests/validate.test.ts` holds the six slowest suites (locally about 757 s, 345 s, 71 s, 55 s,
33 s and 18 s, about 21 minutes in all, against at most 116 s for any other file), so the suite's
duration is that one file's. G12: a job over 25 minutes goes to the approver.

**`main`'s CI before this plan** (dl-038 C3): plan-067's close (`0c8e3746`, `279591b1`), pushed
with this plan's `submit`; that run is read and recorded in the Execution Notes.

## Proposed outline (ruled by the approver before `submit`)

1. **The validate tests split across files.** `tests/validate.test.ts` becomes several files, one
   per `describe` at least, and `npm run validate`'s own `describe` (about 757 s) split further,
   so no file holds more than about 5 minutes locally; shared helpers move to `tests/support/`.
   No test is removed or changed in what it checks: the count stays 1288, the names unchanged.
   The split files run concurrently, so no two of them write a shared path (the repository tree,
   a fixed temporary name), checked in the build review. The task's design records each file's
   duration and the local wall time of each shard after the split, the prediction behind point 6:
   with three files at once on the runner's four vCPUs, a shard takes about the longer of its
   longest file and a third of its files' total.
2. **The suite in two shards per Node version.** `ci.yml`'s matrix gains `shard: [1, 2]`, four
   jobs; each runs its shard through an npm script that puts `--test-shard=<shard>/2` before the
   glob (`node --test` ignores an option after it and would run every file in both shards) and
   does not rebuild, the Build step having run; `npm test` still runs the whole suite (dl-039's
   local list unchanged). Node's shards take the sorted files in turn, not by time.
3. **Each check once per Node version, the jobs balanced.** Install, build and the shard's tests
   in every job; every other step (lint, pins, schemas, the pack lint, the site, the audits, the
   six `validate` and `check:runs` steps on a branch, `validate:publication` on a tag) and the
   matrix cache (its key unchanged) in shard 1 only, so nothing is lost and nothing runs twice; on
   a tag, shard 2 runs install, build and its tests, and publication mode runs once per Node
   version. Shard 1's other steps take about 5 min 30 s, so the jobs, not the `Test` steps, are
   balanced: shard 1 takes the lighter half of the tests (the files' split or names), the jobs of
   one Node version within about 3 minutes, the numbers in the task's notes. A later test file can
   shift the balance; every task's job durations (dl-039 R3) show it.
   `tests/ci-workflow.test.ts` checks it, red first: the matrix, the shard's command (the option
   before the glob), every check's `if` in its `matrix.shard == 1` form, the cache's `if`.
4. **Job names** `validate (<node>, <shard>)`. No required check names a job (the ruleset
   `protect-main` holds `deletion` and `non_fast_forward` only), so the rename breaks nothing.
5. **Texts.** `tooling-delivery` and `kanban-delivery` record "its two jobs' durations": they
   become every job's durations, a wording change that bumps them to v4 and v6 as their last text
   change did (`wf(config)`, in the task; task-089 follows `tooling-delivery` v3, the version at
   its `add`). dl-039 R1's "two jobs" is read as every job's after this plan, a reading recorded
   in the Execution Notes; G12, dl-039 and the timeout of 30 minutes unchanged.
6. **Done when** every job of the task's branch CI and of `main`'s CI on its merge takes under 20
   minutes, and the two shards' test counts of each Node version add up to 1288; the row then
   moves to Closed with the numbers. A job over 20 minutes and under 25 goes to the approver, who
   rules whether the merge goes ahead (a third shard, or G12's bound, as a later row); a ruling
   that leaves an owed item adds its row in the commit that records it (dl-036 R2).
7. **`intake.yml`'s `verify` sharded the same way** (the approver, 2026-11-11). Its matrix gains
   `shard: [1, 2]`; every job applies the prepared artifact; each check still continues on error.
   - The `test` step runs the shard's half through the shard script (the option before the glob),
     in both shards, not `npm test`; shard 1 also runs every other check, shard 2 none.
   - Each shard's `checks.json` gains `shard` (1 or 2) and lists only the checks it runs: shard 2
     `test` alone, shard 1 all fifteen. So the step that fails on a check not green holds in both
     shards; a red test runs the outcomes script with shard 2's steps and sees it pass on green.
   - The summary's heading `### Checks on Node.js <node>, shard <shard>`; the artifact
     `verify-<node>-<shard>`, which the report's `verify-*` pattern already downloads.
   - `intake:report` reads four legs: `parseChecks` checks `shard`, a duplicate `(node, shard)` is
     refused, a missing shard is reported per shard (`Node.js <node> shard <shard>: no checks`);
     per Node version `test` shows green only when both shards' are, `missing` when one is absent,
     every other check from shard 1. Only the display changes: the verdict stays tied to
     `needs.verify.result`, which fails when any of the four jobs does.
   - Timeouts unchanged (verify 40, report 10). `src/intake-report.ts`, its tests and
     `tests/intake-workflow.test.ts` (the `test` step's command, the artifact name) change with it,
     red first.
   - The rehearsal is dispatched by hand on the task's branch (`gh workflow run intake.yml --ref
     <branch> -f rehearsal=true`) before `in-review`, its four `verify` durations in the task's
     notes; again after the merge, read at the close.

Not in this plan: the removal of checks the tests repeat (option 2, ruled out); fewer Node
versions; any change to G12 or to what a test checks; the historical records that say "both
jobs".

## Steps

1. **This plan:** independent review, the approver's ruling on the outline, `submit`
   (`draft → active`), `main` pushed with plan-067's close; `main`'s CI read.
2. **Task (A)**, task-089 (points 1 … 5 and 7): `memory add` on `main`, its `tooling-delivery` v3
   loop (body review, the approver's acceptance, design with its red steps, build test first,
   build review, dl-039's checks on the frozen commit, the branch CI with every job's duration,
   the approver's approval, `--no-ff` merge into `main`, `main`'s CI read).
3. **Close:** point 6's numbers; `intake.yml`'s rehearsal after the merge (point 7), by hand, read
   with its durations; the row to Closed; `active → done`.

## Handoff

- **claude (facilitator, developer):** the task and the close, except the approvals and the merge
  OK; it dispatches point 7's rehearsals (`gh workflow run`) and reads them. It never runs
  `memory approve` or `memory reject`: it gives the approver the command, with
  `cd` and `--reason`. No pull request. Files staged by name.
- **Reviewers (subagents):** this plan; the task's body and build; re-reviews when a fix changes a
  decision (dl-017).
- **Approver:** the outline (before `submit`); the task's gates; the merge OK; point 6 if a job
  stays over 20 minutes.
- Done when task-089 is merged into `main`, every job of `main`'s CI on the merge under 20
  minutes, and the row Closed. The run of the close's push is left to the next plan (dl-038 C3).

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). At wave close: per tech-spec, the errata and
     rulings recorded in the wave, and the element the approver names to fold them back, or the
     ruling that none is needed (dl-020).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-11: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-11-11: independent review: approve after amendments, two blocking, applied: the shard's
  option before the glob, and the jobs balanced rather than the `Test` steps (shard 1 carries the
  other checks); with the others: the prediction recorded in the design, no shared path written
  by two split files, the cache and tag runs in shard 1, dl-039 R1's reading, the workflows'
  versions, `intake.yml` out of scope, the 1288 count in point 6, the over-20 branch.
- 2026-11-11: re-review: approve, one nit, applied: a later test file can shift the shards'
  balance, which every task's job durations show (dl-039 R3).
- 2026-11-11: the approver adds `intake.yml`'s `verify` to the plan (point 7) and keeps option 2
  out; `pages.yml`, which runs no test, is no longer named.
- 2026-11-11: point 7's review: approve after amendments, one blocking, applied: each shard's
  `checks.json` lists only the checks it runs, so shard 2's fail step holds; with the others: the
  leg key `shard`, a missing shard per shard, the verdict unchanged on `needs.verify.result`, the
  step's command, heading and artifact name, a rehearsal on the branch before `in-review`.
- 2026-11-11: point 7's re-review: approve, one nit, applied: claude dispatches the rehearsals.
- 2026-11-11: the approver's OK on points 1 … 7 as written.
- 2026-11-11: `main`'s CI before this plan (dl-038 C3): plan-067's close and this plan's `submit`,
  pushed at `6e559f81`, run 43095345992, still queued with no job after more than an hour (the
  organisation's runners busy, no GitHub incident); read when it runs, at the latest at this
  plan's close.
- 2026-11-11, reading (point 5): dl-039 R1's "its two jobs' durations" is read as every job's
  durations from this plan on, the CI holding four jobs; dl-039's text unchanged, as plan-068
  rules, and `tooling-delivery` v4 and `kanban-delivery` v6 say "every job's" (task-089).
