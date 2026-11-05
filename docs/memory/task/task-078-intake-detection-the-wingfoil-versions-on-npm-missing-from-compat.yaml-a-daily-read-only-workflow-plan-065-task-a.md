---
id: task-078-intake-detection-the-wingfoil-versions-on-npm-missing-from-compat.yaml-a-daily-read-only-workflow-plan-065-task-a
type: task
title: "Intake detection: the wingfoil versions on npm missing from compat.yaml, a daily read-only workflow (plan-065 task A)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-065 task (A)
depends_on: []
tags: ["tooling","ci","intake"]
---

## Context

plan-065 (rulings 1, 3, 5 and 6; the request asked by the approver on 2026-11-02), its first task:
detect the `wingfoil` versions published on npm and missing from `compat.yaml`, daily and by hand,
read-only, with a signal someone sees. Merged into `main` first, so that
`.github/workflows/intake.yml` exists there for `workflow_dispatch` (plan-065 point 6). Tasks (D),
(B) and (C) follow; (C) adds the prepare and verify jobs to the same file. Today no CI reads npm for
new releases, and every intake is started by hand (plan-060, task-074).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 5 committed before the code, the failing run
   recorded with its command and count.
2. **`npm run intake:detect`** (`src/intake-detect.ts`, `src/intake-detect-cli.ts`): reads the
   registry's answer to `npm view wingfoil versions time --json` (run by the command, or read from a
   file given with `--registry <file>` for the tests, offline) and `compat.yaml`; prints one line
   per published version missing from `compat.yaml`, in ascending order, each with its class against
   its predecessor (`patch`; `minor` or `major`, a `0.x` minor counted as breaking) and the version
   it is classed against; ignores pre-releases and versions the registry's `time` lists without a
   version entry (unpublished); reports a version below the newest recorded as `backport`, never to
   be prepared; validates each version as strict `X.Y.Z`
   (`^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$`) before it reaches an output line, and
   refuses (exit 2) a registry answer it cannot parse.
3. **Its exit codes and signal:** exit 0 and `no missing version` when none is missing; exit 1 when
   one is, each missing version also written as a `::error title=WingFoil release not
   recorded::<version> (<class>)` line when `--github` is given (the workflow's red run, plan-065
   point 5); exit 2 for a usage or parse error. The command reads the network only through `npm
   view`; with `--registry` it reads none.
4. **`.github/workflows/intake.yml`:** `on: schedule` (daily) and `workflow_dispatch`; `permissions:
   contents: read`; one job on `ubuntu-24.04` with `timeout-minutes`, `concurrency` grouped by
   workflow with `cancel-in-progress: false`; checkout without persisted credentials, `setup-node`
   on 22.21.0, `npm ci`, `npm run build`, `npm run -s intake:detect -- --github`; every action
   pinned to a full commit SHA, as `ci.yml`'s; no `secrets.`, no `pull_request_target`, no
   `actions/cache`. A test, as `tests/ci-workflow.test.ts`, asserts each of these.
5. **The tests**, offline (`testing`): fixture registry answers for no missing version, one patch, a
   minor, a major, a `0.x` minor, a backport, two missing versions, a pre-release, an unpublished
   version, a malformed version string and an unparsable answer; each output and exit code asserted.
6. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   recorded, and dl-039's local list on Node.js 22.21.0; `npm run lint` exits 0; the new script's
   own run on the frozen commit against the real registry (`npm run -s intake:detect`), exit 0 with
   `no missing version` expected while 0.3.2 is the newest. The privacy check of the branch's diff
   recorded.
7. **After the merge into `main`:** `intake.yml` dispatched once by hand (`gh workflow run
   intake.yml`, with the approver's OK), its run id, conclusion and duration recorded; `main`'s CI
   read.

## Design

Branch `task/task-078-intake-detect` from `main` at this task's add. Red steps: (1)
`tests/intake-detect.test.ts` (the classes, the edge cases, the exit codes, through `--registry`
fixtures under `tests/fixtures/intake/`) and `tests/intake-workflow.test.ts` (the workflow's shape)
against no code (red); (2) `src/intake-detect.ts`, a pure function from the registry's answer and
`compat.yaml`'s versions to the report, and its CLI (green); (3) `intake.yml` (green).
`package.json` gains the script `intake:detect`; no new dependency (`semver` is already one,
adr-003).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-065 (task (A)), added on `main`, no other task added on any branch
  meanwhile (W-14).
