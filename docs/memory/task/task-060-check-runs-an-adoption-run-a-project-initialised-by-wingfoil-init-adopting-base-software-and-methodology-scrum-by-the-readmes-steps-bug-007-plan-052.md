---
id: task-060-check-runs-an-adoption-run-a-project-initialised-by-wingfoil-init-adopting-base-software-and-methodology-scrum-by-the-readmes-steps-bug-007-plan-052
type: task
title: "check:runs: an adoption run, a project initialised by wingfoil init adopting base, software and methodology/scrum by the READMEs' steps (bug-007, plan-052)"
status: draft
pack: ""            # the pack element id this task works on; empty for tooling tasks
depends_on: ["task-061", "task-062"]
tags: ["tooling","runs","adoption"]
---

## Context

plan-052's step 6 (ruling 4, decision D): bug-007 was found by hand, by plan-051's `recheck`. A
project initialised by `wingfoil init --template Scrum` or `--template Kanban` (WingFoil 0.3.0 and
0.3.1) holds five workflows under `.wingfoil/workflows/custom/`, four of them named as the packs'
(`decision-log-ingest`; `sw-life-cycle`, `adr-ingest`, `bug-ingest`) plus its delivery workflow
(`scrum-delivery` or `kanban-delivery`), and four directive stubs under `directives/custom/`
(`traceability`, `doc-versioning`, `security-secrets`, `determinism`). Re-including those workflows
after the composed `.wingfoil/` is copied makes every `workflow` command fail with
`E_WORKFLOW_DUPLICATE_NAME`. A run of `check:runs` that adopts the packs on such a project, on each
release the matrix selects, catches it again at the next intake of a WingFoil release whose `init`
changes.

`check:runs`' scenario format has no such run (`src/runs.ts`: a scenario names compositions and
runs, each a `main` started and its steps; the step kinds are `start`, `end`, `next`, `finalize`,
`commit_inside`, `commit_copy`, `add`, `submit`, `approve`): this task extends it, through
`tooling-delivery` (developer, `pack: ""`, bug-001), tests first (dl-018).

## Acceptance

1. **The scenario format** gains an adoption run, beside the `main` runs: `wingfoil init` with a
   template (`Scrum`, `Kanban`) in an empty scratch git repository, on each release the
   composition's matrix selects; the composition's `.wingfoil/` files copied over the project's,
   its `custom/` folders kept; the `custom/` workflows and directives the run names removed, with
   the workflows' `include` entries in `workflows.yaml`; the project's other `custom/` workflows
   re-included; a commit; then `wingfoil workflow list --format json` and
   `wingfoil workflow next --format json`, each exit 0 with no diagnostic of severity warning or
   error and no stderr line. The Design fixes the keys, which the reader validates (exit 3 on an
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
   the removal list it passes: 2 compositions × 2 templates × 2 releases, 0 failed (counts
   re-derived in the Design if the examples differ).
4. **CI:** the new file runs in the existing `check:runs` step of `.github/workflows/ci.yml`; the
   Design says whether a step changes, and then `tests/ci-workflow.test.ts` follows it. The
   headers of `src/runs.ts` and the scenario files name the new run.
5. **Checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays
   `software-exit` and `scrum-exit`, the golden step, `workflow list`, `check:runs`, `npm audit` in
   the root and in every matrix folder: exit 0; the branch CI `success`, recorded; after the merge,
   `main`'s CI read.
6. **Sequencing:** merged after task-061 and task-062, so that its removal list and the READMEs
   agree on `main`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
