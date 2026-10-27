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
   when they coincide) in place of `release`; each run of each scenario is made on each release,
   installed as the matrix installs it; the report has one line per composition, `main` and
   release (`runs <composition> <main> wingfoil@<version>: …`), and the summary counts every run.
   A composition no release can run exits 2, as today.
2. **The scenarios** of `software` and `methodology/scrum`: `tests/fixtures/runs/software.yaml`
   (`compositions: tests/fixtures/examples/software`) and `tests/fixtures/runs/scrum.yaml`
   (`compositions: tests/fixtures/examples/scrum`), each with one run, `main: sw-life-cycle`,
   `steps: [start]`, and the agent identity of `base.yaml`.
3. **0.3.1's pin:** `src/matrix/wingfoil-0.3.1/package.json`, pinning `wingfoil` to exactly
   `0.3.1`, with the description of 0.3.0's, and its lockfile (`npm install --package-lock-only
   --ignore-scripts` in that folder); `npm run check:pins` exit 0; `npm audit` 0 vulnerabilities in
   that folder; the CI's audit step runs it, as it runs every `src/matrix/wingfoil-*/`.
4. **Texts:** `src/runs.ts`'s header, `tests/fixtures/runs/base.yaml`'s header and the CI step's
   name (`.github/workflows/ci.yml`) no longer say a single release or `base` alone;
   `tests/ci-workflow.test.ts` still finds the step by its command.
5. **Unit tests** (`tests/runs.test.ts`, the fake composer and WingFoil): every run on each of two
   releases, in order, each installed once per composition; one release; the report lines and the
   summary; a failure on one release only, the other's line passing; the install of one release
   failing (exit 2). No test reads this repository's `compat.yaml`.
6. **Red first** (dl-018 R1–R3), the red runs recorded in the Execution Notes: the new and changed
   unit tests red before the code.
7. **The real two-release run:** on a scratch copy of the tree whose `compat.yaml` adds 0.3.1
   (`format_key: true`, `reads` at format 1, `capabilities: [workflow-engine]`),
   `npm run check:runs -- --tree <copy>`: exit 0, 2 × (9 + 4) = 26 runs, 0 failed, recorded with
   the report; on the tree itself (0.3.0 alone): 13 runs, 0 failed.
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
