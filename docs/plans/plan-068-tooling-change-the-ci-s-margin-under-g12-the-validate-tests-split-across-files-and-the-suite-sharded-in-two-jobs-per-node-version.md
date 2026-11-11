---
id: plan-068-tooling-change-the-ci-s-margin-under-g12-the-validate-tests-split-across-files-and-the-suite-sharded-in-two-jobs-per-node-version
type: plan
title: "tooling-change: the CI's margin under G12, the validate tests split across files and the suite sharded in two jobs per Node version"
status: draft
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
2. **The suite in two shards per Node version.** `ci.yml`'s matrix gains `shard: [1, 2]`, four
   jobs; each runs `node --test --test-shard=<shard>/2` through an npm script, and `npm test`
   still runs the whole suite (dl-039's local list unchanged). Node's shards split the files by
   index, not by time: when the two shards' `Test` steps differ by more than about 3 minutes, the
   task balances them (the files' split or order), with the numbers in its notes.
3. **Each check once per Node version.** Install, build and the shard's tests in every job; every
   other step (lint, pins, schemas, the pack lint, the site, the audits, the six `validate` and
   `check:runs` steps, publication mode on a tag) in shard 1 only, so nothing is lost and nothing
   runs twice. `tests/ci-workflow.test.ts` checks it, red first.
4. **Job names** `validate (<node>, <shard>/2)`. No required check names a job (the ruleset
   `protect-main` holds `deletion` and `non_fast_forward` only), so the rename breaks nothing.
5. **Texts.** `tooling-delivery` and `kanban-delivery` record "its two jobs' durations": they
   become every job's durations (`wf(config)`, in the task); G12, dl-039 and the timeout of 30
   minutes unchanged.
6. **Done when** every job of the task's branch CI and of `main`'s CI on its merge takes under 20
   minutes; the row then moves to Closed with the numbers. If a job stays over, the approver rules
   (a third shard, or G12's bound).

Not in this plan: the removal of checks the tests repeat (option 2, ruled out); fewer Node
versions; any change to G12 or to what a test checks.

## Steps

1. **This plan:** independent review, the approver's ruling on the outline, `submit`
   (`draft → active`), `main` pushed with plan-067's close; `main`'s CI read.
2. **Task (A)**, task-089 (points 1 … 5): `memory add` on `main`, its `tooling-delivery` v3 loop
   (body review, the approver's acceptance, design with its red steps, build test first, build
   review, dl-039's checks on the frozen commit, the branch CI with every job's duration, the
   approver's approval, `--no-ff` merge into `main`, `main`'s CI read).
3. **Close:** point 6's numbers; the row to Closed; `active → done`.

## Handoff

- **claude (facilitator, developer):** the task and the close, except the approvals and the merge
  OK. It never runs `memory approve` or `memory reject`: it gives the approver the command, with
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
