---
id: task-100-feedback-exit-in-the-intake-s-verify-job-plan-077-task-100
type: task
title: "feedback-exit in the intake's verify job (plan-077 task-100)"
status: backlog
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

<!-- Filled at the start of the work. -->

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
