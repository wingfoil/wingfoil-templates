---
id: task-060-check-runs-an-adoption-run-a-project-initialised-by-wingfoil-init-adopting-base-software-and-methodology-scrum-by-the-readmes-steps-bug-007-plan-052
type: task
title: "check:runs: an adoption run, a project initialised by wingfoil init adopting base, software and methodology/scrum by the READMEs' steps (bug-007, plan-052)"
status: in-progress
pack: ""            # tooling task (pack-cycle › first-release, plan-052 step 6, ruling 4)
depends_on: ["task-061", "task-062"]
tags: ["tooling","runs","adoption","W9"]
---

## Context

plan-052's step 6 (ruling 4, decision D): bug-007 was found by hand, by plan-051's `recheck`. A
project initialised by `wingfoil init --template Scrum` or `--template Kanban` (WingFoil 0.3.0 and
0.3.1) holds five workflows under `.wingfoil/workflows/custom/`, four of them named as the packs'
(`decision-log-ingest`; `sw-life-cycle`, `adr-ingest`, `bug-ingest`) plus its delivery workflow
(`scrum-delivery` or `kanban-delivery`), and four directive stubs under `directives/custom/`
(`traceability`, `doc-versioning`, `security-secrets`, `determinism`). Re-including the four
named as the packs' after the composed `.wingfoil/` is copied makes every `workflow` command fail
with `E_WORKFLOW_DUPLICATE_NAME`; the delivery workflow collides with no name, a second loop
nothing points to.

A project's own `custom/` workflows, in this task, are those the project wrote itself, not those
`wingfoil init` scaffolded (`sw-life-cycle`, `bug-ingest`, `decision-log-ingest`, `adr-ingest` and
`scrum-delivery` or `kanban-delivery`); task-061 and task-062 use the same words.

A run of `check:runs` that adopts the packs on such a project, on each release the matrix selects,
catches it again at the next intake of a WingFoil release whose `init` changes.

`check:runs`' scenario format has no such run (`src/runs.ts`: a scenario names compositions and
runs, each a `main` started and its steps; the step kinds are `start`, `end`, `next`, `finalize`,
`commit_inside`, `commit_copy`, `add`, `submit`, `approve`): this task extends it, through
`tooling-delivery` (developer, `pack: ""`, bug-001), tests first (dl-018).

## Acceptance

