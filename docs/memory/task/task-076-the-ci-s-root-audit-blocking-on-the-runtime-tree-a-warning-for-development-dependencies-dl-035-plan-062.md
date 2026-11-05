---
id: task-076-the-ci-s-root-audit-blocking-on-the-runtime-tree-a-warning-for-development-dependencies-dl-035-plan-062
type: task
title: "The CI's root audit: blocking on the runtime tree, a warning for development dependencies (dl-035, plan-062)"
status: backlog
pack: ""            # tooling task (tooling-delivery v3, dl-035)
depends_on: []
tags: ["tooling","ci","dependencies"]
---

## Context

dl-035 (approved 2026-11-02) A1 and A4, applied by plan-062 (row 2, ruling 3). The CI's step
"Audit the root lockfile" runs `npm audit` on the whole root tree and fails on any advisory: an
advisory that reaches only development dependencies (bug-009) turned every branch and `main` red
for about a day. dl-035 A1: that step runs `npm audit --omit=dev` and stays blocking; a second step
runs `npm audit` on the whole root tree and never fails at the shell level (no
`continue-on-error`, which `tests/ci-workflow.test.ts` forbids): when it finds advisories it writes
a `::warning::` annotation naming them, and exits 0; it runs after the blocking step, not under
`if: always()`; both Node.js jobs run it. "Audit every matrix release's lockfile" is unchanged and
blocking. plan-062 ruling 3: an audit that cannot produce a report (a registry or network error)
also writes a `::warning::` and exits 0 (A1 read literally). Settles the row "CI policy for
advisories in transitive dependencies" of `docs/owed-items.md` (dl-035 A4); the `minimatch`
override's two rows stay. Rule 3 of `repository-practice` (reading the warning, A2's bug) is
plan-062 row 3, not this task.

## Acceptance

1. **Red first** (dl-018): `tests/ci-workflow.test.ts` changed before `ci.yml`, the failing run
   recorded with its command and failing count (`npm run build && node --test
   dist/tests/ci-workflow.test.js`).
2. **The blocking step:** "Audit the root lockfile" runs exactly `npm audit --omit=dev`, with no
   `if`; in the test's list of commands that run on every path, `'npm audit'` becomes
   `'npm audit --omit=dev'`; the helper `stepRunning` (an exact match of a `run` line) unchanged.
3. **The warning step:** named "Audit the whole root tree, warning only (dl-035)", found by name,
   the step right after the blocking one, with no `if` and no `continue-on-error`; no step has
   `continue-on-error` (as today).
4. **Its behaviour**, asserted by running the step's `run` script with `bash -e` (GitHub's default
   shell for a `run` step) against a stub `npm` first on the `PATH` (before the inherited `PATH`),
   in a temporary directory removed after the test, offline (the `testing` directive). The stub
   records its arguments, and each case asserts they are exactly `audit --json` (no `--omit`):
   - the stub exits 1 with a report naming two advisories (a v2 report, as `npm audit --json`
     prints it on npm 10 and 11): the script exits 0 and prints exactly one `::warning` line that
     names both packages with their severities and cites dl-035;
   - the stub exits 1 with an error object (`{"error": …}`), and again with no output: in each
     case exit 0 and exactly one `::warning` line saying the audit could not run;
   - the stub exits 0 with no advisory: exit 0 and no `::warning` line.
5. **The matrix step** unchanged, and its existing assertion kept as it is.
6. **The checks** (`tooling-delivery` v3 › `review`, dl-039, plan-062 ruling 4): the build review
   and its amendments first; then, once, on the frozen commit: the branch CI `success`, both jobs,
   the run id and the jobs' durations recorded, a job over 25 minutes to the approver (dl-039 R3),
   and the new step's log read (no warning expected: `npm audit` and `npm audit --omit=dev` exit 0
   in the root on 2026-11-04); from a clean working tree on Node.js 22.21.0 after `npm ci` and
   `npm run build`, `npm run validate:publication`, the golden tree in publication mode and
   `npm run -s wingfoil -- workflow list` exit 0; `node --test dist/tests/ci-workflow.test.js`
   and `npm run lint` exit 0 locally (the full `npm test` runs in the branch CI). The privacy check
   of the branch's diff recorded.
7. **The register:** the row "CI policy for advisories in transitive dependencies" moves to Closed,
   settled by this task, in its own commit, the frozen commit or one before
   it (dl-039 R2 exempts only
   `docs/memory` and `docs/plans` from a new run).
8. **Delivery:** `--no-ff` merge into `dl/dl-035-dl-040-actions`, plan-062's branch, not `main`: a
   departure from `tooling-delivery` › `deliver`, ruled by the approver in plan-062 (ruling 3,
   task-064 under plan-054 as the precedent).

## Design

Branch `task/task-076-ci-root-audit` from `dl/dl-035-dl-040-actions` at this task's add.
Red steps: (1) the test's assertions for Acceptance 2 … 4 against the current `ci.yml` (red: the
blocking step runs `npm audit`, no warning step, a missing step failing an assertion rather than
crashing the file); (2) `ci.yml` changed (green).

The warning step's script, shell with an inline `node -e` (no new dependency, adr-003), safe under
`bash -e`: `if npm audit --json > "$RUNNER_TEMP/root-audit.json"; then exit 0; fi`, so a non-zero
exit does not abort the step; then `node -e` reads the file, the read and `JSON.parse` inside
try/catch (empty output throws), and never exits non-zero: with `vulnerabilities` entries (a v2
report also lists parents affected only through `via`, which are named too), one `::warning
title=…::` line naming each package with its severity and citing dl-035; otherwise (an error
object, no output, or an exit 1 with no entries) one `::warning` line that the audit could not
run. Output through `console.log`, no `process.exit()`; the message on one line, `%`, `\r` and
`\n` escaped as `%25`, `%0D`, `%0A`, and the title free of `,` and `:`. The script ends with
`exit 0`.

The test reads the step's `run` from the parsed `ci.yml`; creates a directory with
`mkdtempSync(join(tmpdir(), 'ci-audit-'))`, holding the stub `npm` (mode `0o755`, writing its
arguments to a file there, then printing the case's output and exiting with its code) and the
`RUNNER_TEMP` folder; runs `bash -e -c <run>` through `node:child_process` with `PATH` set to the
stub's directory followed by `process.env.PATH`; and removes the directory in `finally` with
`rmSync(…, { recursive: true, force: true })`. Commits: the red test; `ci.yml`; the register's
row; then the frozen commit's checks; the notes (`docs/memory` only) after them.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-062 (row 2, ruling 3), added on its branch after row 1 (`ded156e`),
  no other task added on any branch meanwhile (W-14); born under `tooling-delivery` v3.
- 2026-11-05: independent review of the body: approve after amendments, one blocking finding (the
  script tested with plain `bash`, while GitHub runs `bash -e`); applied with the others: the
  exit status captured under `-e` and `node` never exiting non-zero; the list's `npm audit` and
  the exact helper; the step's name and the stub's recorded arguments; the targeted test command;
  the register's commit before the frozen commit; the stub on the inherited `PATH`, its mode, the
  temporary directory's removal; the annotation's format and flushing; both no-report cases; a job
  over 25 minutes; the warning's text asserted (dl-035).
- 2026-11-05: re-review: approve; its nit applied (the register's commit is the frozen commit or
  precedes it).
