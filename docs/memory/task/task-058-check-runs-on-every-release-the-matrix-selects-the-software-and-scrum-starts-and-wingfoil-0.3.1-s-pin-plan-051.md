---
id: task-058-check-runs-on-every-release-the-matrix-selects-the-software-and-scrum-starts-and-wingfoil-0.3.1-s-pin-plan-051
type: task
title: "check:runs on every release the matrix selects, the software and scrum starts, and WingFoil 0.3.1's pin (plan-051)"
status: draft
pack: ""            # tooling task (wingfoil-release-intake › record, plan-051 ruling 1)
depends_on: []
tags: ["tooling","wingfoil","compat"]
---

## Context

plan-051's first task (ruling 1, as the approver confirmed on 2026-10-27): the intake of WingFoil
0.3.1 makes the matrix select two releases for every composition that requires `workflow-engine`,
0.3.0 (the oldest) and 0.3.1 (the newest). `npm run check:runs` (task-053) takes only the newest:
`realCompose` (`src/runs.ts`) returns one `release`, so once `compat.yaml` lists 0.3.1 the command
would stop running `base`'s workflows on 0.3.0. This task makes it run each scenario on every
release the matrix selects, and adds the starts of `sw-life-cycle` on the README examples of
`software` and `methodology/scrum`, so that W9's packs are driven on both releases before they are
published. It also commits 0.3.1's pin, as task-035 committed 0.3.0's, so that the two-release run
is proven on the real releases. `compat.yaml` is task-059's: on `main`, until task-059, the
command still selects 0.3.0 alone.

Run on 2026-10-27 (plan-051's Context): on 0.3.0 and 0.3.1, `base`'s scenario 9 runs, 0 failed,
and `sw-life-cycle`'s start on the four examples 4 runs, 0 failed.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **Every selected release.** The `Compose` result carries `releases` (every release
   `selectReleases` picks in self-test mode, in `compat.yaml` order: the oldest and the newest, one
   when they coincide) in place of `release`. Per composition: composed once; then, for each
   release in that order, the release installed (`install` called once per release per
   composition, with `--cache`) and every run of the scenario made on it. The report has one line
   per composition, release and `main`, in that order, e.g.
   `runs tests/fixtures/examples/base/core-records/example.yaml decision-log-ingest wingfoil@0.3.0: pass`
   then the same `main`'s other runs on 0.3.0, then the composition's runs on 0.3.1; the summary
   counts every run made. A composition no release can run exits 2, as today. A release whose
   install fails: one line `runs <composition> wingfoil@<version>: <message>`, its runs not made
   and not counted, the other release's runs made, exit 2.
2. **The scenarios** of `software` and `methodology/scrum`: `tests/fixtures/runs/software.yaml`
   (`compositions: tests/fixtures/examples/software`) and `tests/fixtures/runs/scrum.yaml`
   (`compositions: tests/fixtures/examples/scrum`), each with one run, `main: sw-life-cycle`,
   `steps: [start]`, the agent identity of `base.yaml`, and a header as `base.yaml`'s.
3. **0.3.1's pin**, as task-035 committed 0.3.0's: `src/matrix/wingfoil-0.3.1/package.json` with
   `name: wingfoil-matrix-0.3.1`, `private: true`, a description naming 0.3.1 and task-058, and
   `dependencies.wingfoil: "0.3.1"`; its lockfile (`npm install --package-lock-only
   --ignore-scripts` in that folder); `npm run check:pins` exit 0; `npm audit` 0 vulnerabilities
   in that folder, a result other than 0 going to the approver (dl-019); the CI's audit step and
   its cache key cover it already. No dependency of this repository is added (adr-003).
4. **Texts:** `src/runs.ts`'s header says each scenario runs on every release the matrix selects
   in self-test mode (the oldest and the newest); `tests/fixtures/runs/base.yaml`'s header says
   "on each selected release"; the CI step is named for the packs' workflows on every selected
   release (task-053, task-058), `tests/ci-workflow.test.ts` still finding it by its command.
5. **Unit tests** (`tests/runs.test.ts`, the fake composer and WingFoil): two releases, every run
   on each in the order of criterion 1 (an exact `deepEqual` of the lines); one release; the
   summary; a failure on one release only, the other's line passing; one release's install
   failing (criterion 1's line, exit 2, the other's runs made); `install` called with each
   version and the cache (the existing test widened). A test of the selection (`realCompose`, or
   a helper it calls) on a temporary tree whose own `compat.yaml` holds two `workflow-engine`
   releases: both returned, in order; never this repository's or the golden fixture's
   `compat.yaml`. A guard test that `software.yaml` and `scrum.yaml` name their `compositions`
   folder and `main: sw-life-cycle`.
6. **Red first** (dl-018 R1–R3), the red runs recorded in the Execution Notes: after a minimal
   change of the `Compose` type (so that the suite compiles), the new and changed tests red for
   behaviour (the 0.3.1 lines missing, the summary counting one release), not for compilation.
7. **The real two-release run**, which needs network access to install 0.3.1 into
   `.cache/wingfoil-matrix` from the new lockfile (as task-035's did): on a scratch copy of the
   tree whose `compat.yaml` adds 0.3.1 (`format_key: true`, `reads` at format 1,
   `capabilities: [workflow-engine]`), `npm run check:runs -- --tree <copy>`: exit 0, 2 × (9 + 4)
   = 26 runs, 0 failed; on the tree itself (0.3.0 alone): 13 runs, 0 failed. The Execution Notes
   record 0.3.1's `--version` line and both reports. The CI runs 0.3.1 only from task-059.
8. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays
   `software-exit` and `scrum-exit`, the golden step, `workflow list`, `check:runs` and `npm audit`
   in the root and every matrix folder exit 0; `compat.yaml` and `packs/` unchanged; the branch CI
   `success`, recorded; after the merge, `main`'s CI read.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-27: independent review of the body: approve after amendments. Applied: the order of the
  runs and lines, and a failed install of one release, stated exactly; the pin's manifest as
  task-035's, with dl-019 and adr-003; the network for the real run, the CI running 0.3.1 from
  task-059; a test of the selection and a guard of the new scenario files; the texts stated by
  what they say; `install` per release; the red run behavioural, not a compile error.