1. **The scenario format** gains an adoption run, beside the `main` runs: `wingfoil init` with a
   template (`Scrum`, `Kanban`) in an empty scratch git repository whose identity (the scenario's
   agent, in the repository's config, never the environment, task-045) is set before `init`,
   which commits, on each release the
   composition's matrix selects; the composition's `.wingfoil/` files copied over the project's,
   its `custom/` folders kept; the `custom/` workflows and directives the run names removed, with
   the workflows' `include` entries in `workflows.yaml`; the project's other `custom/` workflows
   re-included; a commit; then `wingfoil workflow list --format json` and
   `wingfoil workflow next --format json`, each exit 0 with no diagnostic of severity warning or
   error and no stderr line; and the run's own check that no workflow of its removal list is
   still included, since `workflow list` does not see a kept delivery workflow. The Design fixes
   the keys, which the reader validates (exit 3 on an
   unknown key or a missing one, as for the existing runs).
2. **A scenario file** `tests/fixtures/runs/adoption.yaml` on the README examples of
   `methodology/scrum` (`tests/fixtures/examples/scrum`), one adoption run per template, its
   removal list bug-007's: the workflows `decision-log-ingest`, `sw-life-cycle`, `adr-ingest`,
   `bug-ingest` and the template's delivery workflow, the four directive stubs. The list equals
   the one task-061 and task-062 write in the READMEs; this task's review checks it.
3. **Red first (dl-018 R1–R3):** the tests of the reader and of the run written before the code,
   their failing count recorded; then, on the real WingFoil, the scenario with the `custom/`
   workflows re-included (the READMEs' steps before bug-007's fix) fails on 0.3.0 and 0.3.1 with
   `E_WORKFLOW_DUPLICATE_NAME`, the command and its output recorded in the Execution Notes; with
   the removal list it passes: 2 compositions × 2 templates × 2 releases = 8 runs, 0 failed;
   `check:runs` on `main` goes from 26 runs to 34. The red variant (no workflow removed, the four
   stubs removed) is a scratch scenario file passed on the command line, not committed; the
   Design says whether the format accepts an empty removal list.
4. **CI:** the new file runs in the existing `check:runs` step of `.github/workflows/ci.yml`; the
   Design says whether a step changes, and then `tests/ci-workflow.test.ts` follows it. The
   headers of `src/runs.ts` and the scenario files name the new run.
5. **Checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays
   `software-exit` and `scrum-exit`, the golden step, `workflow list`, `check:runs`, `npm audit` in
   the root and in every matrix folder: exit 0; the branch CI `success`, recorded; after the merge,
   `main`'s CI read.
6. **Sequencing:** the dependency is on the merge only (the build and its red run may come
   first): merged after task-061 and task-062, so that its removal list and the READMEs
   agree on `main`.

## Design

- **The format.** A run is either the existing `{ main, steps }` or `{ adopt: { template, remove:
  { workflows, directives } } }`: `template` a non-empty string passed to `wingfoil init
  --template`; `workflows` and `directives` lists of ids (possibly empty, so that a red variant can
  remove none), each id a plain name with no `/`. The reader keeps its exit 3 for an unknown key,
  a missing key, an empty template or a wrong type. `runs[i]` holds exactly one of `main` and
  `adopt`.
- **The run** (`runOne`'s adoption branch, its own scratch repository as every run): `git init`,
  the scenario's agent set in the repository's config before anything (`init` commits); `wingfoil
  init --template <template>`; the composed output copied over the repository, `custom/` folders
  kept (a copy, nothing deleted); each listed workflow's `.wingfoil/workflows/custom/<id>.yaml`
  and each listed directive's `.wingfoil/directives/custom/<id>.md` removed when present (a
  template writes `scrum-delivery` or `kanban-delivery`, so a list may name both); every
  `workflows/custom/*.yaml` left re-included in `.wingfoil/workflows.yaml`'s `include`, after the
  composed entries, in byte order (README step 3: the project's own workflows); a commit; then
  `wingfoil workflow list --format json` and `wingfoil workflow next --format json`, each exit 0,
  empty stderr, and for `list` an empty `diagnostics` list; last, the run's own check: no
  `include` entry names a workflow of the removal list, and none of its files remains. The first
  failure ends the run, reported as the other runs are: `runs <file> adopt:<template>
  wingfoil@<release>: pass` or `fail at <stage>: <why>`.
- **The scenario** `tests/fixtures/runs/adoption.yaml`: `compositions:
  tests/fixtures/examples/scrum` (2), runs `adopt` with `Scrum` and with `Kanban`, the removal list
  bug-007's (five workflows, both delivery names, four stubs): 2 × 2 × 2 releases = 8 runs;
  `check:runs` 26 → 34.
- **Tests first** in `tests/runs.test.ts`, the fake WingFoil gaining `init` (writes the five
  `custom/` workflows, the four stubs and an `include` list) and a `list` that reports
  `E_WORKFLOW_DUPLICATE_NAME` when a `custom/` workflow has a composed workflow's name and is
  included: the reader's accepted and refused shapes; a passing adoption; the red variant failing
  at `list`; a diagnostic, a stderr line, a kept included workflow each failing; the identity set
  before `init`; the report line. The red runs' failing counts in the Execution Notes.
- **CI:** the existing `check:runs` step runs the new file; no step changes, so
  `tests/ci-workflow.test.ts` does not either; the step's name gains no release. Headers of
  `src/runs.ts` and `runs-cli.ts`' usage name the adoption run.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-28: independent review (with task-060, task-061 and task-062): approve after amendments
  (its own check of the removal list, the identity before `init`, the red variant, the counts).
  Applied.
- 2026-10-28: re-review: approve. Submitted.
- 2026-10-28, red first (dl-018): the tests written before the code (`6b7e4d1`), `node --test
  dist/tests/runs.test.js`: 46 tests, 7 failed (the six adoption runs and the fixture's test). The
  seven refusal tests passed already, since the reader before this task refused any `adopt` key as
  unknown; each asserts the refusal names `runs[0]`, and they hold the shapes once `adopt` is read.
- 2026-10-28: built (`df94a8a`): `src/runs.ts` (the run kinds `main` and `adopt`, the reader,
  `adopt()` and its stages `init`, `copy`, `remove`, `include`, `commit`, `list`, `next`, `check`;
  the header), `tests/fixtures/runs/adoption.yaml`. `runs.test.js` 46 of 46. On the real WingFoil:
  the red variant, a scratch scenario file outside the repository with `workflows: []` and the four
  stubs removed, `npm run check:runs -- <it>`: 8 runs, 8 failed, each at `list` with
  `E_WORKFLOW_DUPLICATE_NAME` for `adr-ingest`, `bug-ingest`, `decision-log-ingest` and
  `sw-life-cycle`, on 0.3.0 and 0.3.1; `npm run check:runs -- tests/fixtures/runs/adoption.yaml`:
  8 runs, 0 failed; `npm run check:runs`: 34 runs, 0 failed; `npm run lint` exit 0. The CI step
  and `tests/ci-workflow.test.ts` unchanged (the step runs every scenario file); `runs-cli.ts`'s
  header points to `runs.ts`, unchanged.
- 2026-10-28, correction of the red count above: of the 15 new tests, 7 failed and 8 passed before
  the code: the seven refusals (any `adopt` key was unknown) and "leaves no scratch repository
  behind", which asserted no exit code.
- 2026-10-28: independent review: approve after amendments, nothing blocking. Red first for the
  behaviour it asked for (`5cdf11a`): 48 tests, 3 failed (an `include` absent,
  an `include` not a list, WingFoil's JSON error line). Fixed (`649c346`): `include` created
  when absent or null, refused when not a list (stage `include`, and in `check`); `check` also
  refuses a listed directive that remains; a JSON stderr reported by its `error` and the count of
  its `details`; the refusal tests assert the whole location and problem; the fixture's test
  parses the file and compares each run; byte order tested with three workflows left; the scratch
  test asserts exit 0. 48 of 48; `check:runs` 34 runs, 0 failed; the red variant 8 of 8 failed at
  `list`; lint exit 0. Deviation from the Design (dl-019 not needed: no Acceptance changes):
  `runs-cli.ts`' usage is not changed, its header pointing to `runs.ts`, whose header names the
  adoption run. Re-review requested.
- 2026-10-28: re-review: approve; it reproduced the red (48, 3 failed) and the fix (48 of 48,
  `check:runs` 34 runs, 0 failed, the red variant 8 of 8 at `list`). Noted: the directive check is
  defensive, unreachable by a run (listed directives are removed after the copy); `include:` with
  no value takes the `null` branch, not tested apart from the absent key.
