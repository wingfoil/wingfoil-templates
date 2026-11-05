---
id: task-078-intake-detection-the-wingfoil-versions-on-npm-missing-from-compat.yaml-a-daily-read-only-workflow-plan-065-task-a
type: task
title: "Intake detection: the wingfoil versions on npm missing from compat.yaml, a daily read-only workflow (plan-065 task A)"
status: pending
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

1. **Red first** (dl-018): the tests of Acceptance 2 … 5 committed before the code, with a stub
   `src/intake-detect.ts` whose export throws, so that the build passes and the tests fail by
   assertion; the failing run recorded with its command and count.
2. **`npm run intake:detect`** (`src/intake-detect.ts`, `src/intake-detect-cli.ts`) reads the
   registry's answer to `npm view wingfoil versions time --json` (spawned with an argument array, no
   shell; or read from a file given with `--registry <file>`, offline) and `compat.yaml`'s releases.
   `versions` is the source (a bare string read as a one-element list); `time`'s other keys
   (`created`, `modified`, an unpublished version's) are ignored. A version with a pre-release part
   is ignored; any other entry not strict `X.Y.Z`
   (`^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$`) makes the answer refused, as does an
   answer with no `versions` (a whole-package unpublish). Versions below the oldest recorded release
   (`compat.yaml`'s first row, the floor of dl-010 and task-011: 0.2.1 is on npm and not recorded by
   choice) are out of scope and ignored; a recorded version absent from npm is ignored. Order is
   semver order.
3. **Its report**, one line per missing version in semver order, exactly: `<v> patch (against <p>)`,
   `<v> minor (against <p>)`, `<v> minor, breaking in 0.x (against <p>)` (a `0.Y` change), `<v>
   major (against <p>)` (an `X` change, `0.x` to `1.0.0` included), where `<p>` is the highest
   stable version below `<v>` among the recorded and the published ones (with 0.3.3 and 0.3.4
   missing, 0.3.4 is classed against 0.3.3, dl-042 I1); and `<v> backport (below <n>)` for a missing
   version between the oldest and the newest recorded (`<n>` the newest), never to be prepared. With
   none missing: `no missing version`.
4. **Exit codes and signal:** exit 0 with none missing; exit 1 with one or more, each line also
   written as `::error title=WingFoil release not recorded::<line>` when `--github` is given (the
   red run, plan-065 point 5; the exit code turns the run red, the annotation names why); exit 2 for
   a usage error, a refused answer (its message gives a count of bad entries, never the raw strings)
   or `npm view` exiting non-zero (registry or network), with `::error title=WingFoil release check
   failed::npm view exited <code>` under `--github`. The command reads the network only through `npm
   view`; with `--registry` it reads none.
5. **`.github/workflows/intake.yml`:** `on: schedule` (daily) and `workflow_dispatch`; `permissions:
   contents: read` at the top, none per job; one job on `ubuntu-24.04` with `timeout-minutes`;
   `concurrency: { group: intake-${{ github.ref }}, cancel-in-progress: false }` (a comment says
   GitHub keeps one running and one pending run, enough for a daily schedule); checkout with
   `persist-credentials: false`, `setup-node` on 22.21.0 with `check-latest: false`, `npm ci`, `npm
   run build`, and the `run` line exactly `npm run -s intake:detect -- --github`; every action
   pinned to a full commit SHA; no `secrets.`, `github.token` or `GITHUB_TOKEN`, no
   `pull_request_target`, no `actions/cache`. `tests/intake-workflow.test.ts` asserts each, failing
   by assertion (not at load) when the file is absent.
6. **The tests**, offline (`testing`), with fixture answers under `tests/fixtures/intake/`: no
   missing version; one patch; a minor at 1.x; a `0.x` minor; a major and `0.x` to `1.0.0`; a
   backport; two missing versions (the second classed against the first); a version below the floor
   (ignored, exit 0); 0.9.0 and 0.10.0 (semver order); a pre-release (ignored); an unpublished
   version (in `time` only, ignored); a bare-string `versions`; a malformed entry and an answer
   without `versions` (exit 2, no raw string printed); a failing `npm` (a stub on `PATH`, exit 2,
   its signal printed when it has no exit code), and a stub `npm` printing a fixture, which receives
   exactly `view wingfoil versions time --json`. Each stdout line, annotation and exit code asserted
   exactly.
7. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations,
   and dl-039's local list on Node.js 22.21.0; `npm run lint` exits 0; the script against the real
   registry, `npm run -s intake:detect`: `no missing version` and exit 0 expected while 0.3.2 is the
   newest (a newer release published meanwhile gives exit 1 and its line, the right signal, recorded
   as such). The privacy check of the branch's diff recorded.
8. **After the merge into `main`:** `intake.yml` dispatched once by hand (`gh workflow run
   intake.yml`, with the approver's OK), `success` with `no missing version` expected as in 7 (or
   `failure` with a release's `::error`, the right signal); its run id, conclusion and duration
   recorded. In the merge's follow-up commit, a row of `docs/owed-items.md` for the weekly reading
   of `intake.yml`'s runs (owner approver), noting that GitHub disables a scheduled workflow after
   60 days without repository activity (plan-065 ruling 5); `main`'s CI read on that last push.

## Design

Branch `task/task-078-intake-detect` from `main` at this task's add. Red steps: (1)
`tests/intake-detect.test.ts` (through the CLI's `--registry` fixtures and a stub `npm` on `PATH`,
plus the pure function) and `tests/intake-workflow.test.ts`, with the throwing stub of
`src/intake-detect.ts` and a two-line stub of its CLI (red by assertion); (2)
`src/intake-detect.ts`, a pure function from the registry's answer and `compat.yaml`'s versions to
the report, and its CLI (green); (3) `intake.yml` (green). `package.json` gains the script
`intake:detect`; no new dependency (`semver` is a runtime dependency already, adr-003).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-065 (task (A)), added on `main`, no other task added on any branch
  meanwhile (W-14).
- 2026-11-05: independent review of the body: approve after amendments, one blocking finding (0.2.1,
  on npm and below the floor, would have kept every run red); applied with the others: the floor,
  the predecessor, the classes and the exact lines, pre-release against malformed, the network
  failure's exit 2, the expected results of the real runs, the weekly reading's row at the merge,
  red by assertion with a throwing stub, the workflow's concurrency group and extra assertions.
- 2026-11-05: re-review: approve; its optional nits applied (the spawn's success path, the CLI's
  stub, a signal, `main`'s CI after the row's commit).
