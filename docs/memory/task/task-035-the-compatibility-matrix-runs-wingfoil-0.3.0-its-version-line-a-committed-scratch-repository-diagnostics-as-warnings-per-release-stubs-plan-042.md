---
id: task-035-the-compatibility-matrix-runs-wingfoil-0.3.0-its-version-line-a-committed-scratch-repository-diagnostics-as-warnings-per-release-stubs-plan-042
type: task
title: "The compatibility matrix runs WingFoil 0.3.0: its version line, a committed scratch repository, diagnostics as warnings, per-release stubs (plan-042)"
status: draft
pack: ""            # tooling task (wingfoil-release-intake › record, plan-042)
depends_on: []
tags: ["tooling","compat","matrix"]
---

## Context

The first of plan-042's two tasks (the approver's ruling K, 2026-10-20). WingFoil 0.3.0 is released
(`wingfoil/wingfoil@v0.3.0` = `cc31d7a8`, on npm), and task-036 records it in `compat.yaml`. Before
that, the compatibility matrix (`src/matrix.ts`, F3.3, `pack-compatibility`, dl-009) must be able to
run it; read at `v0.3.0`, it cannot:
- **the version line.** 0.3.0's `--version` prints `<version> (<sha>)`; `runRelease` requires the
  printed text to equal the release, so every run fails with "--version printed …";
- **`HEAD`.** 0.3.0 answers from what is committed at `HEAD`; the matrix copies the composed
  `.wingfoil/` into a scratch repository that is only `git init`ed, so `workflow list` sees no
  workflow (an empty snapshot) and the check is vacuous;
- **what a warning is.** `judge` fails a command on its exit, any stderr line, and a stdout line
  starting `Warning:`. 0.3.0 also reports problems of a workflow as `diagnostics` (`{code,
  severity: error|warning, file, path, message}`) in the result `workflow list` prints on stdout;
  an `error` diagnostic already makes the command exit 1, a `warning` one does not. The approver
  ruled (L, 2026-10-20): for 0.3.0 a warning is any diagnostic of severity warning or error, on
  stderr or in `diagnostics`;
- **the tests.** The WingFoil stub (`tests/support/stub-wingfoil.ts`) answers one version for every
  release, and `fixtureCompat()` (`tests/support/published-repo.ts`) appends the fictitious release
  9.0.0 to the real `compat.yaml`, so the fixture ranges would move to `>=0.3.0 <=9.0.0` as soon as
  task-036 lists 0.3.0.

The real `compat.yaml` is not touched here (ruling K): this task makes the matrix and its tests
ready for a second, real release, and proves a run of the real 0.3.0 on a temporary tree.

## Acceptance

1. **The version line.** A release run accepts a `--version` line that is exactly the release, or
   the release followed by one space and a parenthesised build id (`0.3.0 (cc31d7a8)`); any other
   line still fails with "--version printed …". Tested with the stub printing each form.
2. **A committed scratch repository.** Before any WingFoil command, the scratch repository holds
   one commit of the copied `.wingfoil/`, made with a fixed identity passed on the command line
   (the matrix's git environment carries none, `src/git.ts`). Tested: the stub's working directory
   has a `HEAD` commit containing `.wingfoil/` when the commands run.
3. **Diagnostics (ruling L).** `workflow list` runs with `--format json`, which WingFoil 0.2.2 and
   0.3.0 both accept; a run fails when its stdout parses as JSON holding a `diagnostics` array with
   an item of severity `warning` or `error`, each such item a reason naming its `code` and
   `message`; stderr and `Warning:` lines are judged as before. A stdout that is not JSON (0.2.2's
   output, or another command) is judged as before. Tested with stub outputs: no diagnostics, a
   warning, an error, non-JSON.
4. **0.2.2 unchanged.** Every existing matrix and validate test still passes with 0.2.2's
   behaviour: its tolerated `format` warning, its exact version line.
5. **Per-release stubs.** The tests' stub answers the version of the release it is installed for,
   so a composition run against two releases runs two stubs; `fixtureCompat()` builds its file from
   a frozen 0.2.2-only header rather than from the real `compat.yaml`, so the fixture ranges
   (`9.0.0`) do not change when the real file gains a release. The `publish`, `feedback-note`,
   `evidence`, `index` and `tag-rules` tests pass unchanged in their expectations.
6. **0.3.0's pin.** `src/matrix/wingfoil-0.3.0/package.json` pins `wingfoil` exactly to `0.3.0`,
   with its lockfile from `npm install --package-lock-only --ignore-scripts`; `npm run check:pins`
   exits 0; `npm audit` on that lockfile reports 0 vulnerabilities (any other result goes to the
   approver, dl-019). No dependency of this repository is added (adr-003).
7. **A real 0.3.0 run.** On a temporary copy of the golden tree (`tests/fixtures/compose/tree`)
   whose `compat.yaml` adds a 0.3.0 entry (format_key true, reads at 1, `capabilities:
   [workflow-engine]`), `npm run validate -- --tree <copy> --param project_name=Golden` exits 0, its
   report showing 0.3.0's runs passing with no warning; recorded in the Execution Notes with the
   report's lines. A warning 0.3.0 raises on a fixture is fixed in the fixture (and this task's
   tests); one that needs a rule changed goes to the approver (dl-019).
8. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
   `npm run index -- --check` and `npm run validate` exit 0; the CI run on the pushed branch
   concludes `success`.
9. **Docs in step.** `src/matrix.ts`'s header and `pack-compatibility`'s wording name the
   `--format json` flag and ruling L; spec-001 is not changed by this task (task-036 amends §12
   and O10).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
