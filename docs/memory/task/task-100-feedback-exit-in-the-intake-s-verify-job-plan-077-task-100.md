---
id: task-100-feedback-exit-in-the-intake-s-verify-job-plan-077-task-100
type: task
title: "feedback-exit in the intake's verify job (plan-077 task-100)"
status: approved
pack: ""            # tooling task (tooling-delivery v4), plan-077 task-100
depends_on: []
tags: ["tooling","intake","feedback"]
---

## Context

plan-077 hosts this task (point 2 of its outline, ruled on 2026-11-18). It is a tooling task under
`tooling-delivery` v4, and it comes before `pack-release-cycle` › `prepare` of
`governance/feedback` 1.0.0.

**Why.** task-097 put the overlay `tests/fixtures/feedback-exit/` in `ci.yml`'s self-test, after
`kanban-exit` and before `check:runs`. Its Acceptance 10 left `intake.yml`'s `verify` job and
`src/intake-report.ts`'s `CHECK_IDS` without it. The owed row "`feedback-exit` in the intake's
`verify` job" (task-097 › Acceptance 10) falls due at this pack's `first-release`. Without it, a
WingFoil release can be reported verified (dl-042) without the overlay of a published pack.

**What the intake has today** (`main` at plan-077's `submit`, `fe454ddc`):
- `intake.yml`'s `verify` job runs ci.yml's self-test as steps, each with an `id` and
  `continue-on-error: true`; every check step but `test` has `if: matrix.shard == 1` (task-089). The
  overlays are `software-exit`, `scrum-exit` and `kanban-exit`, then `runs` and `publication`.
- Its step "Write each check's outcome" holds the ids again, as an inline `ids` list in a
  `node -e` script, and records each step's `outcome` into `checks.json`.
- `src/intake-report.ts`'s `CHECK_IDS` lists the same ids in the same order. `parseChecks`
  refuses a leg naming an id outside it, and `nodeLines` writes one entry per id.
- `tests/intake-workflow.test.ts` and `tests/intake-report.test.ts` derive their lists from
  `CHECK_IDS`, so adding the id to both files passes them without a new assertion.

## Acceptance

`npm run build` precedes the commands.

1. **The step.** `intake.yml`'s `verify` job has a step `id: feedback-exit`, with
   `if: matrix.shard == 1`, `continue-on-error: true` and
   `run: npm run validate -- --overlay tests/fixtures/feedback-exit`, right after `kanban-exit`
   and before `runs`. `verify`'s `timeout-minutes` stays 40 and its matrix unchanged.
2. **The ids.** The inline `ids` list of "Write each check's outcome" and `CHECK_IDS` both hold
   `feedback-exit` right after `kanban-exit`; nothing else in either changes. Shard 2 still
   records `test` only.
3. **Red first** (dl-018). Before criteria 1 and 2 are built, new assertions that name
   `feedback-exit` literally fail, and the red run's command and failing count are recorded:
   - in `tests/intake-workflow.test.ts`: the `feedback-exit` step's `run` and `if`, and its place
     after `kanban-exit` and before `runs`;
   - in `tests/intake-report.test.ts`: `CHECK_IDS` holds `feedback-exit` right after
     `kanban-exit`; a report's Node.js line names `feedback-exit success`; `parseChecks` accepts
     a shard-1 leg naming `feedback-exit`.

   A guard beside them, which passes before and after the build: `parseChecks` refuses a shard-2
   leg naming `feedback-exit`.
4. **The mirror kept.** A test in `tests/intake-workflow.test.ts` reads `ci.yml`: the list of
   `verify`'s `npm run validate -- --overlay tests/fixtures/<name>` runs equals the list of
   ci.yml's self-test steps running that command, in order (`deepEqual`), each `verify` step's
   `id` being `<name>`, and ci.yml's list holds at least four entries. It fails today on
   `feedback-exit` (part of criterion 3's red run).
5. **The rest unchanged.** The diff from `main` touches only `.github/workflows/intake.yml`,
   `src/intake-report.ts`, `tests/intake-workflow.test.ts`, `tests/intake-report.test.ts`, this
   task and plan-077. `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
   `index -- --check`, `validate`, the four overlays, the golden step and `check:runs` pass: read
   from the branch CI's jobs and dl-039's local list (criterion 7), not run a second time.
6. **The rehearsal on the branch,** before `in-review`, dispatched by claude on the frozen commit
   of criterion 7 (a later code change dispatches it again): `gh workflow run intake.yml --ref
   <branch> -f rehearsal=true`. The four `verify` jobs and `report` are `success`, and `detect`'s
   outcome is recorded. The report reads `Rehearsal of <v>: never for intake (dl-042 I1)` and
   `## WingFoil <v>: guided`, `<v>` the newest recorded release (0.3.2 today), with no reason
   naming the prepare or verify job's result (as task-089's run 43107700626), and its lines for
   both Node.js versions name `feedback-exit success`. The `verify` jobs' durations are recorded;
   a job over 25 minutes goes to the approver (dl-039 R3).
7. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded,
   and the local list on Node.js 22.21.0 from a clean tree after `npm ci` and the build.
8. **Delivery.** The branch `task/task-100-…` from `main`, in a worktree; the privacy check of
   the diff recorded (`repository-practice` rule 2); the merge `--no-ff` on the approver's OK.
9. **After the merge,** an order more precise than plan-077 step 2's wording, which names `done`
   before the rehearsal: once the merge is pushed, `main`'s CI on it read and the rehearsal
   dispatched on `main`, read as criterion 6, its run id recorded in this task's Execution Notes
   and in plan-077. Then the close commit moves the owed row to Closed with this task's id,
   citing that run; then `approved → done` (`memory submit`, its own commit). A red rehearsal on
   `main` stops the close: the task stays `approved`, the finding goes to the approver, and a fix
   goes through the reserved task-101 or bug-017 (plan-077 point 12).

## Design

Branch `task/task-100-intake-feedback-exit` from `main` at `a81a0984` (the backlog approval).

- **Red commit** (criteria 3, 4): tests only.
  - `tests/intake-workflow.test.ts`: a test "runs feedback-exit after kanban-exit and before the
    runs (task-100)", reading the `verify` steps by `id`: `feedback-exit`'s `run`, its `if`, and
    the indexes `kanban-exit` < `feedback-exit` < `runs`. A test "mirrors ci.yml's overlays
    (task-100)": a helper reads `.github/workflows/ci.yml` with `loadYamlFile`, takes every step
    of its `validate` job whose `run` matches `^npm run validate -- --overlay
    tests/fixtures/(\S+)$`, and compares, with `deepEqual`, the list of `[name, run]` pairs with
    `verify`'s steps matching the same pattern, as `[id, run]`; ci.yml's list holds at least four.
  - `tests/intake-report.test.ts`: in "the checks of a verify leg", a test that `CHECK_IDS`
    holds `feedback-exit` at the index after `kanban-exit`, that `parseChecks` accepts a shard-1
    leg naming it, and the guard that it refuses a shard-2 leg naming it; in "the checks per
    Node.js version", a literal `feedback-exit success` in a report's Node.js line.
- **Build commit** (criteria 1, 2): in `intake.yml`, the step after `kanban-exit`, written as
  the three overlays before it, and `"feedback-exit"` after `"kanban-exit"` in the inline `ids`
  list, rewrapped under 100 characters; in `src/intake-report.ts`, `'feedback-exit'` after
  `'kanban-exit'` in `CHECK_IDS`. Nothing else changes.
- **Checks:** the build review and its re-review if a rule changes, the freeze, the branch CI and
  the rehearsal on the frozen commit (criteria 6, 7), dl-039's local list.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-19: body written from plan-077 point 2. Independent review (dl-017): approve after
  amendments; no blocker, four should-fix and five nits, all applied: the rehearsal's jobs and
  report text made checkable, the rehearsal on the frozen commit, the order after the merge, a
  strict mirror test, `parseChecks` in the red run, the touched files closed.
- 2026-11-19: re-review: approve after amendments; no blocker, three should-fix and three nits,
  all applied: the shard-2 refusal a guard, not red; the close and `done` as two commits, with
  `main`'s CI read; a red rehearsal on `main` stopping the close instead of returning the task;
  a Delivery criterion with the privacy check.
- 2026-11-19, the red run (dl-018): `npm run build && node --test
  dist/tests/intake-workflow.test.js dist/tests/intake-report.test.js`: 51 tests, 47 pass, 4 fail,
  each on the missing `feedback-exit`: the step's `run` `undefined`; the mirror's `deepEqual`
  missing `['feedback-exit', 'npm run validate -- --overlay tests/fixtures/feedback-exit']`;
  `CHECK_IDS`'s index `-1` for 13; the Node.js line without `feedback-exit success`. The shard-2
  guard passes, as criterion 3 says.
- 2026-11-19, the build: `npm run build && node --test dist/tests/intake-workflow.test.js
  dist/tests/intake-report.test.js dist/tests/ci-workflow.test.js`: 71 tests, 71 pass; `lint`
  clean. Build review (dl-017): approve, no blocker and no should-fix; the mirror
  mutation-tested (a wrong id, an extra `verify` overlay, two swapped, a tag-only one in ci.yml:
  each fails it). Two nits: a `verify` overlay step without an `id` passed the mirror, applied
  (the name is the step's `id` alone); a tag-only overlay in ci.yml would be asked of `verify`,
  kept as the stricter reading, no such step existing. The fix is a test's helper only, so no
  re-review.
- 2026-11-19, frozen at `e0301d43`. The branch CI, run 44485573460, `success`:
  `validate (22.12.0, 1)` 11 min 28 s, `(22.12.0, 2)` 3 min 52 s, `(22.21.0, 1)` 11 min 22 s,
  `(22.21.0, 2)` 3 min 58 s; none over dl-039 R3's 25 minutes.
- 2026-11-19, the rehearsal of `intake.yml` on the branch, run 44485593008 (`gh workflow run
  intake.yml --ref task/task-100-intake-feedback-exit -f rehearsal=true`), on `e0301d43`:
  `detect` `success` 24 s, `prepare` 29 s, `verify (22.12.0, 1)` 14 min 25 s, `(22.21.0, 1)`
  13 min 51 s, `(22.12.0, 2)` 6 min 24 s, `(22.21.0, 2)` 3 min 39 s, `report` 19 s, all
  `success`. The report's line `rehearsal of 0.3.2 guided: 7 reasons`. Its text, rebuilt by
  `intake:report` from the run's artifacts (the job summary is not served by the API), reads
  `Rehearsal of 0.3.2: never for intake (dl-042 I1)` and `## WingFoil 0.3.2: guided`; both
  Node.js lines name `feedback-exit success`; the seven reasons are the CHANGELOG's, none naming
  the prepare or verify job's result (criterion 6).
- 2026-11-19, dl-039's local list on Node.js 22.21.0, a clean clone at `e0301d43` after `npm ci`
  and the build: `validate:publication` 28 runs, 0 failed, `tolerance applied: none`; the golden
  tree in publication mode 26 runs, 0 failed, `tolerance applied: none`; `workflow list` exit 0;
  `directives list` exit 0, `warnings` empty; the tree clean. The first golden run used
  `validate` (self-test mode) by mistake and was rerun with `validate:publication`.
- 2026-11-19, criterion 5: `git diff --stat main..e0301d43` touches `.github/workflows/intake.yml`,
  `src/intake-report.ts`, `tests/intake-workflow.test.ts`, `tests/intake-report.test.ts` and this
  task. The privacy check of the diff: clean (criterion 8).
- 2026-11-19, merged `--no-ff` into `main` at `80358fbc` on the approver's OK and pushed.
  `main`'s CI, run 44488635424, `success`: `validate (22.12.0, 1)` 18 min 5 s, `(22.12.0, 2)`
  4 min 1 s, `(22.21.0, 1)` 11 min 19 s, `(22.21.0, 2)` 4 min 5 s. The rehearsal of `intake.yml`
  on `main`, run 44488679681, on `80358fbc`: `detect` 21 s, `prepare` 31 s, `verify (22.12.0, 1)`
  14 min 51 s, `(22.21.0, 1)` 11 min 47 s, `(22.12.0, 2)` 4 min 53 s, `(22.21.0, 2)` 5 min 31 s,
  `report` 26 s, all `success`; both shard-1 legs record `feedback-exit` `success`; the report's
  line `rehearsal of 0.3.2 guided: 7 reasons`, as on the branch (criterion 9). The owed row
  "`feedback-exit` in the intake's `verify` job" moves to Closed in this commit, citing that run.
